import styled, { keyframes } from "styled-components";
import { Navbar } from "../Navbar";
import { LeftSidebar } from "../Sidebar";
import { IndexCommunity } from "../Community/IndexComunity";
import {
    BestLecture,
    IndexLecture,
    IndexLectureImg,
} from "../Lecture/IndexLecture";
import { Footer } from "../Footer";

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

const Container = styled.div`
    box-sizing: border-box;
    padding: 176px 32px 0 240px;
    transition: all 0.3s;
    min-height: 200vh;
    animation: ${fadeIn} 0.6s ease-out;
`;

export function Index() {
    return (
        <>
            <Navbar />
            <LeftSidebar />
            <Container>
                <IndexLecture />
                <IndexCommunity />
                <IndexLectureImg />
                <BestLecture />
            </Container>
            <Footer />
        </>
    );
}
