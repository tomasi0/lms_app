import { useEffect, useState } from "react";
import { getCurrentUser } from "../../../Api/UserApi/UserApi";
import { saveCourseRegistration } from "../../../Api/CourseApi/CourseApi";
import { RightSidebarModal } from "../SidebarModal";
import styled from "styled-components";

const Container = styled.div`
    /* padding: 176px 275px 0 240px; */
    padding: 30px;
    height: 2000px;
`;

const CartTitle = styled.p`
    color: #ffce48;
    font-size: 28px;
    font-weight: 500;
`;

const CartForm = styled.div`
    width: 80%;
    background-color: #fff;
    position: relative;
    padding: 18px 0 25px;
    overflow: hidden;
    background-color: #1a1b24;
    border-radius: 12px;
    padding: 28px;
    margin-bottom: 20px;
    display: grid;
    grid-template-columns: 5% 95%;
`;

const CartContent = styled.div`
    display: grid;
    grid-template-columns: 30% 70%;
`;

const CartImgBox = styled.div`
    width: 100%;
    padding: 20px;
    background-color: transparent;
`;
const CartTextBox = styled.div`
    width: 100%;
    padding: 30px 20px 20px 20px;
    background-color: transparent;
`;

const Chk = styled.input`
    width: 15px;
    cursor: pointer;
`;

const ChkAll = styled.div`
    width: 80%;
    background-color: bule;
    background-color: transparent;
    text-align: left;
    /* margin: 10px; */
    padding: 10px 10px 10px 20px;
`;

const CartItem = styled.div`
    width: 100%;
    color: #fff;
    /* background-color: #fff; */
    /* display: grid;
  grid-template-columns: 10% 90%; */
    background-color: transparent;
    font-size: 18px;
`;

const LectureImg = styled.img`
    width: 100%;
    background-color: transparent;
`;

const RemoveBtnBox = styled.div`
    width: 80%;
    position: relative;
    padding: 10px;
`;
const RemoveBtn = styled.button`
    position: absolute;
    left: 10px;
    width: 120px;
    padding: 10px 20px;
    background-color: #444;
    color: #fff;
    border: 2px solid #1f2025;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
        background-color: #ff5555;
        transform: scale(1.05);
    }

    &:active {
        background-color: #cc4444;
        transform: scale(1);
    }
`;

const CartNoneBox = styled.div`
    width: 100%;
    margin-top: 50px;
`;

const CartNone = styled.div`
    width: 500px;
    height: 500px;
    margin: 0 auto;
`;

const CartNoneImg = styled.img`
    width: 100%;
    animation: circlemove 1.5s infinite linear;

    @keyframes circlemove {
        0%,
        100% {
            transform: translate(0%, 3%);
        }
        50% {
            transform: translate(0%, 0%);
        }
    }
`;

const CartNoneText = styled.p`
    color: #fff;
    text-align: center;
    font-size: 30px;
    font-weight: 800;
`;

const CourseBtn = styled.button`
    position: absolute;
    right: 10px;
    width: 120px;
    padding: 10px 20px;
    background-color: #444;
    color: #fff;
    border: 2px solid #1f2025;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
        background-color: #1e90ff;
        transform: scale(1.05);
    }

    &:active {
        background-color: #1c75d1;
        transform: scale(1);
    }
`;

const LectureMoveBox = styled.div`
    width: 100%;
    text-align: center;
    margin-top: 20px;
`;

const LectureMoveBtn = styled.button`
    width: 120px;
    padding: 10px 20px;
    background-color: #1e90ff;
    color: #fff;
    border: 2px solid #1f2025;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
        background-color: #444;
        transform: scale(1.05);
    }

    &:active {
        background-color: #1c75d1;
        transform: scale(1);
    }
`;

export function CartModal() {
    const [cart, setCart] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [userId, setUserId] = useState("");
    const [cartData, setCartData] = useState(false);

    useEffect(() => {
        cartList();
    }, []);

    // 수강신청
    async function courseAdd() {
        if (checkedItems.length === 0) {
            alert("수강신청할 항목을 선택해주세요.");
            return;
        }

        const confirm = window.confirm(
            `선택한 ${checkedItems.length}개의 항목을 수강신청 하시겠습니까?`
        );
        if (!confirm) {
            return;
        }

        try {
            for (const lectureId of checkedItems) {
                const courseRegistration = {
                    user: {
                        userId: userId,
                    },
                    lecture: {
                        lectureId: lectureId,
                    },
                };
                await saveCourseRegistration(courseRegistration);

                let updatedCart = cart.filter(
                    (item) => !checkedItems.includes(item.lectureId)
                );

                // localStorage 업데이트
                localStorage.setItem(userId, JSON.stringify(updatedCart));
                setCart(updatedCart);
                setCheckedItems([]);
                setSelectAll(false);
            }
            alert("선택된 항목들이 수강신청 되었습니다.");
        } catch (error) {
            console.log("Course Error", error);
        }
    }

    // 장바구니 리스트
    async function cartList() {
        try {
            const SessionData = await getCurrentUser();
            const userId = SessionData.userId;
            setUserId(userId);
            const getCartList = localStorage.getItem(userId);
            const cartList = getCartList ? JSON.parse(getCartList) : [];
            setCart(Array.isArray(cartList) ? cartList : []);

            if (cartList.length === 0) {
                setCartData(true);
            } else {
                setCartData(false);
            }
        } catch (error) {
            console.error("Cart List Error:", error);
        }
    }
    console.log(cartData);

    const handleCheckboxChange = (lectureId) => {
        setCheckedItems((prevCheckedItems) => {
            if (prevCheckedItems.includes(lectureId)) {
                return prevCheckedItems.filter((id) => id !== lectureId);
            } else {
                return [...prevCheckedItems, lectureId];
            }
        });
    };

    const handleSelectAllChange = () => {
        if (selectAll) {
            setCheckedItems([]);
        } else {
            setCheckedItems(cart.map((item) => item.lectureId));
        }
        setSelectAll(!selectAll);
    };

    async function cartRemove() {
        if (checkedItems.length === 0) {
            alert("삭제할 항목을 선택해주세요.");
            return;
        }

        // 사용자에게 삭제 확인 대화상자 표시
        const confirm = window.confirm(
            `선택한 ${checkedItems.length}개의 항목을 장바구니에서 삭제하시겠습니까?`
        );
        if (!confirm) {
            return;
        }

        try {
            const SessionData = await getCurrentUser();
            const userId = SessionData.userId;
            let cartList = JSON.parse(localStorage.getItem(userId)) || [];

            cartList = cartList.filter(
                (item) => !checkedItems.includes(item.lectureId)
            );

            localStorage.setItem(userId, JSON.stringify(cartList));
            setCart(cartList);
            setCheckedItems([]);
            setSelectAll(false);
        } catch (error) {
            console.log("Remove Error", error);
        }
    }

    return (
        <>
            {/* <Navbar />
      <LeftSidebar /> */}
            <RightSidebarModal />
            <Container>
                <CartTitle>장바구니</CartTitle>
                {/* <ChkAll></ChkAll>
        <CartForm>
          <Chk></Chk>
          <CartItem></CartItem>
        </CartForm> */}

                <div>
                    {cart.length > 0 ? (
                        <>
                            <ChkAll>
                                <Chk
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAllChange}
                                />
                                <p
                                    style={{
                                        color: "#fff",
                                        display: "inline-block",
                                    }}
                                >
                                    전체선택
                                </p>
                            </ChkAll>
                            {cart.map((lecture, index) => (
                                <CartForm key={index}>
                                    <Chk
                                        type="checkbox"
                                        checked={checkedItems.includes(
                                            lecture.lectureId
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                lecture.lectureId
                                            )
                                        }
                                    />
                                    <CartContent>
                                        <CartImgBox>
                                            <LectureImg
                                                src={lecture.imagePath}
                                            ></LectureImg>
                                        </CartImgBox>
                                        <CartTextBox>
                                            <CartItem>
                                                강의명 : {lecture.lectureName}
                                            </CartItem>

                                            <CartItem>
                                                가격 : {lecture.educationPrice}
                                            </CartItem>
                                            <CartItem>
                                                카테고리 :{" "}
                                                {lecture.category.categoryName}
                                            </CartItem>
                                        </CartTextBox>
                                    </CartContent>
                                </CartForm>
                            ))}
                            <RemoveBtnBox>
                                <RemoveBtn onClick={cartRemove}>삭제</RemoveBtn>
                                <CourseBtn onClick={courseAdd}>
                                    수강하기
                                </CourseBtn>
                            </RemoveBtnBox>
                        </>
                    ) : (
                        <CartNoneBox>
                            <CartNone>
                                <CartNoneImg src="/reactimage/Cart.png"></CartNoneImg>
                            </CartNone>
                            <CartNoneText>장바구니가 비었습니다</CartNoneText>
                            <LectureMoveBox>
                                {/* <LectureMoveBtn onClick={() => navigate("/lecture")}>
                  강의보기
                </LectureMoveBtn> */}
                            </LectureMoveBox>
                        </CartNoneBox>
                    )}
                </div>
            </Container>
        </>
    );
}
