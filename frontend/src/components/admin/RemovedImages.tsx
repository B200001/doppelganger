import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import LoadingSpinner from '../LoadingSpinner';
import './styles/RemovedImages.scss';

interface RemovedImage {
  _id: string;
  imageName: string;
  removedAt: string;
  answers: Answer[];
}

interface Answer {
  _id: string;
  user: User;
  dataset: string;
  image_name: string;
  listed_ans: string[];
  unlisted_ans: string;
  question_slug: string;
  createdAt: string;
}

interface User {
  _id: string;
  user: number;
  username: string;
  email: string;
}

const RemovedImages: React.FC = () => {
  const [removedImages, setRemovedImages] = useState<RemovedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state: RootState) => state.admin.token);
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchRemovedImages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/admin/removed-images`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setRemovedImages(data);
        } else {
          console.error('Failed to fetch removed images');
        }
      } catch (error) {
        console.error('Failed to fetch removed images', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRemovedImages();
  }, [token]);

  // const handleDeleteRemovedImage = async (imageId: string) => {
  //   try {
  //     const response = await fetch(`http://localhost:5000/api/admin/delete-removed-image/${imageId}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //       },
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       alert(data.message);
  //       setRemovedImages(removedImages.filter((image) => image._id !== imageId));
  //     } else {
  //       console.error('Failed to delete removed image');
  //     }
  //   } catch (error) {
  //     console.error('Failed to delete removed image', error);
  //   }
  // };

  return (
    <div className="removed-images">
      <h3>Removed Images</h3>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <ul>
          {removedImages.map((image) => (
            <li key={image._id}>
              {image.imageName} - Removed At: {new Date(image.removedAt).toLocaleString()}
              {/* <button onClick={() => handleDeleteRemovedImage(image._id)}>Delete</button> */}
              <ul>
                {image.answers.map((answer) => (
                  <li key={answer._id}>
                    {/* Uncomment and customize the details you want to display */}
                    {/* User: {answer.user.username} */}
                    {/* Dataset: {answer.dataset} */}
                    {/* Listed Answers: {answer.listed_ans.join(', ')} */}
                    {/* Unlisted Answer: {answer.unlisted_ans} */}
                    {/* Question Slug: {answer.question_slug} */}
                    {/* Answered At: {new Date(answer.createdAt).toLocaleString()} */}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RemovedImages;
