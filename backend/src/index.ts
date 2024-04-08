import express, {Request, Response} from "express"
import serverless from "serverless-http"
import cors from "cors"
import {Service} from "./service";
import {validateNewTodo, validateUpdateTodo} from "./validator";
import {CreateTodoModel, UpdateTodoModel} from "./models";
import {authorizationMiddleware} from "./authorizationMiddleware";

const app = express();
const service = new Service();

// For demo
app.options('*', cors(
    {maxAge: 3600}
))
app.use(express.json());
app.use(authorizationMiddleware);

app.get("/todos", async (req: Request, res: Response) => {
    try {
        const todos = await service.getTodos(req.subject);
        res.json(todos);
    } catch (error) {
        console.error("Failed getting todos", error);
        res.status(500).json({error: "Could not retrieve todos"});
    }
});

app.post("/todos", async (req: Request, res: Response) => {
    const body = req.body as CreateTodoModel
    const errors = validateNewTodo(body);

    if (Object.keys(errors).length !== 0) {
        res.status(400).json(errors);
        return;
    }

    try {
        const todo = await service.createTodo(req.subject, body);
        res.status(201).json(todo)
    } catch (error) {
        console.error("Error while creating todo", error);
        res.status(500).json({error: "Could not create todo"});
    }
});

app.get("/todos/:id", async (req: Request, res: Response) => {
    try {
        const todo = await service.getTodo(req.subject, req.params.id)
        if (todo) {
            res.json(todo);
        } else {
            res.status(404)
                .json({error: 'Could not find todo'});
        }
    } catch (error) {
        console.error("Failed getting todo", error);
        res.status(500).json({error: "Could not retrieve todo"});
    }
});

app.delete("/todos/:id", async (req: Request, res: Response) => {
    try {
        const id = await service.deleteTodo(req.subject, req.params.id)
        res.json({id})
    } catch (error) {
        console.error("Failed deleting todo", error);
        res.status(500).json({error: "Could not delete todo"});
    }
});

app.patch("/todos/:id", async function (req: Request, res: Response) {
    const body = req.body as UpdateTodoModel
    const errors = validateUpdateTodo(body);

    if (Object.keys(errors).length !== 0) {
        res.status(400).json(errors);
        return;
    }

    try {
        const updatedTodo = await service.updateTodo(req.subject, req.params.id, body)
        res.json(updatedTodo)
    } catch (error) {
        console.error("Failed to update todo", error);
        res.status(500).json({error: "Could not update todo"});
    }
});

app.use((_req: Request, res: Response, next) => {
    return res.status(404).json({
        error: "Not Found",
    });
});


module.exports.handler = serverless(app);
