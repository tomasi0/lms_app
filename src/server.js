// server.js
// ws 모듈을 불러옴. ws 모듈은 Node.js에서 WebSocket 서버와 클라이언트를 구현할 때 사용됨.
const WebSocket = require("ws");
// const wss = new WebSocket.Server({ port: 8080 });
// const wss = new WebSocket.Server({ port: 3000 });

// WebSocket 서버 생성
// 이 서버는 포트 3001에서 클라이언트의 연결을 기다림
const wss = new WebSocket.Server({ port: 3001 });

// wss.on("connection", (ws) => { ... });는 클라이언트가 서버에 연결할 때 호출되는 이벤트 핸들러
wss.on("connection", (ws) => {
    // 새로운 클라이언트가 연결되면 콘솔에 "New client connected"라는 메시지가 출력됨
    console.log("New client connected");

    // ws.on("message", (message) => { ... });는 클라이언트가 서버로 메시지를 보낼 때 호출되는 이벤트 핸들러
    ws.on("message", (message) => {
        // 수신한 메시지는 콘솔에 출력
        console.log(`Received message: ${message}`);
        try {
            // 메시지를 JSON 형식으로 파싱
            const parsedMessage = JSON.parse(message);

            // 서버에 연결된 모든 클라이언트에게 다시 전송, 클라이언트 간의 메시지 브로드캐스트를 구현
            wss.clients.forEach((client) => {
                // 웹소켓이 열려 있으면 파싱된 메시지 전송
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(parsedMessage));
                }
            });
        } catch (error) {
            // 메시지 파싱에 실패하면, 에러를 콘솔에 출력합니다.
            console.error("Failed to parse message:", error);
        }
    });

    // ws.on("close", () => { ... });는 클라이언트가 연결을 종료할 때 호출되는 이벤트 핸들러
    ws.on("close", () => {
        // 클라이언트가 연결을 끊으면 콘솔에 "Client disconnected"라는 메시지가 출력됨
        console.log("Client disconnected");
    });
});

// console.log("WebSocket server is running on ws://localhost:8080");
// console.log("WebSocket server is running on ws://localhost:3000");

// 서버가 localhost의 포트 3001에서 실행 중임을 알리는 메시지를 콘솔에 출력함
console.log("WebSocket server is running on ws://localhost:3001");
