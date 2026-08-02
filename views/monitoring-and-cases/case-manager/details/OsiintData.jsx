"use client";
import {
  getOSINTdata,
  getOSINTScreenshots,
} from "@/app/dashboard/client/onboarding/customer-queue/actions";
import { Button } from "@/components/ui/button";
import { ScreenshotLightbox } from "@/views/onboarding/customer-queue/details/Osiint";
import { FileIcon, ImageIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

const DataCard = ({ title, description }) => {
  const [showMore, setShowMore] = useState(false);
  return (
    <div className="bg-white rounded-lg p-4 space-y-2">
      <h5 className="font-bold">{title}</h5>
      {/* add see more button */}

      <div>
        <p className="text-xs text-gray-500 leading-relaxed">
          {showMore ? description : description?.slice(0, 100)}{" "}
          <button
            variant="link"
            className="text-xs font-bold hover:underline transition-all duration-300"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "See Less" : "See More"}
          </button>
        </p>
      </div>
    </div>
  );
};

const ScreenshotCard = ({ screenshot, index, screenshots }) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const navigate = useCallback(
    (direction) => {
      setActiveIndex((current) => {
        if (current < 0) return current;
        return (current + direction + screenshots.length) % screenshots.length;
      });
    },
    [screenshots.length],
  );
  return (
    <div>
      <div
        className="w-full border rounded-lg overflow-hidden cursor-pointer"
        onClick={() => setActiveIndex(index)}
      >
        <img
          src={`data:image/png;base64,${screenshot.base64}`}
          alt={screenshot.query_text}
          className="w-full h-full object-cover"
        />
      </div>
      <ScreenshotLightbox
        screenshots={screenshots}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(-1)}
        onNavigate={navigate}
      />
    </div>
  );
};
export default function OsiintData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [screenshots, setScreenshots] = useState([]);

  console.log("reportData", reportData);

  useEffect(() => {
    // if (!id) {
    //   setLoading(false);
    //   return;
    // }

    let cancelled = false;

    const getOsiintReport = async () => {
      setLoading(true);
      setError(null);
      const id = "6a46d281e72ec09b24e55300";
      try {
        const entityType = "customers";
        const response = await getOSINTdata(entityType, id);
        const screenshotData = await getOSINTScreenshots(entityType, id);
        if (!cancelled) {
          setReportData(response);
          setScreenshots(screenshotData);
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || "Failed to load OSINT report");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    getOsiintReport();
    return () => {
      cancelled = true;
    };
  }, []);
  const data = reportData?.report;

  return (
    <div className="shadow rounded-lg p-2 border">
      <h5 className="font-bold text-base px-3 py-2 text-center flex items-center gap-2 justify-center">
        <FileIcon className="w-4 h-4" /> OSINT Report
      </h5>
      <DataCard
        title="Analysis and Interpretation"
        description={data?.analysis_and_interpretation}
      />
      <DataCard title="Introduction" description={data?.introduction} />
      <DataCard title="Area of Interest" description={data?.area_of_interest} />
      <DataCard title="Data Collection" description={data?.data_collection} />
      <DataCard title="Conclusion" description={data?.conclusion} />

      <DataCard title="Risk Assessment" description={data?.risk_assessment} />

      {screenshots.length > 0 && (
        <div className="flex flex-col gap-2">
          <h5 className="font-bold text-base px-3 py-2 text-center flex items-center gap-2 justify-center">
            <ImageIcon className="w-4 h-4" /> Screenshots
          </h5>
          <div className="grid grid-cols-3 gap-2 items-center justify-center">
            {screenshots.map((screenshot, idx) => (
              <ScreenshotCard
                key={idx}
                screenshot={screenshot}
                index={idx}
                screenshots={screenshots}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
