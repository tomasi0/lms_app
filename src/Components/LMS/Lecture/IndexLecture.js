import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import {
    getAllLecture,
    getCategoryLecture,
} from "../../../Api/LectureApi/LectureApi";
import { useNavigate } from "react-router-dom";

const TitleText = styled.p`
    font-size: 35px;
    font-weight: 800;
    color: #fff;
`;

const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;
    padding: 100px 0 50px 0;
    border-bottom: 1px solid #1a1b24;
`;

const ImageContainer = styled.div`
    position: relative;
    width: 300px;
    height: 300px;
    transform-style: preserve-3d;
    transform: perspective(1000px) rotateY(${(props) => props.rotation}deg);
    transition: transform 0.7s;
`;

const Span = styled.span`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    transform: rotateY(calc(var(--i) * 45deg)) translateZ(400px);
`;

const Img = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
`;

const BtnContainer = styled.div``;

const Btn = styled.button`
    margin: 0px 150px;
    background-color: #ffffff;
    color: #0f1015;
    border: 1px solid #cccccc;
    border-radius: 4px;
    padding: 10px 20px;
    font-size: 20px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;

    &:hover {
        background-color: #f0f0f0;
        color: #0f1015;
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
    }
`;

export function IndexLecture() {
    const [x, setX] = useState(0);
    const [timer, setTimer] = useState(null);
    const [images, setImages] = useState([]);

    useEffect(() => {
        axios();
    }, []);

    async function axios() {
        const lectureData = await getAllLecture();
        setImages(lectureData.slice(0, 8));
    }

    const updateGallery = (newX) => {
        setX(newX);
        if (timer) clearTimeout(timer);
        const newTimer = setTimeout(() => {
            setX((prevX) => prevX - 45);
        }, 6000);
        setTimer(newTimer);
    };

    useEffect(() => {
        updateGallery(x);
        // Clean up timer on component unmount
        return () => clearTimeout(timer);
    }, [x]);

    return (
        <>
            <TitleText>강의</TitleText>
            <TitleContainer>
                <ImageContainer rotation={x}>
                    {images.map((lecture, i) => (
                        <Span key={i} style={{ "--i": i + 1 }}>
                            <Img
                                src={lecture.imagePath}
                                alt={`Image ${i + 1}`}
                            />
                        </Span>
                    ))}
                </ImageContainer>
                <BtnContainer>
                    <Btn onClick={() => updateGallery(x + 45)}>◀</Btn>
                    <Btn onClick={() => updateGallery(x - 45)}>▶</Btn>
                </BtnContainer>
            </TitleContainer>
        </>
    );
}

const ImgContainer = styled.div`
    width: 100%;
    border-bottom: 1px solid #1a1b24;
`;

const ImgContent = styled.img`
    width: 100%;
    margin: 80px 0;
    cursor: pointer;
`;

export function IndexLectureImg() {
    const navigate = useNavigate();
    return (
        <>
            <ImgContainer>
                <ImgContent
                    src="/reactimage/Main1.png"
                    onClick={() => navigate(`/lecture`)}
                />
            </ImgContainer>
        </>
    );
}

const LectureBox = styled.div`
    width: 100%;
    margin-top: 20px;
    display: grid;
    grid-template-columns: 33.3% 33.3% 33.3%;
    justify-items: center;
    align-items: center;
`;

const LectureContainer = styled.div`
    margin: 0 10px;
    aspect-ratio: 1 / 0.7;
    border-radius: 8px;
    position: relative;
    background-color: #000000;
    overflow: hidden;
    box-shadow: 0 0 20px #eee;
    cursor: pointer;
    width: 70%;

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

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: 0.5s ease-in-out;
    }
`;

const Content = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
    opacity: 0;
    transition: 0.5s ease-in-out;
    width: 75%;
    background-color: transparent;
`;

const BestText = styled.p`
    margin-top: 30px;
    font-size: 35px;
    font-weight: 800;
    color: #fff;
`;

export function BestLecture() {
    const [lecture, setLecture] = useState([]);
    const [keyword, setKeyword] = useState("추천");
    const navigate = useNavigate();

    useEffect(() => {
        Axios();
    }, []);

    async function Axios() {
        const lectureData = await getCategoryLecture(keyword);
        console.log("1", lectureData);
        setLecture(lectureData.slice(0, 3));
    }
    console.log(keyword);
    console.log(lecture);

    return (
        <>
            <BestText>추천강의</BestText>
            <LectureBox>
                {lecture &&
                    lecture.map((Lecture) => (
                        <LectureContainer
                            key={Lecture.lectureId}
                            onClick={() => {
                                navigate(`/lectures/${Lecture.lectureId}`);
                            }}
                        >
                            <LectureImg src={Lecture.imagePath}></LectureImg>

                            <Content className="lectureContent">
                                <h2
                                    style={{
                                        marginBottom: "20px",
                                        backgroundColor: "transparent",
                                    }}
                                >
                                    {Lecture.lectureName}
                                </h2>
                                <p
                                    style={{
                                        marginTop: "40px",
                                        backgroundColor: "transparent",
                                    }}
                                >
                                    {Lecture.category.categoryName}
                                </p>
                            </Content>
                        </LectureContainer>
                    ))}
            </LectureBox>
        </>
    );
}
