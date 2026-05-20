import { Routes, Route } from 'react-router-dom'
import PeopleList from '@/views/PeopleList'

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Routes>
        <Route path="/" element={<PeopleList />} />
      </Routes>
    </div>
  )
}
