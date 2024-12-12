const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');

router.get('/:id', downloadController.renderDownloadPage);
router.post('/:id', downloadController.handlePasswordCheck);
router.get('/:id/file', downloadController.handleDownload);

module.exports = router;
