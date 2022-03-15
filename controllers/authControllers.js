const User = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const handleErrorsSignup = (err)=>{
    console.log(err.message , err.code);
    let myErrors = {email:'',password:''};

    if(err.code == 11000){
        myErrors.email='this email is already registered';
        return myErrors;
    }
    
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            myErrors[properties.path] = properties.message
        })
    }

    return myErrors;
}

const handleErrorsLogin = (err)=>{
    console.log(err.message , err.code);
    let myErrors = {email:'',password:''};

    if(err.message === 'email not registered'){myErrors.email='this email is not registered'}
    if(err.message === 'incorrect password'){myErrors.password='incorrect password'}

    return myErrors;
}

// time in seconds
const maxLifeToken = 2*24*60*60

const createToken=(id)=>{
    return jwt.sign({id},process.env.MYSECRET,{
        expiresIn:maxLifeToken
    });
}

module.exports.signup_get = (req,res)=>{

    res.render('signup');
}

module.exports.login_get = (req,res)=>{

    res.render('login');

}

module.exports.login_get_redirect = (req,res)=>{
    res.render('login',{login_msg:'You need to Log In'});
}

module.exports.signup_post = async (req,res)=>{
    const {email,password}=req.body;

    try {
        const user = await User.create({email,password});
        const token = createToken(user._id);
        res.cookie('myjwt',token, { httpOnly:true, maxAge: maxLifeToken*1000 ,sameSite: 'Lax'});

        res.status(201).json({user: user._id});
    } catch (error) {
        const errors = handleErrorsSignup(error)
        res.status(400).json({errors});
    }
 
}

module.exports.login_post = async (req,res)=>{
    const {email,password}=req.body;
    try {
        const user = await User.login(email,password);
        const token = createToken(user._id);
        res.cookie('myjwt',token, { httpOnly:true, maxAge: maxLifeToken*1000 ,sameSite: 'Lax'});

        res.status(200).json({user:user._id});

    } catch (error) {
        const err = handleErrorsLogin(error);
        res.status(400).json({errors:err});
    }
}

module.exports.logout_get = (req,res)=>{
    res.cookie('myjwt','', {maxAge:1});
    res.redirect('/');
}