SimpleSpreadsheet = function(file) {
  if (file) {
    this._workbook = XLSX.read(file, { type: 'binary' });
  } else {
    this._workbook = {
      Sheets: {},
      Props: {},
      SSF: {},
      SheetNames: []
    };
  }
}

SimpleSpreadsheet.prototype.worksheetToArray = function(identifier) {
  var sheet = undefined;
  if (typeof identifier === 'string') {
    sheet = this._workbook.Sheets[identifier];
  }
  else if (typeof identifier === 'number') {
    sheet = this._workbook.Sheets[this._workbook.SheetNames[identifier]];
  }

  if (!sheet) {
    return undefined;
  }

  // Source modified from the sheet_to_csv helper function in SheetJS library:
  // https://github.com/SheetJS/js-xls/blob/59a32fa3e7612b4e71469c8169cf2e9c65be3e6f/dist/xls.js#L7307
  var out = [];
  var txt = "";
  var qreg = /"/g;
  var o = {};
  if(sheet == null || sheet["!ref"] == null) return "";
  var r = safe_decode_range(sheet["!ref"]);
  var FS = ","
  var fs = ",";
  var RS = "\n"
  var rs = "\n";

  var row = "", rr = "", cols = [];
  var i = 0, cc = 0, val;
  var R = 0, C = 0;
  for(C = r.s.c; C <= r.e.c; ++C) cols[C] = XLSX.utils.encode_col(C);
  for(R = r.s.r; R <= r.e.r; ++R) {
      row = [];
      rr = XLSX.utils.encode_row(R);
      for(C = r.s.c; C <= r.e.c; ++C) {
        val = sheet[cols[C] + rr];
        txt = val !== undefined ? ''+ XLSX.utils.format_cell(val) : "";
        for(i = 0, cc = 0; i !== txt.length; ++i) if((cc = txt.charCodeAt(i)) === fs || cc === rs || cc === 34) {
          txt = "\"" + txt.replace(qreg, '""') + "\""; 
          break; 
        }
        row.push(txt);
      }
      out.push(row);
  }
  return out;
}

SimpleSpreadsheet.prototype.worksheetToObjects = function(identifier) {
  if (typeof identifier === 'string') {
    var worksheet = this._workbook.Sheets[identifier];
    return XLSX.utils.sheet_to_row_object_array(worksheet);
  }
  else if (typeof identifier === 'number') {
    var worksheet = this._workbook.Sheets[this._workbook.SheetNames[identifier]];
    return XLSX.utils.sheet_to_row_object_array(worksheet);
  } else {
    return undefined;
  }
}

SimpleSpreadsheet.prototype.addWorksheetFromObjects = function(name, data) {
  if (!name || !Array.isArray(data)) {
    console.error('Invalid parameters passed to SimpleSpreadsheet.addWorksheetFromObjects');
    return;
  }

  var dataAsArray = [];
  if (data[0]) {
    var attributes = Object.keys(data[0]);
    dataAsArray.push(attributes);

    for (var i = 0; i < data.length; i++) {
      var row = [];
      var nextObject = data[i];
      for (var j = 0; j < attributes.length; j++) {
        row.push(nextObject[attributes[j]]);
      }
      dataAsArray.push(row);
    }
  }
  
  this.addWorksheetFromArray(name, dataAsArray);
}

SimpleSpreadsheet.prototype.addWorksheetFromArray = function(name, data) {
  if (!name || !Array.isArray(data)) {
    console.error('Invalid parameters passed to SimpleSpreadsheet.addWorksheetFromArray');
    return;
  }

  var worksheet = {}
  var range = {s: {c:0, r:0}, e: {c:0, r:0 }};

  for(var R = 0; R != data.length; ++R) {
    if(range.e.r < R) range.e.r = R;
    for(var C = 0; C != data[R].length; ++C) {
      if(range.e.c < C) range.e.c = C;

      var cell = { v: data[R][C] };
      if(cell.v == null) continue;

      var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

      if(typeof cell.v === 'number') cell.t = 'n';
      else if(typeof cell.v === 'boolean') cell.t = 'b';
      else cell.t = 's';

      worksheet[cell_ref] = cell;
    }
  }
  worksheet['!ref'] = XLSX.utils.encode_range(range);

  this._workbook.SheetNames.push(name);
  this._workbook.Sheets[name] = worksheet;
}

SimpleSpreadsheet.prototype.removeWorksheet = function(name) {
  if (!name || typeof name !== 'string') {
    console.error('Invalid parameters passed to SimpleSpreadsheet.removeWorksheet');
    return;
  }

  delete this._workbook.Sheets[name];
  var index = this._workbook.SheetNames.indexOf(name);
  if (index !== -1) {
      this._workbook.SheetNames.splice(index, 1);
  }
}

SimpleSpreadsheet.prototype.save = function(name) {
  if (!name || typeof name !== 'string') {
    console.error('Invalid name passed to SimpleSpreadsheet.save, defaulting to simple-spreadsheet.xlsx');
    name = 'simple-spreadsheet';
  }
  fileName = name + ".xlsx";

  var wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };
  var wbout = XLSX.write(this._workbook, wopts);

  function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  saveAs(new Blob([s2ab(wbout)], { type: "" }), fileName);
}


// Helper from SheetJS source at:
// https://github.com/SheetJS/js-xls/blob/59a32fa3e7612b4e71469c8169cf2e9c65be3e6f/dist/xls.js#L7198
function safe_decode_range(range) {
  var o = {s:{c:0,r:0},e:{c:0,r:0}};
  var idx = 0, i = 0, cc = 0;
  var len = range.length;
  for(idx = 0; i < len; ++i) {
    if((cc=range.charCodeAt(i)-64) < 1 || cc > 26) break;
    idx = 26*idx + cc;
  }
  o.s.c = --idx;

  for(idx = 0; i < len; ++i) {
    if((cc=range.charCodeAt(i)-48) < 0 || cc > 9) break;
    idx = 10*idx + cc;
  }
  o.s.r = --idx;

  if(i === len || range.charCodeAt(++i) === 58) { o.e.c=o.s.c; o.e.r=o.s.r; return o; }

  for(idx = 0; i != len; ++i) {
    if((cc=range.charCodeAt(i)-64) < 1 || cc > 26) break;
    idx = 26*idx + cc;
  }
  o.e.c = --idx;

  for(idx = 0; i != len; ++i) {
    if((cc=range.charCodeAt(i)-48) < 0 || cc > 9) break;
    idx = 10*idx + cc;
  }
  o.e.r = --idx;
  return o;
}
