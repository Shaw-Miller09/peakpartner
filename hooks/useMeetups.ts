import { useContext } from "react";

import { MeetupContext } from "@/components/meetups/MeetupProvider";

export function useMeetups() {
  const context = useContext(MeetupContext);

  if (!context) {
    throw new Error("useMeetups must be used within MeetupProvider");
  }

  return context;
}
