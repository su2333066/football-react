/*global kakao*/
import React from "react";

const Location = (props) => {
  React.useEffect(() => {
    var mapContainer = document.getElementById("kakaoMap"),
      mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };

    var map = new kakao.maps.Map(mapContainer, mapOption);

    var geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(`${props.link}`, function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        var marker = new kakao.maps.Marker({
          map: map,
          position: coords,
        });

        var infowindow = new kakao.maps.InfoWindow({
          content:
            '<div style="width:150px;text-align:center;padding:6px 0;">풋살장 장소</div>',
        });
        infowindow.open(map, marker);
        map.setCenter(coords);
      }
    });
  }, []);

  return <div id="kakaoMap"></div>;
};

export default Location;
