import React, { useState, useEffect, useRef } from "react";
import "../../../Styles/Chatroom.css";

import styled, { keyframes } from "styled-components";
import { LeftSidebar } from "../Sidebar";
import { Navbar } from "../Navbar";

import axios from "axios";

// API 엔드포인트
const urlCurrent = "http://localhost:8080/user/current"; // 세션 조회

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
    box-sizing: border-box;
    padding: 176px 50px 0 240px;
    transition: all 0.3s;
    display: grid;
    grid-template-columns: 70% 30%;
    animation: ${fadeIn} 0.6s ease-out;
    width: 100%;
`;

export function Chatroom() {
    // [상태 변수]
    // messages: 채팅 메시지 배열
    // input: 입력창의 텍스트
    // userId: 현재 사용자 ID
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [userId, setUserId] = useState(null); // User ID 데이터

    // [참조 변수]
    // messagesEndRef: 메시지 목록의 끝을 참조하여 스크롤을 조정
    // socketRef: WebSocket 연결을 저장
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null); // WebSocket을 저장할 ref

    // fetchUserData 함수는 API를 통해 사용자 ID를 조회하고 상태를 업데이트
    const fetchUserData = async () => {
        try {
            const { data } = await axios.get(urlCurrent, {
                withCredentials: true,
            }); // 세션 User ID 조회
            setUserId(data.userId);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    // WebSocket 연결 설정:
    // 컴포넌트가 마운트되면 WebSocket 연결을 설정, 서버로부터 메시지를 수신하여 messages 상태를 업데이트함.
    // 컴포넌트가 언마운트될 때 WebSocket 연결을 닫음.
    useEffect(() => {
        fetchUserData(); // 컴포넌트 마운트 시 사용자 데이터 로드

        // WebSocket 연결 설정
        // socketRef.current = new WebSocket("ws://localhost:8080");
        // socketRef.current = new WebSocket("ws://localhost:3000");
        socketRef.current = new WebSocket("ws://localhost:3001");

        socketRef.current.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        return () => {
            socketRef.current.close();
        };
    }, []);

    // 메시지 전송:
    // 폼 제출 시 handleSubmit 함수가 호출됨
    // 입력이 비어있지 않고 사용자 ID가 있는 경우, WebSocket을 통해 메시지를 전송
    // WebSocket 연결이 열려 있지 않으면 경고를 표시
    const handleSubmit = (event) => {
        event.preventDefault();
        if (input.trim() !== "" && userId !== null) {
            const message = { text: input, userId: userId }; // 사용자 이름 추가

            if (
                socketRef.current &&
                socketRef.current.readyState === WebSocket.OPEN
            ) {
                socketRef.current.send(JSON.stringify(message));
                setInput("");
            } else {
                window.alert(
                    "WebSocket connection is not open. Message not sent."
                );
                console.warn(
                    "WebSocket connection is not open. Message not sent."
                );
            }
        }
    };

    // 메시지 목록 스크롤:
    // 새로운 메시지가 추가될 때, 메시지 목록의 끝으로 자동 스크롤 이동
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            <Navbar />
            <LeftSidebar />
            <Container>
                <div className="chat-room">
                    <div className="messages">
                        {messages.map((msg, index) => (
                            <div key={index} className="message">
                                [{msg.userId || "Unknown"}] {msg.text}{" "}
                                {/* 사용자 ID가 없으면 "Unknown" 표시 */}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSubmit} className="input-form">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message"
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            </Container>
        </>
    );
}

export default Chatroom;
