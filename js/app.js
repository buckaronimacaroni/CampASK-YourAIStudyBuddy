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
// Vibe Render Engine
// =====================
function vibeRender() {
  try {
    let root = document.getElementById('vibe-chatbot-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'vibe-chatbot-root';
      document.body.appendChild(root);
    }

    // Save the action buttons if they exist
    const existingActions = document.querySelector('.chatbot-actions');
  
  root.innerHTML = `
    <div id="vibe-bubble" style="position:fixed;bottom:32px;right:32px;width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#2563EB,#60A5FA);display:${vibeChatOpen?'none':'flex'};align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(37,99,235,0.18);cursor:pointer;z-index:9999;transition:all 0.3s ease-in-out;transform:scale(1);">
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#fff" opacity="0.08"/><path d="M7 10h10M7 14h6" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>
    </div>
    <div id="vibe-chatbox" style="position:fixed;bottom:${vibeChatOpen ? '32px' : '-600px'};right:32px;width:370px;max-width:98vw;height:540px;max-height:98vh;background:#fff;border-radius:18px;box-shadow:0 8px 32px rgba(37,99,235,0.18);display:flex;flex-direction:column;z-index:9999;overflow:hidden;transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);opacity:${vibeChatOpen ? '1' : '0'};">
      <div style="background:linear-gradient(90deg,#2563EB,#60A5FA);color:#fff;padding:18px 20px 14px 20px;font-size:1.2rem;font-weight:bold;letter-spacing:0.5px;display:flex;align-items:center;justify-content:space-between;">
        <span>Your Study Buddy</span>
        <div style="display:flex;gap:12px;align-items:center;">
          <button onclick="clearChat()" style="background:none;border:none;color:#fff;cursor:pointer;font-size:1.1rem;padding:4px;opacity:0.8;transition:opacity 0.2s;border-radius:4px;" onmouseover="this.style.opacity=1;this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.opacity=0.8;this.style.background='none'" title="Clear Chat">🧹</button>
          <span id='vibe-minimise' onclick='vibeChatOpen=false;vibeRender();' style='cursor:pointer;font-size:1.3rem;font-weight:normal;transition:opacity 0.2s;opacity:0.8;' title='Minimise' onmouseover='this.style.opacity=1' onmouseout='this.style.opacity=0.8'>−</span>
        </div>
      </div>
      <div id="vibe-messages" style="flex:1;overflow-y:auto;padding:18px 12px 12px 12px;background:#f5f6fa;height:100%;max-height:100%;">
        ${vibeChatHistory.map(msg => {
          const time = msg.timestamp ? formatTime(msg.timestamp) : '';
          if (msg.sender === 'user') {
            return `<div style="display:flex;justify-content:flex-end;margin-bottom:10px;opacity:1;transform:translateY(0);transition:all 0.3s ease-out;">
              <div style="max-width:70%;background:#E5E7EB;color:#22223B;padding:12px 18px;border-radius:18px 18px 4px 18px;font-size:1rem;word-break:break-word;transition:transform 0.2s ease-out;position:relative;" onmouseover="this.style.transform='scale(1.01)'" onmouseout="this.style.transform='scale(1)'">
                ${escapeHTML(msg.text)}
                <div style="font-size:0.75rem;color:#6B7280;margin-top:4px;text-align:right;">${time}</div>
              </div>
            </div>`;
          } else {
            let messageContent = msg.text;
            
            // Add action buttons to each bot reply (except welcome message)
            if (!msg.text.includes('Hi there! I am CampASK') && !msg.text.includes('Related YouTube Videos')) {
              // Extract the query from the message for button links
              const queryMatch = msg.text.match(/I found library resources for "([^"]+)"/);
              const query = queryMatch ? queryMatch[1] : 'study topic';
              
              messageContent += `
                <div class="bot-action-buttons">
                  <a href="https://libopac.rp.edu.sg/client/en_GB/home/search/results?qu=${encodeURIComponent(query).replace(/%20/g, '+')}&rm=HOME0%7C%7C%7C1%7C%7C%7C0%7C%7C%7Ctrue&te=ILS" target="_blank" class="bot-action-btn library-btn">
                    📚 Open RP Library
                  </a>
                  <button onclick="openFirstYouTubeVideo('${query}')" class="bot-action-btn video-btn">
                    🎥 Watch YouTube Video
                  </button>
                  <button onclick="scrollToVideosSection()" class="bot-action-btn more-btn">
                    📺 More YouTube Videos
                  </button>
                </div>
              `;
            }
            
            return `<div style="display:flex;align-items:flex-end;margin-bottom:14px;opacity:1;transform:translateY(0);transition:all 0.3s ease-out;">
              <div style="width:28px;height:28px;border-radius:50%;background:#2563EB;display:flex;align-items:center;justify-content:center;margin-right:8px;position:relative;bottom:-8px;transition:transform 0.2s ease-out;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'"><svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#fff" opacity="0.12"/><path d="M12 7a2 2 0 0 1 2 2v1h-4V9a2 2 0 0 1 2-2zm-4 7v-1a4 4 0 0 1 8 0v1a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2z" fill="#fff"/></svg></div>
              <div class="vibe-bot-msg" style="max-width:70%;background:#1F2937;color:#fff;padding:12px 18px;border-radius:18px 18px 18px 4px;font-size:1rem;word-break:break-word;transition:transform 0.2s ease-out;position:relative;" onmouseover="this.style.transform='scale(1.01)'" onmouseout="this.style.transform='scale(1)'">
                ${formatBotMessage(messageContent)}
                <div style="font-size:0.75rem;color:#9CA3AF;margin-top:4px;">${time}</div>
              </div>
            </div>`;
          }
        }).join('')}
        ${vibeIsTyping ? `
          <div style="display:flex;align-items:flex-end;margin-bottom:14px;opacity:1;transform:translateY(0);transition:all 0.3s ease-out;">
            <div style="width:28px;height:28px;border-radius:50%;background:#2563EB;display:flex;align-items:center;justify-content:center;margin-right:8px;position:relative;bottom:-8px;">
              <svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#fff" opacity="0.12"/><path d="M12 7a2 2 0 0 1 2 2v1h-4V9a2 2 0 0 1 2-2zm-4 7v-1a4 4 0 0 1 8 0v1a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2z" fill="#fff"/></svg>
            </div>
            <div style="max-width:70%;background:#1F2937;color:#fff;padding:12px 18px;border-radius:18px 18px 18px 4px;font-size:1rem;">
              <div style="display:flex;align-items:center;gap:4px;">
                <span style="width:6px;height:6px;border-radius:50%;background:#fff;opacity:0.6;animation:typing 1s infinite">•</span>
                <span style="width:6px;height:6px;border-radius:50%;background:#fff;opacity:0.6;animation:typing 1s infinite 0.2s">•</span>
                <span style="width:6px;height:6px;border-radius:50%;background:#fff;opacity:0.6;animation:typing 1s infinite 0.4s">•</span>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
      <style>
        @keyframes typing {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      </style>
      <form id="vibe-form" style="display:flex;align-items:center;padding:10px 10px 10px 10px;background:#f3f4f6;border-top:1px solid #e5e7eb;position:relative;">
        <button type="button" id="vibe-emoji-btn" style="background:none;border:none;outline:none;cursor:pointer;padding:8px;margin-right:4px;display:flex;align-items:center;transition:transform 0.2s ease-out;opacity:0.7;" onmouseover="this.style.opacity=1;this.style.transform='scale(1.1)'" onmouseout="this.style.opacity=0.7;this.style.transform='scale(1)'" onclick="vibeEmojiPickerOpen=!vibeEmojiPickerOpen;vibeRender()">
          😊
        </button>
        ${vibeEmojiPickerOpen ? `
          <div style="position:absolute;bottom:100%;left:10px;background:white;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);padding:8px;display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:8px;z-index:1000;transform-origin:bottom left;animation:scaleIn 0.2s ease-out;">
            ${quickEmojis.map(emoji => `
              <button type="button" onclick="handleEmojiClick('${emoji}')" style="background:none;border:none;outline:none;cursor:pointer;padding:6px;border-radius:6px;transition:all 0.2s;font-size:1.2rem;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='none'">${emoji}</button>
            `).join('')}
          </div>
        ` : ''}
        <input id="vibe-user-input" type="text" autocomplete="off" placeholder="Ask me anything..." style="flex:1;padding:10px 14px;border-radius:12px;border:none;background:#fff;font-size:1rem;outline:none;box-shadow:0 1px 4px rgba(37,99,235,0.04);margin-right:8px;transition:box-shadow 0.2s ease-out;" onmouseover="this.style.boxShadow='0 2px 8px rgba(37,99,235,0.08)'" onmouseout="this.style.boxShadow='0 1px 4px rgba(37,99,235,0.04)'"/>
        <button id="vibe-send-btn" type="submit" style="background:none;border:none;outline:none;cursor:pointer;padding:0 8px;display:flex;align-items:center;transition:transform 0.2s ease-out;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
          <svg width="28" height="28" viewBox="0 0 24 24"><path d="M3 20l18-8-18-8v6l12 2-12 2z" fill="${document.getElementById('vibe-user-input')&&document.getElementById('vibe-user-input').value? '#2563EB':'#9CA3AF'}" style="transition:fill 0.2s ease-out;"/></svg>
        </button>
      </form>
      <div id="vibe-emoji-picker" style="position:absolute;bottom:100%;right:10px;width=300px;background:#fff;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.2);display:${vibeEmojiPickerOpen ? 'block' : 'none'};z-index:10000;padding:10px;transition:opacity 0.3s ease-out, transform 0.3s ease-out;transform:translateY(${vibeEmojiPickerOpen ? '0' : '10px'});opacity:${vibeEmojiPickerOpen ? '1' : '0'};">
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${quickEmojis.map(emoji => `<div style="font-size:1.5rem;cursor:pointer;" title="Insert ${emoji}" onclick="handleEmojiClick('${emoji}')">${emoji}</div>`).join('')}
        </div>
      </div>
    </div>
  `;

  // Reinsert the action buttons if they existed
  if (existingActions) {
    const messagesContainer = document.getElementById('vibe-messages');
    const firstMessage = messagesContainer.querySelector('.vibe-bot-msg');
    if (firstMessage) {
      firstMessage.parentNode.after(existingActions);
    }
  }
  
  // Setup input handlers after render
  setupInputHandlers();
  
  } catch (error) {
    console.error('❌ Error in vibeRender:', error);
    // Fallback minimal render
    let root = document.getElementById('vibe-chatbot-root');
    if (root) {
      root.innerHTML = '<div style="color: red; padding: 20px;">Chatbot render error. Please refresh.</div>';
    }
  }
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

function scrollToVideosSection() {
  const videoSection = document.getElementById('related-videos-section');
  if (videoSection) {
    videoSection.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
    videoSection.classList.add('highlight-section');
    setTimeout(() => {
      videoSection.classList.remove('highlight-section');
    }, 2000);
  } else {
    alert('Please scroll down to see the "Related YouTube Videos" section on this page!');
  }
}

function setupInputHandlers() {
  setTimeout(() => {
    const input = document.getElementById('vibe-user-input');
    const sendBtn = document.getElementById('vibe-send-btn');
    
    if (input && !input.hasAttribute('data-vibe-handler')) {
      console.log('🎯 Setting up input handlers for:', input.id);
      
      // Mark as handled to prevent duplicate listeners
      input.setAttribute('data-vibe-handler', 'true');
      
      // Focus the input
      input.focus();
      
      // Simple input handler for send button color
      input.addEventListener('input', (e) => {
        console.log('📝 Input value changed:', e.target.value);
        updateSendButtonColor(e.target.value);
      });
      
      console.log('✅ Input handlers set successfully');
    }
    
    // Handle send button clicks
    if (sendBtn && !sendBtn.hasAttribute('data-vibe-handler')) {
      sendBtn.setAttribute('data-vibe-handler', 'true');
      sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('🖱️ Send button clicked');
        handleSubmit();
      });
    }
  }, 50);
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
  console.log('🚀 handleSubmit called');
  
  const input = document.getElementById('vibe-user-input');
  if (!input) {
    console.error('❌ Input field not found');
    return;
  }
  
  const userMsg = input.value?.trim();
  if (!userMsg) {
    console.log('⚠️ Empty message, not sending');
    return;
  }
  
  console.log('📤 User message:', userMsg);

  // Clear input immediately
  input.value = '';
  
  // Save user message
  vibeChatHistory.push({ 
    sender: 'user', 
    text: userMsg, 
    timestamp: new Date().toISOString() 
  });
  saveChatHistory();
  vibeRender();
  scrollToLatestMessage();
  
  // Show typing indicator
  vibeIsTyping = true;
  vibeRender();

  try {
    // Generate response
    console.log('📚 Generating response...');
    const resourceReply = await fetchLibraryAndVideo(userMsg);
    console.log('📨 Response generated:', resourceReply);
    
    // Hide typing and show response
    vibeIsTyping = false;
    vibeChatHistory.push({ 
      sender: 'bot', 
      text: resourceReply, 
      timestamp: new Date().toISOString() 
    });
    saveChatHistory();
    vibeRender();
    scrollToLatestMessage();
    
    // Focus input after response
    setTimeout(() => {
      const newInput = document.getElementById('vibe-user-input');
      if (newInput) {
        newInput.focus();
      }
    }, 100);
    
  } catch (error) {
    console.error('❌ Error in handleSubmit:', error);
    vibeIsTyping = false;
    vibeChatHistory.push({
      sender: 'bot',
      text: '⚠️ Sorry, I encountered an error. Please try again.',
      timestamp: new Date().toISOString()
    });
    saveChatHistory();
    vibeRender();
  }
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
  console.log('🔧 Setting up form handlers');
  
  // Remove existing event listeners to prevent conflicts
  const existingHandlers = document.querySelectorAll('[data-vibe-handler]');
  existingHandlers.forEach(el => {
    el.removeAttribute('data-vibe-handler');
  });
  
  // Single event listener for form submission
  document.addEventListener('submit', handleGlobalFormSubmit, { once: false });
  document.addEventListener('keydown', handleGlobalKeydown, { once: false });
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
  // Setup event listeners with proper delegation
  document.addEventListener('click', (e) => {
    const bubble = e.target.closest('#vibe-bubble');
    const minimise = e.target.closest('#vibe-minimise');
    const chatbox = e.target.closest('#vibe-chatbox');
    const chatForm = e.target.closest('#vibe-form');

    // Don't close if clicking inside chatbox or form
    if (chatbox || chatForm) {
      e.stopPropagation();
      return;
    }

    // Handle bubble and minimize clicks
    if (bubble) {
      console.log('🔵 Opening chatbot');
      vibeChatOpen = true;
      vibeRender();
      showWelcomeMessage();
    } else if (minimise) {
      console.log('🔵 Minimizing chatbot');
      vibeChatOpen = false;
      vibeRender();
    }
  });

  // 🚀 IMPROVED Mobile-safe touch handling for bubble
  function setupMobileBubbleHandlers() {
    const bubble = document.getElementById('vibe-bubble');
    if (bubble && !bubble.hasAttribute('data-touch-handler')) {
      bubble.setAttribute('data-touch-handler', 'true');
      
      // Add touchstart for mobile devices with better event handling
      bubble.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('📱 Touch opening chatbot');
        
        // Prevent double-triggering by adding a small delay flag
        if (bubble.hasAttribute('data-touch-processing')) return;
        bubble.setAttribute('data-touch-processing', 'true');
        
        vibeChatOpen = true;
        vibeRender();
        showWelcomeMessage();
        
        // Clear processing flag after animation
        setTimeout(() => {
          bubble.removeAttribute('data-touch-processing');
        }, 300);
      }, { passive: false });
      
      // Add pointerdown as fallback for various devices
      bubble.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch' && !bubble.hasAttribute('data-touch-processing')) {
          e.preventDefault();
          e.stopPropagation();
          console.log('👆 Pointer touch opening chatbot');
          
          bubble.setAttribute('data-touch-processing', 'true');
          vibeChatOpen = true;
          vibeRender();
          showWelcomeMessage();
          
          setTimeout(() => {
            bubble.removeAttribute('data-touch-processing');
          }, 300);
        }
      });
      
      // Add visual feedback for mobile taps
      bubble.addEventListener('touchstart', () => {
        bubble.style.transform = 'scale(0.95)';
        bubble.style.transition = 'transform 0.1s ease';
      }, { passive: true });
      
      bubble.addEventListener('touchend', () => {
        bubble.style.transform = 'scale(1)';
      }, { passive: true });
      
      console.log('✅ Mobile touch handlers added to bubble');
    }
  }
  
  // IMPROVED MutationObserver with better performance
  const bubbleObserver = new MutationObserver((mutations) => {
    let shouldSetup = false;
    
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          if (node.id === 'vibe-bubble' || (node.querySelector && node.querySelector('#vibe-bubble'))) {
            shouldSetup = true;
          }
        }
      });
    });
    
    if (shouldSetup) {
      // Debounce multiple rapid calls
      setTimeout(setupMobileBubbleHandlers, 50);
    }
  });
  
  // Start observing for bubble creation
  bubbleObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Also try immediate setup in case bubble already exists
  setTimeout(setupMobileBubbleHandlers, 100);
  // Handle emoji picker clicks
  document.addEventListener('click', (e) => {
    if (vibeEmojiPickerOpen && 
        !e.target.closest('#vibe-emoji-btn') && 
        !e.target.closest('.emoji-picker')) {
      vibeEmojiPickerOpen = false;
      vibeRender();
    }
  });

  // Add mobile-friendly styles
  const styleId = 'vibe-mobile-styles';
  if (!document.getElementById(styleId)) {
    const mobileStyles = document.createElement('style');
    mobileStyles.id = styleId;
    mobileStyles.innerHTML = `
      @media screen and (max-width: 600px) {
        #vibe-chatbox {
          width: 94vw !important;
          right: 3vw !important;
          bottom: 24px !important;
        }
        #vibe-bubble {
          right: 16px !important;
          bottom: 16px !important;
        }
      }
    `;
    document.head.appendChild(mobileStyles);
  }

  console.log('✅ Vibe chatbot initialized successfully');
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
  
  // Wait for Botpress to be available
  const checkBotpress = setInterval(() => {
    if (typeof window.botpress !== 'undefined') {
      clearInterval(checkBotpress);
      
      // Listen for Botpress events
      window.botpress.on('message', (message) => {
        console.log('📨 Botpress message received:', message);
        
        // If it's a user message, process it for YouTube videos
        if (message.type === 'text' && message.userId) {
          handleBotpressUserMessage(message.text);
        }
      });
      
      // Listen for bot messages to add action buttons
      window.botpress.on('botMessage', (message) => {
        console.log('🤖 Bot message received:', message);
        
        // Check if it's a library resource response
        if (message.text && message.text.includes('RP Library Resources')) {
          addActionButtonsToBotpressMessage(message);
        }
      });
      
      console.log('✅ Botpress integration setup complete');
    }
  }, 100);
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
          <button onclick="scrollToVideosSection()" 
                  class="webpage-action-btn more-btn"
                  style="background: #10b981; color: white; padding: 8px 16px; border-radius: 8px; border: none; font-size: 14px; font-weight: 500; cursor: pointer;">
            📺 More Videos
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
