import "../../../Styles/sub_navBox.css";
import React from "react";
import {
  Route,
  Routes,
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { UserManagement } from "./UserManagement";
import { LectureManagement } from "./LectureManagement";
import { EnrollmentManagement } from "./EnrollmentManagement";
import { AdminSettingIcon, AdminUserIcon, HomeIcon } from "../../../Utils/svg";
import styled from "styled-components";

const AdminSideContainer = styled.div`
  box-sizing: border-box;
  width: 240px;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 998;
  padding: 20px;
`;

const AdminSideMenuBox = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const AdminSideMenu = styled.div`
  position: absolute;
  top: 20%;
  left: 0;
  width: 100%;
  height: 50px;
`;

const MenuBox = styled.div`
  width: 100%;
`;

const SideMenu = styled.div`
  display: grid;
  grid-template-columns: 20% 80%;
  padding: 20px 0;
  cursor: pointer;
`;

const SideMenuBox = styled.div`
  background-color: transparent;
  padding: 10px;
`;

const SideMenuName = styled.p`
  color: #bbbece;
  background-color: transparent;
  font-size: 20px;
`;

const AdminContainer = styled.div`
  padding: 50px 0 0 240px;
`;

const AdminContent = styled.div`
  /* padding: 30px; */
`;

export function AdminSidebar() {
  const location = useLocation(); // Hook to get the current location
  const navigate = useNavigate();

  // Determine the current active path
  const currentPath = location.pathname.split("/").pop(); // This gives you the last segment of the path

  return (
    <>
      <AdminSideContainer>
        <AdminSideMenuBox>
          <AdminSideMenu>
            <MenuBox>
              <SideMenu>
                <AdminUserIcon />
                <Link to="user">
                  <SideMenuBox>
                    <SideMenuName>회원관리</SideMenuName>
                  </SideMenuBox>
                </Link>
              </SideMenu>
              <SideMenu>
                <AdminSettingIcon />
                <Link to="lecture">
                  <SideMenuBox>
                    <SideMenuName>강의관리</SideMenuName>
                  </SideMenuBox>
                </Link>
              </SideMenu>
              <SideMenu>
                <AdminSettingIcon />
                <Link to="enrollment">
                  <SideMenuBox>
                    <SideMenuName>수강관리</SideMenuName>
                  </SideMenuBox>
                </Link>
              </SideMenu>
              <SideMenu
                onClick={() => {
                  navigate(`/index`);
                }}
              >
                <HomeIcon />
                <SideMenuBox>
                  <SideMenuName>홈페이지</SideMenuName>
                </SideMenuBox>
              </SideMenu>
            </MenuBox>
          </AdminSideMenu>
        </AdminSideMenuBox>
      </AdminSideContainer>
      <AdminContainer>
        <AdminContent>
          <Routes>
            <Route path="user" element={<UserManagement />} />
            <Route path="lecture" element={<LectureManagement />} />
            <Route path="enrollment" element={<EnrollmentManagement />} />
          </Routes>
        </AdminContent>
      </AdminContainer>
    </>
  );
}

export default AdminSidebar;
