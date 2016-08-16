Package.describe({
  name: 'blizzle:simple-spreadsheet',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Simple library to read and wirte spreadsheets',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.0.1');
  // api.use('ecmascript');

  api.use('huaming:js-xlsx');
  api.use('pfafman:filesaver');
  api.mainModule('simple-spreadsheet.js', 'client');
  api.addFiles('simple-spreadsheet.js', 'client');
  api.export('SimpleSpreadsheet', 'client');
});

Package.onTest(function(api) {
  // api.use('ecmascript');
  api.use('tinytest');
  api.use('huaming:js-xlsx@0.8.0');
  api.use('blizzle:simple-spreadsheet');
  // api.mainModule('simple-spreadsheet.js', 'client');
});
