const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

// middlewares
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.e4rqtvb.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
    const itemCollection = client.db("itemDB").collection("items");
    const brandCollection = client.db("itemDB").collection("brands");
    const peopleCollection = client.db("itemDB").collection("peoples");


    app.get('/items', async (req, res) => {
      const result = await itemCollection.find().toArray();
      res.send(result)
    })

    app.post('/items', async (req, res) => {
      const item = req.body;
      console.log(item);
      const result = await itemCollection.insertOne(item);
      res.send(result);
    })

    app.get('/brands', async (req, res) => {
      const result = await brandCollection.find().toArray();
      res.send(result);
    })

    app.get('/users', async (req , res) => {
      const result = await peopleCollection.find().toArray();
      res.send(result); 
    })

    app.post('/users', async(req, res) => {
      const item = req.body;
      console.log(item);
      const result = await peopleCollection.insertOne(item)
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



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})