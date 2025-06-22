import React, { useState, useEffect, useRef } from "react";

function PlayerRoleControl({ room, socket }) {
  const savedNickname = localStorage.getItem("nickname");
  const [nickname, setNickname] = useState(savedNickname || "");
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef();

  const leaveRoom = () => {
    socket.disconnect();
    window.location.reload(); // თავიდან ტვირთავს თამაშს
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="player-role-control" ref={dropdownRef}>
      <button className="dropdown-button" onClick={() => setOpenDropdown(!openDropdown)}>
        👤 {nickname || "მოთამაშე"} ▾
      </button>

      {openDropdown && (
        <div className="dropdown-content">
          <button onClick={leaveRoom} className="leave-room-button">
            🚪 ოთახის დატოვება
          </button>
        </div>
      )}
    </div>
  );
}

export default PlayerRoleControl;
