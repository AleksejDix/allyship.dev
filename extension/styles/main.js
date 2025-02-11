export const baseStyles = `
  #ally-studio-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    grid-template-areas:
      "topbar topbar topbar"
      "left main right";
    grid-template-rows: 28px 1fr;
    grid-template-columns: 56px 1fr 300px;
    background: #1a1a1a;
    color: white;
    font-family: system-ui, -apple-system, sans-serif;
    z-index: 999999;
  }

  .top-bar {
    grid-area: topbar;
    background: rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    padding: 0 12px;
    gap: 12px;
    -webkit-app-region: drag;
    user-select: none;
    height: 28px;
  }

  .top-bar .logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    font-size: 13px;
  }

  .top-bar .logo .circle {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.8;
  }

  .top-bar .logo .g-1 {
    color: #3b82f6;
  }

  .top-bar .logo .g-2 {
    color: #06b6d4;
  }

  .top-bar .menu {
    display: flex;
    gap: 16px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
  }

  .top-bar .menu-item {
    cursor: pointer;
    -webkit-app-region: no-drag;
  }

  .top-bar .menu-item:hover {
    color: white;
  }

  .sidebar {
    grid-area: left;
    background: #1e293b;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px;
  }

  .sidebar.right {
    grid-area: right;
    border-right: none;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    width: 300px;
    padding: 16px;
  }

  .main-content {
    grid-area: main;
    position: relative;
    background: transparent;
    overflow: hidden;
  }

  #ally-studio-iframe {
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
  }
`

export const toolStyles = `
  .tool-btn {
    padding: 8px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    cursor: pointer;
    color: white;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    position: relative;
  }

  .tool-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .tool-btn:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    background: #0f172a;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    margin-left: 8px;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .tool-btn.active {
    background: #2563eb;
    border-color: #3b82f6;
  }

  .tool-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .tool-group-title {
    font-size: 11px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.4);
    margin: 8px 0 4px;
    text-align: center;
  }
`

export const highlightStyles = `
  .ally-highlight {
    position: relative !important;
    outline: 2px solid #06b6d4 !important;
    outline-offset: 2px !important;
    background-color: rgba(6, 182, 212, 0.15) !important;
  }

  .ally-label {
    position: absolute !important;
    top: -24px !important;
    left: 0 !important;
    background: #0891b2 !important;
    color: white !important;
    padding: 2px 8px !important;
    border-radius: 4px !important;
    font-size: 12px !important;
    font-family: system-ui, -apple-system, sans-serif !important;
    z-index: 999999 !important;
    pointer-events: none !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  }

  .ally-bug-button {
    position: absolute !important;
    top: -24px !important;
    right: 0 !important;
    background: #dc2626 !important;
    color: white !important;
    padding: 2px 8px !important;
    border-radius: 4px !important;
    font-size: 12px !important;
    font-family: system-ui, -apple-system, sans-serif !important;
    cursor: pointer !important;
    border: none !important;
    z-index: 999999 !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  }

  .ally-bug-button:hover {
    background: #b91c1c !important;
  }
`
