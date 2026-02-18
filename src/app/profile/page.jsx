"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MobileContainer } from "../../components/layout/MobileContainer";
import { BottomNavigation } from "../../components/layout/BottomNavigation";
import { clsx } from "clsx";

export default function MyPage() {
  const [activeTab, setActiveTab] = useState("장소"); // "장소" 또는 "사진"

  const user = {
    name: "홍길동님",
    reviewCount: 12,
    profileImage: "/icons/profile.svg", // Using existing profile icon as placeholder
  };

  const tabs = [
    { id: "장소", label: "찜/등록된 장소" },
    { id: "사진", label: "찜한 사진" },
  ];

  // Mock data for places and photos
  const savedPlaces = [
    {
      id: 1,
      name: "제주산방산탄산온천",
      address: "제주특별자치도 서귀포시 안덕면 사계북로 41번길 192",
      category: "온천",
    },
    {
      id: 2,
      name: "카멜리아 힐",
      address: "제주특별자치도 서귀포시 안덕면 병악로 166",
      category: "테마파크",
    },
  ];

  const savedPhotos = [
    { id: 1, src: "/images/trip-photo-1.png" },
    { id: 2, src: "/images/trip-photo-2.png" },
    { id: 3, src: "/images/trip-photo-3.png" },
    { id: 4, src: "/images/trip-photo-1.png" },
    { id: 5, src: "/images/trip-photo-2.png" },
    { id: 6, src: "/images/trip-photo-3.png" },
  ];

  return (
    <MobileContainer showNav={true}>
      <div className="w-full h-screen bg-white flex flex-col lg:bg-[#f8f9fa]">
        <header className="flex items-center justify-between px-5 py-6 bg-white sticky top-0 z-10 lg:border-b lg:border-[#f2f4f6]">
          <div className="max-w-[800px] w-full mx-auto flex items-center justify-between">
            <h1 className="text-[20px] lg:text-[24px] font-bold text-[#111] tracking-tighter">
              마이페이지
            </h1>
            <button className="hidden lg:block text-sm font-semibold text-[#7a28fa] border border-[#7a28fa] px-4 py-2 rounded-lg">
              프로필 수정
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto w-full pb-32">
          <div className="max-w-[800px] w-full mx-auto">
            {/* Profile Section */}
            <div className="px-5 pt-8 pb-6 lg:bg-white lg:rounded-3xl lg:mt-6 lg:shadow-sm">
              <div className="flex items-center gap-6 mb-2">
                <div className="w-20 h-20 bg-[#f2f4f6] rounded-full flex items-center justify-center border border-[#eceff4]">
                  <Image
                    src={user.profileImage}
                    alt="profile"
                    width={40}
                    height={50}
                    className="grayscale opacity-40"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h1 className="text-[24px] font-bold text-[#111111] tracking-[-0.5px]">
                    {user.name}
                  </h1>
                  <div className="flex items-center gap-1 cursor-pointer group">
                    <span className="text-[15px] font-medium text-[#556574] group-hover:text-[#7a28fa] transition-colors">
                      내 리뷰 {user.reviewCount}개
                    </span>
                    <Image
                      src="/icons/arrow-right.svg"
                      alt="arrow-right"
                      width={16}
                      height={16}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Selection */}
            <div className="flex border-b border-[#f2f4f6] px-5 bg-white lg:mt-6 lg:rounded-t-3xl lg:border-b-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "flex-1 py-4 text-[16px] font-bold tracking-[-0.3px] transition-all relative",
                    activeTab === tab.id ? "text-[#111111]" : "text-[#abb1b9]",
                  )}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#111111]" />
                  )}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="bg-[#fafafa] lg:bg-white px-5 py-8 lg:rounded-b-3xl min-h-[400px]">
              {activeTab === "장소" ? (
                <div className="flex flex-col gap-4">
                  {savedPlaces.map((place) => (
                    <div
                      key={place.id}
                      className="bg-white lg:bg-[#f9fafb] rounded-2xl border border-[#eceff4] p-5 shadow-[0px_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-[17px] font-bold text-[#111111]">
                          {place.name}
                        </h3>
                        <span className="text-[13px] font-bold text-[#7a28fa] bg-[#f8f6ff] px-3 py-1 rounded-full">
                          {place.category}
                        </span>
                      </div>
                      <p className="text-[14px] text-[#6d818f] line-clamp-1">
                        {place.address}
                      </p>
                    </div>
                  ))}
                  {savedPlaces.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-[#abb1b9]">
                      <p className="text-[16px] font-medium">
                        찜한 장소가 없습니다.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 lg:gap-3">
                  {savedPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative aspect-square rounded-xl overflow-hidden group"
                    >
                      <Image
                        src={photo.src}
                        alt="saved-photo"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                  ))}
                  {savedPhotos.length === 0 && (
                    <div className="col-span-3 flex flex-col items-center justify-center py-20 text-[#abb1b9]">
                      <p className="text-[16px] font-medium">
                        찜한 사진이 없습니다.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
    </MobileContainer>
  );
}
