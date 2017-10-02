package umm3601.todo;

import com.google.gson.Gson;
import com.mongodb.*;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Indexes;
import com.mongodb.client.model.Projections;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import spark.Request;
import spark.Response;

import java.util.Arrays;
import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;

public class TodoController {
    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> todoCollection;
    private MongoCollection<Document> todoSummary;
    //Construct a controller for todos
    // including initializing the collection of todos from the DB
    public TodoController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        todoCollection = database.getCollection("todos");
        todoCollection.createIndex(Indexes.text("body"));
    }

    /**
     * Get a JSON response with a list of all the users in the database.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return one user in JSON formatted string and if it fails it will return text with a different HTTP status code
     */
    public String getTodo(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String todo;
        try {
            todo = getTodo(id);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            res.status(400);
            res.body("The requested todo id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (todo != null) {
            return todo;
        } else {
            res.status(404);
            res.body("The requested todo with id " + id + " was not found");
            return "";
        }
    }


    /**
     * Get the single user specified by the `id` parameter in the request.
     *
     * @param id the Mongo ID of the desired user
     * @return the desired user as a JSON object if the user with that ID is found,
     * and `null` if no user with that ID is found
     */
    public String getTodo(String id) {
        FindIterable<Document> jsonTodos
            = todoCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonTodos.iterator();
        if (iterator.hasNext()) {
            Document user = iterator.next();
            return user.toJson();
        } else {
            // We didn't find the desired todo
            return null;
        }
    }


    /**
     * @param req
     * @param res
     * @return an array of users in JSON formatted String
     */
    public String getTodos(Request req, Response res)
    {
        res.type("application/json");
        return getTodos(req.queryMap().toMap());
    }

    /**
     * @param queryParams
     * @return an array of Users in a JSON formatted string
     */
    public String getTodos(Map<String, String[]> queryParams) {

        Document filterDoc = new Document();
        Iterable<Document> matchingTodos = todoCollection.find(filterDoc);
        if (queryParams.containsKey("owner")) {
            String targetOwner = queryParams.get("owner")[0];
            filterDoc = filterDoc.append("owner", targetOwner);
            matchingTodos = todoCollection.find(filterDoc);
        }
        if (queryParams.containsKey("status")) {
            String targetStatus = queryParams.get("status")[0];
            if (targetStatus.equals("complete")){
                filterDoc = filterDoc.append("status", true);
            }
            else if (targetStatus.equals("incomplete")){
                filterDoc = filterDoc.append("status", false);
            }
            matchingTodos = todoCollection.find(filterDoc);
        }
        if (queryParams.containsKey("category")) {
            String targetCategory = queryParams.get("category")[0];
            filterDoc = filterDoc.append("category", targetCategory);
             matchingTodos = todoCollection.find(filterDoc);
        }
        if (queryParams.containsKey("body")) {
            String targetBody = queryParams.get("body")[0];
            filterDoc = filterDoc.append("body", targetBody);

            System.err.println("The target string is <" + targetBody + ">");


            matchingTodos = todoCollection.aggregate(
                Arrays.asList(
                    Aggregates.match(
                        Filters.text(targetBody)
                    )
                )
            );
            // matchingTodos = todoCollection.find();
        }

        //FindIterable comes from mongo, Document comes from Gson
        //FindIterable<Document> matchingTodos = todoCollection.find(filterDoc);

        return JSON.serialize(matchingTodos);
    }

    public String todoSummary(Request req, Response res){

        Iterable<Document> jsonTodos = todoCollection.aggregate(
            Arrays.asList(
                Aggregates.project(
                  Projections.fields(
                      Projections.excludeId(),
                      Projections.include("owner"),
                      Projections.computed(
                         "firstCategory",
                         new Document("$arrayElemAt", Arrays.asList("$category", 0))
                        )
                    )
                )
            ));
        return JSON.serialize(jsonTodos);
    }

    Block<Document> printBlock = new Block<Document>() {
        @Override
        public void apply(final Document document) {
            System.out.println(document.toJson());
        }
    };

    /**
     *
     * @param req
     * @param res
     * @return
     */

    public boolean addNewTodo(Request req, Response res)
    {

        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String owner = dbO.getString("owner");
                    boolean status = dbO.getBoolean("status");
                    String body = dbO.getString("body");
                    String category = dbO.getString("category");

                    System.err.println("Adding new todo [owner=" + owner + ", status=" + status + " body=" + body + " category=" + category + ']');
                    return addNewTodo(owner, status, body, category);
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new todo request failed.");
                    return false;
                }

            }
            else
            {
                System.err.println("Expected BasicDBObject, received " + o.getClass());
                return false;
            }
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return false;
        }
    }

    /**
     *
     * @param owner
     * @param status
     * @param body
     * @param category
     * @return
     */
    public boolean addNewTodo(String owner, boolean status, String body, String category) {

        Document newTodo = new Document();
        newTodo.append("owner", owner);
        newTodo.append("status", status);
        newTodo.append("body", body);
        newTodo.append("category", category);

        try {
            todoCollection.insertOne(newTodo);
        }
        catch(MongoException me)
        {
            me.printStackTrace();
            return false;
        }

        return true;
    }

}
