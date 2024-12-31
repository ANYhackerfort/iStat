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

    const onDragStart = (event: React.DragEvent<HTMLImageElement>) => {
        event.preventDefault(); // Disable dragging the image
    };

    return (
        <div>
            <div className="data-block-icon" onMouseDown={onMouseDown}>
                {imageSrc && <img src={imageSrc} alt="Icon" className="data-block-icon-image" onDragStart={onDragStart} />}
            </div>
        </div>
        
    );
};

export default MainBlockIcon;