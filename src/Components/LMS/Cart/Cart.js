import { useEffect, useState } from "react";
import { getCurrentUser } from "../../../Api/UserApi/UserApi";
import { saveCourseRegistration } from "../../../Api/CourseApi/CourseApi";

export function Cart() {
  const [cart, setCart] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    cartList();
  }, [cart]);

  // 수강신청
  async function courseAdd() {
    if (checkedItems.length === 0) {
      alert("수강신청할 항목을 선택해주세요.");
      return;
    }

    const confirm = window.confirm(
      `선택한 ${checkedItems.length}개의 항목을 수강신청 하시겠습니까?`
    );
    if (!confirm) {
      return;
    }

    try {
      for (const lectureId of checkedItems) {
        const courseRegistration = {
          user: {
            userId: userId,
          },
          lecture: {
            lectureId: lectureId,
          },
        };
        await saveCourseRegistration(courseRegistration);

        let updatedCart = cart.filter(
          (item) => !checkedItems.includes(item.lectureId)
        );

        // localStorage 업데이트
        localStorage.setItem(userId, JSON.stringify(updatedCart));
        setCart(updatedCart);
        setCheckedItems([]);
        setSelectAll(false);
      }
      alert("선택된 항목들이 수강신청 되었습니다.");
    } catch (error) {
      console.log("Course Error", error);
    }
  }

  // 장바구니 리스트
  // async function cartList() {
  //   try {
  //     const SessionData = await getCurrentUser();
  //     const userId = SessionData.userId;
  //     setUserId(userId);
  //     const cartList = JSON.parse(localStorage.getItem(userId));
  //     setCart(cartList);
  //   } catch (error) {
  //     console.log("Cart List Error");
  //   }
  // }
  async function cartList() {
    try {
      const SessionData = await getCurrentUser();
      const userId = SessionData.userId;
      setUserId(userId);
      const getCartList = localStorage.getItem(userId);
      const cartList = getCartList ? JSON.parse(getCartList) : [];
      setCart(Array.isArray(cartList) ? cartList : []);
    } catch (error) {
      console.error("Cart List Error:", error);
    }
  }

  const handleCheckboxChange = (lectureId) => {
    setCheckedItems((prevCheckedItems) => {
      if (prevCheckedItems.includes(lectureId)) {
        return prevCheckedItems.filter((id) => id !== lectureId);
      } else {
        return [...prevCheckedItems, lectureId];
      }
    });
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setCheckedItems([]);
    } else {
      setCheckedItems(cart.map((item) => item.lectureId));
    }
    setSelectAll(!selectAll);
  };

  async function cartRemove() {
    // 사용자에게 삭제 확인 대화상자 표시
    const confirm = window.confirm(
      `선택한 ${checkedItems.length}개의 항목을 장바구니에서 삭제하시겠습니까?`
    );
    if (!confirm) {
      return;
    }

    try {
      const SessionData = await getCurrentUser();
      const userId = SessionData.userId;
      let cartList = JSON.parse(localStorage.getItem(userId)) || [];

      cartList = cartList.filter(
        (item) => !checkedItems.includes(item.lectureId)
      );

      localStorage.setItem(userId, JSON.stringify(cartList));
      setCart(cartList);
      setCheckedItems([]);
      setSelectAll(false);
    } catch (error) {
      console.log("Remove Error", error);
    }
  }

  return (
    <>
      <p>　</p>
      <p>*CartList*</p>
      <div>
        {cart.length > 0 ? (
          <>
            <div>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAllChange}
              />
              <label>전체 선택</label>
            </div>
            {cart.map((lecture, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  checked={checkedItems.includes(lecture.lectureId)}
                  onChange={() => handleCheckboxChange(lecture.lectureId)}
                />
                <p>Lecture ID: {lecture.lectureId}</p>
              </div>
            ))}
          </>
        ) : (
          <p>장바구니가 비었습니다.</p>
        )}
      </div>

      <p>　</p>
      <p>*CartRemove*</p>
      <button onClick={cartRemove}>삭제</button>
      <p>　</p>
      <p>*Course Add*</p>
      <button onClick={courseAdd}>수강하기</button>
    </>
  );
}
