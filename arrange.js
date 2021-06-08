let arrangeBtn = document.querySelector(".arrange-btn");

arrangeBtn.addEventListener("click", arrangeDB);

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