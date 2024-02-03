import React from "react";
import {Dropdown} from "primereact/dropdown";
import {Calendar} from "primereact/calendar";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
// AXIOS
import axios from "axios";

function Reports() {

    //STATES
    const [loading, setLoading] = React.useState(false);
    const [reportType, setReportType] = React.useState("");
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");

    function handleSubmit(e) {
        e.preventDefault();
        //GET THE TOKEN FROM LOCAL STORAGE

        // SET THE LOADING STATE TO TRUE
        setLoading(true);
        // MAKE THE API CALL
        axios.get(`${process.env.API_URL}/reports`, {
            params: {
                reportType: reportType,
                startDate: startDate,
                endDate: endDate,
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
            .then((res) => {
                // SET THE LOADING STATE TO FALSE
                setLoading(false);
                // OPEN THE URL IN A NEW TAB
                const timer = setTimeout(() => {
                    window.open(res.data.url, "_blank");
                    clearTimeout(timer);
                }, 1000);
            })
            .catch((err) => {
                console.log(err);
                // SET THE LOADING STATE TO FALSE
                setLoading(false);
            });
    }

    return (
        <>
            <form onSubmit={handleSubmit} className={"col-12 card"}>
                <h1 className="text-2xl mb-5 uppercase">GET Report</h1>

                <div className="p-fluid formgrid grid">

                    <div className="field col-12">
                        <label htmlFor="reportType">Report Type</label>
                        <Dropdown
                            id="reportType"
                            value={reportType}
                            onChange={(e) => {
                                setReportType(e.target.value);
                            }}
                            placeholder="Report Type"
                            options={[
                                {label: "Transactions", value: "transactions"},
                            ]}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="startDate">Start Date</label>
                        <Calendar
                            id="startDate"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                            }}
                            placeholder="Start Date"
                            dateFormat="dd/mm/yy"
                            showIcon={true}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="endDate">End Date</label>
                        <Calendar
                            id="endDate"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                            }}
                            placeholder="End Date"
                            dateFormat="dd/mm/yy"
                            showIcon={true}
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
}

export default Reports;

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