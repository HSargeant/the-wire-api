const NodeCache = require("node-cache");

const myCache = new NodeCache();

module.exports = {
    getHome: (req, res, db) => {
        function shuffle(array) {
            let currentIndex = array.length
            while (currentIndex != 0) {
                let randomIndex = Math.floor(Math.random() * currentIndex)
                currentIndex--
                [array[currentIndex], array[randomIndex]] = [
                    array[randomIndex], array[currentIndex]]
            }
            return array
        }

        if (myCache.get("allChars")) {
            const chars = myCache.get("allChars")
            res.render('index.ejs', { characters: shuffle(chars) })
            return
        }

        db.collection('characters').find().toArray()
            .then(data => {
                myCache.set("allChars", data)
                data = shuffle(data)
                res.render('index.ejs', { characters: data })
            })
            .catch(error => console.error(error))
    },
    getIndex: async (req, res, db) => {
        res.json({ "characters": "/api/characters", "quotes": "/api/quotes", "deaths": "/api/deaths" })
        let visitorCount = await db.collection('count').find().toArray()

        await db.collection("count").updateOne({ 'count': visitorCount[0].count }, { $set: { "count": visitorCount[0].count + 1 } }, function (err, res) {
            if (err) throw err;
        })
    },
    getRandomCharacter: async (req, res, db) => {
        if (myCache.get("allChars")) {
            const chars = myCache.get("allChars")
            res.json(chars[Math.floor(Math.random() * chars.length)])
            return
        }

        try {
            let char = await db.collection('characters').aggregate([{ $sample: { size: 1 } }]).toArray()

            res.json(char[0])

            let visitorCount = await db.collection('count').find().toArray()

            await db.collection("count").updateOne({ 'count': visitorCount[0].count }, { $set: { "count": visitorCount[0].count + 1 } }, function (err, res) {
                if (err) throw err;

            })
        } catch (err) {
            console.log(err)
        }
    },
    getCharacterById: async (req, res, db) => {

        if (myCache.get("allChars")) {
            const chars = myCache.get("allChars")
            const char = chars.find(elem => elem.char_id == req.params.id.toLowerCase())
            if (char) {
                res.json(char)
            } else {
                res.send("Incorrect syntax. take a look at the documentation. Try endpoint: /api/characters/1 or /api/characters/stringer")
            }
            return
        }
        try {
            const id = req.params.id.toLowerCase()
            let char = await db.collection('characters').findOne({ "char_id": id })

            if (char) {
                res.json(char)
            } else {
                res.send("Incorrect syntax. take a look at the documentation. Try endpoint: /api/characters/1 or /api/characters/stringer")
            }

            let visitorCount = await db.collection('count').find().toArray()

            await db.collection("count").updateOne({ 'count': visitorCount[0].count }, { $set: { "count": visitorCount[0].count + 1 } }, function (err, res) {
                if (err) throw err;

            })
        } catch (error) {
            console.error(error)
            res.json({ error })
        }
    },
    getAllCharacters: async (req, res, db) => {
        try {
            let chars1
            if (myCache.get("allChars")) {
                chars1 = myCache.get("allChars")
            } else {
                chars1 = await db.collection('characters').find().toArray()
            }
            let filters = req.query

            let isValid = true
            if (!filters) {
                res.json(chars1)
            } else {
                const filteredUsers = chars1.filter(user => {
                    for (key in filters) {
                        isValid = user[key].toLowerCase().includes(filters[key].toLowerCase())

                    }
                    return isValid;
                });
                res.json(filteredUsers)
            }

            let visitorCount = await db.collection('count').find().toArray()

            await db.collection("count").updateOne({ 'count': visitorCount[0].count }, { $set: { "count": visitorCount[0].count + 1 } }, function (err, res) {
                if (err) throw err;

            })
        } catch (error) {
            console.error(error)
            res.json({ error })
        }
    },
    getRandomQuote: async (req, res, db) => {
        if (myCache.get("quotes")) {
            const quotes = myCache.get("quotes")
            res.json(quotes[Math.floor(Math.random() * quotes.length)])
            return
        }
        try {
            let quote = await db.collection('quotes').aggregate([{ $sample: { size: 1 } }]).toArray()
            res.json(quote[0])
        } catch (error) {
            console.error(error)
            res.json({ error })
        }
    },
    getAllQuotes: async (req, res, db) => {
        if (myCache.get("quotes")) {
            const quotes = myCache.get("quotes")
            res.json(quotes)
            return
        }
        try {
            const quotes = await db.collection('quotes').find().toArray()
            res.json(quotes)
            myCache.set("quotes", quotes)

            let visitorCount = await db.collection('count').find().toArray()

            await db.collection("count").updateOne({ 'count': visitorCount[0].count }, { $set: { "count": visitorCount[0].count + 1 } }, function (err, res) {
                if (err) throw err;

            })
        } catch (error) {
            console.error(error)
            res.json({ error })
        }
    },
    getQuoteByName: async (req, res, db) => {
        try {
            let name = req.params.name.toLocaleLowerCase()
            let quotes
            if (myCache.get("quotes")) {
                quotes = myCache.get("quotes")
            } else {
                quotes = await db.collection('quotes').find().toArray()
                myCache.set("quotes", quotes)
            }
            if (quotes.filter(x => x.name.toLowerCase().includes(name)).length > 0) {
                res.json(quotes.filter(x => x.name.toLowerCase().includes(name)))
            } else if (quotes.filter(elem => elem.name.toLowerCase() == name).length > 0) {
                res.json(quotes.filter(elem => elem.name.toLowerCase() == name))
            } else res.send("Incorrect syntax. take a look at the documentation. Try endpoint: /api/quotes/Bunk")

            let visitorCount = await db.collection('count').find().toArray()

            await db.collection("count").updateOne({ 'count': visitorCount[0].count }, { $set: { "count": visitorCount[0].count + 1 } }, function (err, res) {
                if (err) throw err;

            })
        } catch (error) {
            console.error(error)
            res.json({ error })
        }
    },
    getRandomDeath: async (req, res, db) => {
        if (myCache.get("deaths")) {
            const deaths = myCache.get("deaths")
            let randomIndex = Math.floor(Math.random() * deaths.length)
            res.json(deaths[randomIndex])
            return
        }
        try {
            let death = await db.collection('deaths').aggregate([{ $sample: { size: 1 } }]).toArray()
            res.json(death[0])
        } catch (error) {
            console.error(error)
            res.json({ error })
        }
    },
    getAllDeaths: async (req, res, db) => {
        try {
            let deaths
            if (myCache.get("deaths")) {
                deaths = myCache.get("deaths")
            } else {
                deaths = await db.collection('deaths').find().toArray()
                myCache.set("deaths", deaths)
            }

            let filters = req.query

            let isValid
            const filteredDeaths = deaths.filter(elem => {
                for (key in filters) {
                    isValid = elem[key]?.toLowerCase().includes(filters[key]?.toLowerCase())
                }
                return isValid;
            });

            filteredDeaths.length > 0 ? res.json(filteredDeaths) : res.json(deaths)

            let visitorCount = await db.collection('count').find().toArray()

            await db.collection("count").updateOne({ 'count': visitorCount[0].count }, { $set: { "count": visitorCount[0].count + 1 } }, function (err, res) {
                if (err) throw err;

            })
        } catch (error) {
            console.error(error)
            res.json({ error })
        }
    },
    getDeathsCausedByCharacter: async (req, res, db) => {
        try {
            let deaths
            if (myCache.get("deaths")) {
                deaths = myCache.get("deaths")
            } else {
                deaths = await db.collection('deaths').find().toArray()
                myCache.set("deaths", deaths)
            }

            let whodidit = req.params.whodidit.toLocaleLowerCase()
            if (deaths.filter(x => x.responsible.toLowerCase().includes(whodidit)).length > 0) {
                res.json(deaths.filter(x => x.responsible.toLowerCase().includes(whodidit)))
            } else if (deaths.filter(elem => elem.responsible.toLowerCase() == whodidit).length > 0) {
                res.json(quotes.filter(elem => elem.responsible.toLowerCase() == whodidit))
            } else res.send("Incorrect syntax. take a look at the documentation. Try endpoint: /api/quotes/Bunk")

            let visitorCount = await db.collection('count').find().toArray()

            await db.collection("count").updateOne({ 'count': visitorCount[0].count }, { $set: { "count": visitorCount[0].count + 1 } }, function (err, res) {
                if (err) throw err;
            })
        } catch (error) {
            console.error(error)
            res.json({ error })
        }
    },
    getCharacterByCat: async (req, res, db) => {
        try {
            let category = req.params.category.toLowerCase()
            let chars
            if (myCache.get("allChars")) {
                chars = myCache.get("allChars")
            } else {
                chars = await db.collection('characters').find().toArray()
                myCache.set("allChars", chars)
            }
            switch (category) {
                case "street":
                    res.json(chars.filter(elem => elem.category == "The Street"))
                    break
                case "port":
                    res.json(chars.filter(elem => elem.category == "The Port"))
                    break
                case "city+hall":
                    res.json(chars.filter(elem => elem.category == "City Hall"))
                    break
                case "next":
                    res.json(chars.filter(elem => elem.category == "Next Generation"))
                    break
                case "school":
                    res.json(chars.filter(elem => elem.category == "The School"))
                    break
                case "news":
                    res.json(chars.filter(elem => elem.category == "The Paper"))
                    break

                default:
                    res.status(404).json({ "characters": "/api/characters", "quotes": "/api/quotes", "deaths": "/api/deaths" })
            }


            let visitorCount = await db.collection('count').find().toArray()

            await db.collection("count").updateOne({ 'count': visitorCount[0].count }, { $set: { "count": visitorCount[0].count + 1 } }, function (err, res) {
                if (err) throw err;

            })
        } catch (error) {
            console.error(error)
            res.json({ error })
        }
    },
}