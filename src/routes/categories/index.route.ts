import express from 'express';
const router = express.Router();
import * as categoryController from '../../controllers/categories/categories.controller'
/* GET programming languages. */
router.get('/', categoryController.get);
  
