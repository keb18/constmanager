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
    changeRow = e.path[1].parentElement.rowIndex;
    changeCol = e.path[1].cellIndex;

    updateProjectTime(changeRow);
    updateDayTime(changeCol);
    updateTotalTime();
}

function deleteRow(e) {
    rowToDelete = e.path[1].parentElement.rowIndex;
    changeCol = e.path[1].cellIndex;
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
    tableRowNumber = table.childElementCount;
    clickedRow = e.path[1].parentElement.rowIndex;
    clickedColumn = e.path[1].cellIndex;

    if (clickedRow === tableRowNumber && clickedColumn === 1) {
        // Create an empty <tr> element and add it to the last position of the table:
        let row = table.insertRow();

        // Add cell information:
        let cellsList = [
            `<td>${tableRowNumber + 1}</td>`,
            '<td><input type="text" name="timesheet[projectNumber]" autocomplete="nope"></td>',
            '<td><input type="text" name="timesheet[projectName]" disabled autocomplete="nope"></td>',
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
        for (i = 0; i < 13; i++) {
            let cell = row.insertCell(i);
            cell.innerHTML = cellsList[i];
        }
    }
};

// Renumber the rows after row is deleted
function rowRenumber() {
    let tableRows = tableBody.rows.length;
    let cellRow = 0;
    for (cellRow; cellRow < tableRows; cellRow++) {
        cell = tableBody.rows[cellRow].cells[0]
        cell.innerHTML = cellRow + 1;
    }
}

// =================================================
// Logic for working with the server database
// =================================================

// Convert the timesheet table values to json
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


// Find the project name from the project number


function timesheetReq() {
    this.http = new XMLHttpRequest();
}

// Find the project name from the project number
timesheetReq.prototype.get = function(url, e) {
    this.http.open('GET', url, true);

    let self = this;
    this.http.onload = function(){
        if(self.http.status === 200){
            console.log(self.http.responseText);
        }
    }
    this.http.send();
    e.preventDefault();
}
// Save the timesheet to server

// Edit the timesheet and save to server

// Delete the timesheet from server (only if not submitted)

const http = new timesheetReq;

document.querySelector('.btn-save').addEventListener('click', function(){
    http.get(`${window.location.href}/timesheet/project`);
});





// // Find the project name from the project number
// document.querySelector('.btn-save').addEventListener('click', getProjectName);

// function getProjectName(e) {
//     const xhr = new XMLHttpRequest();

//     xhr.open('GET', `${window.location.href}/timesheet/project`, true);
//     xhr.withCredentials = true;
//     xhr.onload = function() {
//         if(this.status === 200){
//             const response = JSON.parse(this.responseText);
//             console.log(response)
//         }
//     }
//     xhr.send();
//     e.preventDefault();
// }

// // Find the project name from the project number
// document.querySelector('.btn-save').addEventListener('click', getProjectName);
// function getProjectName() {
//     fetch(window.location.href + '/timesheet/project', { credentials: 'include' })
//     .then(res => res.json())
//     .then(data => console.log(data.response));
// }


// // Find the project name from the project number
// class Timesheet {
//     getProject(url) {
//         return new Promise((resolve, reject) => {
//             fetch(url, { credentials: 'same-origin' })
//                 .then(res => res.json())
//                 .then(data => resolve(data))
//                 .catch(err => reject(err));
//         });
//     }
// }

// const timesheet = new Timesheet;
// // Get project name
// document.querySelector('.btn-save').addEventListener('click', function () {
//     timesheet.getProject(window.location.href + '/timesheet/project')
//     .then(data => console.log(data.response))
//     .catch(err => console.log(err));
//     // console.log(project);
// });




// Fetch information from the database
function getUserTimes() {
    fetch(window.location.href + '/timesheets')//'http://127.0.0.1:3000/5aff2106ee464f54902b0297/user/5aff2106ee464f54902b0296')
}

// Save to database

function getUserTimes() {
    fetch(window.location.href + '/timesheets')//'http://127.0.0.1:3000/5aff2106ee464f54902b0297/user/5aff2106ee464f54902b0296')
}

