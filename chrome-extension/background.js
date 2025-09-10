// Chrome Extension Service Worker for clearing cookies
console.log('Background script loaded');

// Function to clear cookies for specific domain
async function clearMoziCookies() {
  try {
    const domain = "mozi-login.alibaba.net";
    const url = `https://${domain}`;
    
    // Get all cookies for the domain
    const cookies = await chrome.cookies.getAll({ domain: domain });
    console.log(`Found ${cookies.length} cookies for ${domain}`);
    
    // Also get cookies for the exact URL
    const urlCookies = await chrome.cookies.getAll({ url: url });
    console.log(`Found ${urlCookies.length} cookies for URL ${url}`);
    
    // Combine and deduplicate cookies
    const allCookies = [...cookies, ...urlCookies];
    const uniqueCookies = allCookies.filter((cookie, index, self) => 
      index === self.findIndex(c => c.name === cookie.name && c.domain === cookie.domain)
    );
    
    console.log(`Total unique cookies to remove: ${uniqueCookies.length}`);
    
    // Remove each cookie
    const removePromises = uniqueCookies.map(cookie => {
      const cookieUrl = `https://${cookie.domain.startsWith('.') ? cookie.domain.slice(1) : cookie.domain}${cookie.path}`;
      console.log(`Removing cookie: ${cookie.name} from ${cookieUrl}`);
      
      return chrome.cookies.remove({
        url: cookieUrl,
        name: cookie.name
      });
    });
    
    const results = await Promise.allSettled(removePromises);
    const successCount = results.filter(result => result.status === 'fulfilled' && result.value).length;
    const failureCount = results.length - successCount;
    
    console.log(`Successfully removed ${successCount} cookies, ${failureCount} failed`);
    
    return {
      success: true,
      removed: successCount,
      failed: failureCount,
      total: uniqueCookies.length
    };
    
  } catch (error) {
    console.error('Error clearing cookies:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'clearCookies') {
    clearMoziCookies().then(result => {
      sendResponse(result);
    });
    return true; // Keep the message channel open for async response
  }
});

// Optional: Clear cookies when extension icon is clicked (if no popup)
// chrome.action.onClicked.addListener(async (tab) => {
//   const result = await clearMoziCookies();
//   console.log('Cookies cleared via icon click:', result);
// });