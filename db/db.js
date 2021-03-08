// Once again the first step is to ensure all the necessary modules and files are being called

// mongoose is a 'straight-forward, schema-based solution to model your application data.' Basically it makes our databasing lives easier, and we love it for that.
const mongoose = require ('mongoose');

// once mongoose has been required we're actually going to connect to our database.
// in this case, the user 'mongoose' with password 'tutorial' is going to the mongo server at localhost and connecting to the 'mongooseTutorial' database
mongoose.connect('mongodb://mongoose:tutorial@localhost/mongooseTutorial',
  {useNewUrlParser: true})
  .catch(e => {
  console.error ("!!! Connection issue: ", e.message)
})

// once the connection has been made, we create a variable containing the information of the connection....
const db = mongoose.connection;

// ... and we export it for use in the index.js file and beyond 
module.exports = db
