const CACHE_KEY = 'toolsofsaas_tools_cache';
const UPCOMING_CACHE_KEY = 'toolsofsaas_upcoming_cache';

/**
 * Save tools to sessionStorage.
 * sessionStorage clears when the tab is closed, but persists on reload.
 */
export function cacheTools(tools, upcomingTools) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(tools));
    sessionStorage.setItem(UPCOMING_CACHE_KEY, JSON.stringify(upcomingTools));
  } catch (e) {
    // sessionStorage full or unavailable — fail silently
  }
}

/**
 * Get tools from sessionStorage.
 * Returns null if not cached, forcing a fresh Sanity fetch.
 */
export function getCachedTools() {
  try {
    const tools = sessionStorage.getItem(CACHE_KEY);
    const upcoming = sessionStorage.getItem(UPCOMING_CACHE_KEY);
    if (tools && upcoming) {
      return {
        tools: JSON.parse(tools),
        upcomingTools: JSON.parse(upcoming),
      };
    }
  } catch (e) {
    // sessionStorage unavailable — fail silently
  }
  return null;
}

/**
 * Clear cached tools (useful for forcing a refresh).
 */
export function clearToolsCache() {
  try {
    sessionStorage.removeItem(CACHE_KEY);
    sessionStorage.removeItem(UPCOMING_CACHE_KEY);
  } catch (e) {
    // fail silently
  }
}
