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
