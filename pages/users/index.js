import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";

// AXIOS
import axios from "axios";
// TOAST
import {toast} from "react-hot-toast";
import Link from "next/link";


const UsersTable = () => {
    // LOADERS STATE
    const [deleteLoader, setDeleteLoader] = useState(false);
    const [allowDeviceLoader, setAllowDeviceLoader] = useState({
        loader: false,
        dialog: false,
        status: false,
        userId: "",
    });
    const [userStatusLoader, setUserStatusLoader] = useState({
        loader: false,
        dialog: false,
        status: false,
        userId: "",
    });
    // VARIABLES
    let rowsPerPage = 25;

    // STATES
    const [globalFilter, setGlobalFilter] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);


    const onGlobalFilter = (e) => {
        setGlobalFilter(e.target.value);
    };

    // GET USERS HANDLER
    function getUsers() {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // GET COURIERS
        if (token) {
            // GET COURIERS
            axios
                .get(`${process.env.API_URL}/all/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setUsers(res.data.users);
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(
                        err.response?.data?.message || "Something went wrong"
                    );
                });
        } else {
            toast.error("You are not authorized to access this page");
        }
    }


    // Fetch users from API
    useEffect(() => {
        getUsers();
    }, []);

    // DELETE User
    function deleteUserHandler(user) {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // DELETE COURIER
        if (token) {
            // DELETE COURIER
            setDeleteLoader(true)
            axios
                .delete(`${process.env.API_URL}/remove/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        userId: user._id,
                    }
                })
                .then((res) => {
                    setDeleteLoader(false)
                    toast.success(res.data.message);
                    // GET COURIERS COPY
                    const usersCopy = [...users];
                    // FILTER COURIERS COPY
                    const filteredCouriersCopy = usersCopy.filter(userObj => userObj._id !== user._id);
                    // SET COURIERS
                    setUsers(filteredCouriersCopy);
                    // CLOSE DIALOG
                    setSelectedUserToDelete(null)
                })
                .catch((err) => {
                    setDeleteLoader(false)
                    toast.error(
                        err.response?.data?.message || "Something went wrong"
                    );
                });
        } else {
            toast.error("You are not authorized to access this page");
        }
    }

    // ACTIVATE/DEACTIVATE USER
    function activateDeactivateUserHandler() {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // DELETE COURIER
        if (token) {
            // DELETE COURIER
            setUserStatusLoader({
                ...userStatusLoader,
                loader: true,
            })
            axios
                .put(`${process.env.API_URL}/block/user`, {
                    userId: userStatusLoader.userId,
                    state: userStatusLoader.status,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setUserStatusLoader({
                        ...userStatusLoader,
                        loader: false,
                        dialog: false,
                        userId: "",
                        status: false,
                    })
                    toast.success(res.data?.message);
                    // GET COURIERS COPY
                    const usersCopy = [...users];
                    // GET THE INDEX OF THE COURIER
                    const userIndex = usersCopy.findIndex(userObj => userObj._id === userStatusLoader.userId);
                    // UPDATE COURIER
                    usersCopy[userIndex].isActive = userStatusLoader.status;
                    // SET COURIERS
                    setUsers(usersCopy);
                })
                .catch((err) => {
                    setUserStatusLoader({
                        ...userStatusLoader,
                        loader: false,
                        dialog: false,
                        userId: "",
                        status: false,
                    })
                    toast.error(
                        err.response?.data?.message || "Something went wrong"
                    );
                });
        } else {
            toast.error("You are not authorized to access this page");
        }
    }

    // ALLOW/DISALLOW USER
    function allowDisallowUserHandler() {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // DELETE COURIER
        if (token) {
            // DELETE COURIER
            setUserStatusLoader({
                ...userStatusLoader,
                loader: true,
            })
            axios
                .put(`${process.env.API_URL}/allow/user/device`, {
                    userId: allowDeviceLoader.userId,
                    state: allowDeviceLoader.status,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setAllowDeviceLoader({
                        ...allowDeviceLoader,
                        loader: false,
                        dialog: false,
                        userId: "",
                        status: false,
                    })
                    toast.success(res.data?.message);
                    // GET COURIERS COPY
                    const usersCopy = [...users];
                    // GET THE INDEX OF THE COURIER
                    const userIndex = usersCopy.findIndex(userObj => userObj._id === allowDeviceLoader.userId);
                    // UPDATE COURIER
                    usersCopy[userIndex].allowDevice = allowDeviceLoader.status;
                    // SET COURIERS
                    setUsers(usersCopy);
                })
                .catch((err) => {
                    setAllowDeviceLoader({
                        ...allowDeviceLoader,
                        loader: false,
                        dialog: false,
                        userId: "",
                        status: false,
                    })
                    toast.error(
                        err.response?.data?.message || "Something went wrong"
                    );
                });
        } else {
            toast.error("You are not authorized to access this page");
        }
    }

    return (
        <div className="card">
            <h1 className="text-2xl mb-5 uppercase">Clients</h1>

            <div className=" mb-3 w-full">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        placeholder="Search"
                        value={globalFilter || ""}
                        onChange={onGlobalFilter}
                        className="p-inputtext p-component"
                    />
                </span>
            </div>
            <DataTable
                value={users}
                paginator
                rows={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sortMode="multiple"
                globalFilter={globalFilter}
                emptyMessage="No records found"
                // Max height of the table container
                scrollable
                scrollHeight="calc(100vh - 370px)"
            >
                <Column
                    field="clientName"
                    header="Client Name"
                    sortable
                    filter
                    filterPlaceholder="Search by Client Name"
                    body={(rowData) => {
                        // MAKE IT CLICKABLE AND OPEN THE CLIENT PAGE
                        return (
                            <div className="flex gap-2">
                                <Link
                                    href={`/users/user/${rowData._id}`}
                                >
                                    {rowData.clientName}
                                </Link>
                            </div>
                        );
                    }}
                />

                <Column
                    field="isActive"
                    header="Active"
                    sortable
                    filter
                    filterPlaceholder="Search by Active"
                    body={(rowData) => {
                        return (
                            <div className="flex gap-2">
                                <button
                                    className={`px-3 py-1 rounded-md pointer border-none custom-button ${
                                        rowData.isActive
                                            ? "bg-success"
                                            : "bg-danger"
                                    } text-white`}
                                >
                                    {rowData.isActive ? "Yes" : "No"}
                                </button>
                            </div>
                        );
                    }}
                />

                <Column
                    field="allowDevice"
                    header="Allow Device"
                    sortable
                    filter
                    filterPlaceholder="Search by Allow Device"
                    body={(rowData) => {
                        return (
                            <div className="flex gap-2">
                                <button
                                    className={`px-3 py-1 rounded-md pointer border-none custom-button ${
                                        rowData.allowDevice
                                            ? "bg-success"
                                            : "bg-danger"
                                    } text-white`}
                                >
                                    {rowData.allowDevice ? "Yes" : "No"}
                                </button>
                            </div>
                        );
                    }}
                />

                <Column
                    field="phoneNumber"
                    header="Phone Number"
                    sortable
                    filter
                    filterPlaceholder="Search by Phone Number"
                />

                <Column
                    field="_id"
                    header="Actions"
                    body={(rowData) => {
                        return (
                            <div className="flex gap-2">
                                <button
                                    className="text-white px-3 py-1 rounded-md pointer border-none custom-button"
                                    // Style the button based on the status
                                    style={{
                                        background: rowData.isActive ? "#d86b6b" : "#4caf50",
                                    }}
                                    onClick={() => {
                                        setUserStatusLoader({
                                            ...userStatusLoader,
                                            dialog: true,
                                            userId: rowData._id,
                                            status: !rowData.isActive,
                                        })
                                    }}
                                >
                                    {rowData.isActive ? "Deactivate" : "Activate"}
                                </button>
                                <button
                                    className="text-white px-3 py-1 rounded-md pointer border-none custom-button"
                                    // Style the button based on the status
                                    style={{
                                        background: rowData.allowDevice ? "#f6a35a" : "#4caf50",
                                    }}
                                    onClick={() => {
                                        setAllowDeviceLoader({
                                            ...allowDeviceLoader,
                                            dialog: true,
                                            userId: rowData._id,
                                            status: !rowData.allowDevice,
                                        })
                                    }}
                                >
                                    {rowData.allowDevice ? "Disallow" : "Allow"}
                                </button>
                                <button
                                    className="bg-danger text-white px-3 py-1 rounded-md pointer border-none custom-button"
                                    onClick={() => {
                                        setSelectedUserToDelete(rowData)
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        );
                    }}
                />
            </DataTable>
            <Dialog
                header="Delete User"
                visible={selectedUserToDelete}
                style={{width: "90vw", maxWidth: "600px"}}
                onHide={() => setSelectedUserToDelete(null)}
                footer={
                    (
                        <div>
                            <Button
                                label="No"
                                icon="pi pi-times"
                                onClick={() => setSelectedUserToDelete(null)}
                                className="p-button-text"/>
                            <Button
                                icon="pi pi-check"
                                onClick={() => deleteUserHandler(selectedUserToDelete)}
                                style={{
                                    background: deleteLoader
                                        ? "#faacac"
                                        : "red",
                                }}
                                label={
                                    deleteLoader ? (
                                        <ProgressSpinner
                                            strokeWidth="4"
                                            style={{
                                                width: "1.5rem",
                                                height: "1.5rem",
                                            }}
                                        />
                                    ) : (
                                        "Yes"
                                    )
                                }/>
                        </div>
                    )
                }>
                <p className="m-0">
                    Are you sure you want to delete this User?
                </p>
            </Dialog>

            <Dialog
                header="Activate/Deactivate User"
                visible={userStatusLoader.dialog}
                style={{width: "90vw", maxWidth: "600px"}}
                onHide={() => setUserStatusLoader({
                    ...userStatusLoader,
                    dialog: false,
                    userId: "",
                })}
                footer={
                    (
                        <div>
                            <Button
                                label="No"
                                icon="pi pi-times"
                                onClick={() => setUserStatusLoader({
                                    ...userStatusLoader,
                                    dialog: false,
                                    userId: "",
                                    status: false,
                                })}
                                className="p-button-text"/>
                            <Button
                                icon="pi pi-check"
                                onClick={activateDeactivateUserHandler}
                                style={{
                                    background: userStatusLoader.status ? "#d86b6b" : "green",
                                }}
                                label={
                                    userStatusLoader.loader ? (
                                        <ProgressSpinner
                                            strokeWidth="4"
                                            style={{
                                                width: "1.5rem",
                                                height: "1.5rem",
                                            }}
                                        />
                                    ) : (
                                        "Yes"
                                    )
                                }/>
                        </div>
                    )
                }>
                <p className="m-0">
                    Are you sure you want to {userStatusLoader.status ? "deactivate" : "activate"} this User?
                </p>
            </Dialog>

            <Dialog
                header="Allow/Disallow User"
                visible={allowDeviceLoader.dialog}
                style={{width: "90vw", maxWidth: "600px"}}
                onHide={() => setAllowDeviceLoader({
                    ...userStatusLoader,
                    dialog: false,
                    userId: "",
                })}
                footer={
                    (
                        <div>
                            <Button
                                label="No"
                                icon="pi pi-times"
                                onClick={() => setAllowDeviceLoader({
                                    ...userStatusLoader,
                                    dialog: false,
                                    userId: "",
                                    status: false,
                                })}
                                className="p-button-text"/>
                            <Button
                                icon="pi pi-check"
                                onClick={allowDisallowUserHandler}
                                style={{
                                    background: allowDeviceLoader.status ? "#d86b6b" : "green",
                                }}
                                label={
                                    allowDeviceLoader.loader ? (
                                        <ProgressSpinner
                                            strokeWidth="4"
                                            style={{
                                                width: "1.5rem",
                                                height: "1.5rem",
                                            }}
                                        />
                                    ) : (
                                        "Yes"
                                    )
                                }/>
                        </div>
                    )
                }>
                <p className="m-0">
                    Are you sure you want to {allowDeviceLoader.status ? "disallow" : "allow"} this User?
                </p>
            </Dialog>
        </div>
    );
};
export default UsersTable;

// SERVER SIDE PROPS
export async function getServerSideProps(ctx) {
    // GET THE TOKEN FROM THE COOKIES
    const token = ctx.req.cookies.token;

    // IF TOKEN NOT FOUND, REDIRECT TO LOGIN PAGE
    if (!token) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}