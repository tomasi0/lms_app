import React, { useState, useEffect } from "react";
import {
    getAllNotices,
    getNoticeById,
    createNotice,
    deleteNotice,
} from "../../../Api/CommunityApi/CommunityApi"; // API 함수 가져오기

export function ModalNotices() {
    // 상태 변수
    const [notices, setNotices] = useState([]); // 공지사항 목록
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
    const [selectedNotice, setSelectedNotice] = useState(null); // 선택된 공지사항 (상세보기용)
    const [showForm, setShowForm] = useState(false); // 공지사항 작성 폼 표시 여부
    const [newNotice, setNewNotice] = useState({
        category: "",
        title: "",
        content: "",
    }); // 새 공지사항

    const noticesPerPage = 5;

    // 공지사항 목록을 로드하는 함수
    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const data = await getAllNotices(
                    currentPage - 1,
                    noticesPerPage
                );
                setNotices(data.content);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Error fetching notices:", error);
            }
        };

        fetchNotices();
    }, [currentPage]);

    // 페이지네이션 변경 처리
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // 공지사항 상세 정보를 로드하는 함수
    const loadNoticeDetails = async (id) => {
        try {
            const data = await getNoticeById(id);
            setSelectedNotice(data); // 선택된 공지사항 설정
            setShowForm(false); // 작성 폼 숨기기
        } catch (error) {
            console.error("Error fetching notice details:", error);
        }
    };

    // 새 공지사항 작성 함수
    const handleCreateNotice = async () => {
        try {
            await createNotice(newNotice); // 새 공지사항 생성
            setShowForm(false); // 작성 폼 숨기기
            setNewNotice({ category: "", title: "", content: "" });
            setCurrentPage(1); // 첫 페이지로 이동하여 공지사항 목록 다시 로드
        } catch (error) {
            console.error("Error creating notice:", error);
        }
    };

    // 공지사항 삭제 함수
    const handleDeleteNotice = async (id) => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            try {
                await deleteNotice(id); // 공지사항 삭제
                setSelectedNotice(null); // 선택된 공지사항 초기화
                setCurrentPage(1); // 첫 페이지로 이동하여 공지사항 목록 다시 로드
            } catch (error) {
                console.error("Error deleting notice:", error);
            }
        }
    };

    return (
        <div>
            <h1>공지사항</h1>

            {/* 공지사항 테이블 */}
            {!selectedNotice && !showForm && (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>카테고리</th>
                                <th>제목</th>
                                <th>작성자</th>
                                <th>등록일</th>
                                <th>조회수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notices.map((notice, index) => (
                                <tr
                                    key={notice.id || index}
                                    onClick={() => loadNoticeDetails(notice.id)}
                                >
                                    <td>
                                        {index +
                                            1 +
                                            (currentPage - 1) * noticesPerPage}
                                    </td>
                                    <td>{notice.category || "일반공지"}</td>
                                    <td>{notice.title}</td>
                                    <td>{notice.author || "관리자"}</td>
                                    <td>{notice.createdAt}</td>
                                    <td>{notice.views}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* 페이지네이션 */}
                    <div className="pagination">
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
                    <button onClick={() => setShowForm(true)}>
                        새 공지사항 작성
                    </button>
                </div>
            )}

            {/* 공지사항 상세보기 */}
            {selectedNotice && (
                <div>
                    <h2>{selectedNotice.title}</h2>
                    <p>
                        <strong>작성자:</strong>{" "}
                        {selectedNotice.author || "관리자"}
                    </p>
                    <p>
                        <strong>작성일:</strong> {selectedNotice.createdAt}
                    </p>
                    <p>
                        <strong>조회수:</strong> {selectedNotice.views}
                    </p>
                    <p>{selectedNotice.content}</p>
                    <button onClick={() => setSelectedNotice(null)}>
                        목록으로
                    </button>
                    <button
                        onClick={() => handleDeleteNotice(selectedNotice.id)}
                    >
                        삭제
                    </button>
                </div>
            )}

            {/* 새 공지사항 작성 폼 */}
            {showForm && (
                <div>
                    <h2>새 공지사항 작성</h2>
                    <label>
                        카테고리:
                        <select
                            value={newNotice.category}
                            onChange={(e) =>
                                setNewNotice({
                                    ...newNotice,
                                    category: e.target.value,
                                })
                            }
                        >
                            <option value="01">일반공지</option>
                            <option value="02">수강정보</option>
                            <option value="99">기타</option>
                        </select>
                    </label>
                    <label>
                        제목:
                        <input
                            type="text"
                            value={newNotice.title}
                            onChange={(e) =>
                                setNewNotice({
                                    ...newNotice,
                                    title: e.target.value,
                                })
                            }
                        />
                    </label>
                    <label>
                        내용:
                        <textarea
                            value={newNotice.content}
                            onChange={(e) =>
                                setNewNotice({
                                    ...newNotice,
                                    content: e.target.value,
                                })
                            }
                        />
                    </label>
                    <button onClick={handleCreateNotice}>작성 완료</button>
                    <button onClick={() => setShowForm(false)}>취소</button>
                </div>
            )}
        </div>
    );
}

export default ModalNotices;
