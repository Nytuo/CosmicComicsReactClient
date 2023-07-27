import {createRoot} from "react-dom/client";
import * as React from "react";
import {Toastifycation} from "@/components/Toastifycation";

export function Toaster(text: string, variant: "success" | "error" | "warning" | "info") {
	const onClose = () => {
		root.unmount();
	};
	let root = createRoot(document.querySelector("#toast-container") as HTMLElement);
	let el = React.createElement(Toastifycation, {openToast: true, text, type: variant, onClose});
	root.render(el);
}