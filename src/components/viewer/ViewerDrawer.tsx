/* eslint-disable react-hooks/exhaustive-deps */
// noinspection AllyJsxHardcodedStringInspection

import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  AlignHorizontalCenter,
  CollectionsBookmark,
  FirstPage,
  Fullscreen,
  FullscreenExit,
  LastPage,
  NavigateBefore,
  NavigateNext,
  Tune,
  VerticalAlignCenter,
} from "@mui/icons-material";
import { LinearProgress, Stack, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import MovableImage from "./MovableImage.tsx";
import {
  ToasterHandler,
  ToasterHandlerPromise,
} from "../common/ToasterHandler.tsx";
import { getCookie, PDP } from "@/utils/Common.ts";
import {
  DeleteFromDB,
  getFromDB,
  InsertIntoDB,
  modifyConfigJson,
  ModifyDB,
} from "@/utils/Fetchers.ts";
import Logger from "@/logger.ts";
import { useEffectOnce } from "@/utils/UseEffectOnce.tsx";
import SubMenu from "./SubMenu.tsx";
import BookSettingsDialog from "./dialogs/BookSettingsDialog.tsx";
import Magnifier from "./Magnifier.tsx";
import { IUserSettings } from "@/interfaces/IUserSettings.ts";
import { GetTheName } from "@/utils/utils.ts";
import ColorThief from "colorthief/dist/color-thief.mjs";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const preloadedImages: string[] = [];
let bookID = "NaID_" + Math.random() * 100500;
let listofImg: any[] = [];

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [imageOne, setImageOne] = React.useState<string | null>(null);
  const [imageTwo, setImageTwo] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const [bookLoaded, setBookLoaded] = React.useState(false);
  const CosmicComicsTemp = localStorage.getItem("CosmicComicsTemp") ?? "";
  let CosmicComicsTempI = localStorage.getItem("CosmicComicsTempI") ?? "";
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [rotation, setRotation] = React.useState(0);
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const [baseHeight, setBaseHeight] = React.useState<number | string>(
    window.innerHeight - 100,
  );
  const [baseWidth, setBaseWidth] = React.useState<number | string>("auto");
  const [actionbarON, setActionbarON] = React.useState(true);
  const [sidebarON] = React.useState(false);
  const [origins, setOrigins] = React.useState<any[][]>([[0, 0]]);
  const [originsKept, setOriginsKept] = React.useState<any[][]>([[0, 0]]);
  const [DoublePageMode, setDoublePageMode] = React.useState(false);
  const [innerWidth, setInnerWidth] = React.useState(window.innerWidth);
  const [webToonMode, setWebToonMode] = React.useState(false);
  const [unzipStatus, setUnzipStatus] = React.useState({
    status: "waiting",
    percentage: 0,
    current_file: "",
  });

  React.useLayoutEffect(() => {
    window.addEventListener("resize", () => {
      setInnerWidth(window.innerWidth);
    });
    return () => {
      window.removeEventListener("resize", () => {
        setInnerWidth(window.innerWidth);
      });
    };
  }, []);

  React.useLayoutEffect(() => {
    if (DoublePageMode) {
      const origins = [
        [
          innerWidth / 4 + innerWidth / 3.7,
          document.getElementsByTagName("header")[0].offsetHeight + 10,
        ],
        [
          innerWidth / 5.8,
          document.getElementsByTagName("header")[0].offsetHeight + 10,
        ],
      ];
      setOrigins(origins);
      setOriginsKept(origins);
    } else {
      setOrigins([
        [
          innerWidth / 3,
          document.getElementsByTagName("header")[0].offsetHeight + 10,
        ],
        [
          innerWidth / 3,
          document.getElementsByTagName("header")[0].offsetHeight + 10,
        ],
      ]);
      setOriginsKept([
        [
          innerWidth / 3,
          document.getElementsByTagName("header")[0].offsetHeight + 10,
        ],
        [
          innerWidth / 3,
          document.getElementsByTagName("header")[0].offsetHeight + 10,
        ],
      ]);
    }
  }, [DoublePageMode, innerWidth]);

  React.useEffect(() => {
    if (!DoublePageMode) {
      imageTwo && setImageTwo(null);
    }
  }, [DoublePageMode, imageTwo]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const connected = getCookie("selectedProfile", document);
  const { t } = useTranslation();
  let isADirectory: boolean = false;

  async function preloadImage(listImages: any) {
    await Promise.all(
      listImages.map(async (_: any, index: number) => {
        const options: any = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            path: localStorage.getItem("currentBook"),
            token: connected,
            met: isADirectory ? "DL" : "CLASSIC",
            page: listImages[index],
          },
        };
        await fetch(PDP + "/view/readImage", options).then((response) => {
          response.blob().then((blob) => {
            const urlCreator = window.URL || window.webkitURL;
            preloadedImages[index] = urlCreator.createObjectURL(blob);
          });
        });
      }),
    );
  }

  const [userSettings, setUserSettings] = React.useState<IUserSettings>({
    Double_Page_Mode: false,
    Blank_page_At_Begginning: false,
    No_Double_Page_For_Horizontal: false,
    Manga_Mode: false,
    webToonMode: false,
    Automatic_Background_Color: false,
    SlideShow_Time: 0,
    SlideShow: false,
    NoBar: false,
    SideBar: false,
    Page_Counter: false,
    Vertical_Reader_Mode: false,
    Background_color: "rgba(0,0,0,0)",
    Scroll_bar_visible: false,
  });

  async function getUserConfig() {
    await fetch(PDP + "/config/getConfig/" + connected)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        const newConfig = data;
        for (const key in newConfig) {
          if (Object.prototype.hasOwnProperty.call(newConfig, key)) {
            const element = newConfig[key];
            if (element === "true") {
              newConfig[key] = true;
            } else if (element === "false") {
              newConfig[key] = false;
            }
          }
        }
        setUserSettings(newConfig);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function getBookID() {
    await getFromDB(
      "Books",
      "ID_book FROM Books WHERE PATH='" +
        localStorage.getItem("currentBook") +
        "'",
    ).then((res) => {
      if (!res) return;
      if (JSON.parse(res).length === 0)
        bookID = "NaID_" + Math.random() * 100500;
      else bookID = JSON.parse(res)[0]["ID_book"];
    });
  }

  async function prepareReader() {
    const promise = new Promise((resolve, reject) => {
      Logger.info("Preparing Reader");
      if (listofImg.length === 0) {
        reject("No images to load");
        return;
      }
      const currentPage = localStorage.getItem("currentPage");
      setCurrentPage(currentPage === null ? 0 : parseInt(currentPage));
      const filepage = currentPage === null ? 0 : parseInt(currentPage);

      getUserConfig()
        .then(() => getBookID())
        .then(() => preloadImage(listofImg))
        .then(() => {
          console.log(filepage);
          if (filepage !== 0) {
            Reader(listofImg, filepage);
          } else {
            getFromDB(
              "Books",
              "last_page FROM Books WHERE PATH='" +
                localStorage.getItem("currentBook") +
                "'",
            )
              .then((res) => {
                console.log(res);
                let lastpage = 0;
                if (
                  res === "[]" ||
                  res === undefined ||
                  res === null ||
                  res === "" ||
                  res.length === 0
                ) {
                  lastpage = 0;
                } else {
                  lastpage = JSON.parse(res)[0]["last_page"];
                  setCurrentPage(lastpage);
                }
                Reader(listofImg, lastpage);
              })
              .catch((error) => {
                reject(error);
              });
          }
          resolve("done");
        })
        .catch((error) => {
          reject(error);
        });
    });
    ToasterHandlerPromise(
      promise,
      t("loading_cache"),
      t("loaded_local"),
      t("error_loading_local"),
    );
    setUnzipStatus({
      status: "finish",
      percentage: 100,
      current_file: "",
    });
    fixHeight();
  }

  const [BlankFirstPage, setBlankFirstPage] = React.useState(false);
  const [DPMNoH, setDPMNoH] = React.useState(false);
  const [mangaMode, setMangaMode] = React.useState(false);
  const [backgroundColorAuto, setBackgroundColorAuto] = React.useState(false);
  const [listofImgState, setListofImgState] = React.useState([]);

  React.useEffect(() => {
    const LaunchViewer = async () => {
      await fetch(PDP + "/viewer/view/current/" + connected).then(
        (response) => {
          response
            .json()
            .then((data) => {
              listofImg = data === false ? [] : data;
              setListofImgState(data);
              setTotalPages(listofImg.length - 1);
            })
            .catch(function (error) {
              console.log(error);
            });
        },
      );
    };

    if (listofImg.length === 0) {
      // noinspection JSIgnoredPromiseFromCall
      LaunchViewer();
    }
  }, []);

  const [bookmarked, setBookmarked] = React.useState(false);

  //Loading the BookMark
  async function LoadBMI(pagec = 0) {
    try {
      await getFromDB(
        "Bookmarks",
        "* FROM Bookmarks WHERE BOOK_ID='" +
          bookID +
          "' AND page=" +
          pagec +
          ";",
      ).then((resu) => {
        if (!resu) return;
        const res = JSON.parse(resu);
        if (res.length !== 0) {
          setBookmarked(true);
        } else {
          setBookmarked(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  //Loading image to render
  async function Reader(listOfImg: any[], page: number) {
    const images: any[] = [];
    console.log(preloadedImages);
    window.scrollTo(0, 0);
    images.push(preloadedImages[page]);
    images.push(preloadedImages[page - 1]);
    if (DoublePageMode && !BlankFirstPage && !DPMNoH) {
      if (mangaMode) {
        setImageOne(images[1]);
        setImageTwo(images[0]);
        setCurrentPage(page + 1);
      } else {
        setImageOne(images[0]);
        setImageTwo(images[1]);
        setCurrentPage(page + 1);
      }
    } else if (DoublePageMode && BlankFirstPage && !DPMNoH) {
      if (!(page === 0 || page === -1)) {
        if (mangaMode) {
          setImageOne(images[1]);
          setImageTwo(images[0]);
          setCurrentPage(page + 1);
        } else {
          setImageOne(images[0]);
          setImageTwo(images[1]);
          setCurrentPage(page + 1);
        }
      } else {
        setImageOne(images[0]);
        setImageTwo(null);
      }
    } else if (DoublePageMode && !BlankFirstPage && DPMNoH) {
      const imgn0 = new Image();
      imgn0.src = images[0];
      const imgn1 = new Image();
      imgn1.src = images[1];
      if (imgn0.naturalWidth > imgn0.naturalHeight) {
        setImageOne(null);
        setImageTwo(images[0]);
        setCurrentPage(page);
      } else if (imgn1.naturalWidth > imgn1.naturalHeight) {
        setImageOne(null);
        setImageTwo(images[1]);
        setCurrentPage(page);
      } else if (mangaMode) {
        setImageOne(images[1]);
        setImageTwo(images[0]);
        setCurrentPage(page + 1);
      } else {
        setImageOne(images[0]);
        setImageTwo(images[1]);
        setCurrentPage(page + 1);
      }
    } else if (DoublePageMode && BlankFirstPage && DPMNoH) {
      const imgn0 = new Image();
      imgn0.src = images[0];
      const imgn1 = new Image();
      imgn1.src = images[1];
      if (imgn0.naturalWidth > imgn0.naturalHeight) {
        setImageOne(null);
        setImageTwo(images[0]);
        setCurrentPage(page);
      } else if (imgn1.naturalWidth > imgn1.naturalHeight) {
        setImageOne(null);
        setImageTwo(images[1]);
        setCurrentPage(page);
      } else if (page === 0 || page === -1) {
        setImageOne(images[0]);
        setImageTwo(null);
      } else if (mangaMode) {
        setImageOne(images[1]);
        setImageTwo(images[0]);
        setCurrentPage(page + 1);
      } else {
        setImageOne(images[0]);
        setImageTwo(images[1]);
        setCurrentPage(page + 1);
      }
    } else {
      setImageOne(images[0]);
    }
    setTimeout(() => {
      if (backgroundColorAuto) {
        Logger.info("ColorThief : Enable");
        const colorThief = new ColorThief();
        try {
          const [r, g, b] = colorThief.getColor(images[0]);
          const darker = `rgb(${Math.floor(r * 0.6)}, ${Math.floor(
            g * 0.6,
          )}, ${Math.floor(b * 0.6)})`;

          setTimeout(() => {
            const body = document.getElementsByTagName("body")[0];
            body.style.transition = "background 0.5s ease-in-out 0.5s";
            body.style.background = `linear-gradient(to left top, rgb(${r}, ${g}, ${b}), ${darker}) no-repeat fixed`;
          }, 500);
        } catch (e) {
          console.error("ColorThief error:", e);
        }
      }
    }, 50);
    // noinspection ES6MissingAwait
    LoadBMI(page);
  }

  let scrollindex_next = 1;
  const [VIV_On, setVIV_On] = React.useState(false);
  const [VIV_Count, setVIV_Count] = React.useState(0);

  const shortname = GetTheName(
    localStorage.getItem("currentBook")?.split(".")[0],
  );

  //Going to the next page
  function NextPage(override = false) {
    if (mangaMode) {
      if (!override) {
        PreviousPage(true);
        return false;
      }
    }
    if (VIV_On || webToonMode) {
      console.log(scrollindex_next);
      const imgViewer_n0 = document.getElementById("imgViewer_" + currentPage);
      if (imgViewer_n0 === null) return;
      if (webToonMode) {
        if (scrollindex_next > 2) {
          if (!VIV_On) {
            // noinspection JSIgnoredPromiseFromCall
            Reader(listofImgState, currentPage + 1);
            setCurrentPage(currentPage + 1);
          } else {
            const imgViewer = document.getElementById(
              "imgViewer_" + (currentPage + 1),
            );
            if (imgViewer === null) return;
            window.scrollTo(
              0,
              imgViewer.offsetTop -
                document.getElementsByTagName("header")[0].offsetHeight,
            );
            setCurrentPage(currentPage + 1);
          }
        } else {
          let divImgViewer = document.getElementById(
            "div_imgViewer_" + currentPage,
          );
          if (divImgViewer === null) {
            divImgViewer = imgViewer_n0;
          }
          if (scrollindex_next === 1) {
            divImgViewer.scrollIntoView({
              block: "center",
            });
          } else if (scrollindex_next === 2) {
            divImgViewer.scrollIntoView({
              block: "end",
            });
          }
        }
        if (scrollindex_next > 2) {
          scrollindex_next = 1;
        } else {
          scrollindex_next++;
        }
      } else {
        const imgViewer = document.getElementById(
          "imgViewer_" + (currentPage + 1),
        );
        if (imgViewer === null) return;
        Logger.debug(
          imgViewer.offsetTop -
            document.getElementsByTagName("header")[0].offsetHeight +
            "",
        );
        window.scrollTo(
          0,
          imgViewer.offsetTop -
            document.getElementsByTagName("header")[0].offsetHeight,
        );
        setCurrentPage(currentPage + 1);
      }
    } else {
      window.scrollTo(0, 0);
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
        if (currentPage === totalPages - 1) {
          ModifyDB("Books", "reading", "false", shortname).then(() => {
            // noinspection JSIgnoredPromiseFromCall
            ModifyDB("Books", "read", "true", shortname);
          });
        }
        ModifyDB("Books", "last_page", currentPage.toString(), shortname).then(
          () => {
            // noinspection JSIgnoredPromiseFromCall
            Reader(listofImgState, currentPage + 1);
          },
        );
      }
    }
  }

  //Toogle mark as Bookmarks
  function TBM() {
    //check if bookmark is already bookmarked
    getFromDB(
      "Bookmarks",
      "PATH,page FROM Bookmarks WHERE BOOK_ID='" +
        bookID +
        "' AND PATH='" +
        localStorage.getItem("currentBook") +
        "' AND page=" +
        currentPage +
        ";",
    ).then((res1) => {
      if (!res1) return;
      const jres = JSON.parse(res1);
      if (jres.length !== 0) {
        console.log(jres);
        if (jres[0]["page"] === currentPage) {
          DeleteFromDB("Bookmarks", bookID, "AND page=" + currentPage).then(
            () => {
              ToasterHandler(t("bookmark_removed"), "info");
            },
          );
          setBookmarked(false);
        }
      } else {
        console.log("Bookmarks doesn't exist yet!");
        InsertIntoDB(
          "bookmarks",
          "(BOOK_ID,PATH,page)",
          "('" +
            bookID +
            "','" +
            localStorage.getItem("currentBook") +
            "','" +
            currentPage +
            "')",
        ).then(() => {
          ToasterHandler(t("bookmark_added"), "success");
        });
        setBookmarked(true);
      }
    });
  }

  //Going to the previous page
  function PreviousPage(override = false) {
    if (mangaMode) {
      if (!override) {
        NextPage(true);
        return false;
      }
    }
    if (VIV_On) {
      if (scrollindex_next === 2 || scrollindex_next === 3) {
        const imgViewer = document.getElementById("imgViewer_" + currentPage);
        if (imgViewer === null) return;
        window.scrollTo(
          0,
          imgViewer.offsetTop -
            document.getElementsByTagName("header")[0].offsetHeight,
        );
        scrollindex_next = 1;
      } else {
        const imgViewer = document.getElementById(
          "imgViewer_" + (currentPage - 1),
        );
        if (imgViewer === null) return;
        window.scrollTo(
          0,
          imgViewer.offsetTop -
            document.getElementsByTagName("header")[0].offsetHeight,
        );
        scrollindex_next = 1;
      }
    } else {
      window.scrollTo(0, 0);
      if (DoublePageMode && !BlankFirstPage && !DPMNoH) {
        if (currentPage > 2) {
          setCurrentPage(currentPage - 3);
          // noinspection JSIgnoredPromiseFromCall
          Reader(listofImgState, currentPage - 3);
        } else if (currentPage - 1 !== -1) {
          setCurrentPage(currentPage - 1);
          // noinspection JSIgnoredPromiseFromCall
          Reader(listofImgState, currentPage - 1);
        }
      } else if (DoublePageMode && !BlankFirstPage && DPMNoH) {
        if (currentPage > 2) {
          setCurrentPage(currentPage - 3);
          // noinspection JSIgnoredPromiseFromCall
          Reader(listofImgState, currentPage - 3);
        } else if (currentPage - 2 !== -1) {
          setCurrentPage(currentPage - 2);
          // noinspection JSIgnoredPromiseFromCall
          Reader(listofImgState, currentPage - 2);
        }
      } else if (DoublePageMode && BlankFirstPage && !DPMNoH) {
        if (currentPage !== 0 && currentPage - 3 !== -1) {
          setCurrentPage(currentPage - 3);
          // noinspection JSIgnoredPromiseFromCall
          Reader(listofImgState, currentPage - 3);
        } else if (currentPage - 3 === -1) {
          setCurrentPage(currentPage - 2);
          // noinspection JSIgnoredPromiseFromCall
          Reader(listofImgState, currentPage - 2);
        }
      } else if (DoublePageMode && BlankFirstPage && DPMNoH) {
        setCurrentPage(currentPage - 2);
        // noinspection JSIgnoredPromiseFromCall
        Reader(listofImgState, currentPage - 2);
      } else if (currentPage !== 0) {
        setCurrentPage(currentPage - 1);
        // noinspection JSIgnoredPromiseFromCall
        Reader(listofImgState, currentPage - 1);
      }
    }
  }

  function getStatusFromServer(seconds: number) {
    let interval = setInterval(() => {
      fetch(PDP + "/getStatus/" + connected + "/unzip")
        .then((response) => response.json())
        .then((data) => {
          setUnzipStatus(data);
          if (data.status === "finish" || data.status === "error") {
            clearInterval(interval);
          }
        });
    }, seconds * 1000);
  }

  React.useLayoutEffect(() => {
    function keyListener(e: { ctrlKey: any; shiftKey: any; key: string }) {
      if (!e.ctrlKey && !e.shiftKey && e.key === "ArrowLeft") {
        PreviousPage();
      } else if (!e.ctrlKey && !e.shiftKey && e.key === "ArrowRight") {
        NextPage();
      } else if (e.key === "Escape") {
        // noinspection JSIgnoredPromiseFromCall
        document.exitFullscreen();
      } else if (e.key === "f") {
        // noinspection JSIgnoredPromiseFromCall
        document.documentElement.requestFullscreen();
      } else if (!e.ctrlKey && !e.shiftKey && e.key === "ArrowUp") {
        PreviousPage();
      } else if (!e.ctrlKey && !e.shiftKey && e.key === "ArrowDown") {
        NextPage();
      } else if (!e.ctrlKey && e.shiftKey && e.key === "ArrowUp") {
        setCurrentPage(0);
        // noinspection JSIgnoredPromiseFromCall
        Reader(listofImgState, 0);
      } else if (!e.ctrlKey && e.shiftKey && e.key === "ArrowDown") {
        setCurrentPage(listofImgState.length - 1);
        // noinspection JSIgnoredPromiseFromCall
        Reader(listofImgState, listofImgState.length - 1);
      } else if (!e.ctrlKey && e.shiftKey && e.key === "ArrowLeft") {
        setCurrentPage(0);
        // noinspection JSIgnoredPromiseFromCall
        Reader(listofImgState, 0);
      } else if (!e.ctrlKey && e.shiftKey && e.key === "ArrowRight") {
        setCurrentPage(listofImgState.length - 1);
        // noinspection JSIgnoredPromiseFromCall
        Reader(listofImgState, listofImgState.length - 1);
      } else if (e.ctrlKey && !e.shiftKey && e.key === "ArrowLeft") {
        setRotation(rotation - 90);
      } else if (e.ctrlKey && !e.shiftKey && e.key === "ArrowRight") {
        setRotation(rotation + 90);
      }
    }

    document.addEventListener("keyup", keyListener);
    //make a zoom with the mouse wheel
    const zoom = (e: { shiftKey: any; deltaY: number }) => {
      if (e.shiftKey) {
        if (e.deltaY < 0) {
          setZoomLevel(zoomLevel + 20);
        } else {
          setZoomLevel(zoomLevel - 20);
        }
      }
    };

    document.addEventListener("wheel", zoom);
    return () => {
      document.removeEventListener("keyup", keyListener);
    };
  });
  useEffectOnce(() => {
    const LaunchViewer = async () => {
      const curBook = localStorage.getItem("currentBook");
      if (curBook === null) return;
      fetch(PDP + "/view/isDir/" + encodeURIComponent(curBook))
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          isADirectory = res;
        });
      setBookLoaded(true);
      //If the folder doesn't exist then create it and unzip in it
      //Else we check for the path.txt and if it doesn't exist we unzip
      //Else we check if the path.txt is equal to the path if he is not then we unzip
      //Else, the folder is created, as well as the path.txt and already contains the images
      const path = localStorage.getItem("currentBook");
      if (path === null) return;
      Logger.info("CosmicComicsTempI : " + CosmicComicsTempI);
      await fetch(PDP + "/view/isDir/" + window.encodeURIComponent(path)).then(
        (response) => {
          response.json().then(async (isDir) => {
            //If the path is a directory then it contains images, we use it right away
            Logger.info("isDir CCTI: " + isDir);
            if (isDir) {
              Logger.info("CCI is a directory");
              CosmicComicsTempI = path + "/";
              localStorage.setItem("CosmicComicsTempI", path + "/");
            }
            await fetch(
              PDP +
                "/view/exist/" +
                window.encodeURIComponent(CosmicComicsTempI),
            )
              .then((response) => {
                response.json().then(async (existCCI) => {
                  Logger.info("existCCI : " + existCCI);
                  if (!existCCI) {
                    Logger.info("CCI doesn't exist");
                    //Unzip if the folder doesn't exist
                    getStatusFromServer(5);
                    fetch(
                      PDP +
                        "/Unzip/" +
                        window.encodeURIComponent(path) +
                        "/" +
                        connected,
                    ).then(async (response) => {
                      Logger.info(
                        "Unzip for " + path + " : " + response.status,
                      );
                      await fetch(PDP + "/viewer/view", {
                        method: "GET",
                        headers: {
                          "Content-Type": "application/json",
                          path: localStorage.getItem("currentBook") || "",
                        },
                      })
                        .then((response) => {
                          return response.json();
                        })
                        .then((dataLOI: any) => {
                          listofImg = dataLOI === false ? [] : dataLOI;
                          setListofImgState(dataLOI);
                          setTotalPages(listofImg.length - 1);
                          prepareReader();
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    });
                  } else if (isDir) {
                    Logger.info("Trying to load images from CCI cache");
                    //If the path is a folder then it contains images
                    await fetch(PDP + "/viewer/view", {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        path: localStorage.getItem("currentBook") || "",
                      },
                    })
                      .then((response) => {
                        return response.json();
                      })
                      .then((dataLOI: any) => {
                        listofImg = dataLOI === false ? [] : dataLOI;
                        setListofImgState(dataLOI);
                        setTotalPages(listofImg.length - 1);
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                    // noinspection ES6MissingAwait
                    prepareReader();
                  } else {
                    Logger.info("CCI is a file");
                    //Else we need to extract it
                    //We test if the path in the path.txt exists
                    fetch(
                      PDP +
                        "/view/exist/" +
                        (CosmicComicsTempI + "/path.txt")
                          .replaceAll("/", "ù")
                          .replaceAll("\\", "ù"),
                    ).then((response) => {
                      response.json().then((existCCIP) => {
                        Logger.info("path.txt exist? : " + existCCIP);
                        if (existCCIP) {
                          fetch(
                            PDP +
                              "/view/readFile/" +
                              (CosmicComicsTempI + "path.txt")
                                .replaceAll("/", "ù")
                                .replaceAll("\\", "ù"),
                          ).then((response) => {
                            response.json().then(async (readCCTIP) => {
                              if (
                                readCCTIP !==
                                  decodeURIComponent(path).replaceAll(
                                    "%C3%B9",
                                    "/",
                                  ) ||
                                path.includes(".pdf")
                              ) {
                                Logger.info(
                                  "path.txt is not equal to path, Unzipping",
                                );
                                // if it's not the same we need to extract it
                                getStatusFromServer(5);
                                fetch(
                                  PDP +
                                    "/Unzip/" +
                                    window.encodeURIComponent(path) +
                                    "/" +
                                    connected,
                                ).then(async () => {
                                  await fetch(PDP + "/viewer/view", {
                                    method: "GET",
                                    headers: {
                                      "Content-Type": "application/json",
                                      path:
                                        localStorage.getItem("currentBook") ||
                                        "",
                                    },
                                  })
                                    .then((response) => {
                                      return response.json();
                                    })
                                    .then((dataLOI: any) => {
                                      listofImg =
                                        dataLOI === false ? [] : dataLOI;
                                      setListofImgState(dataLOI);
                                      setTotalPages(listofImg.length - 1);
                                      prepareReader();
                                    })
                                    .catch((error) => {
                                      console.log(error);
                                    });
                                });
                              } else {
                                Logger.info(
                                  "path.txt is equal to path, reading",
                                );
                                await fetch(PDP + "/viewer/view", {
                                  method: "GET",
                                  headers: {
                                    "Content-Type": "application/json",
                                    path:
                                      localStorage.getItem("currentBook") || "",
                                  },
                                })
                                  .then((response) => {
                                    return response.json();
                                  })
                                  .then((dataLOI: any) => {
                                    listofImg =
                                      dataLOI === false ? [] : dataLOI;
                                    setListofImgState(dataLOI);
                                    setTotalPages(listofImg.length - 1);
                                  })
                                  .catch((error) => {
                                    console.log(error);
                                  });
                                prepareReader();
                              }
                            });
                          });
                        } else {
                          // if don't have a path.txt we extract
                          Logger.info("path.txt doesn't exist, Unzipping");
                          getStatusFromServer(5);
                          fetch(
                            PDP +
                              "/Unzip/" +
                              window.encodeURIComponent(path) +
                              "/" +
                              connected,
                          )
                            .then((response) => {
                              return response.text();
                            })
                            .then(async () => {
                              Logger.info("Unziped");
                              await fetch(PDP + "/viewer/view", {
                                method: "GET",
                                headers: {
                                  "Content-Type": "application/json",
                                  path: CosmicComicsTempI || "",
                                },
                              })
                                .then((response) => {
                                  return response.json();
                                })
                                .then((dataLOI: any) => {
                                  listofImg = dataLOI === false ? [] : dataLOI;
                                  setListofImgState(dataLOI);
                                  setTotalPages(listofImg.length - 1);
                                  prepareReader();
                                })
                                .catch((error) => {
                                  console.log(error);
                                });
                            });
                        }
                      });
                    });
                  }
                });
              })
              .catch((error) => {
                alert("ERROR : " + error);
              });
          });
        },
      );
    };
    if (!bookLoaded && CosmicComicsTemp !== "" && CosmicComicsTempI !== "") {
      // noinspection JSIgnoredPromiseFromCall
      LaunchViewer();
    }
  });

  const [opacityForNavigation, setOpacityForNavigation] = React.useState("0.1");

  const [openBookSettings, setOpenBookSettings] = React.useState(false);
  const [isMagnifierOn, setIsMagnifierOn] = React.useState(false);

  const handleOpenBookSettings = () => {
    setOpenBookSettings(true);
  };

  const handleCloseBookSettings = () => {
    setOpenBookSettings(false);
  };

  function isMouseAtTheTop(e: { clientY: number }) {
    if (e.clientY < 50) {
      setActionbarON(true);
    }
  }

  React.useLayoutEffect(() => {
    if (actionbarON) {
      document.querySelectorAll("header").forEach((el) => {
        el.style.display = "inherit";
      });
      document.removeEventListener("mousemove", isMouseAtTheTop);
    } else {
      document.querySelectorAll("header").forEach((el) => {
        el.style.display = "none";
      });
      document.addEventListener("mousemove", isMouseAtTheTop);
    }
    modifyConfigJson("NoBar", actionbarON);
  }, [actionbarON]);

  const [isSlideShowOn, setIsSlideShowOn] = React.useState(false);
  const [slideShowInterval, setSlideShowInterval] = React.useState(5000);

  React.useEffect(() => {
    modifyConfigJson("SlideShow", isSlideShowOn);
    if (isSlideShowOn) {
      const interval = setInterval(() => {
        NextPage();
      }, slideShowInterval);
      return () => clearInterval(interval);
    }
  }, [isSlideShowOn, slideShowInterval]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting)
          setCurrentPage(
            parseInt(entries[0].target.id.split("div_imgViewer_")[1]),
          );
        try {
          const idImg = document.getElementById("id_img_" + (currentPage - 1));
          const sidebar = document.getElementById("SideBar");
          if (idImg === null || sidebar === null) return;
          idImg.className = "SideBar_current";
          sidebar.scrollTop = idImg.offsetTop - 200;
        } catch (e) {
          console.log(e);
        }
      },
      { threshold: [0.1] },
    );
    if (VIV_On) {
      setVIV_Count(preloadedImages.length);
      for (let i = 0; i < preloadedImages.length; i++) {
        const elHTML = document.querySelector("#div_imgViewer_" + i);
        if (elHTML === null) return;
        observer.observe(elHTML);
      }
    }
  }, [VIV_On, currentPage]);

  React.useLayoutEffect(() => {
    const sidebar = document.getElementById("SideBar");
    const idImg = document.getElementById("id_img_" + (currentPage - 1));
    if (sidebar === null || idImg === null) return;
    sidebar.scrollTop = (idImg.offsetTop - 200) | sidebar.scrollTop;
  }, [currentPage]);

  React.useEffect(() => {
    if (parseInt(baseWidth.toString()) >= window.innerWidth - 50) {
      setWebToonMode(true);
    } else {
      setWebToonMode(false);
    }
  }, [baseWidth]);

  React.useLayoutEffect(() => {
    setTimeout(() => {
      const overlay = document.getElementById("overlay");
      if (overlay !== null) {
        if (unzipStatus.status === "finish") {
          overlay.style.display = "none";
        } else {
          overlay.style.display = "block";
        }
      }
    }, 500);
  }, [unzipStatus]);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <Tooltip title={t("openDrawer")}>
              <IconButton
                color="inherit"
                aria-label={t("openDrawer")}
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: "none" }) }}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("go_back")}>
              <IconButton
                onClick={() => {
                  window.location.href = "/collectionner";
                }}
                color="inherit"
                edge="start"
                sx={{ mr: 2 }}
              >
                <CollectionsBookmark />
              </IconButton>
            </Tooltip>
            <div
              style={{
                position: "absolute",
                left: "50%",
                transform: "translate(-50%, 0)",
                width: "auto",
                height: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Tooltip title={t("fix_width")}>
                <IconButton
                  color="inherit"
                  onClick={() => {
                    fixWidth();
                  }}
                  edge="start"
                  sx={{ mr: 2 }}
                >
                  <AlignHorizontalCenter />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("fix_height")}>
                <IconButton
                  color="inherit"
                  onClick={() => {
                    fixHeight();
                  }}
                  edge="start"
                  sx={{ mr: 2 }}
                >
                  <VerticalAlignCenter />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("full_screen")}>
                <IconButton
                  color="inherit"
                  onClick={() => {
                    if (document.fullscreenElement) {
                      // noinspection JSIgnoredPromiseFromCall
                      document.exitFullscreen();
                      setIsFullscreen(false);
                    } else {
                      // noinspection JSIgnoredPromiseFromCall
                      document.documentElement.requestFullscreen();
                      setIsFullscreen(true);
                    }
                  }}
                  edge="start"
                  sx={{ mr: 2 }}
                >
                  {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                </IconButton>
              </Tooltip>
              <Tooltip title={t("book_settings")}>
                <IconButton
                  color="inherit"
                  onClick={() => {
                    handleOpenBookSettings();
                  }}
                  edge="start"
                  sx={{ mr: 2 }}
                >
                  <Tune />
                </IconButton>
              </Tooltip>
              <SubMenu
                TBM={TBM}
                bookmarked={bookmarked}
                rotation={rotation}
                setRotation={setRotation}
                zoomLevel={zoomLevel}
                setZoomLevel={setZoomLevel}
                isMagnifierOn={isMagnifierOn}
                setIsMagnifierOn={setIsMagnifierOn}
              />
            </div>
          </Toolbar>
        </AppBar>

        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <div
            id="SideBar"
            style={{
              overflowY: "scroll",
              height: "100%",
              scrollBehavior: "smooth",
            }}
          >
            {preloadedImages.map((el: string, i: number) => {
              return (
                <Stack
                  spacing={2}
                  divider={<Divider orientation="horizontal" flexItem />}
                  key={i}
                >
                  <div
                    key={i}
                    id={"id_img_" + i}
                    className="SideBar_img"
                    style={{
                      backgroundColor:
                        currentPage === i
                          ? "rgba(255,255,255,0.1)"
                          : "transparent",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                    onClick={() => {
                      setCurrentPage(i);
                      if (!VIV_On)
                        // noinspection JSIgnoredPromiseFromCall
                        Reader(listofImg, i);
                      else {
                        const imgViewer = document.getElementById(
                          "imgViewer_" + i,
                        );
                        if (imgViewer === null) return;
                        imgViewer.scrollIntoView({
                          block: "center",
                        });
                      }
                    }}
                  >
                    <img
                      height={120}
                      id={"imgSideBar_" + i}
                      className="SideBar_img"
                      src={el}
                      alt={i + 1 + "th page"}
                    />
                    <p className="SideBar_img_text">{i + 1}</p>
                  </div>
                </Stack>
              );
            })}
          </div>
        </Drawer>
        <Main
          open={open}
          sx={{
            padding: "0px",
          }}
        >
          <div
            id="overlay"
            style={{
              background: theme.palette.background.default,
              display: "none",
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginTop: "25%",
                marginLeft: "10%",
                marginRight: "10%",
              }}
            >
              <LinearProgress
                variant="determinate"
                value={unzipStatus.percentage}
              />
              <p id="overlaymsg" style={{ marginTop: "10px" }}>
                {t("extracting")} ({unzipStatus.current_file}{" "}
                {unzipStatus.percentage}%)
              </p>
            </div>
          </div>
          {VIV_On ? (
            <>
              {preloadedImages.map((el: string, i: number) => {
                return (
                  <div id={"div_imgViewer_" + i} key={i}>
                    <img
                      id={"imgViewer_" + i}
                      src={el}
                      alt={i + 1 + "th page"}
                      width={
                        typeof baseWidth === "number"
                          ? baseWidth + zoomLevel + "px"
                          : "auto"
                      }
                      height={
                        typeof baseHeight === "number"
                          ? baseHeight + zoomLevel + "px"
                          : "auto"
                      }
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "auto",
                        position: "relative",
                      }}
                    />
                  </div>
                );
              })}
            </>
          ) : isMagnifierOn ? (
            <Magnifier zoomFactor={2}>
              {imageOne !== null ? (
                <MovableImage
                  id={"imgViewer_0"}
                  disableMove={true}
                  src={imageOne}
                  origin={origins[0]}
                  width={
                    typeof baseWidth === "number"
                      ? baseWidth + zoomLevel + "px"
                      : "auto"
                  }
                  height={
                    typeof baseHeight === "number"
                      ? baseHeight + zoomLevel + "px"
                      : "auto"
                  }
                  rotation={rotation}
                  alt="Logo"
                />
              ) : null}
              {imageTwo !== null ? (
                <MovableImage
                  id={"imgViewer_1"}
                  disableMove={true}
                  src={imageTwo}
                  origin={origins[1]}
                  width={
                    typeof baseWidth === "number"
                      ? baseWidth + zoomLevel + "px"
                      : "auto"
                  }
                  height={
                    typeof baseHeight === "number"
                      ? baseHeight + zoomLevel + "px"
                      : "auto"
                  }
                  rotation={rotation}
                  alt="Logo"
                />
              ) : null}
            </Magnifier>
          ) : (
            <>
              {imageOne !== null ? (
                <MovableImage
                  id={"imgViewer_0"}
                  src={imageOne}
                  origin={origins[0]}
                  disableMove={false}
                  width={
                    typeof baseWidth === "number"
                      ? baseWidth + zoomLevel + "px"
                      : "auto"
                  }
                  height={
                    typeof baseHeight === "number"
                      ? baseHeight + zoomLevel + "px"
                      : "auto"
                  }
                  rotation={rotation}
                  alt="Logo"
                />
              ) : null}
              {imageTwo !== null ? (
                <MovableImage
                  id={"imgViewer_1"}
                  src={imageTwo}
                  origin={origins[1]}
                  disableMove={false}
                  width={
                    typeof baseWidth === "number"
                      ? baseWidth + zoomLevel + "px"
                      : "auto"
                  }
                  height={
                    typeof baseHeight === "number"
                      ? baseHeight + zoomLevel + "px"
                      : "auto"
                  }
                  rotation={rotation}
                  alt="Logo"
                />
              ) : null}
            </>
          )}
          <p
            style={{
              color: "white",
              position: "fixed",
              backgroundColor: "rgba(0,0,0,0.50)",
              textAlign: "right",
              bottom: 0,
              right: "5px",
              zIndex: 5,
            }}
            id="pagecount"
          >
            {currentPage + 1} / {totalPages + 1}
          </p>
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.8)",
              opacity: opacityForNavigation,
              position: "fixed",
              bottom: "50px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 5,
              transition: "opacity 0.2s ease-in-out",
              borderRadius: "10px",
              padding: "5px",
            }}
            onMouseEnter={() => {
              setOpacityForNavigation("1");
            }}
            onMouseLeave={() => {
              setOpacityForNavigation("0.1");
            }}
          >
            <Tooltip title={t("go_start")}>
              <IconButton
                onClick={() => {
                  setCurrentPage(0);
                  if (VIV_On || webToonMode) {
                    window.scrollTo(0, 0);
                  } else {
                    // noinspection JSIgnoredPromiseFromCall
                    Reader(listofImgState, 0);
                  }
                }}
                color="inherit"
                edge="start"
                sx={{ mr: 2, ml: 2 }}
              >
                <FirstPage />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("go_previous")}>
              <IconButton
                color="inherit"
                onClick={() => {
                  PreviousPage();
                }}
                edge="start"
                sx={{ mr: 2 }}
              >
                <NavigateBefore />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("go_next")}>
              <IconButton
                color="inherit"
                onClick={() => {
                  NextPage();
                }}
                edge="start"
                sx={{ mr: 2 }}
              >
                <NavigateNext />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("go_end")}>
              <IconButton
                color="inherit"
                onClick={() => {
                  let max: number;
                  if (DoublePageMode) {
                    max = totalPages - 1;
                  } else {
                    max = totalPages;
                  }
                  setCurrentPage(totalPages);
                  ModifyDB("Books", "reading", "false", shortname).then(() => {
                    ModifyDB("Books", "read", "true", shortname).then(() => {
                      if (VIV_On || webToonMode)
                        window.scrollTo(0, document.body.scrollHeight);
                      else
                        // noinspection JSIgnoredPromiseFromCall
                        Reader(listofImgState, max);
                    });
                  });
                }}
                edge="start"
                sx={{ mr: 2 }}
              >
                <LastPage />
              </IconButton>
            </Tooltip>
          </div>
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.8)",
              opacity: opacityForNavigation,
              position: "fixed",
              bottom: "50%",
              right: "0px",
              transform: "translateX(-50%)",
              zIndex: 5,
              transition: "opacity 0.2s ease-in-out",
              borderRadius: "10px",
              padding: "5px",
            }}
            onMouseEnter={() => {
              setOpacityForNavigation("1");
            }}
            onMouseLeave={() => {
              setOpacityForNavigation("0.1");
            }}
          >
            <Tooltip title={t("go_next")}>
              <IconButton
                color="inherit"
                onClick={() => {
                  NextPage();
                }}
                edge="start"
                sx={{ ml: 1, mr: 1 }}
              >
                <NavigateNext />
              </IconButton>
            </Tooltip>
          </div>
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.8)",
              opacity: opacityForNavigation,
              position: "fixed",
              bottom: "50%",
              left: "60px",
              transform: "translateX(-50%)",
              zIndex: 5,
              transition: "opacity 0.2s ease-in-out",
              borderRadius: "10px",
              padding: "5px",
            }}
            onMouseEnter={() => {
              setOpacityForNavigation("1");
            }}
            onMouseLeave={() => {
              setOpacityForNavigation("0.1");
            }}
          >
            <Tooltip title={t("go_previous")}>
              <IconButton
                color="inherit"
                onClick={() => {
                  PreviousPage();
                }}
                edge="start"
                sx={{ ml: 1, mr: 1 }}
              >
                <NavigateBefore />
              </IconButton>
            </Tooltip>
          </div>
        </Main>
      </Box>
      <BookSettingsDialog
        openModal={openBookSettings}
        onClose={handleCloseBookSettings}
        Reader={Reader}
        LOI={listofImgState}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setDoublePageMode={setDoublePageMode}
        setBlankFirstPage={setBlankFirstPage}
        setDPMNoH={setDPMNoH}
        setActionbarON={setActionbarON}
        actionbarON={actionbarON}
        slideShow={isSlideShowOn}
        setSlideShow={setIsSlideShowOn}
        slideShowInterval={slideShowInterval}
        setSlideShowInterval={setSlideShowInterval}
        mangaMode={mangaMode}
        setMangaMode={setMangaMode}
        VIV_On={VIV_On}
        setVIVOn={setVIV_On}
        setWebToonMode={setWebToonMode}
        fixWidth={fixWidth}
        fixHeight={fixHeight}
        setBackgroundColorAuto={setBackgroundColorAuto}
        backgroundColorAuto={backgroundColorAuto}
        userSettings={userSettings}
      />
    </>
  );

  function fixHeight() {
    const navbar = document.getElementById("navbar");
    if (navbar === null) return;
    if (VIV_On) {
      for (let i = 0; i < VIV_Count; i++) {
        setBaseHeight(window.innerHeight - navbar.offsetHeight - 15);
        setZoomLevel(0);
        setBaseWidth("auto");
      }
    }
    if (!actionbarON) {
      setBaseHeight(window.innerHeight);
      setZoomLevel(0);
      setBaseWidth("auto");
    } else {
      setBaseHeight(window.innerHeight - navbar.offsetHeight - 15);
      setZoomLevel(0);
      setBaseWidth("auto");
      const tempOrigin = origins;
      if (origins[0][0] !== 0 || origins[1][0] !== 0) {
        setOrigins([
          [0, 0],
          [0, 0],
        ]);
        setTimeout(() => {
          setOrigins(tempOrigin);
        }, 50);
      } else {
        setOrigins(originsKept);
      }
    }
  }

  function fixWidth() {
    setBaseWidth(window.innerWidth - 5);
    setBaseHeight("auto");
    setZoomLevel(0);
    setOrigins([
      [0, 0],
      [0, 0],
    ]);
    if (DoublePageMode) {
      setBaseWidth((window.innerWidth - 5) / 2);
    }
    if (sidebarON) {
      setBaseWidth(window.innerWidth - 205);
    }
    if (VIV_On) {
      for (let i = 0; i < VIV_Count; i++) {
        if (sidebarON) {
          setBaseWidth(window.innerWidth - 205);
        } else {
          setBaseWidth(window.innerWidth - 5);
        }
      }
    }
  }
}
