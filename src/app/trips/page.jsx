"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MobileContainer } from "../../components/layout/MobileContainer";
import { BottomNavigation } from "../../components/layout/BottomNavigation";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { Search } from "lucide-react";
import { clsx } from "clsx";

const TripCard = ({ trip, onClick, isLast }) => {
  return (
    <>
      <div className="px-5 py-5 cursor-pointer" onClick={onClick}>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center gap-5">
            <span className="text-[14px] font-normal text-[#969696] tracking-[-0.5px]">
              {trip.companion
                ? ["친구와", "연인과", "가족과", "부모님과"].includes(
                    trip.companion,
                  )
                  ? `${trip.companion} 함께`
                  : trip.companion
                : "나홀로"}
            </span>
            <span className="text-[14px] font-normal text-[#969696] tracking-[-0.5px] whitespace-nowrap">
              {(() => {
                if (!trip.startDate) return "날짜 없음";

                const formatDate = (dateStr) => {
                  if (!dateStr) return "";
                  // Handle YYYY-MM-DD or YYYY.MM.DD, potentially with time
                  return dateStr.split("T")[0].replace(/-/g, ".");
                };

                const start = formatDate(trip.startDate);
                if (!trip.endDate) return start;

                const end = formatDate(trip.endDate);
                const startYear = start.split(".")[0];
                const endYear = end.split(".")[0];

                if (startYear === endYear) {
                  return `${start} ~ ${end.substring(5)}`;
                } else {
                  return `${start} ~ ${end}`;
                }
              })()}
            </span>
          </div>
          <h2 className="text-[18px] font-bold text-[#111111] tracking-[-0.5px] leading-tight">
            {trip.title}
          </h2>
          <div className="flex flex-wrap gap-1">
            {(trip.tags || ["자연", "맛집", "카페", "쇼핑"]).map((tag, i) => (
              <span key={i} className="text-[13px] font-normal text-[#858585]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      {!isLast && (
        <div className="h-[1px] mx-5 bg-[rgba(229,235,241,0.7)] md:hidden" />
      )}
    </>
  );
};

export default function TripsListPage() {
  const router = useRouter();
  const { myTrips, resetTravelData } = useOnboardingStore();
  const [activeTab, setActiveTab] = useState("itinerary"); // 'itinerary' | 'records'

  const handleCreateNew = () => {
    resetTravelData();
    router.push("/onboarding/location");
  };

  const now = new Date();

  const itineraryTrips = myTrips
    .filter((trip) => {
      if (!trip.endDate) return true;
      return new Date(trip.endDate) >= now;
    })
    .reverse();

  const recordTrips = myTrips
    .filter((trip) => {
      if (!trip.endDate) return false;
      return new Date(trip.endDate) < now;
    })
    .reverse();

  const displayTrips = activeTab === "itinerary" ? itineraryTrips : recordTrips;

  return (
    <MobileContainer className="lg:max-w-[1280px] mx-auto" showNav={true}>
      <div className="h-full bg-white text-[#111] flex flex-col">
        <header className="flex items-center justify-between px-5 py-3.5 bg-white sticky top-0 z-10 max-w-[1280px] w-full mx-auto">
          <h1 className="text-[20px] font-semibold text-[#111] tracking-[-0.5px]">
            여행 일정
          </h1>
          <button
            className="bg-transparent border-none text-[#111] flex items-center justify-center p-2 cursor-pointer rounded-full"
            onClick={() => console.log("Search clicked")}
          >
            <Search size={18} strokeWidth={2.5} />
          </button>
        </header>

        <div className="flex border-b border-[#f2f4f6] bg-white sticky top-[56px] z-[9] px-5 max-w-[1280px] w-full mx-auto">
          <button
            className={clsx(
              "flex-1 py-3.5 text-[15px] font-semibold tracking-[-0.3px] transition-all relative",
              activeTab === "itinerary" ? "text-[#111111]" : "text-[#abb1b9]",
            )}
            onClick={() => setActiveTab("itinerary")}
          >
            일정
            {activeTab === "itinerary" && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-[#111111]" />
            )}
          </button>
          <button
            className={clsx(
              "flex-1 py-3.5 text-[15px] font-semibold tracking-[-0.3px] transition-all relative",
              activeTab === "records" ? "text-[#111111]" : "text-[#abb1b9]",
            )}
            onClick={() => setActiveTab("records")}
          >
            기록
            {activeTab === "records" && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-[#111111]" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-[100px] scrollbar-hide max-w-[1280px] w-full mx-auto">
          {displayTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-0 md:gap-4 md:px-5 md:pt-4">
              {displayTrips.map((trip, index) => (
                <div
                  key={trip.id}
                  className="bg-white md:rounded-2xl md:border md:border-[#f2f4f6] md:shadow-sm"
                >
                  <TripCard
                    trip={trip}
                    isLast={index === displayTrips.length - 1 || true} // Grid에서는 항상 실선 제거 느낌으로
                    onClick={() => router.push(`/trips/${trip.id}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl py-16 px-5 text-center mt-5 mx-5">
              <p className="text-[15px] text-[#8e8e93] leading-relaxed mb-6 whitespace-pre-wrap">
                {activeTab === "itinerary"
                  ? "예정된 여정이 없습니다.\n새로운 여행을 계획해보세요!"
                  : "완료된 여행 기록이 없습니다."}
              </p>
              {activeTab === "itinerary" && (
                <button
                  className="bg-[#111] text-white border-none py-3.5 px-6 rounded-2xl font-bold text-[15px] cursor-pointer hover:opacity-90 active:opacity-80 transition-opacity"
                  onClick={handleCreateNew}
                >
                  AI 일정 생성하기
                </button>
              )}
            </div>
          )}
        </div>

        <BottomNavigation />
      </div>
    </MobileContainer>
  );
}
