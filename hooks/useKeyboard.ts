import { useEffect, useCallback } from 'react';

type KeyHandler = () => void;
type KeyMap = Record<string, KeyHandler>;

interface UseKeyboardOptions {
    enabled?: boolean;
    preventDefault?: boolean;
}

export function useKeyboard(
    keyMap: KeyMap, 
    options: UseKeyboardOptions = {}
): void {
    const { enabled = true, preventDefault = true } = options;

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!enabled) return;

        // Build key string
        const parts: string[] = [];
        if (event.metaKey || event.ctrlKey) parts.push('mod');
        if (event.altKey) parts.push('alt');
        if (event.shiftKey) parts.push('shift');
        
        // Normalize key name
        let key = event.key.toLowerCase();
        if (key === ' ') key = 'space';
        if (key === 'escape') key = 'esc';
        
        parts.push(key);
        const keyString = parts.join('+');

        // Check for matching handler
        const handler = keyMap[keyString] || keyMap[key];
        
        if (handler) {
            if (preventDefault) {
                event.preventDefault();
            }
            handler();
        }
    }, [keyMap, enabled, preventDefault]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}

// Common keyboard shortcuts hook
export function useCommonShortcuts(handlers: {
    onSearch?: () => void;
    onEscape?: () => void;
    onSave?: () => void;
    onNew?: () => void;
}): void {
    const keyMap: KeyMap = {};

    if (handlers.onSearch) {
        keyMap['mod+k'] = handlers.onSearch;
        keyMap['mod+/'] = handlers.onSearch;
    }
    if (handlers.onEscape) {
        keyMap['esc'] = handlers.onEscape;
    }
    if (handlers.onSave) {
        keyMap['mod+s'] = handlers.onSave;
    }
    if (handlers.onNew) {
        keyMap['mod+n'] = handlers.onNew;
    }

    useKeyboard(keyMap);
}

export default useKeyboard;