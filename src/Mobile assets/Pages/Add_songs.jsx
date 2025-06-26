import React, { useEffect, useState } from "react";
import { useData } from "../../Pages/DataContext";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

function Add_songs() {
  const [serchResult, setSearchResult] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { song, songId, setSongId, setSong } = useData();
  const { playlistId } = useParams();
  const naviagte = useNavigate();

  const fetch_SerchSongs = async (searchValue) => {
    try {
      setIsLoading(true);
      if (searchValue.trim() !== "") {
        const responce = await axios.request({
          method: "GET",
          url: `https://jiosavan-api2.vercel.app/api/search`,
          params: { query: searchValue },
        });
        setSearchResult(responce.data.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };


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

   // get average color from image
    async function getAverageColor(imageUrl, ratio = 0.1) {
      // Create dummy image to load source
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;
  
      // Wait for image to load
      await new Promise((resolve) => (img.onload = resolve));
  
      // Create canvas element
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
  
      // Set canvas dimensions based on ratio
      canvas.width = img.naturalWidth * ratio;
      canvas.height = img.naturalHeight * ratio;
  
      // Draw image to canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
      // Get pixel data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
  
      let r = 0,
        g = 0,
        b = 0,
        count = 0;
  
      // Loop through pixels
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 128) continue; // Skip transparent pixels
  
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
  
      // Calculate averages
      const avgR = Math.round(r / count);
      const avgG = Math.round(g / count);
      const avgB = Math.round(b / count);
  
      // Format conversions
      const toHex = (value) => value.toString(16).padStart(2, "0");
      const hex = `#${toHex(avgR)}${toHex(avgG)}${toHex(avgB)}`;
  
      return {
        rgb: `rgb(${avgR}, ${avgG}, ${avgB})`,
        hex: hex.toUpperCase(),
      };
    }

  const handleOnChange = async (e) => {

    fetch_SerchSongs(e.target.value)
    .then(async()=>{
      // console.log(serchResult?.topQuery.results.filter(item=>item.type === "song"));
     
      
    let color = await getAverageColor(serchResult?.topQuery.results.filter(data=>data.type === "song" || data.type === "album")[0]?.image[2].url)
  
        
        document.getElementById('add_song_container').style.background = `linear-gradient(to bottom, ${color.rgb},transparent, black,black)`;
   
    })

  }

  useEffect(() => {
    document.body.scrollTop = 0;
  }, []);

  return (
    <div
      style={{
        width: "100%",
        // height: "100vh",
        // backgroundColor: "black",
        padding: "15px",
      }}
      id="add_song_container"
    >
      <header
        style={{
          width: "100%",
          height: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "sticky",
          top: "0",
        }}
      >
        <input
          onChange={(e) => {
            handleOnChange(e);
          }}
          style={{
            width: "100%",
            height: "45px",
            padding: "10px 15px",
            color: "white",
            backgroundColor: "rgb(35 35 35 / 73%)",
            fontSize: "18px",
            border: "none",
            borderRadius: "4px",
            outline: "none",
          }}
          placeholder="Search"
          type="text"
        />
      </header>

      <div
        style={{
          width: "100%",
          height: "100%",
          // marginTop: "60px",
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
                //   padding: "10px 6px",
                boxSizing: "border-box",
              }}
            >
              {/* top query */}
              {serchResult?.topQuery.results.map((data) => {
                return data?.type === "song" || data?.type === "album" ? (
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
                        data.type === "album"
                          ? naviagte(`/add/songs/${playlistId}/${data.id}`)
                          : setSongId(data.id);
                      }}
                    >
                      {/* <div style={{width:"45px",height:"45px",borderRadius:"4px",overflow:"hidden"}}> */}
                      <img
                        style={
                          data.type === "artist"
                            ? {
                                width: "45px",
                                height: "45px",
                                borderRadius: "50%",
                                objectFit: "contain",
                              }
                            : {
                                width: "45px",
                                height: "45px",
                                borderRadius: "3px",
                                objectFit: "contain",
                              }
                        }
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
                      onClick={() => {
                        if (data.type === "song") {
                        
                        addToPlaylist(data.id, data.image[2].url);
                        }
                      }}
                    >
                      {data.type === "song" && data.type !== "album" ? (
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
                      ) : (
                        <svg
                          style={{
                            width: "20px",
                            height: "20px",
                            fill: "rgb(203 199 199)",
                          }}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 320 512"
                        >
                          <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                        </svg>
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                );
              })}

              {/*  Songs */}
              {serchResult?.songs.results.map((data) => {
                if (data.id !== serchResult?.topQuery?.results[0]?.id) {
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
                }
              })}

              {/*  albums */}
              {serchResult?.albums.results.map((data) => {
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
                    onClick={() => {
                      naviagte(`/add/songs/${playlistId}/${data.id}`);
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
                      <svg
                        style={{
                          width: "20px",
                          height: "20px",
                          fill: "rgb(203 199 199)",
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                      >
                        <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                      </svg>
                    </div>
                  </div>
                );
              })}

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
  );
}

export default Add_songs;
