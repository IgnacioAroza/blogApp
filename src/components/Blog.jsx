import { useState } from 'react';
import blogService from '../services/blogs';
import '../styles/Blog.css';

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
  };

  const handleLike = async () => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id,
      };

      const returnedBlog = await blogService.update(blog.id, updatedBlog);
      updateBlog(returnedBlog);
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`,
    );
    if (confirmDelete) {
      try {
        await blogService.remove(blog.id);
        removeBlog(blog.id);
      } catch (error) {
        console.error('Error deleting blog: ', error);
      }
    }
  };

  return (
    <div className="blog">
      <div className="blogTitleAuthor">
        {blog.title} {blog.author}
        <button className="toggle-details-button" onClick={toggleDetails}>
          {detailsVisible ? 'hide' : 'view'}
        </button>
      </div>
      {detailsVisible && (
        <div className="blog-details">
          <p className="blogUrl">{blog.url}</p>
          <div className="blogLikes">
            likes {blog.likes}
            <button onClick={handleLike} className="like-button">
              like
            </button>
          </div>
          <p>added by {blog.user.name}</p>
          {user.username === blog.user.username && (
            <button onClick={handleDelete} className="delete-button">
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
