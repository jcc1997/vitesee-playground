<script setup lang="ts">
import 'video.js/dist/video-js.min.css'
import { VideoPlayer } from '@videojs-player/vue'
</script>

<template>
  <div>
    <!-- <video id="video" ref="video_player_ref" controls class="video-js" /> -->
    <VideoPlayer
      :width="500"
      src="http://localhost:32000/Users/gd/Downloads/m3u8_dir/hls.m3u8"
      poster="/your-path/poster.jpg"
      controls
    />
  </div>
</template>
