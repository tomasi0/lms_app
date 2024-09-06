import Modal from "react-modal";
// import { useOutletContext } from "react-router-dom";

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../Styles/MyPageLecture.css";

import { CourseModal } from "../Course/CourseModal";

// API 엔드포인트
const urlCurrent = "http://localhost:8080/user/current"; // 세션 조회
const urlRegi = "http://localhost:8080/course/registration"; // 모든 강의등록 조회(All)
const urlProgress = "http://localhost:8080/progress/getAllLectureProgress"; // 진도 조회

// Sub Modal

// React Modal의 루트 엘리먼트를 설정합니다
Modal.setAppElement("#root");

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        transform: "translate(-50%, -50%)",
        width: "1300px", // 모달의 너비를 설정합니다. (기존 width)
        height: "800px", // 모달의 높이를 설정합니다. (기존 height)
        padding: "20px",
        borderRadius: "10px",
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.5)", // 오버레이의 배경색을 설정합니다.
    },
};

// export function MyPageLectureModal() {
export function MyPageLectureModal({ onClose }) {
    const [userId, setUserId] = useState(null); // User ID 데이터
    const [lectureData, setLectureData] = useState([]); // 강의 상태별 Count 데이터
    const [currentTab, setCurrentTab] = useState("summary"); // summary, studying, cancel, complete

    const [qaUrl, setQaUrl] = useState(""); // QA URL 상태 추가

    // useEffect(() => {
    //     fetchRegistrationData();
    // }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await axios.get(urlCurrent, {
                    withCredentials: true,
                }); // 세션 User ID 조회
                setUserId(data.userId);

                // window.alert("UserId: " + data.userId);

                const lecData = `http://localhost:8080/course/lectureStatusCount/id/${data.userId}`;
                await fetchLectureData(lecData); // 강의 상태별 Count 조회 및 상태 저장
                await userDataSet(lecData); // 강의 상태별 Count 조회 및 그래프 세팅
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    const fetchRegistrationData = async (tab) => {
        if (!userId) return; // 추가됨

        try {
            const urlRegiUserId = urlRegi + "/id/" + userId;

            // window.alert("urlRegiUserId: " + urlRegiUserId);

            const { data } = await axios.get(urlRegiUserId, {
                withCredentials: true,
            }); // 세션 조회

            // window.alert("강의등록 조회 개별:" + data);

            // studying, cancel, complete
            if (tab === "studying") {
                displayLecture(data);
            } else if (tab === "cancel") {
                displayCancelLecture(data);
            } else if (tab === "complete") {
                displayCompleteLecture(data);
            }

            // You can filter and set different types of lectures here
        } catch (error) {
            window.alert("Error fetching registration data load !!!");
        }
    };

    const fetchLectureData = async (lecData) => {
        try {
            const { data } = await axios.get(lecData, {
                withCredentials: true,
            }); // 그래프 강의상태별 Count 조회

            // window.alert("lectureStatusCount: " + data[0].lectureStatusCount);

            setLectureData(data);
        } catch (error) {
            console.error("Error fetching lecture data:", error);
        }
    };

    // ----------------------------------------요악정보----------------------------------------
    function userDataSet(lecData) {
        axios
            .get(lecData, { withCredentials: true })
            .then((response) => {
                console.log("응답 Response: ", response);

                const data = response.data;

                const classValue1 = data[0].lectureStatusCount;
                const classValue2 = data[1].lectureStatusCount;
                const classValue3 = data[2].lectureStatusCount;
                const classValue4 = data[3].lectureStatusCount;
                const classValue5 = data[4].lectureStatusCount;
                const classValue6 = data[5].lectureStatusCount;
                const classValue7 = data[6].lectureStatusCount;

                const graph1 = document.querySelector(".graphNum1");
                graph1.textContent = classValue1;
                const graph2 = document.querySelector(".graphNum2");
                graph2.textContent = classValue2;
                const graph3 = document.querySelector(".graphNum3");
                graph3.textContent = classValue3;
                const graph4 = document.querySelector(".graphNum4");
                graph4.textContent = classValue4;
                const graph5 = document.querySelector(".graphNum5");
                graph5.textContent = classValue5;
                const graph6 = document.querySelector(".graphNum6");
                graph6.textContent = classValue6;
                const graph7 = document.querySelector(".graphNum7");
                graph7.textContent = classValue7;

                document.getElementById("classGraphBar1").style.height =
                    classValue1 * 30 + "px";
                document.getElementById("classGraphBar2").style.height =
                    classValue2 * 30 + "px";
                document.getElementById("classGraphBar3").style.height =
                    classValue3 * 30 + "px";
                document.getElementById("classGraphBar4").style.height =
                    classValue4 * 30 + "px";
                document.getElementById("classGraphBar5").style.height =
                    classValue5 * 30 + "px";
                document.getElementById("classGraphBar6").style.height =
                    classValue6 * 30 + "px";
                document.getElementById("classGraphBar7").style.height =
                    classValue7 * 30 + "px";
            })
            .catch((error) => {
                console.log("에러 발생: ", error);
            });
    }

    // ----------------------------------------학 습 중----------------------------------------
    function displayLecture(lectureList) {
        console.log("displayLecture 응답 lectureList: ", lectureList);
        const tbody = document.querySelector(".studying-body");
        lectureList.forEach((data) => {
            axios
                .get(urlCurrent, { withCredentials: true })
                .then((response) => {
                    if (
                        response.data.userId === data.user.userId &&
                        data.lectureStatus == "I"
                    ) {
                        // 태그 요소 생성
                        const tr = document.createElement("tr");
                        const imgtd = document.createElement("td");
                        const lectureName = document.createElement("td");
                        const lectureDate = document.createElement("td");
                        const lectureProgress = document.createElement("td");
                        const progressBar = document.createElement("div");
                        const progressBar2 = document.createElement("div");
                        const classRoom = document.createElement("td");
                        const classRoomBtn = document.createElement("div");
                        const img = document.createElement("img");
                        // 클래스이름 생성
                        imgtd.classList.add("imgtd");
                        img.classList.add("image");
                        tr.classList.add("lectr");
                        lectureProgress.classList.add("lecProgress");
                        progressBar.classList.add("progressBar");
                        progressBar2.classList.add("progressBar2");
                        classRoomBtn.classList.add("classRoomBtn");
                        // 태그속성추가
                        img.src = data.lecture.imagePath;
                        lectureName.textContent = data.lecture.lectureName;
                        lectureDate.textContent =
                            data.lecture.educationPeriodStartDate +
                            " ~ " +
                            data.lecture.educationPeriodEndDate;
                        lectureProgress.textContent =
                            (
                                (data.progressLectureContentsSeq /
                                    data.finalLectureContentsSeq) *
                                100
                            ).toFixed(1) + "%";
                        progressBar2.style.width =
                            (
                                (data.progressLectureContentsSeq /
                                    data.finalLectureContentsSeq) *
                                100
                            ).toFixed(0) + "%";

                        classRoomBtn.textContent = "강의실";
                        // appendChild 부모자식 위치 설정
                        classRoom.appendChild(classRoomBtn);
                        progressBar.appendChild(progressBar2);
                        lectureProgress.appendChild(progressBar);
                        imgtd.appendChild(img);
                        tr.appendChild(lectureProgress);
                        tr.appendChild(imgtd);
                        tr.appendChild(lectureName);
                        tr.appendChild(lectureDate);
                        tr.appendChild(lectureProgress);
                        tr.appendChild(classRoom);
                        tbody.appendChild(tr);

                        // 나의학습[학습중]에서 강의실 홈으로 이동 => 수정 예정
                        classRoomBtn.addEventListener("click", () => {
                            // const courseUserId = data.user.userId;
                            // const courseLectureId = data.lecture.lectureId;
                            // http://localhost:3000/course/test01/L00000000057

                            // 현재 URL에서 '/mypage/'를 제거
                            // const baseUrl = window.location.href.replace(
                            //     "/home",
                            //     ""
                            // );

                            // const modalUrl = `${baseUrl}/course/${courseUserId}/${courseLectureId}`;
                            // const modalUrl = `/course/${courseUserId}/${courseLectureId}`;

                            // window.alert("modalUrl: " + modalUrl);

                            // // 새로운 경로로 변경
                            // // window.location.href = `${baseUrl}/course/${courseUserId}/${courseLectureId}`;
                            // window.open(
                            //     `${baseUrl}/course/${courseUserId}/${courseLectureId}`,
                            //     "_blank"
                            // );

                            // openModal(modalUrl);
                            openModal(data.user.userId, data.lecture.lectureId);
                        });

                        document
                            .querySelector("#lecturemenu2")
                            .addEventListener("click", () => {
                                progressBar2.animate(
                                    [
                                        { width: "0%" },
                                        {
                                            width:
                                                (
                                                    (data.progressLectureContentsSeq /
                                                        data.finalLectureContentsSeq) *
                                                    100
                                                ).toFixed(0) + "%",
                                        },
                                    ],
                                    {
                                        duration: 500,
                                        delay: 0,
                                        easing: "ease-in-out",
                                        fill: "forwards",
                                    }
                                );
                            });
                    }
                })
                .catch((error) => {
                    console.log("에러 발생: ", error);
                });
        });
    }

    // ----------------------------------------수강취소----------------------------------------
    function displayCancelLecture(lectureList) {
        console.log("displayCancelLecture 응답 lectureList: ", lectureList);
        const tbody = document.querySelector(".cancel-body");
        const Cyears = document.querySelector("#userCancelLecSearchYears");
        lectureList.forEach((data, index) => {
            if (
                userId === data.user.userId &&
                data.lectureStatus == "I" &&
                data.lectureCompletedCheck == "N"
            ) {
                // 태그 요소 생성
                const tr = document.createElement("tr");
                const imgtd = document.createElement("td");
                const lectureName = document.createElement("td");
                const lectureDate = document.createElement("td");
                const startDate = document.createElement("td");
                const lectureCancel = document.createElement("td");
                const lectureCancelBtn = document.createElement("div");
                const img = document.createElement("img");
                // 클래스이름 생성
                imgtd.classList.add("imgtd");
                img.classList.add("image");
                tr.classList.add("lectr");
                lectureCancel.classList.add("lectureCancel");
                lectureCancelBtn.classList.add("lectureCancelBtn");
                lectureCancelBtn.id = `lectureCancelBtn-${index}`;
                // 태그속성추가
                img.src = data.lecture.imagePath;
                lectureName.textContent = data.lecture.lectureName;
                lectureDate.textContent =
                    data.lecture.educationPeriodStartDate +
                    " ~ " +
                    data.lecture.educationPeriodEndDate;
                startDate.textContent = data.courseRegistrationDate;
                lectureCancel.textContent = "수강승인";
                lectureCancelBtn.textContent = "수강취소";

                // appendChild 부모자식 위치 설정
                imgtd.appendChild(img);
                lectureCancel.appendChild(lectureCancelBtn);
                tr.appendChild(imgtd);
                tr.appendChild(lectureName);
                tr.appendChild(lectureDate);
                tr.appendChild(startDate);
                tr.appendChild(lectureCancel);
                tbody.appendChild(tr);

                document.getElementById(`lectureCancelBtn-${index}`).onclick =
                    function () {
                        if (window.confirm("해당 강좌를 삭제하시겠습니까?")) {
                            const deleteUrl = `http://localhost:8080/course/delCourseRegistration/${data.user.userId}/${data.lecture.lectureId}`;

                            axios
                                .delete(deleteUrl, { withCredentials: true })
                                .then((response) => {
                                    console.log("데이터:", response.data);
                                    tr.innerHTML = "";
                                    alert("삭제되었습니다.");
                                })
                                .catch((error) => {
                                    window.alert(
                                        "해당 강좌 삭제 Error: " + error
                                    );
                                    console.log("에러 발생: ", error);
                                });
                        }
                    };
            }
        });
    }

    // ----------------------------------------수강종료----------------------------------------
    function displayCompleteLecture(lectureList) {
        console.log("displayCompleteLecture 응답 lectureList: ", lectureList);
        const tbody = document.querySelector(".complete-body");
        lectureList.forEach((data) => {
            if (
                userId === data.user.userId &&
                data.lectureCompletedCheck == "Y"
            ) {
                // 태그 요소 생성
                const tr = document.createElement("tr");
                const imgtd = document.createElement("td");
                const lectureName = document.createElement("td");
                const lectureDate = document.createElement("td");
                // const lectureGrade = document.createElement("td");
                const isLectureEnd = document.createElement("td");
                const classRoom = document.createElement("td");
                const reviewBtn = document.createElement("div");
                const img = document.createElement("img");
                // 클래스이름 생성
                imgtd.classList.add("imgtd");
                img.classList.add("image");
                tr.classList.add("lectr");
                reviewBtn.classList.add("reviewBtn");
                // 태그속성추가
                img.src = data.lecture.imagePath;
                lectureName.textContent = data.lecture.lectureName;
                lectureDate.textContent =
                    data.lecture.educationPeriodStartDate +
                    " ~ " +
                    data.lecture.educationPeriodEndDate;
                isLectureEnd.textContent =
                    data.lectureStatus == "C"
                        ? "수료"
                        : data.lectureStatus == "I"
                        ? "미수료"
                        : console.log("lectureStatus error!!!");
                reviewBtn.textContent = "강의리뷰";

                // appendChild 부모자식 위치 설정
                imgtd.appendChild(img);
                classRoom.appendChild(reviewBtn);
                tr.appendChild(imgtd);
                tr.appendChild(lectureName);
                tr.appendChild(lectureDate);
                // tr.appendChild(lectureGrade);
                tr.appendChild(isLectureEnd);
                tr.appendChild(classRoom);
                tbody.appendChild(tr);
            }
        });
    }

    // TabPage 변경시 이벤트 처리
    const handleTabClick = (tab) => {
        setCurrentTab(tab);
        // window.alert("TabPage: " + tab);

        if (tab === "summary") {
            const lecData = `http://localhost:8080/course/lectureStatusCount/id/${userId}`;
            userDataSet(lecData); // 강의 상태별 Count 조회 및 그래프 세팅
        } else {
            // studying, cancel, complete
            fetchRegistrationData(tab); // 강의 등록 정보 조회
        }
    };

    /* Sub Modal 관련 */
    const [modalOpen, setModalOpen] = useState(false);
    // const [modalReturn, setModalReturn] = useState(null);
    const [modalContent, setModalContent] = useState(null);

    const openModal = (userId, lectureId) => {
        setModalContent({ userId, lectureId });
        setModalOpen(true);
    };

    const closeModal = (qaUrl) => {
        setModalOpen(false);
        setModalContent(null);

        // window.alert("MyPageLectureModal ModalResponse Message: " + qaUrl);
        onClose(qaUrl);
    };

    return (
        // <div className="container">
        <div className="main-content">
            {/* <div className="root"> */}
            <div className="main-top">
                <div className="userLecture-box">
                    <h2 className="userLectureBoxTitle">나의학습</h2>
                    <div className="lectureMenuBox">
                        <div
                            className={`lecturemenu ${
                                currentTab === "summary" ? "active" : ""
                            }`}
                            onClick={() => handleTabClick("summary")}
                        >
                            요약정보
                        </div>
                        <div
                            className={`lecturemenu ${
                                currentTab === "studying" ? "active" : ""
                            }`}
                            onClick={() => handleTabClick("studying")}
                        >
                            학습중
                        </div>
                        <div
                            className={`lecturemenu ${
                                currentTab === "cancel" ? "active" : ""
                            }`}
                            onClick={() => handleTabClick("cancel")}
                        >
                            수강취소
                        </div>
                        <div
                            className={`lecturemenu ${
                                currentTab === "complete" ? "active" : ""
                            }`}
                            onClick={() => handleTabClick("complete")}
                        >
                            수강종료
                        </div>
                    </div>

                    {currentTab === "summary" && (
                        <div className="userLectureGraphContainer">
                            <h2 className="userEducationActivityTitle">
                                나의 학습활동
                            </h2>
                            <div className="userLectureGraph">
                                <div className="userGraphSearchBar">
                                    <select id="userGraphSearchYears" required>
                                        <option value="" disabled selected>
                                            연도
                                        </option>
                                        <option value="2024">2024</option>
                                    </select>
                                    <div id="userGraphSearchBtn">검색</div>
                                </div>

                                <div className="userLectureGraphGraduations">
                                    {/* 그래프 눈금 */}
                                    <ul className="graphY-axis">
                                        {[...Array(11).keys()].map((i) => (
                                            <li key={i}>
                                                <span>{10 - i}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* 그래프 바 */}
                                    <ul className="graphBar">
                                        {lectureData.map((_, index) => (
                                            <li key={index}>
                                                <div
                                                    id={`classGraphBar${
                                                        index + 1
                                                    }`}
                                                >
                                                    <div className="graphNumBottom"></div>
                                                    <div
                                                        className={`graphNum graphNum${
                                                            index + 1
                                                        }`}
                                                    ></div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* 그래프 목록 */}
                                    <ul className="graphX-axis">
                                        <li>
                                            <div>수강신청</div>
                                        </li>
                                        <li>
                                            <div>수강대기</div>
                                        </li>
                                        <li>
                                            <div>수강반려</div>
                                        </li>
                                        <li>
                                            <div>학습중</div>
                                        </li>
                                        <li>
                                            <div>수료처리중</div>
                                        </li>
                                        <li>
                                            <div>수료</div>
                                        </li>
                                        <li>
                                            <div>미수료</div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentTab === "studying" && (
                        <div className="userLectureStudyingContainer">
                            <div className="studyingList">
                                <table className="studying-table">
                                    <thead>
                                        <tr className="lecTableList">
                                            <th colspan="2">강의제목</th>
                                            <th>교육기간</th>
                                            <th>진도율</th>
                                            <th>
                                                <a href="#">강의실</a>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="studying-body">
                                        {/* 학습중 강의를 여기에 추가 */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {currentTab === "cancel" && (
                        <div className="userLectureCancelContainer">
                            <div className="userCancelLecSearchBarBorder">
                                <div className="userCancelLecSearchBar">
                                    <select
                                        id="userCancelLecSearchYears"
                                        required
                                    >
                                        <option value="" disabled selected>
                                            연도
                                        </option>
                                        <option value="2024">2024</option>
                                    </select>
                                    <div id="userCancelLecSearchBtn">검색</div>
                                </div>
                            </div>

                            <div className="cancelList">
                                <table className="cancel-table">
                                    <thead>
                                        <tr className="lecCancelList">
                                            <th colspan="2">강의제목</th>
                                            <th>교육기간</th>
                                            <th>수강신청일</th>
                                            <th>상태</th>
                                        </tr>
                                    </thead>
                                    <tbody className="cancel-body">
                                        {/* 수강취소 강의를 여기에 추가 */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {currentTab === "complete" && (
                        <div className="userLectureCompleteContainer">
                            <div className="userCompleteLecSearchBarBorder">
                                <div className="userCompleteLecSearchBar">
                                    <select required>
                                        <option value="" disabled selected>
                                            연도
                                        </option>
                                        <option value="2024">2024</option>
                                    </select>
                                    <div id="userCompleteLecSearchBtn">
                                        검색
                                    </div>
                                </div>
                            </div>

                            <div className="completelList">
                                <table className="complete-table">
                                    <thead>
                                        <tr className="lecCompleteList">
                                            <th colspan="2">강의제목</th>
                                            <th>교육기간</th>
                                            <th>수료</th>
                                            <th>리뷰</th>
                                        </tr>
                                    </thead>
                                    <tbody className="complete-body">
                                        {/* 수강완료 강의를 여기에 추가 */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 서브 모달 */}
            <Modal
                isOpen={modalOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Course"
            >
                <span
                    className="close"
                    onClick={closeModal}
                    style={{
                        cursor: "pointer",
                        fontSize: "1.5rem",
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        color: "white", // 버튼 색상을 하얀색으로 설정
                    }}
                >
                    &times;
                </span>
                <div
                    className="subModalContent"
                    style={{
                        width: "1240px",
                        height: "740px",
                        // overflow: "hidden",
                        overflow: "auto", // 스크롤을 활성화합니다.
                    }}
                >
                    {/* 모달 콘텐츠를 동적으로 렌더링할 수 있습니다 */}
                    {/* {modalContent ? (
                        <iframe
                            src={modalContent}
                            style={{ width: "100%", height: "100%" }}
                            title="Course"
                        />
                    ) : (
                        <p>Loading...</p>
                    )} */}

                    {modalContent ? (
                        // <iframe
                        //     src={modalContent}
                        //     style={{ width: "100%", height: "100%" }}
                        //     title="Course"
                        // />

                        <CourseModal
                            userId={modalContent.userId}
                            lectureId={modalContent.lectureId}
                            onClose={closeModal}
                        />
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </Modal>
        </div>
    );
}

export default MyPageLectureModal;
