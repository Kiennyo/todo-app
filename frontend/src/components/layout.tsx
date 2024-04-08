import {Heading, IconButton, useColorMode, VStack} from "@chakra-ui/react";
import {FaSun, FaMoon} from 'react-icons/fa';
import { Outlet } from "react-router-dom"

export default function Layout() {
    const {colorMode, toggleColorMode} = useColorMode();
    const isLight = colorMode === 'light';

    return (
        <VStack p={4}>
            <IconButton aria-label={`toggle ${isLight ? 'dark' : 'light'} mode`}
                        icon={isLight ? <FaSun/> : <FaMoon/>}
                        isRound={true}
                        size='lg'
                        alignSelf='flex-end'
                        onClick={toggleColorMode}/>
            <Heading mb='8'
                     fontWeight='extrabold'
                     size='2xl'
                     bgGradient='linear(to-r, pink.500, pink.300, blue.500)'
                     bgClip='text'>
                Todo Application
            </Heading>
            <main>
                <Outlet />
            </main>
        </VStack>
    );
}