const port =4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { request } = require("http");
const { log } = require("console");

app.use(express.json());
app.use(cors());



// Database Connection with MongoDB

mongoose.connect("mongodb+srv://bigyanacharya224:k9UTl6Y8po8Zf4Mj@reclaim.drubpy8.mongodb.net/?retryWrites=true&w=majority&appName=reclaim");


// API Creation
app.get("/", (req, res) => {
  res.send("Express App is running");
});

//image storage engine

const storage = multer.diskStorage({
  destination: './upload/images',
  filename:(req,file,cb)=>{
    return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})

//Schema creating for user model

const Users= mongoose.model('Users',{
  name:{
    type:String,
  },
  email:{
    type:String,
    unique:true,
  },
  password:{
    type:String,
  },
  date:{
    type:Date,
    default:Date.now,
  }
})

//Creating Endpoint for registering users

app.post('/signup',async (req,res) => {
  let check = await Users.findOne({email:req.body.email})
  if (check) {
    return res.status(400).json({success:false,error:"existing user found with same email address"})
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i]=0;
    
  }

  const user = new Users({
    name:req.body.username,
    email:req.body.email,
    password:req.body.password,
    addeditems:req.body.addeditems,
  })

  await user.save();

  const data = {
    user:{
      id:user.id
    }
  }

  const token = jwt.sign(data,'secret_ecom');
  res.json({success:true,token})
})

const upload = multer({storage:storage})

//Creating  Upload Endpoint for images
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
  res.json({
    success:1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  })
})

// Schema for Creating Products

const addedProduct = mongoose.model("addedProduct",{
  id:{
    type: Number,
    required:true,
  },
  name:{
    type:String,
    required:true,
  },
  image:{
    type:String,
  },
  location:{
    type:String,
    required:true,
  },
  date:{
    type:Date,
    default:Date.now,
  },
color:{
  type:String,
}
})
const foundProduct = mongoose.model("foundProduct",{
  id:{
    type: Number,
    required:true,
  },
  name:{
    type:String,
    required:true,
  },
  image:{
    type:String,
    required:true,
  },
  location:{
    type:String,
    required:true,
  },
  date:{
    type:Date,
    default:Date.now,
  },
color:{
  type:String,
}
})

app.post('/addproduct',async (req,res) =>{
  let products = await addedProduct.find({});
  let id;
  if(products.length>0){
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id+1;
  }
  else{
    id=1;
  }
  const product = new addedProduct({
    id:id,
    name:req.body.name,
    image:req.body.image,
    location:req.body.location,
  });
  console.log(product);
  await product.save();
  console.log("Saved")
  res.json({
    success:true,
    name:req.body.name,
  })
})


app.post('/foundproduct',async (req,res) =>{
  let products = await foundProduct.find({});
  let id;
  if(products.length>0){
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id+1;
  }
  else{
    id=1;
  }
  const product = new fProduct({
    id:id,
    name:req.body.name,
    image:req.body.image,
    location:req.body.location,
  });
  console.log(product);
  await product.save();
  console.log("Saved")
  res.json({
    success:true,
    name:req.body.name,
  })
})

// Creating API for deleting products

app.post('/removeproduct',async (req,res) => {
  await addedProduct.findOneAndDelete({id:req.body.id});
  console.log("removed");
  res.json({
    success:true,
    name:req.body.name
  })
})

app.get("/show", async function(req, res) {
  try {
    // Check if Authorization header exists in the request
  
    
    
    // Extract token from Authorization header
    const token = req.headers.authorization.split(" ")[1];
    
    // Verify and decode the token
    const decoded = jwt.verify(token, 'secret_ecom');
    
    // Extract user ID from decoded token
    const userId = decoded.user.id;
    
    // Find the user by ID and populate their posts
    const user = await Users.findOne({ _id: userId }).populate("addeditems");
    
    // Send only the posts uploaded by the logged-in user
    const userPosts = user.addeditems;
    
    res.send(userPosts);
  } catch (error) {
    // Handle token decoding errors
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
});


// Creating API for getting all products
app.get('/allproducts',async (req,res)=>{
  let products = await addedProduct.find({});
  console.log("All Products Fetched")
  res.send(products);
})

//Creating Endpoint for user login

app.post('/login',async (req,res) => {
  let user = await Users.findOne({email:req.body.email});
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user:{
          id:user.id
        }
      }
      const token = jwt.sign(data,'secret_ecom')
      res.json({success:true,token});
    }
    else{
      res.json({success:false,errors:"Wrong Password"});
    }
  }
  else{
    res.json({success:false,errors:"Wrong Email ID"})
  }
})


// creating middleware to fetch users

  const fetchUser = async (req,res,next) => {
    const token = req.header('auth-token');
    if (!token) {
      res.status(401).send({errors:"Please authenticate using valid token."})
    }
    else{
      try {
        const data = jwt.verify(token,'secret_ecom');
        req.user = data.user;
        next();
      } catch (error) {
        res.status(401).send({errors: "please authenticate using a valid token"})
      }
    }
  }


 
app.listen(port, (error) => {
  if (!error) {
    console.log("Server running on port " + port);
  } else {
    console.log("Error: " + error);
  }
});