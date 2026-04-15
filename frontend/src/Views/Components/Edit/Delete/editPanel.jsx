import React from 'react';
import './editPanel.css';

function EditPanel(props) {
  return (
    <div className="edit-panel">
      <button onClick={props.editClicked}>Edit</button>
      <button onClick={props.deleteBug}>Delete</button>
    </div>
  );
}

export default EditPanel;
