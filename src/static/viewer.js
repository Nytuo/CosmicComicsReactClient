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



new bootstrap.Tooltip(document.getElementById("id_mkread"), {
	title: language["mkread"],
	placement: "bottom"
});
new bootstrap.Tooltip(document.getElementById("id_mkreading"), {
	title: language["mkreading"],
	placement: "bottom"
});
new bootstrap.Tooltip(document.getElementById("id_mkunread"), {
	title: language["mkunread"],
	placement: "bottom"
});
new bootstrap.Tooltip(document.getElementById("id_togglefav"), {
	title: language["toogle_fav"],
	placement: "bottom"
});

new bootstrap.Tooltip(document.getElementById("id_autobgcolor"), {
	title: language["auto_bg_color"],
	placement: "bottom"
});

(document.getElementById("id_magnifiermod").innerText =
	language["magnifier_mod"]),
	(document.getElementById("zoomlvl").innerText = language["zoom"]);
document.getElementById("widthlvl").innerText = language["width"];
document.getElementById("heightlvl").innerText = language["height"];
document.getElementById("BGBTTXT").innerText =
	language["background_by_theme"];
document.getElementById("Radiuslvl").innerText = language["radius"];
new bootstrap.Tooltip(document.getElementById("magnifier_note"), {
	title: language["magnifier_note"],
	placement: "bottom"
});
document.getElementById("id_spawnmagnifier").innerText =
	language["spawn_magnifier"];
document.getElementById("id_destroymagnifier").innerText =
	language["destroy_magnifier"];
document.getElementById("id_booksettings").innerText =
	language["book_settings"];
console.log(language["book_settings"]);
document.getElementById("DPMTXT").innerText = language["double_page_mode"];
document.getElementById("BPABTXT").innerText =
	language["blank_at_beggining"];
document.getElementById("NDPFHTXT").innerText =
	language["no_dpm_horizontal"];
document.getElementById("MMTXT").innerText = language["manga_mode"];
document.getElementById("SSTXT").innerText = language["Slideshow"];
document.getElementById("NBARTXT").innerText = language["nobar"];
document.getElementById("SSBTXT").innerText = language["sideBar"];
document.getElementById("PCTXT").innerText = language["PageCount"];
document.getElementById("VIVTXT").innerText = language["vertical_reader"];
document.getElementById("WTMTXT").innerText = language["Webtoon_Mode"];
document.getElementById("RZPSTXT").innerText = language["reset_zoom"];
document.getElementById("SBVSTXT").innerText = language["scrollBar_visible"];
document.getElementById("marginlvl").innerText = language["margin"];
document.getElementById("rotlvl").innerText = language["rotation"];
document.getElementById("zlvll").innerText = language["zoomlvl"];
document.getElementById("sstxt").innerText = language["slideshow_interval"];
document.getElementById("lsps").innerText = language["page_slider"];
document.getElementById("colorpicker_txt_id").innerText =
	language["color_picker"];
document.getElementById("close_id_books").innerText = language["close"];

let BGBT = false; // Background By Theme

//#endregion
//Send BE
//get language reference for the selected language
function lang(langg) {
	fetch(PDP + "/lang/" + langg).then(
		(response) => {
			response.json().then((data) => {
				return data;
			});
		}
	);
}

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


//Display by Height
function FixHeight() {
	let height =
		window.innerHeight - document.getElementsByTagName("nav")[0].offsetHeight;
	if (VIV_On === true) {
		for (let i = 0; i < VIV_Count; i++) {
			document.getElementById("imgViewer_" + i).style.height = height + "px";
			document.getElementById("imgViewer_" + i).style.width = "auto";
		}
	}
	if (BarOn === false) {
		document.getElementById("imgViewer_0").style.height = window.innerHeight + "px";
		document.getElementById("imgViewer_0").style.width = "auto";
		document.getElementById("imgViewer_1").style.height = window.innerHeight + "px";
		document.getElementById("imgViewer_1").style.width = "auto";
	} else {
		document.getElementById("imgViewer_0").style.height = height + "px";
		document.getElementById("imgViewer_0").style.width = "auto";
		document.getElementById("imgViewer_1").style.height = height + "px";
		document.getElementById("imgViewer_1").style.width = "auto";
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

//mark as read
function markasread() {
	Toastifycation(language["marked_as_read"], "#00C33C");
	ModifyDB(
		"Books",
		"reading",
		false,
		shortname
	).then(() => {
		ModifyDB(
			"Books",
			"unread",
			false,
			shortname
		).then(() => {
			ModifyDB(
				"Books",
				"read",
				true,
				shortname
			);
		});
	});
}

//Mark as unread
function markasunread() {
	Toastifycation(language["marked_as_unread"], "#00C33C");
	ModifyDB(
		"Books",
		"reading",
		false,
		shortname
	).then(() => {
		ModifyDB(
			"Books",
			"read",
			false,
			shortname
		).then(() => {
			ModifyDB(
				"Books",
				"unread",
				true,
				shortname
			);
		});
	});
}


//Send BE
//mark as reading
function markasreading() {
	console.log("reading");
	Toastifycation(language["marked_as_reading"], "#00C33C");
	ModifyDB(
		"Books",
		"reading",
		true,
		shortname
	).then(() => {
		ModifyDB(
			"Books",
			"read",
			false,
			shortname
		).then(() => {
			ModifyDB(
				"Books",
				"unread",
				false,
				shortname
			);
		});
	});
}

//Send BE
//Toggle the favorite status
function ToogleFav() {
	getFromDB("Books", "favorite FROM Books WHERE PATH='" + path + "'").then((res) => {
		console.log(info);
		res = JSON.parse(res)[0]["favorite"];
		console.log(res);
		if (res) {
			Toastifycation(language["remove_fav"], "#00C33C");
			document.getElementById("favoicon").innerText = "favorite_border";
			ModifyDB(
				"Books",
				"favorite",
				false,
				shortname
			);
		} else {
			Toastifycation(language["add_fav"], "#00C33C");
			document.getElementById("favoicon").innerText = "favorite";
			ModifyDB(
				"Books",
				"favorite",
				true,
				shortname
			);
		}
	});
}

document.getElementById('viewport').addEventListener('touchstart', handleTouchStart, false);
document.getElementById('viewport').addEventListener('touchmove', handleTouchMove, false);

let xDown = null;
let yDown = null;

function getTouches(evt) {
	return evt.touches ||             // browser API
		evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
	const firstTouch = getTouches(evt)[0];
	xDown = firstTouch.clientX;
	yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
	if (!xDown || !yDown) {
		return;
	}

	let xUp = evt.touches[0].clientX;
	let yUp = evt.touches[0].clientY;

	let xDiff = xDown - xUp;
	let yDiff = yDown - yUp;

	if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
		if (xDiff > 0) {
			NextPage();
		} else {
			PreviousPage();
		}
	}
	/* reset values */
	xDown = null;
	yDown = null;
};


//Send BE
//Modify the JSON for config.json
function modifyConfigJson(json, tomod, mod) {
	//check si obj exist pour remplacer valeur
	fetch(PDP + "/config/getConfig/" + connected).then(function (response) {
		return response.text();
	}).then(function (data) {
		let configFile = data;
		let config = JSON.parse(configFile);
		for (let i in config) {
			config[tomod] = mod;
		}
		const option = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(config, null, 2)
		};
		fetch('/config/writeConfig/' + connected, option);
	}).catch(function (error) {
		console.log(error);
	});
}


//Detect where the wheel go
function detectMouseWheelDirection(e) {
	let delta = null,
		direction = false;
	if (!e) {
		// if the event is not provided, we get it from the window object
		e = window.event;
	}
	if (e.wheelDelta) {
		// will work in most cases
		delta = e.wheelDelta / 60;
	} else if (e.detail) {
		// fallback for Firefox
		delta = -e.detail / 2;
	}
	if (delta !== null) {
		direction = delta > 0 ? "up" : "down";
	}
	return direction;
}

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

//Fix the view to width
function FixWidth() {
	document.getElementById("imgViewer_0").style.width =
		window.innerWidth - 5 + "px";
	document.getElementById("imgViewer_0").style.height = "auto";
	if (DoublePageMode === true) {
		document.getElementById("imgViewer_0").style.width =
			(window.innerWidth - 5) / 2 + "px";
		document.getElementById("imgViewer_0").style.height = "auto";
		document.getElementById("imgViewer_1").style.width =
			(window.innerWidth - 5) / 2 + "px";
		document.getElementById("imgViewer_1").style.height = "auto";
	}
	if (SideBarOn === true) {
		document.getElementById("imgViewer_0").style.width =
			window.innerWidth - 205 + "px";
		document.getElementById("imgViewer_0").style.height = "auto";
		document.getElementById("imgViewer_1").style.width =
			window.innerWidth - 205 + "px";
		document.getElementById("imgViewer_1").style.height = "auto";
	}
	if (VIV_On === true) {
		for (let i = 0; i < VIV_Count; i++) {
			if (SideBarOn === true) {
				document.getElementById("imgViewer_" + i).style.width =
					window.innerWidth - 205 + "px";
				document.getElementById("imgViewer_" + i).style.height = "auto";
			} else {
				document.getElementById("imgViewer_" + i).style.width =
					window.innerWidth - 5 + "px";
				document.getElementById("imgViewer_" + i).style.height = "auto";
			}
		}
	}
}

//Toogle mark as Bookmarks
//Send BE
function TBM() {
	//check if bookmark is already bookmarked
	let thepage = GetCurrentPage();
	let filePath = GetFilePath();
	getFromDB("Bookmarks", "PATH,page FROM Bookmarks WHERE BOOK_ID='" + bookID + "' AND PATH='" + filePath + "' AND page=" + thepage + ";").then((res1) => {
		let jres = JSON.parse(res1);
		if (jres.length !== 0) {
			console.log(jres);
			if (jres[0]["page"] === GetCurrentPage()) {
				DeleteFromDB(
					"Bookmarks",
					bookID,
					"AND page=" + GetCurrentPage()
				);
				document.getElementById("BMI").innerText = "bookmark_border";
			}
		} else {
			console.log("Bookmarks doesn't exist yet!");
			InsertIntoDB(
				"bookmarks",
				"(BOOK_ID,PATH,page)",
				"('" + bookID + "','" + GetFilePath() + "','" + GetCurrentPage() + "')"
			);
			document.getElementById("BMI").innerText = "bookmark";
		}
	});
}

//Send BE


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

//Not working apply a shadow btw the pages (when Double page mode is actived)
function showShadow() {
	if (
		document.getElementById("id_checkshadow").getAttribute("checked") != null
	) {
		document.getElementById("imgViewer_1").classList.add("pageShadow");
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


//Error When loading images
document.getElementById("imgViewer_0").onerror = function () {
	Toastifycation(language["error"], "#ff0000");
	document.getElementById("imgViewer_0").src = "Images/fileDefault.webp";
};
document.getElementById("imgViewer_1").onerror = function () {
	Toastifycation(language["error"], "#ff0000");
	document.getElementById("imgViewer_1").src = "Images/fileDefault.webp";
};
document.getElementById("imgViewer_0").addEventListener("load", () => {
	document.getElementById("overlay").style.display = "none";
});
document.getElementById("imgViewer_0").addEventListener("loadstart", () => {
	document.getElementById("overlay").style.display = "block";
});

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

//Invert the list passed in parameters
function invertList(list = []) {
	let newlist = [];
	for (let i = 0; i < list.length; i++) {
		newlist[i] = list[i];
	}
	newlist.reverse();
	return newlist;
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

//FullScreen
let fsOn = false;

function fullscreen() {
	if (fsOn === true) {
		fsOn = false;
		document.exitFullscreen();
		document.getElementById("fullscreen_i_id").innerText = "fullscreen";
	} else {
		fsOn = true;
		document.documentElement.requestFullscreen();
		document.getElementById("fullscreen_i_id").innerText = "fullscreen_exit";
	}
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

let SideBarOn = false;
//Send BE
//Toggle SideBar
function TSB() {
	if (SideBarOn === true) {
		SideBarOn = false;
		modifyConfigJson(CosmicComicsData + "/config.json", "SideBar", false);
		document.getElementById("SideBar").style.display = "none";
		document.getElementById("viewport").style = "text-align: center;";
	} else {
		SideBarOn = true;
		modifyConfigJson(CosmicComicsData + "/config.json", "SideBar", true);
		document.getElementById("SideBar").style.display = "block";
		document.getElementById("viewport").style =
			"text-align: center;padding-left: 200px;";
		ConstructSideBar();
	}
}

//Construct the SideBar
function ConstructSideBar() {
	if (document.getElementById("SideBar").childElementCount === 0) {
		console.log(listofImg);
		listofImg.forEach((image, index) => {
			let el = document.getElementById("SideBar");
			const divcontainer = document.createElement("div");
			const acontainer = document.createElement("a");
			const pel = document.createElement("p");
			const img = document.createElement("img");
			let options = {
				"method": "GET",
				"headers": {
					"Content-Type": "application/json",
					"path": DirectoryPath,
					"token": connected,
					"met": isADirectory ? "DL" : "CLASSIC",
					"page": image
				}
			};
			fetch(PDP + "/view/readImage", options).then(async (response) => {
				img.src = URL.createObjectURL(await response.blob());
			});
			img.height = "120";
			pel.innerText = index + 1;
			acontainer.appendChild(img);
			acontainer.appendChild(pel);
			divcontainer.id = "id_img_" + index;
			acontainer.style.color = "white";
			acontainer.style.width = "100%";
			divcontainer.style.cursor = "pointer";
			divcontainer.addEventListener("click", function (e) {
				e.preventDefault();
				if (VIV_On === true) {
					window.scrollTo(
						0,
						document.getElementById("imgViewer_" + index).offsetTop -
						document.getElementsByTagName("header")[0].offsetHeight
					);
				} else {
					Reader(listofImg, index);
				}
			});
			acontainer.href = "#";
			divcontainer.appendChild(acontainer);
			el.appendChild(divcontainer);
		});
	}
}

//Fix view by Height by default
FixHeight();
//Send BE
//Page Counter on/off
let DM_CurrentPage = true;

function ChangeDM_CurrentPage() {
	if (DM_CurrentPage === true) {
		modifyConfigJson(
			CosmicComicsData + "/config.json",
			"Page_Counter",
			false
		);
		DM_CurrentPage = false;
		document.getElementById("currentpage").style.display = "none";
	} else {
		modifyConfigJson(
			CosmicComicsData + "/config.json",
			"Page_Counter",
			true
		);
		DM_CurrentPage = true;
		document.getElementById("currentpage").style.display = "block";
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

//Can move direclty to a page by using a slider
function pageslide() {
	let pageto = document.getElementById("sps").value - 1;
	document.getElementById("lsps").innerText =
		language["page_slider"] +
		" (" +
		document.getElementById("sps").value +
		"):";
	Reader(listofImg, pageto);
}

//Do not remember what this do, sorry
function pagechoose() {
	let pageto = document.getElementById("input_text").value - 1;
	if (
		pageto >= document.getElementById("sps").min - 1 &&
		pageto <= document.getElementById("sps").max - 1
	) {
		Reader(listofImg, pageto);
	} else {
		Toastifycation(language["not_available"], "#ff0000");
	}
}

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
//Change Background Color by color picker
function changeBGColorByPicker() {
	let value = document.getElementById("exampleColorInput").value;
	document.getElementsByTagName("html")[0].style.backgroundColor = value;
	modifyConfigJson(
		CosmicComicsData + "/config.json",
		"Background_color",
		value
	);
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

//Send BE
//Scroll bar visible
let scrollbarvisibiel = true;

function SBVT() {
	if (scrollbarvisibiel === true) {
		setNoScrollbar();
		modifyConfigJson(
			CosmicComicsData + "/config.json",
			"Scroll_bar_visible",
			false
		);
		scrollbarvisibiel = false;
	} else {
		setScrollbar();
		modifyConfigJson(
			CosmicComicsData + "/config.json",
			"Scroll_bar_visible",
			true
		);
		scrollbarvisibiel = true;
	}
}

//Set no scrollbar
function setNoScrollbar() {
	let styleSheet = document.styleSheets[document.styleSheets.length - 3];
	styleSheet.insertRule("::-webkit-scrollbar {display: none;}");
}

//Set scrollbar
function setScrollbar() {
	let styleSheet = document.styleSheets[document.styleSheets.length - 3];
	styleSheet.removeRule("::-webkit-scrollbar {display: none;}");
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
//Detect if you are on the bottom or top
let Auth_Prev = false;
let Auth_next = false;
window.onscroll = function (ev) {
	if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
		console.log("You're at the bottom");
		Auth_next = true;
	} else {
		Auth_next = false;
	}
	if (window.scrollY === 0) {
		console.log("You're at the top");
		Auth_Prev = true;
	} else {
		Auth_Prev = false;
	}
};
let nb_of_next = 0;
let nb_of_prev = 0;
//Go to the next or previous page by scrolling
window.addEventListener("wheel", function (e) {
	if (ctrlisDown) {
		console.log(ctrlisDown);
		ctrlisDown = false;
		let direc = detectMouseWheelDirection(e);
		console.log(direc);
		if (direc === "down") {
			if (
				parseInt(document.getElementById("imgViewer_0").style.height) - 100 >
				minHeight
			) {
				ZoomOut();
			}
		} else if (direc === "up") {
			if (
				parseInt(document.getElementById("imgViewer_0").style.height) + 100 <
				maxHeight
			) {
				ZoomIn();
			}
		}
	} else {
		if (Auth_next === true) {
			nb_of_next += 1;
			if (nb_of_next === 2) {
				nb_of_next = 0;
				nb_of_prev = 0;
				Auth_next = false;
				Auth_Prev = false;
				NextPage();
			}
		}
		if (Auth_Prev === true) {
			nb_of_prev += 1;
			if (nb_of_prev === 2) {
				nb_of_next = 0;
				Auth_next = false;
				nb_of_prev = 0;
				Auth_Prev = false;
				PreviousPage();
			}
		}
	}
});
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
