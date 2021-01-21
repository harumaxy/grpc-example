import * as grpc from "grpc";
import * as protoLoader from "@grpc/proto-loader";

const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage as any;

const client = new todoPackage.Todo(
  "localhost:40000",
  grpc.credentials.createInsecure()
);

const call: grpc.Call = client.readTodosStream();
call.on("data", (item) => {
  console.log("recieved item from server " + JSON.stringify(item));
});
call.on("end", (e) => console.log("server done!"));

const input = process.argv[2];
client.createTodo(
  {
    id: -1,
    text: input ? input : "",
  },
  (err, response) => console.log(JSON.stringify(response))
);
