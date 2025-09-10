// Popup script for Chrome extension
document.addEventListener('DOMContentLoaded', function() {
  const clearButton = document.getElementById('clearCookies');
  const checkButton = document.getElementById('checkCookies');
  const status = document.getElementById('status');
  
  // Show status message
  function showStatus(message, type = 'info') {
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
    
    // Auto-hide after 5 seconds for success messages
    if (type === 'success') {
      setTimeout(() => {
        status.style.display = 'none';
      }, 5000);
    }
  }
  
  // Show loading state
  function showLoading(button, text) {
    const originalText = button.textContent;
    button.disabled = true;
    button.innerHTML = `<span class="loading"></span>${text}`;
    return originalText;
  }
  
  // Hide loading state
  function hideLoading(button, originalText) {
    button.disabled = false;
    button.innerHTML = originalText;
  }
  
  // Check existing cookies
  async function checkCookies() {
    const originalText = showLoading(checkButton, 'Checking...');
    
    try {
      const domain = "mozi-login.alibaba.net";
      
      // Get cookies for domain
      const domainCookies = await chrome.cookies.getAll({ domain: domain });
      
      // Get cookies for URL
      const urlCookies = await chrome.cookies.getAll({ url: `https://${domain}` });
      
      // Combine and deduplicate
      const allCookies = [...domainCookies, ...urlCookies];
      const uniqueCookies = allCookies.filter((cookie, index, self) => 
        index === self.findIndex(c => c.name === cookie.name && c.domain === cookie.domain)
      );
      
      if (uniqueCookies.length === 0) {
        showStatus('No cookies found for mozi-login.alibaba.net', 'info');
      } else {
        const cookieNames = uniqueCookies.map(c => c.name).join(', ');
        showStatus(`Found ${uniqueCookies.length} cookies: ${cookieNames}`, 'info');
      }
      
    } catch (error) {
      console.error('Error checking cookies:', error);
      showStatus(`Error checking cookies: ${error.message}`, 'error');
    } finally {
      hideLoading(checkButton, originalText);
    }
  }
  
  // Clear cookies
  async function clearCookies() {
    const originalText = showLoading(clearButton, 'Clearing...');
    
    try {
      // Send message to background script
      const response = await chrome.runtime.sendMessage({
        action: 'clearCookies'
      });
      
      if (response.success) {
        if (response.total === 0) {
          showStatus('No cookies found to clear', 'info');
        } else {
          showStatus(`Successfully cleared ${response.removed} of ${response.total} cookies`, 'success');
        }
      } else {
        showStatus(`Error: ${response.error}`, 'error');
      }
      
    } catch (error) {
      console.error('Error clearing cookies:', error);
      showStatus(`Error: ${error.message}`, 'error');
    } finally {
      hideLoading(clearButton, originalText);
    }
  }
  
  // Event listeners
  clearButton.addEventListener('click', clearCookies);
  checkButton.addEventListener('click', checkCookies);
  
  // Auto-check cookies when popup opens
  checkCookies();
});