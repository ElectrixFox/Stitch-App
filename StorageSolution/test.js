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
    constructor(wipID, wipName, stDate, finDate)
        {
        this.wipID = wipID;
        this.wipName = wipName;
        this.stDate = stDate;
        this.finDate = finDate;

        this.nowips = wipID.length;
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
    AddWip(wipID, wipName, stDate, finDate)
    {
    if(wipID === -1)    // if the wipID needs to be new
        wipID = this.findNextNumber();

    // adding the new details
    this.wipID.push(wipID);
    this.wipName.push(wipName);
    this.stDate.push(stDate);
    this.finDate.push(finDate);
    
    this.nowips += 1;
    }

    RemoveWip(wipID)
    {
    const loc = this.findWip(wipID);    // getting the location to remove at

    // removing the entry
    this.wipID.splice(loc, 1);
    this.wipName.splice(loc, 1);
    this.stDate.splice(loc, 1);
    this.finDate.splice(loc, 1);

    this.nowips -= 1;
    }
        
    }

class StitchLog
    {
    constructor(strecID, wipID, stDate, stStatus)
        {      
        this.strecID = strecID;
        this.wipID = wipID;
        this.stDate = stDate;
        this.stStatus = stStatus;
        
        this.loglen = strecID.length;
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
    return this.stDate.substring(6, 10);    // gets the year bit from dd/mm/yyyy
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
    const tmpstDate = this.stDate[itm1];
    const tmpstStatus = this.stStatus[itm1];

    // doing the swapping
    this.strecID[itm1] = this.strecID[itm2];
    this.wipID[itm1] = this.wipID[itm2];
    this.stDate[itm1] = this.stDate[itm2];
    this.stStatus[itm1] = this.stStatus[itm2];

    this.strecID[itm2] = tmprecID;
    this.wipID[itm2] = tmpwipID;
    this.stDate[itm2] = tmpstDate;
    this.stStatus[itm2] = tmpstStatus;
    }

    // this is just a simple bubble sort
    // Improvement: change the sort to being an insertion or quick sort
    SortLogByDate()
    {
    for (let i = 0; i < this.loglen; i++)
        for (let j = 0; j < (this.loglen - i - 1); j++)
            if(DateComp(this.stDate[j], this.stDate[j + 1]) === 1)
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
    AddRecord(recID, wipID, stDate, stStatus)
    {
    if(recID === -1)    // if the recID needs to be new
        recID = this.findNextNumber();

    // adding the new details
    this.strecID.push(recID);
    this.wipID.push(wipID);
    this.stDate.push(stDate);
    this.stStatus.push(stStatus);
    
    this.loglen += 1;

    this.SortLogByDate();
    }

    RemoveRecord(recID)
    {
    const loc = this.findRecord(recID); // getting the location to remove at

    // removing the entry
    this.strecID.splice(loc, 1);
    this.wipID.splice(loc, 1);
    this.stDate.splice(loc, 1);
    this.stStatus.splice(loc, 1);

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
        if (DateComp(this.stDate[i], date) === 0)   // if the record is on the same date as the input date
            {
            IDs.push(this.strecID[i]);    // add the ID of the record to the ID array
            }
        }
    
    return IDs;
    }
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
    ["01/01/2024", "05/01/2024", "06/04/2024", "05/03/2024", "11/11/2024"],
    ["15/02/2024", "09/03/2024", "19/08/2024", "21/04/2024", "24/12/2024"]
);

return wips;
}

// -1 is dat1 before dat2, 1 is dat1 after dat2, 0 is when they are the same, -2 is error 
function DateComp(dat1, dat2)
{
// gets the dates in the form yyyymmdd
let idat1 = (10000) * dat1.substring(6, 10) + (100) * dat1.substring(3, 5) + dat1.substring(0, 2);
let idat2 = (10000) * dat2.substring(6, 10) + (100) * dat2.substring(3, 5) + dat2.substring(0, 2);

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

function createTable()
{
const stTable = new StitchLog();    // creating the record log
const loglen = stTable.loglen();
let table = [];
let daysinmo = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];    // number of days in each month

const mindat = stTable.stDate[0];  // minimum date for the log table
const mindatyr = getDateYear(mindat);   // gets the year of the minimum date
const maxdat = stTable.stDate[loglen - 1];  // maximum date for the log table
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

function CreateHTMLStitchTable()
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
        console.log("\nEntry %d: %s", j + 1, stLog.stStatus[stLog.findRecord(recIDs[j])]);
        }
    
    const dbfore = (toInt(tmpdat[1]) + 1).toString(10).padStart(2, "0");
    tmpdat = ReplaceSection(tmpdat, 0, 1, dbfore);
    }
}

function CreateHTMLWipTable()
{
let wiptable = LoadWipTable();

console.log(wiptable.wipName);
}

function AddRow(table, title, ncells = 0)
{
let newrow = table.insertRow();
const cutthreshold = 15;    // cutoff threshold for creating cells on the same row
let span = 1;
let i = 1;

const headCell = document.createElement('th');  // create the header cell

if(title !== '')    // if there is a title
    {
    headCell.textContent = title;   // add the title
    newrow.appendChild(headCell);   // append the cell to the new row
    }
else if(title !== '')   // if the title is empty
    {
    i += 1;
    }

for (i = 0; i < ncells; i++)    // loop through and add ncells number of cells
    {
    if(i === cutthreshold)
        {
        span = AddRow(table, '', ncells - cutthreshold) + 1;    // this sets the span to be the number of rows already added plus the new row to be added
        break;
        }
    newrow.insertCell();
    }

if (ncells < cutthreshold)
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

function InitialiseRows(year)
{
let wiptable = LoadWipTable();
let daysinmo = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];    // number of days in each month
const months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let table = document.getElementById("wipYearView");

if ((toInt(year) % 4) === 0)    // if it is a leap year
    daysinmo[1] = 29;   // set Feb to have 29 days

for (let mon = 0; mon < 12; mon++)  // loop through all months in the year
    {
    AddRow(table, months[mon], daysinmo[mon]);

    /* for (let day = 0; day < daysinmo[i]; day++) // loop through all days in the month
        {
        somefunctoaddcell();

        } */
    }

}
