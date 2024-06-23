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

function Clear()
{
const table = document.getElementById('table').querySelector('table');
const nrows = table.rows.length;

for (let i = nrows - 2; i > 0; i--)
    {
    table.deleteRow(1);
    }

}

function AddRow()
{
var cells = [];
var table = document.getElementById("table").querySelector('table');
var nrow = table.insertRow(table.rows.length - 1);
var numcol = table.rows[0].cells.length;

for (let index = 0; index < numcol; index++) {
    cells[index] = nrow.insertCell(index);
    cells[index].contentEditable = true;
    }
}

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

function NormaliseTableFromHTMLN(tableID)
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

function StoreTableFromLocalN(table)
{
const data = table;

const jsonString = JSON.stringify(data, null, 2);   // creates the string to store
const blob = new Blob([jsonString], { type: 'application/json' });  // creates a blob to do the storage

const url = 'http://localhost:8000/upload'; // Replace with your server endpoint

const formData = new FormData();
formData.append('file', blob, 'data.json');

fetch(url, {
    method: 'POST',
    body: formData
})
.then(response => {
    if (!response.ok) {
        throw new Error('Failed to upload file');
    }
    return response.json();
})
.then(data => {
    console.log('File uploaded successfully:', data);
    // Handle success response from server
})
.catch(error => {
    console.error('Error uploading file:', error);
    // Handle error
});
}

function StoreTableFromGlobalN(tableName)
{
const data = NormaliseTableFromHTMLN(tableName);

console.log(data);
//.rows[row].cells[column].innerHTML

const jsonString = JSON.stringify(data, null, 2);   // creates the string to store
const blob = new Blob([jsonString], { type: 'application/json' });  // creates a blob to do the storage

/* // Create an anchor element and trigger the download
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = 'data.json';
document.body.appendChild(a);
a.click();
document.body.removeChild(a); */
const url = 'http://localhost:8000/upload'; // Replace with your server endpoint

const formData = new FormData();
formData.append('file', blob, 'data.json');

fetch(url, {
    method: 'POST',
    body: formData
})
.then(response => {
    if (!response.ok) {
        throw new Error('Failed to upload file');
    }
    return response.json();
})
.then(data => {
    console.log('File uploaded successfully:', data);
    // Handle success response from server
})
.catch(error => {
    console.error('Error uploading file:', error);
    // Handle error
});
}

function CreateTableN(data, containerID)
{
const table = document.createElement('table');  // creates the container
table.setAttribute('class', "tracker");
table.setAttribute("id", "table");

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

async function LoadTableFromFileN(filePath)
{
try {
    const response = await fetch(filePath);
    if (!response.ok) {
        throw new Error('Failed to fetch file');
    }
    const jsonData = await response.json();
    if (Array.isArray(jsonData) && jsonData.every(row => Array.isArray(row))) {
        console.log('Loaded JSON data:', jsonData);
        CreateTableN(jsonData, 'table');
    } else {
        console.error('Invalid JSON format. Expected a 2D array.');
    }
} catch (error) {
    console.error('Error loading JSON file:', error);
}
}

function LoadTableToScreenN(data)
{
LoadTableFromFileN('uploads/data.json');
}

function InitialSetupN()
{
CreateTableN([["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], ["Greg", "Martin"]], 'table');
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

async function InitialiseWipsViewer()
{
SetCurrentYear();
var yr = GetActiveYear();
console.log(yr);
LoadTableToScreenN('data.json');
await new Promise(resolve => setTimeout(resolve, 100)); // waits for the table to be created

// LoadTable('Wips'.concat(yr));
var nrws = 1;

// wiptable.unshift([ "Name", "Start Date", "Finish Date", "Designer", "Fabric", "Floss", "Notes" ]);

// CreateHTMLTable(wiptable, nrws, 7);

const table = document.getElementById("table").querySelector("table");
const rows = table.rows;


for (let i = 0; i < rows[0].cells.length; i++)
    {
    rows[0].cells[i].contentEditable = false;
    }

for (let i = 1; i < rows.length; i++)
    {
    for (let j = 0; j < rows[i].cells.length; j++)
        {
        rows[i].cells[j].contentEditable = true;
        }
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

console.log("Final");
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
var wiptable = LoadTableFromFileN('data.json');

wiprecord = new Array(365);

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

CreateTableN(itab, projlocs.length+1, daysinmo[curmon] + 1);

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

function SaveNewWipTable()
{
var data = NormaliseTableFromHTMLN('table');
data = data.slice(0, -1);

StoreTableFromLocalN(data);
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

document.addEventListener('contextmenu', function(e) {
    if(e.target.closest('table') === null)
        {
        return;
        }
    else if (!isFirstOrLastRow(getRowUnderCursor(e)))
        {
        e.preventDefault();
        showContextMenu(e);
        }
  });

function showContextMenu(e)
{
const contextMenu = document.getElementById('contextMenu');
contextMenu.style.display = 'block';
contextMenu.style.left = `${e.pageX}px`;
contextMenu.style.top = `${e.pageY}px`;

// Event listeners for context menu items
document.getElementById('editRow').addEventListener('click', function()
    {
    // Implement edit row functionality
    alert('Edit row clicked');
    contextMenu.style.display = 'none';
    });

document.getElementById('deleteRow').addEventListener('click', function()
    {
    // Implement delete row functionality
    document.getSelection()
    var row = getRowUnderCursor(e);
    row.remove();
    //alert('Delete row clicked');
    contextMenu.style.display = 'none';
    });

// Close context menu on outside click
document.addEventListener('click', function() 
    {
    contextMenu.style.display = 'none';
    });
}

function getRowUnderCursor(e) 
{
// Find the closest TR element to the click coordinates
const table = document.getElementById('table').querySelector('table');
const rows = table.rows;
for (let i = 0; i < rows.length; i++) 
    {
    const rect = rows[i].getBoundingClientRect();
    if (e.pageX >= rect.left && e.pageX <= rect.right && e.pageY >= rect.top && e.pageY <= rect.bottom)
        {
        return rows[i];
        }
    }
return null;
}

function getRowNo(tableID, row)
{
const table = document.getElementById(tableID).querySelector('table');
for (let i = 0; i < table.rows.length; i++)
    {
    if(row == table.rows[i])
        return i;
    }
return -1;
}

function isFirstOrLastRow(row) 
{
const table = document.getElementById('table').querySelector('table');
return row === table.rows[0] || row === table.rows[table.rows.length - 1];
}