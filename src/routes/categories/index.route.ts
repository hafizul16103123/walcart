import express from 'express';
const router = express.Router();
import * as categoryController from '../../controllers/categories/categories.controller'
import * as middlewares from '../../middlewares/index.middleware'
// All category rel;ated Routes
router.post('/create',categoryController.create);  // cache update
router.get('/',middlewares.allCategoryCacheMiddleware,categoryController.getAllCategories); //cached
router.get('/active',middlewares.activeCategoryCacheMiddleware,categoryController.getAllActiveCategories); //cached
router.get('/deactive',middlewares.deactiveCategoryCacheMiddleware,categoryController.getAllDeactiveCategories); //cached
router.get('/search/:key',categoryController.searchCategory); //cached
router.put('/deactive/:id',categoryController.deactiveParentCategories); // cache update
router.put('/active/:id',categoryController.activeParentCategories); // cache update
router.get('/:id',middlewares.singleCategoryCacheMiddleware,categoryController.getCategory);// cached
router.put('/:id',categoryController.updateCategory); // cache update
router.delete('/:id',categoryController.deleteCategory); // cache update

export default router;
  
