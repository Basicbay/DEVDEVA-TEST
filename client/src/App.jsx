import './App.css'
import { Route, Routes } from 'react-router-dom'
import CreateUser from './components/CreateUser'
import Navbar from './components/Navbar'
import UserList from './components/UserList'
import EditUser from './components/EditUser'


function App() {

  return (
    <>
     <Navbar />
     <Routes>
       <Route path="/" element={<UserList />} />
       <Route path="/create" element={<CreateUser />} />
       <Route path="/edit/:id" element={<EditUser />} />
     </Routes>
    </>
  )
}

export default App
