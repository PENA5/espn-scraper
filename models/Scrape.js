var mongoose = require("mongoose");
// Save a reference to the Schema constructor
var Schema = mongoose.Schema;
// Using the Schema constructor, create a new UserSchema object
var ScrapeSchema = new Schema({

  title: {
    type: String,
    required: true
  },
  
  link: {
    type: String,
    required: true
  },
  

});
// This creates our model from the above schema, using mongoose's model method
var Scrape = mongoose.model("Scrape", ScrapeSchema);
// Export the Article model
module.exports = Scrape;