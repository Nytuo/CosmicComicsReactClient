import { useLayoutEffect } from "react";

function StarBackground() {
    function createStarBackground(numStars: number, animDelay: number) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const starsContainer = document.createElement('div');
        starsContainer.classList.add('stars-container');
        for (let i = 0; i < numStars; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
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
        document.querySelector("body")?.appendChild(starsContainer);
    }
    useLayoutEffect(() => {
        createStarBackground(200, 120);
    }, []);
    return (
        <></>
    );
}

export default StarBackground;