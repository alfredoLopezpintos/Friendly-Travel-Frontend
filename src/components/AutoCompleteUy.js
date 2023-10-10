import React, { useState, useEffect } from "react";
import { Loader, LoaderLayoutMode } from '@rodrisu/friendly-ui/build/loader';
import { ItemStatus } from '@rodrisu/friendly-ui/build/_internals/item';
import configData from "../configData.json";

import { AutoComplete } from '@rodrisu/friendly-ui/build/autoComplete';

const AutoCompleteUy = ({
  className,
  searchForItemsDelay = 10,
  renderEmptySearch = [],
  onSelect,
  inputAddon,
  error,
  defaultValue,
  embeddedInSearchForm,
  onClickItem,
  onBlur,
}) => {
  const [items, setItems] = useState([]);
  const [isSearching, setSearching] = useState(false);
  const [autocompleteService, setAutocompleteService] = useState(null);

  const GOOGLE_MAPS_API_KEY = configData.MAPS_KEY;

  const loadGoogleMapsScript = () => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.onload = initializeAutocompleteService;
      document.head.appendChild(script);
    } else {
      initializeAutocompleteService();
    }
  };

  const initializeAutocompleteService = () => {
    setAutocompleteService(new window.google.maps.places.AutocompleteService());
  };

  useEffect(() => {
    loadGoogleMapsScript();
  }, []);

  const searchForItems = (query) => {
    setSearching(true);
  
    const autocompleteService = new window.google.maps.places.AutocompleteService();
  
    // Set componentRestrictions to Uruguay
    const options = {
      input: query,
      componentRestrictions: { country: 'uy' }, // 'uy' is the ISO code for Uruguay
      language: 'es',
      types: ['street_address','administrative_area_level_3','locality'], // Restrict the results to cities
    };
  
    autocompleteService.getPlacePredictions(options, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const filteredPredictions = predictions.filter((prediction) => {
          // Check if types include "locality"
          return prediction
        });
  
        const mappedPredictions = filteredPredictions.map((prediction) => {
          const main_text = prediction.structured_formatting.main_text;
          const secondary_text = prediction.structured_formatting.secondary_text;
          const city_text = prediction.terms[prediction.terms.length - 3]?.value;
          const state_text = prediction.terms[prediction.terms.length - 2]?.value;
  
          return {
            id: prediction.place_id,
            description: prediction.description,
            label: main_text,
            labelInfo: secondary_text,
            city: city_text,
            state: state_text,
          };
        });
        setItems(mappedPredictions);
      } else {
        setItems([]);
      }
  
      setSearching(false);
    });
  };
  
  

  return (
    <AutoComplete
      className={className}
      name="ciudad"
      placeholder="Buscar aquí"
      isSearching={isSearching}
      defaultValue={defaultValue}
      searchOnMount
      searchForItems={searchForItems}
      items={items}
      busyTimeout={500}
      renderBusy={() => <Loader size={36} layoutMode={LoaderLayoutMode.INLINE} />}
      renderNoResults={() => 'No se encontraron resultados'}
      renderEmptySearch={renderEmptySearch}
      onSelect={onSelect}
      getItemValue={onClickItem}
      renderQuery={(item) => item.label}
      error={error}
      maxItems={5}
      searchForItemsMinChars={3}
      selectedItemStatus={ItemStatus.DEFAULT}
      inputAddon={inputAddon}
      embeddedInSearchForm={embeddedInSearchForm}
      onBlur={onBlur}
    />
  );
};

export { AutoCompleteUy };
