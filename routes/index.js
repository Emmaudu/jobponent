const express = require('express');
const router = express.Router();



const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');



var picture=[];
var fname1=[];
var lname1=[];
var location=[];
var company=[];
var bio= [];
var category=[];
var education=[];
var email1=[];
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





router.get('/', forwardAuthenticated, (req,res)=>{
    res.render('index', {
        user: req.user
    })
})

router.get('/signup', forwardAuthenticated, (req,res)=>{
    res.render('signup', {
        user: req.user
    })
})

router.get('/login', forwardAuthenticated, (req,res)=>{
    res.render('login', {
        user: req.user
    })
})

router.get('/mentorlogin', forwardAuthenticated, (req,res)=>{
    res.render('mentorlogin', {
        user: req.user
    })
})

router.get('/mentorapply', forwardAuthenticated, (req,res)=>{
    res.render('mentorsignup', {
        user: req.user
    })
})

router.post('/browse', forwardAuthenticated, (req,res)=>{
    // res.render('browse')
    res.redirect('/browse', {
        user: req.user
    })
})

router.get('/browse', forwardAuthenticated, (req,res)=>{
    res.render('browse', {
        user: req.user
    })
})

router.get('/applymentor', forwardAuthenticated, (req,res)=>{
    res.render('apply', {
        user: req.user
    })
})


router.get('/dashboard',ensureAuthenticated , (req,res)=>{
    res.render('menteedashboard',{
        user: req.user
    })
})

router.get('/mentortable',forwardAuthenticated , (req,res)=>{
    res.render('mentortable',{
        user: req.user
    })
})



router.get('/menteetable',forwardAuthenticated , (req,res)=>{
    res.render('menteetable',{
        user: req.user
    })
})

router.get('/approvedmentortable',forwardAuthenticated , (req,res)=>{
    res.render('approvedmentortable',{
        user: req.user
    })
})

// router.get('/vetmentor',forwardAuthenticated , (req,res)=>{
//     res.render('vetmentor',{
//         user: req.user
//     })
// })


router.get('/dashboardm', ensureAuthenticated, (req,res)=>{
    res.render('mentordashboard', {
        user: req.user
    })
})


router.get('/adminlogin',forwardAuthenticated, (req,res)=>{
    res.render('adminlogin',{
        user: req.user

    })
})

router.get('/admin',forwardAuthenticated, (req,res)=>{
    res.render('admindashboard', {
        user: req.user
    })
})


router.get('/chat',forwardAuthenticated, (req,res)=>{
    res.render('chat', {
        user: req.user
    })
})






router.get('/vetmentor',forwardAuthenticated, (req, res)=>{
    //Another Way
    res.render('vetmentor', {picture: picture, fname1: fname1, lname1: lname1, bio: bio, company: company, oneone: oneone, price: price,tag: tag, password: password, goals: goals, email1: email1, tag: tag, category: category, twitter: twitter, linkedin: linkedin, codingsupport: codingsupport, chat: chat, interview1: interview1, interview2: interview2, challenge: challenge, location: location, jobtitle: jobtitle, education: education});
        user:req.user
});


router.post('/a', (req, res)=>{

        user: req.user
  
  var pic = req.body.profile_picture;    
  var s = req.body.first_name;
  var las = req.body.last_name;
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
        fname1.push(s);
        lname1.push(las);
        email1.push(ema);
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


        res.redirect('/');
      

        // module.exports=items;
        module.exports={picture, fname1, lname1, goals, oneone, codingsupport, chat, interview1, email1, password, company , jobtitle, interview2, linkedin, twitter, category, location, price, tag, bio, challenge, education};

});



module.exports = router;