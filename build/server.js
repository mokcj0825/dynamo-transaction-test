"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dynamoose_1 = __importDefault(require("dynamoose"));
// Configure AWS
dynamoose_1.default.aws.ddb.local("http://localhost:8001");
// Define a basic schema for the 'test' table with the primary key 'id'
const schema = new dynamoose_1.default.Schema({
    id: {
        type: String,
        hashKey: true, // Designate 'id' as the hash key
    },
    // You can add other attributes here as necessary, even if not all items have them
    count: Number, // Optional attribute example
}, {
    // Table configuration options
    saveUnknown: true, // Allows saving attributes not explicitly defined in the schema
});
// Assuming a schemaless approach, define minimal structure for the item manipulation
const TestModel = dynamoose_1.default.model('test', schema, { create: false });
async function init() {
    await TestModel.table().initialize();
}
const app = (0, express_1.default)();
const port = 3000;
app.get('/start-transaction', async (req, res) => {
    // Assuming transaction operations are already being delayed via setTimeout
    try {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Simulate delay
        const result = await TestModel.update({ id: '001' }, { $ADD: { count: 1 } });
        console.log('Transaction Update Result:', result);
        res.send('Transaction has been initiated with a delay.');
    }
    catch (error) {
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
            await new Promise(resolve => setTimeout(resolve, 1000)); // Ensure non-blocking delay
        }
        res.json(readResults);
    }
    catch (error) {
        console.error('Error in /read-item:', error);
        res.status(500).send('Failed to read item');
    }
});
await init();
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
