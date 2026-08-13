import { Info } from "lucide-react";

export function NotificationBar() {
  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-loud-yellow text-black">
      <div className="mx-auto max-w-7xl px-6 py-3">
        <div className="flex items-center justify-center gap-2 text-center">
          <Info className="h-4 w-4 flex-shrink-0" />
          <p className="text-xs sm:text-sm font-semibold">
            Due to high demand, we have increased the limit for DROP 001 to 2,500 spots. More details to follow.
          </p>
        </div>
      </div>
    </div>
  );
}

export function useNotificationBarOffset() {
  // Returns the height offset for the notification bar
  // Can be used to adjust other fixed elements if needed
  return 48; // approximate height in pixels
}

