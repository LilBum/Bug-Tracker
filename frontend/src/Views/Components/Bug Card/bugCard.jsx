import React from "react";
import PriorityController from "../../../Controllers/Redux/priorityController";
import "./bugCard.css";


export default (props) => {
    const { name, priority, version } = props.bug;
    const { level, color } = PriorityController(priority);

    function bugClicked() {
        props.clicked(name);
    }

    return (
        <div className="bug-card" onClick={bugClicked} style={{ color: color }}>
            <h2 className="name">{name}</h2>
            <h4 className="priority">Priority: {level}</h4>
            <h5 className="version">Version: {version}</h5>
        </div>
    );
};
