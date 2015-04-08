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
grunt.loadNpmTasks('grunt-flexible-sitemap-builder');
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

Purists may feel that using a &lt;meta&gt; element that will only ever be meaningful to a single Grunt plugin is an inelegant hack. That information doesn't really have any place in the page that will be served to the user, and results in serving a small number of surplus bytes with every request. If this bothers you, you may prefer another approach. However, from the point of view of the page author, it's a simpler and more maintainable solution than, say, generating sitemaps by hand or maintaining a separate database of pages with their respective priorities and update frequencies.

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

#### options.separator
Type: `String`
Default value: `',  '`

A string value that is used to do something with whatever.

#### options.punctuation
Type: `String`
Default value: `'.'`

A string value that is used to do something else with whatever else.

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  flexible_sitemap_builder: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  flexible_sitemap_builder: {
    options: {
      separator: ': ',
      punctuation: ' !!!',
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
