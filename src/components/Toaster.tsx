import {createRoot} from "react-dom/client";
import * as React from "react";
import {Toastifycation} from "./Toastifyation.tsx";

export function Toaster(text: string, variant: "success" | "error" | "warning" | "info") {
	const onClose = () => {
		root.unmount();
	};
	const root = createRoot(document.querySelector("#toast-container") as HTMLElement);
	const el = React.createElement(Toastifycation, {openToast: true, text, type: variant, onClose});
	root.render(el);
}