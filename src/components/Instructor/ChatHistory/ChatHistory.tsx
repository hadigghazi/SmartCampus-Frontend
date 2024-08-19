import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ChatHistory.module.css";

export const ChatHistory: React.FC = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/ai_instructor_interactions"
      );
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const deleteInteraction = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/ai_instructor_interactions/${id}`
      );
      setHistory(history.filter((interaction) => interaction.id !== id));
    } catch (error) {
      console.error("Error deleting interaction:", error);
    }
  };

  const clearHistory = async () => {
    try {
      await axios.delete("http://localhost:8000/api/ai_instructor_interactions/clear");
      setHistory([]);
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
  };

  return (
    <div className={styles.historyContainer}>
      <h2>Chat History</h2>
      {history.length > 0 ? (
        <ul className={styles.historyList}>
          {history.map((interaction) => (
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
      <button className={styles.clearButton} onClick={clearHistory}>
        Clear All
      </button>
    </div>
  );
};
