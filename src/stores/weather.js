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
      if (!coord) return
      this.selectedCityWeather = {};
      this.dailyHourlyWeather = {};
      Promise.all([
        fetch(
          `${fetchUrl}/data/2.5/weather?lat=${coord.latitude}&lon=${coord.longitude}&appid=${apiKey}&units=metric`
        ),
        fetch(
          `${fetchUrl}/data/2.5/forecast?lat=${coord.latitude}&lon=${coord.longitude}&appid=${apiKey}&units=metric`
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
            `${fetchUrl}/geo/1.0/direct?q=${city}&appid=${apiKey}`
          )
        ).json();

        cities?.length &&
          cities?.forEach((element) => {
            this.preferedCitiesList.push(element?.name);
            this.preferedCitiesLocation[element?.name] = {
              latitude: element.lat,
              longitude: element.lon,
            };
          });


      } catch (err) {
        console.error(err);
      }
    },
  },
});
