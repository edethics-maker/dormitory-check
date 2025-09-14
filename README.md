# 🏠 기숙사 출석체크 시스템

QR코드 기반 기숙사 출석 관리 웹 애플리케이션

## 📋 주요 기능

- **학생 등록 및 QR코드 생성**: 학번, 이름, 기숙사, 호실 정보로 학생 등록 후 개인별 QR코드 자동 생성
- **실시간 QR코드 스캔**: 카메라를 통한 QR코드 스캔으로 즉시 출석 처리
- **중복 출석 방지**: 하루에 한 번만 출석 가능
- **출석 통계 및 관리**: 실시간 출석률, 날짜별 기록, CSV 내보내기
- **반응형 디자인**: 모바일과 데스크톱 모두 지원

## 🚀 설치 및 실행

### 1. 사전 요구사항
- [Node.js](https://nodejs.org/) (v14 이상 권장)
- 웹 브라우저 (Chrome, Firefox, Safari, Edge 등)

### 2. 설치
```bash
# 의존성 패키지 설치
npm install
```

### 3. 실행 방법

#### 방법 1: npm 명령어 사용
```bash
# 서버 시작
npm start

# 개발 모드 (자동 재시작)
npm run dev
```

#### 방법 2: 실행 스크립트 사용
**Windows:**
```bash
start.bat
```

**Linux/macOS:**
```bash
./start.sh
```

### 4. 접속
- 로컬: http://localhost:3000
- 네트워크: http://[컴퓨터IP]:3000

## 💻 사용법

### 1. 학생 등록
1. "학생 등록" 탭 클릭
2. 학번, 이름, 기숙사, 호실 입력
3. "학생 등록 & QR코드 생성" 버튼 클릭
4. 생성된 QR코드 확인 및 다운로드 가능

### 2. 출석 체크
1. "출석 스캔" 탭 클릭
2. "카메라 시작" 버튼 클릭
3. 학생이 개인 QR코드를 카메라에 스캔
4. 출석 완료 메시지 확인

### 3. 출석 관리
1. "출석 관리" 탭 클릭
2. 실시간 통계 확인 (총 학생 수, 오늘 출석자, 출석률)
3. 출석 기록 히스토리 확인
4. "데이터 내보내기" 버튼으로 CSV 파일 다운로드

## 📁 프로젝트 구조
```
dormitory-attendance-system/
├── server.js              # Express 서버
├── package.json           # npm 패키지 설정
├── start.bat              # Windows 실행 스크립트
├── start.sh               # Linux/macOS 실행 스크립트
├── README.md              # 프로젝트 설명서
└── public/                # 웹 파일들
    ├── dormitory_attendance.html  # 메인 HTML
    ├── style.css                  # CSS 스타일
    └── script.js                  # JavaScript 기능
```

## 🔧 기술 스택

**Backend:**
- Node.js
- Express.js

**Frontend:**
- HTML5
- CSS3 (Flexbox, Grid, 반응형)
- Vanilla JavaScript

**라이브러리:**
- QRious (QR코드 생성)
- Html5-QRCode (QR코드 스캔)

## 💾 데이터 저장

- 모든 데이터는 브라우저의 **localStorage**에 저장됩니다
- 서버 재시작 시에도 데이터가 유지됩니다
- 브라우저 데이터 삭제 시 모든 기록이 사라집니다

## 📱 브라우저 호환성

- Chrome (권장)
- Firefox
- Safari
- Edge
- 모바일 브라우저 지원

## 🔒 보안 기능

- 학생별 고유 QR코드 생성
- 중복 출석 방지
- 타임스탬프 기록

## 🛠️ 문제 해결

### 카메라 접근 권한 오류
- 브라우저에서 카메라 권한을 허용해주세요
- HTTPS 환경에서만 카메라 접근이 가능합니다 (localhost는 예외)

### QR코드 인식 안됨
- 조명이 충분한 환경에서 사용하세요
- QR코드와 카메라 사이 적절한 거리 유지
- QR코드가 깨끗하고 선명한지 확인하세요

## 📄 라이선스

MIT License

## 👨‍💻 개발자

Claude Code Assistant