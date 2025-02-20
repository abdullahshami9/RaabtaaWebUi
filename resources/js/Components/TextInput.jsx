import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <input
            {...props}
            type={type}
            className={
                'w-full px-4 py-2 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 ' +
                'focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 ' +
                'dark:focus:ring-blue-400/20 rounded-lg bg-white dark:bg-gray-700 ' +
                'placeholder-gray-400 dark:placeholder-gray-500 ' +
                className
            }
            ref={input}
        />
    );
});
