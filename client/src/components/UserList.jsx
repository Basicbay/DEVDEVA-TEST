import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import avatar from './image/avatar.png';

//ฟังก์ขั่นสำหรับการแสดง user ใน table
const User = ({ user, handleDeleteConfirmation }) => (
  <tr>
    <td className='pl-10 py-3'>
      <img
        className='rounded-full'
        src={user.image && user.image !== 'null' ? `http://localhost:5000/uploads/${user.image}` : avatar}
        style={{ maxWidth: '60px', maxHeight: '60px' }}
        alt={user.image ? "User Avatar" : "Default Avatar"}
      />
    </td>
    <td>{user.fname}</td>
    <td>{user.lname}</td>
    <td>{user.gender}</td>
    <td>{user.birthday}</td>
    <td className='p-0'>
      <div className='flex gap-2 justify-end'>
        <Link to={`/edit/${user._id}`}>
          <button className='text-white w-20 py-2' style={{ background: '#FFC900' }}>Edit</button>
        </Link>
        <button className='text-white w-20 py-2' style={{ background: '#FF0000' }} onClick={() => handleDeleteConfirmation(user._id)}>Delete</button>
      </div>
    </td>
  </tr>
);

function UserList() {
  const [users, setUsers] = useState([]); // state สำหรับจัดเก็บผู้ใช้
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // state สำหรับระบุหน้าปัจจุบัน
  const usersPerPage = 3; // จำนวน user ในหน้าเพจ

  //ฟังก์ชั่น Fetch ข้อมูลผู้ใช้จาก server

  async function getUsers() {
    try {
      const response = await fetch(`http://localhost:5000/user/?page=${currentPage}`);
      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
      }
      const usersData = await response.json();
      setUsers(usersData);
    } catch (error) {
      window.alert(error.message);
    }
  }

  //ฟังก์ชั่น fetch จำนวนผู้ใช้จาก server
  const fetchTotalUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/totalusers');
      const data = await response.json();
      setTotalUsers(data.count);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchTotalUsers(); //fetch จำนวนผู้ใช้ เมื่อหน้าปัจจุบันมีการเปลี่ยนแปลง
    getUsers(); //Fetch ข้อมูลผู้ใช้ เมื่อหน้าปัจจุบันมีการเปลี่ยนแปลง
  }, [currentPage]);


  //ฟังก์ชั่นลบ user 
  const deleteUser = async (id) => {
    await fetch(`http://localhost:5000/${id}`, {
      method: "DELETE"
    });
    setTotalUsers(prevTotalUsers => prevTotalUsers - 1); // อัพเดทจำนวนผู้ใช้หลังจากลบผู้ใช้แล้ว
    setUsers(users.filter((el) => el._id !== id)); //กรองผู้ใช้ที่ถูกลบออกจาก state
  };

  //ฟังก์ชั่นแจ้งเตือนเมื่อกดปุ่มลบโดย และเรียกใช้ฟังก์ชั่น deleteUser
  const handleDeleteConfirmation = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#818181",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) { //หากยืนยันการลบเป็นจริง
        deleteUser(id); //ไปยังฟังก์ชั่น ลบ user
        Swal.fire({ //แสดงข้อความหลังทำการลบ
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
  };

  //ฟังก์ชั่นในการจัดการเปลี่ยนหน้าเพจ
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // ฟังก์ชั่นคำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  // ฟังก์ชั่นในการสร้างหมายเลขหน้า
  const generatePageNumbers = () => {
    const totalPages = Math.ceil(totalUsers / usersPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div>
      <div className='relative flex h-20 px-10 items-center justify-between'>
        <div className='font-medium text-xl text-slate-400'>User List</div>
        <Link to={`/create`}>
          <button className='rounded-lg text-white px-8 py-2' style={{ background: '#008FFF' }}>Add +</button>
        </Link>
      </div>

      <div className='mt-10 md:mx-10 xl:mx-auto m-auto max-w-6xl text-justify' style={{ overflowX: 'auto' }}>
        <table className="w-full whitespace-nowrap">
          <thead className='bg-neutral-200'>
            <tr>
              <th>Profile Picture</th>
              <th>First name</th>
              <th>Last name</th>
              <th>Gender</th>
              <th>Birthday</th>
              <th className='text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <User
                key={user._id}
                user={user}
                handleDeleteConfirmation={() => handleDeleteConfirmation(user._id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination mt-5 flex justify-center self-center lg:justify-end px-10 xl:px-28 gap-5 text-slate-500">
      <p>Total users {totalUsers}</p>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>&lt;</button>
        {generatePageNumbers().map(pageNumber => (
          <button key={pageNumber} onClick={() => handlePageChange(pageNumber)}>{pageNumber}</button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}>&gt;</button>
      </div>

    </div>
  );
}

export default UserList;
