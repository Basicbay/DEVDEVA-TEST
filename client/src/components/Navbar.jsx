
import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav>
            <div className=' text-white relative flex h-16 px-10 py-16 items-center justify-between bg-green-600'>
                <Link to={`/`}><h2 className="font-bold text-3xl sm:text-4xl " >User Management</h2></Link>
            </div>
        </nav>
    )
}

export default Navbar