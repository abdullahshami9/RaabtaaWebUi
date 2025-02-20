export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 border border-transparent 
                rounded-lg font-semibold text-xs text-white uppercase tracking-widest 
                hover:bg-blue-700 dark:hover:bg-blue-600 focus:bg-blue-700 dark:focus:bg-blue-600 
                active:bg-blue-800 dark:active:bg-blue-700 focus:outline-none focus:ring-2 
                focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 
                transition ease-in-out duration-150 ${disabled && 'opacity-25'} ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
