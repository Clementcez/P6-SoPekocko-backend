const express = require('express');
const router = express.Router();

const ctrlStuff = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, ctrlStuff.createModel);
router.post('/:id/like', auth, ctrlStuff.likeSauce);
router.put('/:id', auth, multer, ctrlStuff.modifModel);
router.delete('/:id', auth, ctrlStuff.deleteModel);
router.get('/:id', auth, ctrlStuff.readModel);
router.get('/', auth, ctrlStuff.readAllModels);

module.exports = router;