"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BottomNavigation } from "../../components/layout/BottomNavigation";
import { MobileContainer } from "../../components/layout/MobileContainer";

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("전체");

  const categories = ["전체", "대한민국", "일본", "유럽", "동남아"];

  const handleCardClick = () => {
    router.push("/trips/1");
  };

  return (
    <MobileContainer showNav={true}>
      <div className="w-full min-h-screen bg-white max-w-[1280px] mx-auto relative shadow-sm lg:shadow-none pb-32">
        {/* Header - Desktop Adjusted */}
        <div className="flex items-center justify-between px-5 pt-6 pb-6 lg:pt-10">
          <h1 className="text-[22px] lg:text-[28px] font-bold tracking-[-0.5px] text-[#111111]">
            가보자GO
          </h1>
          <button
            className="bg-[#7a28fa] text-white px-6 py-3 rounded-full text-[15px] font-bold shadow-lg shadow-[#7a28fa]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            onClick={() => router.push("/onboarding/location")}
          >
            AI 일정 생성
          </button>
        </div>

        {/* Dashboard Content - Grid Layout for Desktop */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-10 px-5">
          {/* Main Travel Card Column */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            <h2 className="hidden lg:block text-[20px] font-bold text-[#111] mb-2">
              나의 진행 중인 여행
            </h2>
            <div
              className="bg-[#eaf1f7] rounded-3xl p-6 lg:p-8 cursor-pointer hover:shadow-md transition-shadow"
              onClick={handleCardClick}
            >
              {/* Trip Info */}
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex justify-between border-b border-[#d1dbe2] pb-4">
                  <span className="text-[15px] font-medium text-[#6d818f]">
                    친구와 함께
                  </span>
                  <span className="text-[15px] font-medium text-[#6d818f]">
                    2026.02.10 ~ 02.14
                  </span>
                </div>
                <h2 className="text-[24px] lg:text-[32px] font-bold tracking-[-0.5px] text-[#111111] pt-4">
                  제주도 여행
                </h2>
              </div>

              {/* Category Tags */}
              <div className="flex gap-2 mb-10">
                {["자연", "맛집", "카페", "쇼핑"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[14px] font-semibold text-[#6d818f] px-4 py-2 rounded-xl bg-white/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Budget Section */}
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-[16px] font-medium text-[#556574]">
                    남은 예산
                  </span>
                  <span className="text-[16px] text-[#556574]">
                    <span className="font-bold text-[#111]">412,000원</span> /
                    500,000원
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="relative w-full h-4 bg-white rounded-full overflow-hidden border border-[#111111]/5">
                  <div
                    className="absolute top-0 left-0 h-full bg-[#111111] rounded-full"
                    style={{ width: "80%" }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                {[
                  { icon: "/icons/camera.svg", label: "사진 등록" },
                  { icon: "/icons/receipt.svg", label: "영수증 등록" },
                  { icon: "/icons/map-pin.svg", label: "지도 보기" },
                ].map((btn, idx) => (
                  <button
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-2 bg-white rounded-2xl border border-[#e5eef4] py-6 hover:bg-[#fcfdfe] transition-colors"
                  >
                    <Image
                      src={btn.icon}
                      alt={btn.label}
                      width={28}
                      height={28}
                    />
                    <span className="text-[14px] font-bold text-[#556574]">
                      {btn.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Side Content Column - Popular Lists */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-12 lg:gap-14 mt-12 lg:mt-0">
            {/* Popular Travel Routes */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[18px] lg:text-[20px] font-bold text-[#111111]">
                  인기 여행 코스 TOP10
                </h2>
                <button className="text-[14px] font-semibold text-[#7a28fa]">
                  전체보기
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  {
                    img: "/images/jeju-beach.png",
                    text: "금릉해변과 카페 맛집 코스",
                  },
                  {
                    img: "/images/jeju-hill.png",
                    text: "제주 오름과 먹방 숙소 추천",
                  },
                  {
                    img: "/images/jeju-forest.png",
                    text: "제주 비밀의 숲 힐링 코스",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 group cursor-pointer"
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden relative flex-shrink-0">
                      <Image
                        src={item.img}
                        alt="route"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <p className="text-[15px] font-bold text-[#111] leading-tight group-hover:text-[#7a28fa] transition-colors">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Restaurants */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[18px] lg:text-[20px] font-bold text-[#111111]">
                  실시간 인기 맛집
                </h2>
                <button className="text-[14px] font-semibold text-[#7a28fa]">
                  전체보기
                </button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                {[
                  {
                    img: "/images/restaurant-1.png",
                    text: "맛있는 초밥집 도쿄",
                  },
                  {
                    img: "/images/restaurant-2.png",
                    text: "정통 파스타 인 로마",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 group cursor-pointer"
                  >
                    <div className="w-full lg:w-20 h-28 lg:h-20 rounded-2xl overflow-hidden relative">
                      <Image
                        src={item.img}
                        alt="restaurant"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <p className="text-[15px] font-bold text-[#111] leading-tight group-hover:text-[#7a28fa] transition-colors">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </MobileContainer>
  );
}
