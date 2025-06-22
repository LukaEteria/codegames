import React, { useState } from "react";

function PlayerDropdown({ room }) {
  const [open, setOpen] = useState(false);
  const toggleDropdown = () => setOpen(!open);

  const playerCount = room?.players?.length || 0;
  const roomLink = `${window.location.origin}?room=${room?.id || ""}`;
  const roomId = room?.id || "";

  const copyToClipboard = async (text, label = "დაკოპირდა!") => {
    try {
      await navigator.clipboard.writeText(text);
      alert(label);
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
          {/* Room link */}
          <label htmlFor="room-link" className="link-title">ოთახის ლინკი:</label>
          <div className="copy-box">
            <input
              id="room-link"
              className="room-link-input"
              type="text"
              value={roomLink}
              readOnly
            />
            <button className="copy-button" onClick={() => copyToClipboard(roomLink, "ლინკი დაკოპირდა!")}>
              📋
            </button>
          </div>

          {/* Room ID */}
          <label htmlFor="room-id" className="link-title">ოთახის ID:</label>
          <div className="copy-box">
            <input
              id="room-id"
              className="room-link-input"
              type="text"
              value={roomId}
              readOnly
            />
            <button className="copy-button" onClick={() => copyToClipboard(roomId, "ID დაკოპირდა!")}>
              📋
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayerDropdown;
