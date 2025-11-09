import React from "react";
import { cn } from "../utility";

const Card = ({ children, className = "", ...props }) => {
  const cardClasses = cn(
    "bg-white rounded-xl shadow-lg overflow-hidden",
    className,
  );

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;
