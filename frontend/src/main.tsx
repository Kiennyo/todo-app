import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import './index.css'
import Layout from "./components/layout.tsx";
import ErrorPage from "./components/error-page.tsx";
import {ChakraProvider, ColorModeScript, extendTheme} from "@chakra-ui/react";
import Todos from "./routes/todos.tsx";
import Home from "./routes/home.tsx";
import AuthProvider from "./hooks/useAuth.tsx";
import Callback from "./routes/callback.tsx";
import ProtectedRoute from "./components/protected-route.tsx";

const theme = extendTheme({
    initialColorMode: 'light',
    useSystemColorMode: false,
});

const router = createBrowserRouter([
    {
        element: <Layout/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path: "/todos",
                element: <ProtectedRoute><Todos/></ProtectedRoute>
            },
            {
                path: "/callback",
                element: <Callback/>
            }
        ]
    },
    {

    }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ChakraProvider toastOptions={{ defaultOptions: { position: 'top-right' } }}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
            <AuthProvider>
                <RouterProvider router={router}/>
            </AuthProvider>
        </ChakraProvider>
    </React.StrictMode>,
)
