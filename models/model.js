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