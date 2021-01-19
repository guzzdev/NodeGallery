const multer = require('multer');
const path = require('path');
const fs = require('fs');
const errorHandler = require('./errorHandler');
const ImageModel = require('../models/Upload');

const Storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './public/images');
  },
  filename: (req, file, callback) => {
    callback(
      null,
      `${file.fieldname}_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 15)}${Math.random()
        .toString(36)
        .substring(2, 15)}${path.extname(file.originalname)}`,
    );
  },
});

const upload = multer({
  storage: Storage,
}).single('image');

/**
 * Get images from database
 */
const getImages = async (req, res, success = 0) => {
  try {
    const imageData = await ImageModel.find({}).sort([['_id', -1]]);
    res.render('home', { records: imageData, success });
  } catch (error) {
    errorHandler(res, 'Server ERROR', error);
  }
};

const uploadImage = async (req, res) => {
  try {
    upload(req, res, (uploadErr) => {
      if (uploadErr) throw uploadErr;
      const imageName = req.file.filename;
      const imageDetails = new ImageModel({
        imagename: imageName,
      });
      imageDetails.save((saveErr) => {
        if (saveErr) throw saveErr;
        getImages(req, res, 1);
      });
    });
  } catch (error) {
    errorHandler(res, `Server ERROR <br>${error}`);
  }
};

const deleteImage = async (req, res) => {
  try {
    req.accepts('image/png');
    const imagename = req.params.path;
    const savingPath = './public/images/';
    ImageModel.find({ imagename }, (findErr, docs) => {
      if (findErr) throw findErr;
      if (docs.length && fs.existsSync(savingPath + imagename)) {
        ImageModel.deleteOne({ imagename }, (deletionErr) => {
          if (deletionErr) throw deletionErr;
          fs.unlinkSync(savingPath + imagename);
          getImages(req, res, 2);
        });
      }
    });
  } catch (error) {
    errorHandler(res, `Server ERROR <br>${error}`);
  }
};

module.exports = { getImages, uploadImage, deleteImage };
