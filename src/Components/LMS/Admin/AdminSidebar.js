import "../../../Styles/sub_navBox.css";
import React from "react";
import { Route, Routes, Link, Outlet, useLocation } from "react-router-dom";

import { UserManagement } from "./UserManagement";
import { LectureManagement } from "./LectureManagement";
import { EnrollmentManagement } from "./EnrollmentManagement";

//import styled from "styled-components";

// const Sub_navBox = styled.nav`
//     /* 왼쪽 메뉴 박스 */
//     width: 330px;
//     float: left;
// `;

export function AdminSidebar() {
    const location = useLocation(); // Hook to get the current location

    // Determine the current active path
    const currentPath = location.pathname.split("/").pop(); // This gives you the last segment of the path

    return (
        <div>
            {/* <h1>관리자 메뉴</h1> */}
            {/* <nav>
                <Link to="user">회원관리</Link>
                <Link to="lecture">강의관리</Link>
                <Link to="enrollment">수강관리</Link>
            </nav> */}
            <nav className="sub_navBox">
                <p className="nav_tit">관리자 메뉴</p>
                <div className="sub_navBoxIn">
                    <div className="content_wrap">
                        <ul className="sub_nav">
                            <li
                                className={
                                    currentPath === "user"
                                        ? "active open"
                                        : "no_sub"
                                }
                            >
                                <Link to="user">회원관리</Link>
                            </li>
                            <li
                                className={
                                    currentPath === "lecture"
                                        ? "active open"
                                        : "no_sub"
                                }
                            >
                                <Link to="lecture">강의관리</Link>
                            </li>
                            <li
                                className={
                                    currentPath === "enrollment"
                                        ? "active open"
                                        : "no_sub"
                                }
                            >
                                <Link to="enrollment">수강관리</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <Routes>
                <Route path="user" element={<UserManagement />} />
                <Route path="lecture" element={<LectureManagement />} />
                <Route path="enrollment" element={<EnrollmentManagement />} />
            </Routes>
            <Outlet />
        </div>
    );
}

export default AdminSidebar;
