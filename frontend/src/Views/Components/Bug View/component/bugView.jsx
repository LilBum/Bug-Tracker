import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { completeBug, deleteBug } from '../../../../Controllers/Redux/bugSlice';
import EditBug from '../../Bug Create/edit/bugForm';
import EditPanel from '../../Edit/Delete/editPanel';
import ViewSection from './bugViewSection';
import './bugView.css';

export default function BugView(props) {
  const dispatch = useDispatch();
  const [displayEdit, setDisplayEdit] = useState(false);
  const [error, setError] = useState(null);
  const { bug } = props;

  function editClicked() {
    setDisplayEdit(!displayEdit);
  }

  async function handleDelete() {
    setError(null);

    try {
      await dispatch(deleteBug(bug._id)).unwrap();
      props.onDeleted?.();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  async function handleComplete() {
    setError(null);

    try {
      await dispatch(completeBug(bug._id)).unwrap();
    } catch (completeError) {
      setError(completeError.message);
    }
  }

  if (!bug) {
    return <div>Loading bug...</div>;
  }

  return (
    <>
      <div className="bug-view">
        <EditPanel editClicked={editClicked} deleteBug={handleDelete} />
        <button onClick={props.clicked} className="close-btn">
          Close
        </button>
        <h1>{bug.name}</h1>
        {error && <p>{error}</p>}
        <ViewSection title="Details" info={bug.description} />
        <ViewSection title="Id" info={bug._id} />
        <ViewSection title="Steps" info={bug.steps} />
        <ViewSection title="Priority" info={bug.priority} />
        <ViewSection title="Assigned" info={bug.assigned} />
        <ViewSection title="Creator" info={bug.creator} />
        <ViewSection title="App Version" info={bug.version} />
        <ViewSection
          title="Time Created"
          info={bug.createdAt ? new Date(bug.createdAt).toLocaleString() : ''}
        />
        <ViewSection title="Completed" info={bug.completed ? 'Yes' : 'No'} />
        {!bug.completed && (
          <button className="mark-complete" onClick={handleComplete}>
            Mark Complete
          </button>
        )}
      </div>
      {displayEdit && (
        <EditBug key={bug._id} title="Edit Bug" bug={bug} close={editClicked} />
      )}
    </>
  );
}
