const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "dormitory_attendance.html"));
});

app.get("/style.css", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "style.css"));
});

app.get("/script.js", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "script.js"));
});

app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.use((req, res) => {
    res.status(404).json({
        error: "Page not found",
        message: "요청하신 페이지를 찾을 수 없습니다.",
        path: req.path
    });
});

app.use((err, req, res, next) => {
    console.error("서버 오류:", err.stack);
    res.status(500).json({
        error: "Internal Server Error",
        message: "서버에서 오류가 발생했습니다."
    });
});

module.exports = app;
