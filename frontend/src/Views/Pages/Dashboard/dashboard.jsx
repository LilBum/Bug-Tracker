import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBugs } from '../../../Controllers/Redux/bugSlice';
import Card from '../../Components/Dashboard/card';

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bugs = useSelector((state) => state.bugs.bugs);

  useEffect(() => {
    dispatch(fetchBugs());
  }, [dispatch]);

  function redirect() {
    navigate('/viewbugs');
  }

  function countByPriority(priority) {
    return bugs.filter((bug) => Number(bug.priority) === priority).length;
  }

  return (
    <div className="page-container">
      <Card priority="1" count={countByPriority(1)} clicked={redirect} />
      <Card priority="2" count={countByPriority(2)} clicked={redirect} />
      <Card priority="3" count={countByPriority(3)} clicked={redirect} />
    </div>
  );
}
