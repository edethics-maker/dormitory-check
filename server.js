const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서빙 (CSS, JS, HTML)
app.use(express.static(path.join(__dirname, 'public')));

// 루트 경로에서 메인 HTML 파일 서빙
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dormitory_attendance.html'));
});

// 건강 체크 엔드포인트
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 404 처리
app.use((req, res) => {
    res.status(404).json({
        error: 'Page not found',
        message: '요청하신 페이지를 찾을 수 없습니다.',
        path: req.path
    });
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    console.error('서버 오류:', err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: '서버에서 오류가 발생했습니다.'
    });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`
🏠 기숙사 출석체크 시스템이 시작되었습니다!

📍 서버 주소: http://localhost:${PORT}
🌐 네트워크 접속: http://[컴퓨터IP]:${PORT}

✅ 브라우저에서 위 주소로 접속하세요.
⏹️  서버 중지: Ctrl+C
    `);
});

// 우아한 종료 처리
process.on('SIGINT', () => {
    console.log('\n서버를 종료합니다...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n서버를 종료합니다...');
    process.exit(0);
});