import {Button} from "@chakra-ui/react";

const VITE_COGNITO_UI = `${import.meta.env.VITE_COGNITO_UI}`

export default function Home() {

    const navigateToAuth = () => {
        window.location.replace(VITE_COGNITO_UI);
    }

    return (
        <Button onClick={navigateToAuth}>Login to get started</Button>
    )
}