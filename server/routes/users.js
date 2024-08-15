const express = require("express");
const userRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;
const multer = require("multer");

//กำหนดตัวแปรสำหรับการแบ่งหน้าเพจ
const PAGE_DEFAULT = 1;
const LIMIT_DEFAULT = 6;

//config หน่วยเก็บข้อมูลของ Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// get user ด้วยการแบ่งหน้าเพจ
userRoutes.route("/user").get(async (req, res) => {
  try {
    const db = dbo.getDb("usersDB");
    const page = parseInt(req.query.page) || PAGE_DEFAULT;
    const limit = LIMIT_DEFAULT;
    const skip = (page - 1) * limit;

    const users = await db.collection("users")
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();
      
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//get จำนวนของ user ทั้งหมด
userRoutes.route("/totalusers").get(async (req, res) => {
  try {
    const db = dbo.getDb("usersDB");
    const count = await db.collection("users").countDocuments();
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//get user คนเดียวด้วย id
userRoutes.route("/user/:id").get(async (req, res) => {
  try {
    const db = dbo.getDb();
    const myquery = { _id: ObjectId(req.params.id) };
    const user = await db.collection("users").findOne(myquery);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//post สร้าง user ใหม่
userRoutes.route("/user/add").post(upload.single("image"), async (req, res) => {
  try {
    const filename = req.file ? req.file.filename : "";
    const db = dbo.getDb();
    const myobj = {
      fname: req.body.fname,
      lname: req.body.lname,
      gender: req.body.gender,
      birthday: req.body.birthday,
      image: filename,
    };
    await db.collection("users").insertOne(myobj);
    res.json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

//post อัพเดดการเปลี่ยนแปลงของ user ด้วย id
userRoutes.route("/update/:id").post(upload.single("image"), async (req, res) => {
  try {
    const filename = req.file ? req.file.filename : null;
    const db = dbo.getDb();
    const myquery = { _id: ObjectId(req.params.id) };
    const newvalues = {
      $set: {
        fname: req.body.fname,
        lname: req.body.lname,
        gender: req.body.gender,
        birthday: req.body.birthday,
        image: filename || req.body.image,
      },
    };
    await db.collection("users").updateOne(myquery, newvalues);
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// delete user ด้วย id
userRoutes.route("/:id").delete(async (req, res) => {
  try {
    const db = dbo.getDb();
    const myquery = { _id: ObjectId(req.params.id) };
    await db.collection("users").deleteOne(myquery);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = userRoutes;
