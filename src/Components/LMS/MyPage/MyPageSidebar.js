import "../../../Styles/sub_navBox.css";
import React, { useEffect, useState } from "react";
import { Route, Routes, Link, Outlet, useLocation } from "react-router-dom";
// import { CartSideIcon, LectureSideIcon, UserSideIcon } from "../../Utils/svg";

import { MyPageUser } from "./MyPageUser";
import { MyPageLecture } from "./MyPageLecture";
import { MyPageLectureModal } from "./MyPageLectureModal";
import { MyPageUserDelete } from "./MyPageUserDelete";

import styled, { keyframes } from "styled-components";
import { Navbar } from "../Navbar";
import { LeftSidebar } from "../Sidebar";
import { getCurrentUser } from "../../../Api/UserApi/UserApi";
import { getLectureStatusCountJPQL } from "../../../Api/CourseApi/CourseApi";
import {
  CartSideIcon,
  LectureSideIcon,
  ModifyUserIcon,
  RemoveUserIcon,
  StudyIcon,
  UserSideIcon,
} from "../../../Utils/svg";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const MyPageContainer = styled.div`
  padding: 100px 275px 0 240px;
  animation: ${fadeIn} 0.6s ease-out;
`;

export function MyPageSidebar() {
  const location = useLocation(); // Hook to get the current location

  // Determine the current active path
  const currentPath = location.pathname.split("/").pop(); // This gives you the last segment of the path

  return (
    <>
      <Navbar />
      <LeftSidebar />
      <MypageSidebar />
      <MyPageContainer>
        <Routes>
          <Route path="user" element={<MyPageUser />} />
          <Route path="lecture" element={<MyPageLecture />} />
          <Route path="userDelete" element={<MyPageUserDelete />} />
        </Routes>
      </MyPageContainer>
    </>
  );
}

export default MyPageSidebar;

const RightSideContainer = styled.div`
  box-sizing: border-box;
  width: 275px;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 990;
  /* background-color: #fff; */
  padding: 200px 30px 0 20px;
`;

const UserInfoBox = styled.div`
  background-color: #1a1b24;
  border-radius: 12px;
  padding: 20px 20px 16px 10px;
  margin-bottom: 90px;
`;

const UserForm = styled.div`
  display: grid;
  grid-template-columns: 25% 75%;
  background-color: transparent;
`;

const UserBox = styled.div`
  background-color: transparent;
`;

const UserNameText = styled.p`
  font-size: 15px;
  color: #fff;
  padding-bottom: 6px;
  background-color: transparent;
`;
const UserEmailText = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #757575;
  background-color: transparent;
`;

const CartBox = styled.div`
  background-color: #1a1b24;
  border-radius: 12px;
  padding: 20px 20px 16px 10px;
  margin-bottom: 10px;
`;

const CartForm = styled.div`
  display: grid;
  grid-template-columns: 30% 70%;
  background-color: transparent;
`;

const MyPageForm = styled.div`
  display: grid;
  grid-template-columns: 30% 70%;
  background-color: transparent;
  cursor: pointer;
`;

const CartText = styled.p`
  font-size: 15px;
  color: #9da2b9;
  padding-bottom: 6px;
  background-color: transparent;
  text-align: center;
  padding-top: 7px;
`;

export function MypageSidebar() {
  const [session, setSession] = useState([]);
  const [cart, setCart] = useState([]);
  const [count, setCount] = useState([]);

  useEffect(() => {
    getUserId();
  }, []);

  async function getUserId() {
    try {
      const SessionData = await getCurrentUser();
      setSession(SessionData);
      const userId = SessionData.userId;
      const getCartList = localStorage.getItem(userId);
      const cartList = getCartList ? JSON.parse(getCartList) : [];
      setCart(cartList.length);
      const lectureCount = await getLectureStatusCountJPQL(userId);
      setCount(lectureCount[0].lectureStatusCount);
    } catch (error) {
      console.log("User Id Error", error);
    }
  }
  console.log(count);

  return (
    <>
      <RightSideContainer>
        <UserInfoBox>
          <UserForm>
            <UserSideIcon />
            <UserBox>
              <UserNameText>{session.userId}</UserNameText>
              <UserEmailText>{session.email}</UserEmailText>
            </UserBox>
          </UserForm>
        </UserInfoBox>
        <CartBox>
          <CartForm>
            <CartSideIcon />
            <CartText>장바구니 {cart}개</CartText>
          </CartForm>
        </CartBox>
        <CartBox>
          <CartForm>
            <LectureSideIcon />
            <CartText>수강중 {count}개</CartText>
          </CartForm>
        </CartBox>
        <CartBox>
          <Link to="user">
            <MyPageForm>
              <ModifyUserIcon />
              <CartText>회원정보</CartText>
            </MyPageForm>
          </Link>
        </CartBox>
        <CartBox>
          <Link to="lecture">
            <MyPageForm>
              <StudyIcon />
              <CartText>나의학습</CartText>
            </MyPageForm>
          </Link>
        </CartBox>
        <CartBox>
          <Link to="userDelete">
            <MyPageForm>
              <RemoveUserIcon />
              <CartText>회원탈퇴</CartText>
            </MyPageForm>
          </Link>
        </CartBox>
      </RightSideContainer>
      ;
    </>
  );
}
