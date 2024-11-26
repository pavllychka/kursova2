async function getCityAndCountry(lat, lng) {
  const apiKey = '63b9faafde7646308ff75175ea278add';
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;

  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const results = data.results;

      if (results.length > 0) {
          const city = results[0].components.city || results[0].components.town;
          const country = results[0].components.country;

          return `${city || 'Unknown city'}, ${country || 'Unknown country'}`;
      }

      return 'Location not found';
  } catch (error) {
      throw new Error(`Error retrieving location: ${error.message}`);
  }
}

module.exports = { getCityAndCountry };
