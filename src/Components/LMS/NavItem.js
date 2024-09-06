import styled from "styled-components";

const Container = styled.div`
  height: 44px;
  padding: 0 6px;
  font-size: 14px;
  line-height: 44px;
  border-radius: 8px;
  background-color: transparent;
  transition: all 0.1s;
  color: #9da2b9;
  position: relative;
  i {
    font-size: 2rem;
    margin-bottom: 3px;
  }
  span {
    font-size: 1rem;
    font-weight: bold;
  }
`;

export function NavItem({ icon, name }) {
  return (
    <>
      <Container>
        <i className={icon}></i>
        <span>{name}</span>
      </Container>
    </>
  );
}
