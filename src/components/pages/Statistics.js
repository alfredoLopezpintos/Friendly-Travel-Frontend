import {
  CChartBar,
  CChartDoughnut,
  CChartLine,
  CChartPie
} from '@coreui/react-chartjs';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Typography
} from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { TheVoice } from '@rodrisu/friendly-ui/build/theVoice';
import { Title } from '@rodrisu/friendly-ui/build/title';
import { TextTitle } from '@rodrisu/friendly-ui/build/typography/title';
import AnimatedNumber from "animated-number-react";
import axios from "axios";
import React, { useEffect, useState } from 'react';
import ReactApexChart from "react-apexcharts";
import { URLS } from "../../utils/urls";
import "../Cards.css";
import { getToken, getUser } from "../service/AuthService";


export function Statistics() {

  const [totalDistanceAsDriver, setTotalDistanceAsDriver] = useState(0);
  const [totalDistanceAsPassenger, setTotalDistanceAsPassenger] = useState(0);
  const [totalMoneyDriver, setTotalMoneyDriver] = useState(0);
  const [totalMoneyPassenger, setTotalMoneyPassenger] = useState(0);
  const [numberOfTripsAsDriver, setNumberOfTripsAsDriver] = useState(0);
  const [numberOfTripsAsPassenger, setNumberOfTripsAsPassenger] = useState(0);
  const [tripsPerMonthAsDriver, setTripsPerMonthAsDriver] = useState(0);
  const [tripsPerMonthAsPassenger, setTripsPerMonthAsPassenger] = useState(0);
  const [driverMean, setDriverMean] = useState(0);
  const [passengerMean, setPassengerMean] = useState(0);
  const [totalCO2SavedInTrips, setTotalCO2SavedInTrips] = useState(0);
  const [co2SavingsPerMonth, setCO2SavingsPerMonth] = useState(0);
  const [moneyEarnedPerMonthDriver, setMoneyEarnedPerMonthDriver] = useState(0);
  const [moneySpentPerMonthPassenger, setMoneySpentPerMonthPassenger] = useState(0);

  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };


  const [loading, setLoading] = useState(true);
  const email = getUser()

  const headers = {
    headers: {
      Authorization: JSON.parse(getToken()),
      "Content-Type": "application/json",
    },
  };

  const formatValue = (value) => value.toFixed(2);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  }));

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
    background: '#EDF2F7'
  }));

  const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, .05)'
        : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
    },
  }));

  const fetchData = async () => {
    try {
      const response = await axios.get(URLS.GET_USER_ANALYTICS + "/" + email, headers);
      const data = response.data;

      setTotalDistanceAsDriver(parseInt(data.total_distance_as_driver, 10));
      setTotalDistanceAsPassenger(parseInt(data.total_distance_as_passenger, 10));
      setTotalMoneyDriver(data.total_money_driver);
      setTotalMoneyPassenger(data.total_money_passenger);
      setNumberOfTripsAsDriver(data.number_of_trips_as_driver);
      setNumberOfTripsAsPassenger(data.number_of_trips_as_passenger);
      setTripsPerMonthAsDriver(data.trips_per_month_as_driver);
      setTripsPerMonthAsPassenger(data.trips_per_month_as_passenger);
      setMoneyEarnedPerMonthDriver(data.money_earned_per_month_driver);
      setMoneySpentPerMonthPassenger(data.money_spent_per_month_passenger);
      setDriverMean(data.driver_mean);
      setPassengerMean(data.passenger_mean);
      setTotalCO2SavedInTrips(data.total_co2_saved_in_trips);
      setCO2SavingsPerMonth(data.co2_savings_per_month);

      // console.log(co2SavingsPerMonth.map((item) => item.co2_savings));
      // console.log(filledDataTripsDriver.map(item => item.trip_count));
      // console.log(filledDataMoneyDriver.map(item => parseInt(item.money_earned, 10)));

      setLoading(false); // Set loading to false once the data is fetched
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false); // Set loading to false even in case of an error
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to fill in missing months with '0' CO2 savings
  const fillMissingMonths = (data) => {
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    // Check if data is null or undefined
    if (!data) {
      return [];
    }

    // Create an object with month names as keys and co2_savings as values
    const monthData = Object.fromEntries(data.map(item => [item.month_name_es.toLowerCase(), item.co2_savings]));

    // Fill in missing months with '0'
    const filledData = months.map(month => ({
      month_name_es: month,
      co2_savings: monthData[month] || 0,
    }));

    return filledData;
  };

  // Function to fill in missing months with '0' TRIPS
  const fillMissingMonthsTrips = (data) => {
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    // Check if data is null or undefined
    if (!data) {
      return [];
    }

    // Create an object with month names as keys and trips_conunts as values
    const monthData = Object.fromEntries(data.map(item => [item.month_name_es.toLowerCase(), item.trip_count]));

    // Fill in missing months with '0'
    const filledData = months.map(month => ({
      month_name_es: month,
      trip_count: monthData[month] || 0,
    }));

    return filledData;
  };

  // Function to fill in missing months with '0' MONEY DRIVER
  const fillMissingMonthsMoneyDriver = (data) => {
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    // Check if data is null or undefined
    if (!data) {
      return [];
    }

    // Create an object with month names as keys and trips_conunts as values
    const monthData = Object.fromEntries(data.map(item => [item.month_name_es.toLowerCase(), item.money_earned]));

    // Fill in missing months with '0'
    const filledData = months.map(month => ({
      month_name_es: month,
      money_earned: monthData[month] || 0,
    }));

    return filledData;
  };

  // Function to fill in missing months with '0' MONEY PASSENGER
  const fillMissingMonthsMoneyPassenger = (data) => {
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    // Check if data is null or undefined
    if (!data) {
      return [];
    }

    // Create an object with month names as keys and trips_conunts as values
    const monthData = Object.fromEntries(data.map(item => [item.month_name_es.toLowerCase(), item.money_spent]));

    // Fill in missing months with '0'
    const filledData = months.map(month => ({
      month_name_es: month,
      money_spent: monthData[month] || 0,
    }));

    return filledData;
  };

  const filledData = fillMissingMonths(co2SavingsPerMonth);
  const filledDataTripsDriver = fillMissingMonthsTrips(tripsPerMonthAsDriver);
  const filledDataTripsPassenger = fillMissingMonthsTrips(tripsPerMonthAsPassenger);
  const filledDataMoneyDriver = fillMissingMonthsMoneyDriver(moneyEarnedPerMonthDriver);
  const filledDataMoneyPassenger = fillMissingMonthsMoneyPassenger(moneySpentPerMonthPassenger);

  const optionsDriver = {
    chart: {
      height: 350,
      type: "line",
    },
    stroke: {
      width: [0, 4],
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
    },
    xaxis: {
      categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    },
    yaxis: [
      {
        title: {
          text: "Cantidad de viajes",
        },
      },
      {
        opposite: true,
        title: {
          text: "Dinero obtenido",
        },
      },
    ],
  };

  const seriesDriver = [
    {
      name: "Cantidad de viajes",
      type: "column",
      data: filledDataTripsDriver.map(item => item.trip_count),
    },
    {
      name: "Dinero obtenido",
      type: "line",
      data: filledDataMoneyDriver.map(item => parseInt(item.money_earned, 10)),
    },
  ];

  const optionsPassenger = {
    chart: {
      height: 350,
      type: "line",
    },
    stroke: {
      width: [0, 4],
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
    },
    xaxis: {
      categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    },
    yaxis: [
      {
        title: {
          text: "Cantidad de viajes",
        },
      },
      {
        opposite: true,
        title: {
          text: "Dinero invertido",
        },
      },
    ],
  };

  const seriesPassenger = [
    {
      name: "Cantidad de viajes",
      type: "column",
      data: filledDataTripsPassenger.map(item => item.trip_count),
    },
    {
      name: "Dinero invertido",
      type: "line",
      data: filledDataMoneyPassenger.map(item => parseInt(item.money_spent, 10)),
    },
  ];

  // ######################################### RETURN ######################################### //

  if (loading) {
    // While data is being fetched, show Skeleton components
    return (
      <Stack spacing={1.5} alignItems={'center'}>

        <Skeleton variant="text" sx={{ fontSize: '4rem' }} width='90%' />
        <Skeleton variant="text" sx={{ fontSize: '4rem' }} width='90%' />
        <Skeleton variant="rounded" width='90%' height={150} />
        <Skeleton variant="rounded" width='90%' height={150} />
        <Skeleton variant="rounded" width='90%' height={300} />
      </Stack>
    );
  }

  return (
    <>
      <br />
      <Title headingLevel={1}>
        Mis Estadísticas
      </Title>
      <br />

      {/* Driver Section */}
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="passenger-section-content"
          id="passenger-section-header"
        >
          <Typography>Gráficos como conductor</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Item>
                  <TextTitle>
                    Kg de CO2 ahorrado gracias a mis viajes
                  </TextTitle>
                  <br />
                  <br />
                  <TheVoice>
                    <AnimatedNumber
                      value={totalCO2SavedInTrips}
                      formatValue={formatValue}
                      duration={2000}
                    />
                  </TheVoice>
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  <TextTitle>
                    Dinero total ganado como conductor (UYU)
                  </TextTitle>
                  <br />
                  <br />
                  <TheVoice>
                    <AnimatedNumber
                      value={totalMoneyDriver}
                      formatValue={formatValue}
                      duration={2000}
                    />
                  </TheVoice>
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  <TextTitle>
                    Media de precios como conductor (UYU)
                  </TextTitle>
                  <br />
                  <br />
                  <TheVoice>
                    <AnimatedNumber
                      value={driverMean}
                      formatValue={formatValue}
                      duration={2000}
                    />
                  </TheVoice>
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  <TextTitle>
                    Kg de CO2 ahorrado por mes
                  </TextTitle>
                  <br />
                  <br />
                  <CChartBar
                    data={{
                      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                      datasets: [
                        {
                          label: 'Kg de CO2',
                          backgroundColor: '#09bc8a',
                          data: filledData.map(item => item.co2_savings),
                        },
                      ],
                    }}
                    labels="months"
                  />
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  <TextTitle>
                    Cantidad de viajes por mes y dinero obtenida (UYU)
                  </TextTitle>
                  <br />
                  <br />
                  <ReactApexChart
                    options={optionsDriver}
                    series={seriesDriver}
                    type='line'
                    height={350}
                  />
                </Item>
              </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Passenger Section Accordion */}
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="general-section-content"
          id="general-section-header"
        >
          <Typography>Gráficos como pasajero</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Item>
                  <TextTitle>
                    Dinero ahorrado (UYU)
                  </TextTitle>
                  <br />
                  <br />
                  <TheVoice>
                    <AnimatedNumber
                      value={totalMoneyPassenger}
                      formatValue={formatValue}
                      duration={2000}
                    />
                  </TheVoice>
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  <TextTitle>
                    Media de precios como pasajero (UYU)
                  </TextTitle>
                  <br />
                  <br />
                  <TheVoice>
                    <AnimatedNumber
                      value={passengerMean}
                      formatValue={formatValue}
                      duration={2000}
                    />
                  </TheVoice>
                </Item>
              </Grid>
              <Grid item xs={12}>
                <Item>
                  <TextTitle>
                    Cantidad de viajes como pasajero y dinero invertido por mes (UYU)
                  </TextTitle>
                  <br />
                  <br />
                  <ReactApexChart
                    options={optionsPassenger}
                    series={seriesPassenger}
                    type='line'
                    height={350}
                  />
                </Item>
              </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* General Section */}
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="driver-section-content"
          id="driver-section-header"
        >
          <Typography>Gráficos comparativos</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Item>
                  <TextTitle>
                    Distancia total recorrida (Conductor y Pasajero) en KM
                  </TextTitle>
                  <br />
                  <br />
                  <CChartDoughnut
                    data={{
                      labels: ['Conductor', 'Pasajero'],
                      datasets: [
                        {
                          backgroundColor: ['#09bc8a', '#00D8FF'],
                          data: [totalDistanceAsDriver, totalDistanceAsPassenger],
                        },
                      ],
                    }}
                  />
                </Item>
              </Grid>
              <Grid item xs={3}>
                <Item>
                  <TextTitle>
                    Número total de viajes (Conductor y Pasajero)
                  </TextTitle>
                  <br />
                  <br />
                  <CChartPie
                    data={{
                      labels: ['Conductor', 'Pasajero'],
                      datasets: [
                        {
                          data: [numberOfTripsAsDriver, numberOfTripsAsPassenger],
                          backgroundColor: ['#09bc8a', '#00D8FF'],
                          hoverBackgroundColor: ['#09bc8a', '#00D8FF'],
                        },
                      ],
                    }}
                  />
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  <TextTitle>
                    Número de viajes por mes (Conductor y Pasajero)
                  </TextTitle>
                  <br />
                  <br />
                  <CChartLine
                    data={{
                      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                      datasets: [
                        {
                          label: 'Como Conductor',
                          backgroundColor: 'rgba(220, 220, 220, 0.2)',
                          borderColor: '#09bc8a',
                          pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                          pointBorderColor: '#fff',
                          data: filledDataTripsDriver.map(item => item.trip_count),
                        },
                        {
                          label: 'Como Pasajero',
                          backgroundColor: 'rgba(220, 220, 220, 0.2)',
                          borderColor: '#b6e6ef',
                          pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                          pointBorderColor: '#fff',
                          data: filledDataTripsPassenger.map(item => item.trip_count),
                        },
                      ],
                    }}
                  />
                </Item>
              </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
