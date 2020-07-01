var express = require('express')
var router = express.Router()
var User = require('../models/User.js')
var Noticeboard = require('../models/Noticeboard.js')

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
        res.render('signup.ejs')
    })
    .post((req,res,next) => {
        var contact = new User()

        contact.username = req.body.username
        contact.passwordHash = req.body.passwordHash
        contact.email = req.body.email
        
        contact.save((err, result) => {
            if(err){
                console.log(err.body)
            }
            console.log(result)
            res.redirect(`/login`)
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
         res.render('main.ejs', {data:result})
        })
    })

    .post((req, res, next) => {
        var contact = new Noticeboard()

        contact.title = req.body.title
        contact.description = req.body.description
        contact.email = req.body.email
        contact.auther = req.body.auther

        contact.save((err, result) => {
            if(err){
                console.log(err.body)
            }
            console.log(result)
            res.send("Success")
        })
    })

router.route('/insert')
    .get((req, res, next) => {
        res.render('insert')
    })
    .post((req, res, next) => {

    })
module.exports = router;