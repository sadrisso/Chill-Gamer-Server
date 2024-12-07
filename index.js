const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 9000;
const app = express()


//middlewares
app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion } = require('mongodb');
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


    app.post("/reviews", async (req, res) => {
        const data = req.body;
        const result = await myCollection.insertOne(data)
        res.send(result)
    })

    app.get("/reviews", async (req, res) => {
        const query = await myCollection.find().toArray();
        res.send(query);
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