import React, { useState } from "react";

function PlayerDropdown({ room }) {
  const [open, setOpen] = useState(false);
  const toggleDropdown = () => setOpen(!open);

  const playerCount = room?.players?.length || 0;
  const roomLink = `${window.location.origin}?room=${room?.id || ""}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomLink);
      alert("ლინკი დაკოპირდა!");
    } catch (err) {
      alert("დაკოპირების შეცდომა");
    }
  };

  return (
    <div className="dropdown-container">
      <button className="dropdown-button" onClick={toggleDropdown}>
        მოთამაშეები ({playerCount})
      </button>

      {open && (
        <div className="dropdown-menu">
          <label htmlFor="room-link" className="link-title">ოთახის ლინკი:</label>
          <input
            id="room-link"
            className="room-link-input"
            type="text"
            value={roomLink}
            readOnly
          />
          <button className="copy-button" onClick={copyToClipboard}>
            ლინკის კოპირება
          </button>
        </div>
      )}
    </div>
  );
}

export default PlayerDropdown;
