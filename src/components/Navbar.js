const Navbar = ({ myProfile, keywordSearch, setData }) => {
  return (
    <div className="navbar">
      <div className="navContainer">
        <div className="navLogo">
          <a href="/">
            <img
              src="https://plab-football.s3.amazonaws.com/static/img/logo.svg"
              alt="플랩풋볼"
            ></img>
          </a>
        </div>
        <div className="navRight">
          <div className="navSearch">
            <button onClick={keywordSearch}>
              <img
                src="https://plab-football.s3.amazonaws.com/static/img/ic_search.svg"
                alt="내정보"
              ></img>
            </button>
            <input
              type="search"
              maxLength="100"
              autoComplete="off"
              placeholder="지역, 구장 이름으로 찾기"
              onChange={setData}
            ></input>
          </div>
          <button
            onClick={() => {
              alert("준비중");
            }}
          >
            <img
              src="https://plab-football.s3.amazonaws.com/static/img/ic_my.svg"
              alt="더보기"
            ></img>
          </button>
          <button
            onClick={() => {
              alert("준비중");
            }}
          >
            •••
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
