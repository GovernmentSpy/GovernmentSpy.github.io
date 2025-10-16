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
        const lowerMessage = message.toLowerCase();
        
        // Greeting detection
        if (this.isGreeting(lowerMessage)) {
            return this.getRandomResponse(this.botPersonality.responses.greeting);
        }
        
        // Joke request
        if (lowerMessage.includes('joke') || lowerMessage.includes('funny') || lowerMessage.includes('laugh')) {
            return this.getRandomResponse(this.botPersonality.responses.joke);
        }
        
        // Coding help - expanded patterns
        if (lowerMessage.includes('code') || lowerMessage.includes('programming') || 
            lowerMessage.includes('coding') || lowerMessage.includes('help me with coding') ||
            lowerMessage.includes('how to code') || lowerMessage.includes('learn programming') ||
            lowerMessage.includes('developer') || lowerMessage.includes('software')) {
            return this.generateCreativeCodingResponse(message);
        }
        
        // Math notes request
        if (lowerMessage.includes('math notes') || lowerMessage.includes('my notes') ||
            lowerMessage.includes('show notes') || lowerMessage.includes('math collection')) {
            return this.displayMathNotes();
        }
        
        // Help request - expanded patterns
        if (lowerMessage.includes('help') || lowerMessage.includes('what can you') ||
            lowerMessage.includes('what do you do') || lowerMessage.includes('capabilities') ||
            lowerMessage.includes('assist') || lowerMessage.includes('support')) {
            return this.botPersonality.responses.help.join('\n');
        }
        
        // Weather
        if (lowerMessage.includes('weather') || lowerMessage.includes('temperature') ||
            lowerMessage.includes('rain') || lowerMessage.includes('sunny')) {
            return this.generateWeatherResponse();
        }
        
        // Time
        if (lowerMessage.includes('time') || lowerMessage.includes('what time') ||
            lowerMessage.includes('clock') || lowerMessage.includes('hour')) {
            return this.generateTimeResponse();
        }
        
        // Date
        if (lowerMessage.includes('date') || lowerMessage.includes('what date') ||
            lowerMessage.includes('today') || lowerMessage.includes('day')) {
            return this.generateDateResponse();
        }
        
        // Math - improved detection
        if (this.isMathExpression(message)) {
            try {
                const result = this.evaluateMathExpression(message);
                return this.generateMathResponse(message, result);
            } catch (error) {
                return "I'm not sure about that math problem. Could you rephrase it?";
            }
        }
        
        // Programming languages - expanded
        if (lowerMessage.includes('javascript') || lowerMessage.includes('js') ||
            lowerMessage.includes('node') || lowerMessage.includes('react')) {
            return this.generateJavaScriptResponse(message);
        }
        
        if (lowerMessage.includes('python') || lowerMessage.includes('django') ||
            lowerMessage.includes('flask') || lowerMessage.includes('pandas')) {
            return this.generatePythonResponse(message);
        }
        
        if (lowerMessage.includes('html') || lowerMessage.includes('css') ||
            lowerMessage.includes('web design') || lowerMessage.includes('frontend')) {
            return this.generateWebDevResponse(message);
        }
        
        // Technology topics
        if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence') ||
            lowerMessage.includes('machine learning') || lowerMessage.includes('ml')) {
            return this.generateAIResponse(message);
        }
        
        if (lowerMessage.includes('database') || lowerMessage.includes('sql') ||
            lowerMessage.includes('mysql') || lowerMessage.includes('mongodb')) {
            return this.generateDatabaseResponse(message);
        }
        
        // General questions
        if (lowerMessage.includes('what is') || lowerMessage.includes('explain') ||
            lowerMessage.includes('define') || lowerMessage.includes('meaning')) {
            return this.generateExplanationResponse(message);
        }
        
        if (lowerMessage.includes('how to') || lowerMessage.includes('tutorial') ||
            lowerMessage.includes('learn') || lowerMessage.includes('guide')) {
            return this.generateLearningResponse(message);
        }
        
        if (lowerMessage.includes('problem') || lowerMessage.includes('issue') ||
            lowerMessage.includes('error') || lowerMessage.includes('bug')) {
            return this.generateProblemSolvingResponse(message);
        }
        
        // Questions about the bot itself
        if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you') ||
            lowerMessage.includes('your name') || lowerMessage.includes('introduce')) {
            return this.generateSelfIntroduction();
        }
        
        // Feelings and emotions
        if (lowerMessage.includes('how are you') || lowerMessage.includes('feeling') ||
            lowerMessage.includes('mood')) {
            return this.generateEmotionalResponse();
        }
        
        // Thank you responses
        if (lowerMessage.includes('thank') || lowerMessage.includes('thanks') ||
            lowerMessage.includes('appreciate')) {
            return this.generateThankYouResponse();
        }
        
        // Goodbye
        if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye') ||
            lowerMessage.includes('see you') || lowerMessage.includes('farewell')) {
            return this.generateGoodbyeResponse();
        }
        
        // More intelligent default responses based on question patterns
        if (lowerMessage.includes('?') || lowerMessage.includes('what') || 
            lowerMessage.includes('why') || lowerMessage.includes('how') ||
            lowerMessage.includes('when') || lowerMessage.includes('where')) {
            return this.generateQuestionResponse(message);
        }
        
        // Default response - more engaging
        return this.generateCreativeDefaultResponse(message);
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
