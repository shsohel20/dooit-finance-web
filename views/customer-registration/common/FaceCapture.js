"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";

export default function FaceCapture({ image, onCapture }) {
  const webcamRef = useRef(null);
  const [countdown, setCountdown] = useState(null);
  const [ready, setReady] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [startCamera, setStartCamera] = useState(false);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   // Ask for permission first
  //   navigator.mediaDevices
  //     .getUserMedia({ video: true })
  //     .then(() => {
  //       setHasPermission(true);
  //     })
  //     .catch((err) => {
  //       setError(err.message);
  //     });
  // }, []);

  // if (error) return <p style={{ color: "red" }}>Camera Error: {error}</p>;

  // if (!hasPermission) return <p>Requesting camera permission...</p>;

  const startCountdown = () => {
    setStartCamera(true);
    setCaptured(false);
    setCountdown(3); // 3-second timer
  };

  // Handle countdown logic
  useEffect(() => {
    if (countdown === null || countdown === 0) return;

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-capture when countdown hits 0
  useEffect(() => {
    if (countdown === 0) {
      captureImage();
      setCountdown(null);
    }
  }, [countdown]);

  const captureImage = () => {
    const imgSrc = webcamRef.current.getScreenshot();
    onCapture(imgSrc);
    setCaptured(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 border-2 border-primary/20 rounded-md p-4">
      {/* <Button size="sm" variant="outline" onClick={() => setStartCamera(prev => !prev)}>Start Camera</Button> */}
     {startCamera && <>
      <Webcam
      mirrored={true}
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={400}
        height={360}
        onUserMedia={() => {
          console.log("Camera working");
          setReady(true);
        }}
        onUserMediaError={(err) => {
          console.error("CAMERA ERROR: ", err);
        }}
        videoConstraints={{
          facingMode: "user",
          width: { ideal: 400 },
          height: { ideal: 360 },
        }}
      />
      
     </>}
     <button
        onClick={startCountdown}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {image ? "Retake" : "Start Countdown"}
      </button>
      {countdown !== null && (
        <div className="text-4xl font-bold">{countdown}</div>
      )}

     

      {captured && (
        <img src={image} alt="captured" className="mt-4 w-40 border rounded" />
      )}
    </div>
  );
}
