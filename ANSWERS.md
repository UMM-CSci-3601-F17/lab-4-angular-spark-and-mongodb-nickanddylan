## 1.
The server makes String 'accessControlRequestHeaders',
as well as 'accessControlRequestMethod'.
These are essentially used to let the server
know that HTTP methods and headers will be used in the requests.

The way that the UserController constructuor is 
different is that rather than implementing and 
referencing a Java class, it is referencing a 'database'
variable that is an actual MongoDatabase object.
This is then used to make 'userCollection',
which simply retrieves the users from the database.

## 2.
The first noticeable change is that there are now two 'getUser'
methods. One essentially places the other (the one that actually gets
a user) in a try/catch block where, if the ladder methods fails,
a helpful error message is displayed explaining why a user was
not able to be retrieved.

As for the getUser method that is called in the try/catch,
it simply iterates through the userCollection of the database
and, assuming the id exists within the DB, it retrieves it and is
returned to the initial method.

## 3.
The 'age' query parameter is handled within 'getUsers', where
the method essentially checks to see if one is provided.
From that point, the Document object 'filterDoc' is 
appended by the age specified in the query parameter.
Then the userCollection is iterated through to filter users
of that given age.

## 4.
A Document object uses an implementation of the Map object,
where the key is a String and given value is an Object of any given type.
The way we are using them is making the key the age key of the User objects in the DB,
and the value the specified query parameter. This allows for specification
of both the exact key we want, and value of that key.
Whatever is found is then returned as serialized JSON data.

## 5.
The 'clear' part of the method name is due to the fact that we are clearing the
test db of any actual user data, as we would not want to interact
with actual data in our tests. An arraylist is then populated with
new userdata made on the spot. As well as an object titled 'sam', with
specific userdata.
The userDocuments collection is then filled with all of this freshly
made data, so that we can run tests on it.

## 6.
It basically tests the 'age' conditional aspect of getUsers.
It does this by passing in a map in the same way that it would
receive the 'age' query parameter in a server route request.
It looks for users at age 37, and because we made two test users 
at age 37, it expects to find two.
