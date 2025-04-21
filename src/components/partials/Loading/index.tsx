import PortalWrapper from "@/components/wrappers/PortalWrapper";
import React from "react";

const Loading: React.FC = () => {
  return (
    <PortalWrapper>
      <div
        role="status"
        aria-label="Loading"
        className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-card/75"
      >
        <div className="flex items-center gap-3">
          <p className="text-5xl font-light tracking-wide">L</p>
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-5xl font-light tracking-wide">ading...</p>
        </div>
      </div>
    </PortalWrapper>
  );
};

export default Loading;
