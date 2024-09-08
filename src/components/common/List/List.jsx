import React from 'react';
import PropTypes from 'prop-types';
import img1 from '../../../assets/image.png';

const List = ({ text }) => {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="w-3 h-3">
        <img
          src={img1} 
          alt="tick mark"
          className="w-full h-full"
        />
      </div>
      <div>{text}</div>
    </div>
  );
};

List.propTypes = {
  text: PropTypes.string.isRequired,
};

export default List;
