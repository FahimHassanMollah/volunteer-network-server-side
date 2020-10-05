const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser());



const port = 8080;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jrzhf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
let ObjectId = require('mongodb').ObjectID;


app.get('/', (req, res) => {
  res.send('Hello World!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const catrgoryCollection = client.db("volunteer").collection("catrgory");
  const volunteerEventsCollection = client.db("volunteer").collection("volunteerEvents");
  app.post('/addVolunteerCategories', (req, res) => {
    console.log('connection done');
    catrgoryCollection.insertMany(req.body)
      .then((err, result) => {
        res.send('successfully inserted data into dataBase.......')
      })
  })
  app.get('/getVolunteerCategories', (req, res) => {
    catrgoryCollection.find({})
      .toArray((err, result) => {
        // console.log(result);
        res.send(result)
      })

  })
  app.post('/volunteerEventsInformation', (req, res) => {
    volunteerEventsCollection.insertOne(req.body)
      .then((result) => {
        if (result.insertedCount > 0) {
          res.send(result);
        }


      })
  })
  app.get('/volunterEventsInformationByEmail/:email', (req, res) => {
    console.log(req.params.email);
    volunteerEventsCollection.find({ email: req.params.email })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })
  app.delete('/deleteEvent/:id', (req, res) => {
    volunteerEventsCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        if (result.deletedCount > 0) {
          res.send(result);
        }


      })
  })
  app.get('/allVoluntersInformations',(resq,res)=>{
    volunteerEventsCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })
  app.post('/singleAddVolunteerCategory', (req, res) => {
    console.log('connection done');
    catrgoryCollection.insertOne(req.body)
      .then((result) => {
        if (result.insertedCount > 0) {
          res.send(result);
        }
      })
  })


});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})