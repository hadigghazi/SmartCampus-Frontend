import Experience from '../../components/Instructor/Experience';
import { Chat } from '../../components/Instructor/Chat/Chat';
import { ChatHistory } from '../../components/Instructor/ChatHistory/ChatHistory';
import "./InstructorPage.css";

const InstructorPage: React.FC = () => {
  return (
    <>
      <Experience />
      <ChatHistory />
      <Chat />
    </>
  );
};

export default InstructorPage;
