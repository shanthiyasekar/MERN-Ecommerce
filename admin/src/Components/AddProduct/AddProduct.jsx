import React, { useState } from 'react'
import "./AddProduct.css"
import upload_area from "../../assets/Assets/upload_area.svg";

const AddProduct = () => {
    const [image,setImage]=useState(false);
    const [productDetails,setProductDetails]=useState({
        name:"",
        image:"",
        category:"",
        new_price:"",
        old_price:""
    })
    const imageHandler=(e)=>{
        setImage(e.target.files[0]);
    }

    const changeHandler = (e) => {
        setProductDetails({
            ...productDetails,
            [e.target.name]: Array.isArray(e.target.value) ? e.target.value[0] : e.target.value,
        });
    };
    

    const Add_Product = async () => {
        let formData = new FormData();
        formData.append('product', image);
        
    
        try {
            const response = await fetch('http://localhost:4000/upload', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
                body: formData,
            });
    
            if (response.ok) {
                const responseData = await response.json();
                
                // Update the product image URL in the product object
                let product = {
                    ...productDetails,
                    image: responseData.image_url,
                };
                console.log(product);
                
                // Send the request to add the product with the updated object
                const addProductResponse = await fetch("http://localhost:4000/addproduct", {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(product),
                });
    
                const data = await addProductResponse.json();
                data.success ? alert("Product Added") : alert("Failed");
            } else {
                console.error('Error uploading image response after checking ok:', response.statusText);
            }
        } catch (error) {
            console.error('Error uploading image:', error.message);
        }
    };
    
  return (
    <div className='add-product'>
        <div className="addproduct-itemfield">
            <p>Product Title</p>
            <input value={productDetails.name} onChange={changeHandler}type="text" name="name" placeholder='Type here'/>
        </div>
        <div className="addproduct-price">
            <div className="addproduct-itemfield">
                <p>Price</p>
                <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder='Type here'/>
            </div>
            <div className="addproduct-itemfield">
                <p>Offer Price</p>
                <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder='Type here'/>
            </div>
        </div>
        <div className="addproduct-itemfield">
            <p>Product Category</p>
            <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="kid">Kid</option>
            </select>
        </div>
        <div className="addproduct-itemfield">
            <label htmlFor='file-input'>
                <img src={image?URL.createObjectURL(image):upload_area} className='addProduct-thumbnail-img' alt=""/>
            </label>
            <input onChange={imageHandler} type="file" name="image" id="file-input" hidden/> 
        </div>
        <button onClick={()=>{Add_Product()}}className="addproduct-btn">ADD</button>
    </div>
  )
}

export default AddProduct