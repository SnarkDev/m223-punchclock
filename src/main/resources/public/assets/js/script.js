const URL = 'http://localhost:8081';
let entries = [];
let isSave = true;
let currentEntry;

const dateAndTimeToDate = (dateString, timeString) => {
    return new Date(`${dateString}T${timeString}`).toISOString();
};

const createEntry = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const entry = {};
    entry['checkIn'] = dateAndTimeToDate(formData.get('checkInDate'), formData.get('checkInTime'));
    entry['checkOut'] = dateAndTimeToDate(formData.get('checkOutDate'), formData.get('checkOutTime'));

    if(entry.checkIn > entry.checkOut)
    {
        alert("The Check In has to be before the Check Out!");

    }else{
        fetch(`${URL}/entries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entry)
        }).then((result) => {
            result.json().then((entry) => {
                entries.push(entry);
                renderEntries();
            });
        });
    }
};

const deleteEntry = (id) => {
    fetch(`${URL}/entries/${id}`, {
        method: 'DELETE',
    }).then(indexEntries);
};

const fillDatetime = (entry) => {
    jQuery("#CreateEntryForum").ready(function (){
        jQuery("#checkIn").val(entry.checkIn.substring(0, 10))
        jQuery("#checkOut").val(entry.checkOut.substring(0,10))
        jQuery("#checkInTime").val(entry.checkIn.substring(11, entry.checkIn.length))
        jQuery("#checkOutTime").val(entry.checkOut.substring(11, entry.checkOut.length))
        currentEntry = entry;
    });
}

const editEntry = (entry) => {

    fetch(`${URL}/entries/${currentEntry.id}`,{
        method: 'PUT',
        body:JSON.stringify(currentEntry.id, currentEntry.checkIn, currentEntry.checkOut)
    })
        .then((result) => {
        result.json().then((currentEntry) => {
            entries.push(currentEntry.id, currentEntry.checkIn, currentEntry.checkOut);
        })
    });
};

const indexEntries = () => {
    fetch(`${URL}/entries`, {
        method: 'GET'
    }).then((result) => {
        result.json().then((result) => {
            entries = result;
            renderEntries();
        });
    });
    renderEntries();
};

const SafeEntry = (e) =>
{
    if(isSave)
    {
        createEntry(e)
    }else
    {
        editEntry(e)
    }
}

const createCell = (text) => {
    const cell = document.createElement('td');
    cell.innerHTML= text;
    return cell;
};

const renderEntries = () => {
    const display = document.querySelector('#entryDisplay');
    display.innerHTML = '';
    entries.forEach((entry) => {
        const row = document.createElement('tr');
        row.appendChild(createCell(entry.id));
        row.appendChild(createCell(new Date(entry.checkIn).toLocaleString()));
        row.appendChild(createCell(new Date(entry.checkOut).toLocaleString()));
        row.appendChild(createCell('<button type="submit" onclick="deleteEntry(' + entry.id +')"> Delete</button> '));
        row.appendChild(createCell('<button type="submit" id='+entry.id+'> Edit</button>'))
        display.appendChild(row);
        jQuery("#"+entry.id).click(function (){
            fillDatetime(entry);
            isSave = false;
        });
    });
};

document.addEventListener('DOMContentLoaded', function(){


    const createEntryForm = document.querySelector('#createEntryForm');
    createEntryForm.addEventListener('submit', SafeEntry);
    indexEntries();


});