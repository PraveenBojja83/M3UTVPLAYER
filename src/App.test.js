import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('opens the playlist sidebar from the main screen', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /search or add a playlist/i }));

  expect(screen.getByPlaceholderText(/enter m3u or json link/i)).toBeInTheDocument();
});

test('hides the sidebar in fullscreen and reopens it after exiting', async () => {
  const originalFetch = global.fetch;
  const requestFullscreenDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'requestFullscreen');
  const exitFullscreenDescriptor = Object.getOwnPropertyDescriptor(document, 'exitFullscreen');
  const fullscreenElementDescriptor = Object.getOwnPropertyDescriptor(document, 'fullscreenElement');

  Object.defineProperty(document, 'fullscreenElement', { configurable: true, writable: true, value: null });
  HTMLElement.prototype.requestFullscreen = jest.fn(function () {
    Object.defineProperty(document, 'fullscreenElement', { configurable: true, value: this });
    document.dispatchEvent(new Event('fullscreenchange'));
    return Promise.resolve();
  });
  document.exitFullscreen = jest.fn(() => {
    Object.defineProperty(document, 'fullscreenElement', { configurable: true, value: null });
    document.dispatchEvent(new Event('fullscreenchange'));
    return Promise.resolve();
  });
  global.fetch = jest.fn().mockResolvedValue({
    text: jest.fn().mockResolvedValue('#EXTM3U\n#EXTINF:-1,Test Channel\nhttps://example.com/stream.m3u8'),
  });

  try {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /search or add a playlist/i }));
    fireEvent.change(screen.getByPlaceholderText(/enter m3u or json link/i), {
      target: { value: 'https://example.com/playlist.m3u' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add playlist/i }));
    fireEvent.click(await screen.findByRole('button', { name: /test channel/i }));
    fireEvent.click(screen.getByRole('button', { name: /^fullscreen$/i }));

    expect(await screen.findByRole('button', { name: /exit fullscreen/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter m3u or json link/i).closest('.sidebar')).not.toHaveClass('open');

    fireEvent.click(screen.getByRole('button', { name: /exit fullscreen/i }));

    expect(screen.getByPlaceholderText(/enter m3u or json link/i).closest('.sidebar')).toHaveClass('open');
  } finally {
    global.fetch = originalFetch;
    if (requestFullscreenDescriptor) {
      Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', requestFullscreenDescriptor);
    } else {
      delete HTMLElement.prototype.requestFullscreen;
    }
    if (exitFullscreenDescriptor) {
      Object.defineProperty(document, 'exitFullscreen', exitFullscreenDescriptor);
    } else {
      delete document.exitFullscreen;
    }
    if (fullscreenElementDescriptor) {
      Object.defineProperty(document, 'fullscreenElement', fullscreenElementDescriptor);
    } else {
      delete document.fullscreenElement;
    }
  }
});
