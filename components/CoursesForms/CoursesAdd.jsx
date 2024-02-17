import React, {useState} from "react";
import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
import { Calendar } from 'primereact/calendar';
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
// NOTIFICATION
import {toast} from "react-hot-toast";
// AXIOS
import axios from "axios";
// FILE UPLOADER
import CustomFileInput from "@/components/CustomFileInput/CustomFileInput";


const CoursesAdd = () => {
    // STATES
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [course, setCourse] = useState({
        parentSectionId: "",
        coursePrice: "",
        file: [],
        endDate: "",
        courseSubtitle: "",
        instructorName: "",
        totalHours: "",
        courseTitle: "",
        currency: "KWD",
    });

    // SUBMIT FORM
    const handleSubmit = (e) => {
        e.preventDefault();
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        // Process form submission or validation here
        // Check if all fields are filled
        if (!course.parentSectionId || !course.courseTitle || !course.instructorName || !course.totalHours || !course.endDate || !course.file) {
            toast.error("Please fill all fields");
            return;
        }


        // Create FormData object
        const formData = new FormData();
        // Append data to FormData object
        formData.append("parentSectionId", course.parentSectionId);
        formData.append("courseTitle", course.courseTitle);
        formData.append("courseSubtitle", course.courseSubtitle);
        formData.append("instructorName", course.instructorName);
        formData.append("totalHours", course.totalHours);
        formData.append("endDate", course.endDate);
        formData.append("coursePrice", course.coursePrice);
        formData.append("currency", course.currency);

        // Append files to FormData object
        for (let i = 0; i < course.file.length; i++) {
            formData.append("files", course.file[i]);
        }

        // set the loading to true
        setLoading(true);

        // Send the form data to the server
        axios.post(`${process.env.API_URL}/create/course`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((res) => {
                // set the loading to false
                setLoading(false);
                // show success message
                toast.success(res.data.message);
                // reset the form
                setCourse({
                    parentSectionId: "",
                    coursePrice: "",
                    endDate: "",
                    instructorName: "",
                    totalHours: "",
                    courseTitle: "",
                    currency: "KWD",

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

            // GET THE CATEGORIES
            axios.get(`${process.env.API_URL}/get/sections/list`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    sectionType: "sub"
                }
            })
                .then((res) => {
                    const sections = res.data.sections;
                    const ArrayOfResults = []
                    // set the categories
                    if(sections?.prime){
                        let objectOfData = {
                            label: "Prime Section",
                        }
                        const primeSections = sections.prime.map((section) => {
                            return {
                                label: section.sectionTitle,
                                value: section._id,
                            };
                        });
                        objectOfData = {...objectOfData, items: primeSections}
                        ArrayOfResults.push(objectOfData)
                    }

                    if(sections?.sub){
                        let objectOfData = {
                            label: "Sub Section",
                        }
                        const chapters = sections.sub.map((section) => {
                            return {
                                label: `${section.sectionTitle} (${section.sectionSubtitle})`,
                                value: section._id,
                            };
                        });
                        objectOfData = {...objectOfData, items: chapters}
                        ArrayOfResults.push(objectOfData)
                    }

                    if(sections?.courses){
                        let objectOfData = {
                            label: "Courses",
                        }
                        const subSections = sections.courses.map((section) => {
                            return {
                                label: section.courseTitle,
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

    }, [])

    return (
        <>
            <form onSubmit={handleSubmit} className={"col-12 card"}>
                <h1 className="text-2xl mb-5 uppercase">Create Course</h1>

                <div className="p-fluid formgrid grid">

                    <div className="field col-12">
                        <label htmlFor="parentId">Course Parent</label>
                        <Dropdown
                            id="parentId"
                            value={course.parentSectionId}
                            onChange={(e) =>
                                setCourse({
                                    ...course,
                                    parentSectionId: e.target.value,
                                })}
                            placeholder="Course Parent"
                            options={categories || []}
                            optionGroupLabel={"label"}
                            optionGroupChildren={"items"}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="courseTitle">Course Title</label>
                        <InputText
                            id="courseTitle"
                            value={course.courseTitle}
                            onChange={(e) =>
                                setCourse({
                                    ...course,
                                    courseTitle: e.target.value,
                                })
                            }
                            placeholder="Course Title"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="courseSubtitle">Course Subtitle</label>
                        <InputText
                            id="courseSubtitle"
                            value={course.courseSubtitle}
                            onChange={(e) =>
                                setCourse({
                                    ...course,
                                    courseSubtitle: e.target.value,
                                })
                            }
                            placeholder="Course Subtitle"
                        />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="instructorName">Instructor Name</label>
                        <InputText
                            id="instructorName"
                            value={course.instructorName}
                            onChange={(e) =>
                                setCourse({
                                    ...course,
                                    instructorName: e.target.value,
                                })
                            }
                            placeholder="Instructor Name"
                        />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="totalHours">Total Hours</label>
                        <InputNumber
                            id="totalHours"
                            value={course.totalHours}
                            onChange={(e) =>
                                setCourse({
                                    ...course,
                                    totalHours: e.value,
                                })
                            }
                            placeholder="Total Hours"
                        />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="files">Image</label>
                        <CustomFileInput accept={'.jpg, .jpeg, .png, .gif, .pdf, .doc, .docx'}
                                         handleImageChange={(files) => {
                                             // SET THE FILES
                                             setCourse({...course, file: files})
                                         }}/>
                    </div>

                    <div className="field col-12">
                        <label htmlFor="currency">Currency</label>
                        <Dropdown
                            id="currency"
                            value={course.currency}
                            onChange={(e) => {
                                setCourse({
                                    ...course,
                                    currency: e.target.value,
                                })
                            }}
                            placeholder="Currency"
                            options={[
                                {label: "Kuwaiti Dinar", value: "KWD"},
                                {label: "Saudi Arabian Riyal", value: "SAR"},
                            ]}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="endDate">End Date</label>
                        <Calendar
                            id="endDate"
                            value={course.endDate}
                            onChange={(e) => {
                                setCourse({
                                    ...course,
                                    endDate: e.target.value,
                                })
                            }}
                            placeholder="End Date"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="coursePrice">Course Price</label>
                        <InputNumber
                            id="coursePrice"
                            value={course.coursePrice}
                            min={0}
                            onChange={(e) =>
                                setCourse({
                                    ...course,
                                    coursePrice: e.value,
                                })
                            }
                            placeholder="Category Price"
                            mode={'currency'}
                            currency={course.currency || "KWD"}
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
        </>
    );
};

export default CoursesAdd;
