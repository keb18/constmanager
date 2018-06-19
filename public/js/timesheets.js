// Add new row
document.querySelector('.table').addEventListener('click', addNewRow);
// Calculate the total sum of hours
document.querySelector('.table').addEventListener('keyup', calculateTime);
// Delete row
document.querySelector('.table').addEventListener('click', deleteRow)

const table = document.querySelector('.table');
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
        document.querySelector('.table').deleteRow(rowToDelete);
        for (let currentCol = 4; currentCol < 11; currentCol++) {
            updateDayTime(currentCol);
        }
        updateTotalTime();
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
        console.log(`Selected row: ${cellValue}`);
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


// Logic for updating the total time spent this week
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
    const table = document.querySelector('.table').getElementsByTagName('tbody')[0];
    tableRowNumber = table.childElementCount;
    clickedRow = e.path[1].parentElement.rowIndex;
    clickedColumn = e.path[1].cellIndex;

    if (clickedRow === tableRowNumber && clickedColumn === 1) {
        // Create an empty <tr> element and add it to the last position of the table:
        let row = table.insertRow();

        // Add cell information:
        let cellsList = [
            `<td>${tableRowNumber + 1}</td>`,
            '<td><input type="text" name="timesheet[projectNumber]"></td>',
            '<td type="text" name="timesheet[projectName]"></td>',
            '<td><input type="text" name="timesheet[projectDescription]"></td>',
            '<td><input step="0.1" min="0" type="number" id="hours" name="timesheet[mon]"></td>',
            '<td><input step="0.1" min="0" type="number" name="timesheet[tue]"></td>',
            '<td><input step="0.1" min="0" type="number" name="timesheet[wed]"></td>',
            '<td><input step="0.1" min="0" type="number" name="timesheet[thu]"></td>',
            '<td><input step="0.1" min="0" type="number" name="timesheet[fri]"></td>',
            '<td><input step="0.1" min="0" type="number" name="timesheet[sat]"></td>',
            '<td><input step="0.1" min="0" type="number" name="timesheet[sun]"></td>',
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