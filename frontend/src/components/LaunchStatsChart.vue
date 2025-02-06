<template>
    <div class="p-10 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-300">
        Launch Statistics
      </h2>
  
      <!-- Filter Controls -->
      <div class="mb-6 flex flex-wrap gap-4">
        <!-- Year Filter -->
        <div>
          <label for="year-filter" class="block mb-2 text-gray-600 dark:text-gray-300">
            Filter by Year:
          </label>
          <select
            id="year-filter"
            v-model="selectedYear"
            class="p-2 border rounded bg-white dark:bg-gray-700 dark:text-gray-300"
            @change="applyFilters"
          >
            <option value="">All Years</option>
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
  
        <!-- Launch Success Filter -->
        <div>
          <label for="success-filter" class="block mb-2 text-gray-600 dark:text-gray-300">
            Filter by Launch Success:
          </label>
          <select
            id="success-filter"
            v-model="selectedSuccess"
            class="p-2 border rounded bg-white dark:bg-gray-700 dark:text-gray-300"
            @change="applyFilters"
          >
            <option value="">All</option>
            <option value="success">Successful</option>
            <option value="failure">Failed</option>
          </select>
        </div>
  
        <!-- Retrieval Filter -->
        <div>
          <label for="retrieval-filter" class="block mb-2 text-gray-600 dark:text-gray-300">
            Filter by Retrieval Status:
          </label>
          <select
            id="retrieval-filter"
            v-model="selectedRetrieval"
            class="p-2 border rounded bg-white dark:bg-gray-700 dark:text-gray-300"
            @change="applyFilters"
          >
            <option value="">All</option>
            <option value="retrieved">Retrieved</option>
            <option value="not-retrieved">Not Retrieved</option>
          </select>
        </div>
  
        <!-- Crewed Filter -->
        <div>
          <label for="crewed-filter" class="block mb-2 text-gray-600 dark:text-gray-300">
            Filter by Crewed Launch:
          </label>
          <select
            id="crewed-filter"
            v-model="selectedCrewed"
            class="p-2 border rounded bg-white dark:bg-gray-700 dark:text-gray-300"
            @change="applyFilters"
          >
            <option value="">All</option>
            <option value="crewed">Crewed</option>
            <option value="uncrewed">Uncrewed</option>
          </select>
        </div>
      </div>
  
      <!-- Chart -->
      <Line v-if="chartData" :data="chartData" :options="chartOptions" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
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
  
  // Register Chart.js components
  ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);
  
  // Reactive variables
  const chartData = ref<any>(null);
  const chartOptions = ref({
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Launch Statistics',
      },
    },
  });
  
  // Filter states
  const selectedYear = ref<string>('');
  const selectedSuccess = ref<string>('');
  const selectedRetrieval = ref<string>('');
  const selectedCrewed = ref<string>('');
  
  // Launch data and available years
  const launches = ref<any[]>([]);
  const availableYears = ref<string[]>([]);
  
  // Fetch and process data
  const fetchChartData = async () => {
    const response = await fetch('https://api.spacexdata.com/v4/launches');
    const data = await response.json();
  
    // Store all launches
    launches.value = data;
  
    // Extract the full range of years
    const years: number[] = [...new Set(
        data.map((launch: { date_utc: string }) => new Date(launch.date_utc).getFullYear())
        )];


    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
  
    // Generate a continuous range of years
    availableYears.value = Array.from({ length: maxYear - minYear + 1 }, (_, i) => String(minYear + i));
  
    // Populate the chart with initial data
    applyFilters();
  };
  
  // Apply filters to the chart data
  const applyFilters = () => {
    const filteredLaunches = launches.value.filter((launch: any) => {
      const yearMatch = selectedYear.value
        ? new Date(launch.date_utc).getFullYear() === parseInt(selectedYear.value)
        : true;
  
      const successMatch =
        selectedSuccess.value === 'success'
          ? launch.success
          : selectedSuccess.value === 'failure'
          ? launch.success === false
          : true;
  
      const retrievalMatch =
        selectedRetrieval.value === 'retrieved'
          ? launch.fairings?.recovered
          : selectedRetrieval.value === 'not-retrieved'
          ? launch.fairings?.recovered === false
          : true;
  
      const crewedMatch =
        selectedCrewed.value === 'crewed'
          ? launch.crew?.length > 0
          : selectedCrewed.value === 'uncrewed'
          ? !launch.crew?.length
          : true;
  
      return yearMatch && successMatch && retrievalMatch && crewedMatch;
    });
  
    // Process filtered launches into chart data
    const launchesByYear = availableYears.value.reduce((acc: any, year: string) => {
      acc[year] = { success: 0, failure: 0 };
      return acc;
    }, {});
  
    filteredLaunches.forEach((launch: any) => {
      const year = new Date(launch.date_utc).getFullYear();
      if (launch.success) {
        launchesByYear[year].success++;
      } else {
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
  