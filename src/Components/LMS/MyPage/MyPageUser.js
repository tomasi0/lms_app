import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../Styles/MyPageUser.css";

export function MyPageUser() {
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [receiveEmailYn, setReceiveEmailYn] = useState(false);
    const [receiveSmsYn, setReceiveSmsYn] = useState(false);
    const [receiveAdsPrPromoYn, setReceiveAdsPrPromoYn] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8080/user/current",
                    { withCredentials: true }
                );
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
                // window.location.href = "http://localhost:8080/lms/main.html";
                window.location.href = "http://localhost:3000/home";
            }
        };

        fetchData();
    }, []);

    const handleUpdate = async () => {
        if (window.confirm("회원정보를 변경하시겠습니까?")) {
            // ...userData => JSON 을 위해 Tag 에 따라 데이터 Mapping
            const userNewData = {
                userId: userData.userId,
                userNameKor: userData.userNameKor,
                gender: userData.gender,
                userNameEng: userData.userNameEng,
                birthDate: userData.birthDate,
                email: userData.email,
                hpTel: userData.hpTel,
                education: userData.education,
                finalSchool: userData.finalSchool,
                cfOfEmp: userData.cfOfEmp,
                zip_code: userData.zip_code,
                address1Name: userData.address1Name,
                address2Name: userData.address2Name,
                receiveEmailYn: receiveEmailYn ? "Y" : "N",
                receiveSmsYn: receiveSmsYn ? "Y" : "N",
                receiveAdsPrPromoYn: receiveAdsPrPromoYn ? "Y" : "N",
                updatedAt: new Date(),
            };

            // window.alert("아이디: " + userData.userId);
            // window.alert("성명(한글): " + userData.userNameKor);
            // window.alert("성별: " + userData.gender);
            // window.alert("성명(영어): " + userData.userNameEng);
            // window.alert("생년월일: " + userData.birthDate);
            // window.alert("이메일: " + userData.email);
            // window.alert("휴대전화: " + userData.hpTel);
            // window.alert("학력: " + userData.education);
            // window.alert("최종학교: " + userData.finalSchool);
            // window.alert("재직구분: " + userData.cfOfEmp);
            // window.alert("자택주소(우편번호): " + userData.zip_code);
            // window.alert("자택주소(상세1): " + userData.address1Name);
            // window.alert("자택주소(상세2): " + userData.address2Name);
            // window.alert("수정일시: " + new Date());
            // window.alert(
            //     "정보수신 동의(이메일): " + receiveEmailYn ? "Y" : "N"
            // );
            // window.alert("정보수신 동의(SMS): " + receiveSmsYn ? "Y" : "N");
            // window.alert(
            //     "정보수신 동의(광고,프로모션): " + receiveAdsPrPromoYn
            //         ? "Y"
            //         : "N"
            // );

            try {
                await axios.put(
                    "http://localhost:8080/user/userset",
                    userNewData,
                    { withCredentials: true }
                );
                setIsEditing(false); // No need to reload the page
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
        // <div className="container">
        <div className="main-content">
            {/* <div className="root"> */}
            <div className="main-top">
                <div className="userInfo-box">
                    <h2 className="userInfoBoxTitle">회원정보</h2>
                    <div className="userGridContainer">
                        <div className="userGrid userGrid1">아이디</div>
                        <div className="userGrid userGrid2">
                            <div className="idGrid">{userData.userId}</div>
                        </div>
                        <div class="userGrid userGrid3">성명(한글)</div>
                        <div class="userGrid userGrid4">
                            {isEditing ? (
                                <input
                                    className="nameGrid2"
                                    name="userNameKor"
                                    value={userData.userNameKor}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <div class="nameGrid">
                                    {userData.userNameKor}
                                </div>
                            )}
                        </div>
                        <div class="userGrid userGrid5">성별</div>
                        <div class="userGrid userGrid6">
                            {isEditing ? (
                                <input
                                    className="genderGrid2"
                                    name="gender"
                                    value={userData.gender}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <div class="genderGrid">{userData.gender}</div>
                            )}
                        </div>

                        <div class="userGrid userGrid7">성명(영어)</div>
                        <div class="userGrid userGrid8">
                            {isEditing ? (
                                <input
                                    className="engNameGrid2"
                                    name="userNameEng"
                                    value={userData.userNameEng}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <div className="engNameGrid">
                                    {userData.userNameEng}
                                </div>
                            )}
                        </div>
                        <div class="userGrid userGrid9">생년월일</div>
                        <div class="userGrid userGrid10">
                            {isEditing ? (
                                <input
                                    type="date"
                                    className="birthGrid2"
                                    name="birthDate"
                                    value={userData.birthDate}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <div className="birthGrid">
                                    {userData.birthDate}
                                </div>
                            )}
                        </div>
                        <div class="userGrid userGrid11">이메일</div>
                        <div class="userGrid userGrid12">
                            {isEditing ? (
                                <input
                                    className="emailGrid2"
                                    name="email"
                                    value={userData.email}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <div className="emailGrid">
                                    {userData.email}
                                </div>
                            )}
                        </div>
                        <div class="userGrid userGrid13">휴대전화</div>
                        <div class="userGrid userGrid14">
                            {isEditing ? (
                                <input
                                    className="hpTelGrid2"
                                    name="hpTel"
                                    value={userData.hpTel}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <div className="hpTelGrid">
                                    {userData.hpTel}
                                </div>
                            )}
                        </div>
                        <div class="userGrid userGrid15">학력</div>
                        <div class="userGrid userGrid16">
                            {isEditing ? (
                                <input
                                    className="lectureGrid2"
                                    name="education"
                                    value={userData.education}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <div className="lectureGrid">
                                    {userData.education}
                                </div>
                            )}
                        </div>
                        <div class="userGrid userGrid17">최종학교</div>
                        <div class="userGrid userGrid18">
                            {isEditing ? (
                                <input
                                    className="finalSchoolGrid2"
                                    name="finalSchool"
                                    value={userData.finalSchool}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <div className="finalSchoolGrid">
                                    {userData.finalSchool}
                                </div>
                            )}
                        </div>
                        <div class="userGrid userGrid19">재직구분</div>
                        <div class="userGrid userGrid20">
                            {isEditing ? (
                                <input
                                    className="jobGrid2"
                                    name="cfOfEmp"
                                    value={userData.cfOfEmp}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <div className="jobGrid">
                                    {userData.cfOfEmp}
                                </div>
                            )}
                        </div>
                        <div class="userGrid userGrid21">자택주소</div>
                        <div class="userGrid22" id="userGrid22">
                            {isEditing ? (
                                <>
                                    <input
                                        className="adressBox2 zipCodeGrid2"
                                        name="zip_code"
                                        value={userData.zip_code}
                                        onChange={handleInputChange}
                                    />
                                    <div class="adressBox adressSearchButton">
                                        주소검색
                                    </div>
                                    <input
                                        className="adressBox2 adress1Grid2"
                                        name="address1Name"
                                        value={userData.address1Name}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        className="adressBox2 adress2Grid2"
                                        name="address2Name"
                                        value={userData.address2Name}
                                        onChange={handleInputChange}
                                    />
                                </>
                            ) : (
                                <>
                                    <div className="adressBox zipCodeGrid">
                                        {userData.zip_code}
                                    </div>
                                    <div class="adressBox adressSearchButton">
                                        주소검색
                                    </div>
                                    <div className="adressBox adress1Grid">
                                        {userData.address1Name}
                                    </div>
                                    <div className="adressBox adress2Grid">
                                        {userData.address2Name}
                                    </div>
                                </>
                            )}
                        </div>
                        <div class="userGrid userGrid23">정보수신 동의</div>
                        <div class="userGrid24">
                            <form
                                id="frm"
                                name="frm"
                                method="post"
                                action="./check_ok.php"
                                onsubmit="return check_form();"
                            >
                                <ul>
                                    <li>
                                        <input
                                            type="checkbox"
                                            class="userDataCheckBox"
                                            id="CheckBoxEmail"
                                            name="receiveEmailYn"
                                            checked={receiveEmailYn}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        ></input>
                                    </li>
                                    <li>
                                        <div>이메일</div>
                                    </li>
                                    <li>
                                        <input
                                            type="checkbox"
                                            class="userDataCheckBox"
                                            id="CheckBoxSms"
                                            name="receiveSmsYn"
                                            checked={receiveSmsYn}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        ></input>
                                    </li>
                                    <li>
                                        <div>SMS</div>
                                    </li>
                                    <li>
                                        <input
                                            type="checkbox"
                                            class="userDataCheckBox"
                                            id="CheckBoxPromo"
                                            name="receiveAdsPrPromoYn"
                                            checked={receiveAdsPrPromoYn}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        ></input>
                                    </li>
                                    <li>
                                        <div>광고, 프로모션</div>
                                    </li>
                                </ul>
                            </form>
                        </div>
                        {/* userDataUpdateBtnBox End */}
                    </div>{" "}
                    <div className="userDataUpdateBtnBox">
                        {isEditing ? (
                            <>
                                {/* userDataUpdateBtn1 */}
                                <div
                                    className="userDataUpdateBtn1"
                                    onClick={() => setIsEditing(false)}
                                >
                                    취소
                                </div>
                                {/* userDataUpdateBtn2 */}
                                <div
                                    className="userDataUpdateBtn2"
                                    onClick={handleUpdate}
                                >
                                    수정완료
                                </div>
                            </>
                        ) : (
                            /* userDataUpdateBtn */
                            <div
                                className="userDataUpdateBtn"
                                onClick={() => setIsEditing(true)}
                            >
                                정보수정
                            </div>
                        )}
                    </div>{" "}
                    {/* userGridContainer End */}
                </div>{" "}
                {/* userInfo-box End */}
            </div>{" "}
            {/* root End */}
        </div> /* container End */
    );
}

export default MyPageUser;
