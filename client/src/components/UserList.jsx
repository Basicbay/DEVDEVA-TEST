import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import avatar from "./image/avatar.png";

//ฟังก์ขั่นสำหรับการแสดง user ใน table
const User = ({ user, handleDeleteConfirmation }) => (
  <tr>
    <td className="pl-10 py-3">
      <img
        className="rounded-full w-full h-full  object-cover"
        src={
          user.image && user.image !== "null"
            ? `https://user-management-8uvc.onrender.com/uploads/${user.image}`
            : avatar
        }
        style={{ width: "60px", height: "60px" }}
        alt={user.image ? "User Avatar" : "Default Avatar"}
      />
    </td>
    <td>{user.fname}</td>
    <td>{user.lname}</td>
    <td>{user.gender}</td>
    <td>{user.birthday}</td>
    <td className="p-0">
      <div className="flex gap-2 justify-end">
        <Link to={`/edit/${user._id}`}>
          <button
            className="text-white w-20 py-2"
            style={{ background: "#FFC900" }}
          >
            Edit
          </button>
        </Link>
        <button
          className="text-white w-20 py-2"
          style={{ background: "#FF0000" }}
          onClick={() => handleDeleteConfirmation(user._id)}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

function UserList() {
  const [users, setUsers] = useState([]); // state สำหรับจัดเก็บผู้ใช้
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // state สำหรับระบุหน้าปัจจุบัน
  const usersPerPage = 6; // จำนวน user ในหน้าเพจ
  const [isLoaded, setIsLoaded] = useState(false);

  //ฟังก์ชั่น Fetch ข้อมูลผู้ใช้จาก server

  async function getUsers() {
    try {
      const response = await fetch(
        `https://user-management-8uvc.onrender.com/user/?page=${currentPage}`
      );
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
      const response = await fetch(
        "https://user-management-8uvc.onrender.com/totalusers"
      );
      const data = await response.json();
      setTotalUsers(data.count);
    } catch (error) {
      console.error(error);
    }
    setIsLoaded(true);
  };

  useEffect(() => {
    fetchTotalUsers(); //fetch จำนวนผู้ใช้ เมื่อหน้าปัจจุบันมีการเปลี่ยนแปลง
    getUsers(); //Fetch ข้อมูลผู้ใช้ เมื่อหน้าปัจจุบันมีการเปลี่ยนแปลง

  }, [currentPage]);

  //ฟังก์ชั่นลบ user
  const deleteUser = async (id) => {
    await fetch(`https://user-management-8uvc.onrender.com/${id}`, {
      method: "DELETE",
    });
    setTotalUsers((prevTotalUsers) => prevTotalUsers - 1); // อัพเดทจำนวนผู้ใช้หลังจากลบผู้ใช้แล้ว
    setUsers(users.filter((el) => el._id !== id)); //กรองผู้ใช้ที่ถูกลบออกจาก state

    // Check if the last user on the current page was deleted
    if (users.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      setUsers(users.filter((el) => el._id !== id)); // กรองผู้ใช้ที่ถูกลบออกจาก state
    }

    // Refetch the users after deleting
    getUsers(currentPage);
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
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        //หากยืนยันการลบเป็นจริง
        deleteUser(id); //ไปยังฟังก์ชั่น ลบ user
        Swal.fire({
          //แสดงข้อความหลังทำการลบ
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
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
      <div className="relative flex h-24 px-5 items-center justify-between max-w-[1190px] m-auto">
        <div className="font-medium text-xl text-slate-400 ">User List</div>
        <Link to={`/create`}>
          <button className="rounded-lg text-white px-8 py-2 bg-green-600">
            Add +
          </button>
        </Link>
      </div>
      <div
        className=" md:mx-10 xl:mx-auto m-auto max-w-6xl text-justify"
        style={{ overflowX: "auto" }}
      >
        <table className="w-full whitespace-nowrap">
          <thead className="bg-neutral-200">
            <tr>
              <th>Profile Picture</th>
              <th>First name</th>
              <th>Last name</th>
              <th>Gender</th>
              <th>Birthday</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          {!isLoaded ? (
            <></>
          ) : (
            <tbody>
              {users.map((user) => (
                <User
                  key={user._id}
                  user={user}
                  handleDeleteConfirmation={() =>
                    handleDeleteConfirmation(user._id)
                  }
                />
              ))}
            </tbody>
          )}
        </table>
      </div>
      {!isLoaded ? (
        <div className="text-center mt-40">
          <svg
            aria-hidden="true"
            className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500 mb-3"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <p>Loading...</p>
        </div>
      ) : (
        <></>
      )}
      {!isLoaded ? (
        <></>
      ) : (
        <div className="pagination mt-5 flex justify-center gap-5 text-slate-500 ">
          <p className="hidden">Total users {totalUsers}</p>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            &lt;
          </button>
          {generatePageNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}

export default UserList;
