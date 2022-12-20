import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Detail() {
  const { seq } = useParams();

  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState({});

  const 매치방가져오기 = async () => {
    await axios({
      url: "http://localhost:4000/detail",
      method: "GET",
      params: {
        seq: seq,
      },
    }).then(({ data }) => {
      setData(data);
    });

    setLoading(false);
  };

  React.useEffect(() => {
    매치방가져오기();
  }, []);

  if (loading) {
    return <div>로딩중</div>;
  }

  console.log(data);

  return (
    <div className="container">
      <h1>{data.place}</h1>
      <button>신청하기</button>
    </div>
  );
}

export default Detail;
