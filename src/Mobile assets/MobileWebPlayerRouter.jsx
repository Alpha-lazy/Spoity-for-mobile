import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Footer from "./Pages/Footer";
import Album from "./Pages/album";
import "./Pages/mobile.css";
import Playlist from "./Pages/Playlist";
import Search from "./Pages/Search";
import MainSearch from "./Pages/Main-search";
import SearchSongs from "./Pages/Search-songs";
import SearchAlbums from "./Pages/Search-albums";
import SearchPlaylists from "./Pages/Search-playlists";
import Login from "./Pages/Login";
import Library from "./Pages/Library";
import Creat_playlist from "./Pages/Creat_playlist";
import Add_songs from "./Pages/Add_songs";
import Add_album_songs from "./Pages/Add_album_songs";

function MobileWebPlayerRouter() {

  const location = useLocation()
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/album/:alumId" element={<Album />} />
        <Route path="/playlist/:playlistId" element={<Playlist />} />

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
        

        {/* authentication */}
        
      </Routes>
      
      {!location.pathname.startsWith("/auth")&& !location.pathname.startsWith("/create")&& <Footer />}
      {/* <Footer /> */}
      <Routes>
        <Route path="/auth/login" element={<Login/>}/>
        <Route path="/create/playlist" element={<Creat_playlist/>}/>
      </Routes> 
      
    </>
    
    
   
  );
}

export default MobileWebPlayerRouter;
