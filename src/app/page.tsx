"use client";
import {useEffect, useLayoutEffect} from "react";

export default function Home() {
  function createStarBackground(numStars: number, animDelay:number) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const starsContainer = document.createElement('div');
    starsContainer.classList.add('stars-container');
    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      star.classList.add('bg-black');
      star.classList.add('dark:bg-white');
      star.style.animationName = "starAnimation";
      star.style.animationDelay = `${Math.random() * animDelay}s`;
      star.style.animationDuration = `${(Math.random() * animDelay + 1) / 1.25}s`;
      star.style.animationIterationCount = 'infinite';
      // Generate random position within screen limits
      const x = (Math.random() * screenWidth);
      const y = (Math.random() * screenHeight);
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      starsContainer.appendChild(star);
    }
    console.log(starsContainer);
    document.querySelector("#star")?.appendChild(starsContainer);
  }

  useLayoutEffect(() => {
    createStarBackground(200, 120);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  });

  return (<>

  <div style={{marginTop:"15px",marginLeft: "auto",marginRight: "auto"}}>

    <div className={"text-center"} style={{marginTop: "30vh"}}>
      <img src="Images/Logo.png" alt="" width="auto" height="180px" id="logo_id"
           className="navbar-brand rotate linear infinite"/>
      <img src="Images/LogoTxt.png" alt="" id="logo_id_txt" height="180px" className="navbar-brand"/>

      <svg viewBox="0 0 50 50" className="spinner" style={{
        display: "block",
        textAlign: "center",
        marginLeft: "47vw",
        marginTop: "10vh"}}>
        <circle className="ring" cx="25" cy="25" r="22.5"/>
        <circle className="line" cx="25" cy="25" r="22.5"/>
      </svg>
      <div style={{marginLeft: "auto",marginRight: "auto"}} className="mdc-circular-progress"></div>
    </div>
  </div></>
  )
}
