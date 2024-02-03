import {useRouter} from "next/router";
import React, {useContext, useState} from "react";
import Image from "next/image";
// COMPONENTS
import AppConfig from "../layout/AppConfig";
import {Button} from "primereact/button";
import {Password} from "primereact/password";
import {LayoutContext} from "@/layout/context/layoutcontext";
import {InputText} from "primereact/inputtext";
import {classNames} from "primereact/utils";
import {ProgressSpinner} from "primereact/progressspinner";

// TOAST
import {toast} from "react-hot-toast";

// AXIOS
import axios from "axios";

const LoginPage = () => {
    // ROUTER
    const router = useRouter();
    // STATES
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    // CONTEXT
    const {layoutConfig} = useContext(LayoutContext);
    // REFS
    const usernameRef = React.useRef(null);

    const containerClassName = classNames(
        "surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden",
        {"p-input-filled": layoutConfig.inputStyle === "filled"}
    );

    async function login(event) {
        // DISABLE THE PAGE RELOADING
        event.preventDefault();
        // VALIDATE USERNAME AND PASSWORD
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        const passwordRegex = /^[a-zA-Z0-9]+$/;

        if (!usernameRegex.test(username)) {
            toast.error("Username is not valid");
            // ADD INVALID CLASS TO USERNAME INPUT
            usernameRef.current.classList.add("p-invalid");
            return;
        }

        if (!passwordRegex.test(password)) {
            toast.error("Password is not valid");
            return;
        }

        setLoading(true);
        // LOGIN
        axios
            .post(`${process.env.API_URL}/admin/login`, {
                username: username,
                password: password,
            })
            .then((res) => {
                setLoading(false);
                // SAVE TOKEN IN LOCAL STORAGE AND COOKIES AND THE ROLE OF THE USER
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("role", res.data.role);

                // SET THE COOKIES
                document.cookie = `token=${res.data.token}; path=/`;
                document.cookie = `role=${res.data.role}; path=/`;

                // REDIRECT TO HOME PAGE
                router.push("/").then(() => {
                    toast.success("Login Success");
                });
            })
            .catch((err) => {
                setLoading(false);
                toast.error(err.response?.data?.message || "Login Failed");
            });
    }

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <div className="flex gap-1 items-center">
                    <Image
                        src={`/IMAGES/logo-${
                            layoutConfig.colorScheme === "light"
                                ? "dark"
                                : "white"
                        }.svg`}
                        alt="Sakai logo"
                        className="mb-5 w-6rem flex-shrink-0"
                        width={100}
                        height={40}
                    />
                    {/*<div className="text-900 text-4xl font-medium">MANDOOB</div>*/}
                </div>
                <div
                    style={{
                        borderRadius: "56px",
                        padding: "0.3rem",
                        background:
                            "linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)",
                    }}
                >
                    <div
                        className="w-full surface-card py-8 px-5 sm:px-8"
                        style={{borderRadius: "53px"}}
                    >
                        <form
                            onSubmit={login}
                        >
                            <label
                                htmlFor="username"
                                className="block text-900 text-xl font-medium mb-2"
                            >
                                Username
                            </label>
                            <InputText
                                inputid="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                className="w-full md:w-30rem mb-5"
                                style={{padding: "1rem"}}
                                ref={usernameRef}
                            />

                            <label
                                htmlFor="password1"
                                className="block text-900 font-medium text-xl mb-2"
                            >
                                Password
                            </label>
                            <Password
                                inputid="password1"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                toggleMask
                                className="w-full mb-5"
                                inputClassName="w-full p-3 md:w-30rem"
                                feedback={false}
                            ></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5"></div>
                            <Button
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
                                        "Login"
                                    )
                                }
                                className="w-full p-3 text-xl"
                                type={'submit'}
                            ></Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple/>
        </React.Fragment>
    );
};
export default LoginPage;

// SERVER SIDE RENDERING FOR PROTECTED PAGES
export async function getServerSideProps(context) {
    // CHECK IF THE USER IS ALREADY LOGGED IN
    const token = context.req.cookies.token;
    if (token) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}