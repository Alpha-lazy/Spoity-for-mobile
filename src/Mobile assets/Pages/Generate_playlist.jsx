import React, { useEffect, useState } from 'react'
import OpenAI from 'openai/index.mjs'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
// import aiIcon from "C:/Users/HP/Desktop/spotify clone/AlphaMusic Updated - Copy/src/Images/ai_icon.png"
import aiIcon from "../../Images/ai_icon.png"
import "./mobile.css"

function Generate_playlist() {
    const [prompt, setPrompt] = useState("")
    const [response, setResponse] = useState({});
    const [songIds, setSongIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
    const interval = setInterval(() => {
      // setDots((prev) => (prev.length < 3 ? prev + "." : ""));
      if (document.getElementById("text").textContent.length > 13) {
        
        document.getElementById("text").innerText = "Generating.";
      }
      else{
      document.getElementById("text").innerText += ".";
      }
    }, 500); // change speed here
    return () => clearInterval(interval);
  }, []);
  
    // create openAi object
    const openai = new OpenAI({
        apiKey:import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
    })

    //  get songs id by searching the song name
  const getsongIds = async(songs,name) =>{
     let newIds = [];
     let images = []
         for (let index = 0; index < songs.length; index++) {
            
          
           
           
            const responce = await axios.request({
              method:"GET",
              url:"https://jiosavan-api2.vercel.app/api/search",
              params:{
                query:songs[index].title + " " + songs[index].artist,
              }

            })
            if (responce.data.data?.songs?.results[0]?.id !== undefined) {
              let id  = responce.data.data?.songs?.results[0]?.id;
              images.push(responce.data.data?.songs?.results[0]?.image[2]?.url);
              newIds.push(id)
           
             
              
            }
            
         }
             setSongIds(newIds)
            createPlaylist(newIds,name,images)
          
        
       
          
    }
    
    
  
  //  create the playlist
      const createPlaylist = async(ids,name,images) =>{

           
             try {
               if (localStorage.getItem("token")) {
                 await axios({
                   method: "post",
                   url: "https://authentication-seven-umber.vercel.app/api/create/playlist",
                   data:{
                    name:name,
                    songs:ids,
                    imageUrl:images,
                    desc:""
                   }, // Body
                   headers: {
                     "Content-Type": "application/json",
                     Authorization: `Bearer ${localStorage.getItem("token")}`,
                   },
                 })
                   .then((response) => {
                       navigate(`/playlist/${response.data.playlistId}`)
                       setLoading(false)
                       toast.success(response.data.message, { duration: 2000 });
                     
                   })
                   .catch((error) => {
                     console.log(error);
                     toast.error(error.response.data.message, { duration: 2000 });
                   });
               } else {
                 toast.error("Please login or signup first");
               }
             } catch (error) {
               toast.error("Internla server Error");
             }
         
    }
   

                                        
  //  generate playlist info using openai
    const generate_info = async(prompt) => {
      console.log("Generating.......");
      
        try{
        const responce = await openai.chat.completions.create({
            model:"gpt-4o-mini",
            messages:[
                {
                    role:"system",
                    content: `You are an expert music curator.
                            The user will describe a playlist they want.
                            Respond ONLY in JSON with:
                            - playlist_name
                            - songs: list of 10 objects { "title": "...", "artist": "..." }

                            Do not add explanations, only JSON.`
                            
                            
                },
                {
                    role:"user", 
                    content:prompt
                }
            ],
            response_format: { type: "json_object" }
        })

         let parsed;
        try {
            parsed = JSON.parse(responce.choices[0].message.content);
        } catch (err) {
            console.error("Failed to parse JSON:", err);
            return;
        }
        setResponse(parsed);
        getsongIds(parsed.songs,parsed.playlist_name)
       


        console.log("success......");
        

        }catch(error){
            console.log("Error generating playlist:", error)
            return null
        }
    }

    
  return (
    <div style={{padding:"10px",gap:"20px",display:"flex",alignItems:"center",flexDirection:"column"}}>
      <textarea
      placeholder='Describe your ideal playlist...'
      style={{width:"100%",height:"150px",borderRadius:"10px",padding:"10px",fontSize:"16px",backgroundColor:"#141313",marginTop:"15px"}}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      >
         
      </textarea>

      <button  style={{width:"50%",padding:"10px 13px",borderRadius:"30px",border:"none",backgroundColor:"white",color:"black",display:"flex",alignItems:"center",gap:"10px"}} onClick={()=>{generate_info(prompt),setLoading(true)}}>
        Generate playlist <img src={aiIcon}  style={{width:"20px",height:"20px"}} alt="" srcset="" />
      </button>

      <div style={{display:"flex",alignItems:"center",flexDirection:"column",gap:"10px",width:"80%",textAlign:"center",fontSize:"12px",color:"#272626ff"}}>
        
            <p>
              It takes few minutes to generate <br />
              It redirect to another page when it generates the playlist <br/>
              Please wait until it redirects
            
            </p>


    {loading?<div className="flex justify-center items-center h-screen">
      <img src={aiIcon} alt="AI Loader" className="ai-spin-glow" />

      <div id="text" style={{color:"white",marginTop:"10px",fontSize:"13px"}}>
        Generating...
      </div>
    </div>:""}
    
      </div>
    </div>
  )
}

export default Generate_playlist
