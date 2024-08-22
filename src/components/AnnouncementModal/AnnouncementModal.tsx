import React, { useState, useEffect } from 'react';
import styles from './AnnouncementModal.module.css'; 

type Announcement = {
  id: number;
  title: string;
  content: string;
  published_date: string;
  author_id: number;
  visibility: string;
  category: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

type AnnouncementModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (announcement: Announcement) => void;
  announcement: Announcement | null;
};

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ visible, onClose, onSave, announcement }) => {
  const [formValues, setFormValues] = useState({
    title: '',
    content: '',
    published_date: '',
    visibility: '',
    category: '',
  });

  useEffect(() => {
    if (announcement) {
      setFormValues({
        title: announcement.title,
        content: announcement.content,
        published_date: announcement.published_date,
        visibility: announcement.visibility,
        category: announcement.category,
      });
    }
  }, [announcement]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues(prevValues => ({
      ...prevValues,
      published_date: e.target.value,
    }));
  };

  const handleSave = () => {
    onSave({
      id: announcement?.id || 0,
      title: formValues.title,
      content: formValues.content,
      published_date: formValues.published_date,
      author_id: 0, 
      visibility: formValues.visibility,
      category: formValues.category,
      created_at: announcement?.created_at || '',
      updated_at: '',
      deleted_at: announcement?.deleted_at || '',
    });
  };

  if (!visible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{announcement ? 'Edit Announcement' : 'Add Announcement'}</h2>
        <form className={styles.form}>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={formValues.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Content:
            <textarea
              name="content"
              value={formValues.content}
              onChange={handleChange}
              rows={4}
              required
            />
          </label>
          <label>
            Published Date:
            <input
              type="date"
              name="published_date"
              value={formValues.published_date}
              onChange={handleDateChange}
              required
            />
          </label>
          <label>
            Visibility:
            <input
              type="text"
              name="visibility"
              value={formValues.visibility}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Category:
            <input
              type="text"
              name="category"
              value={formValues.category}
              onChange={handleChange}
              required
            />
          </label>
          <div>
            <button type="button" className={styles.addButton} onClick={handleSave}>
              Save
            </button>
            <button type="button" className={styles.addButton} onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementModal;
