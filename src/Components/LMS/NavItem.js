import styled from "styled-components";

const Container = styled.div`
    width: 100px;
    height: 80px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    i {
        font-size: 2.5rem;
        margin-bottom: 3px;
    }
    span {
        font-size: 1.1rem;
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
