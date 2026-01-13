import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useData } from "../../Pages/DataContext";
import axios from "axios";
import toast from "react-hot-toast";

function Footer() {
  const location = useLocation();
  const { songId, audio, song, setSongId, globalplaylistId } = useData();
  const [currSong, setCurrSong] = useState();
  const [currIndex, setCurrIndex] = useState();
  const [shuffledSongs, setShuffledSongs] = useState();
  const [lyrics, setLyrics] = useState();
  var isFevorite = false;
  var currentLyricIndex = 0;

  // Retrieve lyrics
  async function retriveLyrics(name, artists, duration) {
    let convertdDuration = convertToMMSS(Math.floor(duration));
    let data = artists.map((artist) => {
      return artist.name;
    });

    const options = {
      method: "GET",
      url: "https://musixmatch-lyrics-songs.p.rapidapi.com/songs/lyrics",
      params: {
        t: name,
        a: `${data}`,
        d: convertdDuration,
        type: "json",
      },
      headers: {
        "x-rapidapi-key": "7ade7b0a18msh053ba1d88576bd0p15e970jsn8371f9087f2e",
        "x-rapidapi-host": "musixmatch-lyrics-songs.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      setLyrics([]);
      setLyrics(response.data);
      currentLyricIndex = 0;

      const container = document.getElementById("lyrics-container");
      container.innerHTML = "";

      response.data?.forEach((lyric) => {
        const div = document.createElement("div");
        div.className = "lyric-line";
        div.textContent = lyric.text === "" ? "🎶..." : lyric.text;
        container.appendChild(div);
      });
    } catch (error) {
      console.error(error);
      setLyrics([]);

      const container = document.getElementById("lyrics-container");
      container.innerHTML = "";
      const options = {
        method: "GET",
        url: "https://musixmatch-lyrics-songs.p.rapidapi.com/songs/lyrics",
        params: {
          t: name,
          a: `${data}`,
          d: duration,
          type: "json",
        },
        headers: {
          "x-rapidapi-key":
            "7ade7b0a18msh053ba1d88576bd0p15e970jsn8371f9087f2e",
          "x-rapidapi-host": "musixmatch-lyrics-songs.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        setLyrics([]);
        setLyrics(response.data);
        currentLyricIndex = 0;

        const container = document.getElementById("lyrics-container");
        container.innerHTML = "";

        response.data?.forEach((lyric) => {
          const div = document.createElement("div");
          div.className = "lyric-line";
          div.textContent = lyric.text;
          container.appendChild(div);
        });
      } catch (error) {}
    }
  }
  // play song by id and retrive data
  async function playSong(id) {
    const responce = await axios.request({
      method: "GET",
      url: `https://jiosavan-api2.vercel.app/api/songs/${id}`,
    });

    // set curr song

    let src = responce.data.data[0].downloadUrl[3].url;
    audio.src = src;
    setCurrSong(responce.data.data[0]);
    audio.play();

    // set average color to mini player
    document.getElementById("playerImg").src = await responce.data.data[0]
      ?.image[2].url;
    let color = await getAverageColor(responce.data.data[0]?.image[2].url);

    document.getElementById(
      "mini_player"
    ).style.backgroundColor = `${color.rgb}`;
    document.getElementById(
      "lyrics-container"
    ).style.backgroundColor = `${color.rgb}`;
    document.getElementById(
      "big_Player"
    ).style.background = `linear-gradient(to bottom, ${color.rgb},#121212)`;
    // document.getElementById(
    //   "big_Player"
    // ).style.background = `linear-gradient(to bottom, ${color.rgb}, #121212)`;
    // ).style.backgroundColor = ` ${getDominantColor(
    //   document.getElementById("playerImg")
    // ) }`;
  }

  // extract dominant color from image
  function getDominantColor(img) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Scale image to 1x1 pixel to get average color
    canvas.width = 1;
    canvas.height = 1;
    ctx.drawImage(img, 0, 0, 1, 1);

    // Get the single pixel's color data [R, G, B, A]
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `rgb(${r}, ${g}, ${b})`;
  }

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

  // Convert seconds to MM:SS
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

  useEffect(() => {
    let playedSongId = localStorage.getItem("Current Song");
    if (playedSongId) {
      playSong(playedSongId);
    }
  }, []);

  // Play song image and setInterval
  useEffect(() => {
    localStorage.setItem("Current Song", songId);

    playSong(songId).then(() => {
      setInterval(() => {
        if (document.getElementById("player-sickbar") !== null) {
          document.getElementById(
            "player-sickbar"
          ).style.background = `linear-gradient(to right, white ${Math.floor(
            (audio.currentTime / audio.duration) * 100
          )}%, gray ${Math.floor(
            (audio.currentTime / audio.duration) * 100
          )}%)`;
          document.getElementById(
            "progressBar"
          ).style.background = `linear-gradient(to right,rgb(255, 255, 255) ${Math.floor(
            (audio.currentTime / audio.duration) * 100
          )}%,#80808094 ${Math.floor(
            (audio.currentTime / audio.duration) * 100
          )}%)`;
          document.getElementById("progressBar").value = Math.floor(
            (audio.currentTime / audio.duration) * 100
          );

          if (audio.paused) {
            document.getElementById("pause").style.display = "block";
            document.getElementById("play").style.display = "none";
            document.getElementById("big-play").style.display = "none";
            document.getElementById("big-pause").style.display = "block";
          } else {
            document.getElementById("big-play").style.display = "block";
            document.getElementById("big-pause").style.display = "none";
          }

          document.getElementById("currentTime").innerHTML = `${convertToMMSS(
            Math.floor(audio?.currentTime)
          )}`;
        }
      }, 1000);
    });
  }, [songId]);

  // on audio load show audio duration
  useEffect(() => {
    audio.onloadeddata = function () {
      document.getElementById("audioDuration").innerHTML = `${convertToMMSS(
        Math.floor(audio?.duration)
      )}`;
    };
  }, [audio.src]);

  // toggle play pause using useEffect
  useEffect(() => {
    if (currSong) {
      if (audio.played) {
        document.getElementById("pause").style.display = "none";
        document.getElementById("play").style.display = "block";
      } else {
        document.getElementById("pause").style.display = "block";
        document.getElementById("play").style.display = "none";
      }
    }
  }, [audio.played]);

  // Toggle play/pause button svg
  function togglePlaypause() {
    if (audio.paused) {
      audio.play();

      document.getElementById("pause").style.display = "none";
      document.getElementById("play").style.display = "block";
      document.getElementById("big-play").style.display = "block";
      document.getElementById("big-pause").style.display = "none";
    } else {
      audio.pause();

      document.getElementById("pause").style.display = "block";
      document.getElementById("play").style.display = "none";
      document.getElementById("big-play").style.display = "none";
      document.getElementById("big-pause").style.display = "block";
    }
  }

  // Change big player progress bar value
  function Progress(e) {
    audio.currentTime = Math.floor((e.target.value / 100) * audio.duration);
  }

  // Shuffle songs
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Next song
  const next = () => {
    let index = song.findIndex((item) => item.id === currSong?.id);
    setCurrIndex(index + 1);

    if (document?.getElementById("shuffle").style.fill === "white") {
      if (index < song.length) {
        let nextSong = song[index + 1];
        setSongId(nextSong?.id);
        localStorage.setItem("isplaylistSong", globalplaylistId + nextSong?.id);
      }
    } else {
      let shuffleindex = shuffledSongs.findIndex(
        (item) => item.id === currSong.id
      );

      if (index < shuffledSongs.length) {
        let nextSong = shuffledSongs[shuffleindex + 1];

        setSongId(nextSong?.id);
        localStorage.setItem("isplaylistSong", globalplaylistId + nextSong?.id);
      }
      if (shuffleindex === shuffledSongs.length - 1) {
        // If we reach the end of the shuffled list, loop back to the start
        let nextSong = shuffledSongs[0];
        setSongId(nextSong?.id);
        localStorage.setItem("isplaylistSong", globalplaylistId + nextSong?.id);
      }
    }
  };

  // Previous song
  const prev = async () => {
    console.log(shuffledSongs);

    let index = song.findIndex((item) => item.id === currSong.id);
    setCurrIndex(index - 1);

    if (document?.getElementById("shuffle").style.fill === "white") {
      if (index > -1) {
        let nextSong = song[index - 1];
        setSongId(nextSong?.id);
        localStorage.setItem("isplaylistSong", globalplaylistId + nextSong?.id);
      }
    } else {
      let shuffleindex = shuffledSongs.findIndex(
        (item) => item.id === currSong.id
      );

      if (shuffleindex < shuffledSongs.length) {
        let nextSong = shuffledSongs[shuffleindex - 1];
        setSongId(nextSong?.id);
        localStorage.setItem("isplaylistSong", globalplaylistId + nextSong?.id);
      }
    }
  };

  // Audio ended

  audio.addEventListener("ended", next, () => {
    if (window.Android && window.Android.songEnded) {
      window.Android.songEnded(); // You handle next song in native if needed
    }
  });

  // On current song changes

  useEffect(() => {
    // let duration = convertToMMSS(Math.floor(currSong?.duration))
    retriveLyrics(
      currSong?.name,
      currSong?.artists.primary,
      currSong?.duration
    );
   
    if ("mediaSession" in navigator && currSong !== undefined) {
       navigator.mediaSession.metadata = new MediaMetadata({  
        title: currSong?.name,
        artist: currSong?.artists.primary[0].name,
        album: "",
        artwork: [
          { src: currSong?.image[2].url, sizes: "96x96", type: "image/png" }
        ],
      
      
      });
      navigator.mediaSession.setActionHandler("play", togglePlaypause);
      navigator.mediaSession.setActionHandler("pause", togglePlaypause);
      navigator.mediaSession.setActionHandler("previoustrack", prev);
      navigator.mediaSession.setActionHandler("nexttrack", next); 
        
    }

  }, [currSong]);

  const lyricElements = document.querySelectorAll(".lyric-line");

  // Update lyrics color based on current time
  audio.addEventListener("timeupdate", () => {
    const currentTime = audio.currentTime;

    // Check if we need to move to next lyric
    if (
      currentLyricIndex < lyrics?.length - 1 &&
      currentTime >= lyrics[currentLyricIndex + 1].time.total
    ) {
      currentLyricIndex++;
    }

    // Check if we need to move back to previous lyric
    if (
      currentLyricIndex > 0 &&
      currentTime < lyrics[currentLyricIndex].time.total
    ) {
      currentLyricIndex--;
    }

    // Update active class
    lyricElements.forEach((element, index) => {
      if (index === currentLyricIndex) {
        element.classList.add("active");
        element.scrollTop = 0;
      }

      if (currentLyricIndex < index) {
        element.classList.remove("active");
      }
      // ...existing code...
    });
  });

  // Favorite the song

  const addToFavorite = async () => {
    try {
      if (localStorage.getItem("FavoriteId")) {
        const id = localStorage.getItem("FavoriteId");
        await axios({
          method: "post",
          url: `https://authentication-seven-umber.vercel.app/api/playlists/add/songs${id}`,
          data: {
            songs: [songId],
            imageUrl: [],
          }, // Body
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }).then((responce) => {
                  document.getElementById("favourited").style.display = "block";
        document.getElementById("favourite").style.display = "none";
        document.getElementById("mini_favorite").style.display ="none"
        document.getElementById("mini_favourited").style.display = "block"
        });
      }
    } catch (error) {
      toast.error("Song is not fevorite");
       document.getElementById("favourited").style.display = "none";
        document.getElementById("favourite").style.display = "block";
        document.getElementById("mini_favorite").style.display ="block"
        document.getElementById("mini_favourited").style.display = "none"
      console.log(error);
    }
  };

  // Remove song from favorite
  const removefromFavorite = async () => {
    try {
      if (localStorage.getItem("FavoriteId")) {
        const id = localStorage.getItem("FavoriteId");
        await axios({
          method: "post",
          url: `https://authentication-seven-umber.vercel.app/api/playlists/remove/songs${id}`,
          data: {
            songs: songId,
          }, // Body
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }).then((responce) => {
           document.getElementById("favourited").style.display = "none";
        document.getElementById("favourite").style.display = "block";
        document.getElementById("mini_favorite").style.display ="block"
        document.getElementById("mini_favourited").style.display = "none"
        });
      }
    } catch (error) {
      toast.error("Song is not removed from fevorite");
        document.getElementById("favourited").style.display = "block";
        document.getElementById("favourite").style.display = "none";
        document.getElementById("mini_favorite").style.display ="none"
        document.getElementById("mini_favourited").style.display = "block"
      console.log(error);
    }
  };

  // Get songId from playlist

  const getSongId = async () => {
    try {
      isFevorite = false;
      let playlistId = localStorage.getItem("FavoriteId");
      await axios({
        method: "get",
        url: `https://authentication-seven-umber.vercel.app/api/playlist${playlistId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((responce) => {
        let songs = responce.data.playlist[0].songs;
        console.log(songs);

        songs.forEach((element) => {
          if (element === songId) {
            isFevorite = true;
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSongId().then(() => {
      if (isFevorite) {
        document.getElementById("favourited").style.display = "block";
        document.getElementById("favourite").style.display = "none";
        document.getElementById("mini_favorite").style.display ="none"
        document.getElementById("mini_favourited").style.display = "block"
      } else {
        document.getElementById("favourited").style.display = "none";
        document.getElementById("favourite").style.display = "block";
        document.getElementById("mini_favorite").style.display ="block"
        document.getElementById("mini_favourited").style.display = "none"
      }
    });
  }, [songId]);

  return (
    <>
      <div
        style={
          document.getElementById("mini_player")?.style.display !== "none"
            ? {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "fixed",
                bottom: "0px",
                width: "100%",
                background: "linear-gradient(0deg, black, transparent)",
                height: "133px",
              }
            : {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "fixed",
                bottom: "0px",
                width: "100%",
                height: "70px",
                background: "linear-gradient(0deg, black, transparent)",
              }
        }
      >
        <header
          style={currSong ? { display: "grid" } : { display: "none" }}
          className="header"
          id="mini_player"
        >
          <div
            style={{
              width: "40px",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => {
              (document.getElementById("big_Player").style.bottom = "0px"),
                (document.getElementById("big_Player").style.opacity = "1"),
                (document.body.style.overflow = "hidden");
            }}
          >
            <img
              crossorigin="anonymous"
              id="playerImg"
              style={{
                width: "40px",
                height: "40px",
                objectFit: "contain",
                borderRadius: "4px",
              }}
              src={currSong?.image[2].url}
              alt=""
            />
          </div>
          <div
            onClick={() => {
              (document.getElementById("big_Player").style.bottom = "0px"),
                (document.getElementById("big_Player").style.opacity = "1")(
                  (document.body.style.overflow = "hidden")
                );
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              whiteSpace: "nowrap",
              width: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                whiteSpace: "nowrap",
                width: "90%",
                overflow: "hidden",
                fontSize: "15px",
                textOverflow: "ellipsis",
                color: "white",
              }}
            >
              {currSong?.name}
            </div>
            <div
              style={{
                whiteSpace: "nowrap",
                width: "100%",
                overflow: "hidden",
                color: "#fff",
                textOverflow: "ellipsis",
                fontSize: "12px",
              }}
            >
              {currSong?.artists.primary.map((artist) => {
                return artist.name;
              })}
            </div>
          </div>

          <div style={{ display: "flex", gap: "15px", padding: "0px 10px" }}>
            {/* like the song */}
            <div
              style={{
                display: "grid",
                alignItems: "center",
                justifyContent: "center",
                fill: "white",
                height: "100%",
                width: "100%",
              }}
            >
              {/* favorite svg */}
              <svg

               onClick={() => {
                      addToFavorite();
                      if (
                        document.getElementById("mini_favourited").style.display ===
                        "none"
                      ) {
                        (document.getElementById("mini_favorite").style.display =
                          "none"),
                          (document.getElementById("mini_favourited").style.display =
                            "block");
                      } else {
                        (document.getElementById("mini_favorite").style.display =
                          "block"),
                          (document.getElementById("mini_favourited").style.display =
                            "none");
                      }
                    }}
                id="mini_favorite"
                data-encore-id="icon"
                role="img"
                aria-hidden="true"
                style={{ width: "22px", height: "22px" }}
                viewBox="0 0 24 24"
              >
                <path d="M5.21 1.57a6.757 6.757 0 0 1 6.708 1.545.124.124 0 0 0 .165 0 6.741 6.741 0 0 1 5.715-1.78l.004.001a6.802 6.802 0 0 1 5.571 5.376v.003a6.689 6.689 0 0 1-1.49 5.655l-7.954 9.48a2.518 2.518 0 0 1-3.857 0L2.12 12.37A6.683 6.683 0 0 1 .627 6.714 6.757 6.757 0 0 1 5.21 1.57zm3.12 1.803a4.757 4.757 0 0 0-5.74 3.725l-.001.002a4.684 4.684 0 0 0 1.049 3.969l.009.01 7.958 9.485a.518.518 0 0 0 .79 0l7.968-9.495a4.688 4.688 0 0 0 1.049-3.965 4.803 4.803 0 0 0-3.931-3.794 4.74 4.74 0 0 0-4.023 1.256l-.008.008a2.123 2.123 0 0 1-2.9 0l-.007-.007a4.757 4.757 0 0 0-2.214-1.194z"></path>
              </svg>

               <svg
                    onClick={() => {
                      removefromFavorite();
                      if (
                        document.getElementById("mini_favorite").style.display ===
                        "block"
                      ) {
                        (document.getElementById("mini_favorite").style.display =
                          "none"),
                          (document.getElementById("mini_favourited").style.display =
                            "block");
                      } else {
                        (document.getElementById("mini_favorite").style.display =
                          "block"),
                          (document.getElementById("mini_favourited").style.display =
                            "none");
                      }
                    }}
                    id="mini_favourited"
                    style={{
                      width: "22px",
                      height: "22px",
                      fill: "#1ed760",
                      display: "none",
                    }}
                    data-encore-id="icon"
                    role="img"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.667 1.912a6.257 6.257 0 0 0-7.462 7.677c.24.906.683 1.747 1.295 2.457l7.955 9.482a2.015 2.015 0 0 0 3.09 0l7.956-9.482a6.19 6.19 0 0 0 1.382-5.234l-.49.097.49-.099a6.3 6.3 0 0 0-5.162-4.98h-.002a6.24 6.24 0 0 0-5.295 1.65.623.623 0 0 1-.848 0 6.26 6.26 0 0 0-2.91-1.568z"></path>
                  </svg>
            </div>

            {/* play pause the song */}
            <div
              style={{
                display: "grid",
                alignItems: "center",
                justifyContent: "center",
                fill: "white",
                height: "100%",
                width: "100%",
              }}
            >
              <svg
                id="pause"
                data-encore-id="icon"
                role="img"
                aria-hidden="true"
                onClick={() => {
                  togglePlaypause();
                }}
                style={{ width: "22px", height: "22px" }}
                viewBox="0 0 24 24"
              >
                <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
              </svg>

              <svg
                id="play"
                data-encore-id="icon"
                role="img"
                aria-hidden="true"
                onClick={() => {
                  togglePlaypause();
                }}
                style={{ width: "22px", height: "22px" }}
                viewBox="0 0 24 24"
              >
                <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
              </svg>
            </div>
          </div>

          <div id="player-sickbar"></div>
        </header>

        <div
          style={{
            position: "fixed",
            width: "100%",
            height: "50px",
            bottom: "0px",
            // backgroundColor: "#000000c7"
            // ...existing code...

            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {/* Home button */}
          <NavLink style={{ textDecoration: "none" }} to="/">
            <div
              className="home"
              style={{
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "2px",
              }}
            >
              {location.pathname !== "/" ? (
                <svg
                  data-encore-id="icon"
                  role="img"
                  aria-hidden="true"
                  style={{ width: "20px", height: "20px", fill: "#B3B3B3" }}
                  viewBox="0 0 24 24"
                >
                  <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z"></path>
                </svg>
              ) : (
                <svg
                  data-encore-id="icon"
                  role="img"
                  aria-hidden="true"
                  //   #B3B3B3
                  style={{ width: "20px", height: "20px", fill: "#fff" }}
                  viewBox="0 0 24 24"
                >
                  <path d="M13.5 1.515a3 3 0 0 0-3 0L3 5.845a2 2 0 0 0-1 1.732V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7.577a2 2 0 0 0-1-1.732l-7.5-4.33z"></path>
                </svg>
              )}
              <div
                style={
                  location.pathname === "/"
                    ? { color: "#fff", fontSize: "12px" }
                    : { color: "#B3B3B3", fontSize: "12px" }
                }
              >
                Home
              </div>
            </div>
          </NavLink>
          {/* Search button */}
          <NavLink style={{ textDecoration: "none" }} to="/search">
            <div
              className="search"
              style={{
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "2px",
              }}
            >
              {!location.pathname.startsWith("/search") ? (
                <svg
                  data-encore-id="icon"
                  role="img"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  style={{
                    width: "20px",
                    height: "20px",
                    fill: "#B3B3B3",
                  }}
                >
                  <path d="M10.533 1.27893C5.35215 1.27893 1.12598 5.41887 1.12598 10.5579C1.12598 15.697 5.35215 19.8369 10.533 19.8369C12.767 19.8369 14.8235 19.0671 16.4402 17.7794L20.7929 22.132C21.1834 22.5226 21.8166 22.5226 22.2071 22.132C22.5976 21.7415 22.5976 21.1083 22.2071 20.7178L17.8634 16.3741C19.1616 14.7849 19.94 12.7634 19.94 10.5579C19.94 5.41887 15.7138 1.27893 10.533 1.27893ZM3.12598 10.5579C3.12598 6.55226 6.42768 3.27893 10.533 3.27893C14.6383 3.27893 17.94 6.55226 17.94 10.5579C17.94 14.5636 14.6383 17.8369 10.533 17.8369C6.42768 17.8369 3.12598 14.5636 3.12598 10.5579Z"></path>
                </svg>
              ) : (
                <svg
                  data-encore-id="icon"
                  role="img"
                  aria-hidden="true"
                  style={{ width: "20px", height: "20px", fill: "#fff" }}
                  viewBox="0 0 24 24"
                >
                  <path d="M15.356 10.558c0 2.623-2.16 4.75-4.823 4.75-2.664 0-4.824-2.127-4.824-4.75s2.16-4.75 4.824-4.75c2.664 0 4.823 2.127 4.823 4.75z"></path>
                  <path d="M1.126 10.558c0-5.14 4.226-9.28 9.407-9.28 5.18 0 9.407 4.14 9.407 9.28a9.157 9.157 0 0 1-2.077 5.816l4.344 4.344a1 1 0 0 1-1.414 1.414l-4.353-4.353a9.454 9.454 0 0 1-5.907 2.058c-5.18 0-9.407-4.14-9.407-9.28zm9.407-7.28c-4.105 0-7.407 3.274-7.407 7.28s3.302 7.279 7.407 7.279 7.407-3.273 7.407-7.28c0-4.005-3.302-7.278-7.407-7.278z"></path>
                </svg>
              )}

              <div
                style={
                  location.pathname.startsWith("/search")
                    ? { color: "#fff", fontSize: "12px" }
                    : { color: "#B3B3B3", fontSize: "12px" }
                }
              >
                Search
              </div>
            </div>
          </NavLink>

          {/* Library button */}
          <NavLink style={{ textDecoration: "none" }} to="/library">
            <div
              className="library"
              style={{
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "2px",
              }}
            >
              <svg
                data-encore-id="icon"
                role="img"
                aria-hidden="true"
                style={
                  !location.pathname.startsWith("/library")
                    ? { width: "20px", height: "20px", fill: "#B3B3B3" }
                    : { width: "20px", height: "20px", fill: "#fff" }
                }
                viewBox="0 0 24 24"
              >
                <path d="M14.5 2.134a1 1 0 0 1 1 0l6 3.464a1 1 0 0 1 .5.866V21a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V3a1 1 0 0 1 .5-.866zM16 4.732V20h4V7.041l-4-2.309zM3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zm6 0a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1z"></path>
              </svg>

              <div
                style={
                  location.pathname.startsWith("/library")
                    ? { color: "#fff", fontSize: "12px" }
                    : { color: "#B3B3B3", fontSize: "12px" }
                }
              >
                Library
              </div>
            </div>
          </NavLink>
        </div>
        {/* big player */}
        <div
          id="big_Player"
          style={{
            position: "fixed",
            zIndex: "10000",
            bottom: "-100%",
            height: "100%",
            width: "100%",
            backgroundColor: "gray",
            padding: "10px",
            opacity: "0",
            overflow: "scroll",
            scrollSnapType: "none",
            transition: "all .3s ",
          }}
        >
          <header
            style={{
              width: "100%",
              height: "30px",
              padding: "25px 5px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              style={{
                width: "30px",
                height: "30px",
                backgroundColor: "transparent",
                border: "none",
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => {
                (document.getElementById("big_Player").style.bottom = "-100%"),
                  (document.getElementById("big_Player").style.opacity = "0"),
                  (document.body.style.overflow = "auto");
              }}
            >
              <svg
                data-encore-id="icon"
                role="img"
                aria-hidden="true"
                style={{ width: "22px", height: "22px", fill: "white" }}
                viewBox="0 0 24 24"
              >
                <path d="M2.793 8.043a1 1 0 0 1 1.414 0L12 15.836l7.793-7.793a1 1 0 1 1 1.414 1.414L12 18.664 2.793 9.457a1 1 0 0 1 0-1.414z"></path>
              </svg>
            </button>
            <div
              style={{
                width: "100%",
                padding: "0px 20px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: "white",
                fontSize: "14px",
              }}
            >
              {currSong?.name}
            </div>
          </header>

          <div
            style={{
              display: "grid",
              flexDirection: "column",
              gridTemplateRows: "1fr 1fr",
              width: "100%",
              height: "100%",
              padding: "0px 10px",
              marginTop: "0%",
              gap: "10px",
              // gap: "3%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                alignItems: "center",
                marginTop: "5%",
              }}
            >
              <div
                style={{
                  backgroundImage: `url(${currSong?.image[2].url})`,
                  width: "100%",
                  height: "100%",
                  borderRadius: "10px",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "50%",
                  overflow: "hidden",
                  filter:
                    "drop-shadow(0 0 1px rgba(0, 0, 0, .3)) drop-shadow(0 0 10px rgba(0, 0, 0, .3))",
                }}
              ></div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
                // marginTop: "5%",
                // justifyContent: "center",
                marginTop: "35px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "8fr 1fr",
                  alignItems: "center",
                  gap: "20px",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      fontSize: "22px",
                      color: "white",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {currSong?.name}
                  </div>
                  <div style={{ fontSize: "14px", color: "white" }}>
                    {currSong?.artists.primary[0].name}
                  </div>
                </div>
                {/* favorite the song */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    onClick={() => {
                      addToFavorite();
                      if (
                        document.getElementById("favourited").style.display ===
                        "none"
                      ) {
                        (document.getElementById("favourite").style.display =
                          "none"),
                          (document.getElementById("favourited").style.display =
                            "block");
                      } else {
                        (document.getElementById("favourite").style.display =
                          "block"),
                          (document.getElementById("favourited").style.display =
                            "none");
                      }
                    }}
                    data-encore-id="icon"
                    role="img"
                    aria-hidden="true"
                    id="favourite"
                    style={{
                      width: "25px",
                      height: "25px",
                      fill: "white",
                      display: "block",
                    }}
                    viewBox="0 0 24 24"
                  >
                    <path d="M5.21 1.57a6.757 6.757 0 0 1 6.708 1.545.124.124 0 0 0 .165 0 6.741 6.741 0 0 1 5.715-1.78l.004.001a6.802 6.802 0 0 1 5.571 5.376v.003a6.689 6.689 0 0 1-1.49 5.655l-7.954 9.48a2.518 2.518 0 0 1-3.857 0L2.12 12.37A6.683 6.683 0 0 1 .627 6.714 6.757 6.757 0 0 1 5.21 1.57zm3.12 1.803a4.757 4.757 0 0 0-5.74 3.725l-.001.002a4.684 4.684 0 0 0 1.049 3.969l.009.01 7.958 9.485a.518.518 0 0 0 .79 0l7.968-9.495a4.688 4.688 0 0 0 1.049-3.965 4.803 4.803 0 0 0-3.931-3.794 4.74 4.74 0 0 0-4.023 1.256l-.008.008a2.123 2.123 0 0 1-2.9 0l-.007-.007a4.757 4.757 0 0 0-2.214-1.194z"></path>
                  </svg>

                  <svg
                    onClick={() => {
                      removefromFavorite();
                      if (
                        document.getElementById("favourite").style.display ===
                        "block"
                      ) {
                        (document.getElementById("favourite").style.display =
                          "none"),
                          (document.getElementById("favourited").style.display =
                            "block");
                      } else {
                        (document.getElementById("favourite").style.display =
                          "block"),
                          (document.getElementById("favourited").style.display =
                            "none");
                      }
                    }}
                    id="favourited"
                    style={{
                      width: "25px",
                      height: "25px",
                      fill: "#1ed760",
                      display: "none",
                    }}
                    data-encore-id="icon"
                    role="img"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.667 1.912a6.257 6.257 0 0 0-7.462 7.677c.24.906.683 1.747 1.295 2.457l7.955 9.482a2.015 2.015 0 0 0 3.09 0l7.956-9.482a6.19 6.19 0 0 0 1.382-5.234l-.49.097.49-.099a6.3 6.3 0 0 0-5.162-4.98h-.002a6.24 6.24 0 0 0-5.295 1.65.623.623 0 0 1-.848 0 6.26 6.26 0 0 0-2.91-1.568z"></path>
                  </svg>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0px",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <input
                  className="player-progress-bar"
                  id="progressBar"
                  onChange={Progress}
                  type="range"
                  min="0"
                  max="100"
                  // value={Math.floor(audio.currentTime/audio.duration*100)}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div id="currentTime" style={{ fontSize: "12px" }}></div>

                  <div id="audioDuration" style={{ fontSize: "12px" }}></div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <button
                  style={{
                    width: "55px",
                    height: "55px",
                    border: "none",
                    borderRadius: "50%",
                    backgroundColor: "transparent",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className="big-player-button"
                  onClick={() => {
                    document.getElementById("shuffle").style.fill !== "white"
                      ? (document.getElementById("shuffle").style.fill =
                          "white")
                      : // clone to avoid modifying original
                        ((document.getElementById("shuffle").style.fill =
                          "#1ed760"),
                        setShuffledSongs(shuffle([...song])));
                  }}
                >
                  <svg
                    id="shuffle"
                    data-encore-id="icon"
                    role="img"
                    aria-hidden="true"
                    style={{ width: "25px", height: "25px", fill: "white" }}
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.788 3.702a1 1 0 0 1 1.414-1.414L23.914 6l-3.712 3.712a1 1 0 1 1-1.414-1.414L20.086 7h-1.518a5 5 0 0 0-3.826 1.78l-7.346 8.73a7 7 0 0 1-5.356 2.494H1v-2h1.04a5 5 0 0 0 3.826-1.781l7.345-8.73A7 7 0 0 1 18.569 5h1.518l-1.298-1.298z"></path>
                    <path d="M18.788 14.289a1 1 0 0 0 0 1.414L20.086 17h-1.518a5 5 0 0 1-3.826-1.78l-1.403-1.668-1.306 1.554 1.178 1.4A7 7 0 0 0 18.568 19h1.518l-1.298 1.298a1 1 0 1 0 1.414 1.414L23.914 18l-3.712-3.713a1 1 0 0 0-1.414 0zM7.396 6.49l2.023 2.404-1.307 1.553-2.246-2.67a5 5 0 0 0-3.826-1.78H1v-2h1.04A7 7 0 0 1 7.396 6.49z"></path>
                  </svg>
                </button>
                <button
                  style={{
                    width: "55px",
                    height: "55px",
                    border: "none",
                    borderRadius: "50%",
                    backgroundColor: "transparent",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className="big-player-button"
                  onClick={prev}
                >
                  <svg
                    data-encore-id="icon"
                    role="img"
                    aria-hidden="true"
                    class="e-9812-icon e-9812-baseline"
                    style={{ width: "30px", height: "30px", fill: "white" }}
                    viewBox="0 0 24 24"
                  >
                    <path d="M6.3 3a.7.7 0 0 1 .7.7v6.805l11.95-6.899a.7.7 0 0 1 1.05.606v15.576a.7.7 0 0 1-1.05.606L7 13.495V20.3a.7.7 0 0 1-.7.7H4.7a.7.7 0 0 1-.7-.7V3.7a.7.7 0 0 1 .7-.7h1.6z"></path>
                  </svg>
                </button>
                <button
                  style={{
                    width: "65px",
                    height: "65px",
                    border: "none",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="big-player-button"
                  onClick={togglePlaypause}
                >
                  {/* {audio.paused? */}
                  <svg
                    id="big-pause"
                    data-encore-id="icon"
                    role="img"
                    aria-hidden="true"
                    style={{
                      width: "25px",
                      height: "25px",
                      fill: "black",
                      display: "none",
                    }}
                    viewBox="0 0 24 24"
                  >
                    <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
                  </svg>
                  {/* : */}
                  <svg
                    id="big-play"
                    style={{ width: "25px", height: "25px", fill: "black" }}
                    data-encore-id="icon"
                    role="img"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
                  </svg>
                  {/* } */}
                </button>
                <button
                  style={{
                    width: "55px",
                    height: "55px",
                    border: "none",
                    borderRadius: "50%",
                    backgroundColor: "transparent",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className="big-player-button"
                  onClick={next}
                >
                  <svg
                    data-encore-id="icon"
                    role="img"
                    aria-hidden="true"
                    style={{ width: "30px", height: "30px", fill: "white" }}
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.7 3a.7.7 0 0 0-.7.7v6.805L5.05 3.606A.7.7 0 0 0 4 4.212v15.576a.7.7 0 0 0 1.05.606L17 13.495V20.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-1.6z"></path>
                  </svg>
                </button>

                <button
                  style={{
                    width: "55px",
                    height: "55px",
                    border: "none",
                    borderRadius: "50%",
                    backgroundColor: "transparent",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    audio.loop
                      ? ((audio.loop = false),
                        (document.getElementById("loop-button").style.fill =
                          "white"))
                      : ((audio.loop = true),
                        (document.getElementById("loop-button").style.fill =
                          "#1ed760"));
                  }}
                  className="big-player-button"
                >
                  <svg
                    id="loop-button"
                    data-encore-id="icon"
                    role="img"
                    aria-hidden="true"
                    style={{ width: "25px", height: "25px", fill: "white" }}
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 2a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h1v-2H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-4.798l1.298-1.298a1 1 0 1 0-1.414-1.414L9.373 19l3.713 3.712a1 1 0 0 0 1.414-1.414L13.202 20H18a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5H6z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* </div> */}

          {/* {lyrics?.length !== 0 */}
          {/* ? */}
          <div
            id="lyrics-container"
            style={{
              width: "100%",
              height: "500px",
              backgroundColor: "maroon",
              borderRadius: "15px",
              overflow: "scroll",
              fontSize: "26px",
              padding: "10px 10px",
              filter:
                "drop-shadow(rgba(0, 0, 0, 0.3) 0px 0px 1px) drop-shadow(rgba(0, 0, 0, 0.3) 0px 0px 10px)",
            }}
          ></div>
          {/* :""
        } */}
        </div>
      </div>
    </>
  );
}

export default Footer;
