import { Unity, useUnityContext } from "react-unity-webgl";
import { useState, useEffect } from "react";
import styled from "styled-components";

// 게임을 로드할 화면을 만듬
const Container = styled.div`
    width: 1344px;
    height: 756px;
    margin: auto;
    border: 1px solid gray;
`;

export function TopDownAction() {
    // const { unityProvider } = useUnityContext({
    //     loaderUrl: "build/myunityapp.loader.js",
    //     dataUrl: "build/myunityapp.data",
    //     frameworkUrl: "build/myunityapp.framework.js",
    //     codeUrl: "build/myunityapp.wasm",
    // });

    const [playingGame, setPlayingGame] = useState(false);

    const [isGameOver, setIsGameOver] = useState(false);
    const [userName, setUserName] = useState();
    const [score, setScore] = useState();

    // React 에서 Unity 로 sendMessage 를 통해 전달하기
    const {
        unityProvider,
        sendMessage,
        addEventListener,
        removeEventListener,
    } = useUnityContext({
        loaderUrl: "build/Build.loader.js",
        dataUrl: "build/Build.data",
        frameworkUrl: "build/Build.framework.js",
        codeUrl: "build/Build.wasm",
    });

    function handleGameOver(userName, score) {
        setIsGameOver(true);
        setUserName(userName);
        setScore(score);
    }

    useEffect(() => {
        addEventListener("GameOver", handleGameOver);
        return () => {
            removeEventListener("GameOver", handleGameOver);
        };
    }, []);

    return (
        <>
            <h1>Top Down Action Game</h1>
            <button onClick={() => setPlayingGame(true)}>Start Game</button>
            <button onClick={() => sendMessage("Player", "Attack")}>
                Attack
            </button>
            <Container>
                {playingGame ? (
                    <Unity
                        unityProvider={unityProvider}
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    />
                ) : null}
            </Container>

            {/* // Unity 에서 게임오버 메시지를 받으면 출력후 종료 */}
            {isGameOver === true && (
                <p>{`Game Over ${userName}! You've scored ${score} points.`}</p>
            )}
        </>
    );
}
