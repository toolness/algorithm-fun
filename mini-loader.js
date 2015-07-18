// This is a tiny loader for ES6 modules with Babel in the browser.
// It's only intended for quick prototypes and such, to avoid having to
// set up some sort of build system or muck around with RequireJS
// configuration.
//
// It requires using Babel in the browser, as documented in
// https://babeljs.io/docs/setup/#babel_in_browser.
//
// ## Example Usage
// 
// /index.html:
//
// <!DOCTYPE html>
// <meta charset="utf-8">
// <script src="node_modules/babel-core/browser.js"></script>
// <script src="mini-loader.js"
//         data-root="/src/" data-main="main.js"></script>
//
// /src/main.js:
//
// import boop from "./boop.js";
// console.log(boop());
//
// /src/boop.js:
//
// export default function() {
//   return "boop!";
// };
//
// ## Example Web Worker Usage
//
// /worker.js:
//
// importScripts('node_modules/babel-core/browser.js', 'mini-loader.js');
// MiniLoader.run({root: '/src/', main: 'main.js'});
//
// ## Limitations
//
// * This is only usable with ES6 modules; the loader doesn't know how
//   to infer the require() dependencies for a module, so it can't
//   preload them for synchronous evaluation.
// * `index.js` modules must be loaded explicitly by name.
// * No support for "shim"-style modules.
// * Likely not to work on older browsers.

var MiniLoader = (function(babel) {
  var myScript = typeof(document) === 'undefined'
                 ? null
                 : document.scripts[document.scripts.length - 1];
  var mainFile;
  var rootDir;
  var exports = {
    run: run
  };
  var modules = exports._modules = {
    // XHRs to load modules.
    requests: {},
    // Parsed Babel sources for modules.
    sources: {},
    // Keeps track of whether we're currently evaluating specific modules.
    evaluating: {},
    // Exports from modules.
    objects: {}
  };
  // Number of modules left to load before we can start the main script.
  var leftToLoad = 0;

  // This is taken from babel's browser.js, which in turn was taken from
  // Node's path module.
  var path = exports.path = (function() {
    var exports = {};

    // Split a filename into [root, dir, basename, ext], unix version
    // 'root' is just a slash, or nothing.
    var splitPathRe =
        /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    var splitPath = function(filename) {
      return splitPathRe.exec(filename).slice(1);
    };

    function normalizeArray(parts, allowAboveRoot) {
      // if the path tries to go above the root, `up` ends up > 0
      var up = 0;
      for (var i = parts.length - 1; i >= 0; i--) {
        var last = parts[i];
        if (last === '.') {
          parts.splice(i, 1);
        } else if (last === '..') {
          parts.splice(i, 1);
          up++;
        } else if (up) {
          parts.splice(i, 1);
          up--;
        }
      }

      // if the path is allowed to go above the root, restore leading ..s
      if (allowAboveRoot) {
        for (; up--; up) {
          parts.unshift('..');
        }
      }

      return parts;
    }

    exports.dirname = function(path) {
      var result = splitPath(path),
          root = result[0],
          dir = result[1];

      if (!root && !dir) {
        // No dirname whatsoever
        return '.';
      }

      if (dir) {
        // It has a dirname, strip trailing slash
        dir = dir.substr(0, dir.length - 1);
      }

      return root + dir;
    };

    exports.resolve = function() {
      var resolvedPath = '',
          resolvedAbsolute = false;

      for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        var path = (i >= 0) ? arguments[i] : rootDir;

        // Skip empty and invalid entries
        if (typeof path !== 'string') {
          throw new TypeError('Arguments to path.resolve must be strings');
        } else if (!path) {
          continue;
        }

        resolvedPath = path + '/' + resolvedPath;
        resolvedAbsolute = path.charAt(0) === '/';
      }

      // At this point the path should be resolved to a full absolute path, but
      // handle relative paths to be safe (might happen when process.cwd() fails)

      // Normalize the path
      resolvedPath = normalizeArray(resolvedPath.split('/').filter(function(p) {
        return !!p;
      }), !resolvedAbsolute).join('/');

      return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
    };

    return exports;
  })();

  function getMyScriptAttr(name, defaultValue) {
    return myScript.getAttribute(name) || defaultValue;
  }

  function evalModuleSource(filename) {
    if (!modules.sources[filename])
      throw new Error("Source for " + filename + " not loaded.");
    var require = function(name) {
      return getModuleObject(name);
    }
    var __dirname = path.dirname(filename);
    var exports = {};
    var module = {exports: exports};
    if (modules.evaluating[filename])
      throw new Error("Circular dependency in " + filename + ".");
    try {
      modules.evaluating[filename] = true;
      eval(modules.sources[filename].code);
    } finally {
      modules.evaluating[filename] = false;
    }
    return exports;
  }

  function getModuleObject(filename) {
    if (!modules.objects[filename]) {
      modules.objects[filename] = evalModuleSource(filename);
    }
    return modules.objects[filename];
  }

  function startRequest(filename) {
    var req = new XMLHttpRequest();

    leftToLoad++;
    req.onload = function() {
      var src;

      if (req.status !== 200) {
        console.log("Failed to load " + filename + ".");
        return;
      }

      try {
        src = babel.transform(req.responseText, {
          filename: filename,
          sourceMaps: "inline",
          resolveModuleSource: function(source) {
            if (!/\.([A-Za-z0-9]+)$/.test(source)) {
              source = source + '.js';
            }
            if (/^\./.test(source)) {
              source = path.resolve(path.dirname(filename), source);
            } else {
              source = path.resolve(rootDir, source);
            }
            if (!modules.requests[source]) {
              startRequest(source);
            }
            return source;
          }
        });
      } catch (e) {
        console.log(e);
        return;
      }

      leftToLoad--;

      modules.sources[filename] = src;

      if (leftToLoad === 0) {
        getModuleObject(mainFile);
      }
    };
    req.open("GET", filename);
    req.send(null);

    modules.requests[filename] = req;

    return req;
  }

  function run(options) {
    var windowPath = typeof(window) === 'undefined'
                     ? ''
                     : window.location.pathname;
    rootDir = path.resolve(windowPath, options.root || '.');
    mainFile = path.resolve(options.main || './main.js');
    startRequest(mainFile);
  }

  if (myScript) {
    run({
      root: getMyScriptAttr('data-root'),
      main: getMyScriptAttr('data-main')
    });
  }

  return exports;
})(babel);
