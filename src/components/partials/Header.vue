<script setup>
defineProps({
  icon: String,
  temp: Number,
  name: String,
  country: String,
});
</script>

<template>
  <div class="top-bg text-center p-4 bg-light bg-opacity-80 text-dark">
    Weather Forecast
  </div>
  <div class="bg-light bg-opacity-20">
    <div class="container">
      <img :src="`https://openweathermap.org/img/wn/${icon}.png`" alt="icon" />
      <span class="py-2 pe-4 border-end d-inline-block">
        {{ temp }}°C {{ name }}, {{ country }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.top-bg {
  background-image: url("@/assets/images/rain.gif");
  background-position: bottom;
}
</style>
