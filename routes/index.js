const express = require('express');

const router = express.Router();

const { getImages, deleteImage, uploadImage } = require('../controller/imageController.js');
const { ensureAuthenticated } = require('../config/auth');

router.get('/', ensureAuthenticated, getImages);

router.post('/', ensureAuthenticated, uploadImage);

router.post('/:path', ensureAuthenticated, deleteImage);


module.exports = router;
