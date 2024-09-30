import { render, screen } from '@testing-library/react';
import { expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

test('calls the event handler with the right details when a new blog is crated', async () => {
  const createBlog = vi.fn();

  render(<BlogForm createBlog={createBlog} />);

  const user = userEvent.setup();

  const titleInput = screen.getByPlaceholderText('Title');
  const authorInput = screen.getByPlaceholderText('Author');
  const urlInput = screen.getByPlaceholderText('Url');
  const createButton = screen.getByText('create');

  await user.type(titleInput, 'New blog title');
  await user.type(authorInput, 'New blog author');
  await user.type(urlInput, 'https://newblogurl.com');
  await user.click(createButton);

  expect(createBlog).toHaveBeenCalledTimes(1);
  expect(createBlog).toHaveBeenCalledWith({
    title: 'New blog title',
    author: 'New blog author',
    url: 'https://newblogurl.com',
  });
});
