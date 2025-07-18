// =====================
// BOTPRESS INTEGRATION
// =====================
// This file has been updated to use Botpress instead of the custom Vibe chatbot.
// The following components have been replaced:
// - Vibe chatbot UI rendering (vibeRender)
// - Custom chat controls (setupChatControls)
// - Custom form handlers (setupFormHandlers)
// - Custom mobile touch handling (setupMobileBubbleHandlers)
//
// PRESERVED FUNCTIONALITY:
// - YouTube video display on webpage (updateWebpageVideoSection)
// - Video grid functions (getTimeAgo, copyVideoLink, etc.)
// - Action buttons for webpage interactions (setupActionButtons)
// - Video history management (vibeRecentQueries)
//
// BOTPRESS CHATBOT:
// - Loads via CDN scripts
// - Handles all chat interactions
// - Configured with CampASK Study Buddy branding
// - Maintains same study topic search functionality
// =====================
// Vibe Chatbot UI State
// =====================
let vibeChatOpen = false;
let vibeChatHistory = [];
let vibeIsTyping = false;
let vibeEmojiPickerOpen = false;
let vibeWelcomeShown = false;

// Video system state
let vibeRecentQueries = []; // Store last 5 user queries with videos
const MAX_RECENT_QUERIES = 5; // Maximum recent queries to store

function forceCleanVideoSection() {
  const videoSection = document.getElementById('related-videos-section');
  if (videoSection) {
    // Completely clear and reset the section
    videoSection.innerHTML = `
      <div class="no-videos-message">
        <h3>🎥 Related YouTube Videos</h3>
        <p>No recent searches yet. Ask the chatbot about any topic to see videos here!</p>
      </div>
    `;
    console.log('✅ Video section cleaned and reset');
  }
  
  // Also clear the vibeRecentQueries array
  vibeRecentQueries = [];
  
  // Remove from localStorage to prevent reload
  try {
    localStorage.removeItem('vibeRecentQueries');
    console.log('✅ Video history cleared from localStorage');
  } catch (e) {
    console.warn('Failed to clear video history from localStorage:', e);
  }
}

function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatBotMessage(text) {
  // Convert **text** to proper HTML bold tags while keeping other formatting
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    // Preserve emoji and other special characters
    .replace(/📚/g, '📚')
    .replace(/🔍/g, '🔍')
    .replace(/💡/g, '💡')
    .replace(/⚠️/g, '⚠️')
    .replace(/✨/g, '✨')
    .replace(/🤖/g, '🤖');
}

// Common emojis for quick access
const quickEmojis = [
  '😊', '👍', '🤔', '📚', '✨', '💡', '❓',
  '🎓', '✏️', '📝', '💪', '👏', '🌟', '💻'
];

// Handle emoji selection
function handleEmojiClick(emoji) {
  const input = document.getElementById('vibe-user-input');
  if (input) {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;
    input.value = text.substring(0, start) + emoji + text.substring(end);
    input.focus();
    input.selectionStart = input.selectionEnd = start + emoji.length;
    vibeEmojiPickerOpen = false;
    vibeRender();
  }
}

// Format timestamp
function formatTime(date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(date);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (messageDate >= today) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (messageDate >= yesterday) {
    return 'Yesterday ' + messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
           messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

// Reset and load chat history
function loadChatHistory() {
  try {
    // Always start fresh on page load - clear everything
    localStorage.removeItem('vibeChatHistory');
    localStorage.removeItem('vibeRecentQueries'); // ADD this line to clear video history
    
    vibeChatHistory = [];
    vibeRecentQueries = []; // Clear video queries array
    vibeWelcomeShown = false;
    
    console.log('✨ Chat state and video history reset successfully');
  } catch (e) {
    console.warn('Failed to reset chat state:', e);
  }
}

// Save chat history to localStorage
function saveChatHistory() {
  try {
    localStorage.setItem('vibeChatHistory', JSON.stringify(vibeChatHistory));
  } catch (e) {
    console.warn('Failed to save chat history:', e);
  }
}

// =====================
// Video Grid Functions
// =====================
function getTimeAgo(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now - time) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

function copyVideoLink(videoId) {
  const videoUrl = `https://youtube.com/watch?v=${videoId}`;
  
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(videoUrl).then(() => {
      showCopyNotification('Video link copied!');
    }).catch(err => {
      console.error('Failed to copy:', err);
      fallbackCopyTextToClipboard(videoUrl);
    });
  } else {
    fallbackCopyTextToClipboard(videoUrl);
  }
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.cssText = "position:fixed;top:0;left:0;opacity:0;";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    showCopyNotification('Video link copied!');
  } catch (err) {
    console.error('Fallback: Could not copy text: ', err);
    showCopyNotification('Failed to copy link');
  }
  
  document.body.removeChild(textArea);
}

function showCopyNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'vibe-copy-notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function generateVideoGrid() {
  let gridHTML = '';
  
  vibeRecentQueries.forEach((queryData, index) => {
    const videos = queryData.videos.slice(0, 3);
    const timeAgo = getTimeAgo(queryData.timestamp);
    
    gridHTML += `
      <div class="vibe-query-section">
        <div class="vibe-query-header">
          <h4 class="vibe-query-title">"${queryData.query}"</h4>
          <span class="vibe-query-time">${timeAgo}</span>
        </div>
        <div class="vibe-videos-grid">
          ${videos.map(video => `
            <div class="vibe-video-card">
              <div class="vibe-video-thumbnail">
                <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
              </div>
              <h5 class="vibe-video-title">${video.snippet.title}</h5>
              <p class="vibe-video-description">${video.snippet.description || 'No description available'}</p>
              <div class="vibe-video-actions">
                <a href="https://youtube.com/watch?v=${video.id.videoId}" target="_blank" class="vibe-watch-btn">▶️ Watch</a>
                <button onclick="copyVideoLink('${video.id.videoId}')" class="vibe-copy-btn">📋 Copy</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });
  
  return gridHTML;
}

// =====================
// DEPRECATED VIBE CHATBOT FUNCTIONS
// =====================
// The following functions are now deprecated and commented out
// since we're using Botpress instead of the custom Vibe chatbot.
// They are preserved for reference but no longer used.

//
// DEPRECATED: Vibe chatbot render function
// function vibeRender() {
//   // This function has been replaced by Botpress
//   console.warn('⚠️ vibeRender() is deprecated - using Botpress instead');
// }

// DEPRECATED: Vibe form handlers
// function setupFormHandlers() {
//   // This function has been replaced by Botpress
//   console.warn('⚠️ setupFormHandlers() is deprecated - using Botpress instead');
// }

// DEPRECATED: Vibe chat controls
// function setupChatControls() {
//   // This function has been replaced by Botpress
//   console.warn('⚠️ setupChatControls() is deprecated - using Botpress instead');
// }

// DEPRECATED: Vibe input handlers
// function setupInputHandlers() {
//   // This function has been replaced by Botpress
//   console.warn('⚠️ setupInputHandlers() is deprecated - using Botpress instead');
// }

// DEPRECATED: Vibe submit handler
// async function handleSubmit() {
//   // This function has been replaced by Botpress
//   console.warn('⚠️ handleSubmit() is deprecated - using Botpress instead');
// }

// =====================
// DISABLED VIBE FUNCTIONS - REPLACED WITH BOTPRESS
// =====================
  console.warn('⚠️ vibeRender() is disabled - using Botpress instead');
  return;
}

function openFirstYouTubeVideo(query) {
  const matchingQuery = vibeRecentQueries.find(q => 
    q.query.toLowerCase() === query.toLowerCase()
  );
  
  if (matchingQuery && matchingQuery.videos.length > 0) {
    const firstVideo = matchingQuery.videos[0];
    window.open(`https://youtube.com/watch?v=${firstVideo.id.videoId}`, '_blank');
  } else {
    window.open(`https://youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank');
  }
}

function setupInputHandlers() {
  console.warn('⚠️ setupInputHandlers() is disabled - using Botpress instead');
  return;
}

function updateSendButtonColor(value) {
  const sendBtn = document.getElementById('vibe-send-btn');
  if (sendBtn) {
    const svg = sendBtn.querySelector('path');
    if (svg) {
      svg.setAttribute('fill', value.trim() ? '#2563EB' : '#9CA3AF');
    }
  }
}

function debugChatInput() {
  const input = document.getElementById('vibe-user-input');
  const form = document.getElementById('vibe-chat-form');
  const sendBtn = document.getElementById('vibe-send-btn');
  
  console.log('🔍 Debug Info:');
  console.log('Input found:', !!input);
  console.log('Form found:', !!form);
  console.log('Send button found:', !!sendBtn);
  console.log('Chat open:', vibeChatOpen);
  console.log('Input focused:', document.activeElement === input);
  
  if (input) {
    console.log('Input value:', input.value);
    console.log('Input disabled:', input.disabled);
    console.log('Input readonly:', input.readOnly);
    input.focus();
    console.log('Focused input');
  }
}

// Debug and Testing Functions
// =====================
function testChatInput() {
  console.log('🔍 Testing chat input functionality...');
  
  const input = document.getElementById('vibe-user-input');
  const form = document.getElementById('vibe-chat-form');
  const sendBtn = document.getElementById('vibe-send-btn');
  
  console.log('📋 Input field:', input);
  console.log('📋 Form:', form);
  console.log('📋 Send button:', sendBtn);
  
  if (input) {
    console.log('✅ Input found');
    console.log('  - Value:', input.value);
    console.log('  - Disabled:', input.disabled);
    console.log('  - ReadOnly:', input.readOnly);
    console.log('  - TabIndex:', input.tabIndex);
    console.log('  - Event listeners:', getEventListeners ? getEventListeners(input) : 'DevTools needed for event listeners');
    
    // Test focus
    try {
      input.focus();
      console.log('✅ Focus test passed');
    } catch (e) {
      console.error('❌ Focus test failed:', e);
    }
    
    // Test typing simulation
    try {
      input.value = 'test typing';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      console.log('✅ Typing simulation passed');
    } catch (e) {
      console.error('❌ Typing simulation failed:', e);
    }
    
  } else {
    console.error('❌ Input field not found');
  }
  
  if (form) {
    console.log('✅ Form found');
    console.log('  - Action:', form.action);
    console.log('  - Method:', form.method);
  } else {
    console.error('❌ Form not found');
  }
  
  if (sendBtn) {
    console.log('✅ Send button found');
    console.log('  - Disabled:', sendBtn.disabled);
    console.log('  - Type:', sendBtn.type);
  } else {
    console.error('❌ Send button not found');
  }
  
  console.log('🔍 Input test complete');
}

// Make available globally for debugging
window.testChatInput = testChatInput;

// Scroll helper function for better UX
function scrollToLatestMessage() {
  const messages = document.getElementById('vibe-messages');
  if (messages) {
    messages.scrollTop = messages.scrollHeight;
    messages.style.scrollBehavior = 'smooth';
  }
}

// =====================
// Chatbot Logic
// =====================
async function handleSubmit() {
  console.warn('⚠️ handleSubmit() is disabled - using Botpress instead');
  return;
}

async function fetchLibraryAndVideo(query) {
  console.log('📚 Generating library link and YouTube video for:', query);
  
  try {
    // Generate RP Library search link
    const librarySearchUrl = `https://libopac.rp.edu.sg/client/en_GB/home/search/results?qu=${encodeURIComponent(query).replace(/%20/g, '+')}&rm=HOME0%7C%7C%7C1%7C%7C%7C0%7C%7C%7Ctrue&te=ILS`;
    
    // Fetch top 3 YouTube videos for webpage display
    const youtubeRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=3&q=${encodeURIComponent(query)}&key=AIzaSyCtCSDRGHN710uzX6t9faF35pWO8rhpLLY`);
    
    if (!youtubeRes.ok) {
      return `📚 **RP Library Resources**\n\n🔍 I found library resources for "${query}"\n\n💡 Check the RP Library for academic articles, ebooks, and research materials.`;
    }
    
    const youtubeData = await youtubeRes.json();
    const videos = youtubeData.items || [];
    
    if (videos.length === 0) {
      return `📚 **RP Library Resources**\n\n🔍 I found library resources for "${query}"\n\n💡 Check the RP Library for academic articles, ebooks, and research materials.`;
    }
    
    // Store query with videos for webpage display
    const queryData = {
      query: query,
      timestamp: new Date().toISOString(),
      videos: videos
    };
    
    // Add to recent queries (newest first, limit to 5)
    vibeRecentQueries.unshift(queryData);
    if (vibeRecentQueries.length > MAX_RECENT_QUERIES) {
      vibeRecentQueries.pop();
    }
    
    // Save to localStorage
    try {
      localStorage.setItem('vibeRecentQueries', JSON.stringify(vibeRecentQueries));
    } catch (e) {
      console.warn('Failed to save recent queries:', e);
    }
    
    // Update webpage video section
    updateWebpageVideoSection();
    
    // Return only RP Library link (videos shown on webpage)
    const response = `📚 **RP Library Resources**\n\n🔍 I found library resources for "${query}"`;
    
    return response;
    
  } catch (error) {
    console.error('❌ Failed to fetch resources:', error);
    return `📚 **RP Library Resources**\n\n🔍 I found library resources for "${query}"\n\n💡 Check the RP Library for academic articles and research materials.`;
  }
}

function updateWebpageVideoSection() {
  const videoSection = document.getElementById('related-videos-section');
  if (!videoSection) {
    console.warn('Related videos section not found on webpage');
    return;
  }
  
  // Check if vibeRecentQueries is empty or null
  if (!vibeRecentQueries || vibeRecentQueries.length === 0) {
    console.log('📹 No video history - showing empty state');
    videoSection.innerHTML = `
      <div class="no-videos-message">
        <h3>🎥 Related YouTube Videos</h3>
        <p>No recent searches yet. Ask the chatbot about any topic to see videos here!</p>
      </div>
    `;
    return; // Early return to prevent further processing
  }
  
  // Always start with clean slate
  videoSection.innerHTML = '';
  
  // Explicitly set ONLY this heading text
  let videosHTML = '<h3>🎥 Related YouTube Videos</h3>';
  
  vibeRecentQueries.forEach((queryData, index) => {
    const videos = queryData.videos.slice(0, 3);
    const timeAgo = getTimeAgo(queryData.timestamp);
    
    videosHTML += `
      <div class="vibe-query-section">
        <div class="vibe-query-header">
          <h4 class="vibe-query-title">"${queryData.query}"</h4>
          <span class="vibe-query-time">${timeAgo}</span>
        </div>
        <div class="vibe-videos-grid">
          ${videos.map(video => `
            <div class="vibe-video-card">
              <div class="vibe-video-thumbnail">
                <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}" loading="lazy">
              </div>
              <h5 class="vibe-video-title">${video.snippet.title}</h5>
              <p class="vibe-video-description">${video.snippet.description || 'No description available'}</p>
              <div class="vibe-video-actions">
                <a href="https://youtube.com/watch?v=${video.id.videoId}" target="_blank" class="vibe-watch-btn">▶️ Watch</a>
                <button onclick="copyVideoLink('${video.id.videoId}')" class="vibe-copy-btn">📋 Copy</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });
  
  videoSection.innerHTML = videosHTML;
  console.log('✅ Video section updated with ONLY "Related YouTube Videos" text');
}

// Clean video section on page load
function cleanVideoSection() {
  const videoSection = document.getElementById('related-videos-section');
  if (videoSection) {
    videoSection.innerHTML = `
      <div class="no-videos-message">
        <h3>🎥 Related YouTube Videos</h3>
        <p>No recent searches yet. Ask the chatbot about any topic to see videos here!</p>
      </div>
    `;
  }
}

// Setup action button handlers using event delegation
function setupActionButtons() {
  document.addEventListener('click', (e) => {
    const button = e.target.closest('.chatbot-button');
    if (!button) return;

    const action = button.dataset.action;
    if (!action) return;

    e.preventDefault();
    console.log('🎯 Action button clicked:', action);

    switch (action) {
      case 'ai-info':
        handleAIInfo();
        break;
      case 'sa3':
        window.open('https://mysa.rp.edu.sg', '_blank');
        break;
      case 'timer':
        window.open('https://pomofocus.io', '_blank');
        break;
      case 'clear':
        clearChat();
        break;
    }
  });
}

// Functions for handling quick actions
function handleAIInfo() {
  vibeChatHistory.push({
    sender: 'bot',
    text: "I'm your Study Buddy! 🤖\n\n✨ **What I do:**\n• Find RP Library resources for any topic you type\n• Show YouTube videos in the webpage section below\n• Provide quick action buttons for easy access\n\n💡 **How to use:** Just type any study topic (like 'Physics' or 'Programming') and I'll help you find resources!",
    timestamp: new Date().toISOString()
  });
  saveChatHistory();
  vibeRender();
  scrollToLatestMessage();
}

function showWelcomeMessage() {
  if (!vibeWelcomeShown) {
    // Add welcome message with example and instructions
    vibeChatHistory.push({
      sender: 'bot',
      text: 'Hi there! I am CampASK, your Study Buddy! 📚\n\nJust type in any topic and I\'ll find RP Library resources for you!\n\n💡 **Example:** Try typing "Linear Regression" or "Machine Learning"\n\n⚠️ **Note:** Please only type in study topics (no questions or sentences)',
      timestamp: new Date().toISOString()
    });

    // DO NOT add any action buttons - remove all actionButtons code

    vibeWelcomeShown = true;
    saveChatHistory();
    vibeRender();
    scrollToLatestMessage();
  }
}

// Manual function to clear all video history
function clearVideoHistory() {
  console.log('🧹 Manually clearing all video history...');
  
  // Clear the array
  vibeRecentQueries = [];
  
  // Remove from localStorage
  try {
    localStorage.removeItem('vibeRecentQueries');
    console.log('✅ Video history cleared from localStorage');
  } catch (e) {
    console.warn('Failed to clear video history from localStorage:', e);
  }
  
  // Clean the UI
  forceCleanVideoSection();
  
  console.log('✅ Video history completely cleared');
}

// Clear chat and reset state
function clearChat() {
  localStorage.removeItem('vibeChatHistory');
  vibeChatHistory = [];
  vibeWelcomeShown = false;
  
  // Also clear video history when clearing chat
  clearVideoHistory();
  
  vibeRender();
  showWelcomeMessage();
}

// ===============
// Init - REPLACED WITH BOTPRESS
// ===============
// Initialize Botpress chatbot (replacing Vibe)
function initBotpressChatbot() {
  console.log('🚀 Initializing Botpress chatbot...');
  
  // Clean up old Vibe code first
  cleanupOldVibeCode();
  
  // Force clean video section
  forceCleanVideoSection();
  
  // Setup action buttons for webpage (keep existing functionality)
  setupActionButtons();
  
    
  // Inject Botpress scripts
  injectBotpressScripts();
  
  console.log('✅ Botpress chatbot initialization complete');
}

// Inject Botpress chatbot scripts
function injectBotpressScripts() {
  console.log('📦 Injecting Botpress scripts...');
  
  // Remove existing Botpress scripts to prevent duplicates
  const existingScripts = document.querySelectorAll('script[src*="botpress"], script[src*="bpcontent"]');
  existingScripts.forEach(script => script.remove());
  
  // Function to inject script
  const injectScript = (src, id) => {
    return new Promise((resolve, reject) => {
      // Check if script already exists
      if (document.getElementById(id)) {
        console.log(`✅ Script ${id} already exists`);
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.id = id;
      script.src = src;
      script.defer = true;
      
      script.onload = () => {
        console.log(`✅ Loaded: ${src}`);
        resolve();
      };
      
      script.onerror = (error) => {
        console.error(`❌ Failed to load: ${src}`, error);
        reject(error);
      };
      
      document.head.appendChild(script);
    });
  };
  
  // Inject Botpress scripts in sequence
  injectScript('https://cdn.botpress.cloud/webchat/v3.2/inject.js', 'botpress-inject')
    .then(() => {
      return injectScript('https://files.bpcontent.cloud/2025/07/17/01/20250717015330-PKR7XBJJ.js', 'botpress-config');
    })
    .then(() => {
      console.log('✅ All Botpress scripts loaded successfully');
      
      // Wait a bit for Botpress to initialize, then configure
      setTimeout(() => {
        configureBotpress();
      }, 1000);
    })
    .catch((error) => {
      console.error('❌ Failed to load Botpress scripts:', error);
      showBotpressError();
    });
}

// Configure Botpress after it loads
function configureBotpress() {
  console.log('⚙️ Configuring Botpress...');
  
  // Check if Botpress is available
  if (typeof window.botpress !== 'undefined') {
    try {
      // Configure Botpress webchat
      window.botpress.init({
        composerPlaceholder: 'Type any study topic...',
        botName: 'CampASK Study Buddy',
        botAvatar: '📚',
        enableReset: true,
        enableTranscriptDownload: false,
        className: 'campask-botpress-chat'
      });

       // Setup integration after Botpress is ready
      setTimeout(() => {
        setupBotpressIntegration();
      }, 1000);

            console.log('✅ Botpress configured successfully');
    } catch (error) {
      console.error('❌ Failed to configure Botpress:', error);
    }
  } else {
    console.warn('⚠️ Botpress not yet available, retrying...');
    setTimeout(configureBotpress, 500);
  }
}

// Show error message if Botpress fails to load
function showBotpressError() {
  const errorDiv = document.createElement('div');
  errorDiv.id = 'botpress-error';
  errorDiv.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #ff4444;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    max-width: 300px;
  `;
  errorDiv.innerHTML = `
    ❌ Chatbot failed to load<br>
    <small>Please refresh the page to try again</small>
  `;
  
  document.body.appendChild(errorDiv);
  
  // Remove error after 5 seconds
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

function setupFormHandlers() {
  console.warn('⚠️ setupFormHandlers() is disabled - using Botpress instead');
  return;
}

function handleGlobalFormSubmit(e) {
  if (e.target.closest('#vibe-form')) {
    e.preventDefault();
    e.stopPropagation();
    console.log('📤 Form submit triggered');
    handleSubmit();
    return false;
  }
}

function handleGlobalKeydown(e) {
  if (e.key === 'Enter' && e.target.id === 'vibe-user-input' && !e.shiftKey) {
    e.preventDefault();
    console.log('⌨️ Enter key pressed in input');
    handleSubmit();
  }
}

function setupChatControls() {
  console.warn('⚠️ setupChatControls() is disabled - using Botpress instead');
      return;
    }

// Initialize on DOM load with error handling
document.addEventListener('DOMContentLoaded', () => {
  // Force clean video section first
  forceCleanVideoSection();
  
  try {
// Initialize Botpress chatbot instead of Vibe
    initBotpressChatbot();  } catch (error) {
    console.error('❌ Failed to initialize Botpress chatbot:', error);
    showBotpressError();
  }
  
  // Double-check cleanup after 1 second to ensure complete reset
  setTimeout(() => {
    console.log('🔄 Double-check cleanup running...');
    if (!vibeRecentQueries || vibeRecentQueries.length === 0) {
      forceCleanVideoSection();
      console.log('✅ Double-check completed - video section clean');
    }
  }, 1000);
});


// =====================
// BOTPRESS INTEGRATION FIXES
// =====================

// Add Botpress event listener to handle user messages
function setupBotpressIntegration() {
  console.log('🔧 Setting up Botpress integration...');
  
  // Wait for Botpress webchat to be available
  const checkBotpress = setInterval(() => {
    // Check for either window.botpressWebChat or window.botpress
    const webChat = window.botpressWebChat || window.botpress;
    
    if (webChat) {
    clearInterval(checkBotpress);
      console.log('🎯 Botpress webchat detected, setting up listeners...');
      
      try {
        // Method 1: Try onEvent API (most common)
        if (webChat.onEvent) {
          webChat.onEvent((event) => {
            console.log('📨 Botpress event received:', event);
            
            // Check for user message events
            if (event.type === 'message' && event.payload?.type === 'text') {
              const userMessage = event.payload.text;
              if (userMessage) {
                console.log('👤 User message detected:', userMessage);
                handleBotpressUserMessage(userMessage);
              }
        }
      });

    }
        
        // Method 2: Try addEventListener fallback
        else if (webChat.addEventListener) {
          webChat.addEventListener('message', (event) => {
            console.log('📨 Botpress message event:', event);
            
            if (event.detail?.type === 'text' && event.detail?.userId) {
              handleBotpressUserMessage(event.detail.text);
            }
          });
        }
        
        // Method 3: Try direct on() method
        else if (webChat.on) {
          webChat.on('message', (message) => {
            console.log('📨 Botpress on() message:', message);
            
            if (message.type === 'text' && message.userId) {
              handleBotpressUserMessage(message.text);
        }
      });
    }
      console.log('✅ Botpress integration setup complete');
    } catch (error) {
      console.error('❌ Error setting up Botpress integration:', error);
    }
    }
  }, 100);

  // Timeout after 10 seconds
  setTimeout(() => {
    clearInterval(checkBotpress);
    console.warn('⚠️ Botpress integration setup timed out');
  }, 10000);
}

// Handle user messages from Botpress
async function handleBotpressUserMessage(userMessage) {
  console.log('🎯 Processing user message for YouTube:', userMessage);
  
  try {
    // Generate library URL and fetch YouTube videos
    const librarySearchUrl = `https://libopac.rp.edu.sg/client/en_GB/home/search/results?qu=${encodeURIComponent(userMessage).replace(/%20/g, '+')}&rm=HOME0%7C%7C%7C1%7C%7C%7C0%7C%7C%7Ctrue&te=ILS`;
    
    // Fetch YouTube videos
    const youtubeRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=3&q=${encodeURIComponent(userMessage)}&key=AIzaSyCtCSDRGHN710uzX6t9faF35pWO8rhpLLY`);
    
    if (youtubeRes.ok) {
      const youtubeData = await youtubeRes.json();
      const videos = youtubeData.items || [];
      
      // Store query with videos
      const queryData = {
        query: userMessage,
        timestamp: new Date().toISOString(),
        videos: videos
      };
      
      // Add to recent queries
      vibeRecentQueries.unshift(queryData);
      if (vibeRecentQueries.length > MAX_RECENT_QUERIES) {
        vibeRecentQueries.pop();
      }
      
      // Save to localStorage
      localStorage.setItem('vibeRecentQueries', JSON.stringify(vibeRecentQueries));
      
      // Update webpage video section
      updateWebpageVideoSection();
      
      console.log('✅ YouTube videos updated for:', userMessage);
    }
  } catch (error) {
    console.error('❌ Error processing user message:', error);
  }
}

// Add action buttons to Botpress messages
function addActionButtonsToBotpressMessage(message) {
  // Extract query from message
  const queryMatch = message.text.match(/I found library resources for "([^"]+)"/);
  const query = queryMatch ? queryMatch[1] : 'study topic';
  
  // Add buttons to webpage (not to Botpress - use webpage buttons)
  setTimeout(() => {
    addWebpageActionButtons(query);
  }, 500);
}

// Add action buttons to webpage
function addWebpageActionButtons(query) {
  const videoSection = document.getElementById('related-videos-section');
  if (videoSection) {
    // Check if buttons already exist
    if (!videoSection.querySelector('.chatbot-action-buttons')) {
      const buttonsHTML = `
        <div class="chatbot-action-buttons" style="margin: 16px 0; display: flex; gap: 12px; flex-wrap: wrap;">
          <a href="https://libopac.rp.edu.sg/client/en_GB/home/search/results?qu=${encodeURIComponent(query).replace(/%20/g, '+')}&rm=HOME0%7C%7C%7C1%7C%7C%7C0%7C%7C%7Ctrue&te=ILS" 
             target="_blank" 
             class="webpage-action-btn library-btn"
             style="background: #2563EB; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500;">
            📚 Open RP Library
          </a>
          <button onclick="openFirstYouTubeVideo('${query}')" 
                  class="webpage-action-btn video-btn"
                  style="background: #ef4444; color: white; padding: 8px 16px; border-radius: 8px; border: none; font-size: 14px; font-weight: 500; cursor: pointer;">
            🎥 Watch YouTube Video
          </button>
        </div>
      `;
      
      // Insert buttons before video content
      videoSection.insertAdjacentHTML('afterbegin', buttonsHTML);
    }
  }
}

// Clean up old Vibe code - remove deprecated functions
function cleanupOldVibeCode() {
  console.log('🧹 Cleaning up old Vibe code...');
  
  // Remove any existing Vibe chatbot elements
  const existingVibeChatbot = document.getElementById('vibe-chatbot-root');
  if (existingVibeChatbot) {
    existingVibeChatbot.remove();
  }
  
  // Remove old event listeners
  const existingHandlers = document.querySelectorAll('[data-vibe-handler]');
  existingHandlers.forEach(el => el.removeAttribute('data-vibe-handler'));
  
  // Clear old chat history
  vibeChatHistory = [];
  vibeWelcomeShown = false;
  vibeChatOpen = false;
  
  console.log('✅ Old Vibe code cleaned up');
}
