import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../Styles/MyPageUserDelete.css";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimationBox = styled.div`
  padding: 10px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const UserDeleteBox = styled.div`
  width: 100%;
`;

const HeaderText = styled.p`
  color: #556b2f;
  font-size: 30px;
  font-weight: 700;
`;

const Container = styled.div`
  padding: 50px;
  width: 100%;
`;

const TextContainer = styled.div`
  width: 100%;
  border: 1px solid #556b2f;
`;

const TextBox = styled.div`
  width: 60%;
  padding: 20px;
  text-align: left;
  margin: 0 auto;
`;

const TextTitle = styled.p`
  font-size: 28px;
  color: #556b2f;
  font-weight: 800;
  margin-bottom: 10px;
`;

const DeleteText = styled.p`
  color: #fff;
  font-size: 14px;
  line-height: 50px;
`;

const CheckBox = styled.div`
  width: 100%;
  margin-top: 50px;
  text-align: center;
`;

const ChkText = styled.p`
  margin-left: 20px;
  color: #fff;
  display: inline-block;
`;

export function MyPageUserDelete() {
  const [userId, setUserId] = useState("");
  const [userOffice, setUserOffice] = useState("DW 아카데미");
  const [joinDate, setJoinDate] = useState("");
  const [userDeleteReason, setUserDeleteReason] = useState("");
  const [textMinLengthAlert, setTextMinLengthAlert] = useState(false);
  const [showTextArea, setShowTextArea] = useState(false); // 텍스트 영역 표시 여부 관리
  const navigate = useNavigate();

  const urlCurrent = "http://localhost:8080/user/current";
  const urlDelete = "http://localhost:8080/api/withdrawal/saveWithdrawal";
  const urlLogout = "http://localhost:8080/user/logout";

  useEffect(() => {
    axios
      .get(urlCurrent, { withCredentials: true })
      .then((response) => {
        setUserId(response.data.userId);
        setJoinDate(response.data.sysDate.substring(0, 10));
      })
      .catch((error) => {
        console.error("에러 발생: ", error);
      });
  }, []);

  const handleDeleteReasonChange = (e) => {
    const reason = e.target.value;
    setUserDeleteReason(reason);

    if (reason.length <= 1) {
      setTextMinLengthAlert(true);
    } else {
      setTextMinLengthAlert(false);
    }
  };

  const handleDeleteClick = () => {
    const userDeleteCheck = document.querySelector(".deleteSelectBox");

    if (userDeleteCheck.checked) {
      const today = new Date();
      const year = today.getFullYear();
      const month = ("0" + (today.getMonth() + 1)).slice(-2);
      const day = ("0" + today.getDate()).slice(-2);

      const deleteData = {
        withdrawalId: 1,
        sysDate: today,
        updDate: today,
        withdrawalDate: `${year}-${month}-${day}`,
        user: {
          userId: userId,
        },
        withdrawalReason: userDeleteReason,
      };

      if (window.confirm("정말로 탈퇴하시겠습니까?")) {
        axios
          .post(urlDelete, deleteData, { withCredentials: true })
          .then((response) => {
            alert("탈퇴가 완료되었습니다.");
            axios
              .post(urlLogout, {}, { withCredentials: true })
              .then((response) => {
                if (response.status === 200) {
                  navigate("/login");
                }
              })
              .catch((error) => {
                console.error("로그아웃 에러 발생: ", error);
              });
          })
          .catch((error) => {
            console.error("탈퇴 에러 발생: ", error);
          });
      }
    } else {
      alert("탈퇴 확인에 체크해주세요.");
    }
  };

  const handleResizeHeight = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleCheckboxChange = (e) => {
    setShowTextArea(e.target.checked); // 체크박스 상태에 따라 텍스트 영역 표시
  };

  return (
    <AnimationBox>
      <UserDeleteBox>
        <HeaderText>회원탈퇴</HeaderText>
        <Container>
          <TextContainer>
            <TextBox>
              <TextTitle>
                ※ 회원탈퇴를 신청하기 전, 다음 내용을 꼭 확인해주세요.
              </TextTitle>
              <DeleteText>
                ● 고객 정보 및 개인형 서비스 이용 기록은 개인 정보보호 처리 방침
                기준에 따라 삭제됩니다.
              </DeleteText>
              <DeleteText>
                ● 탈퇴한 계정으로 더 이상 로그인 할 수 없습니다.
              </DeleteText>
              <DeleteText>
                ● 회원 탈퇴 시 더 이상 LMS서비스 사용이 불가능하며, LMS
                사이트에서도 탈퇴처리됩니다.
              </DeleteText>

              <CheckBox>
                <input
                  className="deleteSelectBox"
                  type="checkbox"
                  onChange={handleCheckboxChange} // 체크박스 상태 변경 이벤트 핸들러
                  style={{ width: "10px", height: "10px" }}
                />
                <ChkText>위 약관을 확인했습니다.</ChkText>
              </CheckBox>

              {/* 체크박스가 체크되었을 때만 텍스트 영역을 표시 */}
              {showTextArea && (
                <div
                  className="userDeleteReasonBox"
                  style={{ marginTop: "50px" }}
                >
                  <textarea
                    id="userDeleteReason"
                    rows="3"
                    placeholder="탈퇴 사유를 입력해주세요"
                    onChange={handleDeleteReasonChange}
                    onInput={handleResizeHeight}
                    style={{ fontSize: "14px", width: "80%" }}
                  ></textarea>
                </div>
              )}

              {textMinLengthAlert && (
                <div className="textMinLengthAlert">
                  *탈퇴 사유를 2자 이상 입력하세요.
                </div>
              )}

              <div className="userDeleteBtn" onClick={handleDeleteClick}>
                회원탈퇴
              </div>
            </TextBox>
          </TextContainer>
        </Container>
      </UserDeleteBox>
    </AnimationBox>
  );
}

export default MyPageUserDelete;
