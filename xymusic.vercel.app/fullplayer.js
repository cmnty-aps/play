const FullPlayer={
    init(){
        gid('full-container').innerHTML=`
        <div id="full-player" class="fixed flex flex-col z-[100]" style="display:none;background:rgba(5,5,7,0.92);backdrop-filter:blur(44px);-webkit-backdrop-filter:blur(44px);transition:transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);transform:translateY(100%);top:0;left:0;width:100%;height:100%;overflow:hidden;touch-action:none;">
            <div class="absolute inset-0 z-0 pointer-events-none"><img id="full-bg-blur" src="" class="w-full h-full object-cover blur-[100px] opacity-35" /><div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#050507]"></div></div>
            <div class="relative z-10 flex justify-between items-center p-4 pt-6 max-w-xl mx-auto w-full flex-shrink-0">
                <button onclick="FullPlayer.close()" class="btn-back" title="Tutup Pemutar"><i data-lucide="chevron-down" class="w-6 h-6"></i></button>
                <div class="text-center min-w-0 flex-1 px-3"><p class="text-[10px] uppercase tracking-[0.2em] text-[#b3b3b3] font-semibold">Sedang Diputar</p><p id="full-header-artist" class="text-xs sm:text-sm font-bold truncate max-w-[200px] mx-auto text-white"></p></div>
                <div class="flex gap-1.5 shrink-0">
                    <button onclick="toggleSleepTimer()" class="w-9 h-9 rounded-full glass flex items-center justify-center text-white/80 hover:text-white active:scale-90 transition" title="Sleep Timer"><i data-lucide="clock" class="w-4 h-4"></i></button>
                    <button onclick="shareTrack()" class="w-9 h-9 rounded-full glass flex items-center justify-center text-white/80 hover:text-white active:scale-90 transition" title="Bagikan"><i data-lucide="share-2" class="w-4 h-4"></i></button>
                    <button onclick="toggleFavorite()" id="btn-fav" class="w-9 h-9 rounded-full glass flex items-center justify-center text-white/80 hover:text-rose-500 active:scale-90 transition" title="Tambah ke Favorit"><i data-lucide="heart" class="w-4 h-4"></i></button>
                </div>
            </div>
            <div class="relative z-10 flex-1 flex items-center justify-center px-6 max-w-xl mx-auto w-full" style="min-height:0;overflow:hidden;">
                <div id="full-cover-wrapper" class="relative w-full max-w-[260px] sm:max-w-[320px] aspect-square transition-all duration-500 my-auto">
                    <div id="visualizer-bars" class="absolute -inset-4 z-0 flex items-end justify-between px-2 opacity-0 transition-opacity duration-1000 pointer-events-none">
                        <div class="v-bar w-1 bg-white/20 rounded-full h-8"></div>
                        <div class="v-bar w-1 bg-white/20 rounded-full h-12"></div>
                        <div class="v-bar w-1 bg-white/20 rounded-full h-16"></div>
                        <div class="v-bar w-1 bg-white/20 rounded-full h-10"></div>
                        <div class="v-bar w-1 bg-white/20 rounded-full h-14"></div>
                        <div class="v-bar w-1 bg-white/20 rounded-full h-20"></div>
                        <div class="v-bar w-1 bg-white/20 rounded-full h-12"></div>
                        <div class="v-bar w-1 bg-white/20 rounded-full h-18"></div>
                        <div class="v-bar w-1 bg-white/20 rounded-full h-10"></div>
                        <div class="v-bar w-1 bg-white/20 rounded-full h-16"></div>
                    </div>
                    <img id="full-cover" src="" class="w-full h-full object-cover rounded-3xl shadow-2xl shadow-black/60 transition-transform duration-500 border border-white/10" />
                </div>
            </div>
            <div class="relative z-10 px-6 pb-2 max-w-xl mx-auto w-full flex-shrink-0">
                <div class="flex justify-between items-center mb-3">
                    <div class="flex-1 min-w-0 pr-3"><h2 id="full-title" class="text-base sm:text-lg font-black text-white truncate">Pilih lagu</h2><p id="full-artist" class="text-[#b3b3b3] text-xs sm:text-sm truncate cursor-pointer hover:text-white transition mt-0.5" onclick="FullPlayer.openArtist()"></p></div>
                    <div class="flex gap-1 items-center shrink-0">
                        <button onclick="addCurrentToPlaylist()" class="text-[#cfd3d8] hover:text-white active:scale-90 p-2 transition" title="Tambah ke Playlist"><i data-lucide="list-plus" class="w-5 h-5"></i></button>
                        <button onclick="toggleLyrics()" class="text-[#cfd3d8] hover:text-white active:scale-90 p-2 transition" title="Lirik"><i data-lucide="mic-2" class="w-5 h-5"></i></button>
                    </div>
                </div>
                <div class="mb-2"><div class="relative w-full h-1.5 bg-white/10 rounded-full flex items-center group cursor-pointer"><input type="range" id="seek-bar" min="0" max="100" value="0" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" oninput="SK(this.value)" /><div id="full-progress" class="h-full bg-gradient-to-r from-[#cfd3d8] to-[#ffffff] rounded-l-full" style="width:0%;box-shadow:0 0 10px rgba(207,211,216,0.5);"><div class="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-xl shadow-[#cfd3d8]/50 opacity-0 group-hover:opacity-100 transition-all"></div></div></div><div class="flex justify-between text-[10px] text-[#6b7280] mt-1.5 font-medium"><span id="time-curr">0:00</span><span id="time-dur">0:00</span></div></div>
            </div>
            <div class="relative z-10 px-8 pb-8 flex items-center justify-between max-w-xl mx-auto w-full flex-shrink-0">
                <button onclick="toggleAutoNext()" class="text-[#6b7280] hover:text-[#cfd3d8] active:scale-90 p-2 transition-all duration-200" title="Auto Next"><i data-lucide="list-end" class="w-5 h-5"></i></button>
                <button onclick="PV()" class="text-white/80 hover:text-white active:scale-90 p-2 transition-all"><i data-lucide="skip-back" class="w-7 h-7 fill-current"></i></button>
                <button onclick="TP()" id="full-play-btn-wrap" class="relative bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full p-4 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/40" style="width:60px;height:60px;"><div id="full-play-btn" class="absolute inset-0 flex items-center justify-center"><i data-lucide="play" class="w-7 h-7 fill-current ml-0.5"></i></div></button>
                <button onclick="NX()" class="text-white/80 hover:text-white active:scale-90 p-2 transition-all"><i data-lucide="skip-forward" class="w-7 h-7 fill-current"></i></button>
                <button onclick="TR()" id="btn-repeat" class="relative text-[#6b7280] hover:text-white active:scale-90 p-2 transition-all"><i data-lucide="repeat" class="w-5 h-5"></i><div id="repeat-dot" class="hidden absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#cfd3d8] rounded-full"></div><span id="repeat-one" class="hidden absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] font-black text-[#cfd3d8]">1</span></button>
            </div>
        </div>`;
        gid('lyrics-container').innerHTML=`
        <div id="lyrics-overlay" class="fixed flex flex-col z-[200]" style="display:none;background:rgba(4,4,6,0.95);backdrop-filter:blur(50px);-webkit-backdrop-filter:blur(50px);transition:transform 0.35s ease-out;transform:translateY(100%);top:0;left:0;width:100%;height:100%;overflow:hidden;touch-action:none;">
            <div class="flex justify-between items-center p-4 pt-6 max-w-xl mx-auto w-full flex-shrink-0">
                <button onclick="toggleLyrics()" class="btn-back" title="Tutup Lirik"><i data-lucide="chevron-down" class="w-6 h-6"></i></button>
                <h2 class="text-base font-extrabold text-white">Lirik Lagu</h2>
                <div class="w-10"></div>
            </div>
            <div class="flex-1 overflow-y-auto px-6 py-6 hide-scrollbar max-w-xl mx-auto w-full"><div id="lyrics-loading" class="flex justify-center items-center h-full"><div class="w-8 h-8 border-3 border-[#cfd3d8] border-t-transparent rounded-full animate-spin"></div></div><div id="lyrics-content" class="hidden pb-32"></div><div id="lyrics-empty" class="hidden flex justify-center items-center h-full text-[#6b7280]"><div><i data-lucide="music" class="w-16 h-16 mx-auto mb-4 opacity-30"></i><p class="text-sm">Lirik tidak tersedia</p></div></div></div>
        </div>`;
        lucide.createIcons();
    },
    open(){var fp=gid('full-player');fp.style.display='flex';document.body.style.overflow='hidden';document.body.style.position='fixed';document.body.style.width='100%';requestAnimationFrame(function(){fp.style.transform='translateY(0)';});MP.hide();},
    close(){var fp=gid('full-player');fp.style.transform='translateY(100%)';document.body.style.overflow='';document.body.style.position='';document.body.style.width='';setTimeout(function(){fp.style.display='none';MP.show();},350);},
    openArtist(){if(S.ct&&S.ct.artistId){FullPlayer.close();setTimeout(function(){Artist.open(S.ct.artistId,S.ct.artist);},400);}}
};