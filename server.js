const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');

dotenv.config();
// const cors = require('cors'); 

const { requireAuth, requireUser } = require('./middleware/authMiddleware');
const blogRouter = require('./routes/blogRoutes');
const authRouter = require('./routes/authRoutes');

const app = express();

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result)=>{
    console.log('connected to db');
    app.listen(3000);
}).catch((err)=>{
    console.log(err);
});

// app.use(cors());
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.static('blogsImages'));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(fileUpload());


app.use(authRouter);


app.get('*', requireUser)
app.get('/',(req,res)=>{
    res.render('index',{title:'Home'});
});


app.use('/blogs',blogRouter);

app.get('/about',(req,res)=>{
    res.render('about',{title:'About'});
});


app.use((req,res)=>{
    res.status(404).render('404',{title:'Not Found'});
})

