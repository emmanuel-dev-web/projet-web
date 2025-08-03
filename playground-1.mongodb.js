// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('alphatasks');

// Create a new document in the collection.
db.getCollection('utilisateurs').insertOne({
    email: "mandela.choco@gmail.com",
    password: "12345"

});
