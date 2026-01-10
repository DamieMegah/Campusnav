// src/context/StateContext.jsx
import { createContext, useContext, useState } from "react";

const StateContext = createContext();
export const useAppState = () => useContext(StateContext);

export function StateProvider({ children }) {
  // Store anything you want persisted across pages here
  const [cgpaInputs, setCgpaInputs] = useState({});
  const [searchData, setSearchData] = useState({});
  const [scrollPositions, setScrollPositions] = useState({});
  const [messages, setMessages] = useState([]);

  const [cgpaCalcState, setCgpaCalcState] = useState({
    semesters: [{ gpa: '', units: '' }],
    cgpa: null,
  });
  const [activeCgpaComponent, setActiveCgpaComponent] = useState('predictor');
  const [chatState, setChatState] = useState({
    nickname: "",
    input: "",
    replyTo: null,
  });

  return (
    <StateContext.Provider
      value={{ cgpaInputs, setCgpaInputs, searchData, setSearchData, scrollPositions, setScrollPositions, setActiveCgpaComponent, 
         chatState, setChatState,  activeCgpaComponent, setActiveCgpaComponent,}}
    >
      {children}
    </StateContext.Provider>
  );
}
