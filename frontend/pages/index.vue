<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">BTC Price Tracker</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Latest Price -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Latest Price</h2>
        <div v-if="latestPrice" class="text-2xl font-bold">
          ${{ latestPrice.price.toLocaleString() }}
        </div>
        <div v-else class="text-gray-500">Loading...</div>
      </div>

      <!-- Price Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Price History</h2>
        <div class="mb-4">
          <select v-model="selectedPeriod" class="border rounded px-3 py-2">
            <option value="day">Last 24 Hours</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
        <PriceChart v-if="prices.length" :prices="prices" />
        <div v-else class="text-gray-500">Loading...</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import PriceChart from "~/components/PriceChart.vue";

const config = useRuntimeConfig();
const latestPrice = ref<{ price: number } | null>(null);
const prices = ref<Array<{ price: number; timestamp: string }>>([]);
const selectedPeriod = ref("day");

const fetchLatestPrice = async () => {
  try {
    const response = await fetch(`${config.public.apiBase}/api/latest`);
    latestPrice.value = await response.json();
  } catch (error) {
    console.error("Failed to fetch latest price:", error);
  }
};

const fetchPrices = async () => {
  try {
    const response = await fetch(
      `${config.public.apiBase}/api/prices?period=${selectedPeriod.value}`
    );
    prices.value = await response.json();
  } catch (error) {
    console.error("Failed to fetch prices:", error);
  }
};

watch(selectedPeriod, () => {
  fetchPrices();
});

onMounted(() => {
  fetchLatestPrice();
  fetchPrices();
});
</script>
