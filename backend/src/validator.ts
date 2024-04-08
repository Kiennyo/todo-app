import {CreateTodoModel, UpdateTodoModel} from "./models";

type Errors = Record<string, string>

const MAX_LENGTH = 80;

export const validateNewTodo = (body: CreateTodoModel): Errors => {
    const errors: Errors = {}
    const {description} = body;

    validateDescription(description, errors);

    return errors
}

export const validateUpdateTodo = (body: UpdateTodoModel): Errors => {
    const errors: Errors = {}
    const {description, done } = body;

    validateDescription(description, errors);

    if (done === undefined || typeof done !== "boolean") {
        errors['done'] = `is required and must be a boolean`;
    }

    return errors
}

const validateDescription = (description: string, errors: Errors): void => {
    if (!description || typeof description !== "string" || description.length < 1 || description.length > MAX_LENGTH) {
        errors['description'] = `is required, must be a string, have to be between 1 and ${MAX_LENGTH} characters`;
    }
}
