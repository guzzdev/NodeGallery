const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const imageModel = require("./models/upload");
const imageData = imageModel.find({}).sort([['_id', -1]]);

const app = express();

app.set("view engine", "ejs");
app.use(expressLayouts);

app.use(express.static("public/images"));

var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/images");
  },
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname +
        "_" +
        Date.now() +
        "_" +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        path.extname(file.originalname)
    );
  },
});

var upload = multer({
  storage: Storage,
}).single("image"); //Field name and max count

app.get("/", (req, res) => {
  imageData.exec((err, data) => {
    if (err) throw err;
    res.render("home", { records: data });
    var today = new Date();
    console.log(
      "\x1b[36m%s\x1b[0m",
      `${today.getDate()}/${today.getMonth()}/${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} : CONNECTED | ip : ' ${
        req.ip
      } `
    );
  });
});

app.post("/", (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.end("Something went wrong");
    } else {
      var imageName = req.file.filename;
      var imageDetails = new imageModel({
        imagename: imageName,
      });
      imageDetails.save(function (err, doc) {
        if (err) throw err;
        var today = new Date();
        console.log(
          "\x1b[32m%s\x1b[0m",
          `${today.getDate()}/${today.getMonth()}/${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} : UPLOAD | ip : ' ${
            req.ip
          }\n   FILE : ${imageName}`
        );

        res.redirect("/");
      });
    }
  });
});

app.post("/delete/:path", (req, res) => {
  try {
    let imagename = req.params["path"];
    const path = './public/images/';
    imageModel.find({ imagename: imagename }, (err, docs) => {
      if(err) console.error(err);
      if (
        docs.length &&
        fs.existsSync(path + imagename)
      ) {
        console.log("found");
        imageModel.deleteOne({ imagename: imagename }, (err) => {
          if (err) console.error(err);
          fs.unlinkSync(path + imagename);
          var today = new Date();
          console.log(
            "\x1b[31m%s\x1b[0m",
            `${today.getDate()}/${today.getMonth()}/${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} : DELETION | ip : ' ${
              req.ip
            }\n   FILE : ${path + imagename}`
          );
          res.redirect("/");
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
});

app.listen(3000, () => {
  var today = new Date();
  console.log(
    "\x1b[42m%s\x1b[0m",
    "App is listening on Port 3000 | " +
      today.getHours() +
      ":" +
      today.getMinutes() +
      ":" +
      today.getSeconds()
  );
});
