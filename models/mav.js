/////////////////////////////////////////////
// Our schema and model for the team resource
/////////////////////////////////////////////
const mongoose = require("mongoose")
// pull Schema and model from mongoose
// use syntax called "destructuring"
const {Schema, model} = mongoose
// Car  schema
// rules for Schema
const mavSchema = new Schema({
    name: String,
    color: String,
    comingOffTheBench: Boolean
})
// player position model
// model takes 2 args
// first is what we call our model
// the second is what we will use to build the model
const Mav = model("Player", mavSchema)
/////////////////////////////////////////////
// Export our model
/////////////////////////////////////////////
module.exports = Mav