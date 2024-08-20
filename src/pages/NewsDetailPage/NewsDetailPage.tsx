// src/pages/NewsDetailPage/NewsDetailPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetNewsByIdQuery } from '../../features/api/newsApi';
import { News } from '../../features/api/types'; // Import the News type

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the ID from URL params
  const { data: news, error, isLoading } = useGetNewsByIdQuery(Number(id));

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading news</p>;

  if (!news) return <p>No news found</p>;

  return (
    <div>
      <h1>{news.title}</h1>
      <p>{news.published_date}</p>
      <p>{news.content}</p>
    </div>
  );
};

export default NewsDetailPage;
