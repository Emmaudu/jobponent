const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');;
const session = require('express-session');

var cookieParser = require('cookie-parser');
const request = require('request');
var mongoStore = require('connect-mongo')(session);
var fs = require('fs');
var logger = require('morgan');
var methodOverride = require('method-override');
app.use(logger('dev'));
const bodyParser = require('body-parser');
const pug = require('pug');
const _ = require('lodash');
const path = require('path');


const {Donor} = require('./models/donor')
const {initializePayment, verifyPayment} = require('./config/paystack')(request);



var http =require('http').Server(app)

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');


// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
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

// app.get('/',(req, res) => {
//     res.render('index.pug');
// });

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



// //db connection
// mongoose.Promise = global.Promise;
// var dbPath = "mongodb://localhost:27017/data-base";
// mongoose.connect(dbPath,{ useMongoClient: true });
// mongoose.connection.once('open',function(){
//   console.log("Database Connected Successfully.");
// });
// var userModel = mongoose.model('user');

// //http method override middleware
// app.use(methodOverride(function(req,res){
//   if(req.body && typeof req.body === 'object' && '_method' in req.body){
//     var method = req.body._method;
//     delete req.body._method;
//     return method;
//   }
// }));

// // Session setup for cookies
// var sessionInit = session({
//                     name : 'userCookie',
//                     secret : '9743-980-270-india',
//                     resave : true,
//                     httpOnly : true,
//                     saveUninitialized: true,
//                     store : new mongoStore({mongooseConnection : mongoose.connection}),
//                     cookie : { maxAge : 80*80*800 }
//                   });

// app.use(sessionInit);
// app.use(express.static(path.resolve(__dirname,'./public')));

// // Setting ejs view engine
// app.set('view engine', 'ejs');
// app.set('views', path.resolve(__dirname,'./app/views'));

// app.use(bodyParser.json({limit:'10mb',extended:true}));
// app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
// app.use(cookieParser());

// //including models files.
// fs.readdirSync("./models").forEach(function(file){
//   if(file.indexOf(".js")){
//     require("./models/" + file);
//   }
// });

// //including controllers files.
// fs.readdirSync("./controllers").forEach(function(file){
//   if(file.indexOf(".js")){
//     var route = require("./controllers/" + file);
//     route.controller(app);
//   }
// });

// // Error Handler
// app.use(function(req,res){
//   res.status(404).render('message',
//       {
//           title: "404",
//           msg: "Page Not Found.",
//           status: 404,
//           error: "",
//           user: req.session.user,
//           chat: req.session.chat
//       });
// });

// app.use(function(req,res,next){

// 	if(req.session && req.session.user){
// 		userModel.findOne({'email':req.session.user.email},function(err,user){

// 			if(user){
//         req.user = user;
//         delete req.user.password;
// 				req.session.user = user;
//         delete req.session.user.password;
// 				next();
// 			}
// 		});
// 	}
// 	else{
// 		next();
// 	}
// });//end of Logged In User.


app.listen(PORT, console.log(`Server started on port ${PORT}`));