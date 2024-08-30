const express = require("express")
const app = express()
const PORT = 4000
const rateLimit = require('express-rate-limit')
const bodyParser = require('body-parser')
const MongoClient = require("mongodb").MongoClient
const cors = require("cors")
require('dotenv').config()
const controller = require("./controllers/apiController.js")

let dbName = process.env.DBNAME
const connectionString = process.env.MONGO_URI

app.set('view engine', 'ejs')
app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))

//cache

//rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //ten minutes
    max: 1000
})
// app.use('/api', limiter)
app.set('trust proxy', 1)


let db
MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    }).then(() => {
        app.listen(process.env.PORT || PORT, () => {
            console.log(`The server is running on port ${PORT}`)
        })
    })

app.get('/', (req, res) => {
     controller.getHome(req,res,db)

    // db.collection('characters').find().toArray()
    //     .then(data => {
    //         data = shuffle(data)
    //         res.render('index.ejs', { characters: data })
    //     })
    //     .catch(error => console.error(error))
})

const NodeCache = require("node-cache");

const myCache = new NodeCache();
const ejs = require('ejs');



app.get("/documentation", async (req, res) => {
    if(myCache.get("documentation")){
        res.send(myCache.get("documentation"))
        return
    }
    res.sendFile(__dirname + "/documentation.html")

    const data = await ejs.renderFile(__dirname + "/documentation.html", {})
    console.log(data)
    myCache.set("documentation",data)
})
app.get("/about", async (req, res) => {
    res.sendFile(__dirname + "/about.html")
})

app.get("/api", async (req, res) => {
    res.json({ "characters": "/api/characters", "quotes": "/api/quotes", "deaths": "/api/deaths" })
    let visitorCount = await db.collection('count').find().toArray()

    await db.collection("count").updateOne({ 'count': visitorCount[0].count }, { $set: { "count": visitorCount[0].count + 1 } }, function (err, res) {
        if (err) throw err;
    })
})

app.get("/api/characters/random", async (req, res) => {
    await controller.getRandomCharacter(req, res, db)
})
app.get("/api/characters/:id", async (req, res) => {
    await controller.getCharacterById(req, res, db)
})

app.get("/api/characters", async (req, res) => {
    await controller.getAllCharacters(req, res, db)
})


// //Quotes
app.get("/api/quotes/random", async (req, res) => {
    await controller.getRandomQuote(req, res, db)
})
app.get("/api/quotes/:name", async (req, res) => {
    await controller.getQuoteByName(req, res, db)

})

app.get("/api/quotes", async (req, res) => {
    await controller.getAllQuotes(req, res, db)

})

// //deaths
app.get("/api/deaths", async (req, res) => {
    await controller.getAllDeaths(req, res, db)
})

app.get("/api/deaths/random", async (req, res) => {
    await controller.getRandomDeath(req, res, db)
})

app.get("/api/deaths/:whodidit", async (req, res) => {
    await controller.getDeathsCausedByCharacter(req, res, db)
})

// //character by category
app.get("/api/category/:category", async (req, res) => {
    await controller.getCharacterByCat(req, res, db)
})

app.get('*', function (req, res) {
    res.status(404).json({ "characters": "/api/characters", "quotes": "/api/quotes", "deaths": "/api/deaths" });
});
