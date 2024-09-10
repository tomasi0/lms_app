import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import {
    getAllLecture,
    getCategoryLecture,
} from "../../../Api/LectureApi/LectureApi";
import { Navbar } from "../Navbar";
import { LeftSidebar } from "../Sidebar";
import { SearchIcon } from "../../../Utils/svg";

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

const RightSideContainer = styled.div`
    box-sizing: border-box;
    width: 240px;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 988;
`;

const LectureListBox = styled.div`
    width: 100%;
    padding: 20px;
    animation: ${fadeIn} 0.6s ease-out;
`;

const LectureHeadText = styled.div`
    width: 100%;
    height: 300px;
    background-image: url("/reactimage/lectureHeader.png");
    background-size: cover;
    background-position: center;
    border-radius: 15px;
`;

const ContainerBox = styled.div`
    box-sizing: border-box;
    padding: 176px 240px 0 240px;
    transition: all 0.3s;
    min-height: 200vh;
    animation: ${fadeIn} 0.6s ease-out;
`;

const Container = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 25%);
    justify-items: center;
    align-items: center;
    gap: 40px 10px;
`;

const SearchViewBox = styled.div`
    display: flex;
    width: 100%;
    padding: 10px;
`;

const SearchText = styled.p`
    color: #fff;
    font-size: 18px;
    margin-left: 10px;
    cursor: pointer;
    padding-left: 50px;
`;

const Input = styled.input`
    width: 500px;
    height: 32px;
    font-size: 15px;
    border: 0;
    border-radius: 15px;
    outline: none;
    padding-left: 10px;
    background-color: rgb(233, 233, 233);
`;

const LectureContainer = styled.div`
    aspect-ratio: 1 / 0.7;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 20px #eee;
    cursor: pointer;
    width: 90%;
    animation: ${fadeIn} 0.6s ease-out;

    &:hover img {
        filter: grayscale(1) brightness(0.4);
    }

    &:hover::after {
        opacity: 1;
        inset: 20px;
    }

    &:hover .lectureContent {
        opacity: 1;
    }

    &::after {
        content: "";
        position: absolute;
        inset: 0;
        border: 2px solid white;
        border-radius: inherit;
        opacity: 0;
        transition: 0.4s ease-in-out;
    }
`;

const LectureImg = styled.img`
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

const Content = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    opacity: 0;
    transition: 0.5s ease-in-out;
    width: 75%;
    background-color: transparent;
`;

const Tab = styled.div`
    display: block;
    margin: 10px 0;
    padding: 250px 0 0 40px;
`;

const Button = styled.button`
    width: 150px;
    height: 40px;
    border: none;
    color: #9da2b9;
    padding: 5px 15px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 1.1rem;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;
`;

const fadeInSearch = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const fadeOutSearch = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
  }
`;

const SearchBox = styled.div`
    animation: ${(props) => (props.isVisible ? fadeInSearch : fadeOutSearch)}
        0.3s ease-in-out;
    opacity: ${(props) => (props.isVisible ? 1 : 0)};
    transform: scale(${(props) => (props.isVisible ? 1 : 0.9)});
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;

    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin: 0 auto;
    cursor: pointer;
    text-align: center;
`;

export function LectureList() {
    const [LectureData, setLectureData] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [searchView, setSearchView] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        lectureList();
    }, [inputValue]);

    async function lectureList() {
        if (!inputValue) {
            const lectureAxios = await getAllLecture();
            setLectureData(lectureAxios);
        } else {
            const lectureSearch = await getAllLecture(inputValue);
            setLectureData(lectureSearch);
        }
    }

    const categories = [
        { category: "전체" },
        { category: "추천" },
        { category: "무료" },
        { category: "유료" },
        { category: "신규" },
    ];

    async function getCategory(selectedCategory) {
        try {
            switch (selectedCategory) {
                case "전체":
                case "추천":
                case "무료":
                case "유료":
                case "신규":
                    setKeyword(selectedCategory);
                    break;
                default:
                    setKeyword("전체");
            }
        } catch (error) {
            console.log("Error", error);
        }
    }

    useEffect(() => {
        if (keyword) {
            categoryList(keyword);
        }
    }, [keyword]);

    async function categoryList(keyword) {
        const categoryList = await getCategoryLecture(keyword);
        setLectureData(categoryList);
    }

    async function handleSearchView() {
        setSearchView((prevSearchView) => !prevSearchView);
    }

    return (
        <>
            <Navbar />
            <LeftSidebar />
            <ContainerBox>
                <RightSideContainer>
                    <Tab>
                        {categories.map((c) => (
                            <Button
                                key={c.category}
                                onClick={() => getCategory(c.category)}
                            >
                                {c.category}강의
                            </Button>
                        ))}
                    </Tab>
                </RightSideContainer>
                <LectureHeadText />
                <LectureListBox>
                    <SearchViewBox>
                        <SearchText onClick={handleSearchView}>
                            <SearchIcon />
                        </SearchText>
                        {searchView && (
                            <SearchBox isVisible={searchView}>
                                <Input
                                    placeholder="검색어를 입력해주세요"
                                    value={inputValue}
                                    onChange={(e) =>
                                        setInputValue(e.target.value)
                                    }
                                />
                            </SearchBox>
                        )}
                    </SearchViewBox>

                    <Container>
                        {LectureData &&
                            LectureData.map((Lecture) => (
                                <LectureContainer
                                    key={Lecture.lectureId}
                                    onClick={() => {
                                        navigate(
                                            `/lectures/${Lecture.lectureId}`
                                        );
                                    }}
                                >
                                    <LectureImg src={Lecture.imagePath} />
                                    <Content className="lectureContent">
                                        <h2
                                            style={{
                                                marginBottom: "20px",
                                                fontSize: "18px",
                                                backgroundColor: "transparent",
                                                color: "#fff",
                                            }}
                                        >
                                            {Lecture.lectureName}
                                        </h2>
                                        <p
                                            style={{
                                                marginTop: "40px",
                                                fontSize: "14px",
                                                backgroundColor: "transparent",
                                                color: "#9da2b9",
                                            }}
                                        >
                                            {Lecture.category.categoryName}
                                        </p>
                                    </Content>
                                </LectureContainer>
                            ))}
                    </Container>
                </LectureListBox>
            </ContainerBox>
        </>
    );
}
