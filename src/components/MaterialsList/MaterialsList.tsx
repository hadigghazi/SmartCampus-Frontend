import React from 'react';
import { CourseMaterial } from '../../features/api/types';
import styles from './MaterialsList.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
const apiUrl = import.meta.env.VITE_BASE_URL;

interface MaterialsListProps {
  materials: CourseMaterial[];
  onDelete?: (materialId: number) => void;
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload?: (e: React.FormEvent) => void;
  file?: File | null;
  title?: string;
  description?: string;
  setTitle?: React.Dispatch<React.SetStateAction<string>>;
  setDescription?: React.Dispatch<React.SetStateAction<string>>;
}

const MaterialsList: React.FC<MaterialsListProps> = ({
  materials,
  onDelete,
  onFileChange,
  onUpload,
  file,
  title,
  description,
  setTitle,
  setDescription
}) => {
  return (
    <div>
      <h1 className={styles.headingSecondary}>- Course Materials</h1>

      {(onFileChange || onUpload) && (
        <form onSubmit={onUpload} className={styles.uploadForm}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle?.(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription?.(e.target.value)}
          />
          <input
            type="file"
            onChange={onFileChange}
            required
          />
          <button type="submit">Upload</button>
        </form>
      )}

      <div className={styles.materialsList}>
        {materials?.length > 0 ? (
          materials.map((material) => (
            <div className={styles.materialCard} key={material.id}>
              <a href={`${apiUrl}/course-materials/${material.id}/download`} download>
                <i className="fas fa-download"></i>
              </a>
              {onDelete && (
                <button onClick={() => onDelete(material.id)} className={styles.deleteButton}>
                  <i className="fas fa-trash-alt"></i>
                </button>
              )}
              <div className={styles.cardHeader}>
                <i className={`fas fa-file-alt ${styles.fileIcon}`}></i>
                <p className={styles.title}>{material.title}</p>
              </div>
              <p className={styles.description}>{material.description}</p>
            </div>
          ))
        ) : (
          <p>No materials available.</p>
        )}
      </div>
    </div>
  );
};

export default MaterialsList;
