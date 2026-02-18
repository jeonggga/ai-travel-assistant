"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { clsx } from "clsx";

export const SideNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const NAV_ITEMS = [
    {
      label: "홈",
      path: "/home",
      icon: "/icons/home-active.svg",
      width: 24,
      height: 24,
    },
    {
      label: "일정",
      path: "/trips",
      icon: "/icons/calendar.svg",
      width: 24,
      height: 24,
    },
    {
      label: "장소 검색",
      path: "/search",
      icon: "/icons/location.svg",
      width: 26,
      height: 26,
    },
    {
      label: "마이페이지",
      path: "/profile",
      icon: "/icons/user.svg",
      width: 20,
      height: 20,
    },
  ];

  return (
    <div className="hidden lg:flex flex-col w-[280px] h-screen bg-white border-r border-[#f2f4f6] sticky top-0 left-0 p-8 z-50">
      <div
        className="mb-12 cursor-pointer"
        onClick={() => router.push("/home")}
      >
        <h1 className="text-[24px] font-black tracking-[-1px] text-[#111111]">
          가보자<span className="text-[#7a28fa]">GO</span>
        </h1>
      </div>

      <nav className="flex flex-col gap-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;

          return (
            <button
              key={item.path}
              className={clsx(
                "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all",
                isActive
                  ? "bg-[#f8f6ff] text-[#7a28fa]"
                  : "bg-transparent text-[#556574] hover:bg-[#f5f7f9]",
              )}
              onClick={() => router.push(item.path)}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={item.width}
                height={item.height}
                className={clsx("transition-all", {
                  "grayscale-0 opacity-100": isActive,
                  "grayscale opacity-40": !isActive,
                })}
              />
              <span className="text-[17px] font-bold tracking-[-0.4px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-8 border-t border-[#f2f4f6]">
        <div className="flex items-center gap-3 px-4 py-2 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-[#eaeef4] overflow-hidden">
            <Image
              src="/icons/profile.svg"
              alt="profile"
              width={40}
              height={40}
              className="w-full h-full object-cover p-2 opacity-50"
            />
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#111]">김여행</p>
            <p className="text-[12px] text-[#abb1b9]">여행 전문가</p>
          </div>
        </div>
      </div>
    </div>
  );
};
