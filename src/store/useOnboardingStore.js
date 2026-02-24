import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSchedule } from "../services/schedule";

export const useOnboardingStore = create(
  persist(
    (set, get) => ({
      travelData: {
        creationType: "ai", // "ai" | "manual"
        location: "",
        accommodation: "", // Optional
        accommodations: [], // Array of {name, startDate, endDate}
        startDate: null,
        endDate: null,
        companions: [], // mixed type
        peopleCount: 1,
        transport: "",
        styles: [],
        budget: 0,
      },
      generatedTripData: null,
      myTrips: [],
      user: null,
      setTravelData: (data) =>
        set((state) => ({
          travelData: { ...state.travelData, ...data },
        })),
      setGeneratedTripData: (data) => set({ generatedTripData: data }),
      setUser: (user) => set({ user }),
      saveTrip: async () => {
        const state = get();
        if (!state.generatedTripData) return {};

        // Helper map for companion labels (Should match CompanionSelection options)
        const COMPANION_MAP = {
          alone: "나홀로",
          couple: "연인과 함께",
          friends: "친구와 함께",
          family: "가족과 함께",
          parents: "부모님과 함께",
          etc: "기타",
        };

        let rawCompanion = state.travelData?.companions?.[0];
        if (typeof rawCompanion === "object" && rawCompanion !== null) {
          rawCompanion = rawCompanion.name || "나홀로";
        }
        const companionLabel =
          COMPANION_MAP[rawCompanion] || (typeof rawCompanion === "string" ? rawCompanion : "나홀로");

        // 백엔드 명세에 맞춘 데이터 매핑
        const { travelData, user } = state;
        const budget = travelData.budget || {};

        // 예산 총합 계산
        const calculateTotalBudget = (budgetObj) => {
          let total = 0;
          if (budgetObj) {
            total += parseInt(budgetObj.accommodation?.amount || 0);
            total += parseInt(budgetObj.food?.amount || 0);
            total += parseInt(budgetObj.transport?.amount || 0);
            total += parseInt(budgetObj.etc?.amount || 0);
          }
          return total || 1000000;
        };

        // 날짜 포맷 (YYYY-MM-DD 변환 등 방어 로직)
        const formatDate = (dateStr) => {
          if (!dateStr) return new Date().toISOString().split("T")[0];
          if (typeof dateStr === "string") return dateStr.split("T")[0];
          if (typeof dateStr.toISOString === "function") return dateStr.toISOString().split("T")[0];
          // 알 수 없는 타입 방어
          return new Date().toISOString().split("T")[0];
        };

        const payload = {
          // iPK: 0 (제외하거나 0으로 세팅)
          iUserFK: user?.id || 1, // Store의 유저 정보
          dtDate1: formatDate(travelData.startDate),
          dtDate2: formatDate(travelData.endDate),
          strWhere: travelData.location || "제주도",
          strWithWho: companionLabel,
          strTransport: travelData.transport || "대중교통",
          nTotalPeople: travelData.peopleCount || 1,
          nTotalBudget: calculateTotalBudget(budget),
          nAlarmRatio: budget.alertThreshold || 25, // 경고 알림 설정치 혹은 임의
          nTransportRatio: budget.transport?.ratio || 25,
          nLodgingRatio: budget.accommodation?.ratio || 25,
          nFoodRatio: budget.food?.ratio || 25,
          chStatus: "P",
          dtCreate: new Date().toISOString().replace("T", " ").substring(0, 19),
        };

        try {
          // 1) 백엔드 /schedule/create 통신
          const createdRes = await createSchedule(payload);

          // 2) 성공 시 Store에 저장 (Trips 페이지에서 렌더링 할 데이터)
          // (백엔드에서 오는 값과 프론트엔드 목업이 섞이므로 UI에서 문제 없도록 조정)
          const newTrip = {
            ...state.generatedTripData,
            id: createdRes?.iPK || Date.now(), // DB가 내려주는 PK, 혹은 fallback
            title: createdRes?.strWhere ? `${createdRes?.strWhere} 여행` : "여행 일정",
            createdAt: new Date(),
            tags: ["🌿 자연", "☕️ 카페"], // Mock tags
            totalBudget: payload.nTotalBudget,
            usedBudget: 0,
            imageUrl: "",
            companion: companionLabel,
            startDate: payload.dtDate1,
            endDate: payload.dtDate2,
          };

          set((s) => ({
            myTrips: [...s.myTrips, newTrip],
            generatedTripData: null,
          }));
          return newTrip;

        } catch (error) {
          console.error("[saveTrip Error] 일정 저장 실패", error);
          throw error; // UI 등에서 예외 처리 가능하게 넘김
        }
      },
      resetTravelData: () =>
        set({
          travelData: {
            creationType: "ai",
            location: "",
            accommodation: "",
            accommodations: [],
            startDate: null,
            endDate: null,
            companions: [],
            peopleCount: 1,
            transport: "",
            styles: [],
            budget: 0,
          },
          generatedTripData: null,
        }),
    }),
    {
      name: "gabojago-travel-storage-v2",
    },
  ),
);
