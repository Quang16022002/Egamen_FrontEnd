import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ProfilePage.scss";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { UseMutationHooks } from "../../hooks/UseMutationHook";
import { updateUser } from "../../redux/counter/userSlide";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { getBase64 } from "../../utils";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState(user?.email || "");
  const [name, setName] = useState(user?.name || "");
  const [nickname, setNickName] = useState(user?.nickname || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [specificAddress, setSpecificAddress] = useState("");
  const [address, setAddress] = useState(user?.address || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [dob, setDob] = useState(user?.dob || "");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Thêm state isEditing
  const dispatch = useDispatch();
  const mutation = UseMutationHooks((data) => {
    const { id, access_token, ...rests } = data;
    setIsLoading(true);
    UserService.updateUser(id, rests, access_token)
      .then(() => {
        handleGetDetailsUser(user?.id, user?.access_token);
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi cập nhật người dùng:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  });

  const handleGetDetailsUser = async (id, token) => {
    try {
      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    } catch (error) {
      console.error("Có lỗi xảy ra khi lấy thông tin người dùng:", error);
    }
  };

  useEffect(() => {
    fetch("http://localhost:3001/api/locations")
      .then((response) => response.json())
      .then((data) => {
        setProvinces(data.provinces);
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      fetch("http://localhost:3001/api/locations")
        .then((response) => response.json())
        .then((data) => {
          setDistricts(
            data.districts.filter(
              (district) => district.parent_code === selectedProvince
            )
          );
          setWards([]);
          setSelectedDistrict("");
        })
        .catch((error) => {
          console.error("Error fetching districts:", error);
        });
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      fetch("http://localhost:3001/api/locations")
        .then((response) => response.json())
        .then((data) => {
          setWards(
            data.wards.filter((ward) => ward.parent_code === selectedDistrict)
          );
        })
        .catch((error) => {
          console.error("Error fetching wards:", error);
        });
    }
  }, [selectedDistrict]);

  const updateAddress = (
    provinceCode,
    districtCode,
    wardCode,
    specificAddress
  ) => {
    const selectedProvinceName =
      provinces.find((p) => p.code === provinceCode)?.name_with_type || "";
    const selectedDistrictName =
      districts.find((d) => d.code === districtCode)?.name_with_type || "";
    const selectedWardName =
      wards.find((w) => w.code === wardCode)?.name_with_type || "";

    setAddress(
      `${specificAddress ? specificAddress + ", " : ""}${
        selectedWardName ? selectedWardName + ", " : ""
      }${
        selectedDistrictName ? selectedDistrictName + ", " : ""
      }${selectedProvinceName}`.replace(/(^[,\s]+)|([,\s]+$)/g, "")
    );
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    const re = /^0\d{9}$/;
    return re.test(String(phone));
  };

  const handleValidation = () => {
    let tempErrors = {};
    let isValid = true;

    if (!validateEmail(email)) {
      tempErrors["email"] = "Email không hợp lệ";
      isValid = false;
    }

    if (!validatePhone(phone)) {
      tempErrors["phone"] = "Số điện thoại không hợp lệ";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handlOnchangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlOnchangeName = (e) => {
    setName(e.target.value);
  };

  const handlOnchangeNickName = (e) => {
    setNickName(e.target.value);
  };

  const handlOnchangePhone = (e) => {
    setPhone(e.target.value);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setSelectedAvatar(file);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleDobChange = (e) => {
    setDob(e.target.value);
  };

  const handleSpecificAddressChange = (e) => {
    setSpecificAddress(e.target.value);
  };

  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    setSelectedProvince(provinceCode);
    setSelectedDistrict("");
    setSelectedWard("");
    updateAddress(provinceCode, "", "", specificAddress);
  };

  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    setSelectedDistrict(districtCode);
    setSelectedWard("");
    updateAddress(selectedProvince, districtCode, "", specificAddress);
  };

  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    setSelectedWard(wardCode);
    updateAddress(
      selectedProvince,
      selectedDistrict,
      wardCode,
      specificAddress
    );
  };

  const handlOnchangeAddress = (e) => {
    const specificAddress = e.target.value;
    setSpecificAddress(specificAddress);
    updateAddress(
      selectedProvince,
      selectedDistrict,
      selectedWard,
      specificAddress
    );
  };

  const handleUpdate = async () => {
    if (handleValidation()) {
      setIsLoading(true);

      const avatarBase64 = selectedAvatar
        ? await getBase64(selectedAvatar)
        : null;

      const fullAddress = `${specificAddress}, ${
        selectedWard
          ? wards.find((w) => w.code === selectedWard)?.name_with_type + ", "
          : ""
      }${
        selectedDistrict
          ? districts.find((d) => d.code === selectedDistrict)?.name_with_type +
            ", "
          : ""
      }${provinces.find((p) => p.code === selectedProvince)?.name_with_type}`;

      const userData = {
        id: user?.id,
        email,
        name,
        nickname,
        phone,
        address: fullAddress,
        avatar: avatarBase64 || user?.avatar,
        gender,
        dob,
        access_token: user?.access_token,
      };

      try {
        await UserService.updateUser(
          userData.id,
          userData,
          userData.access_token
        );
        await handleGetDetailsUser(user?.id, user?.access_token);
        toast.success("Cập nhật thông tin thành công!");
        setIsEditing(false); // Thoát trạng thái chỉnh sửa sau khi lưu
      } catch (error) {
        console.error("Có lỗi xảy ra khi cập nhật người dùng:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Vui lòng kiểm tra lại thông tin nhập vào");
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div>
      {isLoading && <LoadingComponent />}

      <div className="container-account">
        <div className="container px-4 py-3">
          <div className="signup_header">
            <Link className="link-homepage" to="/">
              Trang chủ
            </Link>
            <p>/</p>
            <p style={{ color: "rgb(191, 191, 191)" }}>Thông tin</p>
          </div>
          <h1
            style={{
              fontSize: "30px",
              fontWeight: "400",
              marginBottom: "30px",
            }}
          >
            Thông tin cá nhân
          </h1>
          <div className="container d-flex justify-content-center align-items-center">
            <div className="col-lg-6 profile-account">
              <div className="row profile-account">
                <div className="profile-header" style={{ fontSize: 20 }}>
                  Thông tin tài khoản của <strong>{name}</strong>
                  <div className="button-container">
                    <button
                      className="edit-button"
                      onClick={handleEditToggle}
                      disabled={isLoading}
                    >
                      {isEditing ? "Lưu thông tin" : "Sửa thông tin"}
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 27 }} className="d-flex flex-column">
                  <div className="form-avatar mb-4 ">
                    <div className="styles__StyleAvatar-sc-7twymm-0 iRBxWb">
                      <div className="d-flex justify-content-center align-items-center">
                        <div
                          className="avatar-view"
                          style={{ overflow: "hidden" }}
                        >
                          {selectedAvatar ? (
                            <img
                              style={{
                                width: 110,
                                height: 110,
                                borderRadius: "50%",
                              }}
                              src={URL.createObjectURL(selectedAvatar)}
                              alt="Avatar"
                            />
                          ) : avatar ? (
                            <img
                              style={{
                                width: 110,
                                height: 150,
                                borderRadius: "50%",
                              }}
                              src={avatar}
                              alt="Avatar"
                            />
                          ) : (
                            <img
                              style={{
                                width: 60,
                                height: 60,
                              }}
                              src="https://frontend.tikicdn.com/_desktop-next/static/img/account/avatar.png"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    {isEditing && (
                      <label
                        htmlFor="avatarInput"
                        className="file-label d-flex justify-content-center align-items-center"
                      >
                        <p>Tải lên ảnh</p>
                        <input
                          id="avatarInput"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden-input"
                        />
                      </label>
                    )}
                  </div>
                  <div className="form-controls mb-3">
                    <label className="input-label">Họ và tên</label>
                    <div className="styles__StyledInput-sc-s5c7xj-5 hisWEc">
                      <input
                        className="input"
                        type="text"
                        name="fullName"
                        maxLength="128"
                        placeholder="Thêm họ tên"
                        value={name}
                        onChange={handlOnchangeName}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="form-controls mb-3">
                    <label className="input-label">Username</label>
                    <div>
                      <input
                        className="input"
                        name="userName"
                        maxLength="128"
                        placeholder="Thêm nickname"
                        type="text"
                        value={nickname}
                        onChange={handlOnchangeNickName}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="form-controls mb-3">
                    <label className="input-label">Ngày sinh</label>
                    <div>
                      <input
                        className="input"
                        name="dob"
                        type="date"
                        value={dob}
                        onChange={handleDobChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="form-controls mb-3">
                    <label className="input-label">Giới tính</label>
                    <form>
                      <input
                        className="ss"
                        name="gender"
                        type="radio"
                        value="Nam"
                        checked={gender === "Nam"}
                        onChange={handleGenderChange}
                        disabled={!isEditing}
                      />
                      <span
                        style={{ marginRight: 20 }}
                        className="option-gender"
                      >
                        Nam
                      </span>
                      <input
                        className="ss"
                        name="gender"
                        type="radio"
                        value="Nữ"
                        checked={gender === "Nữ"}
                        onChange={handleGenderChange}
                        disabled={!isEditing}
                      />
                      <span
                        style={{ marginRight: 20 }}
                        className="option-gender"
                      >
                        Nữ
                      </span>
                      <input
                        className="ss"
                        name="gender"
                        type="radio"
                        value="Khác"
                        checked={gender === "Khác"}
                        onChange={handleGenderChange}
                        disabled={!isEditing}
                      />
                      <span
                        style={{ marginRight: 40 }}
                        className="option-gender"
                      >
                        Khác
                      </span>
                    </form>
                  </div>
                  <div className="form-controls mb-3">
                    <label className="input-label">Số điện thoại</label>
                    <div className="styles__StyledInput-sc-s5c7xj-5 hisWEc">
                      <input
                        className="input"
                        type="text"
                        name="phone"
                        maxLength="10"
                        placeholder="Cập nhật SDT"
                        value={phone}
                        onChange={handlOnchangePhone}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="form-controls mb-3">
                    <label className="input-label">Email</label>
                    <div className="styles__StyledInput-sc-s5c7xj-5 hisWEc">
                      <input
                        className="input"
                        type="text"
                        name="email"
                        placeholder="Cập nhật Email"
                        value={email}
                        onChange={handlOnchangeEmail}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <div className="container">
                  {isEditing && (
                    <div className="address-container">
                      <div className="form-policy-secondd">
                        <select
                          className="custom-select"
                          value={selectedProvince}
                          onChange={handleProvinceChange}
                        >
                          <option value="">Chọn tỉnh</option>
                          {provinces.map((province) => (
                            <option key={province.code} value={province.code}>
                              {province.name_with_type}
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedProvince && (
                        <div
                          style={{ marginLeft: "-110px" }}
                          className="form-policy-secondd"
                        >
                          <select
                            className="custom-select"
                            value={selectedDistrict}
                            onChange={handleDistrictChange}
                          >
                            <option value="">Chọn quận huyện</option>
                            {districts.map((district) => (
                              <option key={district.code} value={district.code}>
                                {district.name_with_type}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}

                  {isEditing && selectedDistrict && (
                    <div className="address-container">
                      <div className="form-policy-secondd">
                        <select
                          className="custom-select"
                          value={selectedWard}
                          onChange={handleWardChange}
                        >
                          <option value="">Chọn xã phường</option>
                          {wards.map((ward) => (
                            <option key={ward.code} value={ward.code}>
                              {ward.name_with_type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-policy-secondd">
                        <input
                          className="custom-input"
                          type="text"
                          placeholder="Số nhà, đường, ..."
                          value={specificAddress}
                          onChange={handlOnchangeAddress}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-controls mb-3">
                  <label className="input-label">Địa chỉ</label>
                  <div className="styles__StyledInput-sc-s5c7xj-5 hisWEc">
                    <input
                      className="input"
                      type="text"
                      name="specificAddress"
                      placeholder="Số nhà, đường, ..."
                      value={address}
                      onChange={handlOnchangeAddress}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
              {errors["email"] && (
                <p className="error-text">{errors["email"]}</p>
              )}
              {errors["phone"] && (
                <p className="error-text">{errors["phone"]}</p>
              )}
              {isEditing && (
                <div className="button-accout text-center">
                  <button onClick={handleUpdate} disabled={isLoading}>
                    {isLoading ? "Đang cập nhật..." : "Cập nhật"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
