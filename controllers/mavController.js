////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express")
const Mav = require("../models/mav")

/////////////////////////////////////////
// Create Router
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////////
// Routes
////////////////////////////////////////////
// GET request
// index route -> shows all instances of a document in the db
router.get("/", (req, res) => {
    // console.log("this is the request", req)
    // in our index route, we want to use mongoose model methods to get our data
    Mav.find({})
        .populate("comments.author", "username")
        .then(mavs => {
            // console.log(fruits)
            // this is fine for initial testing
            // res.send(fruits)
            // this the preferred method for APIs
            // res.json({ fruits: fruits })
            // here, we're going to render a page, but we can also send data that we got from the database to that liquid page for rendering
            res.render('mavs/index', { fruits })
        })
        .catch(err => console.log(err))
})

// POST request
// create route -> gives the ability to create new fruits
router.post("/", (req, res) => {
    // here, we'll get something called a request body
    // inside this function, that will be referred to as req.body
    // this is going to add ownership, via a foreign key reference, to our fruits
    // basically, all we have to do, is append our request body, with the `owner` field, and set the value to the logged in user's id
    req.body.owner = req.session.userId
    // we'll use the mongoose model method `create` to make a new fruit
    Mav.create(req.body)
        .then(mav => {
            // send the user a '201 created' response, along with the new fruit
            res.status(201).json({ mav: mav.toObject() })
        })
        .catch(error => console.log(error))
})

// GET request
// only fruits owned by logged in user
// we're going to build another route, that is owner specific, to list all the fruits owned by a certain(logged in) user
router.get('/mine', (req, res) => {
    // find the fruits, by ownership
    Mav.find({ owner: req.session.userId })
    // then display the fruits
        .then(mavs => {
            res.status(200).json({ mavs: mavs })
        })
    // or throw an error if there is one
        .catch(error => res.json(error))
})

// PUT request
// update route -> updates a specific fruit
router.put("/:id", (req, res) => {
    // console.log("I hit the update route", req.params.id)
    const id = req.params.id
    Mav.findById(id)
        .then(mav => {
            if (mav.owner == req.session.userId) {
                res.sendStatus(204)
                return mav.updateOne(req.body)
            } else {
                res.sendStatus(401)
            }
        })
        .catch(error => res.json(error))
})

// DELETE request
// destroy route -> finds and deletes a single resource(fruit)
router.delete("/:id", (req, res) => {
    // grab the id from the request
    const id = req.params.id
    // find and delete the fruit
    // Fruit.findByIdAndRemove(id)
    Mav.findById(id)
        .then(mav => {
            // we check for ownership against the logged in user's id
            if (mav.owner == req.session.userId) {
                // if successful, send a status and delete the fruit
                res.sendStatus(204)
                return mav.deleteOne()
            } else {
                // if they are not the user, send the unauthorized status
                res.sendStatus(401)
            }
        })
        // send the error if not
        .catch(err => res.json(err))
})

// SHOW request
// read route -> finds and displays a single resource
router.get("/:id", (req, res) => {
    const id = req.params.id

    Mav.findById(id)
        // populate will provide more data about the document that is in the specified collection
        // the first arg is the field to populate
        // the second can specify which parts to keep or which to remove
        // .populate("owner", "username")
        // we can also populate fields of our subdocuments
        .populate("comments.author", "username")
        .then(mav => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            // res.json({ fruit: fruit })
            res.render('mavs/show', { mav, username, loggedIn, userId })
        })
        .catch(err => console.log(err))
})


//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router