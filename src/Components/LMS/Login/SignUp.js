import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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
    /* animation-name: bg;
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
  } */
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

const Text = styled.p`
    font-size: 13px;
    color: #9da2b9;
`;

const SignUp = ({ onSuccess }) => {
    const [signupUserId, setSignupUserId] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupUserName, setSignupUserName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const navigate = useNavigate();

    const handleSignup = async () => {
        if (signupUserId && signupPassword && signupUserName && signupEmail) {
            try {
                const data = {
                    userId: signupUserId,
                    password: signupPassword,
                    userName: signupUserName,
                    userEmail: signupEmail,
                };
                const response = await axios.post(
                    "http://localhost:8080/user/signup",
                    data,
                    { withCredentials: true }
                );
                if (response.status === 201) {
                    alert("회원가입이 완료되었습니다.");
                    window.location.href = "login";
                }
                // navigate("/index");
            } catch (error) {
                console.log("회원가입 에러 발생: ", error);
            }
        } else {
            alert("가입정보를 모두 입력하여 주세요!!!");
        }
    };

    return (
        <LoginContainer>
            <Loginbg></Loginbg>
            <LoginSide>
                <LoginBox>
                    <LoginForm>
                        <H1>회원가입</H1>
                        <InputBox
                            type="text"
                            value={signupUserId}
                            onChange={(e) => setSignupUserId(e.target.value)}
                            placeholder="아이디"
                        />
                        <InputBox
                            type="password"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            placeholder="비밀번호"
                        />
                        <Text>
                            8~20자 이내 영문자, 숫자의 조합으로 입력해주세요.
                        </Text>
                        <InputBox
                            type="text"
                            value={signupUserName}
                            onChange={(e) => setSignupUserName(e.target.value)}
                            placeholder="이름"
                        />
                        <InputBox
                            type="email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder="이메일"
                        />
                        <SummitBtn onClick={handleSignup}>회원가입</SummitBtn>
                        <SummitBtn onClick={onSuccess}>취소</SummitBtn>
                    </LoginForm>
                </LoginBox>
            </LoginSide>
        </LoginContainer>
        // <div className="signup-box">
        //   <h2>회원가입</h2>
        //   <div className="input-box">
        //     <label>User ID</label>
        //     <input

        //     />
        //   </div>
        //   <div className="input-box">
        //     <label>Password</label>
        //     <input

        //     />
        //   </div>
        //   <div className="input-box">
        //     <label>User Name</label>
        //     <input

        //     />
        //   </div>
        //   <div className="input-box">
        //     <label>Email</label>
        //     <input

        //     />
        //   </div>
        //   <div className="button-box">
        //     <div className="registrationBtn" onClick={handleSignup}>
        //       회원등록
        //     </div>
        //     <div className="registrationCloseBtn" onClick={onSuccess}>
        //       닫기
        //     </div>
        //   </div>
        // </div>
    );
};

export default SignUp;
