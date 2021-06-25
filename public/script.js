let allFilterTags = document.querySelectorAll(".ticket-filters div");
let arrangeBtn = document.querySelector(".arrange-btn");
arrangeBtn.addEventListener("click", arrangeDB);
let ticketContainer = document.querySelector(".tickets-container");
let openModalBtn = document.querySelector(".open-modal");
let closeModalBtn = document.querySelector(".close-modal");
let templateText = "Enter your task here";

function getToday() {
    const today = new Date();
    today.setDate(today.getDate()); // even 32 is acceptable
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};
let today = getToday();

function getTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate()+1); // even 32 is acceptable
    return `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
};
let tomDate = getTomorrow();

function DAgetTomorrow() {
    const DAtomorrow = new Date();
    DAtomorrow.setDate(DAtomorrow.getDate() + 2); // even 32 is acceptable
    return `${DAtomorrow.getFullYear()}-${String(DAtomorrow.getMonth() + 1).padStart(2, '0')}-${String(DAtomorrow.getDate()).padStart(2, '0')}`;
};
let DAtomDate = DAgetTomorrow();
let currDueDate;
let selectedFilter;

let obj = {
    "red": "#ff0707",
    "orange": "#FFA500",
    "green": "#00ff15",
    "black": "#191919"
}

function loadTickets() {
    if (localStorage.getItem("allTickets")) {
        ticketContainer.innerHTML = "";
        let allTickets = JSON.parse(localStorage.getItem("allTickets"));
        console.log(allTickets);
        updateDB(allTickets);
    }
}
loadTickets();

function updateDB(allTickets){
    let newAllTickets = [];
    for(let i=0;i<allTickets.length;i++){
        let ticketObj = allTickets[i];
        if (new Date(ticketObj.ticketDueDate) < new Date(today) ){
            ticketObj.ticketFilter = "black";
        }
        else if(new Date(ticketObj.ticketDueDate) > new Date(tomDate) ){
            ticketObj.ticketFilter = "green";
        }
        else if((new Date(ticketObj.ticketDueDate) > new Date(today)) && (new Date(ticketObj.ticketDueDate) < new Date(DAtomDate))){
            ticketObj.ticketFilter = "orange";
        }
        else{
            ticketObj.ticketFilter = "red";
        }
        newAllTickets.push(ticketObj);
    }
    localStorage.setItem("allTickets", JSON.stringify(newAllTickets));
    appendDBElementsOnUI();
}

function appendDBElementsOnUI(){
    if (localStorage.getItem("allTickets")) {
        ticketContainer.innerHTML = "";
        let allTickets = JSON.parse(localStorage.getItem("allTickets"));
        // console.log(allTickets);
        for (let i = 0; i < allTickets.length; i++) {
            let { ticketId, isLocked, ticketFilter, ticketContent, ticketDueDate } = allTickets[i];
            let ticketDiv = createTicket(ticketId, isLocked, ticketFilter, ticketContent, ticketDueDate);
            let deleteBtn = ticketDiv.querySelector(".delete-btn");
            ticketDiv.querySelector(".lock").addEventListener("click", toggleLockIcon);
            if(deleteBtn){
                deleteBtn.addEventListener("click", handleTicketDelete);
            }
            ticketContainer.append(ticketDiv);
        }
    }
}

function createTicket(ticketId, isLocked, ticketFilter, ticketContent, ticketDueDate) {
    let ticketDiv = document.createElement("div");
    ticketDiv.classList.add("realTicketBox");
    if(isLocked == "false"){
        ticketDiv.innerHTML = `<div class="ticket-header ${ticketFilter}"></div>
                <div class="ticket-info">
                    <div class="ticket-due-date">due date:${ticketDueDate}</div>
                    <div class="ticket-delete">
                        <i class="lock fas fa-lock-open unlock-btn" id=${ticketId}></i>
                        <i class="fas fa-trash-alt delete-btn" id=${ticketId}></i>
                    </div>
                </div>
                <div class="realText">${ticketContent}</div>`;
    }
    else{
        ticketDiv.innerHTML = `<div class="ticket-header ${ticketFilter}"></div>
                <div class="ticket-info">
                    <div class="ticket-due-date">due date:${ticketDueDate}</div>
                    <div class="ticket-delete">
                        <i class="lock fas fa-lock" id=${ticketId}></i>
                        <i class="fas fa-trash-alt delete-btn hide" id=${ticketId}></i>
                    </div>
                </div>
                <div class="realText">${ticketContent}</div>`;
    }
    
    return ticketDiv;
}

openModalBtn.addEventListener("click", handleOpenModal);
closeModalBtn.addEventListener("click", handleCloseModal);
//ticketDelete.addEventListener("click", handleTicketDelete);

function toggleTicketFilter(e) {
    let filters = ["red", "blue", "green", "black"];
    let currFilter = e.target.classList[1];
    let idx = filters.indexOf(currFilter);
    idx++;
    idx = idx % filters.length;
    let currTicketHeader = e.target;
    currTicketHeader.classList.remove(currFilter);
    currTicketHeader.classList.add(filters[idx]);

    let allTickets = JSON.parse(localStorage.getItem("allTickets"));
    let id = currTicketHeader.nextElementSibling.children[0].textContent.split("#")[1];
    //console.log(id);

    for (let i = 0; i < allTickets.length; i++) {
        if (allTickets[i].ticketId == id) {
            allTickets[i].ticketFilter = filters[idx];
            break;
        }
    }

    localStorage.setItem("allTickets", JSON.stringify(allTickets));
}

function handleTicketDelete(e) {
    //console.log(e.target.id);
    let ticketToBeDeleted = e.target.id;
    let allTickets = JSON.parse(localStorage.getItem("allTickets"));
    let filteredTickets = allTickets.filter(function (curTicketObj) {
        return curTicketObj.ticketId != ticketToBeDeleted;
    })
    localStorage.setItem("allTickets", JSON.stringify(filteredTickets));
    loadTickets();
}

function handleCloseModal() {
    if (document.querySelector(".ticket-box")) {
        document.querySelector(".ticket-box").remove();
    }
}

let currModalDiv;

function handleOpenModal() {
    let modal = document.querySelector(".ticket-box");
    if (modal) {
        return;
    }
    let modalDiv = createModal();
    currModalDiv = modalDiv;
    modalDiv.querySelector(".submit-due-date")
        .addEventListener("click" , addTicketViaSubmitBtn);

    modalDiv.querySelector(".ticket-textbox")
        .addEventListener("click", clearModalTextBox);

    ticketContainer.append(modalDiv);
}

function chooseModalFilter(e) {
    //console.log(e.target.classList[1]);
    //console.log(e);
    let currChosenFilter = e.target.classList[1];
    if (e.target.classList[1] == selectedFilter) {
        return;
    }
    selectedFilter = currChosenFilter;
    document.querySelector(".colours.active-filter").classList.remove("active-filter");
    e.target.classList.add("active-filter");
}

function setSelectedFilter() {
    if (currDueDate == today) {
        selectedFilter = "red";
    }
    else if (currDueDate == tomDate) {
        selectedFilter = "orange";
    }
    else if(new Date(currDueDate) < new Date(today) ){
        selectedFilter = "black"
    }
    else{
        selectedFilter = "green";
    }
}

function addTicketViaSubmitBtn(modalDiv){
        let dueDateInput = currModalDiv.querySelector(".due-date-input");
        currDueDate = dueDateInput.value;
        if(new Date(currDueDate) < new Date(today) ){
            if (confirm('Are you sure you want to add this with an earlier date?')) {
                // Save it!
                selectedFilter = "black";
              } else {
                // Do nothing!
                return;
              }
        }
        let modalText = currModalDiv.querySelector(".ticket-textbox").textContent;
        let trimmedText = modalText.trim();
        if(trimmedText == templateText || trimmedText == ""){
            if (confirm('Are you sure you want to add this without adding any text?')) {
                // Save it!
              } else {
                // Do nothing!
                return;
              }
        }
        let ticketId = uid();

        setSelectedFilter();
        //<div class="realTextBoxID">#${ticketId}</div>

        let ticketDiv = document.createElement("div");
        ticketDiv.classList.add("realTicketBox");
        ticketDiv.innerHTML = `<div class="ticket-header ${selectedFilter}"></div>
                                    <div class="ticket-info">
                                            
                                            <div class="ticket-due-date">due date:${dueDateInput.value}</div>
                                            <div class="ticket-delete">
                                                    <i class="lock fas fa-lock-open unlock-btn" id=${ticketId}></i>
                                                    <i class="fas fa-trash-alt delete-btn" id=${ticketId}></i>
                                            </div>
                                    </div>
                                    <div class="realText">${modalText}</div>`;
        ticketDiv.querySelector(".ticket-header").addEventListener("click", toggleTicketFilter);
        ticketDiv.querySelector(".delete-btn").addEventListener("click", handleTicketDelete);
        ticketContainer.append(ticketDiv);

       currModalDiv.remove();

       ticketDiv.querySelector(".lock").addEventListener("click", toggleLockIcon);

        //ticket has been appended on the document!!!
        //false, null, undefined, 0, "", NaN
        if (!localStorage.getItem('allTickets')) {
            //first time ticket ayegi
            let allTickets = [];
            let ticketObject = {};
            ticketObject.ticketId = ticketId;
            ticketObject.isLocked = "false";
            ticketObject.ticketFilter = selectedFilter;
            ticketObject.ticketContent = modalText;
            ticketObject.ticketDueDate = dueDateInput.value;
            allTickets.push(ticketObject);
            localStorage.setItem("allTickets", JSON.stringify(allTickets));
        }
        else {
            let allTickets = JSON.parse(localStorage.getItem("allTickets"));
            let ticketObject = {};
            ticketObject.ticketId = ticketId;
            ticketObject.isLocked = "false";
            ticketObject.ticketFilter = selectedFilter;
            ticketObject.ticketContent = modalText;
            ticketObject.ticketDueDate = dueDateInput.value;
            allTickets.push(ticketObject);
            localStorage.setItem("allTickets", JSON.stringify(allTickets));
        }

        console.log("reached here");
}

function clearModalTextBox(e) {
    if (e.target.getAttribute("data-typed") == "true") {
        return;
    }

    e.target.innerHTML = "";
    e.target.setAttribute("data-typed", "true");
}

function createModal() {
    let modalDiv = document.createElement("div");
    modalDiv.classList.add("ticket-box");
    modalDiv.innerHTML = `<div class="ticket-textbox" data-typed="false" contenteditable="true">
                                Enter your task here
                          </div>
                          <div class="modal-due-date">
                                <label for="due-date" class="label-due-date">Due-date:</label>
                                <input type="date" id="due-date" name="due-date" class="due-date-input">
                                <div class="submit-due-date">Add Task</div>
                          </div>`;
    return modalDiv;
}

for (let i = 0; i < allFilterTags.length; i++) {
    allFilterTags[i].addEventListener("click", chooseFilter);
}

function chooseFilter(e) {

    if (e.target.classList.contains("active-filter")) {
        e.target.classList.remove("active-filter");
        loadTickets();
        return;
    }

    if (document.querySelector(".filter.active-filter")) {
        document.querySelector(".filter.active-filter").classList.remove("active-filter");
    }

    e.target.classList.add("active-filter");
    //console.log("Active filter added");

    let ticketFilter = e.target.classList[1];
    loadSelectedTickets(ticketFilter);

    //console.log(e);
    //let filter = e.target.classList[1];
    //let filterCode = obj[filter];
    //ticketContainer.style.background = filterCode;
    //console.log(filter);
}

function loadSelectedTickets(ticketFilter) {
    if (localStorage.getItem("allTickets")) {
        let allTickets = JSON.parse(localStorage.getItem("allTickets"));
        let filteredTickets = allTickets.filter(function (currFilterObj) {
            return currFilterObj.ticketFilter == ticketFilter;
        })

        ticketContainer.innerHTML = "";

        for (let i = 0; i < filteredTickets.length; i++) {
            let { ticketId, ticketFilter, ticketContent } = filteredTickets[i];
            let ticketDiv = document.createElement("div");
            ticketDiv.classList.add("realTicketBox");
            ticketDiv.innerHTML = `<div class="ticket-header ${ticketFilter}"></div>
                    <div class="ticket-info">
                        <div class="realTextBoxID">#${ticketId}</div>
                        <div class="ticket-delete">
                            <i class="fas fa-lock-open"></i>
                            <i class="fas fa-trash-alt delete-btn" id=${ticketId}></i>
                        </div>
                    </div>
                <div class="realText">${ticketContent}</div>`;
            ticketDiv.querySelector(".ticket-header").addEventListener("click", toggleTicketFilter);
            ticketDiv.querySelector(".ticket-delete i").addEventListener("click", handleTicketDelete);
            ticketContainer.append(ticketDiv);
        }

        //console.log(filteredTickets);
    }
}

function arrangeDB() {
    if (localStorage.getItem("allTickets")) {
        let allTickets = JSON.parse(localStorage.getItem("allTickets"));
        let newAllTickets = [];

        insertCurrColorTicketsInNewDb(allTickets, "black", newAllTickets);
        insertCurrColorTicketsInNewDb(allTickets, "red", newAllTickets);
        insertCurrColorTicketsInNewDb(allTickets, "orange", newAllTickets);
        insertCurrColorTicketsInNewDb(allTickets, "green", newAllTickets);

        localStorage.setItem("allTickets", JSON.stringify(newAllTickets));
        loadTickets();
    }
}

function insertCurrColorTicketsInNewDb(allTickets, currColorArrange, newAllTickets) {
    for (let i = 0; i < allTickets.length; i++) {
        let ticketObject = allTickets[i];
        if (ticketObject.ticketFilter == currColorArrange) {
            newAllTickets.push(ticketObject);
        }
    }
}

let lockUnlockBtnIcons = document.querySelectorAll(".lock");
console.log(lockUnlockBtnIcons);
for(let i=0;i<lockUnlockBtnIcons.length;i++){
    lockUnlockBtnIcons[i].addEventListener("click", toggleLockIcon);
}

function toggleLockIcon(e){
    console.log("khsbkc");
    let currDiv = e.target;
    let deleteBtnDiv = e.target.nextElementSibling;
    let currBtnId = e.target.id;
    //UI CHANGES
    if(currDiv.classList.contains("fa-lock")){
        console.log("ksdbvhs");
        currDiv.classList.remove("fa-lock");  
        currDiv.classList.add("fa-lock-open");
        currDiv.classList.add("unlock-btn");
        deleteBtnDiv.classList.remove("hide");

        let allTickets = JSON.parse(localStorage.getItem("allTickets"));
        for(let i=0;i<allTickets.length;i++){
            let currTicketObj = allTickets[i];
            if(currTicketObj.ticketId == currBtnId){
                currTicketObj.isLocked = "false";
            }
        }
        localStorage.setItem("allTickets", JSON.stringify(allTickets));
    }
    else{
        currDiv.classList.remove("fa-lock-open");
        currDiv.classList.remove("unlock-btn");
        currDiv.classList.add("fa-lock"); 
        deleteBtnDiv.classList.add("hide");
        
        let allTickets = JSON.parse(localStorage.getItem("allTickets"));
        for(let i=0;i<allTickets.length;i++){
            let currTicketObj = allTickets[i];
            if(currTicketObj.ticketId == currBtnId){
                currTicketObj.isLocked = "true";
            }
        }
        localStorage.setItem("allTickets", JSON.stringify(allTickets));
    }

}