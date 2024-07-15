import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./LocationPage.scss";

const stores = {
  hanoi: [
    {
      name: "Chi nhánh Hà Đông",
      address: "P. Nguyễn Trác, Yên Nghĩa, Hà Đông, Hà Nội, Việt Nam",
      map: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14901.73295022116!2d105.7461115!3d20.9626112!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313452efff394ce3%3A0x391a39d4325be464!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBQaGVuaWthYQ!5e0!3m2!1svi!2s!4v1689822769658!5m2!1svi!2s",
    },
    {
      name: "Chi nhánh Hoàng Mai",
      address: "1 Đ. Ngọc Hồi, Hoàng Liệt, Hoàng Mai, Hà Nội, Việt Nam",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.6779313347056!2d105.83975347529933!3d20.9654451806681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ad404f4b7861%3A0x299d715c5b51dba1!2zQuG6v24geGUgTsaw4bubYyBOZ-G6p20!5e0!3m2!1svi!2s!4v1720431029813!5m2!1svi!2s",
    },
  ],
  hochiminh: [
    {
      name: "Chi nhánh Quận 7",
      address: "2 Nguyễn Văn Tưởng, Tân Phú, Quận 7, Hồ Chí Minh, Việt Nam",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.020807915982!2d106.72608667508813!3d10.7328783894133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752539dbedce7f%3A0xf5c52ac358974c5f!2sThe%20Infinity%20By%20Keppel%20Land!5e0!3m2!1svi!2s!4v1720430958421!5m2!1svi!2s",
    },

    {
      name: "Chi nhánh Quận 1",
      address: "268 Lý Thường Kiệt, Phường 14, Quận 10, Hồ Chí Minh, Việt Nam",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.49399648117!2d106.65821807508864!3d10.773425889375222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ec3c161a3fb%3A0xef77cd47a1cc691e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBCw6FjaCBraG9hIC0gxJDhuqFpIGjhu41jIFF14buRYyBnaWEgVFAuSENN!5e0!3m2!1svi!2s!4v1720430500990!5m2!1svi!2s",
    },
  ],
};

const LocationPage = () => {
  const [selectedCity, setSelectedCity] = useState("hanoi");
  const [selectedStore, setSelectedStore] = useState(stores.hanoi[0]);

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setSelectedStore(stores[city][0]);
  };

  const handleStoreChange = (e) => {
    const store = stores[selectedCity].find(
      (store) => store.map === e.target.value
    );
    setSelectedStore(store);
  };

  return (
    <div className="container px-4">
      <div class="signup_header">
        <Link className="link-homepage" to="/">
          Trang chủ
        </Link>
        <p>/</p>
        <p style={{ color: "rgb(191, 191, 191)" }}>Cửa hàng</p>
      </div>
      <h1 style={{ fontSize: "30px", fontWeight: "400" }}>
        Danh sách cửa hàng
      </h1>
      <section className="disflex">
        <div className="form_location">
          <div>
            <p
              style={{
                fontSize: "25px",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              Tìm cửa hàng
            </p>
            <label htmlFor="city">Chọn tỉnh thành</label>
            <select id="city" value={selectedCity} onChange={handleCityChange}>
              <option value="hanoi">Hà Nội</option>
              <option value="hochiminh">Hồ Chí Minh</option>
            </select>
          </div>
          <div>
            <label htmlFor="store">Chọn cửa hàng</label>
            <select
              id="store"
              value={selectedStore ? selectedStore.map : ""}
              onChange={handleStoreChange}
            >
              {stores[selectedCity].map((store, index) => (
                <option key={index} value={store.map}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>
          <div className="location_item">
            <i className="fa-solid fa-location-dot"></i>

            {selectedStore && <p>{selectedStore.address}</p>}
          </div>
        </div>
        <div className="map_location">
          {selectedStore && (
            <iframe
              id="map"
              src={selectedStore.map}
              allowFullScreen
              title="Google Map"
            ></iframe>
          )}
        </div>
      </section>
    </div>
  );
};

export default LocationPage;
