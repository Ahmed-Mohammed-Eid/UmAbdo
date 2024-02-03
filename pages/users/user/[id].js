import React, {useState} from "react";
// AXIOS
import axios from 'axios';
// TOAST
import {toast} from "react-hot-toast";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";


export default function Courier({id, userData, message}) {

    // VARIABLES
    let rowsPerPage = 5;

    // STATES
    const [messageShowed, setMessageShowed] = useState(false);
    const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);
    const [deleteLoader, setDeleteLoader] = useState(false);

    // SET SUBSCRIPTIONS
    const subscriptions = userData?.subscribtions;


    // EFFECT TO SHOW TOAST MESSAGE IF MESSAGE IS NOT NULL
    React.useEffect(() => {
        if (message && !messageShowed) {
            const timer = setTimeout(() => {
                toast.error(message);

                setMessageShowed(true);

                return () => clearTimeout(timer);
            }, 1000);
        }
    }, [message, messageShowed]);

    // DELETE USER MATERIAL HANDLER

    // DELETE User
    function deleteUserMaterialHandler(userMaterial, materialType) {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // DELETE COURIER
        if (token) {
            // DELETE COURIER
            setDeleteLoader(true)
            axios
                .delete(`${process.env.API_URL}/remove/user/material`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        userId: id,
                        materialId: userMaterial,
                        materialType
                    }
                })
                .then((res) => {
                    setDeleteLoader(false)
                    toast.success(res.data?.message || "Material Deleted Successfully");
                    // GET MATERIALS COPY
                    const materialsCopy = [...userData?.subscribtions];
                    // FIND THE INDEX OF THE MATERIAL
                    const materialIndex = materialsCopy.findIndex((material) => material.id === userMaterial);
                    // REMOVE THE MATERIAL FROM THE ARRAY
                    materialsCopy.splice(materialIndex, 1);
                    // SET THE MATERIALS
                    userData.subscribtions = materialsCopy;
                    // SET THE USER DATA
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


    return (
        <div>
            {/*COURIER INFO PART*/}
            <div className={'card'}>
                <div className={'card-header'}>
                    <h3 className={'card-title uppercase'}>Client</h3>
                    <div className={'card-body'}>
                        <div className="grid">
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="font-bold">FullName:</div>
                                <div>{userData?.clientName}</div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="font-bold">Phone Number:</div>
                                <div>{userData?.phoneNumber}</div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="font-bold">Device Allowed:</div>
                                <div>{userData?.allowDevice ? (<span className={"text-success"}>Yes</span>) : (
                                    <span className={"text-danger"}>No</span>)}</div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="font-bold">Is User Active:</div>
                                <div>{userData?.isActive ? (<span className={"text-success"}>Yes</span>) : (
                                    <span className={"text-danger"}>No</span>)}</div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {/*ORDERS PART*/}
            <div className={'card mt-4'}>
                <div className={'card-header'}>
                    <h3 className={'card-title uppercase'}>SUBSCRIPTIONS</h3>
                    <div className={'card-body'}>
                        <DataTable
                            value={subscriptions}
                            paginator
                            rows={rowsPerPage}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            sortMode="multiple"
                            emptyMessage="No records found"
                        >

                            <Column
                                field={`title`}
                                header="Paid Material Title"
                                sortable
                                filter
                                filterPlaceholder="Search by Title"
                                style={{
                                    minWidth: "200px",
                                }}
                            />

                            <Column
                                field={`courseName`}
                                header="Course Name"
                                sortable
                                filter
                                filterPlaceholder="Search by Course Name"
                            />

                            <Column
                                field={"materialId.sectionType"}
                                header="Type"
                                sortable
                                filter
                                filterPlaceholder="Search by Type"
                                body={(rowData) => {
                                    return (
                                        <span style={{
                                            backgroundColor: rowData?.materialType === "prime" ? "#28a745" : (rowData.materialType === "course" ? "#8f07ff" : "#35c3dc"),
                                            padding: "0.15rem 1rem",
                                            borderRadius: "1rem",
                                            color: "#FFFFFF",
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            textTransform: "capitalize"
                                        }}>
                                {rowData.materialType}
                            </span>
                                    );
                                }}
                            />

                            <Column
                                field="materialId._id"
                                header="Actions"
                                body={(rowData) => {
                                    return (
                                        <div className="flex gap-2">
                                            <button
                                                className="bg-danger text-white px-3 py-1 rounded-md pointer border-none custom-button"
                                                onClick={() => {
                                                    setSelectedUserToDelete(rowData.id)
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
                            header="Delete Material"
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
                                            onClick={() => deleteUserMaterialHandler(selectedUserToDelete, userData.materialType)}
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
                                Are you sure you want to delete this Material?
                            </p>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    )
}


export async function getServerSideProps(ctx) {
    // GET THE ID FROM THE URL
    const {id} = ctx.query;
    // GET THE TOKEN FROM THE REQUEST
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

    // REQUEST TO GET THE USER DATA
    const userData = await axios.get(`${process.env.API_URL}/user/subscribtions`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            userId: id,
        }
    })
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.log(err);
            return null;
        });

    if (!userData) {
        return {
            props: {
                id,
                message: "User Not Found or Something Went Wrong"
            }
        };
    }

    return {
        props: {
            id,
            userData: userData?.user
        },
    };
}