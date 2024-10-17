import React from 'react';
import './Edge.css';

interface Position {
    x: number;
    y: number;
}

interface Props {
    start: Position;
    end: Position;
}

const LineComponent: React.FC<Props> = ({ start, end }) => {
    // SVG Path for a straight line
    const pathData = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;

    return (
      <svg className="line-svg">
        <path className="line-path" d={pathData} />
      </svg>
    );
};

export default LineComponent;