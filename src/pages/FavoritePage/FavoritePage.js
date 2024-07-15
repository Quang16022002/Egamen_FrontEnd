import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './FavoritePage.scss';

const FavoritePage = () => {
  const favoriteItems = useSelector((state) => state.favorite.favoriteItems);

  return (
    <div className="favorite-page container my-5">
      <h1>Danh sách yêu thích</h1>
      {favoriteItems.length === 0 ? (
        <p>Bạn chưa có sản phẩm nào trong danh sách yêu thích.</p>
      ) : (
        <div className="favorite-items">
          {favoriteItems.map((item) => (
            <div key={item.id} className="favorite-item d-flex my-2">
              <Link to={`/product-detail/${item.id}`}>
                {Array.isArray(item.image) ? (
                  <div className="">
                    <img style={{width:100}} className="img-fluid" src={item.image[0]} alt={item.name} />
                  </div>
                ) : (
                  <img className="img-fluid" src={`data:image/jpeg;base64,${item.image}`} alt={item.name} />
                )}
              </Link>
              <div className="favorite-item-details">
                <Link style={{textDecoration:"none"}} to={`/product-detail/${item.id}`}>
                  <h2 style={{}}>{item.name}</h2>
                </Link>
                <p>Giá: {item.price} đ</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritePage;
