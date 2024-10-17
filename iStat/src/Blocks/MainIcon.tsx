import React from "react";
import './MainIcon.css'

interface MainBlockIconProps {
    imageSrc: string;
    id: string;
    handleMouseDownIcon: (id: string, event: React.MouseEvent<HTMLDivElement>) => void;
}

const MainBlockIcon: React.FC<MainBlockIconProps> = ({ imageSrc, id, handleMouseDownIcon }) => {

    const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        handleMouseDownIcon(id, event);
    };

    return (
        <div className="data-block-icon" onMouseDown={onMouseDown}>
            {imageSrc && <img src={imageSrc} alt="Icon" className="data-block-icon-image" />}
        </div>
    );
};

export default MainBlockIcon;