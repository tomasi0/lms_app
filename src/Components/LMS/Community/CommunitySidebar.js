import React from "react";
import { Route, Routes, Link, Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";

// 각 페이지 컴포넌트 (Notices, QA, Events)
import { Notices } from "./Notices";
import { QA } from "./QA";
import { Events } from "./Events";

// 스타일 정의
const NavBox = styled.nav`
  width: 200px;
  background-color: #1c1e24; /* 사이드바 배경색 어두운 회색으로 변경 */
  padding: 20px 0;
  border-radius: 5px; /* 모서리 둥글게 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 약간의 그림자 */
  margin-right: 30px;
`;

const NavBoxIn = styled.div`
  display: flex;
  flex-direction: row; /* 세로에서 가로로 변경 */
  justify-content: space-between; /* 아이템들이 고르게 배치되도록 설정 */
  width: 100%; /* 가로로 나열할 충분한 너비 지정 */
  flex-wrap: nowrap; /* 줄바꿈 방지 */
  overflow: hidden; /* 넘치는 내용 숨김 */
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 0; /* 가로로 배치될 경우, margin-bottom 제거 */
  
  a {
    display: block;
    padding: 12px 20px;
    text-decoration: none;
    color: ${(props) => (props.active ? "#ffffff" : "#e0e0e0")};
    background-color: ${(props) => (props.active ? "#007bff" : "transparent")};
    font-weight: ${(props) => (props.active ? "bold" : "normal")};
    border-radius: 5px;
    text-align: center;

    &:hover {
      background-color: ${(props) => (props.active ? "#0056b3" : "#23262d")};
      color: #ffffff;
    }
  }
`;

export function CommunitySidebar() {
  const location = useLocation(); // 현재 경로를 가져오는 훅

  // 현재 활성화된 경로를 추출
  const currentPath = location.pathname.split("/").pop(); // 경로의 마지막 부분만 추출

  return (
    <div style={{ display: "flex" }}>
      {/* 사이드바 구조 */}
      <NavBox>
        <NavBoxIn>
          <NavList>
            <NavItem className={currentPath === "notices" ? "active" : ""}>
              <Link to="/community/notices">공지사항</Link> {/* 절대 경로로 수정 */}
            </NavItem>
            <NavItem className={currentPath === "qa" ? "active" : ""}>
              <Link to="/community/qa">질문응답</Link> {/* 절대 경로로 수정 */}
            </NavItem>
            <NavItem className={currentPath === "events" ? "active" : ""}>
              <Link to="/community/events">이벤트</Link> {/* 절대 경로로 수정 */}
            </NavItem>
          </NavList>
        </NavBoxIn>
      </NavBox>

      {/* 라우팅을 위한 Routes 구성 */}
      <div style={{ flex: 1, padding: "20px", backgroundColor: "#0f1015", color: "#e0e0e0" }}>
        <Routes>
          <Route path="/notices" element={<Notices />} /> {/* 절대 경로로 수정 */}
          <Route path="/qa" element={<QA />} /> {/* 절대 경로로 수정 */}
          <Route path="/events" element={<Events />} /> {/* 절대 경로로 수정 */}
        </Routes>

        {/* Outlet을 사용해 자식 라우트 컴포넌트가 여기에 표시됨 */}
        <Outlet />
      </div>
    </div>
  );
}

export default CommunitySidebar;