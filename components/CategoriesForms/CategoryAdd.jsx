import React, {useState} from "react";
import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
// NOTIFICATION
import {toast} from "react-hot-toast";
// AXIOS
import axios from "axios";
// FILE UPLOADER
import CustomFileInput from "@/components/CustomFileInput/CustomFileInput";


const CategoryAdd = () => {
    // STATES
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState({
        categoryType: "",
        categoryTitle: "",
        categorySubTitle: "",
        parentSectionId: "",
        sectionOrder: "",
        sectionPrice: "",
        files: [],
        currency: "KWD",
    });

    // SUBMIT FORM
    const handleSubmit = (e) => {
        e.preventDefault();
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        // Process form submission or validation here
        // Check if all fields are filled
        if (!category.categoryType || !category.categoryTitle || !category.sectionOrder || !category.files) {
            toast.error("Please fill all fields");
            return;
        }


        // Create FormData object
        const formData = new FormData();
        // Append data to FormData object
        formData.append("sectionType", category.categoryType);
        formData.append("sectionTitle", category.categoryTitle);
        formData.append("sectionSubtitle", category.categorySubTitle);
        if (category.categoryType === "course" || category.categoryType === "sub") {
            formData.append("parentSectionId", category.parentSectionId);
        }
        formData.append("sectionOrder", category.sectionOrder);
        formData.append("sectionPrice", category.sectionPrice || 0);
        // Append files to FormData object
        for (let i = 0; i < category.files.length; i++) {
            formData.append("files", category.files[i]);
        }

        formData.append("currency", category.currency);

        // set the loading to true
        setLoading(true);

        // Send the form data to the server
        axios.post(`${process.env.API_URL}/create/section`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((res) => {
                // set the loading to false
                setLoading(false);
                // show success message
                toast.success(res.data.message || "Category Created Successfully");
                // reset the form
                setCategory({
                    categoryType: "",
                    categoryTitle: "",
                    categorySubTitle: "",
                    parentSectionId: "",
                    sectionOrder: "",
                    sectionPrice: "",
                    currency: "KWD",
                    files: [],
                });
            })
            .catch((err) => {
                console.log(err.response);
                // set the loading to false
                setLoading(false);
                // show error message
                toast.error(err.response?.data?.message);
            });
    };

    // EFFECT TO GET THE DROPDOWN DATA FROM THE SERVER BASED ON THE CATEGORY TYPE
    React.useEffect(() => {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        if (category.categoryType === "course" || category.categoryType === "sub") {
            // GET THE CATEGORIES
            axios.get(`${process.env.API_URL}/get/sections/list`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    sectionType: category.categoryType
                }
            })
                .then((res) => {
                    const sections = res.data.sections;
                    const ArrayOfResults = []
                    // set the categories
                    if (sections?.prime) {
                        let objectOfData = {
                            label: "Prime Section",
                        }
                        const primeSections = sections.prime.map((section) => {
                            return {
                                label: `${section.sectionTitle} - ${section?.sectionSubtitle}`,
                                value: section._id,
                            };
                        });
                        objectOfData = {...objectOfData, items: primeSections}
                        ArrayOfResults.push(objectOfData)
                    }

                    if (sections?.sub) {
                        let objectOfData = {
                            label: "Sub Section",
                        }
                        const chapters = sections.sub.map((section) => {
                            return {
                                label: `${section.sectionTitle} - ${section?.sectionSubtitle}`,
                                value: section._id,
                            };
                        });
                        objectOfData = {...objectOfData, items: chapters}
                        ArrayOfResults.push(objectOfData)
                    }

                    if (sections?.courses) {
                        let objectOfData = {
                            label: "Courses",
                        }
                        const subSections = sections.courses.map((section) => {
                            return {
                                label: `${section.courseTitle} - (${section?.courseSubtitle})`,
                                value: section._id,
                            };
                        });
                        objectOfData = {...objectOfData, items: subSections}
                        ArrayOfResults.push(objectOfData)
                    }

                    setCategories(ArrayOfResults)
                })
                .catch((err) => {
                    console.log(err.response);
                });
        }

    }, [category, category.categoryType])

    return (
        <>
            <form onSubmit={handleSubmit} className={"col-12 card"}>
                <h1 className="text-2xl mb-5 uppercase">Create Category</h1>

                <div className="p-fluid formgrid grid">

                    <div className="field col-12">
                        <label htmlFor="categoryType">Category Type</label>
                        <Dropdown
                            id="categoryType"
                            value={category.categoryType}
                            onChange={(e) =>
                                setCategory({
                                    ...category,
                                    categoryType: e.target.value,
                                })}
                            placeholder="Category Type"
                            options={[
                                {label: "Prime Section", value: "prime"},
                                {label: "Chapter", value: "course"},
                                {label: "SubSection", value: "sub"},
                            ]}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="category-title">Category Title</label>
                        <InputText
                            id="category-title"
                            value={category.categoryTitle}
                            onChange={(e) =>
                                setCategory({
                                    ...category,
                                    categoryTitle: e.target.value,
                                })
                            }
                            placeholder="Category Title"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="category-subTitle">Category SubTitle</label>
                        <InputText
                            id="category-subTitle"
                            value={category.categorySubTitle}
                            onChange={(e) =>
                                setCategory({
                                    ...category,
                                    categorySubTitle: e.target.value,
                                })
                            }
                            placeholder="Category SubTitle"
                        />
                    </div>

                    {(category.categoryType === "course" || category.categoryType === "sub") && (
                        <div className="field col-12">
                            <label htmlFor="parentSectionId">Parent Section Id</label>
                            <Dropdown
                                id="parentSectionId"
                                value={category.parentSectionId}
                                onChange={(e) => {
                                    setCategory({
                                        ...category,
                                        parentSectionId: e.target.value,
                                    })
                                }}
                                placeholder="Parent Section Id"
                                options={categories || []}
                                optionGroupLabel={"label"}
                                optionGroupChildren={"items"}
                            />
                        </div>)}

                    <div className="field col-12">
                        <label htmlFor="files">Image For Cover</label>
                        <CustomFileInput accept={'.jpg, .jpeg, .png, .gif, .pdf, .doc, .docx'}
                                         handleImageChange={(files) => {
                                             // SET THE FILES
                                             setCategory({...category, files: files})
                                         }}/>
                    </div>

                    {(category.categoryType === "course") && (<div className="field col-12">
                        <label htmlFor="currency">Currency</label>
                        <Dropdown
                            id="currency"
                            value={category.currency}
                            onChange={(e) => {
                                setCategory({
                                    ...category,
                                    currency: e.target.value,
                                })
                            }}
                            placeholder="Currency"
                            options={[
                                {label: "Kuwaiti Dinar", value: "KWD"},
                                {label: "Saudi Arabian Riyal", value: "SAR"},
                            ]}
                        />
                    </div>)}

                    <div
                        className={`field col-12 ${category.categoryType === "course" ? 'md:col-6' : 'md:-col-12'}`}>
                        <label htmlFor="sectionOrder">Category Order</label>
                        <InputNumber
                            id="sectionOrder"
                            value={category.sectionOrder}
                            min={1}
                            onChange={(e) =>
                                setCategory({
                                    ...category,
                                    sectionOrder: e.value,
                                })
                            }
                            placeholder="Category Order"
                        />
                    </div>

                    {(category.categoryType === "course") && (<div className="field col-12 md:col-6">
                        <label htmlFor="sectionPrice">Category Price</label>
                        <InputNumber
                            id="sectionPrice"
                            value={category.sectionPrice}
                            min={0}
                            onChange={(e) =>
                                setCategory({
                                    ...category,
                                    sectionPrice: e.value,
                                })
                            }
                            placeholder="Category Price"
                            mode={'currency'}
                            currency={category.currency === "KWD" ? "KWD" : "SAR"}
                        />
                    </div>)}

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
        </>
    );
};

export default CategoryAdd;