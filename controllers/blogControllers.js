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

    console.log(req.body);
    console.log(req.files);
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({'error':'No file uploaded'});
    }

    // The name of the input field (i.e. "image") is used to retrieve the uploaded file
    const imgFile = req.files.image;
    const imgNewName = new Date().getTime() + imgFile.name
    const uploadPath =  __dirname + '/../blogsImages/' + imgNewName;

    // Use the mv() method to place the file somewhere on your server
    imgFile.mv(uploadPath, function(err) {
        if (err)
        return res.status(500).send(err);
        
        const blog = new Blog({...req.body,image:imgNewName});
        blog.save()
        .then((result)=>{
            // res.render('create',{title:'Create',blog_msg:'Blog added - successfully!'})
            res.status(201).json({'isuploaded':'true'});
        }).catch((err)=>{
            console.log(err);
            res.status(400).json({'isuploaded':'false'});
        })

        // res.send('File uploaded!');
    });



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
    const id = (req.params.id).toString();
    console.log(typeof id);
    Blog.findByIdAndDelete(id)
    .then((result)=>{
        // res.json({redirect:'/'})
        res.redirect('/blogs')
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