import React, { useState, useEffect } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = Stomp.over(socket);

        client.connect({}, () => {
            client.subscribe('/topic/public', (message) => {
                if (message.body) {
                    setMessages(prevMessages => [...prevMessages, JSON.parse(message.body)]);
                }
            });
        });

        setStompClient(client);

        return () => {
            client.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (stompClient && message.trim()) {
            const chatMessage = {
                content: message,
                sender: "User"
            };
            stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
            setMessage("");
        }
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg.sender}: {msg.content}</div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' ? sendMessage() : null}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default ChatRoom;