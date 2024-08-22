import { useRef } from "react";

export function ReactRef() {
    const inputRef = useRef(null);
    const h3Ref = useRef(null);

    console.log("ReactRef 렌더링...");

    return (
        <>
            <div>
                <input ref={inputRef}></input>

                {/* // inputRef 는 객체, inputRef.current 가 */}
                <button onClick={() => inputRef.current.focus()}>
                    입력창에 포커스
                </button>
                <h3 ref={h3Ref}></h3>
                <button
                    onClick={() => {
                        h3Ref.current.textContent = "테스트";
                    }}
                >
                    h3태그에 텍스트 입력
                </button>
            </div>
        </>
    );
}
