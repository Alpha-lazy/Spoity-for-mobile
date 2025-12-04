import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useData } from "../../Pages/DataContext";
import {jwtDecode} from "jwt-decode";
import Userimage from "../../Images/user.png"

function Home() {
  const [PopularAlbums, setPopularAlbums] = useState();
  const [NewRelease, setNewRelease] = useState();
  const [PartySong, setPartySong] = useState();
  const [SadSong, setSadSong] = useState();
  const [HappySong, setHappySong] = useState();
  const [Artist, setArtist] = useState();
  const navigate = useNavigate();
  const [songForYou , setSongForYou] = useState()
  const { songId } = useData();



    // retrive suggestion
  async function retriveSuggestion(id) {
    let responce = await axios.request({
      method: "GET",
      url: `https://jiosavan-api2.vercel.app/api/songs/${id}/suggestions`,
      params: {
        limit: 100,
      },
    });

    setSongForYou(responce.data.data);
  }

  // fetch popular albums
  async function Fetch_Popular_Albums() {
    try {
      const responce = await axios.request({
        method: "GET",
        url: "https://jiosavan-api2.vercel.app/api/playlists",
        params: { id: "47599074" },
      });
      setPopularAlbums(responce.data.data.songs);
    } catch (error) {}
  }

  // fetc new release song
  async function Fetch_New_Releases() {
    try {
      const responce = await axios.request({
        method: "GET",
        url: "https://jiosavan-api2.vercel.app/api/playlists",
        params: { id: "6689255" },
      });
      setNewRelease(responce.data.data.songs);
    } catch (error) {}
  }

  // fetch party song
  async function Fetch_Party_Playlist() {
    try {
      const responce = await axios.request({
        method: "GET",
        url: "https://jiosavan-api2.vercel.app/api/search/playlists",
        params: { query: "party playlist" },
      });
      setPartySong(responce.data.data.results);
    } catch (error) {}
  }

  // fetch sad playlist
  async function Fetch_Sad_Playlist() {
    try {
      const responce = await axios.request({
        method: "GET",
        url: "https://jiosavan-api2.vercel.app/api/search/playlists",
        params: { query: "sad playlist" },
      });
      setSadSong(responce.data.data.results);
    } catch (error) {}
  }

  // fetch Happy playlist
  async function Fetch_Happy_Playlist() {
    try {
      const responce = await axios.request({
        method: "GET",
        url: "https://jiosavan-api2.vercel.app/api/search/playlists",
        params: { query: "Happy playlist" },
      });
      setHappySong(responce.data.data.results);
    } catch (error) {}
  }

  // fetch artist
  async function Fetch_Artist() {
    try {
      const responce = await axios.request({
        method: "GET",
        url: "https://jiosavan-api2.vercel.app/api/search/artists",
        params: { query: "top artist" },
      });
      setArtist(responce.data.data.results);
    } catch (error) {}
  }

  useEffect(() => {
    Fetch_Popular_Albums();
    Fetch_New_Releases();
    Fetch_Party_Playlist();
    Fetch_Sad_Playlist();
    Fetch_Happy_Playlist();
    Fetch_Artist();

    if (localStorage.getItem("Current Song") !== undefined) {
         retriveSuggestion(localStorage.getItem("Current Song"))
    }
    document.documentElement.scrollTop = 0;
  }, []);


  
  return (
    <div
      style={{
        height: "auto",
        width: "100vw",
        backgroundColor: "#121212",
        display: "flex",
        flexDirection: "column",
      }}
      id="main-container"
    >
      {/* header */}
      <header
        style={{
          height: "30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "35px 10px",
          position:"fixed",
          top:"0px",
          backgroundColor:"#121212cf",
          backdropFilter: "blur(2px)",
          width: "100%"
        }}
      >
        <div style={{ fontSize: "22px", fontWeight: "700" }}>Good morning</div>
        <div style={{display:"flex",alignItems:"center",gap:'20px'}}>
          {
          localStorage.getItem("token") ?
            <div style={{width:"35px",height:"35px",color:"black",backgroundColor:"#6b6a68",borderRadius:"50%",display:"flex",justifyContent:"center",alignItems:"center"}} onClick={()=>{navigate("/profile")}}>
               <img style={{width:"20px",height:"20px"}} src={Userimage} alt="" />
          </div>
          :""
          }
          <svg
            onClick={() => {
              document.getElementById("side-bar").style.right = "0%";
              document.getElementById("side-bar").style.opacity = "1";
              document.getElementById("side-bar").style.width = "100vw";
              document.getElementById("main-container").style.overflow = "hidden";
              document.getElementById("main-container").style.height = "100vw";
            }}
            data-encore-id="icon"
            role="img"
            aria-hidden="true"
            style={{ width: "25px", height: "25px", fill: "#fff" }}
            viewBox="0 0 24 24"
          >
            <path d="m23.2 11.362-1.628-.605a.924.924 0 0 1-.52-.7.88.88 0 0 1 .18-.805l1.2-1.25a1 1 0 0 0 .172-1.145 12.075 12.075 0 0 0-3.084-3.865 1 1 0 0 0-1.154-.086l-1.35.814a.982.982 0 0 1-.931-.02 1.01 1.01 0 0 1-.59-.713l-.206-1.574a1 1 0 0 0-.787-.848 12.15 12.15 0 0 0-4.945 0 1 1 0 0 0-.785.848l-.2 1.524a1.054 1.054 0 0 1-.62.747 1.024 1.024 0 0 1-.968.02l-1.318-.795a1 1 0 0 0-1.152.086 12.118 12.118 0 0 0-3.085 3.867 1 1 0 0 0 .174 1.143l1.174 1.218a.91.91 0 0 1 .182.828.949.949 0 0 1-.532.714l-1.618.6a1 1 0 0 0-.653.955 12.133 12.133 0 0 0 1.1 4.822 1 1 0 0 0 1 .578l1.935-.183a.83.83 0 0 1 .654.327.794.794 0 0 1 .188.726l-.6 1.822a1 1 0 0 0 .34 1.106c.66.504 1.369.94 2.117 1.3.748.36 1.532.642 2.338.841a.988.988 0 0 0 .715-.09 1 1 0 0 0 .362-.332l1.136-1.736a.81.81 0 0 1 1.16.022l1.124 1.714a1 1 0 0 0 1.077.422c1.617-.4 3.133-1.13 4.454-2.145a1 1 0 0 0 .341-1.106l-.613-1.859a.771.771 0 0 1 .18-.7.78.78 0 0 1 .635-.317l1.945.183a.994.994 0 0 0 1-.578 12.133 12.133 0 0 0 1.1-4.822 1 1 0 0 0-.643-.953zm-1.6 2.977c-.103.448-.237.888-.4 1.318l-1.213-.115a2.851 2.851 0 0 0-2.9 3.637l.383 1.16a10.09 10.09 0 0 1-2.473 1.191l-.72-1.1a2.691 2.691 0 0 0-2.275-1.18 2.637 2.637 0 0 0-2.232 1.16l-.735 1.12a10.117 10.117 0 0 1-2.471-1.19l.37-1.125a2.879 2.879 0 0 0-2.93-3.669l-1.2.113a10.46 10.46 0 0 1-.4-1.317 10.09 10.09 0 0 1-.214-1.358l.93-.345a3.032 3.032 0 0 0 1.095-4.8L3.55 7.15a10.158 10.158 0 0 1 1.71-2.146l.688.415a3 3 0 0 0 2.875.066 3.022 3.022 0 0 0 1.726-2.283l.105-.8a10.174 10.174 0 0 1 2.745 0l.11.844a3.099 3.099 0 0 0 4.542 2.184l.721-.435a10.22 10.22 0 0 1 1.712 2.146l-.694.72a3.005 3.005 0 0 0 1.084 4.768l.942.35c-.042.457-.113.912-.215 1.36H21.6zM12 7.001a5 5 0 1 0 5 5 5.006 5.006 0 0 0-4.993-5H12zm0 8a3 3 0 1 1 .007 0H12z"></path>
          </svg>
        </div>
      </header>
       

       {/* Songs for you */}

    {
      songForYou !==undefined?
      <div style={{ marginTop: "100px", height: "330px" }}>
        <header
          style={{
            color: "white",
            fontWeight: "700",
            fontSize: "20px",
            padding: "0px 15px",
            display: "flex",
            alignItems: "center",
            height: "10px",
          }}
        >
          Songs for you
        </header>
        <div
          id="popular-albums"
          style={{
            display: "inline-flex",
            flexWrap: "nowrap",
            flexFlow: "column wrap",
            overflowX: "scroll",
            height: "300px",
            marginTop: "20px",
          }}
        >
          {songForYou?.map((data) => {
            return (
              <div
                className="popular_album_card"
                onClick={() => {
                  navigate(`/album/${data.album.id}`);
                }}
                style={{
                  width: "185px",
                  height: "240px",
                  objectFit: "contain",
                  padding: "10px",
                  borderRadius: "7px",
                }}
              >
                <img
                  width="100%"
                  height="165px"
                  style={{ borderRadius: "5px" }}
                  src={data.image[2].url}
                  alt=""
                />
                <div className="name">
                  <div>{data.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      :""
      }
   

      {/* Popular albums and singles */}

      <div style={songForYou!==undefined?{ marginTop: "0px", height: "330px" }:{marginTop: "100px", height: "330px" }}>
        <header
          style={{
            color: "white",
            fontWeight: "700",
            fontSize: "20px",
            padding: "0px 15px",
            display: "flex",
            alignItems: "center",
            height: "10px",
          }}
        >
          Popular albums and singles
        </header>
        <div
          id="popular-albums"
          style={{
            display: "inline-flex",
            flexWrap: "nowrap",
            flexFlow: "column wrap",
            overflowX: "scroll",
            height: "300px",
            marginTop: "20px",
          }}
        >
          {PopularAlbums?.map((data) => {
            return (
              <div
                className="popular_album_card"
                onClick={() => {
                  navigate(`/album/${data.album.id}`);
                }}
                style={{
                  width: "185px",
                  height: "240px",
                  objectFit: "contain",
                  padding: "10px",
                  borderRadius: "7px",
                }}
              >
                <img
                  width="100%"
                  height="165px"
                  style={{ borderRadius: "5px" }}
                  src={data.image[2].url}
                  alt=""
                />
                <div className="name">
                  <div>{data.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New releases */}
      <div>
        <header
          style={{
            color: "white",
            fontWeight: "700",
            fontSize: "20px",
            padding: "0px 15px",
            display: "flex",
            alignItems: "center",
            height: "10px",
          }}
        >
          New releases
        </header>
        <div
          id="popular-albums"
          style={{
            display: "inline-flex",
            flexWrap: "nowrap",
            flexFlow: "column wrap",
            overflowX: "scroll",
            height: "300px",
            marginTop: "20px",
          }}
        >
          {NewRelease?.map((data) => {
            return (
              <div
                className="popular_album_card"
                onClick={() => {
                  navigate(`/album/${data.album.id}`);
                }}
                style={{
                  width: "185px",
                  height: "240px",
                  objectFit: "contain",
                  padding: "10px",
                  borderRadius: "7px",
                }}
              >
                <img
                  width="100%"
                  height="165px"
                  style={{ borderRadius: "5px" }}
                  src={data.image[2].url}
                  alt=""
                />
                <div className="name">
                  <div>{data.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Party  playlist*/}
      <div>
        <header
          style={{
            color: "white",
            fontWeight: "700",
            fontSize: "20px",
            padding: "0px 15px",
            display: "flex",
            alignItems: "center",
            height: "10px",
          }}
        >
          Party
        </header>
        <div
          id="popular-albums"
          style={{
            display: "inline-flex",
            flexWrap: "nowrap",
            flexFlow: "column wrap",
            overflowX: "scroll",
            height: "300px",
            marginTop: "20px",
          }}
        >
          {PartySong?.map((data) => {
            return (
              <div
                onClick={() => {
                  navigate(`/playlist/${data.id}`);
                }}
                className="popular_album_card"
                style={{
                  width: "185px",
                  height: "240px",
                  objectFit: "contain",
                  padding: "10px",
                  borderRadius: "7px",
                }}
              >
                <img
                  width="100%"
                  height="165px"
                  style={{ borderRadius: "5px" }}
                  src={data.image[2].url}
                  alt=""
                />
                <div className="name">
                  <div>{data.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sad playlist */}
      <div>
        <header
          style={{
            color: "white",
            fontWeight: "700",
            fontSize: "20px",
            padding: "0px 15px",
            display: "flex",
            alignItems: "center",
            height: "10px",
          }}
        >
          Sad songs
        </header>
        <div
          id="popular-albums"
          style={{
            display: "inline-flex",
            flexWrap: "nowrap",
            flexFlow: "column wrap",
            overflowX: "scroll",
            height: "300px",
            marginTop: "20px",
          }}
        >
          {SadSong?.map((data) => {
            return (
              <div
                className="popular_album_card"
                onClick={() => {
                  navigate(`/playlist/${data.id}`);
                }}
                style={{
                  width: "185px",
                  height: "240px",
                  objectFit: "contain",
                  padding: "10px",
                  borderRadius: "7px",
                }}
              >
                <img
                  width="100%"
                  height="165px"
                  style={{ borderRadius: "5px" }}
                  src={data.image[2].url}
                  alt=""
                />
                <div className="name">
                  <div>{data.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Happy playlist */}
      <div>
        <header
          style={{
            color: "white",
            fontWeight: "700",
            fontSize: "20px",
            padding: "0px 15px",
            display: "flex",
            alignItems: "center",
            height: "10px",
          }}
        >
          Happy
        </header>
        <div
          id="popular-albums"
          style={{
            display: "inline-flex",
            flexWrap: "nowrap",
            flexFlow: "column wrap",
            overflowX: "scroll",
            height: "300px",
            marginTop: "20px",
          }}
        >
          {HappySong?.map((data) => {
            return (
              <div
                className="popular_album_card"
                onClick={() => {
                  navigate(`/playlist/${data.id}`);
                }}
                style={{
                  width: "185px",
                  height: "240px",
                  objectFit: "contain",
                  padding: "10px",
                  borderRadius: "7px",
                }}
              >
                <img
                  width="100%"
                  height="165px"
                  style={{ borderRadius: "5px" }}
                  src={data.image[2].url}
                  alt=""
                />
                <div className="name">
                  <div>{data.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Artists suggested for you */}
      <div>
        <header
          style={{
            color: "white",
            fontWeight: "700",
            fontSize: "20px",
            padding: "0px 15px",
            display: "flex",
            alignItems: "center",
            height: "10px",
          }}
        >
          Artists suggested for you
        </header>
        <div
          id="popular-albums"
          style={{
            display: "inline-flex",
            flexWrap: "nowrap",
            flexFlow: "column wrap",
            overflowX: "scroll",
            height: "300px",
            marginTop: "20px",
          }}
        >
          {Artist?.map((data) => {
            return (
              <div
                className="popular_album_card"
                onClick={()=>{navigate(`/artist/${data.id}`)}}
                style={{
                  width: "160px",
                  height: "240px",
                  objectFit: "contain",
                  padding: "10px",
                  borderRadius: "7px",
                }}
              >
                <img
                  width="100%"
                  height="140px"
                  style={{ borderRadius: "50%" }}
                  src={data.image[2].url}
                  alt=""
                />
                <div className="name">
                  <div>{data.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer style={{ width: "100vw", height: "40px" }}></footer>

        <div id="side-bar"
        style={{
          width: "0",
          height: "100vh",
          backgroundColor: "black",
          position: "absolute",
          top: "0px",
          right: "-10%",
          opacity: "0",
          overflow: "hidden",
        }}
      >
        <header
          style={{
            float: "right",
            display: "flex",
            justifyContent:"right",
            alignItems: "center",
            height: "50px",
            width: "100%",
            padding: "25px 10px",
          }}
        >
          <svg
            data-encore-id="icon"
            onClick={() => {
              document.getElementById("side-bar").style.right = "-10%";
              document.getElementById("side-bar").style.width = "0";
              document.getElementById("side-bar").style.opacity = "0";
                document.getElementById("main-container").style.overflow = "scroll";
              document.getElementById("main-container").style.height = "auto";
            }}
            role="img"
            aria-hidden="true"
            style={{ width: "20px", height: "20px", fill: "white" }}
            viewBox="0 0 24 24"
          >
            <path d="M3.293 3.293a1 1 0 0 1 1.414 0L12 10.586l7.293-7.293a1 1 0 1 1 1.414 1.414L13.414 12l7.293 7.293a1 1 0 0 1-1.414 1.414L12 13.414l-7.293 7.293a1 1 0 0 1-1.414-1.414L10.586 12 3.293 4.707a1 1 0 0 1 0-1.414z"></path>
          </svg>
        </header>
  <div style={{display:"flex",justifyContent:'center',width:"100%",height:"100%"}}>

        <div style={{width:"100%",maxWidth:"800px",height:"auto",display:"flex",flexDirection:"column",alignItems:"center",padding:"15px 15px",gap:"15px"}}>
          {
            
            !localStorage.getItem("token") ?
            <>
             <a style={{width:"100%",height:"50px",backgroundColor:"transparent",border:"1px solid white",borderRadius:"50px",display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none",color:"white"}} href={"/auth/login"}>Login</a>
             <a style={{width:"100%",height:"50px",backgroundColor:"white",border:"1px solid white",borderRadius:"50px",display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none",color:"Black"}} href={"/auth/signup"}>Sign Up</a>
            </>
             :
        
           <div onClick={()=>{localStorage.removeItem("token"),navigate("/")}} style={{width:"100%",height:"50px",backgroundColor:"transparent",border:"1px solid white",borderRadius:"50px",display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none",color:"white"}}>Log out</div>
  
          }
             </div>

            
  </div>
      </div> 
    </div>
  );
}

export default Home;
