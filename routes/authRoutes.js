const {Router} = require('express');
const {signup_get,signup_post,login_get,login_get_redirect,login_post,logout_get} = require('../controllers/authControllers');
const router = Router();

router.get('/signup',signup_get)

router.post('/signup',signup_post)

router.get('/login',login_get)

router.get('/redirectlogin',login_get_redirect)

router.post('/login',login_post)

router.get('/logout',logout_get)


module.exports = router;