//TOAST
import {toast} from "react-hot-toast";
//AXIOS
import axios from "axios";
//IMPORTS
import CategoryEdit from "@/components/CategoriesForms/CategoryEdit";


export default function EditCourier({id, category}) {

    return (
        <CategoryEdit id={id} category={category}/>
    )
}


export async function getServerSideProps(ctx) {
    // GET THE ID FROM THE URL
    const {id} = ctx.query;
    // GET THE TOKEN FROM THE REQUEST
    const {token} = ctx.req.cookies;
    // GET THE COURIER FROM THE API AND GET THE ORDERS FROM ANOTHER API ENDPOINT USING THE COURIER ID AND THEY BOTH NEED THE TOKEN

    // 02. GET THE COURIER
    const category = await axios.get(`${process.env.API_URL}/section/details`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            sectionId: id
        }
    })
        .then(res => res.data)
        .catch(err => err.response.data)

    // 03. RETURN THE PROPS TO THE COMPONENT WITH THE COURIER AND THE ORDERS DATA IF THEY EXIST
    if (category.success === true) {
        return {
            props: {
                id: id,
                category: category.section,
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