import {useContext, createContext, useState, useEffect} from "react";

interface AuthContextType {
    setTokens: (code: string) => Promise<void>;
    accessToken: string;
    isAuthenticated: boolean
}

interface TokenResponse {
    id_token: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}

interface RefreshTokenResponse extends Omit<TokenResponse, "refresh_token"> {}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const TOKEN_API = `${import.meta.env.VITE_COGNITO_URL}/oauth2/token`;
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_COGNITO_REDIRECT_URI;

const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string>("");

    useEffect(() => {
        refreshAccessToken()
            .catch((err) => console.warn("Failed getting access token", err))
    }, []);

    // used by callback component
    const setTokens = async (code: string): Promise<void> => {
        const queryParams = {
            grant_type: "authorization_code",
            code,
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI
        }
        const queryString = new URLSearchParams(queryParams).toString();
        try {
            const res = await fetch(`${TOKEN_API}?${queryString}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            const tokens = await (await res.json() as Promise<TokenResponse>);
            setAccessToken(tokens.access_token)
            localStorage.setItem("refresh_token", tokens.refresh_token);
        } catch (err) {
            return console.warn("Failed getting tokens", err);
        }
    }

    // If fails, logout
    const refreshAccessToken = async (): Promise<void> => {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
            try {
                const res = await fetch(`${TOKEN_API}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: Object.entries({
                        grant_type: "refresh_token",
                        client_id: CLIENT_ID,
                        redirect_uri: REDIRECT_URI,
                        refresh_token: refreshToken
                    }).map(([k, v]) => `${k}=${v}`).join("&")
                });
                const tokens = await (await res.json() as Promise<RefreshTokenResponse>);
                setAccessToken(tokens.access_token);
            } catch (err) {
                console.warn("Failed refreshing access token", err);
            }
        }
    }

    return (
        <AuthContext.Provider value={{isAuthenticated: !!accessToken, accessToken, setTokens}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    return useContext(AuthContext);
};

export default AuthProvider;
