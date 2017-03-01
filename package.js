Package.describe({
  name: 'blizzle:simple-spreadsheet',
  version: '0.0.1',
  summary: 'Simple library to read and wirte spreadsheets',
  git: 'https://github.com/benliu01/simple-spreadsheet',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.0.1');
  api.use('huaming:js-xlsx');
  api.use('pfafman:filesaver');
  api.addFiles('simple-spreadsheet.js', 'client');
  api.export('SimpleSpreadsheet', 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('huaming:js-xlsx@0.8.0');
  api.use('blizzle:simple-spreadsheet');
  // api.mainModule('simple-spreadsheet.js', 'client');
});
