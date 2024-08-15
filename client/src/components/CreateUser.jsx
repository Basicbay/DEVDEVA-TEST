import  { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import avatar from './image/avatar.png';
import { useNavigate } from 'react-router';

function CreateUser() {
    const navigate = useNavigate(); // hook การนำทาง
    const [form, setForm] = useState({  //state เพื่อจัดการข้อมูลของ form
        fname: '',
        lname: '',
        gender: '',
        birthday: '',
        image: '',
    });

    //ฟังก์ชั่นแจ้งเตือนเพื่อยืนยันการ Create user
    const Alert = async (formData) => {
        const result = await Swal.fire({    //แสดงกล่อง alert
            icon: 'question',
            title: 'Do you want to create the user ?',
            showCancelButton: true,
            confirmButtonText: 'Create'
        });

        if (result.isConfirmed) {   // หากยืนยันกล่อง alert
            await fetch('https://user-management-8uvc.onrender.com/user/add', {     //post แบบฟอร์มไปยัง server
                method: 'POST',
                body: formData,
            });
            setForm({ fname: '', lname: '', gender: '', birthday: '', image: '' }); //รีเซ็ต form เป็นค่าว่าง
            Swal.fire('Created!', '', 'success');   //alert สร้าง user สำเร็จ
            navigate('/');  //นำทางไปยังหน้าแรก
        }
    };

    //ฟังก์ชั่นอัพเดด state form ฟอร์ม
    const updateForm = (value) => {
        setForm((prev) => ({ ...prev, ...value }));
    };

    //ฟังก์ชั่นลบรูปภาพโปรไฟล์
    const deleteImage = () => {
        updateForm({ image: null });
    };

    // ฟังก์ชั่น ยืนยันการส่ง form
    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();    //สร้าง object เพื่อส่งฟอร์มเป็น data เนื่องจากมีข้อมูลของภาพ
        formData.append('fname', form.fname);
        formData.append('lname', form.lname);
        formData.append('gender', form.gender);
        formData.append('birthday', form.birthday);
        formData.append('image', form.image);
        Alert(formData);    //ไปยังฟังก์ชั่น Alert
    };

    return (
        <div className="">
            <div className="relative flex h-24 px-5 items-center justify-between max-w-[1190px] m-auto">
                <div className="font-medium text-xl text-slate-400">Create New User</div>
                <Link to="/create">
                    <button className="rounded-lg  text-white px-8 py-2 bg-green-600">
                        Add +
                    </button>
                </Link>
            </div>

            <form onSubmit={onSubmit} className="m-auto max-w-6xl md:px-20 xl:px-0">

                <div className=' grid xl:grid-cols-3 gap-10 xl:gap-5 '>

                    <div className='grid gap-4 text-center items-center '>
                        {form.image ? (
                            <img className="w-44 h-44 rounded-full m-auto" src={URL.createObjectURL(form.image)} alt="" />
                        ) : (
                            <img className="w-44 h-44 rounded-full m-auto" src={avatar} alt="" />
                        )}
                        <div>
                            <label htmlFor="file-upload" className="rounded-lg text-white text-sm px-5 py-2 cursor-pointer" style={{ background: '#008FFF' }}>
                                Upload Profile Picture
                                <input id="file-upload" type="file" className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files && e.target.files[0];
                                        if (file) {
                                            updateForm({ image: file }); // // update รุปภาพที่ input มา
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <div><button onClick={deleteImage} type='button' className='rounded-lg text-white text-sm px-5 py-2' style={{ background: '#FF0000' }}>Delete Picture</button></div>

                    </div>

                    <div className='grid xl:grid-cols-2 xl:col-span-2 gap-5 place-content-center text-black    '>

                        <div className='flex flex-col'>
                            <label className="p-1  ">First Name</label>
                            <input
                                className=" border-[1px] rounded-lg p-2 "
                                type="text"
                                id='fname'
                                placeholder='Please enter First name'
                                value={form.fname}
                                onChange={(e) => updateForm({ fname: e.target.value })}
                                required
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className="p-1  ">Last Name</label>
                            <input
                                className=" border-[1px] rounded-lg p-2 "
                                type="text"
                                id='lname'
                                placeholder='Please enter Last name'
                                value={form.lname}
                                onChange={(e) => updateForm({ lname: e.target.value })}
                                required
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className="p-1  ">Gender</label>
                            <select
                                className="border-[1px] rounded-lg p-2   "
                                name="option"
                                id='gender'
                                value={form.gender}
                                onChange={(e) => updateForm({ gender: e.target.value })}
                                required
                            >
                                <option value="" disabled>-- Please Select Gender --</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className='flex flex-col'>
                            <label className="p-1  ">Birthday</label>
                            <input
                                className='border-[1px] rounded-lg p-2 '
                                type="date"
                                id="birthday"
                                placeholder="dd-mm-yyyy"
                                value={form.birthday}
                                onChange={(e) => updateForm({ birthday: e.target.value })}
                                required
                            />
                        </div>

                    </div>
                </div>

                <div className='flex gap-5 my-16 justify-center xl:justify-end '>
                    <Link to={`/`}><button className='rounded-lg text-white w-32  py-1' style={{ background: '#9C9C9C' }}>CANCEL</button></Link>
                    <button type='submit' className='rounded-lg text-white w-32  py-1' style={{ background: '#008FFF' }}>CREATE</button>
                </div>

            </form>
        </div>
    );
}

export default CreateUser;
