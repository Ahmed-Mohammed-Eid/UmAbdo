import React, {useState, useEffect} from "react";
import {useRouter} from "next/router";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
import {Dropdown} from "primereact/dropdown";

// AXIOS
import axios from "axios";

// TOAST
import {toast} from "react-hot-toast";
import Image from "next/image";

const CategoriesTable = () => {
    // ROUTER
    const router = useRouter();
    // LOADERS
    const [deleteLoader, setDeleteLoader] = useState(false);
    const [selectedChildLoader, setSelectedChildLoader] = useState(false);
    // VARIABLES
    let rowsPerPage = 25;
    // STATES
    const [globalFilter, setGlobalFilter] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);
    const [childrenList, setChildrenList] = useState([]);
    const [selectedChild, setSelectedChild] = useState({
        childId: "",
        parentId: "",
        showDialog: false,
    });


    // FETCH CATEGORIES
    useEffect(() => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // GET CATEGORIES
        if (token) {
            // GET CATEGORIES
            axios
                .get(`${process.env.API_URL}/all/sections`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setCategories(res.data.sections);
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
    }, []);

    // GLOBAL FILTER
    const onGlobalFilter = (e) => {
        setGlobalFilter(e.target.value);
    };

    // DELETE CATEGORY
    function deleteCategoryHandler(category) {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // DELETE CATEGORY
        if (token) {
            // DELETE CATEGORY
            setDeleteLoader(true)
            axios
                .delete(`${process.env.API_URL}/delete/section`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        sectionId: category._id,
                    }
                })
                .then((res) => {
                    setDeleteLoader(false)
                    toast.success(res.data?.message);
                    // GET CATEGORIES COPY
                    const categoriesCopy = [...categories];
                    // FILTER CATEGORIES COPY
                    const filteredCategoriesCopy = categoriesCopy.filter(categoryObj => categoryObj._id !== category._id);
                    // SET CATEGORIES
                    setCategories(filteredCategoriesCopy);
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

    // EXTEND SHIFT
    function selectedChildHandler() {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // SET LOADER
        setSelectedChildLoader(true)

        if (token) {
            axios.post(`${process.env.API_URL}/add/child/section`, {
                sectionId: selectedChild.parentId,
                childSectionId: selectedChild.childId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => {
                    setSelectedChildLoader(false)
                    toast.success(res.data?.message || "Child Added successfully");
                    // CLOSE DIALOG AND RESET STATE
                    setSelectedChild({
                        childId: "",
                        parentId: "",
                        showDialog: false,
                    })
                    // CLOSE THE PAGE SCROLL
                    document.body.style.overflow = "auto";
                })
                .catch(err => {
                    setSelectedChildLoader(false)
                    toast.error(err.response?.data?.message || "Something went wrong");
                })

        } else {
            toast.error("You are not authorized to access this page");
        }

    }

    // GET THE CHILDREN LIST FOR THE DROPDOWN
    function getChildrenList() {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        if (token) {
            axios.get(`${process.env.API_URL}/sections/type`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    sectionType: "sub"
                }
            })
                .then(res => {
                    const sections = res.data.sections;
                    const sectionsForDropdown = sections.map(section => {
                        return {
                            label: section.sectionTitle,
                            value: section._id,
                        }
                    })
                    setChildrenList(sectionsForDropdown);
                })
                .catch(err => {
                    console.log(err.response?.data?.message || "Something went wrong");
                })
        } else {
            toast.error("You are not authorized to access this page");
        }
    }

    return (
        <div className="card">
            <h1 className="text-2xl mb-5 uppercase">Categories</h1>

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
                value={categories}
                paginator
                rows={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sortMode="multiple"
                globalFilter={globalFilter}
                emptyMessage="No records found"
            >

                <Column
                    field="imagePath"
                    header="Image"
                    body={(rowData) => {
                        return (
                            <Image
                                src={rowData.imagePath || "/IMAGES/no-image.jpg"}
                                alt={rowData.sectionTitle}
                                width={50}
                                height={50}
                                style={{
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "1px solid #eaeaea",
                                }}
                            />
                        );
                    }}
                />

                <Column
                    field={'sectionTitle'}
                    header="Title"
                    sortable
                    filter
                    filterPlaceholder="Search by Title"
                    style={{
                        minWidth: "200px",
                    }}
                />

                <Column
                    field={'sectionSubtitle'}
                    header="Subtitle"
                    sortable
                    filter
                    filterPlaceholder="Search by Subtitle"
                    style={{
                        minWidth: "200px",
                    }}
                />

                <Column
                    field={"sectionType"}
                    header="Type"
                    sortable
                    filter
                    filterPlaceholder="Search by Type"
                    body={(rowData) => {
                        return (
                            <span style={{
                                backgroundColor: rowData.sectionType === "prime" ? "#28a745" : (rowData.sectionType === "course" ? "#8f07ff" : "#35c3dc"),
                                padding: "0.15rem 1rem",
                                borderRadius: "1rem",
                                color: "#FFFFFF",
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                textTransform: "capitalize"
                            }}>
                                {rowData.sectionType}
                            </span>
                        );
                    }}
                />

                <Column
                    field={"sectionOrder"}
                    header="Order"
                    sortable
                    filter
                    filterPlaceholder="Search by Order"
                />

                <Column
                    field={"sectionPrice"}
                    header="Price"
                    sortable
                    filter
                    filterPlaceholder="Search by Price"
                    body={(rowData) => {
                        return (
                            <span style={{
                                color: rowData.sectionPrice === 0 ? "#dc3545" : "#28a745",
                                padding: "0.15rem 1rem",
                                borderRadius: "1rem",
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                textTransform: "capitalize"
                            }}>
                                {rowData.sectionPrice} {rowData.currency || ""}
                            </span>
                        );
                    }}
                />

                <Column
                    field={"blockSection"}
                    header="Blocked"
                    sortable
                    filter
                    filterPlaceholder="Search by Block Section"
                    body={(rowData) => {
                        return (
                            <span style={{
                                backgroundColor: rowData.blockSection === true ? "#dc3545" : "#28a745",
                                padding: "0.15rem 1rem",
                                borderRadius: "1rem",
                                color: "#FFFFFF",
                                textTransform: "capitalize"
                            }}>
                                {rowData.blockSection ? "Yes" : "No"}
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
                                {/*COPY ID BUTTON*/}
                                <button
                                    className="bg-primary text-white px-3 py-1 rounded-md pointer border-none custom-button"
                                    onClick={() => {
                                        navigator.clipboard.writeText(rowData._id);
                                        toast.success("Copied to clipboard");
                                    }}
                                >
                                    Copy ID
                                </button>
                                <button
                                    className="bg-success text-white px-3 py-1 rounded-md pointer border-none custom-button"
                                    onClick={() => {
                                        // GET THE CHILDREN LIST
                                        getChildrenList();
                                        // CLOSE THE PAGE SCROLL
                                        document.body.style.overflow = "hidden";
                                        // SET THE STATE
                                        setSelectedChild({
                                            ...selectedChild,
                                            showDialog: true,
                                            parentId: rowData._id,
                                        })
                                    }}
                                >
                                    Add Child
                                </button>
                                <button
                                    className="bg-edit text-white px-3 py-1 rounded-md pointer border-none custom-button"
                                    onClick={() => {
                                        router.push(`/categories/edit/${rowData._id}`);
                                    }}
                                >
                                    Edit
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
                header="Add Child"
                onHide={() => {
                    // CLOSE THE PAGE SCROLL
                    document.body.style.overflow = "auto";
                    // RESET THE STATE
                    setSelectedChild({
                        childId: "",
                        parentId: "",
                        showDialog: false,
                    })
                }}
                visible={selectedChild.showDialog}
                style={{width: "90vw", maxWidth: "600px"}}>
                <div className="">
                    <div className="flex flex-col flex-wrap">
                        <label className="font-bold col-12" htmlFor={"SelectedChild"}>ADD CHILD</label>
                        <Dropdown
                            id={"SelectedChild"}
                            value={selectedChild.childId}
                            options={childrenList || []}
                            onChange={(e) => {
                                setSelectedChild({
                                    ...selectedChild,
                                    childId: e.value,
                                });
                            }}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select a Child"
                            className="w-full"
                            // MAKE THE GROUP LABEL UPPERCASE
                        />

                        <button
                            className={"button text-white px-6 py-3 rounded-md border-none pointer custom-button"}
                            onClick={selectedChildHandler}
                            style={{
                                marginTop: "1rem",
                                marginLeft: "auto",
                                marginRight: ".5rem",
                                backgroundColor: selectedChildLoader ? "#b5e2b5" : "#28a745",
                            }}>
                            {selectedChildLoader ? (
                                <ProgressSpinner
                                    strokeWidth="4"
                                    style={{
                                        width: "1.5rem",
                                        height: "1.5rem",
                                    }}
                                />
                            ) : (
                                "Add Child"
                            )}
                        </button>
                    </div>
                </div>
            </Dialog>
            <Dialog
                header="Delete Category"
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
                                onClick={() => deleteCategoryHandler(selectedUserToDelete)}
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
                    Are you sure you want to delete this category?
                </p>
            </Dialog>
        </div>
    );
};
export default CategoriesTable;

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