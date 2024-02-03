import React from "react";
import AvailabilityAdd from "@/components/UsersForm/AvailabilityAdd";

function createCourier() {
    return <AvailabilityAdd />;
}

export default createCourier;

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