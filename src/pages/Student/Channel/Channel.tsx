import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"; 
import { useSelector } from "react-redux"; 
import styles from "./Channel.module.css";
import EmojiPicker from "emoji-picker-react";
import { format } from "timeago.js";
import { RootState } from "../../../store";
import upload from "../../../firebase/upload";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import StudentLayout from "../StudentLayout";
import image from '../../../assets/images/img.png';
import emoji from '../../../assets/images/emoji.png';

const Chat = () => {
  const { id: course_instructor_id } = useParams<{ course_instructor_id?: string }>(); 
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });
  const [open, setOpen] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);

  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (course_instructor_id && user) {
      const messagesRef = collection(db, "chats", course_instructor_id, "messages");
      const q = query(messagesRef, orderBy("createdAt"));

      const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(msgs);
      }, (error) => {
        console.error("Error fetching Firestore data:", error);
      });

      return () => {
        console.log("Cleaning up Firestore listener");
        unsubscribe(); 
      };
    } else {
      console.warn("course_instructor_id or user is not defined");
    }
  }, [course_instructor_id, user]);

  const handleEmoji = (e: { emoji: string }) => {
    console.log("Emoji clicked:", e.emoji);
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log("Image file selected:", e.target.files[0]);
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text === "" && !img.file) return;

    console.log("Sending message with text:", text, "and image URL:", img.url);
    let imgUrl: string | null = null;
    try {
      if (img.file) {
        imgUrl = await upload(img.file);
        console.log("Image uploaded successfully. URL:", imgUrl);
      }

      if (!course_instructor_id) {
        console.error("Course instructor ID is not defined");
        return;
      }

      await addDoc(collection(db, "chats", course_instructor_id, "messages"), {
        text,
        img: imgUrl || null,
        senderId: user?.id,
        senderName: `${user?.first_name} ${user?.last_name}` || 'Anonymous', 
        createdAt: serverTimestamp(),
      });      
      console.log("Message added to Firestore");
    } catch (err) {
      console.error("Error adding document:", err);
    } finally {
      setImg({ file: null, url: "" });
      setText("");
    }
  };

  return (
    <StudentLayout>
    <div className={styles.chat}>
      <div className={styles.center}>
        {messages.map((message, idx) => (
          <div
          className={message.senderId === user?.id ? `${styles.message} ${styles.own}` : styles.message}
          key={idx}
          >
            <div className={styles.texts}>
              {message.img && <img src={message.img} alt="attached" />}
              <p>{message.text}</p>
              <span>{format(message.createdAt?.toDate())} - {message.senderName}</span>
            </div>
          </div>
        ))}
        {img.url && (
            <div className={`${styles.message} ${styles.own}`}>
            <div className={styles.texts}>
              <img src={img.url} alt="preview" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.icons}>
          <label htmlFor="file">
            <img src={image} alt="upload" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!user} 
        />
        <div className={styles.emoji}>
          <img
            src={emoji}
            alt="emoji"
            onClick={() => setOpen((prev) => !prev)}
          />
            <div className={`${styles.picker} ${open ? styles.open : ""}`}>
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className={styles.sendButton} onClick={handleSend} disabled={!user}>
          ➤
        </button>
      </div>
    </div>
    </StudentLayout>
  );
};

export default Chat;
