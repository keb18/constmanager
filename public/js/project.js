// Add new project when user clicks on the last table row
let addProject = document.getElementById("addProject");
addProject.addEventListener("click", function(){
    document.location.href = '/dashboard/new';
});

// Back anchor link
function goBack() {
    window.history.back();
}