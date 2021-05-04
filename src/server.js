const express = require('express')
const env = require('dotenv')
const mongoose = require('mongoose')
const app = express();
const path = require('path')
const cors = require('cors')  // to fetch backend api : cors policy

// Routes
const authRoutes = require('./routes/auth.routes')
const postRoutes = require('./routes/post.routes')
const userRoutes = require('./routes/user.routes')

//enviornment variable or you can say constants
env.config()

// mongodb connection
// mongodb+srv://root:<password>@cluster0.biahp.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.biahp.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`, 
    {
     useNewUrlParser: true, 
     useUnifiedTopology: true,
     useCreateIndex:true
    }).then(()=>{
        console.log("Database connected");
    })

app.use(cors())
app.use(express.json())
app.use('/public',express.static(path.join(__dirname,'uploads')))
app.use('/api',authRoutes)
app.use('/api',postRoutes)
app.use('/api',userRoutes)

app.listen(process.env.PORT,()=>{
    console.log(`server started on https://localhost:${process.env.PORT}`);
})