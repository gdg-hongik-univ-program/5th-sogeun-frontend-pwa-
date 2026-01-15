# 5th-sogeun-frontend-pwa-

2025-2 플젝트랙 5기 소근 - 프론트엔드 pwa로

## 🚀 시작 가이드 (Quick Start)

이 프로젝트는 **Vite** 환경입니다. 터미널에서 아래 명령어들을 사용하세요.

```bash
# 1. 패키지 설치 (처음 받거나 package.json 변경 시)
npm install

# 2. 개발 모드 실행 (평소 코딩할 때)
npm run dev

# 3. 배포 미리보기 (빌드 후 PWA/배포 확인)
npm run build
npm run preview
```

## 📂 폴더 구조

```bash
📦 src
 ┣ 📂 assets      # 이미지, 폰트 등 정적 파일 저장소
 ┣ 📂 components  # 버튼, 카드 등 재사용 가능한 UI 컴포넌트
 ┣ 📂 hooks       # 커스텀 훅 관리
 ┣ 📂 pages       # 실제 페이지 단위 컴포넌트 (GPS,Profile 등)
 ┣ 📂 store       # Jotai 전역 상태 관리 파일 (atoms)
 ┣ 📂 types       # TypeScript 타입 정의 파일
 ┣ 📜 App.tsx     # 메인 앱 컴포넌트 및 라우팅 제어
 ┣ 📜 index.css   # 전역 스타일 시트
 ┗ 📜 main.tsx    # 앱 진입점
```

## 깃허브 순서

우리는 작업을 시작하기 전, **반드시 이슈(Issue)를 먼저 생성**합니다. (선 이슈, 후 코딩)

"코드 짜기 전에 무조건 이슈 탭 가서 'New Issue' 먼저 누르는 게 시작이에요!
템플릿 다 만들어놨으니까 빈칸 채우기만 하시면 됩니다. 내 할 일(티켓) 내가 끊고 시작한다고 생각해주세요!"

**-> "이슈 생성 -> 브랜치 생성 -> 작업 -> PR" 흐름**

## 🌳 Git 브랜치 전략 (Branch Strategy)

저희 프로젝트는 **Github Flow**를 기반으로 운영합니다. `main` 브랜치는 항상 배포 가능한 상태를 유지해주세요!

### 1. 브랜치 이름 규칙

작업 성격에 따라 브랜치 이름 앞에 접두어(Prefix)를 붙여주세요.

- **`feat/기능이름`** : 새로운 기능 개발 (예: `feat/login-page`, `feat/map-view`)
- **`fix/버그이름`** : 버그 수정 (예: `fix/header-layout`, `fix/login-error`)
- **`refactor/기능이름`** : 코드 리팩토링 (예: `refactor/folder-structure`)
- **`docs/내용`** : 문서 수정 (예: `docs/readme-update`)

### 2. 커밋 메시지 규칙 (Commit Convention)

한눈에 알아볼 수 있게 `[태그] 내용` 형식으로 작성해주세요.

- `[Feat]` : 새로운 기능 추가
- `[Fix]` : 버그 수정
- `[Design]` : CSS 등 디자인 수정
- `[Refactor]` : 코드 구조 변경 (기능 변경 없음)
- `[Comment]` : 주석 추가/변경
- **예시:** `[Feat] 로그인 페이지 UI 구현`, `[Fix] 모달이 안 닫히는 버그 수정`

### 3. 작업 순서 (Work Flow)

1. `main` 브랜치에서 **새로운 브랜치**를 딴다. (`git checkout -b feat/my-feature`)
2. 열심히 작업하고 **커밋**한다. (`git commit -m "[Feat] ..."`)
3. 원격 저장소에 **푸시**한다. (`git push origin feat/my-feature`)
4. 깃허브에서 **Pull Request(PR)**를 날린다.
5. 팀원 확인(Review) 후 `main`에 **Merge** 한다.

### 4. 이슈 작성 규칙 (Issue Convention)

**🛠 활용 방법**

1. 깃허브 상단 **[Issues]** 탭 → **[New Issue]** 버튼 클릭.
2. 작업 성격에 맞는 **템플릿(Template)** 선택 (Get started 클릭).
   - ✨ **Feature Request**: 새로운 기능을 만들 때
   - 🐛 **Bug Report**: 버그를 발견했을 때
   - ❓ **Question**: 궁금한 게 있거나 논의가 필요할 때
3. 템플릿 양식에 맞춰 내용을 작성하고 **Submit**.
4. **Assignees(담당자)**에 본인을 태그해주세요. (누가 할 건지 표시)

**💡 꿀팁**

- 이슈를 만들면 **`#번호`**가 생성됩니다. (예: `#23`)
- 브랜치 만들 때나 커밋 메시지에 이 번호를 쓰면 나중에 추적하기 좋습니다!
  - 예: `feat/login-page-#23`
  - 예: `[Feat] 로그인 UI 구현 (close #23)`
