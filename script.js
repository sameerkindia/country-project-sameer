'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderError = function (err) {
  countriesContainer.insertAdjacentHTML('beforeend', err);
};

const renderCountry = function (data, classes = '') {
  const languages = [];
  const currencies = [];
  Object.values(data.languages).forEach(lang => languages.push(lang));
  Object.keys(data.currencies).forEach(curr => currencies.push(curr));

  const html = `
  <article class="country ${classes}">
        <img class="country__img" src="${data.flags.png}" />
        <div class="country__data">
          <h3 class="country__name">${data.name.common}</h3>
          <h4 class="country__region">${data.region}</h4>
          <p class="country__row"><span>👫</span>${
            +data.population / 1000000
          }</p>
          <p class="country__row"><span>🗣️</span>${languages.join(',')}</p>
          <p class="country__row"><span>💰</span>${currencies.join(',')}</p>
        </div>
      </article> `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
};

const getCountryData = async function (country) {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);

    if (!res.ok) throw new Error(`Country not found ${res.status}`);

    const [data] = await res.json();
    renderCountry(data);

    if (!data.borders) throw new Error(`Neighbour country not found`);

    const neighbour = data.borders[0];

    const neighbourRes = await fetch(
      `https://restcountries.com/v3.1/alpha/${neighbour}`
    );

    const [neiData] = await neighbourRes.json();

    renderCountry(neiData, 'neighbour');
  } catch (err) {
    console.error(err);
    renderError(err);
  } finally {
    countriesContainer.style.opacity = 1;
  }
};

const searchBtn = function (input) {
  countriesContainer.innerHTML = '';

  getCountryData(input);
};

btn.addEventListener('click', () => {
  const input = prompt('Enter Country Name');
  searchBtn(input);
});
