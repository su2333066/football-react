import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = () => {
  const settings = {
    dots: false,
    infinite: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div className="carousel">
      <Slider {...settings}>
        <a href="https://www.plabfootball.com/new-user-benefit/">
          <img src="https://plab-football.s3.amazonaws.com/media/banner-debut-event_m.png"></img>
        </a>
        <a href="https://www.plabfootball.com/explore/47/matches/?utm_source=plabfootball&utm_medium=banner&utm_campaign=%EC%8A%A4%ED%83%80%ED%84%B0%EB%A7%A4%EC%B9%98">
          <img src="https://plab-football.s3.amazonaws.com/media/banner-starter_pc.png"></img>
        </a>
        <a href="https://www.plabfootball.com/challenge/">
          <img src="https://plab-football.s3.amazonaws.com/media/banner-12challenge_pc_1.png"></img>
        </a>
      </Slider>
    </div>
  );
};

export default Carousel;
