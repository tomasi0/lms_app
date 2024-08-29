import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getAllNotices, getNoticeById, getCurrentUser, createNotice, deleteNotice } from "../../../Api/CommunityApi/CommunityApi";

// styled-components 스타일 정의
const NoticeBoardContainer = styled.div`
    margin: 20px;
`;

const Title = styled.h2`
    margin-bottom: 20px;
`;

const NoticeTable = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const TableHead = styled.thead`
    background-color: #f2f2f2;
`;

const TableHeader = styled.th`
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
`;

const TableData = styled.td`
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
`;

const PaginationContainer = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: center;
`;

const PaginationButton = styled.button`
    margin: 0 5px;
    padding: 5px 10px;
    background-color: ${(props) => (props.disabled ? '#ddd' : '#007bff')};
    color: white;
    border: none;
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`;

const CreateNoticeButton = styled.button`
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    display: block;
    margin-left: auto;
`;

const NoticeDetail = styled.div`
    margin: 20px 0;
    padding: 20px;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
`;

const NoticeForm = styled.form`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const FormInput = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const FormTextarea = styled.textarea`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const FormSelect = styled.select`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const SubmitButton = styled.button`
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    cursor: pointer;
`;

const CancelButton = styled.button`
    padding: 10px 20px;
    background-color: #dc3545;
    color: white;
    border: none;
    cursor: pointer;
`;

const DeleteButton = styled.button`
    padding: 10px 20px;
    background-color: #dc3545;
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 10px;
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
    const [newNotice, setNewNotice] = useState({ categoryId: '', title: '', content: '' });
    const noticesPerPage = 5;

    // 공지사항 카테고리 이름 변환 함수
    const getCategoryName = (categoryId) => {
        switch (categoryId) {
            case '01':
                return '일반공지';
            case '02':
                return '수강정보';
            case '99':
                return '기타';
            default:
                return '알 수 없음';
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
                const isAdminUser = user.authority && user.authority.authorityName === "ROLE_ADMIN";
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
            console.error('Error loading notice details:', error);
        }
    };

    // 게시글 삭제 함수 (관리자 전용)
    const deleteSelectedNotice = async (id) => {
        if (window.confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
            try {
                await deleteNotice(id);
                alert('공지사항이 삭제되었습니다.');
                setSelectedNotice(null);
                fetchNotices(page); // 삭제 후 목록 새로고침
            } catch (error) {
                console.error('Error deleting notice:', error);
                alert('공지사항 삭제 중 오류가 발생했습니다.');
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
                user: { userId: '관리자' } // 실제 로그인된 사용자로 교체 필요
            });
            alert('새 공지사항이 작성되었습니다.');
            setIsFormVisible(false);
            fetchNotices(page); // 목록 새로고침
        } catch (error) {
            console.error('Error submitting notice:', error);
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
        <NoticeBoardContainer>
            <Title>공지사항</Title>

            {/* 작성 폼 모드 */}
            {isFormVisible ? (
                <NoticeForm onSubmit={submitNotice}>
                    <h3>새 공지사항 작성</h3>
                    <label>카테고리</label>
                    <FormSelect 
                        value={newNotice.categoryId} 
                        onChange={(e) => setNewNotice({ ...newNotice, categoryId: e.target.value })} 
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
                        onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })} 
                        required 
                    />
                    <label>내용</label>
                    <FormTextarea 
                        value={newNotice.content} 
                        onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })} 
                        required 
                    />
                    <SubmitButton type="submit">작성</SubmitButton>
                    <CancelButton type="button" onClick={() => setIsFormVisible(false)}>취소</CancelButton>
                </NoticeForm>
            ) : (
                <>
                    {/* 상세보기 모드 */}
                    {selectedNotice ? (
                        <NoticeDetail>
                            <h3>{selectedNotice.lmsNoticesTitle}</h3>
                            <p>{selectedNotice.lmsNoticesContent}</p>
                            <p>작성자: {selectedNotice.user ? selectedNotice.user.userNameKor : '관리자'}</p>
                            <p>등록일: {new Date(selectedNotice.lmsNoticesWritingDate).toLocaleDateString()}</p>
                            <p>조회수: {selectedNotice.lmsNoticesViewCount}</p>
                            <button onClick={backToList}>목록으로 돌아가기</button>
                            {/* 관리자일 경우 삭제 버튼 표시 */}
                            {isAdmin && (
                                <DeleteButton onClick={() => deleteSelectedNotice(selectedNotice.lmsNoticesSeq)}>
                                    삭제
                                </DeleteButton>
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
                                            <TableData>{index + 1 + (page - 1) * noticesPerPage}</TableData>
                                            <TableData>{getCategoryName(notice.categoryId)}</TableData>
                                            <TableData 
                                                className="notice-title"
                                                style={{cursor: 'pointer'}}
                                                onClick={() => loadNoticeDetails(notice.lmsNoticesSeq)} 
                                            >
                                                {notice.lmsNoticesTitle}
                                            </TableData>
                                            <TableData>{notice.user ? notice.user.userNameKor : '관리자'}</TableData>
                                            <TableData>{new Date(notice.lmsNoticesWritingDate).toLocaleDateString()}</TableData>
                                            <TableData>{notice.lmsNoticesViewCount}</TableData>
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
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <PaginationButton
                                        key={i + 1}
                                        onClick={() => setPage(i + 1)}
                                        disabled={i + 1 === page}
                                    >
                                        {i + 1}
                                    </PaginationButton>
                                ))}
                                <PaginationButton
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === totalPages}
                                >
                                    다음
                                </PaginationButton>
                            </PaginationContainer>

                            {/* 관리자일 경우에만 "새 공지사항 작성" 버튼을 표시 */}
                            {isAdmin && (
                                <CreateNoticeButton onClick={() => setIsFormVisible(true)}>
                                    새 공지사항 작성
                                </CreateNoticeButton>
                            )}
                        </>
                    )}
                </>
            )}
        </NoticeBoardContainer>
    );
}

export default Notices;