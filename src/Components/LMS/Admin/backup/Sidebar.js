import React from "react";
import "../../../Styles/sub_navBox.css";

import { Link } from "react-router-dom";
import { NavItem } from "../NavItem";
import styled from "styled-components";

const StyledLink = styled(Link)`
    text-decoration: none;
    color: white;
    padding: 0px;
    background-color: dodgerblue;
    &:hover {
        background-color: blue;
    }
    &:active {
        background-color: darkblue;
    }
`;

export function Sidebar() {
    return (
        <>
            <nav className="sub_navBox">
                <p className="nav_tit">관리자 메뉴</p>
                <div className="sub_navBoxIn">
                    <div className="content_wrap">
                        <ul className="sub_nav">
                            <li className="active open">
                                <StyledLink to="/user">
                                    <NavItem name="회원관리"></NavItem>
                                </StyledLink>
                            </li>
                            <li className="no_sub">
                                <StyledLink to="/lecture">
                                    <NavItem name="강의관리"></NavItem>
                                </StyledLink>
                            </li>
                            <li className="no_sub">
                                <StyledLink to="/enrollment">
                                    <NavItem name="수강관리"></NavItem>
                                </StyledLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Sidebar;
