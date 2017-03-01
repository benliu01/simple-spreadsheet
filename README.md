# SimpleSpreadsheet for Meteor
A simple API around the SheetJS library to parse and write Excel spreadsheets from 2D arrays and lists of objects.  No need to deal with the nitty-gritty interactions with SheetJS.  Meant to handle pure data spreadsheets, Excel expressions aren't supported at this time.

## Features
- Read an Excel spreadsheet into a two-dimensional array.
- Write a two-dimensional array into an Excel spreadsheet.
- Read an Excel spreadsheet into a list of JS objects.
- Write a list of JS objects into an Excel spreadsheet.

## Installation
```
meteor add blizzle:simple-spreadsheet
```

## Sample Usage
#### Load File
```
var simpleSpreadsheet = undefined;
var reader = new FileReader();
reader.onload = function(e) {
  var file = e.target.result;
  simpleSpreadsheet = new SimpleSpreadsheet(file);
}
reader.readAsBinaryString(document.getElementById("file-input").files[0]);
```
#### Create empty SimpleSpreadsheet and add sheets
```
# Create an empty spreadsheet
var simpleSpreadsheet = new SimpleSpreadsheet();

# Add a sheet from a list of objects
simpleSpreadsheet.addWorksheetFromObjects('TSM', [{
  Name: 'Bjergsen',
  Age: '21',
  Position: 'Mid Laner'
}, {
  Name: 'Hauntzer',
  Age: '21',
  Position: 'Top Laner'
}]);

# Add a sheet from a 2-dimensional array
simpleSpreadsheet.addWorksheetFromArray('CLG', [[
  'Name',
  'Age',
  'Position'
], [
  'Aphromoo',
  '24',
  'Support'
], [
  'Darshan',
  '22',
  'Top Laner'
]]);

# Download file as lcs-teams.xlsx
simpleSpreadsheet.save('lcs-teams');
```

## API
```
var simpleSpreadsheet = new SimpleSpreadsheet(file)
```
Constructor for a SimpleSpreadsheet object.

__Params:__
* **file (optional):**  Binary data from loaded xls or xlsx file (see example usage above). If not provided, creates an empty spreadsheet.

```
var worksheetArray = simpleSpreadsheet.worksheetToArray(identifier)
```
**Returns:** A JS two-dimensional array representing the worksheet specified by the identifier.  This method will return undefined if no matching worksheet is found.


__Params:__
* **identifier:** Specifies worksheet to convert to array.  Can be either a Number or String type.  If 'identifier' is a number, then SimpleSpreadsheet will parse the worksheet at that index (0-indexed).  If 'identifier' is a string, then SimpleSpreadsheet will parse the worksheet with that name.

```
var worksheetArray = simpleSpreadsheet.worksheetToObjects(identifier)
```
**Returns:** Returns a list of objects representing the worksheet specified by the identifier.


__Params:__
* **identifier:** Specifies worksheet to convert to array.  Can be either a Number or String type.  If 'identifier' is a number, then SimpleSpreadsheet will parse the worksheet at that index (0-indexed).  If 'identifier' is a string, then SimpleSpreadsheet will parse the worksheet with that name.


```
simpleSpreadsheet.addWorksheetFromObjects(name, data)
```
Adds a worksheet to the simpleSpreadsheet object representing the list of objects passed in.  This is the reverse operation of the simpleSpreadsheet.worksheetToObjects(identifier) function.


__Params:__
* **name:** Name of the worksheet.
* **data:** List of objects to be written to the spreadsheet.  This function takes the attributes of the first object in the array and uses those as the first row.  Any additional attributes in following objects are not picked up.  (Maybe this will be added in the future.)


```
simpleSpreadsheet.addWorksheetFromArray(name, data)
```
Adds a worksheet to the simpleSpreadsheet object representing the 2-dimensional array passed in.  This is the reverse operation of the simpleSpreadsheet.worksheetToArray(identifier) function.


__Params:__
* **name:** Name of the worksheet.
* **data:** 2-dimensional array to be written to the spreadsheet.  2-dimensional array behaves just like a grid in a spreadsheet.


```
simpleSpreadsheet.removeWorksheet(name)
```
Removes the specified sheet from the spreadsheet.


__Params:__
* **name:** Name of the worksheet to remove.



```
simpleSpreadsheet.save(name)
```
Downloads the spreadsheet with the given name. The .xlsx is automatically appended.


__Params:__
* **name:** Name of the spreadsheet file that is downloaded.


## Contact
If you encounter any bugs or have any suggestions please file an issue in the simple-spreadsheet Github project.

## TODO:
* Support csv and txt files
* Unit tests
