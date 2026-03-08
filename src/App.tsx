import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import BrowsePage from './pages/BrowsePage';
import FishDetailPage from './pages/FishDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<BrowsePage />} />
        <Route path="/fish/:fishId" element={<FishDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
