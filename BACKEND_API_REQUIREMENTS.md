# 백엔드 API 요구사항 명세서

현재 프론트엔드 구현을 바탕으로 필요한 백엔드 API 명세입니다.

## 1. 인증 (Auth)

사용자 회원가입 및 로그인, 사용자 정보 관리를 위한 API입니다.

| 기능             | Method | Endpoint           | 요청 (Body/Query)                     | 응답 (Response)                             | 비고                  |
| :--------------- | :----- | :----------------- | :------------------------------------ | :------------------------------------------ | :-------------------- |
| **회원가입**     | POST   | `/api/auth/signup` | `userId`, `name`, `password`, `email` | `token` (JWT), `user` 정보                  | `SignupPage` 참조     |
| **로그인**       | POST   | `/api/auth/login`  | `userId`, `password`                  | `token` (JWT), `user` 정보                  | 소셜 로그인 확장 고려 |
| **로그아웃**     | POST   | `/api/auth/logout` | -                                     | 성공 여부                                   |                       |
| **내 정보 조회** | GET    | `/api/users/me`    | -                                     | `id`, `name`, `profileImage`, `reviewCount` | `MyPage` 참조         |

---

## 2. 홈 (Home)

메인 화면 구성을 위한 데이터 API입니다.

| 기능                 | Method | Endpoint                           | 요청 (Body/Query)  | 응답 (Response)                                                                   | 비고                        |
| :------------------- | :----- | :--------------------------------- | :----------------- | :-------------------------------------------------------------------------------- | :-------------------------- |
| **메인 여행 카드**   | GET    | `/api/trips/main`                  | -                  | `id`, `title`, `period` (start~end), `companions`, `tags`, `budget` (total/spent) | 가장 최근/진행중인 여행 1개 |
| **인기 여행 코스**   | GET    | `/api/recommendations/courses`     | `limit` (optional) | `[{ id, title, image, description }]`                                             | Top 10 등                   |
| **인기 맛집 리스트** | GET    | `/api/recommendations/restaurants` | `limit` (optional) | `[{ id, name, image, description }]`                                              |                             |

---

## 3. 여행 생성 (Onboarding/Trip Generation)

AI 기반 여행 일정 생성을 위한 API입니다.

| 기능                 | Method | Endpoint              | 요청 (Body/Query)                                                                             | 응답 (Response)                      | 비고              |
| :------------------- | :----- | :-------------------- | :-------------------------------------------------------------------------------------------- | :----------------------------------- | :---------------- |
| **여행 생성 요청**   | POST   | `/api/trips/generate` | `location`, `dates` (start, end), `companions`, `style`, `transport`, `budget`, `peopleCount` | `tripId`, `generatedSchedule` (초안) | AI 생성 로직 연동 |
| **생성된 일정 저장** | POST   | `/api/trips`          | `generatedSchedule` 데이터 전체                                                               | `tripId`                             | 생성 결과 확정 시 |

---

## 4. 여행 메인/상세 (Trips)

여행 목록 및 상세 정보를 위한 핵심 API입니다.

### 4.1 여행 목록

| 기능             | Method | Endpoint     | 요청 (Body/Query)        | 응답 (Response)                                      | 비고                 |
| :--------------- | :----- | :----------- | :----------------------- | :--------------------------------------------------- | :------------------- |
| **내 여행 목록** | GET    | `/api/trips` | `status` (upcoming/past) | `[{ id, title, period, location, thumbnail, tags }]` | `TripsListPage` 참조 |

### 4.2 여행 상세 (기본 및 일정)

| 기능               | Method | Endpoint                       | 요청 (Body/Query)  | 응답 (Response)                                                       | 비고                     |
| :----------------- | :----- | :----------------------------- | :----------------- | :-------------------------------------------------------------------- | :----------------------- |
| **여행 상세 정보** | GET    | `/api/trips/{tripId}`          | -                  | `title`, `period`, `companions`, `budget(summary)`                    | `TripDetailPage` 헤더 등 |
| **일정 조회**      | GET    | `/api/trips/{tripId}/schedule` | -                  | `days: [{ day, places: [{ name, time, activity, mapCoordinates }] }]` |                          |
| **일정 수정**      | PUT    | `/api/trips/{tripId}/schedule` | 수정된 일정 데이터 | 성공 여부                                                             | 순서 변경, 삭제 등       |

### 4.3 예산 (Budget)

| 기능               | Method | Endpoint                       | 요청 (Body/Query)                                   | 응답 (Response)                                                                      | 비고                |
| :----------------- | :----- | :----------------------------- | :-------------------------------------------------- | :----------------------------------------------------------------------------------- | :------------------ |
| **예산 상세 조회** | GET    | `/api/trips/{tripId}/budget`   | -                                                   | `totalBudget`, `spentAmount`, `breakdown: [{ category, amount, percentage, color }]` | 도넛 차트 및 리스트 |
| **지출 내역 추가** | POST   | `/api/trips/{tripId}/expenses` | `category`, `amount`, `description`, `receiptImage` | `expenseId`                                                                          | 영수증 등록 연동    |

### 4.4 준비물 (Checklist)

| 기능                 | Method | Endpoint                                 | 요청 (Body/Query) | 응답 (Response)             | 비고 |
| :------------------- | :----- | :--------------------------------------- | :---------------- | :-------------------------- | :--- |
| **준비물 목록**      | GET    | `/api/trips/{tripId}/checklist`          | -                 | `[{ id, name, isChecked }]` |      |
| **준비물 추가**      | POST   | `/api/trips/{tripId}/checklist`          | `name`            | `checklistItem`             |      |
| **준비물 상태 변경** | PATCH  | `/api/trips/{tripId}/checklist/{itemId}` | `isChecked`       | 성공 여부                   |      |

### 4.5 기록 (Records/Photos)

| 기능               | Method | Endpoint                      | 요청 (Body/Query)                             | 응답 (Response)                                              | 비고                |
| :----------------- | :----- | :---------------------------- | :-------------------------------------------- | :----------------------------------------------------------- | :------------------ |
| **기록 목록 조회** | GET    | `/api/trips/{tripId}/records` | -                                             | `[{ id, placeName, photos: [{ src, likes }], description }]` | 사진 및 리뷰 데이터 |
| **사진 업로드**    | POST   | `/api/trips/{tripId}/records` | `image` (Multipart), `placeId`, `description` | `recordId`                                                   | 상세에서 사진 등록  |

---

## 5. 검색 및 장소 (Search & Place)

| 기능          | Method | Endpoint                | 요청 (Body/Query)     | 응답 (Response)                                       | 비고              |
| :------------ | :----- | :---------------------- | :-------------------- | :---------------------------------------------------- | :---------------- |
| **장소 검색** | GET    | `/api/places/search`    | `keyword`, `category` | `[{ id, name, address, category, thumbnail }]`        | `SearchPage` 참조 |
| **장소 상세** | GET    | `/api/places/{placeId}` | -                     | `name`, `address`, `description`, `reviews`, `images` |                   |

---

## 6. 마이페이지 (Profile)

| 기능                 | Method | Endpoint                         | 요청 (Body/Query)      | 응답 (Response)                     | 비고 |
| :------------------- | :----- | :------------------------------- | :--------------------- | :---------------------------------- | :--- |
| **찜한 장소 목록**   | GET    | `/api/users/me/bookmarks/places` | -                      | `[{ id, name, category, address }]` |      |
| **찜한 사진 목록**   | GET    | `/api/users/me/bookmarks/photos` | -                      | `[{ id, src, tripId }]`             |      |
| **사용자 정보 수정** | PUT    | `/api/users/me`                  | `name`, `profileImage` | 성공 여부                           |      |

---

## 참고 사항

- 모든 API 응답은 일관된 JSON 포맷(예: `{ success: boolean, data: any, error: object }`)을 사용하는 것이 좋습니다.
- 인증이 필요한 API는 헤더에 `Authorization: Bearer {token}`을 포함해야 합니다.
- 날짜 형식은 ISO 8601 (`YYYY-MM-DD` 또는 `YYYY-MM-DDTHH:mm:ss`)을 권장합니다.
