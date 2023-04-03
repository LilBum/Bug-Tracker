import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBugs } from '../../Controllers/Redux/bugSlice';
import BugCard from '../Components//Bug Card/bugCard';
import BugView from '../Components/Bug View/component/bugView';

export default function BugsPage() {
  const [displayedBugs, setDisplayedBugs] = useState([]);
  const dispatch = useDispatch();
  const bugs = useSelector((state) => state.bugs.bugs) || [];

  useEffect(() => {
    dispatch(fetchBugs());
  }, [bugs.length]);

  function bugClicked(name) {
    setDisplayedBugs((prevState) => {
      const index = prevState.findIndex((bug) => bug.name === name);
      if (index === -1) {
        // add bug to the displayed bugs list
        return [...prevState, { name }];
      } else {
        // remove bug from the displayed bugs list
        const newDisplayedBugs = [...prevState];
        newDisplayedBugs.splice(index, 1);
        return newDisplayedBugs;
      }
    });
  }

  return (
    <div className="page-container">
      {bugs.map((bug, key) => (
        <BugCard key={key} bug={bug} clicked={bugClicked} />
      ))}
      {displayedBugs.map((displayedBug) => (
        <BugView
          key={displayedBug.name}
          clicked={() => bugClicked(displayedBug.name)}
          bug={bugs.find((bug) => bug.name === displayedBug.name)}
        />
      ))}
    </div>
  );
}
