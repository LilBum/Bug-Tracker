import React from 'react';
import './editPanel.css';
import { deleteBug } from '../../../../Controllers/Redux/bugSlice';

export default (props) => {
  return (
    <div className="edit-panel">
      <button onClick={props.editClicked}>Edit</button>
      <button onClick={props.deleteBug}>Delete</button>
    </div>
  );
};
