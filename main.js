document.addEventListener("DOMContentLoaded", function () {
    const inputForm = document.getElementById("inputBook");
    const searchForm = document.getElementById("searchBook");
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");
  
    inputForm.addEventListener("submit", function (event) {
      event.preventDefault();
      addBook();
    });
  
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      searchBook();
    });
  
    function addBook() {
      const title = document.getElementById("inputBookTitle").value;
      const author = document.getElementById("inputBookAuthor").value;
      const year = document.getElementById("inputBookYear").value;
      const isComplete = document.getElementById("inputBookIsComplete").checked;
  
      const book = {
        id: +new Date(),
        title,
        author,
        year: parseInt(year),
        isComplete,
      };
  
      const shelfList = isComplete ? completeBookshelfList : incompleteBookshelfList;
      const bookItem = createBookItem(book, isComplete);
  
      shelfList.appendChild(bookItem);
      updateBookshelfStorage();
      inputForm.reset();
    }
  
    function createBookItem(book, isComplete) {
      const bookItem = document.createElement("article");
      bookItem.classList.add("book_item");
  
      const bookInfo = document.createElement("div");
      bookInfo.innerHTML = `
        <h3>${book.title}</h3>
        <p>Penulis: ${book.author}</p>
        <p>Tahun: ${book.year}</p>
      `;
  
      const actionContainer = document.createElement("div");
      actionContainer.classList.add("action");
  
      const actionButton = document.createElement("button");
      actionButton.classList.add(isComplete ? "green" : "red");
      actionButton.textContent = isComplete ? "Belum selesai di Baca" : "Selesai dibaca";
      actionButton.addEventListener("click", function () {
        toggleBookStatus(book, isComplete);
      });
  
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("red");
      deleteButton.textContent = "Hapus buku";
      deleteButton.addEventListener("click", function () {
        deleteBook(book, isComplete);
      });
  
      actionContainer.appendChild(actionButton);
      actionContainer.appendChild(deleteButton);
  
      bookItem.appendChild(bookInfo);
      bookItem.appendChild(actionContainer);
  
      return bookItem;
    }
  
    function toggleBookStatus(book, isComplete) {
      const shelfList = isComplete ? incompleteBookshelfList : completeBookshelfList;
      const oppositeShelfList = isComplete ? completeBookshelfList : incompleteBookshelfList;
  
      const bookItem = createBookItem(book, !isComplete);
      oppositeShelfList.appendChild(bookItem);
  
      shelfList.removeChild(document.getElementById(book.id.toString()));
      updateBookshelfStorage();
    }
  
    function deleteBook(book, isComplete) {
      const shelfList = isComplete ? completeBookshelfList : incompleteBookshelfList;
      const bookElement = document.getElementById(book.id.toString());
  
      const confirmDelete = confirm(`Anda yakin ingin menghapus buku "${book.title}"?`);
  
      if (confirmDelete) {
        shelfList.removeChild(bookElement);
        updateBookshelfStorage();
      }
    }
  
    function searchBook() {
      const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();
      const allBooks = [...incompleteBookshelfList.children, ...completeBookshelfList.children];
  
      allBooks.forEach((bookItem) => {
        const title = bookItem.querySelector("h3").textContent.toLowerCase();
        const isVisible = title.includes(searchTitle);
        bookItem.style.display = isVisible ? "block" : "none";
      });
    }
  
    function updateBookshelfStorage() {
      const allBooks = [...incompleteBookshelfList.children, ...completeBookshelfList.children];
      const booksData = [];
  
      allBooks.forEach((bookItem) => {
        const id = parseInt(bookItem.id);
        const title = bookItem.querySelector("h3").textContent;
        const author = bookItem.querySelector("p:nth-child(2)").textContent.slice(9);
        const year = parseInt(bookItem.querySelector("p:nth-child(3)").textContent.slice(7));
        const isComplete = bookItem.querySelector(".action > button").classList.contains("green");
  
        booksData.push({
          id,
          title,
          author,
          year,
          isComplete,
        });
      });
  
      localStorage.setItem("booksData", JSON.stringify(booksData));
    }
  
    function loadBooksFromStorage() {
      const storedBooks = localStorage.getItem("booksData");
  
      if (storedBooks) {
        const booksData = JSON.parse(storedBooks);
  
        booksData.forEach((book) => {
          const shelfList = book.isComplete ? completeBookshelfList : incompleteBookshelfList;
          const bookItem = createBookItem(book, book.isComplete);
  
          shelfList.appendChild(bookItem);
        });
      }
    }
  
    // Load books from localStorage on page load
    loadBooksFromStorage();
  });
  