"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { clsx } from "clsx";

export const BottomNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const NAV_ITEMS = [
    {
      label: "홈",
      path: "/home",
      icon: "/icons/home-active.svg",
      width: 20,
      height: 20,
    },
    {
      label: "일정",
      path: "/trips",
      icon: "/icons/calendar.svg",
      width: 20,
      height: 20,
    },
    {
      label: "장소 검색",
      path: "/search",
      icon: "/icons/location.svg",
      width: 22,
      height: 22,
    },
    {
      label: "마이페이지",
      path: "/profile",
      icon: "/icons/user.svg",
      width: 16,
      height: 16,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#f2f4f6] z-50 lg:hidden">
      <div className="flex items-start justify-around px-5 pt-2 pb-2 max-w-[480px] mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;

          return (
            <button
              key={item.path}
              className="flex flex-col items-center gap-0.5"
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
              <span
                className={clsx(
                  "text-[11px] font-medium tracking-[-0.28px] transition-colors",
                  {
                    "text-[#111111]": isActive,
                    "text-[#abb1b9]": !isActive,
                  },
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
