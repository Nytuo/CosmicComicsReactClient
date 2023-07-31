import { PDP, currentProfile } from "@/utils/Common.ts";
import { IBook } from "@/utils/IBook";
import { providerEnum } from "@/utils/utils.ts";
import Rating from "@mui/material/Rating/Rating";
import { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
//providerEnum to type
type TProvider = providerEnum.Marvel | providerEnum.Anilist | providerEnum.MANUAL | providerEnum.OL | providerEnum.GBooks;
function ContentViewer({ provider, TheBook, type }: {
    provider: TProvider;
    TheBook: IBook;
    type: 'series' | 'volume';
}) {
    const [rating, setRating] = useState<number | null>(null);
    const { t } = useTranslation();

    useLayoutEffect(() => {
        const handleAsyncBG = async () => {
            if (TheBook.URLCover != null && TheBook.URLCover !== "null") {
                console.log("TheBook.URLCover", TheBook.URLCover);
                const options = {
                    method: "GET", headers: {
                        "Content-Type": "application/json", "img": TheBook.URLCover
                    }
                };
                await fetch(PDP + "/img/getPalette/" + currentProfile.getToken, options).then(function (response) {
                    return response.text();
                }).then(function (data) {
                    const Blurcolors = data;
                    setTimeout(function () {
                        document.documentElement.style.setProperty("--background", Blurcolors.toString());
                    }, 500);
                });
            }
        };
        handleAsyncBG();
    }, [TheBook.URLCover]);
    return (<>

        <div className="contentViewer contentFade" id="contentViewer">
            <img id="imageBGOV2" src="#" alt="#" style={{ width: "100vw", height: "auto" }} />
            <div className="onContentViewer">
                <div id="ColCover">
                    <img src={
                        TheBook.URLCover.includes("public/FirstImagesOfAll") ? TheBook.URLCover.split("public/")[1] : TheBook.URLCover
                    } id="ImgColCover" alt="#" />
                </div>
                <div id="ColTitle">{
                    (provider === providerEnum.Marvel) ?
                        <a target='_blank' href={((TheBook.URLs == null) ? ("#") : (JSON.parse(TheBook.URLs)[0].url))} style={{ color: 'white' }}>{TheBook.NOM}<i style={{ fontSize: '18px', top: '-10px', position: 'relative' }} className='material-icons'>open_in_new</i></a>
                        : (provider === providerEnum.Anilist) ?
                            <a target='_blank' style={{ color: 'white' }}>{TheBook.NOM}</a> :
                            <a target='_blank' style={{ color: 'white' }}>{TheBook.NOM}</a>
                }</div>
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

                    <div id="description">
                        {
                            (TheBook.description != null && TheBook.description !== "null") ? TheBook.description : ""
                        }
                    </div>
                    {
                        type === 'series' ? <div id="averageProgress">

                            <div className="circle-small">
                                <div className="text">
                                    <div id="averageScore"></div>
                                </div>
                                <svg>
                                    <circle className="bg" cx="40" cy="40" r="37"></circle>
                                    <circle className="progress one" cx="40" cy="40" r="37"></circle>
                                </svg>
                            </div>

                        </div> : <></>
                    }


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
                    <div style={{ textAlign: "center" }}><p id="provider_text">{((provider === providerEnum.Marvel) ? (t("providedBy") + " Marvel. © 2014 Marvel") : ((provider === providerEnum.Anilist) ? (t("providedBy") + " Anilist.") : ((provider === providerEnum.MANUAL) ? (t("notFromAPI")) : ((provider === providerEnum.OL) ? (t("providedBy") + " OpenLibrary.") : ((provider === providerEnum.GBooks) ? (t("providedBy") + " Google Books.") : "")))))}</p></div>
                </div>

            </div>
        </div >
    </>);
}

export default ContentViewer;