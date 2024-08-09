import React from "react";
import "./CollapsiableSection.css"

export default function CollapsibleSection(props: { title: string, children: React.ReactNode }) {
    const [
        isExpanded,
        setIsExpanded
    ] = React.useState(true);

    const ref= React.useRef<HTMLDivElement>(null);

    const handleToggle = (e:  React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        setIsExpanded(!isExpanded);

    };

    const classes = `list-group-item ${
        isExpanded ? "is-expanded" : null
    }`;
    return (
        <div className={classes}>
            <div className="card-title">
                <h2 onClick={handleToggle}>{props.title}</h2>
            </div>
            <div
                className="card-collapse"
                style={ isExpanded ? { height: "auto" } : { height: "0px" }}
            >
                <div className="card-body" ref={ref}>
                    {props.children}
                </div>
            </div>
        </div>
    );
}
