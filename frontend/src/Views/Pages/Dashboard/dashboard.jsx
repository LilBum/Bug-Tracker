import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../Components/Dashboard/card";
import { useDispatch, useSelector } from "react-redux";
import { fetchBugs } from "../../../Controllers/Redux/bugSlice";



export default () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const bugs = useSelector(state => state.bugs.bugs);
    let highCount = 0;
    let midCount = 0;
    let lowCount = 0;

    function redirect() {
        navigate("/viewbugs");
    }

    function filterBugs(priority) {
        if (bugs) {
          return bugs.filter((bug) => bug.priority === priority);
        } else {
          return [];
        }
      }
      
      highCount = filterBugs(1);
      midCount = filterBugs(2);
      lowCount = filterBugs(3);

    return (
        <div className="page-container">
            <Card priority="1" count={highCount.length} clicked={redirect} />
            <Card priority="2" count={midCount.length} clicked={redirect} />
            <Card priority="3" count={lowCount.length} clicked={redirect} />
        </div>
    );
};
