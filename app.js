const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const request = require('request');
const bodyParser = require('body-parser');
const pug = require('pug');
const _ = require('lodash');
const path = require('path');


const {Donor} = require('./models/donor')
const {initializePayment, verifyPayment} = require('./config/paystack')(request);


const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// app.engine('pug', require('pug').__express)
// app.engine('html', require('ejs').renderFile)


// app.engine('ejs', engines.ejs)
// app.engine('pug', engines.pug)


// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
// app.set('view engine', 'pug');



// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public/')));



// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

const PORT = process.env.PORT || 3000;

var picture=[];
var fname=[];
var lname=[];
var location=[];
var company=[];
var bio= [];
var category=[];
var education=[];
var email=[];
var price=[];
var tag=[];
var codingsupport=[];
var challenge=[];
var chat=[];
var oneone=[];
var goals=[];
var interview2=[];
var interview1=[];
var linkedin=[];
var twitter=[];
var password=[];
var jobtitle=[];




app.get('/admin', (req, res)=>{
    //Another Way
    res.render('admin', {picture: picture, fname: fname, lname: lname, bio: bio, company: company, oneone: oneone, price: price,tag: tag, password: password, goals: goals, email: email, tag: tag, category: category, twitter: twitter, linkedin: linkedin, codingsupport: codingsupport, chat: chat, interview1: interview1, interview2: interview2, challenge: challenge, location: location, jobtitle: jobtitle, education: education});
   
});

app.post('/a', (req, res)=>{

        // user: req.user
  
  var pic = req.body.profile_picture;    
  var s = req.body.firstname;
  var las = req.body.lastname;
  var ema = req.body.email;
  var job = req.body.job_title;
  var comp = req.body.company;
  var loc = req.body.location;
  var he = req.body.hel;
  var cat = req.body.category;
  var tagg = req.body.tags;
  var pri = req.body.price;
  var bioo = req.body.bio;
  var twit = req.body.twitter_handle;
  var link = req.body.linkedin_url;
  var whyy= req.body.why;
  var succ = req.body.successes;
  var pass= req.body.password;
  var chatt = req.body.chat;
  var goall= req.body.goals;
  var chall= req.body.challenge;
  var one = req.body.one_on_one;
  var code = req.body.coding_support;
  
        console.log(las)

          
        picture.push(pic);
        fname.push(s);
        lname.push(las);
        email.push(ema);
        jobtitle.push(job);
        category.push(cat);
        location.push(loc);
        company.push(comp);
        education.push(he);
        tag.push(tagg);
        bio.push(bioo);
        price.push(pri);
        linkedin.push(link);
        twitter.push(twit);
        interview1.push(whyy);
        chat.push(chatt);
        interview2.push(succ);
        password.push(pass);
        goals.push(goall);
        challenge.push(chall);
        oneone.push(one);
        codingsupport.push(code);

        res.redirect('/admin');
      



        // module.exports=items;
        module.exports={picture, fname, lname, goals, oneone, codingsupport, chat, interview1, email, password, company , jobtitle, interview2, linkedin, twitter, category, location, price, tag, bio, challenge, education};
        
});


// const {Donor} = require('../models/donor')
// const {initializePayment, verifyPayment} = require('../config/paystack')(request);

// const port = process.env.PORT || 3000;

// const app = express();



// app.get('/',(req, res) => {
//     res.render('index.pug');
// });

app.post('/paystack/pay', (req, res) => {
    const form = _.pick(req.body,['amount','email','full_name']);
    form.metadata = {
        full_name : form.full_name
    }
    form.amount *= 100;
    
    initializePayment(form, (error, body)=>{
        if(error){
            //handle errors
            console.log(error);
            return res.redirect('/error')
            return;
        }
        response = JSON.parse(body);
        res.redirect(response.data.authorization_url)
    });
});

app.get('/paystack/callback', (req,res) => {
    const ref = req.query.reference;
    verifyPayment(ref, (error,body)=>{
        if(error){
            //handle errors appropriately
            console.log(error)
            return res.redirect('/error');
        }
        response = JSON.parse(body);        

        const data = _.at(response.data, ['reference', 'amount','customer.email', 'metadata.full_name']);

        [reference, amount, email, full_name] =  data;
        
        newDonor = {reference, amount, email, full_name}

        const donor = new Donor(newDonor)

        donor.save().then((donor)=>{
            if(!donor){
                return res.redirect('/error');
            }
            res.redirect('/receipt/'+donor._id);
        }).catch((e)=>{
            res.redirect('/error');
        })
    })
});

app.get('/receipt/:id', (req, res)=>{
    const id = req.params.id;
    Donor.findById(id).then((donor)=>{
        if(!donor){
            //handle error when the donor is not found
            res.redirect('/error')
        }
        res.render('success.pug',{donor});
    }).catch((e)=>{
        res.redirect('/error')
    })
})

app.get('/error', (req, res)=>{
    res.render('error.pug');
})


app.listen(PORT, console.log(`Server started on port ${PORT}`));