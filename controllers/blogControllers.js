const Blog = require('../models/blog');

const blogIndex = (req,res)=>{
    Blog.find()
    .then((result)=>{
        // res.send(result);
        res.render('allBlogs',{title:'All Blogs',blogs:result});
    })
    .catch((err)=>{
        console.log(err);
    });
}


const blog_create_get = (req,res)=> {
    res.render('create',{title:'Create'})
}

const blog_create_post = (req,res)=>{
    const blog = new Blog(req.body);

    blog.save()
    .then((result)=>{
        res.render('create',{title:'Create',blog_msg:'Blog added - successfully!'})
    }).catch((err)=>{
        console.log(err);
        res.render('create',{title:'Create',blog_msg:'Error while posting!!!'})
    })
}

const blog_single_get = (req,res)=>{
    const id = req.params.id;
    Blog.findById(id)
    .then((result)=>{
        res.render('singleBlog',{title:result.title,blogInfo:result})
    })
    .catch((err)=>{
        console.log(err);
        res.status(404).render('404',{title:'Not Found'});
    })
}

const blog_delete = (req,res)=>{
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
    .then((result)=>{
        res.json({redirect:'/'})
    })
    .catch((err)=>{
        console.log(err);
        res.status(404).render('404',{title:'Not Found'});
    })
}

module.exports = {
    blogIndex,
    blog_create_get,
    blog_create_post,
    blog_single_get,
    blog_delete
}