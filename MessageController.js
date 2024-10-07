const OpenAI = require('openai');
const plivo = require('plivo');

const Conversation = require('../models/Conversation');
const ChatMessage = require('../models/ChatMessage');

const mongoose = require('mongoose');

const winston = require('winston');

/**
 * Create logger
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  transports: [new winston.transports.Console()],
});

const OPT_IN_MSG =
    "Thank you for texting us. We're happy to help. Reply YES to opt-in. Reply STOP to stop.";

const HELP_MSG = 'How can I help you?';

const openai = new OpenAI({
  apiKey: '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'
});

const plivoClient = new plivo.Client(process.env.PLIVO_AUTH_ID, process.env.PLIVO_AUTH_TOKEN);

async function getHelpResponse(messages) {
    try {
        const formattedMessages = messages.map((message) => ({
            role: message.sender.toLowerCase(),
            content: message.message,
        }));

        console.log("Formatted Messages are ", formattedMessages);

        const gptResponse = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: formattedMessages,
        });

        console.log("GPT RESPONSE IS", gptResponse);

        if(gptResponse && gptResponse.choices && gptResponse.choices.length > 0) {
            console.log(gptResponse?.choices?.[0]?.message?.content);
            return {
                success: true,
                data: gptResponse?.choices?.[0]?.message?.content,
                error: null
            };
        } else {
            return {
                success: false,
                data: null,
                error: 'unexpected result from gptResponse'
            };
        }
    } catch (error) {
        console.error('Error while getting chat completion:', error);
        return {
            success: false,
            data: null,
            error: error.message || 'unexpected error'
        };
    }
}

exports.handleIncomingMessagePlivo = async (req, res) => {
    const {
        From: phoneNumber,
        To: recipientNumber,
        Text: message,
        FromCountry: country,
        FromState: state,
        FromCity: city,
        FromZip: zip
    } = req.body;

    console.log("Received message:", { from: phoneNumber, to: recipientNumber, body: message });

    let chatResponse = 'Something went wrong...';
    
    try {
        let conversation = await Conversation.findOne({ phoneNumber });

        if (!conversation || !conversation.optInStatus) {
            if (!conversation) {
                conversation = new Conversation({ phoneNumber });
                await conversation.save();
            }

            await new ChatMessage({
                conversationId: conversation._id,
                sender: 'user',
                message
            }).save();

            if (!conversation.optInStatus && !(['YES', 'STOP'].includes(message.toUpperCase()))) {
                chatResponse = OPT_IN_MSG;
            } else if (message.toUpperCase() === 'YES') {
                conversation.optInStatus = true;
                conversation.updatedAt = new Date();
                await conversation.save();
                chatResponse = HELP_MSG;
            } else if (message.toUpperCase() === 'STOP') {
                conversation.optInStatus = false;
                conversation.updatedAt = new Date();
                await conversation.save();
                chatResponse = 'Opted out';
            }
        } else {
            const messages = await ChatMessage.find({ conversationId: conversation._id }).sort({ createdAt: -1 }).limit(10).lean();
            messages.reverse();

            const AIResponseResult = await getHelpResponse(messages);
            
            if (!AIResponseResult.success) {
                throw new Error(AIResponseResult.error);
            }
                      
            const AIResponse = AIResponseResult.data;

            await new ChatMessage({
                conversationId: conversation._id,
                sender: 'assistant',
                message: AIResponse,
            }).save();
            
            chatResponse = AIResponse;
        }

    } catch (e) {
        console.error(e);
        return res.json({ success: false, error: e.message });
    }
   
    const plivoResponse = plivo.Response();
    plivoResponse.addMessage(chatResponse);

    res.set({'Content-Type': 'application/xml'});
    res.send(plivoResponse.toXML());
};

exports.handleIncomingMessageTestPlivo = async (req, res) => {
    const { From: phoneNumber, Text: message } = req.body;

    console.log('Your phone number is: ' + phoneNumber);

    let chatResponse = 'Something went wrong...';
  
    try {
        let conversation = await Conversation.findOne({ phoneNumber });

        if (!conversation || !conversation.optInStatus) {
            if (!conversation) {
                conversation = new Conversation({ phoneNumber });
                await conversation.save();
            }

            await new ChatMessage({
                conversationId: conversation._id,
                sender: 'user',
                message
            }).save();

            if (!conversation.optInStatus && !(['YES', 'STOP'].includes(message.toUpperCase()))) {
                chatResponse = OPT_IN_MSG;
            } else if (message.toUpperCase() === 'YES') {
                conversation.optInStatus = true;
                conversation.updatedAt = new Date();
                await conversation.save();
                chatResponse = HELP_MSG;
            } else if (message.toUpperCase() === 'STOP') {
                conversation.optInStatus = false;
                conversation.updatedAt = new Date();
                await conversation.save();
                chatResponse = 'Opted out';
            }
        } else {
            const messages = await ChatMessage.find({ conversationId: conversation._id }).sort({ createdAt: -1 }).limit(10).lean();
            messages.reverse();
    
            const AIResponseResult = await getHelpResponse(messages);
          
            if (!AIResponseResult.success) {
                throw new Error(AIResponseResult.error);
            }
                    
            const AIResponse = AIResponseResult.data;

            await new ChatMessage({
                conversationId: conversation._id,
                sender: 'assistant',
                message: AIResponse,
            }).save();
          
            chatResponse = AIResponse;
        }

    } catch (e) {
        return res.json({ success: false, error: e.message });
    }
 
    return res.json({ success: true, data: chatResponse });
};

exports.handleReset = async (req, res) => {
    try {
        const models = mongoose.modelNames();
        const deletionResults = [];

        for (const modelName of models) {
            const model = mongoose.model(modelName);
            const deletionResult = await model.deleteMany({});
            deletionResults.push({ model: modelName, deletedCount: deletionResult.deletedCount });
            console.log(`Deleted ${deletionResult.deletedCount} records from ${modelName}.`);
        }
        
        let responseMessage = 'All tables and entries have been deleted:\n';
        deletionResults.forEach(result => {
            responseMessage += `${result.model}: ${result.deletedCount} records deleted.\n`;
        });

        res.send(responseMessage);
    } catch (error) {
        console.error("Error during database reset: ", error);
        res.status(500).send("Error resetting the database: " + error.message);
    }
};