//AXIOS
import axios from "axios";
//IMPORTS
import MediaEdit from "@/components/MediaForms/MediaEdit";


export default function EditCourier({id, media}) {

    return (
        <MediaEdit id={id} media={media}/>
    )
}


export async function getServerSideProps(ctx) {
    // GET THE ID FROM THE URL
    const {id} = ctx.query;
    // GET THE TOKEN FROM THE REQUEST
    const {token} = ctx.req.cookies;
    // GET THE COURIER FROM THE API AND GET THE ORDERS FROM ANOTHER API ENDPOINT USING THE COURIER ID AND THEY BOTH NEED THE TOKEN

    // IF TOKEN NOT FOUND, REDIRECT TO LOGIN PAGE
    if (!token) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    // 02. GET THE COURIER
    const media = await axios.get(`${process.env.API_URL}/get/media`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            mediaId: id
        }
    })
        .then(res => res.data)
        .catch(err => err.response.data)

    // 03. RETURN THE PROPS TO THE COMPONENT WITH THE COURIER AND THE ORDERS DATA IF THEY EXIST
    if (media.success === true) {
        return {
            props: {
                id: id,
                media: media.media,
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