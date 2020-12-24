const express = require("express");
const router = express.Router();
const { getImages, deleteImage, uploadImage } = require("./../controller/imageController.js");

router.get("/", getImages);

router.post("/", uploadImage)

router.post("/:path", deleteImage)

module.exports = router;
