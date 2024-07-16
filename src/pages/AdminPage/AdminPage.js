import React, { useState } from "react";
import './AdminPage.scss'
import {
  AppstoreOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  ProfileOutlined,
  AreaChartOutlined
} from "@ant-design/icons";
import { Menu } from "antd";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminOrder from "../../components/AdminOrder/AdminOrder";
import AdminPost from "../../components/AdminPost/AdminPost";
import AdminStatistical from '../../components/AdminStatistical/AdminStatistical';

export const AdminPage = () => {
  const items = [
    {
      key: "user",
      icon: <UserOutlined />,
      label: "Quản lý người dùng",
    },
    {
      key: "product",
      icon: <AppstoreOutlined />,
      label: "Quản lý sản phẩm",
    },
    {
      key: "order",
      icon: <ShoppingCartOutlined />,
      label: "Quản lý đơn hàng",
    },
    {
      key: "post",
      icon: <ProfileOutlined />,
      label: "Quản lý bài viết",
    },
    {
      key: "statistical",
      icon: <AreaChartOutlined /> ,
      label: "Thống kê",
    },
  ];

  const [keySelected, setKeySelected] = useState("user"); // Set default selected key to 'user'
  const [stateOpenKeys, setStateOpenKeys] = useState([]);

  const renderPage = (key) => {
    switch (key) {
      case 'user':
        return <AdminUser />;
      case 'product':
        return <AdminProduct />;
      case 'order':
        return <AdminOrder />;
        case 'post':
          return <AdminPost />;
          case 'statistical':
            return <AdminStatistical />;
      default:
        return <AdminUser />;
    }
  }
  const onOpenChange = (openKeys) => {
    setStateOpenKeys(openKeys);
  };

  const handleOnClick = ({ key }) => {
    setKeySelected(key);
  };

  return (
    <div className="Admin d-flex">
      <Menu
        mode="inline"
        selectedKeys={[keySelected]}
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
        style={{
          width: 230,
          height: 'auto',
        }}
      >
        {items.map((item) => (
          <Menu.Item
            style={{ width: 215, color: 'white', fontSize: 15, padding: 25, fontWeight: 500 }}
            key={item.key}
            icon={item.icon}
            onClick={handleOnClick}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
      <div style={{ width: '100%' }} className="admin-content py-2 px-2">
        {renderPage(keySelected)}
      </div>
    </div>
  );
};

export default AdminPage;
