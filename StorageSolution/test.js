/* 
Tables
WIPS (wipID, startDate, finishDate, ...)
STITCHLOG (stlogID, wipID, status, date, ...)
status: Stitched (S), Finished (F), F Finished (FFO), New Start (N)
*/

// converts a string to an integer
function toInt(str) { return parseInt(str, 10); }

class StitchLog
    {
    constructor(logID, wipID, stDate, stStatus)
        {
        if(logID[0] === null)
            {
            // this = somefunctiontoloadstitchrecords();   // this will come from the JSON file
            }
        
        this.logID = logID;
        this.wipID = wipID;
        this.stDate = stDate;
        this.stStatus = stStatus;
        
        this.recNo = logID.length;
        this.SortLogByDate();
        }

    findRecord(logID)
    {
    // loop through all of the records
    for (let i = 0; i < this.logID.length; i++)
        {
        // if the record with the correct ID is found then exit the loop
        if(this.logID[i] === logID)
            {
            return i;
            }
        }
    return -1;
    }

    getRecordYear(logID)
    {
    let loc = this.findRecord(logID);    // finds the record with the ID
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
    const tmplogID = this.logID[itm1];
    const tmpwipID = this.wipID[itm1];
    const tmpstDate = this.stDate[itm1];
    const tmpstStatus = this.stStatus[itm1];

    // doing the swapping
    this.logID[itm1] = this.logID[itm2];
    this.wipID[itm1] = this.wipID[itm2];
    this.stDate[itm1] = this.stDate[itm2];
    this.stStatus[itm1] = this.stStatus[itm2];

    this.logID[itm2] = tmplogID;
    this.wipID[itm2] = tmpwipID;
    this.stDate[itm2] = tmpstDate;
    this.stStatus[itm2] = tmpstStatus;
    }

    SortLogByDate()
    {
    const len = this.recNo;

    for (let i = 0; i < len; i++)
        for (let j = 0; j < (len - i - 1); j++)
            if(DateComp(this.stDate[j], this.stDate[j + 1]) === 1)
                this.SwapRecords(j, j + 1, 1);    
    }

    findNextNumber()
    {
    let tmpno = this.recNo();
    let find = this.findRecord(tmpno);

    // while the records are being found
    while (find != -1);
        {
        tmpno += 1; // increment tempno to the next number to test
        find = this.findRecord(tmpno);  // find the record at the tmpno
        }
    
    return tmpno;
    }

    // -1 in logID for a new log entry
    AddRecord(logID, wipID, stDate, stStatus)
    {
    // if the logID needs to be new
    if(logID === -1)
        logID = this.findNextNumber();

    // adding the new details
    this.logID.push(logID);
    this.wipID.push(wipID);
    this.stDate.push(stDate);
    this.stStatus.push(stStatus);
    
    this.recNo = logID.length + 1;

    this.SortLogByDate();
    }

    RemoveRecord(logID)
    {
    // getting the location to remove at
    const loc = this.findRecord(logID);

    // adding the new details
    this.logID.splice(loc, 1);
    this.wipID.splice(loc, 1);
    this.stDate.splice(loc, 1);
    this.stStatus.splice(loc, 1);

    this.recNo = logID.length - 1;
    }

    // returns IDs of records made on a date
    findRecordsOnDate(date)
    {
    let IDs = [];
    this.SortLogByDate();

    // Improvement: could probably turn this into a binary search to the first occurance of the date
    // Improvement: possible improvement, stop adding when the date changes after adding has started

    for (let i = 0; i < this.recNo; i++)    // loop through all records
        {
        if (DateComp(this.stDate[i], date) === 0)   // if the record is on the same date as the input date
            {
            IDs.push(this.logID[i]);    // add the ID of the record to the ID array
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
const recNo = stTable.recNo();
let table = [];
let daysinmo = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];    // number of days in each month

const mindat = stTable.stDate[0];  // minimum date for the log table
const mindatyr = getDateYear(mindat);   // gets the year of the minimum date
const maxdat = stTable.stDate[recNo - 1];  // maximum date for the log table
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
    
    const dbfore = (toInt(tmpdat[1]) + 1).toString(10).padStart(2, "0")
    tmpdat = ReplaceSection(tmpdat, 0, 1, dbfore);
    //tmpdat = tmpdat.slice(-1, 1) + (toInt(tmpdat[1]) + 1).toString(10).padStart(2, "0") + tmpdat.slice(1 + 1);
    }
}
