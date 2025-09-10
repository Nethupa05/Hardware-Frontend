import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AdminPage from './pages/Admin/AdminPage/AdminPage';

function Home() {
  return (
    <>
      <div className="card">
        <button>
          <a href="/admin">Go to Admin Panel</a>
        </button>
      </div>
      <p className="read-the-docs">
      </p>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;