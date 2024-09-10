import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NavItem } from "./NavItem";
import styled from "styled-components";
import { getCurrentUser } from "../../Api/UserApi/UserApi";
import {
  CartIcon,
  LoginIcon,
  LogoutIcon,
  SettingIcon,
  UserInfoIcon,
} from "../../Utils/svg";
import axios from "axios";
// import { useAuth } from "./AuthContext";

const Container = styled.nav`
  box-sizing: border-box;
  width: 100%;
  padding: 32px 32px 32px 240px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 997;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #fff;
`;

const StyledLink = styled(Link)`
  height: 44px;
  padding: 0 15px;
  font-size: 14px;
  line-height: 44px;
  border-radius: 8px;
  background-color: transparent;
  transition: all 0.1s;
  color: #9da2b9;
  position: relative;
`;

const LogoutBox = styled.div`
  height: 44px;
  padding: 0 15px;
  font-size: 14px;
  line-height: 44px;
  border-radius: 8px;
  background-color: transparent;
  transition: all 0.1s;
  color: #9da2b9;
  position: relative;
  cursor: pointer;
`;

export function Navbar() {
  const [current, setCurrent] = useState(false);
  const [role, setRole] = useState(false);

  // 로그인 상태 & ROUE_ADMIN 확인
  useEffect(() => {
    currentChk();
  }, []);

  async function currentChk() {
    try {
      const loginCurrent = await getCurrentUser();
      if (loginCurrent.userId) {
        setCurrent(!!loginCurrent);
      }
      if (loginCurrent.authority[0].authority === "ROLE_ADMIN") {
        setRole(true);
      }
    } catch (error) {
      console.log(error);
      setCurrent(false);
    }
  }
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/user/logout",
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        setIsAuthenticated(false);

        window.location.href = "/login";
      }
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <>
      <Container>
        <Header>
          {current ? (
            <StyledLink to="/mypage/user">
              <UserInfoIcon />
            </StyledLink>
          ) : null}
          <StyledLink to="/cart">
            <CartIcon />
          </StyledLink>
          <StyledLink to="/community/notices">
            <NavItem icon="ti ti-friends" />
          </StyledLink>

          {current ? (
            <LogoutBox onClick={() => handleLogout()}>
              <LogoutIcon />
            </LogoutBox>
          ) : (
            <StyledLink to="/login">
              <LoginIcon />
            </StyledLink>
          )}
          {role ? (
            <StyledLink to="/admin/user">
              <SettingIcon />
            </StyledLink>
          ) : null}
        </Header>

        {/* <StyledLink to="/home">
          <NavItem icon="ti ti-home" name="홈" />
        </StyledLink>
        <StyledLink to="/lecture">
          <NavItem icon="ti ti-device-tv" name="강의" />
        </StyledLink> */}
      </Container>
    </>
  );
}
