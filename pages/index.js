import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export default function Home() {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [partner, setPartner] = useState(null);

  useEffect(() => {
    if (!socket) return;

    // Event listener for when a partner is found
    const handlePartnerFound = ({ partner }) => {
      setPartner(partner);
    };

    // Event listener for incoming messages
    const handleMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    // Event listener for partner disconnection
    const handlePartnerDisconnected = () => {
      setPartner(null);
      setMessages((prev) => [
        ...prev,
        { text: "Your partner has disconnected.", self: false },
      ]);
    };

    // Attach event listeners
    socket.on("partner_found", handlePartnerFound);
    socket.on("message", handleMessage);
    socket.on("partner_disconnected", handlePartnerDisconnected);

    // Cleanup event listeners on unmount
    return () => {
      socket.off("partner_found", handlePartnerFound);
      socket.off("message", handleMessage);
      socket.off("partner_disconnected", handlePartnerDisconnected);
    };
  }, [socket]);

  const sendMessage = () => {
    if (socket && input) {
      socket.emit("message", { text: input });
      setMessages((prev) => [...prev, { text: input, self: true }]);
      setInput("");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Omegle Chatroom</h1>
      {partner ? (
        <div>
          <div className="messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${
                  msg.self ? "text-right" : "text-left"
                } border p-2`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="border p-2 w-full"
            placeholder="Type a message..."
          />
        </div>
      ) : (
        <button
          onClick={() => socket.emit("find_partner")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Find a Partner
        </button>
      )}
    </div>
  );
}