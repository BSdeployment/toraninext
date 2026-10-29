import { toHebrewDateString } from "@/lib/hebrew-date";

/** מציג תאריך עברי עבור תאריך לועזי בפורמט YYYY-MM-DD */
export default function HebrewDate({ date }: { date: string }) {
  let text = "";
  try {
    text = toHebrewDateString(date);
  } catch (e) {
    console.error(e);
  }
  return <div className="hebrew-date">{text}</div>;
}
