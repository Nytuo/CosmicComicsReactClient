function Overlay() {
    return (<>
        <div id="overlay">
            <div style="text-align: center; margin-top: 25%">
                <svg viewBox="0 0 50 50" class="spinner">
                    <circle class="ring" cx="25" cy="25" r="22.5" />
                    <circle class="line" cx="25" cy="25" r="22.5" />
                </svg>
                <div style="margin-left: auto;margin-right: auto" class="mdc-circular-progress"></div>
                <p id="decompressfilename" style="margin-top: 10px"></p>
                <p id="overlaymsg" style="margin-top: 10px">
                    We take care of your comics
                </p>
            </div>
        </div>
    </>);
}

export default Overlay;