import React from "react";
import './bugViewSection.css';

function BugViewSection(props) {
    return (
        <div className="view-section">
            <h2>{props.title}</h2>
            <p>{props.info}</p>
        </div>
    );
}

export default BugViewSection;
