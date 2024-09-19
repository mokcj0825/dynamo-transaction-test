import axios from 'axios';

const baseURL = 'http://localhost:3000'; // Adjust based on your server configuration

async function invokeApis() {
  console.log('Invoking APIs...');

  // Function to handle responses
  const handleResponse = (endpoint: string) => (response: any) => {
    console.log(`${endpoint} response:`, response.data);
  };

  // Function to handle errors
  const handleError = (endpoint: string) => (error: any) => {
    console.error(`${endpoint} error:`, error.message);
  };

  // Simultaneously start the transaction and attempt to interrupt it
  axios.get(`${baseURL}/start-transaction`)
    .then(handleResponse('/start-transaction'))
    .catch(handleError('/start-transaction'));

  // Introduce a slight delay before triggering the interruption to ensure the transaction has started
  setTimeout(() => {
    axios.get(`${baseURL}/trigger-interruption`)
      .then(handleResponse('/trigger-interruption'))
      .catch(handleError('/trigger-interruption'));
  }, 1); // Delay can be adjusted based on when you want the interruption to occur
}

// Run the function to invoke APIs
invokeApis();
