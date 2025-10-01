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
import { useNavigate } from "react-router-dom";

// ==========================
// Supabase client (your backend)
// ==========================
import { supabase } from "../supabaseClient";

// ==========================
// Stylesheet
// ==========================
import "./LiveChat.css";

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


// Scroll smoothly to a message by its id
const scrollToMessage = (id) => {
  const element = document.getElementById(`msg-${id}`);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    element.classList.add("highlight"); // optional highlight
    setTimeout(() => element.classList.remove("highlight"), 1500);
  }
};


// ============================================================
// LiveChat Component
// ============================================================
export default function LiveChat() {

  //=====================
  //Navigation hook
  //=====================
  const navigate = useNavigate();

  //=====================================================
  //Hall name/codes clickable renderer
  //=================================================
  function renderMessageText(text) {
  const hallRegex = /\b[A-Z]{2,}\d{2,}\b/; // hall code pattern

  return text.split(/(\s+)/).map((word, i) => {
    if (hallRegex.test(word)) {
      return (
        <span
          key={i}
          className="hall-link"
          onClick={() => navigate(`/hall/${word}`)}
          style={{ color: "blue", cursor: "pointer" }}
        >
          {word}
        </span>
      );
    }
    return word;
  });
}





  //===============================================
  // hashTAGS
  //==================
 function navigateToTrend(tag) {
  const stream = document.querySelector(".lc-stream");
  if (!stream) return;

  // find the first message element that contains the hashtag
  const target = Array.from(stream.querySelectorAll(".lc-bubble-message"))
    .find(el => el.textContent.includes(`#${tag}`));

  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add("lc-highlight"); // highlight effect
    setTimeout(() => target.classList.remove("lc-highlight"), 2000);
  }
}


  function renderWithHashtags(text) {
    if (!text) return null;
    return text.split(/(\#[a-zA-Z0-9_]+)/g).map((part, i) => {
      if (part.startsWith("#")) {
        return (
          <span 
            key={i} 
            className="lc-hashtag"
            onClick={() => navigateToTrend(part.slice(1))}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  }




  // Generate a consistent random color based on the string
function getColorForName(name) {
  // hash the string to a number
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  // convert hash to HSL color
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`; // vibrant color
}

// Hide all delete and pin buttons at the start
// Hide all delete and pin buttons at the start
function hideButtons() {
  document.querySelectorAll(".lc-del-btn, .lc-pin-btn, .lc-reply-btn").forEach(btn => {
    btn.style.display = "none";
    btn.style.opacity = "0";
  });
}
hideButtons();

// Add click event to each message bubble
document.querySelectorAll(".lc-bubble").forEach(bubble => {
  bubble.addEventListener("click", () => {
    hideButtons(); // hide others first
    const delBtn = bubble.querySelector(".lc-del-btn");
    const pinBtn = bubble.querySelector(".lc-pin-btn");
    const replyBtn = bubble.querySelector(".lc-reply-btn");

    [delBtn, pinBtn, replyBtn].forEach(btn => {
      if (!btn) return;
      btn.style.display = "block";
      btn.style.opacity = "1";
      btn.style.transition = "opacity 0.3s ease";
    });
  });

  // Double-click on bubble -> like toggle
  bubble.addEventListener("dblclick", () => {
    toggleLike(m.id);
    console.log('liked');
  });
});

// Hide buttons if window is scrolled or double-clicked anywhere
window.addEventListener("scroll", hideButtons);
window.addEventListener("dblclick", hideButtons);



function MediaViewer({ viewer, setViewer }) {
  const [scale, setScale] = useState(1);

  const handleClick = () => {
    setScale(1.5); // scale up on single click
  };

  const handleDoubleClick = (e) => {
    // Fullscreen API
    const elem = e.target;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  if (!viewer) return null;
};
  // ==========================================
  // State for stable permanent userId
  // ==========================================
  const [userId, setUserId] = useState(null);

  // Generate/retrieve userId once when component mounts
  useEffect(() => {
    setUserId(ensureUserId());
  }, []);

  // ==========================================
  // Chat States
  // ==========================================
  const [messages, setMessages] = useState([]);        // All chat messages
  const [input, setInput] = useState("");              // Current text input
  const [nickname, setNickname] = useState("");        // User nickname (display only)
  const [pinned, setPinned] = useState(null);          // Pinned message
  const [uploadFiles, setUploadFiles] = useState([]);  // Files queued for upload
  const [pendingUploads, setPendingUploads] = useState([]);   // Local pending uploads
  const [pendingDownloads, setPendingDownloads] = useState([]); // Local pending downloads
  const [viewer, setViewer] = useState(null);          // Media viewer (popup)
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [replyTo, setReplyTo] = useState(null); // State to track which message is being replied to
  


// ==========================================
  // Hover to center videos and unmute
// ==========================================
const stream = document.querySelector(".lc-stream");
const mediaElements = document.querySelectorAll(".lc-media-grid img, .lc-media-grid video");

mediaElements.forEach((el) => {
  const openFullscreenAndPlay = () => {
    // Fullscreen
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();

    // Center alignment
    stream.style.alignItems = "center";

    // Play sound (only for video)
    if (el.tagName.toLowerCase() === "video") {
      el.muted = false; // unmute
      el.play().catch((err) => {
        console.warn("Cannot autoplay video with sound:", err);
      });
    }
  };

  el.addEventListener("click", openFullscreenAndPlay);
});

// Reset alignment on fullscreen exit
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) stream.style.alignItems = "";
});





  // ==========================================
  // Refs
  // ==========================================
  const stageRef = useRef(null);       // For auto scroll
  const longPressTimer = useRef(null); // For long press delete

  // ==========================================
  // 🔹 Effective user display (nickname or anonymous)
  // ==========================================
  const effectiveUserDisplay =
    nickname && nickname.trim() !== "" ? nickname.trim() : "Anonymous";

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

  // Attach correct user icon
  const attachIcon = (msg) => ({
    ...msg,
    icon: msg.nickname && msg.nickname.trim() !== "" ? faUser : faUserSecret,
  });

  // ============================================================
  // Fetch Messages (with likes + media)
  // ============================================================
 const fetchMessages = async () => {
  try {
    const { data: messages, error: msgErr } = await supabase
      .from("messages")
      .select(`
        id, text, nickname, user_id, pinned, created_at, reply_to,
        message_media(*),   message_likes ( user_id )
      `)
      .order("created_at", { ascending: true });
    if (msgErr) throw msgErr;

    // Map messages and attach reply info
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


  // ============================================================
  // Realtime Updates from Supabase
  // ============================================================
  useEffect(() => {
    fetchMessages();

    const messagesChannel = supabase
      .channel("realtime-messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () =>
        fetchMessages()
      )
      .subscribe();

    const likesChannel = supabase
  .channel("realtime-message-likes")
  // when a new like row is inserted
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "message_likes" },
    (payload) => {
      const { message_id, user_id } = payload.new;

      // don't double animate if it's my own like (toggleLike already did it)
      if (user_id !== userId) {
        const id = Date.now();
        setFloatingHearts((prev) => [...prev, { id, messageId: message_id }]);
        setTimeout(() => {
          setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
        }, 1000);
      }

      // refresh like counts
      fetchMessages();
    }
  )
  // when a like is removed, just refresh (optional: animate unlike differently)
  .on(
    "postgres_changes",
    { event: "DELETE", schema: "public", table: "message_likes" },
    () => fetchMessages()
  )
  .subscribe();


    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(likesChannel);
    };
  }, []);

  // ============================================================
  // Send Message (with file uploads + permanent userId)
  // ============================================================
 const sendMessage = async () => {
  if (!input.trim() && uploadFiles.length === 0) return;
  if (!userId) return; // wait until userId is ready

  try {
    const { data: inserted, error: insertErr } = await supabase
      .from("messages")
      .insert([
        {
          text: input || null,
          nickname: nickname || "",  // display name
          user_id: userId,           // permanent owner
          pinned: false,
          reply_to: replyTo ? replyTo.id : null, // 👈 NEW: store reply
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

    // Upload files
    for (const pendingFile of pending) {
      try {
        const cleanName = pendingFile.file.name.replace(/\s+/g, "_");
        const path = `${messageId}/${Date.now()}_${cleanName}`;
        const { error: upErr } = await supabase.storage
          .from("media")
          .upload(path, pendingFile.file);
        if (upErr) throw upErr;

        const { data: publicData } = supabase.storage.from("media").getPublicUrl(path);
        const publicUrl = publicData?.publicUrl ?? null;

        await supabase.from("message_media").insert({
          message_id: messageId,
          storage_path: path,
          file_name: pendingFile.file.name,
          mime: pendingFile.mime,
          size: pendingFile.file.size,
          url: publicUrl,
        });

        setPendingUploads((prev) => prev.filter((p) => p.id !== pendingFile.id));
      } catch (err) {
        console.error("Upload failed:", err);
        setPendingUploads((prev) =>
          prev.map((p) =>
            p.id === pendingFile.id ? { ...p, status: "error" } : p
          )
        );
      }
    }

    setInput("");
    setUploadFiles([]);
    setReplyTo(null); // 👈 clear reply state after sending
    fetchMessages();
  } catch (e) {
    console.error("sendMessage error:", e); alert("check your connection");
  }
};

  // ============================================================
  // Helper: Is this message mine? (for delete button)
  // ============================================================
  const isMine = (msg) => {
    return msg.user_id === userId; // permanent tie to userId
  };

  // ============================================================
  // Delete a message
  // ============================================================
  const deleteMessage = async (msg) => {
    try {
      if (!isMine(msg)) {
        alert("You can only delete your own messages!");
        return;
      }

      if (msg.media && msg.media.length > 0) {
        const paths = msg.media.map((m) => m.storage_path);
        await supabase.storage.from("media").remove(paths);
      }

      await supabase.from("messages").delete().eq("id", msg.id);
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
    } catch (e) {
      console.error("deleteMessage error:", e);
    }
  };

  // ============================================================
  // Pin a message
  // ============================================================
  const togglePinMessage = async (id, currentlyPinned) => {
  try {
    if (currentlyPinned) {
      // Unpin
      const { error } = await supabase
        .from("messages")
        .update({ pinned: false })
        .eq("id", id);

      if (!error) setPinned(null);
    } else {
      // Unpin any existing pinned message
      await supabase.from("messages").update({ pinned: false }).eq("pinned", true);

      // Pin this one
      const { data, error } = await supabase
        .from("messages")
        .update({ pinned: true })
        .eq("id", id)
        .select()
        .single();

      if (!error) setPinned(attachIcon(data));
    }
  } catch (e) {
    console.error("togglePinMessage error:", e);
  }
};


  // ============================================================
  // Toggle like (per permanent userId)
  // ============================================================
  const toggleLike = async (messageId) => {
  if (!userId) return;

  // ✅ IMMEDIATE UI UPDATE
  setMessages((prev) =>
    prev.map((msg) =>
      msg.id === messageId
        ? {
            ...msg,
            liked_by: msg.liked_by?.includes(userId)
              ? msg.liked_by.filter((id) => id !== userId)
              : [...(msg.liked_by || []), userId],
            likes_count: msg.liked_by?.includes(userId)
              ? msg.likes_count - 1
              : msg.likes_count + 1,
          }
        : msg
    )
  );

  // ✅ FLOATING HEART ANIMATION
  const id = Date.now();
  setFloatingHearts((prev) => [...prev, { id, messageId }]);
  setTimeout(() => {
    setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
  }, 1000);

  // ✅ SYNC WITH SUPABASE IN BACKGROUND
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
      await supabase.from('message_likes').insert([
        { message_id: messageId, user_id: userId },
      ]);
    }

    // ❌ DO NOT CALL fetchMessages() HERE — realtime subscription handles it
  } catch (e) {
    console.error('toggleLike error:', e);
  }
};

  // ============================================================
  // Auto Scroll on new messages
  // ============================================================
  useEffect(() => {
    if (stageRef.current) stageRef.current.scrollTop = stageRef.current.scrollHeight;
  }, [messages, pendingUploads]);

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="lc-wrap">
      {/* =================== */}
      {/* Pinned Message      */}
      {/* =================== */}
      {pinned && (
       <div className="lc-pinned">
         <span className="lc-pinned-text">
           <FontAwesomeIcon icon={pinned.icon} style={{ marginRight: 6 }} />
           <strong>{pinned.nickname || "Anonymous"}:</strong> {pinned.text}
         </span>
             {/* Clicking the 📌 toggles pin/unpin */}
          <span
           className="lc-pin-emoji"
           onClick={() => togglePinMessage(pinned.id, true)} // since it's currently pinned
           title="Unpin message"
           style={{ cursor: "pointer" }}>
           📌
          </span>
  </div>
)}


      {/* =================== */}
      {/* Chat Stage          */}
      {/* =================== */}
      <div className="lc-stage" ref={stageRef}>
        <div className="lc-stream">
          <AnimatePresence>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={`lc-bubble ${isMine(m) ? "mine" : ""}`}
              >
                {/* Text */}
  <div className="lc-bubble-text">
  {/* Reply Quote */}
  {m.reply_to && (
    <div
      className="lc-reply-quote"
      onClick={() => scrollToMessage(m.reply_to)}>
      <strong>{m.reply_to_user || "Anonymous"}:</strong> {m.reply_to_text}
    </div>
  )}

  {/* Normal message text */}
  <div className="lc-bubble-header">
    <FontAwesomeIcon icon={m.icon} className="lc-bubble-icon" />&nbsp; 
    <small className="lc-bubble-name" style={{ color: getColorForName(m.nickname || "Anonymous") }}>
      {m.nickname || "Anonymous"}
    </small>
  </div>
  {m.text && <div className="lc-bubble-message">{renderWithHashtags(m.text) || renderMessageText(m.text)}</div>}
</div>


                {/* Media */}
                {m.message_media && m.message_media.length> 0 && (
                  <div className="lc-media-grid" style={{ marginTop: 8 }}>
                    {m.message_media.map((file) =>
                      (file.mime || "").startsWith("image/") ? (
                        <img
                          key={file.id}
                          src={file.url}
                          alt={file.file_name || "image"}
                          style={{ maxWidth: 160, borderRadius: 6, marginBottom: 6, cursor: "pointer" }}
                          onClick={() => handleDownload(file, m.id)}
                        />
                      ) : (
                        <video
                          key={file.id}
                          src={file.url}
                          controls
                          autoPlay
                          muted
                          loop
                          style={{ maxWidth: 160, borderRadius: 8, marginBottom: 6, cursor: "pointer" }}
                          onClick={() => handleDownload(file, m.id)}
                        />
                      )
                    )}
                  </div>
                )}

                {/* Pending Transfers */}
                {(pendingUploads.some((p) => p.messageId === m.id && p.status !== "done") ||
                  pendingDownloads.some((d) => d.messageId === m.id && d.status !== "done")) && (
                  <div className="lc-transfer" aria-live="polite">
                    <FontAwesomeIcon icon={faPhotoVideo} className="pending" /> <br />Loading Media...
                  </div>
                )}

                {/* Actions */}
              <div className="lc-actions">
                 <button onClick={() => toggleLike(m.id)} className="lc-like-btn">
                    <FontAwesomeIcon 
                      icon={m.likes_count > 0 ? solidHeart : regularHeart} 
                       className={m.likes_count > 0 ? "liked" : ""} 
                    />
                    <span> {m.likes_count || 0}</span>
                  </button>

                   {/* Floating heart animation */}
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
                     <button className= "lc-reply-btn" onClick={() => setReplyTo(m)}><FontAwesomeIcon icon ={faComment} /></button>
                  </div>
     
            

              {replyTo && (
               <div className="lc-reply-preview">
                 <strong>{replyTo.nickname || "Anonymous"}:</strong> {replyTo.text}
                 <button onClick={() => setReplyTo(null)}>✕</button>
               </div>
              )}


                 <button className="lc-pin-btn" onClick={() => togglePinMessage(m.id, m.pinned)}>
                  {m.pinned ? "" : " 📌"}
                 </button>
                  {isMine(m) && (
                    <button className="lc-del-btn" onClick={() => deleteMessage(m)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* =================== */}
      {/* Input Area          */}
      {/* =================== */}
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
        <button onClick={sendMessage} className="lc-send">
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
        <div className="lc-viewer" onClick={() => setViewer(null)} // close viewer on background click
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}>
          {viewer.type === "image" ? (
                    <img
          src={viewer.url}
          alt="full"
          className="lc-viewer-img"
          style={{
            transform: `scale(${scale})`,
            transition: "transform 0.3s ease",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation(); // prevent closing the viewer
            handleClick();
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            handleDoubleClick(e);
          }}
        />

          ) : (
             <video
          src={viewer.url}
          controls
          autoPlay
          muted
          loop
          className="lc-viewer-video"
          style={{
            transform: `scale(${scale})`,
            transition: "transform 0.3s ease",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            handleDoubleClick(e);
          }}
        />
          )}
        </div>
      )}
    </div>
  );
}












//