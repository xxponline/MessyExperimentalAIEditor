import React from "react";
import "./CollapsiableSection.css"

export default function CollapsibleSection(props: { title: string, children: React.ReactNode }) {
    const [
        isExpanded,
        setIsExpanded
    ] = React.useState(false);

    const ref= React.useRef<HTMLDivElement>(null);
    const [height, setHeight] = React.useState(0);

    const handleToggle = (e:  React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        setIsExpanded(!isExpanded);
        setHeight(ref.current!.clientHeight);
    };

    const classes = `list-group-item ${
        isExpanded ? "is-expanded" : null
    }`;
    const currentHeight = isExpanded ? height : 0;
    return (
        <div className={classes}>
            <div className="card-title">
                <h2 onClick={handleToggle}>{props.title}</h2>
            </div>
            <div
                className="card-collapse"
                style={{ height: currentHeight + "px" }}
            >
                <div className="card-body" ref={ref}>
                    {props.children}
                </div>
            </div>
        </div>
    );
}
