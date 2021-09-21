let allFilterTags = document.querySelectorAll(".ticket-filters div");
let arrangeBtn = document.querySelector(".arrange-btn");
let lockUnlockBtnIcons = document.querySelectorAll(".lock");
let ticketContainer = document.querySelector(".tickets-container");
let openModalBtn = document.querySelector(".open-modal");
let closeModalBtn = document.querySelector(".close-modal");
let templateText = "Enter your task here";
let currModalDiv;
let currDueDate;
let selectedFilter;





//-----------------------------------------------------------------------------------------------------------------------------------------------//
//COLOR CODES
let obj = {
    "red": "#ff0707",
    "orange": "#FFA500",
    "green": "#00ff15",
    "black": "#191919"
}
//-----------------------------------------------------------------------------------------------------------------------------------------------//





//-----------------------------------------------------------------------------------------------------------------------------------------------//
//Get dates -> today, tomorrow, day after tomorrow
//TODAY
function getToday() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};
let today = getToday();
//TOMORROW
function getTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); 
    return `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
};
let tomDate = getTomorrow();
//DAY AFTER TOMORROW
function DAgetTomorrow() {
    const DAtomorrow = new Date();
    DAtomorrow.setDate(DAtomorrow.getDate() + 2); // even 32 is acceptable
    return `${DAtomorrow.getFullYear()}-${String(DAtomorrow.getMonth() + 1).padStart(2, '0')}-${String(DAtomorrow.getDate()).padStart(2, '0')}`;
};
let DAtomDate = DAgetTomorrow();
//-----------------------------------------------------------------------------------------------------------------------------------------------//





//-----------------------------------------------------------------------------------------------------------------------------------------------//
//Load Tickets 
loadTickets();
function loadTickets() {
    if (localStorage.getItem("allTickets")) {
        ticketContainer.innerHTML = "";
        let allTickets = JSON.parse(localStorage.getItem("allTickets"));
        //console.log(allTickets);
        updateDB(allTickets);
        appendDBElementsOnUI();
    }
}
function updateDB(allTickets) {
    let newAllTickets = [];
    for (let i = 0; i < allTickets.length; i++) {
        let ticketObj = allTickets[i];
        if (new Date(ticketObj.ticketDueDate) < new Date(today)) {
            ticketObj.ticketFilter = "black";
        }
        else if (new Date(ticketObj.ticketDueDate) > new Date(tomDate)) {
            ticketObj.ticketFilter = "green";
        }
        else if ((new Date(ticketObj.ticketDueDate) > new Date(today)) && (new Date(ticketObj.ticketDueDate) < new Date(DAtomDate))) {
            ticketObj.ticketFilter = "orange";
        }
        else {
            ticketObj.ticketFilter = "red";
        }
        newAllTickets.push(ticketObj);
    }
    localStorage.setItem("allTickets", JSON.stringify(newAllTickets));

}
function appendDBElementsOnUI() {
    if (localStorage.getItem("allTickets")) {
        ticketContainer.innerHTML = "";
        let allTickets = JSON.parse(localStorage.getItem("allTickets"));
        // console.log(allTickets);
        for (let i = 0; i < allTickets.length; i++) {
            let { ticketId, isLocked, ticketFilter, ticketContent, ticketDueDate } = allTickets[i];
            let ticketDiv = createTicket(ticketId, isLocked, ticketFilter, ticketContent, ticketDueDate);
            let deleteBtn = ticketDiv.querySelector(".delete-btn");
            ticketDiv.querySelector(".lock").addEventListener("click", toggleLockIcon);
            if (deleteBtn) {
                deleteBtn.addEventListener("click", handleTicketDelete);
            }
            ticketContainer.append(ticketDiv);
        }
    }
}
//-----------------------------------------------------------------------------------------------------------------------------------------------//





//------------------------------------------------------------------------------------------------------------------------------------------------//
//To handle open Modal Button operations
openModalBtn.addEventListener("click", handleOpenModal);
function handleOpenModal() {
    let modal = document.querySelector(".ticket-box");
    if (modal) {
        return;
    }
    let modalDiv = createModal();
    currModalDiv = modalDiv;
    modalDiv.querySelector(".submit-due-date")
        .addEventListener("click", addTicketViaSubmitBtn);

    modalDiv.querySelector(".ticket-textbox")
        .addEventListener("click", clearModalTextBox);

    ticketContainer.append(modalDiv);
}
//To create the modal div
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
//To submit the current ticket and also loading this ticket on the main UI
function addTicketViaSubmitBtn(modalDiv) {
    //OPERATIONS TO ADD A TICKET AND CLOSE THE MODAL (UI WORK) 
    //storing the entered due date
    let dueDateInput = currModalDiv.querySelector(".due-date-input");
    //setting currDueDate value
    currDueDate = dueDateInput.value;
    //in case user adds a ticket with a due date before today
    if (new Date(currDueDate) < new Date(today)) {
        if (confirm('Are you sure you want to add this with an earlier date?')) {
            // Save it!
            selectedFilter = "black";
        } else {
            // Do nothing!
            return;
        }
    }
    //storing the entered modal text
    let modalText = currModalDiv.querySelector(".ticket-textbox").textContent;
    let trimmedText = modalText.trim();
    if (trimmedText == templateText || trimmedText == "") {
        if (confirm('Are you sure you want to add this without adding any text?')) {
            // Save it!
        } else {
            // Do nothing! and go back
            return;
        }
    }
    //creating the unique id of each ticket
    let ticketId = Math.floor(Math.random() * 100);
    //it will select the color of ticket according to the due dates
    setSelectedFilter();
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

    ticketDiv.querySelector(".delete-btn").addEventListener("click", handleTicketDelete);
    ticketDiv.querySelector(".lock").addEventListener("click", toggleLockIcon);
    ticketContainer.append(ticketDiv);

    //removing the current Modal
    currModalDiv.remove();

    //OPERATIONS TO ADD A TICKET (DB WORK)
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
        //When already 1 or more tickets exist in our db
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
}
//To clear the text box inside the modal
function clearModalTextBox(e) {
    if (e.target.getAttribute("data-typed") == "true") {
        return;
    }

    e.target.innerHTML = "";
    e.target.setAttribute("data-typed", "true");
}
//-----------------------------------------------------------------------------------------------------------------------------------------------//





//-----------------------------------------------------------------------------------------------------------------------------------------------//
//To handle close modal
closeModalBtn.addEventListener("click", handleCloseModal);
function handleCloseModal() {
    if (document.querySelector(".ticket-box")) {
        document.querySelector(".ticket-box").remove();
    }
}
//-----------------------------------------------------------------------------------------------------------------------------------------------//





//-----------------------------------------------------------------------------------------------------------------------------------------------//
//To arrange all the tickets deadline based after clicking on the arrange button
arrangeBtn.addEventListener("click", arrangeDB);
//Method to change the db order deadline based and then, displaying the changed order tickets by calling to loadTickets()
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
//Method to only add selected tickets inside the array
function insertCurrColorTicketsInNewDb(allTickets, currColorArrange, newAllTickets) {
    for (let i = 0; i < allTickets.length; i++) {
        let ticketObject = allTickets[i];
        if (ticketObject.ticketFilter == currColorArrange) {
            newAllTickets.push(ticketObject);
        }
    }
}
//-----------------------------------------------------------------------------------------------------------------------------------------------//





//-----------------------------------------------------------------------------------------------------------------------------------------------//
//To handle all the operations after clicking on any one of the filter
for (let i = 0; i < allFilterTags.length; i++) {
    allFilterTags[i].addEventListener("click", clickingOnAnyOneFilter);
}
function clickingOnAnyOneFilter(e) {
    if (e.target.classList.contains("active-filter")) {
        //that case when a filter is already selected and we are unselecting it, simply all the existing tickets present in the db
        e.target.classList.remove("active-filter");
        loadTickets();
        return;
    }
    //So, now is the case when someone clicked on an unselected filter
    e.target.classList.add("active-filter");
    //console.log("Active filter added");
    console.log(e.target);
    //console.log(e.target); will give <div class="filter red active-filter"</div>
    //So, element at index 1 of its classLists will give us it's filter color
    let ticketFilter = e.target.classList[1];
    loadSelectedTickets(ticketFilter);
}
function loadSelectedTickets(ticketFilter) {
    if (localStorage.getItem("allTickets")) {
        let allTickets = JSON.parse(localStorage.getItem("allTickets"));
        //filteredTicket will have only the data of selected tickets
        let filteredTickets = allTickets.filter(function (currFilterObj) {
            return currFilterObj.ticketFilter == ticketFilter;
        })
        ticketContainer.innerHTML = "";
        for (let i = 0; i < filteredTickets.length; i++) {
            let { ticketId, isLocked, ticketFilter, ticketContent, ticketDueDate } = filteredTickets[i];
            let ticketDiv = createTicket(ticketId, isLocked, ticketFilter, ticketContent, ticketDueDate);
            //adding event listeners on the lock icon and delete button
            let deleteBtn = ticketDiv.querySelector(".delete-btn");
            ticketDiv.querySelector(".lock").addEventListener("click", toggleLockIcon);
            if (deleteBtn) {
                deleteBtn.addEventListener("click", handleTicketDelete);
            }
            //now append this ticket on the TicketContainer
            ticketContainer.append(ticketDiv);
        }

        //console.log(filteredTickets);
    }
}
//-----------------------------------------------------------------------------------------------------------------------------------------------//





//-----------------------------------------------------------------------------------------------------------------------------------------------//
//General Used Functions
function toggleLockIcon(e) {
    let currDiv = e.target;
    let deleteBtnDiv = e.target.nextElementSibling;
    let currBtnId = e.target.id;
    //UI CHANGES
    if (currDiv.classList.contains("fa-lock")) {
        console.log("ksdbvhs");
        currDiv.classList.remove("fa-lock");
        currDiv.classList.add("fa-lock-open");
        currDiv.classList.add("unlock-btn");
        deleteBtnDiv.classList.remove("hide");

        let allTickets = JSON.parse(localStorage.getItem("allTickets"));
        for (let i = 0; i < allTickets.length; i++) {
            let currTicketObj = allTickets[i];
            if (currTicketObj.ticketId == currBtnId) {
                currTicketObj.isLocked = "false";
            }
        }
        localStorage.setItem("allTickets", JSON.stringify(allTickets));
    }
    else {
        currDiv.classList.remove("fa-lock-open");
        currDiv.classList.remove("unlock-btn");
        currDiv.classList.add("fa-lock");
        deleteBtnDiv.classList.add("hide");

        let allTickets = JSON.parse(localStorage.getItem("allTickets"));
        for (let i = 0; i < allTickets.length; i++) {
            let currTicketObj = allTickets[i];
            if (currTicketObj.ticketId == currBtnId) {
                currTicketObj.isLocked = "true";
            }
        }
        localStorage.setItem("allTickets", JSON.stringify(allTickets));
    }

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
function setSelectedFilter() {
    if (currDueDate == today) {
        selectedFilter = "red";
    }
    else if (currDueDate == tomDate) {
        selectedFilter = "orange";
    }
    else if (new Date(currDueDate) < new Date(today)) {
        selectedFilter = "black"
    }
    else {
        selectedFilter = "green";
    }
}
function createTicket(ticketId, isLocked, ticketFilter, ticketContent, ticketDueDate) {
    let ticketDiv = document.createElement("div");
    ticketDiv.classList.add("realTicketBox");
    if (isLocked == "false") {
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
    else {
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
//-----------------------------------------------------------------------------------------------------------------------------------------------//





//-----------------------------------------------------------------------------------------------------------------------------------------------//
//Toggle Lock Icon
for (let i = 0; i < lockUnlockBtnIcons.length; i++) {
    lockUnlockBtnIcons[i].addEventListener("click", toggleLockIcon);
}
//-----------------------------------------------------------------------------------------------------------------------------------------------//