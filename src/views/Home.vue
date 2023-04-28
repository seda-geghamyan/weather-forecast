<script setup>
import { computed } from "vue";
import { useWeatherStore } from "@/stores/weather";
import VueMultiselect from "vue-multiselect";

const store = useWeatherStore();

const selectedCity = computed(() => store.selectedWeather?.name);
const selectedCityDailyWeather = computed(() => store.dailyWeather);
const preferedCities = computed(() => store.preferedCities);

const toggleHourlyWeather = (key) => {
  selectedCityDailyWeather.value[key].isVisible =
    !selectedCityDailyWeather.value[key].isVisible;
};
</script>

<template>
  <div class="container">
    <vue-multiselect
      class="mt-5"
      :model-value="selectedCity"
      :options="preferedCities"
      @search-change="store.findCity"
      @update:model-value="store.getCityWeather"
    >
      <template #noResult>
        <p class="mb-2">Oops! No elements found.</p>
        <span class="fw-bold text-warning">
          Consider changing the search query.
        </span>
      </template>
    </vue-multiselect>

    <table
      class="table table-borderless table-hover mt-4 overflow-hidden rounded"
    >
      <tbody
        v-for="(hourlyWeather, key) in selectedCityDailyWeather"
        :key="key"
      >
        <tr
          class="bg-primary bg-opacity-50 shadow cursor-pointer"
          @click="toggleHourlyWeather(key)"
        >
          <th colspan="2" class="position-relative">
            <img
              :src="`https://openweathermap.org/img/wn/${hourlyWeather.items[0].weather[0].icon}.png`"
              alt="icon"
              class="me-4"
            />
            {{ new Date(key).getDate() }} of
            {{ new Date(key).toLocaleString("default", { month: "long" }) }}
            <div class="multiselect__select"></div>
          </th>
        </tr>
        <tr class="bg-secondary">
          <transition name="slide">
            <div v-if="hourlyWeather.isVisible" class="sub-item">
              <table class="table">
                <tbody>
                  <tr v-for="item in hourlyWeather.items" :key="item.dt">
                    <td>
                      {{
                        new Date(item.dt_txt).toLocaleTimeString("default", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      }}
                    </td>
                    <td>{{ item?.main?.temp }}°C</td>
                    <td>
                      <img
                        :src="`https://openweathermap.org/img/wn/${item?.weather[0].icon}.png`"
                        alt="icon"
                      />{{ item?.weather[0].main }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </transition>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style lang="scss" scoped>
.slide-enter-active,
.slide-leave-active {
  will-change: max-height;
  transition: max-height 0.9s ease;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0 !important;
}

.sub-item {
  & {
    max-height: 1300px;
    overflow: hidden;
  }
}
</style>
