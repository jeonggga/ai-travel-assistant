"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { MobileContainer } from "../../components/layout/MobileContainer";

function IntroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, saveTrip } = useOnboardingStore();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const showClose = searchParams.get("showClose") === "true";

  const handleLogin = (e) => {
    if (e) e.preventDefault();

    // Mock login logic from former login/page.jsx
    if (!userId || !password) return;

    setTimeout(() => {
      const user = {
        id: "user_123",
        name: "김여행",
        email: userId,
      };
      setUser(user);

      const from = searchParams.get("from");
      if (from === "result_save") {
        saveTrip();
        alert("로그인되었습니다. 여행 일정이 저장되었습니다.");
        router.push("/home");
      } else {
        router.push("/home"); // Default behavior after login
      }
    }, 500);
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  const handleCreateItinerary = () => {
    router.push("/onboarding/location");
  };

  const handleBrowse = () => {
    router.push("/home"); // Usually browse or home
  };

  return (
    <MobileContainer className="mx-auto">
      <div className="relative flex flex-1 flex-col overflow-hidden bg-white">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#f8f6ff] to-transparent pointer-events-none" />
        <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-[#7a28fa] opacity-[0.03] blur-[80px] rounded-full pointer-events-none" />

        {showClose && (
          <button
            onClick={() => router.back()}
            className="absolute top-6 left-6 z-[60] p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Image
              src="/icons/close-icon.svg"
              alt="close"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </button>
        )}

        <div className="relative flex flex-1 flex-col z-10">
          {/* Top Section */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 pt-12 pb-8">
            {/* Logo Section */}
            <div className="flex flex-col items-center gap-2 mb-12">
              <h1 className="text-[40px] font-extrabold tracking-[-1.5px] leading-tight text-[#111111]">
                가보자<span className="text-[#7a28fa] font-black">GO</span>
              </h1>
              <p className="text-[15px] font-medium text-[#7e7e7e] tracking-[-0.3px]">
                일정 생성부터 준비물까지, 당신만의 AI 가이드
              </p>
            </div>

            {/* Login Form Section */}
            <div className="w-full flex flex-col gap-6 mb-8">
              <div className="flex flex-col gap-3">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="아이디"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full h-[60px] bg-[#f5f5f7] border-2 border-transparent focus:border-[#7a28fa]/20 focus:bg-white rounded-2xl px-5 text-[15px] font-medium transition-all outline-none"
                  />
                </div>
                <div className="relative group">
                  <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-[60px] bg-[#f5f5f7] border-2 border-transparent focus:border-[#7a28fa]/20 focus:bg-white rounded-2xl px-5 text-[15px] font-medium transition-all outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleLogin}
                disabled={!userId || !password}
                className="w-full h-[56px] bg-[#111111] text-white rounded-2xl text-[16px] font-bold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-black/10"
              >
                로그인
              </button>

              <div className="flex justify-center">
                <button
                  onClick={handleSignup}
                  className="text-[14px] font-semibold text-[#c7c8d8] hover:text-[#7a28fa] transition-colors"
                >
                  아직 회원이 아니신가요?{" "}
                  <span className="underline decoration-[#c7c8d8] underline-offset-4">
                    회원가입
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Action Section */}
          <div className="px-8 pb-12 pt-6 bg-white shrink-0">
            <div className="flex flex-col gap-3">
              <button
                onClick={handleCreateItinerary}
                className="w-full h-[60px] bg-[#7a28fa] text-white rounded-2xl text-[16px] font-bold flex items-center justify-center shadow-xl shadow-[#7a28fa]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                AI 여행 일정 생성하기
              </button>
              <button
                onClick={handleBrowse}
                className="w-full h-[60px] bg-white border-2 border-[#f2f4f6] text-[#111111] rounded-2xl text-[16px] font-bold flex items-center justify-center hover:bg-[#f2f4f6] transition-all"
              >
                둘러보기
              </button>
            </div>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
}

export default function IntroPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-white text-[#111111] font-semibold text-lg z-[9999]">
          잠시만 기다려 주세요...
        </div>
      }
    >
      <IntroContent />
    </Suspense>
  );
}
