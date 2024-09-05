import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ChatHistory.module.css";

const apiUrl = import.meta.env.VITE_BASE_URL;

type Interaction = {
  id: number;
  user_id: number;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type Props = {
  chatHistory: Interaction[];
  updateChatHistory: (newHistory: Interaction[]) => void;
};

export const ChatHistory: React.FC<Props> = ({ chatHistory, updateChatHistory }) => {
  const [showHistory, setShowHistory] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (showHistory) {
      fetchHistory();
    }
  }, [showHistory]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get<Interaction[]>(
        `${apiUrl}/ai_instructor_interactions`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      updateChatHistory(response.data);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const deleteInteraction = async (id: number) => {
    try {
      await axios.delete(
        `${apiUrl}/ai_instructor_interactions/${id}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      updateChatHistory(chatHistory.filter((interaction) => interaction.id !== id));
    } catch (error) {
      console.error("Error deleting interaction:", error);
    }
  };

  const clearHistory = async () => {
    try {
      await axios.delete(`${apiUrl}/ai_instructor_interactions/clear`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      updateChatHistory([]);
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className={styles.historyContainer}>
      <button className={styles.toggleButton} onClick={toggleHistory}>
        {showHistory ? "Hide History" : "Show History"}
      </button>

      {showHistory && (
        <>
          <h2>Chat History</h2>
          <button className={styles.clearButton} onClick={clearHistory}>
            Clear All
          </button>
          {chatHistory.length > 0 ? (
            <ul className={styles.historyList}>
              {chatHistory.map((interaction) => (
                <li key={interaction.id} className={styles.historyItem}>
                  <div>
                    <strong>You:</strong> {interaction.question}
                  </div>
                  <div>
                    <strong>Instructor:</strong> {interaction.answer}
                  </div>
                  <button
                    className={styles.deleteButton}
                    onClick={() => deleteInteraction(interaction.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No chat history available.</p>
          )}
        </>
      )}
    </div>
  );
};
