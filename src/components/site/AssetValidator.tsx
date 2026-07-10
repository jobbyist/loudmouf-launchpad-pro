import { useState } from "react";
import { CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Asset Validator Component
 * 
 * Temporary debug component to verify all static assets are loading correctly
 * from the /public directory. Useful for testing deployments.
 * 
 * To use: Import and add <AssetValidator /> to any page
 * Remove once assets are confirmed working in production.
 */

const ASSETS_TO_VALIDATE = [
  { path: "/logo.png", type: "image", name: "Logo" },
  { path: "/images/hero-poster.png", type: "image", name: "Hero Poster" },
  { path: "/images/hero.mp4", type: "video", name: "Hero Video" },
  { path: "/images/story.png", type: "image", name: "Story Image" },
  { path: "/images/ad-creative.png", type: "image", name: "Ad Creative" },
  { path: "/images/true-grade.webp", type: "image", name: "True Grade Badge" },
];

export function AssetValidator() {
  const [visible, setVisible] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const validateAsset = (path: string, type: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (type === "image") {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = path;
      } else if (type === "video") {
        const video = document.createElement("video");
        video.onloadedmetadata = () => resolve(true);
        video.onerror = () => resolve(false);
        video.src = path;
      } else {
        resolve(false);
      }
    });
  };

  const runValidation = async () => {
    const newResults: Record<string, boolean> = {};
    for (const asset of ASSETS_TO_VALIDATE) {
      const isValid = await validateAsset(asset.path, asset.type);
      newResults[asset.path] = isValid;
    }
    setResults(newResults);
  };

  if (!visible) {
    return (
      <button
        onClick={() => {
          setVisible(true);
          runValidation();
        }}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-loud-purple px-4 py-2 text-xs uppercase tracking-wider text-white shadow-lg hover:bg-loud-purple/90"
      >
        <Eye className="inline h-4 w-4 mr-1" /> Test Assets
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 rounded-2xl border border-white/10 bg-loud-ink p-4 shadow-2xl">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Asset Validator</h3>
        <button onClick={() => setVisible(false)} className="text-white/60 hover:text-white">
          <EyeOff className="h-4 w-4" />
        </button>
      </div>
      {ASSETS_TO_VALIDATE.map((asset) => (
        <div key={asset.path} className="mb-2 flex items-center justify-between text-xs text-white/70">
          <span className="truncate">{asset.name}</span>
          {results[asset.path] === true ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : results[asset.path] === false ? <XCircle className="h-4 w-4 text-red-500" /> : <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />}
        </div>
      ))}
    </div>
  );
}
