import  { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import avatar from './image/avatar.png';

function EditUser() {
    const [form, setForm] = useState({ //state เพื่อจัดการข้อมูลของ form
        fname: "",
        lname: "",
        gender: "",
        birthday: "",
        image: "",
    });
    const [previewUrl, setPreviewUrl] = useState(''); // state Preview รูปภาพ
    const params = useParams(); // hook parameter
    const navigate = useNavigate(); // hook การนำทาง

    //fetch ข้อมูลผู้ใช้ตาม parameter id ที่ให้มา
    useEffect(() => {
        async function fetchData() {
            const id = params.id?.toString();
            const response = await fetch(`https://user-management-8uvc.onrender.com/user/${params.id?.toString()}`);
            if (!response.ok) {
                window.alert(`An error has occurred: ${response.statusText}`);
                return;
            }
            const user = await response.json();
            if (!user) {
                window.alert(`User with id ${id} not found`);
                navigate("/");
                return;
            }
            setForm(user);
        }
        fetchData();
    }, [params.id, navigate]);

    //ฟังก์ชั่นอัพเดด state form ฟอร์ม
    function updateForm(value) {
        setForm(prev => ({ ...prev, ...value }));
    }

    //ฟังก์ชั่นลบรูปภาพโปรไฟล์ จากฟอร์ม
    const deleteImage = () => {
        updateForm({ image: null });
    };

    // ฟังก์ชั่น ยืนยันการส่ง form
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fname', form.fname);
        formData.append('lname', form.lname);
        formData.append('gender', form.gender);
        formData.append('birthday', form.birthday);
        formData.append('image', form.image);

        showAlert(formData); //ไปยังฟังก์ชั่น Alert
    }

    //ฟังก์ชั่น Alert ยืนยันการเปลี่ยนแปลงฟอร์ม
    const showAlert = (formData) => {
        Swal.fire({
            icon: "question",
            title: "Do you want to save the changes?",
            showCancelButton: true,
            confirmButtonText: "Save"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await fetch(`https://user-management-8uvc.onrender.com/update/${params.id}`, {
                        method: "POST",
                        body: formData,
                    });
                    Swal.fire("Saved!", "", "success");
                    navigate('/');
                } catch (error) {
                    console.error('Error updating user:', error);
                }
            }
        });
    }

    return (
        <div className=''>
            <div className='relative flex h-24 px-5 items-center justify-between max-w-[1190px] m-auto'>
                <div className='font-medium text-xl text-slate-400'>Edit User</div>
                <Link to={`/create`}><button className='rounded-lg  text-white px-8 py-2 bg-green-600'>Add +</button></Link>
            </div>
            <form onSubmit={handleSubmit} className=' m-auto max-w-6xl md:px-20 xl:px-0'>
                <div className=' grid xl:grid-cols-3 gap-10 xl:gap-5  '>
                    <div className='grid gap-4 text-center '>
                        {previewUrl ? (
                            <img style={{ width: "176px", height: "176px" }} className=" rounded-full m-auto w-full h-full  object-cover" src={previewUrl} alt="" />
                        ) : form.image && form.image !== 'null' ? (
                            <img style={{ width: "176px", height: "176px" }} className=" rounded-full m-auto w-full h-full  object-cover" src={`https://user-management-8uvc.onrender.com/uploads/${form.image}`} alt="" />
                        ) : (
                            <img style={{ width: "176px", height: "176px" }} className=" rounded-full m-auto w-full h-full  object-cover" src={avatar} alt="" />
                        )}
                        <div>
                            <label htmlFor="file-upload" className="rounded-lg text-white text-sm px-5 py-2 cursor-pointer" style={{ background: '#008FFF' }}>
                                Upload Profile Picture
                                <input id="file-upload" type="file" className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files && e.target.files[0];
                                        if (file) {
                                            setPreviewUrl(URL.createObjectURL(file)); //preview รูปภาพ
                                            updateForm({ image: file }); // update รุปภาพที่ input มา
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <div>
                            <button onClick={deleteImage} type='button' className='rounded-lg text-white text-sm px-5 py-2' style={{ background: '#FF0000' }}>Delete Picture</button>
                        </div>
                    </div>
                    <div className='grid xl:grid-cols-2 xl:col-span-2 gap-5 place-content-center text-black    '>
                        <div className='flex flex-col'>
                            <label className="p-1  ">First Name</label>
                            <input
                                className=" border-[1px] rounded-lg p-2"
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
                                <option value="" disabled selected>-- Please Select Gender --</option>
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
                    <button type='submit' className='rounded-lg text-white w-32  py-1' style={{ background: '#06DC2D' }}>SAVE</button>
                </div>
            </form>
        </div>
    )
}

export default EditUser;
