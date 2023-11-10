const mongoose = require('mongoose');
const env = require('dotenv').config()
console.log("env "+process.env.MongoURL);

mongoose.connect(process.env.MongoURL);

mongoose.connection.on('open', () => {
  console.log("Connected Successfully");
});

const express = require('express');
const app = express();

app.use(express.static('public'));

const userRouter =require('./routes/userRouter');
app.use('/',userRouter);
const adminRouter =require('./routes/adminRouter');
app.use('/admin',adminRouter);


app.listen(process.env.PORT,()=>console.log('Server running at http://localhost:26726'))

