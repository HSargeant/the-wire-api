const express = require("express")
const app = express()
const PORT = 7000
const bodyParser= require('body-parser')
const MongoClient = require("mongodb").MongoClient
const cors = require("cors")
require('dotenv').config()

// const connectionString = process.env.DBCONNECT

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))



app.listen(process.env.PORT || PORT,()=>{
    console.log(`The server is running on port ${PORT}`)
})



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
        if(characters[id]){
            res.json(characters[id])
        }else  res.sendFile(__dirname + "/404.html")
    
      
    })
    
    app.get("/api/characters", async (req,res)=>{
        res.json(characters)
    })
    
    app.get("/api/seasons", async (req,res)=>{

        res.json(seasons)
    })
    
    app.get("/api/deaths", async (req,res)=>{
        res.json(deaths)
    })
    app.get("/api", async (req,res)=>{

     res.json(characters)

       
    })

//data

const characters = [
    {
        "char_id": "0",
        "name": "Jimmy Mcnulty",
        "nickname": ["Bushy Top"],
        "occupation": ["Homicide Detective"],
        "seasons": [1, 2, 3, 4, 5],
        "DOB": "1971",
        "first-seen": "The Target",
        "last-seen": "-30-",
        "status": "Alive",
        "actor": "Dominic West",
        "image": "https://static.wikia.nocookie.net/thewire/images/9/92/McNulty.jpg",
        "category": "The Law"

    },
    {
        "char_id": "1",
        "name": "Avon Barksdale",
        "nickname": [],
        "occupation": ["Head of the Barksdale Organization"],
        "seasons": [1, 2, 3, 5],
        "DOB": "August 15, 1970",
        "status": "Alive",
        "actor": "Wood Harris",
        "image": "https://static.wikia.nocookie.net/thewire/images/a/aa/Avon.jpg",
        "category": "The Street"

    },

    {
        "char_id": "2",
        "name": "Omar Little",
        "nickname": [],
        "occupation": ["Stickup Man"],
        "first-seen": "The Buys",
        "last-seen": "Clarifications",
        "seasons": [1, 2, 3, 4, 5],
        "DOB": "1974",
        "status": "Dead",
        "actor": "Michael K. Williams",
        "image": "https://static.wikia.nocookie.net/thewire/images/4/46/Omar.jpg",
        "category": "The Street"

    },
    {
        "char_id": "3",
        "name": "William Moreland",
        "nickname": ["Bunk"],
        "occupation": ["Homicide Detective"],
        "first-seen": "The Target",
        "last-seen": "-30-",
        "seasons": [1, 2, 3, 4, 5],
        "DOB": "unknown",
        "status": "Alive",
        "actor": "Wendell Pierce",
        "image": "https://static.wikia.nocookie.net/thewire/images/1/19/Bunk.jpg",
        "category": "The Law"

    },
    {
        "char_id": "4",
        "name": "Shakima Greggs",
        "nickname": ["Kima"],
        "occupation": ["Homicide Detective"],
        "first-seen": "The Target",
        "last-seen": "-30-",
        "seasons": [1, 2, 3, 4, 5],
        "status": "Alive",
        "actor": "Sonja Sohn",
        "image": "https://static.wikia.nocookie.net/thewire/images/b/b9/The_Wire_Greggs.jpg",
        "category": "The Law"

    }

]

const seasons = []

const deaths = [
    {
        "name": "Omar Little",
        "cause": "Shot in the head",
        "responsible": "Kenard",
        "episode": "",
        "season": ""
    }
]