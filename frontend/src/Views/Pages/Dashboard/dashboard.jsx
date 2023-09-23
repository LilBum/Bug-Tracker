import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../Components/Dashboard/card';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBugs } from '../../../Controllers/Redux/bugSlice';

export default () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bugs = useSelector((state) => state.bugs.bugs);
  const [highCount, setHighCount] = useState(0);
  const [midCount, setMidCount] = useState(0);
  const [lowCount, setLowCount] = useState(0);

  useEffect(() => {
    dispatch(fetchBugs());
  }, []);

  useEffect(() => {
    if (bugs) {
      const highPriorityBugs = filterBugs(1);
      const midPriorityBugs = filterBugs(2);
      const lowPriorityBugs = filterBugs(3);

      setHighCount(highPriorityBugs.length);
      setMidCount(midPriorityBugs.length);
      setLowCount(lowPriorityBugs.length);
    }
  }, [bugs]);

  function redirect() {
    navigate('/viewbugs');
  }

  function filterBugs(priority) {
    if (bugs) {
      return bugs.filter((bug) => bug.priority === priority);
    } else {
      return [];
    }
  }

  return (
    <div className="page-container">
      <Card priority="1" count={highCount} clicked={redirect} />
      <Card priority="2" count={midCount} clicked={redirect} />
      <Card priority="3" count={lowCount} clicked={redirect} />
    </div>
  );
};
