import {useEffect, useState} from 'react';
import {useAuth} from "./useAuth.tsx";

export interface Todo {
    todoId: string;
    userId: string;
    description: string;
    done: boolean;
    created_at: string;
    updated_at: string;
}

const API_URL = `${import.meta.env.VITE_API_URL}/todos`

const useTodos = () => {
    const {accessToken} = useAuth();
    const [todos, setTodos] = useState<Todo[]>([]);

    const headers = {
        "Authorization": accessToken
    }

    useEffect(() => {
        if (!accessToken) {
            return;
        }
        fetch(API_URL, {
            headers: {
                "Authorization": accessToken
            }
        })
            .then((r) => r.json())
            .then((t) => setTodos(t))
            .catch((err) => console.warn("Failed getting todos", err))
    }, [accessToken]);

    const addTodo = (description: string, onSuccess: () => void, onError: () => void) => {
        fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({description}),
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        })
            .then((r) => r.json())
            .then((todo) => {
                setTodos((prev) => [...prev, todo])
                onSuccess()
            })
            .catch(() => onError())
    };

    const removeTodo = (id: string, onSuccess: () => void, onError: () => void) => {
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers
        })
            .then(() => {
                setTodos((prev) => prev.filter((todo) => todo.todoId !== id));
                onSuccess()
            })
            .catch((err) => {
                console.warn(err)
                onError()
            })
    };

    const updateTodo = (id: string,
                        update: Pick<Todo, 'description' | 'done'>,
                        onSuccess: () => void,
                        onError: () => void) => {
        fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(update),
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        })
            .then((r) => r.json())
            .then((updatedTodo) => {
                setTodos((prev) =>
                    prev.map((prevTodo) => prevTodo.todoId === id ? {...prevTodo, ...updatedTodo} : prevTodo)
                )
                onSuccess()
            })
            .catch((err) => {
                console.warn(`Failed to update todo`, err)
                onError()
            })
    };

    return {todos, addTodo, removeTodo, updateTodo};
};

export default useTodos;