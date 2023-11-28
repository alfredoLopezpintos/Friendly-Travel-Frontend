import { MediaSizeProvider } from '@rodrisu/friendly-ui/build/_utils/mediaSizeProvider';
import { DatePicker, DatePickerOrientation } from "@rodrisu/friendly-ui/build/datePicker";
import { HeroSection } from '@rodrisu/friendly-ui/build/layout/section/heroSection';
import { SearchForm, SearchFormDisplay } from '@rodrisu/friendly-ui/build/searchForm';
import { select, text } from '@storybook/addon-knobs';
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import car_family from "../assets/illustrations/car_family.png";
import carpooling from "../assets/illustrations/carpooling.jpg";
import { AutoCompleteUy } from "./AutoCompleteUy";
import { months, weekdaysLong, weekdaysShort } from "./DatePickerProps";
import { formValidate } from "./Utilities";

export const ILLUSTRATIONS = {
  'carpool-family': {
    large: car_family,
    small: carpooling,
  }
}

export const Component = ({ content }) => content()

function HeroSectionFriendly() {
  const history = useHistory();

  const location = useLocation();
  const receivedData = location.state?.data ||
    { message: undefined };

  useEffect(() => {
    toast.info(receivedData.message)
  }, [receivedData.message]);

  const handleFormSubmit = (formValues) => {

    var dataToSend = {
      desde: (formValues.AUTOCOMPLETE_FROM !== undefined ? formValues.AUTOCOMPLETE_FROM.item.city : ""),
      hasta: (formValues.AUTOCOMPLETE_TO !== undefined ? formValues.AUTOCOMPLETE_TO.item.city : ""),
      fecha: formValues.DATEPICKER,
      asientos: formValues.STEPPER,
      precio: formValues.PRICE
    }

    if (formValidate(dataToSend.desde, dataToSend.hasta, dataToSend.fecha, dataToSend.precio, dataToSend.asientos)) {
      history.push('/viajes', { data: dataToSend });
    }

  };

  return (
    <Component
      content={() => {
        const illustration = select(
          'Illustration',
          ILLUSTRATIONS,
          ILLUSTRATIONS['carpool-family'],
          'Illustrations',
        )
        return (
          <MediaSizeProvider>
            <HeroSection
              heroText={text('heroText', '¿ Cuál será tu próximo destino ?', 'Illustrations')}
              heroImageUrlSmall={illustration.small}
              heroImageUrlLarge={illustration.large}
              bottomElement={
                <SearchForm
                  onSubmit={handleFormSubmit}
                  showVehicleField={false}
                  initialFrom=""
                  initialTo=""
                  disabledFrom={false}
                  disabledTo={false}
                  autocompleteFromPlaceholder="Desde"
                  autocompleteToPlaceholder="Hasta"
                  renderDatePickerComponent={props => <DatePicker {...props}
                    numberOfMonths={1}
                    orientation={DatePickerOrientation.HORIZONTAL}
                    locale="es-UY"
                    weekdaysShort={weekdaysShort('es-UY')}
                    weekdaysLong={weekdaysLong('es-UY')}
                    months={months('es-UY')}
                  />
                  }
                  renderAutocompleteFrom={props => <AutoCompleteUy {...props} embeddedInSearchForm />}
                  renderAutocompleteTo={props => <AutoCompleteUy {...props} embeddedInSearchForm />}
                  datepickerProps={{
                    defaultValue: new Date().toISOString(),
                    format: value => new Date(value).toLocaleDateString(),
                  }}
                  stepperProps={{
                    defaultValue: 1,
                    min: 1,
                    max: 4,
                    title: 'Elija la cantidad de asientos que desea reservar',
                    increaseLabel: 'Incrementar la cantidad de asientos en 1',
                    decreaseLabel: 'Decrementar la cantidad de asientos en 1',
                    format: value => `${value} asiento(s)`,
                    confirmLabel: 'Aceptar',
                  }}
                  priceProps={{
                    defaultValue: "",
                    min: 0,
                    title: 'Precio',
                    format: value => `$ ${value}`,
                    confirmLabel: 'Aceptar',
                  }}
                  display={SearchFormDisplay.AUTO}
                />
              }
            />
          </MediaSizeProvider>
        )
      }}
    />)
}

export default HeroSectionFriendly;
