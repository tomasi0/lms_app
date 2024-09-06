import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import styled from "styled-components";
import Sidebar from "./Sidebar"; // Adjust the path if necessary

// import "../../../Styles/AdminUser.css"; // Add your AdminUser CSS

import UserManagement from "./UserManagement";
import LectureManagement from "./LectureManagement";
import EnrollmentManagement from "./EnrollmentManagement";

// const AdminContainer = styled.div`
//   padding: 176px 50px 0 240px;
// `;

export function Admin() {
  return (
    <>
      <Sidebar />
      <div>
        <UserManagement />
      </div>
    </>
  );
}

export default Admin;
