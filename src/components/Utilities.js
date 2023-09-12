import { ThreeDots } from "react-loader-spinner";
import { usePromiseTracker } from "react-promise-tracker";
import moment from 'moment';
import { toast } from "react-toastify";

export function LoadingIndicator() {
  const { promiseInProgress } = usePromiseTracker();

  return (
    promiseInProgress && (
      <div
        style={{
          width: "100%",
          height: "100",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ThreeDots color="#2BAD60" height="100" width="100" />
      </div>
    )
  );
};

export function isNumber(str) {
  return !isNaN(str);
};

export function transformDate(dateObj) {
  const month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();
  if (/^\d$/.test(dateObj.getUTCDate())) {
    day = "0" + dateObj.getUTCDate();
  }
  return day + "-" + month + "-" + year;
}

export function transformDate2(dateObj) {
  const fecha = moment(dateObj);
  console.log(fecha.format("DD-MM-YYYY"))
  return (fecha.format("DD-MM-YYYY"));
}

export function getDate() {
  var today = new Date();
  var month = today.getMonth() + 1;
  var year = today.getFullYear();
  var date = today.getDate();

  if (month < 10) month = "0" + month;

  return `${year}-${month}-${date}`;
}

export function getTime() {
  
  return new Date().toLocaleTimeString();
}

export function formValidate(origin, destination, date, price, seats) {
  const dateObj = new Date();
  const today = transformDate(dateObj);
  date = moment(date).format("DD-MM-YYYY");

  if (date === "" ||
    origin === "" ||
    destination === "" ||
    date === undefined ||
    origin === undefined ||
    destination === undefined) {
    toast.error("La busqueda debe tener por lo menos origen, destino y fecha");
    return false;
  } else if (!isNumber(price) && price !== "" && price !== undefined) {
    toast.error("Precio incorrecto");
    return false;
  } else if (!isNumber(seats) && seats !== "") {
    toast.error("Asientos incorrectos");
    return false;
  } else if (!moment(date, "DD-MM-YYYY").isValid()) {
    toast.error("Fecha inválida");
    return false;
  } else if (moment(date) < moment(today).format("DD-MM-YYYY")) {
    toast.error("La fecha del viaje no puede ser anterior al día actual");
    return false;
  } else {
    return true;
  }
}