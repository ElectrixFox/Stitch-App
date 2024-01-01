
function GetCellText(row, column) { return document.getElementById("table").rows[row].cells[column].innerHTML; }
function GetCellText(row, column, table) { return table.rows[row].cells[column].innerHTML; }
function SetCellText(row, column, content) { document.getElementById("table").rows[row].cells[column].innerHTML = content; }
function SetCellText(row, column, table, content) { table.rows[row].cells[column].innerHTML = content; }

function InsertTableRow(table, index, length = 0)
{
var cells = [];
var nrow = table.insertRow(index);

if (length === 0)
    length = table.rows[0].cells.length;

for (let index = 0; index < length; index++) 
    {
    cells[index] = nrow.insertCell(index);
    cells[index].contentEditable = true;
    }
}

function WriteKey(key, data) { localStorage.setItem(key, data); }
function ReadKeyItem(key) { return localStorage.getItem(key); }

// checks if a key exists
function IsKey(key) { if (localStorage.getItem(key) == null) return 0; else return 1; }

function Clear() { localStorage.clear(); }

function CreateTable(tableid, cells, nrows = 0, ncols = 0)
{
if (nrows == 0)
    {
    nrows = cells.length;
    }
if (ncols == 0)
    {
    ncols = cells[0].length;
    }

WriteKey(tableid.concat("#ROWS"), nrows);
WriteKey(tableid.concat("#COLS"), ncols);
    
for (let x = 0; x < nrows; x++)
    {
    for (let y = 0; y < ncols; y++)
        {
        // getting the ID of the cell
        celid = tableid.concat(x.toString(), y.toString());
        WriteKey(celid, cells[x][y]);
        }
    }
}

function LoadTable(tableid)
{
var nrows = ReadKeyItem(tableid.concat("#ROWS"));
var ncols = ReadKeyItem(tableid.concat("#COLS"));

var cells = new Array(nrows + 1);

for (let x = 0; x < nrows; x++)
    {
    cells[x] = new Array(ncols + 1);
    
    for (let y = 0; y < ncols; y++)
        {
        // getting the ID of the cell
        let celid = tableid.concat(x.toString(), y.toString());
        cells[x][y] = ReadKeyItem(celid);
        }
    }

return cells;
}

function NormaliseTable(table)
{
var cells = new Array();

var nrow = table.rows.length;
var ncol = table.rows[0].cells.length;

for (let i = 0; i < nrow; i++)
    {
    // creates new array for each row
    cells[i] = new Array(ncol + 1);

    for (let j = 0; j < ncol; j++)
        {
        cells[i][j] = GetCellText(i, j, table);
        }
    }

return cells;
}

function LoadTableFromFile(tableid)
{
var ncol = ReadKeyItem(tableid.concat("#COLS"));
var nrow = ReadKeyItem(tableid.concat("#ROWS"));

var cells = new Array();
var celid = "";

for (let i = 0; i < nrow; i++)
    {
    // creates new array for each row
    cells[i] = new Array(ncol);

    for (let j = 0; j < ncol; j++)
        {
        // getting the ID of the cell
        celid = tableid.concat(i.toString(), j.toString());
        cells[i][j] = ReadKeyItem(celid);
        }
    }

return cells;
}

function WriteTableToFile(tableid, nrows, ncols, cells)
{
WriteKey(tableid.concat("#COLS"), ncols);
WriteKey(tableid.concat("#ROWS"), nrows);

for (let i = 0; i < nrows; i++)
    {
    for (let j = 0; j < ncols; j++)
        {
        // getting the ID of the cell
        celid = tableid.concat(i.toString(), j.toString());
        WriteKey(celid, cells[i][j]);
        }
    }
}

function LoadRowsSpecial(tableid, topleft)
{
var table = document.getElementById("table");
var ncol = ReadKeyItem(tableid.concat("#COLS"));
var nrow = ReadKeyItem(tableid.concat("#ROWS"));

console.log(nrow, ncol);
console.log(table.rows.length);

var cells = new Array();

for (let i = 0; i < nrow; i++)
    {
    InsertTableRow(table, topleft[1], ncol);
    }

cells = LoadTableFromFile(tableid);

for (let i = 0; i < nrow; i++)
    {
    for (let j = 0; j < ncol; j++)
        {
        SetCellText(i + topleft[1], j + topleft[0], table, cells[i][j]);
        }
    }
}

function LoadRows(tableid)
{
var table = document.getElementById("table");
var ncol = ReadKeyItem(tableid.concat("#COLS"));
var nrow = ReadKeyItem(tableid.concat("#ROWS"));

console.log(nrow, ncol);
console.log(table.rows.length);

var cells = new Array();

for (let i = 0, x = !(table.rows.length < 2); i < nrow; i++)
    {
    InsertTableRow(table, x, ncol);
    }

cells = LoadTableFromFile(tableid);

for (let i = 0; i < nrow; i++)
    {
    for (let j = 0; j < ncol; j++)
        {
        SetCellText(i + 1, j, table, cells[i][j]);
        }
    }
}

function SaveRows(tableid)
{
var table = document.getElementById("table");

var nrow = table.rows.length - 1;
var ncol = table.rows[0].cells.length;

var cells = NormaliseTable(table);
WriteTableToFile(tableid, nrow - 1, ncol, cells);
}

function AddRow()
{
var cells = [];
var table = document.getElementById("table");
var nrow = table.insertRow(table.rows.length - 1);
var numcol = table.rows[0].cells.length;

for (let index = 0; index < numcol; index++) {
    cells[index] = nrow.insertCell(index);
    cells[index].contentEditable = true;
    }

//saveRows();
}

function FindProjectsInMonth(intable, month)
{
var wiplocs = new Array();
var top = 0;

for (let i = 0; i < intable.length; i++)
    {
    let mon = intable[i][1].slice(3, 5);

    if (parseInt(mon, 10) == month)
        {
        //console.log(wiptable[i][0]);
        wiplocs[top++] = i;
        }
    }

return wiplocs;
}

function GetDateDay(indate) { return parseInt(indate.slice(0, 2)); }

function GetWIPStartDay(wiptable, wiploc)
{
let day = wiptable[wiploc][1].slice(0, 2);

return parseInt(day, 10);
}

function GetWipStartDate(wiptable, wiploc) { return wiptable[wiploc][1]; }

function GetWipEndDate(wiptable, wiploc) { return wiptable[wiploc][2]; }

function CalcNumericalDate(indate)
{
// 0123456789
// dd/mm/yyyy
let day = parseInt(indate.slice(0, 2));
let mon = parseInt(indate.slice(3, 5));
let yrs = parseInt(indate.slice(6, 10));

return (day + mon);
}

function ClearWipRecord()
{
var yr = GetActiveYear();

var ncol = ReadKeyItem('WipRecord'.concat(yr, "#COLS"));
var nrow = ReadKeyItem('WipRecord'.concat(yr, "#ROWS"));

var year = parsGetActiveYear();

console.log(ncol, nrow);

// loading in the tables
var wiprecord = new Array(nrow + 1);

for (let i = 0; i < nrow; i++)
    {
    wiprecord[i] = new Array(ncol + 1);

    for (let j = 0; j < ncol; j++)
        {
        wiprecord[i][j] = "*";
        }
    }

CreateTable('WipRecord'.concat(yr), wiprecord);
}

function Setup()
{
var cells = [ [ "Gavin", 1, 2, 3, 4 ], ["Barry", 4, 3, 2, 1] ];

console.log("Outputting Created Table");

for (let i = 0; i < 2; i++)
    {
    console.log(cells[i]);
    }


console.log("Creating Table");
CreateTable('TestTable', cells);

console.log("Loading Table");
var ncells = LoadTable('TestTable');

console.log("Outputting Loaded Table");

for (let i = 0; i < ncells.length; i++)
    {
    console.log(ncells[i]);
    }
}

function CreateHTMLTable(celldata, nrows = 0, ncols = 0)
{
if (nrows == 0)
    {
    nrows = celldata.length;
    }
if (ncols == 0)
    {
    ncols = celldata[0].length;
    }

// create the table
const table = document.createElement("table");

for (let i = 0; i < nrows; i++)
    {
    var row = document.createElement("tr");
    for (let j = 0; j < ncols; j++) 
        {
        let cell = row.insertCell(j);
        cell.textContent = celldata[i][j];
        cell.contentEditable = true;
        }

    table.appendChild(row);
    }

table.setAttribute('class', "tracker");
table.setAttribute("id", "table");
document.body.appendChild(table);
}

function GetQueryParameter(name) 
{
const urlParams = new URLSearchParams(window.location.search);
return urlParams.get(name);
}

// if extras then returns month start index, current month and year
function GetActiveMonth(extras = 0)
{
var monindex = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
var daysinmo = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
var curmon = 0;
var monstindx = 0;

var year = GetQueryParameter('year');

var month = GetQueryParameter('month');

// find which month it is
if ((year % 4) == 0)
    {
    daysinmo[1] = 29;
    }

// getting the current month
for (var i = 0; i < 12; i++)
    {
    if (month === monindex[i])
        {
        curmon = i;
        break;
        }
    monstindx += daysinmo[i];
    }

if (extras == 1)
    {
    return [ curmon, year, monstindx ];
    }

return curmon;
}

function GetActiveYear() { return GetQueryParameter('year'); }

function InitialiseWipsViewer()
{
var wiptable = LoadTable('Wips');

wiptable.unshift([ "Name", "Start Date", "Finish Date", "Designer", "Fabric", "Floss", "Notes" ]);

CreateHTMLTable(wiptable);

var table = document.getElementById("table");
table.setAttribute("class", "wips");
table.setAttribute("id", "table");

for (let i = 0; i < table.rows[0].cells.length; i++)
    {
    table.rows[0].cells[i].contentEditable = false;
    }
}

function InitialiseMonthView()
{
var daysinmo = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

console.log("InitialiseMonthView");

var mondetails = GetActiveMonth(1);
var curmon = mondetails[0];
var year = mondetails[1];
var monstindx = mondetails[2];

// loading in the tables
var wiptable = LoadTable('Wips');
var wiprecord = LoadTable('WipRecord'.concat(year));

// find all of the projects for that month
var projlocs = FindProjectsInMonth(wiptable, curmon + 1);
var endtindx = monstindx + daysinmo[curmon];

// find all of the start dates
for (let i = 0; i < projlocs.length; i++)
    {
    var stdt = GetWipStartDate(wiptable, projlocs[i]);
    var numdate = CalcNumericalDate(stdt);

    if ((monstindx < numdate) && (numdate <= endtindx))
        {
        wiprecord[i][GetDateDay(stdt) - 1] = "N";
        }

    var endt = GetWipEndDate(wiptable, projlocs[i]);
    numdate = CalcNumericalDate(endt);

    if ((monstindx < numdate) && (numdate <= endtindx))
        {
        wiprecord[i][GetDateDay(endt) - 1] = "F";
        }
    }

/* for (let i = 0; i < projlocs.length; i++)
    {
    for (let j = monstindx; j < endtindx; j++)
        {
        console.log(wiprecord[i][j]);
        }
    } */

var itab = wiprecord;

for (let i = 0; i < itab.length; i++)
    {
    itab[i] = itab[i].slice(monstindx, endtindx);
    }

var drow = [ "Project Name" ];
// adding the days row
for (let i = 0; i < daysinmo[curmon]; i++)
    {
    drow[i + 1] = (i + 1).toString();
    }

itab.unshift(drow);

for (let i = 0; i < projlocs.length; i++)
    {
    let projnam = wiptable[projlocs[i]][0];
    itab[i + 1].unshift(projnam);
    }

CreateHTMLTable(itab);

var table = document.getElementById("table");
table.setAttribute('class', "tracker");
table.setAttribute("id", "table");

for (let i = 0; i < table.rows[0].cells.length; i++)
    {
    table.rows[0].cells[i].contentEditable = false;
    }

for (let i = 0; i < table.rows.length; i++)
    {
    table.rows[i].cells[0].contentEditable = false;
    }
}

function SaveWipRecordTable(cells, topleft)
{
var daysinmo = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

var mondetails = GetActiveMonth(1);
var curmon = mondetails[0];
var year = mondetails[1];
var monstindx = mondetails[2];

// loading in the tables
var wiptable = LoadTable('Wips');
var wiprecord = LoadTable('WipRecord'.concat(year));

// find all of the projects for that month
var projlocs = FindProjectsInMonth(wiptable, i + 1);
var endtindx = monstindx + daysinmo[curmon];

for (let i = 0; i < projlocs.length; i++)
    {
    for (let j = monstindx, k = 0; j < endtindx; j++, k++)
        {
        wiprecord[i][j] = cells[i + topleft[1]][k + topleft[0]];
        }
    }

CreateTable(tableid, wiprecord);
}

function SaveWipsTable(cells, topleft)
{
var table = document.getElementById("table");
var wiptable = LoadTable('Wips');

var nrow = table.rows.length - 1;
var ncol = table.rows[0].cells.length;

var cells = NormaliseTable(table);

for (let i = 0; i < nrow; i++)
    {
    for (let j = 0; j < ncol; j++)
        {
        wiptable[i][j] = cells[i + topleft[1]][j + topleft[0]];
        }
    }

CreateTable('Wips', wiptable);
}

function SaveHTMLTable(tableid, topleft)
{
var table = document.getElementById("table");

var nrow = table.rows.length - 1;
var ncol = table.rows[0].cells.length;

var cells = NormaliseTable(table);

console.log("SaveHTMLTable");

switch (tableid) 
    {
    case 'WipRecord':
        {
        SaveWipRecordTable(cells, topleft);
        break;
        }
    case 'Wips':
        {
        SaveWipsTable(cells, topleft);
        break;
        }
    default:
        {
        break;
        }
    }
}

function ToggleYearDropDown() 
{
document.getElementById("yeardropdwn").classList.toggle("show");
}
  

window.onclick = function(event) 
    {
    if (!event.target.matches('.yrdropbtn')) 
        {
        var dropdowns = document.getElementsByClassName("yrdropdown-content");
        for (var i = 0; i < dropdowns.length; i++)
            {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) 
                {
                openDropdown.classList.remove('show');
                }
            }
        }
    }