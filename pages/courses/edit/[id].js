//TOAST
import {toast} from "react-hot-toast";
//AXIOS
import axios from "axios";
//IMPORTS
import CoursesEdit from "@/components/CoursesForms/CoursesEdit";


export default function EditCourier({id, course}) {

    return (
        <CoursesEdit id={id} course={course}/>
    )
}


export async function getServerSideProps(ctx) {
    // GET THE ID FROM THE URL
    const {id} = ctx.query;
    // GET THE TOKEN FROM THE REQUEST
    const {token} = ctx.req.cookies;
    // GET THE COURIER FROM THE API AND GET THE ORDERS FROM ANOTHER API ENDPOINT USING THE COURIER ID AND THEY BOTH NEED THE TOKEN

    // IF NO TOKEN REDIRECT TO LOGIN PAGE
    if (!token) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    // 02. GET THE COURIER
    const course = await axios.get(`${process.env.API_URL}/course`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            courseId: id
        }
    })
        .then(res => res.data)
        .catch(err => err.response.data)

    // 03. RETURN THE PROPS TO THE COMPONENT WITH THE COURIER AND THE ORDERS DATA IF THEY EXIST
    if (course.success === true) {
        return {
            props: {
                id: id,
                course: course.course,
            }
        }
    }
    // 04. IF THE COURIER OR THE ORDERS DOESN'T EXIST RETURN THE PROPS WITH THE ID ONLY
    else {
        return {
            props: {
                id: id
            }
        }
    }
}