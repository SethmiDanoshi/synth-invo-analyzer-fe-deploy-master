import React from 'react';
import PropTypes from 'prop-types';
import UseAuthCheck from '../UseAuthCheck/UseAuthCheck';

const SupplierAuthorization = ({ children }) => {
  const tokenValid = UseAuthCheck('https://synthinvoice.azurewebsites.net/auth/supplier/protected/', '/supplier/signin');

  if (!tokenValid) {
    return null;
  }
  return <>{children}</>;
};

SupplierAuthorization.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SupplierAuthorization;
