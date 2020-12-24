const ImageModel = require("./../models/Upload");
const errorHandler = require("./errorHandler");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

var Storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/images");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      `${file.fieldname}_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 15)}${Math.random()
        .toString(36)
        .substring(2, 15)}${path.extname(file.originalname)}`
    );
  },
});

var upload = multer({
  storage: Storage,
}).single("image");

const getImages = async (req, res, success = 0) => {
  try {
    const imageData = await ImageModel.find({}).sort([["_id", -1]]);
    res.render("home", { records: imageData, success: success });
    const today = new Date();
    console.log(
      "\x1b[36m%s\x1b[0m",
      `${today.getDate()}/${today.getMonth()}/${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} : CONNECTED | ip : ' ${
        req.ip
      } `
    );
  } catch (error) {
    console.error(error);
    errorHandler(res, `Server ERROR`, error);
  }
};

const uploadImage = async (req, res) => {
  try {
    upload(req, res, function (err) {
      if (err) {
        console.log(err);
        return res.end("Something went wrong");
      } else {
        let imageName = req.file.filename;
        let imageDetails = new ImageModel({
          imagename: imageName,
        });
        imageDetails.save((err) => {
          if (err) throw err;
          let today = new Date();
          console.log(
            "\x1b[32m%s\x1b[0m",
            `${today.getDate()}/${today.getMonth()}/${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} : UPLOAD | ip : ' ${
              req.ip
            }\n   FILE : ${imageName}`
          );
          getImages(req, res, 1);
        });
      }
    });
  } catch (error) {
    console.error(error);
    errorHandler(res, `Server ERROR <br>${error}`);
  }
};

const deleteImage = async (req, res) => {
  try {
    req.accepts('image/png');
    let imagename = req.params["path"];
    const path = "./public/images/";
    ImageModel.find({ imagename: imagename }, (err, docs) => {
      if (err) console.error(err);
      if (docs.length && fs.existsSync(path + imagename)) {
        ImageModel.deleteOne({ imagename: imagename }, (err) => {
          if (err) console.error(err);
          fs.unlinkSync(path + imagename);
          var today = new Date();
          console.log(
            "\x1b[31m%s\x1b[0m",
            `${today.getDate()}/${today.getMonth()}/${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} : DELETION | ip : ' ${
              req.ip
            }\n   FILE : ${path + imagename}`
          );
          getImages(req, res, 2);
        });
      }
    });
  } catch (err) {
    console.error(error);
    errorHandler(res, `Server ERROR <br>${error}`);
  }
};

module.exports = { getImages, uploadImage, deleteImage };
