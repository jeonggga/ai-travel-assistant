"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { MobileContainer } from "../../../../../components/layout/MobileContainer";

/**
 * [NEW] SearchPlaceDetailInfoPage
 * 모바일 환경에서 장소의 더 자세한 정보(사진, 소개, 후기)를 보여주는 전용 페이지입니다.
 */
export default function SearchPlaceDetailInfoPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  // Placeholder Data (서버에서 추가 정보를 제공하지 않을 경우 대비)
  const [placeData, setPlaceData] = useState({
    name: "장소 정보",
    category: "카테고리",
    address: "주소 정보",
    description: `이 장소는 방문객들에게 특별한 경험을 제공하는 제주도의 대표적인 명소 중 하나입니다. 
    아름다운 풍경과 함께 여유로운 시간을 보내기에 최적화된 공간이며, 가족, 친구, 연인과 함께 방문하기 좋습니다.
    탄산 온천 시설부터 휴게 공간까지 완벽하게 갖추어져 방문객들의 만족도가 매우 높습니다.`,
    rating: 0,
    reviewCount: 0,
    reviews: [
      {
        user: "김여행",
        rating: 5,
        content:
          "부모님 모시고 갔는데 정말 좋아하셨어요! 물이 정말 깨끗하고 시설도 훌륭합니다.",
      },
      {
        user: "이제주",
        rating: 4,
        content: "경치가 너무 예뻐요. 다음에 제주도 오면 또 올 거예요!",
      },
      {
        user: "박온천",
        rating: 5,
        content: "인생 온천을 만났습니다. 시설이 깨끗해서 너무 좋았어요.",
      },
    ],
  });

  // [ADD] 로컬 스토리지에서 실제 데이터 동기화
  useEffect(() => {
    const savedData = localStorage.getItem(`place_${id}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setPlaceData((prev) => ({
          ...prev,
          ...parsed,
          description: parsed.description || prev.description, // 서버에 설명이 있으면 사용
          reviews: parsed.reviews || prev.reviews, // 서버에 리뷰가 있으면 사용
        }));
      } catch (e) {
        console.error("Failed to parse saved place data", e);
      }
    }
  }, [id]);

  return (
    <MobileContainer>
      <div className="flex flex-col h-screen bg-white overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md flex items-center px-4 z-30 border-b border-[#f2f4f6]">
          <button
            onClick={() => router.back()}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Image
              src="/icons/arrow-left.svg"
              alt="back"
              width={20}
              height={16}
              className="w-5 h-4"
            />
          </button>
          <h1 className="ml-4 text-[16px] font-bold text-[#111111]">
            상세 정보
          </h1>
        </div>

        {/* Hero Image */}
        <div className="relative w-full h-[320px] min-h-[320px] flex-shrink-0 mt-14 bg-gray-100 overflow-hidden">
          <Image
            src="/images/map-background.png" // Temporary placeholder
            alt="place hero"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-8 left-6 right-6">
            <span className="inline-block text-[11px] font-bold text-[#7a28fa] bg-white px-2 py-0.5 rounded-md mb-3 shadow-sm">
              {placeData.category}
            </span>
            <h2 className="text-[26px] font-bold text-white mb-2 leading-tight tracking-[-1px]">
              {placeData.name}
            </h2>
            <p className="text-[14px] text-white/90 leading-normal">
              {placeData.address}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-8 p-6 pb-20">
          {/* Description */}
          <section>
            <h3 className="text-[18px] font-bold text-[#111111] mb-3">
              장소 소개
            </h3>
            <p className="text-[15px] text-[#4e4e4e] leading-[1.7] tracking-[-0.3px] whitespace-pre-wrap">
              {placeData.description}
            </p>
          </section>

          {/* Divider */}
          <div className="h-[1px] bg-[#f2f4f6]" />

          {/* Reviews */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[18px] font-bold text-[#111111]">
                리뷰{" "}
                <span className="text-[#abb1b9] font-medium ml-1">
                  {placeData.reviewCount}
                </span>
              </h3>
              <div className="flex items-center gap-1">
                <span className="text-[16px] font-bold text-[#7a28fa]">
                  {placeData.rating}
                </span>
                <span className="text-[#7a28fa] text-[14px]">★</span>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {placeData.reviews.map((review, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 p-4 bg-[#f8f9fa] rounded-2xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#111111]">
                      {review.user}
                    </span>
                    <div className="flex text-[#7a28fa] text-[10px]">
                      {"★".repeat(review.rating)}
                    </div>
                  </div>
                  <p className="text-[14px] text-[#4e4e4e] leading-snug">
                    {review.content}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* [ADD] 고정 하단 버튼 영역 */}
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-[#f2f4f6] z-30">
          <button
            onClick={() => router.push("/search?saved=true")}
            className="w-full h-[56px] bg-[#111111] text-white rounded-2xl text-[16px] font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg"
          >
            찜한 장소로 등록하기
          </button>
        </div>
      </div>
    </MobileContainer>
  );
}
