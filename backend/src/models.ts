export interface Todo {
    todoId: string;
    userId: string;
    description: string;
    done: boolean;
    created_at: string;
    updated_at: string;
}
export interface CreateTodoModel extends Pick<Todo, 'description'>{}
export interface UpdateTodoModel extends Pick<Todo, 'description' | 'done'>{}
