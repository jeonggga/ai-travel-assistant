"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MobileContainer } from "../../../components/layout/MobileContainer";
import { searchPlaces } from "../../../services/place";

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

export default function SearchInputPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

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

  // [ADD] 검색 API 호출 로직 (디바운스 적용)
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
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <MobileContainer>
      <div className="w-full h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 px-6 pt-4 pb-4 flex items-center justify-between bg-white z-10 max-w-[430px] mx-auto">
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
            <h1 className="text-[18px] font-semibold text-[#111111] tracking-[-0.5px]">
              장소 검색
            </h1>
          </div>
        </div>

        {/* Search Input Section */}
        <div className="px-5 py-4 mt-[60px]">
          <div className="flex items-center gap-3 bg-[#f5f7f9] h-14 px-4 rounded-xl border border-[#f2f4f6] transition-colors focus-within:bg-white focus-within:ring-2 focus-within:ring-[#7a28fa]/20 focus-within:border-[#7a28fa]">
            <Image
              src="/icons/search.svg"
              alt="search"
              width={20}
              height={20}
              className="opacity-50"
            />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="어디로 가고 싶으신가요?"
              className="flex-1 bg-transparent text-[16px] font-medium text-[#111111] placeholder:text-[#abb1b9] outline-none"
            />
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto px-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center pt-20 text-[#abb1b9]">
              <p className="text-[15px] font-medium animate-pulse">
                검색 중...
              </p>
            </div>
          ) : searchQuery.trim() && searchResults.length > 0 ? (
            <div className="flex flex-col gap-5 pt-2">
              {searchResults.map((place) => (
                <div
                  key={place.id}
                  onClick={() => {
                    // [MOD] 로컬 스토리지에 결과 데이터 임시 저장 (상세 페이지에서 사용 가능하도록)
                    localStorage.setItem(
                      `place_${place.id}`,
                      JSON.stringify(place),
                    );
                    router.push(`/search/place/${place.id}`);
                  }}
                  className="flex flex-col gap-1 cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-1 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-[16px] font-semibold text-[#111111]">
                      <HighlightText text={place.name} keyword={searchQuery} />
                    </h3>
                    <span className="text-[12px] font-medium text-[#7a28fa] bg-[#f9f5ff] px-2 py-0.5 rounded">
                      {place.category}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 mt-0.5">
                    <p className="text-[13px] text-[#898989] line-clamp-1">
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
          ) : searchQuery.trim() ? (
            <div className="flex flex-col items-center justify-center pt-20 text-[#abb1b9]">
              <p className="text-[15px] font-medium">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 pt-4">
              <h2 className="text-[15px] font-bold text-[#111111]">
                최근 검색어
              </h2>
              <div className="flex flex-col gap-4">
                <p className="text-[14px] text-[#abb1b9]">
                  최근 검색어가 없습니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MobileContainer>
  );
}
