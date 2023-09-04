import { ThreeDots } from "react-loader-spinner";
import { usePromiseTracker } from "react-promise-tracker";
import moment from 'moment';

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
  if (str.trim() === "") {
    return false;
  }

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