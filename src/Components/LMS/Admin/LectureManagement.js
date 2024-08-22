import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../Styles/mgmt_lecture.css";

const COUNT_PER_PAGE = 10;
const API_URL = "http://localhost:8080/course/queryCECJPQL/";

export function LectureManagement() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchData();
    }, [currentPage, searchText]);

    const fetchData = async () => {
        const url = searchText ? `${API_URL}${searchText}` : API_URL;
        try {
            const response = await axios.get(url, { withCredentials: true });
            const dataArray = Array.isArray(response.data)
                ? response.data
                : [response.data];
            setData(dataArray);
            setTotalPages(Math.ceil(dataArray.length / COUNT_PER_PAGE));
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchData();
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const getCurrentPageData = () => {
        const startIndex = COUNT_PER_PAGE * (currentPage - 1);
        const endIndex = Math.min(startIndex + COUNT_PER_PAGE, data.length);
        return data.slice(startIndex, endIndex);
    };

    return (
        <div className="main-content">
            <div className="main-top">
                <div className="search-box">
                    <label className="search label">강의조회</label>
                    <input
                        type="text"
                        className="search input"
                        placeholder="Search by Name"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button className="search button" onClick={handleSearch}>
                        조회
                    </button>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>강의ID</th>
                                <th>강의Name</th>
                                <th>강의시작일자</th>
                                <th>강의종료일자</th>
                                <th>강의카테고리</th>
                                <th>수강자수</th>
                            </tr>
                        </thead>
                        <tbody className="user_list">
                            {getCurrentPageData().map((item) => (
                                <tr key={item.lectureId}>
                                    <td>{item.lectureId}</td>
                                    <td>{item.lectureName}</td>
                                    <td>{item.lectureStartDate}</td>
                                    <td>{item.lectureEndDate}</td>
                                    <td>{item.categoryName}</td>
                                    <td>{item.courseEnrollCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="pagination-container">
                <div className="prev-button" onClick={handlePrevPage}>
                    이전
                </div>
                <div className="number-button-wrapper">
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            className={`number-button ${
                                currentPage === index + 1 ? "selected" : ""
                            }`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                <div className="next-button" onClick={handleNextPage}>
                    이후
                </div>
            </div>
        </div>
    );
}

export default LectureManagement;
