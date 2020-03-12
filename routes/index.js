const express = require('express');
const router = express.Router();



const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


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


router.get('/dashboardm', ensureAuthenticated, (req,res)=>{
    res.render('mentordashboard', {
        user: req.user
    })
})


router.get('/admin',forwardAuthenticated, (req,res)=>{
    res.render('adminlogin',{
        user: req.user

    })
})

router.get('/adminlogin',forwardAuthenticated, (req,res)=>{
    res.render('admindashboard', {
        user: req.user
    })
})

// router.get('/adminlogin', (req,res)=>{
//     res.render('adminlogin')
// })

module.exports = router;