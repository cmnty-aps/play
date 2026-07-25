const MP={
    init(){
        gid('mini-container').innerHTML=`
        <div id="mini-player" class="hidden fixed left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-[480px] max-w-xl z-50" style="bottom:20px;transition:transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);transform:translateY(80px);">
            <div class="rounded-full px-3.5 py-2 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition relative overflow-hidden bg-neutral-900/95 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/90">
                <div class="absolute top-0 left-0 h-[2px] bg-white/10 w-full"><div id="mini-progress" class="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-white" style="width:0%"></div></div>
                <div class="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border border-white/20 shadow-md cursor-pointer" onclick="event.stopPropagation();FullPlayer.open();">
                    <img id="mini-cover" src="" class="w-full h-full object-cover animate-spin-slow" onerror="this.src=FI" />
                    <div class="absolute inset-0 m-auto w-3 h-3 rounded-full bg-neutral-900 border border-white/30"></div>
                </div>
                <div class="flex-1 min-w-0" onclick="FullPlayer.open()">
                    <div id="mini-title" class="font-bold text-xs sm:text-sm text-white truncate">Pilih lagu</div>
                    <div id="mini-artist" class="text-neutral-400 text-[11px] truncate mt-0.5">Artis tak diketahui</div>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                    <button onclick="event.stopPropagation();TP()" class="text-white active:scale-90 hover:scale-110 p-2 transition"><div id="mini-play-btn"><i data-lucide="play" class="w-5 h-5 fill-current"></i></div></button>
                    <button onclick="event.stopPropagation();NX()" class="text-white/80 hover:text-white active:scale-90 p-2 transition"><i data-lucide="skip-forward" class="w-5 h-5 fill-current"></i></button>
                    <button onclick="event.stopPropagation();MP.dismiss()" class="text-neutral-500 hover:text-red-400 active:scale-90 p-1.5 ml-0.5 transition"><i data-lucide="x" class="w-4 h-4"></i></button>
                </div>
            </div>
        </div>
        <div id="mini-sidebar" class="hidden fixed right-0 z-50" style="bottom:24px;transition:all 0.3s ease-out;">
            <button onclick="MP.restore()" class="btn-chrome rounded-l-full p-3 shadow-lg shadow-black/50 active:scale-95 transition-all">
                <i data-lucide="music" class="w-5 h-5"></i>
            </button>
        </div>`;
        lucide.createIcons();
    },
    show(){
        var mp=gid('mini-player');
        if(mp)mp.classList.remove('hidden');
        var sb=gid('mini-sidebar');
        if(sb)sb.classList.add('hidden');
        if(mp)requestAnimationFrame(function(){mp.style.transform='translateY(0)';});
    },
    hide(){
        var mp=gid('mini-player');
        if(!mp)return;
        mp.style.transform='translateY(40px)';
        setTimeout(function(){if(mp)mp.classList.add('hidden');},350);
    },
    dismiss(){
        // Sembunyiin mini player, tampilin sidebar kecil
        var mp=gid('mini-player');
        if(!mp)return;
        mp.style.transform='translateY(40px)';
        setTimeout(function(){
            if(mp)mp.classList.add('hidden');
            var sb=gid('mini-sidebar');
            if(sb)sb.classList.remove('hidden');
        },350);
        // Musik tetep jalan
    },
    restore(){
        // Kembaliin mini player dari sidebar
        var sb=gid('mini-sidebar');
        if(sb)sb.classList.add('hidden');
        var mp=gid('mini-player');
        if(mp){
            mp.classList.remove('hidden');
            requestAnimationFrame(function(){mp.style.transform='translateY(0)';});
        }
    }
};