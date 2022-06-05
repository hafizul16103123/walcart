import express from 'express';
const router = express.Router();
import * as categoryController from '../../controllers/categories/categories.controller'
import * as middlewares from '../../middlewares/index.middleware'

/* GET programming languages. */
router.post('/create',categoryController.create);
router.get('/',middlewares.allCategoryCacheMiddleware,categoryController.getAllCategories);
router.get('/active',categoryController.getAllActiveCategories);
router.get('/search/:key',categoryController.getSearchCategoryWithParents);
router.get('/deactive/:id',categoryController.deactiveParentCategories);
router.get('/:id',middlewares.getCategoryMiddleware,categoryController.getSingleCategory);
router.put('/:id',categoryController.updateCategory);
router.delete('/:id',categoryController.deleteCategory);


export default router;
  
