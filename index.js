const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Alpha-Men-E-commerce');

mongoose.connection.on('open', () => {
  console.log("Connected Successfully");
});

const express = require('express');
const app = express();
// const path = require("path")

// app.set('views', path.join(__dirname, 'view')); 




app.use(express.static('public'));

const userRouter =require('./routes/userRouter');
app.use('/',userRouter);

const adminRouter =require('./routes/adminRouter');
app.use('/admin',adminRouter);


app.listen(26726,()=>console.log('Server running at http://localhost:26726'))
