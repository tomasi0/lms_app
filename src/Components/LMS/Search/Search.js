import styled from "styled-components";
import { useState, useEffect } from "react";
import { IMG_PATH } from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import { searchMoviesByKeyword, getGenre } from "../api";

const SearchBox = styled.div``;

const Input = styled.input`
    width: 500px;
    margin-right: 5px;
`;

const Container = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    margin-top: 20px;
    margin-bottom: 50px;
`;

const Card = styled.div`
    width: 100%;
    border: 1px solid dodgerblue;
    cursor: pointer;
    padding: 10px;
`;

const Img = styled.img`
    width: 100%;
`;

const Text = styled.div`
    color: #333;
    margin: 2px 0;
`;

export function Search() {
    const [data, setData] = useState(null);
    const [inputValue, setInputValue] = useState("");

    const navigate = useNavigate(); // url 변경시키는 함수

    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword"); // keyword => inputValue

    // 키워드가 없으면, 예전 검색이 다시 뜨지 않도록 초기화
    useEffect(() => {
        if (keyword) {
            searchMovies();
        } else {
            setData(null);
        }
    }, [keyword]);

    async function searchMovies(keyword) {
        try {
            const response = await searchMoviesByKeyword(keyword);
            console.log(response.data);
            setData(response.data);
        } catch (error) {
            console.log("Error", error);
        }
    }

    return (
        <>
            <SearchBox>
                <h1>상세조회 페이지 입니다.</h1>
                <Input
                    placeholder="검색어를 입력해주세요"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                    // inputValue 를 url [/search?] 뒤에 붙여 api 전달 예정 [/search?keyword=batman]
                    onClick={() => {
                        navigate(`?query=${inputValue}`); // requestParam
                        searchMovies(inputValue);
                    }}
                >
                    Search
                </button>
            </SearchBox>
            {/* // keyword 가 있으면 keyword, 없으면 null */}
            <h3>{keyword ? `"${keyword}" 로 검색한 결과 ` : null}</h3>
            <Container>
                {data &&
                    data.results.map((movie) => (
                        <Card
                            key={movie.id}
                            onClick={() => {
                                navigate(`/movie/${movie.id}`);
                            }}
                        >
                            {/* <Img src={IMG_PATH + movie.backdrop_path}></Img> */}
                            <Img src={IMG_PATH + movie.poster_path}></Img>
                            <Text>
                                <b>타이틀 : {movie.title} </b>
                            </Text>
                            <Text>
                                <b>장르 : {getGenre(movie.genre_ids)} </b>
                            </Text>
                            <hr />
                            <Text>{movie.overview}</Text>
                        </Card>
                    ))}
            </Container>
        </>
    );
}
