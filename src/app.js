const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
var passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;

const app = express();


// importing routes
const customerRoutes = require('./routes/customer');
const { urlencoded } = require('express');


// settings
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//middlewares
app.use(morgan('dev'));
app.use(myConnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '',
    port: '3306',
    database: 'appnodejs'
}, 'single'));
app.use(express.urlencoded({extended: true}));

app.use(cookieParser('mi secreto'));
app.use(session({
    secret: 'mi secreto',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new PassportLocal(function(username,password,done){
    if(username === "usuario" && password === "12345678")
        return done(null, { id: 1, name: "Cody"});
    
    done(null, false);
}));
//{ id: 1, name: "Cody"}
// 1 => Serializacion
passport.serializeUser(function(user, done){
    done(null, user.id);
})

//Deserializacion
passport.deserializeUser(function(id, done){
    done(null, {id: 1, name: "Cody"});
})

//routes
app.use('/', customerRoutes);

// static files
app.use(express.static(path.join(__dirname, 'public')));

app.get("/login",(req, res)=>{
    res.render("login")
})

app.post("/login", passport.authenticate('local',{
    successRedirect: "/",
    failureRedirect: "/login"
}));

// starting the server
app.listen(app.get('port'), () =>{
    console.log('Server on port 3000');
})