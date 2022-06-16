//express + MONGO SET UP
const express = require("express")
const app = express()
const PORT = 8000
const rateLimit = require('express-rate-limit')
const bodyParser= require('body-parser')
const apicache = require('apicache')
const MongoClient = require("mongodb").MongoClient
const cors = require("cors")
require('dotenv').config()

let db 
let dbName = 'the-wire-api'
const connectionString = process.env.MONGO_URI
    
MongoClient.connect(connectionString,{ useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

    app.use(cors())
    app.use(express.static('public'))
    app.use(express.urlencoded({ extended: true }))
    app.use(bodyParser.urlencoded({ extended: true }))

    //cache
    const cache = apicache.middleware


    //rate limiting
    const limiter = rateLimit({
        windowMs: 10 * 60 * 1000, //ten minutes
        max: 1000
    })
    app.use('/api', limiter)
    app.set('trust proxy',1)

    app.get("/", (req,res)=>{
        res.sendFile(__dirname + "/index.html")
        
    })

    // app.get("/main.js", (req,res)=>{
    //     res.sendFile(__dirname + "/main.js")
    // })
    // app.get("/404.html", (req,res)=>{
    //     res.sendFile("/404.html")
    // })
    app.get("/api",cache('2 minutes'), (req,res)=>{
        res.json({"characters":"/api/characters","quotes":"/api/quotes","deaths":"/api/deaths"})
        
    })
    
    app.get("/api/characters/:id",cache('2 minutes'),async (req,res)=>{
        // console.log(req.params.id)
        const id = req.params.id
        let chars = await db.collection('characters').find().toArray()

        if(chars.find(elem=>elem.char_id == id)){
            res.json(chars.find(elem=>elem.char_id == id))
        }else  if(chars.find(elem=>elem.name.toLowerCase().includes(id.toLowerCase()))){
            res.json(chars.find(elem=>elem.name.toLowerCase().includes(id.toLowerCase())))
        }else res.send("Incorrect syntax. take a look at the documentation. Try endpoint: /api/characters/1")

    
      
    })
    
    app.get("/api/characters",cache('2 minutes'), async (req,res)=>{
        let chars1 =  await db.collection('characters').find().toArray()
        res.json(chars1)
    })
    
    app.get("/api/quotes",cache('2 minutes'), async (req,res)=>{
        
        let seasons1 = await db.collection('quotes').find().toArray()
        // console.log(seasons1.filter(x=>x.name.toLowerCase().includes("str")))
        res.json(seasons1)
    })
    app.get("/api/quotes/:name",cache('2 minutes'),async (req,res)=>{
        let name = req.params.name
        let quotes = await db.collection('quotes').find().toArray()
        if(quotes.filter(x=>x.name.toLowerCase().includes(name.toLowerCase())).length>0){
            res.json(quotes.filter(x=>x.name.toLowerCase().includes(name.toLowerCase())))
        } else if(quotes.filter(elem=>elem.name.toLowerCase() == name.toLowerCase())){
                res.json(quotes.filter(elem=>elem.name.toLowerCase() == name.toLowerCase()))
    
            }else res.send("Incorrect syntax. take a look at the documentation. Try endpoint: /api/quotes/Bunk")
        // console.log(req.params.name,quotes.filter(elem=>elem.name.toLowerCase() == name.toLowerCase()))

        // if(quotes.filter(elem=>elem.name.toLowerCase() == name.toLowerCase())){
        //     res.json(quotes.filter(elem=>elem.name.toLowerCase() == name.toLowerCase()))

        // }else  if(quotes.filter(elem=>elem.name.toLowerCase().includes(name.toLowerCase().length>0))){
        //     res.json(quotes.filter(x=>x.name.toLowerCase().includes("str")))
        // }else res.send("Incorrect syntax. take a look at the documentation. Try endpoint: /api/characters/1")
    })
    
    app.get("/api/deaths", cache('2 minutes'),async (req,res)=>{
        let deaths = await db.collection('deaths').find().toArray()
        res.json(deaths)
    })

    //dev testing
    // app.get("/api", async (req,res)=>{
    //     let chars = await db.collection('characters').find().toArray()
    //  res.json(chars)
    // })
    app.listen(process.env.PORT || PORT,()=>{
        console.log(`The server is running on port ${PORT}`)
    })