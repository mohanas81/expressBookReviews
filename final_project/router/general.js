const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const booksArr = Object.values(books);
const axios = require('axios').default;

public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;
  console.log("register :",username,password);
  console.log("users :",users);
  console.log("isValid :",isValid(username));
  if(username && password){
    if(isValid(username)){
      return res.status(400).send("Username already exists");
    }else{
      users.push({username,password});
      console.log("users :",users);
      return res.status(200).send("User successfully registered");
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 1 - Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  
  return res.status(200).send(JSON.stringify(books,null,4));

});

// Task 2 -Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  // let book = books.filter((book) => {
  //   return (book === req.params.isbn);
  // })
  return res.status(200).send(JSON.stringify(books[req.params.isbn],null,4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  let book = booksArr.filter((book) => {
    return (book.author.toLowerCase().normalize(('NFC')) === req.params.author.toLowerCase().normalize('NFC'));
  })
  return res.status(200).send(JSON.stringify(book,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  let book = booksArr.filter((book) => {
    return (book.title === req.params.title);
  })
  return res.status(200).send(JSON.stringify(book,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  return res.status(200).send(JSON.stringify(books[req.params.isbn].reviews,null,4));
});

// Task 10 - Get book with async axios 
public_users.get('/book/axios',async (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  await axios.get(`http://localhost:5000/`)
  .then((response) => {
      return res.status(200).send(JSON.stringify(response.data,null,4));
  })
  .catch((error) => {
      return res.status(400).send(error);
  });
  
});

// Task 11 - Get Book by isbn
public_users.get('/book/promise/:isbn', (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
   axios.get(`http://localhost:5000/isbn/${req.params.isbn}`)
  .then((response) => {
      return res.status(200).send(JSON.stringify(response.data,null,4));
  })
  .catch((error) => {
      return res.status(400).send(error);
  });
  
});

// Get book details based on author
public_users.get('/author/axios/:author',async function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const author = decodeURIComponent(req.params.author);
  await axios.get(`http://localhost:5000/author/${author}`)
  .then((response) => {
      return res.status(200).send(JSON.stringify(response.data,null,4));
  })
  .catch((error) => {
      return res.status(400).send(error);
  });
  
});

// Get all books based on title
public_users.get('/title/axios/:title',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  axios.get(`http://localhost:5000/title/${req.params.title}`)
  .then((response) => {
      return res.status(200).send(JSON.stringify(response.data,null,4));
  })
  .catch((error) => {
      return res.status(400).send(error);
  });
  
});


module.exports.general = public_users;
