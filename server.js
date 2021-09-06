const express = require('express');
const multer = require('multer')
const cors = require("cors");

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("Incorrect file");
    error.code = "INCORRECT_FILETYPE";
    return cb(error, false)
  }
  cb(null, true);
}

const upload = multer({
  dest: './uploads',
  fileFilter,
  limits: {
    fileSize: 5000000
  }
});

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
app.use('/uploads', express.static(__dirname + '/uploads'));

app.get('/properties', (req, res) => {
  const queries = JSON.parse(req.query.queries);
  findProperties(queries, res).catch(console.dir);
});

app.post('/property', (req, res) => {
  const data = req.body.data;
  saveProperty(data, res).catch(console.dir);
});

app.post('/uploads', upload.single('file'), (req, res) => {
  try {
    res.send(req.file);
  } catch (err) {
    res.send(400);
  }
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

    Properties(queries, res);

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

    Properties(queries, res);

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
};

const deleteProperty = async (query, res) => {
  try {
    await client.connect();
    const result = await properties.deleteOne(query);
    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.");
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
    }

    Properties(queries, res);

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
};

const Properties = async (queries, res) => {
  try {

    const data = {
      properties: await properties.find(queries, {
        projection: {
          _id: 0
        }
      }
      ).toArray()
    };

    res.send(data);
  } catch (err) {
    console.error(err);
  }
}


