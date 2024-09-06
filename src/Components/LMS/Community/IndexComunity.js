import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getAllLmsEvents,
  getAllNotices,
} from "../../../Api/CommunityApi/CommunityApi";
import { useNavigate } from "react-router-dom";
import NoticeModal from "./NoticeModal"; // Default import
import EventModal from "./EventModal"; // Default import

// import { NoticeModal } from "../Community/NoticeModal";
// import { EventModal } from "../Community/EventModal";

const BoardContainer = styled.div`
  width: 90%;
  display: grid;
  grid-template-columns: 40% 10% 40%;
  padding: 20px;
  margin: 0 auto;
  float: right;
  border-bottom: 1px solid #1a1b24;
`;

const Notices = styled.div`
  width: 100%;
  padding: 5px;
`;

const Event = styled.div`
  width: 100%;
  padding: 5px;
`;

const CommunityInfo = styled.p`
  width: 100%;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 5px;
  border-bottom: 1px solid #1a1b24;
  padding-bottom: 10px;
`;

const NoticesText = styled.p`
  color: #fff;
  font-size: 13px;
  margin-bottom: 8px;
  overflow: hidden;
  cursor: pointer;
`;

const More = styled.span`
  color: #fff;
  float: right;
  font-size: 30px;
  margin-top: -10px;
  padding: 0 10px;
  cursor: pointer;
`;

export function IndexCommunity() {
  const [notices, setNoteces] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios();
  }, []);

  async function axios() {
    const noticesData = await getAllNotices();
    setNoteces(noticesData.content);

    const eventsData = await getAllLmsEvents();
    setEvents(eventsData.content.slice(0, 5));
  }

  const openNoticeModal = (notice) => {
    setSelectedNotice(notice);
    setNoticeModalOpen(true);
  };

  const closeNoticeModal = () => {
    setNoticeModalOpen(false);
    setSelectedNotice(null);
  };

  const openEventModal = (event) => {
    setSelectedEvent(event);
    setEventModalOpen(true);
  };

  const closeEventModal = () => {
    setEventModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <BoardContainer>
      <Notices>
        <More
          onClick={() => {
            navigate("/community/notices");
          }}
        >
          &#43;
        </More>
        <CommunityInfo>공지사항</CommunityInfo>
        {notices.map((data, index) => (
          <NoticesText key={index} onClick={() => openNoticeModal(data)}>
            {data.lmsNoticesTitle}
          </NoticesText>
        ))}
      </Notices>
      <div></div>
      <Event>
        <More>&#43;</More>
        <CommunityInfo>이벤트</CommunityInfo>
        {events.map((data, index) => (
          <NoticesText key={index} onClick={() => openEventModal(data)}>
            {data.lmsEventsTitle}
          </NoticesText>
        ))}
      </Event>
      {noticeModalOpen && selectedNotice && (
        <NoticeModal notice={selectedNotice} onClose={closeNoticeModal} />
      )}
      {eventModalOpen && selectedEvent && (
        <EventModal event={selectedEvent} onClose={closeEventModal} />
      )}
    </BoardContainer>
  );
}
