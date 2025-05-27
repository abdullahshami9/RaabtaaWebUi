// Make sure Socials/Index is included in your pages
createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
        return pages[`./Pages/${name}.jsx`]
    },
    // ... rest of your config
}); 

import '@material/web/all.js';
import '@material/web/button/filled-button.js';
import '@material/web/textfield/outlined-text-field.js'; 