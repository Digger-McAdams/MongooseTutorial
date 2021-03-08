// As always we'll begin by ensuring all the necessary modules and files are being called

const express = require ('express');
// this calls the router const into being which will enable us to export it for use in the index.js by the end of this page
const router = express.Router();

// this references the controller.js file and imports all the functions we'll be building next
const theFatController = require ('../controllers/controller.js');


// next are the routes. these dictate what happens when a http request is sent to the relevant url. 
// in our case, our base domain is scwebsrv-six.site so scwebsrv-six.site:3009 will respond to .get requests sent there with the getDB function provided by the controller.js file 
// accordingly, scwebsrv-six.site:3009/createuser will respond to .post requests with the .createUser function.
// you'll notice that each route has a different suffix: each suffix reflects a different http request being called. 

// .get is a standard request for information. browsers looking for a webpage use this. 
// .post sends information to the server for use, often being used to save input information from a website form to a database.
// .put is used to send data to a server to update the information stored in its database.
// .delete is used to send a request to a server to delete information stored in a database.


// this returns the database
router.get ('/', theFatController.getDB)

// this fires off the information to be saved in the database
router.post ('/createuser', theFatController.createUser)

// this one updates the user's information in the database
router.put ('/updateuser/id=:id', theFatController.updateUser)

// this one deletes a user from the database
router.delete ('/delete/id=:id', theFatController.deleteUser)


// we export the data in this file so the routing information can be utilised by the index.js file
module.exports = router;