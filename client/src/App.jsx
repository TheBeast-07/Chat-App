// React aur hooks import kar rahe hain
import React, { useEffect, useState } from 'react';
// Socket.IO client import
import io from 'socket.io-client';

// Backend server se socket connection establish kar rahe hain
const socket = io.connect('http://localhost:3001');

const App = () => {
  // Input message ke liye state
  const [message, setMessage] = useState('');
  // Chat messages ko store karne ke liye state
  const [chatLog, setChatLog] = useState([]);
  // Theme toggle (dark/light mode) ke liye state
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Form submit hone par message bhejne ka function
  const handleSubmit = (e) => {
    e.preventDefault(); // Page reload hone se rokti hai
    if (message.trim() !== '') {
      const newMsg = { message }; // Message object banaya
      socket.emit('send_message', newMsg); // Server ko message bheja
      setChatLog((prev) => [...prev, { message, from: 'You' }]); // Apne chat log mein message add kiya
      setMessage(''); // Input field reset
    }
  };

  // useEffect ka use backend se aane wale messages sunne ke liye
  useEffect(() => {
    // Jab server 'response_message' bhejta hai to usko receive karte hain
    socket.on('response_message', (data) => {
      setChatLog((prev) => [...prev, { message: data.message, from: 'Stranger' }]);
    });

    // Cleanup: Component unmount hone par listener remove
    return () => {
      socket.off('response_message');
    };
  }, []);

  // Light/Dark mode toggle karne ka function
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    // Main container with dynamic theme classes
    <div className={`min-vh-100 d-flex align-items-center justify-content-center ${isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <div className={`col-lg-5 col-md-8 col-sm-10 shadow-lg p-4 rounded-4 border ${isDarkMode ? 'bg-secondary' : 'bg-white'}`}>

        {/* Heading */}
        <h2 className="text-center mb-4 fw-bold" style={{ letterSpacing: '2px' }}>
          🚀 Real-Time Chat
        </h2>

        {/* Chat messages area */}
        <div
          className="mb-3 p-3 rounded overflow-auto"
          style={{
            height: '300px',
            backgroundColor: isDarkMode ? '#2a2a2a' : '#f7f7f7',
            border: '1px solid #444',
          }}
        >
          {/* Chat log show kar rahe hain */}
          {chatLog.map((entry, index) => (
            <div key={index} className={`mb-2 ${entry.from === 'You' ? 'text-end' : 'text-start'}`}>
              <span
                className={`badge px-4 py-2 rounded-pill fs-6`}
                style={{
                  backgroundColor: entry.from === 'You' ? '#007bff' : '#28a745',
                  color: 'white',
                }}
              >
                {entry.from}: {entry.message}
              </span>
            </div>
          ))}
        </div>

        {/* Form for typing and sending message */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="message" className="form-label">Enter Message</label>
            <input
              type="text"
              id="message"
              className={`form-control ${isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'} border-secondary shadow-sm rounded-3`}
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)} // Jab user input kare to state update
            />
          </div>

          {/* Send button */}
          <div className="d-grid">
            <button type="submit" className="btn btn-info text-dark rounded-pill shadow-sm">
              Send 💬
            </button>
          </div>
        </form>

        {/* Theme switch button */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary mt-4 w-100 rounded-pill"
          style={{ backgroundColor: isDarkMode ? '#6c757d' : '#343a40', color: isDarkMode ? 'white' : 'white' }}
        >
          Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
        </button>
        
      </div>
    </div>
  );
};

export default App;
