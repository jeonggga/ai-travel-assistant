"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MobileContainer } from "../../components/layout/MobileContainer";
import { BottomNavigation } from "../../components/layout/BottomNavigation";

export default function SearchPage() {
  const router = useRouter();

  return (
    <MobileContainer showNav={true}>
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
          </div>

          {/* Search Bar Overlay - Adjusted for Responsive */}
          <div className="absolute top-0 left-0 right-0 px-5 pt-6 pb-4 z-20 max-w-[600px] lg:left-1/2 lg:-translate-x-1/2 lg:w-full">
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
          </div>
        </div>

        {/* Bottom Navigation - Hidden on Desktop handled by CSS or BottomNav prop */}
        <BottomNavigation />
      </div>
    </MobileContainer>
  );
}
