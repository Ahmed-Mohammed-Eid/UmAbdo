import React, {useContext} from "react";

import Image from "next/image";
// AXIOS
import axios from "axios";
import {LayoutContext} from "@/layout/context/layoutcontext";

export default function Home() {

    // CONTEXT
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <>
            <div className="card" style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "580px",
                marginBottom: "0",
            }}>
                <Image
                    src={`/IMAGES/logo-${
                        layoutConfig.colorScheme === "light"
                            ? "white"
                            : "white"
                    }.png`}
                    alt="Sakai logo"
                    width={300}
                    height={300}
                />
            </div>
        </>
    );
}

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