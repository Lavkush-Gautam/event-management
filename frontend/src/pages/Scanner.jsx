import React, { useEffect, useRef, useState } from "react";

const Scanner = () => {
  const videoRef = useRef(null);
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const detectorRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    startScanner();
    return () => stopCamera();
  }, []);

  const startScanner = async () => {
    try {
      setIsScanning(true);
      setResult(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      detectorRef.current = new window.BarcodeDetector({
        formats: ["qr_code"],
      });

      scanLoop();
    } catch (error) {
      console.log("Camera error:", error);
      setResult({ success: false, message: "Camera not available" });
    }
  };

  // BACKEND CALL
  const verifyCheckIn = async (ticketId) => {
    try {
      const res = await fetch("/api/verify-checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: "Network Error" };
    }
  };

  const scanLoop = async () => {
    if (!videoRef.current || !detectorRef.current) return;

    try {
      const barcodes = await detectorRef.current.detect(videoRef.current);

      if (barcodes.length > 0) {
        stopCamera();
        setIsScanning(false);

        const qrValue = barcodes[0].rawValue;

        // Call backend
        const response = await verifyCheckIn(qrValue);

        // Save backend response
        setResult(response);
        return;
      }
    } catch { }

    animationRef.current = requestAnimationFrame(scanLoop);
  };

  const stopCamera = () => {
    cancelAnimationFrame(animationRef.current);
    const stream = videoRef.current?.srcObject;
    const tracks = stream && typeof stream.getTracks === "function" ? stream.getTracks() : [];
    if (tracks && tracks.forEach) tracks.forEach((t) => t.stop());
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-20">

      <h1 className="text-xl font-bold mb-4 text-center">QR Scanner</h1>

      {/* CAMERA FRAME */}
      {isScanning && (
        <div className="relative w-full aspect-square bg-black rounded-xl overflow-hidden shadow">
          <video ref={videoRef} className="w-full h-full object-cover" />
        </div>
      )}

      {/* RESULT BOX */}
      <div className="mt-5 p-4 bg-gray-100 rounded-lg text-center">

        {isScanning && <p className="text-gray-600">Scanning...</p>}

        {!isScanning && result && (
          <>
            {/* INVALID */}
            {!result.success && (
              <p className="text-red-600 font-semibold">❌ {result.message}</p>
            )}

            {/* ALREADY CHECKED-IN */}
            {result.success && result.already && (
              <p className="text-yellow-600">
                <b>Already Checked-In</b> <br />
                {result.user?.name} <br />
                {new Date(result.time).toLocaleString()}
              </p>
            )}

            {/* SUCCESS */}
            {result.success && !result.already && (
              <p className="text-green-600">
                <b>Check-In Successful!</b> <br />
                {result.user?.name} <br />
                {new Date(result.time).toLocaleString()}
              </p>
            )}
          </>
        )}

      </div>

      {/* SCAN AGAIN BUTTON */}
      {!isScanning && (
        <button
          onClick={startScanner}
          className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg"
        >
          Scan Again
        </button>
      )}
    </div>
  );
};

export default Scanner;
