// Set per tenere traccia dei post già processati
const processedPosts = new Set();
let filterTimeout;

// Funzione per filtrare e nascondere i post non inerendi
function filterFeed(newPostsOnly = false) {
    const contentContainer = document.querySelector('.scaffold-finite-scroll__content');
    if (!contentContainer) return;

    // Seleziona tutti i post nel feed
    const allPosts = contentContainer.querySelectorAll('[data-id^="urn:li:activity:"], [data-id^="urn:li:aggregate:"]');
    
    // Crea un array per salvare i risultati
    const jobsList = [];
    let newJobsFound = false;

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
            newJobsFound = true;
            /** 
            // Estrai i dati della job
            const titleElement = post.querySelector('.update-components-entity__title');
            const title = titleElement ? titleElement.innerText.trim() : null;
            
            const companyElement = post.querySelector('.update-components-entity__subtitle');
            let company = companyElement ? companyElement.innerText.trim() : null;
            if (company) {
                company = company.replace(/^Offerta di lavoro di\s+/i, '');
            }
            
            const locationElement = post.querySelector('.update-components-entity__description');
            const location = locationElement ? locationElement.innerText.trim() : null;
            
            const linkElement = post.querySelector('a.update-components-entity__content');
            const link = linkElement ? linkElement.href : null;
            
            if (title) {
                jobsList.push({
                    Titolo: title,
                    Azienda: company,
                    Luogo: location,
                    Link: link
                });
            }
                */
        } else {
            // Non è una job card - nascondila
            post.style.display = 'none';
        }
    });

    // Invia i dati solo se ci sono job
    if (jobsList.length > 0) {
        console.log('Job postings trovate:', jobsList.length);
        console.table(jobsList);
        
        // invia i dati raccolti al background per conservarli
        chrome.runtime.sendMessage({ type: 'jobs', jobs: jobsList });
    }
}

// Esegui il filtro inizialmente
filterFeed(false);

// Monitor dei cambiamenti nel feed per eseguire il filtro continuamente
const contentContainer = document.querySelector('.scaffold-finite-scroll__content');

if (contentContainer) {
    const observer = new MutationObserver(() => {
        // Debounce: aspetta 300ms prima di filtrare i nuovi post
        clearTimeout(filterTimeout);
        filterTimeout = setTimeout(() => {
            filterFeed(true); // true = processa solo i nuovi post
        }, 300);
    });

    // Configura l'observer per monitorare i cambiamenti dei figli (nuovi post)
    observer.observe(contentContainer, {
        childList: true,
        subtree: true
    });

    console.log('Feed filter attivato - Monitoraggio continuo dei cambiamenti');
} else {
    console.log(' Content container non trovato');
}