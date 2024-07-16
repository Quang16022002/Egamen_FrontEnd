import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import "./FavoritePage.scss";

// Hành động để xóa sản phẩm khỏi danh sách yêu thích
const removeFromFavorite = (id) => ({
  type: "REMOVE_FROM_FAVORITE",
  payload: id,
});

const FavoritePage = () => {
  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.favorite.favoriteItems);

  const handleRemove = (id) => {
    dispatch(removeFromFavorite(id));
  };

  return (
    <div className="container px-4 form-policy">
      <div className="signup_header">
        <Link className="link-homepage" to="/">
          Trang chủ
        </Link>
        <p>/</p>
        <p style={{ color: "rgb(191, 191, 191)" }}>Danh sách yêu thích</p>
      </div>

      <h1 style={{ marginTop: "1px", fontSize: "30px", fontWeight: "400" }}>
        Danh sách yêu thích
      </h1>

      <div className="favorite-page">
        <div className="container">
          {favoriteItems.length === 0 ? (
            <p>Bạn chưa có sản phẩm nào trong danh sách yêu thích.</p>
          ) : (
            <div className="favorite-items">
              {favoriteItems.map((item) => (
                <div key={item.id} className="favorite-item d-flex my-2">
                  <Link
                    to={`/product-detail/${item.id}`}
                    className="d-flex align-items-center"
                  >
                    {Array.isArray(item.image) ? (
                      <div className="me-3">
                        <img
                          style={{ width: 100 }}
                          className="img-fluid"
                          src={item.image[0]}
                          alt={item.name}
                        />
                      </div>
                    ) : (
                      <img
                        className="img-fluid me-3"
                        src={`data:image/jpeg;base64,${item.image}`}
                        alt={item.name}
                        style={{ width: 100 }}
                      />
                    )}
                    <div className="favorite-item-details">
                      <h2>{item.name}</h2>
                      <p>Giá: {item.price} đ</p>
                    </div>
                  </Link>
                  <button
                    className="btn btn-danger ms-auto"
                    onClick={() => handleRemove(item.id)}
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritePage;
