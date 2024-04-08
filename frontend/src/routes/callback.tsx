import {useEffect} from "react";
import {useAuth} from "../hooks/useAuth.tsx";
import { useNavigate } from "react-router-dom";

export default function Callback() {
    const {setTokens} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code') || "";
        setTokens(code)
            .then(() => navigate("/todos"))
    }, []);

    return (
        <></>
    )
}