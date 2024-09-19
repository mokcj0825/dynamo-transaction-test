import express from 'express';
import dynamoose from 'dynamoose';

// Configure AWS
dynamoose.aws.ddb.local("http://localhost:8001");

// Define a basic schema for the 'test' table with the primary key 'id'
const schema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true, // Designate 'id' as the hash key
  },
  // You can add other attributes here as necessary, even if not all items have them
  count: Number, // Optional attribute example
}, {
  // Table configuration options
  saveUnknown: true,  // Allows saving attributes not explicitly defined in the schema
});

// Assuming a schemaless approach, define minimal structure for the item manipulation
const TestModel = dynamoose.model('test', schema);
async function init() {
  await TestModel.table().create();
}
(async () => {
  //await init();
})();

const app = express();
const port = 3000;

app.get('/start-transaction', async (req, res) => {
  // Assuming transaction operations are already being delayed via setTimeout
  try {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Simulate delay
    await dynamoose.transaction([
      TestModel.transaction.update({ id: '001' },
        { $ADD: { count: 1 } },
      ),
    ])
    res.send('Transaction has been initiated with a delay.');
  } catch (error) {
    console.error('Error in /start-transaction:', error);
    res.status(500).send('Failed to initiate transaction');
  }
});

app.get('/read-item', async (req, res) => {
  let readResults = [];
  let startTime = Date.now();
  try {
    for (let i = 0; i < 10; i++) {
      const item = await TestModel.get({ id: '001' });
      readResults.push({ time: Date.now() - startTime, item });
      await new Promise(resolve => setTimeout(resolve, 10)); // Ensure non-blocking delay
    }
    res.json(readResults);
  } catch (error) {
    console.error('Error in /read-item:', error);
    res.status(500).send('Failed to read item');
  }
});

app.get('/trigger-interruption', async (req, res) => {
  try {
    // Immediately update the item to change the count unexpectedly
    await TestModel.update({ id: '001' }, { $ADD: { count: 5 } });
    res.send('Interruption trigger executed.');
  } catch (error) {
    console.error('Error in /trigger-interruption:', error);
    res.status(500).send('Failed to trigger interruption');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
