import React, {useState} from "react";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {InputMask} from "primereact/inputmask";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {ProgressSpinner} from "primereact/progressspinner";
// TOAST
import {toast} from "react-hot-toast";
// AXIOS
import axios from "axios";

const UserForm = () => {
    // STATES
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState({
        username: "",
        password: "",
    });
    const [user, setUser] = useState({
        userName: "",
        phoneNumber: "",
        role: "",
        password: "",
        confirmPassword: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // Process form submission or validation here
        if (!user.userName || !user.phoneNumber || !user.role || !user.password || !user.confirmPassword) {
            toast.error("Please fill all the fields!");
        } else if (user.password !== user.confirmPassword) {
            toast.error("Passwords do not match!");
        } else {
            setLoading(true);
            axios.post(`${process.env.API_URL}/create/user`, {
                employeeName: user.userName,
                phoneNumber: user.phoneNumber,
                role: user.role,
                password: user.password,
                confirmPassword: user.confirmPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
                .then((res) => {
                    if (res.status === 201) {
                        setLoading(false);
                        toast.success("User created successfully!");
                        setUser({
                            userName: "",
                            phoneNumber: "",
                            role: "",
                            password: "",
                            confirmPassword: "",
                        });

                        setUserInfo({
                            username: res.data.username,
                            password: res.data.password,
                        })
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    toast.error(err.response?.data?.message || "Something went wrong!");
                })
        }

    };

    return (
        <>
            <form onSubmit={handleSubmit} className={"col-12 card"}>
                <h1 className="text-2xl mb-5 uppercase">Create User</h1>

                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="user-name">User Name</label>
                        <InputText
                            id="user-name"
                            value={user.userName}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    userName: e.target.value,
                                })
                            }
                            placeholder="User Name"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="phone">Phone</label>
                        <InputMask
                            id="phone"
                            mask="9999-9999"
                            value={user.phoneNumber}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    phoneNumber: e.target.value,
                                })
                            }
                            placeholder="Phone Number"
                        />
                    </div>

                    {/*DROPDOWN FOR ROLE*/}
                    <div className="field col-12">
                        <label htmlFor="role">Role</label>
                        <Dropdown
                            id="role"
                            value={user.role}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    role: e.target.value,
                                })
                            }
                            placeholder="Select a Role"
                            options={[
                                {label: "Admin", value: "Admin"},
                                {label: "User", value: "User"},
                            ]}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="password">Password</label>
                        <Password
                            id="password"
                            value={user.password}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    password: e.target.value,
                                })
                            }
                            placeholder="Password"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <Password
                            id="confirm-password"
                            value={user.confirmPassword}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    confirmPassword: e.target.value,
                                })
                            }
                            placeholder="Confirm Password"
                        />
                    </div>

                    <div className="w-1/2 ml-auto">
                        <Button
                            type="submit"
                            className="bg-slate-500 w-full"
                            style={{
                                background: loading
                                    ? "#dcdcf1"
                                    : "var(--primary-color)",
                            }}
                            label={
                                loading ? (
                                    <ProgressSpinner
                                        strokeWidth="4"
                                        style={{
                                            width: "1.5rem",
                                            height: "1.5rem",
                                        }}
                                    />
                                ) : (
                                    "Submit"
                                )
                            }
                        />
                    </div>
                </div>
            </form>
            <Dialog
                header="USER INFO"
                visible={userInfo.username && userInfo.password}
                style={{width: "90vw", maxWidth: "600px"}}
                onHide={() => {
                    // CLOSE THE DIALOG AND IF DIALOG IS CLOSED, SET THE SELECTED USER TO NULL
                    setUserInfo(false);
                }}
            >
                <div className="grid p-4">
                    <div className="col-12 grid">
                        <div className={"col-6"}>
                            <div className="font-bold">Username:</div>
                            <p>{userInfo.username}</p>
                        </div>
                        <div className={"col-6 flex"} style={{justifyContent: "flex-end"}}>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        userInfo.username
                                    );
                                    toast.success("Username copied!");
                                }}
                                className={"bg-success border-none py-1 px-4 text-white text-bold custom-button pointer"}>Copy</button>
                        </div>
                    </div>
                    <div className="col-12 grid">
                        <div className={"col-6"}>
                            <div className="font-bold">Password:</div>
                            <p>{userInfo.password}</p>
                        </div>
                        <div className={"col-6 flex"} style={{justifyContent: "flex-end"}}>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        userInfo.password
                                    );
                                    toast.success("Password copied!");
                                }}
                                className={"bg-success border-none py-1 px-4 text-white text-bold custom-button pointer"}>Copy</button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default UserForm;
