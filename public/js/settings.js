// Dependencies
import { ServerRequest, flashMessage } from './main.js';

// =================================================
// Logic for working with the server database
// =================================================

// Convert the timesheet table values to json
function currSheet() {
    // Remove error message
    document.querySelector('.flashMessage').innerHTML = ""

    let timesheetDate = document.getElementById('timesheetDate').textContent
    let rows = table.getElementsByTagName('tbody')[0].rows;
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

        if (projectNo === "") {
            let message = {
                "state": "error",
                "message": `Empty project numbers are not acceptable. Please check your input.`
            };
            return flashMessage(message);
        } else if (projectName === 'n/a') {
            let message = {
                "state": "error",
                "message": `${projectNo} doesn't exist. Please check your input.`
            };
            return flashMessage(message);
        } else if (projectName === "") {
            let message = {
                "state": "error",
                "message": `Please remove the empty rows.`
            };
            return flashMessage(message);
        } else {
            projectArr.push({
                "projectId": projectId,
                "projectNumber": projectNo,
                "projectName": projectName,
                "description": projectDesc,
                "time": projectTime
            });
        }
    }
    // console.log(projectArr);
    timesheet.timesheet = projectArr;
    console.log(timesheet)
    return timesheet;
}


// ==============
// Logic for server requests
// ==============


const http = new ServerRequest;

// Get project name after user finishes entering the project number
function getProjectName() {
    let tableRows = table.getElementsByTagName('tbody')[0].children;
    for (let i = 0; i < tableRows.length; i++) {
        tableRows[i].getElementsByTagName('input')[0].addEventListener('blur', (e) => {
            let clickedRow = e.path[1].parentElement.rowIndex - 1;
            let inputValue = tableRows[clickedRow].getElementsByTagName('input')[0].value;
            http.get(`${window.location.href}/timesheet/findName/${inputValue}`)
                .then(data => {
                    tableRows[clickedRow].getElementsByTagName('input')[1].value = data.projectName;
                    tableRows[clickedRow].getElementsByTagName('td')[0].id = data._id;
                })
                .catch(err => console.log(err));
            e.preventDefault();
        });
    }
}


// =======================================
// (GET) Request previous / next timesheet


// ========================================================================
// (PUT) Update the current timesheet and save to server (if not submitted)
document.querySelector('.btn-save').addEventListener('click', e => {
    saveTimesheet();
    // currSheet();
    e.preventDefault();
});
function saveTimesheet() {
    let timesheetList = currSheet();
    if (timesheetList) {
        http.put(`${window.location.href}/timesheet/save`, timesheetList)
            .then(res => {
                flashMessage(res);
            })
            .catch(err => {
                const message = { "state": "error", "message": err };
                flashMessage(message);
            })
    }
}


// =========================
// (POST) Submit new timesheet
document.querySelector('.btn-submit').addEventListener('click', e => {
    submitTimesheet();
    e.preventDefault();
});
function submitTimesheet() {
    let timesheetList = currSheet();
    http.post(`${window.location.href}/timesheet/submit`, timesheetList)
        .then(res => {
            let message = {
                "state": "ok",
                "message": res
            };
            flashMessage(message);
        })
        .catch(err => console.log(err))
}
