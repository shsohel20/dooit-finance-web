import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <div className="flex space-x-2 ">
      {/* <Image
        priority
        className="h-8 w-auto border-2"
        src={slogo}
        alt="Linkcaps Logo"
      /> */}
      <Image
        priority
        width={200}
        height={20}
        className="h-8 w-auto"
        src={"/logo.png"}
        alt="Linkcaps Logo"
      />
    </div>
  );
};

export default Logo;
