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


