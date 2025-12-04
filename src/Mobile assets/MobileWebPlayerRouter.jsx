import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Footer from "./Pages/Footer.jsx";
import Album from "./Pages/Album.jsx";
import "./Pages/mobile.css";
import Playlist from "./Pages/Playlist.jsx";
import Search from "./Pages/Search.jsx";
import MainSearch from "./Pages/Main-search.jsx";
import SearchSongs from "./Pages/Search-songs.jsx";
import SearchAlbums from "./Pages/Search-albums.jsx";
import SearchPlaylists from "./Pages/Search-playlists.jsx";
import Login from "./Pages/Login.jsx";
import Library from "./Pages/Library.jsx";
import Creat_playlist from "./Pages/Creat_playlist.jsx";
import Add_songs from "./Pages/Add_songs.jsx";
import Add_album_songs from "./Pages/Add_album_songs.jsx";
import Edit_playlist from "./Pages/Edit_playlist.jsx";
import Generate_playlist from "./Pages/Generate_playlist.jsx";
import Artist from "./Pages/Artist.jsx";
import Signup from "./Pages/Signup.jsx";

function MobileWebPlayerRouter() {

  const location = useLocation()
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/album/:alumId" element={<Album />} />
        <Route path="/playlist/:playlistId" element={<Playlist />} />
        <Route path="/artist/:artistId" element={<Artist/>} />

        {/* search */}
        <Route path="/search" element={<Search />} />
        <Route path="/search/result/:SearchValue" element={<MainSearch />} />
        <Route path="/search/songs/:SearchValue" element={<SearchSongs />} />
        <Route path="/search/albums/:SearchValue" element={<SearchAlbums />} />
        <Route
          path="/search/playlists/:SearchValue"
          element={<SearchPlaylists />}
        />

      {/* add songs to private playlist */}

        <Route path="/add/songs/:playlistId" element={<Add_songs/>} />
        <Route path="add/songs/:playlistId/:albumId" element={<Add_album_songs/>}/>
        {/* user library */}
        <Route path="/library" element={<Library/>}/>
        

      {/* edit private playlist */}
        
        <Route path="/edit/playlist/:playlistId" element={<Edit_playlist/>}/>


      {/* authentication */}
        
      </Routes>
      
      {!location.pathname.startsWith("/auth")&& !location.pathname.startsWith("/create")&& !location.pathname.startsWith("/edit")&& <Footer />}
      {/* <Footer /> */}
      <Routes>
        <Route path="/auth/login" element={<Login/>}/>
        <Route path="/auth/signup" element={<Signup/>}/>
        <Route path="/create/playlist" element={<Creat_playlist/>}/>
        <Route path="/edit/playlist" element={<Edit_playlist/>}/>
        <Route path="/generate/playlist" element={<Generate_playlist/>}/>
      </Routes> 
      
    </>
    
    
   
  );
}

export default MobileWebPlayerRouter;
