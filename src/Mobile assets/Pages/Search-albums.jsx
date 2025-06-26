import axios from "axios";
import debounce from "lodash.debounce";
import React, { useEffect, useRef, useState } from "react";
import { useData } from "../../Pages/DataContext";
import { NavLink, useNavigate, useParams } from "react-router-dom";

function SearchAlbums() {
  const inputRef = useRef(undefined);
  const { SearchValue } = useParams();
  const { songId, setSongId, setSong } = useData();
  const naviagte = useNavigate();
  const [serchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
                {/*  albums */}
                {serchResult?.albums.results.length !== 0 ? (
                  serchResult?.albums.results.map((data) => {
                    return (
                      <div
                        className="albums_row"
                        onClick={() => {
                          naviagte(`/album/${data.id}`);
                        }}
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
                              •{" "}
                              {data?.type.charAt(0).toUpperCase() +
                                data?.type.slice(1)}
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "grid",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          
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
                      No any albums found for "{SearchValue}"
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
      </div>
    </>
  );
}

export default SearchAlbums;
