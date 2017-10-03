package umm3601.todo;

    import com.mongodb.BasicDBObject;
    import com.mongodb.MongoClient;
    import com.mongodb.client.MongoCollection;
    import com.mongodb.client.MongoDatabase;
    import org.bson.*;
    import org.bson.codecs.*;
    import org.bson.codecs.configuration.CodecRegistries;
    import org.bson.codecs.configuration.CodecRegistry;
    import org.bson.json.JsonReader;
    import org.bson.types.ObjectId;
    import org.junit.Before;
    import org.junit.Test;

    import java.io.IOException;
    import java.util.*;
    import java.util.stream.Collectors;

    import static org.junit.Assert.assertEquals;

public class TodoControllerSpec {
    private TodoController todoController;
    private ObjectId samsId;
    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> todoDocuments = db.getCollection("todos");
        todoDocuments.drop();
        List<Document> testTodos = new ArrayList<>();
        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Jake\",\n" +
            "                    status: true,\n" +
            "                    body: \"Find my children. The frogs took them\",\n" +
            "                    category: \"hands\"\n" +
            "                }"));
        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Sarah\",\n" +
            "                    status: true,\n" +
            "                    body: \"blah blah\",\n" +
            "                    category: \"asdf\"\n" +
            "                }"));
        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Amy\",\n" +
            "                    status: false,\n" +
            "                    body: \"I just really like frogs\",\n" +
            "                    category: \"Frogs\"\n" +
            "                }"));

        samsId = new ObjectId();
        BasicDBObject sam = new BasicDBObject("_id", samsId);
        sam = sam.append("owner", "Sam")
            .append("status", false)
            .append("body", "don't let the frogs get away")
            .append("category", "Frogs");



        todoDocuments.insertMany(testTodos);
        todoDocuments.insertOne(Document.parse(sam.toJson()));

        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.
        todoController = new TodoController(db);
    }

    // http://stackoverflow.com/questions/34436952/json-parse-equivalent-in-mongo-driver-3-x-for-java
    private BsonArray parseJsonArray(String json) {
        final CodecRegistry codecRegistry
            = CodecRegistries.fromProviders(Arrays.asList(
            new ValueCodecProvider(),
            new BsonValueCodecProvider(),
            new DocumentCodecProvider()));

        JsonReader reader = new JsonReader(json);
        BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

        return arrayReader.decode(reader, DecoderContext.builder().build());
    }

    private static String getOwner(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("owner")).getValue();
    }

    @Test
    public void getAllTodos() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = todoController.getTodos(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 todos", 4, docs.size());
        List<String> owners = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedOwners = Arrays.asList("Amy", "Jake", "Sam", "Sarah");
        assertEquals("Names should match", expectedOwners, owners);
    }

    @Test
    public void getTodosWhoSpecializeInFrogs() {
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("category", new String[] { "Frogs" });
        String jsonResult = todoController.getTodos(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 2 todos", 2, docs.size());
        List<String> names = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedOwners = Arrays.asList("Amy", "Sam");
        assertEquals("Owners should match", expectedOwners, names);
    }

    @Test
    public void getSamById() {
        String jsonResult = todoController.getTodo(samsId.toHexString());
        Document sam = Document.parse(jsonResult);
        assertEquals("Owner should match", "Sam", sam.get("owner"));
    }

    @Test
    public void getBodiesThatIncludeFrogs(){
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("body", new String[] { "frogs" });
        String jsonResult = todoController.getTodos(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        assertEquals("Should be 3 todos", 3, docs.size());
        List<String> names = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedOwners = Arrays.asList("Amy","Jake", "Sam");
        assertEquals("Owners should match", expectedOwners, names);
    }

}
