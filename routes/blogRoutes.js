const {Router}= require('express');
const router = Router();
const { requireAuth } = require('../middleware/authMiddleware');

const {
    blogIndex,
    blog_create_get,
    blog_create_post,
    blog_single_get,
    blog_delete
} = require('../controllers/blogControllers');

router.get('/',blogIndex);
router.get('/create',requireAuth,blog_create_get);
router.get('/:id',blog_single_get)
router.get('/delete/:id',blog_delete)
router.post('/create-blog',blog_create_post)

module.exports = router;