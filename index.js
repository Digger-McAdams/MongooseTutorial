
// First up we're going to require the necessary modules and get them ready to party.

// express is nodeJS framework which is going to make our lives a lot easier when it comes to building routes and organising everything.
const express = require ('express');
// bodyparser is going to allow us to read the information being passed through in the body of the html requests
const bodyParser = require ('body-parser');
// router is a reference to the router.js files which contain all the information and functions regarding the routes we will be building.
const router = require ("./routes/router.js");

// by calling db.js, we're essentially turning on the database connection
const db = require ('./db/db.js');
db.on('!!! Error: ', console.error.bind(console, 'Mongo connection error: '))

// this turns on express
const app = express();

// next we enable body-parser
app.use (bodyParser.urlencoded({extended: true}));
app.use (bodyParser.json());

// here we tell our new application that all of its routing data is coming from (const) router, which in turn is a reference to router.js
app.use ('/', router);

// and lastly we are going to 'turn on' our server, activating it to port 3009 with a very obvious console.log message for readability reasons.
app.listen(3009, () => {
  console.log("\n\n\t\t\t || SERVER IS UP AND RUNNING || \n\n");
});

// Our next step is to build the db.js file
