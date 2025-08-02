import { format, isToday, isYesterday } from "date-fns";
export { default as toast } from "react-hot-toast";
export * from "./loader";
export * from "./Modal";
export * from "./Skeleton";
export * from "./textUtil";
export * from "./timeFormat";
export * from "./userIdentity";
export * from "./ComponentUtils";
export * from "./firebaseErrors";
export * from "./hyperLinks";

export const getFormattedDateLabel = timestamp => {
  const date = new Date(timestamp);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "dd MMMM yyyy");
};
