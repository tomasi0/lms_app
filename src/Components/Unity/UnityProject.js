import React, { useState, useEffect, useRef } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import styled, { keyframes } from "styled-components";

import Modal from "react-modal";

// Admin
import { UserManagement } from "../LMS/Admin/UserManagement";
import { LectureManagement } from "../LMS/Admin/LectureManagement";
import { EnrollmentManagement } from "../LMS/Admin/EnrollmentManagement";

// Lecture
// import { LectureList } from "../LMS/Lecture/LectureList";
import { LectureListModal } from "../LMS/Lecture/LectureListModal";

// Cart
import { CartModal } from "../LMS/Cart/CartModal";

// MyPage
import { MyPageUser } from "../LMS/MyPage/MyPageUser";
// import { MyPageLecture } from "../LMS/MyPage/MyPageLecture";
import { MyPageLectureModal } from "../LMS/MyPage/MyPageLectureModal";
import { MyPageUserDelete } from "../LMS/MyPage/MyPageUserDelete";

// Community
import { NoticesModal } from "../LMS/Community/NoticesModal.js";
import { QAModal } from "../LMS/Community/QAModal.js";
import { EventsModal } from "../LMS/Community/EventsModal.js";

import axios from "axios";

const GameBG = styled.div`
    width: 100%;
    /* height: 991px; */
    height: 100vh; /* 화면 높이와 맞추기 위해 100vh로 변경 */
    position: absolute;
    top: 0;
    background-image: url("/reactimage/Gamebg.png");
    background-size: cover;
    background-position: center;
    overflow: hidden; /* 추가 */
`;

const GameBox = styled.div`
    position: relative;
`;

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

// 게임을 로드할 화면을 만듬
const Container = styled.div`
    /* top: 2px;
    left: 86px;
    width: 1726px;
    height: 690px; */

    position: absolute;
    top: -1px;
    left: 120px;
    width: 1671px;
    height: 690px;

    margin: 80px auto;
    border: 1px solid gray;
    animation: ${fadeIn} 0.6s ease-out;
`;

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        transform: "translate(-50%, -50%)",
        width: "1400px", // 모달의 너비를 설정합니다. (기존 width)
        height: "865px", // 모달의 높이를 설정합니다. (기존 height)
        padding: "20px",
        borderRadius: "10px",
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.5)", // 오버레이의 배경색을 설정합니다.
    },
};

export function UnityProject() {
    let qaUrlResponse = "";
    const playingGame = true;

    //let playingGame = false;
    // const [playingGame, setPlayingGame] = useState(false);

    const [isGameOver, setIsGameOver] = useState(false);
    const [userName, setUserName] = useState();
    const [score, setScore] = useState();

    const [modalOpen, setModalOpen] = useState(false);
    // const modalBackground = useRef();

    const [modalReturn, setModalReturn] = useState(null);

    const [playerName, setPlayerName] = useState("");

    const closeModal = (qaUrl) => {
        if (!qaUrl) {
            setModalOpen(false);
        } else {
            // window.alert("UnityProject ModalResponse Message: " + qaUrl);
            qaUrlResponse = qaUrl;
        }
    };

    // React 에서 Unity 로 sendMessage 를 통해 전달하기
    const {
        unityProvider,
        sendMessage,
        addEventListener,
        removeEventListener,
        isLoaded,
        loadingProgression,
    } = useUnityContext({
        loaderUrl: "build/Build.loader.js",
        dataUrl: "build/Build.data",
        frameworkUrl: "build/Build.framework.js",
        codeUrl: "build/Build.wasm",
    });

    useEffect(() => {
        if (isLoaded) {
            // 게임이 로드되면 이벤트 리스너를 추가합니다.
            addEventListener("GameReady", handleGameReady);
        }

        // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
        return () => {
            removeEventListener("GameReady", handleGameReady);
        };
    }, [isLoaded, addEventListener, removeEventListener]);

    function handleGameReady() {
        console.log("Game is ready to receive messages");

        const urlCurrent = "http://localhost:8080/user/current"; // 세션 조회

        axios
            .get(urlCurrent, {
                withCredentials: true,
            })
            .then((response) => {
                const playerName = response.data.userName;

                if (playerName) {
                    sendMessage("Canvas", "SetPlayerName", playerName);
                }
            })
            .catch((error) => {
                console.log("에러 발생: ", error);
            });
    }

    // Unity 에서 React 로 전달
    function handleGameOver(userName, score) {
        setIsGameOver(true);
        setUserName(userName);
        setScore(score);
    }

    // // Unity에서 호출될 JavaScript 함수
    // function handleOpenReactWindow(romeName) {
    //     // 예를 들어, 새로운 브라우저 창을 열도록 구현할 수 있습니다.
    //     // React 애플리케이션의 URL로 새로운 탭을 열기
    //     window.open("http://localhost:3000/community/notices", "_blank");
    // }

    // Unity에서 호출될 JavaScript 함수
    function handleOpenReactWindow(romeName) {
        // 예를 들어, 새로운 브라우저 창을 열도록 구현할 수 있습니다.
        // React 애플리케이션의 URL로 새로운 탭을 열기

        setModalOpen(true);

        // Admin (회원관리, 강의관리, 수강관리)
        // MyPage (회원정보, 나의학습, 회원탈퇴)
        // Community (공지사항, 이벤트, 질의응답)
        // Lecture & Cart (강의, 장바구니, 로그아웃)

        if (romeName == "회원정보") {
            setModalReturn(() => MyPageUser); // React component function
        } else if (romeName == "나의학습") {
            setModalReturn(() => MyPageLectureModal); // => 새로운 브라우저 창 열기
        } else if (romeName == "회원탈퇴") {
            setModalReturn(() => MyPageUserDelete); // React component function
        } else if (romeName == "공지사항") {
            setModalReturn(() => NoticesModal); // React component function
        } else if (romeName == "이벤트") {
            setModalReturn(() => EventsModal); // React component function
        } else if (romeName == "질의응답") {
            setModalReturn(() => QAModal); // React component function
        } else if (romeName == "회원관리") {
            setModalReturn(() => UserManagement); // React component function
        } else if (romeName == "강의관리") {
            setModalReturn(() => LectureManagement); // React component function
        } else if (romeName == "수강관리") {
            setModalReturn(() => EnrollmentManagement); // React component function
        } else if (romeName == "강의") {
            setModalReturn(() => LectureListModal); // => 새로운 브라우저 창 열기
        } else if (romeName == "장바구니") {
            setModalReturn(() => CartModal); // React component function
        } else if (romeName == "로그아웃") {
            setModalReturn(() => {
                window.location.href = "http://localhost:3000/Login";
            }); // React component function
        }
    }

    useEffect(() => {
        addEventListener("GameOver", handleGameOver);
        return () => {
            removeEventListener("GameOver", handleGameOver);
        };
    }, []);

    useEffect(() => {
        addEventListener("OpenReactWindow", handleOpenReactWindow);
        return () => {
            removeEventListener("OpenReactWindow", handleOpenReactWindow);
        };
    }, []);

    function ReactToUnityJSON(urlLectureContentQA) {
        // const urlLectureContentQA = `http://localhost:8080/learning/contents/qa/${lectureId}/${data.learningContentsSeq}`; // /{lectureId}/{learningContentsSeq}
        // const urlLectureContentQA = `http://localhost:8080/learning/contents/qa/L00000000052/3`; // /{lectureId}/{learningContentsSeq}

        // window.alert("urlLectureContentQA: " + urlLectureContentQA);

        axios
            .get(urlLectureContentQA, {
                withCredentials: true,
            })
            .then((response) => {
                console.log("UnityProject Response 데이터:", response.data);
                // window.alert(
                //     "response.data: " +
                //         response.data[0].question +
                //         "@" +
                //         response.data[1].question +
                //         "@" +
                //         response.data[2].question
                // );

                const jsonData = JSON.stringify(response.data);

                // window.alert("React jsonData: " + jsonData);

                // Unity로 데이터 전송
                // sendMessage("DataReceiverObject", "ReceiveJsonData", jsonData);
                // sendMessage("DataReceiver", "ReceiveJsonData", jsonData);

                // window.alert("SendMessage Start!!!");

                sendMessage("Canvas", "ReceiveJsonData", jsonData);
            })
            .catch((error) => {
                console.log("에러 발생: ", error);
            });
    }

    function RequestFocus() {
        // Focus 문제로 버그가 있어서, 이 부분을 제외할 경우 상단키를 입력하지 않으면, 플레이어 컨트롤이 안됨.
        window.alert("계속 게임을 진행합니다.");
        ReactToUnityJSON(qaUrlResponse);
        setModalOpen(false);
    }

    return (
        <>
            <GameBG>
                <GameBox>
                    {/* <h1>UnityProject Game</h1> */}
                    {/* <button onClick={() => {
                playingGame = true;
//                PlayingGame(true)
            }}>Start Game</button> */}

                    {/* // 버튼 테스트
            <button onClick={() => sendMessage("PortalManager", "PauseGame")}>
                Pause Game
            </button>
            <button
                onClick={() => sendMessage("PortalManager", "ContinueGame")}
            >
                Continue Game
            </button>
            <button onClick={() => sendMessage("Player", "Attack")}>
                Attack
            </button> */}

                    {/*<button
                onClick={() =>
                    sendMessage("Canvas", "SetPlayerName", "테스트01")
                }
            >
                플레이어 이름 전달
            </button> */}

                    {/* <button
                onClick={() =>
                    ReactToUnityJSON(
                        "http://localhost:8080/learning/contents/qa/L00000000052/3"
                    )
                }
            >
                ReactToUnityJSON
            </button> */}

                    <Container>
                        {/* <div className={"btn-wrapper"}>
                            <button
                                className={"modal-open-btn"}
                                onClick={() => setModalOpen(true)}
                            >
                                모달 열기
                            </button>
                        </div> */}

                        {playingGame ? (
                            <Unity
                                unityProvider={unityProvider}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                }}
                            />
                        ) : null}

                        {modalOpen && (
                            <div
                                className={"modal-container"}
                                // ref={modalBackground}
                                // onClick={(e) => {
                                //     // 모달 밖의 부분 클릭시 Close
                                //     if (e.target === modalBackground.current) {
                                //         setModalOpen(false);
                                //         sendMessage("PortalManager", "ContinueGame");
                                //         RequestFocus();
                                //     }
                                //}}
                            >
                                {/* <div className={"modal-content"}> */}
                                <Modal
                                    isOpen={modalOpen}
                                    shouldCloseOnOverlayClick={false} // 모달 바깥을 클릭해도 모달이 닫히지 않도록 설정
                                    onRequestClose={() => {
                                        setModalOpen(false);
                                    }}
                                    style={customStyles} // 스타일을 적용합니다.
                                    contentLabel="Modal Window"
                                >
                                    <span
                                        className="close"
                                        /* 오른쪽 상단 x 클릭시 Close */
                                        onClick={() => {
                                            setModalOpen(false);
                                            sendMessage(
                                                "PortalManager",
                                                "ContinueGame"
                                            );
                                            RequestFocus();
                                        }}
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
                                    {/* <h1>리액트로 모달</h1> */}
                                    {modalReturn &&
                                        React.createElement(
                                            modalReturn,
                                            modalReturn === MyPageLectureModal
                                                ? { onClose: closeModal }
                                                : {}
                                        )}
                                    {/* {modalReturn && React.createElement(modalReturn)} */}
                                    <br></br>
                                    {/* <button
                                        // [모달 닫기] 버튼 클릭시 Close
                                        onClick={() => {
                                            setModalOpen(false);
                                            sendMessage(
                                                "PortalManager",
                                                "ContinueGame"
                                            );
                                            RequestFocus();
                                        }}
                                    >
                                        모달 닫기
                                    </button> */}
                                </Modal>
                                {/* </div> */}
                            </div>
                        )}
                    </Container>
                </GameBox>
            </GameBG>

            {/* // Unity 에서 게임오버 메시지를 받으면 출력후 종료 */}
            {isGameOver === true && (
                <p>{`Game Over ${userName}! You've scored ${score} points.`}</p>
            )}
        </>
    );
}
