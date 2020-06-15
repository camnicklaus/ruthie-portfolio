'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const autoprefixer = require('autoprefixer')
const isProduction = EmberApp.env() === 'production';
const purgecssOptions = {
  content: [
    // add extra paths here for components/controllers which include tailwind classes
    './app/index.html',
    './app/templates/**/*.hbs',
    './app/components/**/*.hbs'
  ],
  defaultExtractor: content => {
    return content.match(/[A-Za-z0-9-_:/]+/g) || []
  },
  // Leave css definitions starting with an underscore untouched.
  // This prevents css definitions generated by ember-css-modules
  // from being purged.
  whitelistPatterns: [/^_/]
};

let cssModulesPlugins = [
  require('postcss-import')({ path: ['node_modules'] }),
  require('tailwindcss')('./app/tailwind/config.js'),
  autoprefixer('last 2 versions')
];

if (isProduction) {
  const purgecss = require('@fullhuman/postcss-purgecss')(purgecssOptions);
  cssModulesPlugins.push(purgecss);
}

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    cssModules: {
      plugins: cssModulesPlugins
    },

    sourcemaps: {
      enabled: true,
      extensions: ['js']
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.
  app.import('vendor/purgecss-ignore.css', { prepend: true });
  app.import("ember-modal-dialog/ember-modal-structure.css");
  app.import("ember-modal-dialog/ember-modal-appearance.css");

  return app.toTree();
};
