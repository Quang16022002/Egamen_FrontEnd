import React from "react";
import "./ReviewComponent.scss"; // Đảm bảo bạn có tệp CSS này

const ReviewComponent = () => {
  return (
    <div className="container d-flex review-container px-5">
      <div className="avatar-review">
        <img
          src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/tecno-spark-20-pro-plus_2__2.png"
          alt="Avatar"
          className="avatar-img"
        />
      </div>

      <div className="user-review">
        <div className="d-flex">
          <p className="user-name">Phương Thảo</p>
          <p className="review-date">
            <i class="fa-regular fa-clock"></i>18/7/2024 11:34
          </p>
        </div>
        <div className="star-rating">
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
        </div>
        <p className="review-text">
          Mọi thứ đều ok màn hình cong mỏng cảm rất sang pin mình dùng liên tục
          4g ngoài nắng tầm 8 tiếng. Camera cũng ok. Mình mua với giá 4.850 quá
          ok luôn ạ.
        </p>
        <div className="uploaded-images">
          <img
            src="https://via.placeholder.com/150"
            alt="Uploaded 1"
            className="uploaded-img"
          />
          <img
            src="https://via.placeholder.com/150"
            alt="Uploaded 2"
            className="uploaded-img"
          />
          <img
            src="https://via.placeholder.com/150"
            alt="Uploaded 3"
            className="uploaded-img"
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewComponent;
