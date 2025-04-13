import html2canvas from "html2canvas";
import { useRef } from 'react';
import React, { useEffect, useState } from "react"
export default function CaptionEditor(){
    const[quote ,setQuote]= useState({
        quote: "I think, therefore I am.",
        author: "René Descartes",
        imageUrl: "https://images-assets.nasa.gov/image/201211020015HQ/201211020015HQ~medium.jpg"
    })
    const captureRef = useRef();
    const[spaceImages ,setSpaceImages]= useState([])
    useEffect(()=>{
        fetch("https://images-api.nasa.gov/search?q=space&media_type=image")
        .then(res=>res.json())
        .then(data=>{
            const items = data.collection.items;
            const imageUrls = items
              .map(item => item.links?.[0]?.href)
            setSpaceImages(imageUrls);
          })

    },[])
    function getspaceImage() {
        const randomNumber = Math.floor(Math.random() * spaceImages.length)
        const newimageUrl = spaceImages[randomNumber]
        setQuote(previmage => ({
            ...previmage,
            imageUrl: newimageUrl
        }))
    }

    function handleChange(event){
        const{value , name}=event.currentTarget;
        setQuote(prevQuote=>({
            ...prevQuote ,
            [name]:value
        })
        )
    }
    const handleDownload = () => {
        html2canvas(captureRef.current).then(canvas => {
          const link = document.createElement('a'); // create a download link
          link.download = 'cosmic-caption.png'; // name of file
          link.href = canvas.toDataURL('image/png'); // get image data
          link.click(); // download it
        });
      };
      const handleSahre =()=>{
        if (navigator.share) {
            navigator.share({
              title: 'Cosmic Caption',
              text: 'Check out this awesome cosmic caption!',
              url: window.location.href,
            }).catch(console.error);
          } else {
            alert('Sharing not supported.');
          }
      }
    return(
        <main>
            <div className="form">
                <div className="input_fields">
                <label>Quote
                    <input 
                    type="text"
                    name="quote"
                    placeholder="I think, therefore I am."
                    onChange={handleChange}
                    />  
                </label>
                <label>Author
                    <input 
                    type="text"
                    name="author"
                    placeholder=" René Descartes"
                    onChange={handleChange}
                    />  
                </label>
                </div>
                <button onClick={getspaceImage}>Get a new image 🔮</button>
                <div className="img-container"  ref={captureRef}>
                 < img src={quote.imageUrl} alt="space img" className="space_img" />
                <span className="quote">{quote.quote}</span>
                <span className="author">{quote.author}</span>
                 </div>
                 <div className="input_fields">
                 <button onClick={handleDownload}>Download</button>
                 <button onClick={handleSahre}>Share</button>
                 </div>
            </div>
        </main>
    )
}
