const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 9000;
const app = express()


//middlewares
app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.oq68b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const myCollection = client.db("gameServer").collection("games")
    const watchCollection = client.db("gameServer").collection("watchCollection")


    app.post("/reviews", async (req, res) => {
        const data = req.body;
        const result = await myCollection.insertOne(data)
        res.send(result)
    })

    app.post("/watch-list", async (req, res) => {
        const data = req.body;
        const result = await watchCollection.insertOne(data)
        res.send(result)
    })


    app.get("/reviews", async (req, res) => {
        const query = await myCollection.find().toArray();
        res.send(query);
    })


    app.get("/review/:id", async (req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const result = await myCollection.findOne(filter)
        res.send(result)
    })

    app.get("/watch-list/:email", async (req, res) => {
        const email = req.params.email;
        const filter = {email: email};
        const result = await watchCollection.findOne(filter)
        res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get("/", (req, res) => {
    console.log("Gamer Server is Running...")
})

app.listen(port, () => {
    console.log(`Game is running on port: ${port}`)
})