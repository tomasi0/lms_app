import Modal from "react-modal";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLecture } from "../../../Api/LectureApi/LectureApi";
import styled, { keyframes } from "styled-components";
import {
    getContentsByLectureId,
    getReviewByLectureId,
} from "../../../Api/LeaningApi/LeaningApi";
import { getTeacherByLectureId } from "../../../Api/TeacherApi/TeacherApi";
import { getCurrentUser } from "../../../Api/UserApi/UserApi";
import {
    getAllRegistration,
    getCourseRegistraionById,
    saveCourseRegistration,
} from "../../../Api/CourseApi/CourseApi";

import { Navbar } from "../Navbar";
import { LeftSidebar } from "../Sidebar";
import { CartLectureIcon } from "../../../Utils/svg";

import { CourseModal } from "../Course/CourseModal";

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

const LectureHeaderImg = styled.div`
    padding: 176px 50px 0 240px;
    width: 100%;
    height: 350px;
    background-image: url("/reactimage/LectureDetail.png");
    background-size: cover;
    background-position: center;
    border-radius: 15px;
`;

// 240904 수정
const Container = styled.div`
    box-sizing: border-box;
    /* padding: 30px 50px 0 240px; */
    padding: 30px 50px 0 50px;
    transition: all 0.3s;
    display: grid;
    grid-template-columns: 70% 30%;
    animation: gqZZDf 0.6s ease-out;
    width: 100%;
`;

const LectureContainer = styled.div`
    width: 100%;
    padding: 30px;
`;

const LectureImg = styled.img`
    width: 100%;
    border-radius: 12px;
`;

const LectureSideMenu = styled.div``;

const LectureName = styled.p`
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 12px;
    line-height: 1.4;
    color: #ffce48;
    background-color: transparent;
`;

const LectureOption = styled.div`
    background-color: #1c1f27;
    margin-bottom: 20px;
    border-radius: 12px;
    width: 100%;
    padding: 20px;
    position: relative;
`;

const LectureContentTitle = styled.p`
    font-size: 24px;
    font-weight: 600;
    margin: 20px 0;
    line-height: 1.4;
    color: #ffce48;
    background-color: transparent;
    border-bottom: 1px outset #fff;
`;
const LectureContentText = styled.p`
    font-size: 15px;
    color: #fff;
    background-color: transparent;
    line-height: 2;
`;

const BtnBox = styled.div`
    width: 36px;
    height: 36px;
    background-color: #1c1f27;
    border: 0;
    margin-right: 4px;
    color: #fff;
    border-radius: 4px;
    padding: 5px;
    cursor: pointer;
    position: absolute; /* 절대 위치 설정 */
    bottom: 10px; /* 부모 div의 맨 아래에서 10px 위에 위치 */
    right: 10px; /* 부모 div의 오른쪽에서 10px 왼쪽에 위치 */
    transition: background-color 0.3s, box-shadow 0.3s;

    &:hover {
        background-color: #3a3f49;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
`;

const LectureAddBtn = styled.button`
    width: 100%;
    height: 60px;
    background-color: #87ceeb;
    font-size: 16px;
    cursor: pointer;
    font-stretch: normal;
    font-style: normal;
    line-height: 63px;
    letter-spacing: normal;
    color: #333;
    border-radius: 12px;
    margin-bottom: 10px;
    font-weight: 700;
`;

const Table = styled.table`
    width: 100%;
`;

const TableHead = styled.thead`
    color: white;
`;

const TableRow = styled.tr`
    border-bottom: 1px solid #ddd;
`;

const TableHeader = styled.th`
    padding: 12px;
    background-color: #556b2f;
    text-align: center;
`;

const TableData = styled.td`
    padding: 12px;
    color: #fff;
`;

const NoReviews = styled.p`
    text-align: center;
    font-size: 18px;
    color: #666;
`;

// Sub Modal

// React Modal의 루트 엘리먼트를 설정합니다
Modal.setAppElement("#root");

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        transform: "translate(-50%, -50%)",
        width: "1300px", // 모달의 너비를 설정합니다. (기존 width)
        height: "800px", // 모달의 높이를 설정합니다. (기존 height)
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "rgba(15, 16, 21, 0.5)", // 배경색 설정
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.5)", // 오버레이의 배경색을 설정합니다.
    },
};

export function LectureDetailModal({ lectureId }) {
    // const { lectureId } = useParams();
    const [lecture, setLecture] = useState([]);
    const [content, setContent] = useState([]);
    const [teacher, setTeacher] = useState([]);
    const [review, setReview] = useState([]);
    const [userId, setUserId] = useState("");
    const [registration, setRegistration] = useState([]);
    const [course, setCourse] = useState(false);

    const navigate = useNavigate();

    // 로그인한 userId 가져오기
    useEffect(() => {
        async function getUserId() {
            try {
                const SessionData = await getCurrentUser();
                setUserId(SessionData.userId);
            } catch (error) {
                console.log("User Id Error", error);
            }
        }
        getUserId();
    }, []);

    // userId가 설정된 후에 Axios 호출
    useEffect(() => {
        if (userId) {
            Axios();
        }
    }, [userId]);

    // 수강신청
    async function courseAdd() {
        const courseRegistration = {
            user: {
                userId: userId,
            },
            lecture: {
                lectureId: lectureId,
            },
        };
        const confirm = window.confirm("수강신청 하시겠습니까 ?");
        if (!confirm) {
            return;
        }
        try {
            const courseAxios = await saveCourseRegistration(
                courseRegistration
            );
            alert("수강신청 되었습니다.");
        } catch (error) {
            console.log("Course Error", error);
        }
    }

    // 장바구니 담기
    async function cartAdd() {
        let userId;
        let cartList;
        if (!cartList) {
            try {
                const SessionData = await getCurrentUser();
                userId = SessionData.userId;
                cartList = JSON.parse(localStorage.getItem(userId));
                if (!cartList) {
                    cartList = [];
                }
                const lectureExists = cartList.some(
                    (item) => item.lectureId === lecture.lectureId
                );
                if (lectureExists) {
                    alert("중복");
                } else {
                    alert("장바구니에 담았습니다");
                    cartList.push(lecture);
                }

                localStorage.setItem(userId, JSON.stringify(cartList));
            } catch (error) {
                console.log("Session Error", error);
            }
        }
    }

    async function Axios() {
        // Lecture 데이터
        try {
            const LectureData = await getLecture(lectureId);
            setLecture(LectureData);
        } catch (error) {
            console.log("Lecture Error", error);
        }

        // Content 데이터
        try {
            const ContentData = await getContentsByLectureId(lectureId);
            setContent(ContentData);
        } catch (error) {
            console.log("Content Error", error);
        }

        // Teacher 데이터
        try {
            const TeacherData = await getTeacherByLectureId(lectureId);
            setTeacher(TeacherData);
        } catch (error) {
            console.log("Teacher Error", error);
        }

        // Review 데이터
        try {
            const ReviewData = await getReviewByLectureId(lectureId);
            setReview(ReviewData);
        } catch (error) {
            console.log("Review Error", error);
        }

        try {
            const registrationData = await getCourseRegistraionById(
                userId,
                lectureId
            );
            setRegistration(registrationData[0]);
            if (registrationData.length > 0 && registrationData[0]) {
                setCourse(true);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function CourseMove() {
        // navigate(`/course/${userId}/${lectureId}`);
        openModal(userId, lectureId);
    }

    /* Sub Modal 관련 */
    const [modalOpen, setModalOpen] = useState(false);
    // const [modalReturn, setModalReturn] = useState(null);
    const [modalContent, setModalContent] = useState(null);

    const openModal = (userId, lectureId) => {
        setModalContent({ userId, lectureId });
        setModalOpen(true);
    };

    // const closeModal = (qaUrl) => {
    const closeModal = () => {
        setModalOpen(false);
        setModalContent(null);

        // window.alert("MyPageLectureModal ModalResponse Message: " + qaUrl);
        // onClose(qaUrl);
    };

    return (
        <>
            {/* <Navbar />
      <LeftSidebar /> */}
            <LectureHeaderImg></LectureHeaderImg>
            <Container>
                <LectureContainer>
                    <LectureContentTitle>강의 목표</LectureContentTitle>
                    <LectureContentText>
                        {lecture.learningObjectives}
                    </LectureContentText>
                    <LectureContentTitle>강의 목차</LectureContentTitle>
                    {content.map((data, index) => (
                        <LectureContentText key={index}>
                            {index + 1}. {data.learningContents}
                        </LectureContentText>
                    ))}
                    <LectureContentTitle>강사</LectureContentTitle>
                    {teacher.map((data, index) => (
                        <LectureContentText key={index}>
                            {data.teacherResume}
                        </LectureContentText>
                    ))}
                    <LectureContentTitle>
                        리뷰
                        <p
                            style={{
                                color: "#fff",
                                float: "right",
                                fontSize: "14px",
                                paddingTop: "10px",
                            }}
                        >
                            {review.length}건
                        </p>
                    </LectureContentTitle>

                    {review && review.length > 0 ? (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeader>작성자</TableHeader>
                                    <TableHeader>제목</TableHeader>
                                    <TableHeader>내용</TableHeader>
                                </TableRow>
                            </TableHead>
                            <tbody>
                                {review.map((data, index) => (
                                    <TableRow key={index}>
                                        <TableData>
                                            {
                                                data.course_registration.user
                                                    .userNameKor
                                            }
                                        </TableData>
                                        <TableData>
                                            {data.learningReviewTitle}
                                        </TableData>
                                        <TableData>
                                            {data.learningReviewContent}
                                        </TableData>
                                    </TableRow>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <NoReviews>리뷰가 없습니다.</NoReviews>
                    )}
                </LectureContainer>
                <LectureSideMenu>
                    <LectureImg src={lecture.imagePath} alt="Lecture" />

                    <LectureOption>
                        <LectureName>{lecture.lectureName}</LectureName>
                        <LectureContentText>
                            가격 :{" "}
                            {lecture.educationPrice === 0
                                ? "무료"
                                : `${lecture.educationPrice}원`}
                        </LectureContentText>
                        <LectureContentText>
                            학습기간 : {lecture.educationPeriodStartDate} ~{" "}
                            {lecture.educationPeriodEndDate}
                            <LectureContentText>
                                교육시간 : {lecture.educationHours}시간
                            </LectureContentText>
                            <LectureContentText>
                                {/* 장르 : {lecture.category.categoryName} */}
                            </LectureContentText>
                            <BtnBox onClick={cartAdd}>
                                <CartLectureIcon />
                            </BtnBox>
                        </LectureContentText>
                    </LectureOption>
                    {course ? (
                        <LectureAddBtn onClick={CourseMove}>
                            ☞ 강의보기
                        </LectureAddBtn>
                    ) : (
                        <LectureAddBtn onClick={courseAdd}>
                            수강신청
                        </LectureAddBtn>
                    )}
                </LectureSideMenu>
            </Container>
            {/* 서브 모달 */}
            <Modal
                isOpen={modalOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Course"
            >
                <span
                    className="close"
                    onClick={closeModal}
                    style={{
                        cursor: "pointer",
                        fontSize: "1.5rem",
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        color: "white", // 버튼 색상을 하얀색으로 설정
                    }}
                >
                    &times;
                </span>
                <div
                    className="subModalContent"
                    style={{
                        width: "1240px",
                        height: "740px",
                        // overflow: "hidden",
                        overflow: "auto", // 스크롤을 활성화합니다.
                    }}
                >
                    {/* 모달 콘텐츠를 동적으로 렌더링할 수 있습니다 */}
                    {/* {modalContent ? (
                        <iframe
                            src={modalContent}
                            style={{ width: "100%", height: "100%" }}
                            title="Course"
                        />
                    ) : (
                        <p>Loading...</p>
                    )} */}

                    {modalContent ? (
                        // <iframe
                        //     src={modalContent}
                        //     style={{ width: "100%", height: "100%" }}
                        //     title="Course"
                        // />

                        <CourseModal
                            userId={modalContent.userId}
                            lectureId={modalContent.lectureId}
                            onClose={closeModal}
                        />
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </Modal>
        </>
    );
}
