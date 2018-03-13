// Toggle profile window
let userBoard = $("#userBoard");
//let displayValue = false;

$("#profile").click(function(){
    userBoard.css("display","flex");
    //displayValue = true;
//.animate({up: '292px'})
});

$("#closeUserBoard").click(function(){
   userBoard.hide();
   //displayValue = false;
});

/*if (displayValue === true){
$("#wrapper").click(function(){
    userBoard.hide();
    displayValue = false;
});
}*/

//Set width and height of overlay + open chatMmodal

$(".openChat").click(function(){
    let buttonId = $(this).attr("id");
    let messageArea = $("#list-of-messages");
    let title = $(".chatRoomTitle");
    console.log(buttonId);
    $(".overlay").css("height", $("#wrapper").height()).css("display", "flex");
    if (buttonId === "room0"){
        $(".chatModal").css("background", "url('../images/Nature.jpg')").css("background-size", "cover");
        title.text("Nature");
    }
    else if (buttonId === "room1"){
        $(".chatModal").css("background", "url('../images/Fitness.jpg')").css("background-size", "cover");
        title.text("Fitness");
    }
    else{
        $(".chatModal").css("room2", "url('../images/MOL.jpg')").css("background-size", "cover");
        title.text("Meaning of Life");
    }

    //$(".userMessageBox").last().attr("id", "elementToScrollTo"); Scrollar ner till sista elementet...
    messageArea.scrollTop($("#elementToScrollTo").position().top);
});

//Close chatModal
$("#closeModal").click(function(){
    $(".overlay").css("display", "none");
});