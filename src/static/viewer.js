//Load the parameters
//Send BE
function loadParameters() {
	fetch(PDP + "/config/getConfig/" + connected).then(function (response) {
		return response.text();
	}).then(function (data) {
		console.log(data);
		let configFile = data;
		let parsedJSON = JSON.parse(configFile);
		let configZoomLVL = GetElFromInforPath("ZoomLVL", parsedJSON);
		let configSBV = GetElFromInforPath("Scroll_bar_visible", parsedJSON);
		let configBGC = GetElFromInforPath("Background_color", parsedJSON);
		let configWTM = GetElFromInforPath("WebToonMode", parsedJSON);
		let configVRM = GetElFromInforPath("Vertical_Reader_Mode", parsedJSON);
		let configPC = GetElFromInforPath("Page_Counter", parsedJSON);
		let configSB = GetElFromInforPath("SideBar", parsedJSON);
		let configNB = GetElFromInforPath("NoBar", parsedJSON);
		let configSS = GetElFromInforPath("SlideShow", parsedJSON);
		let configSST = GetElFromInforPath("SlideShow_Time", parsedJSON);
		let configRA = GetElFromInforPath("Rotate_All", parsedJSON);
		let configM = GetElFromInforPath("Margin", parsedJSON);
		let configMM = GetElFromInforPath("Manga_Mode", parsedJSON);
		let configNDPFH = GetElFromInforPath(
			"No_Double_Page_For_Horizontal",
			parsedJSON
		);
		let configBPAB = GetElFromInforPath("Blank_page_At_Begginning", parsedJSON);
		let configDPM = GetElFromInforPath("Double_Page_Mode", parsedJSON);
		let configABC = GetElFromInforPath("Automatic_Background_Color", parsedJSON);
		let configMZ = GetElFromInforPath("magnifier_zoom", parsedJSON);
		let configMW = GetElFromInforPath("magnifier_Width", parsedJSON);
		let configMH = GetElFromInforPath("magnifier_Height", parsedJSON);
		let configMR = GetElFromInforPath("magnifier_Radius", parsedJSON);
		let configRZ = GetElFromInforPath("reset_zoom", parsedJSON);
		ZoomLVL = configZoomLVL;
		if (configSBV === false) {
			SBVT();
			document.getElementById("SBVS").checked = false;
		}
		if (configWTM === true) {
			WTMT();
			document.getElementById("WTM").checked = true;
		}
		let value = configBGC;
		document.getElementsByTagName("html")[0].style.backgroundColor = value;
		document.getElementById("exampleColorInput").value = value;
		if (configVRM === true) {
			VIVT();
			document.getElementById("VIV").checked = true;
		}
		if (configPC === false) {
			ChangeDM_CurrentPage();
			document.getElementById("PC").checked = false;
		}
		if (configSB === true) {
			TSB();
			document.getElementById("SSB").checked = true;
		}
		if (configNB === true) {
			NoBAR();
			document.getElementById("NBAR").checked = true;
		}
		if (configSS === true) {
			document.getElementById("SS").checked = true;
			if (TSSON === true) {
				TSSON = false;
			} else {
				TSSON = true;
				let intervalTime = configSST;
				let slideshowID = setInterval(() => {
					if (TSSON === false) {
						clearInterval(slideshowID);
					} else {
						NextPage();
					}
				}, intervalTime);
			}
		}
		document.getElementById("sstxt").innerText =
			language["slideshow_interval"] +
			" (" +
			configSST +
			" " +
			language["secondes"] +
			"):";
		document.getElementById("RotateValue").value = configRA;
		AlwaysRotate();
		if (VIV_On === true) {
			for (let i = 0; i < VIV_Count; i++) {
				document.getElementById("imgViewer_" + i).style.marginBottom = configM;
				document.getElementById("marginlvl").innerText =
					language["margin"] + " (" + configM + " px):";
			}
		} else {
			document.getElementById("imgViewer_1").style.marginLeft = configM;
			document.getElementById("marginlvl").innerText =
				language["margin"] + " (" + configM + " px):";
		}
		if (configMM === true) {
			MMT();
			document.getElementById("MMS").checked = true;
		}
		if (configNDPFH === true) {
			NDPFH();
			document.getElementById("NDPFHS").checked = true;
		}
		if (configBPAB === true) {
			BPAB();
			document.getElementById("BPABS").checked = true;
		}
		if (configDPM === true) {
			TDPM();
			document.getElementById("TDPMS").checked = true;
		}
		if (configABC === true) {
			AutoBGC();
		}
		document.getElementById("Heightvalue").value = configMH;
		document.getElementById("widthvalue").value = configMW;
		document.getElementById("zoomvalue").value = configMZ;
		document.getElementById("Radiusvalue").value = configMR;
		document.getElementById("SSValue").value = configSST;
		document.getElementById("MarginValue").value = configM;
		if (configRZ === true) {
			RZP();
			document.getElementById("RZPS").checked = true;
		}
	}).catch(function (error) {
		console.log(error);
	});
}

//Envoie BE
document.getElementById("Heightvalue").onchange = function () {
	modifyConfigJson(
		CosmicComicsData + "/config.json",
		"magnifier_Height",
		parseInt(document.getElementById("Heightvalue").value)
	);
};
document.getElementById("widthvalue").onchange = function () {
	modifyConfigJson(
		CosmicComicsData + "/config.json",
		"magnifier_Width",
		parseInt(document.getElementById("widthvalue").value)
	);
};
document.getElementById("zoomvalue").onchange = function () {
	modifyConfigJson(
		CosmicComicsData + "/config.json",
		"magnifier_zoom",
		parseInt(document.getElementById("zoomvalue").value)
	);
};
document.getElementById("Radiusvalue").onchange = function () {
	modifyConfigJson(
		CosmicComicsData + "/config.json",
		"magnifier_Radius",
		parseInt(document.getElementById("Radiusvalue").value)
	);
};
document.getElementById("SSValue").onchange = function () {
	ShowOnChangeSlideShow();
	modifyConfigJson(
		CosmicComicsData + "/config.json",
		"SlideShow_Time",
		parseInt(document.getElementById("SSValue").value)
	);
};