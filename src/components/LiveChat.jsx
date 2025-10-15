// ==========================
// Import React core functions
// ==========================
import React, { useState, useEffect, useRef } from "react";


// ==========================
// Animation library (Framer Motion)
// ==========================
import { motion, AnimatePresence } from "framer-motion";

//===========================
//Import use navigate
//===========================
import { useNavigate, useLocation } from "react-router-dom";
import { useAppState } from '../context/StateContext';

// ==========================
// Supabase client (your backend)
// ==========================
import { supabase } from "../supabaseClient";

// ==========================
// Stylesheet
// ==========================
import "./LiveChat.css";

//==========================
// Import Warning
//=========================
import TopMarquee from './TopMarquee';

// ==========================
// FontAwesome icons
// ==========================

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faUser,
  faUserSecret,
  faCamera,
  faHeart,
  faHeart as solidHeart,
  faHeart as regularHeart,
  faTrash,
  faPhotoVideo,
  faComment,
} from "@fortawesome/free-solid-svg-icons";

// ============================================================
// 🔹 New Logic: Generate persistent userId per browser/device
// ============================================================

// Creates a strong random ID; falls back if crypto not available
const createUserId = () => {
  try {
    const buf = new Uint8Array(16);
    crypto.getRandomValues(buf);
    return (
      "user-" +
      Array.from(buf)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
        .slice(0, 12)
    );
  } catch {
    return "user-" + Math.random().toString(36).slice(2, 14);
  }
};

// Ensures userId exists and persists in localStorage
const ensureUserId = () => {
  if (typeof window === "undefined") return null;
  let id = localStorage.getItem("userId");
  if (!id) {
    id = createUserId();
    localStorage.setItem("userId", id);
  }
  return id;
};

// ============================================================
// LiveChat Component
// ============================================================
export default function LiveChat() {

  //=====================
  //Navigation hook
  //=====================
  const navigate = useNavigate();
  const location = useLocation();
 
  const [chatLoaded, setChatLoaded] = useState(false);
  const stageRef = useRef(null);

  // ==========================================
  // Chat States
  // ==========================================
  const [userId, setUserId] = useState(null);
 const [messages, setMessages] = useState([]);; 
   // fallback in case context didn’t load yet
  const safeMessages = messages || [];
  // ✅ Guard against undefined
  if (!safeMessages) {
    return <p className="text-center text-gray-500">Loading chat...</p>;
  }

  const [pinned, setPinned] = useState(null);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [pendingUploads, setPendingUploads] = useState([]);
  const [pendingDownloads, setPendingDownloads] = useState([]);
  const [viewer, setViewer] = useState(null);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [activeMessageId, setActiveMessageId] = useState(null);

  const { chatState, setChatState } = useAppState();

// these extract the current values from context
const { nickname, input, replyTo } = chatState;

// these functions update just one field at a time
const setNickname = (val) =>
  setChatState(prev => ({ ...prev, nickname: val }));

const setInput = (val) =>
  setChatState(prev => ({ ...prev, input: val }));

const setReplyTo = (val) =>
  setChatState(prev => ({ ...prev, replyTo: val }));



  // Ensures a user ID exists when the component mounts
  useEffect(() => {
    setUserId(ensureUserId());
  }, []);


  //===============================
 // REPLY HANDLER
 const handleReplyClick = (msg) => {
  setReplyTo(msg);
};



  // Handles incoming shared locations from navigation state
 // Handles incoming shared locations from navigation state
useEffect(() => {
  // Check if a pending message exists in the navigation state
  if (location.state?.pendingMessage) {
    const { pendingMessage } = location.state;
    // Construct the message text
    const text = pendingMessage.hallCode
      ? `Location: ${pendingMessage.hallName} /hall/${pendingMessage.hallCode}`
      : pendingMessage.text;
    
    // Set the input state with the new text
    setInput(text);
    
    // Clear the navigation state after setting the input
    window.history.replaceState({}, document.title);
  }
}, [location.state]); // Depend on location.state
  
  // ============================================================
  // Message Rendering Logic
  // ============================================================

  // Helper to render hall codes as clickable links
 // Helper to render hall codes as clickable links
function renderMessageText(text) {
  if (typeof text !== 'string') return text;
  const hallRegex = /(?:\/hall\/)?([A-Z]{2,}\d{2,}|[A-Z]{2,}-[A-Z]{2,})/;

  return text.split(/(\s+)/).map((word, i) => {
    if (hallRegex.test(word)) {
      const hallCode = word.match(hallRegex)[1];
      return (
        <span
          key={i}
          className="hall-link"
          onClick={() => {
            navigate(`/hall/${hallCode}`);
          }}
        >
          {word}
        </span>
      );
    }
    return word;
  });
}
  // Helper to render hashtags as clickable links
  function renderWithHashtags(text) {
    if (typeof text !== 'string') return text; // Pass through if not a string
    const hashtagRegex = /(\#[a-zA-Z0-9_]+)/g;
    return text.split(hashtagRegex).map((part, i) => {
      if (part.startsWith("#")) {
        return (
          <span
            key={i}
            className="lc-hashtag"
            onClick={() => {
              // Add navigation or filtering logic for hashtags here
              console.log("Navigating to trend:", part);
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  }

  // Function to apply both rendering functions
  const renderMessageContent = (text) => {
    const partsWithHashtags = renderWithHashtags(text);
    return partsWithHashtags.map((part, i) => (
      <React.Fragment key={i}>
        {renderMessageText(part)}
      </React.Fragment>
    ));
  };

  
  // ============================================================
  // Handle Media Download (with messageId tracking)
  // ============================================================
  const handleDownload = async (media, messageId) => {
    setPendingDownloads((prev) => [
      ...prev,
      { id: media.id, messageId, status: "pending", mime: media.mime },
    ]);

    try {
      const response = await fetch(media.url);
      await response.blob(); // simulate actual download

      setPendingDownloads((prev) =>
        prev.map((d) =>
          d.id === media.id ? { ...d, status: "done" } : d
        )
      );
    } catch (error) {
      console.error("Download failed", error);
      setPendingDownloads((prev) =>
        prev.map((d) =>
          d.id === media.id ? { ...d, status: "error" } : d
        )
      );
    }
  };



  // ============================================================
  // Data Fetching and Realtime Subscriptions
  // ============================================================
  const fetchMessages = async () => {
    try {
      const { data: messages, error: msgErr } = await supabase
        .from("messages")
        .select(`
          id, text, nickname, user_id, pinned, created_at, reply_to,
          message_media(*), message_likes ( user_id )
        `)
        .order("created_at", { ascending: true });
      if (msgErr) throw msgErr;

      const mapped = messages.map((m) => {
        let reply = null;
        if (m.reply_to) {
          const parent = messages.find((x) => x.id === m.reply_to);
          if (parent) {
            reply = {
              text: parent.text,
              nickname: parent.nickname,
            };
          }
        }
        return {
          ...m,
          icon: m.nickname && m.nickname.trim() !== "" ? faUser : faUserSecret,
          reply_to_user: reply?.nickname,
          reply_to_text: reply?.text,
          likes_count: m.message_likes?.length || 0,
        };
      });

      setMessages(mapped);
      setPinned(mapped.find((x) => x.pinned) || null);
    } catch (e) {
      console.error("fetchMessages error:", e);
    }
  };
useEffect(() => {
  fetchMessages();

  const messagesChannel = supabase
    .channel("realtime-messages")
    .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => fetchMessages())
    .subscribe();

  const likesChannel = supabase
    .channel("realtime-message-likes")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "message_likes" }, (payload) => {
      const { message_id, user_id } = payload.new;

      // Floating heart animation for other users
      if (user_id !== userId) {
        const id = Date.now();
        setFloatingHearts((prev) => [...prev, { id, messageId: message_id }]);
        setTimeout(() => setFloatingHearts((prev) => prev.filter((h) => h.id !== id)), 2000);
      }

      // ✅ Update likes locally (no refetch)
      setMessages((prev) =>
        prev.map((m) =>
          m.id === message_id ? { ...m, likes_count: (m.likes_count || 0) + 1 } : m
        )
      );
    })
    .on("postgres_changes", { event: "DELETE", schema: "public", table: "message_likes" }, (payload) => {
      const { message_id } = payload.old;

      // ✅ Decrement likes locally
      setMessages((prev) =>
        prev.map((m) =>
          m.id === message_id ? { ...m, likes_count: Math.max((m.likes_count || 1) - 1, 0) } : m
        )
      );
    })
    .subscribe();

  return () => {
    supabase.removeChannel(messagesChannel);
    supabase.removeChannel(likesChannel);
  };
}, []);

  // ============================================================
  // Actions: Send, Delete, Pin, Like
  // ============================================================
const sendMessage = async () => {
  // Prevent sending empty messages without files
  if (!input.trim() && uploadFiles.length === 0) return;
  if (!userId) return; // Wait until userId is ready

  try {
    // Insert new message
    const { data: inserted, error: insertErr } = await supabase
      .from("messages")
      .insert([
        {
          text: input || null,
          nickname: nickname || "",        // Display name
          user_id: userId,                 // Permanent owner
          pinned: false,
          reply_to: replyTo ? replyTo.id : null, // Store reply reference
        },
      ])
      .select()
      .single();
    if (insertErr) throw insertErr;

    const messageId = inserted.id;

    // Prepare pending uploads
    const pending = uploadFiles.map((f) => ({
      id: `${Date.now()}-${f.name}`,
      file: f,
      mime: f.type,
      status: "pending",
      url: URL.createObjectURL(f),
      messageId,
    }));
    setPendingUploads((prev) => [...prev, ...pending]);

    // Upload files sequentially
    for (const pendingFile of pending) {
      try {
        const cleanName = pendingFile.file.name.replace(/\s+/g, "_");
        const path = `${messageId}/${Date.now()}_${cleanName}`;

        const { error: upErr } = await supabase.storage
          .from("media")
          .upload(path, pendingFile.file);
        if (upErr) throw upErr;

        const { data: publicData } = supabase.storage
          .from("media")
          .getPublicUrl(path);
        const publicUrl = publicData?.publicUrl ?? null;

        await supabase.from("message_media").insert({
          message_id: messageId,
          storage_path: path,
          file_name: pendingFile.file.name,
          mime: pendingFile.mime,
          size: pendingFile.file.size,
          url: publicUrl,
        });

        // Remove from pending after successful upload
        setPendingUploads((prev) =>
          prev.filter((p) => p.id !== pendingFile.id)
        );
      } catch (err) {
        console.error("Upload failed:", err);
        // Mark this file as error
        setPendingUploads((prev) =>
          prev.map((p) =>
            p.id === pendingFile.id ? { ...p, status: "error" } : p
          )
        );
      }
    }

    // Reset states
    setInput("");
    setUploadFiles([]);
    setReplyTo(null); // Clear reply state
    fetchMessages();  // Refresh messages
  } catch (e) {
    console.error("sendMessage error:", e);
    alert("check your connection");
  }
};

const deleteMessage = async (msg) => {
    try {
      if (!isMine(msg)) {
        alert("You can only delete your own messages!");
        return;
      }

     if (msg.message_media && msg.message_media.length > 0) {
     const paths = msg.message_media.map((m) => m.storage_path);
      await supabase.storage.from("media").remove(paths);
       }


      await supabase.from("messages").delete().eq("id", msg.id);
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
    } catch (e) {
      console.error("deleteMessage error:", e);
    }
  };

  const togglePinMessage = async (id, currentlyPinned) => {
    try {
      if (currentlyPinned) {
        await supabase.from("messages").update({ pinned: false }).eq("id", id);
      } else {
        await supabase.from("messages").update({ pinned: false }).eq("pinned", true);
        await supabase.from("messages").update({ pinned: true }).eq("id", id);
      }
    } catch (e) {
      console.error("togglePinMessage error:", e);
    }
  };

  const toggleLike = async (messageId) => {
    if (!userId) return;
    try {
      const { data: existing } = await supabase
        .from('message_likes')
        .select('id')
        .eq('message_id', messageId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        await supabase.from('message_likes').delete().eq('id', existing.id);
      } else {
        await supabase.from('message_likes').insert([{ message_id: messageId, user_id: userId }]);
      }
    } catch (e) {
      console.error('toggleLike error:', e);
    }
  };

  // ============================================================
  // UI Helpers
  // ============================================================
  const isMine = (msg) => msg.user_id === userId;
  const getColorForName = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue},70%,50%)`;
  };

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (stageRef.current) stageRef.current.scrollTop = stageRef.current.scrollHeight;
  }, [messages, pendingUploads]);

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="lc-wrap">
       <TopMarquee />
      {/* Pinned Message */}
      {pinned && (
        <div className="lc-pinned">
          <span className="lc-pinned-text">
            <FontAwesomeIcon icon={pinned.icon} style={{ marginRight: 6 }} />
            <strong>{pinned.nickname || "Anonymous"}:</strong> {pinned.text}
          </span>
          <span
            className="lc-pin-emoji"
            onClick={() => togglePinMessage(pinned.id, true)}
            title="Unpin message"
          >
            📌
          </span>
        </div>
      )}

      {/* Chat Stage */}
      <div className="lc-stage" ref={stageRef}>
  <div className="lc-stream">
    <AnimatePresence>
      {!Array.isArray(messages) ? (
        <p className="text-center text-gray-500">Loading chat...</p>
      ) : messages.length === 0 ? (
        <p className="text-center text-gray-400">No messages yet. Start the conversation!</p>
      ) : (
        messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`lc-bubble ${isMine(m) ? "mine" : ""}`}
            onClick={() => setActiveMessageId(m.id)}
          >
            <div
              className="lc-bubble-text"
              key={m.id}
              id={`message-${m.id}`}
              onClick={() => setActiveMessageId(m.id)}
            >
              {m.reply_to && (
                <div
                  className="lc-reply-quote"
                  onClick={() => {
                    const element = document.getElementById(`message-${m.reply_to}`);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  <strong style={{ color: getColorForName(m.nickname || "Anonymous") }}>
                    {m.reply_to_user || "Anonymous"}:
                  </strong>{" "}
                  {m.reply_to_text}
                </div>
              )}

              <div className="lc-bubble-header">
                <FontAwesomeIcon icon={m.icon} className="lc-bubble-icon" />&nbsp;
                <small
                  className="lc-bubble-name"
                  style={{ color: getColorForName(m.nickname || "Anonymous") }}
                >
                  {m.nickname || "Anonymous"}
                </small>
              </div>

              {m.text && (
                <div className="lc-bubble-message">{renderMessageContent(m.text)}</div>
              )}
            </div>

            {/* Media */}
           {m.message_media && m.message_media.length > 0 && (
  <div className="lc-media-grid" style={{ marginTop: 8 }}>
    {m.message_media.map((file) =>
      (file.mime || "").startsWith("image/") ? (
        <img
          key={file.id}
          src={file.url}
          alt={file.file_name || "image"}
          className="lc-media-thumb"
          onClick={() => setViewer({ url: file.url, type: "image" })}
        />
      ) : (
        <video
          key={file.id}
          src={file.url}
          className="lc-media-thumb"
          muted
          loop
          onClick={() => setViewer({ url: file.url, type: "video" })}
        />
      )
    )}
  </div>
)}

            {/* Pending Transfers */}
            {(pendingUploads.some((p) => p.messageId === m.id && p.status !== "done") ||
              pendingDownloads.some((d) => d.messageId === m.id && d.status !== "done")) && (
              <div className="lc-transfer" aria-live="polite">
                <FontAwesomeIcon icon={faPhotoVideo} className="pending" /> <br />
                Loading Media...
              </div>
            )}

            {/* Actions */}
            <div className="lc-actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(m.id);
                }}
                className="lc-like-btn"
              >
                <FontAwesomeIcon
                  icon={m.likes_count > 0 ? solidHeart : regularHeart}
                  className={m.likes_count > 0 ? "liked" : ""}
                />
                <span> {m.likes_count || 0}</span>
              </button>

              <div
                className="lc-actions-2"
                style={{ display: activeMessageId === m.id ? "flex" : "none" }}
              >
                <div className="absolute ">
                  {floatingHearts
                    .filter((h) => h.messageId === m.id)
                    .map((h) => (
                      <FontAwesomeIcon
                        key={h.id}
                        icon={faHeart}
                        className="text-red-500 animate-floatUp"
                      />
                    ))}
                </div>

                <div className="lc-reply">
                  <button
                    className="lc-reply-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setReplyTo(m);
                    }}
                  >
                    <FontAwesomeIcon icon={faComment} />
                  </button>
                </div>

                <button
                  className="lc-pin-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePinMessage(m.id, m.pinned);
                  }}
                >
                  {m.pinned ? "📌❌" : "📌"}
                </button>

                {isMine(m) && (
                  <button
                    className="lc-del-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMessage(m);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))
      )}
    </AnimatePresence>
  </div>
</div>

      {/* Input Area */}
      <div className="lc-inputs">
        <span className="lc-mode-icons">
          <FontAwesomeIcon icon={nickname && nickname.trim() !== "" ? faUser : faUserSecret} />
        </span>
        <input
          placeholder="Anonymous"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="lc-input lc-input-nick"
        />
        {replyTo && (
       <div className="reply-preview">
         <div className="reply-header">
           Replying to {replyTo.nickname || "Anonymous"}
            <button onClick={() => setReplyTo(null)}>✕</button>
         </div>
          <div className="reply-text">{replyTo.text}</div>
      </div>
      )}

        <input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="lc-input lc-input-msg"
        />
        <input
          type="file"
          id="chat-file"
          accept="image/*,video/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => setUploadFiles(Array.from(e.target.files || []))}
        />
        <label htmlFor="chat-file" className="camera">
          <FontAwesomeIcon icon={faCamera} />
        </label>
        <button onClick={() => sendMessage()} className="lc-send">
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
      {/* =================== */}
      {/* Previews Before Upload */}
      {/* =================== */}
      {uploadFiles.length > 0 && (
        <div className="lc-previews">
          {uploadFiles.map((f) =>
            f.type.startsWith("image/") ? (
              <img key={f.name} src={URL.createObjectURL(f)} alt={f.name} style={{ width: 80 }} />
            ) : (
              <video key={f.name} src={URL.createObjectURL(f)} style={{ width: 120 }} />
            )
          )}
        </div>
      )}

      {/* =================== */}
      {/* Media Viewer        */}
      {/* =================== */}
      {viewer && (
  <div
    className="lc-viewer"
    onClick={() => setViewer(null)} // close on background
  >
    {viewer.type === "image" ? (
      <img
        src={viewer.url}
        alt="full"
        className="lc-viewer-media"
        onClick={(e) => {
          e.stopPropagation();
          if (e.currentTarget.requestFullscreen) {
            e.currentTarget.requestFullscreen();
          }
        }}
      />
    ) : (
      <video
        src={viewer.url}
        controls
        autoPlay
        className="lc-viewer-media"
        onClick={(e) => {
          e.stopPropagation();
          if (e.currentTarget.requestFullscreen) {
            e.currentTarget.requestFullscreen();
          }
        }}
      />
    )}
  </div>
)}

    </div>
    

    
  );
}