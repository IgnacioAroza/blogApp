import { render, screen } from '@testing-library/react';
import { expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

vi.mock('../services/blogs.js');

test('renders title and author, but not url or likes by default', () => {
  const blog = {
    title: 'The test title',
    author: 'The test author',
    url: 'http://testurl.com',
    likes: 0,
    user: {
      username: 'testuser',
      name: 'Test User',
    },
  };

  const user = {
    username: 'testuser',
  };

  const mockUpdateBlog = vi.fn();
  const mockRemoveBlog = vi.fn();

  render(
    <Blog
      blog={blog}
      updateBlog={mockUpdateBlog}
      removeBlog={mockRemoveBlog}
      user={user}
    />,
  );

  const titleElement = screen.getByText('The test title The test author');
  expect(titleElement).toBeDefined();

  const urlElement = screen.queryByText('https://testurl.com');
  expect(urlElement).toBeNull();

  const likesElement = screen.queryByText('likes 0');
  expect(likesElement).toBeNull();
});

test('shows url and likes when the view button is clicked', async () => {
  const blog = {
    title: 'The test title',
    author: 'The test author',
    url: 'http://testurl.com',
    likes: 0,
    user: {
      username: 'testuser',
      name: 'Test User',
    },
  };

  const user = {
    username: 'testuser',
  };

  const mockUpdateBlog = vi.fn();
  const mockRemoveBlog = vi.fn();

  render(
    <Blog
      blog={blog}
      updateBlog={mockUpdateBlog}
      removeBlog={mockRemoveBlog}
      user={user}
    />,
  );

  const userInstance = userEvent.setup();
  const button = screen.getByText('view');
  await userInstance.click(button);

  const urlElement = screen.getByText('http://testurl.com');
  expect(urlElement).toBeDefined();

  const likesElement = screen.getByText('likes 0');
  expect(likesElement).toBeDefined();
});

test('calls the like event handler twice when the like button is clicked twice', async () => {
  const blog = {
    title: 'The test title',
    author: 'The test author',
    url: 'http://testurl.com',
    likes: 0,
    user: {
      username: 'testuser',
      name: 'Test User',
    },
  };

  const user = {
    username: 'testuser',
  };

  const mockUpdateBlog = vi.fn();
  const mockRemoveBlog = vi.fn();

  render(
    <Blog
      blog={blog}
      updateBlog={mockUpdateBlog}
      removeBlog={mockRemoveBlog}
      user={user}
    />,
  );

  const userInstance = userEvent.setup();
  const viewButton = screen.getByText('view');
  await userInstance.click(viewButton);

  const likeButton = screen.getByText('like');
  await userInstance.click(likeButton);
  await userInstance.click(likeButton);

  expect(mockUpdateBlog).toHaveBeenCalledTimes(2);
});
