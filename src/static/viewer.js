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
//#region Variables

let imagelink = "null";
let nabc = 0;
let dirnameFE;

let name1 = GetFilePath().split("/").pop();
let path = GetFilePath();
console.log(name1);
let realname1 = name1.split(".")[0];
console.log(realname1);
let shortname = GetTheName(realname1);
console.log(shortname);
let rarlength = 0;
let Dpath = GetFilePath();
/*
var DPageTotal = GetListOfImg(CosmicComicsTempI).length;
*/

let BGBT = false; // Background By Theme


//get element from config.json
function GetElFromInforPath(search, info) {
	for (let i in info) {
		if (i === search) {
			return info[i];
		}
	}
	return null;
}

function BGBTF() {
	if (BGBT === true) {
		BGBT = false;
		Themes();
	} else {
		BGBT = true;
		Themes();
	}
}


//Search in the object getted
async function getFromDB(dbname, request) {
	const option = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			"request": request
		}, null, 2)
	};
	return fetch(PDP + '/DB/get/' + connected + "/" + dbname, option).then(function (response) {
		return response.text();
	}).then(function (data) {
		return data;
	}).catch(function (error) {
		console.log(error);
	});
}

document.getElementById('viewport').addEventListener('touchstart', handleTouchStart, false);
document.getElementById('viewport').addEventListener('touchmove', handleTouchMove, false);


//Send BE


let ctrlisDown = false;
let maxHeight = 10000000;
let minHeight = 100;
//Send BE
//Trigger Automatic background
function AutoBGC() {
	if (toogleBGC === true) {
		toogleBGC = false;
		modifyConfigJson(
			CosmicComicsData + "/config.json",
			"Automatic_Background_Color",
			false
		);
	} else {
		toogleBGC = true;
		modifyConfigJson(
			CosmicComicsData + "/config.json",
			"Automatic_Background_Color",
			true
		);
	}
	console.log("clicked", toogleBGC);
}

//Hide the Double Pages
function HideDB() {
	document.getElementById("imgViewer_1").style.display = "none";
}

//Show the Double Page
function showDB() {
	document.getElementById("imgViewer_1").style.display = "";
}

//Disable some inputs by default
document.getElementById("BPABS").setAttribute("disabled", "");
document.getElementById("NDPFHS").setAttribute("disabled", "");
document.getElementById("MarginValue").setAttribute("disabled", "");
//Send BE
//Toggle active Double Page Mode
function TDPM() {
	if (DoublePageMode === true) {
		try {
			modifyConfigJson(
				CosmicComicsData + "/config.json",
				"Double_Page_Mode",
				false
			);
		} catch (e) {
			console.log(e);
		}
		//TODO Desac et enlever les autres modes
		if (document.getElementById("BPABS").checked === true) {
			document.getElementById("BPABS").checked = false;
			BPAB();
		}
		if (document.getElementById("NDPFHS").checked === true) {
			document.getElementById("NDPFHS").checked = false;
			NDPFH();
		}
		document.getElementById("BPABS").setAttribute("disabled", "");
		document.getElementById("NDPFHS").setAttribute("disabled", "");
		document.getElementById("MarginValue").setAttribute("disabled", "");
		DoublePageMode = false;
		wasDPM = false;
		HideDB();
	} else {
		try {
			modifyConfigJson(
				CosmicComicsData + "/config.json",
				"Double_Page_Mode",
				true
			);
		} catch (e) {
			console.log(e);
		}
		//TODO Activate les autres modes
		document.getElementById("BPABS").removeAttribute("disabled");
		document.getElementById("MarginValue").removeAttribute("disabled");
		document.getElementById("NDPFHS").removeAttribute("disabled");
		DoublePageMode = true;
		wasDPM = true;
		let currentPage = GetCurrentPage();
		if (currentPage % 2 === 0) {
			Reader(listofImg, currentPage - 1);
		} else {
			Reader(listofImg, currentPage);
		}
		showDB();
	}
}

//Send BE
//Change the margin
function MarginSlider() {
	if (VIV_On === true) {
		for (let i = 0; i < VIV_Count; i++) {
			document.getElementById("imgViewer_" + i).style.marginBottom =
				document.getElementById("MarginValue").value;
			document.getElementById("marginlvl").innerText =
				language["margin"] +
				" (" +
				document.getElementById("MarginValue").value +
				" px):";
			modifyConfigJson(
				CosmicComicsData + "/config.json",
				"Margin",
				document.getElementById("MarginValue").value
			);
		}
	} else {
		document.getElementById("imgViewer_1").style.marginLeft =
			document.getElementById("MarginValue").value;
		document.getElementById("marginlvl").innerText =
			language["margin"] +
			" (" +
			document.getElementById("MarginValue").value +
			" px):";
		modifyConfigJson(
			CosmicComicsData + "/config.json",
			"Margin",
			document.getElementById("MarginValue").value
		);
	}
}

//Send BE
//Blank first page at begginning
function BPAB() {
	if (BlankFirstPage === true) {
		modifyConfigJson(
			CosmicComicsData + "/config.json",
			"Blank_page_At_Begginning",
			false
		);
		BlankFirstPage = false;
		let currentPage = GetCurrentPage();
		Reader(listofImg, currentPage);
	} else {
		modifyConfigJson(
			CosmicComicsData + "/config.json",
			"Blank_page_At_Begginning",
			true
		);
		BlankFirstPage = true;
		let currentPage = GetCurrentPage();
		Reader(listofImg, currentPage);
	}
}

//Detect if the image is Horizontal or Vertical
function DetectHorizontal(page) {
	if (page.width > page.height) {
		return true;
	} else {
		return false;
	}
}

//Getting the orientation (Horizontal or Vertical) of the next image
function getTheHOfNextImage() {
	let CurrentPage = GetCurrentPage();
	let NextPage = CurrentPage + 1;
	let image = new Image();
	image.src = CosmicComicsTempI + listofImg[NextPage];
	let H = DetectHorizontal(image);
	return H;
}

//Getting the orientation (Horizontal or Vertical) of the previous image
function GetTheHOfPreviousImage() {
	let CurrentPage = GetCurrentPage();
	let NextPage = CurrentPage - 2;
	let image = new Image();
	image.src = CosmicComicsTempI + listofImg[NextPage];
	let H = DetectHorizontal(image);
	return H;
}

//Send BE
//No Double Page when Horizontal
function NDPFH() {
	if (DPMNoH === true) {
		modifyConfigJson(
			CosmicComicsData + "/config.json",
			"No_Double_Page_For_Horizontal",
			false
		);
		DPMNoH = false;
		let currentPage = GetCurrentPage();
	} else {
		modifyConfigJson(
			CosmicComicsData + "/config.json",
			"No_Double_Page_For_Horizontal",
			true
		);
		DPMNoH = true;
		let currentPage = GetCurrentPage();
	}
}

//Send BE
//Manga Mode
function MMT() {
	if (mangaMode === true) {
		modifyConfigJson(
			"config",
			"Manga_Mode",
			false
		);
		mangaMode = false;
	} else {
		modifyConfigJson(
			"config",
			"Manga_Mode",
			true
		);
		mangaMode = true;
	}
	console.log(mangaMode);
}

//Rotation of an element
let degreesT = 0;
let AlwaysRotateB = false;
let AlwaysRotateV = 0;

//Send BE
//Always rotate image
function AlwaysRotate() {
	let rotateval = document.getElementById("RotateValue").value;
	AlwaysRotateB = true;
	AlwaysRotateV = rotateval;
	if (rotateval === 0) {
		AlwaysRotateB = false;
		AlwaysRotateV = 0;
	}
	if (VIV_On === true) {
		for (let i = 0; i < VIV_Count; i++) {
			document.getElementById("imgViewer_" + i).style.transform =
				"rotate(" + AlwaysRotateV + "deg)";
		}
	} else {
		document.getElementById("imgViewer_0").style.transform =
			"rotate(" + AlwaysRotateV + "deg)";
		document.getElementById("imgViewer_1").style.transform =
			"rotate(" + AlwaysRotateV + "deg)";
		document.getElementById("rotlvl").innerText =
			language["rotation"] + " (" + rotateval + " degrees):";
	}
	modifyConfigJson(
		CosmicComicsData + "/config.json",
		"Rotate_All",
		AlwaysRotateV
	);
}

//Send BE
//Slide Show
let TSSON = false;

function TSS() {
	if (TSSON === true) {
		modifyConfigJson(
			CosmicComicsData + "/config.json",
			"SlideShow",
			false
		);
		TSSON = false;
	} else {
		modifyConfigJson(CosmicComicsData + "/config.json", "SlideShow", true);
		TSSON = true;
		let intervalTime = document.getElementById("SSValue").value * 1000;
		let slideshowID = setInterval(() => {
			if (TSSON === false) {
				clearInterval(slideshowID);
			} else {
				NextPage();
			}
		}, intervalTime);
	}
}

//Text of the Slide Show slider
function ShowOnChangeSlideShow() {
	document.getElementById("sstxt").innerText =
		language["slideshow_interval"] +
		" (" +
		document.getElementById("SSValue").value +
		" " +
		language["secondes"] +
		"):";
}

//Send BE
//No bar Mode
let BarOn = true;

function NoBAR() {
	if (BarOn === true) {
		document.getElementsByTagName("header")[0].style.display = "none";
		modifyConfigJson(CosmicComicsData + "/config.json", "NoBar", true);
		BarOn = false;
		let newdiv = document.createElement("div");
		newdiv.id = "nobarr";
		newdiv.style.width = "100%";
		newdiv.style.height = "10px";
		newdiv.style.position = "fixed";
		newdiv.style.zIndex = "10000000";
		newdiv.addEventListener("mouseover", function () {
			NoBAR();
			document.getElementById("NBAR").checked = false;
		});
		document.body.insertBefore(newdiv, document.body.firstChild);
		FixHeight();
	} else {
		modifyConfigJson(CosmicComicsData + "/config.json", "NoBar", false);
		BarOn = true;
		document.getElementsByTagName("header")[0].style.display = "block";
		FixHeight();
		document.body.removeChild(document.getElementById("nobarr"));
	}
}

//Send BE
//Vertical Image Viewer Mode
function VIVT() {
	if (VIV_On === true) {
		modifyConfigJson(
			CosmicComicsData + "/config.json",
			"Vertical_Reader_Mode",
			false
		);
		window.location.reload();
	} else {
		modifyConfigJson(
			CosmicComicsData + "/config.json",
			"Vertical_Reader_Mode",
			true
		);
		VIV_On = true;
		CreateAllVIV();
		document.getElementById("BPABS").setAttribute("disabled", "");
		document.getElementById("NDPFHS").setAttribute("disabled", "");
		document.getElementById("TDPMS").setAttribute("disabled", "");
		document.getElementById("MMS").setAttribute("disabled", "");
		document.getElementById("MarginValue").removeAttribute("disabled");
	}
}

//Create all Vertical Image
function CreateAllVIV() {
	let el = document.getElementById("viewport");
	document.getElementById("imgViewer_0").remove();
	document.getElementById("imgViewer_1").remove();
	VIV_Count = listofImg.length;
	for (let i = 0; i < listofImg.length; i++) {
		const imgel = document.createElement("img");
		const div = document.createElement("div");
		imgel.id = "imgViewer_" + i;
		let options = {
			"method": "GET",
			"headers": {
				"Content-Type": "application/json",
				"path": DirectoryPath,
				"token": connected,
				"met": isADirectory ? "DL" : "CLASSIC",
				"page": listofImg[i]
			}
		};
		fetch(PDP + "/view/readImage", options).then(async (response) => {
			imgel.src = URL.createObjectURL(await response.blob());
		});
		div.appendChild(imgel);
		div.id = "div_imgViewer_" + i;
		el.appendChild(div);
		observer.observe(document.querySelector("#div_imgViewer_" + i));
	}
}

//observer to know where you are on the page
let observer = new IntersectionObserver(
	function (entries) {
		if (entries[0].isIntersecting === true)
			document.getElementById("currentpage").innerText =
				parseInt(entries[0].target.id.split("div_imgViewer_")[1]) +
				1 +
				" / " +
				VIV_Count;
		try {
			for (let i = 0; i < VIV_Count; i++) {
				document.getElementById("id_img_" + i).className = "";
			}
			document.getElementById(
				"id_img_" +
				(parseInt(
					document.getElementById("currentpage").innerHTML.split(" ")[0]
				) -
					1)
			).className = "SideBar_current";
			document.getElementById("SideBar").scrollTop =
				document.getElementById(
					"id_img_" +
					(parseInt(
						document.getElementById("currentpage").innerHTML.split(" ")[0]
					) -
						1)
				).offsetTop - 200;
		} catch (e) {
			console.log(e);
		}
	},
	{ threshold: [0.1] }
);

//Send BE
//Webtoon Mode
let WTMTV = false;

function WTMT() {
	if (WTMTV === true) {
		WTMTV = false;
		modifyConfigJson(
			CosmicComicsData + "/config.json",
			"WebToonMode",
			false
		);
		window.location.reload();
	} else {
		WTMTV = true;
		VIV_On = true;
		CreateAllVIV();
		document.getElementById("BPABS").setAttribute("disabled", "");
		document.getElementById("NDPFHS").setAttribute("disabled", "");
		document.getElementById("TDPMS").setAttribute("disabled", "");
		document.getElementById("MMS").setAttribute("disabled", "");
		document.getElementById("MarginValue").removeAttribute("disabled");
		FixWidth();
		modifyConfigJson(
			CosmicComicsData + "/config.json",
			"WebToonMode",
			true
		);
	}
}

//Send BE
//reset zoom for each page
let RZPV = false;

function RZP() {
	if (RZPV === true) {
		modifyConfigJson(
			CosmicComicsData + "/config.json",
			"reset_zoom",
			false
		);
		RZPV = false;
	} else {
		modifyConfigJson(
			CosmicComicsData + "/config.json",
			"reset_zoom",
			true
		);
		RZPV = true;
	}
}

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

let nb_of_next = 0;
let nb_of_prev = 0;

//Click left do previous and click right do next
document.getElementById("viewport").addEventListener("click", function () {
	PreviousPage();
});
document
	.getElementById("viewport")
	.addEventListener("contextmenu", function (event) {
		event.preventDefault();
		NextPage();
	});
//Wait before Image load up
document.getElementById("imgViewer_0").onload = function () {
	document.getElementById("imgViewer_0").style.display = "";
};
document.getElementById("imgViewer_1").onload = function () {
	document.getElementById("imgViewer_1").style.display = "";
};
