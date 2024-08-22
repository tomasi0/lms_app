import React from 'react';

const Logout = ({ onLogout, onConnect }) => {
  return (
    <div className="user-box">
      <p>로그아웃 하시겠습니까?</p>
      <div className="button-box">
        <div className="logoutBtn" onClick={onLogout}>확인</div>
        <div className="connectBtn" onClick={onConnect}>취소</div>
      </div>
    </div>
  );
};

export default Logout;