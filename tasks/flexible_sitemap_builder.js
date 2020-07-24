/*
 * grunt-flexible-sitemap-builder
 * https://github.com/angus/grunt-flexible-sitemap-builder
 *
 * Copyright (c) 2015 Angus McIntyre
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function (grunt) {
  var path = require("path");
  var fs = require("fs");
  var zlib = require("zlib");
  var htmlparser = require("htmlparser2");

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask(
    "flexible_sitemap_builder",
    "A sitemap builder plugin for Grunt",
    function () {
      // Merge task-specific and/or target-specific options with these defaults.
      var options = this.options({
        baseurl: "http://example.com/",
        compress: true,
        indexes: "index.html",
      });

      var parserStore = [];
      var parser = buildParser(parserStore);
      var xml = getHeader();

      // We need to take into account the 'cwd' attribute of the files object,
      // as users will typically want to change the working directory when
      // using this task.

      var cwd_dir = this.files[0].cwd;
      if (cwd_dir === undefined) {
        cwd_dir = "";
      }

      // Iterate over all specified file groups.
      this.files.forEach(function (f) {
        // Concat specified files.
        var entry = f.src
          .filter(function (filepath) {
            // Warn on and remove invalid source files (if nonull was set).
            if (!grunt.file.exists(path.join(cwd_dir, filepath))) {
              grunt.log.warn('Source file "' + filepath + '" not found.');
              return false;
            } else {
              return true;
            }
          })
          .map(function (filepath) {
            // Read file source.
            return makeEntry(filepath, cwd_dir, options, parser, parserStore);
          })
          .join("");

        xml += entry;
        xml += getFooter();

        // Compress if required

        if (options.compress) {
          var compressed = zlib.gzipSync(xml);
          grunt.file.write(f.dest + ".gz", compressed);
          grunt.log.writeln('Compressed file "' + f.dest + '.gz" created.');
        }

        // Otherwise just write out a standard XML file.
        else {
          grunt.file.write(f.dest, xml);
          grunt.log.writeln('File "' + f.dest + '" created.');
        }
      });
    }
  );

  var getHeader = function () {
    return "<?xml version='1.0' encoding='UTF-8'?>\n<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>";
  };

  var getFooter = function () {
    return "\n</urlset>";
  };

  var buildParser = function (store) {
    var parser = new htmlparser.Parser({
      onopentag: function (name, attribs) {
        if (name === "meta" && attribs.name === "x-sitemap-settings") {
          store["sitemap_settings"] = attribs.content;
        }
      },
    });
    return parser;
  };

  var makeEntry = function (filepath, cwd_dir, options, parser, store) {
    var absfilepath = path.join(cwd_dir, filepath);
    var stat = fs.lstatSync(absfilepath);
    var timestamp = stat.mtime;
    var url = build_url(filepath, options);
    var setting_string = read_setting_string(
      absfilepath,
      options,
      parser,
      store
    );
    if (setting_string === "" || setting_string.endsWith("0.0")) {
      return "";
    } else {
      var pieces = setting_string.split(",");
      var changefreq = pieces[0];
      var priority = pieces[1];
      return (
        "\n\t<url>\n\t\t<loc>" +
        url +
        "</loc>\n\t\t<changefreq>" +
        changefreq +
        "</changefreq>\n\t\t<priority>" +
        priority +
        "</priority>\n\t\t<lastmod>" +
        timestamp.toISOString() +
        "</lastmod>\n\t</url>"
      );
    }
  };

  var build_url = function (filepath, options) {
    // If the filename is one of the names given in indexes, e.g. 'index.html', then
    // strip off the filename before building the URL.

    var filename = path.basename(filepath);
    if (options.indexes.indexOf(filename) >= 0) {
      filepath = path.dirname(filepath);

      // Hack the modified filepath slightly to cope with the root index and ensure
      // that subindexes get a trailing slash.

      if ("." === filepath) {
        filepath = "";
      } else {
        filepath = filepath + "/";
      }
    }

    // Construct the URL based on the base URL provided in options.

    return options.baseurl + filepath;
  };

  var read_setting_string = function (filepath, options, parser, store) {
    // Parse the HTML file, looking for an 'x-sitemap-settings' meta element.

    var html = fs.readFileSync(filepath, "utf8");
    delete store["sitemap_settings"];
    parser.write(html);
    parser.end();

    // If the file doesn't contain the element, then return a default or nothing.

    if (store["sitemap_settings"] === undefined) {
      // Return the default value specified in the options.

      if (options.default_settings) {
        return options.default_settings;
      }

      // No default value; don't add this file to the map.
      else {
        return "";
      }
    }

    // Return the value found in the file.

    return store["sitemap_settings"];
  };
};
