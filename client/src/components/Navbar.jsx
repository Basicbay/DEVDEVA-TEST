import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav>
            <div className=' text-white relative flex h-16 px-10 items-center justify-between' style={{ background: '#008FFF' }}>
                <Link to={`/`}><p className="font-medium text-xl " >User Management</p></Link>
                <div className=' select-none h-10 w-10 bg-white rounded-full ring-2 ring-slate-500 text-slate-500 text-2xl font-bold text-center grid place-content-center'>D</div>
            </div>
        </nav>
    )
}

export default Navbar