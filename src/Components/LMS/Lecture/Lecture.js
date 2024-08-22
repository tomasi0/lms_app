import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getMovieDetailById, getMovieCreditById, IMG_PATH } from "../api";
import { IconBack } from "../icons";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  width: 100%;
  margin: 20px 0;
  color: dodgerblue;
  display: flex;
  justify-content: space-between;
`;

const Back = styled.div`
  cursor: pointer;
`;

const Img = styled.img`
  width: 100%;
`;

const Content = styled.div`
  font-size: 1rem;
  line-height: 30px;
  color: #333; // 빽빽한 글씨가 너무 black 이면 가독성이 떨어지기 때문에, 보통 #333 color 로 적용됨.
`;

export function Lecture() {
  const { id } = useParams(); // Movie 뒤에 movie id 를 추출하여 id 에 넣어 줌
  console.log("id: " + id);

  const [detail, setDetail] = useState(null);
  const [credit, setCredit] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getMovieInfo();
  }, []);

  async function getMovieInfo() {
    try {
      let response = await getMovieDetailById(id);
      console.log("getMovieDetailById response", response);
      setDetail(response.data);

      response = await getMovieCreditById(id);
      console.log("getMovieCreditById response", response);
      setCredit(response.data);
    } catch (error) {
      console.log("Error", error);
    }
  }

  return (
    <Container>
      {detail && credit && (
        <>
          <Header>
            <h1>{detail.title}</h1>
            <Back onClick={() => navigate(-1)}>
              <IconBack />
            </Back>
          </Header>
          <Img src={IMG_PATH + detail.backdrop_path} />
          <Content>
            <p>
              <b>타이틀</b> : {detail.title}
            </p>
            <p>
              <b>장르</b> :{" "}
              {detail.genres
                .map((g) => g.name)
                .filter((name) => name)
                .join(", ")}
            </p>
            <p>
              <b>개봉일</b> : {detail.release_date}
            </p>
            <p>
              <b>상영시간</b> : {detail.runtime + "분"}
            </p>
            <p>
              <b>감독</b> :{" "}
              {credit.crew
                .filter((c) => c.job == "Director")
                .map((c) => c.name)
                .filter((name) => name)
                .join(", ")}
            </p>
            <p>
              <b>배우</b> :{" "}
              {credit.cast
                .slice(0, 10)
                .map((c) => c.name)
                .filter((name) => name)
                .join(", ")}
            </p>
            <hr />
            <p>{detail.overview}</p>
          </Content>
          <Back onClick={() => navigate(-1)}>
            <IconBack />
          </Back>
          <br />
          <br />
          <br />
          <br />
        </>
      )}
    </Container>
  );
}
