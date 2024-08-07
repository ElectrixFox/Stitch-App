import { DateComp, GetHostURL } from '/js/utilities.js';

function SaveJSONFile(filename, data)
{
const blob = new Blob([JSON.stringify(data, null, 2)], { // creates json blob with the type of json 
    type: "application/json",
});

const url = 'http://' + GetHostURL() + '/write-file?name=' + filename + '.json'; // url to upload to

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
const url = 'http://' + GetHostURL() + '/read-file?name=' + filename + '.json'; // url to load from
const res = fetch(url)  // setting the result to be the fetched data
.then(response => { // sorting the responce
    if (!response.ok)   // if the responce is bad
        throw new Error("Failed to load file");   // give error message 
    return response.json(); // return the responce
})
.then(data => { // sorting the data
    console.log('File loaded successfully:', data);
    // console.log(data[0]);
    return data;
})
.catch(error => {   // catching an error
    console.error('Error loading file:', error);
});

return res;
}

export class WipsTable
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
    for (let i = 0; i < this.wipID.length; i++)   // loop through all of the wips
        {
        if(this.wipID[i] == wipID) // if the wip with the correct ID is found then exit the loop
            {
            return i;
            }
        }
    return -1;
    }

    findWipName(wipnam)
    {
    for (let i = 0; i < this.nowips; i++)   // loop through all of the wips
        {
        if(this.wipName[i] === wipnam) // if the wip with the correct name is found then exit the loop
            {
            return this.wipID[i];
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
    
    // -1 in wipID for a new wip entry, also returns the new ID of the wip
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

    return wipID;
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

    SetWip(wipID, wipName, designer, stDate, finDate, stitchcount, fabric, floss, notes)
    {
    const wiploc = this.findWip(wipID); // finds the wip

    // sets the details of the wip
    this.wipID[wiploc] = wipID;
    this.wipName[wiploc] = wipName;
    this.designer[wiploc] = designer;
    this.stDate[wiploc] = stDate;
    this.finDate[wiploc] = finDate;
    this.stitchcount[wiploc] = stitchcount;
    this.fabric[wiploc] = fabric;
    this.floss[wiploc] = floss;
    this.notes[wiploc] = notes;
    }

    SetWipArr(wipID, details) { this.SetWip(wipID, details[0], details[1], details[2], details[3], details[4], details[5], details[6], details[7]); }

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

    SaveFile()
    {
    const wiptab = this.getAsJSON();
    // console.log(wiptab);
    SaveJSONFile('wiptable', wiptab);
    }
        
    }

export class StitchLog
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
    let tmpno = this.loglen;
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

    // Improvement: could probably turn this into a binary search to the first occurrence of the date
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
   
    // returns IDs of records made in the month
    findRecordsInMonth(month, yr = 2024)
    {
    let IDs = [];
    let daysinmo = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];    // number of days in each month
    if ((yr % 4) === 0) // accounting for the leap year
        daysinmo[1] = 29;
    
    this.SortLogByDate();

    for (let day = 0; day < daysinmo[month - 1]; day++)
        {
        const serchdat = (day + 1).toString().padStart(2, '0') + '/' + month.toString().padStart(2, '0') + '/' + yr.toString();    // creating the date in form dd/mm/yyyy
        const idsfound = this.findRecordsOnDate(serchdat);  // the ids of the records on the date

        if(idsfound.length !== 0)   // if there are ids in the list
            IDs.push(idsfound); // add the ids to the list of ids in the month
        }

    IDs = IDs.flat(1);  // flattens the array to only have a 1D array not a 2D array
    
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

    UpdateStitchRecordsAt(wipID, date, status)
    {
    let upd = 0;    // should update or add
    let recsondat = this.findRecordsOnDate(date);   // gets all the records on the given date
    let recloc = 0; // location of record to be updated or of new record

    for (let i = 0; i < recsondat.length; i++)  // search through all of the records on the date
        {
        recloc = this.findRecord(recsondat[i]); // gets the location of the record
        if(this.wipID[recloc] === wipID) // if there is a record with the same wip ID
            upd = 1;    // set this record to be updated
        }
    
    if(upd === 1)    // if there should be an update
        {
        if((status === null) || (status === "")) // if the status is null delete the record
            this.RemoveRecord(this.strecID[recloc]);    // remove the record at the given location since this requires the record to be removed
        else    // otherwise the record should be updated
            this.recStatus[recloc] = status;   // set to the new status
        }
    else    // should add a new record
        this.AddRecord(-1, wipID, date, status);    // add the new record

    this.SaveFile();    // save the changes
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

    SaveFile()
    {
    const stlog = this.getAsJSON();
    console.log(stlog);
    SaveJSONFile('stitchlog', stlog);
    }

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

export async function LoadWipTableFile()
{
let data = await LoadJSONFile('wiptable'); 
return setWipTableFromJSON(data);
}

export async function LoadStitchLogFile()
{
let data = await LoadJSONFile('stitchlog'); 
return setStitchLogFromJSON(data);
}