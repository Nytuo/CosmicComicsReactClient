/*This file is part of Cosmic-comics.

Cosmic-Comics is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Cosmic-Comics is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Cosmic-Comics.  If not, see <https://www.gnu.org/licenses/>.*/
//Variables declaration
//All other variables and constants

let imagelink = "null";
let listOfImages = [];
let name_of_the_current_book = "";
let readonly = false;


let sidebarMini = false;
let searchtoggle = true;
if (currentProfile.getToken == null) {
    window.location.href = "login.html";
} else {
    fetch(PDP + "/profile/logcheck/" + currentProfile.getToken).then(function (response) {
        return response.text();
    }).then(async function (data) {
        if (data === "false") {
            window.location.href = "login.html";
        } else {
            currentProfile.setName = data;
            document.getElementById("icon_id_accountSystem").src = currentProfile.getPP;
            fetch(PDP + "/config/getConfig/" + currentProfile.getToken).then(function (response) {
                return response.text();
            }).then(function (data) {
                let d = SearchInJSON("display_style", JSON.parse(data));
                let cardMode = _01toBool(d);
            }).catch(function (error) {
                console.log(error);
            });
            fetch(PDP + "/config/getConfig/" + currentProfile.getToken).then(function (response) {
                return response.text();
            }).then(function (data) {
                currenttheme = SearchInJSON("theme", JSON.parse(data));
                console.log(currenttheme);
                Themes();
            }).catch(function (error) {
                console.log(error);
            });
            fetch(PDP + "/config/getConfig/" + currentProfile.getToken).then(function (response) {
                return response.text();
            }).then(function (data) {
                let currenttheme = SearchInJSON("theme", JSON.parse(data));
                console.log(currenttheme);
                setTheme(currenttheme);
            }).catch(function (error) {
                console.log(error);
            });
        }
    }).catch(function (error) {
        console.log(error);
    });
}
let cardMode = true;
//Search element on the JSON
function SearchInJSON(search, info) {
    for (let i in info) {
        if (i === search) {
            return info[i];
        }
    }
    return null;
}



let theme_FG = "white";
let currenttheme;
document.getElementsByTagName("html")[0].className = "black";
document.getElementById("btn_close_icon_about").className = "btn-close btn-close-white";
let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});
new bootstrap.Tooltip(document.getElementById("search"), {
    title: language["search"],
    placement: "bottom"
});
new bootstrap.Tooltip(document.getElementById("menuid"), {
    title: language["navigation"],
    placement: "bottom"
}); new bootstrap.Tooltip(document.getElementById("id_accountSystem"), {
    title: language["userAccount"],
    placement: "bottom"
}); new bootstrap.Tooltip(document.getElementById("id_createLib"), {
    title: language["addLib"],
    placement: "bottom"
}); new bootstrap.Tooltip(document.getElementById("id_opnfile"), {
    title: language["open_file"],
    placement: "bottom"
}); new bootstrap.Tooltip(document.getElementById("id_addTrackedBook"), {
    title: language["TRACKER"],
    placement: "bottom"
}); new bootstrap.Tooltip(document.getElementById("id_bm"), {
    title: language["Bookmark"],
    placement: "bottom"
}); new bootstrap.Tooltip(document.getElementById("id_settings"), {
    title: language["settings"],
    placement: "bottom"
}); new bootstrap.Tooltip(document.getElementById("id_firstOfAll"), {
    title: language["ExtractMissingImg"],
    placement: "bottom"
}); new bootstrap.Tooltip(document.getElementById("id_tips-btn"), {
    title: language["wiki"],
    placement: "bottom"
}); new bootstrap.Tooltip(document.getElementById("id_info"), {
    title: language["about"],
    placement: "bottom"
}); new bootstrap.Tooltip(document.getElementById("id_openDL"), {
    title: language["download"],
    placement: "bottom"
});

document.getElementById("upload").innerText = language["upload"];
document.getElementById("HOMELIB").innerText = language["HOME"];
document.getElementById("close_libUpload").innerText = language["close"];
document.getElementById("resetBtn").innerText = language["resetBtn"];
document.getElementById("uploadBtn").innerText = language["uploadBtn"];
document.getElementById("id_lib").innerText = language["addLib"];
document.getElementById("nameOfLib").innerText = language["nameOfLib"];
document.getElementById("locationOnServer").innerText = language["locationOnServer"];
document.getElementById("opt0").innerText = language["selectAProvider"];
document.getElementById("sendlib").innerText = language["addLib"];
document.getElementById("close_lib").innerText = language["close"];
document.getElementById("id_moreinfo").innerText = language["moreInfo"];
document.getElementById("close_moreinfo").innerText = language["close"];
document.getElementById("close_rematchModal").innerText = language["close"];
document.getElementById("rematchTitle").innerText = language["rematchTitle"];
document.getElementById("rematchSearch").placeholder = language["rematchSearch"];
document.getElementById("rematchYearSearch").placeholder = language["rematchYearSearch"];
document.getElementById("searchField").placeholder = language["searchInLibrary"];
document.getElementById("rematchSearchSender").innerText = language["rematchSearchSender"];
document.getElementById("APISelectorTitle").innerText = language["APISelectorTitle"];
document.getElementById("Ropt0").innerText = language["selectAProvider"];
document.getElementById("close_apiselector").innerText = language["close"];
document.getElementById("navigation").innerText = language["navigation"];
document.getElementById("close_nav").innerText = language["close"];
document.getElementById("id_about").innerText = language["about"];
document.getElementById("version").innerText = language["version"];
document.getElementById("createdby").innerText = language["createdby"];
document.getElementById("usewhat").innerHTML = language["technology_used"];
document.getElementById("seewhere").innerHTML = language["github_promoted"];
document.getElementById("translated").innerText = language["translation"];
let betaTest = ["THEO LEPRINCE"]
document.getElementById("beta_test").innerText = language["beta_test"] + betaTest.toString();
document.getElementById("project").innerHTML = language["license"];
document.getElementById("close_about").innerText = language["close"];
document.getElementById("id_openDLtxt").innerText = language["Downloader"];
document.getElementById("downloaderSpeech").innerText = language["downloaderSpeech"];
document.getElementById("id_btnDLStart").innerText = language["startDownload"];
document.getElementById("id_btnDLOpen").innerText = language["openDL"];
document.getElementById("close_openDL").innerText = language["close"];
document.getElementById("close_tips").innerText = language["close"];
document.getElementById("close_bm").innerText = language["close"];
document.getElementById("id_tips").innerText = language["tips"];
document.getElementById("id_bmm").innerText = language["Bookmark"];
document.getElementById("id_settingsmod").innerText = language["settings"];
document.getElementById("id_btn_CTN").innerText = language["clear_tb"];
document.getElementById("selectTheme_id").innerText = language["select_a_theme"];
document.getElementById("selectLang_id").innerText = language["select_a_language"];
document.getElementById("id_btn_TE").innerText = language["nothemeevent"];
document.getElementById("close_settings").innerText = language["close"];
document.getElementById("volumesLabel").innerText = language["volumesLabel"];
document.getElementById("overlaymsg").innerText = language["overlaymsg_takecare"];
document.getElementById("toReadd").innerText = language["toRead"];
document.getElementById("recentlyAddedLabel").innerText = language["recentlyAdded"];
document.getElementById("myfav").innerText = language["myfavorites"];
document.getElementById("continueReading").innerText = language["continue_reading"];
document.getElementById("close_mna").innerText = language["close"];
document.getElementById("sendaccount").innerText = language["applyChanges"];
document.getElementById("sendbdd").innerText = language["downloadCopyBDD"];
document.getElementById("delaccount").innerText = language["delAccount"];
document.getElementById("passwmanagerLabel").innerText = language["InsertPassword"];
document.getElementById("usernamemanagerLabel").innerText = language["theUserNameLabel"];
document.getElementById("id_modifAccount").innerText = language["Modifyyouraccount"];
document.getElementById("close_edit").innerText = language["close"];
document.getElementById("sendEdit").innerText = language["send"];
document.getElementById("id_editmodal").innerText = language["EDIT"];





/**
 * Set the theme on the page
 * @param theme The selected theme
 */
function setTheme(theme) {
    document.head.getElementsByTagName("link")[5].href = PDP + "/themes/" + theme;
}


/**
 * Add or remove AnimateCSS animation
 * @param {HTMLElement} element The element to animate
 * @param {string} animation The animation
 * @param {string} prefix The prefix of the class
 */
const animateCSS = (element, animation, prefix = "animate__") =>
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = element;
        node.classList.add(`${prefix}animated`, animationName);

        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve("Animation ended");
        }

        node.addEventListener("animationend", handleAnimationEnd, { once: true });
    });


/**
 * Change the Lib modal to modify the library
 * @param elElement The element to modify
 */
function modifyLib(elElement) {
    document.getElementById("id_lib").innerText = language["modifyLib"];
    document.getElementById("namelocation").value = elElement["NAME"];
    document.getElementById("locationa").value = elElement["PATH"];
    document.getElementById("opt" + elElement["API_ID"]).setAttribute("selected", "true");
    document.getElementById("opt" + elElement["API_ID"]).selected = true;
    document.getElementById("sendlib").innerText = language["modifyLib"];
    document.getElementById("sendlib").onclick = function () {
        return updateLibrary({ 'form': [document.getElementById('namelocation'), document.getElementById('locationa'), document.getElementById('providerID')] }, elElement["ID_LIBRARY"]);
    };
}

let defaultBG = document.documentElement.style.getPropertyValue('--background');

/**
 * Reset the lib modal to default (adding a library)
 */
function resetLibModal() {
    document.getElementById("id_lib").innerText = language["addLib"];
    document.getElementById("namelocation").removeAttribute('value');
    document.getElementById("locationa").removeAttribute("value");
    document.getElementById("namelocation").value = "";
    document.getElementById("locationa").value = "";
    document.getElementById("opt1").removeAttribute("selected");
    document.getElementById("opt2").removeAttribute("selected");
    document.getElementById("opt3").removeAttribute("selected");
    document.getElementById("opt0").setAttribute("selected", "true");
    document.getElementById("opt1").selected = false;
    document.getElementById("opt2").selected = false;
    document.getElementById("opt3").selected = false;
    document.getElementById("opt0").selected = true;
    document.getElementById("sendlib").onclick = function () {
        return addLibrary({ 'form': [document.getElementById('namelocation'), document.getElementById('locationa'), document.getElementById('providerID')] });
    };
}



document.getElementById("searchField").style.display = "none";

/**
 * Show the search bar
 */
function summonSearch() {
    if (searchtoggle) {
        searchtoggle = false;
        document.getElementById("searchField").style.display = "block";
    } else {
        searchtoggle = true;
        document.getElementById("searchField").style.display = "none";
    }
}



/**
 * Load the content of the element
 * @param {string} FolderRes The folder path
 * @param {string} libraryPath The library path
 * @param {*} date The date of the element
 * @param {providerEnum} provider The provider of the element
 */
function loadView(FolderRes, libraryPath, date = "", provider = providerEnum.MANUAL) {
    let n = 0;
    let listOfImages = [];
    document.getElementById("overlay2").style.display = "none";
    const divlist = document.createElement("div");
    divlist.className = "cards-list2";
    FolderRes = FolderRes.replaceAll("\\", "/");
    FolderRes = FolderRes.replaceAll("//", "/");
    FolderRes = FolderRes.replaceAll("/", "ù");
    fetch(PDP + "/getListOfFilesAndFolders/" + FolderRes).then((response) => {
        return response.text();
    }).then(async (data) => {
        data = JSON.parse(data);
        for (let index = 0; index < data.length; index++) {
            const path = data[index];
            let name = path.replaceAll(libraryPath.replaceAll("\\", "/"), "")
            let realname = /[^\\\/]+(?=\.\w+$)|[^\\\/]+$/.exec(name)[0];
            let readBookNB = await getFromDB("Books", "COUNT(*) FROM Books WHERE READ = 1 AND PATH = '" + path + "'");
            document.getElementById("readstat").innerText = JSON.parse(readBookNB)[0]["COUNT(*)"] + " / " + data.length + " volumes read";
            await getFromDB("Books", "* FROM Books WHERE PATH = '" + path + "'").then(async (resa) => {
                let bookList = JSON.parse(resa);
                let TheBook;
                if (bookList.length === 0) {
                    if (provider === providerEnum.Marvel) {
                        await new Marvel().InsertBook(realname, date, path).then(async (cdata) => {
                            console.log(cdata);
                            if (cdata === undefined) {
                                throw new Error("no data");
                            }
                            if (cdata["data"]["total"] > 0) {
                                cdata = cdata["data"]["results"][0];
                                TheBook = new Book(cdata["id"], realname, cdata["thumbnail"].path + "/detail." + cdata["thumbnail"].extension, cdata["description"], cdata["creators"], cdata["characters"], cdata["urls"], null, 0, 0, 1, 0, 0, 0, path, cdata["issueNumber"], cdata["format"], cdata["pageCount"], cdata["series"], cdata["prices"], cdata["dates"], cdata["collectedIssues"], cdata["collections"], cdata["variants"], false)
                            } else {
                                TheBook = new Book(null, realname, null, null, null, null, null, null, 0, 0, 1, 0, 0, 0, path, null, null, null, null, null, null, null, null, null, false)
                            }
                        });
                    } else if (provider === providerEnum.Anilist) {
                        await new Anilist().InsertBook(realname, path);
                        TheBook = new Book(null, realname, null, null, null, null, null, null, 0, 0, 1, 0, 0, 0, path, null, null, null, null, null, null, null, null, null, false)
                    } else if (provider === providerEnum.MANUAL) {
                        console.log("manual");
                        InsertIntoDB("Books", "", `(?,'${null}','${realname}',null,${0},${0},${1},${0},${0},${0},'${path}','${null}','${null}','${null}','${null}',${null},'${null}','${null}','${null}','${null}','${null}','${null}','${null}','${null}','${null}',false)`)
                        TheBook = new Book(null, realname, null, null, null, null, null, null, 0, 0, 1, 0, 0, 0, path, null, null, null, null, null, null, null, null, null, false)
                    } else if (provider === providerEnum.OL) {
                        await new OpenLibrary().InsertBook(realname, path).then(async (cdata) => {
                            console.log(cdata);
                            if (cdata === undefined) {
                                throw new Error("no data");
                            }
                            if (cdata.hasOwnProperty("num_found")) {
                                TheBook = new Book(null, realname, null, null, null, null, null, null, 0, 0, 1, 0, 0, 0, path, null, null, null, null, null, null, null, null, null, false)
                            } else {
                                let cdataD = cdata["details"]
                                TheBook = new Book(cdata["bib_key"], realname, cdata["thumbnail_url"], cdataD["description"], cdataD["authors"], null, cdataD["info_url"], null, 0, 0, 1, 0, 0, 0, path, null, cdataD["physical_format"], cdataD["number_of_pages"], null, null, cdata["publish_date"], null, null, null, false)
                            }

                        })
                    } else if (provider === providerEnum.GBooks) {
                        await new GoogleBooks().InsertBook(realname, path).then(async (cdata) => {
                            console.log(cdata);
                            if (cdata === undefined) {
                                throw new Error("no data");
                            }
                            if (cdata["totalItems"] > 0) {
                                cdata = cdata["items"][0];
                                let cover;
                                if (cdata["volumeInfo"]["imageLinks"] !== undefined) {

                                    cover = cdata["volumeInfo"]["imageLinks"]
                                    if (cover["large"] !== undefined) {
                                        cover = cover["large"]
                                    } else if (cover["thumbnail"] !== undefined) {
                                        cover = cover["thumbnail"]
                                    } else {
                                        cover = null
                                    }
                                } else {
                                    cover = null;
                                }
                                let price;
                                if (cdata["saleInfo"]["retailPrice"] !== undefined) {
                                    price = cdata["saleInfo"]["retailPrice"]["amount"]
                                } else {
                                    price = null;
                                }
                                TheBook = new Book(cdata["id"], realname, cover, cdata["volumeInfo"]["description"], cdata["volumeInfo"]["authors"], null, cdata["volumeInfo"]["infoLink"], null, 0, 0, 1, 0, 0, 0, path, null, cdata["volumeInfo"]["printType"], cdata["volumeInfo"]["pageCount"], null, price, cdata["volumeInfo"]["publishedDate"], null, null, null, false)

                            } else {
                                TheBook = new Book(null, realname, null, null, null, null, null, null, 0, 0, 1, 0, 0, 0, path, null, null, null, null, null, null, null, null, null, false)
                            }

                        })
                    }
                    //TODO implement API HERE
                } else {
                    let bookFromDB = bookList[0];
                    TheBook = new Book(bookFromDB["ID_book"], bookFromDB["NOM"], bookFromDB["URLCover"], bookFromDB["description"], bookFromDB["creators"], bookFromDB["characters"], bookFromDB["URLs"], bookFromDB["note"], bookFromDB["read"], bookFromDB["reading"], bookFromDB["unread"], bookFromDB["favorite"], bookFromDB["last_page"], bookFromDB["folder"], bookFromDB["PATH"], bookFromDB["issueNumber"], bookFromDB["format"], bookFromDB["pageCount"], bookFromDB["series"], bookFromDB["prices"], bookFromDB["dates"], bookFromDB["collectedIssues"], bookFromDB["collections"], bookFromDB["variants"], bookFromDB["lock"]);
                }
                let card = new Card(TheBook.unread, TheBook.read, TheBook.reading, TheBook.ID + "_" + n, TheBook.cover, TheBook.title, TheBook.favorite)
                let carddiv = card.card;
                card.addPlayButtonListener();
                carddiv.addEventListener("click", async function () {
                    await createDetails(TheBook.book, provider);
                });
                n++;
                let element;
                if (provider === providerEnum.OL || provider === providerEnum.GBooks) {
                    element = document.getElementById("ContainerExplorer");

                } else {

                    element = document.getElementById("ContentView");
                }
                divlist.appendChild(carddiv);
                element.appendChild(divlist);
            });
        }
    });
}






//List of Bookmarked folder
function listBM() {
    const option = {
        method: 'GET', headers: {
            'Content-Type': 'application/json', "token": currentProfile.getToken,
        }
    };
    fetch(PDP + "/BM/getBM", option).then((response) => {
        return response.json();
    }).then(function (info) {
        console.log(info);
        if (info.length === 0) {
            let iblock = document.createElement("i");
            iblock.innerText = "block";
            iblock.className = "material-icons";
            if (currenttheme > 1) iblock.style.color = theme_FG;
            document.getElementById("bookmarkContainer").appendChild(iblock);
            return;
        }
        info.forEach((file) => {
            getFromDB("Books", "URLCover FROM Books WHERE ID_BOOK = '" + file["BOOK_ID"] + "'").then(async (resa) => {
                resa = JSON.parse(resa)
                let res = resa[0].URLCover;
                const btn = document.createElement("button");
                console.log("openBOOKM('" + file["PATH"] + "&page=" + file["page"] + "');");
                btn.addEventListener("click", function () {
                    openBOOKM(file["PATH"], file["page"]);
                });
                btn.className = "btn pure-material-button-contained";
                btn.style = "margin:5px";
                btn.innerText = language["Seethepage"] + file["page"];
                let image = document.createElement("img");
                image.src = res;
                image.style = "width:100%;height:100%;";
                let div = document.createElement("div");
                div.appendChild(image);
                div.style.width = "30%";
                div.appendChild(btn);
                document.getElementById("bookmarkContainer").appendChild(div);
            });
        });
    }).catch(function (error) {
        console.log(error);
    });
}

//the Bookmarked loading
listBM();

//Handle the drag and drop to open files in the app
document.addEventListener("drop", (event) => {
    event.preventDefault();
    event.stopPropagation();
    for (const f of event.dataTransfer.files) {
        // Using the path attribute to get absolute file path
        console.log("File Path of dragged files: ", f.path);
        if (f.path.includes(".cbz") || f.path.includes(".cbr") || f.path.includes(".cbt") || f.path.includes(".cb7") || f.path.includes(".zip") || f.path.includes(".rar") || f.path.includes(".7z") || f.path.includes(".tar")) {
            window.location.href = "viewer.html?" + f.path;
        } else {
            Toastifycation(language["drag&drop_fail"], "#ff0000");
        }
    }
});
document.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
});
document.addEventListener("dragenter", (event) => {
    console.log("File is in the Drop Space");
});
document.addEventListener("dragleave", (event) => {
    console.log("File has left the Drop Space");
});

fetch(PDP + "/getThemes").then((response) => {
    return response.text();
}).then(function (res) {
    res = JSON.parse(res);
    for (let i = 0; i < res.length; i += 2) {
        let opt = document.createElement("option");
        opt.value = res[i];
        opt.innerText = res[i + 1];
        document.getElementById("themeselector").appendChild(opt);
    }
}).catch(function (error) {
    console.log(error);
});

async function downloader() {
    let url = document.getElementById("id_URLDL").value;
    let name = document.getElementById("id_NAME_DL").value;
    let vol = document.getElementById("id_VOL_DL").value;
    console.log(url);
    const option = {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
            "url": url, "name": name, "vol": vol
        }, null, 2)
    };
    await fetch(PDP + '/downloadBook', option).then(() => {
        console.log("downloaded");
        Toastifycation(language["downloaded"]);
    }).catch(err => {
        console.log(err);
        Toastifycation(language["error"]);
    });
}

function OpenDownloadDir() {
    window.location.href = "viewer.html?" + CosmicComicsTemp + "/downloaded_book/";
}

async function AllBooks(filters = "") {
    resetOverlay();

    document.getElementById("home").style.display = "none";
    document.getElementById("overlay").style.display = "block";
    let request;
    if (filters === "") {
        request = "* FROM Books";
    } else {
        request = "* FROM Books WHERE " + filters;
    }
    await getFromDB("Books", request).then(async (res) => {
        //for all books in res create a card and add it to the container
        let TheBookun = JSON.parse(res);
        if (TheBookun.length === 0) {
            Toastifycation(language["empty_notSupported"], "#ff0000");
            animateCSS(document.getElementById("overlay"), "fadeOut").then((message) => {
                document.getElementById("overlay2").style.display = "none";
                document.getElementById("overlay").style.display = "none";
                document.getElementById("ContainerExplorer").style.display = "flex";
                document.getElementById("home").innerText = language["empty_library"]
                document.getElementById("home").style.display = "block";
                document.getElementById("home").style.fontSize = "24px";
            });
            return;
        }
        animateCSS(document.getElementById("overlay"), "fadeOut").then((message) => {

            for (let i = 0; i < TheBookun.length; i++) {
                let TheBook = TheBookun[i];
                let card = new Card(TheBook["unread"], TheBook["read"], TheBook["reading"], TheBook["ID_book"], TheBook["URLCover"], TheBook["NOM"], TheBook["favorite"])
                let carddiv = card.card;
                card.addPlayButtonListener();

                let brook = TheBook;
                carddiv.addEventListener("click", function () {
                    let provider = ((brook.series.includes("marvel")) ? (providerEnum.Marvel) : ((brook.series.includes("Anilist")) ? (providerEnum.Anilist) : ((brook.series.includes("OL")) ? (providerEnum.OL) : ((brook.URLs.includes("google")) ? (providerEnum.GBooks) : (providerEnum.MANUAL)))));
                    createDetails(brook, provider);
                });
                const element = document.getElementById("ContainerExplorer");
                const divrating = document.createElement("div");
                carddiv.appendChild(divrating);
                element.appendChild(carddiv);
            }
            document.getElementById("overlay2").style.display = "none";
            document.getElementById("overlay").style.display = "none";
            document.getElementById("ContainerExplorer").style.display = "flex";
        });

    });
}

theSearchList = [];
getFromDB("Books", "NOM,PATH,URLCover,Series FROM Books").then(async (resa) => {
    resa = JSON.parse(resa);
    for (let i = 0; i < resa.length; i++) {
        theSearchList.push(resa[i]);
    }
});
getFromDB("Series", "title,cover,PATH FROM Series").then(async (resa) => {
    resa = JSON.parse(resa);
    for (let i = 0; i < resa.length; i++) {
        theSearchList.push(resa[i]);
    }
});

async function setSearch(res) {
    for (const key in res) {
        const resItem = document.createElement("li");
        resItem.classList.add("resItem");
        let text = document.createElement("span");
        let img = document.createElement("img");
        let series = document.createElement("span");
        let isBook = res[key].NOM !== undefined;
        if (isBook) {
            text.innerText = res[key].NOM;
            try {
                series.innerText = JSON.parse(res[key].series).name;
            } catch (e) {
                try {
                    series.innerText = res[key].series.split("_")[2].replaceAll("$", " ");
                } catch (e) {
                    if (res[key].series != null && res[key].series !== "null") {
                        series.innerText = res[key].series;
                    } else {
                        series.innerText = language["noseries"];
                    }
                }
            }
            img.src = res[key].URLCover;
        } else {
            text.innerText = JSON.parse(res[key].title);
            if (typeof JSON.parse(res[key].title) == "object") {
                try {
                    text.innerText = JSON.parse(res[key].title).english;
                } catch (e) {
                    try {
                        text.innerText = JSON.parse(res[key].title).romaji;
                    } catch (e) {
                        text.innerText = JSON.parse(res[key].title).native;
                    }
                }
            }
            try {
                if (typeof JSON.parse(res[key].cover) == "object") {
                    img.src = JSON.parse(res[key].cover).path + "/detail." + JSON.parse(res[key].cover).extension;
                } else {
                    img.src = res[key].cover;
                }
            } catch (e) {
                img.src = res[key].cover;
            }
        }
        img.style.width = "135px";
        img.style.display = "inline";
        resItem.appendChild(img);
        resItem.appendChild(text);
        let separator = document.createElement("span")
        separator.innerText = " in "
        if (series.innerHTML !== "") resItem.appendChild(separator)
        resItem.appendChild(series);
        resItem.addEventListener("click", async (e) => {
            document.getElementById("searchResults").style.display = "none";
            document.getElementById("home").style.display = "none";
            if (isBook) {
                await getFromDB("Books", "* FROM Books WHERE PATH = '" + res[key].PATH + "'").then(async (resa) => {
                    let bookList = JSON.parse(resa);
                    let TheBook = bookList[0];
                    //TODO Implement API HERE
                    let provider = ((brook.series.includes("marvel")) ? (providerEnum.Marvel) : ((brook.series.includes("Anilist")) ? (providerEnum.Anilist) : ((brook.series.includes("OL")) ? (providerEnum.OL) : ((brook.URLs.includes("google")) ? (providerEnum.GBooks) : (providerEnum.MANUAL)))));
                    if (provider === -1) {
                        return;
                    }
                    await createDetails(TheBook, provider);
                });
            } else {
                await getFromDB("Series", "* FROM Series WHERE title = '" + res[key].title + "'").then(async (resa) => {
                    console.log("HERE");
                    let bookList = JSON.parse(resa);
                    let TheBook = bookList[0];
                    //TODO Implement API HERE
                    let provider = ((TheBook.ID_Series.includes("_1")) ? (providerEnum.Marvel) : ((TheBook.ID_Series.includes("_2")) ? (providerEnum.Anilist) : (TheBook.ID_Series.includes("_3")) ? (providerEnum.OL) : ((TheBook.ID_Series.includes("_4")) ? (providerEnum.GBooks) : (providerEnum.MANUAL))));
                    let result = res[key].PATH;
                    console.log(result);
                    let libPath = result.replaceAll("\\", "/");
                    libPath = libPath.replace(/\/[^\/]+$/, "");
                    libPath = libPath.replaceAll("/", "\\");
                    if (provider === providerEnum.Marvel) {
                        await createSeries(provider, result, libPath, bookList);
                    } else if (provider === providerEnum.Anilist) {
                        try {
                            await createSeries(provider, result, libPath, bookList);
                        } catch (e) {
                            console.log(e);
                        }
                    } else if (provider === providerEnum.OL) {
                        try {
                            await createSeries(provider, result, libPath, bookList);
                        } catch (e) {
                            console.log(e);
                        }
                    } else if (provider === providerEnum.GBooks) {
                        try {
                            await createSeries(provider, result, libPath, bookList);
                        } catch (e) {
                            console.log(e);
                        }
                    } else if (provider === providerEnum.MANUAL) {
                        await createSeries(provider, result, libPath, bookList);
                    }
                });
            }
        });
        document.getElementById("searchResults").appendChild(resItem);
    }
    if (res.length === 0) {
        const resItem = document.createElement("li");
        resItem.classList.add("resItem");
        const text = document.createTextNode("No results found");
        resItem.appendChild(text);
        document.getElementById("searchResults").appendChild(resItem);
    }
}

document.getElementById("rematch").setAttribute("data-bs-toggle", "modal");
document.getElementById("rematch").setAttribute("data-bs-target", "#rematchModal");
document.getElementById("id_addTrackedBook").addEventListener("click", () => {

    let apiselectorModal = new bootstrap.Modal(document.getElementById("APISelector"));
    apiselectorModal.show();
    document.getElementById("RproviderID").onchange = async () => {
        await apiselectorModal.toggle();
        let provider = document.getElementById("RproviderID").value;
        await InsertIntoDB("Books", "", `(?,${null},'REPLACE THIS BY A VALUE',null,${0},${0},${1},${0},${0},${0},'${null}','${null}','${null}','${null}','${null}',${null},'${null}','${null}','${null}','${null}','${null}','${null}','${null}','${null}','${null}',false)`)
        try {
            let TheBook = await getFromDB("Books", "* FROM Books WHERE NOM = 'REPLACE THIS BY A VALUE'");
            TheBook = JSON.parse(TheBook)[0];
            document.getElementById('bookEdit').style.display = "block";
            document.getElementById('seriesEdit').style.display = "none";
            document.querySelectorAll("#commonEdit>label>input").forEach((e) => {
                e.value = TheBook[e.id.replaceAll("edit_", "")];
            })
            document.querySelectorAll("#bookEdit>label>input").forEach((e) => {
                e.value = TheBook[e.id.replaceAll("edit_", "")];
            })
            let isLocked = () => {
                return TheBook.lock === 1 || TheBook.lock === true;
            }

            document.getElementById("lockCheck").checked = isLocked();

            if (provider === "0") {
                document.getElementById("RproviderID").value = "";
                let modifyModal = new bootstrap.Modal("#editmodal");
                modifyModal.show();
                document.getElementById("sendEdit").onclick = async () => {
                    modifyModal.hide();
                    let values = [];
                    let columns = [];
                    document.querySelectorAll("#commonEdit>label>input").forEach((e) => {
                        values.push(e.value.replaceAll("'", "''").replaceAll('"', "'"));
                        columns.push(e.id.replaceAll("edit_", ""))
                    })
                    document.querySelectorAll("#bookEdit>label>input").forEach((e) => {
                        values.push(e.value.replaceAll("'", "''").replaceAll('"', "'"))
                        columns.push(e.id.replaceAll("edit_", ""))
                    })
                    values.push(document.getElementById("lockCheck").checked);
                    console.log(values);

                    columns.push("lock");
                    await fetch(PDP + "/DB/update", {
                        method: "POST", headers: {
                            "Content-Type": "application/json"
                        }, body: JSON.stringify({
                            "token": currentProfile.getToken,
                            "table": "Books",
                            "type": "edit",
                            "column": columns,
                            "whereEl": "REPLACE THIS BY A VALUE",
                            "value": values,
                            "where": "NOM"
                        }, null, 2)
                    })
                }
                document.getElementById("close_edit").onclick = async () => {
                    TrueDeleteFromDB("Books", TheBook.ID_book);
                    console.log("Deleted");
                }
            } else if (provider === "1") {
                document.getElementById("RproviderID").value = "";

                let rematcherModal = new bootstrap.Modal(document.getElementById("rematchModal"));
                rematcherModal.show();

                document.getElementById("rematchSearchSender").onclick = () => {
                    let rematchResult = document.getElementById("resultRematch")
                    let search = document.getElementById("rematchSearch");
                    let year = document.getElementById('rematchYearSearch')
                    new Marvel().GetComics(search.value, year.value).then((cdata) => {
                        if (cdata["data"]["total"] > 0) {
                            for (let i = 0; i < cdata["data"]["total"]; i++) {
                                let cdataI = cdata["data"]["results"][i];
                                let l = new Card(null, null, null, cdataI["id"], cdataI["thumbnail"].path + "/detail." + cdataI["thumbnail"].extension, cdataI['title']).card
                                l.addEventListener("click", () => {
                                    new API().rematch(cdataI.id + "_" + provider, provider, "book", TheBook.ID_book, false)
                                    rematcherModal.hide();
                                })
                                rematchResult.appendChild(l);
                            }
                        }
                    })

                }
                document.getElementById("close_rematchModal").onclick = async () => {
                    TrueDeleteFromDB("Books", TheBook.ID_book);
                    document.getElementById("close_rematchModal").onclick = null;
                }
            } else if (provider === "2") {
                document.getElementById("RproviderID").value = "";

                let modifyModal = new bootstrap.Modal(document.getElementById("editmodal"));
                modifyModal.show();
                document.getElementById("sendEdit").onclick = async () => {
                    modifyModal.hide();
                    let values = [];
                    let columns = [];
                    document.querySelectorAll("#commonEdit>label>input").forEach((e) => {
                        values.push(e.value.replaceAll("'", "''").replaceAll('"', "'"));
                        columns.push(e.id.replaceAll("edit_", ""))
                    })
                    document.querySelectorAll("#bookEdit>label>input").forEach((e) => {
                        values.push(e.value.replaceAll("'", "''").replaceAll('"', "'"))
                        columns.push(e.id.replaceAll("edit_", ""))
                    })
                    values.push(document.getElementById("lockCheck").checked);
                    console.log(values);

                    columns.push("lock");
                    await fetch(PDP + "/DB/update", {
                        method: "POST", headers: {
                            "Content-Type": "application/json"
                        }, body: JSON.stringify({
                            "token": currentProfile.getToken,
                            "table": "Books",
                            "type": "edit",
                            "column": columns,
                            "whereEl": "REPLACE THIS BY A VALUE",
                            "value": values,
                            "where": "NOM"
                        }, null, 2)
                    })
                }
                document.getElementById("close_edit").onclick = async () => {
                    TrueDeleteFromDB("Books", TheBook.ID_book);
                    document.getElementById("close_edit").onclick = null;
                }
            } else if (provider === "3") {
            } else if (provider === "4") {
            } else {
                alert(language["selectAProvider"]);
            }
        } catch (e) {
            TrueDeleteFromDB("Books", TheBook.ID_book);
        }

    }

})


/**
 * Clear the list of results
 */
function clearList() {
    while (document.getElementById("searchResults").firstChild) {
        document.getElementById("searchResults").removeChild(document.getElementById("searchResults").firstChild);
    }
}

/**
 * On search results focused
 */
document.getElementById('searchField').addEventListener('focus', function (e) {
    document.getElementById('searchResults').style.display = 'block';
    setTimeout(function () {
        document.addEventListener('click', listenerClickSearch);
    }, 100);
});
/**
 * Search an element in the list of available items
 */
document.getElementById('searchField').addEventListener('input', function (e) {
    console.log(theSearchList);
    document.getElementById('searchResults').style.display = 'block';
    clearList();
    let value = e.target.value;
    if (value && value.trim().length > 0) {
        value = value.trim().toLowerCase();
        setSearch(theSearchList.filter(item => {
            if (item.NOM !== undefined) {
                return item.NOM.toLowerCase().includes(value);
            } else {
                return item.title.toLowerCase().includes(value);
            }
        })).then(r => {
        });
    } else {
        clearList();
    }
    document.addEventListener('click', listenerClickSearch);
});

/**
 * Custom Listeners for hdie the search results
 */
function listenerClickSearch() {
    document.getElementById("searchResults").style.display = "none";
    document.removeEventListener('click', listenerClickSearch);
}
/**
 * Spawn a context menu for account management
 *
 */
function AccountMenu() {
    let menu = createContextMenu(
        [
            {
                "nom": language["Createanewuser"],
                "attribs": {
                    "data-bs-toggle": "modal",
                    "data-bs-target": "#modifAccount"
                },
                "listeners": {
                    "click": function () {
                        document.getElementById("id_modifAccount").innerText = language["Createanewuser"];
                        document.getElementById("delaccount").style.display = "none";
                        document.getElementById("sendbdd").style.display = "none";
                        document.getElementById("sendaccount").onclick = async function () {
                            console.log("sendaccount");
                            await currentProfile.createAccount();
                        };
                    }
                }
            },
        ])
    document.body.appendChild(menu);
    menu.style.top = 70 + "px";
    menu.style.display = "flex";
    document.addEventListener("click", function (e) {
        if (e.target !== menu && e.target !== document.getElementById("id_accountSystem") && e.target !== document.getElementById("icon_id_accountSystem")) {
            try {
                document.body.removeChild(menu);

            } catch (e) {
                console.log(e)
            }
        }
    });
}





document.getElementById("delaccount").onclick = () => { currentProfile.DeleteAccount() };
document.getElementById("sendbdd").onclick = () => { currentProfile.DownloadBDD() };
document.getElementById("sendaccount").onclick = () => { currentProfile.modifyAccount({ 'form': [document.getElementById('usernameManager').value, document.getElementById('passwordManager').value, document.getElementById('newImage')] }); };




document.getElementById("id_firstOfAll").addEventListener("click", function (e) {
    fetch(PDP + "/fillBlankImage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "token": currentProfile.getToken
        }, null, 2)
    }).then((res) => {
        Toastifycation(language["emptyimageressourceswillbefilledupwiththecover"], "#00C33C");
    })
})
