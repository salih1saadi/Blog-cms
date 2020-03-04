const express = require('express');
const router = express.Router();
const Post = require('../../models/Posts');
const Category = require('../../models/Category');
const Comment = require('../../models/Comment');
const {userAuthenticated} = require('../../helpers/authentication');



router.all('/*', (req, res, next)=>{

req.app.locals.layout = 'admin';
next();

});



router.get('/', (req, res)=>{

	const promises = [
    
    Post.count().exec(),
    Category.count().exec(),
    Comment.count().exec()
	];

	Promise.all(promises).then(([postCount, categoryCount, commentCount])=>{


    res.render('admin/index', {postCount: postCount, categoryCount:categoryCount, commentCount:commentCount});

	});




});




module.exports = router;