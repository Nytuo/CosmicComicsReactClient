import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import {Tooltip} from '@mui/material';
import {
    Bookmark,
    BookmarkBorder,
    ExpandMore,
    Pageview,
    RotateLeft,
    RotateRight,
    ZoomIn,
    ZoomOut
} from '@mui/icons-material';
import {useTranslation} from 'react-i18next';


const ITEM_HEIGHT = 48;

export default function SubMenu({
                                    TBM,
                                    bookmarked,
                                    rotation,
                                    setRotation,
                                    zoomLevel,
                                    setZoomLevel,
                                    isMagnifierOn,
                                    setIsMagnifierOn
                                }: {
                                    TBM: () => void,
                                    bookmarked: boolean,
                                    rotation: number,
                                    setRotation: (rotation: number) => void,
                                    zoomLevel: number,
                                    setZoomLevel: (zoomLevel: number) => void;
                                    isMagnifierOn: boolean,
                                    setIsMagnifierOn: (isMagnifierOn: boolean) => void;
                                }
): JSX.Element {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const {t} = useTranslation();

    return (
        <div>
            <IconButton
                aria-label={t('more')}
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <ExpandMore/>
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                    },
                }}
            >
                <Tooltip title={t("zoom_in")}>

                    <IconButton
                        color="inherit"
                        onClick={
                            () => {
                                const zoom = zoomLevel + 20;
                                setZoomLevel(zoom);
                            }
                        }
                        edge="start"
                        sx={{mr: 2, ml: 2}}
                    >
                        <ZoomIn/>
                    </IconButton>
                </Tooltip>
                <Tooltip title={t("zoom_out")}>

                    <IconButton
                        color="inherit"
                        onClick={
                            () => {
                                const zoom = zoomLevel - 20;
                                setZoomLevel(zoom);
                            }
                        }
                        edge="start"
                        sx={{mr: 2,}}
                    >
                        <ZoomOut/>
                    </IconButton>
                </Tooltip>
                <Tooltip title={t("Bookmark")}>

                    <IconButton
                        color="inherit"
                        onClick={
                            () => {
                                TBM();
                            }
                        }
                        edge="start"

                    >
                        {
                            bookmarked ? <Bookmark/> : <BookmarkBorder/>
                        }
                    </IconButton>
                </Tooltip>

                <Tooltip title={t("rotate_right")}>

                    <IconButton
                        color="inherit"
                        onClick={
                            () => {
                                let rotate = rotation + 90;
                                if (rotate === 360) {
                                    rotate = 0;
                                }
                                setRotation(rotate);
                            }
                        }
                        edge="start"
                        sx={{mr: 2, ml: 2}}
                    >
                        <RotateRight/>
                    </IconButton>
                </Tooltip>
                <Tooltip title={t("rotate_left")}>

                    <IconButton
                        color="inherit"
                        onClick={
                            () => {
                                let rotate = rotation - 90;
                                if (rotate === -90) {
                                    rotate = 270;
                                }
                                setRotation(rotate);
                            }
                        }
                        edge="start"
                        sx={{mr: 2,}}
                    >
                        <RotateLeft/>
                    </IconButton>
                </Tooltip>
                <Tooltip title={t("magnifier_toggle")}>

                    <IconButton
                        color="inherit"
                        onClick={
                            () => {
                                setIsMagnifierOn(!isMagnifierOn);
                            }
                        }
                        edge="start"

                    >
                        <Pageview/>
                    </IconButton>
                </Tooltip>
            </Menu>
        </div>
    );
}