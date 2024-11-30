const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Brand = require('./models/Brand');
const app = express();
const port = 3000;

//mongoDB connection
mongoose.connect('mongodb://localhost:27017/branddb')
.then(()=>console.log('Connected to MongoDb'))
.catch(err=>console.error('Error connecting to MongoDb',err));

//middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

//set ejs as view engine
app.set('view engine','ejs');

app.get('/',async(req,res)=>{
    try{
        const brands = await Brand.find();
        res.render('index',{brands});
    }catch(err){
        console.log(err);
        res.status(500).send('Server error');
    }
});

//add new brand
app.post('/add',async(req,res)=>{
    try{
        const newBrand = new Brand({
            name:req.body.name,
            description:req.body.description
        });
        await newBrand.save();
        res.redirect('/');
    }catch(err){
        console.log(err);
        res.status(500).send('Error adding brand');
    }
});

//edit brand page -- prepopulate the form with the existing data
app.get('/edit/:id',async(req,res)=>{
    try{
        const brand = await Brand.findById(req.params.id);
        if(!brand) return res.status(404).send('Brand not found');
        res.render('edit',{brand});
    }catch(err){
        console.log(err);
        res.status(500).send('Server error');
    }
});

//update brand
app.post('/edit/:id',async(req,res)=>{
    try{
    await Brand.findByIdAndUpdate(req.params.id,req.body);
    res.redirect('/');
    }
    catch(err){
        console.log(err);
        res.status(500).send('Error Updating brand');
    }
});

//delete Brand
app.post('/delete/:id',async(req,res)=>{
    try{
        await Brand.findByIdAndDelete(req.params.id);
        res.redirect('/');
    }catch(err){
        console.log(err);
        res.status(500).send("Error deleting a brand");
    }
});

//start the server
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}!!!`)
});