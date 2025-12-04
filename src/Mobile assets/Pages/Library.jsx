import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import aiIcon from "../../Images/ai_icon.png"
import likedSongs from '../../Images/likedsongs.jpg'

function Library() {
    const [fevPlaylist,setFevPlaylist] = useState();
    const [createdPlaylist,setCreatedPlaylist] = useState();
    const [isLoading ,setIsLoading] = useState(true);
    const navigat = useNavigate()

    // get all feverate playlist
     const getFevoritePlaylist = async () => {
      try {
       setIsLoading(true)
        if (localStorage.getItem("token")) {
          const responce = await axios.request({
            method: "GET",
            url: "https://authentication-seven-umber.vercel.app/api/playlists/favorites",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((responce)=>{
               setFevPlaylist(responce.data);
               setIsLoading(false)
           
               
          })
          .catch((error)=>{
            console.log("error while fetching fevorite playlist");
            console.log(error);
            
          })
          
        } else {
          // toast.error("Please login or signup first");
          navigat("/auth/login")
        }
      } catch (error) {
        console.log(error);
      }
    };

//  fetch all private playlist

const fetchPrivatePlaylist = async() =>{
    try {
      if (localStorage.getItem("token")) {
        const responce = await axios({
          method: "get",
          url: "https://authentication-seven-umber.vercel.app/api/all/playlist",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        let data = await responce.data.playlist.reverse();
          setCreatedPlaylist(data);
          
        
      }
    } catch (error) {
      toast.error("Internla server Error");
    }
}
    useEffect(()=>{
        getFevoritePlaylist()
        fetchPrivatePlaylist()
    },[])

    console.log(fevPlaylist);
    
  return (
    <>
    {!isLoading?
      <>
      <div style={{width:"100%",height:"100vh",backgroundColor:"#121212"}}>
        <header style={{width:"100%",height:"130px",backgroundColor:"#121212",boxShadow:"0px 0px 35px black",padding:"20px 20px",display:"grid",gridTemplateRows:"1fr 1fr",gap:"20px"}}>
              <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",gap:"10px",justifyContent:"space-between"}}>
              <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",gap:"10px"}}>
                <div style={{width:"35px",height:"35px",borderRadius:"50%",backgroundColor:"orange",display:"flex",justifyContent:"center",alignItems:"center",color:"black",fontSize:"17px"}}>
                    A
                </div>
                <div style={{fontSize:"25px",fontWeight:"bold",color:"#fff"}}>
                  Your Library
                </div>
              </div>

              <div style={{display:"flex",gap:"5px"}}>
                  <svg onClick={()=>{navigat("/create/playlist")}} style={{width:"22px",height:"22px",fill:"#fff"}} data-encore-id="icon" role="img" aria-hidden="true"  viewBox="0 0 16 16" width="16px" height="16px"><path d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75z"></path></svg> 
              </div>
              </div>
              <div style={{width:"100%",height:"100%",alignItems:"center",display:"flex",gap:"15px"}}>
                 <button style={{display:'flex',justifyContent:"center",alignItems:"center",border:"none",width:"100px",height:"40px",borderRadius:"30px",backgroundColor:"#1f1f1f",fontSize:"14px"}}>
                      Playlist
                 </button>

                 <button onClick={()=>{navigat("/generate/playlist")}} style={{display:'flex',justifyContent:"center",alignItems:"center",gap:"10px",border:"none",width:"auto",height:"35px",borderRadius:"30px",backgroundColor:"#ffffffff",color:"black",fontSize:"14px", padding:"0px 10px"}}>
                      Generate <img src={aiIcon} style={{width:"15px",height:"15px"}} alt="" srcset="" />
                 </button>

              </div>
        </header>
        <div style={{padding:"30px 20px",width:"100%",display:"flex",flexDirection:"column",gap:"15px",backgroundColor:"#121212"}}>
              {
                fevPlaylist?.map((data)=>{
                    return <div style={{display:"flex",gap:"15px",width:"100%",alignItems:"center",overflow:"hidden"}} onClick={()=>{data.type === "playlist"?navigat(`/playlist/${data.id}`):navigat(`/album/${data.id}`)}}>
                           <div style={{width:"65px",height:"65px"}}>
                              <img style={{width:"65px",height:"65px",borderRadius:"2px"}} src={data.imageUrl} alt="" />
                           </div>
                           <div style={{color:"white",fontSize:"16px",fontWeight:"bold",display:"flex",flexDirection:"column",textWrap:"nowrap",whiteSpace:"break-spaces",textOverflow:"ellipsis",width:"90%"}}>
                            {data.name}
                            <div style={{color:"rgb(150 148 148 / 97%)",fontSize:"13px",fontFamily:"sans-serif"}}>
                                {data?.type?.charAt(0).toUpperCase() + data?.type?.slice(1)}
                            </div>
                           </div>
                    </div>

                })
              }
              {
                createdPlaylist?.map((data)=>{
                    return <div style={{display:"flex",gap:"15px",width:"100%",alignItems:"center",overflow:"hidden"}} onClick={()=>{navigat(`/playlist/${data.playlistId}`)}}>
                             {

                              localStorage.getItem("FavoriteId") === data.playlistId ?
                               <div style={{width:"65px",height:"65px"}}>
                            <img style={{width:"65px",height:"65px",borderRadius:"2px"}} src={likedSongs} alt="" />
                            </div>
                             
                              :(
                              data.imageUrl.length !==0?
                              data.imageUrl.length >3?
                           <div style={{width:"77px",height:"65px",display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"1f 1f",gap:"0px"}}>
                          
                               
                                       <img style={{width:"100%",height:"100%"}} src={data?.imageUrl[0]} alt="" />
                                         <img style={{width:"100%",height:"100%"}} src={data?.imageUrl[1]} alt="" />
                                        <img style={{width:"100%",height:"100%"}} src={data?.imageUrl[2]} alt="" />
                                        <img style={{width:"100%",height:"100%"}} src={data?.imageUrl[3]} alt="" />
                                      
                                  
                                 
                                    
                                    
                                     
                             
                           </div>
                           :
                           <div style={{width:"65px",height:"65px"}}>
                            <img style={{width:"65px",height:"65px",borderRadius:"2px"}} src={data?.imageUrl[0]} alt="" />
                            </div>
                            :
                            <div style={{width:"78px",height:"65px",backgroundColor:"#1f1f1f",display:"flex",justifyContent:"center",alignItems:"center"}}>
                                <svg data-encore-id="icon" role="img" aria-hidden="true" data-testid="playlist" viewBox="0 0 24 24" style={{width: "50%",fill:"rgb(127, 127, 127)"}}><path d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6V3zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5v-1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5v-1.5z"></path></svg>
                            </div>
                              )
                            }
                           <div style={{color:"white",fontSize:"16px",fontWeight:"bold",display:"flex",flexDirection:"column",textWrap:"nowrap",whiteSpace:"break-spaces",textOverflow:"ellipsis",width:"90%"}}>
                            {data.name}
                            {/* <div style={{color:"rgb(150 148 148 / 97%)",fontSize:"13px",fontFamily:"sans-serif"}}>
                                {data?.type.charAt(0).toUpperCase() + data.type.slice(1)}
                            </div> */}
                           </div>
                    </div>

                })
              }
              <div style={{display:"flex",gap:"15px",width:"90%",alignItems:"center",overflow:"hidden",height:"70px"}} onClick={()=>{navigat("/add/artists")}}>
                           <div  style={{width:"60px",height:"60px",borderRadius:"50%",display:"flex",justifyContent:"center",alignItems:"center",backgroundColor:"#1f1f1f"}}>
                             <svg style={{width:"22px",height:"22px",fill:"gray"}} data-encore-id="icon" role="img" aria-hidden="true"  viewBox="0 0 16 16" width="16px" height="16px"><path d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75z"></path></svg>
                           </div>
                           <div style={{color:"white",fontSize:"16px",display:"flex",flexDirection:"column",textWrap:"nowrap",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>
                            Add artists
                           
                           </div>
               </div>
               
        </div>

        <footer style={{height:"200px",backgroundColor:"#121212"}}>

        </footer>
    </div>
    </>
    :
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%",height:"100vh",backgroundColor:"#121212"}}>
        <div className="loader">
            <div className="loader1"></div>
          </div>
    </div>
  }
  
  </>
  )
}

export default Library
