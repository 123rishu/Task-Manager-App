// var today = new Date();
// var dd = String(today.getDate()).padStart(2, '0');
// var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
// var yyyy = today.getFullYear();
// today = mm + '/' + dd + '/' + yyyy;
// //document.write(today);
// console.log(today);

// var tomDate = new Date();
// tomDate.setDate(tomDate.getDate()+1);
// console.log(tomDate);

var first = '2012-11-03';
var second = '2012-11-03';

// if (new Date(first) > new Date(second) ){
//     console.log("First greater");
// }
// else if(new Date(first) < new Date(second) ){
//     console.log("Second greater");
// }
// else{
//     console.log("equal");
// }

//console.log(tomDate);

function chooseModalFilterAdvance(){
    if(currDueDate == today){
        selectedFilter = "green";
    }
}