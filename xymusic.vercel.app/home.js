const Home={
    activeCategory: 'lagu',
    sortOrder: 'asc',
    viewMode: 'list',

    render(){
        gid('view-home').innerHTML=`
        <div id="home-search-bar" class="sticky top-0 z-20 pt-10 pb-3 px-4 bg-[#050507]/90 backdrop-blur-xl border-b border-white/5">
            <div class="flex items-center gap-3 bg-neutral-900/90 border border-neutral-800 rounded-full px-4 py-2.5 shadow-lg cursor-pointer hover:border-neutral-700 transition" onclick="App.switch('search')">
                <button onclick="event.stopPropagation(); Home.showFilterPopup();" class="text-neutral-400 hover:text-white p-0.5">
                    <i data-lucide="sliders-horizontal" class="w-5 h-5"></i>
                </button>
                <input type="text" readonly placeholder="Cari lagu, library, dan penyanyi" class="bg-transparent text-xs sm:text-sm text-white placeholder-neutral-400 flex-1 outline-none cursor-pointer" />
                <button onclick="event.stopPropagation(); Home.startVoiceSearch();" class="text-neutral-400 hover:text-white border-l border-neutral-800 pl-3 p-0.5">
                    <i data-lucide="mic" class="w-5 h-5"></i>
                </button>
            </div>
        </div>

        <div class="space-y-6 mt-3 pb-32">
            <!-- PWA Install Banner -->
            <div id="pwa-install-banner" class="hidden px-4">
                <div class="bg-gradient-to-r from-cyan-950/90 to-slate-900/90 border border-cyan-500/30 rounded-2xl p-3.5 flex items-center justify-between shadow-xl">
                    <div class="flex items-center gap-3 min-w-0">
                        <img src="/xymusic.vercel.app/logo.png" class="w-10 h-10 rounded-xl object-cover shadow shrink-0" onerror="this.style.display='none'" />
                        <div class="min-w-0">
                            <p class="font-bold text-xs text-white truncate">Pasang Musically Studio PWA</p>
                            <p class="text-[11px] text-cyan-200/80 truncate">Akses cepat, audio jernih & pemutar offline PWA</p>
                        </div>
                    </div>
                    <button onclick="installPWA()" class="ml-2 px-3.5 py-1.5 bg-cyan-400 text-black font-bold rounded-xl text-xs shadow hover:bg-cyan-300 active:scale-95 transition shrink-0">Pasang</button>
                </div>
            </div>

            <!-- 3 Quick Action Cards -->
            <div class="grid grid-cols-3 gap-2 sm:gap-3 px-4">
                <div onclick="Home.openFavorites()" class="bg-gradient-to-br from-[#801b38] to-[#a02648] border border-rose-500/25 rounded-2xl p-2.5 flex items-center gap-2 sm:gap-2.5 h-16 cursor-pointer active:scale-95 transition-all shadow-md shadow-rose-950/40 hover:border-rose-400/40 group overflow-hidden">
                    <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-rose-300 group-hover:scale-110 transition shrink-0">
                        <i data-lucide="heart" class="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current"></i>
                    </div>
                    <div class="min-w-0 flex-1">
                        <span class="font-bold text-xs sm:text-sm text-white block leading-tight truncate">Favorit</span>
                        <span class="text-[10px] text-rose-200/80 font-medium block mt-0.5 truncate">${(S.favorites || []).length} Lagu</span>
                    </div>
                </div>

                <div onclick="App.switch('library')" class="bg-gradient-to-br from-[#1e4857] to-[#2b5a6c] border border-teal-500/25 rounded-2xl p-2.5 flex items-center gap-2 sm:gap-2.5 h-16 cursor-pointer active:scale-95 transition-all shadow-md shadow-teal-950/40 hover:border-teal-400/40 group overflow-hidden">
                    <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-teal-300 group-hover:scale-110 transition shrink-0">
                        <i data-lucide="library" class="w-3.5 h-3.5 sm:w-4 sm:h-4"></i>
                    </div>
                    <div class="min-w-0 flex-1">
                        <span class="font-bold text-xs sm:text-sm text-white block leading-tight truncate">Library</span>
                        <span class="text-[10px] text-teal-200/80 font-medium block mt-0.5 truncate">${(getUserPlaylists() || []).length} Playlist</span>
                    </div>
                </div>

                <div onclick="Home.openRecent()" class="bg-gradient-to-br from-[#3b2d70] to-[#4c3b8f] border border-indigo-500/25 rounded-2xl p-2.5 flex items-center gap-2 sm:gap-2.5 h-16 cursor-pointer active:scale-95 transition-all shadow-md shadow-indigo-950/40 hover:border-indigo-400/40 group overflow-hidden">
                    <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-indigo-300 group-hover:scale-110 transition shrink-0">
                        <i data-lucide="clock" class="w-3.5 h-3.5 sm:w-4 sm:h-4"></i>
                    </div>
                    <div class="min-w-0 flex-1">
                        <span class="font-bold text-xs sm:text-sm text-white block leading-tight truncate">Terkini</span>
                        <span class="text-[10px] text-indigo-200/80 font-medium block mt-0.5 truncate">Riwayat</span>
                    </div>
                </div>
            </div>

            <!-- Horizontal Category Filter Pills -->
            <div class="flex gap-2 overflow-x-auto hide-scrollbar px-4 pt-1">
                <button onclick="Home.setCategory('lagu')" id="pill-lagu" class="pill-btn px-5 py-2 rounded-full text-xs font-bold bg-white text-black shrink-0 transition-all shadow-md">Lagu</button>
                <button onclick="Home.setCategory('artis')" id="pill-artis" class="pill-btn px-5 py-2 rounded-full text-xs font-medium bg-neutral-900/90 text-neutral-300 hover:text-white shrink-0 transition-all border border-neutral-800">Artis</button>
                <button onclick="Home.setCategory('album')" id="pill-album" class="pill-btn px-5 py-2 rounded-full text-xs font-medium bg-neutral-900/90 text-neutral-300 hover:text-white shrink-0 transition-all border border-neutral-800">Album</button>
                <button onclick="Home.setCategory('folder')" id="pill-folder" class="pill-btn px-5 py-2 rounded-full text-xs font-medium bg-neutral-900/90 text-neutral-300 hover:text-white shrink-0 transition-all border border-neutral-800">Folder</button>
            </div>

            <!-- Featured Banner Cards Horizontal Carousel -->
            <div id="home-featured-banners" class="flex gap-4 overflow-x-auto hide-scrollbar px-4 pt-1"></div>

            <!-- Song List -->
            <div class="px-4">
                <div id="home-song-list" class="space-y-1"></div>
            </div>
        </div>`;
        lucide.createIcons();
        Home.renderFeaturedBanners();
    },

    cleanTitle(t){
        return (t || '').replace(/\s*\([^)]*\)\s*$/g, '').trim();
    },

    setCategory(cat){
        Home.activeCategory = cat;
        ['lagu','artis','album','folder'].forEach(function(c){
            var el = gid('pill-' + c);
            if(!el) return;
            if(c === cat){
                el.className = 'pill-btn px-5 py-2 rounded-full text-xs font-bold bg-white text-black shrink-0 transition-all shadow-md';
            }else{
                el.className = 'pill-btn px-5 py-2 rounded-full text-xs font-medium bg-neutral-900/90 text-neutral-300 hover:text-white shrink-0 transition-all border border-neutral-800';
            }
        });

        Home.show();
    },

    toggleSort(){
        Home.sortOrder = Home.sortOrder === 'asc' ? 'desc' : 'asc';
        showToast('Urutan: ' + (Home.sortOrder === 'asc' ? 'A-Z' : 'Z-A'));
        Home.show();
    },

    toggleViewLayout(){
        Home.viewMode = Home.viewMode === 'list' ? 'grid' : 'list';
        Home.show();
    },

    shuffleAll(){
        var all = (S.rec || []).concat(S.trend || []);
        if(all.length > 0){
            S.pl = all.sort(() => Math.random() - 0.5);
            S.pi = 0;
            S.ps = 'home_shuffle';
            S.ct = S.pl[0];
            UU(); MP.show();
            loadAndPlayVideo(S.ct.videoId);
            showToast('Memutar lagu secara acak');
        }
    },

    playFeatured(type){
        var q = type === 'viral' ? 'lagi viral indonesia' : type === 'pop' ? 'pop indonesia terpopuler' : 'lagi hits tiktok';
        App.switch('search');
        var si = gid('search-input');
        if(si){ si.value = q; gid('search-form').dispatchEvent(new Event('submit')); }
    },

    openFavorites(){
        Favorites.open();
    },

    openRecent(){
        var history = JSON.parse(localStorage.getItem('search_history') || '[]');
        if(history.length === 0){
            showToast('Belum ada riwayat terakhir');
            return;
        }
        App.switch('search');
        Search.renderHistory();
    },

    showFilterPopup(){
        var popup = document.createElement('div');
        popup.className = 'fixed inset-0 z-[300] flex items-end justify-center bg-black/70 backdrop-blur-sm';
        popup.onclick = function(e){ if(e.target === popup) popup.remove(); };
        popup.innerHTML = `
        <div class="glass-strong w-full max-w-md rounded-t-3xl p-6 border-t border-white/10" style="animation:slideUp 0.3s ease-out forwards;">
            <div class="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4"></div>
            <h3 class="font-bold text-white text-lg mb-4 flex items-center gap-2"><i data-lucide="sliders-horizontal" class="w-5 h-5 text-indigo-400"></i>Filter Musik</h3>
            <div class="space-y-3">
                <button onclick="Home.setCategory('lagu'); this.closest('.fixed').remove();" class="w-full text-left p-3.5 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between text-white font-medium"><span>Semua Lagu</span><i data-lucide="chevron-right" class="w-4 h-4 text-neutral-400"></i></button>
                <button onclick="Home.setCategory('artis'); this.closest('.fixed').remove();" class="w-full text-left p-3.5 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between text-white font-medium"><span>Artis Terkenal</span><i data-lucide="chevron-right" class="w-4 h-4 text-neutral-400"></i></button>
            </div>
            <button onclick="this.closest('.fixed').remove()" class="w-full mt-5 py-3 glass text-white rounded-full font-bold">Tutup</button>
        </div>`;
        document.body.appendChild(popup);
        lucide.createIcons();
    },

    startVoiceSearch(){
        if('webkitSpeechRecognition' in window || 'SpeechRecognition' in window){
            var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            var recognition = new SpeechRecognition();
            recognition.lang = 'id-ID';
            showToast('Mendengarkan suara...');
            recognition.onresult = function(event){
                var text = event.results[0][0].transcript;
                if(text){
                    App.switch('search');
                    var si = gid('search-input');
                    if(si){ si.value = text; gid('search-form').dispatchEvent(new Event('submit')); }
                }
            };
            recognition.start();
        } else {
            showToast('Fitur pencarian suara tidak didukung browser ini');
        }
    },

    renderFeaturedBanners(){
        var b = gid('home-featured-banners');
        if(!b) return;

        var trends = S.trend || [];

        if(trends.length === 0){
            var count = [1, 2, 3, 4];
            b.innerHTML = count.map((_, idx) => `
                <div class="flex-shrink-0 w-36 sm:w-40 cursor-pointer group animate-stagger" style="animation-delay:${idx * 100}ms">
                    <div class="relative w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden mb-2 border border-white/10 skeleton-shimmer shadow-lg"></div>
                    <div class="h-4 w-28 skeleton-shimmer rounded-md mb-1"></div>
                    <div class="h-3 w-16 skeleton-shimmer rounded-md"></div>
                </div>
            `).join('');
            return;
        }

        b.innerHTML = trends.map((t, i) => {
            var title = es(this.cleanTitle(t.title));
            var artist = es(t.artist || 'Artis tak diketahui');
            var cover = t.cover || FI;

            return `
            <div onclick="PK('home_trend', ${i})" class="flex-shrink-0 w-36 sm:w-40 cursor-pointer group transition-all transform active:scale-95 animate-stagger" style="animation-delay:${i * 80}ms">
                <div class="relative w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden mb-2 shadow-xl border border-white/10 bg-neutral-900">
                    <img src="${cover}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" onerror="this.src='${FI}'" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div class="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                            <i data-lucide="play" class="w-5 h-5 fill-current ml-0.5"></i>
                        </div>
                    </div>
                </div>
                <p class="text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-colors">${title}</p>
                <p class="text-xs text-neutral-400 truncate mt-0.5">${artist}</p>
            </div>
            `;
        }).join('');

        lucide.createIcons();
    },

    async fetch(){
        Home.show(); // Render initial skeleton state immediately
        try{
            var r=await fetch('/api/home');
            var d=await r.json();
            if(d.status){
                S.rec=d.result.recommendations || [];
                S.trend=d.result.trending || [];
                Home.show();
            }
        }catch(e){}
    },

    show(){
        Home.renderFeaturedBanners();
        var container = gid('home-song-list');
        if(!container) return;

        var songs = (S.rec || []).concat(S.trend || []);
        if(songs.length === 0){
            // Render Shiny Skeleton Layout
            container.className = 'space-y-2';
            var skeletons = Array.from({length: 6});
            container.innerHTML = skeletons.map((_, i) => `
                <div class="flex items-center justify-between p-2.5 rounded-2xl border border-white/5 animate-stagger" style="animation-delay:${i * 60}ms">
                    <div class="flex items-center gap-3.5 flex-1 min-w-0">
                        <div class="w-12 h-12 rounded-xl skeleton-shimmer shrink-0 border border-white/5"></div>
                        <div class="flex-1 space-y-2">
                            <div class="h-4 w-3/4 skeleton-shimmer rounded-md"></div>
                            <div class="h-3 w-1/2 skeleton-shimmer rounded-md"></div>
                        </div>
                    </div>
                    <div class="w-6 h-6 skeleton-shimmer rounded-full shrink-0 ml-2"></div>
                </div>
            `).join('');
            return;
        }

        if(Home.sortOrder === 'desc'){
            songs = [...songs].reverse();
        }

        var cat = Home.activeCategory || 'lagu';

        if(cat === 'artis'){
            container.className = 'grid grid-cols-2 sm:grid-cols-3 gap-3.5';
            var artistMap = {};
            songs.forEach(function(s){
                var name = (s.artist || 'Artis Tak Diketahui').trim();
                if(!artistMap[name]){
                    artistMap[name] = { name: name, cover: s.cover, songs: [] };
                }
                artistMap[name].songs.push(s);
            });
            var artists = Object.values(artistMap);

            container.innerHTML = artists.map(function(a, i){
                return `
                <div onclick="Home.filterByArtist('${es(a.name).replace(/'/g,"\\'")}')" class="bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 p-4 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all active:scale-95 group animate-stagger" style="animation-delay:${i * 50}ms">
                    <div class="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-white/10 group-hover:border-cyan-500/50 shadow-lg">
                        <img src="${a.cover}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" onerror="this.src='${FI}'" />
                    </div>
                    <p class="font-bold text-sm text-white truncate w-full group-hover:text-cyan-300 transition-colors">${es(a.name)}</p>
                    <span class="text-[11px] text-neutral-400 mt-1 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5">${a.songs.length} Lagu</span>
                </div>`;
            }).join('');

        } else if(cat === 'album'){
            container.className = 'grid grid-cols-2 sm:grid-cols-3 gap-3.5';
            var albumMap = {};
            songs.forEach(function(s, idx){
                var alb = (s.artist || 'Koleksi Populer') + ' Hits';
                if(!albumMap[alb]){
                    albumMap[alb] = { title: alb, artist: s.artist || 'Various Artists', cover: s.cover, songs: [] };
                }
                albumMap[alb].songs.push(s);
            });
            var albums = Object.values(albumMap);

            container.innerHTML = albums.map(function(al, i){
                return `
                <div onclick="Home.playAlbumGroup('${es(al.title).replace(/'/g,"\\'")}')" class="bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 p-3 rounded-2xl flex flex-col cursor-pointer transition-all active:scale-95 group animate-stagger" style="animation-delay:${i * 50}ms">
                    <div class="relative w-full aspect-square rounded-xl overflow-hidden mb-2.5 border border-white/5 shadow-md">
                        <img src="${al.cover}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" onerror="this.src='${FI}'" />
                        <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div class="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                                <i data-lucide="play" class="w-5 h-5 fill-current ml-0.5"></i>
                            </div>
                        </div>
                    </div>
                    <p class="font-bold text-sm text-white truncate group-hover:text-cyan-300 transition-colors">${es(al.title)}</p>
                    <p class="text-xs text-neutral-400 truncate mt-0.5">${es(al.artist)} • ${al.songs.length} Lagu</p>
                </div>`;
            }).join('');

        } else if(cat === 'folder'){
            container.className = 'space-y-2.5';
            var favCount = (S.favorites || []).length;
            var trendCount = (S.trend || []).length;
            var recCount = (S.rec || []).length;

            container.innerHTML = `
            <div onclick="Home.openFavorites()" class="flex items-center justify-between p-3.5 bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 rounded-2xl cursor-pointer active:scale-98 transition group">
                <div class="flex items-center gap-3.5">
                    <div class="w-11 h-11 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                        <i data-lucide="heart" class="w-5 h-5 fill-current"></i>
                    </div>
                    <div>
                        <p class="font-bold text-sm text-white group-hover:text-rose-300 transition">Folder Favorit Saya</p>
                        <p class="text-xs text-neutral-400 mt-0.5">${favCount} Lagu Tersimpan</p>
                    </div>
                </div>
                <i data-lucide="chevron-right" class="w-5 h-5 text-neutral-500 group-hover:text-white transition"></i>
            </div>

            <div onclick="Home.playFeatured('hits')" class="flex items-center justify-between p-3.5 bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 rounded-2xl cursor-pointer active:scale-98 transition group">
                <div class="flex items-center gap-3.5">
                    <div class="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                        <i data-lucide="flame" class="w-5 h-5 fill-current"></i>
                    </div>
                    <div>
                        <p class="font-bold text-sm text-white group-hover:text-amber-300 transition">Folder Trending Hits</p>
                        <p class="text-xs text-neutral-400 mt-0.5">${trendCount} Lagu Populer</p>
                    </div>
                </div>
                <i data-lucide="chevron-right" class="w-5 h-5 text-neutral-500 group-hover:text-white transition"></i>
            </div>

            <div onclick="Home.playFeatured('viral')" class="flex items-center justify-between p-3.5 bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 rounded-2xl cursor-pointer active:scale-98 transition group">
                <div class="flex items-center gap-3.5">
                    <div class="w-11 h-11 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                        <i data-lucide="sparkles" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <p class="font-bold text-sm text-white group-hover:text-cyan-300 transition">Folder Rekomendasi Teratas</p>
                        <p class="text-xs text-neutral-400 mt-0.5">${recCount} Lagu Dikurasi</p>
                    </div>
                </div>
                <i data-lucide="chevron-right" class="w-5 h-5 text-neutral-500 group-hover:text-white transition"></i>
            </div>

            <div onclick="Home.openRecent()" class="flex items-center justify-between p-3.5 bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 rounded-2xl cursor-pointer active:scale-98 transition group">
                <div class="flex items-center gap-3.5">
                    <div class="w-11 h-11 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                        <i data-lucide="clock" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <p class="font-bold text-sm text-white group-hover:text-indigo-300 transition">Folder Riwayat Terakhir</p>
                        <p class="text-xs text-neutral-400 mt-0.5">Riwayat Pencarian & Pemutaran</p>
                    </div>
                </div>
                <i data-lucide="chevron-right" class="w-5 h-5 text-neutral-500 group-hover:text-white transition"></i>
            </div>
            `;

        } else {
            // Category "lagu"
            container.className = 'space-y-1';
            container.innerHTML = songs.map((t, i) => {
                var isPlaying = S.ct && S.ct.videoId === t.videoId;
                var title = es(this.cleanTitle(t.title));
                var artist = es(t.artist || 'Artis tak diketahui');

                return `
                <div onclick="PK('home_rec',${i})" class="group flex items-center justify-between p-2.5 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-all cursor-pointer animate-stagger ${isPlaying ? 'bg-white/10 border border-cyan-500/30' : ''}" style="animation-delay:${i * 40}ms">
                    <div class="flex items-center gap-3.5 min-w-0 flex-1">
                        <div class="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-800 flex-shrink-0 border border-white/5">
                            <img src="${t.cover}" class="w-full h-full object-cover" onerror="this.src='${FI}'" />
                            ${isPlaying ? `<div class="absolute inset-0 bg-black/40 flex items-center justify-center"><i data-lucide="music" class="w-5 h-5 text-cyan-400 animate-pulse"></i></div>` : ''}
                        </div>
                        <div class="min-w-0 flex-1">
                            <p class="font-bold text-sm text-white truncate ${isPlaying ? 'text-cyan-300' : ''}">${title}</p>
                            <div class="flex items-center gap-1.5 text-xs text-neutral-400 mt-0.5 truncate">
                                <i data-lucide="music-2" class="w-3.5 h-3.5 text-neutral-500 shrink-0"></i>
                                <span class="truncate">${artist}</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-3 shrink-0 ml-2">
                        ${isPlaying ? `
                            <div class="flex items-end gap-[3px] h-4 text-cyan-400 px-1">
                                <span class="w-1 bg-cyan-400 rounded-full h-3 animate-bounce"></span>
                                <span class="w-1 bg-cyan-400 rounded-full h-4 animate-bounce" style="animation-delay:0.15s"></span>
                                <span class="w-1 bg-cyan-400 rounded-full h-2 animate-bounce" style="animation-delay:0.3s"></span>
                            </div>
                        ` : ''}
                        <button onclick="event.stopPropagation(); Home.openSongOptions(${i});" class="p-2 text-neutral-400 hover:text-white active:scale-90 transition">
                            <i data-lucide="more-vertical" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>`;
            }).join('');
        }

        lucide.createIcons();
    },

    filterByArtist(artistName){
        Artist.open(artistName, artistName);
    },

    playAlbumGroup(albumName){
        var songs = (S.rec || []).concat(S.trend || []);
        if(songs.length > 0){
            S.pl = songs; S.pi = 0; S.ps = 'album_play'; S.ct = S.pl[0];
            UU(); MP.show();
            loadAndPlayVideo(S.ct.videoId);
            showToast('Memutar ' + albumName);
        }
    },

    openSongOptions(idx){
        var songs = (S.rec || []).concat(S.trend || []);
        var song = songs[idx];
        if(!song) return;

        var popup = document.createElement('div');
        popup.className = 'fixed inset-0 z-[300] flex items-end justify-center bg-black/70 backdrop-blur-sm';
        popup.onclick = function(e){ if(e.target === popup) popup.remove(); };
        popup.innerHTML = `
        <div class="glass-strong w-full max-w-md rounded-t-3xl p-6 border-t border-white/10" style="animation:slideUp 0.3s ease-out forwards;">
            <div class="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4"></div>
            <div class="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
                <img src="${song.cover}" class="w-14 h-14 rounded-xl object-cover" onerror="this.src='${FI}'" />
                <div class="min-w-0 flex-1">
                    <h3 class="font-bold text-white text-base truncate">${es(song.title)}</h3>
                    <p class="text-xs text-neutral-400 truncate mt-0.5">${es(song.artist || 'Artis tak diketahui')}</p>
                </div>
            </div>
            <div class="space-y-1">
                <button onclick="PK('home_rec',${idx}); this.closest('.fixed').remove();" class="w-full text-left p-3.5 rounded-xl hover:bg-white/10 flex items-center gap-3 text-white font-medium"><i data-lucide="play" class="w-5 h-5 text-indigo-400"></i>Putar Sekarang</button>
                <button onclick="Home.toggleFavSong('${song.videoId}'); this.closest('.fixed').remove();" class="w-full text-left p-3.5 rounded-xl hover:bg-white/10 flex items-center gap-3 text-white font-medium"><i data-lucide="heart" class="w-5 h-5 text-rose-400"></i>Tambah / Hapus Favorit</button>
                <button onclick="addCurrentToPlaylist(); this.closest('.fixed').remove();" class="w-full text-left p-3.5 rounded-xl hover:bg-white/10 flex items-center gap-3 text-white font-medium"><i data-lucide="list-plus" class="w-5 h-5 text-teal-400"></i>Tambah ke Playlist</button>
                <button onclick="shareTrack(); this.closest('.fixed').remove();" class="w-full text-left p-3.5 rounded-xl hover:bg-white/10 flex items-center gap-3 text-white font-medium"><i data-lucide="share-2" class="w-5 h-5 text-blue-400"></i>Bagikan Lagu</button>
            </div>
            <button onclick="this.closest('.fixed').remove()" class="w-full mt-4 py-3 glass text-white rounded-full font-bold">Batal</button>
        </div>`;
        document.body.appendChild(popup);
        lucide.createIcons();
    },

    toggleFavSong(videoId){
        var songs = (S.rec || []).concat(S.trend || []);
        var song = songs.find(s => s.videoId === videoId);
        if(!song) return;
        var i = S.favorites.findIndex(f => f.videoId === videoId);
        if(i > -1){ S.favorites.splice(i, 1); showToast('Dihapus dari Favorit'); }
        else { S.favorites.push(song); showToast('Ditambahkan ke Favorit'); }
        saveUserFavorites(S.favorites);
    },

    openFavorites(){
        Favorites.open();
    },

    openRecent(){
        App.switch('search');
        Search.renderHistory();
    },

    startVoiceSearch(){
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if(!SpeechRecognition){
            showToast('Browser tidak mendukung pengenalan suara');
            return;
        }

        if(Home._recognition){
            Home.stopVoiceSearch();
        }

        try {
            var recognition = new SpeechRecognition();
            recognition.lang = 'id-ID';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            Home._recognition = recognition;

            recognition.onstart = function() {
                showToast('🎙️ Mendengarkan, silakan berbicara...');
            };

            recognition.onresult = function(event) {
                if(event.results && event.results[0] && event.results[0][0]){
                    var transcript = event.results[0][0].transcript;
                    Home.submitVoiceQuery(transcript);
                }
            };

            recognition.onerror = function() {
                Home.stopVoiceSearch();
                showToast('Gagal mendeteksi suara');
            };

            recognition.onend = function() {
                Home.stopVoiceSearch();
            };

            recognition.start();
        } catch(e) {
            Home.stopVoiceSearch();
            showToast('Gagal memulai mikrofon');
        }
    },

    submitVoiceQuery(query){
        var q = (query || '').trim();
        Home.stopVoiceSearch();
        if(!q) return;

        App.switch('search');
        setTimeout(function(){
            var si = gid('search-input');
            if(si){
                si.value = q;
                gid('search-form').dispatchEvent(new Event('submit'));
                showToast('Mencari: "' + q + '"');
            }
        }, 150);
    },

    stopVoiceSearch(){
        if(Home._recognition){
            try {
                Home._recognition.onend = null;
                Home._recognition.onerror = null;
                Home._recognition.stop();
            } catch(e){}
            Home._recognition = null;
        }
        var modal = gid('voice-search-modal');
        if(modal) modal.remove();
    },

    playFeatured(type){
        var list = type === 'hits' ? S.trend : S.rec;
        if(list && list.length > 0){
            S.pl = [...list]; S.pi = 0; S.ps = 'folder_play'; S.ct = S.pl[0];
            UU(); MP.show();
            loadAndPlayVideo(S.ct.videoId);
            showToast('Memutar ' + (type === 'hits' ? 'Trending Hits' : 'Rekomendasi Teratas'));
        }
    },

    refresh(){
        Home.fetch();
        gid('main-area').scrollTop=0;
    }
};


