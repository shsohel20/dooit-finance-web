import React from "react";

export default function Question({ children }) {
  return <h4 className="text-xl text-start">{children}</h4>;
}

export const QuestionDescription = ({ children }) => {
  return <p className="text-sm text-muted-foreground text-start mt-1">{children}</p>;
};
