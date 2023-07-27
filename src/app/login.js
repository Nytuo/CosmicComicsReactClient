
document.getElementById("ThePassToWord").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        document.getElementById("loginInBtn").click();
    }
})