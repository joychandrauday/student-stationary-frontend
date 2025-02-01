import Footer from "@/pageComponent/Shared/Footer"
import Navbar from "@/pageComponent/Shared/Navbar"
import { Outlet } from "react-router-dom"

const Main = () => {
  return (
    <div className="bg-white w-full overf text-white">
      <div className="w-full">
        <Navbar />
      </div>
      <div className='min-h-screen '>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default Main
