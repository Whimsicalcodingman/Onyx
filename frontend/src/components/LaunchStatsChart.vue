<template>
  <div class="p-10 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md flex gap-5">
    <!-- Filter Controls -->
    <div class="">
      <div class="filter-container flex gap-5 flex-col w-40">
        <h2 class="text-xl font-semibold mb-0 text-gray-800 dark:text-gray-300">
          Launch Statistics
        </h2>
        <!-- Year Filter -->
        <div>
          <select
            id="year-filter"
            v-model="selectedYear"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            @change="applyFilters"
          >
            <option value="">Year</option>
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>

        <!-- Launch Success Filter -->
        <div>
          <select
            id="success-filter"
            v-model="selectedSuccess"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            @change="applyFilters"
          >
            <option value="">Launch Success</option>
            <option value="success">Successful</option>
            <option value="failure">Failed</option>
          </select>
        </div>

        <!-- Retrieval Filter -->
        <div>
          <select
            id="retrieval-filter"
            v-model="selectedRetrieval"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            @change="applyFilters"
          >
            <option value="">Retrieval Status</option>
            <option value="retrieved">Retrieved</option>
            <option value="not-retrieved">Not Retrieved</option>
          </select>
        </div>

        <!-- Crewed Filter -->
        <div>
          <select
            id="crewed-filter"
            v-model="selectedCrewed"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            @change="applyFilters"
          >
            <option value="">Crewed Launch</option>
            <option value="crewed">Crewed</option>
            <option value="uncrewed">Uncrewed</option>
          </select>
        </div>
      </div>
    </div>
    <div class="chart-container">
      <!-- Chart -->
      <Line v-if="chartData" ref="chartRef" :data="chartData" :options="chartOptions" class="launches-chart" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

// Define a reference for the Chart.js instance
const chartRef = ref<{ chart?: ChartJS } | null>(null);

// Function to force Chart.js to resize
const handleResize = () => {
  if (chartRef.value?.chart) {
    chartRef.value.chart.resize(); // Now TypeScript recognizes resize()
  }
};

// Add event listeners
onMounted(() => {
  fetchChartData(); // Load chart data
  window.addEventListener("resize", handleResize);
  document.addEventListener("visibilitychange", handleResize);
});

// Cleanup event listeners
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("visibilitychange", handleResize);
});

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

// Types
interface Launch {
  date_utc: string;
  success?: boolean;
  fairings?: { recovered?: boolean };
  crew?: any[];
  rocket?: string;
}

// Reactive variables
const chartData = ref<any>(null);
  const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false, // If you want to control aspect ratio
  plugins: {
    legend: {
      display: true, // Controls the display of the legend
    },
  },
});



// Filters
const selectedYear = ref<string>('');
const selectedSuccess = ref<string>('');
const selectedRetrieval = ref<string>('');
const selectedCrewed = ref<string>('');

// Launch data and available years
const launches = ref<Launch[]>([]);
const availableYears = ref<string[]>([]);

// Fetch and process data
const fetchChartData = async () => {
  const response = await fetch('https://api.spacexdata.com/v5/launches');
  const data: Launch[] = await response.json();

  // Store all launches
  launches.value = data;

  // Extract and generate a continuous range of years
  const years = [...new Set(data.map((launch) => new Date(launch.date_utc).getFullYear()))];
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  availableYears.value = Array.from({ length: maxYear - minYear + 1 }, (_, i) => String(minYear + i));

  // Populate chart with initial data
  applyFilters();
};

// Apply filters to the chart data
const applyFilters = () => {
  const filteredLaunches = launches.value.filter((launch) => {
    const yearMatch = selectedYear.value
      ? new Date(launch.date_utc).getFullYear() === parseInt(selectedYear.value, 10)
      : true;

    const successMatch =
      selectedSuccess.value === 'success'
        ? launch.success === true
        : selectedSuccess.value === 'failure'
        ? launch.success === false
        : true;

    const retrievalMatch =
      selectedRetrieval.value === 'retrieved'
        ? launch.fairings?.recovered === true
        : selectedRetrieval.value === 'not-retrieved'
        ? launch.fairings?.recovered === false
        : true;

    const crewedMatch =
      selectedCrewed.value === 'crewed'
        ? Array.isArray(launch.crew) && launch.crew.length > 0
        : selectedCrewed.value === 'uncrewed'
        ? !(Array.isArray(launch.crew) && launch.crew.length > 0)
        : true;

    return yearMatch && successMatch && retrievalMatch && crewedMatch;
  });

  // Process filtered launches into chart data
  const launchesByYear = availableYears.value.reduce((acc: any, year: string) => {
    acc[year] = { success: 0, failure: 0 };
    return acc;
  }, {});

  filteredLaunches.forEach((launch) => {
    const year = new Date(launch.date_utc).getFullYear();
    if (launch.success) {
      launchesByYear[year].success++;
    } else if (launch.success === false) {
      launchesByYear[year].failure++;
    }
  });

  // Extract labels and datasets
  const labels = availableYears.value;
  const successData = labels.map((year) => launchesByYear[year]?.success || 0);
  const failureData = labels.map((year) => launchesByYear[year]?.failure || 0);

  chartData.value = {
    labels,
    datasets: [
      {
        label: 'Successful Launches',
        data: successData,
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Failed Launches',
        data: failureData,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.4,
      },
    ],
  };
};

// Fetch data on mount
onMounted(() => {
  fetchChartData();
});
</script>

<style scoped>
  .filter-container {

  }
  .chart-container {
    width:-webkit-fill-available;
  }
</style>