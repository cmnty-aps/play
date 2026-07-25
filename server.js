import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import yts from 'yt-search';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));

// API Search
app.get('/api/search', async (req, res) => {
  const query = req.query.query;
  if (!query) return res.json({ status: false, message: 'No query' });

  try {
    const r = await yts(query);
    const songs = r.videos.map(v => ({
      videoId: v.videoId,
      title: v.title,
      artist: v.author.name,
      thumbnail: v.thumbnail,
      cover: v.thumbnail, // provide both for compatibility
      url: v.url,
      artistId: v.author.name
    }));
    
    const artists = [];
    const seenArtists = new Set();
    (r.accounts || []).forEach(a => {
        if (!seenArtists.has(a.name.toLowerCase())) {
            seenArtists.add(a.name.toLowerCase());
            artists.push({
                id: a.name,
                name: a.name,
                thumbnail: a.image,
                cover: a.image
            });
        }
    });

    res.json({
      status: true,
      result: { songs, artists }
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

// API Suggest
app.get('/api/suggest', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json([]);

  try {
    const response = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(q)}`);
    const data = await response.json();
    res.json(data[1] || []);
  } catch (error) {
    res.json([]);
  }
});

// API Home
app.get('/api/home', async (req, res) => {
  try {
    // 8 Priority tracks requested by user in exact order:
    const primaryQueries = [
      { query: 'Tulus Teh Hijau', defaultTitle: 'Teh Hijau', defaultArtist: 'Tulus' },
      { query: 'Andra and the BackBone Sempurna', defaultTitle: 'Sempurna', defaultArtist: 'Andra and The Backbone' },
      { query: 'Andra and the BackBone Jiwa Yang Bersedia', defaultTitle: 'Jiwa Yang Bersedia', defaultArtist: 'Andra and The Backbone' },
      { query: 'Virgoun Surat Cinta Untuk Starla', defaultTitle: 'Surat Cinta Untuk Starla', defaultArtist: 'Virgoun' },
      { query: 'Pamungkas Monolog', defaultTitle: 'Monolog', defaultArtist: 'Pamungkas' },
      { query: 'Idgitaf Sedia Aku Sebelum Hujan', defaultTitle: 'Sedia Aku Sebelum Hujan', defaultArtist: 'Idgitaf' },
      { query: 'Adhitia Sofyan Sesuatu Di Jogja', defaultTitle: 'Sesuatu Di Jogja', defaultArtist: 'Adhitia Sofyan' },
      { query: 'Last Child Resah', defaultTitle: 'Resah', defaultArtist: 'Last Child' }
    ];

    const recQueries = [
      'Nadin Amizah Rayuan Perempuan Gila', 'Ghea Indrawari Jiwa Yang Bersedih',
      'Mahalini Sial', 'Tiara Andini Usai', 'Anggi Marito Tak Segampang Itu',
      'Tulus Monokrom', 'Virgoun Bukti', 'Payung Teduh Resah',
      'Tulus Pamit', 'Tulus Labirin', 'Sheila on 7 Dan',
      'Sheila on 7 Seberapa Pantas', 'Peterpan Mungkin Nanti',
      'Noah Separuh Aku', 'Raisa Terjebak Nostalgia',
      'Raisa Kali Kedua', 'Glenn Fredly Januari',
      'Tulus Diri', 'Nadin Amizah Bertaut',
      'Kunto Aji Pilu Membawa Kelabu', 'Feby Putri Halu',
      'Fourtwnty Zona Nyaman', 'Hindia Evaluasi',
      'Dewa 19 Kangen', 'Dewa 19 Risalah Hati',
      'Anji Dia', 'Judika Putus Atau Terus', 'Yura Yunita Tutur Batin'
    ];
    
    const randomRecs = recQueries.sort(() => 0.5 - Math.random()).slice(0, 12);
    
    // Perform searches for primary list and additional random songs
    const primaryResults = await Promise.all(
      primaryQueries.map(async item => {
        try {
          const r = await yts(item.query);
          const v = r.videos[0];
          if (v) {
            return {
              id: v.videoId,
              videoId: v.videoId,
              title: item.defaultTitle || v.title,
              artist: item.defaultArtist || v.author.name,
              artistId: item.defaultArtist || v.author.name,
              thumbnail: v.thumbnail,
              cover: v.thumbnail,
              ytUrl: v.url,
              duration: v.timestamp
            };
          }
        } catch(e) {}
        return null;
      })
    );

    const randomResults = await Promise.all(
      randomRecs.map(async q => {
        try {
          const r = await yts(q + ' official music video');
          const v = r.videos[0];
          if (v) {
            return {
              id: v.videoId,
              videoId: v.videoId,
              title: v.title,
              artist: v.author.name,
              artistId: v.author.name,
              thumbnail: v.thumbnail,
              cover: v.thumbnail,
              ytUrl: v.url,
              duration: v.timestamp
            };
          }
        } catch(e) {}
        return null;
      })
    );

    const recommendations = [...primaryResults.filter(Boolean), ...randomResults.filter(Boolean)];
    const trending = randomResults.filter(Boolean).slice(0, 10);

    res.json({ status: true, result: { recommendations, trending } });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

// API Artist
app.get('/api/artist', async (req, res) => {
  let id = req.query.id;
  if (!id) return res.json({ status: false });

  id = id.replace(/https?:\/\/(www\.)?youtube\.com\/(channel\/|user\/|c\/|@)?/gi, '');
  id = id.replace(/_|-/g, ' ').replace(/\s+/g, ' ').trim();

  try {
    let r = await yts(id);
    let channel = r.accounts && r.accounts.length > 0 ? r.accounts[0] : null;

    if (!channel) {
      const r2 = await yts(id + ' official');
      if (r2.accounts && r2.accounts.length > 0) {
        channel = r2.accounts[0];
      }
    }

    const channelName = channel ? channel.name : (r.videos[0] ? r.videos[0].author.name : id);
    const channelImage = channel ? channel.image : (r.videos[0] ? r.videos[0].thumbnail : '');
    const channelUrl = channel ? channel.url : (r.videos[0] ? r.videos[0].author.url : '');

    const topSongs = r.videos.map(v => ({
      videoId: v.videoId,
      title: v.title,
      artist: v.author.name || channelName,
      cover: v.thumbnail,
      thumbnail: v.thumbnail,
      thumbnails: [{ url: v.thumbnail }],
      duration: v.timestamp,
      views: v.views ? v.views.toLocaleString('id-ID') : null,
      ago: v.ago
    }));

    const similarArtists = (r.accounts || []).slice(1, 6).map(a => ({
      browseId: a.name,
      name: a.name,
      thumbnails: [{ url: a.image }, { url: a.image }]
    }));

    res.json({
      status: true,
      result: {
        name: channelName,
        image: channelImage,
        url: channelUrl,
        thumbnails: [
          { url: channelImage },
          { url: channelImage },
          { url: channelImage }
        ],
        topSongs: topSongs.slice(0, 25),
        similarArtists: similarArtists
      }
    });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
});

// API Lyrics
app.get('/api/lyrics', async (req, res) => {
  let { title, artist } = req.query;
  if (!title) return res.json({ status: false, result: { lyrics: { lines: [] } } });

  // Clean title
  title = title.replace(/\(official.*?\)|\[official.*?\]|official video|official music video|mv|lyric video|video resmi|video musik resmi|lirik|lyrics|audio|full album|hq|hd/gi, '').replace(/\s+/g, ' ').trim();

  // Clean artist
  if (artist) {
    artist = artist.replace(/\s*-\s*Topic$/i, '').replace(/Vevo$/i, '').replace(/Official$/i, '').trim();
  }

  try {
    // Try lrclib first for synced lyrics
    const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(title + ' ' + (artist || ''))}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    
    if (searchData && searchData.length > 0) {
      const bestMatch = searchData[0];
      // If we have synced lyrics, use them
      if (bestMatch.syncedLyrics) {
          const lines = bestMatch.syncedLyrics.split('\n').map(line => {
              const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
              if (match) {
                  const minutes = parseInt(match[1]);
                  const seconds = parseFloat(match[2]);
                  return {
                      timeTag: match[1] + ':' + match[2],
                      words: match[3].trim(),
                      startTimeMs: (minutes * 60 + seconds) * 1000
                  };
              }
              return null;
          }).filter(l => l && l.words);

          return res.json({
              status: true,
              result: { lyrics: { lines, type: 'synced' } }
          });
      } else if (bestMatch.plainLyrics) {
          const lines = bestMatch.plainLyrics.split('\n').map(l => ({ words: l.trim() })).filter(l => l.words);
          return res.json({
              status: true,
              result: { lyrics: { lines, type: 'plain' } }
          });
      }
    }

    // Fallback to lyrics.ovh for plain lyrics
    if (artist) {
        const ovhUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;
        const ovhRes = await fetch(ovhUrl);
        const ovhData = await ovhRes.json();
        if (ovhData.lyrics) {
            const lines = ovhData.lyrics.split('\n').map(l => ({ words: l.trim() })).filter(l => l.words);
            return res.json({
                status: true,
                result: { lyrics: { lines, type: 'plain' } }
            });
        }
    }

    res.json({
      status: false,
      result: { lyrics: { lines: [] } }
    });
  } catch (error) {
    res.json({
      status: false,
      result: { lyrics: { lines: [] } }
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
