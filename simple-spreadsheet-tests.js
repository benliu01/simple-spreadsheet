// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by simple-spreadsheet.js.
import { name as packageName } from "meteor/blizzle:simple-spreadsheet";

// Write your tests here!
// Here is an example.
Tinytest.add('simple-spreadsheet - example', function (test) {
  test.equal(packageName, "simple-spreadsheet");
});
