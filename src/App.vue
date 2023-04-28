<script setup>
import { computed } from "vue";
import { useWeatherStore } from "@/stores/weather";
import Header from "@/components/partials/Header.vue";

const store = useWeatherStore();
store.getCurrentPositionWeather();
const currentWeather = computed(() => store.currentWeather);
</script>
<template>
  <Header
    :icon="currentWeather?.weather ? currentWeather.weather[0]?.icon : '10d'"
    :temp="currentWeather?.main?.temp"
    :name="currentWeather?.name"
    :country="currentWeather?.sys?.country"
  />
  <router-view></router-view>
</template>
