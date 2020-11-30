#!/usr/bin/env node
"use strict";

var fs = require('fs');

var _require = require('path'),
    normalize = _require.normalize,
    join = _require.join;

var envify = require('envify/custom');

var UglifyJS = require('uglify-js');

var browserify = require('browserify');

var babelify = require('babelify');

var tfilter = require('tfilter');

function debug() {
  if (process.env.DEBUG) {
    var _console;

    (_console = console).error.apply(_console, arguments);
  }
}

var root = normalize(join(__dirname, '..'));

function fromRoot(subPath) {
  return normalize(join(root, subPath));
}

var licence = '/*\n' + 'PJW v' + process.env.npm_package_version + '\n' + 'https://github.com/hellokellyworld/purejswatermark\n' + fs.readFileSync(fromRoot('../../LICENSE')) + '*/'; // Browserify and Babelize.

function minify(code) {
  console.error('Compressing...');
  return UglifyJS.minify(code, {
    warnings: false
  }).code;
}

function bundle(files, config, callback) {
  if (typeof files === 'string') files = [files];
  files = files.map(function (f) {
    return f[0] === '/' ? f : fromRoot(f); // ensure path.
  });
  console.error('Browserify ' + files.join(', ') + '...');
  config = Object.assign({
    standalone: 'PJW',
    ignoreMissing: true,
    fullPaths: false,
    debug: "production" === 'development' || "production" === 'test',
    paths: [root],
    basedir: root
  }, config);
  debug('browserify config:', config);
  var bundler = browserify(files, config).exclude(fromRoot('browser/lib/PJW.js'));
  config.exclude = config.exclude || [];

  for (var f, i = 0; f = config.exclude[i]; i++) {
    bundler.exclude(fromRoot(f));
  }

  bundler.transform(babelify).transform(tfilter(babelify, {
    include: '**/node_modules/file-type/*.js'
  }), {
    presets: ['@babel/env'],
    global: true
  }).transform(envify({
    ENVIRONMENT: 'BROWSER',
    DIRNAME: 'browser/lib/'
  }), {
    global: true
  }).bundle(function (err, baseCode) {
    if (err) return callback(err);
    callback(null, "if ((typeof(window)=='undefined' || !window) " + "&& (typeof(self)!='undefined')) var window = self;\n" + baseCode);
  });
}

if (!module.parent) {
  var config = process.argv[3];
  var cmd = process.argv[2] || 'prepublish';

  switch (cmd) {
    case 'test':
      {
        var baseFiles;

        if (config[0] === '{') {
          config = JSON.parse(config);
          baseFiles = process.argv.slice(4);
        } else {
          config = {};
          baseFiles = process.argv.slice(3);
        }

        if (baseFiles.length === 0) throw new Error('No file given.');
        bundle(baseFiles, config, function (err, code) {
          if (err) throw err;
          process.stdout.write(code);
          console.error('Done.');
        });
        break;
      }

    case 'prepublish':
      if (config) config = JSON.parse(config);else config = {};
      bundle('src/index.js', config, function (err, code) {
        if (err) throw err;
        fs.writeFile(fromRoot('browser/lib/PJW.js'), licence + '\n' + code, function (err) {
          if (err) throw err;
          console.error('browserifyed PJW.js done.');
        });
        fs.writeFile(fromRoot('browser/lib/PJW.min.js'), licence + '\n' + minify(code), function (err) {
          if (err) throw err;
          console.error('browserifyed PJW.min.js done.');
        });
      });
      break;

    case 'help':
      {
        var toolName = process.argv[1].replace(root, './').replace(/\/+/g, '/');
        console.warn(['Build PJW or its modules for the browser environment.', '', 'Usage:', "  $ ".concat(toolName, " <command> [parameters]"), '', 'Prepublish Command', '==================', '', 'Builds PJW and updates "browser/lib/PJW.js".', 'Usage:', "  $ ".concat(toolName, " prepublish [JSON browserify configuration]"), 'Example:', "  $ ".concat(toolName, " prepublish '{\"basedir\":\"/other/path\"}'"), '', 'Test Command', '============', '', 'Builds a list of modules and output to STDOUT.', 'Usage:', "  $ ".concat(toolName, " test [JSON browserify configuration] [file1 [file2 [...]]]"), 'Example:', "  $ ".concat(toolName, " test '{\"exclude\":[\"index.js\"]}' test/jgd.test.js"), '', 'Set DEBUG env var to know the resulting configuration.'].join('\n'));
        break;
      }

    default:
      throw new Error("Unknown command given. Run \"$ ".concat(process.argv[1], " help\" for more information"));
  }
}

module.exports = {
  bundle: bundle
};
//# sourceMappingURL=browser-build.js.map