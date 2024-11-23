import React from "react";
import { formatDistanceToNow } from "date-fns";

export const DateFormat = ({ date }) => {
  const formattedDate = formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });

  return <div className="text-sm text-muted-foreground">{formattedDate}</div>;
};
