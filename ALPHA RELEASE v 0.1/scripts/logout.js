$(document).ready(function(){
    setTimeout(function() {
        let tempUser = localStorage.getItem("user");
        localStorage.removeItem("user");
        $("#test").val(tempUser);
        $("#del").submit();
    },3000);
});