class Book {
	constructor(title, author, noOfPages, read) {
		this.title = title;
		this.author = author;
		this.noOfPages = noOfPages;
		this.read = read;
	}
}

class render {
	static displayBooks() {
		const books = Store.getBooks();
		books.forEach(book => render.addBookToList(book));
	}

	static addBookToList(book) {
		const list = document.getElementById("list");
		const row = document.createElement('tr');
		row.innerHTML = `
		<td>${book.title}</td>
		<td>${book.author}</td>
		<td>${book.noOfPages}</td>
		<td class="readEvent">${book.read}</td>
		<td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
		`;
		list.appendChild(row);
	}

	static clearFields() {
		document.querySelector("#formTitle").value='';
		document.querySelector("#formAuthor").value='';
		document.querySelector("#formNoOfPages").value='';
	}

	static changeStatus(el) {
		if(el.classList.contains('readEvent')) {
			if(el.textContent === "Yes") {
				el.textContent = "No";
				Store.changeReadStatus(el.previousElementSibling.previousElementSibling.previousElementSibling.textContent);
			}
			else if(el.textContent === "No"){
				el.textContent = "Yes";
				Store.changeReadStatus(el.previousElementSibling.previousElementSibling.previousElementSibling.textContent);
			}
		}
	}

	static deleteBook(el) {
		if(el.classList.contains('delete')) {
			el.parentElement.parentElement.remove();

			Store.removeBook(el.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent);

			render.showAlert("Book Removed", "success");
		}
	}

	static showAlert(message, alertClass) {
		const div = document.createElement("div");
		div.className = "alert alert-" + alertClass;
		div.appendChild(document.createTextNode(message));
		const container = document.querySelector('.container');
		const form = document.querySelector('#form');
		container.insertBefore(div, form);
		//Vanish in 3 secs
		setTimeout(() => document.querySelector(".alert").remove(), 3000);
	}
}

class Store {
	static getBooks() {
		let books;
		if(localStorage.getItem('books') === null) {
			books = [];
		}
		else {
			books = JSON.parse(localStorage.getItem('books'));
		}
		return books;
	}

	static addBook(book) {
		const books = Store.getBooks();
		books.push(book);

		localStorage.setItem('books', JSON.stringify(books));
	}

	static removeBook(title) {
		const books = Store.getBooks();
		books.forEach((book, index) => {
			if(book.title === title) {
				books.splice(index, 1);
			}
		});

		localStorage.setItem('books', JSON.stringify(books));
	}
	
	static changeReadStatus(title) {
		let books = Store.getBooks();
		books.forEach(book => {
			if(book.title === title) {
				if(book.read === "Yes") {
					book.read = "No";
				}
				else if(book.read === "No"){
					book.read = "Yes";
				}
			}
		});

		localStorage.setItem('books', JSON.stringify(books));
	}
}


//Event Listeners
document.addEventListener('DOMContentLoaded', render.displayBooks );

let subBtn = document.getElementById("submit");
subBtn.addEventListener('click', (e) => {
	e.preventDefault();
	let titleInput = document.getElementById('formTitle').value;
	let authorInput = document.getElementById('formAuthor').value;
	let noOfPagesInput = document.getElementById('formNoOfPages').value;
	let readInput;
	if(document.getElementById('formRead').checked) {
		readInput = "Yes";
	}
	else{
		readInput = "No";
	}

	if(titleInput === '' || authorInput === '' || noOfPagesInput === ''){
		render.showAlert("Please fill in all fields", "danger");
	}
	else {
		let newBook = new Book(titleInput, authorInput, noOfPagesInput, readInput);
		render.addBookToList(newBook);
		Store.addBook(newBook);
		render.showAlert("Book added successfully", "success");
		render.clearFields();
	}
});

let bookList = document.getElementById("list");
bookList.addEventListener('click', (e) => {
	render.deleteBook(e.target);
	render.changeStatus(e.target);
});
