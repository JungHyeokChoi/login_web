var express = require('express')
var app = express()
var path = require('path')
var bodyParser = require('body-parser')
var apiRouter = require('./routes/Router')
const mongoose = require('mongoose');
mongoose.Promise = global.Promise
var flash = require('express-flash-messages')
var cookieParser = require('cookie-parser')
var session = require('express-session')

require('dotenv').config()
const port = process.env.PORT

//MongoDB Connection
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
app.use(express.static(__dirname + '/public'))
app.use('/', apiRouter)
app.use(session({
    secret : "3ojhtpioteuws90t",
    resave : true,
    saveUninitialized : true
}))

app.listen(port, () => {
    console.log(`Server is Starting at http://localhost:${port}`)
})