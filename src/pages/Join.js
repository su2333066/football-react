import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

function Join() {
  const [data, setData] = React.useState({});

  const navigation = useNavigate();

  const 데이터변경 = (event) => {
    const cloneData = { ...data };
    cloneData[event.target.name] = event.target.value;
    setData(cloneData);
  };

  const 가입하기 = async () => {
    await axios({
      url: "http://localhost:4000/join",
      method: "POST",
      data: data,
    }).then((response) => {
      if (response.data.message) {
        alert(response.data.message);
      }

      if (response.data.code === "success") {
        navigation("/Login");
      }
    });
  };

  return (
    <div>
      <input
        name="id"
        placeholder="아이디 입력해주세요"
        onChange={데이터변경}
      />
      <input
        name="nickname"
        placeholder="닉네임을 입력해주세요"
        onChange={데이터변경}
      />
      <input
        type="password"
        name="pw"
        placeholder="비밀번호를 입력해주세요"
        onChange={데이터변경}
      />
      <button type="button" onClick={가입하기}>
        가입
      </button>
    </div>
  );
}

export default Join;
