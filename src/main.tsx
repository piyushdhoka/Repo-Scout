import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'
import './styles/theme.css'

// Global image loading optimization
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
    }
  });
});

// Use MutationObserver to handle dynamically added images
const imageObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node instanceof HTMLImageElement) {
        if (node.complete) {
          node.classList.add('loaded');
        } else {
          node.addEventListener('load', () => {
            node.classList.add('loaded');
          });
        }
      } else if (node instanceof HTMLElement) {
        const images = node.querySelectorAll('img');
        images.forEach((img) => {
          if (img.complete) {
            img.classList.add('loaded');
          } else {
            img.addEventListener('load', () => {
              img.classList.add('loaded');
            });
          }
        });
      }
    });
  });
});

imageObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
