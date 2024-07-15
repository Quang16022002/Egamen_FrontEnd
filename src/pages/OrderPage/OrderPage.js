import React, { useState } from "react";
import "./OrderPage.scss";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeOrderProduct,
} from "../../redux/counter/orderSlice";
import { Modal } from "antd";

const CartPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const navigate = useNavigate();


  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
  };

  const handleAddCart = () => {
    if (!user?.id) {
      Modal.confirm({
        title: "Thông báo",
        content: "Vui lòng đăng nhập để mua hàng",
        okText: "Đăng nhập",
        onOk() {
          navigate("/signin");
        },
      });
      return;
    }
    if (Object.values(selectedItems).some((isSelected) => isSelected)) {
      const missingFields = [];
      if (!user?.name) missingFields.push("tên");
      if (!user?.phone) missingFields.push("số điện thoại");
      if (!user?.address) missingFields.push("địa chỉ");

      if (missingFields.length > 0) {
        Modal.confirm({
          title: "Cảnh báo",
          content: (
            <div>
              Vui lòng cập nhật thông tin mua hàng trong hồ sơ trước khi mua sản phẩm:{" "}
              <strong>{missingFields.join(", ")}</strong>
            </div>
          ),
          okText: "Chỉnh sửa hồ sơ",
          onOk() {
            navigate("/profile-user");
          },
        });
      } else {
        const selectedProducts = order.orderItems.filter(
          (item) => selectedItems[item.product]
        );
        navigate("/payment", {
          state: { total: formattedTotal, selectedProducts },
        });
      }
    } else {
      Modal.confirm({
        title: "Cảnh báo",
        content: "Vui lòng chọn sản phẩm",
      });
    }
  };

  const handleDecreaseQuantity = (productId, currentQuantity) => {
    if (currentQuantity <= 1) {
      Modal.confirm({
        title: "Xác nhận",
        content: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
        onOk() {
          dispatch(removeOrderProduct({ productId }));
        },
      });
    } else {
      dispatch(decreaseQuantity(productId));
    }
  };

  const handleRemoveProduct = (productId, selectedColor, selectedSize) => {
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
      onOk() {
        dispatch(removeOrderProduct({ productId, selectedColor, selectedSize }));
      },
    });
  };

  const handleRemoveSelectedProducts = () => {
    const selectedProductIds = Object.keys(selectedItems).filter(
      (productId) => selectedItems[productId]
    );

    if (selectedProductIds.length > 0) {
      Modal.confirm({
        title: "Xác nhận",
        content: "Bạn có chắc chắn muốn xóa các sản phẩm đã chọn không?",
        onOk() {
          selectedProductIds.forEach((productId) => {
            const { selectedColor, selectedSize } = order.orderItems.find(
              (item) => item.product === productId
            );
            dispatch(removeOrderProduct({ productId, selectedColor, selectedSize }));
          });
          setSelectedItems({});
          setSelectAll(false);
        },
      });
    } else {
      Modal.warning({
        title: "Cảnh báo",
        content: "Không có sản phẩm nào được chọn để xóa.",
      });
    }
  };

  const handleToggleSelectAll = () => {
    const updatedSelectAll = !selectAll;
    setSelectAll(updatedSelectAll);
    const updatedSelectedItems = {};
    order.orderItems.forEach((item) => {
      updatedSelectedItems[item.product] = updatedSelectAll;
    });
    setSelectedItems(updatedSelectedItems);
  };
  

  const handleToggleSelectItem = (productId) => {
    const isAllSelected = order.orderItems
      .filter((item) => item.product === productId)
      .every((item) => selectedItems[item.product]);
  
    const updatedSelectedItems = { ...selectedItems };
  
    order.orderItems.forEach((item) => {
      if (item.product === productId) {
        updatedSelectedItems[item.product] = !isAllSelected;
      }
    });
  
    setSelectedItems(updatedSelectedItems);
  };
  
  
  const calculateTotal = () => {
    const total = order.orderItems.reduce((total, item) => {
      const itemPrice = parseFloat(item.price);
      const itemAmount = parseInt(item.amount, 10);
      if (
        selectedItems[item.product] &&
        !isNaN(itemPrice) &&
        !isNaN(itemAmount)
      ) {
        return total + itemPrice * itemAmount;
      }
      return total;
    }, 0);
    return total;
  };

  const formattedTotal = (calculateTotal() * 1000).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  });

  const calculateSelectedItemsCount = () => {
    return Object.values(selectedItems).filter((isSelected) => isSelected)
      .length;
  };

  return (
    <div style={{ backgroundColor: "rgb(242, 245, 247)", height: "auto" }}>
      <div className="container px-5 py-2">
        <div className="cart-page">
          <div className="cart-header">
            <i className="fa-solid fa-arrow-left-long"></i>
            <div className="go-back">
              <p className="title">Giỏ hàng của bạn</p>
            </div>
          </div>
        </div>

        {order?.orderItems?.length === 0 ? (
          <div>
            <div className="Cart_notification">
              <img src="https://cdn2.cellphones.com.vn/x,webp/media/cart/Cart-empty-v2.png" alt="empty cart" />
              <p className="">
                Giỏ hàng của bạn đang trống.
                <br />
                Hãy chọn thêm sản phẩm để mua sắm nhé
              </p>
            </div>
            <div className="stickyBottomBar d-flex justify-content-between">
              <Link to="/" style={{ width: "100%" }}>
                <button style={{ width: "100%" }} className="btn-action">
                  Quay lại trang chủ
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="listItemSuperCart">
              <div className="header-action my-4 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center justify-content-center">
                  <div className="select-product-action custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="selectAll"
                      checked={selectAll}
                      onChange={handleToggleSelectAll}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="selectAll"
                    ></label>
                  </div>
                  <p style={{ margin: 0, marginLeft: 15 }}>Chọn tất cả</p>
                </div>
                <button
                  onClick={handleRemoveSelectedProducts}
                  className="btn-action"
                >
                  Xóa sản phẩm đã chọn
                </button>
              </div>
              {order?.orderItems?.map((orderItem) => {
                const firstImage = orderItem.image && orderItem.image.length > 0 ? orderItem.image[0] : '';
                const imageUrl = `${firstImage}`;
                return (
                  <div
                    className="block__product-item__outer"
                    key={orderItem.product}
                  >
                    <div className="block__product-item">
                      <div className="checkbox-product">
                        <div className="select-product-action custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            value="true"
                            id={`checkbox-${orderItem.product}`}
                            checked={selectedItems[orderItem.product]}
                            onChange={() =>
                              handleToggleSelectItem(orderItem.product)
                            }
                          />
                          <label
                            className="custom-control-label"
                            htmlFor={`checkbox-${orderItem.product}`}
                          >
                            <img
                              src={imageUrl}
                              alt={orderItem.name}
                              style={{
                                width: 100,
                                height: 100,
                                marginLeft: 20,
                              }}
                              loading="lazy"
                              className="product-img"
                            />
                          </label>
                        </div>
                      </div>
                      <div className="product-info">
                        <div className="product-info-top d-flex justify-content-between align-items-start">
                          <a href="#" className="product-name">
                            {orderItem.name}
                          </a>{" "}
                          <i
                            style={{ marginRight: 7, cursor: "pointer" }}
                            className="fa-regular fa-trash-can"
                            onClick={() =>
                              handleRemoveProduct(
                                orderItem.product,
                                orderItem.selectedColor,
                                orderItem.selectedSize
                              )
                            }
                          ></i>
                        </div>
                        <div className="product-attributes">
            <p>
              <strong
              
              >Màu:</strong> {orderItem.selectedColor}
            </p>
            <p>
              <strong
              >Kích thước:</strong> {orderItem.selectedSize}
            </p>
          </div>
                        <div
                          style={{ marginTop: 30 }}
                          className="d-flex justify-content-between align-items-center"
                        >
                          <div className="block-box-price">
                            <div className="box-info__box-price">
                              <p className="product__price--show">
                                {orderItem.price && orderItem.price.toLocaleString()}đ
                              </p>{" "}
                              <del className="product__price--through">
                                {orderItem.original_price && orderItem.original_price.toLocaleString()}đ
                              </del>
                            </div>
                          </div>{" "}
                          <div className="actions d-flex">
                            <button
                              style={{ color: "black" }}
                              onClick={() =>
                                handleDecreaseQuantity(
                                  orderItem.product,
                                  orderItem.amount
                                )
                              }
                            >
                              -
                            </button>
                            <input
                              type="text"
                              name="qty"
                              id="sst"
                              maxLength="12"
                              value={orderItem.amount}
                              title="Quantity:"
                              className="input-text qty"
                              readOnly
                            />
                            <button
                              style={{ color: "black" }}
                              onClick={() =>
                                handleIncreaseQuantity(orderItem.product)
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                  
                    </div>

                    <div className="BH">
                      <i className="fa-solid fa-shield-heart"></i>
                      <p>Bảo vệ toàn diện với Bảo hành mở rộng</p>
                    </div>
                  </div>
                );
              })}
              <div className="stickyBottomBar d-flex justify-content-between">
                <div className="price-temp">
                  <p style={{ margin: 0 }}>Tạm tính</p>{" "}
                  <span className="total_price">{formattedTotal}</span>
                </div>
                <button onClick={handleAddCart} className="btn-action">
                  Mua ngay ({calculateSelectedItemsCount()})
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
