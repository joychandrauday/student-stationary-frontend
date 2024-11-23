import { Outlet } from 'react-router-dom'
import Navbar from '../components/Shared/Navbar/Navbar'
import Footer from '../components/Shared/Footer/Footer'
const Main = () => {
  return (
    <div>
      <Navbar />
      <div className='min-h-screen container mx-auto'>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default Main
