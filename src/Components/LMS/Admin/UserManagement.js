import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const COUNT_PER_PAGE = 10;

const UserAdminContainer = styled.div`
    color: #fff;
    padding: 20px;
`;

const MainContent = styled.div`
    padding: 20px;
    border-radius: 8px;
`;

const MainTop = styled.div`
    margin-bottom: 20px;
`;

const SearchBox = styled.div`
    margin-bottom: 20px;
    display: flex;
    align-items: center;

    .label {
        margin-right: 10px;
        color: #fff;
        font-weight: bold;
    }

    .input {
        padding: 8px;
        margin-right: 10px;
        border-radius: 4px;
        border: 1px solid #ccc;
        outline: none;
    }

    .button {
        padding: 8px 16px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
            background-color: #0056b3;
        }
    }
`;

const TableContainer = styled.div`
    overflow-x: auto;
    background-color: #555;
    border-radius: 8px;
    padding: 10px;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    color: #fff;

    th,
    td {
        padding: 12px;
        text-align: left;
    }

    th {
        background-color: #666;
        color: #fff;
    }

    tr:nth-child(even) {
        background-color: #444;
    }
`;

const Select = styled.select`
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: #444;
    color: #fff;
    outline: none;

    option {
        background-color: #333;
        color: #fff;
    }
`;

const Button = styled.button`
    padding: 8px 12px;
    background-color: #28a745;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #218838;
    }
`;

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;
`;

const PageButton = styled.button`
    padding: 8px 12px;
    margin: 0 5px;
    border: none;
    border-radius: 4px;
    background-color: ${(props) => (props.selected ? "#007bff" : "#6c757d")};
    color: #fff;
    cursor: pointer;

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    &:hover:not(:disabled) {
        background-color: ${(props) =>
            props.selected ? "#0056b3" : "#5a6268"};
    }
`;

const Modal = styled.div`
    display: ${(props) => (props.isOpen ? "block" : "none")};
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);

    .modal-content {
        background-color: #333;
        margin: 15%;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
        border-radius: 8px;
        color: #fff;
        position: absolute;
        top: 0;
        left: 0;
    }

    .close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;

        &:hover,
        &:focus {
            color: #fff;
            text-decoration: none;
            cursor: pointer;
        }
    }
`;

const AdminUserTitle = styled.p`
    font-size: 30px;
    color: #556b2f;
    font-weight: 800;
    padding: 0 0 0 20px;
`;

export function UserManagement() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [modalContent, setModalContent] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [userAuthorities, setUserAuthorities] = useState({});

    useEffect(() => {
        fetchData();
    }, [currentPage, searchTerm]);

    const fetchData = async () => {
        const url = searchTerm
            ? `http://localhost:8080/user/id/nameLike/${searchTerm}`
            : "http://localhost:8080/user/admin/getAllUsers";

        try {
            const response = await axios.get(url, { withCredentials: true });
            const data = Array.isArray(response.data)
                ? response.data
                : [response.data];
            setUsers(data);
            setTotalPages(Math.ceil(data.length / COUNT_PER_PAGE));
            setUserAuthorities(
                data.reduce((acc, user) => {
                    acc[user.userId] = user.authority.authorityName;
                    return acc;
                }, {})
            );
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchData();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleUpdateAuthority = async (userId, userName, newAuthority) => {
        try {
            const response = await axios.put(
                "http://localhost:8080/user/updateAuthority",
                {
                    userId,
                    authorityName: newAuthority,
                },
                { withCredentials: true }
            );
            if (response.data === "success") {
                setModalContent(`${userName} 님의 권한이 변경되었습니다.`);
            } else {
                setModalContent(
                    `${userId} 님의 업데이트가 실패하였습니다. ${response.data}`
                );
            }
        } catch (error) {
            console.error("Error updating authority:", error);
            setModalContent(
                "DB 업데이트 에러가 발생하였습니다. " + error.message
            );
        }
        setIsModalOpen(true);
    };

    const handleSelectChange = (userId, event) => {
        setUserAuthorities({
            ...userAuthorities,
            [userId]: event.target.value,
        });
    };

    const paginatedUsers = users.slice(
        (currentPage - 1) * COUNT_PER_PAGE,
        currentPage * COUNT_PER_PAGE
    );

    return (
        <UserAdminContainer>
            <AdminUserTitle>회원관리</AdminUserTitle>
            <MainContent>
                <MainTop>
                    <SearchBox>
                        <label
                            className="search label"
                            style={{
                                color: "#bbbece",
                                border: "1px solid #bbbece",
                            }}
                        >
                            성명조회
                        </label>
                        <input
                            type="text"
                            className="search input"
                            placeholder="Search by Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            className="search button"
                            onClick={handleSearch}
                        >
                            조회
                        </button>
                    </SearchBox>
                    <TableContainer>
                        <Table>
                            <thead>
                                <tr>
                                    <th>회원ID</th>
                                    <th>회원Name</th>
                                    <th>회원Email</th>
                                    <th>회원여부(탈퇴:N)</th>
                                    <th>회원권한</th>
                                    <th>수정할권한</th>
                                    <th>업데이트</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.map((user) => (
                                    <tr key={user.userId}>
                                        <td>{user.userId}</td>
                                        <td>{user.userNameKor}</td>
                                        <td>{user.email}</td>
                                        <td>{user.actYn}</td>
                                        <td>{user.authority.authorityName}</td>
                                        <td>
                                            <Select
                                                value={
                                                    userAuthorities[
                                                        user.userId
                                                    ] ||
                                                    user.authority.authorityName
                                                }
                                                onChange={(event) =>
                                                    handleSelectChange(
                                                        user.userId,
                                                        event
                                                    )
                                                }
                                            >
                                                <option value="ROLE_ADMIN">
                                                    ROLE_ADMIN
                                                </option>
                                                <option value="ROLE_TEACHER">
                                                    ROLE_TEACHER
                                                </option>
                                                <option value="ROLE_USER">
                                                    ROLE_USER
                                                </option>
                                            </Select>
                                        </td>
                                        <td>
                                            <Button
                                                onClick={() =>
                                                    handleUpdateAuthority(
                                                        user.userId,
                                                        user.userNameKor,
                                                        userAuthorities[
                                                            user.userId
                                                        ]
                                                    )
                                                }
                                            >
                                                권한업데이트
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </TableContainer>
                </MainTop>
                <PaginationContainer>
                    <PageButton
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        ◀
                    </PageButton>
                    {[...Array(totalPages).keys()].map((page) => (
                        <PageButton
                            key={page + 1}
                            selected={currentPage === page + 1}
                            onClick={() => handlePageChange(page + 1)}
                        >
                            {page + 1}
                        </PageButton>
                    ))}
                    <PageButton
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        ▶
                    </PageButton>
                </PaginationContainer>
                <Modal isOpen={isModalOpen}>
                    <div className="modal-content">
                        <span
                            style={{ backgroundColor: "transparent" }}
                            className="close"
                            onClick={() => setIsModalOpen(false)}
                        >
                            &times;
                        </span>
                        <p style={{ backgroundColor: "transparent" }}>
                            {modalContent}
                        </p>
                    </div>
                </Modal>
            </MainContent>
        </UserAdminContainer>
    );
}

export default UserManagement;
