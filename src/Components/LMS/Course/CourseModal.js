import { useParams } from "react-router-dom";
import { getContentsByLectureId } from "../../../Api/LeaningApi/LeaningApi";
import { useEffect, useState } from "react";
import { getTeacherByLectureId } from "../../../Api/TeacherApi/TeacherApi";
import {
    getLecture,
    getLectureProgressDetails,
} from "../../../Api/LectureApi/LectureApi";
import styled, { keyframes } from "styled-components";

import { LeftSidebar } from "../Sidebar";
import { Navbar } from "../Navbar";

import { Unity, useUnityContext } from "react-unity-webgl";
import axios from "axios";

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

// 240904 수정
const Container = styled.div`
    box-sizing: border-box;
    /* padding: 176px 50px 0 240px; */
    padding: 30px;
    transition: all 0.3s;
    display: grid;
    /* grid-template-columns: 70% 30%; */
    animation: ${fadeIn} 0.6s ease-out;
    width: 100%;
`;
const CourseContentBox = styled.div`
    width: 100%;
    padding: 30px;
`;
const CourseSideMenu = styled.div``;

// 240904 font-size 추가
const Button = styled.button`
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 5px;
    margin-right: 10px;

    // font-size 추가
    font-size: 12px;

    &:hover {
        background-color: #0056b3;
    }
`;

// 240904 font-size 추가
const PdfLink = styled.a`
    background-color: #28a745;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    text-decoration: none;
    cursor: pointer;

    // font-size 추가
    font-size: 12px;

    &:hover {
        background-color: #218838;
    }
`;

const Modal = styled.div`
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 70%;
    max-width: 800px;
    position: relative;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 30px;
    cursor: pointer;
    background: none;
    border: none;
    color: #fff;
    padding: 0;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
`;
const ContentTitle = styled.p`
    font-size: 24px;
    font-weight: 600;
    margin: 20px 0;
    line-height: 1.4;
    color: #ffce48;
    background-color: transparent;
    border-bottom: 1px outset #fff;
`;

const ContentText = styled.p`
    font-size: 15px;
    color: #fff;
    background-color: transparent;
    line-height: 2;
`;

const LectureImg = styled.img`
    width: 100%;
    border-radius: 12px;
`;

// 스타일 컴포넌트 정의
const Table = styled.table`
    width: 100%;
`;

const TableHead = styled.thead`
    color: white;
`;

const TableRow = styled.tr`
    border-bottom: 1px solid #ddd;

    /* &:nth-child(even) {
    background-color: #f9f9f9;
  }

  &:hover {
    background-color: #f1f1f1;
  } */
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

const CourseOption = styled.div`
    background-color: #1c1f27;
    margin-bottom: 20px;
    border-radius: 12px;
    width: 100%;
    padding: 20px;
    position: relative;
`;

const LectureName = styled.p`
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 12px;
    line-height: 1.4;
    color: #ffce48;
    background-color: transparent;
`;

const LectureContentText = styled.p`
    font-size: 15px;
    color: #fff;
    background-color: transparent;
    line-height: 2;
`;

const formatPlaytime = (playtime) => {
    if (playtime.length !== 6) return "00:00:00";
    const hours = playtime.substring(0, 2);
    const minutes = playtime.substring(2, 4);
    const seconds = playtime.substring(4, 6);
    return `${hours}:${minutes}:${seconds}`;
};

export function CourseModal({ userId, lectureId, onClose }) {
    // const { userId, lectureId } = useParams();

    const [learning, setlearing] = useState([]);
    const [teacher, setTeacher] = useState([]);
    const [lecture, setLecture] = useState([]);

    const [progress, setProgress] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVideoPath, setSelectedVideoPath] = useState("");
    const [remainingDays, setRemainingDays] = useState("");

    let qaUrl = "";

    useEffect(() => {
        Axios();
    }, [lectureId]);

    async function Axios() {
        // learning Content 데이터
        try {
            const learningData = await getContentsByLectureId(lectureId);
            setlearing(learningData);
        } catch (error) {
            console.log("leaning Error", error);
        }

        // Teacher 데이터
        try {
            const teacherData = await getTeacherByLectureId(lectureId);
            setTeacher(teacherData);
        } catch (error) {
            console.log("Teacher Error", error);
        }

        // Lecture 데이터
        try {
            const lectureData = await getLecture(lectureId);
            setLecture(lectureData);
        } catch (error) {
            console.log("Lecture Error", error);
        }

        try {
            const progressData = await getLectureProgressDetails(
                userId,
                lectureId
            );
            setProgress(progressData);
        } catch (error) {
            console.log("Progress Error", error);
        }
    }

    // 강의 path
    const openModal = (videoPath) => {
        setSelectedVideoPath(videoPath);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedVideoPath("");
    };

    useEffect(() => {
        const calculateRemainingDays = () => {
            const currentDate = new Date();
            const endDate = new Date(lecture.applicationPeriodEndDate);

            // 날짜 차이 계산 (단위: 일)
            const timeDifference = endDate - currentDate;
            const dayDifference = Math.ceil(
                timeDifference / (1000 * 3600 * 24)
            );

            // 남은 교육일 설정
            setRemainingDays(dayDifference);
        };

        calculateRemainingDays();
    }, [lecture.applicationPeriodEndDate]);

    console.log(learning);
    console.log("2", progress);

    const maxLength = Math.max(learning.length, progress.length);

    function CreateQAUrl(lectureId, learningContentsSeq) {
        // const urlLectureContentQA = `http://localhost:8080/learning/contents/qa/${lectureId}/${learningContentsSeq}`; // /{lectureId}/{learningContentsSeq}
        qaUrl = `http://localhost:8080/learning/contents/qa/${lectureId}/${learningContentsSeq}`; // /{lectureId}/{learningContentsSeq}

        // window.alert("CreateQAUrl qaUrl: " + qaUrl);
        onClose(qaUrl);
    }

    return (
        <>
            {/* <Navbar />
            <LeftSidebar /> */}
            <Container>
                <CourseContentBox>
                    <ContentTitle>{lecture.lectureName}</ContentTitle>
                    <ContentText>{lecture.educationOverview}</ContentText>
                    <ContentTitle>교제정보</ContentTitle>
                    <ContentText>{lecture.textbookInformation}</ContentText>
                    <p>　</p>
                    <ContentTitle>강사</ContentTitle>
                    {teacher.map((data, index) => (
                        <ContentText key={index}>
                            {data.teacherResume}
                        </ContentText>
                    ))}

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeader>차시</TableHeader>
                                <TableHeader>내용</TableHeader>
                                <TableHeader>동영상 보기</TableHeader>
                                <TableHeader>PDF 보기</TableHeader>
                                <TableHeader>Quiz 풀기</TableHeader>
                                <TableHeader>재생 시간</TableHeader>
                                {/* <TableHeader>완료날짜</TableHeader> */}
                                {/* <TableHeader>완료 날짜</TableHeader>
                <TableHeader>최종 학습 날짜</TableHeader> */}
                                <TableHeader>학습 횟수</TableHeader>
                                <TableHeader>학습 시간</TableHeader>
                                {/* <TableHeader>학습 시간</TableHeader> */}
                            </TableRow>
                        </TableHead>
                        <tbody>
                            {Array.from({ length: maxLength }, (_, index) => {
                                const learningData = learning[index] || {};
                                const progressData = progress[index] || {};

                                return (
                                    <TableRow key={index}>
                                        <TableData>
                                            {learningData.learningContentsSeq}
                                            차시
                                        </TableData>
                                        <TableData>
                                            {learningData.learningContents}
                                        </TableData>
                                        <TableData>
                                            <Button
                                                onClick={() =>
                                                    openModal(
                                                        learningData.learningVideo_path
                                                    )
                                                }
                                            >
                                                동영상 보기
                                            </Button>
                                        </TableData>
                                        <TableData>
                                            <PdfLink
                                                href={
                                                    learningData.learningPdf_path
                                                }
                                                target="_blank"
                                            >
                                                PDF 보기
                                            </PdfLink>
                                        </TableData>

                                        <TableData>
                                            <Button
                                                onClick={() => {
                                                    // window.alert(
                                                    //     "강의ID: " +
                                                    //         lecture.lectureId +
                                                    //         ", " +
                                                    //         "차시: " +
                                                    //         data.learningContentsSeq
                                                    // );

                                                    // Unity 로 전달
                                                    CreateQAUrl(
                                                        lecture.lectureId,
                                                        learningData.learningContentsSeq
                                                    );
                                                }}
                                            >
                                                Quiz 풀기
                                            </Button>
                                        </TableData>

                                        <TableData>
                                            {formatPlaytime(
                                                learningData.learningPlaytime
                                            )}
                                        </TableData>
                                        {/* <TableData>
                      {learningData.completeLearningDatetime || ""}
                    </TableData> */}
                                        {/* <TableData>
                      {progressData.complete_learning_datetime}
                    </TableData>
                    <TableData>{progressData.last_learning_datetime}</TableData> */}
                                        <TableData>
                                            {progressData.learning_count}
                                        </TableData>
                                        <TableData>
                                            {progressData.learning_time}
                                            <br />
                                            {progressData.learning_playtime}
                                        </TableData>
                                    </TableRow>
                                );
                            })}
                        </tbody>
                    </Table>
                    {isModalOpen && (
                        <Modal>
                            <CloseButton onClick={closeModal}>
                                &times;
                            </CloseButton>
                            <ModalContent>
                                <video controls style={{ width: "100%" }}>
                                    <source
                                        src={selectedVideoPath}
                                        type="video/mp4"
                                    />
                                </video>
                            </ModalContent>
                        </Modal>
                    )}
                </CourseContentBox>
                {/* <CourseSideMenu>
                    <LectureImg src={lecture.imagePath} />
                    <CourseOption>
                        <LectureName>{lecture.lectureName}</LectureName>
                        <LectureContentText>
                            가격 :
                            {lecture.educationPrice === 0
                                ? "무료"
                                : `${lecture.educationPrice}원`}
                        </LectureContentText>
                        <LectureContentText>
                            학습기간 : {lecture.educationPeriodStartDate} ~{" "}
                            {lecture.educationPeriodEndDate}
                            <LectureContentText>
                                남은 교육일 : {remainingDays}일
                            </LectureContentText>
                        </LectureContentText>
                    </CourseOption>
                </CourseSideMenu> */}
            </Container>
        </>
    );
}
