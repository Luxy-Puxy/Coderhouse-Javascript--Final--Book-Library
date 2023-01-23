const apiEndpoint = 'https://www.googleapis.com/books/v1/volumes?q=intitle:harry+potter';

// This const will store book objects
let books = [];

// load the books array from API
function loadBooks() {
  //retrieve books from local storage
  const localBooks = JSON.parse(localStorage.getItem("books"));
  if(localBooks){
    books = localBooks;
    renderBooks();
  } else {
    fetch(apiEndpoint)
    .then(response => response.json())
    .then(data => {
      books = data.items;
      saveBooks();
      renderBooks();
    })
    .catch(error => {
      console.log('Error:', error);
    });
  }
}

// add a book to the books array - user will fill in the information on form fields

function addBook() {
  const bookTitle = document.getElementById("book-name").value;
  const bookAuthor = document.getElementById("book-author").value;
  const bookCategories = document.getElementById("book-genre").value;

  if (bookTitle === "" || bookAuthor === "" || bookCategories === "") {
    // display error message with Sweetalert
    swal("Error!", "Please fill out all form fields!", "error");
    return;
  }
  // add the book to the books array and save and render the books
  books.push({ volumeInfo: {title: bookTitle, authors: [bookAuthor], categories: [bookCategories] } });
  saveBooks();
  renderBooks();
  // clear the form fields
  document.getElementById("book-name").value = "";
  document.getElementById("book-author").value = "";
  document.getElementById("book-genre").value = "";
}



// delete a book from the books array - Will be triggered when the user clicks on any list item
function deleteBook(index) {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this book!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }) .then((willDelete) => {
      if (willDelete) {
        // delete the book
        books.splice(index, 1);
        saveBooks();
        renderBooks();
        swal("Poof! Your book has been deleted!", {
          icon: "success",
        });
      } else {
        swal("Your book is safe!");
      }
    });
}

// save the books array to localStorage
function saveBooks() {
  if(books.length > 0){
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// render the books array to index
function renderBooks() {
  const bookList = document.getElementById("book-list");
  bookList.innerHTML = "";

  // create list
  const ol = document.createElement("ol");

  // iterate over the books array
  books.forEach((book, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${book.volumeInfo.title} by ${book.volumeInfo.authors} (${book.volumeInfo.categories})`;
    // This function will delete the book contained on the list element when clicked
    li.onclick = () => deleteBook(index);
    ol.appendChild(li);
  });
  bookList.appendChild(ol);
}

// call the loadBooks function when the page loads
loadBooks();

