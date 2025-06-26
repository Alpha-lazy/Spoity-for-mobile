import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "./DataContext";

function Song_track() {
  const { trackId } = useParams();
  const [songInfo, setSongInfo] = useState();
  const [hasLyrics, setHasLyrics] = useState(false);
  const [songLyric, setSongLyric] = useState();
  const { setSongId, songId, setSong, setSuggestion, song } = useData();
  const navigate = useNavigate();




 

  // retrive song
  async function Retrivesong(id) {
    const responce = await axios("https://jiosavan-api2.vercel.app/api/songs", {
      headers: {
        Accept: "*/*",
      },
      params: {
        ids: id,
      },
    });

    setSongInfo(responce.data.data[0]);
    setHasLyrics(responce.data.data[0].hasLyrics);
    setSong(responce.data.data);
  }

  // async function getAverageColor(imageUrl, ratio = 0.1) {
  //   // Create dummy image to load source
  //   const img = new Image();
  //   img.crossOrigin = "anonymous";
  //   img.src = imageUrl;

  //   // Wait for image to load
  //   await new Promise((resolve) => (img.onload = resolve));

  //   // Create canvas element
  //   const canvas = document.createElement("canvas");
  //   const ctx = canvas.getContext("2d");

  //   // Set canvas dimensions based on ratio
  //   canvas.width = img.naturalWidth * ratio;
  //   canvas.height = img.naturalHeight * ratio;

  //   // Draw image to canvas
  //   ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  //   // Get pixel data
  //   const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  //   const data = imageData.data;

  //   let r = 0,
  //     g = 0,
  //     b = 0,
  //     count = 0;

  //   // Loop through pixels
  //   for (let i = 0; i < data.length; i += 4) {
  //     if (data[i + 3] < 128) continue; // Skip transparent pixels

  //     r += data[i];
  //     g += data[i + 1];
  //     b += data[i + 2];
  //     count++;
  //   }

  //   // Calculate averages
  //   const avgR = Math.round(r / count);
  //   const avgG = Math.round(g / count);
  //   const avgB = Math.round(b / count);

  //   // Format conversions
  //   const toHex = (value) => value.toString(16).padStart(2, "0");
  //   const hex = `#${toHex(avgR)}${toHex(avgG)}${toHex(avgB)}`;

  //   return {
  //     rgb: `rgb(${avgR}, ${avgG}, ${avgB})`,
  //     hex: hex.toUpperCase(),
  //   };
  // }




// Function to extract dominant color from an image
function getDominantColor(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Scale image to 1x1 pixel to get average color
  canvas.width = 1;
  canvas.height = 1;
  ctx.drawImage(img, 0, 0, 1, 1);
  
  // Get the single pixel's color data [R, G, B, A]
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `rgb(${r}, ${g}, ${b})`;
}






  useEffect(() => {
    Retrivesong(trackId);
  }, [trackId]);

  async function loadData(id) {
    if (songInfo) {
      // getAverageColor(`${songInfo.image[2].url}`, 4).then(
      //   (color) =>
      //     (document.getElementById(
      //       "songInfo"
      //     ).style.background = `linear-gradient(to bottom ,${dominantColor}, ${adjustColor(dominantColor, -50)},transparent)`)
          // ).style.background = `linear-gradient(to bottom ,${dominantColor}, ${adjustColor(dominantColor, -50)}, ${color.rgb},transparent)`)
      // );
       document.getElementById('songImg').addEventListener('load', function() {
        const dominantColor = getDominantColor(this);
        
      // Apply the color as a background gradient
      document.getElementById("songInfo").style.background = `
        linear-gradient(${dominantColor}, transparent)
      `;
      });
     
      
      
      document.getElementById("track-Name").title = `${songInfo.type}`;

      if (songInfo.hasLyrics) {
        const responce = await axios(
          `https://jiosavan-api2.vercel.app/api/songs/${id}/lyrics`,
          {
            headers: {
              Accept: "*/*",
            },
          }
        );
        document.getElementById("song-Lyrics").innerHTML =
          responce.data.data.lyrics;
        setSongLyric(responce.data.data.lyrics);
      }
    }
  }

  useEffect(() => {
    loadData(trackId);
    
  }, [songInfo]);

  function convertToMMSS(seconds) {
    // Calculate minutes
    const minutes = Math.floor(seconds / 60);
    // Calculate remaining seconds
    const remainingSeconds = seconds % 60;
    // Pad with leading zero for single-digit seconds
    const formattedSeconds =
      remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
    // Return formatted string
    return `${minutes}:${formattedSeconds}`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const gridTable = document.querySelector(".SongTable");
    const cells = gridTable.children;
    console.log(cells);

    Array.from(cells).forEach((cell) => {
      cell.addEventListener("mouseenter", function () {
        const index = Array.from(gridTable.children).indexOf(cell);
        const row = Math.floor(index / 4);

        Array.from(gridTable.children).forEach((c) => {
          const cIndex = Array.from(gridTable.children).indexOf(c);
          if (Math.floor(cIndex / 4) === row) {
            c.classList.add("hovered");
          }
        });
      });

      cell.addEventListener("mouseleave", function () {
        Array.from(gridTable.children).forEach((c) => {
          c.classList.remove("hovered");
        });
      });
    });
  });

  // retrive suggestion and play song

  const RetriveSuggestion = (id) => {
    setSuggestion([]);
    axios
      .get(`https://jiosavan-api2.vercel.app/api/songs/${id}/suggestions`, {
        params: {
          limit: 100,
        },
      })
      .then(async (responce) => {
        // setSuggestion(currentSong)
        if (song) {
          song.map((data) => {
            if (data.id === id) {
              setSuggestion([data]);
            }
          });
        }
        let data = await responce.data.data;
        setSuggestion((prev) => [...prev, ...data]);

        setSong((prev) => [...prev, ...data]);
      });
  };

  const playsong = (id) => {
    RetriveSuggestion(id);
    setSongId(id);
  };



  return (
    <div
      id="dynamicDiv"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "90vh",
        width: "100%",
        borderRadius: "10px",
      }}

    >
   
      <div className="content" id="content" style={{ padding: "0px 0px" }} 
       
      >
        <div
          //   onScroll={header}
          className="track"
          id="track"
          style={{
            width: "100%",
            height: "100%",
            overflow: "auto",
            margin: "auto",
            position: "relative",
            overflowX: "hidden",
          }}
        >
          <div
            id="songInfo"
            style={{
              display: "grid",
              gridTemplateRows: "280px 200px",
            }}
          
          >
            <div
          
              style={{
                display: "grid",
                gridTemplateColumns: "230px 1fr ",
                columnGap: "20px",
                alignItems: "center",
                height: "216px",
                width:"100%",
                padding: "23px",
              }}
             
            >
              <div >
                {songInfo ? (
                  <img
                    width="230px"
                    height="230px"
                    style={{ borderRadius: "5px" }}
                    src={songInfo.image[2].url}
                    alt=""
                    id="songImg"
                     crossorigin="anonymous"
                  />
                ) : (
                  ""
                )}
              </div>
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "end",
                  marginBottom: "15px",
                }}
                
              >
                {songInfo ? (
                  <>
                    <div
                      style={{
                        color: "white",
                        fontSize: "40px",
                        fontFamily: "MyCustomFont",
                      }}
                    >
                      <div  id="track-Name" className="song-track-Name"  >
                        {songInfo.name}
                        
                      </div>
                     
                      <div
                        style={{
                          color: "white",
                          fontSize: "18px",
                          display: "flex",
                          alignItems: "center",
                          height: "30px",
                          gap: "5px",
                        }}
                      >
                        {songInfo.artists.all[0].image.length !== 0 ? (
                          <img
                            width="25px"
                            height="25px"
                            style={{
                              borderRadius: "50%",
                              border: "1px solid white",
                            }}
                            src={
                              songInfo.artists.all[0].image.length !== 0
                                ? songInfo.artists.all[0].image[0].url
                                : ""
                            }
                            alt=""
                          />
                        ) : (
                          ""
                        )}

                        <div
                          onClick={() => {
                            navigate(
                              `/artist/track/${songInfo.artists.all[0].id}`
                            );
                          }}
                          className="artist-name"
                          style={{
                            fontSize: "14px",
                            // height: "26px",
                            fontFamily: "MyCustomFont",
                            display: "flex",
                            gap: "5px",
                          }}
                        >
                          {songInfo.artists.all[0].name}
                        </div>

                        <span
                          style={{
                            color: "#rgb(242 240 240)",
                            fontSize: "17px",
                          }}
                        >
                          •
                        </span>
                        <span
                          style={{
                            fontFamily: "MyCustomFont",
                            fontSize: "14px",
                            color: "#e0e0e0",
                          }}
                        >
                          {songInfo.album.name}
                        </span>

                        <span
                          style={{
                            color: "#9c9c9c",
                            fontSize: "17px",
                          }}
                        >
                          •
                        </span>
                        <span
                          style={{
                            fontFamily: "MyCustomFont",
                            fontSize: "14px",
                            color: "#e0e0e0",
                          }}
                        >
                          {songInfo.year}
                        </span>
                        <span
                          style={{
                            color: "#9c9c9c",
                            fontSize: "17px",
                          }}
                        >
                          •
                        </span>
                        <span
                          style={{
                            fontFamily: "MyCustomFont",
                            fontSize: "14px",
                            color: "#e0e0e0",
                          }}
                        >
                          {convertToMMSS(Math.floor(songInfo.duration))}
                        </span>
                        <span
                          style={{
                            color: "#9c9c9c",
                            fontSize: "17px",
                          }}
                        >
                          •
                        </span>
                        <span
                          style={{
                            fontFamily: "MyCustomFont",
                            fontSize: "14px",
                            color: "#e0e0e0",
                          }}
                        >
                          {songInfo.playCount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div
              className="song-container"
              style={{
                gridRowStart: 2 / 3,
                display: "grid",
                gridTemplateRows: "auto",
              }}
            >
              <div
                id="song-data"
                style={{
                  gridRow: 1 / 2,
                  // display:"grid",
                  // gridTemplateRows:"1fr 1fr 1fr 1fr",
                  backgroundColor: "rgb(0 0 0 / 18%)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    padding: "25px",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                  }}
                >
                  <div className="playPause">
                    <button
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        border: "none",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#1ED760",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        playsong(trackId);
                      }}
                    >
                      {songId !== trackId ? (
                        /* play svg */
                        <svg
                          data-encore-id="icon"
                          role="img"
                          aria-hidden="true"
                          class="e-9800-icon e-9800-baseline"
                          viewBox="0 0 24 24"
                          width="24px"
                          height="24px"
                        >
                          <path
                            d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"
                            class=""
                            data-label="path"
                          ></path>
                        </svg>
                      ) : (
                        /* pause svg */
                        <svg
                          data-encore-id="icon"
                          role="img"
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          width="24px"
                          height="24px"
                        >
                          <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                  <div
                    className="add"
                    style={{ width: "33px", height: "33px", cursor: "pointer" }}
                  >
                    <button
                      style={{
                        border: "none",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <svg
                        data-encore-id="icon"
                        role="img"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        width="33px"
                        height="33px"
                        fill="#B3B3B3"
                      >
                        <path
                          d="M11.999 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-11 9c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11z"
                          class=""
                        ></path>
                        <path
                          d="M17.999 12a1 1 0 0 1-1 1h-4v4a1 1 0 1 1-2 0v-4h-4a1 1 0 1 1 0-2h4V7a1 1 0 1 1 2 0v4h4a1 1 0 0 1 1 1z"
                          class=""
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div
                  className="songInfo"
                  style={
                    hasLyrics
                      ? {
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          padding: "15px 30px",
                        }
                      : {
                          display: "grid",
                          gridTemplateColumns: "1fr",
                          padding: "10px 30px ",
                        }
                  }
                >
                  {hasLyrics ? (
                    <div>
                      <header style={{ margin: "0px" }}>
                        <h1 style={{ margin: "0px", marginBottom: "10px" }}>
                          Lyrics
                        </h1>
                      </header>
                      <div
                        id="song-Lyrics"
                        style={{
                          fontSize: "15px",
                          color: "#9c9c9c",
                          height:"289px",
                          overflow:"hidden"
                        }}
                      >
                      </div>
                      <div>
                        <button style={{
                              color:"white",
                              fontSize:"15px",
                              backgroundColor:"transparent",
                              border:"none",
                              fontWeight:"bold",
                              cursor:"pointer"
                          }}
                          id="show"
                          onClick={()=>{
                            document.getElementById('song-Lyrics').style.height === "289px"
                            ?
                            document.getElementById('song-Lyrics').style.height = "auto"
                            :
                            document.getElementById('song-Lyrics').style.height = "289px"
                          }}
                          >
                            {document.getElementById('song-Lyrics')!==null ?document.getElementById('song-Lyrics').style.height === "289px"
                            ?
                            "...Show more"
                            :
                             "Show less"
                             :""
                          }
                          </button>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {songInfo ? (
                    <div>
                      <header style={{ margin: "0px" }}>
                        <h1 style={{ margin: "0px", marginBottom: "10px" }}>
                          Artists
                        </h1>
                      </header>

                      <div
                        style={
                          hasLyrics ? { padding: "0px" } : { padding: "15px" }
                        }
                      >
                        {/* {songInfo.artists.all.length !==0 ?songInfo.artists.all.map(data=>{ */}
                        {songInfo.artists.all.length !== 0
                          ? songInfo.artists.all
                              .filter(
                                (artist, index, self) =>
                                  index ===
                                  self.findIndex((a) => a.id === artist.id)
                              )
                              .map((data) => {
                                return (
                                  <div
                                    className="Artist-Card"
                                    onClick={() => {
                                      navigate(`/artist/track/${data.id}`);
                                    }}
                                  >
                                    <div style={{ height: "70px" }}>
                                      {data.image.length !== 0 ? (
                                        <img
                                          width="70px"
                                          height="70px"
                                          style={{ borderRadius: "50%" }}
                                          src={
                                            data.image.length !== 0
                                              ? data.image[2].url
                                              : ""
                                          }
                                          alt="image"
                                        />
                                      ) : (
                                        <div
                                          style={{
                                            width:"70px",
                                            height:"70px",
                                            borderRadius:"50%",
                                            backgroundColor:"#282828",
                                            display:'flex',
                                            justifyContent:"center",
                                            alignItems:"center"
                                          }}
                                        >
                                        <svg
                                          data-encore-id="icon"
                                          role="img"
                                          aria-hidden="true"
                                          data-testid="artist"
                                          viewBox="0 0 24 24"
                                          width="30px"
                                          height="30px"
                                          fill="#7F7F7F"
                                        
                                        >
                                          <path d="M13.363 10.4742L12.842 11.0992C12.6086 11.379 12.4393 11.7065 12.3458 12.0587C12.2523 12.4109 12.2369 12.7793 12.3007 13.1381C12.3645 13.4968 12.506 13.8373 12.7153 14.1356C12.9245 14.434 13.1964 14.683 13.512 14.8652L13.797 15.0292C14.1345 14.4382 14.57 13.909 15.085 13.4642L14.512 13.1332C14.4489 13.0967 14.3945 13.0469 14.3527 12.9873C14.3109 12.9276 14.2826 12.8596 14.2698 12.7878C14.2571 12.7161 14.2601 12.6425 14.2788 12.572C14.2975 12.5016 14.3314 12.4362 14.378 12.3802L14.898 11.7562C15.9717 10.5455 16.6172 9.01512 16.735 7.40118C16.7841 6.56095 16.686 5.71858 16.445 4.91216C16.1971 4.15361 15.7913 3.45625 15.2542 2.86605C14.717 2.27585 14.0609 1.80623 13.329 1.48818C12.2258 1.00309 10.9984 0.875524 9.81909 1.12338C8.63974 1.37123 7.56757 1.98205 6.75299 2.87017C6.21741 3.46169 5.812 4.15906 5.56299 4.91717C5.32198 5.72359 5.22386 6.56595 5.27301 7.40618C5.3909 9.02058 6.03674 10.5513 7.11096 11.7622L7.62897 12.3842C7.6756 12.4401 7.70947 12.5056 7.72815 12.576C7.74683 12.6465 7.74989 12.7201 7.73712 12.7918C7.72436 12.8636 7.69606 12.9316 7.65424 12.9913C7.61241 13.0509 7.55808 13.1007 7.495 13.1372L3.5 15.4442C2.73992 15.883 2.10876 16.5142 1.66992 17.2743C1.23108 18.0343 1.00002 18.8965 1 19.7742V22.0052H14.54C14.0162 21.4229 13.6119 20.7433 13.35 20.0052H3V19.7742C2.99966 19.2472 3.13811 18.7295 3.40143 18.2731C3.66475 17.8167 4.04366 17.4377 4.5 17.1742L8.495 14.8672C8.81056 14.685 9.08246 14.436 9.29169 14.1376C9.50092 13.8393 9.64241 13.4988 9.70624 13.1401C9.77006 12.7813 9.75469 12.4129 9.66119 12.0607C9.5677 11.7085 9.39833 11.3811 9.16498 11.1012L8.64398 10.4762C8.03916 9.82817 7.61201 9.03491 7.40387 8.17327C7.19573 7.31163 7.21367 6.41081 7.45599 5.55816C7.61624 5.06462 7.8782 4.61019 8.22498 4.22418C8.57805 3.8391 9.00736 3.53165 9.4856 3.32131C9.96383 3.11098 10.4805 3.00234 11.003 3.00234C11.5254 3.00234 12.0422 3.11098 12.5204 3.32131C12.9986 3.53165 13.4279 3.8391 13.781 4.22418C14.1271 4.61049 14.3887 5.06485 14.549 5.55816C14.7059 6.11997 14.769 6.70382 14.736 7.28619C14.6432 8.47138 14.1604 9.59243 13.363 10.4742ZM21.004 9.30117C20.7388 9.30117 20.4844 9.40654 20.2969 9.59408C20.1093 9.78162 20.004 10.036 20.004 10.3012V14.9672H19.004C18.4106 14.9672 17.8306 15.1431 17.3373 15.4728C16.8439 15.8024 16.4594 16.2709 16.2324 16.8191C16.0053 17.3673 15.9459 17.9705 16.0616 18.5525C16.1774 19.1344 16.4631 19.6689 16.8827 20.0885C17.3022 20.5081 17.8368 20.7938 18.4187 20.9095C19.0006 21.0253 19.6039 20.9659 20.152 20.7388C20.7002 20.5118 21.1688 20.1272 21.4984 19.6339C21.8281 19.1405 22.004 18.5605 22.004 17.9672V10.3012C22.004 10.1696 21.9781 10.0393 21.9276 9.91781C21.8772 9.79629 21.8032 9.68591 21.71 9.59301C21.6168 9.50011 21.5063 9.42651 21.3846 9.37643C21.2629 9.32635 21.1326 9.30078 21.001 9.30117H21.004ZM20.004 17.9672C20.004 18.165 19.9453 18.3583 19.8354 18.5228C19.7256 18.6872 19.5694 18.8154 19.3867 18.891C19.2039 18.9667 19.0029 18.9865 18.8089 18.948C18.6149 18.9094 18.4367 18.8141 18.2969 18.6743C18.157 18.5344 18.0618 18.3562 18.0232 18.1623C17.9846 17.9683 18.0045 17.7672 18.0801 17.5845C18.1558 17.4018 18.284 17.2456 18.4484 17.1357C18.6129 17.0258 18.8062 16.9672 19.004 16.9672H20.004V17.9672Z"></path>
                                        </svg>
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <div style={{ fontSize: "14px" }}>
                                        {data.type[0].toUpperCase() +
                                          data.type.slice(1)}
                                      </div>
                                      <div className="artistname">
                                        {data.name}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                          : ""}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Song_track;
