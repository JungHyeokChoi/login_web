var express = require('express')
var router = express.Router()
var User = require('../models/User.js')
var Noticeboard = require('../models/Noticeboard.js')
var bcrypt = require('bcryptjs')

var name = {
    a : "CJH",
    b : "PEJ",
    c : "NoName"
}

router.route('/')
    .get((req, res, next) => {
        User.find((err, result) => {
            if(err){
             console.log(err.body)
         }
         //res.send(result)
         res.render('index.ejs', {data:result.username})
        })
    })
    .post((req, res) => {
        var contact = new User()

        contact.username = req.body.username
        contact.passwordHash = req.body.passwordHash
        contact.email = req.body.email

        contact.save((err, result) => {
            if(err){
                console.log(err.body)
            }
            console.log(result)
            res.send("Success")
        })
    })

router.route('/signup')
    .get((req, res, next) =>{
        res.render('signup', {message : "true"})
    })
    .post((req, res, next) => {
        User.findOne({username : req.body.username}, (err, result) => {
            if(err){
                console.log(err.body)
            } else if(result) {
                console.log(result)
                res.render('signup', {message : "false", data : result.username})
            } else {
                var contact = new User()
            
                contact.username = req.body.username
                contact.passwordHash = bcrypt.hashSync(req.body.passwordHash)
                contact.email = req.body.email
                contact.save((err, result)=>{
                    if(err) {
                        console.log(err)
                    }
                    console.log(result)
                    res.redirect("/main")
                })
            }
        })
    })

router.route('/login')
    .get((req, res, next) => {
        res.render('login.ejs')
    })
    .post(async (req, res, next) => {
        var username = await req.body.username
        var passwordHash = await req.body.passwordHash
        
        User.findOne({username:username} ,(err,result) =>{
            if(err){
                console.log(err.body)
            }
            if(!result){
                res.send(`${username} is not exist`)
            } else {
                if(result.passwordHash == passwordHash){
                    console.log(username)
                    res.render('index.ejs', {data:result.username})
                }
                else{
                    res.send(`${username}'s password is wrong`)
                }
            }
        })
    })

router.route('/main')
    .get((req, res, next) => {
        Noticeboard.find((err, result) => {
            if(err){
             console.log(err.body)
         }
         res.render('main', {data:result})
        })
    })

router.route('/insert')
    .get((req, res, next) => {
        res.render('insert')
    })
    .post((req, res, next) => {
        var contact = new Noticeboard()

        contact.title = req.body.title
        contact.email = req.body.email
        contact.auther = req.body.auther
        contact.description = req.body.description

        contact.save((err, result) => {
            if(err){
                console.log(err.body)
            }
            console.log(result)
            res.redirect('/main')
        })
    })

router.route('/update')
    .get((req, res, next) => {        
        res.render('update')
    })
    .post((req, res, next) => {

    })

router.route('/delete')
    .get((req, res, next) => {
        
    })
    .post((req, res, next) => {

    })

module.exports = router;