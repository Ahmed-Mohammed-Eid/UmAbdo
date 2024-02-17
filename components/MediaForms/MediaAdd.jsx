import React, {useState} from "react";
import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
import {ProgressBar} from 'primereact/progressbar';

// NOTIFICATION
import {toast} from "react-hot-toast";
// AXIOS
import axios from "axios";
// FILE UPLOADER
import CustomFileInput from "@/components/CustomFileInput/CustomFileInput";


const MediaAdd = () => {
    // STATES
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [course, setCourse] = useState({
        mediaType: "",
        mediaTitle: "",
        mediaSubtitle: "",
        paymentType: "",
        sectionType: "",
        courseId: "",
        sectionId: "",
        mediaOrder: "",
        file: [],
    });

    // SUBMIT FORM
    const handleSubmit = (e) => {
        e.preventDefault();
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        // Process form submission or validation here
        // Check if all fields are filled
        if (!course.mediaType || !course.mediaTitle || !course.paymentType || !course.sectionType || (!course.courseId && course.mediaType === 'course') || !course.sectionId || !course.mediaOrder || !course.file) {
            toast.error("Please fill all fields");
            return;
        }

        // Create FormData object
        const formData = new FormData();
        // Append data to FormData object
        formData.append("mediaType", course.mediaType);
        formData.append("mediaTitle", course.mediaTitle);
        formData.append("mediaSubtitle", course.mediaSubtitle);
        formData.append("paymentType", course.paymentType);
        formData.append("sectionType", course.sectionType);
        if (course.courseId) {
            formData.append("courseId", course.courseId);
        }
        formData.append("sectionId", course.sectionId);
        formData.append("mediaOrder", course.mediaOrder);

        // Append files to FormData object
        for (let i = 0; i < course.file.length; i++) {
            formData.append("files", course.file[i]);
        }

        // set the loading to true
        setLoading(true);

        // Send the form data to the server
        axios.post(`${process.env.API_URL}/upload/media`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            onUploadProgress: (progressEvent) => {
                const {loaded, total} = progressEvent;
                let percent = Math.floor((loaded * 100) / total);
                // calculate the percentage of upload completed
                setUploadProgress(percent);
            }
        })
            .then((res) => {
                // set the loading to false
                setLoading(false);
                // show success message
                toast.success(res.data.message);
                // reset the form
                setCourse({
                    mediaType: "",
                    mediaTitle: "",
                    mediaSubtitle: "",
                    paymentType: "",
                    sectionType: "",
                    courseId: "",
                    sectionId: "",
                    mediaOrder: "",
                    file: [],
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

        if (course.sectionType === "course" || course.sectionType === "sub") {
            // GET THE CATEGORIES
            axios.get(`${process.env.API_URL}/get/sections/list`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    sectionType: course.sectionType
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
                                label: section.sectionTitle,
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
                                label: section.sectionTitle,
                                value: section._id,
                            };
                        });
                        objectOfData = {...objectOfData, items: chapters}
                        ArrayOfResults.push(objectOfData)
                    }

                    setSubCategories(ArrayOfResults)

                    if (sections?.courses) {
                        const subSections = sections.courses.map((section) => {
                            return {
                                label: `${section.courseTitle} - (${section.courseSubtitle})`,
                                value: section._id,
                            };
                        });
                        const objectOfData = {
                            label: "Courses"
                            , items: subSections
                        }
                        setCategories([objectOfData])
                    }
                })
                .catch((err) => {
                    console.log(err.response);
                });
        }

    }, [course.sectionType])

    //EFFECT TO GET THE DROPDOWN DATA FROM THE SERVER BASED ON THE CATEGORY TYPE
    React.useEffect(() => {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        if (course.courseId) {
            // GET THE CATEGORIES
            axios.get(`${process.env.API_URL}/child/sections`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    parentId: course.courseId
                }
            })
                .then((res) => {
                    const sections = res.data.sections;
                    const result = sections.map((section) => {
                        return {
                            label: section.sectionTitle,
                            value: section._id,
                        };
                    });
                    setSubCategories([{label: "Course Sections", items: result}])
                })
                .catch((err) => {
                    console.log(err.response);
                });
        }
    }, [course.courseId])

    return (
        <>
            <form onSubmit={handleSubmit} className={"col-12 card"}>
                <h1 className="text-2xl mb-5 uppercase">Create Media</h1>

                <div className="p-fluid formgrid grid">

                    <div className="field col-12">
                        <label htmlFor="mediaType">Media Type</label>
                        <Dropdown
                            id="mediaType"
                            value={course.mediaType}
                            onChange={(e) =>
                                setCourse({
                                    ...course,
                                    mediaType: e.target.value,
                                })}
                            placeholder="Media Type"
                            options={[
                                {label: "Video", value: "video"},
                                {label: "Document", value: "document"},
                            ]}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="mediaTitle">Media Title</label>
                        <InputText
                            id="mediaTitle"
                            value={course.mediaTitle}
                            onChange={(e) =>
                                setCourse({
                                    ...course,
                                    mediaTitle: e.target.value,
                                })
                            }
                            placeholder="Media Title"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="mediaSubtitle">Media Subtitle</label>
                        <InputText
                            id="mediaSubtitle"
                            value={course.mediaSubtitle}
                            onChange={(e) =>
                                setCourse({
                                    ...course,
                                    mediaSubtitle: e.target.value,
                                })
                            }
                            placeholder="Media Subtitle"
                        />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="paymentType">Payment Type</label>
                        <Dropdown
                            id="paymentType"
                            value={course.paymentType}
                            onChange={(e) => {
                                setCourse({
                                    ...course,
                                    paymentType: e.target.value,
                                })
                            }}
                            placeholder="Payment Type"
                            options={[
                                {label: "Free", value: "free"},
                                {label: "Paid", value: "paid"},
                            ]}
                        />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="files">Media File (Video or Document)</label>
                        <CustomFileInput accept={'*'}
                                         multiple={true}
                                         handleImageChange={(files) => {
                                             // SET THE FILES
                                             setCourse({...course, file: files})
                                         }}/>
                        {(uploadProgress > 0 && uploadProgress < 100) &&
                            <ProgressBar value={uploadProgress} displayValueTemplate={(value) => `${value}%`}/>}
                    </div>

                    <div className="field col-12">
                        <label htmlFor="sectionType">Section Type</label>
                        <Dropdown
                            id="sectionType"
                            value={course.sectionType}
                            onChange={(e) => {
                                setCourse({
                                    ...course,
                                    sectionType: e.target.value,
                                    courseId: e.target.value === "sub" ? "" : course.courseId,
                                })
                            }}
                            placeholder="Section Type"
                            options={[
                                {label: "Section", value: "sub"},
                                {label: "Course", value: "course"},
                            ]}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="courseId">Course</label>
                        <Dropdown
                            id="courseId"
                            value={course.courseId}
                            onChange={(e) => {
                                setCourse({
                                    ...course,
                                    courseId: e.target.value,
                                })
                            }}
                            placeholder="Course"
                            options={categories || []}
                            optionGroupLabel={"label"}
                            optionGroupChildren={"items"}
                            disabled={course.sectionType === "sub"}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="sectionId">Chapter</label>
                        <Dropdown
                            id="sectionId"
                            value={course.sectionId}
                            onChange={(e) => {
                                setCourse({
                                    ...course,
                                    sectionId: e.target.value,
                                })
                            }}
                            placeholder="Chapter"
                            options={subCategories || []}
                            optionGroupLabel={"label"}
                            optionGroupChildren={"items"}
                        />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="mediaOrder">Media Order</label>
                        <InputNumber
                            id="mediaOrder"
                            value={course.mediaOrder}
                            onChange={(e) => {
                                setCourse({
                                    ...course,
                                    mediaOrder: e.value,
                                })
                            }}
                            placeholder="Media Order"
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

export default MediaAdd;
