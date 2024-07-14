import React, { useState } from "react";
import "./CartComponents.scss";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addOrderProduct } from "../../redux/counter/orderSlice";
import { toast } from "react-toastify";
import QuickViewComponent from "../QuickViewComponent/QuickViewComponent";

const CartComponents = (props) => {
  const [isQuickViewVisible, setQuickViewVisible] = useState(false);
  const {
    id,
    countInStock,
    descriptions,
    image,
    name,
    price,
    rating,
    type,
    original_price,
    size,
    color,
  } = props;
  const dispatch = useDispatch();
  const location = useLocation();

  const isValidObjectId = (id) => {
    return /^[a-fA-F0-9]{24}$/.test(id);
  };

  const renderRatingStars = () => {
    return (
      <div className="rating">
        <span>({rating})</span>
        <i style={{ marginLeft: "3px" }} className="fa-solid fa-star"></i>
      </div>
    );
  };

  const isProductsPage = location.pathname === "/products";

  if (!isValidObjectId(id)) {
    console.error("Invalid product ID:", id);
    return null;
  }

  const handleQuickView = () => {
    setQuickViewVisible(true);
  };

  const closeQuickView = () => {
    setQuickViewVisible(false);
  };

  return (
    <div className={`col-lg-${isProductsPage ? "4" : "3"} col-md-6`}>
      <div className="single-product">
        <div>
          <div className="product-img">
            {Array.isArray(image) ? (
              <Link to={`/product-detail/${id}`}>
                <div className="aaaa">
                  <img className="img-fluid" src={image[0]} alt={name} />
                </div>
              </Link>
            ) : (
              <img className="img-fluid" src={image} alt={name} />
            )}
            <div className="p_icon quickview">
              <Link onClick={handleQuickView}>
                <i className="fa-regular fa-eye"></i>
              </Link>
              <Link to={`/product-detail/${id}`}>
                <i className="fa-solid fa-cart-plus"></i>
              </Link>
            </div>
          </div>
        </div>
        <div className="product-btm">
          <Link to={`/product-detail/${id}`} className="d-block">
            <p className="name_product">{name}</p>
          </Link>
          <div className="cart-title">
            <span style={{ color: "var(--text-color)" }}>{price} đ</span>
            <span>{original_price} đ</span>
          </div>
          <div className="cart-footer">
            <div className="cart-footer-start">{renderRatingStars()}</div>
            <div className="cart-footer-favourite">
              <p style={{ textTransform: "none" }}>
                Yêu thích <i className="fa-regular fa-heart"></i>
              </p>
            </div>
          </div>
        </div>
      </div>
      {isQuickViewVisible && (
        <QuickViewComponent
          product={{
            id,
            countInStock,
            descriptions,
            image,
            name,
            price,
            rating,
            type,
            original_price,
            size,
            color,
          }}
          onClose={closeQuickView}
        />
      )}
    </div>
  );
};

export default CartComponents;
