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
 * Get the version and display it on the info
 */
fetch(PDP + "/getVersion").then(function (response) {
    return response.text();
}).then(function (data) {
    document.getElementById("version").innerText = language["version"] + data;
}).catch(function (error) {
    console.log(error);
});



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
 * Delete the library
 * @param elElement The element to delete
 * @returns {Promise<void>} The response
 */
async function deleteLib(elElement) {
    let confirmDelete = confirm(language["deleteaccount"] + elElement["NAME"] + " ?");
    if (confirmDelete) {
        await fetch(PDP + '/DB/lib/delete/' + currentProfile.getToken + "/" + elElement["ID_LIBRARY"]).then(() => {
            alert(language["libraryDeleted"]);
            location.reload();
        });
    }
}



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
 * Reset the detail overlay to default
 */
function resetOverlay() {
    document.documentElement.style.overflow = "auto";
    document.getElementById("ColTitle").innerText = "";
    document.getElementById("startDate").innerText = "";
    document.getElementById("Status").innerText = "";
    document.getElementById("price").innerText = "";
    document.getElementById("genres").innerText = "";
    document.getElementById("chapters").innerText = "";
    document.getElementById("id").innerText = "";
    document.getElementById("characters").innerText = "";
    document.getElementById("colissue").innerText = "";
    document.getElementById("col").innerText = "";
    document.getElementById("Volumes").innerText = "";
    document.getElementById("Trending").innerText = "";
    document.getElementById("Staff").innerText = "";
    document.getElementById("SiteURL").innerText = "";
    document.getElementById("OtherTitles").innerText = "";
    document.getElementById("relations").innerText = "";
    document.getElementById("provider_text").innerText = "";
    document.getElementById("description").innerText = "";
    document.getElementById("ImgColCover").src = "null";
    document.getElementById("readstat").innerText = "";
    document.documentElement.style.setProperty('--background', defaultBG);
    for (let childrenKey in document.querySelector("#btnsActions").children) {
        document.querySelector("#btnsActions").children[childrenKey].outerHTML = document.querySelector("#btnsActions").children[childrenKey].outerHTML;
    }
    for (let i = 1; i <= 5; i++) {
        document.getElementById("rating-" + i).onclick = "";
        try {
            document.getElementById("rating-" + i).removeAttribute("checked");
        } catch (e) {
            console.log(e);
        }
    }
    document.getElementById("ContentView").innerHTML = "<h2>" + language["volumes"] + "</h2>";
}



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

/**
 * Modify user's profile configuration JSON file
 * @param {string|number} tomod The key to modify
 * @param {*} mod the new value
 */
function modifyConfigJson(tomod, mod) {
    //check si obj exist pour remplacer valeur
    fetch(PDP + "/config/getConfig/" + currentProfile.getToken).then(function (response) {
        return response.text();
    }).then(function (data) {
        let config = JSON.parse(data);
        for (let i in config) {
            config[tomod] = mod;
        }
        const option = {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config, null, 2)
        };
        fetch('/config/writeConfig/' + currentProfile.getToken, option);
    }).catch(function (error) {
        console.log(error);
    });
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
 * Open the library
 * @param {string} folder The path to the library
 * @param {*} provider The provider of the library (default to MANUAL)
 */
function openLibrary(folder, provider = 0) {
    document.getElementById("home").style.display = "none";
    document.getElementById("overlay").style.display = "block";
    setTimeout(() => {
        let result = folder.toString();
        if (result) {
            console.log(result);
            DetectFolderInLibrary(result).then((data) => {
                console.log(data);
                if (data.length <= 0) throw new Error(language["Folderemptyornotfound"]);
                //Ajouter a la DB les dossiers trouvés en tant que Collection
                if (provider === providerEnum.OL || provider === providerEnum.GBooks) {
                    //inserer une series OL
                    //aller directement dedans
                    document.getElementById("ContainerExplorer").style.display = "flex";
                    document.getElementById("overlay").style.display = "none";
                    resetOverlay();
                    loadView(result, result, "", provider)
                } else {
                    loadContent(provider, data, result);
                }
            });
        } else {
            document
                .getElementById("opnfld")
                .setAttribute("onclick", "openFolderDialog()");
            document.getElementById("opnfld").removeAttribute("disabled");
            animateCSS(document.getElementById("overlay"), "fadeOut").then((message) => {
                document.getElementById("overlay").style.display = "none";
                document.getElementById("ContainerExplorer").style.display = "flex";
            });
        }
    }, 500);
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

async function loadContent(provider, FolderRes, libraryPath) {
    let n = 0;
    listOfImages = [];
    document.getElementById("overlay2").style.display = "block";
    FolderRes = JSON.parse(FolderRes);
    const divlist = document.createElement("div");
    divlist.className = "list-group";
    await getFromDB("Series", "PATH FROM Series").then(async (res) => {
        for (let index = 0; index < FolderRes.length; index++) {
            const path = FolderRes[index];
            let name = path.replaceAll(libraryPath.replaceAll("\\", "/"), "").replace("/", "");
            let path_without_file = path.replace(name, "");
            let realname = name;
            console.log(realname);
            let found = false;
            let titlesList = [];
            let returnedPath = JSON.parse(res);
            let foundPATH = "";
            for (let i = 0; i < returnedPath.length; i++) {
                titlesList.push(returnedPath[i].PATH);
            }
            console.log(titlesList);
            console.log(name);
            titlesList.forEach((el) => {
                console.log(el);
                if (el === path) {
                    found = true;
                    foundPATH = el;
                }
            });
            if (found === false) {
                if (provider === providerEnum.Anilist) {
                    console.log("provider Anilist");
                    new Anilist().POST_SEARCH(name, path)
                } else if (provider === providerEnum.Marvel) {
                    console.log("Provider: Marvel Comics");
                    new Marvel().InsertSeries(name, path);
                } else if (provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
                    let randID = Math.floor(Math.random() * 1000000);
                    await InsertIntoDB("Series", "(ID_Series,title,note,statut,start_date,end_date,description,Score,genres,cover,BG,CHARACTERS,TRENDING,STAFF,SOURCE,volumes,chapters,favorite,PATH,lock)", "('" + randID + "U_0" + "','" + JSON.stringify(name.replaceAll("'", "''")) + "',null,null,null,null,null,'0',null,null,null,null,null,null,null,null,null,0,'" + path + "',false)");
                }
                //TODO implement API HERE
            } else {
                await getFromDB("Series", "* FROM Series where PATH = '" + foundPATH + "'").then((res) => {
                    console.log(foundPATH);
                    res = JSON.parse(res);
                    console.log(res);
                    let node;
                    if (cardMode === true) {
                        if (provider === providerEnum.Marvel) {
                            node = JSON.parse(res[0].title);
                        } else if (provider == providerEnum.Anilist) {
                            if (JSON.parse(res[0].title)["english"] !== undefined && JSON.parse(res[0].title)["english"] !== null) {
                                node = JSON.parse(res[0].title)["english"];
                            } else if (JSON.parse(res[0].title)["romaji"] !== undefined && JSON.parse(res[0].title)["romaji"] !== null) {
                                node = JSON.parse(res[0].title)["romaji"];
                            } else {
                                node = JSON.parse(res[0].title);
                            }
                        } else if (provider == providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
                            node = res[0].title;
                        }
                    } else {
                        node = JSON.parse(res[0].title)["english"];
                    }
                    let invertedPath = path.replaceAll("\\", "/");
                    if (provider === providerEnum.Marvel) {
                        try {
                            imagelink = JSON.parse(res[0].cover).path + "/detail." + JSON.parse(res[0].cover).extension;
                        } catch (e) {
                            imagelink = "null";
                        }
                    } else {
                        imagelink = res[0].cover;
                    }
                    listOfImages.push(imagelink);
                    //Setting Card Div
                    let card = new Card(null, null, null, n, imagelink, node, res[0]["favorite"])
                    let carddiv = card.card;
                    card.addPlayButtonListener();
                    carddiv.addEventListener("click", async function () {
                        await createSeries(provider, path, libraryPath, res);
                    });
                    console.log("DEBUG 3c");
                    n++;
                    const element = document.getElementById("ContainerExplorer");
                    element.style.display = "none";
                    const divrating = document.createElement("div");
                    carddiv.appendChild(divrating);
                    element.appendChild(carddiv);
                    /*
                                if (stat.isDirectory()) {
                    */
                    const imgNode = document.createElement("img");
                    imgNode.src = "";
                    imgNode.style = "padding-top: 330px";
                    carddiv.appendChild(imgNode);
                    /*     } else if (readed) {
                             //readed
                         } else if (reading) {
                             //reazading
                         } else {
                             //rien
                         }

                         if (favorite_v) {

                             //favorite
                         } else if (stat.isDirectory()) {
                             //fav folder
                         } else {
                             //pas fav
                         }*/
                    console.log("DEBUG 3d");
                });
            }
        }
    });
    if (cardMode === true) {
        preloadImage(listOfImages, n);
    } else {
        console.log("DEBUG 5");
        if (n === 0) {
            Toastifycation(language["empty_notSupported"], "#ff0000");
            document.getElementById("home").innerText = language["empty_notSupported2"] + ValidatedExtension + language["empty_notSupported3"];
            document.getElementById("home").style.display = "block";
            document.getElementById("home").style.fontSize = "24px";
        } else {
            let random = coolanimations[Math.floor(Math.random() * coolanimations.length)];
            document.getElementById("home").style.display = "none";
            for (let i = 0; i < n; i++) {
                animateCSS(document.getElementById("id" + i), random).then((message) => {
                    console.log(message);
                });
                document.getElementById("overlay2").style.display = "none";
                animateCSS(document.getElementById("overlay"), "fadeOut").then((message) => {
                    document.getElementById("overlay").style.display = "none";
                    document.getElementById("ContainerExplorer").style.display = "flex";
                });
            }
        }
    }
}

//preload the images
let preloadedImages = [];

function preloadImage(listImages, n) {
    /* for (var i = 0; i < listImages.length; i++) {
      preloadedImages[i] = new Image();
      preloadedImages[i].src = listImages[i];
    } */
    setTimeout(() => {
        LoadImages(n);
    }, 500);
}

/**
 * Load the images
 * @param numberOf the number of images to load
 */
function LoadImages(numberOf) {
    let random = coolanimations[Math.floor(Math.random() * coolanimations.length)];
    if (numberOf === 0) {
        Toastifycation(language["empty_notSupported"], "#ff0000");
        animateCSS(document.getElementById("overlay"), "fadeOut").then((message) => {
            document.getElementById("overlay2").style.display = "none";
            document.getElementById("overlay").style.display = "none";
            document.getElementById("ContainerExplorer").style.display = "flex";
            document.getElementById("home").innerText = language["empty_library"];
            document.getElementById("home").style.display = "block";
            document.getElementById("home").style.fontSize = "24px";
        });
    }
    for (let i = 0; i < numberOf; i++) {
        document.getElementById("home").style.display = "none";
        animateCSS(document.getElementById("id" + i), random).then((message) => {
            console.log(message);
        });
        try {
            document.getElementById("card_img_id_" + i).src = listOfImages[i];
        } catch (error) {
            document.getElementById("card_img_id_" + i).src = CosmicComicsTemp + "/Images/fileDefault.webp";
        }
        document.getElementById("overlay2").style.display = "none";
        animateCSS(document.getElementById("overlay"), "fadeOut").then((message) => {
            document.getElementById("overlay").style.display = "none";
            document.getElementById("ContainerExplorer").style.display = "flex";
        });
    }
}




//Open a single file
function openInViewer() {
    let form = document.getElementById("uploader");
    let formData = new FormData(form);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", PDP + "/uploadComic", true);
    xhr.send(formData);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let response = xhr.responseText;
            if (response === "OK") {
                let url = CosmicComicsTemp + "/uploads/" + document.getElementById("fileUp").files[0].name;
                let encoded = encodeURIComponent(url.replaceAll("/", "%C3%B9"));
                window.location.href = "viewer.html?" + encoded;
            } else {
                alert(language["Failedtoloadfile"]);
            }
        }
    };
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

function returnToHome() {
    let e = document.getElementById("libHome");
    document.querySelectorAll(".selectLib").forEach((el) => {
        el.classList.remove("selectLib");
    });
    e.classList.add("selectLib");
    document.getElementById("ContainerExplorer").innerText = "";
    document.getElementById("overlay").style.display = "none";
    document.getElementById("overlay2").style.display = "none";
    document.getElementById("contentViewer").style.display = "none";
    document.getElementById('home').innerHTML = "    <p>" + language["continue_reading"] + "</p>\n" + "    <div id=\"continueReadingHome\"></div>\n" + "    <p>" + language["favorite"] + "</p>\n" + "    <div id=\"myfavoriteHome\"></div>\n" + "    <p>" + language["recentlyAdded"] + "</p>\n" + "    <div id=\"recentlyAdded\"></div>\n" + "    <p>" + language["toRead"] + "</p>\n" + "    <div id=\"toRead\"></div>\n";
    HomeRoutine();
    document.getElementById('home').style.display = 'block';
    document.getElementById('home').style.fontSize = '16px';
    resetOverlay();
    let breadCrumb = document.querySelector(".breadcrumb");
    /* Delete all childs after this one */
    while (breadCrumb.lastChild !== breadCrumb.childNodes[1]) {
        breadCrumb.removeChild(breadCrumb.lastChild);
    }
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




async function createSeries(provider, path, libraryPath, res) {
    resetOverlay();
    new bootstrap.Tooltip(document.getElementById("playbutton"), {
        title: language["PLAY"],
        placement: "bottom",
    });
    new bootstrap.Tooltip(document.getElementById("checkbtn"), {
        title: language["mkread"],
        placement: "bottom"
    });
    new bootstrap.Tooltip(document.getElementById("readingbtndetails"), {
        title: language["mkreading"],
        placement: "bottom"
    });
    new bootstrap.Tooltip(document.getElementById("decheckbtn"), {
        title: language["mkunread"],
        placement: "bottom"
    });
    new bootstrap.Tooltip(document.getElementById("favoritebtn"), {
        title: language["toogle_fav"],
        placement: "bottom"
    });
    new bootstrap.Tooltip(document.getElementById("editmodalBtn"), {
        title: language["EDIT"],
        placement: "bottom"
    });
    new bootstrap.Tooltip(document.getElementById("DLBOOK"), {
        title: language["downloadBook"],
        placement: "bottom"
    });
    new bootstrap.Tooltip(document.getElementById("refreshBtn"), {
        title: language["refreshMetadata"],
        placement: "bottom"
    });
    new bootstrap.Tooltip(document.getElementById("rematchBtn"), {
        title: language["rematch"],
        placement: "bottom"
    });

    console.log(provider);
    document.documentElement.style.overflow = "hidden";
    addToBreadCrumb(resolveTitle(res[0].title), () => {
        return createSeries(provider, path, libraryPath, res);
    });
    let APINOTFOUND = /[a-zA-Z]/g.test(res[0].ID_Series);
    document.getElementById('bookEdit').style.display = "none";
    document.getElementById('seriesEdit').style.display = "block";
    document.querySelectorAll("#seriesEdit>label>input").forEach((e) => {
        e.value = res[0][e.id.replaceAll("edit_", "")];
    })
    document.querySelectorAll("#commonEdit>label>input").forEach((e) => {
        e.value = res[0][e.id.replaceAll("edit_", "")];
    })
    document.getElementById("sendEdit").onclick = async () => {
        let values = [];
        let columns = [];
        document.querySelectorAll("#commonEdit>label>input").forEach((e) => {
            values.push(e.value)
            columns.push(e.id.replaceAll("edit_", ""))
        })
        document.querySelectorAll("#seriesEdit>label>input").forEach((e) => {
            values.push(e.value)
            columns.push(e.id.replaceAll("edit_", ""))
        })
        values.push(document.getElementById("lockCheck").checked);
        columns.push("lock");
        await fetch(PDP + "/DB/update", {
            method: "POST", headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                "token": currentProfile.getToken,
                "table": "Series",
                "type": "edit",
                "column": columns,
                "whereEl": res[0].PATH,
                "value": values,
                "where": "PATH"
            }, null, 2)
        })
    }
    let isLocked = () => {
        return res[0].lock === 1 || res[0].lock === true;
    }
    document.getElementById("rematchSearchSender").onclick = () => {
        let rematchResult = document.getElementById("resultRematch")
        let search = document.getElementById("rematchSearch")
        let year = document.getElementById('rematchYearSearch')
        if (provider === providerEnum.Marvel) {
            new Marvel().SearchComic(search.value, year.value).then((cdata) => {
                if (cdata["data"]["total"] > 0) {
                    for (let i = 0; i < cdata["data"]["total"]; i++) {
                        let cdataI = cdata["data"]["results"][i];
                        let l = new Card(null, null, null, cdataI["id"], cdataI["thumbnail"].path + "/detail." + cdataI["thumbnail"].extension, cdataI['title']).card;
                        l.addEventListener("click", () => {
                            new API().rematch(cdataI.id + "_" + provider, provider, "Series", res[0].ID_Series, true)
                        })
                        rematchResult.appendChild(l);
                    }
                }
            })
        } else if (provider === providerEnum.Anilist) {
            new Anilist().GET_SEARCH(search.value).then((el) => {
                if (el != null) {
                    el = el.base;
                    for (let o = 0; o < el.length; o++) {
                        let l = new Card(null, null, null, el[o].id, el[o].coverImage.large, el[o].title.english + " / " + el[o].title.romaji + " / " + el[o].title.native).card;
                        l.addEventListener("click", () => {
                            new API().rematch(el[o].id + "_" + provider, provider, "Series", res[0].ID_Series, true)
                        })
                        rematchResult.appendChild(l);
                    }
                }
            })
        } else if (provider === providerEnum.MANUAL) {
            alert(language["providerCannotRematch"])
        } else if (provider === providerEnum.OL) {
            alert(language["providerCannotRematch"])
        } else if (provider === providerEnum.GBooks) {
            alert(language["providerCannotRematch"])
        } else {
            alert(language["providerCannotRematch"])
        }
        //fetch API
        //return results to DIV#Result
        //Chaque result to conduire vers rematch()
    }
    document.getElementById("lockCheck").checked = res[0].lock;
    document.getElementById('refresh').onclick = async () => {
        if (!isLocked()) {
            await new API().refreshMeta(res[0].ID_Series, provider, "series");
        } else {
            Toastifycation(language["serieslocked"], "#ff0000");
        }
    }
    if (!APINOTFOUND) {
        document.getElementById("provider_text").innerText = ((provider === providerEnum.Marvel) ? (language['providedBy'] + " Marvel. © 2014 Marvel") : ((provider === providerEnum.Anilist) ? (language['providedBy'] + " Anilist.") : ((provider === providerEnum.MANUAL) ? (language["notFromAPI"]) : ((provider === providerEnum.OL) ? (language['providedBy'] + " OpenLibrary.") : ((provider === providerEnum.GBooks) ? (language['providedBy'] + " Google Books.") : "")))));
    } else {
        document.getElementById("provider_text").innerText = language["notFromAPI"];
    }
    for (let i = 1; i <= 5; i++) {
        document.getElementById("rating-" + i).onclick = function () {
            changeRating("Series", res[0].ID_Series, i);
        };
        try {
            document.getElementById("rating-" + i).removeAttribute("checked");
        } catch (e) {
            console.log(e);
        }
    }
    if (res[0].note != null) {
        document.getElementById("rating-" + res[0].note).setAttribute("checked", "true");
    }
    document.getElementById("DLBOOK").addEventListener("click", function (e) {
        downloadBook(path);
    });
    document.getElementById("readingbtndetails").style.display = "none";
    if (!APINOTFOUND) {
        if (res[0].BG != null && res[0].BG !== "null" && res[0].BG !== "") {
            const options = {
                method: "GET", headers: {
                    "Content-Type": "application/json",
                    "img": ((provider === providerEnum.Marvel) ? (JSON.parse(res[0].BG).path + "/detail." + JSON.parse(res[0].BG).extension) : (res[0].BG))
                }
            };
            await fetch(PDP + "/img/getPalette/" + currentProfile.getToken, options).then(function (response) {
                return response.text();
            }).then(function (data) {
                let Blurcolors = data;
                console.log(Blurcolors);
                setTimeout(function () {
                    document.documentElement.style.setProperty("--background", Blurcolors.toString());
                }, 500);
            });
        }
    } else {
        if (res[0].BG != null && res[0].BG !== "null" && res[0].BG !== "") {
            const options = {
                method: "GET", headers: {
                    "Content-Type": "application/json", "img": res[0].BG
                }
            };
            await fetch(PDP + "/img/getPalette/" + currentProfile.getToken, options).then(function (response) {
                return response.text();
            }).then(function (data) {
                let Blurcolors = data;
                console.log(Blurcolors);
                setTimeout(function () {
                    document.documentElement.style.setProperty("--background", Blurcolors.toString());
                }, 500);
            });
        }
    }
    if (!APINOTFOUND) {
        document.getElementById("ColTitle").innerHTML = "<a target='_blank' href='" + ((provider === providerEnum.Marvel) ? (JSON.parse(res[0].SOURCE).url) : (res[0].SOURCE)) + "' style='color:white'>" + ((provider === providerEnum.Marvel) ? (JSON.parse(res[0].title)) : (JSON.parse(res[0].title).english + " / " + JSON.parse(res[0].title).romaji + " / " + JSON.parse(res[0].title).native)) + "<i style='font-size: 18px;top: -10px;position: relative' class='material-icons'>open_in_new</i></a>";
        document.getElementById("ImgColCover").src = ((provider === providerEnum.Marvel) ? (JSON.parse(res[0].cover).path + "/detail." + JSON.parse(res[0].cover).extension) : (res[0].cover));
        if (((provider === providerEnum.Marvel) ? (JSON.parse(res[0].start_date)) : (JSON.parse(res[0].start_date).year)) == null) {
            document.getElementById("startDate").innerText = "?";
        } else {
            document.getElementById("startDate").innerText = ((provider === providerEnum.Marvel) ? (JSON.parse(res[0].start_date)) : (JSON.parse(res[0].start_date).year));
        }
        if (((provider === providerEnum.Marvel) ? (JSON.parse(res[0].end_date)) : (JSON.parse(res[0].end_date).year)) == null || JSON.parse(res[0].end_date) > new Date().getFullYear()) {
            document.getElementById("startDate").innerText += " - ?";
        } else {
            document.getElementById("startDate").innerText += " - " + ((provider === providerEnum.Marvel) ? (JSON.parse(res[0].end_date)) : (JSON.parse(res[0].end_date).year));
        }
        let NameToFetchList = [];
        if (provider === providerEnum.Marvel) {
            JSON.parse(res[0].CHARACTERS)["items"].forEach((el) => {
                NameToFetchList.push("'" + el.name.replaceAll("'", "''") + "'");
            });
        } else if (provider === providerEnum.Anilist) {
            JSON.parse(res[0].CHARACTERS).forEach((el) => {
                NameToFetchList.push("'" + el.name.replaceAll("'", "''") + "'");
            });
        } else if (provider === providerEnum.OL) {
            alert("Open Library " + language["cannotFetchCharacters"]);
        } else if (provider === providerEnum.GBooks) {
            alert("Google Books " + language["cannotFetchCharacters"]);
        }
        let NameToFetch = NameToFetchList.join(",");
        let container = document.createElement("div");
        await getFromDB("Characters", "* FROM Characters WHERE name IN (" + NameToFetch + ")").then((clres) => {
            clres = JSON.parse(clres);
            console.log(clres);
            container.className = "item-list";
            clres.forEach((el) => {
                const divs = document.createElement("div");
                const divs2 = document.createElement("div");
                let desc = el.description;
                let image = el.image;
                let urlo = el.url;
                let name = el.name;
                divs2.setAttribute("data-bs-toggle", "modal");
                divs2.setAttribute("data-bs-target", "#moreinfo");
                divs2.addEventListener("click", function (e) {
                    if (provider === providerEnum.Marvel) {
                        document.getElementById("moreinfo_img").src = JSON.parse(image).path + "/detail." + JSON.parse(image).extension;
                        document.getElementById("moreinfo_btn").href = JSON.parse(urlo)[0].url;
                        if (desc == null) {
                            document.getElementById("moreinfo_txt").innerText = name;
                        } else {
                            document.getElementById("moreinfo_txt").innerHTML = name + "<br/>" + desc;
                        }
                    } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
                        document.getElementById("moreinfo_img").src = image.replaceAll('"', "");
                        document.getElementById("moreinfo_btn").href = urlo;
                        if (desc == null) {
                            document.getElementById("moreinfo_txt").innerText = name;
                        } else {
                            try {
                                document.getElementById("moreinfo_txt").innerHTML = name + "<br/>" + JSON.parse(desc);
                            } catch (e) {
                                document.getElementById("moreinfo_txt").innerHTML = name + "<br/>" + desc;
                            }
                        }
                    }
                    document.getElementById("moreinfo_btn").target = "_blank";
                    document.getElementById("moreinfo_btn").innerText = "See more";
                });
                if (provider === providerEnum.Marvel) {
                    divs2.innerHTML += "<img src='" + JSON.parse(el.image).path + "/detail." + JSON.parse(el.image).extension + "' class='img-charac'/><br><span>" + el.name + "</span>";
                } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
                    divs2.innerHTML += "<img src='" + el.image.replaceAll('"', '') + "' class='img-charac'/><br><span>" + el.name + "</span>";
                }
                divs.appendChild(divs2);
                divs2.style.marginTop = "10px";
                divs2.style.textAlign = "center";
                divs.style.marginLeft = "10px";
                container.appendChild(divs);
            });
        });
        document.getElementById("characters").innerHTML = "<h1>" + language["characters"] + ":</h1> " + language["Numberofcharacters"] + ((provider === providerEnum.Marvel) ? (JSON.parse(res[0].CHARACTERS)["available"]) : (JSON.parse(res[0].CHARACTERS).length)) + "<br/>";
        let scrollCharactersAmount = 0;
        let moveRight = document.createElement("button");
        moveRight.className = "scrollBtnR";
        moveRight.onclick = function () {
            container.scrollTo({
                left: Math.max(scrollCharactersAmount += 140, container.clientWidth), behavior: "smooth"
            });
        };
        moveRight.innerHTML = "<i class='material-icons'>keyboard_arrow_right</i>";
        let moveLeft = document.createElement("button");
        moveLeft.className = "scrollBtnL";
        moveLeft.onclick = function () {
            container.scrollTo({
                left: Math.min(scrollCharactersAmount -= 140, 0), behavior: "smooth"
            });
        };
        moveLeft.innerHTML = "<i class='material-icons'>keyboard_arrow_left</i>";
        document.getElementById("characters").appendChild(moveLeft);
        document.getElementById("characters").appendChild(moveRight);
        document.getElementById("characters").appendChild(container);
        document.getElementById("OtherTitles").innerHTML = ((provider === providerEnum.Marvel) ? (language["AFewComics"]) : (language["Relations"])) + " : ";
        await getFromDB("relations", "* FROM relations WHERE series = '" + res[0].ID_Series + "'").then((clres) => {
            clres = JSON.parse(clres);
            console.log(clres);
            const divlist = document.createElement("div");
            divlist.className = "cards-list2";
            /*Sort alphabetical and numeric*/
            clres.sort(function (a, b) {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
            clres.forEach((el) => {
                const reltxt = document.createElement("div");
                const relbody = document.createElement("div");
                const relbio = document.createElement("p");
                relbio.innerText = el.name;
                relbio.className = "card__bio";
                relbio.style.textAlign = "center";
                relbio.style.color = "white";
                relbody.appendChild(relbio);
                relbody.className = "card__body";
                let image = el.image;
                let urlo = el.url;
                let desc = el.description;
                let name = el.name;
                reltxt.onclick = function () {
                    document.getElementById("moreinfo_img").className = "img-relation";
                    if (provider === providerEnum.Marvel) {
                        document.getElementById("moreinfo_img").src = JSON.parse(image).path + "/detail." + JSON.parse(image).extension;
                        document.getElementById("moreinfo_btn").href = JSON.parse(urlo)[0].url;
                        if (desc == null) {
                            document.getElementById("moreinfo_txt").innerText = name;
                        } else {
                            document.getElementById("moreinfo_txt").innerHTML = name + "<br/>" + desc;
                        }
                    } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
                        document.getElementById("moreinfo_img").src = image.replaceAll('"', "");
                        document.getElementById("moreinfo_btn").href = urlo;
                        if (desc == null) {
                            document.getElementById("moreinfo_txt").innerText = name;
                        } else {
                            try {
                                document.getElementById("moreinfo_txt").innerHTML = name + "<br/>" + JSON.parse(desc);
                            } catch (e) {
                                document.getElementById("moreinfo_txt").innerHTML = name + "<br/>" + desc;
                            }
                        }
                    }
                    document.getElementById("moreinfo_btn").target = "_blank";
                    document.getElementById("moreinfo_btn").innerText = language["seeMore"];
                };
                reltxt.className = "cardcusto";
                reltxt.style.cursor = "pointer";
                reltxt.setAttribute("data-bs-toggle", "modal");
                reltxt.setAttribute("data-bs-target", "#moreinfo");
                const relimg = document.createElement("div");
                const imgcard = document.createElement("img");
                imgcard.src = ((provider === providerEnum.Marvel) ? (JSON.parse(el.image).path + "/detail." + JSON.parse(el.image).extension) : (el.image));
                imgcard.style.width = "100%";
                relimg.className = "card__image";
                relimg.style.backgroundColor = "rgba(0,0,0,0.753)";
                relimg.appendChild(imgcard);
                reltxt.appendChild(relimg);
                reltxt.appendChild(relbody);
                divlist.appendChild(reltxt);
            });
            document.getElementById("OtherTitles").appendChild(divlist);
        });
        let tmpstaff = "Numberofpeople : " + ((provider === providerEnum.Marvel) ? (JSON.parse(res[0].STAFF)["available"]) : (JSON.parse(res[0].STAFF).length)) + "<br/>";
        let StaffToFetchList = [];
        if (provider === providerEnum.Marvel) {
            JSON.parse(res[0].STAFF)["items"].forEach((el) => {
                StaffToFetchList.push("'" + el.name.replaceAll("'", "''") + "'");
            });
        } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
            JSON.parse(res[0].STAFF).forEach((el) => {
                StaffToFetchList.push("'" + el.name.replaceAll("'", "''") + "'");
            });
        }
        let StaffToFetch = StaffToFetchList.join(",");
        let container2 = document.createElement("div");
        await getFromDB("Creators", "* FROM Creators WHERE name IN (" + StaffToFetch + ")").then((clres) => {
            clres = JSON.parse(clres);
            container2.className = "item-list";
            for (let i = 0; i < clres.length; i++) {
                let el = clres[i];
                const divs = document.createElement("div");
                const divs2 = document.createElement("div");
                divs2.className = "CCDIV";
                let desc = el.description;
                let image = el.image;
                let urlo = el.url;
                let name = el.name;
                divs2.setAttribute("data-bs-toggle", "modal");
                divs2.setAttribute("data-bs-target", "#moreinfo");
                divs2.addEventListener("click", function (e) {
                    if (provider === providerEnum.Marvel) {
                        document.getElementById("moreinfo_img").src = JSON.parse(image).path + "/detail." + JSON.parse(image).extension;
                        document.getElementById("moreinfo_btn").href = JSON.parse(urlo)[0].url;
                        if (desc == null) {
                            document.getElementById("moreinfo_txt").innerText = name;
                        } else {
                            document.getElementById("moreinfo_txt").innerHTML = name + "<br/>" + desc;
                        }
                    } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
                        document.getElementById("moreinfo_img").src = image.replaceAll('"', "");
                        document.getElementById("moreinfo_btn").href = urlo;
                        if (desc == null) {
                            document.getElementById("moreinfo_txt").innerText = name;
                        } else {
                            try {
                                document.getElementById("moreinfo_txt").innerHTML = name + "<br/>" + JSON.parse(desc);
                            } catch (e) {
                                document.getElementById("moreinfo_txt").innerHTML = name + "<br/>" + desc;
                            }
                        }
                    }
                    document.getElementById("moreinfo_btn").target = "_blank";
                    document.getElementById("moreinfo_btn").innerText = language["seeMore"];
                });
                for (let j = 0; j < clres.length; j++) {
                    if (provider === providerEnum.Marvel) {
                        if (el.name === JSON.parse(res[0]["STAFF"])["items"][j].name) {
                            divs2.innerHTML += "<img src='" + JSON.parse(el.image).path + "/detail." + JSON.parse(el.image).extension + "' class='img-charac'/><br><span>" + el.name + "</span><br/><span style='font-size: 14px;color: #a8a8a8a8'>" + JSON.parse(res[0]["STAFF"])["items"][j]["role"] + "</span>";
                        }
                    } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
                        if (el.name === JSON.parse(res[0]["STAFF"])[j].name) {
                            divs2.innerHTML += "<img src='" + el.image.replaceAll('"', "") + "' class='img-charac'/><br><span>" + el.name + "</span>";
                        }
                    }
                    divs.appendChild(divs2);
                    divs2.style.marginTop = "10px";
                    divs2.style.textAlign = "center";
                    divs.style.marginLeft = "10px";
                    container2.appendChild(divs);
                }
            }
        });
        document.getElementById("Staff").innerHTML = "<h1>" + language["Staff"] + ":</h1> " + "<br/>" + tmpstaff;
        let scrollStaffAmount = 0;
        let moveRight2 = document.createElement("button");
        moveRight2.className = "scrollBtnR";
        moveRight2.onclick = function () {
            container2.scrollTo({
                left: Math.max(scrollStaffAmount += 140, container2.clientWidth), behavior: "smooth"
            });
        };
        moveRight2.innerHTML = "<i class='material-icons'>keyboard_arrow_right</i>";
        let moveLeft2 = document.createElement("button");
        moveLeft2.className = "scrollBtnL";
        moveLeft2.onclick = function () {
            container2.scrollTo({
                left: Math.min(scrollStaffAmount += 140, 0), behavior: "smooth"
            });
        };
        moveLeft2.innerHTML = "<i class='material-icons'>keyboard_arrow_left</i>";
        document.getElementById("Staff").appendChild(moveLeft2);
        document.getElementById("Staff").appendChild(moveRight2);
        document.getElementById("Staff").appendChild(container2);
    } else {
        document.getElementById("ColTitle").innerHTML = "<a target='_blank' href='" + res[0].SOURCE + "' style='color:white'>" + JSON.parse(res[0].title) + "<i style='font-size: 18px;top: -10px;position: relative' class='material-icons'>open_in_new</i></a>";
        document.getElementById("ImgColCover").src = res[0].cover;
        if (JSON.parse(res[0].start_date) == null) {
            document.getElementById("startDate").innerText = "?";
        } else {
            document.getElementById("startDate").innerText = (JSON.parse(res[0].start_date));
        }
        if (JSON.parse(res[0].end_date) == null || JSON.parse(res[0].end_date) > new Date().getFullYear()) {
            document.getElementById("startDate").innerText += " - ?";
        } else {
            document.getElementById("startDate").innerText += " - " + (JSON.parse(res[0].end_date));
        }
    }
    if (res[0]["chapters"] != null) {
        document.getElementById("chapters").innerText = ((provider === providerEnum.Marvel) ? (language["NumberComics"]) : (language["NumberChapter"])) + res[0]["chapters"];
    }
    document.getElementById("contentViewer").style.display = "block";
    animateCSS(document.getElementById("onContentViewer"), "fadeIn").then((message) => {
    });
    /*launchDetect(path, root);*/
    document.getElementById("detailSeparator").style.marginTop = "5vh";
    await getFromDB("Books", "PATH FROM Books WHERE unread=1 OR reading=1").then(async (resa) => {
        let continueSeriesReading;
        let bookList = JSON.parse(resa);
        console.log(bookList);
        for (let i = 0; i < bookList.length; i++) {
            if (bookList[i].PATH.toLowerCase().includes(res[0].title.toLowerCase().replaceAll('"', ''))) {
                continueSeriesReading = bookList[i].PATH;
                break;
            }
        }
        document.getElementById("playbutton").addEventListener("click", function (e) {
            let encoded = encodeURIComponent(continueSeriesReading.replaceAll("/", "%C3%B9"));
            window.location.href = "viewer.html?" + encoded;
        });
    });
    document.getElementById("checkbtn").addEventListener("click", function (e) {
        OneForAll("unread", "reading", "read", res[0].title);
        Toastifycation(language["marked_as_read"], "#00C33C");
    });
    document.getElementById("readingbtndetails").addEventListener("click", function (e) {
        OneForAll("unread", "read", "reading", res[0].title);
        Toastifycation(language["marked_as_reading"], "#00C33C");
    });
    document.getElementById("decheckbtn").addEventListener("click", function (e) {
        OneForAll("read", "reading", "unread", res[0].title);
        Toastifycation(language["marked_as_unread"], "#00C33C");
    });
    let currentFav = res[0].favorite;
    document.getElementById("favoritebtn").addEventListener("click", async function (e) {
        if (currentFav === 1) {
            Toastifycation(language["remove_fav"], "#00C33C");
            currentFav = 0;
            await getFromDB("Series", "* FROM Series WHERE favorite=1").then(async (resa) => {
                let bookList = JSON.parse(resa);
                console.log(bookList);
                for (let i = 0; i < bookList.length; i++) {
                    if (res[0].title === bookList[i].title) {
                        let options = {
                            method: "POST", headers: {
                                "Content-Type": "application/json"
                            }, body: JSON.stringify({
                                "token": currentProfile.getToken,
                                "table": "Series",
                                "column": "favorite",
                                "whereEl": bookList[i].ID_Series,
                                "value": false,
                                "where": "ID_Series"
                            }, null, 2)
                        };
                        fetch(PDP + "/DB/update", options);
                    }
                }
            });
        } else {
            Toastifycation(language["add_fav"], "#00C33C");
            currentFav = 1;
            await getFromDB("Series", "* FROM Series WHERE favorite=0").then(async (resa) => {
                let bookList = JSON.parse(resa);
                console.log(bookList);
                for (let i = 0; i < bookList.length; i++) {
                    if (res[0].title === bookList[i].title) {
                        let options = {
                            method: "POST", headers: {
                                "Content-Type": "application/json"
                            }, body: JSON.stringify({
                                "token": currentProfile.getToken,
                                "table": "Series",
                                "column": "favorite",
                                "whereEl": bookList[i].ID_Series,
                                "value": true,
                                "where": "ID_Series"
                            }, null, 2)
                        };
                        fetch(PDP + "/DB/update", options);
                    }
                }
            });
        }
    });
    if (!APINOTFOUND) {
        if (provider === providerEnum.Marvel) {
            loadView(path, libraryPath, JSON.parse(res[0].start_date), provider);
            document.getElementById("id").innerText = language["ThisseriesIDfromMarvel"] + parseInt(res[0].ID_Series);
            if (res[0].description != null && res[0].description !== "null") {
                document.getElementById("description").innerText = res[0].description;
            } else {
                document.getElementById("description").innerText = "";
            }
            document.getElementById("averageProgress").style.display = "none";
            if (JSON.parse(res[0].end_date) > new Date().getFullYear()) {
                document.getElementById("Status").innerText = language["RELEASING"];
                document.getElementById("Status").className = "releasing";
            } else if (JSON.parse(res[0].end_date) < new Date().getFullYear()) {
                document.getElementById("Status").innerText = language["FINISHED"];
                document.getElementById("Status").className = "released";
            } else if (JSON.parse(res[0].start_date) > new Date().getFullYear()) {
                document.getElementById("Status").innerText = language["NOTYETRELEASED"];
                document.getElementById("Status").className = "NotYet";
            } else if (JSON.parse(res[0].start_date) === new Date().getFullYear()) {
                document.getElementById("Status").innerText = language["ENDSOON"];
                document.getElementById("Status").className = "releasing";
            } else {
                document.getElementById("Status").innerText = language["UNKNOWN"];
                document.getElementById("Status").className = "NotYet";
            }
        } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
            loadView(path, libraryPath, "", provider);
            document.getElementById("description").innerText = res[0].description;
            document.getElementById("genres").innerText = language["Genres"] + ":";
            JSON.parse(res[0].genres).forEach((el, index) => {
                if (index !== JSON.parse(res[0].genres).length - 1) {
                    document.getElementById("genres").innerText += " " + el + ", ";
                } else {
                    document.getElementById("genres").innerText += " " + el;
                }
            });
            document.getElementById("Trending").innerText = language["trending"] + res[0]["TRENDING"];
            document.getElementById("Volumes").innerText = language["numberOfVolume"] + res[0]["volumes"];
            document.getElementById("averageScore").innerText = res[0]["Score"];
            document.querySelectorAll(".circle-small .progress.one").forEach((el) => {
                el.style.strokeDashoffset = Math.abs(100 - res[0]["Score"]);
            });
            document.documentElement.style.setProperty('--averageScore', Math.abs(100 - res[0]["Score"]));
            document.getElementById("Status").innerText = res[0]["statut"];
            if (res[0]["statut"] === "RELEASING") {
                document.getElementById("Status").className = "releasing";
            } else if (res[0]["statut"] === "FINISHED") {
                document.getElementById("Status").className = "released";
            } else if (res[0]["statut"] === "Not_YET_RELEASED") {
                document.getElementById("Status").className = "NotYet";
            }
        }
    } else {
        if (provider === providerEnum.Marvel) {
            loadView(path, libraryPath, JSON.parse(res[0].start_date), provider);
            if (res[0].description != null && res[0].description !== "null") {
                document.getElementById("description").innerText = res[0].description;
            } else {
                document.getElementById("description").innerText = "";
            }
            document.getElementById("averageProgress").style.display = "none";
            if (JSON.parse(res[0].end_date) == null && JSON.parse(res[0].start_date) == null) {
                document.getElementById("Status").innerText = language["UNKNOWN"];
                document.getElementById("Status").className = "NotYet";
            } else {
                if (JSON.parse(res[0].end_date) > new Date().getFullYear()) {
                    document.getElementById("Status").innerText = language["RELEASING"];
                    document.getElementById("Status").className = "releasing";
                } else if (JSON.parse(res[0].end_date) < new Date().getFullYear()) {
                    document.getElementById("Status").innerText = language["FINISHED"];
                    document.getElementById("Status").className = "released";
                } else if (JSON.parse(res[0].start_date) > new Date().getFullYear()) {
                    document.getElementById("Status").innerText = language["NOTYETRELEASED"];
                    document.getElementById("Status").className = "NotYet";
                } else if (JSON.parse(res[0].start_date) === new Date().getFullYear()) {
                    document.getElementById("Status").innerText = language["ENDSOON"];
                    document.getElementById("Status").className = "releasing";
                } else {
                    document.getElementById("Status").innerText = language["UNKNOWN"];
                    document.getElementById("Status").className = "NotYet";
                }
            }
        } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
            loadView(path, libraryPath, "", provider);
            document.getElementById("description").innerText = res[0].description;
            if (res[0]["TRENDING"] != null && res[0]["TRENDING"] !== "null") {
                document.getElementById("Trending").innerText = language["trending"] + res[0]["TRENDING"];
            } else {
                document.getElementById("Trending").innerText = "";
            }
            if (res[0]["volumes"] != null && res[0]["volumes"] !== "null") {
                document.getElementById("Volumes").innerText = language["numberOfVolume"] + res[0]["volumes"];
            } else {
                document.getElementById("Volumes").innerText = "";
            }
            if (res[0]["Score"] != null && res[0]["Score"] !== "null" && res[0]["Score"] !== 0) {
                document.getElementById("averageScore").innerText = res[0]["Score"];
                document.querySelectorAll(".circle-small .progress.one").forEach((el) => {
                    el.style.strokeDashoffset = Math.abs(100 - res[0]["Score"]);
                });
                document.documentElement.style.setProperty('--averageScore', Math.abs(100 - res[0]["Score"]));
            } else {
                document.getElementById("averageScore").innerText = "";
                document.querySelectorAll(".circle-small .progress.one").forEach((el) => {
                    el.style.strokeDashoffset = Math.abs(100);
                });
                document.documentElement.style.setProperty('--averageScore', Math.abs(100));
            }
            document.getElementById("Status").innerText = ((res[0]["statut"] == null) ? language["UNKNOWN"] : res[0]["statut"]);
            if (res[0]["statut"] === "RELEASING") {
                document.getElementById("Status").className = "releasing";
            } else if (res[0]["statut"] === "FINISHED") {
                document.getElementById("Status").className = "released";
            } else if (res[0]["statut"] === "Not_YET_RELEASED") {
                document.getElementById("Status").className = "NotYet";
            } else {
                document.getElementById("Status").className = "NotYet";
            }
        }
    }
    if (res[0].favorite === 1) {
        document.getElementById("Status").innerText += language["favoriteParenthesis"];
        document.getElementById("Status").classList.add("favorite");
    }
}



addToBreadCrumb(language["HOME"], () => {
    returnToHome();
});





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
 *
 * @param {{}} TheBook
 * @param provider
 * @return {Promise<void>}
 */
async function createDetails(TheBook, provider) {
    resetOverlay();

    let isLocked = () => {
        return TheBook.lock === 1 || TheBook.lock === true;
    }

    document.getElementById("lockCheck").checked = isLocked();
    document.getElementById('refresh').onclick = async () => {
        if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL) {
            Toastifycation(language["providerCannotRematch"], "#ff0000")
        } else {
            if (!isLocked()) {
                await new API().refreshMeta(TheBook.ID_book, provider, "book");
            } else {
                Toastifycation(language["bookLocked"], "#ff0000");
            }
        }
    }
    if (TheBook.characters !== "null") {
        let NameToFetchList = [];
        if (provider === providerEnum.Marvel) {
            JSON.parse(TheBook.characters)["items"].forEach((el) => {
                NameToFetchList.push("'" + el.name + "'");
            });
        } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
            JSON.parse(TheBook.characters).forEach((el) => {
                NameToFetchList.push("'" + el.name + "'");
            });
        }
        let NameToFetch = NameToFetchList.join(",");
        let container = document.createElement("div");
        await getFromDB("Characters", "* FROM Characters WHERE name IN (" + NameToFetch + ")").then((clres) => {
            clres = JSON.parse(clres);
            console.log(clres);
            container.className = "item-list";
            clres.forEach((el) => {
                const divs = document.createElement("div");
                const divs2 = document.createElement("div");
                let desc = el.description;
                let image = el.image;
                let urlo = el.url;
                let name = el.name;
                divs2.setAttribute("data-bs-toggle", "modal");
                divs2.setAttribute("data-bs-target", "#moreinfo");
                divs2.addEventListener("click", function (e) {
                    if (provider === providerEnum.Marvel) {
                        document.getElementById("moreinfo_img").src = JSON.parse(image).path + "/detail." + JSON.parse(image).extension;
                        document.getElementById("moreinfo_btn").href = JSON.parse(urlo)[0].url;
                        if (desc == null) {
                            document.getElementById("moreinfo_txt").innerText = name;
                        } else {
                            document.getElementById("moreinfo_txt").innerHTML = name + "<br/>" + desc;
                        }
                    } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
                        document.getElementById("moreinfo_img").src = image.replaceAll('"', "");
                        document.getElementById("moreinfo_btn").href = urlo;
                        if (desc == null) {
                            document.getElementById("moreinfo_txt").innerText = name;
                        } else {
                            try {
                                document.getElementById("moreinfo_txt").innerHTML = name + "<br/>" + JSON.parse(desc);
                            } catch (e) {
                                document.getElementById("moreinfo_txt").innerHTML = name + "<br/>" + desc;
                            }
                        }
                    }
                    document.getElementById("moreinfo_btn").target = "_blank";
                    document.getElementById("moreinfo_btn").innerText = language["seeMore"];
                });
                if (provider === providerEnum.Marvel) {
                    divs2.innerHTML = "<img alt='a character' src='" + JSON.parse(el.image).path + "/detail." + JSON.parse(el.image).extension + "' class='img-charac'/><br><span>" + el.name + "</span>";
                } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
                    divs2.innerHTML = "<img alt='a character' src='" + el.image.replaceAll('"', '') + "' class='img-charac'/><br><span>" + el.name + "</span>";
                }
                divs.appendChild(divs2);
                divs2.style.marginTop = "10px";
                divs2.style.textAlign = "center";
                divs.style.marginLeft = "10px";
                container.appendChild(divs);
            });
        });
        document.getElementById("characters").innerHTML = "<h1>" + language["characters"] + ":</h1> " + language["Numberofcharacters"] + ((provider === providerEnum.Marvel) ? (JSON.parse(TheBook.characters)["available"]) : ((TheBook.characters !== "null") ? (JSON.parse(TheBook.characters).length) : (0))) + "<br/>";
        document.getElementById("detailSeparator").style.marginTop = "5vh";
        let scrollCharactersAmount = 0;
        let moveRight = document.createElement("button");
        moveRight.className = "scrollBtnR";
        moveRight.onclick = function () {
            container.scrollTo({
                left: Math.max(scrollCharactersAmount += 140, container.clientWidth), behavior: "smooth"
            });
        };
        moveRight.innerHTML = "<i class='material-icons'>keyboard_arrow_right</i>";
        let moveLeft = document.createElement("button");
        moveLeft.className = "scrollBtnL";
        moveLeft.onclick = function () {
            container.scrollTo({
                left: Math.min(scrollCharactersAmount -= 140, 0), behavior: "smooth"
            });
        };
        moveLeft.innerHTML = "<i class='material-icons'>keyboard_arrow_left</i>";
        document.getElementById("characters").appendChild(moveLeft);
        document.getElementById("characters").appendChild(moveRight);
        document.getElementById("characters").appendChild(container);
    }
    //Genres
    if (TheBook.creators !== "null" && TheBook.creators !== null && TheBook.creators !== undefined && TheBook.creators !== "") {
        let tmpstaff = language["Numberofpeople"] + ((provider === providerEnum.Marvel) ? (JSON.parse(TheBook["creators"])["available"]) : ((TheBook["creators"] !== "null") ? (JSON.parse(TheBook["creators"]).length) : ("0"))) + "<br/>";
        let StaffToFetchList = [];
        if (provider === providerEnum.Marvel) {
            JSON.parse(TheBook.creators)["items"].forEach((el) => {
                StaffToFetchList.push("'" + el.name.replaceAll("'", "''") + "'");
            });
        } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL) {
            JSON.parse(TheBook.creators).forEach((el) => {
                StaffToFetchList.push("'" + el.name.replaceAll("'", "''") + "'");
            });
        } else if (provider === providerEnum.GBooks) {
            JSON.parse(TheBook.creators).forEach((el) => {
                StaffToFetchList.push("'" + el.replaceAll("'", "''") + "'");
            });
        }
        let StaffToFetch = StaffToFetchList.join(",");
        let container2 = document.createElement("div");
        await getFromDB("Creators", "* FROM Creators WHERE name IN (" + StaffToFetch + ")").then((clres) => {
            clres = JSON.parse(clres);
            container2.className = "item-list";
            for (let i = 0; i < clres.length; i++) {
                let el = clres[i];
                const divs = document.createElement("div");
                const divs2 = document.createElement("div");
                for (let j = 0; j < clres.length; j++) {
                    if (provider === providerEnum.Marvel) {
                        if (el.name === JSON.parse(TheBook.creators)["items"][j].name) {
                            divs2.innerHTML = "<img src='" + JSON.parse(el.image).path + "/detail." + JSON.parse(el.image).extension + "' class='img-charac'/><br><span>" + el.name + "</span><br/><span style='font-size: 14px;color: #a8a8a8a8'>" + JSON.parse(TheBook.creators)["items"][j]["role"] + "</span>";
                        }
                    } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
                        if (el.name === JSON.parse(TheBook.creators)[j].name) {
                            divs2.innerHTML = "<img src='" + el.image.replaceAll('"', "") + "' class='img-charac'/><br><span>" + el.name + "</span>";
                        }
                    }
                    let desc = el.description;
                    let image = el.image;
                    let urlo = el.url;
                    let name = el.name;
                    divs2.setAttribute("data-bs-toggle", "modal");
                    divs2.setAttribute("data-bs-target", "#moreinfo");
                    divs2.addEventListener("click", function (e) {
                        if (provider === providerEnum.Marvel) {
                            document.getElementById("moreinfo_img").src = JSON.parse(image).path + "/detail." + JSON.parse(image).extension;
                            document.getElementById("moreinfo_btn").href = JSON.parse(urlo)[0].url;
                            if (desc == null) {
                                document.getElementById("moreinfo_txt").innerText = name;
                            } else {
                                document.getElementById("moreinfo_txt").innerHTML = name + "<br/>" + desc;
                            }
                        } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
                            document.getElementById("moreinfo_img").src = image.replaceAll('"', "");
                            document.getElementById("moreinfo_btn").href = urlo;
                            if (desc == null) {
                                document.getElementById("moreinfo_txt").innerText = name;
                            } else {
                                try {
                                    document.getElementById("moreinfo_txt").innerHTML = name + "<br/>" + JSON.parse(desc);
                                } catch (e) {
                                    document.getElementById("moreinfo_txt").innerHTML = name + "<br/>" + desc;
                                }
                            }
                        }
                        document.getElementById("moreinfo_btn").target = "_blank";
                        document.getElementById("moreinfo_btn").innerText = language["seeMore"]
                    });
                    divs.appendChild(divs2);
                    divs2.style.marginTop = "10px";
                    divs2.style.textAlign = "center";
                    divs.style.marginLeft = "10px";
                    container2.appendChild(divs);
                }
            }
        });
        document.getElementById("Staff").innerHTML = "<h1>" + language["Staff"] + ":</h1> " + "<br/>" + tmpstaff;
        let scrollStaffAmount = 0;
        let moveRight2 = document.createElement("button");
        moveRight2.className = "scrollBtnR";
        moveRight2.onclick = function () {
            container2.scrollTo({
                left: Math.max(scrollStaffAmount += 140, container2.clientWidth), behavior: "smooth"
            });
        };
        moveRight2.innerHTML = "<i class='material-icons'>keyboard_arrow_right</i>";
        let moveLeft2 = document.createElement("button");
        moveLeft2.className = "scrollBtnL";
        moveLeft2.onclick = function () {
            container2.scrollTo({
                left: Math.min(scrollStaffAmount += 140, 0), behavior: "smooth"
            });
        };
        moveLeft2.innerHTML = "<i class='material-icons'>keyboard_arrow_left</i>";
        document.getElementById("Staff").appendChild(moveLeft2);
        document.getElementById("Staff").appendChild(moveRight2);
        document.getElementById("Staff").appendChild(container2);
    }
}


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
