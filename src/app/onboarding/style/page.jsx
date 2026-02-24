"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { StepLayout } from "../../../components/common/StepLayout";
import { SelectChipGroup } from "../../../components/common/SelectChip";
import { BottomCTAButton } from "../../../components/common/Button";
import { useOnboardingStore } from "../../../store/useOnboardingStore";

const CATEGORIES = {
  ACTIVITY: [
    { label: "체험/액티비티", value: "activity" },
    { label: "핫플레이스", value: "hotplace" },
    { label: "문화/역사", value: "culture" },
    { label: "유명 관광지", value: "landmark" },
  ],
  HEALING: [
    { label: "자연경관", value: "nature" },
    { label: "휴양/힐링", value: "healing" },
    { label: "등산", value: "hiking" },
  ],
  FOOD: [
    { label: "맛집", value: "restaurant" },
    { label: "카페", value: "cafe" },
    { label: "시장", value: "market" },
    { label: "야시장/노점", value: "nightmarket" },
  ],
  OTHER: [
    { label: "쇼핑", value: "shopping" },
    { label: "효도 관광", value: "parents" },
    { label: "기타 입력", value: "other" },
  ],
};

export default function TravelStylePage() {
  const router = useRouter();
  const { travelData, setTravelData } = useOnboardingStore();
  const [styles, setStyles] = useState(travelData.styles || []);

  const handleNext = () => {
    setTravelData({ styles });
    if (travelData.creationType === "manual") {
      // 1~4번 단계 완료 시 상세 일정 뷰 페이지로 이동
      router.push("/trips");
    } else {
      router.push("/onboarding/budget");
    }
  };

  const handleChange = (newStyles) => {
    setStyles(newStyles);
  };

  return (
    <StepLayout
      title="어떤 여행을 선호하시나요?"
      onBack={() => {
        if (travelData.creationType === "manual") {
          router.push("/onboarding/companion");
        } else {
          router.push("/onboarding/transport");
        }
      }}
      footer={
        <BottomCTAButton onClick={handleNext} disabled={styles.length === 0}>
          다음
        </BottomCTAButton>
      }
    >
      <div className="mb-6">
        <h3 className="text-base text-text-dim mb-3 font-semibold">
          활동/관광
        </h3>
        <SelectChipGroup
          options={CATEGORIES.ACTIVITY}
          selected={styles}
          onChange={handleChange}
          multi={true}
        />
      </div>

      <div className="mb-6">
        <h3 className="text-base text-text-dim mb-3 font-semibold">
          힐링/자연
        </h3>
        <SelectChipGroup
          options={CATEGORIES.HEALING}
          selected={styles}
          onChange={handleChange}
          multi={true}
        />
      </div>

      <div className="mb-6">
        <h3 className="text-base text-text-dim mb-3 font-semibold">
          음식/음료
        </h3>
        <SelectChipGroup
          options={CATEGORIES.FOOD}
          selected={styles}
          onChange={handleChange}
          multi={true}
        />
      </div>

      <div className="mb-6">
        <h3 className="text-base text-text-dim mb-3 font-semibold">
          기타 테마
        </h3>
        <SelectChipGroup
          options={CATEGORIES.OTHER}
          selected={styles}
          onChange={handleChange}
          multi={true}
        />
      </div>
    </StepLayout>
  );
}
