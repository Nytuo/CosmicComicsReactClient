import { createRoot } from "react-dom/client";
import * as React from "react";
import { Toastifycation } from "./Toastifyation.tsx";
import logger from "@/logger.ts";

export function Toaster(text: string, variant: "success" | "error" | "warning" | "info") {
	const onClose = () => {
		root.unmount();
	};
	if (variant === "error") logger.error(text);
	if (variant === "warning") logger.warn(text);
	if (variant === "info") logger.info(text);

	const root = createRoot(document.querySelector("#toast-container") as HTMLElement);
	const el = React.createElement(Toastifycation, { openToast: true, text, type: variant, onClose });
	root.render(el);
}