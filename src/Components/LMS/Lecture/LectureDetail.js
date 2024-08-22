import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLecture } from "../../../Api/LectureApi/LectureApi";
import styled from "styled-components";
import {
  getContentsByLectureId,
  getReviewByLectureId,
} from "../../../Api/LeaningApi/LeaningApi";
import { getTeacherByLectureId } from "../../../Api/TeacherApi/TeacherApi";
import { getCurrentUser } from "../../../Api/UserApi/UserApi";
import { saveCourseRegistration } from "../../../Api/CourseApi/CourseApi";

const Container = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 20% 80%;
`;

const SideMenu = styled.div`
  width: 100%;
  border: 1px solid black;
`;

const Test = styled.div`
  width: 100%;
  border: 1px solid yellow;
`;

const LectureImg = styled.img`
  width: 50%;
`;

export function LectureDetail() {
  const { lectureId } = useParams();
  const [lecture, setLecture] = useState([]);
  const [content, setContent] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [review, setReview] = useState([]);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    Axios();
  }, [lectureId]);

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
      const courseAxios = await saveCourseRegistration(courseRegistration);
      alert("수강신청 되었습니다");
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

  // 장바구니 삭제
  async function cartRemove() {
    let userId;
    let cartList;

    try {
      const SessionData = await getCurrentUser();
      userId = SessionData.userId;
      cartList = JSON.parse(localStorage.getItem(userId));

      if (cartList) {
        cartList = cartList.filter((item) => item.lectureId !== lectureId);
        localStorage.setItem(userId, JSON.stringify(cartList));
      }
    } catch (error) {
      console.log("Session Error", error);
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
  }

  async function CourseMove() {
    navigate(`/course/${userId}/${lectureId}`);
  }

  return (
    <Container>
      <SideMenu></SideMenu>
      <Test>
        <LectureImg src={lecture.imagePath}></LectureImg>
        <p>*Lecture Data*</p>
        <p>Lecture ID: {lectureId}</p>
        <p>Lecture Title: {lecture.lectureName}</p>
        <p>Lecture Description: {lecture.learningObject}</p>
        <p>　</p>
        <p>*Content Data*</p>
        {content.map((data, index) => (
          <p key={index}>
            {index}.{data.learningContents}
          </p>
        ))}
        <p>　</p>
        <p>*Teacher Data*</p>
        {teacher.map((data, index) => (
          <p key={index}>{data.teacherResume}</p>
        ))}
        <p>　</p>
        <p>*Review Data*</p>
        {review && review.length > 0 ? (
          review.map((data, index) => (
            <div key={index}>
              <p>{data.course_registration.user.userNameKor}</p>
              <p>{data.learningReviewTitle}</p>
              <p>{data.learningReviewContent}</p>
            </div>
          ))
        ) : (
          <p>리뷰가 없습니다.</p>
        )}
        <p>　</p>
        <p>*CartAdd*</p>
        <button onClick={cartAdd}>장바구니</button>
        <p>　</p>
        <p>*CartRemove*</p>
        <button onClick={cartRemove}>삭제</button>
        <p>　</p>
        <p>*Course Add*</p>
        <button onClick={courseAdd}>수강하기</button>
        <p>　</p>
        <p>*Course View*</p>
        <button onClick={CourseMove}>강의보기</button>
      </Test>
    </Container>
  );
}
