import React, { useState, useEffect } from "react";
import "./SingInPage.scss";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { UseMutationHooks } from "../../hooks/UseMutationHook";
import * as message from "../../components/Message/Message";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/counter/userSlide";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const isFormValid = email && password;
    setIsFormValid(isFormValid);
  }, [email, password]);

  const handleOnchangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleOnchangePassword = (event) => {
    setPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const mutation = UseMutationHooks((data) => UserService.loginUser(data));

  const { data } = mutation;
  useEffect(() => {
    if (data && data.status === "OK") {
      message.success();
      navigate("/");
      localStorage.setItem("access_token", JSON.stringify(data.access_token));
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);
        console.log("decoed", decoded);
        if (decoded && decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token);
        }
      }
    }
  });
  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
    console.log("res", res);
  };

  const handleSignIn = () => {
    if (isFormValid) {
      mutation.mutate({
        email,
        password,
      });
    }
  };

  return (
    <div className="container px-5">
      <div className="signup_header">
        <span
          className="link-homepage"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          Trang chủ
        </span>
        <p>/</p>
        <p style={{ color: "rgb(191, 191, 191)" }}>Đăng nhập</p>
      </div>

      <div className="heading-bar text-center py-5">
        <h1 style={{ fontSize: "25px" }}>ĐĂNG NHẬP TÀI KHOẢN</h1>
        <p>
          Bạn chưa có tài khoản? Đăng ký
          <span
            className="link-signup px-2"
            onClick={() => navigate("/singup")}
            style={{ cursor: "pointer", color: "blue" }}
          >
            tại đây
          </span>
        </p>
      </div>

      <div className="formSignup">
        <form>
          <div className="form-Signup-Input">
            <label>
              Email<span>*</span>
            </label>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={handleOnchangeEmail}
            ></input>
          </div>
          <div className="form-Signup-Input">
            <label>
              Mật khẩu<span>*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={password}
                onChange={handleOnchangePassword}
                className="password-input"
              />
              <i
                className={`fa-solid ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                }`}
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer" }}
              ></i>
            </div>
          </div>
        </form>

        <p style={{ fontSize: "14px" }}>
          Quên mật khẩu? Nhấn vào
          <span
            className="px-0"
            style={{ textDecoration: "none", cursor: "pointer", color: "blue" }}
            onClick={() => navigate("/forgot-password")}
          >
            {" "}
            đây.
          </span>
        </p>
        {data?.status === "ERR" && (
          <span style={{ color: "red", fontSize: "14px" }}>
            {data?.message}
          </span>
        )}
        <div className="button-signup">
          <p
            className="text-center py-3"
            onClick={isFormValid ? handleSignIn : null}
            style={{
              cursor: isFormValid ? "pointer" : "not-allowed",
              backgroundColor: isFormValid ? "black" : "gray",
              color: "white",
              borderRadius: "5px",
            }}
          >
            Đăng nhập
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
