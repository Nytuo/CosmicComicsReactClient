import logger from "@/logger.ts";
import { t } from "i18next";
import { toast } from "sonner";

/**
 * Displays a toast notification with the given text and variant.
 * @param text - The text to display in the toast notification.
 * @param variant - The variant of the toast notification. Can be "success", "error", "warning", or "info".
 */
export function ToasterHandler(text: any, variant: "success" | "error" | "warning" | "info" | "promise") {
    if (variant === "error") {
        logger.error(text);
        toast.error(text);
    } else if (variant === "success") {
        logger.info(text);
        toast.success(text);
    } else if (variant === "promise") {
        logger.info(text);
        toast.promise(text, {
            loading: t("extracting_cover"),
            success: t("cover_extraction_completed"),
            error: t("error")
        });

    } else {
        if (variant === "warning") logger.warn(text);
        if (variant === "info") logger.info(text);
        toast.message(text);
    }
}