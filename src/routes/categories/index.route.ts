import express from 'express';
const router = express.Router();
import * as categoryController from '../../controllers/categories/categories.controller'
import * as middlewares from '../../middlewares/index.middleware'

/* GET programming languages. */
router.get('/test',categoryController.test);
router.post('/create',categoryController.create);
router.get('/',middlewares.allCategoryCacheMiddleware,categoryController.getAllCategories);
router.get('/active',categoryController.getAllActiveCategories);
router.get('/search/:key',categoryController.searchCategory);
router.put('/deactive/:id',categoryController.deactiveParentCategories);
router.put('/active/:id',categoryController.activeParentCategories);
router.get('/:id',categoryController.getCategory);
router.put('/:id',categoryController.updateCategory);
router.delete('/:id',categoryController.deleteCategory);


export default router;
  
