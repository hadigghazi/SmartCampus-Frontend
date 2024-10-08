import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetNewsByIdQuery } from '../../features/api/newsApi';
import styles from './NewsDetailPage.module.css'; 
import AcademicsLayout from '../Academics/AcademicsLayout';
import Spinner from '../../components/Spinner/Spinner';

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const { data: news, error, isLoading } = useGetNewsByIdQuery(Number(id));

  if (isLoading) return <Spinner />;
  if (error) return <p>Error loading news</p>;

  if (!news) return <p>No news found</p>;

  return (
   <AcademicsLayout title={news.category}>
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        
      </div>
      <h1 className={styles.headingPrimary}>{news.published_date}</h1>
      <h2 className={styles.headingSecondary}>{news.title}</h2>
      <div className={styles.content}>
        <p>{news.content}</p>
      </div>
    </div>
    </AcademicsLayout>
  );
};

export default NewsDetailPage;
