/*
Tables
WIPS (wipID, startDate, finishDate, ...)
STITCHLOG (strecID, wipID, status, date, ...)
status: Stitched (S), Finished (F), F Finished (FFO), New Start (N)

Bugs:
- Ensure that only one new start and finish can exist per WIP
- Ensure that WIP records cannot be made on the start date and end date

Validations:
- Date validations
- Status validations
- All WIPs must have unique names
*/

import { toInt, getScheduleLoc, getDateFromScheduleLoc, getDateDay } from '/js/utilities.js';
import { WipsTable, StitchLog, LoadWipTableFile, LoadStitchLogFile } from '/js/objects.js';

function RemoveHTMLElementChildren(eleID, eleIDstoignore = null)
{
const ele = document.getElementById(eleID); // gets the ID of the element to clear
let toremove = [];  // elements to remove
let cont = 1;

if(eleIDstoignore === null) // if there are no IDs to ignore
    {
    while (ele.childElementCount > 0)  // while there are still child elements
        {
        const child = ele.childNodes[0];    // select the first child element 
        ele.removeChild(child);    // remove the child
        }
    }
else
    {
    for (let i = 0; i < ele.childNodes.length; i++) // loop through all child nodes
        {
        for (let j = 0; j < eleIDstoignore.length; j++)  // loop through all element IDs to ignore
            {
            if (ele.childNodes[i].id === eleIDstoignore[j])  // if there is a child node with an ID to ignore
                {
                cont = 0;   // don't continue with the removal
                break;  // exit the search
                }
            }
        if(cont === 1)  // if should continue with the removal
            {
            toremove.push(ele.childNodes[i]);   // add the child to the list
            }
        cont = 1;   // assume the next one isn't in the ignore list either
        }
    while(toremove.length > 0)  // while there are elements to remove
        {
        ele.removeChild(toremove.pop());
        }
    }
}

function AddRow(table, title, ncells = 0, curplace = -1)
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
        span = AddRow(table, '', ncells - cutthreshold, curplace) + 1;    // this sets the span to be the number of rows already added plus the new row to be added
        break;
        }

    const tmpCell = document.createElement('td');   // create the new cell element
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

function GetQueryParameter(name) 
{
const urlParams = new URLSearchParams(window.location.search);
return urlParams.get(name);
}

function GetCurrentWip() { return GetQueryParameter('w'); }
function GetCurrentMonth() { return GetQueryParameter('m'); }
function GetCurrentYear() { return GetQueryParameter('y'); }

export async function GetTitleWip()
{
let wiptab = await LoadWipTableFile();    // get a wip table to search for the located wip
const url = window.location.pathname;   // gets the path to the current location
const steps = url.split('/');   // splits the url into all the '/'s
let wiploc = -1;

let wipnam = steps.pop();   // returns the last element which would be the wip name in the cases where this function is to be used
if(wipnam.includes('%20')) // if there is a space indicator in the name
    wipnam = wipnam.replace('%20', ' '); // replace the %20 space indicator with an actual space

wiploc = wiptab.findWipName(wipnam);    // gets the location of the wip in the wiptable

console.log("Url: %s\t\tWip: %s\t\tLoc: %d", url, wipnam, wiploc);
return wiploc;  // return the ID of the located wip
}

export async function UpdateWip(tab, wipid)
{
let wipstable = await LoadWipTableFile();   // loads the table from the file
const wiploc = wipstable.findWip(wipid);    // finds the wip to update
let dets = [];  // the details to update

for (let i = 0; i < tab.childElementCount; i++) // goes through all the tables children
    {
    for (let j = 0; j < tab.childNodes[i].childElementCount; j++)   // goes through all the rows children
        {
        let children = tab.childNodes[i].childNodes[j]; // each of the items on the row
        if(children.className === 'inputCell')   // if the child is of type input box
            {
            dets.push(children);    // add the child to the array
            }
        }
    }

let item = []   // getting the final output item
dets.forEach(element => {   // going through each of the details and adding their text content to the item
    item.push(element.textContent);
}); 

wipstable.SetWipArr(wipid, item);   // doing the update
wipstable.SaveFile();   // saving the file
}

export async function CreateHTMLWipTable(wipid = 0)
{
let wipstable = await LoadWipTableFile();
const wiploc = wipstable.findWip(wipid);
console.log("Found wip %d at: %d", wipid, wiploc);

let createBlock = (intable, title, content) => {
    const nrow = intable.insertRow();
    const headcell = document.createElement('th');  // creating the header cell
    headcell.textContent = title;   // setting the text content

    const bodcell = document.createElement('td');   // creating content cell
    bodcell.textContent = content;  // setting the text content
    bodcell.contentEditable = true; // the text can be edited
    bodcell.className = 'inputCell'; // the text can be edited
    bodcell.addEventListener('focusout', (event) => {
        UpdateWip(intable, wipid);
    });

    nrow.appendChild(headcell);
    nrow.appendChild(bodcell);
    intable.appendChild(nrow);
};

// creating the blocks in the table
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

export async function CreateHTMLWipLogView(wipid, year)
{
let stitchlog = await LoadStitchLogFile();
let wiptable = await LoadWipTableFile();
let daysinmo = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];    // number of days in each month
const months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let table = document.getElementById("wipYearView");
let logcells = [];
let logrecords = stitchlog.findRecordsForWip(wipid);    // gets all of the log records for the given wip
const wiploc = wiptable.findWip(wipid);   // finds the wip in the wip table
let entries = [];

if ((toInt(year) % 4) === 0)    // if it is a leap year
    daysinmo[1] = 29;   // set Feb to have 29 days

for (let mon = 0; mon < 12; mon++)  // loop through all months in the year
    AddRow(table, months[mon], daysinmo[mon]);   // adds a row with daysinmo number of cells

let edcells = table.querySelectorAll('td'); // finds all of the cells
for (let i = 0; i < edcells.length; i++)    // loop through all of the editable cells
    if(edcells[i].className !== "blockcell")    // if the class name isn't blockcell
        logcells.push(edcells[i]);  // add the log cells to the cell list

for (let i = 0; i < logcells.length; i++)
    {
    const td = logcells[i];
    td.contentEditable = false;  // the contents of the cells can be changed
    const inp = document.createElement('input');    // creating the input element
    inp.type = "text";  // setting the type of input
    inp.placeholder = (getDateDay(getDateFromScheduleLoc(i, year))).toString();   // setting the number to be shown in temp
    
    inp.onchange = () =>    // setting up the update cell callback
        {
        console.log("Change made");
        stitchlog.UpdateStitchRecordsAt(wipid, getDateFromScheduleLoc(i, year), inp.value); // updates the stitch log with the new information
        }   // To-Do: add the functionality to have a dropdown menu to select the state of the cell

    td.appendChild(inp);    // adds the input to the new cell
    }

console.log(logrecords);
for (let i = 0; i < logrecords.length; i++) 
    {
    if(stitchlog.getRecordYear(logrecords[i]) !== year) // if the year of the record isn't the same year as the input year
        continue;   // move to next record
        
    const recloc = stitchlog.findRecord(logrecords[i]);    // gets the location of the record in the stitch log
    logcells[toInt(getScheduleLoc(stitchlog.recDate[recloc]))].childNodes[0].value = stitchlog.recStatus[recloc];   // setting the cell to be at the correct position and with the record details
    }

if(wiptable.stDate[wiploc] !== 'null')  // if there is a start date
    {
    const mitem = logcells[toInt(getScheduleLoc(wiptable.stDate[wiploc]))];   // getting the node at the start date location
    mitem.removeChild(mitem.childNodes[0]); // removing the input field
    mitem.textContent = 'N';    // setting the cell to be at the start date of the wip with tag 'N'
    }
if(wiptable.finDate[wiploc] !== 'null') // if there is a finish date add this in
    {
    const mitem = logcells[toInt(getScheduleLoc(wiptable.finDate[wiploc]))];  // getting the node at the end date location
    mitem.removeChild(mitem.childNodes[0]); // removing the input field
    mitem.textContent = 'F';    // setting to be the finish cell
    }
}

export async function CreateWipList()
{
let wiptable = await LoadWipTableFile();    // loads the wip table in
const wiplist = document.getElementById("wiplist-content"); // gets the wip list element
const btn = document.getElementById("wiplist-newwip");  // gets the new wip button

let newitem = (wipid, name) => {   // function to create a new list item
    const newref = document.createElement('a'); // creates the new link

    newref.href = "wipview?w=" + wipid; // sets the link as the wip id
    newref.textContent = name;  // sets the content as wip name
    newref.className = "wiplist-content";   // sets the styling class
    newref.id = 'wiplist-item';   // sets the ID of the entry

    wiplist.insertBefore(newref, btn);  // inserts the new item before the button 
};

for (let i = 0; i < wiptable.nowips; i++)   // loop through all of the wips
    {
    newitem(wiptable.wipID[i], wiptable.wipName[i]);   // adds each wip to the list
    }
}

export async function CreateNewWip()
{
const wiptable = await LoadWipTableFile();    // loads the wip table
const container = document.getElementById("container_wiplist");    // loads the wip table

RemoveHTMLElementChildren('wipdetstab');    // removes all the table columns for it to be rebuilt
RemoveHTMLElementChildren('wiplist-content', ['wiplist-newwip']);    // removes all the options in the drop down menu apart from the button

const nID = wiptable.AddWip(-1, "", "", "", "", "", "", "", "");    // adds the new wip

CreateHTMLWipTable(nID);   // recreates the table
await CreateWipList();    // creates the new wip list

wiptable.SaveFile();    // saves the new wip table
}

export async function InitialiseWipView()
{
CreateHTMLWipTable(toInt(GetCurrentWip()));
CreateWipList();
CreateHTMLWipLogView(toInt(GetCurrentWip()), '2024');
}

export async function RemoveCurrentWip(status)
{
const rembtn = document.getElementById('del_wip');

let resetButton = () => {   // resets the button to its origional settings
    rembtn.className = 'btn-rem';
    rembtn.textContent = 'Delete Wip';
    rembtn.onclick = () => {RemoveCurrentWip(0);};
};

switch (status)
    {
    case -1:    // cancel the removal case
        {
        console.log("Cancelling Deletion");
        resetButton();
        break;
        }
    case 0: // show confirm button case
        {
        console.log("Deletion Confirmation Required");
        rembtn.className = 'btn-conf';  // changes the class so that the styling can be updated
        rembtn.textContent = 'Confirm'; // changes the text
        rembtn.onclick = () => {RemoveCurrentWip(1);};  // sets the confirm deletion

        setTimeout(() => {  // creates a timeout so that if the button isn't pressed again after one second deletion is stopped
            resetButton();
        }, 1000);
        break; 
        }
    case 1: // able to remove the wip case
        {
        console.log("Deleting Wip");
        resetButton();

        let wiptable = await LoadWipTableFile();
        const curwip = await GetTitleWip();

        console.log(wiptable, curwip);

        wiptable.RemoveWip(curwip);

        console.log(wiptable);

        wiptable.SaveFile();
        break;
        }
    default:
        break;
    }

}

export async function InitialiseMonthView()
{
let stitchlog = await LoadStitchLogFile();
let wiptable = await LoadWipTableFile();
const mon = GetCurrentMonth();
const yr = GetCurrentYear();
let daysinmo = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];    // number of days in each month
const months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const table = document.getElementById('wipoverview');
let entries = [];

if((yr % 4) === 0)  // accounting for the leap year
    daysinmo[1] = 29;

let recsinmon = stitchlog.findRecordsInMonth(mon, yr);
let wipsinmon = [];
{   // getting all the wips in the month
let wipids = [];
recsinmon.forEach(record => {   // going through each record
    const loc = stitchlog.findRecord(record);   // finds the record
    wipids.push(stitchlog.wipID[loc]); // adds each wip id to the list
});
wipsinmon = wipids.filter((value, index, array) => { return array.indexOf(value) === index; });    // makes the array only have unique values
}


wipsinmon.forEach(wipid => {   // going through each record
    let narr = [];
    narr.fill(0, 0, daysinmo[mon - 1] - 1);  // fills the entries of the array with 0's
    
    for(let i = 0; i < recsinmon.length; i++)   // go through each record in the month
        {
        if(stitchlog.getRecordWipID(recsinmon[i]) === wipid)    // if the record is for the same wip
            {
            const day = getDateDay(stitchlog.getRecordDate(recsinmon[i]));  // gets the day of the date of the record
            narr[day - 1] = stitchlog.recStatus[i]; // adds the record with the record status at the day to the new array
            }
        }
    entries.push(narr); // adds the temp array to the entries
});


{   // adding the day identifier
const nrow = table.insertRow(); // creates the new row
const hcell = document.createElement('th'); // adds the header element
hcell.textContent = 'Day';  // set the content of the header to be day
hcell.rowSpan = 2;  // make it span 2 rows
nrow.appendChild(hcell);

let days = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ];

for (let i = 0; i < daysinmo[mon - 1]; i++)
    {
    const tmpCell = document.createElement('td');   // create the new cell element
    tmpCell.textContent = days[i % 7];    // adding the day to the cell
    nrow.appendChild(tmpCell);
    }
}

{   // sorting out the number row
const nrow = table.insertRow(); // creates the new row

for (let i = 0; i < daysinmo[mon - 1]; i++)
    {
    const tmpCell = document.createElement('td');   // create the new cell element
    tmpCell.textContent = (i + 1).toString();    // adding the date to the cell
    nrow.appendChild(tmpCell);
    }
}

for (let i = 0; i < wipsinmon.length; i++)  // goes through all of the wips
    {
    const nrow = table.insertRow(); // creates the new row
    const hcell = document.createElement('th'); // adds the header element
    const wiptabloc = wiptable.findWip(wipsinmon[i]);   // gets the location of the wip in the wiptable
    hcell.textContent = wiptable.wipName[wiptabloc];  // set the content of the header to be the wip name
    nrow.appendChild(hcell);

    for (let j = 0; j < daysinmo[mon - 1]; j++)
        {
        const tmpCell = document.createElement('td');   // create the new cell element
        
        if (entries[i][j] !== 0)    // if there is an entry
            tmpCell.textContent = entries[i][j];    // set the content of the cell   

        nrow.appendChild(tmpCell);  // adds the cell to the new row
        }
    }
}

export function InitialiseMonthDropDown()
{
const dropcont = document.getElementById('mondropdwn');
const months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

for (let i = 0; i < months.length; i++) // loop through all of the months
    {
    let tmpitem = document.createElement('a');  // create the item element

    tmpitem.href = '/wips/wipoverview?m=' + (i + 1).toString() + '&y=' + GetCurrentYear().toString();   // create the location address
    tmpitem.textContent = months[i];    // set the month text

    dropcont.appendChild(tmpitem);  // add the item to the dropdown
    }

}