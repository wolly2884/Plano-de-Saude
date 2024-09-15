// api.js

export const searchPlacesAPI = async (latitude, longitude, searchQuery) => {
  try {
    const url = `https://autosuggest.search.hereapi.com/v1/discover?at=${latitude}%2C${longitude}&q=${searchQuery}&_ontology=&lang=br&limit=20&_searchLocus=${latitude}%2C${longitude}&apiKey=abUM7kh-khElkXVOHDGo5LlZEVvxr2Nuh_GeqD-h6Os`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const parsedPlaces = data.items.map(item => ({
        id: item.id,
        name: item.title,
        geometry: {
          location: {
            lat: item.position.lat,
            lng: item.position.lng,
          },
        },
        rating: null,
        vicinity: item.address.label,
      }));

      return parsedPlaces;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Erro ao buscar locais:', error);
    throw error;
  }
};
