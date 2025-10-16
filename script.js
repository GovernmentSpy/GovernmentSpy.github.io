// Advanced AI Bot with ChatGPT-like Intelligence
class AIBot {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.imageUpload = document.getElementById('imageUpload');
        this.imageButton = document.getElementById('imageButton');
        this.loadingScreen = document.getElementById('loadingScreen');
        this.chatInterface = document.getElementById('chatInterface');
        this.enterButton = document.getElementById('enterButton');
        
        this.conversationHistory = [];
        this.userPersonality = {};
        this.responseCount = 0;
        this.mathNotes = [];
        
        console.log('AI Bot initialized');
        console.log('Loading screen:', this.loadingScreen);
        console.log('Chat interface:', this.chatInterface);
        console.log('Enter button:', this.enterButton);
        
        this.initializeEventListeners();
        this.initializeLoadingScreen();
    }

    initializeEventListeners() {
        // Loading screen
        if (this.enterButton) {
            this.enterButton.addEventListener('click', () => this.enterChat());
        } else {
            console.error('Enter button not found!');
        }
        
        // Chat functionality
        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => this.sendMessage());
        }
        if (this.messageInput) {
            this.messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
        
        // Image upload
        if (this.imageButton && this.imageUpload) {
            this.imageButton.addEventListener('click', () => {
                this.imageUpload.click();
            });
            
            this.imageUpload.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    this.handleImageUpload(e.target.files[0]);
                }
            });
        }
    }

    initializeLoadingScreen() {
        // Simulate loading progress
        setTimeout(() => {
            if (this.enterButton) {
                this.enterButton.style.display = 'block';
                setTimeout(() => {
                    this.enterButton.style.opacity = '1';
                }, 100);
            } else {
                console.error('Enter button not found for loading screen!');
                // Fallback: show chat interface after 3 seconds
                setTimeout(() => {
                    this.enterChat();
                }, 1000);
            }
        }, 3000);
    }

    enterChat() {
        console.log('Entering chat...');
        
        if (this.loadingScreen) {
            this.loadingScreen.style.opacity = '0';
            this.loadingScreen.style.transition = 'opacity 0.5s ease-out';
        }
        
        setTimeout(() => {
            if (this.loadingScreen) {
                this.loadingScreen.style.display = 'none';
            }
            
            if (this.chatInterface) {
                this.chatInterface.style.display = 'flex';
                this.chatInterface.style.opacity = '0';
                this.chatInterface.style.transition = 'opacity 0.5s ease-in';
                
                setTimeout(() => {
                    this.chatInterface.style.opacity = '1';
                    if (this.messageInput) {
                        this.messageInput.focus();
                    }
                }, 50);
            } else {
                console.error('Chat interface not found!');
            }
        }, 500);
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        this.messageInput.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Simulate AI thinking time
        await this.delay(1000 + Math.random() * 2000);

        // Hide typing indicator
        this.hideTypingIndicator();

        // Generate AI response
        const response = this.generateIntelligentResponse(message);
        this.addMessage(response, 'bot');
    }

    addMessage(content, sender) {
        // Remove welcome message if it exists
        const welcomeMessage = this.chatMessages.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageText = document.createElement('p');
        messageText.textContent = content;
        
        const messageTime = document.createElement('span');
        messageTime.className = 'message-time';
        messageTime.textContent = this.getCurrentTime();

        messageContent.appendChild(messageText);
        messageContent.appendChild(messageTime);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    generateIntelligentResponse(message) {
        // Add to conversation history
        this.conversationHistory.push({
            type: 'user',
            message: message,
            timestamp: new Date().toISOString()
        });
        
        // Analyze user personality and context
        this.analyzeUserPersonality(message);
        
        // Generate dynamic response
        const response = this.generateDynamicResponse(message);
        
        // Add bot response to history
        this.conversationHistory.push({
            type: 'bot',
            message: response,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 20 messages for context
        if (this.conversationHistory.length > 20) {
            this.conversationHistory = this.conversationHistory.slice(-20);
        }
        
        this.responseCount++;
        return response;
    }

    analyzeUserPersonality(message) {
        const lowerMessage = message.toLowerCase();
        
        // Analyze communication style
        if (lowerMessage.includes('!')) {
            this.userPersonality.enthusiastic = (this.userPersonality.enthusiastic || 0) + 1;
        }
        if (lowerMessage.includes('?')) {
            this.userPersonality.curious = (this.userPersonality.curious || 0) + 1;
        }
        if (lowerMessage.length > 100) {
            this.userPersonality.detailed = (this.userPersonality.detailed || 0) + 1;
        }
        if (lowerMessage.includes('please') || lowerMessage.includes('thank')) {
            this.userPersonality.polite = (this.userPersonality.polite || 0) + 1;
        }
        if (lowerMessage.includes('urgent') || lowerMessage.includes('asap') || lowerMessage.includes('quickly')) {
            this.userPersonality.urgent = (this.userPersonality.urgent || 0) + 1;
        }
        
        // Analyze interests
        if (lowerMessage.includes('code') || lowerMessage.includes('programming')) {
            this.userPersonality.interests = this.userPersonality.interests || [];
            if (!this.userPersonality.interests.includes('programming')) {
                this.userPersonality.interests.push('programming');
            }
        }
        if (lowerMessage.includes('math') || lowerMessage.includes('equation')) {
            this.userPersonality.interests = this.userPersonality.interests || [];
            if (!this.userPersonality.interests.includes('mathematics')) {
                this.userPersonality.interests.push('mathematics');
            }
        }
    }

    generateDynamicResponse(message) {
        const lowerMessage = message.toLowerCase();
        const context = this.getConversationContext();
        const timeOfDay = this.getTimeOfDay();
        const userMood = this.detectUserMood(message);
        
        // Special cases
        if (lowerMessage.includes('math notes') || lowerMessage.includes('my notes')) {
            return this.displayMathNotes();
        }
        
        if (this.isMathExpression(message)) {
            try {
                const result = this.evaluateMathExpression(message);
                return this.generateMathResponse(message, result, context);
            } catch (error) {
                return this.generateErrorResponse(message, context);
            }
        }
        
        // Generate contextual response
        return this.generateContextualResponse(message, context, timeOfDay, userMood);
    }

    getConversationContext() {
        const recentMessages = this.conversationHistory.slice(-6);
        const topics = [];
        const userQuestions = [];
        
        recentMessages.forEach(msg => {
            if (msg.type === 'user') {
                const lowerMsg = msg.message.toLowerCase();
                if (lowerMsg.includes('?')) {
                    userQuestions.push(msg.message);
                }
                if (lowerMsg.includes('code') || lowerMsg.includes('programming')) {
                    topics.push('programming');
                }
                if (lowerMsg.includes('math') || lowerMsg.includes('equation')) {
                    topics.push('mathematics');
                }
                if (lowerMsg.includes('help') || lowerMsg.includes('problem')) {
                    topics.push('problem-solving');
                }
            }
        });
        
        return {
            recentTopics: [...new Set(topics)],
            userQuestions: userQuestions,
            conversationLength: this.conversationHistory.length,
            userPersonality: this.userPersonality
        };
    }

    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 6) return 'early_morning';
        if (hour < 12) return 'morning';
        if (hour < 18) return 'afternoon';
        if (hour < 22) return 'evening';
        return 'night';
    }

    detectUserMood(message) {
        const lowerMessage = message.toLowerCase();
        const positiveWords = ['great', 'awesome', 'amazing', 'love', 'excited', 'happy', 'wonderful'];
        const negativeWords = ['frustrated', 'stuck', 'confused', 'difficult', 'hard', 'problem', 'error'];
        const urgentWords = ['urgent', 'asap', 'quickly', 'immediately', 'help', 'stuck'];
        
        let mood = 'neutral';
        if (positiveWords.some(word => lowerMessage.includes(word))) mood = 'positive';
        if (negativeWords.some(word => lowerMessage.includes(word))) mood = 'frustrated';
        if (urgentWords.some(word => lowerMessage.includes(word))) mood = 'urgent';
        
        return mood;
    }

    generateContextualResponse(message, context, timeOfDay, userMood) {
        const lowerMessage = message.toLowerCase();
        
        // Greeting responses
        if (this.isGreeting(lowerMessage)) {
            return this.generateGreeting(context, timeOfDay);
        }
        
        // Programming topics
        if (lowerMessage.includes('code') || lowerMessage.includes('programming') || 
            lowerMessage.includes('javascript') || lowerMessage.includes('python') ||
            lowerMessage.includes('html') || lowerMessage.includes('css') ||
            lowerMessage.includes('metamethod') || lowerMessage.includes('lua')) {
            return this.generateProgrammingResponse(message, context, userMood);
        }
        
        // Math topics
        if (lowerMessage.includes('math') || lowerMessage.includes('equation') ||
            lowerMessage.includes('calculate') || lowerMessage.includes('solve')) {
            return this.generateMathTopicResponse(message, context, userMood);
        }
        
        // Learning requests
        if (lowerMessage.includes('learn') || lowerMessage.includes('how to') ||
            lowerMessage.includes('tutorial') || lowerMessage.includes('teach') ||
            lowerMessage.includes('explain')) {
            return this.generateLearningResponse(message, context, userMood);
        }
        
        // Problem solving
        if (lowerMessage.includes('problem') || lowerMessage.includes('issue') ||
            lowerMessage.includes('error') || lowerMessage.includes('bug') ||
            lowerMessage.includes('stuck') || lowerMessage.includes('help')) {
            return this.generateProblemSolvingResponse(message, context, userMood);
        }
        
        // Questions
        if (lowerMessage.includes('?') || lowerMessage.includes('what') ||
            lowerMessage.includes('why') || lowerMessage.includes('how') ||
            lowerMessage.includes('when') || lowerMessage.includes('where')) {
            return this.generateQuestionResponse(message, context, userMood);
        }
        
        // Default response
        return this.generateDefaultResponse(message, context, userMood);
    }

    generateGreeting(context, timeOfDay) {
        const greetings = {
            early_morning: [
                "Good early morning! You're up bright and early - perfect time for some focused learning!",
                "Wow, you're an early bird! I love the dedication. What can we tackle together this morning?",
                "Early morning coding session? I'm impressed! Let's make the most of this quiet time."
            ],
            morning: [
                "Good morning! What a great way to start the day - ready to learn something new?",
                "Morning! I'm excited to help you with whatever you're working on today.",
                "Good morning! I hope you're having a wonderful start to your day. What can I help you with?"
            ],
            afternoon: [
                "Good afternoon! I hope your day is going well. What would you like to explore?",
                "Afternoon! Perfect time for some productive learning. What's on your mind?",
                "Good afternoon! I'm here and ready to help with whatever you need."
            ],
            evening: [
                "Good evening! I hope you've had a productive day. What can we work on together?",
                "Evening! Great time to wind down with some learning. What interests you?",
                "Good evening! I'm here to help you with whatever you need."
            ],
            night: [
                "Good evening! Working late? I'm here to help you with whatever you need.",
                "Evening! I hope your day has been productive. What can we explore together?",
                "Good evening! Perfect time for some focused learning. What's on your mind?"
            ]
        };
        
        const timeGreetings = greetings[timeOfDay] || greetings.evening;
        const baseGreeting = timeGreetings[Math.floor(Math.random() * timeGreetings.length)];
        
        // Add contextual elements
        if (context.recentTopics.includes('programming')) {
            return baseGreeting + " I see you've been working on programming - ready to dive deeper into that?";
        }
        if (context.recentTopics.includes('mathematics')) {
            return baseGreeting + " I notice you've been exploring math - shall we continue with that?";
        }
        if (context.userQuestions.length > 0) {
            return baseGreeting + " I see you've been asking great questions - what else would you like to know?";
        }
        
        return baseGreeting;
    }

    generateProgrammingResponse(message, context, userMood) {
        const lowerMessage = message.toLowerCase();
        
        // Specific metamethod response
        if (lowerMessage.includes('metamethod')) {
            const responses = [
                "Ah, metamethods! These are one of Lua's most powerful features. Metamethods allow you to define custom behavior for operations like addition, subtraction, comparison, and more. They're essentially functions that get called when certain operations are performed on tables. What specific metamethod are you working with?",
                "Metamethods are Lua's way of implementing operator overloading! They let you define what happens when you use operators like +, -, *, /, ==, <, etc. on your custom objects. It's like giving your tables superpowers! Are you trying to implement a specific metamethod?",
                "Metamethods are the secret sauce of Lua! They allow you to customize how your tables behave with operators. For example, you can make two tables add together, compare with each other, or even call them like functions. What metamethod concept would you like to explore?"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // General programming responses
        const responses = [
            `Programming is such a creative and logical field! ${userMood === 'urgent' ? 'Let me help you solve this quickly!' : 'What programming challenge are you working on? I love helping with code!'}`,
            `I absolutely love programming discussions! ${userMood === 'frustrated' ? 'I can help you debug this right away!' : 'Are you learning a new language, working on a project, or maybe debugging something?'}`,
            `Programming is like solving puzzles that create amazing things! ${userMood === 'urgent' ? 'Let's tackle this together!' : 'What would you like to explore - algorithms, data structures, or maybe a specific language?'}`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateMathTopicResponse(message, context, userMood) {
        const responses = [
            `Mathematics is the language of the universe! ${userMood === 'frustrated' ? 'I can help you understand this step by step!' : 'What mathematical concept are you exploring?'}`,
            `Math problems are like puzzles waiting to be solved! ${userMood === 'urgent' ? 'Let me help you work through this quickly!' : 'Are you working on algebra, calculus, or maybe something more advanced?'}`,
            `I love helping with mathematics! ${userMood === 'frustrated' ? 'Let's break this down together!' : 'What specific math topic would you like to explore?'}`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateLearningResponse(message, context, userMood) {
        const responses = [
            `Learning is one of the most exciting things we can do! ${userMood === 'urgent' ? 'Let me help you learn this quickly!' : 'What would you like to learn about today?'}`,
            `I absolutely love helping people learn new things! ${userMood === 'frustrated' ? 'Let's take this step by step!' : 'What skill or topic interests you most?'}`,
            `Learning is a journey, and I'm excited to be part of yours! ${userMood === 'urgent' ? 'I can help you master this!' : 'What would you like to explore and understand better?'}`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateProblemSolvingResponse(message, context, userMood) {
        const responses = [
            `Every problem is an opportunity to learn and grow! ${userMood === 'urgent' ? 'Let me help you solve this quickly!' : 'What problem are you facing? I love tackling challenges!'}`,
            `Problems are just puzzles waiting for the right solution! ${userMood === 'frustrated' ? 'Let's work through this together step by step!' : 'What specific issue are you dealing with?'}`,
            `I'm here to help you solve any problem! ${userMood === 'urgent' ? 'Let's tackle this right away!' : 'What challenge are you working on? I love problem-solving!'}`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateQuestionResponse(message, context, userMood) {
        const responses = [
            `That's a fantastic question! ${userMood === 'urgent' ? 'Let me give you a quick, clear answer!' : 'I love thoughtful questions like this!'}`,
            `Great question! ${userMood === 'frustrated' ? 'Let me explain this in a way that makes sense!' : 'Questions like this really show you're thinking deeply!'}`,
            `I love questions like this! ${userMood === 'urgent' ? 'Let me help you understand this quickly!' : 'Your curiosity is exactly what drives learning forward!'}`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateDefaultResponse(message, context, userMood) {
        const responses = [
            `That's really interesting! ${userMood === 'urgent' ? 'Let me help you with this quickly!' : 'I'd love to explore this topic with you!'}`,
            `I'm intrigued by what you're saying! ${userMood === 'frustrated' ? 'Let me help you work through this!' : 'What specific aspect would you like to dive into?'}`,
            `That sounds fascinating! ${userMood === 'urgent' ? 'I can help you with this right away!' : 'I'm excited to learn more about your perspective on this!'}`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateMathResponse(expression, result, context) {
        const responses = [
            `Brilliant calculation! ${expression} = ${result}. ${context.userPersonality.enthusiastic > 2 ? 'I love your enthusiasm for math!' : 'Math is so satisfying when it all comes together!'}`,
            `Perfect! The answer to ${expression} is ${result}. ${context.userPersonality.curious > 2 ? 'Your curiosity about numbers is wonderful!' : 'Every equation tells a story!'}`,
            `Excellent work! ${expression} equals ${result}. ${context.userPersonality.detailed > 2 ? 'I appreciate your attention to detail!' : 'Numbers never lie, and that's beautiful!'}`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateErrorResponse(message, context) {
        const responses = [
            `I'm not quite sure about that math problem. ${context.userPersonality.polite > 2 ? 'Thank you for being so patient!' : 'Could you rephrase it? I'd love to help you solve it!'}`,
            `That math expression is a bit tricky for me. ${context.userPersonality.curious > 2 ? 'I love that you're exploring complex math!' : 'Could you break it down differently? I'm here to help!'}`,
            `I'm having trouble with that calculation. ${context.userPersonality.enthusiastic > 2 ? 'Your enthusiasm for math is contagious!' : 'Could you try expressing it another way? Let's solve this together!'}`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Utility methods
    isGreeting(message) {
        const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'];
        return greetings.some(greeting => message.includes(greeting));
    }

    isMathExpression(message) {
        const mathPattern = /^[\d\s\+\-\*\/\(\)\.]+$/;
        return mathPattern.test(message.replace(/\s/g, ''));
    }

    evaluateMathExpression(expression) {
        const cleanExpression = expression.replace(/[^0-9+\-*/().\s]/g, '');
        return Function(`"use strict"; return (${cleanExpression})`)();
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    showTypingIndicator() {
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Image processing (simplified)
    async handleImageUpload(file) {
        this.showTypingIndicator();
        this.addMessage(`📷 Uploaded image: ${file.name}`, 'user');
        
        await this.delay(2000);
        this.hideTypingIndicator();
        
        const response = "I can see you've uploaded an image! While I can't process images directly in this demo, I can help you with math equations, programming questions, or any other topics you'd like to discuss.";
        this.addMessage(response, 'bot');
    }

    displayMathNotes() {
        const notes = this.getMathNotes();
        if (notes.length === 0) {
            return "📚 You don't have any math notes yet. Upload some math equations to get started!";
        }
        
        let response = "📚 Your Math Notes:\n\n";
        notes.forEach((note, index) => {
            response += `${index + 1}. ${note.equation}\n`;
            response += `   📅 Added: ${new Date(note.timestamp).toLocaleDateString()}\n`;
            if (note.solved) {
                response += `   ✅ Solved\n`;
            }
            response += `\n`;
        });
        
        response += "\n💡 You can ask me to solve any of these equations or explain the concepts!";
        return response;
    }

    getMathNotes() {
        const stored = localStorage.getItem('mathNotes');
        return stored ? JSON.parse(stored) : [];
    }
}

// Initialize the bot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AIBot();
});
