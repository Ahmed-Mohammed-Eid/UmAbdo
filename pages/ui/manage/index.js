import WhatsappManagement from "@/components/UiManagement/WhatsappManagement";

const SetWhatsapp = () => {

    return (
        <>
            <WhatsappManagement/>
        </>
    );
};

export default SetWhatsapp;

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