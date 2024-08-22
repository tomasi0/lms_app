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
  background-color: #f4f4f4; /* 사이드바 배경색 */
  padding: 20px 0;
  border-radius: 5px; /* 모서리 둥글게 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 약간의 그림자 */
  margin-right: 30px;
`;

const NavTitle = styled.p`
  font-size: 20px;
  font-weight: bold;
  padding-left: 20px;
  color: #333;
  margin-bottom: 20px;
`;

const NavBoxIn = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 10px;
  
  a {
    display: block;
    padding: 12px 20px;
    text-decoration: none;
    color: ${(props) => (props.active ? "#fff" : "#333")};
    background-color: ${(props) => (props.active ? "#007bff" : "#e9ecef")}; /* 활성화된 링크와 비활성화된 링크 구분 */
    font-weight: ${(props) => (props.active ? "bold" : "normal")};
    border-radius: 5px;
    text-align: center;

    &:hover {
      background-color: ${(props) => (props.active ? "#0056b3" : "#dfe3e8")}; /* 마우스 오버 효과 */
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
        <NavTitle></NavTitle>
        <NavBoxIn>
          <NavList>
            <NavItem className={currentPath === "notices" ? "active" : ""}>
              <Link to="notices">공지사항</Link>
            </NavItem>
            <NavItem className={currentPath === "qa" ? "active" : ""}>
              <Link to="qa">질문응답</Link>
            </NavItem>
            <NavItem className={currentPath === "events" ? "active" : ""}>
              <Link to="events">이벤트</Link>
            </NavItem>
          </NavList>
        </NavBoxIn>
      </NavBox>

      {/* 라우팅을 위한 Routes 구성 */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route path="notices" element={<Notices />} />
          <Route path="qa" element={<QA />} />
          <Route path="events" element={<Events />} />
        </Routes>

        {/* Outlet을 사용해 자식 라우트 컴포넌트가 여기에 표시됨 */}
        <Outlet />
      </div>
    </div>
  );
}

export default CommunitySidebar;