const jwt = require('jsonwebtoken');
const User = require('../models/user')
const dotenv = require('dotenv');
dotenv.config();

const requireAuth = (req,res,next)=>{
    const token = req.cookies.myjwt;
    
    if(token){
        jwt.verify(token, process.env.MYSECRET,(err, decodedToken)=>{
            if(err){
                res.redirect('/redirectlogin')
            }else{
                console.log(decodedToken);
                next();
            }
        });
    }else{
        res.redirect('/redirectlogin')
    }
}

const requireUser = (req,res,next)=>{
    const token = req.cookies.myjwt;
    
    if(token){
        jwt.verify(token, process.env.MYSECRET,async (err, decodedToken)=>{
            if(err){
                console.log(err.message);
                res.locals.user=null;
                next();
            }else{
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    }else{
        res.locals.user = null;
        next();
    }
}


module.exports = {requireAuth, requireUser}