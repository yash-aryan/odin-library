"use strict";

// DOM References
const formModal_DOM = document.querySelector(".form-modal");
const inputTitle_DOM = document.querySelector("#input-title");
const inputAuthor_DOM = document.querySelector("#input-author");
const inputPages_DOM = document.querySelector("#input-pages");
const inputRead_DOM = document.querySelector("#input-read");
const article_DOM = document.querySelector(".article");
const bgOverlay_DOM = document.querySelector("#close-modal");
const addBookBtn_DOM = document.querySelector("#add-book");

// Global Variables
let myLibrary = [];
let count = 0;

// Global Event Listeners
bgOverlay_DOM.addEventListener("click", closeFormModal);
addBookBtn_DOM.addEventListener("click", openFormModal);

// Runs only on form submit after validating inputs
document.forms[0].addEventListener("submit", addBookToTheLibrary);

// Event listener for "delete book" button, calls function deleteBook(node) with div.book-card as argument/node to be deleted from DOM
document.body.addEventListener("click", (e) => {
	if (e.target.closest(".delete-icon")) {
		const bookDOM = e.target.closest(".book-card");
		deleteBook(bookDOM);
	}
});

document.body.addEventListener("click", (e) => {
	if (e.target.closest(".change-read-icon")) {
		const bookDOM = e.target.closest(".book-card");
		changeReadStatus(bookDOM);
	}
});

function openFormModal(e) {
	e.preventDefault();
	formModal_DOM.style.display = "block";
	addBookBtn_DOM.style.display = "none";
	bgOverlay_DOM.style.display = "block";
}

function closeFormModal() {
	formModal_DOM.style.display = "none";
	addBookBtn_DOM.style.display = "block";
	bgOverlay_DOM.style.display = "none";
}

function Book(id, title, author, pages, read, dom) {
	this.id = id;
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.read = read;
}

Book.prototype.getInfo = function (type) {
	switch (type) {
		case "id":
			return this.id;

		case "title":
			return this.title;

		case "author":
			return this.author;

		case "pages":
			return this.pages;

		case "read":
			if (this.read) return "Completed";
			return "Not Read";

		case "readClassName":
			if (this.read) return "read-status-true";
			return "read-status-false";

		default:
			return console.log("Wrong input to switch case");
	}
};

// Function that runs on Form Submit
function addBookToTheLibrary(e) {
	e.preventDefault();
	closeFormModal();

	// Create object instance of Book
	const book = new Book(
		count, // id
		inputTitle_DOM.value, // title
		inputAuthor_DOM.value, // author
		inputPages_DOM.value, // pages
		inputRead_DOM.checked // read status
	);

	// book gets added to myLibrary Array
	myLibrary.push(book);
	createBookDOM(book);
	++count;
	// Reset form inputs for any next book
	document.querySelector("#form-element").reset();
}

// Creates book-card on DOM for the given book instance
function createBookDOM(book) {
	article_DOM.innerHTML += `
  <div class="book-card" data-index="${book.getInfo("id")}">
    <div class="title-container">
      <h3>${book.getInfo("title")}</h3>
      <div class="delete-icon"></div>
    </div>
    <p>Author: <span>${book.getInfo("author")}</span></p>
    <p>Pages: <span>${book.getInfo("pages")}</span></p>
    <div class="read-status">
			<p>Status: <span class="${book.getInfo("readClassName")}">${book.getInfo("read")}</span></p>
			<div class="change-read-icon"></div>
		</div>
  </div>
  `;
}

// This function runs when user clicks delete book icon
// that book is removed from the Array & DOM
function deleteBook(nodeToBeDeleted) {
	myLibrary.splice(nodeToBeDeleted.dataset.index, 1); // Removes book from myLibrary Array
	nodeToBeDeleted.remove(); // Deletes div.book-card from DOM
	updateBookDataIndex();
}

// After deletion, all books get new index position in Array, which is mismatch from their stored id
// This function updates book.id & data-index for all remaining books in Array
function updateBookDataIndex() {
	myLibrary.forEach((element) => {
		const newIndex = myLibrary.indexOf(element);
		document.querySelector(`[data-index="${element.id}"]`).dataset.index = newIndex;
		element.id = newIndex;
	});
	count = myLibrary.length;
}

function changeReadStatus(node) {
	const book = myLibrary[node.dataset.index];
	if (book.read) {
		const readStatus = node.children[3].children[0].children[0];
		readStatus.classList.remove(`${book.getInfo("readClassName")}`);
		book.read = false;
		readStatus.textContent = `${book.getInfo("read")}`;
		readStatus.classList.add(`${book.getInfo("readClassName")}`);
	}
	else {
		const readStatus = node.children[3].children[0].children[0];
		readStatus.classList.remove(`${book.getInfo("readClassName")}`);
		book.read = true;
		readStatus.textContent = `${book.getInfo("read")}`;
		readStatus.classList.add(`${book.getInfo("readClassName")}`);
	}
}