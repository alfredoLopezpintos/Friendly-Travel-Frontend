import React from "react";
import "../App.css";
import { SearchForm } from '@rodrisu/friendly-ui/build/searchForm';
import { DatePicker, DatePickerOrientation } from "@rodrisu/friendly-ui/build/datePicker";
import { weekdaysShort, weekdaysLong, months } from "../components/DatePickerProps";
import { AutoCompleteUy } from "../components/AutoCompleteUy";
import { Link, useHistory, Redirect } from "react-router-dom";
import "./HeroSection.css";
import { formValidate } from "../components/Utilities";

function HeroSection() {
  const history = useHistory();

  // const handleHistory = () => {
  //   history.push("/viajes");
  // };

  const handleFormSubmit = (formValues) => {
 
    var dataToSend = { desde: ( formValues.AUTOCOMPLETE_FROM !== undefined ? formValues.AUTOCOMPLETE_FROM.item.terms.at(-3).value : "" ),
                      hasta: ( formValues.AUTOCOMPLETE_TO !== undefined ? formValues.AUTOCOMPLETE_TO.item.terms.at(-3).value : "" ),
                      fecha: formValues.DATEPICKER,
                      asientos: formValues.STEPPER,
                      precio: formValues.PRICE }

    console.log(dataToSend)

    if(formValidate(dataToSend.desde, dataToSend.hasta, dataToSend.fecha, dataToSend.precio, dataToSend.asientos)) {
      history.push('/viajes', { data: dataToSend });
    }

  };

  return (
    <div className="hero-container">
      {/*<video src='/videos/video-2.mp4' autoPlay loop muted />*/}
      <h1 style={{"userSelect": "none"}}>TU VIAJE TE ESPERA</h1>
      <p style={{"userSelect": "none"}}>¿Qué estás esperando?</p>
      <div className="hero-btns">
        <SearchForm
              onSubmit={handleFormSubmit}
              className="form-inline"
              initialFrom=""
              initialTo=""
              disabledFrom={false}
              disabledTo={false}
              autocompleteFromPlaceholder="Desde"
              autocompleteToPlaceholder="Hasta"
              renderDatePickerComponent={props => <DatePicker {...props}
                numberOfMonths={2}
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
                defaultValue: "",
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
                format: value => `${value} UYU`,
                confirmLabel: 'Aceptar',
              }}
            />
      </div>
    </div>
  );
}

export default HeroSection;
