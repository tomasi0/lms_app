import React, { useState, useEffect } from "react";
import {
    getAllLmsEvents,
    getLmsEventById,
} from "../../../Api/CommunityApi/CommunityApi";
import styled from "styled-components";
import { Navbar } from "../Navbar";
import { LeftSidebar, RightSidebar } from "../Sidebar";

// 스타일 정의
const BigBox = styled.div`
    background-color: #0f1015;
    color: #e0e0e0;
    min-height: 100vh;
    padding: 20px;
    width: 90%; 
    margin: 0 auto; /* 화면 중앙에 배치 */
    margin-top: 5%;
`

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
`

const Container = styled.div`
    display: flex;
    justify-content: center;
    padding: 20px;
    background-color: #0f1015; /* 배경색 적용 */
`;

const MainContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    color: #e0e0e0; /* 기본 텍스트 색상 적용 */
`;

const Content = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    justify-content: center;
    margin-bottom: 20px;
    width: 100%;
`;

const EventCard = styled.div`
    border: 1px solid #1c1e24; /* 어두운 회색 테두리 */
    padding: 15px;
    background-color: #23262d; /* 짙은 회색 배경 */
    border-radius: 8px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    cursor: pointer;
    color: #ffffff; /* 카드 내 텍스트 색상 */
`;

const EventImage = styled.img`
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
`;

const EventTitle = styled.h3`
    font-size: 1.2rem;
    margin: 10px 0;
    color: #00adb5; /* 청록색 텍스트 */
`;

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    margin-top: 20px;
    color: #b0b0b0; /* 페이지네이션 텍스트 색상 */
`;

const PaginationButton = styled.button`
    margin: 0 5px;
    padding: 5px 10px;
    background-color: #00adb5; /* 밝은 파란색 버튼 */
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:disabled {
        background-color: #1c1e24; /* 비활성화 시 어두운 회색 */
    }
`;

// 이벤트 상세 스타일 정의
const EventDetailContainer = styled.div`
    display: ${(props) =>
        props.$isVisible ? "block" : "none"}; /* 상세 페이지 표시 여부 */
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #1c1e24;
    border-radius: 8px;
    background-color: #23262d;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    color: #e0e0e0;
`;

const BackButton = styled.button`
    margin-top: 20px;
    padding: 5px 10px;
    background-color: #6200ea; /* 보라색 버튼 */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

export function Events() {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(null); // 선택된 이벤트의 ID
    const [selectedEvent, setSelectedEvent] = useState(null); // 선택된 이벤트 정보
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const size = 8;

    useEffect(() => {
        loadEvents(page, size);
    }, [page]);

    const loadEvents = async (page, size) => {
        try {
            const data = await getAllLmsEvents(page, size);
            const sortedEvents = data.content.sort(
                (a, b) =>
                    new Date(b.lmsEventsWritingDate) -
                    new Date(a.lmsEventsWritingDate)
            );
            setEvents(sortedEvents);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error loading events:", error);
        }
    };

    const loadEventDetails = async (id) => {
        try {
            const event = await getLmsEventById(id);
            setSelectedEvent(event); // 선택된 이벤트 저장
        } catch (error) {
            console.error("Error loading event details:", error);
        }
    };

    const handleEventClick = (id) => {
        setSelectedEventId(id); // 선택한 이벤트 ID 설정
        loadEventDetails(id); // 이벤트 상세 정보 불러오기
    };

    const handleBackToList = () => {
        setSelectedEventId(null); // 선택된 이벤트 ID를 초기화하여 목록으로 돌아감
        setSelectedEvent(null); // 선택된 이벤트 상세 초기화
    };

    return (
        <>
        <Navbar />
        <LeftSidebar />
        <BigBox>
            <H1 style={{ color: '#ffffff' }}>이벤트</H1>
            <Container>
                <MainContent>
                    {/* 이벤트 목록 */}
                    <Content
                        style={{ display: selectedEventId ? "none" : "grid" }}
                    >
                        {events.map((event) => (
                            <EventCard
                                key={event.lmsEventSeq}
                                onClick={() =>
                                    handleEventClick(event.lmsEventSeq)
                                }
                            >
                                <EventImage
                                    src={
                                        event.imagePath || "/default-image.jpg"
                                    }
                                    alt={event.lmsEventsTitle}
                                />
                                <EventTitle>{event.lmsEventsTitle}</EventTitle>
                                <p>
                                    {event.lmsEventsStartDate} -{" "}
                                    {event.lmsEventEndDate}
                                </p>
                                <p>Views: {event.lmsEventViewCount}</p>
                            </EventCard>
                        ))}
                    </Content>

                    {/* 이벤트 상세 보기 */}
                    {selectedEvent && (
                        <EventDetailContainer $isVisible={!!selectedEventId}>
                            <h1>{selectedEvent.lmsEventsTitle}</h1>
                            <EventImage
                                src={
                                    selectedEvent.imagePath ||
                                    "/default-image.jpg"
                                }
                                alt={selectedEvent.lmsEventsTitle}
                            />
                            <p>{selectedEvent.lmsEventsContent}</p>
                            <p>
                                기간: {selectedEvent.lmsEventsStartDate} -{" "}
                                {selectedEvent.lmsEventEndDate}
                            </p>
                            <p>조회수: {selectedEvent.lmsEventViewCount}</p>
                            <BackButton onClick={handleBackToList}>
                                목록으로 돌아가기
                            </BackButton>
                        </EventDetailContainer>
                    )}

                    {/* 페이지네이션 (이벤트 목록이 보일 때만 표시) */}
                    {!selectedEventId && (
                        <Pagination>
                            <PaginationButton
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            >
                                이전
                            </PaginationButton>
                            <span>
                                {page} / {totalPages}
                            </span>
                            <PaginationButton
                                onClick={() => setPage(page + 1)}
                                disabled={page === totalPages}
                            >
                                다음
                            </PaginationButton>
                        </Pagination>
                    )}
                </MainContent>
            </Container>
        </BigBox>
        </>
    );
}