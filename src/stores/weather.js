import { fetchUrl, apiKey } from "@/constants/fetch";
import { defineStore } from "pinia";

export const useWeatherStore = defineStore("weather", {
  state: () => ({
    currentPositionWeather: {},
    selectedCityWeather: {},
    dailyHourlyWeather: {},
    preferedCitiesList: [],
    preferedCitiesLocation: {},
  }),

  getters: {
    currentWeather: ({ currentPositionWeather }) => currentPositionWeather,
    selectedWeather: ({ selectedCityWeather }) => selectedCityWeather,
    dailyWeather: ({ dailyHourlyWeather }) => dailyHourlyWeather,
    preferedCities: ({ preferedCitiesList }) => preferedCitiesList,
  },

  actions: {
    getCurrentPositionWeather() {
      try {
        const success = async (position) => {
          this.getSelectedCityWeather(position.coords);
        };

        const error = (err) => {
          console.error(err);
        };

        navigator.geolocation.getCurrentPosition(success, error);
      } catch (err) {
        console.error(err);
      }
    },

    async getCityWeather(city) {
      this.getSelectedCityWeather(this.preferedCitiesLocation[city]);
    },

    async getSelectedCityWeather(coord) {
      this.selectedCityWeather = {};
      this.dailyHourlyWeather = {};
      Promise.all([
        fetch(
          `${fetchUrl}/weather?lat=${coord.latitude}&lon=${coord.longitude}&appid=${apiKey}&units=metric`
        ),
        fetch(
          `${fetchUrl}/forecast?lat=${coord.latitude}&lon=${coord.longitude}&appid=${apiKey}&units=metric`
        ),
      ])
        .then(async (res) => {
          this.selectedCityWeather = await res[0].json();
          this.currentPositionWeather = this.currentPositionWeather.name
            ? this.currentPositionWeather
            : this.selectedCityWeather;

          const cityWeather = await res[1].json();

          cityWeather.list.forEach((element) => {
            const day = element.dt_txt.slice(0, 10);
            if (day in this.dailyWeather) {
              this.dailyWeather[day].items.push(element);
            } else {
              this.dailyWeather[day] = {};
              this.dailyWeather[day].isVisible = false;
              this.dailyWeather[day].items = [element];
            }
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },

    async findCity(city) {
      try {
        const cities = await (
          await fetch(
            `https://openweathermap.org/data/2.5/find?q=${city}&appid=439d4b804bc8187953eb36d2a8c26a02&units=metric`
          )
        ).json();

        cities.list?.forEach((el) => {
          this.preferedCitiesList.push(el?.name);
          this.preferedCitiesLocation[el?.name] = {
            latitude: el.coord.lat,
            longitude: el.coord.lon,
          };
        });
      } catch (err) {
        console.error(err);
      }
    },
  },
});
