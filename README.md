# Dynamo transaction test 
A test to attempt trigger transaction issues in DynamoDB.

## Assuming this is run in MacOS.

## How to setup:
1. Download the AWS DynamoDB Local from the AWS website.
2. Unzip it.
3. (Optional) Rename, or move the extracted folder to a more convenient location.
4. Connect to database:

You can run with the following command:
```bash
#!/bin/bash
cd /Users/developer/Documents/developer/dynamodb_local_latest
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb -port 8001 -dbPath ./datafolder
```
- `/Users/developer/Documents/developer/dynamodb_local_latest` is your path to extracted folder. You can replace it with
  your own path.
- `-port 8001` is the port number you want to use. You can replace it with your own port number. Applies to following
  bash commands
- `-dbPath ./datafolder` is the path to the folder where the database will be stored. You can replace it with your own
  path.

When the terminal shows the message
```
Initializing DynamoDB Local with the following configuration: 
Port: {your port number}, 
InMemory: false, 
DbPath: null,
 ...
```
it means the database is connected.

## After connect database?

1. Show all table in list
   ```bash
   aws dynamodb list-tables --endpoint-url http://localhost:{your port number}
   ```
   Expected output:
   ```
   {
     "TableNames": [
       "Table1",
       "Table2",
       ...
       ]
   }
   ```
   
2. Describe table: Get the schema of the table:
   ```con
   aws dynamodb describe-table --table-name {table name} --endpoint-url http://localhost:{your port number}
   ```
   Expected output:
   ```
   {
     "Table": {
       "AttributeDefinitions": [
         {
           "AttributeName": "id",
           "AttributeType": "S"
         },
         ...
   ],
     "TableName": "{table name}",
     "KeySchema": [
       {
         "AttributeName": "id",
         "KeyType": "HASH"
       }
     ],
     ...
     }
   }
   ```

3. When updating schema, you might need  to delete the table and create a new one. (Cautious and strongly discouraged).
   ```
   aws dynamodb delete-table --table-name {table name} --endpoint-url http://localhost:{your port number}
   ```

4. Check table data:
   ```
   aws dynamodb scan --table-name {table name} --endpoint-url http://localhost:{your port number}
   ```
