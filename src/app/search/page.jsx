"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import { MobileContainer } from "../../components/layout/MobileContainer";
import { BottomNavigation } from "../../components/layout/BottomNavigation";
import { Toast } from "../../components/common/Toast";
import { searchPlaces } from "../../services/place";

const HighlightText = ({ text, keyword }) => {
  if (!keyword.trim()) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${keyword})`, "gi"));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <span key={i} className="text-[#7a28fa]">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
};

export default function SearchPage() {
  const router = useRouter();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isSecondaryPanelOpen, setIsSecondaryPanelOpen] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // [ADD] 모바일에서 찜하기 후 돌아왔을 때 토스트 감지
  React.useEffect(() => {
    if (searchParams.get("saved") === "true") {
      setIsToastVisible(true);
      // URL 파라미터 정제 (필요시)
      window.history.replaceState({}, "", "/search");
    }
  }, [searchParams]);

  // [ADD] 서버 데이터(LocationModel Map)를 프론트엔드용 배열로 변환
  const transformServerData = (data) => {
    if (!data) return [];
    // FastAPI 응답은 키가 인덱스인 객체 맵 형식일 수 있으므로 배열로 변환
    const items =
      typeof data === "object" && !Array.isArray(data)
        ? Object.values(data)
        : data;

    return items.map((item) => ({
      id: item.id, // Kakao Place ID
      name: item.name,
      address: item.address,
      category: item.group_name || item.category || "장소",
      rating: 0,
      reviewCount: 0,
      longitude: parseFloat(item.longitude),
      latitude: parseFloat(item.latitude),
      link: item.link,
      phone: item.phone,
    }));
  };

  // [ADD] 검색 API 호출 로직 (PC용 디바운스)
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await searchPlaces(searchQuery);
        const transformedData = transformServerData(response.data);
        setSearchResults(transformedData);
      } catch (error) {
        console.error("Place search failed:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchResults();
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <MobileContainer showNav={true} className="!max-w-none">
      <div className="relative w-full h-screen bg-white overflow-hidden lg:flex lg:flex-row">
        {/* [MOD] Left Sidebar Content Area (Search & Categories) with Toggle Logic */}
        <div
          className={clsx(
            "hidden lg:flex flex-col h-full bg-white border-r border-[#f2f4f6] z-20 transition-all duration-300 ease-in-out relative",
            isSidePanelOpen ? "w-[400px]" : "w-0 border-none",
          )}
        >
          <div
            className={clsx(
              "flex flex-col h-full p-6 w-[400px] transition-opacity duration-200",
              isSidePanelOpen ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          >
            {selectedPlace ? (
              /* [ADD] PC Inline Place Detail View */
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-8">
                  <button
                    onClick={() => setSelectedPlace(null)}
                    className="p-1 -ml-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Image
                      src="/icons/arrow-left.svg"
                      alt="back"
                      width={20}
                      height={16}
                      className="w-5 h-4"
                    />
                  </button>
                  <h2 className="ml-4 text-[18px] font-bold text-[#111111]">
                    장소 상세
                  </h2>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <h1 className="text-[24px] font-bold text-[#111111] tracking-[-1px]">
                        {selectedPlace.name}
                      </h1>
                      <span className="text-[12px] font-semibold text-[#7a28fa] bg-[#f9f5ff] px-2 py-0.5 rounded">
                        {selectedPlace.category}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                      <p className="text-[14px] text-[#6e6e6e] leading-relaxed">
                        {selectedPlace.address}
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="text-[13px] font-bold text-[#7a28fa]">
                          ★ {selectedPlace.rating}
                        </span>
                        <span className="text-[13px] text-[#abb1b9]">
                          ({selectedPlace.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-1">
                    <button
                      onClick={() => setIsSecondaryPanelOpen(true)}
                      className="w-full h-[56px] border border-[#111111] text-[#111111] rounded-2xl text-[16px] font-bold hover:bg-gray-50 active:scale-[0.98] transition-all"
                    >
                      상세정보
                    </button>

                    <button
                      onClick={() => {
                        // [MOD] PC Interaction: Reset state and show toast
                        setSelectedPlace(null);
                        setSearchQuery("");
                        setIsSecondaryPanelOpen(false);
                        setIsToastVisible(true);
                      }}
                      className="w-full h-[56px] bg-[#111111] text-white rounded-2xl text-[16px] font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg"
                    >
                      찜한 장소로 등록하기
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Original Search/Category View */
              <>
                <h2 className="text-[22px] font-bold text-[#111111] mb-6 tracking-[-0.5px]">
                  장소 검색
                </h2>

                {/* [MOD] Search Input Area - Inline Search for PC */}
                <div className="flex items-center gap-3 bg-[#f5f7f9] h-14 px-4 rounded-xl border border-[#f2f4f6] transition-colors focus-within:bg-white focus-within:ring-2 focus-within:ring-[#7a28fa]/20 focus-within:border-[#7a28fa]">
                  <Image
                    src="/icons/search.svg"
                    alt="search"
                    width={20}
                    height={20}
                    className="opacity-50"
                  />
                  <input
                    type="text"
                    placeholder="장소, 숙소, 교통버스 검색"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-[16px] font-medium text-[#111111] placeholder:text-[#abb1b9] outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-[#abb1b9] p-0.5 hover:text-[#7a28fa] transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* [ADD] Search Results List (PC Inline) */}
                {searchQuery.trim() ? (
                  <div className="flex-1 overflow-y-auto mt-6 scrollbar-hide">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center pt-20 text-[#abb1b9]">
                        <p className="text-[14px] font-medium animate-pulse">
                          검색 중...
                        </p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="flex flex-col gap-5 pb-10">
                        {searchResults.map((place) => (
                          <div
                            key={`${place.id}-${place.name}`}
                            onClick={() => {
                              // [MOD] 로컬 데이터 상세 뷰를 위해 저장
                              localStorage.setItem(
                                `place_${place.id}`,
                                JSON.stringify(place),
                              );
                              setSelectedPlace(place);
                            }}
                            className="flex flex-col gap-1 cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-1 rounded-lg transition-colors group"
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="text-[15px] font-semibold text-[#111111] group-hover:text-[#7a28fa] transition-colors">
                                <HighlightText
                                  text={place.name}
                                  keyword={searchQuery}
                                />
                              </h3>
                              <span className="text-[11px] font-medium text-[#7a28fa] bg-[#f9f5ff] px-2 py-0.5 rounded">
                                {place.category}
                              </span>
                            </div>
                            <div className="flex flex-col gap-0.5 mt-1">
                              <p className="text-[12px] text-[#898989] line-clamp-1">
                                {place.address}
                              </p>
                              <div className="flex items-center gap-1">
                                <span className="text-[11px] font-bold text-[#7a28fa]">
                                  ★ {place.rating}
                                </span>
                                <span className="text-[11px] text-[#abb1b9]">
                                  ({place.reviewCount})
                                </span>
                              </div>
                            </div>
                            <div className="h-[1px] bg-[#f2f4f6] mt-4" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-20 text-[#abb1b9]">
                        <p className="text-[15px] font-medium">
                          검색 결과가 없습니다.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Categories Area (Only visible when not searching) */
                  <div className="mt-6">
                    <p className="text-[14px] font-bold text-[#111111] mb-3">
                      추천 카테고리
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["음식점", "카페", "버스정류장", "숙소", "주유소"].map(
                        (category) => (
                          <button
                            key={category}
                            className="whitespace-nowrap px-4 py-2 bg-white rounded-full text-[14px] font-semibold text-[#111111] border border-[#DBDBDB] hover:bg-gray-50 active:scale-95 transition-all"
                          >
                            {category}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* [ADD] Side Panel Toggle Button */}
          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className={clsx(
              "absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-12 bg-white border border-[#f2f4f6] rounded-r-xl shadow-md z-30 flex items-center justify-center hover:bg-gray-50 transition-all",
              !isSidePanelOpen && "!-right-10 rounded-xl",
            )}
          >
            <Image
              src="/icons/arrow-left.svg"
              alt="toggle"
              width={16}
              height={16}
              className={clsx(
                "transition-transform duration-300",
                !isSidePanelOpen && "rotate-180",
              )}
            />
          </button>
        </div>

        {/* [ADD] Right-side Extended Detail Panel (Secondary Panel) */}
        <div
          className={clsx(
            "hidden lg:flex flex-col h-full bg-white border-r border-[#f2f4f6] z-10 transition-all duration-300 ease-in-out relative",
            isSecondaryPanelOpen && selectedPlace
              ? "w-[400px]"
              : "w-0 border-none overflow-hidden",
          )}
        >
          <div
            className={clsx(
              "flex flex-col h-full w-[400px] transition-opacity duration-200",
              isSecondaryPanelOpen
                ? "opacity-100"
                : "opacity-0 pointer-events-none",
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#f2f4f6]">
              <h2 className="text-[18px] font-bold text-[#111111]">
                상세 정보
              </h2>
              <button
                onClick={() => setIsSecondaryPanelOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {/* Place Hero Image */}
              <div className="relative w-full h-[300px] bg-gray-100">
                <Image
                  src="/images/map-background.png" // Temporary placeholder
                  alt="place photo"
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-6 right-6">
                  <h1 className="text-[26px] font-bold text-white mb-2 tracking-[-1px]">
                    {selectedPlace?.name}
                  </h1>
                  <p className="text-[14px] text-white/90">
                    {selectedPlace?.address}
                  </p>
                </div>
              </div>

              {/* Description & Info */}
              <div className="p-6">
                <div className="flex flex-col gap-8">
                  <section>
                    <h3 className="text-[16px] font-bold text-[#111111] mb-3">
                      장소 소개
                    </h3>
                    <p className="text-[14px] text-[#4e4e4e] leading-[1.6] tracking-[-0.3px]">
                      이 장소는 방문객들에게 특별한 경험을 제공하는 제주도의
                      대표적인 명소 중 하나입니다. 아름다운 풍경과 함께 여유로운
                      시간을 보내기에 최적화된 공간이며, 가족, 친구, 연인과 함께
                      방문하기 좋습니다. 탄산 온천 시설부터 휴게 공간까지
                      완벽하게 갖추어져 방문객들의 만족도가 매우 높습니다.
                    </p>
                  </section>

                  {/* Divider */}
                  <div className="h-[1px] bg-[#f2f4f6]" />

                  {/* Reviews Section */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[16px] font-bold text-[#111111]">
                        리뷰
                      </h3>
                      <span className="text-[13px] font-medium text-[#7a28fa]">
                        {selectedPlace?.rating} ★ ({selectedPlace?.reviewCount})
                      </span>
                    </div>

                    <div className="flex flex-col gap-6">
                      {[
                        {
                          user: "김여행",
                          rating: 5,
                          content:
                            "부모님 모시고 갔는데 정말 좋아하셨어요! 물이 정말 깨끗하고 시설도 훌륭합니다.",
                        },
                        {
                          user: "이제주",
                          rating: 4,
                          content:
                            "경치가 너무 예뻐요. 다음에 제주도 오면 또 올 거예요!",
                        },
                        {
                          user: "박온천",
                          rating: 5,
                          content:
                            "인생 온천을 만났습니다. 시설이 깨끗해서 너무 좋았어요.",
                        },
                      ].map((review, i) => (
                        <div key={i} className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[14px] font-bold text-[#111111]">
                              {review.user}
                            </span>
                            <div className="flex text-[#7a28fa] text-[10px]">
                              {"★".repeat(review.rating)}
                            </div>
                          </div>
                          <p className="text-[13px] text-[#6e6e6e] leading-snug">
                            {review.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>

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

            {/* [ADD] PC Inline Selected Place Marker */}
            {selectedPlace && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30">
                <div className="relative w-12 h-12 bg-[#7a28fa] rounded-full border-2 border-white shadow-xl flex items-center justify-center animate-bounce">
                  <Image
                    src="/icons/location.svg"
                    alt="marker"
                    width={20}
                    height={20}
                    className="brightness-0 invert"
                  />
                </div>
                <div className="mt-3 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
                  <span className="text-white text-[14px] font-bold whitespace-nowrap">
                    {selectedPlace.name}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Mobile-only Search Bar Overlay */}
          <div className="lg:hidden absolute top-0 left-0 right-0 px-5 pt-6 pb-4 z-20">
            <div
              className="flex items-center gap-3 bg-white h-14 px-4 rounded-xl shadow-lg border border-[#f2f4f6] cursor-pointer"
              onClick={() => router.push("/search/input")}
            >
              <Image
                src="/icons/search.svg"
                alt="search"
                width={20}
                height={20}
                className="opacity-50"
              />
              <div className="flex-1 text-[16px] font-medium text-[#abb1b9]">
                장소, 숙소, 교통버스 검색
              </div>
            </div>

            {/* [ADD] Search Categories - Horizontal Scrollable */}
            <div className="mt-3 flex overflow-x-auto gap-2 scrollbar-hide pb-2 px-5 -mx-5 text-black">
              {["음식점", "카페", "버스정류장", "숙소", "주유소"].map(
                (category) => (
                  <button
                    key={category}
                    className="whitespace-nowrap px-4 py-2 bg-white rounded-full text-[14px] font-semibold text-[#111111] shadow-md border border-[#f2f4f6] hover:bg-gray-50 active:scale-95 transition-all"
                  >
                    {category}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        {/* [ADD] Toast Notification System */}
        <Toast
          isVisible={isToastVisible}
          onClose={() => setIsToastVisible(false)}
          message="찜한 장소로 등록되었어요"
          actionText="목록보기"
          onAction={() => router.push("/profile")} // 임시로 마이페이지 이동
          position={isSecondaryPanelOpen || selectedPlace ? "top" : "bottom"}
        />

        {/* Bottom Navigation - Hidden on Desktop handled by CSS or BottomNav prop */}
        <BottomNavigation />
      </div>
    </MobileContainer>
  );
}
