import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './pages/MainPage'
import EditorPage from './pages/EditorPage'
import ViewerPage from './pages/ViewerPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/editor/:id" element={<EditorPage />} />
        <Route path="/:slug" element={<ViewerPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
