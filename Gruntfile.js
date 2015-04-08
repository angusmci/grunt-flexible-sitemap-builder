/*
 * grunt-flexible-sitemap-builder
 * https://github.com/angus/grunt-flexible-sitemap-builder
 *
 * Copyright (c) 2015 Angus McIntyre
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    flexible_sitemap_builder: {
      default_options: {
        options: {
        },
        files: {
          'tmp/default_options.xml': ['test/fixtures/test-document-1.html', 'test/fixtures/test-document-2.html', 'test/fixtures/test-document-3.html']
        }
      },
      custom_options1: {
        options: {
          baseurl: 'http://mydomain.com/',
          compress: false
        },
        files: {
          'tmp/custom_options1.xml': ['test/fixtures/*.html']
        }
      },
      custom_options2: {
        options: {
          baseurl: 'http://otherdomain.com/',
          compress: false,
          default_settings: "monthly,0.7"
        },
        files: {
          'tmp/custom_options2.xml': ['test/fixtures/*.html']
        }
      },
      custom_options3: {
        options: {
          baseurl: 'http://anotherdomain.net/',
          compress: false,
          default_settings: "monthly,0.7"
        },
		files: [{
			expand: false,
			cwd: 'test/fixtures/subdir',
			src: ['**/*.html', '**/*.php'],
			dest: 'tmp/custom_options3.xml'
		}]
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'flexible_sitemap_builder', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
