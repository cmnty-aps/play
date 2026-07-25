const Favorites = {
    init(){
        var c = gid('favorites-container');
        if(!c){
            c = document.createElement('div');
            c.id = 'favorites-container';
            document.body.appendChild(c);
        }
        c.innerHTML = `
        <div id="favorites-modal" class="fixed inset-0 bg-[#050507] flex flex-col z-[150]" style="display:none;">
            <div class="flex items-center gap-3 p-4 pt-6 max-w-3xl lg:max-w-4xl mx-auto w-full">
                <button onclick="Favorites.close()" class="btn-back" title="Kembali">
                    <i data-lucide="arrow-left" class="w-5 h-5"></i>
                </button>
                <div class="min-w-0 flex-1">
                    <h1 class="text-xl font-black text-white truncate">Lagu Favorit</h1>
                    <p id="favorites-subtitle" class="text-xs text-[#6b7280] truncate">0 lagu</p>
                </div>
            </div>
            <div class="flex-1 overflow-y-auto hide-scrollbar pb-28 max-w-3xl lg:max-w-4xl mx-auto w-full px-4" id="favorites-content">
            </div>
        </div>`;
        safeCreateIcons();
    },

    open(){
        if(!gid('favorites-modal')) Favorites.init();
        gid('favorites-modal').style.display = 'flex';
        Favorites.render();
    },

    close(){
        var m = gid('favorites-modal');
        if(m) m.style.display = 'none';
    },

    render(){
        var favs = S.favorites || [];
        var sub = gid('favorites-subtitle');
        if(sub) sub.innerText = favs.length + ' lagu tersimpan';

        var content = gid('favorites-content');
        if(!content) return;

        if(favs.length === 0){
            content.innerHTML = `
            <div class="flex flex-col items-center justify-center text-center mt-16 p-8 glass rounded-3xl max-w-md mx-auto">
                <div class="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4 shadow-lg">
                    <i data-lucide="heart" class="w-8 h-8"></i>
                </div>
                <h3 class="font-extrabold text-white text-base mb-1">Belum ada lagu favorit</h3>
                <p class="text-xs text-[#6b7280] leading-relaxed">Sukai lagu yang kamu dengarkan dengan menekan ikon hati untuk menyimpannya di sini.</p>
            </div>`;
            safeCreateIcons();
            return;
        }

        var html = `
        <div class="bg-gradient-to-br from-[#801b38] to-[#3a0d1a] border border-rose-500/20 rounded-3xl p-5 mb-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-300 flex items-center justify-center shrink-0 shadow-lg">
                    <i data-lucide="heart" class="w-8 h-8 fill-current"></i>
                </div>
                <div>
                    <h2 class="font-black text-lg text-white">Favorit Saya</h2>
                    <p class="text-xs text-rose-200/80 font-medium mt-0.5">${favs.length} lagu pilihanmu</p>
                </div>
            </div>
            <div class="flex gap-2.5">
                <button onclick="Favorites.playAll(false)" class="btn-chrome font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 active:scale-95 shadow-md">
                    <i data-lucide="play" class="w-4 h-4 fill-current"></i> Putar Semua
                </button>
                <button onclick="Favorites.playAll(true)" class="glass hover:bg-white/10 text-white font-medium px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 active:scale-95 transition">
                    <i data-lucide="shuffle" class="w-4 h-4"></i> Acak
                </button>
            </div>
        </div>

        <div class="space-y-1.5">`;

        favs.forEach(function(s, i){
            var isPlaying = S.ct && S.ct.videoId === s.videoId;
            html += `
            <div class="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl cursor-pointer active:scale-[0.98] transition group ${isPlaying ? 'bg-white/10 border border-rose-500/20' : ''}">
                <span class="text-[#6b7280] w-6 text-center text-xs font-bold shrink-0">${i+1}</span>
                <img src="${s.cover || s.thumbnail || FI}" onclick="Favorites.playSong(${i})" class="w-12 h-12 rounded-lg object-cover shadow-md shrink-0" onerror="this.src='${FI}'" />
                <div onclick="Favorites.playSong(${i})" class="flex-1 min-w-0">
                    <p class="font-semibold text-sm ${isPlaying ? 'text-rose-300 font-bold' : 'text-white'} truncate group-hover:text-rose-300 transition-colors">${es(s.title)}</p>
                    <p class="text-[#6b7280] text-xs truncate mt-0.5">${es(s.artist)}</p>
                </div>
                <button onclick="event.stopPropagation(); Favorites.removeSong('${s.videoId}')" class="p-2 text-rose-400 hover:text-rose-300 active:scale-90 transition shrink-0" title="Hapus dari Favorit">
                    <i data-lucide="heart" class="w-5 h-5 fill-current"></i>
                </button>
            </div>`;
        });

        html += `</div>`;
        content.innerHTML = html;
        safeCreateIcons();
    },

    playSong(index){
        var favs = S.favorites || [];
        if(!favs[index]) return;
        S.pl = [...favs];
        S.pi = index;
        S.ps = 'favorites';
        S.ct = S.pl[S.pi];
        UU(); MP.show();
        loadAndPlayVideo(S.ct.videoId);
        Favorites.render();
    },

    playAll(shuffle){
        var favs = S.favorites || [];
        if(favs.length === 0) return;
        var list = [...favs];
        if(shuffle){
            list.sort(() => Math.random() - 0.5);
        }
        S.pl = list;
        S.pi = 0;
        S.ps = 'favorites';
        S.ct = S.pl[0];
        UU(); MP.show();
        loadAndPlayVideo(S.ct.videoId);
        showToast(shuffle ? 'Memutar favorit secara acak' : 'Memutar semua favorit');
        Favorites.render();
    },

    removeSong(videoId){
        var i = (S.favorites || []).findIndex(f => f.videoId === videoId);
        if(i > -1){
            S.favorites.splice(i, 1);
            saveUserFavorites(S.favorites);
            showToast('Dihapus dari Favorit');
            Favorites.render();
            if(typeof Home !== 'undefined' && Home.render) Home.render();
        }
    }
};

document.addEventListener('DOMContentLoaded', function(){
    Favorites.init();
});
