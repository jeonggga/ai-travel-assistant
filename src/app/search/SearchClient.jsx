"use client";

import Script from "next/script";
import React, { useState, useEffect, useRef } from "react";
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

export default function SearchClient() {
  const mapRef = useRef(null);
  const detailMapRef = useRef(null); // [ADD] 상세 패널용 전용 지도 레퍼런스 추가
  const mapInstance = useRef(null);
  const detailMapInstance = useRef(null); // [ADD] 상세 패널용 지도 인스턴스 추가
  const markersRef = useRef([]);
  const overlayRef = useRef(null);
  const router = useRouter();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isSecondaryPanelOpen, setIsSecondaryPanelOpen] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchParams.get("saved") === "true") {
      setIsToastVisible(true);
      window.history.replaceState({}, "", "/search");
    }
  }, [searchParams]);

  const transformServerData = (data) => {
    if (!data) return [];
    const items =
      typeof data === "object" && !Array.isArray(data)
        ? Object.values(data)
        : data;

    return items.map((item) => ({
      id: item.id,
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

  useEffect(() => {
    if (!window.kakao || !mapRef.current) return;

    window.kakao.maps.load(() => {
      const center = new window.kakao.maps.LatLng(37.5665, 126.978);

      mapInstance.current = new window.kakao.maps.Map(mapRef.current, {
        center,
        level: 4,
      });
    });
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    const map = mapInstance.current;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const targets = selectedPlace ? [selectedPlace] : searchResults;

    targets.forEach((place) => {
      if (!place.latitude || !place.longitude) return;

      const position = new window.kakao.maps.LatLng(
        place.latitude,
        place.longitude,
      );

      const marker = new window.kakao.maps.Marker({ position });
      marker.setMap(map);
      markersRef.current.push(marker);
    });

    if (overlayRef.current) {
      overlayRef.current.setMap(null);
    }

    if (selectedPlace) {
      const position = new window.kakao.maps.LatLng(
        selectedPlace.latitude,
        selectedPlace.longitude,
      );
      const content = `
        <div class="mt-10 bg-black/80 backdrop-blur-md px-2 py-0 rounded-[6px] border border-white/20 shadow-lg">
          <span class="text-white text-[13px] font-medium whitespace-nowrap">
            ${selectedPlace.name}
          </span>
        </div>
      `;

      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: position,
        content: content,
        yAnchor: 0.5,
      });

      customOverlay.setMap(map);
      overlayRef.current = customOverlay;
      map.setCenter(position);
    }
  }, [searchResults, selectedPlace]);

  // [ADD] 상세 패널이 열릴 때 전용 지도를 초기화하거나 위치를 맞춤
  useEffect(() => {
    if (
      !isSecondaryPanelOpen ||
      !selectedPlace ||
      !window.kakao ||
      !detailMapRef.current
    ) {
      if (detailMapInstance.current) {
        detailMapInstance.current = null;
      }
      return;
    }

    window.kakao.maps.load(() => {
      const position = new window.kakao.maps.LatLng(
        selectedPlace.latitude,
        selectedPlace.longitude,
      );

      if (!detailMapInstance.current) {
        detailMapInstance.current = new window.kakao.maps.Map(
          detailMapRef.current,
          {
            center: position,
            level: 3,
          },
        );

        // 상세 패널 마커
        const marker = new window.kakao.maps.Marker({ position });
        marker.setMap(detailMapInstance.current);
      } else {
        detailMapInstance.current.setCenter(position);
        detailMapInstance.current.relayout();
      }
    });
  }, [isSecondaryPanelOpen, selectedPlace]);

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
      <Script
        src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=57dd33d25e0269c9c37a3ea70b3a3b4f&autoload=false&libraries=services"
        strategy="beforeInteractive"
      />
      <div className="relative w-full h-screen bg-white overflow-hidden lg:flex lg:flex-row">
        <div
          className={clsx(
            "hidden lg:flex flex-col h-full bg-white border-r border-[#f2f4f6] z-20 transition-all duration-300 ease-in-out relative",
            isSidePanelOpen
              ? clsx("w-[400px]", !isSecondaryPanelOpen && "lg:shadow-2xl")
              : "w-0 border-none",
          )}
        >
          <div
            className={clsx(
              "flex flex-col h-full p-6 w-[400px] transition-opacity duration-200",
              isSidePanelOpen ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          >
            {selectedPlace ? (
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
              <>
                <h2 className="text-[22px] font-bold text-[#111111] mb-6 tracking-[-0.5px]">
                  장소 검색
                </h2>

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

          <button
            onClick={() => {
              setIsSidePanelOpen(!isSidePanelOpen);
              setTimeout(() => {
                if (mapInstance.current) {
                  mapInstance.current.relayout();
                  if (selectedPlace) {
                    const moveLatLon = new window.kakao.maps.LatLng(
                      selectedPlace.latitude,
                      selectedPlace.longitude,
                    );
                    mapInstance.current.setCenter(moveLatLon);
                  }
                }
              }, 300);
            }}
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

        <div
          className={clsx(
            "hidden lg:flex flex-col h-full bg-white border-r border-[#f2f4f6] z-10 transition-all duration-300 ease-in-out relative",
            isSecondaryPanelOpen && selectedPlace
              ? "w-[400px] lg:shadow-2xl"
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

            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="relative w-full h-[300px] bg-gray-100">
                {/* [MOD] 전용 레퍼런스 detailMapRef 사용 */}
                <div
                  ref={detailMapRef}
                  className="absolute inset-0 w-full h-full"
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

                  <div className="h-[1px] bg-[#f2f4f6]" />

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

        <div className="relative flex-1 h-full overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <div ref={mapRef} className="absolute inset-0 w-full h-full" />
          </div>

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

        <Toast
          isVisible={isToastVisible}
          onClose={() => setIsToastVisible(false)}
          message="찜한 장소로 등록되었어요"
          actionText="목록보기"
          onAction={() => router.push("/profile")}
          position={isSecondaryPanelOpen || selectedPlace ? "top" : "bottom"}
        />

        <BottomNavigation />
      </div>
    </MobileContainer>
  );
}
