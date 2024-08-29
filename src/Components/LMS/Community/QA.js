import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  getAllQuestions,
  searchQuestions,
  getQuestionById,
  createQuestion,
  getCurrentUser,
  answerQuestion, // 답변 API 추가
  deleteQuestion,
} from "../../../Api/CommunityApi/CommunityApi"; // 필요한 API 가져오기

export function QA() {
  const [questions, setQuestions] = useState([]); // 질문 데이터를 저장할 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [category, setCategory] = useState("all"); // 선택된 카테고리
  const [keyword, setKeyword] = useState(""); // 검색 키워드
  const [selectedQuestion, setSelectedQuestion] = useState(null); // 선택한 질문 (상세보기)
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부 확인
  const [showAnswerForm, setShowAnswerForm] = useState(false); // 답변 폼 표시 여부
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    content: "",
    category: "01", // 기본 카테고리 설정
  }); // 새 질문 데이터 상태
  const [currentUser, setCurrentUser] = useState(null); // 로그인한 사용자 정보 상태
  const [answerContent, setAnswerContent] = useState(""); // 답변 내용 상태
  const pageSize = 5; // 한 페이지에 표시할 항목 수

  // 서버로부터 질문 데이터를 가져오는 함수
  const fetchQuestions = async (page = 1, selectedCategory = "all") => {
    try {
      const data = await getAllQuestions(page - 1, pageSize, selectedCategory !== "all" ? selectedCategory : null);
      setQuestions(data.content); // 질문 데이터
      setTotalPages(data.totalPages); // 전체 페이지 수
      setCurrentPage(page); // 현재 페이지
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // 로그인 상태 확인 함수
  const checkLoginStatus = async () => {
    try {
      const user = await getCurrentUser(); // 현재 사용자 정보 가져오기
      if (user && user.userId) {
        setIsLoggedIn(true);
        setCurrentUser(user); // 사용자 정보 저장

        // 현재 사용자 권한 로그 확인
        console.log("현재 사용자 권한:", user.authority);

        // 권한 체크: user.authority.authorityName 사용
        if (user.authority && typeof user.authority === 'object') {
          const isAdminUser = user.authority.authorityName === "ROLE_ADMIN"; // 수정된 부분
          setIsAdmin(isAdminUser);
          console.log("관리자 권한 여부:", isAdminUser); // 관리자 여부 확인용 로그
        } else {
          console.warn("User authority is not in expected format:", user.authority);
        }
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  // 답변 폼 표시 토글
  const toggleAnswerForm = () => {
    setShowAnswerForm(!showAnswerForm); // 버튼을 누르면 폼을 토글로 보여주거나 숨김
  };

  // 검색을 수행하는 함수
  const handleSearch = async () => {
    try {
      if (keyword.trim()) {
        const data = await searchQuestions(keyword, currentPage - 1, pageSize);
        setQuestions(data.content); // 검색된 질문 데이터
        setTotalPages(data.totalPages); // 전체 페이지 수
      } else {
        fetchQuestions(currentPage, category); // 검색어가 없으면 전체 목록을 다시 불러옴
      }
    } catch (error) {
      console.error("Error searching questions:", error);
    }
  };

  // 질문 제출 처리 함수
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
            lmsQaWritingDate: new Date().toISOString().split("T")[0], // 작성일 설정
            user: {
                userId: currentUser.userId,
                userNameKor: currentUser.userNameKor,
            },
        };
        await createQuestion(questionData); // 질문 생성 API 호출

        alert("질문이 등록됐습니다.");

        setNewQuestion({ title: "", content: "", category: "01" }); // 입력값 초기화
        setSelectedQuestion(null); // 새 질문 폼 닫고 질문 목록으로 돌아가기
        fetchQuestions(currentPage, category); // 새로 생성된 질문 목록 갱신
    } catch (error) {
        console.error("Error creating question:", error);
    }
  };

  // 답변 제출 처리 함수 (ROLE_ADMIN 사용자만 사용 가능)
  const handleSubmitAnswer = async () => {
    if (!answerContent.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }
  
    try {
      await answerQuestion(selectedQuestion.lmsQaSeq, {
        lmsQaAnswerContent: answerContent,
        lmsQaAnswerWriter: currentUser.userNameKor,
        lmsQaAnswerDate: new Date().toISOString().split("T")[0], // 작성일자 추가
      });
      alert("답변이 등록되었습니다.");
      setAnswerContent(""); // 답변 입력 필드 초기화
      loadQuestionDetails(selectedQuestion.lmsQaSeq); // 질문 상세 정보 갱신
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  // 선택한 질문의 상세 정보를 로드하는 함수
  const loadQuestionDetails = async (questionId) => {
    try {
      const question = await getQuestionById(questionId);
      setAnswerContent(question.lmsQaAnswerContent || ""); // 답변 내용이 있으면 미리 채워 넣음
      setSelectedQuestion(question); // 선택한 질문 상태 설정
    } catch (error) {
      console.error("Error loading question details:", error);
    }
  };

  // 목록으로 돌아가기 함수
  const goBackToList = () => {
    setSelectedQuestion(null); // 선택된 질문을 해제하여 목록으로 돌아감
    setShowAnswerForm(false); // 폼 숨기기
  };

  // 페이지네이션 처리 함수
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchQuestions(newPage, category);
    }
  };

  // 카테고리 선택 처리 함수
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1); // 페이지를 처음으로 돌림
    fetchQuestions(1, newCategory); // 선택된 카테고리로 질문 목록을 다시 불러옴
  };

  const handleDeleteQuestion = async () => {
    try {
      await deleteQuestion(selectedQuestion.lmsQaSeq); // API로 질문 삭제 요청
      alert("게시글이 삭제되었습니다.");
      goBackToList(); // 목록으로 돌아감
      fetchQuestions(currentPage, category); // 목록 새로고침
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  // 컴포넌트가 처음 렌더링될 때 질문 목록과 로그인 상태를 확인
  useEffect(() => {
    fetchQuestions(currentPage, category);
    checkLoginStatus(); // 로그인 상태 확인
  }, [category, currentPage]);

  return (
    <div>
      <h1>질의응답</h1>
  
      {/* 선택한 질문이 없을 때만 질문 목록 및 검색 표시 */}
      {!selectedQuestion && (
        <>
          {/* 카테고리 버튼 */}
          <div>
            <button onClick={() => handleCategoryChange("all")}>전체</button>
            <button onClick={() => handleCategoryChange("01")}>수강문의</button>
            <button onClick={() => handleCategoryChange("02")}>회원정보</button>
            <button onClick={() => handleCategoryChange("03")}>시스템</button>
            <button onClick={() => handleCategoryChange("99")}>기타</button>
          </div>
  
          {/* 검색 창 */}
          <div>
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button onClick={handleSearch}>검색</button>
          </div>
  
          {/* 질문 목록 테이블 */}
          <table>
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
                      : question.categoryId === "99"
                      ? "기타"
                      : "알 수 없음"}
                  </td>
                  <td
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() => loadQuestionDetails(question.lmsQaSeq)} // 질문 제목 클릭 시 상세 보기 로드
                  >
                    {question.lmsQaTitle}
                  </td>
                  <td>{question.user?.userNameKor || "알 수 없음"}</td>
                  <td>{question.lmsQaWritingDate}</td>
                  <td>{question.lmsQaAnswerCheck === "Y" ? "완료" : "대기"}</td>
                </tr>
              ))}
            </tbody>
          </table>
  
          {/* 페이지네이션 */}
          <div>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              이전
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              다음
            </button>
          </div>
  
          {/* 로그인한 사용자만 "질문 작성" 버튼 표시 */}
          {isLoggedIn && (
            <button onClick={() => setSelectedQuestion("new")}>
              질문 작성
            </button>
          )}
        </>
      )}
  
      {/* 새 질문 작성 폼 */}
      {selectedQuestion === "new" && (
        <form onSubmit={handleSubmitQuestion}>
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
            />
          </div>
          <button type="submit">질문 등록</button>
          <button type="button" onClick={() => goBackToList()}>
            취소
          </button>
        </form>
      )}
  
      {/* 선택한 질문이 있으면 상세 보기 표시 */}
      {selectedQuestion && selectedQuestion !== "new" && (
        <div>
          <h3>{selectedQuestion.lmsQaTitle}</h3>
          <p>
            <strong>작성자:</strong> {selectedQuestion.user?.userNameKor || "알 수 없음"}
          </p>
          <p><strong>작성일:</strong> {selectedQuestion.lmsQaWritingDate}</p>
          <p><strong>내용:</strong> {selectedQuestion.lmsQaContent}</p>
          <p><strong>답변 상태:</strong> {selectedQuestion.lmsQaAnswerCheck === "Y" ? "완료" : "대기"}</p>
  
          {selectedQuestion.lmsQaAnswerContent && (
            <>
              <h4>답변 내용</h4>
              <p>{selectedQuestion.lmsQaAnswerContent}</p>
            </>
          )}
  
          {/* 관리자만 답변 폼 표시 */}
          {isAdmin && (
            <div>
              <h3>답변 {selectedQuestion.lmsQaAnswerContent ? "수정" : "작성"}</h3>
              <textarea
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="답변 내용을 입력하세요."
              />
              <button onClick={handleSubmitAnswer}>
                {selectedQuestion.lmsQaAnswerContent ? "답변 수정" : "답변 등록"}
              </button>
            </div>
          )}

          {isAdmin && (
            <button onClick={handleDeleteQuestion}>
              게시글 삭제
            </button>
          )}
  
          <button onClick={goBackToList}>목록으로 돌아가기</button>
        </div>
      )}
    </div>
  );
}