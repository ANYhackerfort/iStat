import React, { useState } from 'react';
import './Dropdown.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

interface DropdownProps {
    label: string;
    children: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ label, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="dropdown">
            <button className="dropdown-button" onClick={toggleDropdown}>
                {label}
            </button>
            {isOpen && <div className="dropdown-menu">{children}</div>}
        </div>
    );
};

export default Dropdown;