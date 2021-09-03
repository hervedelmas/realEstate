const express = require('express');
const axios = require("axios");
const cors = require("cors");

const app = express();

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 8000;

const {
  MongoClient
} = require("mongodb");
const { addListener } = require('nodemon');

const uri =
  "mongodb://localhost:27017?writeConcern=majority";

const client = new MongoClient(uri);

const database = client.db("realEstate");
const properties = database.collection("properties");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({
  extended: true
}));

app.get('/properties', (req, res) => {
  const queries = JSON.parse(req.query.queries);
  findProperties(queries, res).catch(console.dir);
});

app.post('/property', (req, res) => {
  const data = req.body.data;
  saveProperty(data, res).catch(console.dir);
});

app.get('/deleteProperty', (req, res) => {
  const queries = JSON.parse(req.query.queries);
  deleteProperty(queries, res).catch(console.dir);
});

app.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}, Ctrl+C to stop`)
});

const findProperties = async (queries, res) => {
  try {
    await client.connect();
    var queries = JSON.parse(queries);

    Object.keys(queries).forEach(function (key) {
      if (queries[key] == "") {
        delete queries[key];
      }
    })
    if (queries.price) {
      queries.price = Number(queries.price);
    }

    const data = {
      properties: await properties.find(queries, {
        projection: {
          _id: 0
        }
      }
      ).toArray()
    };

    res.send(data);

  } finally {
    await client.close();
  }
};

const saveProperty = async (property, res) => {
  try {
    await client.connect();

    const result = await properties.updateOne(property.query, { $set: property.update },
      { upsert: true }
    );
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    );

    let data = {
      properties: await properties.find({}, {
        projection: {
          _id: 0
        }
      }
      ).toArray()
    };

    res.send(data);

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
};

const deleteProperty = async (query, res) => {
  try {
    await client.connect();
    console.log(query);
    const result = await properties.deleteOne(query);
    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.");
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
    }

    let data = {
      properties: await properties.find({}, {
        projection: {
          _id: 0
        }
      }
      ).toArray()
    };

    res.send(data);

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
};


