const express = require("express")
const app = express()
const PORT = 7000
const bodyParser= require('body-parser')
const MongoClient = require("mongodb").MongoClient
const cors = require("cors")
require('dotenv').config()

////

let db 
let dbName = 'the-wire-api'
const connectionString = process.env.DBCONNECT
    
MongoClient.connect(connectionString,{ useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

    app.get("/", (req,res)=>{
        res.sendFile(__dirname + "/index.html")
    })

    app.get("/main.js", (req,res)=>{
        res.sendFile(__dirname + "/main.js")
    })
    app.get("/404.html", (req,res)=>{
        res.sendFile(__dirname + "/404.html")
    })
    
    app.get("/api/characters/:id",async (req,res)=>{
        console.log(req.params.id)
        const id = req.params.id
        let chars = await db.collection('characters').find().toArray()
        if(chars[id]){
            res.json(chars[id])
        }else  res.sendFile(__dirname + "/404.html")
    
      
    })
    
    app.get("/api/characters", async (req,res)=>{
        let chars1 =  await db.collection('characters').find().toArray()
        res.json(chars1)
    })
    
    app.get("/api/seasons", async (req,res)=>{
        let seasons1 = await db.collection('seasons').find().toArray()
        res.json(seasons1)
    })
    
    app.get("/api/deaths", async (req,res)=>{
        let deaths = await db.collection('deaths').find().toArray()
        res.json(deaths)
    })
    app.get("/api", async (req,res)=>{
        let chars = await db.collection('characters').find().toArray()
     res.json(chars)

       
    })

    app.listen(process.env.PORT || PORT,()=>{
        console.log(`The server is running on port ${PORT}`)
    })
    