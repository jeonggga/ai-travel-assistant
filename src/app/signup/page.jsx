"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MobileContainer } from "../../components/layout/MobileContainer";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { TextInput } from "../../components/common/TextInput"; // Added import
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const setUser = useOnboardingStore((state) => state.setUser);

  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    setTimeout(() => {
      const user = {
        id: userId,
        name: name,
        email: userId,
      };
      setUser(user);
      router.back();
    }, 1000);
  };

  return (
    <MobileContainer className="mx-auto">
      <div className="p-6 flex flex-col h-full w-full bg-[#ffffff] text-[#111111]">
        {/* Header - Keeping existing Image button logic but adapting wrapper */}
        <div className="flex items-center gap-4 pt-0 pb-6">
          <button onClick={() => router.back()} className="flex-shrink-0">
            <Image
              src="/icons/close-icon.svg"
              alt="Close"
              width={16}
              height={16}
              className="w-4 h-4"
            />
          </button>
          <h1 className="text-[18px] font-semibold tracking-[-0.5px] text-[#111111]">
            회원가입
          </h1>
        </div>

        <div className="flex-1 flex flex-col pt-0">
          {/* Form - Layout adapted from Login page */}
          <form onSubmit={handleSignup} className="flex flex-col gap-6 w-full">
            <TextInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름 입력"
              type="text"
            />
            <TextInput
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="아이디 입력"
              type="text"
            />
            <TextInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              type="password"
            />
            <TextInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호 입력 확인"
              type="password"
            />

            {/* Submit Button - Keeping original button style but inside the form flow */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={!name || !userId || !password || !confirmPassword}
                className="w-full py-[18px] bg-[#111111] text-white text-[16px] font-semibold tracking-[-0.06px] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                회원가입
              </button>
            </div>
          </form>

          {/* Bottom Text - Keeping original */}
          <div className="flex justify-center items-center mt-auto pb-8 pt-12">
            <span className="text-[14px] font-medium tracking-[-0.35px] text-[#c7c8d8]">
              계정이 이미 있나요?{" "}
              <button
                type="button"
                onClick={() => router.push("/intro")}
                className="underline"
              >
                로그인
              </button>
            </span>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
}
