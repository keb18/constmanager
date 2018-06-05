// Add new row
document.querySelector('.table').addEventListener('click', addNewRow);
// Calculate the total sum of hours
document.querySelector('.table').addEventListener('keyup', calculateTime);
// Delete row
document.querySelector('.table').addEventListener('click', deleteRow)

function deleteRow(e){
    rowToDelete = e.path[1].parentElement.rowIndex;
    changeCol = e.path[1].cellIndex;
    if(changeCol === 12 && rowToDelete > 0){
        document.querySelector('.table').deleteRow(rowToDelete);
    }
}

// Calculate time spent
function calculateTime(e) {
    const table = document.querySelector('.table');
    const tableBody = table.getElementsByTagName('tbody')[0];
    const tableFooter = table.getElementsByTagName('tfoot')[0].rows[0];

    // Find the row/column where changes are made
    changeRow = e.path[1].parentElement.rowIndex;
    changeCol = e.path[1].cellIndex;

    // Logic for updating the total project hours
    let sumRow = 0;
    for (var cellCol = 4; cellCol < 11; cellCol++) {
        let cellValue = tableBody.rows[changeRow - 1].cells[cellCol]
            .getElementsByTagName('input')[0].value;

        sumRow += Number(cellValue);
    }
    const totalProject = tableBody.rows[changeRow - 1].cells[11];
    totalProject.innerHTML = sumRow.toPrecision(3);

    // Logic for updating the total day hours
    let sumCol = 0;
    tableRowNumber = tableBody.rows.length;
    if (changeCol > 3) {
        for (var cellRow = 0; cellRow < tableRowNumber; cellRow++) {
            let cellValue = tableBody.rows[cellRow].cells[changeCol]
                .getElementsByTagName('input')[0].value;

            sumCol += Number(cellValue);
        }
        const totalDays = tableFooter.cells[changeCol - 3];
        totalDays.innerHTML = sumCol.toPrecision(3);
    }

    // Logic for updating the total time spent this week
    let sumTotal = 0;
    for (var cellRow = 0; cellRow < tableRowNumber; cellRow++) {
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
        var row = table.insertRow();

        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);
        var cell8 = row.insertCell(7);
        var cell9 = row.insertCell(8);
        var cell10 = row.insertCell(9);
        var cell11 = row.insertCell(10);
        var cell12 = row.insertCell(11);
        var cell12 = row.insertCell(12);

        // Add some text to the new cells:
        cell1.innerHTML = `<td>${tableRowNumber + 1}</td>`;
        cell2.innerHTML = '<td><input type="text" name="timesheet[projectNumber]"></td>';
        cell3.innerHTML = '<td type="text" name="timesheet[projectName]"></td>';
        cell4.innerHTML = '<td><input type="text" name="timesheet[projectDescription]"></td>';
        cell5.innerHTML = '<td><input step="0.1" min="0" type="number" id="hours" name="timesheet[mon]"></td>';
        cell6.innerHTML = '<td><input step="0.1" min="0" type="number" name="timesheet[tue]"></td>';
        cell7.innerHTML = '<td><input step="0.1" min="0" type="number" name="timesheet[wed]"></td>';
        cell8.innerHTML = '<td><input step="0.1" min="0" type="number" name="timesheet[thu]"></td>';
        cell9.innerHTML = '<td><input step="0.1" min="0" type="number" name="timesheet[fri]"></td>';
        cell10.innerHTML = '<td><input step="0.1" min="0" type="number" name="timesheet[sat]"></td>';
        cell11.innerHTML = '<td><input step="0.1" min="0" type="number" name="timesheet[sun]"></td>';
        cell12.innerHTML = '<td>0</td>';
        cell12.innerHTML = '<td><i class="fa fa-fw fa-trash"></i></td>';
    }
};