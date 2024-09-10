import React, { useState } from "react";
import axios from "axios";
import "../../../Styles/login.css";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
// import { AuthProvider } from '../AuthContext';

const LoginContainer = styled.div`
    box-sizing: border-box;
    padding-right: 600px;
    overflow: hidden;
`;

const Loginbg = styled.div`
    width: 100%;
    height: 100vh;
    background-image: url("/reactimage/LoginBG.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    animation-name: bg;
    animation-duration: 10s;
    animation-timing-function: linear;
    animation-iteration-count: 1;
    animation-direction: alternate;
    animation-fill-mode: forwards;

    @keyframes bg {
        0% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
        }
    }
`;

const LoginSide = styled.div`
    box-sizing: border-box;
    width: 600px;
    height: 100vh;
    padding: 0 40px;
    position: absolute;
    top: 0;
    right: 0;
    background-color: #0f1015;
`;

const LoginBox = styled.div`
    display: table;
    width: 100%;
    height: 100%;
`;

const LoginForm = styled.div`
    display: table-cell;
    vertical-align: middle;
`;

const H1 = styled.h1`
    font-size: 28px;
    font-weight: 600;
    line-height: 1.4;
    color: #fff;
    padding-bottom: 20px;
`;

const InputBox = styled.input`
    display: block;
    margin-bottom: 10px;
    width: 400px;
    background-color: #1a1b24;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 16px;
    /* border: 1px solid #ECECEC; */
    border-radius: 12px;
    height: 65px;
    padding: 20px 0 0 23px;
    position: relative;
    z-index: 2;
    color: #fff;
`;

const SummitBtn = styled.button`
    width: 400px;
    height: 60px;
    background: #4a65f7;
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 63px;
    letter-spacing: normal;
    color: #ffffff;
    border-radius: 12px;
`;

const SginUpForm = styled.div`
    width: 100%;
`;

const SginUpBtn = styled.p`
    font-size: 0.9rem;
    color: #9da2b9;
    margin-top: 10px;
    cursor: pointer;
`;

const NavigateBtn = styled.button`
    width: 400px;
    height: 60px;
    background: ${(props) => props.bgColor};
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 63px;
    letter-spacing: normal;
    color: #ffffff;
    border-radius: 12px;
    margin-bottom: 10px;
`;

export function Login({ onSignup }) {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [loginCurrent, setLoginCurrent] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const data = { userId, password };
            const response = await axios.post(
                "http://localhost:8080/user/login",
                data,
                { withCredentials: true }
            );
            if (response.status === 200) {
                setLoginCurrent(true);
            }
        } catch (error) {
            alert("탈퇴 회원이거나, 잘못된 로그인 정보입니다.");
        }
    };

    return (
        <LoginContainer>
            <Loginbg></Loginbg>
            <LoginSide>
                {loginCurrent ? (
                    <LoginBox>
                        <LoginForm>
                            <H1>{userId}님 어서오세요</H1>
                            <NavigateBtn
                                bgColor="#b4a6a6"
                                onClick={() => {
                                    navigate("/home");
                                }}
                            >
                                {" "}
                                강의실 가기
                            </NavigateBtn>
                            <NavigateBtn
                                bgColor="#c1d3fc"
                                onClick={() => {
                                    navigate("/index");
                                }}
                            >
                                홈페이지
                            </NavigateBtn>
                        </LoginForm>
                    </LoginBox>
                ) : (
                    <LoginBox>
                        <LoginForm>
                            <H1>로그인</H1>
                            <InputBox
                                type="text"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="아이디"
                            />
                            <InputBox
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호"
                            />
                            <SummitBtn onClick={handleLogin}>로그인</SummitBtn>
                            <SginUpForm>
                                <SginUpBtn onClick={onSignup}>
                                    회원가입
                                </SginUpBtn>
                            </SginUpForm>
                        </LoginForm>
                    </LoginBox>
                )}
            </LoginSide>
        </LoginContainer>
    );
}

export default Login;
