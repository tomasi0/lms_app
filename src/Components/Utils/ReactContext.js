import { useState, useContext, createContext } from "react";

const UserContext = createContext(); // 컨텍스트 생성

export function ReactContext() {
    const [user, setUser] = useState("Tom");

    return (
        <>
            <UserContext.Provider value={{ user, setUser }}>
                {" "}
                {/* // 객체형으로 넣으면 받을때에도 구조분해할당으로 받아야 함 */}
                <Component1 />
            </UserContext.Provider>
        </>
    );
}

function Component1() {
    return (
        <>
            <h1>Component1</h1>
            <Component2 />
        </>
    );
}

function Component2() {
    return (
        <>
            <h1>Component2</h1>
            <Component3 />
        </>
    );
}

function Component3() {
    return (
        <>
            <h1>Component3</h1>
            <Component4 />
        </>
    );
}

function Component4() {
    const { user, setUser } = useContext(UserContext);
    return (
        <>
            <h1>Component4</h1>
            <p>Hello {user}</p>
        </>
    );
}
