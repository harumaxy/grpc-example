import * as grpc from "grpc";
import * as protoLoader from "@grpc/proto-loader";

// loadsync() : 第二引数は、大文字をどうするかなどの読み込み設定を入れる
const packageDef = protoLoader.loadSync("todo.proto", {});

const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage as any;
const server = new grpc.Server();
// とりあえずお試しなので、第二引数は createInsecure()
// セキュリティ意識して作るときは createSSL()
server.bind("localhost:40000", grpc.ServerCredentials.createInsecure());

const todos: Array<any> = [];

const readTodosStream = (call, callback) => {
  todos.forEach((t) => call.write(t));
  call.end();
};

const readTodos = (_call, callback) => {
  callback(null, { items: todos });
};

const createTodo = (call, callback) => {
  const item = {
    id: todos.length + 1,
    text: call.request.text,
  };
  console.log(item);
  todos.push(item);
  callback(null, item);
};

server.addService(todoPackage.Todo.service, {
  createTodo,
  readTodos,
  readTodosStream,
});

server.start();
