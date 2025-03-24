<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Bitcoin Price Tracker
      </h1>

      <div class="grid grid-cols-1 gap-6">
        <BitcoinChart />

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Latest Price
          </h2>
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {{ latestPrice }} USDT
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Last updated: {{ lastUpdated }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { format } from "date-fns";

const latestPrice = ref("0");
const lastUpdated = ref("");

const fetchLatestPrice = async () => {
  try {
    const response = await fetch("/api/latest");
    const data = await response.json();
    latestPrice.value = data.price;
    lastUpdated.value = format(new Date(data.timestamp), "HH:mm:ss");
  } catch (error) {
    console.error("Error fetching latest price:", error);
  }
};

onMounted(() => {
  fetchLatestPrice();
  setInterval(fetchLatestPrice, 5000); // Обновляем каждые 5 секунд
});
</script>
