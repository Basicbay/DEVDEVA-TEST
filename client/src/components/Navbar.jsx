
import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav>
            <div className=' text-white relative flex h-16 px-10 py-20 items-center justify-between bg-green-600'>
                <Link to={`/`}><h1 className="font-bold text-5xl " >User Management</h1></Link>
                {/* <div className=' select-none h-10 w-10 bg-white rounded-full ring-2 ring-slate-500 text-slate-500 text-2xl font-bold text-center grid place-content-center'>D</div> */}
            </div>
        </nav>
    )
}

export default Navbar