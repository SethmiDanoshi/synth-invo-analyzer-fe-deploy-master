import React from 'react';
import PropTypes from 'prop-types';
import { MenuOutlined } from '@ant-design/icons';
import './logo.css';

const Logo = ({ toggleCollapsed, collapsed }) => {
  console.log('collapsed', collapsed);
  return (
    <div className='logo' onClick={toggleCollapsed}>
      <div className='logo-icon'>
        <MenuOutlined />
      </div>
    </div>
  );
};

Logo.propTypes = {
  toggleCollapsed: PropTypes.func.isRequired,
  collapsed: PropTypes.bool,
};

export default Logo;
