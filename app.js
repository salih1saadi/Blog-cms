
const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const {mongoDbUrl} = require('./config/database');
const passport = require('passport');

mongoose.Promise = global.Promise;

mongoose.connect(mongoDbUrl,()=>{


	console.log('connected');
});




app.use(express.static(path.join(__dirname, 'public')));


// set view Engine 

const {select, generateTime, paginate} = require('./helpers/handlebars-helpers');

app.engine('handlebars', exphbs({defaultLayout:'home', helpers: {select:select, generateTime:generateTime, paginate:paginate}}));
app.set('view engine','handlebars');

//method override
app.use(methodOverride('_method'));


//uploade middlware
app.use(upload());

//body parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(session({
 
 secret: 'saleh',
 resave: true,
 saveUninitialized:true

}));

app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());

//local varibales using middleware
app.use((req, res, next)=>{


    res.locals.user = req.user || null;

    res.locals.success_message = req.flash('success_message');

    res.locals.error_message = req.flash('error_message');

    res.locals.form_errors = req.flash('form_errors');

    res.locals.error = req.flash('error');

    next();


});
//load routes

const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');
const comments = require('./routes/admin/comments');

//use routes

app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);
app.use('/admin/comments', comments);

const port = process.env.PORT || 4500;

app.listen(port, ()=>{

console.log('app is run');

});