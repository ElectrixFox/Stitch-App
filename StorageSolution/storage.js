
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