document.addEventListener('DOMContentLoaded', () => {
  const ul = document.getElementById('jobList');
  const toggleButton = document.getElementById('toggleFilter');
  
  // Carica lo stato del filtro
  chrome.storage.local.get('filterEnabled', data => {
    const isEnabled = data.filterEnabled !== false; // Default: abilitato
    updateToggleButton(isEnabled);
  });

  // Evento click sul toggle button
  toggleButton.addEventListener('click', () => {
    chrome.storage.local.get('filterEnabled', data => {
      const isEnabled = data.filterEnabled !== false;
      const newState = !isEnabled;
      
      // Salva il nuovo stato
      chrome.storage.local.set({ filterEnabled: newState });
      
      // Aggiorna il button
      updateToggleButton(newState);
      
      // Invia un messaggio al content script per attivare/disattivare il filtro
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'toggleFilter',
          enabled: newState
        });
      });
    });
  });

  // Funzione per aggiornare il visual del toggle button
  function updateToggleButton(isEnabled) {
    if (isEnabled) {
      toggleButton.classList.add('active');
      toggleButton.title = 'Filtro attivo - Clicca per disattivare';
    } else {
      toggleButton.classList.remove('active');
      toggleButton.title = 'Filtro disattivo - Clicca per attivare';
    }
  }

  
});
