
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
