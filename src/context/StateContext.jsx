import { createContext, useContext, useState, useEffect } from "react";

const StateContext = createContext();
export const useAppState = () => useContext(StateContext);

export function StateProvider({ children }) {
  // Store anything you want persisted across pages here
  const [cgpaInputs, setCgpaInputs] = useState({});
  const [searchData, setSearchData] = useState({});
  const [scrollPositions, setScrollPositions] = useState({});
  const [messages, setMessages] = useState([]);

  // Load nickname from localStorage on first render
  const [chatState, setChatState] = useState(() => {
    const savedName = localStorage.getItem("chatNickname");
    return {
      nickname: savedName || "",
      input: "",
      replyTo: null,
    };
  });

  // Save nickname to localStorage whenever it changes
  useEffect(() => {
    if (chatState.nickname) {
      localStorage.setItem("chatNickname", chatState.nickname);
    }
  }, [chatState.nickname]);

  const [cgpaCalcState, setCgpaCalcState] = useState({
    semesters: [{ gpa: "", units: "" }],
    cgpa: null,
  });
  const [activeCgpaComponent, setActiveCgpaComponent] = useState("predictor");

  return (
    <StateContext.Provider
      value={{
        cgpaInputs,
        setCgpaInputs,
        searchData,
        setSearchData,
        scrollPositions,
        setScrollPositions,
        setActiveCgpaComponent,
        chatState,
        setChatState,
        activeCgpaComponent,
        setActiveCgpaComponent,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}
