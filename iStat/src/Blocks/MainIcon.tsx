import React from "react";
import './MainIcon.css';

interface MainBlockIconProps {
    text: string;
    id: string;
    handleMouseDownIcon: (id: string, event: React.MouseEvent<HTMLDivElement>) => void;
}

const MainBlockIcon: React.FC<MainBlockIconProps> = ({ text, id, handleMouseDownIcon }) => {

    const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        handleMouseDownIcon(id, event);
    };

    return (
        <div className="main-block-icon" onMouseDown={onMouseDown}>
            {text}
        </div>
    );
};

export default MainBlockIcon;
