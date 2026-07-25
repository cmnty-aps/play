const Artist={
    init(){
        gid('artist-container').innerHTML=`
        <div id="artist-modal" class="fixed inset-0 bg-[#050507] flex flex-col z-[150]" style="display:none;">
            <div class="flex items-center gap-3 p-4 pt-6 max-w-3xl lg:max-w-4xl mx-auto w-full border-b border-white/5 bg-[#050507]/90 backdrop-blur-xl">
                <button onclick="Artist.close()" class="btn-back" title="Kembali">
                    <i data-lucide="arrow-left" class="w-5 h-5"></i>
                </button>
                <div class="min-w-0 flex-1">
                    <h1 id="artist-name" class="text-xl font-black text-white truncate">Artis</h1>
                </div>
            </div>
            <div class="flex-1 overflow-y-auto hide-scrollbar pb-28 max-w-3xl lg:max-w-4xl mx-auto w-full" id="artist-content">
                <p class="text-center text-[#6b7280] mt-10">Memuat profil artis...</p>
            </div>
        </div>`;
        lucide.createIcons();
    },
    open(id,name){
        gid('artist-modal').style.display='flex';
        gid('artist-name').innerText=name||'Artis';
        gid('artist-content').innerHTML=`
        <div class="flex flex-col items-center justify-center mt-20 gap-3">
            <div class="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-xs text-neutral-400 font-medium">Mengambil data channel & lagu artis...</p>
        </div>`;
        MP.hide();
        fetch(API.artist+'?id='+encodeURIComponent(id)).then(function(r){return r.json();}).then(function(d){
            if(d.status&&d.result){
                var a=d.result;
                var headerImg=a.image || (a.thumbnails && a.thumbnails[0] ? a.thumbnails[0].url : FI);
                var html='';
                
                // HEADER PROFIL ARTIS / CHANNEL ASLI
                html+=`
                <div class="relative mb-6 pt-6 px-4">
                    <div class="absolute top-0 left-0 right-0 h-56 overflow-hidden rounded-b-3xl pointer-events-none">
                        <img src="${headerImg}" class="w-full h-full object-cover blur-3xl opacity-40 scale-150" />
                        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-[#050507]/60 to-[#050507]"></div>
                    </div>
                    <div class="relative z-10 flex flex-col items-center text-center">
                        <div class="relative group">
                            <img src="${headerImg}" class="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover shadow-2xl ring-4 ring-white/10 group-hover:ring-cyan-500/50 transition-all duration-300" onerror="this.src='${FI}'" />
                            <div class="absolute bottom-1 right-1 bg-cyan-500 text-black rounded-full p-1 shadow-lg" title="Artis / Channel Terverifikasi">
                                <i data-lucide="check" class="w-3.5 h-3.5 stroke-[3]"></i>
                            </div>
                        </div>
                        <h2 class="text-2xl sm:text-3xl font-black text-white mt-4 tracking-tight">${es(a.name)}</h2>
                        <div class="flex items-center gap-2 mt-2">
                            <span class="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 border border-white/10 text-cyan-300 flex items-center gap-1.5">
                                <i data-lucide="youtube" class="w-3.5 h-3.5 text-red-500"></i> YouTube Official Channel
                            </span>
                        </div>
                    </div>
                </div>`;
                
                // LAGU-LAGU POPULER / DAFTAR MUSIK ARTIS
                if(a.topSongs&&a.topSongs.length>0){
                    html+='<div class="mb-8"><div class="flex items-center justify-between mb-3 px-4"><h3 class="font-bold text-xs text-neutral-400 uppercase tracking-widest">Daftar Lagu & Musik</h3><span class="text-xs text-neutral-500">'+a.topSongs.length+' Lagu</span></div><div class="space-y-1.5 px-3">';
                    a.topSongs.forEach(function(s,i){
                        var im=s.cover || s.thumbnail || (s.thumbnails && s.thumbnails[0] ? s.thumbnails[0].url : FI);
                        var safeTitle = es(s.title).replace(/'/g,"\\'");
                        var safeArtist = es(s.artist||a.name).replace(/'/g,"\\'");
                        var safeCover = im.replace(/'/g,"\\'");
                        html+=`
                        <div onclick="Artist.play('${s.videoId}','${safeTitle}','${safeArtist}','${safeCover}')" class="flex items-center gap-3 p-3 hover:bg-white/5 rounded-2xl cursor-pointer active:scale-[0.98] transition-all group border border-transparent hover:border-white/5">
                            <span class="text-neutral-500 w-5 text-center text-xs font-bold shrink-0">${i+1}</span>
                            <img src="${im}" class="w-12 h-12 rounded-xl object-cover shadow-md shrink-0" onerror="this.src='${FI}'" />
                            <div class="flex-1 min-w-0">
                                <p class="font-medium text-sm text-white truncate group-hover:text-cyan-300 transition-colors">${es(s.title)}</p>
                                <p class="text-neutral-400 text-xs truncate mt-0.5">${es(s.artist||a.name)}${s.duration ? ' • ' + s.duration : ''}${s.views ? ' • ' + s.views + ' tayangan' : ''}</p>
                            </div>
                            <div class="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shrink-0">
                                <i data-lucide="play" class="w-4 h-4 fill-current ml-0.5"></i>
                            </div>
                        </div>`;
                    });
                    html+='</div></div>';
                }
                
                // ARTIS/CHANNEL RELEVAN
                if(a.similarArtists&&a.similarArtists.length>0){
                    html+='<div class="mb-6"><h3 class="font-bold text-xs text-neutral-400 uppercase tracking-widest mb-3 px-4">Artis / Channel Terkait</h3><div class="flex gap-4 overflow-x-auto hide-scrollbar pb-2 px-4">';
                    a.similarArtists.forEach(function(s){
                        var im=s.thumbnails&&s.thumbnails[0]?s.thumbnails[0].url:FI;
                        var safeName = es(s.name).replace(/'/g,"\\'");
                        html+=`
                        <div onclick="Artist.open('${s.browseId}','${safeName}')" class="flex-shrink-0 text-center cursor-pointer group w-24">
                            <div class="w-20 h-20 mx-auto rounded-full overflow-hidden shadow-lg border border-white/10 group-hover:border-cyan-500/50 transition-all">
                                <img src="${im}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" onerror="this.src='${FI}'" />
                            </div>
                            <p class="text-xs font-medium text-white mt-2 truncate w-24 group-hover:text-cyan-300 transition-colors">${es(s.name)}</p>
                        </div>`;
                    });
                    html+='</div></div>';
                }
                
                gid('artist-content').innerHTML=html;
                lucide.createIcons();
            } else {
                gid('artist-content').innerHTML='<p class="text-center text-neutral-400 mt-10">Data profil artis tidak ditemukan.</p>';
            }
        }).catch(function(){
            gid('artist-content').innerHTML='<p class="text-center text-neutral-400 mt-10">Gagal memuat artis.</p>';
        });
    },
    close(){
        gid('artist-modal').style.display='none';
        MP.show();
    },
    play(vid,title,artist,cover){
        var songCover = cover || FI;
        S.ct={id:vid,videoId:vid,title:title,artist:artist,cover:songCover,artistId:'',ytUrl:'https://youtube.com/watch?v='+vid};
        S.ps='artist';S.pl=[S.ct];S.pi=0;UU();MP.show();
        loadAndPlayVideo(vid);
        FL(title, artist);
    }
};