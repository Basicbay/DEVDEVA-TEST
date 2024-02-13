import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import avatar from './image/avatar.png'

const User = (props ) => (
  <tr>
    <td className='pl-10 py-3'>
      {props.user.image && props.user.image !== 'null' ? (
        <img
          className='rounded-full'
          src={`http://localhost:5000/uploads/${props.user.image}`}
          style={{ maxWidth: '60px', maxHeight: '60px' }}
        />
      ) : (
        <img
          className="rounded-full"
          src={avatar}
          style={{ maxWidth: '60px', maxHeight: '60px' }}
        />
      )}
    </td>
    <td>{props.user.fname}</td>
    <td>{props.user.lname}</td>
    <td>{props.user.gender}</td>
    <td>{props.user.birthday}</td>
    <td className='p-0' >
      <div className='flex gap-2 justify-end'>
        <Link to={`/edit/${props.user._id}`}><button className=' text-white w-20 py-2' style={{ background: '#FFC900' }}>Edit</button></Link>
        <Link to={``}><button className=' text-white w-20 py-2' style={{ background: '#FF0000' }} onClick={() => { props.deleteUser(props.user._id); }}>Delete</button></Link>
      </div>
    </td>
  </tr>
);

function UserList() {
  const [users, setUsers] = useState([])
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  async function getUsers(page ) {
    const response = await fetch(`http://localhost:5000/user/?page=${currentPage}`); // http://localhost:2567/user/?page=${currentPage}&limit=${itemsPerPage}
    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }
    const users = await response.json();
    setUsers(users);
    setIsLoaded(true);
  }

  useEffect(() => {
    getUsers(currentPage);
  }, [currentPage]);

  // This method will delete a record
  async function deleteUser(id ) {
    await fetch(`http://localhost:5000/${id}`, {
      method: "DELETE"
    });
    const newUsers = users.filter((el) => el._id !== id);
    setUsers(newUsers);
  }

  // This method will map out the records on the table
  function UsersList() {
    return users.map((user) => {
      return (
        <User
          user={user}
          deleteUser={() => deleteUser(user._id)}
          key={user._id}
        />
      );
    });
  }

  const handlePageChange = (newPage ) => {
    setCurrentPage(newPage);
  };

  return (
    <div className=''>
      <div className='relative flex h-20 px-10 items-center justify-between'>
        <div className='font-medium text-xl text-slate-400'>User List</div>
        <Link to={`/create`}><button className='rounded-lg  text-white px-8 py-2' style={{ background: '#008FFF' }}>Add +</button></Link>
      </div>

      <div className='mt-10 md:mx-10 xl:mx-auto m-auto max-w-6xl text-justify' style={{ overflowX: 'auto' }}>
        <table className=" w-full whitespace-nowrap ">
          <thead className=' bg-neutral-200'>
            <tr>
              <th>Profile Picture</th>
              <th>First name</th>
              <th>Last name</th>
              <th>Gender</th>
              <th>Birthday</th>
              <th className='text-center'>Action</th>
            </tr>
          </thead>
          <tbody >
            {UsersList()}
          </tbody>
        </table>
      </div>
      <div className="pagination mt-5 flex justify-center lg:justify-end px-10 xl:px-28 gap-10 text-3xl text-slate-400">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>&laquo;</button>
          <button onClick={() => handlePageChange(currentPage + 1)}>&raquo;</button>
        </div>
      <div>
      </div>
    </div>
  )
}

export default UserList