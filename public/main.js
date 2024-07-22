/* 
Tables
WIPS (wipID, startDate, finishDate, ...)
STITCHLOG (strecID, wipID, status, date, ...)
status: Stitched (S), Finished (F), F Finished (FFO), New Start (N)
*/

/*
Bugs:
- Ensure that only one new start and finish can exist per WIP
- Ensure that WIP records cannot be made on the start date and end date
*/

// converts a string to an integer
function toInt(str) { return parseInt(str, 10); }

class WipsTable
    {
    constructor(wipID, wipName, designer, stDate, finDate, stitchcount, fabric, floss, notes)
        {
        this.wipID = wipID;
        this.wipName = wipName;
        this.designer = designer;
        this.stDate = stDate;
        this.finDate = finDate;
        this.stitchcount = stitchcount;
        this.fabric = fabric;
        this.floss = floss;
        this.notes = notes;

        this.nowips = this.wipID.length;
        }
    
    findWip(wipID)
    {
    for (let i = 0; i < this.nowips; i++)   // loop through all of the wips
        {
        if(this.wipID[i] === wipID) // if the wip with the correct ID is found then exit the loop
            {
            return i;
            }
        }
    return -1;
    }

    findNextNumber()
    {
    let tmpno = this.nowips;
    let find = this.findWip(tmpno);

    while (find != -1)  // while the wips are being found
        {
        tmpno += 1; // increment tempno to the next number to test
        find = this.findWip(tmpno);  // find the wip at the tmpno
        }
    
    return tmpno;
    }
    
    // -1 in wipID for a new wip entry
    AddWip(wipID, wipName, designer, stDate, finDate, stitchcount, fabric, floss, notes)
    {
    if(wipID === -1)    // if the wipID needs to be new
        wipID = this.findNextNumber();

    // adding the new details
    this.wipID.push(wipID);
    this.wipName.push(wipName);
    this.designer.push(designer);
    this.stDate.push(stDate);
    this.finDate.push(finDate);
    this.stitchcount.push(stitchcount);
    this.fabric.push(fabric);
    this.floss.push(floss);
    this.notes.push(notes);
    
    this.nowips += 1;
    }

    RemoveWip(wipID)
    {
    const loc = this.findWip(wipID);    // getting the location to remove at

    // removing the entry
    this.wipID.splice(loc, 1);
    this.wipName.splice(loc, 1);
    this.designer.splice(loc, 1);
    this.stDate.splice(loc, 1);
    this.finDate.splice(loc, 1);
    this.stitchcount.splice(loc, 1);
    this.fabric.splice(loc, 1);
    this.floss.splice(loc, 1);
    this.notes.splice(loc, 1);

    this.nowips -= 1;
    }

    getAsJSON()
    {
    let items = []
    
    for(let i = 0; i < this.nowips; i++)    // loop through all of the entries
        {
        let item = { 
            wipID:          this.wipID[i],
            wipName:        this.wipName[i],       
            designer:       this.designer[i],      
            stDate:         this.stDate[i],
            finDate:        this.finDate[i],
            stitchcount:    this.stitchcount[i],      
            fabric:         this.fabric[i],
            floss:          this.floss[i],
            notes:          this.notes[i]
        };  // create a base record

        items.push(item);   // add each record to the item list
        }

    return items;
    }
        
    }

class StitchLog
    {
    constructor(strecID, wipID, recDate, recStatus)
        {
        this.strecID = strecID;
        this.wipID = wipID;
        this.recDate = recDate;
        this.recStatus = recStatus;
        
        this.loglen = this.strecID.length;
        this.SortLogByDate();
        }

    findRecord(recID)
    {
    // loop through all of the records
    for (let i = 0; i < this.strecID.length; i++)
        {
        // if the record with the correct ID is found then exit the loop
        if(this.strecID[i] === recID)
            {
            return i;
            }
        }
    return -1;
    }

    getRecordYear(recID)
    {
    let loc = this.findRecord(recID);    // finds the record with the ID
    return this.recDate[loc].substring(6, 10);    // gets the year bit from dd/mm/yyyy
    }
    
    // index indicates whether the records should be searched for or not 
    SwapRecords(itm1, itm2, indx = 0)
    {
    // if index is 0 then it finds the index of the records
    if(indx === 0)
        {
        itm1 = this.findRecord(itm1);
        itm2 = this.findRecord(itm2);
        }
    
    // setting the temp variables
    const tmprecID = this.strecID[itm1];
    const tmpwipID = this.wipID[itm1];
    const tmprecDate = this.recDate[itm1];
    const tmprecStatus = this.recStatus[itm1];

    // doing the swapping
    this.strecID[itm1] = this.strecID[itm2];
    this.wipID[itm1] = this.wipID[itm2];
    this.recDate[itm1] = this.recDate[itm2];
    this.recStatus[itm1] = this.recStatus[itm2];

    this.strecID[itm2] = tmprecID;
    this.wipID[itm2] = tmpwipID;
    this.recDate[itm2] = tmprecDate;
    this.recStatus[itm2] = tmprecStatus;
    }

    // this is just a simple bubble sort
    // Improvement: change the sort to being an insertion or quick sort
    SortLogByDate()
    {
    for (let i = 0; i < this.loglen; i++)
        for (let j = 0; j < (this.loglen - i - 1); j++)
            if(DateComp(this.recDate[j], this.recDate[j + 1]) === 1)
                this.SwapRecords(j, j + 1, 1);    
    }

    findNextNumber()
    {
    let tmpno = this.loglen();
    let find = this.findRecord(tmpno);

    while (find != -1)  // while the records are being found
        {
        tmpno += 1; // increment tempno to the next number to test
        find = this.findRecord(tmpno);  // find the record at the tmpno
        }
    
    return tmpno;
    }

    // -1 in recID for a new log entry
    AddRecord(recID, wipID, recDate, recStatus)
    {
    if(recID === -1)    // if the recID needs to be new
        recID = this.findNextNumber();

    // adding the new details
    this.strecID.push(recID);
    this.wipID.push(wipID);
    this.recDate.push(recDate);
    this.recStatus.push(recStatus);
    
    this.loglen += 1;

    this.SortLogByDate();
    }

    RemoveRecord(recID)
    {
    const loc = this.findRecord(recID); // getting the location to remove at

    // removing the entry
    this.strecID.splice(loc, 1);
    this.wipID.splice(loc, 1);
    this.recDate.splice(loc, 1);
    this.recStatus.splice(loc, 1);

    this.loglen -= 1;
    }

    // returns IDs of records made on a date
    findRecordsOnDate(date)
    {
    let IDs = [];
    this.SortLogByDate();

    // Improvement: could probably turn this into a binary search to the first occurance of the date
    // Improvement: possible improvement, stop adding when the date changes after adding has started

    for (let i = 0; i < this.loglen; i++)    // loop through all records
        {
        if (DateComp(this.recDate[i], date) === 0)   // if the record is on the same date as the input date
            {
            IDs.push(this.strecID[i]);    // add the ID of the record to the ID array
            }
        }
    
    return IDs;
    }

    findRecordsForWip(wipID)
    {
    let IDs = [];

    for (let i = 0; i < this.loglen; i++)    // loop through all records
        {
        if (this.wipID[i] === wipID)   // if the record is for the same wip and the input wip
            {
            IDs.push(this.strecID[i]);    // add the ID of the record to the ID array
            }
        }
    
    return IDs;
    }

    getAsJSON()
    {
    let items = []
    
    for(let i = 0; i < this.loglen; i++)    // loop through all of the entries
        {
        let item = { 
            strecID:    this.strecID[i],
            wipID:      this.wipID[i],
            recDate:    this.recDate[i],
            recStatus:  this.recStatus[i]
        };  // create a base record

        items.push(item);   // add each record to the item list
        }

    return items;
    }

}

function setStitchLogFromJSON(jsonData)
{
let strids = [];
let wipids = [];
let recdats = [];
let recstats = [];

for(let i = 0; i < jsonData.length; i++)    // loop through all of the entries
    {
    let item = jsonData[i]; // getting each json entry

    // adding the new item
    strids.push(item['strecID']);
    wipids.push(item['wipID']);
    recdats.push(item['recDate']);
    recstats.push(item['recStatus']);
    }

return new StitchLog(strids, wipids, recdats, recstats);    // creating the stitch log
}

function setWipTableFromJSON(jsonData)
{
let new_wipID = []
let new_wipName = []
let new_designer = []
let new_stDate = []
let new_finDate = []
let new_stitchcount = []
let new_fabric = []
let new_floss = []
let new_notes = []

for(let i = 0; i < jsonData.length; i++)    // loop through all of the entries
    {
    let item = jsonData[i]; // getting each json entry

    // adding the new item
    new_wipID.push(item['wipID']);
    new_wipName.push(item['wipName']);
    new_designer.push(item['designer']);
    new_stDate.push(item['stDate']);
    new_finDate.push(item['finDate']);
    new_stitchcount.push(item['stitchcount']);
    new_fabric.push(item['fabric']);
    new_floss.push(item['floss']);
    new_notes.push(item['notes']);
    }

return new WipsTable(new_wipID, new_wipName, new_designer, new_stDate, new_finDate, new_stitchcount, new_fabric, new_floss, new_notes);    // creating the wip table
}

function LoadStitchLog()
{
let log = new StitchLog(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [2, 2, 3, 5, 1, 2, 3, 3, 5, 1],
    ["02/01/2024", "10/01/2024", "09/01/2024", "04/01/2024", "05/01/2024", "01/01/2024", "10/01/2024", "08/01/2024", "06/01/2024", "06/01/2024"],
    ["N", "S", "FFO", "F", "N", "N", "S", "N", "F", "F"]
);

return log;
}

function LoadWipTable()
{
let wips = new WipsTable(
    [1, 2, 3, 4, 5],
    ["A", "B", "C", "D", "E"],
    ["0", "0", "0", "0", "0"],
    ["01/01/2024", "05/01/2024", "06/04/2024", "05/03/2024", "11/11/2024"],
    ["15/02/2024", "09/03/2024", "19/08/2024", "21/04/2024", "24/12/2024"],
    [60, 120, 150, 190, 100],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""]
);

return wips;
}

function CalcNumericalDate(dat) { return ((10000) * toInt(dat.substring(6, 10)) + (100) * toInt(dat.substring(3, 5)) + toInt(dat.substring(0, 2))); }

// -1 is dat1 before dat2, 1 is dat1 after dat2, 0 is when they are the same, -2 is error 
function DateComp(dat1, dat2)
{
// gets the dates in the form yyyymmdd
let idat1 = CalcNumericalDate(dat1);
let idat2 = CalcNumericalDate(dat2);

if(idat1 < idat2)   // if the first date is before the 2nd date return -1
    {
    return -1;
    }
if(idat1 > idat2)    // if the first date is after the 2nd date return 1
    {
    return 1;
    }
else if (idat1 === idat2)   // if they are the same date return 0
    {
    return 0;
    }
return -2;  // return -2 for an error
}

// gets the year part from the date (in the format dd/mm/yyyy)
function getDateYear(dat) { return toInt(dat.substring(6, 10)); }

function getScheduleLoc(dat)
{
let daysinmo = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];    // number of days in each month
let month = dat.substring(3, 5);    // gets month part of the date
const day = dat.substring(0, 2);    // gets day part of the date
let res = day;

if ((toInt(getDateYear(dat)) % 4) === 0)    // if it is a leap year
    daysinmo[1] = 29;   // set Feb to have 29 days

for (let i = 0; i < month; i++) // loops through months until month of given date
    {
    res += daysinmo[month]; // adds days in previous month to the result
    }

return res;
}

function createTable()
{
const stTable = new StitchLog();    // creating the record log
const loglen = stTable.loglen();
let table = [];
let daysinmo = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];    // number of days in each month

const mindat = stTable.recDate[0];  // minimum date for the log table
const mindatyr = getDateYear(mindat);   // gets the year of the minimum date
const maxdat = stTable.recDate[loglen - 1];  // maximum date for the log table
const nyrs = getDateYear(maxdat) - mindatyr;   // gets number of years between the two dates

// could be an idea to rework the creation to populate the array as it is being created with the appropriate records

for (let yr = 0; yr <= nyrs; yr++)
    {
    const daysinyear = 365 + (((toInt(mindatyr) + yr) % 4) === 0);  // the number of days in the year (+1 if it is a leap year)
    
    // create new table for year
    table = [];

    // adds an entry for each day
    for (let day = 0; day < daysinyear; day++)
        {
        table[day] = [];
        }
    }
}

function ReplaceSection(str, start, end, item)
{
return str.slice(start - 1, end) + item + str.slice(end + 1);
}

async function CreateHTMLStitchTable(year)
{
let stitchlog = await LoadRecordLog();
let daysinmo = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];    // number of days in each month
const months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let table = document.getElementById("wipYearView");
let logcells = [];
const wipid = 1;
let logrecords = stitchlog.findRecordsForWip(wipid);    // gets all of the log records for the given wip

CreateHTMLWipTable(wipid);

if ((toInt(year) % 4) === 0)    // if it is a leap year
    daysinmo[1] = 29;   // set Feb to have 29 days

for (let mon = 0; mon < 12; mon++)  // loop through all months in the year
    AddRow(table, months[mon], daysinmo[mon], 1);   // adds a row with daysinmo number of cells

let edcells = table.querySelectorAll('td'); // finds all of the cells
for (let i = 0; i < edcells.length; i++)    // loop through all of the editable cells
    if(edcells[i].className !== "blockcell")    // if the class name isn't blockcell
        logcells.push(edcells[i]);  // add the log cells to the cell list

logcells.forEach(td => {
    td.contentEditable = true;  // the contents of the cells can be changed
    // To-Do: add the functionality to have a dropdown menu to select the state of the cell
}); // for each loop through all of the td cells

for (let i = 0; i < logrecords.length; i++) 
    {
    if(stitchlog.getRecordYear(logrecords[i]) !== year) // if the year of the record isn't the same year as the input year
        {
        continue;   // move to next record
        }
    const recloc = stitchlog.findRecord(logrecords[i]);    // gets the location of the record in the stitch log
    let curcell = logcells[toInt(getScheduleLoc(stitchlog.recDate[recloc]))];   // gets the cell to change

    console.log(curcell);
    curcell.textContent = stitchlog.recStatus[recloc];    // setting it as a new start
    curcell.contentEditable = false;    // stops the cell being changeable
    curcell.className = null;   // clears the class
    }
}

function CreateHTMLWipTable(wipid = 0)
{
let wipstable = LoadWipTable();
const wiploc = wipstable.findWip(wipid);

let createBlock = (intable, title, content) => {
    const nrow = intable.insertRow();
    const headcell = document.createElement('th');  // creating the header cell
    headcell.textContent = title;   // setting the text content

    const bodcell = document.createElement('td');   // creating content cell
    bodcell.textContent = content;  // setting the text content

    nrow.appendChild(headcell);
    nrow.appendChild(bodcell);
    intable.appendChild(nrow);
};

{
let wiptab = document.getElementsByClassName("wipDetails")[0];
createBlock(wiptab, "Name", wipstable.wipName[wiploc]);
createBlock(wiptab, "Designer", wipstable.designer[wiploc]);
createBlock(wiptab, "Start Date", wipstable.stDate[wiploc]);
createBlock(wiptab, "Finish Date", wipstable.finDate[wiploc]);
createBlock(wiptab, "Stitch Count", wipstable.stitchcount[wiploc]);
createBlock(wiptab, "Fabric", wipstable.fabric[wiploc]);
createBlock(wiptab, "Floss", wipstable.floss[wiploc]);
createBlock(wiptab, "Notes", wipstable.notes[wiploc]);
}
}

function AddRow(table, title, ncells = 0, numbered = 0, curplace = -1)
{
let newrow = table.insertRow();
const headCell = document.createElement('th');  // create the header cell
const cutthreshold = 15;    // cutoff threshold for creating cells on the same row
let span = 1;
let i = 1;

if(title !== '')    // if there is a title
    {
    headCell.textContent = title;   // add the title
    newrow.appendChild(headCell);   // append the cell to the new row
    i += 1; // increase the starting number to reduce the extra column
    curplace = 0;
    }
else    // if there isn't a title
    {
    curplace += cutthreshold;
    }

for (i = 0; i < ncells; i++)    // loop through and add ncells number of cells
    {
    if(i === cutthreshold)  // if the threshold to start a new row is reached
        {
        span = AddRow(table, '', ncells - cutthreshold, numbered, curplace) + 1;    // this sets the span to be the number of rows already added plus the new row to be added
        break;
        }

    const tmpCell = document.createElement('td');   // create the new cell element
    if(numbered === 1)  // if the cells should be numbered
        {
        tmpCell.textContent = curplace + i + 1;    // set the number
        tmpCell.className = "numcell";  // setting it to be a numbered cell class
        }
    newrow.appendChild(tmpCell);    // add the cell to the row
    }

if(ncells < cutthreshold)
    {
    const blockCell = document.createElement('td');  // create the block cell
    blockCell.colSpan = cutthreshold - ncells;   // setting it's row span to be the remaining cells in the row
    blockCell.className = "blockcell";  // sets the class name for the cell
    newrow.appendChild(blockCell);  // adds the new cell
    }

if(title !== '')    // if there is a title meaning it is the header cell
    {
    headCell.rowSpan = span;    // update the span
    }

return span;   // returns 1 so that the span can be updated
}

function InitialiseStitchLogTable()
{
let stLog = LoadStitchLog();  // gets the log
const nowips = 2;
let tmpdat = "01/01/2024";

for (let i = 1; i < 11; i++)
    {
    let recIDs = stLog.findRecordsOnDate(tmpdat); // finds all the records on the given date
    console.log("\n\nDate: %s", tmpdat);
    for (let j = 0; j < recIDs.length; j++)
        {
        console.log("\nEntry %d: %s", j + 1, stLog.recStatus[stLog.findRecord(recIDs[j])]);
        }
    
    const dbfore = (toInt(tmpdat[1]) + 1).toString(10).padStart(2, "0");
    tmpdat = ReplaceSection(tmpdat, 0, 1, dbfore);
    }
}

function SaveRecordLog()
{
const stLog = LoadStitchLog().getAsJSON();

const blob = new Blob([JSON.stringify(stLog, null, 2)], { // creates json blob with the type of json 
    type: "application/json",
});

const url = 'http://localhost:8000/write-file?name=' + 'log.json'; // url to upload to

const formdata = new FormData();    // creates the new form to attatch the data to
formdata.append('file', blob, 'log.json'); // adds the data to the form

fetch(url, {
    method: 'POST',
    body: formdata
})
.then(response => { // sorting the responce
    if (!response.ok)   // if the responce is bad
        throw new Error("Failed to upload file");   // give error message 
    return response.json(); // return the responce
})
.then(data => { // sorting the data
    console.log('File uploaded successfully:', data);
})
.catch(error => {   // catching an error
    console.error('Error uploading file:', error);
});
}

function LoadRecordLog()
{
const url = 'http://localhost:8000/read-file?name=' + 'log.json'; // url to load from

const res = fetch(url)  // setting the result to be the fetched data
.then(response => { // sorting the responce
    if (!response.ok)   // if the responce is bad
        throw new Error("Failed to load file");   // give error message 
    return response.json(); // return the responce
})
.then(data => { // sorting the data
    console.log('File loaded successfully:', data);
    console.log(data[0]);
    let stLog = setStitchLogFromJSON(data);
    console.log(stLog);
    return stLog;
})
.catch(error => {   // catching an error
    console.error('Error loading file:', error);
});

return res;
}

function SaveWipTableFile()
{
const wiptab = LoadWipTable().getAsJSON();
console.log(wiptab);
SaveJSONFile('wiptable', wiptab);
}

function LoadWipTableFile()
{
return setWipTableFromJSON(LoadJSONFile('wiptable'));
}

function SaveJSONFile(filename, data)
{
const blob = new Blob([JSON.stringify(data, null, 2)], { // creates json blob with the type of json 
    type: "application/json",
});

const url = 'http://localhost:8000/write-file?name=' + filename + '.json'; // url to upload to

const formdata = new FormData();    // creates the new form to attatch the data to
formdata.append('file', blob, filename + '.json'); // adds the data to the form

fetch(url, {
    method: 'POST',
    body: formdata
})
.then(response => { // sorting the responce
    if (!response.ok)   // if the responce is bad
        throw new Error("Failed to upload file");   // give error message 
    return response.json(); // return the responce
})
.then(data => { // sorting the data
    console.log('File uploaded successfully:', data);
})
.catch(error => {   // catching an error
    console.error('Error uploading file:', error);
});
}

function LoadJSONFile(filename)
{
const url = 'http://localhost:8000/read-file?name=' + filename + '.json'; // url to load from

const res = fetch(url)  // setting the result to be the fetched data
.then(response => { // sorting the responce
    if (!response.ok)   // if the responce is bad
        throw new Error("Failed to load file");   // give error message 
    return response.json(); // return the responce
})
.then(data => { // sorting the data
    console.log('File loaded successfully:', data);
    console.log(data[0]);
    return data;
})
.catch(error => {   // catching an error
    console.error('Error loading file:', error);
});

return res;
}

