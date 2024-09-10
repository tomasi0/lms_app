import { createGlobalStyle } from "styled-components";
import { LMS } from "./Components/LMS/LMS";

// import { ReactRouter } from "./Components/Router/ReactRouter";
// import { MovieShop } from "./Components/240725/MovieShop/MovieShop";
// import { ReactContext } from "./Components/Utils/ReactContext";
// import { ResponsivePage } from "./Components/Utils/ResponsivePage";
// import { ReactRef } from "./Components/Utils/ReactRef";
// import { TopDownAction } from "./Components/Unity/TopDownAction";
// import { Home } from "./Components/240724/Home";
// import { NinjasAPI } from "./Components/240725/NinjasAPI";
// import { BasicRouter } from "./Components/240725/BasicRouter/BasicRouter";
// import { ReactRouter } from "./Components/240725/BasicRouter/ReactRouter";
// import { Gallery } from "./Components/240723/Gallery";
// import { CounterState } from "./Components/240723/CounterState";
// import { ScoreWrapper } from "./Components/240723/ScoreWrapper";
// import { AvatarWrapper } from "./Components/240723/AvatarWrapper";
// import { Test1 } from "./Components/240722/Test1";
// import { Test2 } from "./Components/240722/Test2";
// import { List } from "./Components/240722/List";
// import { ListWrapper } from "./Components/240722/ListWrapper";
// import logo from './logo.svg';
// import './App.css';

const GlobalStyle = createGlobalStyle`
  @font-face {
      font-family: 'GmarketSansMedium';
      src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff');
      font-weight: normal;
      font-style: normal;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: GmarketSansMedium;
    background-color: #0f1015;
  }
  
`;

function App() {
    // <Gallery />
    // <CounterState />
    // <ScoreWrapper />
    // <AvatarWrapper />
    // <ListWrapper />
    // <Test1 />
    // <Test2 />
    // <ReactRouter />
    // <BasicRouter />
    // <NinjasAPI />
    // <GlobalStyle />
    // <Home />
    // <ReactContext />
    // <MovieShop />
    // <ResponsivePage />
    // <ReactRef />
    // <TopDownAction />
    // <LMS />

    return (
        <>
            <GlobalStyle />
            <LMS />
        </>
    );

    // 순수 자바스크립트 영역
    // const name = getUserName();

    // // 빈 테그로 사용 가능
    // return (
    // <>
    //   { name != null ? (
    //   <>
    //     <TopMenu></TopMenu>
    //     <div className="name">{name}</div>
    //     <SideMenu style={{color: "white", margin: "10px"}}></SideMenu>
    //     <Content></Content>
    //     <footer></footer>
    //   </> // 반드시 부모를 가져야 함
    //   ) : (
    //       <p>Name is not found!!</p>
    //   )}
    // </>
    // );

    // return 뒤는 JSX 영역
    // return 뒤에 시작 코드가 있어야 함
    // return <div>
    //   <TopMenu></TopMenu>
    //   <SideMenu></SideMenu>
    //   <Content></Content>
    //   <footer></footer>
    // </div>;

    // return <div>Hello React World!</div>;

    // return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>

    // );
}

// function getUserName() {}

export default App;
