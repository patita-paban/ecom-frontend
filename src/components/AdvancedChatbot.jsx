// AdvancedChatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaUser, FaShoppingCart, FaBox, FaTruck, FaQuestionCircle, FaSmile } from 'react-icons/fa';

const AdvancedChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hi! I'm ShopBot, your personal shopping assistant!\n\nI'm here to help you with:\n✨ Product recommendations\n📦 Order tracking\n🚚 Shipping info\n💰 Best deals\n\nWhat can I help you find today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Quick action buttons with emojis
  const quickActions = [
    { id: 1, icon: <FaShoppingCart />, text: "Track Order", keyword: "track my order", emoji: "📦" },
    { id: 2, icon: <FaBox />, text: "Best Deals", keyword: "show me deals", emoji: "🔥" },
    { id: 3, icon: <FaTruck />, text: "Shipping", keyword: "shipping info", emoji: "🚚" },
    { id: 4, icon: <FaQuestionCircle />, text: "Help", keyword: "help me", emoji: "💬" }
  ];

  // Comprehensive custom responses
  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    const greeting = userName ? `${userName}` : 'there';

    // Greeting patterns
    if (message.match(/^(hi|hello|hey|good morning|good afternoon|good evening|sup|yo)/)) {
      if (!userName) {
        setShowNameInput(true);
        return "Hey there! 😊\n\nI'd love to personalize your experience. What's your name?";
      }
      const greetings = [
        `Hello ${greeting}! 🌟 Great to see you! How can I make your shopping easier today?`,
        `Hey ${greeting}! 👋 Welcome back! Ready to find something amazing?`,
        `Hi ${greeting}! ✨ I'm excited to help you shop today!`
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Order tracking with specific order numbers
    if (message.includes('track') || message.includes('order status') || message.includes('where is my order') || message.includes('delivery')) {
      if (message.match(/#\d+/)) {
        const orderNumber = message.match(/#\d+/)[0];
        return `🔍 Looking up order ${orderNumber}...\n\n✅ Order Found!\n\n📦 Status: Out for Delivery\n🚚 Courier: FastShip Express\n📍 Last Location: Local distribution center\n⏰ Expected: Today by 6 PM\n🔗 Track: TRK${Math.random().toString().slice(2, 14)}\n\nYour package is almost there! 🎉`;
      }
      return `📦 Let me help you track your order!\n\n📝 Please provide your order number\n(Example: #12345)\n\nOr visit 'My Orders' → Click on any order → View live tracking 🔍\n\nYou'll see:\n✓ Current location\n✓ Delivery updates\n✓ Expected arrival time`;
    }

    // Product search and recommendations
    if (message.includes('product') || message.includes('show') || message.includes('find') || message.includes('search') || message.includes('looking for')) {
      return `🛍️ Let me help you discover amazing products!\n\n🔥 Popular Categories:\n• 📱 Electronics (Phones, Laptops, Tablets)\n• 👔 Fashion (Clothing, Shoes, Accessories)\n• 🏠 Home & Living (Furniture, Decor)\n• ⚽ Sports & Outdoors\n• 🎮 Gaming & Entertainment\n\n💡 Pro tip: Tell me your budget and preferences for personalized recommendations!\n\nWhat catches your eye?`;
    }

    // Electronics detailed response
    if (message.includes('phone') || message.includes('smartphone') || message.includes('iphone') || message.includes('samsung')) {
      return `📱 Awesome choice! Here are our trending smartphones:\n\n⭐ Top Picks:\n• iPhone 15 Pro Max - $1,099 ✨\n  📸 48MP camera, A17 chip\n  🎁 Free AirPods with purchase!\n\n• Samsung Galaxy S24 Ultra - $1,199\n  🖊️ Built-in S Pen, 200MP camera\n  📦 Free case + screen protector\n\n• Google Pixel 8 Pro - $899 💰\n  🤖 Best AI features, Pure Android\n  ⚡ Fast shipping available!\n\n🔥 Flash Sale: Extra 10% off today!\nUse code: PHONE10\n\nWant to see more details or compare?`;
    }

    if (message.includes('laptop') || message.includes('computer') || message.includes('macbook')) {
      return `💻 Great timing! Check out our laptop collection:\n\n🌟 Bestsellers:\n• MacBook Pro 16\" M3 - $2,299\n  ⚡ Powerful for creators\n  🎨 Perfect for video editing\n\n• Dell XPS 15 - $1,999\n  🖥️ 4K OLED display\n  🎮 Great for work & gaming\n\n• HP Spectre x360 - $1,499\n  ✏️ 2-in-1 convertible\n  🔋 16-hour battery life\n\n💸 Financing available from $99/month\n📦 Free next-day delivery!\n\nNeed help choosing? I can match your needs!`;
    }

    // Pricing and deals
    if (message.includes('price') || message.includes('cost') || message.includes('how much') || message.includes('cheap') || message.includes('affordable')) {
      return `💰 Let's talk value! Here's how we save you money:\n\n🎯 Current Deals:\n• 🔥 Flash Sale: Up to 50% off select items\n• 🎁 BOGO: Buy 1 Get 1 on accessories\n• 📦 FREE shipping on orders $50+\n• 💳 10% off first purchase (WELCOME10)\n• ⏰ Daily deals refresh at midnight\n\n💡 Smart Shopping Tips:\n✓ Subscribe for exclusive discounts\n✓ Check our clearance section\n✓ Bundle products for extra savings\n\n🔔 Want me to notify you of price drops?\n\nWhat's your budget? I'll find the best options!`;
    }

    // Deals and discounts
    if (message.includes('deal') || message.includes('discount') || message.includes('coupon') || message.includes('promo') || message.includes('sale') || message.includes('offer')) {
      return `🎉 Amazing deals waiting for you!\n\n🔥 ACTIVE PROMOTIONS:\n\n1️⃣ WELCOME10 - 10% off first order\n2️⃣ FREESHIP - Free shipping (no minimum)\n3️⃣ SAVE20 - $20 off orders $100+\n4️⃣ TECH15 - 15% off electronics\n5️⃣ FASHION25 - 25% off clothing\n\n⚡ Flash Deals (Today Only):\n• 📱 iPhones - Extra $100 off\n• 👟 Nike Shoes - Buy 2 Get 1 Free\n• 🎮 PlayStation 5 - $50 gift card included\n\n🎁 Plus: Earn 5% cashback on all purchases!\n\n💡 Apply codes at checkout. Can't combine.\n\nReady to save big?`;
    }

    // Shipping information
    if (message.includes('shipping') || message.includes('delivery') || message.includes('when will i receive') || message.includes('how long')) {
      return `🚚 Shipping Made Easy!\n\n📦 Delivery Options:\n\n1️⃣ Standard Shipping\n   ⏰ 5-7 business days\n   💰 FREE on orders $50+\n   📍 Nationwide coverage\n\n2️⃣ Express Shipping\n   ⚡ 2-3 business days\n   💵 $9.99 flat rate\n   📦 Priority handling\n\n3️⃣ Next Day Delivery\n   🚀 Order by 2 PM\n   💳 $19.99\n   🎯 Guaranteed arrival\n\n🌎 International Shipping:\n   ✈️ 7-14 days\n   🌍 100+ countries\n\n📍 Track your package in real-time!\n🔔 Get SMS/email updates\n\nWhere should we ship your order?`;
    }

    // Returns and refunds
    if (message.includes('return') || message.includes('refund') || message.includes('exchange') || message.includes('money back')) {
      return `↩️ Easy Returns, Zero Hassle!\n\n✅ Our Promise:\n• 🗓️ 30-day return window\n• 💰 Full refund guaranteed\n• 📦 Free return shipping\n• ⚡ Fast processing (2-3 days)\n\n📋 Return Process:\n1️⃣ Go to 'My Orders'\n2️⃣ Select item → 'Request Return'\n3️⃣ Choose reason\n4️⃣ Print free shipping label\n5️⃣ Drop off at any location\n\n💡 Requirements:\n✓ Unused condition\n✓ Original packaging\n✓ All accessories included\n✓ Receipt/proof of purchase\n\n🔄 Exchange available for different size/color\n💳 Refund within 5-7 business days\n\nNeed to return something specific?`;
    }

    // Payment options
    if (message.includes('payment') || message.includes('pay') || message.includes('credit card') || message.includes('method')) {
      return `💳 Flexible Payment Options!\n\n✅ We Accept:\n• 💳 Visa, Mastercard, AmEx, Discover\n• 📱 PayPal, Apple Pay, Google Pay\n• 🏦 Venmo, Cash App\n• 💰 Affirm (Buy now, pay later)\n\n🔒 100% Secure:\n✓ SSL encryption\n✓ PCI DSS compliant\n✓ No card details stored\n✓ Fraud protection\n\n💡 Payment Plans:\n📊 Split into 4 payments (0% interest)\n💵 As low as $25/month\n⏰ Flexible terms\n\nQuestions about a specific payment method?`;
    }

    // Account and profile
    if (message.includes('account') || message.includes('profile') || message.includes('sign up') || message.includes('register') || message.includes('login')) {
      return `👤 Your Account, Your Way!\n\n🎁 Member Benefits:\n• 💰 Exclusive discounts\n• 🚚 Faster checkout\n• 📦 Order tracking\n• ❤️ Wishlist & favorites\n• 🔔 Personalized alerts\n• 🎂 Birthday rewards\n\n🆓 FREE to join!\n\n📝 Create Account:\n1️⃣ Click 'Sign Up' (top right)\n2️⃣ Enter email + password\n3️⃣ Get instant 10% off code\n4️⃣ Start shopping!\n\n🔐 Already a member?\nLogin to access your dashboard\n\n🎉 Join 100,000+ happy shoppers!`;
    }

    // Contact and support
    if (message.includes('contact') || message.includes('support') || message.includes('email') || message.includes('phone') || message.includes('call')) {
      return `📞 We're Here For You!\n\n💬 Chat: You're here! (24/7 instant help)\n📧 Email: support@eshop.com\n   ⏰ Response: Within 2 hours\n📱 Phone: 1-800-SHOP-NOW\n   🕐 Mon-Fri: 8 AM - 8 PM EST\n   📅 Sat-Sun: 9 AM - 6 PM EST\n\n🌐 Social Media:\n📘 Facebook: @EShopOfficial\n📸 Instagram: @EShop\n🐦 Twitter: @EShopHelp\n   ⚡ Quick response guaranteed\n\n📍 Store Locations:\nFind a store near you at eshop.com/stores\n\n💡 Most questions answered instantly here!\nTry: "track order" or "return item"`;
    }

    // Help and FAQ
    if (message.includes('help') || message.includes('assist') || message.includes('support')) {
      return `🤝 I'm Your Shopping Buddy!\n\n💬 Ask Me About:\n\n🛍️ Shopping:\n  • Finding products\n  • Product recommendations\n  • Price comparisons\n  • Best deals\n\n📦 Orders:\n  • Tracking shipments\n  • Delivery estimates\n  • Order modifications\n\n💳 Payments:\n  • Payment methods\n  • Financing options\n  • Refund status\n\n↩️ Returns:\n  • Return policy\n  • Exchange process\n  • Refund timeline\n\n⚙️ Account:\n  • Sign up benefits\n  • Profile settings\n  • Saved items\n\n💡 Try asking:\n"Show me phones under $500"\n"Track order #12345"\n"What are today's deals?"\n\nI'm here 24/7! What do you need?`;
    }

    // Budget/price range queries
    if (message.match(/\$\d+/) || message.match(/under \d+/) || message.includes('budget')) {
      const match = message.match(/\$?(\d+)/);
      const budget = match ? match[1] : '500';
      return `💰 Perfect! I can help you shop within $${budget}!\n\n🎯 Best Value Products:\n\n✨ Top Picks in Your Range:\n• 📱 Budget smartphones ($${Math.floor(budget * 0.8)} - $${budget})\n• 💻 Laptops & tablets\n• 🎧 Premium audio\n• 👟 Designer shoes\n• 🎮 Gaming gear\n\n🔥 Smart Shopping:\n✓ Sort by "Best Value"\n✓ Check our sale section\n✓ Bundle deals save more\n✓ Apply coupon codes\n\n📊 Want to see:\n1️⃣ Top rated under $${budget}\n2️⃣ New arrivals\n3️⃣ Clearance deals\n\nWhich category interests you most?`;
    }

    // Thank you responses
    if (message.includes('thank') || message.includes('thanks') || message.includes('awesome') || message.includes('great')) {
      const responses = [
        `You're very welcome! 😊 It's my pleasure to help!\n\nIs there anything else you'd like to know? I'm here 24/7!`,
        `Happy to help! 🌟 That's what I'm here for!\n\nFeel free to ask me anything else!`,
        `My pleasure! ✨ Always here to make your shopping easier!\n\nNeed anything else?`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Goodbye messages
    if (message.includes('bye') || message.includes('goodbye') || message.includes('see you')) {
      return `👋 Goodbye ${greeting}! Thanks for chatting!\n\n🛍️ Happy Shopping!\n\n💡 Remember:\n• Free shipping over $50\n• 30-day easy returns\n• 24/7 support available\n\n🎁 Don't forget your 10% off code: WELCOME10\n\n✨ See you next time! Have an amazing day! 🌟\n\n(I'll be right here if you need me!)`;
    }

    // Recommendation requests
    if (message.includes('recommend') || message.includes('suggest') || message.includes('best')) {
      return `⭐ I'd love to recommend something perfect for you!\n\n🎯 To give you the BEST suggestions, tell me:\n\n1️⃣ What category?\n   (Electronics, Fashion, Home, etc.)\n\n2️⃣ Your budget?\n   (Helps narrow down options)\n\n3️⃣ Any preferences?\n   (Brand, color, features)\n\n💡 Popular Right Now:\n🔥 iPhone 15 Pro - Best camera phone\n⚡ MacBook Air M3 - Best for students\n👟 Nike Air Max - Most comfortable\n🎮 PS5 - Ultimate gaming\n\nOr just tell me what you're looking for!`;
    }

    // Complaint or problem
    if (message.includes('problem') || message.includes('issue') || message.includes('complaint') || message.includes('wrong')) {
      return `😔 I'm really sorry you're experiencing issues!\n\n🚨 Let me help fix this right away!\n\n📋 Please tell me more:\n• What went wrong?\n• Order number (if applicable)\n• What would make this right?\n\n⚡ Quick Options:\n1️⃣ Connect with supervisor\n2️⃣ Refund/replacement\n3️⃣ Expedited resolution\n\n💬 Or describe the issue and I'll escalate immediately.\n\n📞 For urgent matters:\nCall: 1-800-SHOP-NOW\nEmail: priority@eshop.com\n\nYour satisfaction is our priority! 🌟`;
    }

    // Default intelligent response
    return `🤔 Hmm, I want to make sure I help you properly!\n\n💬 I can assist with:\n✓ 🛍️ "Show me laptops under $1000"\n✓ 📦 "Track order #12345"\n✓ 🔥 "What are today's deals?"\n✓ 🚚 "Shipping information"\n✓ ↩️ "How do I return an item?"\n✓ 💳 "Payment options"\n\n💡 Try being more specific, or type:\n• "Help" - See all I can do\n• "Deals" - View current promotions\n• "Contact" - Reach human support\n\nI'm learning every day! 🤖\n\nWhat would you like to know?`;
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Check if this is a name input
    if (showNameInput && !userName) {
      setUserName(inputText.trim());
      setShowNameInput(false);
      
      const userMessage = {
        id: messages.length + 1,
        text: inputText,
        isBot: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInputText('');

      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: `Nice to meet you, ${inputText.trim()}! 🌟\n\nI'm excited to be your shopping assistant today!\n\n🎁 As a warm welcome, here's a special gift:\n🎉 Use code: WELCOME10 for 10% off your first order!\n\nHow can I help you shop smarter today?`,
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
      return;
    }

    // Regular message
    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputText),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  const handleQuickAction = (action) => {
    setInputText(action.keyword);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 group"
        >
          <FaComments size={28} className="group-hover:scale-110 transition-transform" />
          <span className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold shadow-lg animate-pulse">
            Hi!
          </span>
          <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-20"></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[420px] h-[550px] bg-white rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden border-4 border-purple-100 animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-600 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <FaRobot className="text-purple-600" size={26} />
                </div>
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></span>
              </div>
              <div>
                <h3 className="font-bold text-xl flex items-center gap-2">
                  ShopBot AI
                  <FaSmile className="text-yellow-300" size={18} />
                </h3>
                <p className="text-sm text-purple-100">
                  Your 24/7 Shopping Assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:bg-opacity-20 p-2 rounded-xl transition-all hover:rotate-90 duration-300"
            >
              <FaTimes size={22} />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 border-b-2 border-purple-100">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {quickActions.map(action => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:text-white transition-all text-sm font-semibold text-gray-700 whitespace-nowrap shadow-md hover:shadow-lg hover:scale-105 border-2 border-purple-200"
                >
                  <span className="text-lg">{action.emoji}</span>
                  <span>{action.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.isBot ? 'justify-start' : 'justify-end'} animate-fadeIn`}
              >
                {message.isBot && (
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FaRobot className="text-white" size={18} />
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.isBot ? '' : 'order-1'}`}>
                  <div
                    className={`p-4 rounded-2xl shadow-lg ${
                      message.isBot
                        ? 'bg-white border-2 border-purple-200 text-gray-800'
                        : 'bg-gradient-to-br from-purple-600 to-blue-600 text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line leading-relaxed font-medium">{message.text}</p>
                  </div>
                  <p className={`text-xs text-gray-500 mt-1 px-2 ${message.isBot ? 'text-left' : 'text-right'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>

                {!message.isBot && (
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FaUser className="text-white" size={18} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start animate-fadeIn">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <FaRobot className="text-white" size={18} />
                </div>
                <div className="bg-white border-2 border-purple-200 p-4 rounded-2xl shadow-lg">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t-2 border-purple-100">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={showNameInput ? "What's your name?" : "Type your message..."}
                className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-sm font-medium placeholder-gray-400 shadow-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className={`px-5 py-3 rounded-xl transition-all font-semibold shadow-lg ${
                  inputText.trim()
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-xl hover:scale-105'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <FaPaperPlane size={18} />
              </button>
            </div>
            <p className="text-xs text-center text-gray-500 mt-3 font-medium">
              💬 Powered by ShopBot AI • Always Here to Help
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default AdvancedChatbot;
