import React, { useState } from 'react';
import axios from 'axios';

const SignUp = ({ onSuccess }) => {
  const [signupUserId, setSignupUserId] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupUserName, setSignupUserName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');

  const handleSignup = async () => {
    if (signupUserId && signupPassword && signupUserName && signupEmail) {
      try {
        const data = { userId: signupUserId, password: signupPassword, userName: signupUserName, userEmail: signupEmail };
        const response = await axios.post('http://localhost:8080/user/signup', data, { withCredentials: true });
        if (response.status === 201) {
          alert('회원가입이 완료되었습니다.');
          onSuccess();
        }
      } catch (error) {
        console.log('회원가입 에러 발생: ', error);
      }
    } else {
      alert('가입정보를 모두 입력하여 주세요!!!');
    }
  };

  return (
    <div className="signup-box">
      <h2>회원가입</h2>
      <div className="input-box">
        <label>User ID</label>
        <input
          type="text"
          value={signupUserId}
          onChange={(e) => setSignupUserId(e.target.value)}
        />
      </div>
      <div className="input-box">
        <label>Password</label>
        <input
          type="password"
          value={signupPassword}
          onChange={(e) => setSignupPassword(e.target.value)}
        />
      </div>
      <div className="input-box">
        <label>User Name</label>
        <input
          type="text"
          value={signupUserName}
          onChange={(e) => setSignupUserName(e.target.value)}
        />
      </div>
      <div className="input-box">
        <label>Email</label>
        <input
          type="email"
          value={signupEmail}
          onChange={(e) => setSignupEmail(e.target.value)}
        />
      </div>
      <div className="button-box">
        <div className="registrationBtn" onClick={handleSignup}>회원등록</div>
        <div className="registrationCloseBtn" onClick={onSuccess}>닫기</div>
      </div>
    </div>
  );
};

export default SignUp;