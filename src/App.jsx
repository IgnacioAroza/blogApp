import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import blogService from './services/blogs';
import loginService from './services/login';
import './styles/App.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [notificationType, setNotificationType] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedBlogappUser');
    setUser(null);
    blogService.setToken(null);
    setErrorMessage('Logged out');
    setNotificationType('success');
    setTimeout(() => {
      setErrorMessage(null);
      setNotificationType('');
    }, 5000);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      setUser(user);
      setUsername('');
      setPassword('');
      blogService.setToken(user.token);
      setErrorMessage('Login successful');
      setNotificationType('success');
      setTimeout(() => {
        setErrorMessage(null);
        setNotificationType('');
      }, 5000);
    } catch (exception) {
      setErrorMessage('Wrong credentials');
      setNotificationType('error');
      setTimeout(() => {
        setErrorMessage(null);
        setNotificationType('');
      }, 5000);
    }
  };

  const addBlog = async (newBlog) => {
    try {
      if (!newBlog.title || !newBlog.author || !newBlog.url) {
        setErrorMessage('All fields are required');
        setNotificationType('error');
        setTimeout(() => {
          setErrorMessage(null);
          setNotificationType('');
        }, 5000);
        return;
      }

      const returnedBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(returnedBlog).sort((a, b) => b.likes - a.likes));
      setErrorMessage(
        `A new blog '${newBlog.title}' by '${newBlog.author}' added`,
      );
      setNotificationType('success');
      setTimeout(() => {
        setErrorMessage(null);
        setNotificationType('');
      }, 5000);
      blogFormRef.current.toggleVisibility();
    } catch (exception) {
      setErrorMessage(
        'Failed to add blog: ' +
          (exception.response?.data?.error || exception.message),
      );
      setTimeout(() => {
        setErrorMessage(null);
        setNotificationType('');
      }, 5000);
    }
  };

  const updateBlog = (updatedBlog) => {
    setBlogs(
      blogs
        .map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
        .sort((a, b) => b.likes - a.likes),
    );
  };

  const removeBlog = (id) => {
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} type={notificationType} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Blogs</h2>
      <Notification message={errorMessage} type={notificationType} />
      <p>{user.name} logged in</p>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>

      <Togglable buttonLabel="create a new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {blogs.length > 0 ? (
        blogs.map((blog) =>
          blog && blog.id ? (
            <Blog
              key={blog.id}
              blog={blog}
              updateBlog={updateBlog}
              removeBlog={removeBlog}
              user={user}
            />
          ) : null,
        )
      ) : (
        <p>No blogs aviable</p>
      )}
    </div>
  );
};

export default App;
