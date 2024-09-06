// src/Components/LMS/Community/NoticeModal.js

import React from "react";
import styled from "styled-components";

const ModalTitle = styled.p`
  font-size: 24px;
  font-weight: 700;
  background-color: #fff;
  border-bottom: 1px solid #1a1b24;
  padding: 20px;
  margin: 0;
`;

const ModalContent = styled.p`
  font-size: 18px;
  background-color: #fff;
  padding: 20px;
  margin: 0;
  line-height: 1.5;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #1a1b24;
  padding-top: 15px;
  background-color: #fff;
`;

const Modal = ({ notice, onClose }) => (
  <div style={modalStyles}>
    <div style={modalContentStyles}>
      <span style={closeButtonStyles} onClick={onClose}>
        &times;
      </span>
      <ModalTitle>{notice.lmsNoticesTitle}</ModalTitle>
      <ModalContent style={{ borderBottom: "1px solid #1a1b24" }}>
        {notice.lmsNoticesContent}
      </ModalContent>
      <ModalFooter>
        <ModalContent>개시일 : {notice.lmsNoticesWritingDate}</ModalContent>
        <ModalContent>조회수 : {notice.lmsNoticesViewCount}회</ModalContent>
        <ModalContent>작성자 : {notice.user.userNameKor}</ModalContent>
      </ModalFooter>
    </div>
  </div>
);

const modalStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalContentStyles = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  position: "relative",
  width: "80%",
  maxWidth: "800px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
};

const closeButtonStyles = {
  position: "absolute",
  top: "10px",
  right: "10px",
  fontSize: "24px",
  cursor: "pointer",
  backgroundColor: "#fff",
};

export default Modal;
