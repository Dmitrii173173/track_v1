<template>
  <div class="w-full h-96">
    <div class="flex justify-end mb-4">
      <select v-model="selectedPeriod" class="border rounded px-3 py-2">
        <option value="day">Последние 24 часа</option>
        <option value="week">Последняя неделя</option>
        <option value="month">Последний месяц</option>
        <option value="year">Последний год</option>
      </select>
    </div>
    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
    <Line v-if="chartData" :data="chartData" :options="chartOptions" />
    <div v-else class="text-gray-500">Нет данных для отображения</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
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
import { ru } from "date-fns/locale";

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

const emit = defineEmits<{
  (e: "update:period", period: string): void;
}>();

const selectedPeriod = ref("day");
const error = ref<string | null>(null);

console.log("Received prices:", props.prices);

watch(selectedPeriod, (newPeriod) => {
  console.log("Period changed:", newPeriod);
  emit("update:period", newPeriod);
});

const formatDate = (date: Date) => {
  try {
    switch (selectedPeriod.value) {
      case "day":
        return format(date, "HH:mm", { locale: ru });
      case "week":
        return format(date, "dd MMM HH:mm", { locale: ru });
      case "month":
        return format(date, "dd MMM", { locale: ru });
      case "year":
        return format(date, "dd MMM yyyy", { locale: ru });
      default:
        return format(date, "HH:mm", { locale: ru });
    }
  } catch (err) {
    console.error("Error formatting date:", err);
    return date.toISOString();
  }
};

const chartData = computed(() => {
  try {
    if (!props.prices || props.prices.length === 0) {
      console.log("No prices available");
      return null;
    }

    console.log("Creating chart data with prices:", props.prices);
    return {
      labels: props.prices.map((price) =>
        formatDate(new Date(price.timestamp))
      ),
      datasets: [
        {
          label: "BTC/USDT",
          data: props.prices.map((price) => price.price),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.1)",
          tension: 0.1,
          fill: true,
        },
      ],
    };
  } catch (err) {
    console.error("Error creating chart data:", err);
    error.value = "Ошибка при создании графика";
    return null;
  }
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "История цен BTC/USDT",
      font: {
        size: 16,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: false,
      ticks: {
        callback: (value: number) => `$${value.toLocaleString()}`,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};
</script>
