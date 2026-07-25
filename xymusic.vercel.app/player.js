// ============================================================
// XMUSIC - CORE PLAYER (FULL)
// ============================================================
const API={search:'/api/search',artist:'/api/artist',suggest:'/api/suggest',lyrics:'/api/lyrics'};
var FI='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="%236b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>');
const S={ht:[],sr:[],ar:[],artists:[],rec:[],trend:[],sq:'',filter:'all',ct:null,pl:[],pi:-1,ps:'',ip:false,il:false,rm:'off',autoNext:true,yp:null,yr:false,iv:null,pt:0,pd:0,at:'home',ld:{type:'none',lines:[]},cli:-1,lo:false,st:null,favorites:getUserFavorites(),speed:1};
function fm(s){if(isNaN(s))return"0:00";const m=Math.floor(s/60),se=Math.floor(s%60);return m+':'+(se<10?'0':'')+se;}
function es(t){if(!t)return'';const d=document.createElement('div');d.textContent=t;return d.innerHTML;}
function cn(t){if(!t)return'Unknown';return t.replace(/[^\x20-\x7E\xA0-\xFF\u0100-\uFFFF]/g,'').replace(/\s*-\s*Topic$/i,'').trim()||'Unknown';}
function gid(id){return document.getElementById(id);}
function safeCreateIcons(){
    try {
        if(typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
            lucide.createIcons();
        }
    } catch(e) {
        console.warn("Lucide failed to load icons:", e);
    }
}

document.addEventListener('visibilitychange', function() {
    if (document.hidden && S.ip) {
        var bg = gid('bg-audio');
        if (bg) bg.play().catch(function(){});
    }
});

function updateOG(title,image){
    var t=document.querySelector('meta[property="og:title"]');if(!t){t=document.createElement('meta');t.setAttribute('property','og:title');document.head.appendChild(t);}t.setAttribute('content',title+' | Musically');
    var i=document.querySelector('meta[property="og:image"]');if(!i){i=document.createElement('meta');i.setAttribute('property','og:image');document.head.appendChild(i);}i.setAttribute('content',image||FI);
    document.title=title+' - Musically';
}

function loadAndPlayVideo(videoId){
    if(!videoId) return;
    S.il = true;
    UB();
    
    // Unlock HTML audio context on user gesture
    var bg = gid('bg-audio');
    if(bg) { bg.play().then(function(){ bg.pause(); }).catch(function(){}); }
    
    if(S.loadTimeout) clearTimeout(S.loadTimeout);

    var tryPlay = function() {
        if(S.yp && S.yr && typeof S.yp.playVideo === 'function') {
            try {
                S.yp.unMute();
                S.yp.playVideo();
            } catch(e){}
        }
    };

    if(S.yp && S.yr && typeof S.yp.loadVideoById === 'function'){
        try {
            S.yp.loadVideoById(videoId);
            S.yp.unMute();
            S.yp.playVideo();
            S.pendingVideoId = null;
        } catch(e) {
            console.error("Error loading video:", e);
        }
    } else {
        S.pendingVideoId = videoId;
    }

    S.loadTimeout = setTimeout(function(){
        if(S.il) {
            tryPlay();
        }
    }, 1500);
}

window.onYouTubeIframeAPIReady = function(){
    S.yp = new YT.Player('yt-player',{
        height:'100%',
        width:'100%',
        host:'https://www.youtube.com',
        playerVars:{
            autoplay:1,
            controls:0,
            enablejsapi:1,
            playsinline:1,
            rel:0,
            origin:window.location.origin
        },
        events:{
            onReady:function(event){
                S.yr=true;
                if(event && event.target) {
                    try { event.target.unMute(); } catch(e){}
                }
                var vid = S.pendingVideoId || (S.ct ? S.ct.videoId : null);
                if(vid && typeof S.yp.loadVideoById === 'function'){
                    try {
                        S.yp.loadVideoById(vid);
                        S.yp.unMute();
                        S.yp.playVideo();
                        S.pendingVideoId = null;
                    } catch(e){}
                }
            },
            onStateChange:ys,
            onError:function(e){
                console.error("YT Player Error:", e);
                showToast("Lagu berikutnya...");
                S.il = false; UB();
                setTimeout(function(){ if(S.autoNext) NX(); }, 1200);
            }
        }
    });
};

if(window.YT && window.YT.Player) {
    window.onYouTubeIframeAPIReady();
} else if(!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
    const yt = document.createElement('script');
    yt.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(yt);
}
function ys(e){
    if(e.data===1){
        S.ip=true;S.il=false;UB();SP();
        if('mediaSession' in navigator){navigator.mediaSession.playbackState='playing';}
    }else if(e.data===2){
        S.ip=false;UB();ST();
        if('mediaSession' in navigator){navigator.mediaSession.playbackState='paused';}
    }else if(e.data===0){
        ST();
        if(S.rm==='one'){S.yp.seekTo(0);S.yp.playVideo();}
        else if(S.autoNext){NX();}
    }else if(e.data===3){
        S.il=true;UB();
    }
}

function SP(){
    ST();                
    S.iv=setInterval(function(){
        if(S.yp&&S.yr&&S.ip){
            S.pt=S.yp.getCurrentTime()||0;
            S.pd=S.yp.getDuration()||0;
            var p=S.pd>0?(S.pt/S.pd)*100:0;
            var mp=gid('mini-progress'),fp=gid('full-progress'),sb=gid('seek-bar'),tc=gid('time-curr'),td=gid('time-dur');
            if(mp)mp.style.width=p+'%';
            if(fp)fp.style.width=p+'%';
            if(sb)sb.value=p;
            if(tc)tc.innerText=fm(S.pt);
            if(td)td.innerText=fm(S.pd);
            ULH(S.pt);
            UV();
        }
    }, 200);                
    S.miv=setInterval(function(){
        if(S.yp&&S.yr&&S.ip && S.pd > 0){
            if('mediaSession' in navigator && navigator.mediaSession.setPositionState){
                navigator.mediaSession.setPositionState({duration:S.pd,playbackRate:1,position:S.pt});
            }
        }
    }, 1000);                
}
function ST(){if(S.iv){clearInterval(S.iv);S.iv=null;} if(S.miv){clearInterval(S.miv);S.miv=null;}}

function UB(){
    var mi=gid('mini-play-btn'),fu=gid('full-play-btn');
    if(!mi||!fu)return;
    var bg = gid('bg-audio');
    if(S.il){
        mi.innerHTML='<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>';
        fu.innerHTML='<div class="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin"></div>';
    }
    else if(S.ip){
        mi.innerHTML='<i data-lucide="pause" class="w-6 h-6 fill-current"></i>';
        fu.innerHTML='<i data-lucide="pause" class="w-7 h-7 fill-current"></i>';
        if(bg) bg.play().catch(function(){});
    }
    else{
        mi.innerHTML='<i data-lucide="play" class="w-6 h-6 fill-current"></i>';
        fu.innerHTML='<i data-lucide="play" class="w-7 h-7 fill-current ml-0.5"></i>';
        if(bg) bg.pause();
    }
    safeCreateIcons();
    if('mediaSession' in navigator){navigator.mediaSession.playbackState=S.ip?'playing':'paused';}
}

function UU(){
    if(!S.ct)return;
    var mc=gid('mini-cover'),mt=gid('mini-title'),ma=gid('mini-artist'),fc=gid('full-cover'),ft=gid('full-title'),fa=gid('full-artist'),fh=gid('full-header-artist'),fb=gid('full-bg-blur');
    if(mc)mc.src=S.ct.cover;if(mt)mt.innerText=S.ct.title;if(ma)ma.innerText=S.ct.artist;
    if(fc)fc.src=S.ct.cover || FI;if(ft)ft.innerText=S.ct.title;if(fa)fa.innerText=S.ct.artist;
    if(fh)fh.innerText=S.ct.artist;if(fb)fb.src=S.ct.cover;
    
    updateOG(S.ct.title,S.ct.cover);
    UF();
    
    if('mediaSession' in navigator){
        navigator.mediaSession.metadata = new MediaMetadata({
            title: S.ct.title,
            artist: S.ct.artist,
            album: 'Musically',
            artwork: [
                { src: S.ct.cover, sizes: '96x96', type: 'image/jpeg' },
                { src: S.ct.cover, sizes: '128x128', type: 'image/jpeg' },
                { src: S.ct.cover, sizes: '192x192', type: 'image/jpeg' },
                { src: S.ct.cover, sizes: '256x256', type: 'image/jpeg' },
                { src: S.ct.cover, sizes: '384x384', type: 'image/jpeg' },
                { src: S.ct.cover, sizes: '512x512', type: 'image/jpeg' },
            ]
        });
        navigator.mediaSession.setActionHandler('play', function(){S.yp.playVideo();});
        navigator.mediaSession.setActionHandler('pause', function(){S.yp.pauseVideo();});
        navigator.mediaSession.setActionHandler('previoustrack', function(){PV();});
        navigator.mediaSession.setActionHandler('nexttrack', function(){NX();});
        navigator.mediaSession.setActionHandler('stop', function(){if(S.yp&&S.yr)S.yp.stopVideo();});
        navigator.mediaSession.setActionHandler('seekto', function(details){if(details.seekTime&&S.yr)S.yp.seekTo(details.seekTime,true);});
    }
}

function PK(s,i){
    var l=[];
    if(s==='home1')l=S.ht.slice(0,6);
    else if(s==='home2')l=S.ht.slice(6,12);
    else if(s==='search')l=S.sr;
    else if(s==='playlist')l=S.pl;
    else if(s==='home_rec')l=S.rec;
    else if(s==='home_trend')l=S.trend;
    else if(s==='favorites'||s==='fav_folder')l=S.favorites;
    
    if(!l[i])return;
    S.ps=s;S.pl=l;S.pi=i;S.ct=l[i];
    var url=location.origin+'/?play='+S.ct.videoId;
    history.pushState({},'',url);
    UU();
    MP.show();
    loadAndPlayVideo(S.ct.videoId);
    FL(S.ct.title, S.ct.artist);
}
function TP(){if(!S.ct||!S.yp||!S.yr)return;S.ip?S.yp.pauseVideo():S.yp.playVideo();}
function NX(){if(!S.pl.length)return;var ni=S.pi+1;if(ni>=S.pl.length){if(S.rm==='all')ni=0;else{S.ip=false;UB();return;}}PK(S.ps,ni);}
function PN(){NX();}
function PV(){if(!S.pl.length)return;if(S.pt>3){if(S.yp&&S.yr)S.yp.seekTo(0);return;}var pi=S.pi-1;if(pi<0)pi=S.pl.length-1;PK(S.ps,pi);}
function SK(v){if(S.yp&&S.yr&&S.pd>0)S.yp.seekTo((parseFloat(v)/100)*S.pd,true);}
function TR(){var b=gid('btn-repeat'),d=gid('repeat-dot'),o=gid('repeat-one');if(!b||!d||!o)return;if(S.rm==='off'){S.rm='all';b.classList.add('text-[#cfd3d8]');d.classList.remove('hidden');}else if(S.rm==='all'){S.rm='one';o.classList.remove('hidden');}else{S.rm='off';b.classList.remove('text-[#cfd3d8]');d.classList.add('hidden');o.classList.add('hidden');}}
function SF(){if(S.pl.length)PK(S.ps,Math.floor(Math.random()*S.pl.length));}
function toggleAutoNext(){S.autoNext=!S.autoNext;showToast(S.autoNext?'Putar Berikutnya: ON':'Putar Berikutnya: OFF');}

function shareTrack(){if(!S.ct||!S.ct.videoId)return;var url=location.origin+'/?play='+S.ct.videoId+'&share=1';updateOG(S.ct.title,S.ct.cover);if(navigator.share){navigator.share({title:S.ct.title,text:S.ct.title+' - '+S.ct.artist,url:url}).catch(function(){});}}

async function FL(title, artist){
    var l=gid('lyrics-loading'),c=gid('lyrics-content'),e=gid('lyrics-empty');
    if(!l||!c||!e)return;
    l.classList.remove('hidden');c.classList.add('hidden');e.classList.add('hidden');
    c.innerHTML = '';
    S.ld={type:'none',lines:[]};S.cli=-1;
    try{
        var r=await fetch(API.lyrics+'?title='+encodeURIComponent(title)+'&artist='+encodeURIComponent(artist));
        var d=await r.json();
        if(d.status && d.result.lyrics && d.result.lyrics.lines && d.result.lyrics.lines.length>0){
            S.ld=d.result.lyrics;
            var html='';
            S.ld.lines.forEach(function(li,i){
                var time = li.startTimeMs ? li.startTimeMs/1000 : 0;
                var style = S.ld.type === 'synced' 
                    ? 'color:#6b7280;font-size:1.1rem;line-height:1.6;font-weight:600;filter:blur(1px);opacity:0.4;'
                    : 'color:white;font-size:1rem;line-height:1.8;opacity:0.8;';
                html+='<p class="lyric-line text-center px-4 py-2 transition-all duration-300" data-time="'+time+'" onclick="SLT('+time+')" style="'+style+'">'+es(li.words)+'</p>';
            });
            html+='<p class="text-center text-[#4b5563] text-xs mt-12 mb-8 opacity-50 tracking-widest uppercase">Tamat</p>';
            c.innerHTML=html;
            l.classList.add('hidden');c.classList.remove('hidden');
        }else{
            l.classList.add('hidden');e.classList.remove('hidden');
        }
    }catch(er){
        if(l)l.classList.add('hidden');
        if(e)e.classList.remove('hidden');
    }
}
function ULH(ct){
    if(!S.ld.lines || S.ld.lines.length===0 || S.ld.type !== 'synced') return;
    var ls=document.querySelectorAll('.lyric-line');
    var ni=-1;
    for(var i=0;i<S.ld.lines.length;i++){
        var t = S.ld.lines[i].startTimeMs / 1000;
        if(ct>=t){ni=i;}
    }
    if(ni===S.cli)return;
    var lyc=gid('lyrics-content');
    if(!lyc) return;
    var container = lyc.parentElement;
    ls.forEach(function(l,i){
        if(i===ni){
            l.style.color='white';
            l.style.fontSize='1.4rem';
            l.style.fontWeight='800';
            l.style.opacity='1';
            l.style.filter='blur(0px)';
            
            var targetScroll = l.offsetTop - (container.offsetHeight / 2) + (l.offsetHeight / 2);
            container.scrollTo({top: targetScroll, behavior: 'smooth'});
        }else if(i < ni){
            l.style.color='#4b5563';
            l.style.fontSize='1.1rem';
            l.style.fontWeight='600';
            l.style.opacity='0.2';
            l.style.filter='blur(1.5px)';
        }else{
            l.style.color='#6b7280';
            l.style.fontSize='1.1rem';
            l.style.fontWeight='600';
            l.style.opacity='0.4';
            l.style.filter='blur(1px)';
        }
    });
    S.cli=ni;
}
function SLT(t){if(S.yp&&S.yr)S.yp.seekTo(t,true); if(S.ld.type==='synced')S.cli=-1;}
function toggleLyrics(){var o=gid('lyrics-overlay');if(S.lo){o.style.transform='translateY(100%)';setTimeout(function(){o.style.display='none';},400);S.lo=false;MP.show();}else{o.style.display='flex';requestAnimationFrame(function(){requestAnimationFrame(function(){o.style.transform='translateY(0)';});});S.lo=true;MP.hide();if(S.ct)FL(S.ct.title,S.ct.artist);}}

// VISUALIZER
function UV(){
    var v=gid('visualizer-bars');if(!v)return;
    if(S.ip){
        v.style.opacity='0.4';
        document.querySelectorAll('.v-bar').forEach(function(b){
            var h=Math.floor(Math.random()*40)+10;
            b.style.height=h+'px';
            b.style.transition='height 0.2s ease-in-out';
        });
    }else{
        v.style.opacity='0';
    }
}

// FAVORITES
function getUserFavorites(){try{return JSON.parse(localStorage.getItem('nanzz_favorites')||'[]');}catch(e){return[];}}
function saveUserFavorites(f){localStorage.setItem('nanzz_favorites',JSON.stringify(f));}
function toggleFavorite(){
    if(!S.ct)return;
    var i=S.favorites.findIndex(function(f){return f.videoId===S.ct.videoId;});
    if(i>-1){S.favorites.splice(i,1);showToast('Dihapus dari Favorit');}
    else{S.favorites.push(S.ct);showToast('Ditambahkan ke Favorit');}
    saveUserFavorites(S.favorites);
    UF();
}
function UF(){
    var b=gid('btn-fav');if(!b||!S.ct)return;
    var isF=S.favorites.some(function(f){return f.videoId===S.ct.videoId;});
    b.innerHTML=isF?'<i data-lucide="heart" class="w-4 h-4 fill-rose-500 text-rose-500"></i>':'<i data-lucide="heart" class="w-4 h-4"></i>';
    safeCreateIcons();
}

// SLEEP TIMER
function toggleSleepTimer(){
    var popup=document.createElement('div');popup.className='fixed inset-0 z-[300] flex items-end justify-center bg-black/60';
    popup.onclick=function(e){if(e.target===popup)popup.remove();};
    var options=[
        {t:'Matikan',v:0},
        {t:'5 Menit',v:5},
        {t:'15 Menit',v:15},
        {t:'30 Menit',v:30},
        {t:'1 Jam',v:60},
        {t:'Selesai Lagu Ini',v:'end'}
    ];
    var html=options.map(function(o){
        return'<button onclick="setSleepTimer(\''+o.v+'\');this.parentElement.parentElement.remove();" class="w-full text-left p-4 hover:bg-white/5 flex items-center justify-between border-b border-white/5"><span class="text-white font-medium">'+o.t+'</span>'+(S.st===o.v?'<i data-lucide="check" class="w-4 h-4 text-emerald-400"></i>':'')+'</button>';
    }).join('');
    popup.innerHTML='<div class="glass-strong w-full max-w-md rounded-t-3xl p-6 border-t border-white/10" style="animation:slideUp 0.3s ease-out forwards;"><div class="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4"></div><h3 class="font-bold text-white mb-3 flex items-center"><i data-lucide="clock" class="w-5 h-5 mr-2"></i>Sleep Timer</h3><div class="max-h-72 overflow-y-auto hide-scrollbar">'+html+'</div><button onclick="this.parentElement.parentElement.remove()" class="w-full mt-3 py-3 glass glass-hover text-white rounded-full">Batal</button></div>';
    document.body.appendChild(popup);safeCreateIcons();
}
function setSleepTimer(v){
    if(S.st_timeout){clearTimeout(S.st_timeout);S.st_timeout=null;}
    if(v==0){S.st=null;showToast('Sleep Timer dinonaktifkan');return;}
    S.st=v;
    if(v==='end'){showToast('Berhenti setelah lagu ini');}
    else{
        var ms=parseInt(v)*60*1000;
        showToast('Tidur dalam '+v+' menit');
        S.st_timeout=setTimeout(function(){if(S.yp&&S.yr)S.yp.pauseVideo();S.st=null;showToast('Waktu habis, musik dihentikan');},ms);
    }
}

// PLAYBACK SPEED
function togglePlaybackSpeed(){
    var popup=document.createElement('div');popup.className='fixed inset-0 z-[300] flex items-end justify-center bg-black/60';
    popup.onclick=function(e){if(e.target===popup)popup.remove();};
    var options=[0.5, 0.75, 1, 1.25, 1.5, 2];
    var html=options.map(function(o){
        return'<button onclick="setPlaybackSpeed('+o+');this.parentElement.parentElement.remove();" class="w-full text-left p-4 hover:bg-white/5 flex items-center justify-between border-b border-white/5"><span class="text-white font-medium">'+o+'x</span>'+(S.speed===o?'<i data-lucide="check" class="w-4 h-4 text-emerald-400"></i>':'')+'</button>';
    }).join('');
    popup.innerHTML='<div class="glass-strong w-full max-w-md rounded-t-3xl p-6 border-t border-white/10" style="animation:slideUp 0.3s ease-out forwards;"><div class="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4"></div><h3 class="font-bold text-white mb-3 flex items-center"><i data-lucide="gauge" class="w-5 h-5 mr-2"></i>Playback Speed</h3><div class="max-h-72 overflow-y-auto hide-scrollbar">'+html+'</div><button onclick="this.parentElement.parentElement.remove()" class="w-full mt-3 py-3 glass glass-hover text-white rounded-full">Batal</button></div>';
    document.body.appendChild(popup);safeCreateIcons();
}
function setPlaybackSpeed(v){
    S.speed=v;
    if(S.yp && S.yr) S.yp.setPlaybackRate(v);
    var st=gid('speed-text');if(st)st.innerText=v+'x';
    showToast('Kecepatan: '+v+'x');
}

// PLAYLIST SYSTEM
function getUserPlaylists(){try{return JSON.parse(localStorage.getItem('nanzz_playlists')||'[]');}catch(e){return[];}}
function saveUserPlaylists(pls){try{localStorage.setItem('nanzz_playlists',JSON.stringify(pls));}catch(e){}}
function createPlaylist(name,image){var pls=getUserPlaylists();var id='pl_'+Date.now();pls.push({id:id,name:name,image:image||'',songs:[]});saveUserPlaylists(pls);return id;}
function addToPlaylistById(playlistId,track){var pls=getUserPlaylists();var pl=pls.find(function(p){return p.id===playlistId;});if(!pl)return;var exists=pl.songs.find(function(s){return s.videoId===track.videoId;});if(!exists){pl.songs.push({id:track.id,videoId:track.videoId,title:track.title,artist:track.artist,cover:track.cover,artistId:track.artistId||'',ytUrl:track.ytUrl});if(!pl.image&&pl.songs.length===1){pl.image=track.cover;}saveUserPlaylists(pls);showToast('Ditambahkan ke '+pl.name);}else{showToast('Sudah ada di playlist');}}
function showToast(msg){
    var old = gid('top-toast-popup');
    if(old) old.remove();

    var toast = document.createElement('div');
    toast.id = 'top-toast-popup';
    toast.className = 'fixed top-3 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-sm glass-strong border border-white/20 text-white shadow-2xl rounded-2xl p-3 flex items-center gap-3 backdrop-blur-2xl';
    toast.style.animation = 'slideDownTop 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards';

    toast.innerHTML = '<div class="w-8 h-8 rounded-xl btn-chrome flex items-center justify-center shrink-0 shadow-md"><i data-lucide="music-2" class="w-4 h-4 text-black"></i></div><div class="flex-1 min-w-0"><p class="text-xs font-bold text-white truncate">'+es(msg)+'</p><p class="text-[10px] text-neutral-400 truncate">Notifikasi Musically</p></div><button onclick="this.closest(\'#top-toast-popup\').remove()" class="text-neutral-400 hover:text-white p-1"><i data-lucide="x" class="w-4 h-4"></i></button>';

    document.body.appendChild(toast);
    safeCreateIcons();

    setTimeout(function(){
        if(toast && toast.parentNode){
            toast.style.animation = 'slideUpTop 0.3s ease-in forwards';
            setTimeout(function(){ if(toast && toast.parentNode) toast.remove(); }, 300);
        }
    }, 2600);
}
function addCurrentToPlaylist(){if(!S.ct)return;var pls=getUserPlaylists();if(pls.length===0){showToast('Belum ada playlist');return;}showPlaylistPicker(S.ct);}
function showPlaylistPicker(track){var pls=getUserPlaylists();var popup=document.createElement('div');popup.className='fixed inset-0 z-[300] flex items-end justify-center bg-black/60';popup.onclick=function(e){if(e.target===popup)popup.remove();};var listHtml=pls.map(function(p){return'<button onclick="addToPlaylistById(\''+p.id+'\',S.ct);this.parentElement.parentElement.remove();" class="w-full text-left p-4 hover:bg-white/5 flex items-center gap-3 border-b border-white/5"><img src="'+(p.image||FI)+'" class="w-10 h-10 rounded object-cover" /><div><p class="font-medium text-white">'+p.name+'</p><p class="text-[#6b7280] text-xs">'+p.songs.length+' lagu</p></div></button>';}).join('');popup.innerHTML='<div class="glass-strong w-full max-w-md rounded-t-3xl p-6 border-t border-white/10" style="animation:slideUp 0.3s ease-out forwards;"><div class="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4"></div><h3 class="font-bold text-white mb-3 flex items-center"><i data-lucide="list-plus" class="w-5 h-5 mr-2"></i>Tambah ke Playlist</h3><div class="max-h-72 overflow-y-auto hide-scrollbar">'+listHtml+'</div><button onclick="this.parentElement.parentElement.remove()" class="w-full mt-3 py-3 glass glass-hover text-white rounded-full flex items-center justify-center"><i data-lucide="x" class="w-4 h-4 mr-2"></i>Batal</button></div>';document.body.appendChild(popup);safeCreateIcons();}