'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.flexible_sitemap_builder = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/default_options.xml.gz');
    var expected = grunt.file.read('test/expected/default_options.xml.gz');
    test.equal(actual, expected, 'Default file should be compressed.');

    test.done();
  },
  custom_options: function(test) {
    test.expect(3);

    var actual1 = grunt.file.read('tmp/custom_options1.xml');
    var expected1 = grunt.file.read('test/expected/custom_options1.xml');
    test.equal(actual1, expected1, 'should describe what the custom option(s) behavior is.');

    var actual2 = grunt.file.read('tmp/custom_options2.xml');
    var expected2 = grunt.file.read('test/expected/custom_options2.xml');
    test.equal(actual2, expected2, 'should describe what the custom option(s) behavior is.');
    
    var actual3 = grunt.file.read('tmp/custom_options3.xml');
    var expected3 = grunt.file.read('test/expected/custom_options3.xml');
    test.equal(actual3, expected3, 'should describe what the custom option(s) behavior is.');

    test.done();
  },
};
