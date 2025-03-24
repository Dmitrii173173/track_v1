<template>
  <div class="w-full h-96">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
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
import { format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps<{
  prices: Array<{
    price: number;
    timestamp: string;
  }>;
}>();

const chartData = computed(() => ({
  labels: props.prices.map((price) =>
    format(new Date(price.timestamp), "HH:mm")
  ),
  datasets: [
    {
      label: "BTC/USDT",
      data: props.prices.map((price) => price.price),
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: false,
    },
  },
};
</script>
