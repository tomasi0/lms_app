// import styled from "styled-components";
// import { useState, useEffect } from "react";
// import { IMG_PATH } from "../api";
// import { useNavigate, useLocation } from "react-router-dom";
// import { searchMoviesByKeyword, getGenre } from "../api";

// const SearchBox = styled.div``;

// const Input = styled.input`
//   width: 500px;
//   margin-right: 5px;
// `;

// const Container = styled.div`
//   width: 100%;
//   display: grid;
//   grid-template-columns: 1fr 1fr 1fr;
//   gap: 10px;
//   margin-top: 20px;
//   margin-bottom: 50px;
// `;

// const Card = styled.div`
//   width: 100%;
//   border: 1px solid dodgerblue;
//   cursor: pointer;
//   padding: 10px;
// `;

// const Img = styled.img`
//   width: 100%;
// `;

// const Text = styled.div`
//   color: #333;
//   margin: 2px 0;
// `;

// export function Search() {
//   const [data, setData] = useState(null);
//   const [inputValue, setInputValue] = useState("");

//   const navigate = useNavigate(); // url 변경시키는 함수

//   const location = useLocation();
//   const keyword = new URLSearchParams(location.search).get("keyword"); // keyword => inputValue

//   // 키워드가 없으면, 예전 검색이 다시 뜨지 않도록 초기화
//   useEffect(() => {
//     if (keyword) {
//       searchMovies();
//     } else {
//       setData(null);
//     }
//   }, [keyword]);

//   async function searchMovies(keyword) {
//     try {
//       const response = await searchMoviesByKeyword(keyword);
//       console.log(response.data);
//       setData(response.data);
//     } catch (error) {
//       console.log("Error", error);
//     }
//   }

//   return (
//     <>
//       <SearchBox>
//         <h1>상세조회 페이지 입니다.</h1>
//         <Input
//           placeholder="검색어를 입력해주세요"
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//         />
//         <button
//           // inputValue 를 url [/search?] 뒤에 붙여 api 전달 예정 [/search?keyword=batman]
//           onClick={() => {
//             navigate(`?query=${inputValue}`); // requestParam
//             searchMovies(inputValue);
//           }}
//         >
//           Search
//         </button>
//       </SearchBox>
//       {/* // keyword 가 있으면 keyword, 없으면 null */}
//       <h3>{keyword ? `"${keyword}" 로 검색한 결과 ` : null}</h3>
//       <Container>
//         {data &&
//           data.results.map((movie) => (
//             <Card
//               key={movie.id}
//               onClick={() => {
//                 navigate(`/movie/${movie.id}`);
//               }}
//             >
//               {/* <Img src={IMG_PATH + movie.backdrop_path}></Img> */}
//               <Img src={IMG_PATH + movie.poster_path}></Img>
//               <Text>
//                 <b>타이틀 : {movie.title} </b>
//               </Text>
//               <Text>
//                 <b>장르 : {getGenre(movie.genre_ids)} </b>
//               </Text>
//               <hr />
//               <Text>{movie.overview}</Text>
//             </Card>
//           ))}
//       </Container>
//     </>
//   );
// }
import React, { useState, useEffect } from "react";
import styled from "styled-components";

// Styled components 정의
const Wrap = styled.div`
  position: relative;
  top: ${(props) => props.top}vh;
  width: 100%;
  height: 100%;
  transition: top 0.5s;
`;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${(props) => props.bgColor};
`;

function App() {
  const [page, setPage] = useState(0);
  const lastPage = 3; // 페이지 수 - 1

  useEffect(() => {
    const handleScroll = (e) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        setPage((prevPage) => Math.min(prevPage + 1, lastPage));
      } else if (e.deltaY < 0) {
        setPage((prevPage) => Math.max(prevPage - 1, 0));
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [lastPage]);

  return (
    <Wrap top={page * -100}>
      {/* 1페이지 */}
      <Container bgColor="#9e97cb">
        <section>1페이지 내용</section>
      </Container>

      {/* 2페이지 */}
      <Container bgColor="#dbd8eb">
        <section>2페이지 내용</section>
      </Container>

      {/* 3페이지 */}
      <Container bgColor="#348edd">
        <section>3페이지 내용</section>
      </Container>

      {/* 4페이지 */}
      <Container bgColor="#d4daea">
        <section>4페이지 내용</section>
      </Container>
    </Wrap>
  );
}

export default App;
