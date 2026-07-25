const App={
    init(){
        gid('nav-container').innerHTML=``;
        
        MP.init();FullPlayer.init();Artist.init();Home.render();Search.render();
        lucide.createIcons();
        setTimeout(function(){ App.checkUrl(); }, 1000);
    },
    checkUrl(){
        var p=new URLSearchParams(location.search);
        var play=p.get('play'),search=p.get('search'),isShared=p.get('share')==='1';
        if(play){if(isShared){App.showSharePopup(play);}else{App.autoPlayTrack(play);}}
        else if(search){setTimeout(function(){var si=gid('search-input');if(si){si.value=decodeURIComponent(search);gid('search-form').dispatchEvent(new Event('submit'));}App.switch('search');},300);}
    },
    autoPlayTrack(videoId){
        fetch(API.search+'?query=https://youtube.com/watch?v='+videoId).then(function(r){return r.json();}).then(function(d){
            var title='Lagu',artist='Musically',cover=FI,artistId='';
            if(d.status&&d.result.songs&&d.result.songs.length>0){var song=d.result.songs[0];title=cn(song.title);artist=cn(song.artist);cover=song.thumbnail||FI;artistId=song.artistId||'';}
            S.ct={id:videoId,videoId:videoId,title:title,artist:artist,cover:cover,artistId:artistId,ytUrl:'https://youtube.com/watch?v='+videoId};
            S.ps='direct';S.pl=[S.ct];S.pi=0;UU();MP.show();
            setTimeout(function(){FullPlayer.open();loadAndPlayVideo(videoId);},200);
        }).catch(function(){
            S.ct={id:videoId,videoId:videoId,title:'Lagu',artist:'Musically',cover:FI,artistId:'',ytUrl:'https://youtube.com/watch?v='+videoId};
            S.ps='direct';S.pl=[S.ct];S.pi=0;UU();MP.show();
            setTimeout(function(){FullPlayer.open();loadAndPlayVideo(videoId);},200);
        });
    },
    showSharePopup(videoId){
        fetch(API.search+'?query=https://youtube.com/watch?v='+videoId).then(function(r){return r.json();}).then(function(d){
            var title='Lagu',artist='Musically',cover=FI;
            if(d.status&&d.result.songs&&d.result.songs.length>0){var song=d.result.songs[0];title=cn(song.title);artist=cn(song.artist);cover=song.thumbnail||FI;}
            App.renderPopup(videoId,title,artist,cover);
        }).catch(function(){App.renderPopup(videoId,'Lagu','Musically',FI);});
    },
    renderPopup(videoId,title,artist,cover){
        var popup=document.createElement('div');popup.className='fixed inset-0 z-[300] flex items-end justify-center bg-black/60';
        popup.onclick=function(e){if(e.target===popup)popup.remove();};
        popup.innerHTML='<div class="glass-strong w-full max-w-md rounded-t-3xl p-6 border-t border-white/10" style="animation:slideUp 0.4s ease-out forwards;"><div class="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4"></div><div class="flex items-center gap-4 mb-4"><img src="'+cover+'" class="w-16 h-16 rounded-xl object-cover shadow-lg" onerror="this.src=\''+FI+'\'" /><div class="flex-1 truncate"><h3 class="font-bold text-white truncate">'+title+'</h3><p class="text-[#b3b3b3] text-sm truncate">'+artist+'</p></div></div><p class="text-[#6b7280] text-xs mb-4 text-center">Seseorang membagikan lagu ini kepadamu</p><div class="flex gap-3"><button id="popup-play" class="flex-1 btn-chrome font-bold py-3 rounded-full active:scale-95"><i data-lucide="play" class="w-4 h-4 mr-2"></i>Putar</button><button id="popup-later" class="px-6 py-3 glass glass-hover text-white rounded-full active:scale-95">Nanti</button></div></div>';
        document.body.appendChild(popup);
        popup.querySelector('#popup-play').onclick=function(){popup.remove();S.ct={id:videoId,videoId:videoId,title:title,artist:artist,cover:cover,artistId:'',ytUrl:'https://youtube.com/watch?v='+videoId};S.ps='direct';S.pl=[S.ct];S.pi=0;UU();MP.show();setTimeout(function(){FullPlayer.open();loadAndPlayVideo(videoId);},200);};
        popup.querySelector('#popup-later').onclick=function(){popup.remove();};
        lucide.createIcons();
    },
    switch(t){
        S.at=t;
        if(t === 'online'){
            t = 'home';
            Home.fetch();
        } else if(t === 'watch'){
            App.switch('search');
            var si = gid('search-input');
            if(si){ si.value = 'Video Klip Musik Terpopuler'; gid('search-form').dispatchEvent(new Event('submit')); }
            return;
        }

        ['home','search','library'].forEach(function(id){
            var el = gid('view-'+id);
            if(el) el.style.display='none';
        });

        if(t==='library'){ Library.render(); }
        var targetView = gid('view-'+t);
        if(targetView) targetView.style.display='block';

        ['home','online','search'].forEach(function(n){
            var b=gid('nav-'+n);
            if(!b)return;
            b.classList.remove('text-white');
            b.classList.add('text-neutral-500');
        });

        var activeNavKey = S.at;
        var ab=gid('nav-'+activeNavKey) || gid('nav-home');
        if(ab){
            ab.classList.remove('text-neutral-500');
            ab.classList.add('text-white');
        }

        gid('main-area').scrollTop=0;
        lucide.createIcons();
    }
};
App.init();Home.fetch();
(function(){
    var sp=gid('splash-screen');
    if(!sp)return;
    setTimeout(function(){
        sp.classList.add('hide');
        setTimeout(function(){ if(sp&&sp.parentNode) sp.parentNode.removeChild(sp); },650);
    },1900);
})();

const Library={
    render(){
        var pls=getUserPlaylists();
        var html='<div class="pt-6 px-4 mb-3 flex items-center gap-3"><button onclick="App.switch(\'home\')" class="btn-back" title="Kembali ke Beranda"><i data-lucide="arrow-left" class="w-5 h-5"></i></button><div class="min-w-0 flex-1"><h1 class="text-2xl font-black text-white tracking-tight truncate">Library</h1></div></div>';
        html+='<div class="px-4"><button onclick="Library.createNew()" class="w-full btn-chrome font-bold py-3.5 rounded-xl active:scale-95 mb-4 text-sm shadow-md flex items-center justify-center gap-2"><i data-lucide="plus" class="w-4 h-4"></i>Buat Playlist Baru</button>';
        if(pls.length===0){html+='<div class="text-center text-[#6b7280] mt-10 p-6 glass rounded-2xl"><i data-lucide="library" class="w-12 h-12 mx-auto mb-3 opacity-40"></i><p class="text-sm font-medium">Belum ada playlist</p></div>';}
        else{html+='<div class="grid grid-cols-2 sm:grid-cols-3 gap-3.5">';pls.forEach(function(p){html+='<div onclick="Library.open(\''+p.id+'\')" class="glass glass-hover rounded-2xl p-3 cursor-pointer active:scale-95 transition flex flex-col"><img src="'+(p.image||FI)+'" class="w-full aspect-square object-cover rounded-xl mb-2.5 shadow-md" onerror="this.src=\''+FI+'\'" /><h3 class="font-bold text-sm text-white truncate w-full">'+es(p.name)+'</h3><p class="text-[#6b7280] text-xs mt-0.5 truncate">'+p.songs.length+' lagu</p></div>';});html+='</div>';}
        html+='</div>';gid('view-library').innerHTML=html;lucide.createIcons();
    },
    createNew(){
        var popup=document.createElement('div');popup.className='fixed inset-0 z-[300] flex items-end justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4';
        popup.innerHTML='<div class="glass-strong w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 border border-white/10 shadow-2xl" style="animation:slideUp 0.3s ease-out forwards;"><div class="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4 sm:hidden"></div><h3 class="font-bold text-white text-lg mb-4">Buat Playlist Baru</h3><input id="pl-name" class="w-full glass-input text-white text-sm rounded-xl px-4 py-3 mb-3 focus:outline-none" placeholder="Nama Playlist" /><input id="pl-image" type="file" accept="image/*" class="w-full text-xs text-[#6b7280] mb-5 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20" /><div class="flex gap-3"><button id="pl-create" class="flex-1 btn-chrome font-bold py-3 rounded-full text-xs shadow-md">Buat</button><button onclick="this.closest(\'.fixed\').remove()" class="px-6 py-3 glass glass-hover text-white rounded-full text-xs font-medium">Batal</button></div></div>';
        document.body.appendChild(popup);
        popup.querySelector('#pl-create').onclick=function(){
            var name=gid('pl-name').value.trim()||'Playlist Baru';
            var file=gid('pl-image').files[0];
            if(file){var reader=new FileReader();reader.onload=function(e){createPlaylist(name,e.target.result);popup.remove();Library.render();};reader.readAsDataURL(file);}
            else{createPlaylist(name,'');popup.remove();Library.render();}
        };
    },
    open(id){
        var pls=getUserPlaylists();var pl=pls.find(function(p){return p.id===id;});if(!pl)return;
        var html='<div class="pt-6 px-4 mb-3 flex items-center gap-3"><button onclick="Library.render();App.switch(\'library\')" class="btn-back" title="Kembali ke Library"><i data-lucide="arrow-left" class="w-5 h-5"></i></button><div class="min-w-0 flex-1"><h1 class="text-xl font-bold text-white truncate">'+es(pl.name)+'</h1><p class="text-[#6b7280] text-xs truncate">'+pl.songs.length+' lagu</p></div></div>';
        if(pl.songs.length===0){html+='<div class="text-center text-[#6b7280] mt-10 p-6 glass rounded-2xl mx-4"><p class="text-sm">Belum ada lagu di playlist ini</p></div>';}
        else{html+='<div class="space-y-1.5 px-4">';pl.songs.forEach(function(s,i){html+='<div onclick="Library.playSong(\''+id+'\','+i+')" class="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl cursor-pointer active:scale-[0.98] transition"><img src="'+s.cover+'" class="w-12 h-12 rounded-lg object-cover shrink-0 shadow-md" onerror="this.src=\''+FI+'\'" /><div class="flex-1 min-w-0"><p class="font-medium text-sm text-white truncate">'+es(s.title)+'</p><p class="text-[#6b7280] text-xs truncate mt-0.5">'+es(s.artist)+'</p></div></div>';});html+='</div>';}
        html+='</div>';gid('view-library').innerHTML=html;lucide.createIcons();
    },
    playSong(plId,index){var pls=getUserPlaylists();var pl=pls.find(function(p){return p.id===plId;});if(!pl||!pl.songs[index])return;S.pl=pl.songs;S.pi=index;S.ps='playlist';S.ct=S.pl[S.pi];UU();MP.show();loadAndPlayVideo(S.ct.videoId);}
};