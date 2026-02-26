import { useState, useEffect } from "react";

const messages = [
  "Looking for MPT ? 🤔",
  "Late to lecture ?😯",
  "Where is SMBS sef? 🤔",
  "Find your Exam Hall😉",
  "Enter your Hall? 😉",
  "That 8am class? ⏳",
  "Where is that hall sef 🤔",
];

export default function useFunPlaceholder(speed = 50, delay = 2000) {
  const [text, setText] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = messages[messageIndex];
    let timeout;

    if (!isDeleting) {
      if (text.length < current.length) {
        timeout = setTimeout(() => {
          setText(current.slice(0, text.length + 1));
        }, speed);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), delay);
      }
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(current.slice(0, text.length - 1));
        }, speed / 2);
      } else {
        setIsDeleting(false);
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, messageIndex, speed, delay]);

  return text;
}
