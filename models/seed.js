///////////////////////////////////////
// Import Dependencies
///////////////////////////////////////
const mongoose = require('./connection')
const Mav = require('./mav')

// Here, we're going to set up a seed script
// this will seed our database for us, so we have some starting resources
// This script will be run, with the command in the terminal `npm run seed`

// router.get("/seed", (req, res) => {
//     // array of starter fruits

//     // Delete every fruit in the db
//     Fruit.deleteMany({})
//         .then(() => {
//             // seed with the starter fruits array
//             Fruit.create(startFruits)
//                 .then(data => {
//                     res.json(data)
//                 })
//         })
// })

///////////////////////////////////////
// Seed Script code
///////////////////////////////////////
// first we need our connection saved to a variable for easy reference
const db = mongoose.connection

db.on('open', () => {
    // bring in the array of starter fruits
    const startMavs = [
        { name: "Luka Doncic", position: "Point Huard", readyToPlay: false },
        { name: "Spencer Dinwiddie", position: "Shooting Guard", readyToPlay: false },
        { name: "Doe Finney-Smith", position: "Power Forward", readyToPlay: false },
        { name: "Reggie Bullock", position: "Small Forward", readyToPlay: false },
        { name: "Javale McGee", position: "Center", readyToPlay: false},
    ]

    // delete all the existing fruits
    Mav.deleteMany({ owner: null })
        .then(deletedMavs => {
            console.log('this is what .deleteMany returns', deletedMavs)

            // create a bunch of new fruits from startFruits
            Mav.create(startMavs)
                .then(data => {
                    console.log('here are the newly created mavs', data)
                    // always close connection to the db
                    db.close()
                })
                .catch(error => {
                    console.log(error)
                    // always close connection to the db
                    db.close()
                })
        })
        .catch(error => {
            console.log(error)
            // always close connection to the db
            db.close()
        })
})