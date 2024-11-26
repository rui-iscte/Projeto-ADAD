/*import express from 'express'

//const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
 res.send('Backend!')
})

app.listen(port, () => {
 console.log(`backend listening on port ${port}`)
})*/

/*import express from 'express'
import movies from "./routes/movies.js";
import users from "./routes/users.js";

const app = express()
const port = 3000

app.use(express.json());

// Load the /movies routes
app.use("/movies", movies);

// Load the /users routes
app.use("/users", users);

app.listen(port, () => {
    console.log(`backend listening on port ${port}`)
})*/

import express from 'express'
import cors from "cors";

import books from "./routes/books.js";
import users from "./routes/users.js";
import comments from "./routes/comments.js";
import livrarias from "./routes/livrarias.js";

const app = express()
const port = 3000

app.use(cors());
app.use(express.json());

// Load the /books routes
app.use("/books", books);

// Load the /users routes
app.use("/users", users);

// Load the /comments routes
app.use("/comments", comments);

// Load the /livrarias routes
app.use("/livrarias", livrarias);

app.listen(port, () => {
    console.log(`backend listening on port ${port}`)
})