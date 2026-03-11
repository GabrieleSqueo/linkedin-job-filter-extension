// Set per tenere traccia dei post già processati
const processedPosts = new Set();
let filterTimeout;
let filterEnabled = true; // Stato del filtro
let observer = null; // Observer globale

// Funzione per filtrare e nascondere i post non inerenti
function filterFeed(newPostsOnly = false) {
    // Se il filtro è disattivato, mostra tutti i post
    if (!filterEnabled) {
        const contentContainer = document.querySelector('.scaffold-finite-scroll__content');
        if (contentContainer) {
            const allPosts = contentContainer.querySelectorAll('[data-id^="urn:li:activity:"], [data-id^="urn:li:aggregate:"]');
            allPosts.forEach(post => {
                post.style.display = '';
            });
        }
        return;
    }

    const contentContainer = document.querySelector('.scaffold-finite-scroll__content');
    if (!contentContainer) return;

    // Seleziona tutti i post nel feed
    const allPosts = contentContainer.querySelectorAll('[data-id^="urn:li:activity:"], [data-id^="urn:li:aggregate:"]');

    allPosts.forEach(post => {
        const postId = post.getAttribute('data-id');
        
        // Se newPostsOnly è true, processa solo i post non ancora visti
        if (newPostsOnly && processedPosts.has(postId)) {
            return;
        }
        
        // Aggiungi il post ai post processati
        processedPosts.add(postId);
        
        // Cerca se il post contiene un'offerta di lavoro
        const subtitle = post.querySelector('.update-components-entity__subtitle');
        const isJobPosting = subtitle && subtitle.innerText.includes('Offerta di lavoro');
        
        if (isJobPosting) {
            // È una job card - mantienila visibile
            post.style.display = '';
            
        } else {
            // Non è una job card - nascondila
            post.style.display = 'none';
        }
    });
}

// Funzione per attivare/disattivare l'observer
function toggleObserver(enable) {
    const contentContainer = document.querySelector('.scaffold-finite-scroll__content');
    
    if (enable && !observer && contentContainer) {
        observer = new MutationObserver(() => {
            clearTimeout(filterTimeout);
            filterTimeout = setTimeout(() => {
                if (filterEnabled) {
                    filterFeed(true);
                }
            }, 300);
        });
        
        observer.observe(contentContainer, {
            childList: true,
            subtree: true
        });
        
        console.log('Observer attivato');
    } else if (!enable && observer) {
        observer.disconnect();
        observer = null;
        console.log('Observer disattivato');
    }
}

// Carica lo stato del filtro dal storage
chrome.storage.local.get('filterEnabled', data => {
    filterEnabled = data.filterEnabled !== false; // Default: abilitato
    filterFeed(false);
    toggleObserver(filterEnabled);
});

// Listener per i messaggi dal popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'toggleFilter') {
        filterEnabled = message.enabled;
        console.log('Filtro:', filterEnabled ? 'ACCESO ' : 'SPENTO ');
        
        if (filterEnabled) {
            // Filtra i post e attiva l'observer
            filterFeed(false);
            toggleObserver(true);
        } else {
            // Mostra tutti i post
            const contentContainer = document.querySelector('.scaffold-finite-scroll__content');
            if (contentContainer) {
                const allPosts = contentContainer.querySelectorAll('[data-id^="urn:li:activity:"], [data-id^="urn:li:aggregate:"]');
                allPosts.forEach(post => {
                    post.style.display = '';
                });
            }
            toggleObserver(false);
        }
    }
});

// Esegui il filtro inizialmente e attiva l'observer
filterFeed(false);
const initialContainer = document.querySelector('.scaffold-finite-scroll__content');
if (initialContainer) {
    toggleObserver(filterEnabled);
    console.log('Estensione avviata - Filtro:', filterEnabled ? 'ACCESO ' : 'SPENTO ');
}