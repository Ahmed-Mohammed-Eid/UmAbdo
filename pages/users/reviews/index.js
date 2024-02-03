import React, { useEffect } from 'react';
import axios from "axios";
import {toast} from "react-hot-toast";
import {InputText} from "primereact/inputtext";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Dialog} from "primereact/dialog";
import {ProgressSpinner} from "primereact/progressspinner";
import {Button} from "primereact/button";
import { Rating } from "primereact/rating";


export default function Reviews(){

    // STATE TO STORE THE REVIEWS
    const [reviews, setReviews] = React.useState([]);
    const [globalFilter, setGlobalFilter] = React.useState(null);
    const [selectedReviewToDelete, setSelectedUserToDelete] = React.useState(null);
    const [deleteLoader, setDeleteLoader] = React.useState(false);

    //VARIABLES
    let rowsPerPage = 10;

    // EFFECT TO GET THE REVIEWS
    useEffect(() => {
        getReviews();
    }, []);

    // FUNCTION TO GET THE REVIEWS
    const getReviews = () => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // GET THE REVIEWS
        axios
            .get(`${process.env.API_URL}/reviews`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((response) => {
                setReviews(response.data?.reviews);
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "An error occurred while getting the reviews");
            });
    }

    // FUNCTION FOR THE GLOBAL FILTER
    const onGlobalFilter = (e) => {
        setGlobalFilter(e.target.value);
    }

    // FUNCTION TO CHANGE THE STATUS OF THE REVIEW
    const changeStatusHandler = (id, oldState) => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // GET THE REVIEWS
        axios
            .put(`${process.env.API_URL}/update/publish/state`, {
                reviewId: id,
                publishState: !oldState
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((_) => {
                getReviews();
                toast.success("Review status changed successfully");
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "An error occurred while changing the review status");
            });
    }

    // FUNCTION TO DELETE THE REVIEW
    const deleteReviewHandler = (reviewId) => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // SET THE DELETE LOADER TO TRUE
        setDeleteLoader(true);

        // GET THE REVIEWS
        axios
            .delete(`${process.env.API_URL}/delete/review`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    reviewId: reviewId
                }
            })
            .then((_) => {
                getReviews();
                toast.success("Review deleted successfully");
                setSelectedUserToDelete(null);
                setDeleteLoader(false);
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "An error occurred while deleting the review");
                setDeleteLoader(false);
            });
    }

    return (
        <div className="card">
            <h1 className="text-2xl mb-5 uppercase">Reviews</h1>

            <div className=" mb-3 w-full">
                <span className="p-input-icon-left">
                    <i className="pi pi-search"/>
                    <InputText
                        placeholder="Search"
                        value={globalFilter || ""}
                        onChange={onGlobalFilter}
                        className="p-inputtext p-component"
                    />
                </span>
            </div>
            <DataTable
                value={reviews || []}
                paginator
                rows={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sortMode="multiple"
                globalFilter={globalFilter}
                emptyMessage="No records found"
            >

                <Column
                    field="userId.clientName"
                    header="Client Name"
                    sortable
                    filter
                    filterPlaceholder="Search by Client Name"
                />

                <Column
                    field={'rating'}
                    header="Rating"
                    sortable
                    filter
                    filterPlaceholder="Search by Rating"
                    body={(rowData) => {
                        return (
                            <Rating
                                value={rowData.rating}
                                readonly
                                stars={5}
                                cancel={false}
                            />
                        );
                    }}
                />

                <Column
                    field={"reviewText"}
                    header="Review"
                    sortable
                    filter
                    filterPlaceholder="Search by Review"
                    body={(rowData) => {
                        return (
                            // MAKE IT QUOTE WITH NICE STYLE
                            <span style={{
                                padding: "0.15rem 1rem",
                                borderRadius: "1rem",
                                textTransform: "capitalize",
                                fontWeight: "bold"
                            }}>
                                {/* eslint-disable-next-line react/no-unescaped-entities */}
                                "{rowData.reviewText}"
                            </span>
                        );
                    }}
                />

                <Column
                    field="_id"
                    header="Actions"
                    body={(rowData) => {
                        return (
                            <div className="flex gap-2">
                                <button
                                    className="bg-edit text-white px-3 py-1 rounded-md pointer border-none custom-button"
                                    onClick={() => changeStatusHandler(rowData._id, rowData.published)}
                                    style={{
                                        background: rowData.published ? "#ff883b" : "#4caf50",
                                    }}
                                >
                                    {rowData.published ? "Unpublish" : "Publish"}
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
                header="Delete Review"
                visible={selectedReviewToDelete}
                style={{width: "90vw", maxWidth: "600px"}}
                onHide={() => setSelectedUserToDelete(null)}
                footer={
                    (
                        <div>
                            <Button
                                label="Cancel"
                                icon="pi pi-times"
                                onClick={() => setSelectedUserToDelete(null)}
                                className="p-button-text">

                            </Button>

                            <Button
                                icon="pi pi-check"
                                onClick={() => deleteReviewHandler(selectedReviewToDelete._id)}
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
                    Are you sure you want to delete this Review?
                </p>
            </Dialog>
        </div>
    );
}