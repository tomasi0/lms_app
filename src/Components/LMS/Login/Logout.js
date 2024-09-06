import React from "react";
import styled from "styled-components";

const UserBoxP = styled.p`
    color: white;
`;

const Logout = ({ onLogout, onConnect }) => {
    return (
        <div className="user-box">
            <UserBoxP>로그아웃 하시겠습니까?</UserBoxP>
            <div className="button-box">
                <div className="logoutBtn" onClick={onLogout}>
                    확인
                </div>
                <div className="connectBtn" onClick={onConnect}>
                    취소
                </div>
            </div>
        </div>
    );
};

export default Logout;
