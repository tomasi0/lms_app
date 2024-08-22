import { useParams } from "react-router-dom";
import { getContentsByLectureId } from "../../../Api/LeaningApi/LeaningApi";
import { useEffect, useState } from "react";
import { getTeacherByLectureId } from "../../../Api/TeacherApi/TeacherApi";
import {
  getLecture,
  getLectureProgressDetails,
} from "../../../Api/LectureApi/LectureApi";
import styled from "styled-components";

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 5px;
  margin-right: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const PdfLink = styled.a`
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  cursor: pointer;

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
  color: #000;
  padding: 0;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
`;

export function Course() {
  const { userId, lectureId } = useParams();
  const [learning, setlearing] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [lecture, setLecture] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideoPath, setSelectedVideoPath] = useState("");

  useEffect(() => {
    Axios();
  }, [lectureId]);

  async function Axios() {
    // learning Content 데이터
    try {
      const learningData = await getContentsByLectureId(lectureId);
      setlearing(learningData);
      console.log("2", learningData);
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

  return (
    <>
      <p>　</p>
      <p>*Lecture Data*</p>
      <p>{lecture.lectureId}</p>
      <p>{lecture.lectureName}</p>
      <p>　</p>
      <p>*Teacher Data*</p>
      {teacher.map((data, index) => (
        <p key={index}>{data.teacherResume}</p>
      ))}
      <p>　</p>
      <p>*Progress Data*</p>
      {learning.map((data, index) => (
        <div key={index}>
          <p>{data.learning_contents_seq}차시</p>
          <p>{data.learning_contents}</p>
          <Button onClick={() => openModal(data.learning_video_path)}>
            동영상 보기
          </Button>
          <PdfLink href={data.learningPdf_path} target="_blank">
            PDF 보기
          </PdfLink>
        </div>
      ))}

      {isModalOpen && (
        <Modal>
          <CloseButton onClick={closeModal}>&times;</CloseButton>
          <ModalContent>
            <video controls style={{ width: "100%" }}>
              <source src={selectedVideoPath} type="video/mp4" />
            </video>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
