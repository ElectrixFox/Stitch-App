
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

function WriteJSONKey(key, data) { localStorage.setItem(key, data); }
function ReadJSONKeyItem(key) { return localStorage.getItem(key); }

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

function NormaliseTable(table, nrows = 0, ncols = 0)
{
var cells = new Array(nrows);


console.log(nrows, ncols);

if(nrows == 0)
    {
    nrows = table.rows.length;
    }
if(ncols == 0)
    {
    ncols = table.rows[0].cells.length;
    }

console.log(nrows, ncols);

for (let i = 0; i < nrows; i++)
    {
    // creates new array for each row
    cells[i] = new Array(ncols + 1);

    console.log(table.rows[i]);

    for (let j = 0; j < ncols; j++)
        {
        console.log(i, j);
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

function WriteTableToJSONFile(tableid, nrows, ncols, cells)
{
WriteJSONKey(tableid.concat("#COLS"), ncols);
WriteJSONKey(tableid.concat("#ROWS"), nrows);

for (let i = 0; i < nrows; i++)
    {
    for (let j = 0; j < ncols; j++)
        {
        // getting the ID of the cell
        celid = tableid.concat(i.toString(), j.toString());
        WriteJSONKey(celid, cells[i][j]);
        }
    }
}

function LoadRowsSpecial(tableid, topleft)
{
var table = document.getElementById("table");
console.log(tableid);
cells = LoadTable(tableid);
var ncol = cells[0].length - 1;
var nrow = cells.length - 1;

console.log(ncol, nrow);

var cells = new Array();

for (let i = 0; i < nrow; i++)
    {
    InsertTableRow(table, topleft[1], ncol);
    }

for (let i = 0; i < nrow; i++)
    {
    for (let j = 0; j < ncol; j++)
        {
        SetCellText(i + topleft[1], j + topleft[0], table, cells[i][j]);
        }
    }
}

function LoadRowsSpecialYr(tableid, topleft) { LoadRowsSpecial(tableid.concat(GetActiveYear()), topleft); }

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
}

function FindProjectsInMonth(intable, month)
{
var wiplocs = new Array();
var top = 0;

for (let i = 0; i < intable.length; i++)
    {
    let stmon = parseInt(intable[i][1].slice(3, 5), 10);
    let enmon;

    if(intable[i][2] == "")
        enmon = month
    else 
        enmon = parseInt(intable[i][2].slice(3, 5), 10);

    if ((stmon <= month) && (enmon >= month))
        {
        //console.log(intable[i][0]);
        wiplocs[top++] = i;
        }
    }

return wiplocs;
}

function GetDateDay(indate) { return parseInt(indate.slice(0, 2), 10); }

function GetWIPStartDay(wiptable, wiploc)
{
let day = wiptable[wiploc][1].slice(0, 2);

return parseInt(day, 10);
}

function GetWipStartDate(wiptable, wiploc) { return wiptable[wiploc][1]; }

function GetWipEndDate(wiptable, wiploc) { return wiptable[wiploc][2]; }

function CalcDaysToDate(indate)
{
var daysinmo = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

let day = parseInt(indate.slice(0, 2));
let mon = parseInt(indate.slice(3, 5));
let yrs = parseInt(indate.slice(6, 10));

var tot = day;

if(yrs % 4 == 0)
    {
    daysinmo[1] = 29;
    }

for (let i = 0; i < mon - 1; i++)
    {
    tot += daysinmo[i];
    }

return tot;
}

function CalcNumericalDate(indate)
{
// 0123456789
// dd/mm/yyyy
let day = parseInt(indate.slice(0, 2));
let mon = parseInt(indate.slice(3, 5));
let yrs = parseInt(indate.slice(6, 10));

return (day + 100 * mon);
}

function ClearWipRecord()
{
var yr = GetActiveYear();

var ncol = 365 + ((yr % 4 == 0) ? 1 : 0);
var nrow = ReadKeyItem('Wips'.concat(yr, "#ROWS"));

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
CreateTable("Wips2023", [['nil']]);
CreateTable('WipRecord2023', ["*"]);
CreateTable("Wips2024", [['nil']]);
CreateTable('WipRecord2024', ["*"]);
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
SetCurrentYear();

var yr = GetActiveYear();
console.log(yr);
var wiptable = LoadTable('Wips'.concat(yr));
var nrws = 1

console.log(wiptable);
if(wiptable[0] != "nil")
    nrws = wiptable.length + 1;

console.log(wiptable.length);
console.log(wiptable);

wiptable.unshift([ "Name", "Start Date", "Finish Date", "Designer", "Fabric", "Floss", "Notes" ]);


CreateHTMLTable(wiptable, nrws, 7);

var table = document.getElementById("table");
table.setAttribute("class", "wips");
table.setAttribute("id", "table");

for (let i = 0; i < table.rows[0].cells.length; i++)
    {
    table.rows[0].cells[i].contentEditable = false;
    }

var row = document.createElement("tr");
var ted = document.createElement("td");

var nrowbtndv = document.createElement("div");
nrowbtndv.className = "add-button";

var addbtn = document.createElement("button");
addbtn.textContent = "New WIP";
addbtn.onclick = AddRow;

nrowbtndv.appendChild(addbtn);
ted.appendChild(nrowbtndv);
ted.setAttribute("colspan", table.rows[0].cells.length);
row.appendChild(ted);
table.appendChild(row);
}

function InitialiseMonthView()
{
var daysinmo = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
const mnams = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

SetCurrentYear();
console.log("InitialiseMonthView");

var mondetails = GetActiveMonth(1);
var curmon = mondetails[0];
var year = mondetails[1];
var monstindx = mondetails[2];

if (year % 4 == 0)
    {
    daysinmo[1] = 29;
    }

document.getElementById("Header").textContent = mnams[curmon];

// loading in the tables
var wiptable = LoadTable('Wips'.concat(year));
var wiprecord = LoadTable('WipRecord'.concat(year));

for(;wiprecord.length < wiptable.length;)
    {
    wiprecord[wiprecord.length] = new Array(365 + ((year % 4 == 0) ? 1 : 0));

    for (let j = 0; j < wiprecord[wiprecord.length - 1].length; j++)
        {
        wiprecord[wiprecord.length - 1][j] = "*";
        }
    }

console.table(wiptable);
console.table(wiprecord);

console.log(wiptable.length);
console.log(wiprecord.length);

if(wiptable.length == 0)
    {
    return;
    }

// find all of the projects for that month
var projlocs = FindProjectsInMonth(wiptable, curmon + 1);
var endtindx = monstindx + daysinmo[curmon];

console.log(wiprecord[0]);
console.log(wiprecord.length, projlocs.length);

// find all of the start dates
for (let i = 0; i < projlocs.length; i++)
    {
    var stdt = GetWipStartDate(wiptable, projlocs[i]);
    var numdate = CalcDaysToDate(stdt);

    if(wiprecord.length <= i)
        {
        break;
        }

    if(wiprecord[i].length < daysinmo[curmon])
        {
        wiprecord[i] = [];
        }

    if ((monstindx < numdate) && (numdate <= endtindx))
        {
        wiprecord[i][monstindx + parseInt(GetDateDay(stdt) - 1, 10)] = "N";
        }

    var endt = GetWipEndDate(wiptable, projlocs[i]);
    numdate = CalcDaysToDate(endt);

    if ((monstindx < numdate) && (numdate <= endtindx))
        {
        wiprecord[i][monstindx + GetDateDay(endt) - 1] = "F";
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

// copying the data for the month into a separate variable
for (let i = 0; i < itab.length; i++)
    {
    console.log("Flag 1");
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

console.table(itab);

CreateHTMLTable(itab, projlocs.length+1, daysinmo[curmon] + 1);

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
var wiptable = LoadTable('Wips'.concat(year));
var wiprecord = LoadTable('WipRecord'.concat(year));

// find all of the projects for that month
var projlocs = FindProjectsInMonth(wiptable, curmon + 1);
var endtindx = monstindx + daysinmo[curmon];

for (let i = 0; i < projlocs.length; i++)
    {
    for (let j = monstindx, k = 0; j < endtindx; j++, k++)
        {
        wiprecord[i][j] = cells[i + topleft[1]][k + topleft[0]];
        }
    }

CreateTable('WipRecord'.concat(year), wiprecord);
}

function SaveWipsTable(cells, topleft)
{
var wiptable = LoadTable('Wips'.concat(GetActiveYear()));

var nrow = cells.length - 1;
var ncol = cells[0].length - 1;

console.log(nrow, ncol);

for (let i = 0; i < nrow; i++)
    {
    console.log(cells[i]);
    }

for (let i = 0; i < nrow; i++)
    {
    wiptable[i] = new Array(ncol);

    for (let j = 0; j < ncol; j++)
        {
        wiptable[i][j] = cells[i + topleft[1]][j + topleft[0]];
        }
    }

CreateTable('Wips'.concat(GetActiveYear()), wiptable);
}

function SaveHTMLTable(tableid, topleft)
{
var table = document.getElementById("table");

console.log("SaveHTMLTable");

switch (tableid) 
    {
    case 'WipRecord':
        {
        var cells = NormaliseTable(table);
        SaveWipRecordTable(cells, topleft);
        break;
        }
    case 'Wips':
        {
        console.log(table.rows.length, table.rows[0].cells.length);
        var cells = NormaliseTable(table, table.rows.length - 1, table.rows[0].cells.length);
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

function SetCurrentYear()
{
var wiplnk = document.querySelectorAll('.menubar a');
wiplnk.forEach(function(link) 
    {
    link.href = link.href.replace(/year=\d{4}/, "year=" + GetActiveYear());
    });

var monlnk = document.querySelectorAll('.monbar a');
monlnk.forEach(function(link) 
    {
    link.href = link.href.replace(/year=\d{4}/, "year=" + GetActiveYear());
    });
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
        for (var i = 0; i < 12; i++)
            {
            document.get
            }
        }
    }

window.onload = function() 
{
SetCurrentYear();
};

function ChangeYear(selyr) 
{
var wiplnk = document.querySelectorAll('.menubar a');
wiplnk.forEach(function(link) 
    {
    link.href = link.href.replace(/year=\d{4}/, "year=" + selyr);
    });

var monlnk = document.querySelectorAll('.monbar a');
monlnk.forEach(function(link) 
    {
    link.href = link.href.replace(/year=\d{4}/, "year=" + selyr);
    });
}


// new functions

function NormaliseTableFromHTML(tableID)
{
const table = document.getElementById(tableID).querySelector('table');
const rows = table.rows;
const data = [];

for (let i = 0; i < rows.length; i++) 
    {
    const row = rows[i];
    const cells = row.cells;
    const rowData = [];

    for (let j = 0; j < cells.length; j++) 
        {
        rowData.push(cells[j].textContent);
        }

    data.push(rowData);
    }

return data;
}

function StoreTableFromGlobal(tableName)
{
const data = NormaliseTableFromHTML(tableName);

console.log(data);
//.rows[row].cells[column].innerHTML

const jsonString = JSON.stringify(data, null, 2);   // creates the string to store
const blob = new Blob([jsonString], { type: 'application/json' });  // creates a blob to do the storage

// Create an anchor element and trigger the download
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = 'data.json';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
}

function CreateTable(data, containerID)
{
const table = document.createElement('table');  // creates the container

data.forEach((rowData, rowIndex) => 
    {
    const row = document.createElement('tr');   // loops through all of the rows and creates those

    rowData.forEach((cellData) => 
        {
        const cell = rowIndex === 0 ? document.createElement('th') : document.createElement('td');  // adds the appropriate elements
        cell.textContent = cellData;    // sets the cell data
        row.appendChild(cell);  // adds the cell
        });

    table.appendChild(row); // adds the rown
    });

const container = document.getElementById(containerID); // adds the table to the container
container.innerHTML = '';
container.appendChild(table);
}

async function LoadTableFromFile(filePath)
{
try {
    const response = await fetch(filePath);
    if (!response.ok) {
        throw new Error('Failed to fetch file');
    }
    const jsonData = await response.json();
    if (Array.isArray(jsonData) && jsonData.every(row => Array.isArray(row))) {
        console.log('Loaded JSON data:', jsonData);
        CreateTable(jsonData, 'table');
    } else {
        console.error('Invalid JSON format. Expected a 2D array.');
    }
} catch (error) {
    console.error('Error loading JSON file:', error);
}
}

function LoadTableToScreen(data)
{
LoadTableFromFile('data.json');
}

function InitialSetup()
{
CreateTable([["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], ["Greg", "Martin"]], 'table');
}