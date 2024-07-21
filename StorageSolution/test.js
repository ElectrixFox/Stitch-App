/* 
Tables
WIPS (wipID, startDate, finishDate, ...)
STITCHLOG (stlogID, wipID, status, date, ...)
status: Stitched (S), Finished (F), F Finished (FFO), New Start (N)
*/

class StitchLog
    {
    constructor(logID, wipID, stDate, stStatus)
        {
        if(logID === null)
            {
            this = somefunctiontoloadstitchrecords();   // this will come from the JSON file
            }
        
        this.logID = logID;
        this.wipID = wipID;
        this.stDate = stDate;
        this.stStatus = stStatus;
        
        this.recNo = logID.length;
        }

    get recNo() { return this.recNo; }

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
        for (let j = 0; j < len; j++)
            if(DateComp(this.stDate[i], this.stDate[j]) === -1)
                this.SwapRecords(i, j, 1);    
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
}

function CreateHTMLStitchTable()
{

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

function createTable()
{
const stTable = new StitchLog();
const records = [];
const recNo = stTable.recNo();
const wipNo = 0;
let table = [];
let daysinmo = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];    // number of days in each month

stTable.SortLogByDate();    // sorting the records

let tmpMinDat = stTable.stDate[0];  // temporary minimum date for the record
let tmpMaxDat = stTable.stDate[recNo - 1];  // temporary maximum date for the record
const nyrs = stTable.getRecordYear(stTable.logID[recNo - 1]) - stTable.getRecordYear(stTable.logID[0]);   // gets number of years between the two dates

for (let yr = 0; yr <= nyrs; yr++)
    {
    if((stTable.getRecordYear(stTable.logID[0] + yr) % 4) === 0)    // if it is a leap year
        daysinmo[2] = 29;   // set Feb to having 29 days
    else    // else if it is not a leap year
        daysinmo[2] = 28;   // ser Feb to having 28 days


    for (let mon = 0; mon < 12; mon++) 
        {
        for (let day = 0; day < daysinmo[mon]; day++) 
            {
            table.
            }
        }
    }

for (let i = 0; i <= nyrs; i++)
    {
    table[i] = [];

    }


}