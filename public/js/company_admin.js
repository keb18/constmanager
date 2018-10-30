// Dependencies
import { ServerRequest, flashMessage } from './main.js';


// Item controller
const ItemCtrl = (function () {
    // Constructor
    const Item = function (desc, code) {
        this.desc = desc;
        this.code = code;
    }

    // Data Structure - State
    const state = {
        items: [
            { code: null, desc: null }
        ],
        currentCode: null,
        currentDesc: null
    }

    // The following are PUBLIC methods
    return {
        getCodes: function(){
            return state.items;
        },
        logData: function () {
            return state;
        }
    }
})();

// UI controller
const UICodeCtrl = (function () {
    
    // The following are PUBLIC methods
    return{
populateCodeList: function(codes){
    let html ='';
    codes.forEach(function(code){
        html += `
        <ul class="list-group">
            <li class="list-group-item">

            </li>
        </ul>
        `;
    })
}
    }
})();



// App controller
const AppCode = (function (CodeCtrl, UICodeCtrl) {
    // The following are PUBLIC methods
    return {
        // init - start app with the data
        init: function () {
            console.log("App is initialised.")

            // Fetch items from server
            const codes = CodeCtrl.getCodes();
            console.log(codes);

            // Populate list with items
            UICodeCtrl.populateCodeList(codes)
        }
    }
    // console.log(CodeCtrl.logData())
})(CodeCtrl, UICodeCtrl);

// Initialise AppCode
AppCode.init()

// =================================================
// Logic for working with the server database
// =================================================

document.querySelector('.add-code').addEventListener('click', addTimesheetCode);

function addTimesheetCode() {
    let status = document.querySelector('.add-timesheet-code').style.visibility;
    if (status === "" || "hidden") {
        document.querySelector('hide1').style.visibility = "visible";
        document.querySelectorAll('edit-code, delete-code, confirm-edit-code, confirm-delete-code').style.visibility = "visible";
    }
}

function myFunction() {
    var x = document.getElementsByClassName("example");
    var i;
    for (i = 0; i < x.length; i++) {
        x[i].style.backgroundColor = "red";
    }
}

/* <input type="button" id="toggler" value="Toggler" onClick="action();" />
<input type="button" id="togglee" value="Togglee" />

<script>
    var hidden = false;
    function action() {
        hidden = !hidden;
        if(hidden) {
            document.getElementById('togglee').style.visibility = 'hidden';
        } else {
            document.getElementById('togglee').style.visibility = 'visible';
        }
    }
</script> */

// =========================
// Logic for server requests
// =========================
const http = new ServerRequest;

