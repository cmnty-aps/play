const Search={
    render(){
        gid('view-search').innerHTML=`
        <div class="pt-6 px-4 mb-3 flex items-center gap-3">
            <button onclick="App.switch('home')" class="btn-back" title="Kembali ke Beranda">
                <i data-lucide="arrow-left" class="w-5 h-5"></i>
            </button>
            <div class="min-w-0 flex-1">
                <h1 class="text-2xl font-black text-white tracking-tight truncate">Pencarian Musik</h1>
            </div>
        </div>
        <div class="px-4">
            <form id="search-form" class="relative" autocomplete="off">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center text-[#6b7280]">
                    <i data-lucide="search" class="h-5 w-5"></i>
                </div>
                <input type="text" id="search-input" class="w-full glass-input text-white font-medium rounded-xl pl-12 pr-20 py-3.5 focus:outline-none placeholder:text-[#6b7280] text-sm" placeholder="Cari lagu, artis, atau album..." autocomplete="off" />
                <button type="submit" class="absolute right-2 top-1/2 -translate-y-1/2 btn-chrome font-bold px-4 py-1.5 rounded-lg active:scale-90 text-xs shadow-md">Cari</button>
            </form>
            <div id="suggestions" class="hidden mt-2 glass-strong rounded-xl shadow-2xl max-h-72 overflow-y-auto hide-scrollbar z-30 relative"></div>
        </div>
        <div id="search-history-container" class="px-4 mt-6"></div>
        <div id="filter-tabs" class="hidden flex gap-2 px-4 pb-3 mt-3 overflow-x-auto hide-scrollbar"><button onclick="setFilter('all')" id="f-all" class="filter-tab active px-4 py-2 rounded-full text-xs font-bold bg-white text-black shrink-0">Semua</button><button onclick="setFilter('songs')" id="f-songs" class="filter-tab glass px-4 py-2 rounded-full text-xs font-medium text-white shrink-0">Lagu</button><button onclick="setFilter('artists')" id="f-artists" class="filter-tab glass px-4 py-2 rounded-full text-xs font-medium text-white shrink-0">Artis</button></div>
        <div class="px-4 mt-2 max-w-full overflow-hidden" id="search-results"></div>`;
        lucide.createIcons();Search.events();Search.renderHistory();
    },
    renderHistory(){
        var h=[]; try{ h=JSON.parse(localStorage.getItem('search_history')||'[]'); }catch(e){h=[];}
        var c=gid('search-history-container');if(!c)return;
        if(S.sq || h.length===0){c.classList.add('hidden');return;}
        c.classList.remove('hidden');
        c.innerHTML='<div class="flex items-center justify-between mb-3"><h2 class="text-xs font-bold text-neutral-400 uppercase tracking-widest">Pencarian Terakhir</h2><button onclick="Search.clearHistory()" class="text-xs text-neutral-500 hover:text-white transition">Hapus</button></div><div class="flex flex-wrap gap-2 max-w-full">'+h.map(function(q){return'<button onclick="selectSuggestion(\''+es(q).replace(/'/g,"\\'")+'\')" class="glass hover:bg-white/10 px-3.5 py-2 rounded-full text-xs flex items-center gap-2 max-w-full min-w-0 transition active:scale-95"><i data-lucide="history" class="w-3.5 h-3.5 text-[#6b7280] shrink-0"></i><span class="truncate">'+es(q)+'</span></button>';}).join('')+'</div>';
        lucide.createIcons();
    },
    saveHistory(q){
        var h=[]; try{ h=JSON.parse(localStorage.getItem('search_history')||'[]'); }catch(e){h=[];}
        h=h.filter(function(i){return i!==q;});h.unshift(q);h=h.slice(0,10);
        localStorage.setItem('search_history',JSON.stringify(h));
    },
    clearHistory(){localStorage.removeItem('search_history');Search.renderHistory();},
    events(){
        var sf=gid('search-form'),si=gid('search-input');if(!sf||!si)return;
        sf.addEventListener('submit',async function(e){
            e.preventDefault();S.sq=si.value.trim();
            if(!S.sq){S.ar=[];S.sr=[];S.artists=[];Search.show();Search.renderHistory();return;}
            Search.saveHistory(S.sq);
            var sg=gid('suggestions');if(sg)sg.classList.add('hidden');
            var sh=gid('search-history-container');if(sh)sh.classList.add('hidden');
            var url=location.origin+'/?search='+encodeURIComponent(S.sq);
            history.pushState({},'',url);
            Search.show(true);
            try{
                var r=await fetch(API.search+'?query='+encodeURIComponent(S.sq));
                var d=await r.json();
                S.ar=d.status&&d.result.songs?d.result.songs.map(function(s){
                    return{id:s.videoId,videoId:s.videoId,title:cn(s.title),artist:cn(s.artist),artistId:s.artistId||'',cover:s.cover||s.thumbnail||FI,ytUrl:s.url};
                }):[];
                S.artists=d.status&&d.result.artists?d.result.artists:[];
                var ft=gid('filter-tabs');if(ft)ft.classList.remove('hidden');
                Search.apply();
            }catch(e){S.ar=[];S.artists=[];Search.show();}
        });
        si.addEventListener('input',function(){var q=this.value.trim();if(!q){var sg=gid('suggestions');if(sg)sg.classList.add('hidden');return;}fetch(API.suggest+'?q='+encodeURIComponent(q)).then(function(r){return r.json();}).then(function(s){var sg=gid('suggestions');if(!sg)return;if(Array.isArray(s)&&s.length>0){sg.innerHTML=s.map(function(sg){return'<div onclick="selectSuggestion(\''+es(sg).replace(/'/g,"\\'")+'\')" class="px-4 py-3 hover:bg-white/5 cursor-pointer text-sm">'+es(sg)+'</div>';}).join('');sg.classList.remove('hidden');}else{sg.classList.add('hidden');}});});
        document.addEventListener('click',function(e){if(!e.target.closest('#search-form')&&!e.target.closest('#suggestions')){var sg=gid('suggestions');if(sg)sg.classList.add('hidden');}});
    },
    show(loading){
        var c=gid('search-results');if(!c)return;if(!S.sq){c.innerHTML='';return;}
        if(loading){c.innerHTML='<div class="text-center mt-10"><div class="w-8 h-8 border-3 border-[#cfd3d8] border-t-transparent rounded-full animate-spin mx-auto"></div></div>';return;}
        
        var html = '';
        
        // Show Artists if filter is all or artists
        if((S.filter==='all' || S.filter==='artists') && S.artists.length > 0){
            html += '<div class="mb-6"><h2 class="text-lg font-bold mb-3">Artis</h2><div class="flex gap-4 overflow-x-auto hide-scrollbar pb-2">';
            S.artists.forEach(function(a){
                html += '<div onclick="Artist.open(\''+a.id+'\',\''+es(a.name).replace(/'/g,"\\'")+'\')" class="flex-shrink-0 text-center cursor-pointer group w-24">';
                html += '<div class="w-24 h-24 rounded-full overflow-hidden glass-edge mb-2"><img src="'+a.thumbnail+'" class="w-full h-full object-cover group-hover:scale-110 transition-transform" onerror="this.src=\''+FI+'\'" /></div>';
                html += '<p class="text-xs font-medium truncate group-hover:text-[#cfd3d8]">'+es(a.name)+'</p></div>';
            });
            html += '</div></div>';
        }
        
        if(S.filter !== 'artists'){
            if(S.sr.length===0){
                if(S.filter!=='all') html += '<p class="text-center text-[#6b7280] mt-10">Tidak ada hasil</p>';
            } else {
                if(S.filter==='all') html += '<h2 class="text-lg font-bold mb-3">Lagu</h2>';
                html += S.sr.map(function(t,i){
                    return'<div onclick="PK(\'search\','+i+')" class="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl cursor-pointer active:scale-[0.98] transition animate-stagger"><img src="'+t.cover+'" class="w-12 h-12 rounded-lg object-cover shadow-md shrink-0" onerror="this.src=\''+FI+'\'" /><div class="flex-1 min-w-0"><h3 class="font-medium text-sm truncate '+(S.ct&&S.ct.id===t.id?'text-cyan-300 font-bold':'text-white')+'">'+es(t.title)+'</h3><p class="text-[#6b7280] text-xs truncate mt-0.5">'+es(t.artist)+'</p></div></div>';
                }).join('');
            }
        }
        
        c.innerHTML = html;
    },
    apply(){if(S.filter==='all'||S.filter==='songs')S.sr=S.ar;else S.sr=[];Search.show();}
};
function selectSuggestion(t){gid('suggestions').classList.add('hidden');gid('search-input').value=t;gid('search-form').dispatchEvent(new Event('submit'));}
function setFilter(f){S.filter=f;document.querySelectorAll('.filter-tab').forEach(function(el){el.classList.remove('active','bg-white','text-black');el.classList.add('glass','text-white');});var a=gid('f-'+f);if(a){a.classList.add('active','bg-white','text-black');a.classList.remove('glass','text-white');}Search.apply();}