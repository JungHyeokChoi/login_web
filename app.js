var express = require('express')
var path = require('path')
var app = express()
var bodyParser = require('body-parser')
var passport = require('passport')
require('ejs')
const mongoose = require('mongoose');
mongoose.Promise = global.Promise
var User = require('./models/User')

var dotenv = require('dotenv')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var flash = require('express-flash-messages')
var apiRouter = require('./routes/Router')


//MongoDB Connection
dotenv.config()
var pw = process.env.PASSWORD
var url = `mongodb+srv://root:${pw}@cluster0.lkryw.mongodb.net/MyDB?retryWrites=true&w=majority`
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

// process.cwd() 현재 경로 찾기
app.set('views', path.resolve(__dirname + '/views'))
app.set('view engine', 'ejs')

// Error : app.set('view engine', 'html')
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
    secret : "3ojhtpioteuws90fdfhhereteteteryryt",
    resave : true,
    saveUninitialized : true
}))

app.use(express.static(__dirname + '/public'))
app.use(flash())

//Passport
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser((userId, done) => {
    User.findById(userId, (err, result) => { done(err, result) })
})

const localStrategy = require('passport-local').Strategy
const local = new localStrategy((username, password, done) => {
    User.findOne({ username })
    .then(user=>{
        if(!user || user.vailPassword(password)){
            done(null, false, {message : "Invaild username password"})
        } else { done(null, user) }
    })
    .catch(e => done(e))
})
passport.use("local", local)

//Add Routing File List on Middleware
app.use('/', apiRouter(passport))

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is Starting at http://localhost:${port}`)
})