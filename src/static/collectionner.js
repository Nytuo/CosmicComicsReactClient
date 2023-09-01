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
