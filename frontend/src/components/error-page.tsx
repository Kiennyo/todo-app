import {useRouteError} from "react-router-dom";
import {Box, ChakraProvider, Heading, Text} from "@chakra-ui/react";

export default function ErrorPage() {
    const error = useRouteError() as {statusText: number, message: string};

    return (
        <ChakraProvider>
            <Box p={8}
                 textAlign="center"
                 boxShadow="md"
                 borderRadius="md"
                 minH="100vh"
                 display="flex"
                 flexDirection="column"
                 justifyContent="center"
                 alignItems="center">
                <Heading as="h1" size="xl" mb={4} fontWeight="bold" color="red.500">
                    Oops!
                </Heading>
                <Text fontSize="lg" mb={6}>
                    Sorry, an unexpected error has occurred.
                </Text>
                <Text fontSize="sm" as={"i"}>
                    {error.statusText || error.message}
                </Text>
            </Box>
        </ChakraProvider>
    );
}