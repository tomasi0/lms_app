import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
    getAllNotices,
    getNoticeById,
    getCurrentUser,
    createNotice,
    deleteNotice,
} from "../../../Api/CommunityApi/CommunityApi";
import { Navbar } from "../Navbar";
import { LeftSidebar, RightSidebar } from "../Sidebar";

// styled-components 스타일 정의
const H1 = styled.div`
    text-align: center;
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    unicode-bidi: isolate;
`;

const NoticeBoardContainer = styled.div`
    margin: 20px;
    color: #e0e0e0; /* 텍스트 색상 변경 */
    background-color: #0f1015; /* 배경색 변경 */
    padding: 20px;
    margin-top: 5%;
    border-radius: 8px;
    margin: 0 auto; /* 화면 중앙에 배치 */
    margin-top: 5%;
    width: 70%;
`;

const Title = styled.h2`
    margin-bottom: 20px;
`;

const NoticeTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px; /* 위쪽 여백 추가 */
  
  th, td {
    padding: 10px; /* 셀 안쪽 여백 */
    border: 1px solid #444; /* 테두리 색상 */
    text-align: left; /* 텍스트 좌측 정렬 */
    height: 50px; /* 셀 높이 고정 */
    vertical-align: middle; /* 텍스트 세로 가운데 정렬 */
    font-size: 14px; /* 폰트 크기 통일 */
  }

  /* 컬럼 별 너비 지정 */
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
    width: 10%; /* 조회수 */
  }

  th {
    background-color: #1c1e24; /* 헤더 배경색 */
    color: #ffffff; /* 헤더 텍스트 색상 */
  }

  td {
    background-color: #23262d; /* 셀 배경색 */
    color: #e0e0e0; /* 셀 텍스트 색상 */
  }

  /* 제목 셀에만 hover 효과 추가 */
  td.notice-title:hover {
    background-color: #00adb5;
    color: #ffffff;
  }
`;

const NoticeForm = styled.form`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const FormSelect = styled.select`
    padding: 10px;
    border: 1px solid #444;
    background-color: #1c1e24;
    color: #e0e0e0;
    border-radius: 4px;
`;

const FormInput = styled.input`
    padding: 10px;
    border: 1px solid #444;
    background-color: #1c1e24;
    color: #e0e0e0;
    border-radius: 4px;
`;

const FormTextarea = styled.textarea`
    padding: 10px;
    border: 1px solid #444;
    background-color: #1c1e24;
    color: #e0e0e0;
    border-radius: 4px;
`;

const SubmitButton = styled.button`
    padding: 10px 20px;
    background-color: #00adb5;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
`;

const CancelButton = styled.button`
    padding: 10px 20px;
    background-color: #dc3545; /* 취소 버튼 색상 빨간색 */
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    margin-left: 10px; /* 다른 버튼과 간격을 두기 위해 왼쪽 여백 추가 */

    &:hover {
        background-color: #c82333; /* 마우스를 올렸을 때 더 진한 빨간색 */
    }
`;

const TableHead = styled.thead`
    background-color: #23262d; /* 테이블 헤더 배경색 어두운 회색 */
`;

const TableHeader = styled.th`
    border: 1px solid #333;
    padding: 8px;
    text-align: center;
    color: #ffffff; /* 텍스트 색상 흰색 */
`;

const TableData = styled.td`
    border: 1px solid #333;
    padding: 8px;
    text-align: center;
    color: #e0e0e0; /* 텍스트 색상 밝은 회색 */
`;

const PaginationContainer = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: center;
`;

const PaginationButton = styled.button`
    margin: 0 5px;
    padding: 5px 10px;
    background-color: ${(props) =>
        props.disabled
            ? "#555"
            : "#00adb5"}; /* 비활성화 시 어두운 회색, 활성화 시 파란색 */
    color: white;
    border: none;
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    border-radius: 4px;
`;

const CreateNoticeButton = styled.button`
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #00adb5;
    color: white;
    border: none;
    cursor: pointer;
    display: block;
    margin-left: auto;
    border-radius: 4px;
`;

const NoticeDetail = styled.div`
    background-color: #1c1e24; /* 배경색 */
    padding: 20px;
    border-radius: 10px; /* 모서리 둥글게 */
    color: #e0e0e0; /* 텍스트 색상 */
    margin-top: 20px;
`;

const NoticeTitle = styled.h3`
    color: #00adb5; /* 제목 색상 */
    margin-bottom: 20px; /* 제목과 내용 사이의 여백 */
    font-size: 1.5em;
    background-color: transparent; /* 배경 투명 */
`;

const InfoText = styled.p`
    margin: 10px 0;
    font-size: 1em;
    strong {
        font-weight: bold;
        color: #f7b731; /* 강조된 텍스트 색상 */
        background-color: transparent;
    }
    background-color: transparent;
`;

const AdminSection = styled.div`
    margin-top: 20px;
    background-color: transparent;
  
    h3 {
        color: #00adb5;
        text-align: left; /* 좌측 정렬 */
        width: 100%; /* 좌측 정렬을 위한 너비 */
        background-color: transparent;
    }

    textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #444; /* 테두리 색상 */
        border-radius: 5px; /* 모서리 둥글게 */
        background-color: #23262d;
        color: white;
        min-height: 100px;
        margin-bottom: 20px;
    }

    display: flex;
    flex-direction: column;
    align-items: flex-end; /* 우측 정렬 */
`;

const ActionButton = styled.button`
    background-color: #00adb5;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 10px;

    &:hover {
        background-color: #30619c;
    }
`;

export function Notices() {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newNotice, setNewNotice] = useState({
        categoryId: "",
        title: "",
        content: "",
    });
    const noticesPerPage = 5;

    // 공지사항 카테고리 이름 변환 함수
    const getCategoryName = (categoryId) => {
        switch (categoryId) {
            case "01":
                return "일반공지";
            case "02":
                return "수강정보";
            case "99":
                return "기타";
            default:
                return "알 수 없음";
        }
    };

    // 서버에서 공지사항 데이터를 가져오는 함수
    const fetchNotices = async (page) => {
        try {
            const data = await getAllNotices(page - 1, noticesPerPage);
            setNotices(data.content);
            setTotalPages(data.totalPages);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    // 로그인 상태 확인 함수
    const checkLoginStatus = async () => {
        try {
            const user = await getCurrentUser();
            if (user && user.userId) {
                const isAdminUser =
                    user.authority &&
                    user.authority.authorityName === "ROLE_ADMIN";
                setIsAdmin(isAdminUser);
            }
        } catch (error) {
            console.error("Error fetching current user:", error);
        }
    };

    // 게시글 클릭 시 상세 내용을 불러오는 함수
    const loadNoticeDetails = async (id) => {
        try {
            const notice = await getNoticeById(id);
            if (notice) {
                setSelectedNotice(notice);
            } else {
                console.error("공지사항이 존재하지 않습니다.");
            }
        } catch (error) {
            console.error("Error loading notice details:", error);
        }
    };

    // 게시글 삭제 함수 (관리자 전용)
    const deleteSelectedNotice = async (id) => {
        if (window.confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
            try {
                await deleteNotice(id);
                alert("공지사항이 삭제되었습니다.");
                setSelectedNotice(null);
                fetchNotices(page); // 삭제 후 목록 새로고침
            } catch (error) {
                console.error("Error deleting notice:", error);
                alert("공지사항 삭제 중 오류가 발생했습니다.");
            }
        }
    };

    // 공지사항 작성 폼 제출 함수
    const submitNotice = async (e) => {
        e.preventDefault();
        try {
            await createNotice({
                categoryId: newNotice.categoryId,
                lmsNoticesTitle: newNotice.title,
                lmsNoticesContent: newNotice.content,
                user: { userId: "관리자" }, // 실제 로그인된 사용자로 교체 필요
            });
            alert("새 공지사항이 작성되었습니다.");
            setIsFormVisible(false);
            fetchNotices(page); // 목록 새로고침
        } catch (error) {
            console.error("Error submitting notice:", error);
        }
    };

    // 목록으로 돌아가기 함수
    const backToList = () => {
        setSelectedNotice(null);
    };

    useEffect(() => {
        fetchNotices(page);
        checkLoginStatus();
    }, [page]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching notices</div>;

    return (
        <>
            <Navbar />
            <LeftSidebar />
            <NoticeBoardContainer>
                <H1>공지사항</H1>

                {/* 작성 폼 모드 */}
                {isFormVisible ? (
                    <NoticeForm onSubmit={submitNotice}>
                        <h3>새 공지사항 작성</h3>
                        <label>카테고리</label>
                        <FormSelect
                            value={newNotice.categoryId}
                            onChange={(e) =>
                                setNewNotice({
                                    ...newNotice,
                                    categoryId: e.target.value,
                                })
                            }
                            required
                        >
                            <option value="">카테고리 선택</option>
                            <option value="01">일반공지</option>
                            <option value="02">수강정보</option>
                            <option value="99">기타</option>
                        </FormSelect>
                        <label>제목</label>
                        <FormInput
                            type="text"
                            value={newNotice.title}
                            onChange={(e) =>
                                setNewNotice({
                                    ...newNotice,
                                    title: e.target.value,
                                })
                            }
                            required
                        />
                        <label>내용</label>
                        <FormTextarea
                            value={newNotice.content}
                            onChange={(e) =>
                                setNewNotice({
                                    ...newNotice,
                                    content: e.target.value,
                                })
                            }
                            required
                        />
                        <SubmitButton type="submit">작성</SubmitButton>
                        <CancelButton
                            type="button"
                            onClick={() => setIsFormVisible(false)}
                        >
                            취소
                        </CancelButton>
                    </NoticeForm>
                ) : (
                    <>
                        {/* 상세보기 모드 */}
                        {selectedNotice ? (
                            <NoticeDetail>
                                <NoticeTitle>{selectedNotice.lmsNoticesTitle}</NoticeTitle>
                                <InfoText>{selectedNotice.lmsNoticesContent}</InfoText>
                                <InfoText>
                                    작성자:{" "}
                                    {selectedNotice.user
                                        ? selectedNotice.user.userNameKor
                                        : "관리자"}
                                </InfoText>
                                <InfoText>
                                    등록일:{" "}
                                    {new Date(
                                        selectedNotice.lmsNoticesWritingDate
                                    ).toLocaleDateString()}
                                </InfoText>
                                <InfoText>
                                    조회수: {selectedNotice.lmsNoticesViewCount}
                                </InfoText>
                                <ActionButton onClick={backToList}>
                                    목록으로 돌아가기
                                </ActionButton>
                                {/* 관리자일 경우 삭제 버튼 표시 */}
                                {isAdmin && (
                                    <AdminSection>
                                        <ActionButton
                                            onClick={() =>
                                                deleteSelectedNotice(
                                                    selectedNotice.lmsNoticesSeq
                                                )
                                            }
                                        >
                                            삭제
                                        </ActionButton>
                                    </AdminSection>
                                )}
                            </NoticeDetail>
                        ) : (
                            <>
                                {/* 공지사항 목록 */}
                                <NoticeTable>
                                    <TableHead>
                                        <tr>
                                            <TableHeader>No</TableHeader>
                                            <TableHeader>카테고리</TableHeader>
                                            <TableHeader>제목</TableHeader>
                                            <TableHeader>작성자</TableHeader>
                                            <TableHeader>등록일</TableHeader>
                                            <TableHeader>조회</TableHeader>
                                        </tr>
                                    </TableHead>
                                    <tbody>
                                        {notices.map((notice, index) => (
                                            <tr key={notice.lmsNoticesSeq}>
                                                <TableData>
                                                    {index +
                                                        1 +
                                                        (page - 1) *
                                                            noticesPerPage}
                                                </TableData>
                                                <TableData>
                                                    {getCategoryName(
                                                        notice.categoryId
                                                    )}
                                                </TableData>
                                                <TableData
                                                    className="notice-title"
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                        loadNoticeDetails(
                                                            notice.lmsNoticesSeq
                                                        )
                                                    }
                                                >
                                                    {notice.lmsNoticesTitle}
                                                </TableData>
                                                <TableData>
                                                    {notice.user
                                                        ? notice.user
                                                              .userNameKor
                                                        : "관리자"}
                                                </TableData>
                                                <TableData>
                                                    {new Date(
                                                        notice.lmsNoticesWritingDate
                                                    ).toLocaleDateString()}
                                                </TableData>
                                                <TableData>
                                                    {notice.lmsNoticesViewCount}
                                                </TableData>
                                            </tr>
                                        ))}
                                    </tbody>
                                </NoticeTable>

                                {/* 페이지네이션 */}
                                <PaginationContainer>
                                    <PaginationButton
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                    >
                                        이전
                                    </PaginationButton>
                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => (
                                            <PaginationButton
                                                key={i + 1}
                                                onClick={() => setPage(i + 1)}
                                                disabled={i + 1 === page}
                                            >
                                                {i + 1}
                                            </PaginationButton>
                                        )
                                    )}
                                    <PaginationButton
                                        onClick={() => setPage(page + 1)}
                                        disabled={page === totalPages}
                                    >
                                        다음
                                    </PaginationButton>
                                </PaginationContainer>

                                {/* 관리자일 경우에만 "새 공지사항 작성" 버튼을 표시 */}
                                {isAdmin && (
                                    <CreateNoticeButton
                                        onClick={() => setIsFormVisible(true)}
                                    >
                                        새 공지사항 작성
                                    </CreateNoticeButton>
                                )}
                            </>
                        )}
                    </>
                )}
            </NoticeBoardContainer>
        </>
    );
}

export default Notices;
