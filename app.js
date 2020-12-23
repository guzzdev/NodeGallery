const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const multer = require("multer");
const fs = require('fs');
const path = require('path');

const imageModel = require("./models/upload");
const imageData = imageModel.find({});

const app = express();

app.set("view engine", "ejs");
app.use(expressLayouts);

app.use(express.static("public/images"));

var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/images");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" +  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + path.extname(file.originalname));
  },
});

var upload = multer({
  storage: Storage,
}).single("image"); //Field name and max count

app.get("/", (req, res) => {
  imageData.exec(function (err, data) {
    if (err) throw err;
    console.log(req.ip);
    res.render("home", { records: data });
  });
});

app.post("/", (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.end("Something went wrong");
    } else {
      console.log(req.file.path);
      var imageName = req.file.filename;

      var imageDetails = new imageModel({
        imagename: imageName,
      });

      imageDetails.save(function (err, doc) {
        if (err) throw err;

        console.log("Image Saved");

        imageData.exec(function (err, data) {
          if (err) throw err;

          res.render("home", { records: data, success: 1 });
        });
      });
    }
  });
});

//TODO: verify if file exist before deleting 
app.post('/delete/:path', (req,res) => {
  try {
    imageModel.deleteOne({ imagename: req.params['path'] }, function (err) {
      if(err) console.log(err);
      fs.unlinkSync("./public/images/"+req.params['path'])
      console.log("Successful deletion");
      imageData.exec(function (err, data) {
        if (err) throw err;

        res.render("home", { records: data, success: 2 });
      });
    });
  } catch(err) {
    console.error(err)
  }
})

app.listen(3000, () => {
  var today = new Date()
  console.log("App is listening on Port 3000 | "+ today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() );
});
