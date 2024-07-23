
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

export function getScheduleLoc(dat)
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

// WARNING: unused
// replaces a section of the string (str) with item from start to end
export function ReplaceSection(str, start, end, item) { return str.slice(start - 1, end) + item + str.slice(end + 1); }