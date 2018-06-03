// Add new row
document.querySelector('.newRow').addEventListener('click', addNewRow);
// Calculate the total sum of hours
document.querySelector('.calculateTotal').addEventListener('keyup', calculateTime);

function calculateTime(e) {
    const table = document.querySelector('.table').getElementsByTagName('tbody')[0];
    tableRowNumber = table.childElementCount;
    clickedRow = e.path[1].parentElement.cellIndex;
}


// Add new row to table logic
function addNewRow(e) {
    const table = document.querySelector('.table').getElementsByTagName('tbody')[0];
    tableRowNumber = table.childElementCount;
    clickedRow = e.path[1].parentElement.rowIndex;

    console.log(`Clicked row: ${clickedRow}`);
    console.log(`Max table row number: ${tableRowNumber}`);

    if (clickedRow === tableRowNumber) {
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

        // Add some text to the new cells:
        cell1.innerHTML = `<td>${tableRowNumber + 1}</td>`;
        cell2.innerHTML = '<td><input type="text" name="timesheet[projectNumber]"></td>';
        cell3.innerHTML = '<td type="text" name="timesheet[projectName]"></td>';
        cell4.innerHTML = '<td><input type="text" name="timesheet[projectDescription]"></td>';
        cell5.innerHTML = '<td><input type="number" name="timesheet[mon]"></td>';
        cell6.innerHTML = '<td><input type="number" name="timesheet[tue]"></td>';
        cell7.innerHTML = '<td><input type="number" name="timesheet[wed]"></td>';
        cell8.innerHTML = '<td><input type="number" name="timesheet[thu]"></td>';
        cell9.innerHTML = '<td><input type="number" name="timesheet[fri]"></td>';
        cell10.innerHTML = '<td><input type="number" name="timesheet[sat]"></td>';
        cell11.innerHTML = '<td><input type="number" name="timesheet[sun]"></td>';
        cell12.innerHTML = '<td type="number" name="timesheet[projectTotal]"></td>';
    }
};