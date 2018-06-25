// ========================================
// Logic for inputing values into the table
// ========================================

// Add new row
document.querySelector('.timesheetTable').addEventListener('click', addNewRow);
// Calculate the total sum of hours
document.querySelector('.timesheetTable').addEventListener('keyup', calculateTime);
// Delete row
document.querySelector('.timesheetTable').addEventListener('click', deleteRow)

const table = document.querySelector('.timesheetTable');
const tableBody = table.getElementsByTagName('tbody')[0];
const tableFooter = table.getElementsByTagName('tfoot')[0].rows[0];

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
        // if(tableRows === 1){
        //     sumCol = tableBody.rows[0].cells[4].getElementsByTagName('input')[0].value;
        // }
        for (cellRow; cellRow < tableRows; cellRow++) {
            let cellValue = tableBody.rows[cellRow].cells[changeCol]
                .getElementsByTagName('input')[0].value;
            sumCol += Number(cellValue);
        }
        const totalDays = tableFooter.cells[changeCol - 3];
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
    const totalWeek = tableFooter.cells[8];
    totalWeek.innerHTML = sumTotal.toPrecision(3);
}


// Add new row to table logic
function addNewRow(e) {
    const table = document.querySelector('.timesheetTable').getElementsByTagName('tbody')[0];
    let tableRowNumber = table.childElementCount;
    let clickedRow = e.path[1].parentElement.rowIndex;
    let clickedColumn = e.path[1].cellIndex;

    if (clickedRow === tableRowNumber && clickedColumn === 1) {
        // Create an empty <tr> element and add it to the last position of the table:
        let row = table.insertRow();

        // Add cell information:
        let cellsList = [
            `<td>${tableRowNumber + 1}</td>`,
            '<td><input id="projectNumber" type="text" name="timesheet[projectNumber]" autocomplete="nope"></td>',
            '<td><input id="projectName" type="text" name="timesheet[projectName]" disabled autocomplete="nope"></td>',
            '<td><input type="text" name="timesheet[projectDescription]" autocomplete="nope"></td>',
            '<td><input step="0.1" min="0" type="number" id="hours" name="timesheet[mon]" autocomplete="nope"></td>',
            '<td><input step="0.1" min="0" type="number" name="timesheet[tue]" autocomplete="nope"></td>',
            '<td><input step="0.1" min="0" type="number" name="timesheet[wed]" autocomplete="nope"></td>',
            '<td><input step="0.1" min="0" type="number" name="timesheet[thu]" autocomplete="nope"></td>',
            '<td><input step="0.1" min="0" type="number" name="timesheet[fri]" autocomplete="nope"></td>',
            '<td><input step="0.1" min="0" type="number" name="timesheet[sat]" autocomplete="nope"></td>',
            '<td><input step="0.1" min="0" type="number" name="timesheet[sun]" autocomplete="nope"></td>',
            '<td>0</td>',
            '<td><i class="fa fa-fw fa-trash"></i></td>'
        ];

        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        for (let i = 0; i < 13; i++) {
            let cell = row.insertCell(i);
            cell.innerHTML = cellsList[i];
        }
        getProjectName();
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
    let rows = table.getElementsByTagName('tbody')[0].rows;
    let timesheetList = {};
    let projectArr = {};
    for (let i = 0; i < rows.length - 1; i++) {
        let projectNo = rows[i].getElementsByTagName('input')[0].value;
        let projectName = rows[i].getElementsByTagName('input')[1].value;
        let projectDesc = rows[i].getElementsByTagName('input')[2].value;
        let projectTime = parseInt(tableBody.rows[i].cells[11].innerText);

        projectArr = {
            "name": projectName,
            "description": projectDesc,
            "time": projectTime
        };
        timesheetList[projectNo] = projectArr;
    }
    return timesheetList;
}


// ==============
// Logic for server requests
// ==============

import { ServerRequest } from './main.js';
const http = new ServerRequest;

// Get project name after user finishes entering the project number
function getProjectName(){
    console.log('getProjectName called');
    let tableRows = table.getElementsByTagName('tbody')[0].children;
    for (let i = 0; i < tableRows.length; i++) {
        tableRows[i].getElementsByTagName('input')[0].addEventListener('blur', (e) => {
            let clickedRow = e.path[1].parentElement.rowIndex - 1;
            http.get(`${window.location.href}/timesheet/project`)
                .then(data => {
                    tableRows[clickedRow].getElementsByTagName('input')[1].value = data[0];
                })
                .catch(err => console.log(err));
            e.preventDefault();
        });
    }
}



// function getProjectName(e) {
//     const table = document.querySelector('.timesheetTable').getElementsByTagName('tbody')[0];
//     let tableRowNumber = table.childElementCount;
//     let clickedRow = e.path[1].parentElement.rowIndex;
//     let clickedColumn = e.path[1].cellIndex;

//     if (clickedRow === tableRowNumber && clickedColumn === 1) {
//         // Create an empty <tr> element and add it to the last position of the table:
//         let row = table.insertRow();


// Get user
document.querySelector('.btn-save').addEventListener('click', (e) => {
    http.get(`${window.location.href}/timesheet`)
        .then(data => console.log(data))
        .catch(err => console.log(err));
    e.preventDefault();
});



// =======================================
// (GET) Request previous / next timesheet


// =========================
// (POST) Save new timesheet


// ========================================================================
// (PUT) Update the current timesheet and save to server (if not submitted)


// ===========================================================
// (DELETE) Clear the timesheet from server (if not submitted)

