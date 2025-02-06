<template>
  <div :data-theme="isDarkMode ? 'dark' : 'light'" class="min-h-screen bg-white text-gray-800 dark:bg-black dark:text-white">
    <div class="container m-auto p-4">
      <!-- Header -->
      <header class="flex justify-between sticky top-4 items-center pt-4 pb-4 pl-9 pr-10 mb-5 rounded-lg bg-gray-100 dark:bg-gray-800 shadow">
        <div class="logo-container flex items-center">
          <svg id="onyx-logo" height="25" class="fill-black dark:fill-gray-100" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 254.84406 393.2533">
            <!-- Generator: Adobe Illustrator 29.2.1, SVG Export Plug-In . SVG Version: 2.1.0 Build 116)  -->
            <path d="M217.51829,393.2533c-1.91992,0-3.83887-.73242-5.30371-2.19629l-51.85156-51.85254c-.8125.42773-1.7041.70801-2.63672.81543-20.07715,2.31738-40.43604,2.31738-60.51221,0-.93799-.1084-1.83643-.39062-2.65283-.82422l-51.85986,51.86133c-2.92871,2.92773-7.67676,2.92871-10.60547.00098-5.99268-5.99023-11.28857-12.68457-15.74121-19.89551-15.35107-24.8623-20.10156-54.21387-13.37646-82.64941,6.3418-26.8125,22.17188-49.7832,44.80176-65.1875C36.62083,142.38074,64.22532,60.04285,122.15891,2.19275c2.92773-2.92383,7.6709-2.92334,10.59863-.00049,57.94141,57.85156,85.55078,140.1958,74.39062,221.14697,47.98145,32.71289,62.2207,97.94629,31.40137,147.8418-4.44824,7.20117-9.74023,13.88867-15.72852,19.87598-1.46387,1.46387-3.38379,2.19629-5.30273,2.19629ZM50.59055,239.86755c-16.51758,13.1123-28.08594,31.25977-33.01465,52.09863-5.80322,24.53516-1.7041,49.8623,11.5415,71.31543,2.52783,4.09375,5.37012,7.99316,8.49121,11.6543l47.85645-47.85645c-16.69824-26.58496-28.61914-56.4209-34.87451-87.21191ZM169.4636,327.09216l47.84375,47.84375c3.11816-3.65723,5.95605-7.55176,8.48047-11.6377,25.34277-41.0293,15.38184-94.07422-21.44434-123.40137-6.25781,30.78516-18.18066,60.61621-34.87988,87.19531ZM102.31956,325.48669c16.70361,1.69629,33.59424,1.69629,50.29736,0,.31055-.46094.61816-.92188.92285-1.38281.05273-.08301.10742-.16504.16309-.24609,19.33984-29.2334,32.4248-62.9668,37.8584-97.59668.01953-.19629.04688-.3916.08203-.58691,11.76172-75.20654-12.17871-152.14746-64.18457-207.40869-51.99512,55.25635-75.93213,132.18262-64.17676,207.37842.02197.12109.04102.24219.05713.36328,5.41504,34.75879,18.54004,68.625,37.9624,97.9541.00488.00684.00977.01367.01416.02051.33252.50293.66748,1.00391,1.00391,1.50488ZM127.45774,177.09265c-8.44336,0-16.88721-3.21387-23.31494-9.64209-12.85596-12.85596-12.85596-33.77441,0-46.63037,12.85547-12.85645,33.7749-12.85645,46.63037,0h.00098c12.85547,12.85596,12.85547,33.77441,0,46.63037-6.42871,6.42822-14.87207,9.64209-23.31641,9.64209ZM127.45823,126.17126c-4.60254,0-9.20508,1.75146-12.70898,5.25537-7.00732,7.00781-7.00732,18.40967,0,25.41748,7.00781,7.00781,18.40869,7.00684,25.41846,0,7.00586-7.00732,7.00586-18.40967-.00098-25.41748-3.50391-3.50342-8.10645-5.25537-12.7085-5.25537Z"/>
            <path d="M138.07121,219.73145l20.18146-20.18127c2.92871-2.9292,2.92871-7.67822,0-10.60693-2.92969-2.92871-7.67773-2.92871-10.60742,0l-20.18121,20.18121-20.18158-20.18121c-2.92871-2.92871-7.67773-2.92871-10.60645,0-2.9292,2.92871-2.9292,7.67773,0,10.60693l20.18103,20.18127-20.18103,20.18103c-2.9292,2.92969-2.9292,7.67773,0,10.60742,1.46436,1.46387,3.38379,2.19629,5.30322,2.19629s3.83887-.73242,5.30322-2.19629l20.18158-20.1814,20.18121,20.1814c1.46484,1.46387,3.38477,2.19629,5.30371,2.19629s3.83887-.73242,5.30371-2.19629c2.92871-2.92969,2.92871-7.67773,0-10.60742l-20.18146-20.18103Z"/>
          </svg>
          <p class="ms-3 font-medium text-xl text-gray-900 dark:text-gray-300">Onyx</p>  
        </div>
          <label class="inline-flex items-center cursor-pointer">
            <input @click="toggleDarkMode" type="checkbox" value="" class="sr-only peer">
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}</span>
          </label>
      </header>

      <!-- Main Content -->
      <main class="">
        <LaunchStatsChart />
        <SpaceXLaunches />
      </main>

      <!-- Footer -->
      <footer class="rounded-lg text-center p-4 bg-gray-100 dark:bg-gray-800 mt-5">
        <p class="text-sm">© 2025 SpaceX Dashboard. All rights reserved.</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SpaceXLaunches from './components/SpaceXLaunches.vue';
import LaunchStatsChart from '../src/components/LaunchStatsChart.vue';

const isDarkMode = ref(false);

// Toggle dark mode
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
};

// Initialize dark mode based on localStorage
onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  isDarkMode.value = savedTheme === 'dark';
});
</script>
