import React, { useState, useEffect } from "react";
import { Loader, LoaderLayoutMode } from '@blablacar/ui-library/build/loader';
import { ItemStatus } from '@blablacar/ui-library/build/_internals/item';
import configData from "../configData.json";

import { AutoComplete } from '@blablacar/ui-library/build/autoComplete';

const AutoCompleteUy = ({
  className,
  searchForItemsDelay = 10,
  renderEmptySearch = [],
  onSelect,
  inputAddon,
  error,
  defaultValue,
  embeddedInSearchForm,
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
      language: 'es', // Set the language to Spanish
    };
  
    autocompleteService.getPlacePredictions(options, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const filteredPredictions = predictions.filter((prediction) => {
          // Check if types include "locality"
          return prediction.types.includes("locality" || "sublocality" || "geocode");
        });
  
        const mappedPredictions = filteredPredictions.map((prediction) => {
          const city = prediction.structured_formatting.main_text;
          const department = prediction.terms[prediction.terms.length - 2].value; // Get the second-to-last term
  
          return {
            id: prediction.place_id,
            label: city,
            labelInfo: department,
            place_id: prediction.place_id,
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
      getItemValue={(item) => item.id}
      renderQuery={(item) => item.label}
      error={error}
      maxItems={5}
      searchForItemsMinChars={3}
      selectedItemStatus={ItemStatus.DEFAULT}
      inputAddon={inputAddon}
      embeddedInSearchForm={embeddedInSearchForm}
    />
  );
};

export { AutoCompleteUy };
