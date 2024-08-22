import axios from "axios";

const headers = {
    headers: {
        accept: "appplication/json",
        Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlY2NkOTBlY2Y1NTU2ZmQxOTRlN2IxOTc1NDA2MjQ5NSIsIm5iZiI6MTcyMTg4MzA5Ni4xNzA4NzcsInN1YiI6IjY2YTFjYWUzYzhiYmEzMTJlMzcyY2Y5OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fkE0U7_iqbBmAomAP88d8zeaugpk369fcjfFSSGOCFU",
    },
};

export const IMG_PATH = "https://image.tmdb.org/t/p/original";

export function getAllLectures() {
    return axios.get(
        "https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=1",
        headers
    );
}

export function getRecommendedLectures() {
    return axios.get(
        "https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1",
        headers
    );
}

export function getFreeLectures() {
    return axios.get(
        "https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=1",
        headers
    );
}

export function getPaidLectures() {
    return axios.get(
        "https://api.themoviedb.org/3/movie/upcoming?language=ko-KR&page=1",
        headers
    );
}

export function getNewLectures() {
    return axios.get(
        "https://api.themoviedb.org/3/movie/upcoming?language=ko-KR&page=1",
        headers
    );
}

export function getMovieDetailById(id) {
    return axios.get(
        `https://api.themoviedb.org/3/movie/${id}?language=ko-KR`,
        headers
    );
}

export function getMovieCreditById(id) {
    return axios.get(
        `https://api.themoviedb.org/3/movie/${id}/credits?language=ko-KR`,
        headers
    );
}

export function searchMoviesByKeyword(inputValue) {
    return axios.get(
        `https://api.themoviedb.org/3/search/movie?query=${inputValue}&include_adult=false&language=ko-KR&page=1`,
        headers
    );
}

export let genre = [];

export async function setGenreListOfMovie() {
    // 로컬스토리지에 장르리스트가 있으면 그걸 사용
    genre = JSON.parse(localStorage.getItem("MovieGenreList"));

    // 없으면 api로 받아와서 로컬스토리지에 저장하고 사용
    if (!genre) {
        try {
            const response = await axios.get(
                "https://api.themoviedb.org/3/genre/movie/list?language=ko-KR",
                headers
            );
            genre = response.data.genres;
            localStorage.setItem("MovieGenreList", JSON.stringify(genre));
        } catch (error) {
            console.log("Error", error);
        }
    }
}

// list 는 장르의 숫자만 담겨 있음
export function getGenre(list) {
    return list
        .map((id) => {
            const temp = genre.find((g) => g.id === id);
            return temp ? temp.name : ""; // temp.name 이 null 이면 에러
        })
        .filter((name) => name) // 있는 데이터만 filter 에 담음
        .join(", ");
}
