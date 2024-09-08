import React, { useState } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import {
  DashboardOutlined,
  LineChartOutlined,
  UserOutlined,
  ShopOutlined,
  LogoutOutlined,
  ArrowUpOutlined,
  FileSearchOutlined,
  MessageOutlined
} from '@ant-design/icons';
import './menulist.css';

const MenuList = () => {
  const [openKeys, setOpenKeys] = useState([]);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (latestOpenKey) {
      setOpenKeys([latestOpenKey]);
    } else {
      setOpenKeys([]);
    }
  };

  return (
    <div>
      <Menu 
        theme='light' 
        mode='inline' 
        className='menu-bar'
        openKeys={openKeys}
        onOpenChange={onOpenChange}
      >
        <Menu.Item key="home" icon={<DashboardOutlined />}>
          <Link to="dashboard" style={{ textDecoration: "none" }}>Dashboard</Link>
        </Menu.Item>
        
        <Menu.SubMenu key="invoices" icon={<FileSearchOutlined />} title="Invoices">
          <Menu.Item key="view-invoices">
            <Link to="viewinvoices" style={{ textDecoration: "none" }}>View Invoices</Link>
          </Menu.Item>
          <Menu.Item key="view-archive-invoices">
            <Link to="viewarchiveinvoices" style={{ textDecoration: "none" }}>Archive Invoices</Link>
          </Menu.Item>
        </Menu.SubMenu>
        
        <Menu.SubMenu key="suppliers" icon={<ShopOutlined />} title="Suppliers">
          <Menu.Item key="add-supplier">
            <Link to="addsupplier" style={{ textDecoration: "none" }}>Add Supplier</Link>
          </Menu.Item>
          <Menu.Item key="supplier-requests">
            <Link to="supplierrequests" style={{ textDecoration: "none" }}>Outgoing Requests</Link>
          </Menu.Item>
        </Menu.SubMenu>
        
        <Menu.SubMenu key="analysis" icon={<LineChartOutlined />} title="Analysis">
          <Menu.Item key="product-analysis">
            <Link to="productanalysis" style={{ textDecoration: "none" }}>Product Analysis</Link>
          </Menu.Item>
          <Menu.Item key="supplier-compare-analysis">
            <Link to="suppliercompare" style={{ textDecoration: "none" }}>Supplier Compare</Link>
          </Menu.Item>
          <Menu.Item key="expenditure-analysis">
            <Link to="revenueanalysis" style={{ textDecoration: "none" }}>Expenditure Analysis</Link>
          </Menu.Item>
          <Menu.Item key="supplier-analysis">
            <Link to="supplieranalysis" style={{ textDecoration: "none" }}>Supplier Analysis</Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item key="chat" icon={<MessageOutlined />}>
          <Link to="chat" style={{ textDecoration: "none" }}>Chat</Link>
        </Menu.Item>
        
        <Menu.SubMenu key="account" icon={<UserOutlined />} title="Account">
          <Menu.Item key="edit-account">
            <Link to="accountsettings" style={{ textDecoration: "none" }}>Edit Account</Link>
          </Menu.Item>
        </Menu.SubMenu>
        
        <Menu.Item key="change-plan" icon={<ArrowUpOutlined />}>
          <Link to="changeplan" style={{ textDecoration: "none" }}>Upgrade</Link>
        </Menu.Item>
        
        <Menu.Item key="logout" icon={<LogoutOutlined />}>
          <Link to="logout" style={{ textDecoration: "none" }}>Logout</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default MenuList;
