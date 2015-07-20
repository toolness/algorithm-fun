import "../src/util.test.js";
import "../src/ts/algorithms/closest-pair.test.js";

if (window.mochaPhantomJS) {
  mochaPhantomJS.run();
} else {
  mocha.run();
}
