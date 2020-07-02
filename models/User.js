var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')
const uniqueValidator = require("mongoose-unique-validator");

var userSchema = mongoose.Schema({
    username : {
        type : String,
        required: true
    },
    passwordHash : {
        type : String,
        required: true
    },
    email:String,
    createAt : {
        type : Date,
        default : Date.now
    }
})

userSchema.plugin(uniqueValidator)

userSchema.methods.validPassword = (password) => {
    return bcrypt.compareSync(password, this.passwordHash)
}

userSchema.virtual("password").set((value) => {
    this.passwordHash = bcrypt.hashSync(value, 12)
})

var User = mongoose.model('user', userSchema)
module.exports = User