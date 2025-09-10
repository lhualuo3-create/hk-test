// Enhanced popup script with domain detection
document.addEventListener('DOMContentLoaded', function() {
  const clearButton = document.getElementById('clearCookies');
  const checkButton = document.getElementById('checkCookies');
  const status = document.getElementById('status');
  
  // Check current tab domain
  async function checkCurrentDomain() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const url = new URL(tab.url);
      const domain = url.hostname;
      
      if (domain.includes('mozi-login.alibaba.net')) {
        showStatus('✓ You are on the target domain', 'success');
        return true;
      } else {
        showStatus(`ℹ Current domain: ${domain} (Extension works on any domain)`, 'info');
        return false;
      }
    } catch (error) {
      console.error('Error checking domain:', error);
      return false;
    }
  }
  
  // Show status message
  function showStatus(message, type = 'info') {
    status.innerHTML = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
    
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
  
  // Check existing cookies with detailed info
  async function checkCookies() {
    const originalText = showLoading(checkButton, 'Checking...');
    
    try {
      const domain = "mozi-login.alibaba.net";
      
      // Multiple ways to get cookies
      const methods = [
        { name: 'by domain', params: { domain: domain } },
        { name: 'by URL', params: { url: `https://${domain}` } },
        { name: 'by domain with dot', params: { domain: `.${domain}` } }
      ];
      
      let allCookies = [];
      let methodResults = [];
      
      for (const method of methods) {
        try {
          const cookies = await chrome.cookies.getAll(method.params);
          methodResults.push(`${method.name}: ${cookies.length} cookies`);
          allCookies = [...allCookies, ...cookies];
        } catch (error) {
          methodResults.push(`${method.name}: Error - ${error.message}`);
        }
      }
      
      // Deduplicate cookies
      const uniqueCookies = allCookies.filter((cookie, index, self) => 
        index === self.findIndex(c => c.name === cookie.name && c.domain === cookie.domain)
      );
      
      let message = `Search results:\n${methodResults.join('\n')}\n\n`;
      
      if (uniqueCookies.length === 0) {
        message += 'No cookies found for mozi-login.alibaba.net';
        showStatus(message, 'info');
      } else {
        const cookieDetails = uniqueCookies.map(c => 
          `${c.name} (domain: ${c.domain}, path: ${c.path})`
        ).join('\n');
        message += `Found ${uniqueCookies.length} unique cookies:\n${cookieDetails}`;
        showStatus(message, 'info');
      }
      
    } catch (error) {
      console.error('Error checking cookies:', error);
      showStatus(`Error checking cookies: ${error.message}`, 'error');
    } finally {
      hideLoading(checkButton, originalText);
    }
  }
  
  // Clear cookies with enhanced feedback
  async function clearCookies() {
    const originalText = showLoading(clearButton, 'Clearing...');
    
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'clearCookies'
      });
      
      if (response.success) {
        if (response.total === 0) {
          showStatus('No cookies found to clear', 'info');
        } else {
          const message = `Successfully cleared ${response.removed} of ${response.total} cookies`;
          showStatus(message, 'success');
          
          // Auto-refresh cookie check after clearing
          setTimeout(() => {
            checkCookies();
          }, 1000);
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
  
  // Initialize
  checkCurrentDomain().then(() => {
    checkCookies();
  });
});