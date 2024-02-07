import React, {useEffect, useState} from "react";
import {InputText} from "primereact/inputtext";
import {Checkbox} from 'primereact/checkbox';
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
import {toast} from "react-hot-toast";
import axios from "axios";

export default function WhatsappManagement() {

    // STATES
    const [loading, setLoading] = useState(false);
    const [whatsapp, setWhatsapp] = React.useState('');
    const [price, setPrice] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        if(!whatsapp) {
            toast.error("Whatsapp number is required");
            return;
        }

        setLoading(true);

        axios.put(`${process.env.API_URL}/ui/settings`, {whatsappNumber: whatsapp, hidePrice: price}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                setLoading(false);
                toast.success(res.data?.message || "Data updated successfully");
            })
            .catch((err) => {
                setLoading(false);
                toast.error(err.response?.data?.message || "Something went wrong");
            })
    }

    useEffect(() => {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        axios.get(`${process.env.API_URL}/get/settings`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                setWhatsapp(res.data?.whatsappNumber);
                setPrice(res.data?.hidePrice);
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || "Something went wrong");
            })
    }, []);

    return (
        <>
            <form onSubmit={handleSubmit} className={"col-12 card"}>
                <h1 className="text-2xl mb-5 uppercase">Manage Whatsapp</h1>

                <div className="p-fluid formgrid grid">

                    <div className="field col-12">
                        <label htmlFor="whatsappNumber">Whatsapp Number</label>
                        <InputText
                            id="whatsappNumber"
                            value={whatsapp}
                            onChange={(e) =>
                                setWhatsapp(e.target.value)
                            }
                            placeholder="Whatsapp Number"
                        />
                    </div>

                    <div className="field col-12" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: '1rem',
                    }}>
                        <Checkbox
                            inputId={"priceSettings"}
                            name="priceSettings"
                            onChange={(e) => {
                                setPrice(e.checked);
                            }}
                            checked={price}
                        />
                        <label
                            htmlFor="priceSettings"
                            style={{
                                marginBottom: '0',
                                userSelect: 'none',
                            }}
                        >
                            Hide Price
                        </label>
                    </div>

                    <div className="w-1/2 ml-auto mr-2">
                        <Button
                            type="submit"
                            className="bg-slate-500"
                            style={{
                                background: loading
                                    ? "#dcdcf1"
                                    : "var(--primary-color)",
                                width: '280px',
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
    )
}