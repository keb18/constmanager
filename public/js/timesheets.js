// Dependencies
import { ServerRequest, flashMessage } from './main.js';

// ========================================
// Logic for inputing values into the table
// ========================================

const table = document.querySelector('.timesheetTable');
const tableBody = table.getElementsByTagName('tbody')[0];
const tableFooter = table.getElementsByTagName('tfoot')[0].rows[0];

// Add new row
document.querySelector('.add-row').addEventListener('click', addNewRow);
// Calculate the total sum of hours
table.addEventListener('keyup', calculateTime);
// Delete row
table.addEventListener('click', deleteRow)
// Add event listener to the first row
let tableRows = tableBody.children;
tableRows[0].getElementsByTagName('input')[0].addEventListener('blur', getProjectName);

// Update cells for the time spent
function calculateTime(e) {
    // Find the row/column where changes are made
    let changeRow = e.path[1].parentElement.rowIndex;
    let changeCol = e.path[1].cellIndex;

    updateProjectTime(changeRow);
    updateDayTime(changeCol);
    updateTotalTime();
}

function deleteRow(e) {
    let rowToDelete = e.path[1].parentElement.rowIndex;
    let changeCol = e.path[1].cellIndex;
    if (changeCol === 12 && rowToDelete > 0) {
        document.querySelector('.timesheetTable').deleteRow(rowToDelete);
        for (let currentCol = 4; currentCol < 11; currentCol++) {
            updateDayTime(currentCol);
        }
        updateTotalTime();
        rowRenumber();
    }
}

// Logic for updating the total project hours
function updateProjectTime(changeRow) {
    let sumRow = 0;
    let cellCol = 4
    for (cellCol; cellCol < 11; cellCol++) {
        let cellValue = tableBody.rows[changeRow - 1].cells[cellCol]
            .getElementsByTagName('input')[0].value;
        sumRow += Number(cellValue);
    }
    const totalProject = tableBody.rows[changeRow - 1].cells[11];
    totalProject.innerHTML = sumRow.toPrecision(3);
}


// Logic for updating the total day hours
function updateDayTime(changeCol) {
    let tableRows = tableBody.rows.length;
    let sumCol = 0;
    let cellRow = 0
    if (changeCol > 3) {
        for (cellRow; cellRow < tableRows; cellRow++) {
            let cellValue = tableBody.rows[cellRow].cells[changeCol]
                .getElementsByTagName('input')[0].value;
            sumCol += Number(cellValue);
        }
        const totalDays = tableFooter.cells[changeCol - 2];
        totalDays.innerHTML = sumCol.toPrecision(3);
    }
}


// Update the total time spent this week
function updateTotalTime() {
    let tableRows = tableBody.rows.length;
    let sumTotal = 0;
    let cellRow = 0
    for (cellRow; cellRow < tableRows; cellRow++) {
        let cellValue = tableBody.rows[cellRow].cells[11].innerHTML;
        sumTotal += Number(cellValue);
    }
    const totalWeek = tableFooter.cells[9];
    totalWeek.innerHTML = sumTotal.toPrecision(3);
}

// Add new row to table logic
function addNewRow() {
    const table = document.querySelector('.timesheetTable').getElementsByTagName('tbody')[0];
    let tableRowNumber = table.childElementCount;
    // let clickedRow = e.path[1].parentElement.rowIndex;
    // let clickedColumn = e.path[1].cellIndex;

    if (tableRowNumber > 0) {
        // Create an empty <tr> element and add it to the last position of the table:
        let row = table.insertRow();

        // Add cell information:
        let cellsList = [
            `<td>${tableRowNumber + 1}</td>`,
            '<td><input id="projectNumber" type="text" name="timesheet[projectNumber]" autocomplete="nope"></td>',
            '<td><input id="projectName" type="text" name="timesheet[projectName]" disabled autocomplete="nope"></td>',
            '<td><input type="text" name="timesheet[projectDescription]" autocomplete="nope"></td>',
            '<td><input step="0.1" min="0" type="number" id="hours" name="timesheet[mon]" autocomplete="nope" value="0"></td>',
            '<td><input step="0.1" min="0" type="number" name="timesheet[tue]" autocomplete="nope" value="0"></td>',
            '<td><input step="0.1" min="0" type="number" name="timesheet[wed]" autocomplete="nope" value="0"></td>',
            '<td><input step="0.1" min="0" type="number" name="timesheet[thu]" autocomplete="nope" value="0"></td>',
            '<td><input step="0.1" min="0" type="number" name="timesheet[fri]" autocomplete="nope" value="0"></td>',
            '<td><input step="0.1" min="0" type="number" name="timesheet[sat]" autocomplete="nope" value="0"></td>',
            '<td><input step="0.1" min="0" type="number" name="timesheet[sun]" autocomplete="nope" value="0"></td>',
            '<td>0</td>',
            '<td><i class="fa fa-fw fa-trash"></i></td>',
        ];

        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        for (let i = 0; i < 13; i++) {
            let cell = row.insertCell(i);
            cell.innerHTML = cellsList[i];
        }
        // getProjectName();
        let newTableRowNumber = table.childElementCount;
        // console.log(newTableRowNumber);
        tableRows[newTableRowNumber - 1].getElementsByTagName('input')[0].addEventListener('blur', getProjectName);
    }
};

// Renumber the rows after row is deleted
function rowRenumber() {
    let tableRows = tableBody.rows.length;
    let cellRow = 0;
    for (cellRow; cellRow < tableRows; cellRow++) {
        let cell = tableBody.rows[cellRow].cells[0]
        cell.innerHTML = cellRow + 1;
    }
}

// =================================================
// Logic for working with the server database
// =================================================

// Convert the timesheet table values to json
function currSheet() {
    // Remove error message
    document.querySelector('.flashMessage').innerHTML = ""

    let timesheetDate = document.getElementById('timesheetDate').textContent
    let rows = table.getElementsByTagName('tbody')[0].rows;
    // console.log(rows)
    // let status = { "status": "open" }

    let timesheet = {
        "timesheetDate": timesheetDate,
        "status": "open"
    };
    let projectArr = [];

    for (let i = 0; i < rows.length; i++) {
        let projectId = rows[i].getElementsByTagName('td')[0].id
        let projectNo = rows[i].getElementsByTagName('input')[0].value;
        let projectName = rows[i].getElementsByTagName('input')[1].value;
        let projectDesc = rows[i].getElementsByTagName('input')[2].value;
        let projectTime = parseInt(tableBody.rows[i].cells[11].innerText);
        let mon = parseInt(rows[i].getElementsByTagName('input')[3].value)
        let tue = parseInt(rows[i].getElementsByTagName('input')[4].value)
        let wed = parseInt(rows[i].getElementsByTagName('input')[5].value)
        let thu = parseInt(rows[i].getElementsByTagName('input')[6].value)
        let fri = parseInt(rows[i].getElementsByTagName('input')[7].value)
        let sat = parseInt(rows[i].getElementsByTagName('input')[8].value)
        let sun = parseInt(rows[i].getElementsByTagName('input')[9].value)

        projectArr.push({
            "projectId": projectId,
            "projectNumber": projectNo,
            "projectName": projectName,
            "description": projectDesc,
            "time": projectTime,
            "dayHours": {
                "mon": mon,
                "tue": tue,
                "wed": wed,
                "thu": thu,
                "fri": fri,
                "sat": sat,
                "sun": sun
            }
        });
    }
    // console.log(projectArr);
    timesheet.timesheet = projectArr;
    // console.log(timesheet)
    return timesheet;
}


// =========================
// Logic for server requests
// =========================
const http = new ServerRequest;

//===================================================================
// (GET) project name after user finishes entering the project number
function getProjectName(e) {
    let clickedRow = e.path[1].parentElement.rowIndex - 1;
    let inputValue = tableRows[clickedRow].getElementsByTagName('input')[0].value;
    http.get(`${window.location.href}/timesheet/findName/${inputValue}`)
        .then(data => {
            tableRows[clickedRow].getElementsByTagName('input')[1].value = data.projectName;
            tableRows[clickedRow].getElementsByTagName('td')[0].id = data._id;
        })
        .catch(err => {
            const message = { "state": "error", "message": err };
            flashMessage(message);
        });
    e.preventDefault();
}


// ====================
// (GET) Last timesheet and populate the fields
document.querySelector('.timesheet-btn').addEventListener('click', e => {
    deleteAllRows();
    disableNavButton(".nextSheet");
    enableNavButton(".previousSheet")
    getLastTimesheet();
    e.preventDefault();
});

function getLastTimesheet() {
    http.get(`${window.location.href}/timesheet/last`)
        .then(res => populateTimesheet(res))
        .catch(err => {
            const message = { "state": "error", "message": err };
            flashMessage(message);
        });
}


// ============================
// (GET) Request next timesheet
document.querySelector('.nextSheet').addEventListener('click', e => {
    console.log("Next timesheet clicked");
    // currDate = document.getElementById('timesheetDate').innerHTML
});

// (POST) Request previous timesheet
document.querySelector('.previousSheet').addEventListener('click', e => {
    // deleteAllRows();
    enableNavButton(".nextSheet")
    getPreviousTimesheet();
    e.preventDefault();
});

function getPreviousTimesheet() {
    let timesheet = currSheet();
    http.post(`${window.location.href}/timesheet/previous`, timesheet)
        .then(res => {
            if (res.status) {
                populateTimesheet(res)
            } else {
                disableNavButton(".previousSheet");
                flashMessage(res);
            }
        })
        .catch(err => {
            // Log the err separately to user error log - future implementation
            let message = { "state": "error", "message": "There was a problem with the server." };
            flashMessage(message);
        })
}

// Activate the nav button
const enableNavButton = (selector) => document.querySelector(selector).classList.remove('disabled');
// Deactivate nav button when reaching one end
const disableNavButton = (selector) => document.querySelector(selector).classList.add('disabled');

// Delete rows if more than 1 row available
function deleteAllRows() {
    let rowsToDelete = tableBody.children.length;
    if (rowsToDelete > 1) {
        for (let i = 1; i < rowsToDelete; i++) {
            tableBody.deleteRow(1);
        }
    }
}



function populateTimesheet(timesheet) {
    let timesheetLength = timesheet.timesheet.length;
    let rows = table.getElementsByTagName('tbody')[0].rows;

    document.getElementById('timesheetDate').innerHTML = timesheet.timesheetDate;

    for (let i = 0; i < timesheetLength; i++) {
        if (i > 0) { addNewRow() };
        rows[i].getElementsByTagName('input')[0].value = timesheet.timesheet[i].projectNumber;
        rows[i].getElementsByTagName('input')[1].value = timesheet.timesheet[i].projectName;
        rows[i].getElementsByTagName('input')[2].value = timesheet.timesheet[i].description;

        let weekDays = { 1: "mon", 2: "tue", 3: "wed", 4: "thu", 5: "fri", 6: "sat", 7: "sun" }

        for (let j = 3; j < 10; j++) {
            let cell = rows[i].getElementsByTagName('input')[j]
            cell.value = parseInt(timesheet.timesheet[i].dayHours[weekDays[j - 2]]);
            updateDayTime(j + 1);
        }
        updateProjectTime(i + 1);
    }
    updateTotalTime();
}


// ========================================================================
// (PUT) Update the current timesheet and save to server (if not submitted)
document.querySelector('.btn-save-timesheet').addEventListener('click', e => {
    saveTimesheet();
    e.preventDefault();
});
function saveTimesheet() {
    let timesheetList = currSheet();
    console.log(timesheetList)
    let listLength = timesheetList.timesheet.length;
    let timesheet = timesheetList.timesheet;
    let check = "false";

    for (let i = 0; i < listLength; i++) {
        if (timesheet.projectId === "") {
            check = "false";
            let message = {
                "state": "error",
                "message": `Empty project numbers are not acceptable. Please check your input.`
            };
            return flashMessage(message);
        } else if (timesheet.projectName === 'n/a') {
            check = "false";
            let message = {
                "state": "error",
                "message": `${projectNo} doesn't exist. Please check your input.`
            };
            return flashMessage(message);
        } else if (timesheet.projectName === "") {
            check = "false";
            let message = {
                "state": "error",
                "message": `Please remove the empty rows.`
            };
            return flashMessage(message);
        } else {
            check = "true";
        }
    }

    if (timesheetList && check === "true") {
        http.put(`${window.location.href}/timesheet/save`, timesheetList)
            .then(res => {
                flashMessage(res);
            })
            .catch(err => {
                let message = { "state": "error", "message": err };
                flashMessage(message);
            })
    }
}


// ===========================
// (POST) Submit new timesheet
document.querySelector('.btn-submit-timesheet').addEventListener('click', e => {
    submitTimesheet();
    e.preventDefault();
});
function submitTimesheet() {
    let timesheetList = currSheet();
    http.post(`${window.location.href}/timesheet/submit`, timesheetList)
        .then(res => {
            let message = { "state": "ok", "message": res };
            flashMessage(message);
        })
        .catch(err => {
            let message = { "state": "error", "message": err };
            flashMessage(message);
        })
}

// ===================================
// (POST) Create a new empty timesheet
document.querySelector('.btn-new-timesheet').addEventListener('click', e => {
    newTimesheet();
    e.preventDefault();
});

function newTimesheet() {
    http.post(`${window.location.href}/timesheet/new`)
        .then(res => {
            populateTimesheet(res.timesheet);
            flashMessage(res.msg);
            // document.getElementById('timesheetDate').innerHTML = res.date;
        })
        .catch(err => {
            let message = { "state": "error", "message": err };
            flashMessage(message);
        })
}

