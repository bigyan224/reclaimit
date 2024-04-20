import React from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'
import { useState } from 'react'

const AddProduct = () => {

      const [image,setImage] = useState(false);
      const[productDetails,setProductDetails] = useState({
        name:"",
        image:"",
        category: "",
        new_price:"",
        old_price:""      
      })

      const imageHandler = (e) =>{
        setImage(e.target.files[0]);
      }

      const changeHandler = (e) => {
        setProductDetails({...productDetails,[e.target.name]:e.target.value})
      }

      const Add_Product = async () => {
        console.log(productDetails);
        let responseData;
        let product = productDetails;

        let formData = new FormData();
        formData.append('product',image);

        await fetch('http://localhost:4000/upload',{
          method: 'POST',
          headers:{
            Accept:'application/json',
          },
          body:formData,
        }).then((resp) => resp.json()).then((data)=>{responseData=data})

        if(responseData.success){
          product.image = responseData.image_url;
          console.log(product);
          await fetch('http://localhost:4000/addproduct',{
            method: 'POST',
            headers: {
              Accept:'application/json',
              'Content-Type':'application/json'
            },
            body:JSON.stringify(product),
          }).then((resp) => resp.json()).then((data)=>{
            data.success?alert("Product Added"):alert("Failed")
          })
        }
      }

  return (
    <div className='add-product'>
        <p>Product Title</p>
      <div className='addproduct-itemfield'>
        <input value={productDetails.name} onChange={changeHandler} type='text' name="name" placeholder='Type here' />
      </div>
        <p>Product details</p>
      <div className='addproduct-itemfield details'>
        <input type="text" value={productDetails.color} onChange={changeHandler} name="color" placeholder='color' />
        <input type="text" value={productDetails.location} onChange={changeHandler} name="location" placeholder='location' />
        <input type="time"lue={productDetails.time} onChange={changeHandler} name="time" placeholder='time' />
        
      </div>
      <div className='addproduct-itemfield'>
        <h3>(if you have)Upload an Image for the Product</h3>
        <label htmlFor='file-input'>
          <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumbnail-img' alt='' />
        </label>
        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden  />
      </div>
      <button onClick={Add_Product} className='addproduct-btn'>ADD</button>
    </div>
  )
}

export default AddProduct