import axios from 'axios';
import React from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


function Creat_playlist() {
   const navigate = useNavigate()
    const createPlaylist = async(e) =>{
      
             try {
               if (localStorage.getItem("token")) {
                 await axios({
                   method: "post",
                   url: "https://authentication-seven-umber.vercel.app/api/create/playlist",
                   data:{
                    name:e.target.name.value,
                    desc:""
                   }, // Body
                   headers: {
                     "Content-Type": "application/json",
                     Authorization: `Bearer ${localStorage.getItem("token")}`,
                   },
                 })
                   .then((response) => {
                       navigate(`/playlist/${response.data.playlistId}`)
                       toast.success(response.data.message, { duration: 2000 });
                     
                   })
                   .catch((error) => {
                     console.log(error);
                     toast.error(error.response.data.message, { duration: 2000 });
                   });
               } else {
                 toast.error("Please login or signup first");
               }
             } catch (error) {
               toast.error("Internla server Error");
             }
         
    }
    const handleOnSumbit = async(e) =>{
         e.preventDefault()
         createPlaylist(e)
    }
  return (
    <div style={{width:"100%",height:"100vh",display:"flex",justifyContent:"center",alignItems:"center",padding:"10px 20px",background:"linear-gradient(to bottom, #838181, transparent)"}}>
           <form onSubmit={handleOnSumbit} style={{width:"100%",maxWidth:"300px",height:"auto"}} action="" method="post">
                 <div style={{color:"white",textAlign:"center",fontSize:"18px",marginBottom:"35px"}}>
                    Give your playlist a name
                 </div>
                 
                 <input defaultValue="My playlist" name='name'  style={{width:"100%",padding:"10px",fontSize:"25px",textAlign:"center",borderTop:"none",borderRight:"none",borderLeft:"none",borderBottom:"2px solid #5c5a5a",backgroundColor:"transparent",outline:"none"}} type="text" />

                 <div style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",marginTop:"30px",gap:"25px"}}>
                      <button type="button" onClick={()=>{navigate("/")}} style={{width:"90px",padding:"14px",color:'white',border:"1px solid gray",borderRadius:"40px",backgroundColor:"transparent"}}>Cancle</button>
                      <input style={{width:"90px",padding:"14px",color:'black',border:"none",borderRadius:"40px",backgroundColor:"#1ed760"}} type="submit" value="Create" />
                 </div>
           </form>
    </div>
  )
}

export default Creat_playlist
