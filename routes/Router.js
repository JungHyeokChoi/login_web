var express = require('express')
var router = express.Router()
var User = require('../models/User.js')
var Noticeboard = require('../models/Noticeboard.js')
var bcrypt = require('bcryptjs')

function loggedInOnly(req, res, next){
    if(req.isAuthenticated()) next()
    else res.redirect('/login')
} 

function loggedOutOnly(req, res, next){
    if(req.isUnauthenticated()) next()
    else res.redirect('/')
} 

function authenticate(passport){
    router.use((req, res, next) => {
        res.locals.currentUser = req.user
        console.log(res.locals.currentUser)
        next()
    })

    router.route('/')
    .get(loggedInOnly, (req, res, next) => {
        User.find((err, result) => {
            if(err) console.log(err.body)
            res.render('index.ejs', {data:result.username})
        })
    })
    // .post(loggedInOnly, (req, res) => {
    //     var contact = new User()

    //     contact.username = req.body.username
    //     contact.passwordHash = req.body.passwordHash
    //     contact.email = req.body.email

    //     contact.save((err, result) => {
    //         if(err){
    //             console.log(err.body)
    //         }
    //         console.log(result)
    //         res.send("Success")
    //     })
    // })

    router.route('/signup')
        .get(loggedOutOnly, (req, res, next) =>{
            res.render('signup', {message : "true"})
        })
        .post((req, res , next)=>{
            var username = req.body.username
            var passwordHash =bcrypt.hashSync(req.body.passwordHash)
            var email = req.body.email

            User.findOne({username : username} , (err, user) => {
                if(err) console.log(err)
                if(user) {
                    return res.render('signup',  {message:"false", data:user.username})
                }                 
                User.create({ username,passwordHash, email })
                .then(user => {
                    req.login((user , err)=>{
                        if(err) next(err)
                        else res.redirect('/main')
                    })
                })
                .catch(e=> {
                    if(e.name == "ValidationError") {
                        res.redirect("/signup")
                    } else next(e);
                })   
            })
        })

    router.route('/login')
        .get(loggedOutOnly, (req, res, next) => {
            res.render('login.ejs')
        })
        .post(loggedOutOnly, 
            passport.authenticate("local", {
                successRedirect : "/main",
                failureRedirect : "/login",
                failureflash : true    
            })
        )
        // .post(async (req, res, next) => {
        //     var username = await req.body.username
        //     var passwordHash = await req.body.passwordHash
            
        //     User.findOne({username:username} ,(err,result) =>{
        //         if(err){
        //             console.log(err.body)
        //         }
        //         if(!result){
        //             res.send(`${username} is not exist`)
        //         } else {
        //             if(result.passwordHash == passwordHash){
        //                 console.log(username)
        //                 res.render('index.ejs', {data:result.username})
        //             }
        //             else{
        //                 res.send(`${username}'s password is wrong`)
        //             }
        //         }
        //     })
        // })

    router.route('/main')
        .get(loggedInOnly, (req, res, next) => {
            Noticeboard.find((err, result) => {
                if(err){
                console.log(err.body)
            }
            res.render('main', {data:result})
            })
        })

    router.route('/insert')
        .get(loggedInOnly, (req, res, next) => {
            res.render('insert')
        })
        .post(loggedInOnly, (req, res, next) => {
            var contact = new Noticeboard()

            contact.title = req.body.title
            contact.email = req.body.email
            contact.auther = req.body.auther
            contact.description = req.body.description

            contact.save((err, result)=>{
                if(err) {
                    console.log(err)
                }
                console.log(result)
                res.redirect("/main")
            })
        })

    router.route('/update')
        .get(loggedInOnly, (req, res, next) => {        
            res.render('update')
        })
        .post((req, res, next) => {

        })

    router.route('/delete')
        .get(loggedInOnly, (req, res, next) => {
        })
        .post(loggedInOnly, (req, res, next) => {

        })

    router.all("/logout", (req, res, next) => {
        req.logout()
        res.redirect('/login')
    })

    //Error Handler
    router.use((err, req, res) => {
        console.error(err.stack)
    })

    return router
}

module.exports = authenticate;