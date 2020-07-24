# grunt-flexible-sitemap-builder

> Grunt plugin to build XML sitemap files

## Getting Started

This plugin requires Grunt `~0.4.5` and Node `~>0.12.0`.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-flexible-sitemap-builder --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks("grunt-flexible-sitemap-builder");
```

## The "flexible_sitemap_builder" task

### Overview

The `flexible_sitemap_builder` task generates a sitemap file, as described at [sitemaps.org](http://www.sitemaps.org/protocol.html#index).

A number of other Grunt sitemap generators exist, but most are limited to creating sitemaps in which the update frequency and priority is the same for every page. This to some extent defeats the purpose of sitemaps. Generally, authors want to be able to give hints to webcrawlers to ensure that the most important pages are promptly indexed when they change.

In order to generate a sitemap with different priorities and update frequencies for each page, this Grunt tool requires you to add a &lt;meta&gt; element to the head of your page. Each page that you want to include in the sitemap should contain an element that looks like:

    <meta name="x-sitemap-settings" content="monthly,0.7"/>

The `flexible_sitemap_builder` task reads this element and uses it to generate an output sitemap. The value of the `content` attribute of the element should be a comma-separated string, of the form 'frequency,priority'. The example above would generate a sitemap entry that looks something like:

    <url>
    	<loc>http://www.example.com/</loc>
    	<lastmod>2015-04-02</lastmod>
    	<changefreq>monthly</changefreq>
    	<priority>0.7</priority>
    </url>

Purists may feel that using a &lt;meta&gt; element that will only ever be meaningful to a single Grunt plugin is an inelegant hack (which it is). That information doesn't really have any place in the page that will be served to the user, and results in serving a small number of surplus bytes with every request. If this bothers you, you may prefer another approach. However, from the point of view of the page author, it's a simpler and more maintainable solution than, say, generating sitemaps by hand or maintaining a separate database of pages with their respective priorities and update frequencies. Note also that the options allow you to specify a default value, so that you can use the &lt;meta&gt; element just as an override for pages that really need it.

In your project's Gruntfile, add a section named `flexible_sitemap_builder` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  flexible_sitemap_builder: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.baseurl

Type: `String`
Default value: `http://example.com/`

URL used as a prefix for all URLs included in the sitemap. This is a required option.

#### options.compress

Type: `Boolean`
Default value: `true`

Determines whether the sitemap index file should be compressed using `gzip` or not.

### options.default_settings

Type: `String`
Default value: ''

A default 'changefreq,priority' setting to be used on pages that don't have an `x-sitemap-settings` &lt;meta&gt; element. If this option is not provided, pages that don't have the &lt;meta&gt; element won't be included in sitemaps. If it is, they will be included, with `changefreq` and `priority` values based on the default. If you want to include a default value to use but still exclude certain pages from the sitemap, use file selectors to control which pages are included. An example value might be `'monthly,0.3'`.

### options.default_settings

Type: `List`
Default value: `[ 'index.html' ]`

Specifies files that should be treated as indexes. For index files, the filename is not included in the URL added to the sitemap. For example, if you had a file at the path `foo/index.html`, the URL would be `http://example.com/foo/`, rather than `http://example.com/foo/index.html`.

### Usage Examples

#### Default Options

In this example, the default options simply give a list of HTML files to be included in the sitemap. The sitemap will be written out to the file `default_options.xml` in the `build` directory, and then compressed (because compression is the default option), creating a file `default_options.xml.gz`.

```js
grunt.initConfig({
  flexible_sitemap_builder: {
    default_options: {
      options: {},
      files: {
        "build/default_options.xml": [
          "source/test-document-1.html",
          "source/test-document-2.html",
          "source/test-document-3.html",
        ],
      },
    },
  },
});
```

#### Custom Options

In this example, every HTML or PHP file in the `source/subdir` directory will be added to a sitemap called `subdir_sitemap.xml`. The sitemap will not be compressed after creation, and it will use default settings of `monthly` and `0.7` for the change frequency and priority respectively. The sitemap will be constructed using `http://mydomain.org` as the base URL, and any `index.html` or `index.php` files will be treated as indexes (meaning that their URLs will be abbreviated before being added to the sitemap).

Note that you will almost always want to use a file selector that includes an explicit `cwd`, as in this example. This is needed to ensure that you get the correct URLs in your sitemap. If you don't, the URLs may contain elements of the local paths from your build environment, i.e. you might get `http://yourdomain.com/source/photos/kitten.html` where what you really wanted was `http://yourdomain.com/photos/kitten.html`.

```js
grunt.initConfig({
  flexible_sitemap_builder: {
    custom_options3: {
      options: {
        baseurl: "http://mydomain.org/",
        compress: false,
        default_settings: "monthly,0.7",
        indexes: ["index.html", "index.php"],
      },
      files: [
        {
          expand: false,
          cwd: "source/subdir",
          src: ["**/*.html", "**/*.php"],
          dest: "build/subdir_sitemap.xml",
        },
      ],
    },
  },
});
```

### Other

#### Excluding documents from the sitemap

There are two ways to ensure that a document is not included in the sitemap.

The first is to simply not add an `x-sitemap-settings` meta element to the document header. Normally, this will result in the document not being indexed. However, if you have specified a default settings string in your Gruntfile, then that default will be used, and the document **will** be indexed.

To prevent this, you can use the second method, which is to set the priority to 0.0, i.e.

    <meta name="x-sitemap-settings" content="monthly,0.0"/>

Documents whose priority is 0.0 will not appear in the sitemap. This is also a good way of temporarily removing a document from the sitemap: you can just set priority to 0.0, then change it back at some later date.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

_(Nothing yet)_
