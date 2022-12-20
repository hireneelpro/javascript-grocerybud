// ****** SELECT ITEMS **********
const groceryInput = document.querySelector(".grocery-input");
const btnSubmit = document.querySelector(".btn-submit");
const btnClear = document.querySelector(".btn-clear");
const groceryList = document.querySelector(".grocery-list");
const groceryName = document.querySelector(".grocery-name");
const alert = document.querySelector(".alert");
// edit option
let editElement;
let editFlag = false;
let editId = "";

// ****** EVENT LISTENERS **********
window.addEventListener("DOMContentLoaded",loadSavedItems)
document.addEventListener("submit", function (e) {
  e.preventDefault();
  const value = groceryInput.value;
  const id = new Date().getTime();
  if (value && !editFlag) {
    createItem(id, value);
    btnClear.classList.add("show-btnclear");
    displayAlert("item added successfully", "green");
    // setBackDefault
    setBackDefault();
    // add To Localstorage

    addToLocalStorage(id, value);
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value edited", "green");
    // edit local storage
    editLocalStorage(editId,value);
    setBackDefault();
  } else {
    console.log("blank item");
    displayAlert("please enter item", "red");
    setBackDefault();

  }
});

// ======== clear all items =========
btnClear.addEventListener("click", function () {
  let container = document.querySelectorAll(".container");
  if (container.length > 0) {
    container.forEach(function (item) {
      groceryList.innerHTML = "";
      let id = item.dataset.id
      deleteFromLocalStorage(id
         )
      
    });
  }
  btnClear.classList.remove("show-btnclear");
  displayAlert("items empty", "red");
});

// ****** FUNCTIONS **********
// =========create item===========


function createItem(id, value) {
  let element = document.createElement("div");
  element.classList.add("container");
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `<h5 class="grocery-name">${value}</h5>
          <div class="edit-delete">
            <button type ="button" class=" btn-edit"><i class="fas fa-edit"></i></button>
            <button type="button" class=" btn-delete"><i class="fas fa-trash-alt"></i></button>
          </div>`;

  // -----edit item---------
  const btnEdit = element.querySelector(".btn-edit");
  btnEdit.addEventListener("click", editItem);
  // -----delete item---------
  const btnDelete = element.querySelector(".btn-delete");
  btnDelete.addEventListener("click", deleteItem);
  groceryList.appendChild(element);
}

// ======display alert=======
function displayAlert(text, color) {
  alert.innerText = text;
  alert.classList.add(`alert-${color}`);
  setTimeout(function () {
    alert.innerText = "";
    alert.classList.remove(`alert-${color}`);
  }, 1000);
}
// ========set back to default ==========
function setBackDefault() {
  groceryInput.value = "";
  editFlag = false;
  btnSubmit.innerText = "Submit";
}

// ==========delete item===========
function deleteItem(e) {
  const newElement = e.currentTarget.parentElement.parentElement;
  const id = newElement.dataset.id;

  groceryList.removeChild(newElement);
  if (groceryList.children.length === 0) {
    btnClear.classList.remove("show-btnclear");
  }
  displayAlert("item removed successfully", "red");
  setBackDefault();
  deleteFromLocalStorage(id);
}
// ===========edit item============
function editItem(e) {
  // accessing  .container element
  let newElement = e.currentTarget.parentElement.parentElement;
  // accessing .grocery-name
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // assign groceryinput with editElement
  groceryInput.value = editElement.innerHTML;
  editFlag = true;
  editId = newElement.dataset.id;
  btnSubmit.innerText = "Edit";
}



// ****** LOCAL STORAGE **********

// =========add to local storage==========
function addToLocalStorage(id, value) {
  let item = { id: id, value: value };
  let items = localStorage.getItem("list");
  if (!items) {
    items = [];
  } else {
    items = JSON.parse(localStorage.getItem("list"));
  }
  items.push(item);
  localStorage.setItem("list", JSON.stringify(items));
}
// ====delete from local storage=====

function deleteFromLocalStorage(id) {
  // console.log(id)
  let items = localStorage.getItem("list");
  if (!items) {
    items = [];
  } else {
    items = JSON.parse(localStorage.getItem("list"));
    console.log(items);
  }
  items = items.filter(function (item) {
    if (item.id !== +id) {
      // console.log(id, item.id !== id);
      return item;
    }
  });
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
}
// =========edit local storage============
function editLocalStorage(editId,value) {
  let items = JSON.parse(localStorage.getItem("list"))
  items.forEach(function (item) {
    
    if (item.id === +editId) {
      item.value = value
      // console.log('hi')
    }
     localStorage.setItem("list", JSON.stringify(items));

  })
}

// ****** SETUP ITEMS **********

function loadSavedItems() {
  let items = JSON.parse(localStorage.getItem("list"))
  // console.log(items)
  items.forEach(function (item) {
    createItem(item.id, item.value)
    btnClear.classList.add("show-btnclear");
    displayAlert("item added successfully", "green");
    
    
  })
  
}
