import { Innertube } from 'youtubei.js';

async function test() {
  const youtube = await Innertube.create();
  try {
    const channel = await youtube.getChannel('UCPjdRlsO9Fu0p5ZxQm-ZMTA');
    console.log('Channel Name:', channel.title);
    
    console.log('\n--- Fetching Playlists ---');
    const playlistsTab = await channel.getPlaylists();
    
    // In youtubei.js, playlists are in the 'playlistsTab.playlists' or similar getter
    const playlists = playlistsTab.playlists || playlistsTab.content?.contents;
    console.log(`Found ${playlists?.length || 0} playlists/sections.`);
    
    if (playlists && playlists.length > 0) {
      const pl = playlists[0];
      if (pl.type === 'LockupView') {
         console.log(`LockupView ID: ${pl.content_id}`);
         console.log(`LockupView Title: ${pl.metadata?.title?.toString()}`);
         const playlistData = await youtube.getPlaylist(pl.content_id);
         console.log(`Playlist Videos: ${playlistData.items.length}`);
         if (playlistData.items.length > 0) {
           console.log(playlistData.items[0]);
         }
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
