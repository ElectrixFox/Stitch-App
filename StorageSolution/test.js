

class StitchRecords
    {
    constructor(stID, wipID, stDate, stStatus)
        {
        if(stID === null)
            {
            this = somefunctiontoloadstitchrecords();   // this will come from the JSON file
            }
        
        this.stID = stID;
        this.wipID = wipID;
        this.stDate = stDate;
        this.stStatus = stStatus;
        
        this.recNo = stID.length;
        }

    get recNo() { return this.recNo; }

    findRecord(stID)
    {
    // loop through all of the records
    for (let i = 0; i < this.stID.length; i++)
        {
        // if the record with the correct ID is found then exit the loop
        if(this.stID[i] === stID)
            {
            return i;
            }
        }
    return -1;
    }

    getRecordYear(stID)
    {
    let loc = this.findRecord(stID);    // finds the record with the ID
    return this.stDate.substring(6, 10);    // gets the year bit from dd/mm/yyyy
    }
    

    
    }

function CreateHTMLStitchTable()
{

}

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
}

function createTable()
{
const stTable = new StitchRecords();
const records = [];
const recNo = stTable.recNo();
const wipNo = 0;

let tmpDat = stTable.stDate[0];

for (let i = 0; i < stTable.recNo.length; i++)
    {
    if(DateComp(stTable.stDate[i], tmpDat) === -1)
        {
        
        }
    }


}