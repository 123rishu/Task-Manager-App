let allFilterTags = document.querySelectorAll(".ticket-filters div");
let arrangeBtn = document.querySelector(".arrange-btn");
arrangeBtn.addEventListener("click", arrangeDB);
let ticketContainer = document.querySelector(".tickets-container");
let openModalBtn = document.querySelector(".open-modal");
let closeModalBtn = document.querySelector(".close-modal");
//let ticketDelete = document.querySelector(".ticket-delete");
// var today = new Date();
// var dd = String(today.getDate()).padStart(2, '0');
// var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
// var yyyy = today.getFullYear();
// today = yyyy + "-" + mm + "-" + dd;
// //document.write(today);
// console.log(today);

function getToday() {
    const today = new Date();
    today.setDate(today.getDate()); // even 32 is acceptable
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};
let today = getToday();
console.log(today);

function getTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate()+1); // even 32 is acceptable
    return `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
};
let tomDate = getTomorrow();
console.log(tomDate);

function DAgetTomorrow() {
    const DAtomorrow = new Date();
    DAtomorrow.setDate(DAtomorrow.getDate() + 2); // even 32 is acceptable
    return `${DAtomorrow.getFullYear()}-${String(DAtomorrow.getMonth() + 1).padStart(2, '0')}-${String(DAtomorrow.getDate()).padStart(2, '0')}`;
};
let DAtomDate = DAgetTomorrow();
console.log(DAtomDate);
let currDueDate;
let selectedFilter;
//console.log(openModalBtn);
//console.log(ticketContainer);
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
        console.log(allTickets);
        for (let i = 0; i < allTickets.length; i++) {
            let { ticketId, ticketFilter, ticketContent, ticketDueDate } = allTickets[i];
            let ticketDiv = createTicket(ticketId, ticketFilter, ticketContent, ticketDueDate);
            ticketDiv.querySelector(".ticket-header").addEventListener("click", toggleTicketFilter);
            ticketDiv.querySelector(".ticket-delete i").addEventListener("click", handleTicketDelete);
            ticketContainer.append(ticketDiv);
        }
    }
}

function createTicket(ticketId, ticketFilter, ticketContent, ticketDueDate) {
    let ticketDiv = document.createElement("div");
    ticketDiv.classList.add("realTicketBox");
    ticketDiv.innerHTML = `<div class="ticket-header ${ticketFilter}"></div>
                <div class="ticket-info">
                    <div class="realTextBoxID">#${ticketId}</div>
                    <div class="ticket-due-date">due date:${ticketDueDate}</div>
                    <div class="ticket-delete">
                        <i class="fas fa-trash-alt" id=${ticketId}></i>
                    </div>
                </div>
                <div class="realText">${ticketContent}</div>`;
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

function handleOpenModal() {
    let modal = document.querySelector(".ticket-box");
    if (modal) {
        return;
    }
    let modalDiv = createModal();

    modalDiv.querySelector(".ticket-textbox")
        .addEventListener("click", clearModalTextBox);

    modalDiv.querySelector(".ticket-textbox")
        .addEventListener("keypress", addTicket);

    let allColoursFilters = modalDiv.querySelectorAll(".colours");

    for (let i = 0; i < allColoursFilters.length; i++) {
        allColoursFilters[i].addEventListener("click", chooseModalFilterAdvance);
    }

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
    else {
        selectedFilter = "green";
    }
}

function addTicket(e) {
    if (e.key == "Enter") {
        console.log(e);
        let dueDateInput = document.querySelector(".due-date-input");
        currDueDate = dueDateInput.value;

        let modalText = e.target.textContent;
        let ticketId = uid();

        setSelectedFilter();

        let ticketDiv = document.createElement("div");
        ticketDiv.classList.add("realTicketBox");
        ticketDiv.innerHTML = `<div class="ticket-header ${selectedFilter}"></div>
                                    <div class="ticket-info">
                                            <div class="realTextBoxID">#${ticketId}</div>
                                            <div class="ticket-due-date">due date:${dueDateInput.value}</div>
                                            <div class="ticket-delete">
                                                    <i class="fas fa-trash-alt" id=${ticketId}></i>
                                            </div>
                                    </div>
                                    <div class="realText">${modalText}</div>`;
        ticketDiv.querySelector(".ticket-header").addEventListener("click", toggleTicketFilter);
        ticketDiv.querySelector(".ticket-delete i").addEventListener("click", handleTicketDelete);
        ticketContainer.append(ticketDiv);

        e.target.parentNode.remove();

        //ticket has been appended on the document!!!
        //false, null, undefined, 0, "", NaN
        if (!localStorage.getItem('allTickets')) {
            //first time ticket ayegi
            let allTickets = [];
            let ticketObject = {};
            ticketObject.ticketId = ticketId;
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
            ticketObject.ticketFilter = selectedFilter;
            ticketObject.ticketContent = modalText;
            ticketObject.ticketDueDate = dueDateInput.value;
            allTickets.push(ticketObject);
            localStorage.setItem("allTickets", JSON.stringify(allTickets));
        }
        //selectedFilter = "red";
    }
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
                                <input type="submit" class="submit-due-date">
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
                            <i class="fas fa-trash-alt" id=${ticketId}></i>
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