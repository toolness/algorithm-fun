import "../src/util.test.js";
import "../src/binary-search/index.test.js";
import "../src/ts/algorithms/closest-pair.test.js";
import "../src/insertion-sort/index.test.js";
import "../src/merge-sort/index.test.js";
import "../src/bfs/index.test.js";
import "../src/dfs/index.test.js";

if (window.mochaPhantomJS) {
  mochaPhantomJS.run();
} else {
  mocha.run();
}
