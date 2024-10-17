import React from 'react';
import './mainGhost.css'; // Import the CSS file

interface GhostProps {
  xPos?: number;  // Optional props
  yPos?: number;  // Optional props
  visible: boolean; 
}

const Ghost: React.FC<GhostProps> = ({ xPos = 0, yPos = 0, visible }) => {
  if (!visible) return null; // If not visible, don't render the component
  const ghostStyle = {
    top: yPos - 25,  // Subtract half the height
    left: xPos - 25, // Subtract half the width
  };

  return <div className="ghost" style={ghostStyle}></div>;
};

export default Ghost;