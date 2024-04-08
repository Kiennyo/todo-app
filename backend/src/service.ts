import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand
} from "@aws-sdk/lib-dynamodb";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {CreateTodoModel, Todo, UpdateTodoModel} from "./models";
import {IGetCommandOutput, IQueryCommandOutput, IUpdateCommandOutput} from "./types";
import {ulid} from "ulid";

export class Service {

    private readonly todosTable: string;
    private readonly docClient: DynamoDBDocumentClient;

    public constructor() {
        this.todosTable = process.env.TODOS_TABLE as string;
        this.docClient = DynamoDBDocumentClient.from(new DynamoDBClient(
            process.env.IS_OFFLINE ? {
                endpoint: "http://localhost:8000",
                credentials: {
                    accessKeyId: "accessKeyId",
                    secretAccessKey: "secretAccessKey"
                }
            } : []
        ));
    }

    public async getTodo(userId: string, id: string): Promise<Todo | undefined> {
        const command = new GetCommand({
            TableName: this.todosTable,
            Key: {
                todoId: id,
                userId: userId
            },
        });

        const {Item} = await this.docClient.send(command) as IGetCommandOutput<Todo>;

        return Item
    }

    /*
    * Could make pageable by returning LastEvaluatedKey as base64 to the client and he would send me this value
    * which I could put as ExclusiveStartKey
    * */
    public async getTodos(userId: string): Promise<Todo[]> {
        const command = new QueryCommand({
            TableName: this.todosTable,
            KeyConditionExpression:
                "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId,
            },
            // ExclusiveStartKey: {}, use this for pageable / infinite scrolling
            ConsistentRead: true,
        });

        const {Items} = await this.docClient.send(command) as IQueryCommandOutput<Todo[]>

        return Items || []
    }

    public async createTodo(userId: string, model: CreateTodoModel): Promise<Todo | undefined> {
        const todo: Todo = {
            todoId: ulid(),
            userId: userId,
            description: model.description,
            done: false,
            created_at: Date.now().toString(),
            updated_at: Date.now().toString()
        }

        const command = new PutCommand({
            TableName: this.todosTable,
            Item: todo,
        });

        await this.docClient.send(command)

        return todo
    }

    public async deleteTodo(userId: string, id: string): Promise<String> {
        const command = new DeleteCommand({
            TableName: this.todosTable,
            Key: {
                todoId: id,
                userId: userId
            },
        })

        await this.docClient.send(command)

        return id
    }

    public async updateTodo(userId: string, id: string, update: UpdateTodoModel): Promise<Todo | undefined> {
        const command = new UpdateCommand({
            TableName: this.todosTable,
            Key: {
                todoId: id,
                userId: userId
            },
            UpdateExpression: "SET description = :description, done = :done, updated_at = :updated_at",
            ExpressionAttributeValues: {
                ":description": update.description,
                ":done": update.done,
                ":updated_at": Date.now().toString()
            },
            ReturnValues: "ALL_NEW"
        })
        const {Attributes} = await this.docClient.send(command) as IUpdateCommandOutput<Todo>;

        return Attributes;
    }
}
