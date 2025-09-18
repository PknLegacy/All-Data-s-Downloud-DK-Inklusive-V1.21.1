document.addEventListener('DOMContentLoaded', async ()=>{
  // Populate SCP list (demo)
  const scpList = document.getElementById('scpList');
  const demo = [{id:'scp-512-001',title:'The Red Door'},{id:'scp-512-002',title:'Static Echo'},{id:'scp-512-073',title:'Censor Fog'}];
  demo.forEach(s=>{const d=document.createElement('div');d.className='scp-item';d.textContent=s.id+' — '+s.title;d.onclick=()=>{document.getElementById('panelTitle').textContent=s.title;document.getElementById('panelContent').textContent='Class: Unknown — Click modules below to inspect further.'};scpList.appendChild(d)});

  // fetch assets manifest (local JSON)
  let manifest = {assets:[],documents:[]};
  try{
    const res = await fetch('assets/manifest.json');
    if(res.ok) manifest = await res.json();
  }catch(e){console.warn('No manifest found',e)}

  // show manifest in sidebar when requested
  const manifestView = document.getElementById('manifestView');
  function showManifest(){ manifestView.innerHTML = '<strong>Assets:</strong><br>'+ (manifest.assets.length?manifest.assets.join('<br>'):'(none)') + '<hr><strong>Documents:</strong><br>' + (manifest.documents.length?manifest.documents.join('<br>'):'(none)'); }

  document.getElementById('btnOpenManifest').addEventListener('click', ()=>{ showManifest(); });
  document.getElementById('btnOpenHTML1').addEventListener('click', ()=>{ openModule('pages/html1.html'); });

  // box clicks: open pages in panel via fetch and inject
  document.querySelectorAll('.box').forEach(b=>{
    b.addEventListener('click', async ()=>{
      const target = b.dataset.target;
      if(target==='assets'){ showManifest(); document.getElementById('panelTitle').textContent='Assets Manifest'; document.getElementById('panelContent').textContent='See right sidebar.'; }
      else if(target==='documents'){ showManifest(); document.getElementById('panelTitle').textContent='Documents'; document.getElementById('panelContent').textContent='Documents listed in the manifest.'; }
      else if(target==='open-all'){ openModule('pages/html1.html'); setTimeout(()=>openModule('pages/html2.html'),600); setTimeout(()=>openModule('pages/html3.html'),1200); }
      else { openModule(target); }
    });
  });

  async function openModule(path){
    try{
      const res = await fetch(path);
      if(!res.ok) { document.getElementById('panelTitle').textContent='Error loading module'; document.getElementById('panelContent').textContent='Module not found: '+path; return; }
      const html = await res.text();
      document.getElementById('panelTitle').textContent = path.split('/').pop().replace('.html','');
      // sanitize minimal: place inside a container
      document.getElementById('panelContent').innerHTML = html;
    }catch(e){ document.getElementById('panelContent').textContent = 'Failed to load: '+e.message; }
  }

  // Ctrl+P toggle show/hide (demo: prevents print)
  document.addEventListener('keydown',(e)=>{
    if(e.ctrlKey && e.key.toLowerCase()==='p'){
      e.preventDefault();
      const container = document.querySelector('.container');
      if(container.style.display === 'none') container.style.display = '';
      else container.style.display = 'none';
    }
  });
});
