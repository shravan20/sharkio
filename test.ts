import { JsonDB, Config } from "node-json-db";

// The first argument is the database filename. If no extension, '.json' is assumed and automatically added.
// The second argument is used to tell the DB to save after each push
// If you put false, you'll have to call the save() method.
// The third argument is to ask JsonDB to save the database in an human readable format. (default false)
// The last argument is the separator. By default it's slash (/)
async function test() {
  var db = new JsonDB(new Config("myDataBase", true, true, "/"));

  // Pushing the data into the database
  // With the wanted DataPath
  // By default the push will override the old value

  // You can also push directly objects
  await db.push("/test3", [{ test: "test", json: { test: ["test123123"] } }]);
  console.log(await db.exists("/t3"));
  let data = await db.getData("/test3");
  console.log(data);
  data = [
    ...data,
    {
      test: "test",
      json: { test: [...data, "test", 123, 123] },
    },
  ];

  await db.push("/test3", data);

  data = await db.getData("/test3");
  console.log(data);

  // await db.push("/test4", { test: "test", json: { test: ["test"] } });
  // await db.push("/test5", { test: "test", json: { test: ["test"] } });
}

test();
