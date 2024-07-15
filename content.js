// Function to replace sensitive information based on user-defined patterns
function replaceSensitiveInfo(text, patterns, replacement) {
    let modifiedText = text;
  
    patterns.forEach(pattern => {
      const regex = new RegExp(pattern, "gi");
      modifiedText = modifiedText.replace(regex, replacement);
    });
  
    // Replace file paths and only keep the last file name
    const filePathRegex = /(?:\/[^\/]+)+\/([^\/]+)(?=\s|$|\/)/g;
    modifiedText = modifiedText.replace(filePathRegex, `${replacement}/$1`);
  
    return modifiedText;
  }
  
  // Function to handle keyup events
  function handleKeyUpEvent(event) {
    chrome.storage.local.get(['patterns', 'replacement'], (result) => {
      const patterns = result.patterns || [];
      const replacement = result.replacement || "*****";
  
      if (event.target.value) {
        const originalValue = event.target.value;
        const newValue = replaceSensitiveInfo(originalValue, patterns, replacement);
        if (originalValue !== newValue) {
          event.target.value = newValue;
        }
      }
    });
  }
  
  // Function to observe changes in the DOM and apply replacements
  function observeChanges() {
    chrome.storage.local.get(['patterns', 'replacement'], (result) => {
      const patterns = result.patterns || [];
      const replacement = result.replacement || "*****";
  
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
                if (node.innerHTML) {
                  const modifiedText = replaceSensitiveInfo(node.innerHTML, patterns, replacement);
                  if (node.innerHTML !== modifiedText) {
                    node.innerHTML = modifiedText;
                  }
                }
              }
            });
          }
        });
      });
  
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
  
      // Add event listeners to input fields and text areas for keyup event
      document.querySelectorAll('input, textarea').forEach(element => {
        element.addEventListener('keyup', handleKeyUpEvent);
      });
    });
  }
  
  // Initial replacement on page load
  document.addEventListener("DOMContentLoaded", observeChanges);
  