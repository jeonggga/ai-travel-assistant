import React from "react";
import { MobileContainer } from "../layout/MobileContainer";
import { HeaderBackButton } from "../common/HeaderBackButton";

export const StepLayout = ({
  children,
  title,
  onBack,
  rightAction,
  footer,
  showHeader = true,
  contentBgColor = "bg-white",
  showDivider = false,
}) => {
  return (
    <MobileContainer>
      <div className="flex flex-col h-screen bg-white relative">
        {/* Header */}
        {showHeader && (
          <div className="px-6 pt-8 pb-6 shrink-0 bg-white">
            <div className="flex justify-between items-center mb-12">
              <HeaderBackButton onBack={onBack} />
              {rightAction && rightAction}
            </div>
            {title && (
              <h1 className="text-[22px] font-semibold text-[#111111] tracking-[-0.5px] leading-[1.5] whitespace-pre-wrap">
                {title}
              </h1>
            )}
          </div>
        )}

        {/* Divider */}
        {showHeader && showDivider && (
          <div className="h-[1px] bg-[rgba(229,235,241,0.7)] shrink-0" />
        )}

        {/* Content Section */}
        <div
          className={`flex-1 ${contentBgColor} px-5 pt-8 pb-32 overflow-y-auto`}
        >
          {children}
        </div>

        {/* Bottom Fixed Section */}
        {footer && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#f2f4f6] z-20">
            <div className="px-5 py-4 flex flex-col gap-4">{footer}</div>
          </div>
        )}
      </div>
    </MobileContainer>
  );
};
