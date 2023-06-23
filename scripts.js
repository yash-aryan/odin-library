"use strict";
// Module IIFE for Counter
const counter = (() => {
	let _count = 0;

	function increment() {
		_count++;
	}

	function getCurrCount() {
		return _count;
	}

	function setCount(value) {
		_count = value;
	}

	return {
		increment,
		getCurrCount,
		setCount
	};
})();

// Module IIFE for Form Modal
const formModal = (() => {
	const _modal = document.querySelector(".form-modal");
	const _bgOverlay = document.querySelector("#close-modal");
	const _addBookBtn = document.querySelector("#add-book");
	_addBookBtn.addEventListener("click", _open);
	_bgOverlay.addEventListener("click", close);

	function _open() {
		_modal.style.display = "block";
		_bgOverlay.style.display = "block";
		_addBookBtn.style.display = "none";
	}

	function close() {
		_modal.style.display = "none";
		_bgOverlay.style.display = "none";
		_addBookBtn.style.display = "block";
	}

	return {
		close
	};
})();

// Global
let myLibrary = [];
document.forms[0].addEventListener("submit", addBookToLibrary);

// This Anonymous IIFE sets eventListener on elements in book-card
(function () {
	document.body.addEventListener("click", _modifyBookCard);

	// Runs different function depends on what element was clicked
	function _modifyBookCard(e) {
		const bookCard = e.target.closest(".book-card");
		if (e.target.closest(".delete-icon")) {
			_deleteBook(bookCard);
		} else if (e.target.closest(".change-read-icon")) {
			_changeReadStatus(bookCard);
		}
	}

	function _changeReadStatus(bookCard) {
		const book = myLibrary[bookCard.dataset.id];
		const readStatus = bookCard.children[3].children[0].children[0];
		if (book.read) {
			readStatus.classList.remove(`${book.getInfo("readClassName")}`);
			book.read = false;
			readStatus.textContent = `${book.getInfo("read")}`;
			readStatus.classList.add(`${book.getInfo("readClassName")}`);
		} else {
			readStatus.classList.remove(`${book.getInfo("readClassName")}`);
			book.read = true;
			readStatus.textContent = `${book.getInfo("read")}`;
			readStatus.classList.add(`${book.getInfo("readClassName")}`);
		}
	}

	// This function removes the selcted book from the Array & DOM
	function _deleteBook(bookCard) {
		myLibrary.splice(bookCard.dataset.id, 1); // Removes book from myLibrary Array
		bookCard.remove(); // Deletes div.book-card from DOM
		_updateBookId();
	}

	// This function updates book.id & data-id with their new position in Array
	function _updateBookId() {
		myLibrary.forEach((element, index) => {
			document.querySelector(`[data-id="${element.id}"]`).dataset.id = index;
			element.id = index;
		});
		counter.setCount(myLibrary.length);
	}
})();

// Function that runs on Form Submit
function addBookToLibrary(e) {
	e.preventDefault();

	class Book {
		constructor(id, title, author, pages, read) {
			this.id = id;
			this.title = title;
			this.author = author;
			this.pages = pages;
			this.read = read;
		}

		getInfo(type) {
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
		}
	}

	const inputTitle = document.querySelector("#input-title");
	const inputAuthor = document.querySelector("#input-author");
	const inputPages = document.querySelector("#input-pages");
	const inputRead = document.querySelector("#input-read");
	const article = document.querySelector(".article");

	// Create object instance of Book
	const book = new Book(
		counter.getCurrCount(), // id
		inputTitle.value, // title
		inputAuthor.value, // author
		inputPages.value, // pages
		inputRead.checked // read status
	);

	// instance gets pushed into myLibrary Array
	myLibrary.push(book);
	counter.increment();
	document.querySelector("#form-element").reset();
	formModal.close();

	// This Anonymous IIFE creates book-card on DOM of the instance
	(function (book) {
		article.innerHTML += `
		<div class="book-card" data-id="${book.getInfo("id")}">
			<div class="title-container">
				<h3>${book.getInfo("title")}</h3>
				<div class="delete-icon"></div>
			</div>
			<p>Author: <span>${book.getInfo("author")}</span></p>
			<p>Pages: <span>${book.getInfo("pages")}</span></p>
			<div class="read-status">
				<p>Status: <span class="${book.getInfo("readClassName")}">${book.getInfo(
			"read"
		)}</span></p>
				<div class="change-read-icon"></div>
			</div>
		</div>
		`;
	})(book);
}
