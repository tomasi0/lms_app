import React, { useState, useEffect } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const MainContent = styled.div`
  animation: ${fadeIn} 0.6s ease-out;
  padding: 20px;
  color: #fff;
`;

const UserInfoBox = styled.div`
  margin-left: 100px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 70%;
`;

const UserInfoBoxTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #556b2f;
`;

const UserGridContainer = styled.div`
  display: grid;
  grid-template-columns: 20% 80%;
  gap: 10px;
  margin-bottom: 20px;
`;

const UserGrid = styled.div`
  padding: 10px;
  border-radius: 4px;
  font-size: 16px;
  display: flex;
  color: #bbbece;
  border: 1px solid #fff;
  width: 100%;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

const AddressBox = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  ul {
    display: flex;
    align-items: center;
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  li {
    margin-right: 15px;
    display: flex;
    align-items: center;
  }
`;

const Button = styled.div`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;

  &:hover {
    background-color: #0056b3;
  }
`;

const CancelButton = styled(Button)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
`;

export function MyPageUser() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [receiveEmailYn, setReceiveEmailYn] = useState(false);
  const [receiveSmsYn, setReceiveSmsYn] = useState(false);
  const [receiveAdsPrPromoYn, setReceiveAdsPrPromoYn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/user/current", {
          withCredentials: true,
        });
        const authorityName = response.data.authority[0].authority;
        if (authorityName === "ROLE_ADMIN") {
          // Handle admin specific logic
        }
        const userResponse = await axios.get(
          `http://localhost:8080/user/id/${response.data.userId}`,
          { withCredentials: true }
        );

        const user = userResponse.data;
        setUserData(user);
        setReceiveEmailYn(user.receiveEmailYn === "Y");
        setReceiveSmsYn(user.receiveSmsYn === "Y");
        setReceiveAdsPrPromoYn(user.receiveAdsPrPromoYn === "Y");
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("로그인해주세요.");
        window.location.href = "http://localhost:3000/home";
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async () => {
    if (window.confirm("회원정보를 변경하시겠습니까?")) {
      const userNewData = {
        ...userData,
        receiveEmailYn: receiveEmailYn ? "Y" : "N",
        receiveSmsYn: receiveSmsYn ? "Y" : "N",
        receiveAdsPrPromoYn: receiveAdsPrPromoYn ? "Y" : "N",
        updatedAt: new Date(),
      };

      try {
        await axios.put("http://localhost:8080/user/userset", userNewData, {
          withCredentials: true,
        });
        setIsEditing(false);
        window.location.reload();
      } catch (error) {
        console.error("Update error:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (name === "receiveEmailYn") setReceiveEmailYn(checked);
      if (name === "receiveSmsYn") setReceiveSmsYn(checked);
      if (name === "receiveAdsPrPromoYn") setReceiveAdsPrPromoYn(checked);
    } else {
      setUserData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <MainContent>
      <UserInfoBox>
        <UserInfoBoxTitle>회원정보</UserInfoBoxTitle>
        <UserGridContainer>
          <UserGrid>아이디</UserGrid>
          <UserGrid>{userData.userId}</UserGrid>

          <UserGrid>성명(한글)</UserGrid>
          <UserGrid>
            {isEditing ? (
              <Input
                name="userNameKor"
                value={userData.userNameKor}
                onChange={handleInputChange}
              />
            ) : (
              <div>{userData.userNameKor}</div>
            )}
          </UserGrid>

          <UserGrid>성별</UserGrid>
          <UserGrid>
            {isEditing ? (
              <Input
                name="gender"
                value={userData.gender}
                onChange={handleInputChange}
              />
            ) : (
              <div>{userData.gender}</div>
            )}
          </UserGrid>

          <UserGrid>성명(영어)</UserGrid>
          <UserGrid>
            {isEditing ? (
              <Input
                name="userNameEng"
                value={userData.userNameEng}
                onChange={handleInputChange}
              />
            ) : (
              <div>{userData.userNameEng}</div>
            )}
          </UserGrid>

          <UserGrid>생년월일</UserGrid>
          <UserGrid>
            {isEditing ? (
              <Input
                type="date"
                name="birthDate"
                value={userData.birthDate}
                onChange={handleInputChange}
              />
            ) : (
              <div>{userData.birthDate}</div>
            )}
          </UserGrid>

          <UserGrid>이메일</UserGrid>
          <UserGrid>
            {isEditing ? (
              <Input
                name="email"
                value={userData.email}
                onChange={handleInputChange}
              />
            ) : (
              <div>{userData.email}</div>
            )}
          </UserGrid>

          <UserGrid>휴대전화</UserGrid>
          <UserGrid>
            {isEditing ? (
              <Input
                name="hpTel"
                value={userData.hpTel}
                onChange={handleInputChange}
              />
            ) : (
              <div>{userData.hpTel}</div>
            )}
          </UserGrid>

          <UserGrid>학력</UserGrid>
          <UserGrid>
            {isEditing ? (
              <Input
                name="education"
                value={userData.education}
                onChange={handleInputChange}
              />
            ) : (
              <div>{userData.education}</div>
            )}
          </UserGrid>

          <UserGrid>최종학교</UserGrid>
          <UserGrid>
            {isEditing ? (
              <Input
                name="finalSchool"
                value={userData.finalSchool}
                onChange={handleInputChange}
              />
            ) : (
              <div>{userData.finalSchool}</div>
            )}
          </UserGrid>

          <UserGrid>재직구분</UserGrid>
          <UserGrid>
            {isEditing ? (
              <Input
                name="cfOfEmp"
                value={userData.cfOfEmp}
                onChange={handleInputChange}
              />
            ) : (
              <div>{userData.cfOfEmp}</div>
            )}
          </UserGrid>

          <UserGrid>자택주소</UserGrid>
          <AddressBox>
            {isEditing ? (
              <>
                <Input
                  name="zip_code"
                  value={userData.zip_code}
                  onChange={handleInputChange}
                />

                <Input
                  name="address1Name"
                  value={userData.address1Name}
                  onChange={handleInputChange}
                />
                <Input
                  name="address2Name"
                  value={userData.address2Name}
                  onChange={handleInputChange}
                />
              </>
            ) : (
              <>
                <UserGrid style={{ border: "none" }}>
                  <UserGrid style={{ marginRight: "10px" }}>
                    <div>{userData.zip_code}</div>
                  </UserGrid>
                  <UserGrid style={{ marginRight: "10px" }}>
                    <div>{userData.address1Name}</div>
                  </UserGrid>
                  <UserGrid style={{ marginRight: "10px" }}>
                    <div>{userData.address2Name}</div>
                  </UserGrid>
                </UserGrid>
              </>
            )}
          </AddressBox>
          <div></div>
          <Button style={{ width: "150px" }}>주소검색</Button>
        </UserGridContainer>

        <Form>
          <ul>
            <li>
              <Checkbox
                type="checkbox"
                name="receiveEmailYn"
                checked={receiveEmailYn}
                onChange={handleInputChange}
              />
              이메일 수신
            </li>
            <li>
              <Checkbox
                type="checkbox"
                name="receiveSmsYn"
                checked={receiveSmsYn}
                onChange={handleInputChange}
              />
              SMS 수신
            </li>
            <li>
              <Checkbox
                type="checkbox"
                name="receiveAdsPrPromoYn"
                checked={receiveAdsPrPromoYn}
                onChange={handleInputChange}
              />
              광고성 정보 수신
            </li>
          </ul>
        </Form>
        <div style={{ display: "flex", gap: "10px" }}>
          {isEditing ? (
            <>
              <Button onClick={handleUpdate}>저장</Button>
              <CancelButton onClick={() => setIsEditing(false)}>
                취소
              </CancelButton>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>수정하기</Button>
          )}
        </div>
      </UserInfoBox>
    </MainContent>
  );
}
