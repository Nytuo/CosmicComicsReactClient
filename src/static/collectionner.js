





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
