import axios from "axios";
import debounce from "lodash.debounce";
import React, { useEffect, useRef, useState } from "react";
import { useData } from "../../Pages/DataContext";
import { NavLink, useNavigate, useParams } from "react-router-dom";

function SearchSongs() {
  const inputRef = useRef(undefined);
  const { SearchValue } = useParams();
  const { songId, setSongId, setSong } = useData();
  const naviagte = useNavigate();
  const [serchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [albumId, setAlbumId] = useState("");

  useEffect(() => {
    inputRef?.current?.focus();
    if (SearchValue === " ") {
      inputRef.current.value = "";
    } else {
      inputRef.current.value = SearchValue;
    }
  }, []);

  async function retriveSuggestion(id) {
    let responce = await axios.request({
      method: "GET",
      url: `https://jiosavan-api2.vercel.app/api/songs/${id}/suggestions`,
      params: {
        limit: 100,
      },
    });

    setSong(responce.data.data);
  }

  async function searchSongs(value) {
    try {
      setIsLoading(true);

      if (value.trim() !== "") {
        const responce = await axios.request({
          method: "GET",
          url: `https://jiosavan-api2.vercel.app/api/search`,
          params: { query: value },
        });
        setSearchResult(responce.data.data);
        // if (responce.data.data?.topQuery[0]?.id === responce.data.data?.songs[0]?.id) {
        //   setSearchResult({...serchResult,songs:responce.data.data?.songs.filter(song=>{song.id !== responce.data.data?.topQuery[0]?.id})})
        // }
        // setSearchResult(responce.data.data =>{serchResult.song.filter((song=>{song.id !== serchResult.topQuery[0].id}))})
        setIsLoading(false);
        console.log(responce.data.data);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error for fetching search data", error);
      e.target.value.toUpperCase();
      // setIsLoading(false)
    }
  }

  useEffect(() => {
    searchSongs(SearchValue);
  }, [SearchValue]);

  function HandleOnChnage(e) {
    if (e.target.value === "") {
      naviagte(`/search/result/%20`);
    } else {
      naviagte(`/search/result/${e.target.value}`);
    }
  }

  async function showmoreInfo(id,url,title,primaryArtists,type) {
      const songImg = document.getElementById("song-img");
      const songTitle = document.getElementById("song-title");
      const songArtist = document.getElementById("song-artist");
      const songInfo = document.getElementById("songInfo");
      const ViewAlbum = document.getElementById("View-album");
      setAlbumId("")
      if (type ==="song") {
   let responce = await axios.request({method:"GET",url:`https://jiosavan-api2.vercel.app/api/songs/${id}`});
   console.log(responce.data.data);
   
    setAlbumId(responce.data.data[0]?.album?.id)
    ViewAlbum.style.display = "flex";
  }
  else{
    ViewAlbum.style.display = "none";
  }
   
  
          songImg.src = url;
          songTitle.textContent = title;
          songArtist.textContent = primaryArtists;
     
          
       
      
      
      if(songInfo.style.display = "none"){
         songInfo.style.display = "grid"
      }
      else{
        songInfo.style.display = "none"
      }
    }

  
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "auto",
          display: "flex",
          flexDirection: "column",
          padding: "0px",
          boxSizing: "border-box",
          backgroundColor: "#000000",
        }}
      >
        <div
          style={{
            backgroundColor: "#0d0c0c",
            height: "100%",
            width: "100%",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            gap: "15px",
            flexDirection: "column",
          }}
        >
          <input
            ref={inputRef}
            onChange={(e) => {
              HandleOnChnage(e);
            }}
            id="searchInput"
            name="input"
            className="search-input"
            placeholder="What do you want to listen to?"
            type="text"
          />

          <div style={{ width: "100%", display: "flex", gap: "5px" }}>
            <NavLink
              to={`/search/result/${SearchValue}`}
              className={({ isActive }) => {
                return isActive ? "active-btn" : "search-btn";
              }}
            >
              All
            </NavLink>

            <NavLink
              className={({ isActive }) => {
                return isActive ? "active-btn" : "search-btn";
              }}
              to={`/search/songs/${SearchValue}`}
            >
              Songs
            </NavLink>

            <NavLink
              className={({ isActive }) => {
                return isActive ? "active-btn" : "search-btn";
              }}
              to={`/search/albums/${SearchValue}`}
            >
              Albums
            </NavLink>

            <NavLink
              className={({ isActive }) => {
                return isActive ? "active-btn" : "search-btn";
              }}
              to={`/search/playlists/${SearchValue}`}
            >
              Playlist
            </NavLink>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          {!isLoading ? (
            serchResult?.topQuery?.results.length > 0 ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0px",
                  padding: "10px 6px",
                  boxSizing: "border-box",
                }}
              >
                {/*  Songs */}

                {serchResult?.songs.results !== 0 ? (
                  serchResult?.songs.results.map((data) => {
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
                              className={
                                data.id === songId ? "Active-audio" : ""
                              }
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
                              {data.title}
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
                              • {data?.primaryArtists}
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "grid",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onClick={()=>{showmoreInfo(data.id , data.image[2].url,data.title,data.primaryArtists,data.type)}}
                        >
                          <svg
                            data-encore-id="icon"
                            role="img"
                            aria-hidden="true"
                            style={{
                              width: "25px",
                              height: "25px",
                              fill: "#fff",
                            }}
                            viewBox="0 0 24 24"
                          >
                            <path d="M10.5 4.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0zm0 15a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0zm0-7.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z"></path>
                          </svg>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <h4 style={{ color: "gray" }}>
                      No any songs found for "{SearchValue}"
                    </h4>
                  </div>
                )}

                <footer
                  style={{
                    width: "100%",
                    height: "100px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                ></footer>
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "start",
                }}
              >
                <h4 style={{ color: "gray" }}>No any song found</h4>
              </div>
            )
          ) : (
            <div
              style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <div className="loader">
                <div
                  className="loader1"
                  style={{ backgroundColor: "black" }}
                ></div>
              </div>
            </div>
          )}
        </div>

            <div id="songInfo" style={{width:"100%",height:"100%",position:"fixed",top:"0",backgroundColor:"rgb(0 0 0 / 64%)",backdropFilter:"blur(10px)",zIndex:"2000",display:"none",gridTemplateRows:"90% 10%",padding:"15px 15px"}}>
              
              <div style={{display:"flex",justifyContent:"center",flexDirection:"column",gap:"50px"}}>

               <div style={{display:"flex",gap:"17px",alignItems:"center",width:"100%"}}>
                   <img id="song-img" style={{width:"65px",height:"65px"}} src="" alt="" />
                   <div style={{alignItems:"center",gap:"0px"}}>
                        
                        <div id="song-title" style={{fontSize:"18px",fontFamily:"sans-serif"}}></div>
                      
                        <div id="song-artist" style={{fontSize:"14px",fontWeight:"400",color:"#7c7a7a"}}></div>
                   </div>
               </div>
               
              <div style={{width:"100%",display:"flex",flexDirection:"column",gap:"30px"}}>
                   <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <svg style={{width:"24px",height:"24px",fill:"white"}} data-encore-id="icon" role="img" aria-hidden="true" class="e-9921-icon e-9921-baseline" viewBox="0 0 24 24"><path d="M5.21 1.57a6.757 6.757 0 0 1 6.708 1.545.124.124 0 0 0 .165 0 6.741 6.741 0 0 1 5.715-1.78l.004.001a6.802 6.802 0 0 1 5.571 5.376v.003a6.689 6.689 0 0 1-1.49 5.655l-7.954 9.48a2.518 2.518 0 0 1-3.857 0L2.12 12.37A6.683 6.683 0 0 1 .627 6.714 6.757 6.757 0 0 1 5.21 1.57zm3.12 1.803a4.757 4.757 0 0 0-5.74 3.725l-.001.002a4.684 4.684 0 0 0 1.049 3.969l.009.01 7.958 9.485a.518.518 0 0 0 .79 0l7.968-9.495a4.688 4.688 0 0 0 1.049-3.965 4.803 4.803 0 0 0-3.931-3.794 4.74 4.74 0 0 0-4.023 1.256l-.008.008a2.123 2.123 0 0 1-2.9 0l-.007-.007a4.757 4.757 0 0 0-2.214-1.194z"></path></svg>
                    <div style={{fontSize:"17px"}}>Like</div>
                   </div>

                   <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <svg style={{width:"24px",height:"24px",fill:"white"}} data-encore-id="icon" role="img" aria-hidden="true" class="e-9921-icon e-9921-baseline" viewBox="0 0 24 24"><path d="M18.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM15 5.5a3.5 3.5 0 1 1 1.006 2.455L9 12l7.006 4.045a3.5 3.5 0 1 1-.938 1.768l-6.67-3.85a3.5 3.5 0 1 1 0-3.924l6.67-3.852A3.513 3.513 0 0 1 15 5.5zm-9.5 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm13 6.5a1.5 1.5 0 1 0-.001 3 1.5 1.5 0 0 0 .001-3z"></path></svg>
                    <div style={{fontSize:"17px"}}>Share</div>
                   </div>

                   <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                   <svg style={{width:"24px",height:"24px",fill:"white"}} data-enco re-id="icon" role="img" aria-hidden="true" class="e-9921-icon e-9921-baseline" viewBox="0 0 24 24"><path d="M13.363 10.4742L12.842 11.0992C12.6086 11.379 12.4393 11.7065 12.3458 12.0587C12.2523 12.4109 12.2369 12.7793 12.3007 13.1381C12.3645 13.4968 12.506 13.8373 12.7153 14.1356C12.9245 14.434 13.1964 14.683 13.512 14.8652L13.797 15.0292C14.1345 14.4382 14.57 13.909 15.085 13.4642L14.512 13.1332C14.4489 13.0967 14.3945 13.0469 14.3527 12.9873C14.3109 12.9276 14.2826 12.8596 14.2698 12.7878C14.2571 12.7161 14.2601 12.6425 14.2788 12.572C14.2975 12.5016 14.3314 12.4362 14.378 12.3802L14.898 11.7562C15.9717 10.5455 16.6172 9.01512 16.735 7.40118C16.7841 6.56095 16.686 5.71858 16.445 4.91216C16.1971 4.15361 15.7913 3.45625 15.2542 2.86605C14.717 2.27585 14.0609 1.80623 13.329 1.48818C12.2258 1.00309 10.9984 0.875524 9.81909 1.12338C8.63974 1.37123 7.56757 1.98205 6.75299 2.87017C6.21741 3.46169 5.812 4.15906 5.56299 4.91717C5.32198 5.72359 5.22386 6.56595 5.27301 7.40618C5.3909 9.02058 6.03674 10.5513 7.11096 11.7622L7.62897 12.3842C7.6756 12.4401 7.70947 12.5056 7.72815 12.576C7.74683 12.6465 7.74989 12.7201 7.73712 12.7918C7.72436 12.8636 7.69606 12.9316 7.65424 12.9913C7.61241 13.0509 7.55808 13.1007 7.495 13.1372L3.5 15.4442C2.73992 15.883 2.10876 16.5142 1.66992 17.2743C1.23108 18.0343 1.00002 18.8965 1 19.7742V22.0052H14.54C14.0162 21.4229 13.6119 20.7433 13.35 20.0052H3V19.7742C2.99966 19.2472 3.13811 18.7295 3.40143 18.2731C3.66475 17.8167 4.04366 17.4377 4.5 17.1742L8.495 14.8672C8.81056 14.685 9.08246 14.436 9.29169 14.1376C9.50092 13.8393 9.64241 13.4988 9.70624 13.1401C9.77006 12.7813 9.75469 12.4129 9.66119 12.0607C9.5677 11.7085 9.39833 11.3811 9.16498 11.1012L8.64398 10.4762C8.03916 9.82817 7.61201 9.03491 7.40387 8.17327C7.19573 7.31163 7.21367 6.41081 7.45599 5.55816C7.61624 5.06462 7.8782 4.61019 8.22498 4.22418C8.57805 3.8391 9.00736 3.53165 9.4856 3.32131C9.96383 3.11098 10.4805 3.00234 11.003 3.00234C11.5254 3.00234 12.0422 3.11098 12.5204 3.32131C12.9986 3.53165 13.4279 3.8391 13.781 4.22418C14.1271 4.61049 14.3887 5.06485 14.549 5.55816C14.7059 6.11997 14.769 6.70382 14.736 7.28619C14.6432 8.47138 14.1604 9.59243 13.363 10.4742ZM21.004 9.30117C20.7388 9.30117 20.4844 9.40654 20.2969 9.59408C20.1093 9.78162 20.004 10.036 20.004 10.3012V14.9672H19.004C18.4106 14.9672 17.8306 15.1431 17.3373 15.4728C16.8439 15.8024 16.4594 16.2709 16.2324 16.8191C16.0053 17.3673 15.9459 17.9705 16.0616 18.5525C16.1774 19.1344 16.4631 19.6689 16.8827 20.0885C17.3022 20.5081 17.8368 20.7938 18.4187 20.9095C19.0006 21.0253 19.6039 20.9659 20.152 20.7388C20.7002 20.5118 21.1688 20.1272 21.4984 19.6339C21.8281 19.1405 22.004 18.5605 22.004 17.9672V10.3012C22.004 10.1696 21.9781 10.0393 21.9276 9.91781C21.8772 9.79629 21.8032 9.68591 21.71 9.59301C21.6168 9.50011 21.5063 9.42651 21.3846 9.37643C21.2629 9.32635 21.1326 9.30078 21.001 9.30117H21.004ZM20.004 17.9672C20.004 18.165 19.9453 18.3583 19.8354 18.5228C19.7256 18.6872 19.5694 18.8154 19.3867 18.891C19.2039 18.9667 19.0029 18.9865 18.8089 18.948C18.6149 18.9094 18.4367 18.8141 18.2969 18.6743C18.157 18.5344 18.0618 18.3562 18.0232 18.1623C17.9846 17.9683 18.0045 17.7672 18.0801 17.5845C18.1558 17.4018 18.284 17.2456 18.4484 17.1357C18.6129 17.0258 18.8062 16.9672 19.004 16.9672H20.004V17.9672Z"></path></svg>
                    <div style={{fontSize:"17px"}}>View artist</div>
                   </div>
                   <div 
                   id="View-album"
                   style={{display:"flex",alignItems:"center",gap:"10px"}} 
                   onClick={()=>{
                       naviagte(`/album/${albumId}`)
                        
                   }}>
                    <svg style={{width:"24px",height:"24px",fill:"white"}} data-encore-id="icon" role="img" aria-hidden="true" class="e-9921-icon e-9921-baseline" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12z"></path><path d="M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-4 2a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"></path></svg>
                    <div style={{fontSize:"17px"}}>View album</div>
                   </div>

              </div>
               

               
              </div>

               <footer onClick={()=>{document.getElementById('songInfo').style.display="none"}} style={{width:"100%",textAlign:"center",color:"white",position:"absolute",bottom:"0px",display:"flex",alignItems:"center",justifyContent:"center",padding:"10px 10px"}}>
                     Close
               </footer>
        </div>

      </div>
    </>
  );
}

export default SearchSongs;
