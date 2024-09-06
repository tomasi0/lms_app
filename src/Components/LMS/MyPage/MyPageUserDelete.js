import React, { useState, useEffect } from "react";
import axios from "axios";
// import "../../../Styles/styleMypage.css";
import "../../../Styles/MyPageUserDelete.css";
import styled, { keyframes } from "styled-components";

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
    animation: ${fadeIn} 0.6s ease-out;
`;

const UserDeleteBox = styled.div`
    padding: 30px 100px 50px 100px;
    width: 100%;
    /* height: 500px; */
    /* background-color: whitesmoke; */
    background-color: transparent;
`;

export function MyPageUserDelete() {
    const [userId, setUserId] = useState("");
    const [userOffice, setUserOffice] = useState("DW 아카데미");
    const [joinDate, setJoinDate] = useState("");
    const [userDeleteReason, setUserDeleteReason] = useState("");
    const [textMinLengthAlert, setTextMinLengthAlert] = useState(false);

    const urlCurrent = "http://localhost:8080/user/current";
    const urlDelete = "http://localhost:8080/api/withdrawal/saveWithdrawal";
    const urlLogout = "http://localhost:8080/user/logout";

    useEffect(() => {
        // 로드 시 사용자 정보 요청
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
                                    window.location.href = "index.html";
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

    return (
        <AnimationBox>
            <div className="main-content">
                <div className="main-top">
                    <UserDeleteBox>
                        <h2
                            className="userDeleteBoxTitle"
                            style={{ color: "#556b2f" }}
                        >
                            회원탈퇴
                        </h2>
                        <div className="userDeleteContainer">
                            <table className="delete-table">
                                <thead>
                                    <colgroup>
                                        <col style={{ width: "20%" }} />
                                        <col style={{ width: "30%" }} />
                                        <col style={{ width: "35%" }} />
                                        <col style={{ width: "15%" }} />
                                    </colgroup>
                                    <tr className="deleteList deleteList1">
                                        <th style={{ color: "#9da2b9" }}>
                                            아이디
                                        </th>
                                        <th style={{ color: "#9da2b9" }}>
                                            훈련기관명
                                        </th>
                                        <th style={{ color: "#9da2b9" }}>
                                            가입일
                                        </th>
                                        <th style={{ color: "#9da2b9" }}>
                                            탈퇴 확인
                                        </th>
                                    </tr>
                                    <tr className="deleteList deleteList2">
                                        <td
                                            className="deleteUserId"
                                            style={{ color: "#fff" }}
                                        >
                                            {userId}
                                        </td>
                                        <td
                                            className="deleteOffice"
                                            style={{ color: "#fff" }}
                                        >
                                            {userOffice}
                                        </td>
                                        <td
                                            className="deleteJoinDate"
                                            style={{ color: "#fff" }}
                                        >
                                            {joinDate}
                                        </td>
                                        <td
                                            className="deleteSelect"
                                            style={{ color: "#fff" }}
                                        >
                                            <input
                                                className="deleteSelectBox"
                                                type="checkbox"
                                            />
                                        </td>
                                    </tr>
                                </thead>
                            </table>
                            <h2
                                className="userDeleteReasonTitle"
                                style={{ color: "#fff" }}
                            >
                                탈퇴사유
                            </h2>
                            <div className="userDeleteReasonBox">
                                <textarea
                                    id="userDeleteReason"
                                    rows="3"
                                    placeholder="탈퇴 사유를 입력해주세요"
                                    onChange={handleDeleteReasonChange}
                                    onInput={handleResizeHeight}
                                ></textarea>
                            </div>
                            {textMinLengthAlert && (
                                <div className="textMinLengthAlert">
                                    *탈퇴 사유를 2자 이상 입력하세요.
                                </div>
                            )}
                            <div
                                className="userDeleteBtn"
                                onClick={handleDeleteClick}
                            >
                                회원탈퇴
                            </div>
                        </div>
                    </UserDeleteBox>
                </div>
            </div>
        </AnimationBox>
    );
}

export default MyPageUserDelete;
