const express = require("express");
const userRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;
const multer = require("multer");

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads"); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // File name on server
  },
});

const upload = multer({ storage: storage });

userRoutes.route("/user").get(function (req, res) {
  let db_connect = dbo.getDb("usersDB");
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = 3; // Default to 3 items per page

  // Calculate skip value based on page and limit
  const skip = (page - 1) * limit;

  db_connect
    .collection("users")
    .find({})
    .skip(skip)
    .limit(limit)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

userRoutes.route("/totalusers").get(function (req, res) {
  let db_connect = dbo.getDb("usersDB");
  db_connect
    .collection("users")
    .countDocuments()
    .then(function (count) {
      res.json({ count });
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

// This section will help you get a single user by id
userRoutes.route("/user/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect
    .collection("users")
    .findOne(myquery, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you create a new user.
userRoutes.route("/user/add").post(upload.single("image"), function (req, response) {
  try {
    let filename = "";
    if (req.file) {
      filename = req.file.filename;
      console.log('image', filename);
    }
    let db_connect = dbo.getDb();
    let myobj = {
      fname: req.body.fname,
      lname: req.body.lname,
      gender: req.body.gender,
      birthday: req.body.birthday,
      image: filename,
    };
    db_connect.collection("users").insertOne(myobj, function (err, res) {
      if (err) {
        throw err;
      }
      console.log("1 document created");
      response.json(res);
    });
  } catch (error) {
    console.error('Error:', error);
    response.status(500).json({ error: error.message });
  }
});

// This section will help you update a user by id.
userRoutes.route("/update/:id").post(upload.single("image"), function (req, response) {
  try {
    let filename = req.body.image || null; // Set filename to null if no image provided

    if (req.file) {
      filename = req.file.filename;
    }

    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    let newvalues = {
      $set: {
        fname: req.body.fname,
        lname: req.body.lname,
        gender: req.body.gender,
        birthday: req.body.birthday,
      },
    };

    // Only add the image field to newvalues if filename is not null
    if (filename !== null) {
      newvalues.$set.image = filename;
    }

    db_connect.collection("users").updateOne(myquery, newvalues, function (err, res) {
      if (err) {
        throw err;
      }
      console.log("1 document updated");
      response.json({ message: "User updated successfully" });
    });
  } catch (error) {
    console.error('Error:', error);
    response.status(500).json({ error: error.message });
  }
});

// This section will help you delete a user
userRoutes.route("/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };

  db_connect.collection("users").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

module.exports = userRoutes;