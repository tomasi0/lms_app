import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  getAllQuestions,
  searchQuestions,
  getQuestionById,
  createQuestion,
  getCurrentUser,
  answerQuestion,
  deleteQuestion,
} from "../../../Api/CommunityApi/CommunityApi";

import { Navbar } from "../Navbar";
import { LeftSidebar, RightSidebar } from "../Sidebar";

// Styled-components
const Container = styled.div`
  background-color: #0f1015;
  color: #e0e0e0;
  min-height: 100vh;
  padding: 20px;
  width: 70%; 
  margin: 0 auto; /* 화면 중앙에 배치 */
  margin-top: 5%;
`;

const Header = styled.h1`
  color: #e0e0e0;
  text-align: center;
`;

const Button = styled.button`
  background-color: #00adb5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  width: 18%; /* 나머지 18%는 버튼이 차지 */
  margin-left: 2%; /* input과 button 간의 간격 */
  
  &:hover {
    background-color: #0056b3;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CategoryButton = styled.button`
  background-color: ${(props) => (props.$active ? "#23262d" : "#1c1e24")};
  color: #ffffff;
  border: none;
  padding: 8px 15px;
  margin-right: 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #00adb5;
  }
`;

const WriteButton = styled.button`
  background-color: #00adb5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: auto;
  width: auto;
  height: auto;
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: center; /* 가로 중앙 정렬 */
  text-align: center;
  white-space: nowrap; /* 텍스트가 한 줄로 표시되도록 설정 */

  &:hover {
    background-color: #0056b3;
  }
`;

const Input = styled.input`
  background-color: #23262d;
  border: 1px solid #444;
  color: #ffffff;
  padding: 10px;
  border-radius: 5px;
  width: 80%; /* 전체 가로의 80%를 input이 차지 */
  
  &::placeholder {
    color: #b0b0b0;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th, td {
    padding: 10px;
    border: 1px solid #444;
    text-align: left;
    height: 50px; /* 세로 높이를 50px로 고정 */
    vertical-align: middle; /* 텍스트가 중앙에 오도록 설정 */
    font-size: 14px; /* 다른 컬럼들과 글씨 크기 맞추기 */
  }

  th:nth-child(1), td:nth-child(1) {
    width: 10%; /* No */
  }

  th:nth-child(2), td:nth-child(2) {
    width: 10%; /* 카테고리 */
  }

  th:nth-child(3), td:nth-child(3) {
    width: 50%; /* 제목 */
  }

  th:nth-child(4), td:nth-child(4) {
    width: 10%; /* 작성자 */
  }

  th:nth-child(5), td:nth-child(5) {
    width: 10%; /* 등록일 */
  }

  th:nth-child(6), td:nth-child(6) {
    width: 10%; /* 답변상태 */
  }

  th {
    background-color: #1c1e24;
    color: #ffffff;
  }

  td {
    background-color: #23262d;
    color: #e0e0e0;
  }

  /* 제목 컬럼에만 hover 적용 */
  td.title:hover {
    background-color: #00adb5;
    color: #ffffff;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center; /* 가로 가운데 정렬 */
  align-items: center; /* 세로 가운데 정렬 */
  margin-top: 20px;
  gap: 15px; /* 버튼과 페이지 정보 사이 간격 추가 */
`;

const PaginationButton = styled.button`
  background-color: #00adb5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;

  &:disabled {
    background-color: #444; /* 비활성화 시 색상 변경 */
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }
`;

const QuestionForm = styled.form`
  background-color: #1c1e24;
  padding: 20px;
  border-radius: 10px;
  color: #e0e0e0;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  label {
    font-weight: bold;
    margin-bottom: 5px;
    display: block;
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: 10px;
    border: 1px solid #444;
    border-radius: 5px;
    margin-bottom: 15px;
    background-color: #23262d;
    color: #ffffff;
  }

  textarea {
    min-height: 100px;
  }

  button {
    background-color: #00adb5;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 10px;

    &:hover {
      background-color: #0056b3;
    }

    &:last-child {
      background-color: #ff5722;

      &:hover {
        background-color: #e64a19;
      }
    }
  }
`;

const QuestionDetailContainer = styled.div`
  background-color: #1c1e24;
  padding: 20px;
  border-radius: 10px;
  color: #e0e0e0;
  margin-top: 20px;
`;

const QuestionTitle = styled.h3`
  color: #00adb5;
  margin-bottom: 20px;
  font-size: 1.5em;
`;

const InfoText = styled.p`
  margin: 10px 0;
  font-size: 1em;
  strong {
    font-weight: bold;
    color: #f7b731;
  }
`;

const AnswerSection = styled.div`
  margin-top: 20px;
  h4 {
    color: #00adb5;
    margin-bottom: 10px;
  }
  p {
    background-color: #23262d;
    padding: 10px;
    border-radius: 5px;
  }
`;

const AdminSection = styled.div`
  margin-top: 20px;
  
  h3 {
    color: #00adb5;
    text-align: left; /* h3를 좌측 정렬 */
    width: 100%; /* 좌측 정렬을 위해 전체 너비 차지 */
  }

  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #444;
    border-radius: 5px;
    background-color: #23262d;
    color: white;
    min-height: 100px;
    margin-bottom: 20px;
  }

  display: flex;
  flex-direction: column;
  align-items: flex-end; /* 나머지 요소는 우측 정렬 */
`;

const ActionButton = styled(Button)`
  margin-right: 10px;
  &:last-child {
    background-color: #00adb5;
    &:hover {
      background-color: #30619c;
    }
  }
`;


export function QAModal() {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [category, setCategory] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    content: "",
    category: "01",
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [answerContent, setAnswerContent] = useState("");
  const pageSize = 5;

  const fetchQuestions = async (page = 1, selectedCategory = "all") => {
    try {
      const data = await getAllQuestions(
        page - 1,
        pageSize,
        selectedCategory !== "all" ? selectedCategory : null
      );
      setQuestions(data.content);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const checkLoginStatus = async () => {
    try {
      const user = await getCurrentUser();
      if (user && user.userId) {
        setIsLoggedIn(true);
        setCurrentUser(user);

        if (user.authority && typeof user.authority === "object") {
          const isAdminUser = user.authority.authorityName === "ROLE_ADMIN";
          setIsAdmin(isAdminUser);
        }
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const toggleAnswerForm = () => {
    setShowAnswerForm(!showAnswerForm);
  };

  const handleSearch = async () => {
    try {
      if (keyword.trim()) {
        const data = await searchQuestions(keyword, currentPage - 1, pageSize);
        setQuestions(data.content);
        setTotalPages(data.totalPages);
      } else {
        fetchQuestions(currentPage, category);
      }
    } catch (error) {
      console.error("Error searching questions:", error);
    }
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!currentUser || !currentUser.userId) {
      alert("로그인 정보가 유효하지 않습니다.");
      return;
    }

    try {
      const questionData = {
        lmsQaTitle: newQuestion.title,
        lmsQaContent: newQuestion.content,
        categoryId: newQuestion.category,
        lmsQaWritingDate: new Date().toISOString().split("T")[0],
        user: {
          userId: currentUser.userId,
          userNameKor: currentUser.userNameKor,
        },
      };
      await createQuestion(questionData);

      alert("질문이 등록됐습니다.");

      setNewQuestion({ title: "", content: "", category: "01" });
      setSelectedQuestion(null);
      fetchQuestions(currentPage, category);
    } catch (error) {
      console.error("Error creating question:", error);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerContent.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    try {
      await answerQuestion(selectedQuestion.lmsQaSeq, {
        lmsQaAnswerContent: answerContent,
        lmsQaAnswerWriter: currentUser.userNameKor,
        lmsQaAnswerDate: new Date().toISOString().split("T")[0],
      });
      alert("답변이 등록되었습니다.");
      setAnswerContent("");
      loadQuestionDetails(selectedQuestion.lmsQaSeq);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const loadQuestionDetails = async (questionId) => {
    try {
      const question = await getQuestionById(questionId);
      setAnswerContent(question.lmsQaAnswerContent || "");
      setSelectedQuestion(question);
    } catch (error) {
      console.error("Error loading question details:", error);
    }
  };

  const goBackToList = () => {
    setSelectedQuestion(null);
    setShowAnswerForm(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchQuestions(newPage, category);
    }
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1);
    fetchQuestions(1, newCategory);
  };

  const handleDeleteQuestion = async () => {
    try {
      await deleteQuestion(selectedQuestion.lmsQaSeq);
      alert("게시글이 삭제되었습니다.");
      goBackToList();
      fetchQuestions(currentPage, category);
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchQuestions(currentPage, category);
    checkLoginStatus();
  }, [category, currentPage]);

    return (
    <>
            {/* <Navbar />
      <LeftSidebar /> */}

    <Container>
      <Header>질의응답</Header>

      {!selectedQuestion && (
        <>
          <ButtonContainer>
            <CategoryButton
              active={category === "all"}
              onClick={() => handleCategoryChange("all")}
            >
              전체
            </CategoryButton>
            <CategoryButton
              active={category === "01"}
              onClick={() => handleCategoryChange("01")}
            >
              수강문의
            </CategoryButton>
            <CategoryButton
              active={category === "02"}
              onClick={() => handleCategoryChange("02")}
            >
              회원정보
            </CategoryButton>
            <CategoryButton
              active={category === "03"}
              onClick={() => handleCategoryChange("03")}
            >
              시스템
            </CategoryButton>
            <CategoryButton
              active={category === "99"}
              onClick={() => handleCategoryChange("99")}
            >
              기타
            </CategoryButton>
            <WriteButton>
              {isLoggedIn && (
                <Button onClick={() => setSelectedQuestion("new")}>질문 작성</Button>
              )}
            </WriteButton>
            </ButtonContainer>

          <div style={{ marginTop: "20px" }}>
            <Input
              type="text"
              placeholder="검색어를 입력하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button onClick={handleSearch}>검색</Button>
          </div>

          <Table>
            <thead>
              <tr>
                <th>No</th>
                <th>카테고리</th>
                <th>제목</th>
                <th>작성자</th>
                <th>등록일</th>
                <th>답변상태</th>
              </tr>
            </thead>
            <tbody>
            {questions.map((question, index) => (
              <tr key={question.lmsQaSeq}>
                <td>{index + 1 + (currentPage - 1) * pageSize}</td>
                <td>
                  {question.categoryId === "01"
                    ? "수강문의"
                    : question.categoryId === "02"
                    ? "회원정보"
                    : question.categoryId === "03"
                    ? "시스템"
                    : "기타"}
                </td>
                <td
                  className="title"  // 제목 컬럼에 클래스 추가
                  style={{ cursor: "pointer" }}
                  onClick={() => loadQuestionDetails(question.lmsQaSeq)}
                >
                  {question.lmsQaTitle}
                </td>
                <td>{question.user?.userNameKor || "알 수 없음"}</td>
                <td>{question.lmsQaWritingDate}</td>
                <td>{question.lmsQaAnswerCheck === "Y" ? "완료" : "대기"}</td>
              </tr>
            ))}
          </tbody>
          </Table>
          <PaginationContainer>
            <div style={{ marginTop: "20px" }}>
              <PaginationButton
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                이전
              </PaginationButton>
              <span>
                {currentPage} / {totalPages}
              </span>
              <PaginationButton
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                다음
              </PaginationButton>
            </div>
          </PaginationContainer>
          
        </>
      )}

      {selectedQuestion === "new" && (
        <QuestionForm onSubmit={handleSubmitQuestion}>
          <h2>새 질문 작성</h2>
          <div>
            <label>카테고리: </label>
            <select
              value={newQuestion.category}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, category: e.target.value })
              }
            >
              <option value="01">수강문의</option>
              <option value="02">회원정보</option>
              <option value="03">시스템</option>
              <option value="99">기타</option>
            </select>
          </div>
          <div>
            <label>제목: </label>
            <input
              type="text"
              value={newQuestion.title}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, title: e.target.value })
              }
              required
              placeholder="제목을 입력하세요"  // 제목 입력 필드에 placeholder 추가
            />
          </div>
          <div>
            <label>내용: </label>
            <textarea
              value={newQuestion.content}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, content: e.target.value })
              }
              required
              placeholder="내용을 입력하세요"  // 내용 입력 필드에 placeholder 추가
            />
          </div>
          <button type="submit">질문 등록</button>
          <button type="button" onClick={() => goBackToList()}>취소</button>
        </QuestionForm>
      )}

      {selectedQuestion && selectedQuestion !== "new" && (
        <QuestionDetailContainer>
          <QuestionTitle>{selectedQuestion.lmsQaTitle}</QuestionTitle>
          <InfoText>
            <strong>작성자:</strong> {selectedQuestion.user?.userNameKor || "알 수 없음"}
          </InfoText>
          <InfoText>
            <strong>작성일:</strong> {selectedQuestion.lmsQaWritingDate}
          </InfoText>
          <InfoText>
            <strong>내용:</strong> {selectedQuestion.lmsQaContent}
          </InfoText>
          <InfoText>
            <strong>답변 상태:</strong>{" "}
            {selectedQuestion.lmsQaAnswerCheck === "Y" ? "완료" : "대기"}
          </InfoText>

          {selectedQuestion.lmsQaAnswerContent && (
            <AnswerSection>
              <h4>답변 내용</h4>
              <p>{selectedQuestion.lmsQaAnswerContent}</p>
            </AnswerSection>
          )}

          {isAdmin && (
            <AdminSection>
              <h3>답변 {selectedQuestion.lmsQaAnswerContent ? "수정" : "작성"}</h3>
              <textarea
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="답변 내용을 입력하세요."
              />
              <ActionButton onClick={handleSubmitAnswer}>
                {selectedQuestion.lmsQaAnswerContent ? "답변 수정" : "답변 등록"}
              </ActionButton>
            </AdminSection>
          )}
          
          <ActionButton onClick={goBackToList}>목록으로 돌아가기</ActionButton>
          
          {isAdmin && (
            <ActionButton onClick={handleDeleteQuestion}>게시글 삭제</ActionButton>
          )}
          
        </QuestionDetailContainer>
      )}
    </Container>
    </>
  );
}
