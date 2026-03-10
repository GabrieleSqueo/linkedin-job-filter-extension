document.addEventListener('DOMContentLoaded', () => {
  const ul = document.getElementById('jobList');
  // recupera la lista dei lavori salvata nel background
  chrome.storage.local.get('jobs', data => {
    const jobs = data.jobs || [];
    if (jobs.length === 0) {
      ul.innerHTML = '<li>Nessun lavoro salvato</li>';
      return;
    }
    jobs.forEach(job => {
      const li = document.createElement('li');
      li.textContent = `${job.Titolo} - ${job.Azienda} (${job.Luogo})`;
      if (job.Link) {
        const a = document.createElement('a');
        a.href = job.Link;
        a.textContent = ' [vai]';
        a.target = '_blank';
        li.appendChild(a);
      }
      ul.appendChild(li);
    });
  });
});
