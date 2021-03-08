# Mongoose Tutorial


## Step 1 - Setting up the file structure

1. We'll begin by starting up our file structure. 

![The File structure for this project - mongoose-tutorial->controllers, db, models, routes](http://scwebsrv-six.site/web-108-mongo/assignments/mongoose-tutorial/mdtutorial/images/filestructure.JPG)

2. Once that's done, head to the main folder ('./mongoose-tutorial) and run this command:

``npm init``

This will initialise npm for your new app.

## Step 2 - Installing the necessary packages

1. Now that npm is up and running, we need to install the appropriate packages for us to use. You can install them in one go, or individually - your choice.

``npm install mongoose express body-parser``

Or:

``npm install mongoose``
``npm install express``
``npm install body-parser``

## Step 3 - With all our dependancies in order, let's start throwing down some NodeJS.

1. As the basis of our new application, we'll kick off with the index.js file.

```
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
```

## Step 4 - With our foundation begun, let's continue on and build the database file.

```
// Once again the first step is to ensure all the necessary modules and files are being called

// mongoose is a 'straight-forward, schema-based solution to model your application data.' Basically it makes our databasing lives easier, and we love it for that.
const mongoose = require ('mongoose');

// once mongoose has been required we're actually going to connect to our database.
// in this case, the user 'mongoose' with password 'tutorial is going to the mongo server at localhost and connecting to the 'mongooseTutorial' database
mongoose.connect('mongodb://mongoose:tutorial@localhost/mongooseTutorial',
  {useNewUrlParser: true})
  .catch(e => {
  console.error ("!!! Connection issue: ", e.message)
})
// once the connection has been made, we create a variable containing the information of the connection....
const db = mongoose.connection;

// ... and we export it for use in the index.js file and beyond 
module.exports = db
```

## Step 5 - Next up, we'll build the router.js file which, you guessed it, will define all our routes.

```
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
```

## Step 6 - Time to construct our schema, which will act as a blueprint for all our data being used and thrown around.

```
// next up we're going to build the schema for storing the information. as the mongoose documentation puts it: 
// "Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection."

// seeing as mongoose is about to be used quite heavily, we start by requiring it
const mongoose = require ('mongoose');
// next up, we're going to create a new instance of the mongoose.Schema
const Schema = mongoose.Schema;

// and then set how a User object will look. It will act as a blueprint which informs whatever calls it of its basic structure, the data it requires and how it wants that data presented.
const User = new Schema 
  (
    {
      // once theses are defined and we had valid entries in the database we can start calling User.firstName to get access to the data in firstName
      firstName: {type: String, require: true},
      lastName: {type: String, require: true},
      email: {type: String, require: true},
    },
  )


// this uses the 'posts' collection for the Post schema just defined
module.exports = mongoose.model('users', User)
```

## Step 7 - Last, but certainly not least, we'll lay out the controller.js file, which will tell our app what to do when requests are sent to our server.

```
// Finally, we're going to build the controller file. This holds all the functions which will be used by the router to determine what happens when a user navigates where. 

// we're going to require the model file which contains the Schema blueprints we just built
const User = require ('../models/model.js')


// our first function. this is the .get request that is invoked when a http request is sent to scwebsrv-six.site:3009.
// important to note that these are callback functions and as such require a returned value of some kind.
getDB = (req,res) => {
  
  // this is a mongoose command which queries a database and if it finds anything within its parameters then returns that data.
  // in this case, the parameters {} are empty so it will return any data found within the 'users' collection (as defined in the model.js file)
  //  in the form of a json file which will be displayed in the browser
  User.find({}, (err, users) => {
    if (err) {
      return res.status(400).json ({success: false, error: err})
    }
    return res.status(200).json({success: true, data: users})
  })
}


// createUser is a post request, and will take the information provided in the body of the request and save it to the database.
createUser = (req, res) => {
  
  // the if statement here ensures that there actually was data sent along, to prevent empty entries being saved
  const body = req.body;
  if (!body) {
    return res.status(400).json ({
      success: false,
      error: "Please provide an item"
    })
  }
  
  // we create a variable user that is a new instance of the User object (as defined by the Schema in model.js) with the information provided by the body variable
  const user = new User (body)
  // quick check to ensure it worked as it should, to once again prevent bad data being passed
  if (!user) {
    return res.status(400) // status 400 is 'bad request'
  }
  
  // another mongoose function, in this case it saves the new user object to the database in accordance with the blueprint established by the Schema
  user.save().then (() => {
    // returns a json file confirming the success of the function
    return res.status(200).json ({
      success: true,
      id: user._id,
      message: 'New user added.'
      })
     }).catch(error => {
    // and then a cheeky piece of error handling, so in the case the operation fails we'll get a clue as to why
      return res.status(400).json ({
        error,
        message: 'Insert failed'
      })
    })
}


// our .update request. this one is a little different because it passes through the id of the entry we'll be deleting in the url. 
//  if you were to double check the route in router.js, you would see the route is for '/updateuser/id=:id'. the :id is the database objectid being passed through to identify the entry being updated.
//  for example, we could shoot through a request to :            scwebsrv-six.site:3009/updateuser/id=604575746cbe47014bccd70f
//  you'll note the objectid is in the same spot as :id in the route, and is indeed how we define it
updateUser = (req, res) => {
  
  // to call our fancy new piece of parameter information, we can call req.params.id
  let id = req.params.id; // id will now equal '604575746cbe47014bccd70f'
  
  // next up we define an object which contains the information sent through with in the .post request, and crucially, *is defined in a way to match the Schema being used*.
  let newDeets = {
                   firstName: req.body.firstName,
                   lastName: req.body.lastName,
                   email: req.body.email,
                  };
  
  // this is the mongoose operation which will update our desired entry, and it essentially works in three parts.
  // step 1: it takes the id variable as defined above and searches for it in the database. 
  // step 2: if a matching entry is found, it will take the new data (newDeets) and update any information with matching keys.
  //  to be precise, a database object like so {                   being updated by an object like so {                       
  //                                            firstName: "bob",                                       firstName: "Orlando",   matching data in                                                 
  //                                            lastName: "ross"                                        nickName: "Legolas"
  //                                           }                                                      }
  //   will ONLY update the firstName data, as that is what matches the schema's blueprint.
  // step 3: returns some json reporting its success or failure
  User.findByIdAndUpdate( id, newDeets, (err, updated) => {
      if (err) {
        res.json({success: false, msg: 'Update failed', Details: err})
      } else {
        res.json({success: true, msg: 'User updated', Details: newDeets})
      }
    }
  )  
}


// our final request: a .delete. Pretty straightforward
deleteUser = (req, res) => {
  
  // as with the .put request, we're sending the objectId through with the url, and we will claim it in the same way
  let id = req.params.id;
    
  // deleteOne checks the database for a matching _id key, and deletes the entry if found. as with the other functions, it returns a json file if there is an error or when (if) the request succeeds. 
  User.deleteOne({_id: id}, (err, users) => {
    if (err) {
      return res.status(400).json ({success: false, error: err})
    }
      return res.status(200).json ({success: true, data: users})
  })
}


// within the router.js file when we define  - const theFatController = require ('../controllers/controller.js');
//  we're essentially creating theFatController as an object. 
// below we're exporting the specific functions within this file as an object to reflect the above
module.exports = { getDB, createUser, updateUser, deleteUser };
```


## Step 8 - With our API finished, now we'll head over to Postman to test and then use our new app.

1. We have four requests to try out, so we'll begin with the .get request.

![Postman screenshot of a .GET request](http://scwebsrv-six.site/web-108-mongo/assignments/mongoose-tutorial/mdtutorial/images/getrequest.jpg)

* For this request, the two important sections are both marked. The red rectangle is where a user selects the type of request they want to perform, and the blue rectangle is where the address to-be-queried is input. Enter the appropriate address in the address bar, select .GET, hit the send button on the right and then celebrate your imminent success.

2. Next we'll hit up the .post request.

![Postman screenshot of a .POST request](http://scwebsrv-six.site/web-108-mongo/assignments/mongoose-tutorial/mdtutorial/images/postrequest.jpg)

* For this request, we need to introduce a few more elements of Postman. First up, change the request to POST and update the address to reflect the POST request route (/createuser).
* In order to send information through, head to the yellow square and select the 'Body' tab. Once that is done, we need to select the how we want to send the data through by heading to the brown circle and selecting 'raw', and then to the purple star to designate our data type as JSON.
* Once that's all selected, we can begin entering the actual data to be sent by heading to the green trapezoid and inputting it in the format of a JSON object.
* After all that, hit that send button baby and enjoy your congratulatory message in the response window at the lower portion of the screen. 

3. Third-in-line: .put request.

![Postman screenshot of a .PUT request](http://scwebsrv-six.site/web-108-mongo/assignments/mongoose-tutorial/mdtutorial/images/putrequest.jpg)

* Once we change the request to PUT there is only one new element to introduce this time, and that is how to pass parameter through the URL. Bounce to the pastel parallelogram, and we merely need to update the server address to include the route (/updateuser/id=) and then paste the objectId we wish to access and update.
* In the request Body we want to include the updated data we wish into the database, and then hit send.

4. Finally, the .delete request. 

![Postman screenshot of a .DELETE request](http://scwebsrv-six.site/web-108-mongo/assignments/mongoose-tutorial/mdtutorial/images/deleterequest.JPG)

* Now that you're a master of Postman, this will seem too easy. Update the request choice (DELETE), update the route (/route/id=) with the objectId you wish to erase from the universe, and shoot it off. Too easy Campese!

## Step 9 - Celebrate your newfound skills with a celebratory beer. Cheers!
