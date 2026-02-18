"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { clsx } from "clsx";
import { MobileContainer } from "../../../components/layout/MobileContainer";
import { useOnboardingStore } from "../../../store/useOnboardingStore";

const DetailTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "schedule", label: "일정", icon: MapIcon },
    { id: "budget", label: "예산", icon: Wallet },
    { id: "checklist", label: "준비물", icon: CheckSquare },
    { id: "companion", label: "동행자", icon: Users },
  ];

  return (
    <div className="flex px-4 py-2 gap-4 border-b border-[#f2f2f7]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={clsx(
            "text-[15px] font-semibold py-2 border-none bg-none relative cursor-pointer",
            {
              "text-[#111] after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-[#111]":
                activeTab === tab.id,
              "text-[#8e8e93]": activeTab !== tab.id,
            },
          )}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default function TripDetailPage() {
  const params = useParams();
  const tripId = params.tripId;
  const router = useRouter();
  const { myTrips } = useOnboardingStore();

  const MOCK_TRIP = {
    id: "1",
    title: "제주도 여행",
    budget: {
      total: 500000,
      spent: [
        {
          category: "숙박비",
          amount: 500000,
          color: "#14b8a6",
          percentage: 62,
        },
        { category: "식비", amount: 500000, color: "#3b82f6", percentage: 25 },
        {
          category: "교통비",
          amount: 500000,
          color: "#ffa918",
          percentage: 12,
        },
        { category: "기타", amount: 500000, color: "#b115fa", percentage: 6 },
      ],
      planned: [
        {
          category: "숙박비",
          amount: 500000,
          color: "#14b8a6",
          percentage: 62,
        },
        { category: "식비", amount: 500000, color: "#3b82f6", percentage: 25 },
        {
          category: "교통비",
          amount: 500000,
          color: "#ffa918",
          percentage: 12,
        },
        { category: "기타", amount: 500000, color: "#b115fa", percentage: 6 },
      ],
    },
    checklist: [
      { id: 1, name: "충전기", checked: false },
      { id: 2, name: "충전기", checked: false },
      { id: 3, name: "충전기", checked: false },
      { id: 4, name: "충전기", checked: false },
      { id: 5, name: "충전기", checked: false },
      { id: 6, name: "충전기", checked: false },
      { id: 7, name: "충전기", checked: false },
    ],
    companions: [
      { id: 1, name: "홍길동", isOwner: true },
      { id: 2, name: "홍길동", isOwner: false },
      { id: 3, name: "홍길동", isOwner: false },
      { id: 4, name: "홍길동", isOwner: false },
      { id: 5, name: "홍길동", isOwner: false },
      { id: 6, name: "홍길동", isOwner: false },
      { id: 7, name: "홍길동", isOwner: false },
      { id: 8, name: "홍길동", isOwner: false },
    ],
    days: [
      {
        places: [
          { name: "제주산방산탄산온천", time: "10:00", duration: "1시간" },
          { name: "카멜리아 힐", time: "12:00", duration: "2시간" },
          { name: "헬로키티아일랜드", time: "14:00", duration: "1.5시간" },
          { name: "제주도해안도로", time: "16:00", duration: "2시간" },
        ],
        records: [
          {
            name: "제주산방산탄산온천",
            photos: [
              { src: "/images/trip-photo-1.png", likes: 20 },
              { src: "/images/trip-photo-2.png" },
              { src: "/images/trip-photo-3.png", moreCount: 12 },
            ],
          },
          {
            name: "카멜리아 힐",
            photos: [
              { src: "/images/trip-photo-1.png" },
              { src: "/images/trip-photo-2.png" },
              { src: "/images/trip-photo-3.png", moreCount: 12 },
            ],
          },
        ],
      },
      { places: [], records: [] },
      { places: [], records: [] },
    ],
  };

  const trip = useMemo(
    () =>
      myTrips.find((t) => String(t.id) === String(tripId)) ||
      (tripId === "1" ? MOCK_TRIP : null),
    [myTrips, tripId],
  );

  const [selectedTab, setSelectedTab] = useState("일정");
  const [selectedDay, setSelectedDay] = useState(1);
  const [sheetHeight, setSheetHeight] = useState(478);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [maxHeight, setMaxHeight] = useState(800);
  const [minHeight] = useState(100);
  const sheetRef = useRef(null);

  // Define 3-tier snap heights
  const SNAPS = {
    LOW: 100,
    MID: 550,
    HIGH: 800,
  };

  const tabs = ["일정", "기록", "예산", "준비물", "동행자"];

  const currentDayPlaces = useMemo(
    () => trip?.days?.[selectedDay - 1]?.places || [],
    [trip, selectedDay],
  );

  const currentDayRecords = useMemo(
    () => trip?.days?.[selectedDay - 1]?.records || [],
    [trip, selectedDay],
  );

  const dayCount = trip?.days?.length || 1;
  const days = Array.from({ length: dayCount }, (_, i) => `${i + 1}일차`);

  useEffect(() => {
    const h = window.innerHeight;
    const max = h * 0.95;
    const mid = h * 0.6;
    const min = 100;

    setMaxHeight(max);
    setSheetHeight(mid); // Start in Middle

    SNAPS.LOW = min;
    SNAPS.MID = mid;
    SNAPS.HIGH = max;
  }, []);

  const isCollapsed = sheetHeight <= SNAPS.LOW + 20;

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(sheetHeight);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - startY;
    const newHeight = Math.max(
      minHeight,
      Math.min(maxHeight, currentY - deltaY),
    );
    setSheetHeight(newHeight);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const h = window.innerHeight;
    const snaps = [minHeight, h * 0.6, h * 0.95];
    const closest = snaps.reduce((prev, curr) => {
      return Math.abs(curr - sheetHeight) < Math.abs(prev - sheetHeight)
        ? curr
        : prev;
    });
    setSheetHeight(closest);
  };

  const renderTabContent = () => {
    return (
      <>
        {selectedTab === "일정" && (
          <div className="flex flex-col gap-6">
            {currentDayPlaces.length > 0 ? (
              currentDayPlaces.map((place, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="flex flex-col items-center gap-2 pt-1">
                    <div className="w-6 h-6 rounded-full bg-[#7a28fa] text-white text-sm font-bold flex items-center justify-center">
                      {idx + 1}
                    </div>
                    {idx < currentDayPlaces.length - 1 && (
                      <div className="w-[1px] h-5 bg-[rgba(229,235,241,0.7)]" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-5 mb-2">
                      <h3 className="text-base font-semibold text-[#111111] tracking-[-0.06px]">
                        {place.name}
                      </h3>
                      <Image
                        src="/icons/dots-menu.svg"
                        alt="menu"
                        width={18}
                        height={4}
                        className="flex-shrink-0"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#7a28fa] tracking-[-0.06px]">
                        {place.time || "10:00"}
                      </span>
                      <span className="text-sm text-[#6e6e6e] tracking-[-0.06px]">
                        {place.duration || "1시간"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-[#8e8e93]">
                일정이 없습니다.
              </div>
            )}
          </div>
        )}

        {selectedTab === "기록" && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#111111]">
                108개의 사진
              </span>
              <span className="text-sm font-semibold text-[#7a28fa] cursor-pointer">
                사진 등록
              </span>
            </div>

            {currentDayRecords.length > 0 ? (
              currentDayRecords.map((record, idx) => (
                <div key={idx} className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-5">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#7a28fa] text-white text-sm font-bold flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <h3 className="text-base font-semibold text-[#111111] tracking-[-0.06px]">
                        {record.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <Image
                        src="/icons/edit.svg"
                        alt="edit"
                        width={13}
                        height={13}
                      />
                      <span className="text-sm font-medium text-[#c7c8d8] tracking-[-0.35px]">
                        리뷰
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-[2px] overflow-x-auto scrollbar-hide">
                    {record.photos.map((photo, photoIdx) => (
                      <div
                        key={photoIdx}
                        className="relative w-[110px] h-[110px] flex-shrink-0"
                      >
                        <Image
                          src={photo.src}
                          alt={`photo-${photoIdx}`}
                          fill
                          className={clsx(
                            "object-cover",
                            photoIdx === 0 && "rounded-l-lg",
                            photoIdx === record.photos.length - 1 &&
                              "rounded-r-lg",
                          )}
                        />
                        {photoIdx === 0 && photo.likes && (
                          <div className="absolute bottom-2 left-2 flex items-center gap-1">
                            <Image
                              src="/icons/heart-fill.svg"
                              alt="likes"
                              width={17}
                              height={15}
                            />
                            <span className="text-[15px] font-medium text-white">
                              {photo.likes}
                            </span>
                          </div>
                        )}
                        {photoIdx === record.photos.length - 1 &&
                          photo.moreCount && (
                            <div className="absolute inset-0 bg-black/50 rounded-r-lg flex items-center justify-center">
                              <span className="text-base font-semibold text-white tracking-[-0.1px]">
                                +{photo.moreCount}
                              </span>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-[#8e8e93]">
                기록이 없습니다.
              </div>
            )}
          </div>
        )}

        {selectedTab === "예산" && trip.budget && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-5">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-[#111111]">
                  예산 {trip.budget.total.toLocaleString()}원
                </span>
                <Image
                  src="/icons/edit-purple.svg"
                  alt="edit"
                  width={15}
                  height={15}
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="text-sm font-semibold text-[#7a28fa] bg-transparent border-none p-0 cursor-pointer"
                  onClick={() => router.push(`/trips/${tripId}/camera/receipt`)}
                >
                  영수증 등록
                </button>
                <span className="text-sm font-semibold text-[#8e8e93]">
                  내역
                </span>
              </div>
            </div>

            <div className="h-[1px] bg-[#f2f4f6]" />

            <div className="flex flex-col gap-4">
              <h3 className="text-base font-semibold text-[#111111] tracking-[-0.5px]">
                사용 금액
              </h3>
              <div className="flex gap-6 items-center">
                <div className="relative w-[159px] h-[159px] flex-shrink-0">
                  <Image
                    src="/icons/donut-chart.svg"
                    alt="chart"
                    width={159}
                    height={159}
                  />
                  <span className="absolute top-[66px] right-[10px] text-[13px] font-semibold text-white">
                    62%
                  </span>
                  <span className="absolute top-[93px] left-[11px] text-[13px] font-semibold text-white">
                    25%
                  </span>
                  <span className="absolute top-[34px] left-[12px] text-[13px] font-semibold text-white">
                    12%
                  </span>
                  <span className="absolute top-[13px] left-[47px] text-[13px] font-semibold text-white">
                    6%
                  </span>
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className="text-xs text-[#abb1b9]">카테고리</span>
                    <span className="text-xs text-[#abb1b9]">사용 금액</span>
                  </div>
                  <div className="h-[1px] bg-[#f2f4f6]" />
                  {trip.budget.spent.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-[#556574]">
                          {item.category}
                        </span>
                      </div>
                      <span
                        className={clsx(
                          "text-sm font-semibold",
                          item.category === "식비"
                            ? "text-[#ff0909]"
                            : "text-[#111111]",
                        )}
                      >
                        {item.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 bg-[#fff1f1] rounded-lg py-3">
                <Image
                  src="/icons/danger.svg"
                  alt="warning"
                  width={15}
                  height={14}
                />
                <span className="text-[13px] font-medium text-[#ff0909]">
                  예산을 넘은 사용 금액이 있어요
                </span>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "준비물" && trip.checklist && (
          <div className="flex flex-col gap-4 pt-1">
            <div className="flex items-center justify-between gap-5">
              <span className="text-sm font-semibold text-[#111111]">
                준비물 {trip.checklist.length}개
              </span>
              <span className="text-sm font-semibold text-[#7a28fa] cursor-pointer">
                준비물 추가
              </span>
            </div>

            <div className="flex flex-col gap-3 bg-[#f9fafb] rounded-xl p-4">
              {trip.checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-[18px] h-[18px] rounded cursor-pointer">
                      <Image
                        src="/icons/checkbox-unchecked.svg"
                        alt="checkbox"
                        width={18}
                        height={18}
                      />
                    </div>
                    <span className="text-base text-[#111111] tracking-[-0.4px]">
                      {item.name}
                    </span>
                  </div>
                  <Image
                    src="/icons/dots-menu.svg"
                    alt="menu"
                    width={18}
                    height={4}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === "동행자" && trip.companions && (
          <div className="flex flex-col gap-4 pt-1">
            <div className="flex items-center justify-between gap-5">
              <span className="text-sm font-semibold text-[#111111]">
                등록된 동행자 {trip.companions.length}명
              </span>
              <span className="text-sm font-semibold text-[#7a28fa] cursor-pointer">
                동행자 초대
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {trip.companions.map((companion) => (
                <div
                  key={companion.id}
                  className="flex items-center gap-3 bg-white rounded-lg border border-[#f2f4f6] px-4 py-3"
                >
                  <div className="w-5 h-5 flex-shrink-0">
                    <Image
                      src="/icons/profile.svg"
                      alt="profile"
                      width={20}
                      height={20}
                    />
                  </div>
                  <span className="text-sm text-[#111111] font-medium truncate">
                    {companion.name}
                  </span>
                  {companion.isOwner && (
                    <Image
                      src="/icons/crown.svg"
                      alt="owner"
                      width={14}
                      height={10}
                      className="ml-auto flex-shrink-0"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  if (!trip) {
    return (
      <MobileContainer>
        <div className="flex flex-col items-center justify-center h-full gap-4 text-[#8e8e93]">
          <p>여행 정보를 찾을 수 없습니다.</p>
          <button
            onClick={() => router.push("/home")}
            className="text-[#111] font-bold"
          >
            홈으로 돌아가기
          </button>
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer className="lg:max-w-none">
      <div className="relative w-full h-screen bg-white overflow-hidden lg:flex lg:flex-row">
        {/* Map Section */}
        <div className="relative flex-1 h-full overflow-hidden">
          {/* Map Background */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/images/map-background.png"
              alt="map"
              fill
              className="object-cover"
              priority
            />

            {/* Map Markers Simulation */}
            {currentDayPlaces.map((place, idx) => (
              <div
                key={idx}
                className="absolute"
                style={{
                  top: `${166 + idx * 50}px`,
                  left: `${148 + idx * 20}px`,
                }}
              >
                <div className="w-8 h-8 rounded-full bg-[#7a28fa] text-white text-[15px] font-semibold flex items-center justify-center border-2 border-white shadow-lg">
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Header - Adjusted for Responsive */}
          <div className="fixed top-0 left-0 right-0 px-6 pt-4 pb-4 flex items-center justify-between bg-white z-20 shadow-sm max-w-[430px] lg:max-w-none lg:static lg:border-b lg:border-[#f2f4f6] mx-auto lg:mx-0">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()}>
                <Image
                  src="/icons/arrow-left.svg"
                  alt="back"
                  width={20}
                  height={16}
                  className="w-5 h-4"
                />
              </button>
              <h1 className="text-lg font-semibold text-[#111111] tracking-[-0.5px]">
                {trip.title}
              </h1>
            </div>
            <button className="text-sm font-medium text-[#111111]">
              챗봇 대화
            </button>
          </div>
        </div>

        {/* Right Side Panel - Desktop Only */}
        <div className="hidden lg:flex flex-col w-[420px] h-full bg-white border-l border-[#f2f4f6] shadow-[-4px_0_12px_rgba(0,0,0,0.02)] z-10 overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Desktop Tabs */}
            <div className="border-b border-[#e5ebf2] px-5 flex-shrink-0">
              <div className="flex items-center gap-4">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={clsx(
                      "text-[15px] font-semibold tracking-[-0.3px] py-4 transition-all relative",
                      selectedTab === tab ? "text-[#111111]" : "text-[#898989]",
                    )}
                  >
                    {tab}
                    {selectedTab === tab && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-[#111111]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Day Tabs */}
            <div className="px-5 pt-4 pb-2 flex gap-1 overflow-x-auto scrollbar-hide flex-shrink-0">
              {days.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDay(index + 1)}
                  className={clsx(
                    "px-4 py-2 rounded-full text-[14px] font-semibold whitespace-nowrap transition-colors",
                    selectedDay === index + 1
                      ? "bg-[#111111] text-white"
                      : "bg-[#f5f7f9] text-[#556574] font-medium",
                  )}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Desktop Content Scroll Area */}
            <div className="flex-1 overflow-y-auto px-5 pt-4 pb-10 scrollbar-hide">
              {/* Content rendering logic reused or extracted. For now, duplication or inline. Let's keep it clean. */}
              {renderTabContent()}
            </div>
          </div>
        </div>

        {/* Bottom Sheet - Mobile Only */}
        <div
          ref={sheetRef}
          className="lg:hidden fixed left-0 right-0 bg-white rounded-t-xl shadow-[0px_-4px_12px_rgba(0,0,0,0.04)] transition-all z-20 max-w-[430px] mx-auto"
          style={{
            height: `${sheetHeight}px`,
            bottom: 0,
          }}
        >
          {/* Drag Handle */}
          <div
            className="pt-3 pb-2 cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto" />
          </div>

          {/* Mobile Tabs - Hidden when collapsed */}
          {!isCollapsed && (
            <div className="border-b border-[#e5ebf2] px-5">
              <div className="flex items-center gap-4">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={clsx(
                      "text-[15px] font-semibold tracking-[-0.3px] py-3 transition-all relative",
                      selectedTab === tab ? "text-[#111111]" : "text-[#898989]",
                    )}
                  >
                    {tab}
                    {selectedTab === tab && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-[#111111]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mobile Day Tabs - Always visible */}
          <div className="px-5 pt-4 pb-3 flex gap-1 overflow-x-auto scrollbar-hide">
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => setSelectedDay(index + 1)}
                className={clsx(
                  "px-4 py-2 rounded-full text-[15px] font-semibold whitespace-nowrap transition-colors",
                  selectedDay === index + 1
                    ? "bg-[#111111] text-white"
                    : "bg-transparent text-black font-normal",
                )}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Mobile Content visible only when not collapsed */}
          {!isCollapsed && (
            <div
              className="px-5 pb-24 overflow-y-auto"
              style={{ maxHeight: `${sheetHeight - 160}px` }}
            >
              {renderTabContent()}
            </div>
          )}
        </div>
      </div>
    </MobileContainer>
  );
}
