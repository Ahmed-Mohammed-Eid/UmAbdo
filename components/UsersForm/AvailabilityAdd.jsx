import React, {useState} from "react";
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";

// NOTIFICATION
import {toast} from "react-hot-toast";
// AXIOS
import axios from "axios";


const AvailabilityAdd = () => {
    // STATES
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [course, setCourse] = useState({
        user: "",
        sectionType: "",
        courseId: "",
        sectionId: "",
    });

    // SUBMIT FORM
    const handleSubmit = (e) => {
        e.preventDefault();
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        // Process form submission or validation here
        // Check if all fields are filled
        if (!course.user || !course.sectionType || !course.courseId) {
            toast.error("Please fill all Required fields");
            return;
        }

        // Create FormData object
        const formData = new FormData();
        // Append data to FormData object
        formData.append("userId", course.user);
        formData.append("sectionType", course.sectionType);
        if (course.courseId) {
            formData.append("courseId", course.courseId || "");
        }
        formData.append("sectionId", course.sectionId || "");

        // set the loading to true
        setLoading(true);

        // Send the form data to the server
        axios.post(`${process.env.API_URL}/add/user/material`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((res) => {
                // set the loading to false
                setLoading(false);
                // show success message
                toast.success(res.data?.message || "Successfully Added");
                // reset the form
                setCourse({
                    user: "",
                    sectionType: "",
                    courseId: "",
                    sectionId: "",
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


    // EFFECT TO GET THE DROPDOWN USERS FROM THE SERVER
    React.useEffect(() => {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

            // GET THE CATEGORIES
            axios.get(`${process.env.API_URL}/all/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    const users = res.data.users.map((user) => {
                        return {
                            label: user.clientName,
                            value: user._id,
                        };
                    });
                    setUsers(users);
                })
                .catch((err) => {
                    console.log(err.response);
                });

    }, [])

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
                                label: section.courseTitle,
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
                <h1 className="text-2xl mb-5 uppercase">ADD CONTENT TO CLIENT</h1>

                <div className="p-fluid formgrid grid">

                    <div className="field col-12">
                        <label htmlFor="user">User *</label>
                        <Dropdown
                            id="user"
                            value={course.user}
                            onChange={(e) =>
                                setCourse({
                                    ...course,
                                    user: e.target.value,
                                })}
                            placeholder="User"
                            options={users || []}
                        />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="sectionType">Section Type *</label>
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
                                // {label: "Section", value: "sub"},
                                {label: "Course", value: "course"},
                            ]}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="courseId">Course *</label>
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

export default AvailabilityAdd;
