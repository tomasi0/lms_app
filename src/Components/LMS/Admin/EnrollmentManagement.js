import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Pagination from "./Pagination";

const LecutreAdminContainer = styled.div`
  color: #fff;
  padding: 20px;
`;
const AdminLectureTitle = styled.p`
  font-size: 30px;
  color: #556b2f;
  font-weight: 800;
  padding: 0 0 0 20px;
`;

const MainContent = styled.div`
  padding: 20px;
  color: #fff;
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
  background-color: #444;
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
  }

  tr:nth-child(even) {
    background-color: #555;
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
    background-color: ${(props) => (props.selected ? "#0056b3" : "#5a6268")};
  }
`;

const PrevNextButton = styled.div`
  padding: 8px 12px;
  margin: 0 5px;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

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
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to the first page on search
  };

  const startIndex = COUNT_PER_PAGE * (currentPage - 1);
  const currentData = data.slice(startIndex, startIndex + COUNT_PER_PAGE);

  return (
    <LecutreAdminContainer>
      <AdminLectureTitle>수강관리</AdminLectureTitle>
      <MainContent>
        <MainTop>
          <SearchBox>
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
          </SearchBox>
          <TableContainer>
            <Table>
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
            </Table>
          </TableContainer>
        </MainTop>
        <PaginationContainer>
          <PrevNextButton onClick={handlePrevPage} disabled={currentPage === 1}>
            ◀
          </PrevNextButton>
          {[...Array(totalPages)].map((_, index) => (
            <PageButton
              key={index}
              selected={currentPage === index + 1}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </PageButton>
          ))}
          <PrevNextButton
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            ▶
          </PrevNextButton>
        </PaginationContainer>
      </MainContent>
    </LecutreAdminContainer>
  );
}

export default EnrollmentManagement;
