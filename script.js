// 전역 변수
let students = JSON.parse(localStorage.getItem('students') || '[]');
let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
let html5QrCode = null;
let isScanning = false;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    displayStudents();
    updateStats();
    displayTodayAttendance();
    displayAttendanceHistory();
});

// 탭 전환 함수
function openTab(evt, tabName) {
    var i, tabcontent, tabbuttons;

    // 모든 탭 콘텐츠 숨기기
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }

    // 모든 탭 버튼에서 active 클래스 제거
    tabbuttons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabbuttons.length; i++) {
        tabbuttons[i].classList.remove("active");
    }

    // 선택된 탭 표시 및 버튼 활성화
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// 학생 등록 폼 처리
document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const studentId = document.getElementById('studentId').value;
    const studentName = document.getElementById('studentName').value;
    const dormitory = document.getElementById('dormitory').value;
    const room = document.getElementById('room').value;

    // 중복 학번 체크
    if (students.find(s => s.id === studentId)) {
        alert('이미 등록된 학번입니다.');
        return;
    }

    // 새 학생 객체 생성
    const newStudent = {
        id: studentId,
        name: studentName,
        dormitory: dormitory,
        room: room,
        qrData: `DORM_${studentId}_${Date.now()}`, // 고유한 QR 데이터
        registeredAt: new Date().toISOString()
    };

    students.push(newStudent);
    localStorage.setItem('students', JSON.stringify(students));

    // 폼 초기화
    this.reset();

    // 화면 업데이트
    displayStudents();
    updateStats();

    alert('학생이 성공적으로 등록되었습니다!');
});

// 학생 목록 표시
function displayStudents() {
    const studentList = document.getElementById('studentList');

    if (students.length === 0) {
        studentList.innerHTML = '<p style="text-align: center; color: #718096;">등록된 학생이 없습니다.</p>';
        return;
    }

    studentList.innerHTML = students.map(student => `
        <div class="student-card">
            <div class="student-info">
                <h4>${student.name} (${student.id})</h4>
                <p>📍 ${student.dormitory} ${student.room}호</p>
                <p>📅 등록일: ${new Date(student.registeredAt).toLocaleDateString()}</p>
            </div>
            <div class="qr-code">
                <div id="qr-${student.id}"></div>
                <button class="btn btn-info" onclick="downloadQR('${student.id}')">QR코드 다운로드</button>
                <button class="btn btn-danger" onclick="deleteStudent('${student.id}')">삭제</button>
            </div>
        </div>
    `).join('');

    // QR코드 생성
    students.forEach(student => {
        generateQRCode(student.id, student.qrData);
    });
}

// QR코드 생성 함수
function generateQRCode(studentId, qrData) {
    const qrContainer = document.getElementById(`qr-${studentId}`);
    if (!qrContainer) return;

    qrContainer.innerHTML = '';

    try {
        const qr = new QRious({
            element: document.createElement('canvas'),
            value: qrData,
            size: 150,
            background: 'white',
            foreground: '#667eea'
        });

        qrContainer.appendChild(qr.element);
    } catch (error) {
        console.error('QR코드 생성 오류:', error);
        qrContainer.innerHTML = '<p style="color: red;">QR코드 생성 실패</p>';
    }
}

// QR코드 다운로드
function downloadQR(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const canvas = document.querySelector(`#qr-${studentId} canvas`);
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `QR_${student.name}_${student.id}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

// 학생 삭제
function deleteStudent(studentId) {
    if (confirm('정말로 이 학생을 삭제하시겠습니까?')) {
        students = students.filter(s => s.id !== studentId);
        localStorage.setItem('students', JSON.stringify(students));

        // 해당 학생의 출석 기록도 삭제
        attendanceRecords = attendanceRecords.filter(record => record.studentId !== studentId);
        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));

        displayStudents();
        updateStats();
        displayTodayAttendance();
        displayAttendanceHistory();

        alert('학생이 삭제되었습니다.');
    }
}

// QR코드 스캔 관련 함수들
document.getElementById('startScan').addEventListener('click', startScanning);
document.getElementById('stopScan').addEventListener('click', stopScanning);

function startScanning() {
    const qrReaderElement = document.getElementById('qr-reader');

    if (isScanning) {
        showScanResult('이미 스캔이 진행 중입니다.', 'error');
        return;
    }

    html5QrCode = new Html5Qrcode("qr-reader");

    const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
    };

    html5QrCode.start(
        { facingMode: "environment" }, // 후면 카메라 사용
        config,
        (decodedText, decodedResult) => {
            handleQRScan(decodedText);
        },
        (errorMessage) => {
            // 스캔 오류는 무시 (계속 스캔 시도)
        }
    ).then(() => {
        isScanning = true;
        document.getElementById('startScan').style.display = 'none';
        document.getElementById('stopScan').style.display = 'inline-block';
        showScanResult('카메라가 시작되었습니다. QR코드를 스캔해주세요.', 'success');
    }).catch(err => {
        console.error('카메라 시작 오류:', err);
        showScanResult('카메라를 시작할 수 없습니다. 권한을 확인해주세요.', 'error');
    });
}

function stopScanning() {
    if (html5QrCode && isScanning) {
        html5QrCode.stop().then(() => {
            html5QrCode.clear();
            isScanning = false;
            document.getElementById('startScan').style.display = 'inline-block';
            document.getElementById('stopScan').style.display = 'none';
            showScanResult('카메라가 정지되었습니다.', 'success');
        }).catch(err => {
            console.error('카메라 정지 오류:', err);
        });
    }
}

// QR코드 스캔 처리
function handleQRScan(qrData) {
    console.log('스캔된 QR데이터:', qrData);

    // 등록된 학생 찾기
    const student = students.find(s => s.qrData === qrData);

    if (!student) {
        showScanResult('등록되지 않은 QR코드입니다.', 'error');
        return;
    }

    // 오늘 이미 출석했는지 확인
    const today = new Date().toDateString();
    const alreadyAttended = attendanceRecords.find(record =>
        record.studentId === student.id &&
        new Date(record.timestamp).toDateString() === today
    );

    if (alreadyAttended) {
        showScanResult(`${student.name}님은 이미 출석 처리되었습니다.`, 'duplicate');
        return;
    }

    // 출석 기록 추가
    const attendanceRecord = {
        studentId: student.id,
        studentName: student.name,
        dormitory: student.dormitory,
        room: student.room,
        timestamp: new Date().toISOString(),
        date: today
    };

    attendanceRecords.push(attendanceRecord);
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));

    // 화면 업데이트
    updateStats();
    displayTodayAttendance();
    displayAttendanceHistory();

    showScanResult(`✅ ${student.name}님 출석 완료!`, 'success');

    // 잠시 스캔을 중단했다가 재시작 (중복 스캔 방지)
    setTimeout(() => {
        if (isScanning) {
            // 스캔 결과 메시지 초기화
            document.getElementById('scanResult').innerHTML = '';
        }
    }, 2000);
}

// 스캔 결과 표시
function showScanResult(message, type) {
    const scanResult = document.getElementById('scanResult');
    scanResult.innerHTML = message;
    scanResult.className = `scan-result ${type}`;
}

// 통계 업데이트
function updateStats() {
    const totalStudents = students.length;
    const today = new Date().toDateString();
    const todayAttendees = attendanceRecords.filter(record =>
        new Date(record.timestamp).toDateString() === today
    ).length;
    const attendanceRate = totalStudents > 0 ? Math.round((todayAttendees / totalStudents) * 100) : 0;

    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('todayAttendees').textContent = todayAttendees;
    document.getElementById('attendanceRate').textContent = attendanceRate + '%';
}

// 오늘의 출석 현황 표시
function displayTodayAttendance() {
    const todayAttendance = document.getElementById('todayAttendance');
    const today = new Date().toDateString();

    const todayRecords = attendanceRecords.filter(record =>
        new Date(record.timestamp).toDateString() === today
    );

    if (todayRecords.length === 0) {
        todayAttendance.innerHTML = '<p style="text-align: center; color: #718096;">오늘 출석한 학생이 없습니다.</p>';
        return;
    }

    todayAttendance.innerHTML = todayRecords.map(record => `
        <div class="attendance-item">
            <div class="student-info">
                <h5>${record.studentName} (${record.studentId})</h5>
                <span>${record.dormitory} ${record.room}호</span>
            </div>
            <div class="time">${new Date(record.timestamp).toLocaleTimeString()}</div>
        </div>
    `).join('');
}

// 출석 기록 히스토리 표시
function displayAttendanceHistory() {
    const historyContainer = document.getElementById('attendanceHistory');

    if (attendanceRecords.length === 0) {
        historyContainer.innerHTML = '<p style="text-align: center; color: #718096;">출석 기록이 없습니다.</p>';
        return;
    }

    // 날짜별로 그룹화
    const recordsByDate = {};
    attendanceRecords.forEach(record => {
        const date = new Date(record.timestamp).toDateString();
        if (!recordsByDate[date]) {
            recordsByDate[date] = [];
        }
        recordsByDate[date].push(record);
    });

    // 최신 날짜부터 표시
    const sortedDates = Object.keys(recordsByDate).sort((a, b) => new Date(b) - new Date(a));

    historyContainer.innerHTML = sortedDates.map(date => {
        const records = recordsByDate[date];
        const formattedDate = new Date(date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });

        return `
            <div class="history-date">${formattedDate} (${records.length}명 출석)</div>
            ${records.map(record => `
                <div class="attendance-item">
                    <div class="student-info">
                        <h5>${record.studentName} (${record.studentId})</h5>
                        <span>${record.dormitory} ${record.room}호</span>
                    </div>
                    <div class="time">${new Date(record.timestamp).toLocaleTimeString()}</div>
                </div>
            `).join('')}
        `;
    }).join('');
}

// 데이터 내보내기 (CSV)
document.getElementById('exportData').addEventListener('click', function() {
    if (attendanceRecords.length === 0) {
        alert('내보낼 출석 기록이 없습니다.');
        return;
    }

    // CSV 헤더
    let csv = '날짜,시간,학번,이름,기숙사,호실\n';

    // 데이터 추가
    attendanceRecords.forEach(record => {
        const date = new Date(record.timestamp).toLocaleDateString();
        const time = new Date(record.timestamp).toLocaleTimeString();
        csv += `${date},${time},${record.studentId},${record.studentName},${record.dormitory},${record.room}\n`;
    });

    // 다운로드
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `출석기록_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
});

// 모든 데이터 초기화
document.getElementById('clearData').addEventListener('click', function() {
    if (confirm('정말로 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        if (confirm('학생 등록 정보와 출석 기록이 모두 삭제됩니다. 계속하시겠습니까?')) {
            localStorage.removeItem('students');
            localStorage.removeItem('attendanceRecords');

            students = [];
            attendanceRecords = [];

            // 스캔 중이면 정지
            if (isScanning) {
                stopScanning();
            }

            // 화면 업데이트
            displayStudents();
            updateStats();
            displayTodayAttendance();
            displayAttendanceHistory();

            alert('모든 데이터가 삭제되었습니다.');
        }
    }
});

// 페이지를 떠날 때 카메라 정지
window.addEventListener('beforeunload', function() {
    if (isScanning) {
        stopScanning();
    }
});