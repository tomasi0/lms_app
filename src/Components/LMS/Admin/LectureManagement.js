import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const COUNT_PER_PAGE = 10;
const API_URL = "http://localhost:8080/course/queryCECJPQL/";

const LecutreAdminContainer = styled.div`
  color: #fff;
  padding: 20px;
`;

const MainContent = styled.div`
  padding: 20px;
  /* background-color: #333; */
  color: #fff;
`;

const AdminLectureTitle = styled.p`
  font-size: 30px;
  color: #556b2f;
  font-weight: 800;
  padding: 0 0 0 20px;
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
    <LecutreAdminContainer>
      <AdminLectureTitle>강의관리</AdminLectureTitle>
      <MainContent>
        <MainTop>
          <SearchBox>
            <label
              className="search label"
              style={{ color: "#bbbece", border: "1px solid #bbbece" }}
            >
              강의조회
            </label>
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
          </SearchBox>
          <TableContainer>
            <Table>
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

export default LectureManagement;
