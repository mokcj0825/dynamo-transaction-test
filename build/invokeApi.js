"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const baseURL = 'http://localhost:3000'; // Adjust based on your server configuration
async function invokeApis() {
    console.log('Invoking APIs...');
    // Start the transaction with a slight delay to ensure read starts first
    //setTimeout(() => {
    //  axios.get(`${baseURL}/start-transaction`)
    //    .then(response => console.log('/start-transaction response:', response.data))
    //    .catch(error => console.error('/start-transaction error:', error.message));
    //}, 1000); // Delay start-transaction slightly to let read-item fire first
    // Start reading items immediately
    axios_1.default.get(`${baseURL}/read-item`)
        .then(response => {
        console.log('/read-item response:', response.data);
    })
        .catch(error => {
        console.error('/read-item error:', error.message);
    });
}
// Run the function to invoke APIs
invokeApis();
