import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'pretendard/dist/web/static/pretendard.css';
import './styles/tokens.css';
import './styles/global.css';
import { DataProvider } from './state/DataContext';
import App from './App';

const root = document.getElementById('root');
if (!root) throw new Error('#root 요소가 없습니다.');

createRoot(root).render(
  <StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </StrictMode>,
);
