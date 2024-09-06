import styled from "styled-components";
import { NavItem } from "./NavItem";
import { FacebookIcon, InstagramIcon, TwiterIcon } from "../../Utils/svg";

const FooterContainer = styled.div`
  width: 100%;
  height: 200px;
  margin-top: 30px;
  border-top: 1px solid #1a1b24;
  box-sizing: border-box;
  transition: all 0.3s;
  padding: 0 32px 0 240px;
`;

const FooterContent = styled.div`
  padding: 20px;
`;

const BoldText = styled.p`
  font-size: 22px;
  font-weight: 1000;
  color: #bbbece;
  letter-spacing: 2px;
`;

const NormalText = styled.pre`
  font-size: 14px;
  color: #393d50;
`;

const Icon = styled.div`
  display: block;
  float: right;
`;
export function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <BoldText>전화번호 : 02.1234.5678</BoldText>
        <BoldText>이메일 : LMS@lms.com</BoldText>
        <NormalText>
          AM 10:00 - PM 08:00 Off-time PM 12:00 - PM 02:00
        </NormalText>
        <NormalText>DAY OFF (SUNDAY, HOLIDAY)</NormalText>
        <Icon>
          <InstagramIcon />
          <FacebookIcon />
          <TwiterIcon />
        </Icon>
        <BoldText>LMS 프로젝트 5조</BoldText>
      </FooterContent>
    </FooterContainer>
  );
}
