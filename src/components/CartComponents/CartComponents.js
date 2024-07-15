import React, { useState } from "react";
import "./CartComponents.scss";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import QuickViewComponent from "../QuickViewComponent/QuickViewComponent";
import * as ProductService from "../../services/ProductService";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../../redux/counter/favoriteSlice";

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
    isFavorite, // Thêm isFavorite vào props
  } = props;
  const dispatch = useDispatch();
  const location = useLocation();
  const [favorite, setFavorite] = useState(isFavorite); // Sử dụng state để quản lý isFavorite

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

  const handleFavoriteToggle = async () => {
    try {
      const updatedProduct = { isFavorite: !favorite };
      await ProductService.updateProduct(id, updatedProduct);
      setFavorite(!favorite); // Cập nhật trạng thái isFavorite trên client
      dispatch(toggleFavorite(props)); // Cập nhật trạng thái yêu thích trong Redux
      toast.success(`Sản phẩm đã được ${!favorite ? "thêm vào" : "bỏ khỏi"} danh sách yêu thích`);
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm yêu thích:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
    }
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
              <p style={{ textTransform: "none", cursor: "pointer" }} onClick={handleFavoriteToggle}>
                Yêu thích{" "}
                <i className={`fa-heart ${favorite ? "fa-solid" : "fa-regular"}`}></i>
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
            isFavorite, // Thêm isFavorite vào product
          }}
          onClose={closeQuickView}
        />
      )}
    </div>
  );
};

export default CartComponents;
