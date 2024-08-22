import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../Styles/mgmt_user.css";
import "../../../Styles/pagination.css";
import "../../../Styles/modal.css";

const COUNT_PER_PAGE = 10;

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

        console.log("url => " + url);

        try {
            const response = await axios.get(url, { withCredentials: true });

            // console.log("response: " + response);

            const data = Array.isArray(response.data)
                ? response.data
                : [response.data];
            setUsers(data);

            // console.log("response.data: " + data);

            setTotalPages(Math.ceil(data.length / COUNT_PER_PAGE));

            setUserAuthorities(
                data.reduce((acc, user) => {
                    acc[user.userId] = user.authority.authorityName;
                    return acc;
                }, {})
            );
        } catch (error) {
            console.error("Error fetching data: ", error);

            console.log("Error fetching data: " + error);
        }
    };

    const handleSearch = () => {
        // window.alert("조회 버튼 클릭");
        console.log();

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
        <div className="main-content">
            <div className="main-top">
                <div className="search-box">
                    <label className="search label">성명조회</label>
                    <input
                        type="text"
                        className="search input"
                        placeholder="Search by Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="search button" onClick={handleSearch}>
                        조회
                    </button>
                </div>
                <div className="table-container">
                    <table>
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
                                        {/* <select
                                            defaultValue={
                                                user.authority.authorityName
                                            }
                                        > */}
                                        <select
                                            value={
                                                userAuthorities[user.userId] ||
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
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                handleUpdateAuthority(
                                                    user.userId,
                                                    user.userNameKor,
                                                    userAuthorities[user.userId]
                                                )
                                            }
                                        >
                                            권한업데이트
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="pagination-container">
                <button
                    className="prev-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    이전
                </button>
                {[...Array(totalPages).keys()].map((page) => (
                    <button
                        key={page + 1}
                        className={`number-button ${
                            currentPage === page + 1 ? "selected" : ""
                        }`}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        {page + 1}
                    </button>
                ))}
                <button
                    className="next-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    이후
                </button>
            </div>
            {/* 모달창 */}
            {isModalOpen && (
                <div
                    id="myModal"
                    className="modal"
                    style={{ display: isModalOpen ? "block" : "none" }}
                >
                    <div className="modal-content">
                        <span
                            className="close"
                            onClick={() => setIsModalOpen(false)}
                        >
                            &times;
                        </span>
                        <p>{modalContent}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManagement;
