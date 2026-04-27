import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import TaskDetailsPage from './pages/TaskDetailsPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tasks/:id" element={<TaskDetailsPage />} />
      </Routes>
    </Layout>
  )
}

export default App
