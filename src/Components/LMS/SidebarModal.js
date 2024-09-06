import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";

import {
    BookIcon,
    CartSideIcon,
    GameIcon,
    InstagramIcon,
    LectureSideIcon,
    SettingIcon,
    UserIcon,
    UserSideIcon,
} from "../../Utils/svg";
import { getCurrentUser } from "../../Api/UserApi/UserApi";
import { getLectureStatusCountJPQL } from "../../Api/CourseApi/CourseApi";
// import "https://use.fontawesome.com/releases/v5.6.1/css/all.css";

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
    // 240905 추가
    margin: 50px 20px 0px 0px;
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
    color: #fff;
    padding-bottom: 6px;
    background-color: transparent;
    text-align: center;
    padding-top: 7px;
`;

export function RightSidebarModal() {
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
