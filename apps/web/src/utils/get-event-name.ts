import { Event } from "@shared/database";

function getEventName(event: Event | undefined) {
  if (event === "PublicForum") return "Public Forum";
  else if (event === "LincolnDouglas") return "Lincoln Douglas";
  else return event as string;
};

export default getEventName;
