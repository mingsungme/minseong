# 김민성 포트폴리오 (KIM MINSEONG Portfolio)

2026 05 15

프로덕트 디자이너 김민성의 개인 포트폴리오 웹사이트입니다. 사용자 중심의 기획과 데이터 기반 의사결정으로 비즈니스 가치를 창출한 프로젝트들을 소개합니다.

원본 Figma 디자인: https://www.figma.com/design/27bTYlWljvuG2SCHSSmt7X/minseong-portfolio

## 주요 기능

- **홈 페이지**: 히어로 섹션, 주요 프로젝트 갤러리, 성과 지표 카드
- **PM 포트폴리오 페이지**: Firebase Firestore 기반 프로젝트 목록 (그리드/리스트 뷰, 카테고리 필터)
- **관리자 기능**: Firebase Auth 인증 후 프로젝트 추가/수정/삭제 (어드민 계정 전용)
- **반응형 UI**: Tailwind CSS + shadcn/ui 컴포넌트

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 18, Vite 6 |
| 라우팅 | React Router 7 |
| 스타일링 | Tailwind CSS 4, shadcn/ui (Radix UI), MUI |
| 백엔드/DB | Firebase Auth, Firebase Firestore |
| 애니메이션 | Motion (Framer Motion) |
| 패키지 매니저 | pnpm |

## 페이지 구조

```
/               → 홈 (히어로 + 주요 프로젝트 + 성과)
/pm-portfolio   → PM 포트폴리오 (전체 프로젝트 목록)
/login          → 관리자 로그인
```

## 프로젝트 카테고리

`Product Strategy` / `Service Planning` / `Data Analysis` / `Growth` / `UX Research`

## 로컬 실행 방법

```bash
# 의존성 설치
npm i
# 또는 pnpm 사용 시
pnpm install

# 개발 서버 실행
npm run dev
# 또는
pnpm dev
```

## 빌드

```bash
npm run build
```

## 환경 설정

Firebase 설정은 [`src/app/firebase.ts`](src/app/firebase.ts)에서 관리됩니다. Firebase 프로젝트 ID: `portfolio-kms`
