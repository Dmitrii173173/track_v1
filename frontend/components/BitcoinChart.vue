<template>
  <div class="w-full h-[400px] p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800 dark:text-white">
        Bitcoin Price
      </h2>
      <div class="flex space-x-2">
        <button
          v-for="period in periods"
          :key="period"
          @click="selectedPeriod = period"
          :class="[
            'px-3 py-1 rounded',
            selectedPeriod === period
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
          ]"
        >
          {{ period }}
        </button>
      </div>
    </div>
    <Line v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { format, subDays, subMonths, subYears } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const periods = ["Day", "Week", "Month", "Year"];
const selectedPeriod = ref("Day");
const chartData = ref(null);

const fetchData = async () => {
  try {
    const response = await fetch(
      `/api/prices?period=${selectedPeriod.value.toLowerCase()}`
    );
    const data = await response.json();

    chartData.value = {
      labels: data.map((item) => format(new Date(item.timestamp), "HH:mm")),
      datasets: [
        {
          label: "BTC/USDT",
          data: data.map((item) => parseFloat(item.price)),
          borderColor: "#2563eb",
          tension: 0.1,
        },
      ],
    };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
  scales: {
    y: {
      beginAtZero: false,
    },
  },
};

watch(selectedPeriod, () => {
  fetchData();
});

onMounted(() => {
  fetchData();
});
</script>
