import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { data, useParams } from 'react-router-dom';
import { useData } from '../../Pages/DataContext';
import { toast } from 'react-hot-toast';
import Login from './Login';

function Add_album_songs() {
    const {playlistId, albumId} = useParams();
    const [songs ,setSongs] = useState();
    const {setSongId,songId} = useData() 
    const [isLoading,setIsLoading] = useState(false)
async function fetch_SongData(id) {
    
    setIsLoading(true);
    const responce = await axios.request({
      method: "GET",
      url: `https://jiosavan-api2.vercel.app/api/albums`,
      params: { id: id },
    });
    console.log(responce.data.data);
    
    setSongs(responce.data.data?.songs);
   setIsLoading(false)
    
  }

     const addToPlaylist = async (songId, image) => {
    try {
      await axios({
        method: "post",
        url: `https://authentication-seven-umber.vercel.app/api/playlists/add/songs${playlistId}`,
        data: {
          songs: [songId],
          imageUrl: [image],
        }, // Body
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((responce) => {
        toast.success(responce.data.message, { duration: 2000 });
      });
    } catch (error) {
      console.error("Error adding song to playlist:", error);
    }
  };

 


useEffect(()=>{
fetch_SongData(albumId)
},[])

  return (
    <div style={{width:'100%',height:'100%',backgroundColor:"black",padding:"10px"}}>
        {songs?.map((data) => {

                  return (
                    <div
                      className="albums_row"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "90% 10%",
                        whiteSpace: "nowrap",
                        padding: "10px 7px",
                        borderRadius: "5px",
                        gap: "10px",
                      }}
                    >
                      {/* <div style={{width:"45px",height:"45px",borderRadius:"4px",overflow:"hidden"}}>
                            <img style={{width:"100%",objectFit:"contain"}} src={data?.image[2].url} alt="" />
                          </div> */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "nowrap",
                          gap: "9px",
                          alignItems: "center",
                        }}
                        onClick={() => {
                          setSongId(data.id), retriveSuggestion(data.id);
                        }}
                      >
                        {/* <div style={{width:"45px",height:"45px",borderRadius:"4px",overflow:"hidden"}}> */}
                        <img
                          style={{
                            width: "45px",
                            height: "45px",
                            borderRadius: "3px",
                            objectFit: "contain",
                          }}
                          src={data?.image[2].url}
                          alt=""
                        />
                        {/* </div> */}

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            className={data.id === songId ? "Active-audio" : ""}
                            style={{
                              width: "100%",
                              fontSize: "16px",
                              fontWeight: "400",
                              fontFamily: "Spotify Circular, sans-serif",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {data.name}
                          </div>
                          <div
                            style={{
                              fontSize: "13px",
                              width: "100%",
                              fontWeight: "500",
                              color: "rgb(155, 153, 153)",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {/* {data.artists.primary.map((artist)=>{
                                        return artist.name
                               })} */}
                            {data?.type.charAt(0).toUpperCase() +
                              data?.type.slice(1)}{" "}
                            • {data?.artists.primary[0].name}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={() => {
                          addToPlaylist(data.id, data.image[2].url);
                        }}
                      >
                        <svg
                          data-encore-id="icon"
                          style={{
                            width: "20px",
                            height: "20px",
                            fill: "rgb(203 199 199)",
                          }}
                          role="img"
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          
                        >
                          <path d="M11.999 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-11 9c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11z"></path>
                          <path d="M17.999 12a1 1 0 0 1-1 1h-4v4a1 1 0 1 1-2 0v-4h-4a1 1 0 1 1 0-2h4V7a1 1 0 1 1 2 0v4h4a1 1 0 0 1 1 1z"></path>
                        </svg>
                      </div>
                    </div>
                  );
                
              })}

              
    </div>
  )
}

export default Add_album_songs
