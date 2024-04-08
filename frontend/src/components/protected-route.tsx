import {useAuth} from "../hooks/useAuth.tsx";
import Home from "../routes/home.tsx";

export default function ProtectedRoute({children}: {children: React.ReactNode}) {
    const {isAuthenticated} = useAuth();

    return (
        <>
            {isAuthenticated ? children : <Home />}
        </>
    )
}