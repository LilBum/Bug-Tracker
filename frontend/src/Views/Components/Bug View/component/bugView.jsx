import React, { useState, useEffect } from 'react';
import ViewSection from './bugViewSection';
import BugModel from '../../../../Models/bugModel';
import './bugView.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  markComplete,
  fetchBugs,
  selectBugs,
} from '../../../../Controllers/Redux/bugSlice';
import EditPanel from '../../Edit/Delete/editPanel';
import EditBug from '../../Bug Create/edit/bugForm';

export default (props) => {
  const dispatch = useDispatch();
  const bugs = useSelector(selectBugs);
  const [bug, setBug] = useState(null);
  const [displayEdit, setDisplayEdit] = useState(false);

  useEffect(() => {
    dispatch(fetchBugs()); // fetch all bugs and add them to the store
  }, [dispatch]);

  async function fetchBug(bugId) {
    try {
      const response = await fetch(`http://localhost:3500/api/bugs/${bugId}`);
      const data = await response.json();
      console.log(data); // log the data received
      setBug(new BugModel(data));
    } catch (error) {
      console.error(error); // log any errors that occur
    }
  }

  useEffect(() => {
    if (bugs.length > 0) {
      setBug(bugs[0]);
    }
  }, [bugs]);

  function handleBugClick(clickedBug) {
    fetchBug(clickedBug.id);
  }

  function editClicked() {
    setDisplayEdit(!displayEdit);
  }
  function deleteClicked() {}

  if (!bug) {
    return <div>Loading bug...</div>;
  }

  return (
    <>
      <div className="bug-view">
        <EditPanel editClicked={editClicked} deleteClicked={deleteClicked} />
        <button onClick={props.clicked} className="close-btn">
          Close
        </button>
        <h1>{bug.name}</h1>
        <ViewSection title="Details" info={bug.description} />
        <ViewSection title="Steps" info={bug.steps} />
        <ViewSection title="Priority" info={bug.priority} />
        <ViewSection title="Creator" info={bug.creator} />
        <ViewSection title="App Version" info={bug.version} />
        <ViewSection title="Time Created" info={bug.time} />
        <button
          onClick={() => {
            dispatch(markComplete(bug.id));
            fetchBug(bug.id);
          }}
        >
          Mark Complete
        </button>
      </div>
      {displayEdit && (
        <EditBug title="Edit Bug" bug={bug} close={editClicked} />
      )}
      <div className="bug-list">
        <h2>All Bugs</h2>
        <ul>
          {bugs.map((bug) => (
            <li key={bug.id}>
              <button onClick={() => handleBugClick(bug)}>{bug.id}</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
