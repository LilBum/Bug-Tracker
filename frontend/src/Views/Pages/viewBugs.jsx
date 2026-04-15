import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBugs } from '../../Controllers/Redux/bugSlice';
import BugCard from '../Components/Bug Card/bugCard';
import BugView from '../Components/Bug View/component/bugView';

export default function BugsPage() {
  const [selectedBugId, setSelectedBugId] = useState(null);
  const dispatch = useDispatch();
  const { bugs, loading, error } = useSelector((state) => state.bugs);
  const selectedBug = bugs.find((bug) => bug._id === selectedBugId);

  useEffect(() => {
    dispatch(fetchBugs());
  }, [dispatch]);

  function bugClicked(id) {
    setSelectedBugId((currentId) => (currentId === id ? null : id));
  }

  return (
    <div className="page-container">
      {loading && <p>Loading bugs...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && bugs.length === 0 && <p>No bugs found.</p>}

      {bugs.map((bug) => (
        <BugCard key={bug._id} bug={bug} clicked={() => bugClicked(bug._id)} />
      ))}

      {selectedBug && (
        <BugView
          clicked={() => setSelectedBugId(null)}
          bug={selectedBug}
          onDeleted={() => setSelectedBugId(null)}
        />
      )}
    </div>
  );
}
