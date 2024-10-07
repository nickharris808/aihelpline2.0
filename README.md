# **AI-Powered SMS Chat Application**

## **Overview**

This application is an AI-powered SMS chat system that uses Plivo for SMS handling and OpenAI's GPT-3.5 for generating responses. It allows users to engage in conversations via SMS, with the AI providing contextual responses based on the conversation history.

## Key Features

1. SMS handling using Plivo
2. AI-powered responses using OpenAI's GPT-3.5
3. User opt-in/opt-out functionality
4. Conversation history tracking
5. Test endpoint for simulating SMS interactions

## How It Works

1. When a user sends an SMS to the Plivo number, Plivo forwards the message to our application.
2. The application checks if the user has opted in to the service.
3. If not opted in, the user is prompted to opt in.
4. Once opted in, the user's message is processed by the AI.
5. The AI generates a response based on the conversation history.
6. The response is sent back to the user via Plivo.

## Setup and Debugging

As this code was written by ChatGPT, it's important to carefully review and test each component. Here's a suggested order for setting up and debugging the application:

1. **Environment Setup**
   - Install Node.js and npm
   - Clone the repository
   - Run `npm install` to install dependencies

2. **Configuration**
   - Set up environment variables for Plivo and OpenAI credentials
   - Review and update any hardcoded values or configurations

3. **Database Setup**
   - Ensure MongoDB is installed and running
   - Check database connection in the application

4. **Plivo Setup**
   - Create a Plivo account and obtain Auth ID and Auth Token
   - Rent a Plivo phone number
   - Set up a Plivo application and link it to your webhook URL

5. **OpenAI Setup**
   - Obtain an API key from OpenAI
   - Ensure the correct model is being used in the code

6. **Code Review**
   - Carefully review `MessageController.js` for any logical errors or inconsistencies
   - Check error handling and logging mechanisms

7. **Local Testing**
   - Start the application locally
   - Use the test endpoint to simulate incoming messages
   - Monitor console logs for any errors or unexpected behavior

8. **Plivo Webhook Testing**
   - Use ngrok or a similar tool to expose your local server to the internet
   - Update your Plivo application with the ngrok URL
   - Send test SMS messages to your Plivo number and monitor the application's response

9. **AI Response Testing**
   - Test various conversation scenarios to ensure appropriate AI responses
   - Check if conversation history is being correctly maintained and used

10. **Opt-in/Opt-out Testing**
    - Verify that the opt-in and opt-out functionalities work as expected
    - Test edge cases like repeated opt-in/opt-out requests

11. **Error Handling and Logging**
    - Intentionally cause errors to test error handling
    - Ensure all important events and errors are properly logged

12. **Performance Testing**
    - Test the application with a higher volume of messages
    - Monitor response times and server load

13. **Security Review**
    - Check for any exposed sensitive information
    - Ensure proper input validation and sanitization

14. **Deployment**
    - Deploy the application to a production environment
    - Set up monitoring and alerting systems

Remember to thoroughly test each component and their interactions, as AI-generated code may contain subtle errors or inconsistencies. Regular code reviews and comprehensive testing are crucial for ensuring the reliability and functionality of the application.
