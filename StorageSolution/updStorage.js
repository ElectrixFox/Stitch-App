
/* 
Tables
WIPS (wipID, startDate, finishDate, ...)
STITCHLOG (stlogID, wipID, status, date, ...)
status: Stitched (S), Finished (F), F Finished (FFO), New Start (N)
*/

class WIPTable
    {
    
    constructor(wipIDs, startDates, finishDates)
    {
    this.wipIDs = wipIDs;
    this.startDates = startDates;
    this.finishDates = finishDates;
    }

    FindWIP(wipID)
    {
    let loc = -1;

    // search through all of the WIPs to find the given WIP
    for (let i = 0; i < this.wipIDs.length; i++) 
        {
        // if it finds the WIP
        if (this.wipIDs[i] === wipID)
            {
            loc = i;
            }
        }

    return loc;
    }
    
    UpdateWIP(wipID, newStartDate, newFinishDate)
    {
    let loc = this.FindWIP(wipID);
    
    // if the WIP has been found update the record
    if (loc != -1)
        {
        this.startDates[loc] = newStartDate;
        this.finishDates[loc] = newFinishDate;
        }
    else
        {
        // output error message
        console.error("Error: Cannot find WIP");
        }
    }

    /* get wipIDs() { return this.wipIDs; }
    set wipIDs(value) { this.wipIDs = value; } */
    
    RemoveWIP(wipID)
    {
    let loc = this.FindWIP(wipID);
    
    // if the WIP is found remove it
    if(loc != -1)
        {
        this.wipIDs.splice(loc, 1);
        this.startDates.splice(loc, 1);
        this.finishDates.splice(loc, 1);
        }
    }

    }


// Function to save WIPTable to a JSON file
function WriteFile(filename, wipTable) {
    const data = JSON.stringify(wipTable);
    fs.writeFileSync(filename, data, 'utf8');
}

// Function to load WIPTable from a JSON file
function LoadFile(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    const parsedData = JSON.parse(data);
    return new WIPTable(parsedData.wipIDs, parsedData.startDates, parsedData.finishDates);
}

function InitialiseWIPTable()
{
// Example usage:
const wipTable = new WIPTable(['wip1', 'wip2'], ['2024-01-01', '2024-01-02'], ['2024-01-10', '2024-01-12']);
WriteFile('wipTable.json', wipTable);

const loadedWipTable = LoadFile('wipTable.json');
console.log(loadedWipTable);
}

function LoadWIPTable()
{
// loads in the WIP table file
data = LoadFile("uploads/wiprecord.json");


// saves the table to a global table variable
}

function WriteWIPTable()
{
// loads the table from a global table variable
// writes in the WIP table file
}

function LoadStitchLogTable()
{
// loads in the Stitch Log table file
// saves the table to a global table variable
}

function WriteStitchLogTable()
{
// loads the table from a global table variable
// writes in the Stitch Log table file
}