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
        <div v-else-if="error" class="text-red-500">{{ error }}</div>
        <div v-else class="text-gray-500">Loading...</div>
      </div>

      <!-- Price Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Price H2istory</h2>
        <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
        <PriceChart
          v-if="prices.length"
          :prices="prices"
          @update:period="handlePeriodChange"
        />
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
const error = ref<string | null>(null);

const fetchLatestPrice = async () => {
  try {
    error.value = null;
    const response = await fetch(`${config.public.apiBase}/api/latest`);
    if (!response.ok) {
      throw new Error(`Failed to fetch latest price: ${response.statusText}`);
    }
    latestPrice.value = await response.json();
  } catch (err) {
    console.error("Failed to fetch latest price:", err);
    error.value = "Failed to fetch latest price";
  }
};


const fetchPrices = async () => {
  try {
    error.value = null;
    const response = await fetch(
      `${config.public.apiBase}/api/prices?period=${selectedPeriod.value}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch prices");
    }
    prices.value = await response.json();
  } catch (error) {
    console.error("Failed to fetch prices:", error);
    error.value = "Failed to fetch prices";
  }
};

const handlePeriodChange = (period: string) => {
  selectedPeriod.value = period;
  fetchPrices();
};

// Обновляем данные каждые 5 секунд
setInterval(() => {
  fetchLatestPrice();
  fetchPrices();
}, 5000);

onMounted(() => {
  fetchLatestPrice();
  fetchPrices();
});
</script>
