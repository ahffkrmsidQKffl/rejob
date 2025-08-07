import { Routes, Route } from 'react-router-dom';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';
import { JobList } from './pages/JobList';
import { MyPage } from './pages/MyPage';
import { Help } from './pages/Help';
import { EnterInfo } from './pages/EnterInfo';
import { Recommend } from './pages/Recommend';
import { RecommendModal } from './components/RecommendModal';
import { Menubar } from './components/Menubar';
import './App.css';

function App() {
  return (
    
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/menubar" element={<Menubar />} />
      <Route path="/login" element={<Login />} />
      <Route path="/joblist" element={<JobList />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/help" element={<Help />} />
      <Route path="/enterinfo" element={<EnterInfo />} />
      <Route path="/recommend" element={<Recommend />} />
      <Route path="/recommendmodal" element={<RecommendModal />} />
    </Routes>
    
  )
}

export default App
