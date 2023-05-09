const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   return res.send(JSON.stringify(books,null,4));
// });
public_users.get('/', function (req, res) {
  //Write your code here
  getBooks()
    .then(response => {
      return res.send(response);
    }).catch(err => {
      return res.status(404).json({ errorMessage: err.message });
    })
});

function getBooks() {
  return new Promise((resolve) => {
    resolve(JSON.stringify(books, null, 4));
  });
}

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   const isbn = req.params.isbn;
//   return res.send(JSON.stringify(books[isbn],null,4)) 
//  });

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  getIsbnBook(isbn)
    .then(bookRecord => {
      return res.send(bookRecord);
    }).catch(err => {
      return res.status(404).json({ errorMessage: err });
    })
});

function getIsbnBook(isbn) {
  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book Wasn't Found");
    }
  });
}
  
// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//   const author = req.params.author;
//   let authorBooks = []
//   for(let i = 1; books[i]; i++){
//     if(books[i].author == author) {
//       authorBooks.push(books[i])
//     }
//   }
//   return res.send(JSON.stringify(authorBooks,null,4)) 
// });
public_users.get('/author/:author', function (req, res) {

  const author = req.params.author;

  getBookByAuthor(author)
    .then(response => {
      return res.send(response);
    }).catch(err => {
      return res.status(404).json({ errorMessage: err.message });
    })
});

function getBookByAuthor(author) {
  return new Promise((resolve, reject) => {
    const authorBooks = Object.values(books).filter(book => book.author == author);
    if (authorBooks.length > 0) {
      resolve(authorBooks);
    } else {
      reject("Book Wasn't Found");
    }
  });
}

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   const title = req.params.title;
//   let titleBooks = []
//   for(let i = 1; books[i]; i++){
//     if(books[i].title == title) {
//       titleBooks.push(books[i])
//     }
//   }
//   return res.send(JSON.stringify(titleBooks,null,4)) 
// });

public_users.get('/title/:title', function (req, res) {

  const title = req.params.title;

  getBookByTitle(title)
    .then(response => {
      return res.send(response);
    }).catch(err => {
      return res.status(404).json({ errorMessage: err.message });
    })

});

function getBookByTitle(title) {
  return new Promise((resolve, reject) => {
    const titleBooks = Object.values(books).filter(book => book.title == title);
    if (titleBooks.length > 0) {
      resolve(titleBooks);
    } else {
      reject("Book Wasn't Found");
    }
  });
}

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn].reviews,null,4)) 
});

module.exports.general = public_users;
