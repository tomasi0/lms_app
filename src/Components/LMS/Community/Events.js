import React, { useState, useEffect } from "react";
import {
    getAllLmsEvents,
    getLmsEventById,
} from "../../../Api/CommunityApi/CommunityApi";
import styled from "styled-components";
import { Navbar } from "../Navbar";
import { LeftSidebar } from "../Sidebar";

// 스타일 정의
const BigBox = styled.div`
    background-color: #0f1015;
    color: #e0e0e0;
    min-height: 100vh;
    padding: 20px;
    width: 90%;
    margin: 0 auto;
    margin-top: 5%;
`;

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

const Container = styled.div`
    display: flex;
    justify-content: center;
    padding: 20px;
    background-color: #0f1015;
`;

const MainContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    color: #e0e0e0;
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
    border: 1px solid #1c1e24;
    padding: 15px;
    background-color: #23262d;
    border-radius: 8px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    cursor: pointer;
    color: #ffffff;
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
    color: #00adb5;
`;

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    margin-top: 20px;
    color: #b0b0b0;
`;

const PaginationButton = styled.button`
    margin: 0 5px;
    padding: 5px 10px;
    background-color: ${(props) =>
        props.disabled ? "#555" : "#00adb5"};
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    &:hover:not(:disabled) {
        background-color: #0056b3;
    }
`;

const EventDetailContainer = styled.div`
    display: ${(props) => (props.$isVisible ? "block" : "none")};
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
    background-color: #6200ea;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

export function Events() {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
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
            setSelectedEvent(event);
        } catch (error) {
            console.error("Error loading event details:", error);
        }
    };

    const handleEventClick = (id) => {
        setSelectedEventId(id);
        loadEventDetails(id);
    };

    const handleBackToList = () => {
        setSelectedEventId(null);
        setSelectedEvent(null);
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
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
                                    onClick={() => handleEventClick(event.lmsEventSeq)}
                                >
                                    <EventImage
                                        src={event.imagePath || "/default-image.jpg"}
                                        alt={event.lmsEventsTitle}
                                    />
                                    <EventTitle>{event.lmsEventsTitle}</EventTitle>
                                    <p>
                                        {event.lmsEventsStartDate} - {event.lmsEventEndDate}
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
                                    src={selectedEvent.imagePath || "/default-image.jpg"}
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
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                >
                                    이전
                                </PaginationButton>

                                {/* 동적 페이지 번호 생성 */}
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <PaginationButton
                                        key={i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        disabled={i + 1 === page}
                                    >
                                        {i + 1}
                                    </PaginationButton>
                                ))}

                                <PaginationButton
                                    onClick={() => handlePageChange(page + 1)}
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