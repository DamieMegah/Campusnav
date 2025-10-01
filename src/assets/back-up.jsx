import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseClient";
import "./LiveChat.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faUser, faUserSecret, faCamera } from "@fortawesome/free-solid-svg-icons";

export default function LiveChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [nickname, setNickname] = useState(""); // empty = anonymous
  const [pinned, setPinned] = useState(null);
  const stageRef = useRef(null);

  // ✅ Helper: attach icon depending on nickname
  const attachIcon = (msg) => ({
    ...msg,
    icon: msg.nickname && msg.nickname.trim() !== "" ? faUser : faUserSecret,
  });

  // 🚀 Load messages + subscribe to realtime
  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [...prev, attachIcon(payload.new)]);
          }
          if (payload.eventType === "DELETE") {
            setMessages((prev) => prev.filter((m) => m.id !== payload.old.id));
          }
          if (payload.eventType === "UPDATE") {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === payload.new.id ? attachIcon(payload.new) : m
              )
            );
            if (payload.new.pinned) setPinned(attachIcon(payload.new));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fetch initial messages
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error) {
      setMessages((data || []).map(attachIcon));
      const pinnedMsg = (data || []).find((m) => m.pinned);
      setPinned(pinnedMsg ? attachIcon(pinnedMsg) : null);
    } else {
      console.error("Fetch error:", error);
    }
  };

  //  Send new message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const { error } = await supabase.from("messages").insert([
      {
        text: input,
        nickname: nickname || "", // empty string = anonymous
        pinned: false,
      },
    ]);

    if (error) {
      console.error("Insert error:", error);
    }

    setInput("");
  };

  // 📌 Pin a message
  const pinMessage = async (id) => {
    await supabase.from("messages").update({ pinned: false }).eq("pinned", true);

    const { data, error } = await supabase
      .from("messages")
      .update({ pinned: true })
      .eq("id", id)
      .select("*")
      .single();

    if (!error) setPinned(attachIcon(data));
  };

  // 🔄 Auto-scroll when messages update
  useEffect(() => {
    if (stageRef.current) {
      stageRef.current.scrollTop = stageRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="lc-wrap">
      {/* 📌 Pinned bar */}
      {pinned && (
        <div className="lc-pinned">
          <span className="lc-pin-emoji" aria-hidden>
            📌
          </span>
          <span className="lc-pinned-text">
            <FontAwesomeIcon
              icon={pinned.icon}
              style={{ marginRight: "6px" }}
            />
            <strong>{pinned.nickname || "Anonymous"}:</strong> {pinned.text}
          </span>
        </div>
      )}

      {/* 💬 Messages stream */}
      <div className="lc-stage" ref={stageRef}>
        <div className="lc-stream">
          <AnimatePresence>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`lc-bubble ${m.nickname === nickname ? "mine" : ""}`}
              >
                <span className="lc-bubble-text">
                  <FontAwesomeIcon
                    icon={m.icon}
                    style={{ marginRight: "6px" }}
                  />
                  <strong>{m.nickname || "Anonymous"}:</strong> {m.text}
                </span>
                {!m.pinned && (
                  <button
                    onClick={() => pinMessage(m.id)}
                    className="lc-pin-btn"
                    title="Pin this message"
                  >
                    <i className="fa-solid fa-thumbtack"></i>
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ✍️ Input row */}
      <div className="lc-inputs">
        {/* Mode icon (dynamic) */}
        <span className="lc-mode-icons">
          <FontAwesomeIcon
            icon={nickname && nickname.trim() !== "" ? faUser : faUserSecret}
             className={nickname && nickname.trim() !== "" ? "user-mode" : "anon-mode"}
            title={nickname && nickname.trim() !== "" ? "User mode" : "Incognito mode"}
          />
        </span>
        <input
          placeholder="Anonymous"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="lc-input lc-input-nick"
        />
        <input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="lc-input lc-input-msg"
        />
         
        

         <span className="camera" style={{
               opacity: input.trim() === "" ? 1 : 0.2, // fade when typing
               transition: "all 0.3s",
               pointerEvents: input.trim() === "" ? "auto" : "none", 
                }}>
               <FontAwesomeIcon  icon={faCamera} />
         </span>


         
        <button onClick={sendMessage}
         className="lc-send"
         style={{
          background: input.trim() === "" ? "transparent" : '#1d4ed8',
          animation: input.trim() === "" ? "none" : "fa-shake 0.5s infinite",
         }}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
}
