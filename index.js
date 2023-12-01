const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})
 

const uri = `mongodb+srv://${process.env.D8_USERS}:${process.env.D8_PASSWORD}@cluster0.s0tuw8w.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    const emaJohnCollection = client.db('emaJohnSimple').collection('products')

    app.get('/products', async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      console.log(page,size)
      const query = {}
      const cursor = emaJohnCollection.find(query)
      const products = await cursor.skip(page*size).limit(size).toArray()
      const count =await emaJohnCollection.estimatedDocumentCount()
      res.send({count,products})
    })
    app.post('/productByIds', async (req, res) => {
      const ids = req.body
      const objectId =ids.map(id=>new ObjectId(id))
      const query = {_id:{$in:objectId}}
      const cursor = emaJohnCollection.find(query)
      const products = await cursor.toArray()
      res.send(products)
    })
  }
  finally {
   
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})