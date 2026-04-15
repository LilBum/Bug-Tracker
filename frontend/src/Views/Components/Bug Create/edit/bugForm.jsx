import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBug, updateBug } from '../../../../Controllers/Redux/bugSlice';
import BugModel from '../../../../Models/bugModel';
import './bugForm.css';

const emptyBug = new BugModel({
  priority: 2,
  assigned: 'Alex Urs-Badet',
  version: '1.0.0',
});

export default function BugForm(props) {
  const dispatch = useDispatch();
  const isEditing = Boolean(props.bug?._id);
  const [bugObject, setBugObject] = useState(
    new BugModel(props.bug || emptyBug)
  );
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  function inputChange(event) {
    setSaved(false);
    setBugObject({
      ...bugObject,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSaved(false);

    const bug = {
      name: bugObject.name,
      description: bugObject.description,
      steps: bugObject.steps,
      priority: Number(bugObject.priority),
      assigned: bugObject.assigned,
      version: bugObject.version,
      creator: bugObject.creator || 'Alex Urs-Badet',
    };

    try {
      if (isEditing) {
        await dispatch(updateBug({ id: bugObject._id, bug })).unwrap();
        props.close?.();
      } else {
        await dispatch(createBug(bug)).unwrap();
        setBugObject(new BugModel(emptyBug));
        setSaved(true);
      }
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <div className={`bug-create${isEditing ? ' bug-create--modal' : ''}`}>
      {isEditing && (
        <button className="close-btn" onClick={props.close}>
          Close
        </button>
      )}
      <h1>{props.title}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name: </label>
        <input
          id="name"
          name="name"
          placeholder="Bug name"
          required
          onChange={inputChange}
          value={bugObject.name || ''}
        />
        <label htmlFor="description">Description: </label>
        <textarea
          id="description"
          name="description"
          placeholder="Detailed description on the bug"
          required
          onChange={inputChange}
          value={bugObject.description || ''}
        />
        <label htmlFor="steps">Steps: </label>
        <textarea
          id="steps"
          name="steps"
          placeholder="Steps to recreate the bug"
          required
          onChange={inputChange}
          value={bugObject.steps || ''}
        />
        <label htmlFor="priority">Priority: </label>
        <select
          id="priority"
          name="priority"
          required
          onChange={inputChange}
          value={bugObject.priority || 2}
        >
          <option value={1}>High</option>
          <option value={2}>Medium</option>
          <option value={3}>Low</option>
        </select>
        <label htmlFor="assigned">Assigned: </label>
        <select
          id="assigned"
          name="assigned"
          required
          onChange={inputChange}
          value={bugObject.assigned || 'Alex Urs-Badet'}
        >
          <option value="Alex Urs-Badet">Alex Urs-Badet</option>
        </select>
        <label htmlFor="version">Application Version: </label>
        <input
          id="version"
          name="version"
          placeholder="Application Version"
          required
          onChange={inputChange}
          value={bugObject.version || ''}
        />
        {error && <p className="form-error">{error}</p>}
        {saved && <p className="form-success">Bug saved.</p>}
        <button type="submit">{isEditing ? 'Save Bug' : 'Submit Bug'}</button>
      </form>
    </div>
  );
}
