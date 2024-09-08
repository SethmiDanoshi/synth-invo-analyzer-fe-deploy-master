import React from 'react';
import PropTypes from 'prop-types';
import UseAuthCheck from '../UseAuthCheck/UseAuthCheck';

const OrganizationAuthorization = ({ children }) => {
  const tokenValid = UseAuthCheck('https://synthinvoice.azurewebsites.net/auth/organization/protected/', '/organization/signin');

  if (!tokenValid) {
    return null;
  }
  return <>{children}</>;
};

OrganizationAuthorization.propTypes = {
  children: PropTypes.node.isRequired,
};

export default OrganizationAuthorization;
