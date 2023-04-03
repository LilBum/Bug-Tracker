import React, { useState } from 'react';
import './bugForm.css';
import BugModel from '../../../../Models/bugModel';

export default function BugForm(props) {
  const [bugObject, setBugObject] = useState(new BugModel(props.bug || {}));

  function inputChange(event) {
    setBugObject({
      ...bugObject,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const newBug = {
      name: bugObject.name,
      description: bugObject.description,
      steps: bugObject.steps,
      priority: bugObject.priority,
      assigned: bugObject.assigned,
      version: bugObject.version,
    };
    fetch('http://localhost:3500/api/bugs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBug),
    })
      .then((response) => response.json())
      .then((data) => {
        if (props.history) {
          props.history.push(`/bug/${data.id}`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className="bug-create">
      {props.title === 'Edit Bug' && (
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
          value={bugObject.priority || ''}
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
          value={bugObject.assigned || ''}
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
        <button type="submit">Submit Bug</button>
      </form>
    </div>
  );
}
