const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    firstName : {
        type:String,
        required:true,
        trim:true,
        min:3,
        max:20
    },
    lastName : {
        type:String,
        required:true,
        trim:true,
        min:3,
        max:20
    },
    username : {
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
    },
    email : {
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
      
    },
    hash_password : {
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    contactNumber:{
        type:String,
        unique:true,
        required:true
    },
    profilePicture :{
        img:{type:String}
    },
    coverPicture :{
        img:{type:String}
    },
    followers:[{
        userId : {type:mongoose.Schema.Types.ObjectId , ref:'User'}, 
        user:Object
        }],
    following:[{
        userId : {type:mongoose.Schema.Types.ObjectId , ref:'User'}, 
        user:Object,
        }],
        bio:{
            type:String
        },
        dob:{
            type:Date,
        },
        gender:{
            type:String,
            enum:['Male','Female','Others'],
        }

    
},{timestamps:true})

// userSchema.virtual('password').set(function(password){
//     this.hash_password = bcrypt.hashSync(password,10)

// })

userSchema.virtual('fullName').get(function(){
    return `${this.firstName} ${this.lastName}`
})

userSchema.methods = {
    authenticate: async function(password){
        return await bcrypt.compare(password,this.hash_password)
    }
}

module.exports = mongoose.model('user',userSchema)