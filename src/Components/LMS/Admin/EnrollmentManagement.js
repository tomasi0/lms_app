import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import "../../../Styles/mgmt_enrollment.css";

export function EnrollmentManagement() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const COUNT_PER_PAGE = 10;
    const url = searchTerm
        ? `http://localhost:8080/course/queryCLCJPQL/${searchTerm}`
        : `http://localhost:8080/course/queryCLCJPQL/`;

    useEffect(() => {
        axios
            .get(url, { withCredentials: true })
            .then((response) => {
                const items = Array.isArray(response.data)
                    ? response.data
                    : [response.data];
                setData(items);
                setTotalPages(Math.ceil(items.length / COUNT_PER_PAGE));
                setCurrentPage(1);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, [url]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = () => {
        setCurrentPage(1); // Reset to the first page on search
    };

    const startIndex = COUNT_PER_PAGE * (currentPage - 1);
    const currentData = data.slice(startIndex, startIndex + COUNT_PER_PAGE);

    return (
        <div className="main-content">
            <div className="main-top">
                <div className="search-box">
                    <label className="search label">수강조회</label>
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
                                <th>수강강의수</th>
                            </tr>
                        </thead>
                        <tbody className="user_list">
                            {currentData.map((user) => (
                                <tr key={user.userId}>
                                    <td>{user.userId}</td>
                                    <td>{user.userName}</td>
                                    <td>{user.userEmail}</td>
                                    <td>{user.actYn}</td>
                                    <td>{user.courseLectureCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}

export default EnrollmentManagement;
