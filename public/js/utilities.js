
// converts a string to an integer
export function toInt(str) { return parseInt(str, 10); }

// -1 is dat1 before dat2, 1 is dat1 after dat2, 0 is when they are the same, -2 is error 
export function DateComp(dat1, dat2)
{
let CalcNumericalDate = (dat) => { return ((10000) * toInt(dat.substring(6, 10)) + (100) * toInt(dat.substring(3, 5)) + toInt(dat.substring(0, 2))); }; // function to calculate the numerical date for comparison
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
export function getDateYear(dat) { return toInt(dat.substring(6, 10)); }

// gets the day part from the date (in the format dd/mm/yyyy)
export function getDateDay(dat) { return toInt(dat.substring(0, 2)); }

export function getScheduleLoc(dat)
{
let daysinmo = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];    // number of days in each month
let month = toInt(dat.substring(3, 5));    // gets month part of the date
const day = toInt(dat.substring(0, 2));    // gets day part of the date
let res = day - 1;  // - 1 as index starts at 0

if ((toInt(getDateYear(dat)) % 4) === 0)    // if it is a leap year
    daysinmo[1] = 29;   // set Feb to have 29 days

for (let i = 0; i < (month - 1); i++) // loops through months (-1 since we don't want to include the current month) until month of given date
    {
    res += daysinmo[i]; // adds days in previous month to the result
    }

return res;
}

export function getDateFromScheduleLoc(loc, year)
{
let daysinmo = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];    // number of days in each month
let month = 0;
let day = loc;
let res = "";

if ((year % 4) === 0)    // if it is a leap year
    daysinmo[1] = 29;   // set Feb to have 29 days

while(day >= daysinmo[month])  // while the number of days is greater than or equal to the number in the next month
    {
    day -= daysinmo[month++]; // subtract the number of days in the month and increment the month number
    }

res = (day + 1).toString().padStart(2, '0') + '/' + (month + 1).toString().padStart(2, '0') + '/' + year; // creating the date in the form dd/mm/yyyy
return res;
}

// WARNING: unused
// replaces a section of the string (str) with item from start to end
export function ReplaceSection(str, start, end, item) { return str.slice(start - 1, end) + item + str.slice(end + 1); }

// gets the host name from the url
export function GetHostURL() { return window.location.host; }