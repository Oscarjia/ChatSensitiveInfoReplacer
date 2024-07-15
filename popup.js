document.getElementById('saveBtn').addEventListener('click', () => {
    const patterns = document.getElementById('patterns').value.split('\n').map(pattern => pattern.trim()).filter(pattern => pattern !== '');
    const replacement = document.getElementById('replacement').value;
    chrome.storage.local.set({ patterns, replacement }, () => {
      alert('Settings saved');
    });
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['patterns', 'replacement'], (result) => {
      if (result.patterns) {
        document.getElementById('patterns').value = result.patterns.join('\n');
      }
      if (result.replacement) {
        document.getElementById('replacement').value = result.replacement;
      }
    });
  });
  