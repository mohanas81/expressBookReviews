const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

//const { use } = require('react');
const regd_users = express.Router();
const bookArr = Object.values(books);
let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let usernameExists = users.filter(user => user.username === username);
return usernameExists.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
console.log("authenticatedUser-users :",users);
console.log("authenticatedUser-users-length :",users.filter(user => user.username === username));
let validusers = users.filter((user) => {
  return (user.username === username && user.password === password);
});

// Return true if any valid user is found, otherwise false
if (validusers.length > 0) {
    return true;
} else {
        return false;
}

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;
  console.log("login :",username,password);
  console.log("users-login :",users);
  console.log("authenticatedUser-login :",authenticatedUser(username,password));
  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({data:password }, 'access',{expiresIn: '20m'});
    req.session.authorization = {accessToken,username};
    console.log("req.session.authorization :",req.session.authorization);
    res.status(200).send("User successfully logged in");
  }else{
    res.status(401).send("Invalid Login. Check username and password");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.authorization.username;
  const review = req.body.review;
  const isbn = req.params.isbn;

  // console.log("username :",username);
  // console.log("review :",review);
  // console.log("isbn :",isbn);
  books[isbn].reviews[username] = {review: review};
  // console.log("books[isbn] :",books[isbn]);
  // console.log("books[isbn].reviews :",books[isbn].reviews[username]);
  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: {
      [username]: books[isbn].reviews[username]
    }
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  // console.log("username :",username);
  // console.log("isbn :",isbn);
  const willDelete = books[isbn].reviews[username];
  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully",
    reviews: {
      [username]: willDelete
    }
  });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
