const express = require("express")
const app = express()
const PORT = 7000
const bodyParser= require('body-parser')
const MongoClient = require("mongodb").MongoClient
const cors = require("cors")
require('dotenv').config()

const connectionString = process.env.DBCONNECT

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))



app.listen(process.env.PORT || PORT,()=>{
    console.log(`The server is running on port ${PORT}`)
})


MongoClient.connect(connectionString)
.then(client=>{
    console.log('connected to Db')
    const db = client.db('the-wire-api')
    // const characters = db.collection('characters')

    app.get("/", (req,res)=>{
        res.sendFile(__dirname + "/index.html")
    })
    app.get("/add.html", (req,res)=>{
        res.sendFile(__dirname + "/add.html")
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
        let chars =  await db.collection('characters').find().toArray()
        res.json(chars)
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
})