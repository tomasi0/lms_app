import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";

import {
  BookIcon,
  CartSideIcon,
  GameIcon,
  ChatroomIcon,
  InstagramIcon,
  LectureSideIcon,
  SettingIcon,
  UserIcon,
  UserSideIcon,
} from "../../Utils/svg";
import { getCurrentUser } from "../../Api/UserApi/UserApi";
import { getLectureStatusCountJPQL } from "../../Api/CourseApi/CourseApi";
// import "https://use.fontawesome.com/releases/v5.6.1/css/all.css";

import { CommunitySidebar } from "./Community/CommunitySidebar"; // CommunitySidebar 임포트

const LeftSideContainer = styled.div`
  box-sizing: border-box;
  width: 240px;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 998;
`;

const SideManu = styled.div`
  padding: 38px 32px 32px 32px;
  height: 100%;
`;

const SideLogo = styled.div`
  box-sizing: border-box;
  width: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 80px;
`;

const Logo = styled.img`
  width: 100%;
  cursor: pointer;
`;

const SideItem = styled.div`
  padding: 100px 0 0 0;
`;

const SideContant = styled.div`
  position: relative;
  cursor: pointer;
  color: white;
  display: block;
  padding-bottom: 12px;
`;

const TextStyle = styled.p`
  font-size: 19px;
  font-weight: 700;
  color: #9da2b9;
  padding: 13px 0px 8px 8px;
  border-left: 1px solid #1a1b24;
`;

const Group = styled.div`
  display: flex;
  align-items: center;
  padding: 2px;
`;

export function LeftSidebar() {
  const navigate = useNavigate();

  // Community 관련 추가
  const [isCommunityDropdownOpen, setIsCommunityDropdownOpen] = useState(false); // 드롭다운 상태 관리
  const toggleCommunityDropdown = () => {
    setIsCommunityDropdownOpen(!isCommunityDropdownOpen); // 드롭다운 상태 변경
  };

  return (
    <>
      <LeftSideContainer>
        <SideManu>
          <SideLogo>
            <Logo
              src="/reactimage/logo_origin.png"
              onClick={() => navigate("/index")}
            ></Logo>
          </SideLogo>
          <SideItem>
            <SideContant onClick={() => navigate("/lecture")}>
              <Group>
                <BookIcon></BookIcon>
                <TextStyle>강의보기</TextStyle>
              </Group>
            </SideContant>
            {/* <SideContant
                            onClick={() => navigate("/community/notices")}
                        >
                            <Group>
                                <UserIcon></UserIcon>
                                <TextStyle>커뮤니티</TextStyle>
                            </Group>
                        </SideContant> */}
            <SideContant onClick={toggleCommunityDropdown}>
              {" "}
              {/* 드롭다운 토글 */}
              <Group>
                <UserIcon></UserIcon>
                <TextStyle>커뮤니티</TextStyle>
              </Group>
            </SideContant>
            {isCommunityDropdownOpen && <CommunitySidebar />}{" "}
            {/* 드롭다운 상태에 따라 CommunitySidebar 표시 */}
            <SideContant onClick={() => navigate("/home")}>
              <Group>
                <GameIcon></GameIcon>
                <TextStyle>게임하기</TextStyle>
              </Group>
            </SideContant>
            <SideContant onClick={() => navigate("/chatroom")}>
              <Group>
                <ChatroomIcon></ChatroomIcon>
                <TextStyle>채팅룸</TextStyle>
              </Group>
            </SideContant>
          </SideItem>
        </SideManu>
      </LeftSideContainer>
    </>
  );
}

/* ----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

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

const CartText = styled.p`
  font-size: 15px;
  /* color: #fff; */
  color: #9da2b9;
  padding-bottom: 6px;
  background-color: transparent;
  text-align: center;
  padding-top: 7px;
`;

export function RightSidebar() {
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
      </RightSideContainer>
    </>
  );
}
