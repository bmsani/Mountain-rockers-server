const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wts3j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const productCollection = client.db('mountain').collection('product');

        app.get('/product', async (req, res) => {
            const query = {}
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        })

        app.get('/product/:id', async (req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const product = await productCollection.findOne(query);
            res.send(product)

        })

        //update quantity
        app.put('/product/:id', async (req,res) => {
            const id = req.params.id;
            const newQuantity = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true};
            const updatedProduct = {
                $set:{
                    quantity:newQuantity.quantity
                }
            };
            const result = await productCollection.updateOne(filter, updatedProduct, options);
            res.send(result);
        })

        //post
        app.post('/product', async (req,res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })
    }
    finally{}
}
run().catch(console.dir)


app.get('/', (req,res) => {
    res.send("Project Mountain rokers is live")
});

app.listen(port, () => {
    console.log("Mountain Rokers we are hiking on port:", port);
});