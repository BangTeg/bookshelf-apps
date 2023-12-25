const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

// Membuat Fungsi yang mengambil dari objek dari render book
function addBook() {
  const inputBookTitle = document.getElementById('inputBookTitle');
  const authorBook = document.getElementById('inputBookAuthor');
  const yearBook = document.getElementById('inputBookYear');
  // const parsedYear = parseInt(yearBook.value, 10);
  const isCompleted = document.getElementById('inputBookIsComplete');

  const generatedID = generateId();
  const bookObject = generateBooksObject(
    generatedID,
    inputBookTitle.value,
    authorBook.value,
    yearBook.value,
    // parsedYear,
    isCompleted.checked
  );

  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBooksObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year: parseInt(year, 10),
    isCompleted: isCompleted,
  };
}

function makeBook(bookObject) {
  const textTitle = document.createElement('h3');
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = 'Penulis : ' + bookObject.author;

  const textYear = document.createElement('p');
  textYear.innerText = 'Tahun Terbit : ' + bookObject.year;

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('action');

  const editButton = document.createElement('button');
  editButton.classList.add('yellow');
  editButton.setAttribute('id', 'btn-edit');
  editButton.innerText = 'Edit Buku';

  const trashButton = document.createElement('button');
  trashButton.classList.add('red');
  trashButton.setAttribute('id', 'btn-delete');
  trashButton.innerText = 'Hapus Buku';

  const textBooksWrapper = document.createElement('div');
  textBooksWrapper.classList.add('inner');
  textBooksWrapper.append(textTitle, textAuthor, textYear, buttonContainer);

  const container = document.createElement('article');
  container.classList.add('book_item');
  container.append(textBooksWrapper);
  container.setAttribute('id', `book-${bookObject.id}`);

  if (bookObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('green');
    undoButton.setAttribute('id', 'btn-undo');
    undoButton.innerText = 'Belum Selesai dibaca';
    buttonContainer.append(undoButton, trashButton, editButton);

    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(bookObject.id);
    });

    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(bookObject.id);
    });
    editButton.addEventListener('click', function () {
      editBook(bookObject.id);
    });
  } else {
    const finishButton = document.createElement('button');
    finishButton.classList.add('green');
    finishButton.setAttribute('id', 'btn-finish');
    finishButton.innerText = 'Selesai Dibaca';
    buttonContainer.append(finishButton, trashButton, editButton);
    finishButton.addEventListener('click', function () {
      addTaskToCompleted(bookObject.id);
    });
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(bookObject.id);
    });
    editButton.addEventListener('click', function () {
      editBook(bookObject.id);
    });
  }
  return container;
}

//fungsi Render_EVENT

document.addEventListener(RENDER_EVENT, function () {
  const uncompleteBookList = document.getElementById('incompleteBookshelfList');
  uncompleteBookList.innerHTML = '';

  const completeBookList = document.getElementById('completeBookshelfList');
  completeBookList.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) uncompleteBookList.append(bookElement);
    else completeBookList.append(bookElement);
  }
});

function DeleteInputUser() {
  const inputBookTitle = document.getElementById('inputBookTitle');
  const authorBook = document.getElementById('inputBookAuthor');
  const yearBook = document.getElementById('inputBookYear');
  document.getElementById('inputBookIsComplete').checked = null;
  inputBookTitle.value = '';
  authorBook.value = '';
  yearBook.value = '';
}

function addTaskToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookId === null) return;

  Toastify({
    text: `${bookTarget.title} selesai dibaca`,
    style: {
      background: 'linear-gradient(to right, #00b09b, #96c93d)',
    },
    duration: 3000,
  }).showToast();

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function editBook(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  document.getElementById('inputBookTitle').value = bookTarget.title;
  document.getElementById('inputBookAuthor').value = bookTarget.author;
  document.getElementById('inputBookYear').value = bookTarget.year;
  document.getElementById('inputBookIsComplete').checked =
    bookTarget.isCompleted;

  const bookCard = document.getElementById(`book-${bookId}`);
  bookCard.style.display = 'none';

  const submitBook = document.getElementById('bookSubmit');
  submitBook.innerText = 'Edit Buku';

  Toastify({
    text: `Buku ${bookTarget.title} sedang di edit`,
    style: {
      background: 'linear-gradient(to right, #ffa585, #fbd07c)',
    },
    duration: 3000,
  }).showToast();

  editButton = document.getElementsByClassName('yellow');
  for (editButton of editButton) {
    editButton.setAttribute('disabled', true);
  }

  submitBook.addEventListener('click', function (event) {
    event.preventDefault();

    bookTarget.title = document.getElementById('inputBookTitle').value;
    bookTarget.author = document.getElementById('inputBookAuthor').value;
    bookTarget.year = document.getElementById('inputBookYear').value;
    bookTarget.isCompleted = document.getElementById(
      'inputBookIsComplete'
    ).checked;

    submitBook.innerText = 'Masukkan buku kedalam rak';

    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
    location.reload();
  });
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeTaskFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
  const bookTargetDelete = findBook(bookId);

  if (bookTarget === -1) return;

  Toastify({
    text: `${bookTargetDelete.title} selesai dibaca`,
    style: {
      background: 'linear-gradient(to right, #ff758c, #ff7eb3)',
    },
    duration: 3000,
  }).showToast();

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Browser tidak mendukung local storage');
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();

    Toastify({
      text: 'Buku baru sudah ditambahkan!',
      duration: 3000,
    }).showToast();

    DeleteInputUser();
  });

  const searchBook = document.getElementById('searchBook');

  searchBook.addEventListener('submit', function (event) {
    event.preventDefault();
    const searchBookTitle = document.getElementById('searchBookTitle').value.toLowerCase();
    const listBook = document.querySelectorAll('.book_item');
  
    for (const book of listBook) {
      const bookTitle = book.querySelector('h3').innerText.toLowerCase();
  
      if (bookTitle.includes(searchBookTitle)) {
        book.style.display = 'block';
      } else {
        book.style.display = 'none';
      }
    }
  });
  

  fillYearDropdown();

  function fillYearDropdown() {
    const yearDropdown = document.getElementById('inputBookYear');
    const currentYear = new Date().getFullYear();

    for (let year = currentYear; year >= 1900; year--) {
      const option = document.createElement('option');
      option.value = year.toString();
      option.text = year.toString();
      yearDropdown.add(option);
    }
  }

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});