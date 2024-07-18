import React, { useEffect, useState } from "react";
import "./HeaderComponent.scss";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { resetUser } from "../../redux/counter/userSlide";
import { toast } from "react-toastify";
import { clearOrder } from "../../redux/counter/orderSlice";
import * as message from "../../components/Message/Message";

const HeaderComponent = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const order = useSelector((state) => state.order);
  const favoriteItems = useSelector((state) => state.favorite.favoriteItems);
  const handleLogout = async () => {
    try {
      await UserService.logoutUser();
      dispatch(resetUser());
      message.success();
      navigate("/singin");
      dispatch(clearOrder());
    } catch (error) {
      message.error();
    }
  };


  useEffect(() => {
    if (user && user.name) {
      setUserName(user.name);
    } else if (user && user.email) {
      setUserName(user.email);
    }
  }, [user]);

  return (
    <header>
      <div className="top-menu">
        <div className="container">
          <div className="row ">
            <div className="col-lg-7 ">
              <div className="top-menu-left  d-flex  align-items-center">
                <p>Điện thoại: 0987654321 </p>
                <p style={{ borderRight: "none" }}>email: egamen@gmail.com</p>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="float-right">
                {user?.access_token ? (
                  <div className="user_login">
                    <ul className="user_login-item d-flex">
                      <li
                        style={{ paddingTop: 7, paddingBottom: 7 }}
                        className="login"
                      >
                        <span style={{ marginRight: 3 }}>Xin chào:</span>
                        {userName}
                        <div className="infomation-user">
                          <div className="infomation-user_list">
                            <ul className="information-user_list-item">
                              <li className="d-flex">
                                <Link
                                  style={{ fontSize: 13 }}
                                  to="/profile-user"
                                  className="profile d-flex align-items-center"
                                >
                                  <i className="fa-regular fa-user"></i>
                                  <span style={{ textTransform: "none" }}>
                                    Xem hồ sơ
                                  </span>
                                </Link>
                              </li>
                              {user?.isAdmin ? (
                                <li className="d-flex">
                                  <Link
                                    style={{ fontSize: 13 }}
                                    to="/system-admin"
                                    className="profile d-flex align-items-center"
                                  >
                                    <i class="fa-solid fa-screwdriver-wrench"></i>
                                    <span
                                      style={{
                                        textTransform: "none",
                                        color: "#4A4A4A",
                                      }}
                                    >
                                      Quản lý hệ thống
                                    </span>
                                  </Link>
                                </li>
                              ) : (
                                <>
                                  <Link
                                    style={{ width: "100%" }}
                                    to={`OrderManagement/${user.id}`}
                                  >
                                    <li>
                                      <i className="fa-regular fa-money-bill-1"></i>
                                      <span>Đơn hàng</span>
                                    </li>
                                  </Link>
                                </>
                              )}
                              <li onClick={handleLogout}>
                                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                <span>Đăng xuất</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </li>
                      <li>
                        <a>VI</a>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <ul className="right_side d-flex">
                    <li>
                      <Link to="/singin">Đăng nhập</Link>
                    </li>
                    <li>
                      <Link to="/singup">Đăng ký</Link>
                    </li>
                    <li>
                      <a style={{ borderRight: "none" }}>VI</a>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container header">
        <nav className="navbar navbar-expand-lg navbar-light py-3">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand">
              <img
                src="https://theme.hstatic.net/200000696635/1001199686/14/logo.png?v=8"
                alt="logo"
              ></img>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 justify-content-center">
                <li
                  className={`nav-item li1 ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                >
                  <Link to="/" className="nav-link">
                    TRANG CHỦ
                  </Link>
                </li>
                <li
                  className={`nav-item ${
                    location.pathname === "/products" ? "active" : ""
                  }`}
                >
                  <Link to="/products" className="nav-link">
                    SẢN PHẨM
                  </Link>
                </li>
                <li
                  className={`nav-item ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                >
                  <Link to="/Blog" className="nav-link">
                    TIN TỨC
                  </Link>
                </li>
                <li
                  className={`nav-item ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                >
                  <Link to="/location" className="nav-link">
                    CỬA HÀNG
                  </Link>
                </li>
                <li
                  className={`nav-item ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                >
                  <Link to="/introduce" className="nav-link">
                    GIỚI THIỆU
                  </Link>
                </li>
              </ul>
              <form className="d-flex input">
                <div className="header-right">
                  <Link to="/Order">
                    {" "}
                    <i className="fa-solid fa-cart-shopping">
                      <div className="quantity-cart">
                        {order?.orderItems?.length}
                      </div>
                    </i>
                  </Link>
                  <Link to="/favorite">
                    {" "}
                    <i class="fa-solid fa-heart">
                      <div className="quantity-favorite">
                        {favoriteItems?.length}
                      </div>
                    </i>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default HeaderComponent;
