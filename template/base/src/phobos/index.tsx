import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PhobosProvider } from './provider';

export const createPhobosApp = (root?: string) => {
  let rootElement = document.getElementById(root || 'root');

  if (!rootElement) {
    rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);
  }

  createRoot(rootElement).render(
    <StrictMode>
      <PhobosProvider />
    </StrictMode>,
  );
}