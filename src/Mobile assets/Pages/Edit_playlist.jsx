import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

function Edit_playlist() {
  const {playlistId} = useParams()
  const fileInputref = useRef(null)
  const [base64,setBase64] = useState("")
  const navigate = useNavigate()
  const [newdata,setNewData] = useState({
     name:"",
     desc:"",
     imageUrl:""
     
     
  })
  // feth playlist old data form data base

  const fetchPlaylistData = async() =>{
        try {

          await axios.request({
            method:"GET",
            url: `https://authentication-seven-umber.vercel.app/api/playlist${playlistId}`,
            headers:{
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }

          })
          .then((responce)=>
            {
                // setOldPlaylist(responce.data.playlist[0]);
                setNewData({
                  name:responce.data.playlist[0].name,
                  desc:responce.data.playlist[0].desc,
                  imageUrl:responce.data.playlist[0].imageUrl
                })
              

            }
        )
          
        } catch (error) {
          
        }
  }

  //  update the playlist data
  const updatePlaylistData = async() =>{

    try {
      console.log(newdata);
      
      await axios.request({
        method:"POST",
        url: `https://authentication-seven-umber.vercel.app/api/playlists/update/playlist${playlistId}`,
        headers:{
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${localStorage.getItem('token')}`          
            }, 
          data:newdata

        }).then(()=>{
          toast.success("Playlist updated")
          navigate(`/playlist/${playlistId}`)
          
        })
        .catch((err)=>{
          toast.error("Error in updating playlist")
        })
    } catch (error) {
      console.log(error+ "error in update playlist");
      
    }

  }

  // handle the change from input
  const handleOnChange = (e) =>{  

    let name  = e.target.name
    let value  = e.target.value

    setNewData({...newdata,[name]:value})
    
    
  }

  // handle the uploaded file like image cover for playlist

  const handleFileChnage = (e) =>{
         const file  = e.target.files?.[0]
          // console.log(file);
         if (file) {
            const reader  = new FileReader()
            reader.onloadend = ()=>{

              newdata.imageUrl = [reader.result]
              document.getElementById('playlistImg').src = reader.result
            }
           
           
            
            reader.readAsDataURL(file)

      
            
          }
          
          
         
          
         
         
      
  }


  
  


  useEffect(()=>{
      fetchPlaylistData()
  
      
  },[])

  return (
    <div style={{
        padding:"0px",
        background:"rgb(15 15 15)",
        width:"100%",
        height:"100vh",
        overflow:"hidden"
    }}>
         <header style={{
            position:"sticky",
            top:"0",
            width:"100%",
            padding:"10px 0px",
            height:"60px",
            display:"flex",
            alignItems:"center",
            justifyContent:"center"
         }}>
             Edit playlist
         </header>

         <div
         style={
            {
                display:"flex",
                flexDirection:"column",
                justifyContent:"start",
                alignItems:"center",
                gap:"15px",
                width:"100%",
                height:"100%"
            }
         } 
         >
          

          
           <div
           style={{
           width:"200px",
           height:"200px",
           maxWidth:"200px",
           maxHeight:"200px",
           objectFit:"contain",
            backgroundColor:"rgb(22 22 22)",
            borderRadius:"5px",
            display:"flex",
            alignItems:"center",
            justifyContent:"center"

           }}
           onClick={()=>{fileInputref.current.click();}}
           >
              
              <input type="file" accept='image/*'  ref={fileInputref} onChange={handleFileChnage} style={{display:"none"}} />
              <img id='playlistImg' src={newdata.imageUrl[0]} alt="playlist cover" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"5px",cursor:"pointer"}} />'
           
           </div>

           <span style={{fontSize:"14px"}}>Change playlist cover</span>

           <div style={{width:'100%',display:"flex",justifyContent:"center",flexWrap:"wrap",padding:"10px"}}>
             <input  name='name' value={newdata.name} onChange={handleOnChange} style={{width:"280px",minWidth:"100px",padding:"0px 10px",fontSize:"25px",textAlign:"center",borderTop:"none",borderRight:"none",borderLeft:"none",borderBottom:"2px solid #5c5a5a",backgroundColor:"transparent",outline:"none"}} type="text" />
           </div>

           <div id = "desc" style={{width:'100%',display:"none",justifyContent:"center",flexWrap:"wrap",padding:"10px"}}>
            <input  name='desc' value={newdata.desc} onChange={handleOnChange} style={{width:"280px",minWidth:"100px",fontWeight:"normal",color:"#bebbbbff",padding:"0px 10px",fontSize:"18px",textAlign:"center",borderTop:"none",borderRight:"none",borderLeft:"none",borderBottom:"1px solid #5c5a5a",backgroundColor:"transparent",outline:"none"}} type="text" />
           </div>

           <button id='descBtn' onClick={()=>{document.getElementById("desc").style.display="flex",document.getElementById("descBtn").style.display = "none"}} style={{width:"auto",height:"40px",padding:"15px",fontSize:"13px",border:"1px solid gray",backgroundColor:"transparent",borderRadius:"40px",color:"white",cursor:"pointer",marginTop:"20px",display:"flex",justifyContent:"center",alignItems:"center"}}>
               Add description
           </button>

           <button onClick={updatePlaylistData} style={{width:"70%",display:"flex",justifyContent:"center",alignItems:"center",padding:"20px 50px",height:"30px",backgroundColor:"#1ED760",color:"black",fontWeight:"bold",fontSize:"15px",borderRadius:"50px",border:"none"}}>
            Save

           </button>
         </div>
    </div>
  )
}

export default Edit_playlist
