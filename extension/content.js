// Create and inject the editor wrapper
function createEditorWrapper() {
  // Save original body content
  const originalContent = document.body.innerHTML;

  // Create wrapper elements
  const editorWrapper = document.createElement('div');
  editorWrapper.id = 'ally-studio-wrapper';

  // Create toolbar
  const toolbar = document.createElement('div');
  toolbar.id = 'ally-studio-toolbar';

  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.id = 'ally-studio-content';
  contentContainer.innerHTML = originalContent;

  // Add elements to wrapper
  editorWrapper.appendChild(toolbar);
  editorWrapper.appendChild(contentContainer);

  // Replace body content with our wrapper
  document.body.innerHTML = '';
  document.body.appendChild(editorWrapper);
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'activateEditor') {
    createEditorWrapper();
    sendResponse({ success: true });
  }
  return true;
});

// Add styles for the wrapper UI
const styles = `
  #ally-studio-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #f5f5f5;
    z-index: 999999;
    display: flex;
    flex-direction: column;
  }

  #ally-studio-toolbar {
    height: 48px;
    background: #2c3e50;
    color: white;
    padding: 0 16px;
    display: flex;
    align-items: center;
  }

  #ally-studio-content {
    flex: 1;
    overflow: auto;
    padding: 20px;
    background: white;
    margin: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Initialize content script
console.log('AllyStudio content script loaded');
