import {Button, HStack, IconButton, Input, Spacer, StackDivider, Text, useToast, VStack} from "@chakra-ui/react";
import {useState} from "react";
import {FaCheck, FaTrash} from "react-icons/fa";
import {FaRotateLeft} from "react-icons/fa6";
import useTodos, {Todo} from "../hooks/useTodo.tsx";


export default function Todos() {
    const toast = useToast();
    const [description, setDescription] = useState('');
    const {todos, addTodo, removeTodo, updateTodo} = useTodos();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        addTodo(
            description,
            () => toast({
                status: 'success',
                title: 'Success',
                description: 'Todo has been successfully added'
            }),
            () => toast({
                status: 'error',
                title: 'Error',
                description: 'Failed to add todo'
            }));
    }

    const deleteTodo = (id: string) => {
        removeTodo(
            id,
            () => toast({
                status: 'success',
                title: 'Success',
                description: 'Todo has been successfully deleted'
            }),
            () => toast({
                status: 'error',
                title: 'Error',
                description: 'Failed to delete todo'
            }))
    }

    const update = ({todoId, description, done}: Todo) => {
        updateTodo(
            todoId,
            {description: description, done},
            () => toast({
                status: 'success',
                title: 'Success',
                description: 'Todo has been successfully updated'
            }),
            () => toast({
                status: 'error',
                title: 'Error',
                description: 'Failed to update todo'
            }))
    }

    return (
        <VStack p={4} spacing={10}>
            <form onSubmit={handleSubmit}>
                <HStack mt='8'>
                    <Input maxLength={80}
                           variant='filled'
                           placeholder="Let's todo this!"
                           value={description}
                           onChange={(e) => setDescription(e.target.value)}
                    />
                    <Button colorScheme='pink' px='8' type='submit'>
                        Add Todo
                    </Button>
                </HStack>
            </form>

            {todos.length > 0 &&
                <VStack divider={<StackDivider/>}
                        borderColor='gray.100'
                        borderWidth='2px'
                        p='4'
                        borderRadius='lg'
                        w='100%'
                        maxW={{base: '90vw', sm: '80vw', lg: '50vw', xl: '40vw'}}
                        alignItems='stretch'>
                    {todos.map((todo) => (
                        <HStack key={todo.todoId}>
                            <Text as={todo.done ? "s" : undefined}>{todo.description}</Text>
                            <Spacer/>
                            <IconButton aria-label={`Mark as ${todo.done ? 'uncompleted' : 'completed'}`}
                                        icon={todo.done ? <FaRotateLeft></FaRotateLeft> : <FaCheck/>}
                                        isRound={true}
                                        onClick={() => update({...todo, done: !todo.done})}/>
                            <IconButton aria-label={"Delete todo"}
                                        icon={<FaTrash/>}
                                        isRound={true}
                                        onClick={() => deleteTodo(todo.todoId)}/>
                        </HStack>
                    ))}
                </VStack>
            }

        </VStack>
    )
}