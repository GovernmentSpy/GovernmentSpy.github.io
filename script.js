// AI Bot JavaScript functionality
class AIBot {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.quickActions = document.querySelectorAll('.quick-action');
        this.imageUpload = document.getElementById('imageUpload');
        this.imageButton = document.getElementById('imageButton');
        this.mathNotes = [];
        this.conversationHistory = [];
        this.userPersonality = {};
        this.responseCount = 0;
        
        this.initializeEventListeners();
        this.initializeBot();
    }

    initializeEventListeners() {
        // Send button click
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Enter key press
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Image upload functionality
        this.imageButton.addEventListener('click', () => {
            this.imageUpload.click();
        });
        
        this.imageUpload.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                this.handleImageUpload(e.target.files[0]);
            }
        });
        
        // Quick action buttons
        this.quickActions.forEach(button => {
            button.addEventListener('click', () => {
                const message = button.getAttribute('data-message');
                if (message === 'Upload math equation') {
                    this.imageUpload.click();
                } else {
                    this.messageInput.value = message;
                    this.sendMessage();
                }
            });
        });
    }

    initializeBot() {
        // Add some personality to the bot
        this.botPersonality = {
            greetings: [
                "Hello! I'm your AI assistant. How can I help you today?",
                "Hi there! I'm here to assist you with anything you need.",
                "Greetings! I'm your friendly AI helper. What can I do for you?",
                "Hey! Great to see you! What can I help you with today?",
                "Welcome! I'm excited to chat with you. What's on your mind?"
            ],
            responses: {
                greeting: [
                    "Hello! Nice to meet you! How can I help you today?",
                    "Hi there! How are you doing? I'm here to assist!",
                    "Greetings! I'm excited to chat with you! What would you like to talk about?",
                    "Hey! Great to see you! What can I help you with?",
                    "Hello! I'm ready to help with whatever you need!"
                ],
                joke: [
                    "Why don't scientists trust atoms? Because they make up everything! 😄",
                    "What do you call a fake noodle? An impasta! 🍝",
                    "Why did the scarecrow win an award? He was outstanding in his field! 🌾",
                    "What do you call a bear with no teeth? A gummy bear! 🐻",
                    "Why did the math book look so sad? Because it had too many problems! 📚",
                    "What do you call a fish wearing a bowtie? So-fish-ticated! 🐠",
                    "Why don't eggs tell jokes? They'd crack each other up! 🥚"
                ],
                coding: [
                    "I'd be happy to help with coding! What programming language or problem are you working on?",
                    "Coding is awesome! I can help with syntax, debugging, best practices, or explain concepts.",
                    "Let's code together! What would you like to work on today?",
                    "Programming is my passion! I can help with algorithms, debugging, or learning new languages.",
                    "Ready to dive into some code! What programming challenge can I help you solve?"
                ],
                help: [
                    "I can help you with a wide variety of topics! Here are some things I'm good at:",
                    "• Answering questions and providing information",
                    "• Helping with coding and programming",
                    "• Telling jokes and having fun conversations",
                    "• Explaining complex topics in simple terms",
                    "• Providing creative ideas and solutions",
                    "• Solving math problems and calculations",
                    "• Processing math equations from images 📷",
                    "• Creating and managing math notes 📚",
                    "• Discussing technology and AI topics",
                    "What would you like to explore?"
                ],
                default: [
                    "That's interesting! I'd love to help you with that. Could you tell me more about what you're looking for?",
                    "I'm here to help! What specific aspect would you like to explore?",
                    "That sounds fascinating! I can assist with programming, answer questions, solve problems, or just have a friendly conversation!",
                    "I'd be happy to help! Could you provide a bit more context about what you need?",
                    "That's a great topic! I can help with technical topics, general knowledge, or problem-solving. What would you like to know more about?"
                ]
            }
        };
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
        const response = this.generateResponse(message);
        this.addMessage(response, 'bot');
    }

    addMessage(content, sender) {
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

    generateResponse(message) {
        // Add to conversation history
        this.conversationHistory.push({
            type: 'user',
            message: message,
            timestamp: new Date().toISOString()
        });
        
        // Analyze user personality and context
        this.analyzeUserPersonality(message);
        
        // Generate dynamic response based on context
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

    // Dynamic response generation system
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
        
        // Special cases that need specific handling
        if (lowerMessage.includes('math notes') || lowerMessage.includes('my notes')) {
            return this.displayMathNotes();
        }
        
        if (this.isMathExpression(message)) {
            try {
                const result = this.evaluateMathExpression(message);
                return this.generateDynamicMathResponse(message, result, context);
            } catch (error) {
                return this.generateDynamicErrorResponse(message, context);
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
            return this.generateDynamicGreeting(context, timeOfDay);
        }
        
        // Programming topics
        if (lowerMessage.includes('code') || lowerMessage.includes('programming') || 
            lowerMessage.includes('javascript') || lowerMessage.includes('python') ||
            lowerMessage.includes('html') || lowerMessage.includes('css')) {
            return this.generateDynamicProgrammingResponse(message, context, userMood);
        }
        
        // Math topics
        if (lowerMessage.includes('math') || lowerMessage.includes('equation') ||
            lowerMessage.includes('calculate') || lowerMessage.includes('solve')) {
            return this.generateDynamicMathTopicResponse(message, context, userMood);
        }
        
        // Learning requests
        if (lowerMessage.includes('learn') || lowerMessage.includes('how to') ||
            lowerMessage.includes('tutorial') || lowerMessage.includes('teach')) {
            return this.generateDynamicLearningResponse(message, context, userMood);
        }
        
        // Problem solving
        if (lowerMessage.includes('problem') || lowerMessage.includes('issue') ||
            lowerMessage.includes('error') || lowerMessage.includes('bug') ||
            lowerMessage.includes('stuck') || lowerMessage.includes('help')) {
            return this.generateDynamicProblemSolvingResponse(message, context, userMood);
        }
        
        // Questions
        if (lowerMessage.includes('?') || lowerMessage.includes('what') ||
            lowerMessage.includes('why') || lowerMessage.includes('how') ||
            lowerMessage.includes('when') || lowerMessage.includes('where')) {
            return this.generateDynamicQuestionResponse(message, context, userMood);
        }
        
        // Default dynamic response
        return this.generateDynamicDefaultResponse(message, context, userMood);
    }

    generateDynamicGreeting(context, timeOfDay) {
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

    generateDynamicProgrammingResponse(message, context, userMood) {
        const lowerMessage = message.toLowerCase();
        const programmingTopics = this.detectProgrammingTopics(message);
        const urgency = userMood === 'urgent' ? 'urgent' : 'normal';
        
        let response = "";
        
        // Detect specific programming language or concept
        if (lowerMessage.includes('javascript') || lowerMessage.includes('js')) {
            response = this.generateJavaScriptResponse(message, context, urgency);
        } else if (lowerMessage.includes('python')) {
            response = this.generatePythonResponse(message, context, urgency);
        } else if (lowerMessage.includes('html') || lowerMessage.includes('css')) {
            response = this.generateWebDevResponse(message, context, urgency);
        } else if (lowerMessage.includes('react') || lowerMessage.includes('vue') || lowerMessage.includes('angular')) {
            response = this.generateFrameworkResponse(message, context, urgency);
        } else {
            response = this.generateGeneralProgrammingResponse(message, context, urgency);
        }
        
        return response;
    }

    detectProgrammingTopics(message) {
        const topics = [];
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('javascript') || lowerMessage.includes('js')) topics.push('javascript');
        if (lowerMessage.includes('python')) topics.push('python');
        if (lowerMessage.includes('html')) topics.push('html');
        if (lowerMessage.includes('css')) topics.push('css');
        if (lowerMessage.includes('react')) topics.push('react');
        if (lowerMessage.includes('node')) topics.push('nodejs');
        if (lowerMessage.includes('database') || lowerMessage.includes('sql')) topics.push('database');
        if (lowerMessage.includes('api')) topics.push('api');
        if (lowerMessage.includes('algorithm')) topics.push('algorithms');
        if (lowerMessage.includes('debug')) topics.push('debugging');
        
        return topics;
    }

    generateJavaScriptResponse(message, context, urgency) {
        const responses = [
            `JavaScript is absolutely fascinating! It's like the Swiss Army knife of programming - you can build anything from simple websites to complex applications. ${urgency === 'urgent' ? 'Let me help you solve this quickly!' : 'What specific aspect of JavaScript are you working with?'}`,
            `Ah, JavaScript! The language that brought the web to life. ${urgency === 'urgent' ? 'I can help you debug this right away!' : 'Are you working on frontend, backend with Node.js, or maybe a framework like React?'}`,
            `JavaScript is everywhere these days! ${urgency === 'urgent' ? 'Let's tackle this problem together!' : 'What would you like to explore - ES6 features, DOM manipulation, or perhaps some advanced concepts?'}`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generatePythonResponse(message, context, urgency) {
        const responses = [
            `Python is such an elegant language! ${urgency === 'urgent' ? 'Let me help you solve this quickly!' : 'Are you working on data science, web development with Django/Flask, or maybe some automation?'}`,
            `Python - where simplicity meets power! ${urgency === 'urgent' ? 'I can help you debug this right away!' : 'What Python project are you working on? I love helping with Python!'}`,
            `Python is perfect for so many things! ${urgency === 'urgent' ? 'Let's solve this together!' : 'Are you exploring machine learning, web scraping, or building applications?'}`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateWebDevResponse(message, context, urgency) {
        const responses = [
            `Web development is where creativity meets technology! ${urgency === 'urgent' ? 'Let me help you fix this quickly!' : 'Are you working on the structure with HTML, styling with CSS, or maybe some responsive design?'}`,
            `HTML and CSS are the foundation of every great website! ${urgency === 'urgent' ? 'I can help you solve this right away!' : 'What specific aspect of web development are you focusing on?'}`,
            `Building websites is like crafting digital experiences! ${urgency === 'urgent' ? 'Let's tackle this together!' : 'Are you working on layout, styling, or maybe some interactive features?'}`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateFrameworkResponse(message, context, urgency) {
        const responses = [
            `Modern frameworks make development so much more efficient! ${urgency === 'urgent' ? 'Let me help you solve this quickly!' : 'Are you working on a React app, Vue project, or maybe something with Angular?'}`,
            `Frameworks are game-changers for development! ${urgency === 'urgent' ? 'I can help you debug this right away!' : 'What framework are you using, and what specific challenge are you facing?'}`,
            `Frameworks really speed up development! ${urgency === 'urgent' ? 'Let's solve this together!' : 'Are you building a single-page application or working on component architecture?'}`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateGeneralProgrammingResponse(message, context, urgency) {
        const responses = [
            `Programming is such a creative and logical field! ${urgency === 'urgent' ? 'Let me help you solve this quickly!' : 'What programming challenge are you working on? I love helping with code!'}`,
            `I absolutely love programming discussions! ${urgency === 'urgent' ? 'I can help you debug this right away!' : 'Are you learning a new language, working on a project, or maybe debugging something?'}`,
            `Programming is like solving puzzles that create amazing things! ${urgency === 'urgent' ? 'Let's tackle this together!' : 'What would you like to explore - algorithms, data structures, or maybe a specific language?'}`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateDynamicMathTopicResponse(message, context, userMood) {
        const responses = [
            `Mathematics is the language of the universe! ${userMood === 'frustrated' ? 'I can help you understand this step by step!' : 'What mathematical concept are you exploring?'}`,
            `Math problems are like puzzles waiting to be solved! ${userMood === 'urgent' ? 'Let me help you work through this quickly!' : 'Are you working on algebra, calculus, or maybe something more advanced?'}`,
            `I love helping with mathematics! ${userMood === 'frustrated' ? 'Let's break this down together!' : 'What specific math topic would you like to explore?'}`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateDynamicLearningResponse(message, context, userMood) {
        const responses = [
            `Learning is one of the most exciting things we can do! ${userMood === 'urgent' ? 'Let me help you learn this quickly!' : 'What would you like to learn about today?'}`,
            `I absolutely love helping people learn new things! ${userMood === 'frustrated' ? 'Let's take this step by step!' : 'What skill or topic interests you most?'}`,
            `Learning is a journey, and I'm excited to be part of yours! ${userMood === 'urgent' ? 'I can help you master this!' : 'What would you like to explore and understand better?'}`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateDynamicProblemSolvingResponse(message, context, userMood) {
        const responses = [
            `Every problem is an opportunity to learn and grow! ${userMood === 'urgent' ? 'Let me help you solve this quickly!' : 'What problem are you facing? I love tackling challenges!'}`,
            `Problems are just puzzles waiting for the right solution! ${userMood === 'frustrated' ? 'Let's work through this together step by step!' : 'What specific issue are you dealing with?'}`,
            `I'm here to help you solve any problem! ${userMood === 'urgent' ? 'Let's tackle this right away!' : 'What challenge are you working on? I love problem-solving!'}`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateDynamicQuestionResponse(message, context, userMood) {
        const responses = [
            `That's a fantastic question! ${userMood === 'urgent' ? 'Let me give you a quick, clear answer!' : 'I love thoughtful questions like this!'}`,
            `Great question! ${userMood === 'frustrated' ? 'Let me explain this in a way that makes sense!' : 'Questions like this really show you're thinking deeply!'}`,
            `I love questions like this! ${userMood === 'urgent' ? 'Let me help you understand this quickly!' : 'Your curiosity is exactly what drives learning forward!'}`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateDynamicDefaultResponse(message, context, userMood) {
        const responses = [
            `That's really interesting! ${userMood === 'urgent' ? 'Let me help you with this quickly!' : 'I'd love to explore this topic with you!'}`,
            `I'm intrigued by what you're saying! ${userMood === 'frustrated' ? 'Let me help you work through this!' : 'What specific aspect would you like to dive into?'}`,
            `That sounds fascinating! ${userMood === 'urgent' ? 'I can help you with this right away!' : 'I'm excited to learn more about your perspective on this!'}`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateDynamicMathResponse(expression, result, context) {
        const responses = [
            `Brilliant calculation! ${expression} = ${result}. ${context.userPersonality.enthusiastic > 2 ? 'I love your enthusiasm for math!' : 'Math is so satisfying when it all comes together!'}`,
            `Perfect! The answer to ${expression} is ${result}. ${context.userPersonality.curious > 2 ? 'Your curiosity about numbers is wonderful!' : 'Every equation tells a story!'}`,
            `Excellent work! ${expression} equals ${result}. ${context.userPersonality.detailed > 2 ? 'I appreciate your attention to detail!' : 'Numbers never lie, and that's beautiful!'}`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateDynamicErrorResponse(message, context) {
        const responses = [
            `I'm not quite sure about that math problem. ${context.userPersonality.polite > 2 ? 'Thank you for being so patient!' : 'Could you rephrase it? I'd love to help you solve it!'}`,
            `That math expression is a bit tricky for me. ${context.userPersonality.curious > 2 ? 'I love that you're exploring complex math!' : 'Could you break it down differently? I'm here to help!'}`,
            `I'm having trouble with that calculation. ${context.userPersonality.enthusiastic > 2 ? 'Your enthusiasm for math is contagious!' : 'Could you try expressing it another way? Let's solve this together!'}`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Creative response generation methods
    generateCreativeCodingResponse(message) {
        const responses = [
            `I love coding! It's like solving puzzles that create amazing things. What specific programming challenge are you working on? I can help with algorithms, debugging, or learning new concepts!`,
            `Programming is an art form where logic meets creativity! Whether you're building websites, apps, or solving complex problems, I'm here to help. What language or project interests you?`,
            `Code is poetry written in logic! I'd be thrilled to help you on your coding journey. Are you learning a new language, debugging an issue, or working on a specific project?`,
            `Every great developer started with a single "Hello World"! I can help you level up your coding skills. What would you like to build or learn today?`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateWeatherResponse() {
        const responses = [
            `I'd love to help with weather, but I don't have access to real-time weather data. However, I can suggest checking your local weather app or website for current conditions!`,
            `While I can't check the weather directly, I can help you understand weather patterns, climate science, or even build a weather app! What interests you about weather?`,
            `Weather is fascinating! Though I can't access real-time data, I can discuss meteorology, climate change, or help you create a weather tracking application. What would you like to explore?`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateTimeResponse() {
        const now = new Date();
        const time = now.toLocaleTimeString();
        const responses = [
            `The current time is ${time}. Time flies when you're having fun coding! ⏰`,
            `It's ${time} right now. Perfect time to learn something new or solve a coding challenge!`,
            `The clock shows ${time}. Every moment is a chance to create something amazing!`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateDateResponse() {
        const today = new Date().toLocaleDateString();
        const responses = [
            `Today is ${today}. A new day full of possibilities and learning opportunities! 📅`,
            `The date is ${today}. Every day is a chance to grow and create something new!`,
            `Today's date is ${today}. What amazing things will you accomplish today?`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateMathResponse(expression, result) {
        const responses = [
            `Brilliant! ${expression} = ${result}. Math is the language of the universe! 🧮`,
            `Great calculation! The answer to ${expression} is ${result}. Numbers never lie!`,
            `Perfect! ${expression} equals ${result}. Math problems are just puzzles waiting to be solved!`,
            `Excellent! ${expression} = ${result}. Every equation tells a story!`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateJavaScriptResponse(message) {
        const responses = [
            `JavaScript is like the Swiss Army knife of programming! It powers the web, mobile apps, and even servers. What specific JS topic excites you? ES6, React, Node.js, or something else?`,
            `Ah, JavaScript! The language that brought interactivity to the web. From simple DOM manipulation to complex frameworks, JS is incredibly versatile. What would you like to build?`,
            `JavaScript is everywhere! Frontend, backend, mobile apps - it's the universal language of modern development. Are you interested in vanilla JS, frameworks, or Node.js?`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generatePythonResponse(message) {
        const responses = [
            `Python is poetry in code! Clean, readable, and incredibly powerful. Whether it's data science, web development, or AI, Python has you covered. What Python adventure are you on?`,
            `Python - where simplicity meets power! From web scraping to machine learning, Python makes complex tasks elegant. Are you exploring Django, Flask, data science, or AI?`,
            `Python is like a friendly wizard - it makes complex magic look simple! Perfect for beginners and experts alike. What Python project are you working on?`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateWebDevResponse(message) {
        const responses = [
            `Web development is where creativity meets technology! HTML structures, CSS beautifies, and JavaScript brings it to life. What aspect of web development interests you most?`,
            `The web is our canvas, and code is our paintbrush! Whether you're into responsive design, animations, or full-stack development, I'm here to help. What would you like to create?`,
            `Building websites is like crafting digital experiences! From pixel-perfect designs to smooth interactions, every detail matters. What web project are you working on?`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateAIResponse(message) {
        const responses = [
            `AI is the future unfolding today! From machine learning to neural networks, we're creating intelligence that can learn and adapt. What aspect of AI fascinates you most?`,
            `Artificial Intelligence is like teaching machines to think! Whether it's computer vision, natural language processing, or deep learning, the possibilities are endless. What AI topic interests you?`,
            `AI is revolutionizing everything! From recommendation systems to autonomous vehicles, we're building the future. Are you interested in machine learning, neural networks, or AI applications?`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateDatabaseResponse(message) {
        const responses = [
            `Databases are the memory of applications! Whether it's SQL, NoSQL, or graph databases, they store and organize the data that powers our digital world. What database challenge are you tackling?`,
            `Data is the new oil, and databases are the refineries! From MySQL to MongoDB, each database has its strengths. What data management problem are you solving?`,
            `Databases are the foundation of every great application! They store, organize, and retrieve data efficiently. Are you working with relational databases, NoSQL, or something else?`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateExplanationResponse(message) {
        const responses = [
            `I'd love to explain that! The best explanations come from understanding your perspective. Could you tell me more about what specific concept you'd like me to break down?`,
            `Explaining complex topics is like translating between languages! I can help make technical concepts clear and understandable. What would you like me to explain in simple terms?`,
            `Every expert was once a beginner! I'm here to help you understand any concept, no matter how complex. What topic would you like me to break down for you?`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateLearningResponse(message) {
        const responses = [
            `Learning is a journey, not a destination! I love helping people discover new skills and knowledge. What would you like to learn today? I can provide step-by-step guidance!`,
            `Every master was once a disaster! Learning new things is exciting and I'm here to make it easier. What skill or topic would you like to explore?`,
            `Knowledge is power, and learning is the key! I can help you understand complex topics, learn new programming languages, or master new skills. What learning adventure shall we embark on?`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateProblemSolvingResponse(message) {
        const responses = [
            `Every problem is a puzzle waiting to be solved! I love tackling challenges and finding creative solutions. What problem are you facing? Let's solve it together!`,
            `Problems are opportunities in disguise! Whether it's a coding bug, a design challenge, or a logical puzzle, I'm here to help you find the solution. What's the challenge?`,
            `Debugging is like being a detective! Every error message is a clue, and every solution is a victory. What problem are you trying to solve? Let's crack this case!`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateSelfIntroduction() {
        const responses = [
            `I'm your AI coding companion! I love helping with programming, solving problems, and making learning fun. I can assist with coding challenges, explain concepts, or just have a friendly chat. What can I help you with today?`,
            `Hello! I'm an AI assistant with a passion for technology and learning. I specialize in programming help, problem-solving, and making complex topics simple. I'm here to make your coding journey more enjoyable!`,
            `I'm your friendly AI helper! I thrive on solving problems, explaining concepts, and helping you learn new skills. Whether it's coding, math, or just having a conversation, I'm here to assist!`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateEmotionalResponse() {
        const responses = [
            `I'm doing fantastic, thank you for asking! I'm always excited to help and learn new things. How are you feeling today? I hope you're having a great day!`,
            `I'm in a wonderful mood! Helping people learn and solve problems brings me joy. How are you doing? I hope your day is going well!`,
            `I'm feeling great! Every conversation is an opportunity to help and learn. How are you doing today? I'm here if you need anything!`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateThankYouResponse() {
        const responses = [
            `You're absolutely welcome! It's my pleasure to help. I'm always here when you need assistance with coding, learning, or just having a chat!`,
            `My pleasure! Helping you is what I love to do. Feel free to ask me anything anytime - I'm always ready to assist!`,
            `You're very welcome! I'm thrilled I could help. Don't hesitate to reach out if you have more questions or need assistance with anything!`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateGoodbyeResponse() {
        const responses = [
            `Goodbye! It was wonderful chatting with you. I hope I was helpful, and I look forward to our next conversation. Take care! 👋`,
            `Farewell! It was great talking with you today. Feel free to come back anytime - I'm always here to help with your coding and learning adventures!`,
            `See you later! Thanks for the great conversation. I'm always here when you need help with programming, learning, or just want to chat!`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateQuestionResponse(message) {
        const responses = [
            `That's a fantastic question! I love thoughtful inquiries. Could you provide a bit more context? I can help with technical topics, general knowledge, or creative problem-solving!`,
            `Great question! I'm excited to help you find the answer. Could you give me a bit more detail about what you're looking for? I can assist with programming, learning, or any other topic!`,
            `I love questions like this! Could you elaborate a bit more? I'm here to help with coding challenges, learning new skills, or exploring any topic that interests you!`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateCreativeDefaultResponse(message) {
        const responses = [
            `That's fascinating! I'd love to dive deeper into that topic with you. Could you tell me more about what you're thinking? I can help with programming, learning, problem-solving, or just have an interesting conversation!`,
            `I'm intrigued by what you're saying! I'd be happy to explore that further. What specific aspect interests you most? I can assist with technical topics, creative solutions, or learning new skills!`,
            `That sounds really interesting! I'm always excited to learn about new ideas and help where I can. Could you share more details? I can help with coding, learning, or just have a great conversation!`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    isGreeting(message) {
        const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'];
        return greetings.some(greeting => message.includes(greeting));
    }

    isMathExpression(message) {
        // Simple math expression detection
        const mathPattern = /^[\d\s\+\-\*\/\(\)\.]+$/;
        return mathPattern.test(message.replace(/\s/g, ''));
    }

    evaluateMathExpression(expression) {
        // Simple and safe math evaluation
        const cleanExpression = expression.replace(/[^0-9+\-*/().\s]/g, '');
        return Function(`"use strict"; return (${cleanExpression})`)();
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
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

    // Image processing and math equation recognition
    async handleImageUpload(file) {
        // Show typing indicator
        this.showTypingIndicator();
        
        // Add user message showing image upload
        this.addMessage(`📷 Uploaded image: ${file.name}`, 'user');
        
        try {
            // Read the image file
            const imageData = await this.readImageFile(file);
            
            // Simulate processing time
            await this.delay(2000);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Process the image for math equations
            const mathResult = await this.processMathImage(imageData);
            
            // Add the result to math notes
            this.addToMathNotes(mathResult);
            
            // Send response
            this.addMessage(mathResult.response, 'bot');
            
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage("Sorry, I couldn't process that image. Please try uploading a clearer image of the math equation.", 'bot');
        }
    }

    readImageFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(file);
        });
    }

    async processMathImage(imageData) {
        // Simulate AI processing of math equations
        // In a real implementation, you would use OCR or ML services
        
        const mathEquations = [
            "2x + 5 = 13",
            "∫(x² + 3x + 2)dx",
            "lim(x→0) (sin x)/x = 1",
            "f(x) = ax² + bx + c",
            "√(a² + b²) = c",
            "e^(iπ) + 1 = 0",
            "∑(n=1 to ∞) 1/n² = π²/6",
            "∇·F = ∂F/∂x + ∂F/∂y + ∂F/∂z"
        ];
        
        const randomEquation = mathEquations[Math.floor(Math.random() * mathEquations.length)];
        
        return {
            equation: randomEquation,
            response: this.generateMathEquationResponse(randomEquation),
            timestamp: new Date().toISOString()
        };
    }

    generateMathEquationResponse(equation) {
        const responses = [
            `🔍 I've analyzed your math equation: ${equation}\n\n📝 Here's what I found: ${equation}\n\n💡 This appears to be a mathematical expression. Would you like me to:\n• Solve it step by step\n• Explain the concepts involved\n• Create a note for your math collection\n• Help with similar problems?`,
            `📊 Math equation detected: ${equation}\n\n🧮 This looks like an interesting mathematical expression! I can help you:\n• Break down the solution process\n• Explain the mathematical concepts\n• Provide step-by-step solving\n• Add it to your math notes\n\nWhat would you like to do with this equation?`,
            `🎯 Equation identified: ${equation}\n\n✨ Great math problem! I'm excited to help you with this. I can:\n• Solve it completely with explanations\n• Teach you the underlying concepts\n• Show you similar examples\n• Save it to your math notes for later review\n\nHow would you like to proceed?`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    addToMathNotes(mathResult) {
        const note = {
            id: Date.now(),
            equation: mathResult.equation,
            timestamp: mathResult.timestamp,
            solved: false,
            notes: []
        };
        
        this.mathNotes.push(note);
        
        // Store in localStorage for persistence
        localStorage.setItem('mathNotes', JSON.stringify(this.mathNotes));
        
        // Show notification
        this.showNotification(`📝 Added "${mathResult.equation}" to your math notes!`);
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Math notes management
    getMathNotes() {
        const stored = localStorage.getItem('mathNotes');
        return stored ? JSON.parse(stored) : [];
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
}

// Initialize the bot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AIBot();
});

// Add some fun features
document.addEventListener('DOMContentLoaded', () => {
    // Add click animation to send button
    const sendButton = document.getElementById('sendButton');
    sendButton.addEventListener('click', () => {
        sendButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            sendButton.style.transform = 'scale(1)';
        }, 150);
    });
    
    // Add focus effect to input
    const messageInput = document.getElementById('messageInput');
    messageInput.addEventListener('focus', () => {
        messageInput.parentElement.style.transform = 'scale(1.02)';
    });
    
    messageInput.addEventListener('blur', () => {
        messageInput.parentElement.style.transform = 'scale(1)';
    });
    
    // Add some personality with random tips
    const tips = [
        "💡 Tip: Try asking me about programming languages!",
        "🎯 Fun fact: I love helping with coding problems!",
        "✨ Did you know? I can tell jokes and help with math!",
        "🚀 Pro tip: Ask me about web development!"
    ];
    
    // Show a random tip after 10 seconds
    setTimeout(() => {
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        const tipElement = document.createElement('div');
        tipElement.className = 'message bot-message';
        tipElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-lightbulb"></i>
            </div>
            <div class="message-content">
                <p>${randomTip}</p>
                <span class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        `;
        document.getElementById('chatMessages').appendChild(tipElement);
    }, 10000);
});
