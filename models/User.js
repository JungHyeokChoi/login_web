var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')

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

userSchema.methods.validPassword = (password) => {
    return bcrypt.compareSync(password, this.passwordHash)
}

userSchema.virtual("password").set((value) => {
    this.passwordHash = bcrypt.hashSync(value, 12)
})

var User = mongoose.model('user', userSchema)
module.exports = User