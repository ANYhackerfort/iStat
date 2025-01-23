import React from 'react';
import './mainGhost.css'; // Import the CSS file

interface GhostProps {
  xPos?: number;  // Optional props
  yPos?: number;  // Optional props
  visible: boolean; 
  content: React.ReactNode; // Pass the content to render in the ghost
}

const Ghost: React.FC<GhostProps> = ({ xPos = 0, yPos = 0, visible, content }) => {
  if (!visible) return null; // If not visible, don't render the component

  const ghostStyle: React.CSSProperties = {
    top: yPos,
    left: xPos,
    position: 'absolute',
    pointerEvents: 'none', // Correctly typed as 'none'
    opacity: 0.5, // Optional: Make it semi-transparent
    transform: 'translate(-50%, -50%)', // Center align
    zIndex: 1000, // Ensure it's on top of other elements
  };

  return (
    <div style={ghostStyle}>
      {content}
    </div>
  );
};

export default Ghost;
