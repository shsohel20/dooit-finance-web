import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

function DragDrop({
  file = null,
  handleChange,
  children,
  fileTypes = ["JPG", "PNG", "GIF"],
  ...props
}) {
  return (
    <FileUploader
      file={file}
      handleChange={handleChange}
      types={fileTypes}
      {...props}
    >
      {children}
    </FileUploader>
  );
}

export default DragDrop;
