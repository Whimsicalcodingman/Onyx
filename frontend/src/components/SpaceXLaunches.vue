<template>
  <div class="container mx-auto">
    <!-- Page Header -->
    <h1 class="text-4xl font-bold text-center mb-6 mt-6 dark:text-dark-primary">
      SpaceX Launches
    </h1>

    <!-- Launch List -->
    <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <li
        v-for="launch in paginatedLaunches" :key="launch.id"
        class="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md"
      >
        <!-- Here we want to load in our image -->
         <div class="mb-4">
          <img
            loading="lazy"
            :src="getLaunchImage(launch)"
            :alt="launch.name"
            :class="{
              'flickr-image w-full object-cover h-96': launch.links?.flickr?.original && launch.links.flickr.original.length > 0,
              'badge-image w-full object-contain': !launch.links?.flickr?.original?.length && launch.links?.patch?.small,
            }"
          />
         </div>
        <h2 class="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-300">
          {{ launch.name }}
        </h2>
        <p class="text-sm dark:text-gray-300 dark:text-dark-text mb-2">
          <strong>Date:</strong> {{ new Date(launch.date_utc).toLocaleDateString() }}
        </p>
        <p v-if="launch.rocket" class="text-sm dark:text-gray-300 dark:text-dark-text mb-2">
          <strong>Rocket:</strong> {{ launch.rocket }}
        </p>
        <p v-if="launch.links.webcast" class="text-sm text-gray-600 dark:text-gray-300">
          <strong>Webcast:</strong>
          <a
            :href="launch.links.webcast"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-500 hover:text-blue-700 dark:text-dark-accent dark:hover:text-dark-primary"
          >
            Watch Here
          </a>
        </p>
      </li>
    </ul>

    <!-- Load More Button -->
    <div class="text-center mt-6">
      <button
        v-if="hasMore"
        @click="loadMoreLaunches"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-dark-accent dark:hover:bg-dark-primary"
      >
        Load More
      </button>
      <p v-else class="text-gray-600 dark:text-dark-text mt-4">
        No more launches to load.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import apiClient from '../apiClient';

// Define the data structure for a launch
interface Launch {
  id: string;
  name: string;
  date_utc: string;
  rocket?: string;
  links: {
    webcast?: string;
    flickr?: {
      original?: string[];
    };
    patch?: {
      small?: string;
    };
  };
}

// Define reactive variables
const launches = ref<Launch[]>([]);
const currentPage = ref(0); // Tracks the current page
const pageSize = 10; // Number of launches per page
const hasMore = ref(true); // Boolean to check if more launches are available

// Fetch launches from API
const fetchLaunches = async () => {
  try {
    const response = await apiClient.get('/launches', {
      params: {
        limit: pageSize,
        offset: currentPage.value * pageSize,
        sort: '-date_utc',
      },
    });

    // Append the fetched launches to the existing list
    launches.value = [...launches.value, ...response.data];

    // Update `hasMore` if fewer launches are returned than requested
    if (response.data.length < pageSize) {
      hasMore.value = false;
    }
  } catch (error) {
    console.error('Error fetching launches:', error);
  }
};

// Load more launches
const loadMoreLaunches = () => {
  currentPage.value += 1; // Increment the page number
  fetchLaunches();
};

// Computed property for paginated launches
const paginatedLaunches = computed(() => {
  return launches.value.slice(0, (currentPage.value + 1) * pageSize);
});

const getLaunchImage = (launch: Launch): string => {
  if (launch.links?.flickr?.original && launch.links.flickr.original.length > 0) {
    return launch.links.flickr.original[0]; // Return the first Flickr image
  } else if (launch.links?.patch?.small) {
    return launch.links.patch.small; // Return the patch image
  } else {
    return 'https://sxcontent9668.azureedge.us/cms-assets/assets/Flight_7_Website_Desktop_7_4afb3a9d9a.jpg'; // Return the placeholder
  }
};

// Fetch the first page on component mount
onMounted(() => {
  fetchLaunches();
});
</script>
