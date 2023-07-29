import Rating from "@mui/material/Rating/Rating";
import { useState } from "react";

function ContentViewer() {
    const [rating, setRating] = useState<number | null>(null);
    return (<>

        <div className="contentViewer contentFade" id="contentViewer">
            <img id="imageBGOV2" src="#" alt="#" style={{ width: "100vw", height: "auto" }} />
            <div className="onContentViewer">
                <div id="ColCover">
                    <img src="" id="ImgColCover" alt="#" />
                </div>
                <div id="ColTitle"></div>
                <div id="ColContent">
                    <p id="Status"></p>
                    <div id="startDate"></div>

                    <div id="btnsActions">
                        <a href="#" id="playbutton"><i className="material-icons">play_arrow</i></a>
                        <a href="#" id="checkbtn"> <i className="material-icons">check</i></a>
                        <a href="#" id="readingbtndetails"> <i className="material-icons">auto_stories</i></a>
                        <a href="#" id="decheckbtn"> <i className="material-icons" >close</i></a>
                        <a href="#" id="favoritebtn"> <i className="material-icons" >favorite</i></a>
                        <a href="#" data-bs-target="#editmodal" data-bs-toggle="modal" id="editmodalBtn"> <i
                            className="material-icons"
                        >edit</i></a>
                        <a href="#" id="DLBOOK"> <i className="material-icons">download</i></a>
                        <a href="#" id="refreshBtn"> <i className="material-icons" id="refresh">refresh</i></a>
                        <a href="#" id="rematchBtn"> <i className="material-icons" id="rematch"
                        >youtube_searched_for</i></a>
                        <div className="rating">
                            <Rating name="no-value" value={rating} onChange={
                                (event, newValue) => {
                                    setRating(newValue);
                                    // changeRating('Series', newValue);
                                }
                            } />
                        </div>
                    </div>
                    <div id="price"></div>

                    <div id="description"></div>
                    <div id="averageProgress">

                        <div className="circle-small">
                            <div className="text">
                                <div id="averageScore"></div>
                            </div>
                            <svg>
                                <circle className="bg" cx="40" cy="40" r="37"></circle>
                                <circle className="progress one" cx="40" cy="40" r="37"></circle>
                            </svg>
                        </div>

                    </div>

                    <div id="genres"></div>
                    <div id="chapters"></div>
                    <div id="id"></div>
                    <div id="colissue"></div>
                    <div id="col"></div>
                    <div id="Volumes"></div>
                    <div id="Trending"></div>
                    <div id="readstat"><input type="number" step="1" min="0" id="readAddInput" /></div>
                    <div id="detailSeparator" style={{ marginTop: "30vh" }}></div>
                    <div id="ContentView">
                        <h2 id="volumesLabel">Volumes : </h2>
                    </div>
                    <div id="characters"></div>
                    <div id="Staff"></div>
                    <div id="SiteURL"></div>
                    <div id="OtherTitles"></div>
                    <div id="relations" className="relationsDiv"></div>
                    <div style={{ textAlign: "center" }}><p id="provider_text"></p></div>


                </div>

            </div>
        </div>
    </>);
}

export default ContentViewer;