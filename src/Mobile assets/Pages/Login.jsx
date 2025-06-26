import React, { useEffect, useState } from 'react'
import css from './auth.module.css'
import image from "../../Images/headphone.png"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';



function Login() {
    const navigate = useNavigate()
    const [userData,setUserData] = useState({
       email:"",
       password:""
    })
    const addUser = async() =>{  
   
      try {
        
        console.log(userData);
      await  axios({
            method: 'post',
            url: 'https://authentication-seven-umber.vercel.app/api/login',
            data:userData, // Body
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer YOUR_TOKEN'
            }
          })
          .then(response => {
            toast.success('Welcome Back',{duration:2000});
            localStorage.setItem('token',response.data.token)
              document.getElementById('subButton').disabled = false
              document.getElementById('subButton').style.backgroundColor = "rgb(30 215 96)"
              navigate('/')
            
            
          }
        )
        .catch((error)=>{
          console.log(error.response.data.message);
        toast.error(error.response.data.message,{duration: 2000})
             document.getElementById('subButton').disabled = false
              document.getElementById('subButton').style.backgroundColor = "rgb(30 215 96)"
        })
      } catch (error) {
        console.log(error);
        
      }
         
    }

    const handleOnSubmit = (e) =>{ 
      document.getElementById('subButton').disabled = true
      document.getElementById('subButton').style.backgroundColor = "rgb(29 204 91 / 31%)"
        e.preventDefault()
        addUser()
       
      
    }

    const handleOnChnage = (e) =>{

  
      let name = e.target.name;
      let value = e.target.value;
      
        setUserData({
            ...userData,
            [name]:value,
          })
          
      
    }



  return (
    <div className={css.maincontainer}>
       
       <div className={css.container}>
              
               <form onSubmit={handleOnSubmit} method="post">
                <div className={css.imageContainer}>
                  <img style={{width:"40px",height:"40px"}} src={image} alt="headphone" />
                  <div style={{fontSize:"30px",fontWeight:"bold",textAlign:"center"}}>Login in to Alphamusic</div>
                </div>
                <div style={{width:"100%",padding:"30px 0px",display:"flex",flexDirection:"column",justifyContent:"center",gap:"15px"}}>
                    <button style={{width:"100%",height:"auto",border:"1px solid gray",backgroundColor:"transparent",borderRadius:"50px",padding:'15px',fontSize:"15px"}}>
                        Continue with Google 
                    </button>
                    <button style={{width:"100%",height:"auto",border:"1px solid gray",backgroundColor:"transparent",borderRadius:"50px",padding:'15px',fontSize:"15px"}}>
                        Continue with Facebook 
                    </button>
                    <button style={{width:"100%",height:"auto",border:"1px solid gray",backgroundColor:"transparent",borderRadius:"50px",padding:'15px',fontSize:"15px"}}>
                        Continue with Google 
                    </button>
                </div>
                 <hr color='gray' />
                
                <div className={css.inputContainer}>
                  <label htmlFor="email" style={{color:"white",fontSize:"14px"}}>Email or username</label>
                  <input style={{marginTop:"6px"}} type="email" name='email' placeholder='Email or username' value={userData.email} onChange={handleOnChnage} required />
                </div>
                <div className={css.inputContainer}>
                  <input  type="password" name='password' placeholder='Password' value={userData.password} onChange={handleOnChnage} required />
                </div>
                <div style={{padding:"10px"}}>
                <button className={css.subButton} id='subButton' type='submit'>Login</button>
                </div>
              </form>
       </div>
      
    </div>
        
  )
}

export default Login
