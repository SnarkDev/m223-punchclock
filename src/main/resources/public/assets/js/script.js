const URL = 'http://localhost:8081';
let entries = [];
let isSave = true;
let currentEntry;
let categories = [];

const dateAndTimeToDate = (dateString, timeString) => {
    return new Date(`${dateString}T${timeString}`).toISOString();
};

const createEntry = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const entry = {};
    entry['checkIn'] = dateAndTimeToDate(formData.get('checkInDate'), formData.get('checkInTime'));
    entry['checkOut'] = dateAndTimeToDate(formData.get('checkOutDate'), formData.get('checkOutTime'));
    entry['category'] = { id: formData.get('categoryName') };

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

const createCategory = (e) => {
    e.preventDefault();
    const fromData= new FormData(e.target);
    const category = {};
    category['name'] = fromData.get('Category')

    fetch(`${URL}/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
    }).then((result) => {
        result.json().then((category) => {
            entries.push(category);
            indexCategories();
        });
    });
};

const deleteCategory = (id) => {
    fetch(`${URL}/categories/${id}`, {
        method: 'DELETE'
    }).then(indexCategories);
}

const deleteEntry = (id) => {
    fetch(`${URL}/entries/${id}`, {
        method: 'DELETE',
    }).then(indexEntries);
};

const indexCategories = () => {
    fetch(`${URL}/categories`, {
        method: 'GET'
    }).then((resultCat) => {
        resultCat.json().then((resultCat) => {
            categories = resultCat;
            renderCategoriesDropdown();
            renderCategories();
            //console.log(categories);
        });
    });
    renderCategories();
    renderCategoriesDropdown();
};

const renderCategoriesDropdown = () => {
    const display = document.querySelector( '#category');
    display.innerHTML = '<option selected value="null">NULL</option>';
    categories.forEach((category) => {
        const option = document.createElement('option');
        option.value = category.id;
        option.innerHTML = category.name;
        display.appendChild(option);
    })
}

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
        if (entry.category == null){
            row.appendChild(createCell("Keine Kategorie"))
        } else {
            row.appendChild(createCell(entry.category.name));
        }
        row.appendChild(createCell('<button type="submit" onclick="deleteEntry(' + entry.id +')"> Delete</button> '));
        row.appendChild(createCell('<button type="submit" id='+entry.id+'> Edit</button>'))
        display.appendChild(row);
        jQuery("#loginBtn").click(function (){
            signupUser()
        })
        jQuery("#"+entry.id).click(function (){
            fillDatetime(entry);
            isSave = false;
        });
    });
};

const renderCategories = () => {
    const display = document.querySelector('#categoryDisplay');
    display.innerHTML = '';
    console.log(categories);
    categories.forEach((category) => {
        const row = document.createElement('tr');
        row.appendChild(createCell(category.id));
        row.appendChild(createCell(category.name));
        row.appendChild(createCell('<button type="submit" onclick="deleteCategory('+category.id+')">Delete</button>'));
        display.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', function(){


    const createEntryForm = document.querySelector('#createEntryForm');
    createEntryForm.addEventListener('submit', SafeEntry);
    indexEntries();


});

const signupUser = (e) => {

    e.preventDefault();
    const formData = new FormData(e.target());
    const user = {};
    user['username'] = dateAndTimeToDate(formData.get('username'));
    user['password'] = dateAndTimeToDate(formData.get('password'));

    fetch(`${URL}/users/sign-up`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
        }).then((result) => {
        result.json().then((user) => {
            entries.push(user);
            renderEntries();
        });
    });
}