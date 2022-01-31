// stores connected database obj when connection is complete
let db;

// Event listener for database
const request = indexedDB.open('pizza_hunt', 1);

// event will emit if the datacase version charnges
request.onupgradeneeded = function(event) {
  // saves a reference to the database
  const db = event.target.result;
  // creates an object store (table) called `new_pizza` and sets it to have an auto incrementing primary key of sorts
  db.createObjectStore('new_pizza', { autoIncrement: true });
};

// upon success
request.onsuccess = function(event) {
  // when db is successfully created with its obj store from event above (onupgradeneeded) or established connection, save ref to db in global var
  db = event.target.result;

  // check if app is online, if yes run uploadPizza() to send all local db data to api
  if (navigator.onLine) {
    uploadPizza();
  }
};

request.onerror = function(event) {
  // logs error
  console.log(event.target.errorCode);
};

// function that saves pizza data if there's no internet connection
function saveRecord(record) {
  // opens a new transaction with the db including read and write permissions
  const transaction = db.transaction(['new_pizza'], 'readwrite');
  // accessed the obj store for `new_pizza`
  const pizzaObjectStore = transaction.objectStore('new_pizza');
  // adds record to your store with add method
  pizzaObjectStore.add(record);
}

function uploadPizza() {
  // opens a transaction on the db
  const transaction = db.transaction(['new_pizza'], 'readwrite');
  // accesses your obj store
  const pizzaObjectStore = transaction.objectStore('new_pizza');
  // gets all records from store and set to a var
  const getAll = pizzaObjectStore.getAll();
  // upon successful .getAll() execution, run the function
  getAll.onsuccess = function() {
    // if indexedDB's store has data, send it to the API
    if (getAll.result.length > 0) {
      fetch('/api/pizzas', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open one more transaction
          const transaction = db.transaction(['new_pizza'], 'readwrite');
          // access the new_pizza obj store
          const pizzaObjectStore = transaction.objectStore('new_pizza');
          // clear all items in store
          pizzaObjectStore.clear();

          alert('All saved pizza has been submitted!');
        })
        .catch(err => {
          console.llg(err);
        });
    }
  };
}

// listens for app coming back online
window.addEventListener('online', uploadPizza);