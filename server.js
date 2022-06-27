//express + MONGO SET UP
const express = require("express")
const app = express()
const PORT = 7000
const rateLimit = require('express-rate-limit')
const bodyParser= require('body-parser')
const apicache = require('apicache')
const MongoClient = require("mongodb").MongoClient
const cors = require("cors")
require('dotenv').config()



let db
let dbName = process.env.DBNAME
const connectionString = process.env.MONGO_URI

MongoClient.connect(connectionString,{ useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

    app.set('view engine', 'ejs')
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

    app.get('/',(req, res)=>{

        db.collection('characters').find().toArray()
        .then(data => {
            res.render('index.ejs', { characters: data })
        })
        .catch(error => console.error(error))
    })
    
    app.get("documentation.html", async (req,res)=>{
        res.send("documentation.html")
    })

    // app.get("/", async (req,res)=>{
    //     res.sendFile(__dirname + "/index.html")



    //     let visitorCount =  await db.collection('count').find().toArray()
    //      db.collection("count").updateOne({'count': visitorCount[0].count},{$set: {"count":visitorCount[0].count+1}},function(err, res) {
    //         if (err) throw err;
    //         console.log("1 document updated")
    //     })

    // })

    app.get("/api", async (req,res)=>{
        res.json({"characters":"/api/characters","quotes":"/api/quotes","deaths":"/api/deaths"})   
        let visitorCount = await db.collection('count').find().toArray()

        await db.collection("count").updateOne({'count': visitorCount[0].count},{$set: {"count":visitorCount[0].count+1}},function(err, res) {
            if (err) throw err;
            console.log("1 document updated")
        })

    })

    app.get("/api/characters/random",async (req,res)=>{
        let chars = await db.collection('characters').find().toArray()

        res.json(chars[Math.floor(Math.random()*chars.length)])

        let visitorCount = await db.collection('count').find().toArray()

        await db.collection("count").updateOne({'count': visitorCount[0].count},{$set: {"count":visitorCount[0].count+1}},function(err, res) {
            if (err) throw err;
            console.log("1 document updated")
        })

    })    
    app.get("/api/characters/:id",cache('2 minutes'),async (req,res)=>{
        const id = req.params.id.toLowerCase()
        let chars = await db.collection('characters').find().toArray()

        if(chars.find(elem=>elem.char_id == id)){
            res.json(chars.find(elem=>elem.char_id == id))
        }else  if(chars.find(elem=>elem.name.toLowerCase().includes(id))){
            res.json(chars.find(elem=>elem.name.toLowerCase().includes(id)))
        }else res.send("Incorrect syntax. take a look at the documentation. Try endpoint: /api/characters/1 or /api/characters/stringer")


        let visitorCount = await db.collection('count').find().toArray()

        await db.collection("count").updateOne({'count': visitorCount[0].count},{$set: {"count":visitorCount[0].count+1}},function(err, res) {
            if (err) throw err;
            console.log("1 document updated")
        })

    
      
    })
    
    app.get("/api/characters",cache('2 minutes'), async (req,res)=>{
        let filters = req.query
        let chars1 =  await db.collection('characters').find().toArray()

        let isValid=true
        if(!filters){
            res.json(chars1)
        }else {
            const filteredUsers = chars1.filter(user => {
                for (key in filters) {
                //   console.log(key, user[key], filters[key]);
                  isValid =  user[key].toLowerCase().includes(filters[key].toLowerCase())
                //   isValid =  user[key].toLowerCase().split(" ").includes(filters[key].toLowerCase().split(" ")[0])

                }
                return isValid;
              });
            //   console.log(filters[key].toLowerCase().split(" "))
            
            res.json(filteredUsers)

        }
        
        


        let visitorCount = await db.collection('count').find().toArray()

        await db.collection("count").updateOne({'count': visitorCount[0].count},{$set: {"count":visitorCount[0].count+1}},function(err, res) {
            if (err) throw err;
            console.log("1 document updated")
        })
    })
    
 
    //Quotes
    app.get("/api/quotes/random", async (req,res)=>{
        let quotes = await db.collection('quotes').find().toArray()
        res.json(quotes[Math.floor(Math.random()*quotes.length)])
    })
    app.get("/api/quotes/:name",cache('2 minutes'),async (req,res)=>{
        let name = req.params.name.toLocaleLowerCase()
        let quotes = await db.collection('quotes').find().toArray()
        if(quotes.filter(x=>x.name.toLowerCase().includes(name)).length>0){
            res.json(quotes.filter(x=>x.name.toLowerCase().includes(name)))
        } else if(quotes.filter(elem=>elem.name.toLowerCase() == name).length>0){
                res.json(quotes.filter(elem=>elem.name.toLowerCase() == name))
            }else res.send("Incorrect syntax. take a look at the documentation. Try endpoint: /api/quotes/Bunk")



            let visitorCount = await db.collection('count').find().toArray()

            await db.collection("count").updateOne({'count': visitorCount[0].count},{$set: {"count":visitorCount[0].count+1}},function(err, res) {
                if (err) throw err;
                console.log("1 document updated")
            })
    })

    app.get("/api/quotes",cache('2 minutes'), async (req,res)=>{
        let quotes = await db.collection('quotes').find().toArray()
        res.json(quotes)

        let visitorCount = await db.collection('count').find().toArray()

        await db.collection("count").updateOne({'count': visitorCount[0].count},{$set: {"count":visitorCount[0].count+1}},function(err, res) {
            if (err) throw err;
            console.log("1 document updated")
        })
    })
    

    //deaths
    app.get("/api/deaths", cache('2 minutes'),async (req,res)=>{
        let deaths = await db.collection('deaths').find().toArray()

        let filters = req.query

        let isValid
        const filteredDeaths = deaths.filter(user => {
            for (key in filters) {
            //   console.log(key, user[key], filters[key]);
              isValid = user[key].toLowerCase().includes(filters[key].toLowerCase())
            }
            return isValid;
          });
          console.log(filteredDeaths)
        //   console.log(filters[key].toLowerCase().split(" "))
        
        filteredDeaths.length >0? res.json(filteredDeaths) : res.json(deaths)



        // res.json(deaths)


        let visitorCount = await db.collection('count').find().toArray()

        await db.collection("count").updateOne({'count': visitorCount[0].count},{$set: {"count":visitorCount[0].count+1}},function(err, res) {
            if (err) throw err;
            console.log("1 document updated")
        })
    })

    app.get("/api/deaths/random", async (req,res)=>{
        let deaths = await db.collection('deaths').find().toArray()
        res.json(deaths[Math.floor(Math.random()*deaths.length)])
    })


    app.get("/api/deaths/:whodidit", cache('2 minutes'),async (req,res)=>{
        let deaths = await db.collection('deaths').find().toArray()
        let whodidit = req.params.whodidit.toLocaleLowerCase()
        if(deaths.filter(x=>x.responsible.toLowerCase().includes(whodidit)).length>0){
            console.log(whodidit)
            res.json(deaths.filter(x=>x.responsible.toLowerCase().includes(whodidit)))
        } else if(deaths.filter(elem=>elem.responsible.toLowerCase() == whodidit).length>0){
                res.json(quotes.filter(elem=>elem.responsible.toLowerCase() == whodidit))
            }else res.send("Incorrect syntax. take a look at the documentation. Try endpoint: /api/quotes/Bunk")


            let visitorCount = await db.collection('count').find().toArray()

            await db.collection("count").updateOne({'count': visitorCount[0].count},{$set: {"count":visitorCount[0].count+1}},function(err, res) {
                if (err) throw err;
                console.log("1 document updated")
            })
    })
    
    //character by category
    app.get("/api/category/:category", cache('2 minutes'),async (req,res)=>{
        let category =req.params.category.toLowerCase()
        let chars = await db.collection('characters').find().toArray()
        switch(category){
            case "street":
                res.json(chars.filter(elem=>elem.category =="The Street"))
                break
            case "port":
                res.json(chars.filter(elem=>elem.category =="The Port"))
                break
            case "city+hall":
                res.json(chars.filter(elem=>elem.category =="City Hall"))
                break
            case "next":
                res.json(chars.filter(elem=>elem.category =="The Next Generation"))
                break
            case "school":
                res.json(chars.filter(elem=>elem.category =="The School"))
                break
            case "news":
                res.json(chars.filter(elem=>elem.category =="The Newspaper"))
                break

            default:
            res.status(404).json({"characters":"/api/characters","quotes":"/api/quotes","deaths":"/api/deaths"})


        }


        let visitorCount = await db.collection('count').find().toArray()

        await db.collection("count").updateOne({'count': visitorCount[0].count},{$set: {"count":visitorCount[0].count+1}},function(err, res) {
            if (err) throw err;
            console.log("1 document updated")
        })
        // if(category =="the street"){
        //     res.json(chars.filter(elem=>elem.category =="The Street"))
        // }else if(category =="the port"){
        //     res.json(chars.filter(elem=>elem.category =="The Port"))
        // }
        // if(category =="city hall"){
        //     res.json(chars.filter(elem=>elem.category =="City Hall"))
        // }
    })

    app.get('*', function(req, res){
        res.status(404).json({"characters":"/api/characters","quotes":"/api/quotes","deaths":"/api/deaths"});
      });

    app.listen(process.env.PORT || PORT,()=>{
        console.log(`The server is running on port ${PORT}`)
    })