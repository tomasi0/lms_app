import React, { useState } from "react";
import axios from "axios";
import "../../../Styles/login.css";
// import { AuthProvider } from '../AuthContext';

export function Login({ onSignup }) {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const data = { userId, password };
            const response = await axios.post(
                "http://localhost:8080/user/login",
                data,
                { withCredentials: true }
            );
            if (response.status === 200) {
                // console.log("response.status: " + response.status); 200
                // console.log("response.data: " + response.data); Success

                // AuthProvider.setIsAuthenticated(true);

                window.location.href = "home";
            }
        } catch (error) {
            alert("탈퇴 회원이거나, 잘못된 로그인 정보입니다.");
        }
    };

    return (
        <div className="login-box">
            <h2>로그인</h2>
            <div className="input-box">
                <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="아이디"
                />
                {/* <label>아이디</label> */}
            </div>
            <div className="input-box">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호"
                />
                {/* <label>비밀번호</label> */}
            </div>
            <div className="button-box">
                <div className="loginBtn" onClick={handleLogin}>
                    로그인
                </div>
                <div className="signupBtn" onClick={onSignup}>
                    회원가입
                </div>
            </div>
        </div>
    );
}

export default Login;
