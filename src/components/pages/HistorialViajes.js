import React, { useRef, useEffect, useCallback, useState } from 'react';
import axios from "axios";
import { URLS } from "../../utils/urls";
import { CardsStackSection } from '@rodrisu/friendly-ui/build/layout/section/cardsStackSection';
import { sliceIntoChunks } from '../Utilities';
import { TripCard } from '@rodrisu/friendly-ui/build/tripCard';
import { Address, Itinerary } from '@rodrisu/friendly-ui/build/itinerary';
import { Button } from '@rodrisu/friendly-ui/build/button';
import { toast } from "react-toastify";
import { getToken, getUser } from "../service/AuthService";
import './HistorialViajes.css'
import { TabsSection } from '@rodrisu/friendly-ui/build/layout/section/tabsSection'
import { ItemAction } from '@rodrisu/friendly-ui/build/itemAction'
import { TabStatus } from '@rodrisu/friendly-ui/build/tabs'
import { BaseSection } from '@rodrisu/friendly-ui/build/layout/section/baseSection'
import TextItem from "../TextItem";
import ModalTravelInfo from '../ModalTravelInfo';
import { Title } from '@rodrisu/friendly-ui/build/title'

const HistorialViajes = () => {

  const [prevViajes, setPrevViajes] = React.useState([]);
  const [pageNumber, setPageNumber] = React.useState(0);
  const [cardsNumber, setCardsNumber] = React.useState(5);
  const [visible, setVisible] = React.useState(false);  
  const observer = useRef();

  const [prevViajesDriver, setPrevViajesDriver] = React.useState([]);
  const [pageNumberDriver, setPageNumberDriver] = React.useState(0);
  const [cardsNumberDriver, setCardsNumberDriver] = React.useState(5);
  const [visibleDriver, setVisibleDriver] = React.useState(false);  
  const observerDriver = useRef();

  const [prevViajesPassenger, setPrevViajesPassenger] = React.useState([]);
  const [pageNumberPassenger, setPageNumberPassenger] = React.useState(0);
  const [cardsNumberPassenger, setCardsNumberPassenger] = React.useState(5);
  const [visiblePassenger, setVisiblePassenger] = React.useState(false);  
  const observerPassenger = useRef();

  const [showModalInfo, setShowModalInfo] = useState(false);
  const email = getUser()
  const [driver, setDriverData] = useState([]);
  const [passenger, setPassengerData] = useState([]);
  const [total, setTotalData] = useState([]);
  const [modal, setModal] = useState(false);
  const [dataToModal, setDataToModal] = useState({});

  const requestConfig = {
    headers: {
        Authorization: JSON.parse(getToken()),
        "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    fetchHistory()
  }, []);

  async function fetchHistory() {
    const viajesGetEndPoint =
      URLS.USER_HISTORY + "/" +
      email +
      "/trips/histories"

    toast.promise(axios.get(viajesGetEndPoint, requestConfig)
      .then((response) => {
        setDriverData(response.data.DRIVER)
        setPassengerData(response.data.PASSENGER)
        // Ordena los viajes de mas reciente a mas antiguo
        setTotalData([...response.data.DRIVER ,...response.data.PASSENGER].sort((a, b) => new Date(...a.tripDate.split('-').reverse()) - new Date(...b.tripDate.split('-').reverse())))
      }).catch((error) => {
        console.error(error);
      })
      ,
      {
        pending: {
          render() {
            return "Cargando"
          },
          icon: true,
        },
        error: {
          render({ data }) {
            toast.error(data.response.data.message);
          }
        }
      });
  }

  const lastCardElementAll = useCallback(node => {
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && ([... new Set([...prevViajes, ...sliceIntoChunks(total, 5)[pageNumber]])]).length < total.length) {
        setPrevViajes([... new Set([...prevViajes, ...sliceIntoChunks(total, 5)[pageNumber]])])
        setPageNumber(pageNumber + 1)
        setCardsNumber(cardsNumber + 5)
      } else {
        setVisible(true)
      }
    })
    if (node) observer.current.observe(node)
  })

  const lastCardElementDriver = useCallback(node => {
    if (observerDriver.current) observerDriver.current.disconnect()
    observerDriver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && ([... new Set([...prevViajesDriver, ...sliceIntoChunks(driver, 5)[pageNumberDriver]])]).length < driver.length) {
        setPrevViajesDriver([... new Set([...prevViajesDriver, ...sliceIntoChunks(driver, 5)[pageNumberDriver]])])
        setPageNumberDriver(pageNumberDriver + 1)
        setCardsNumberDriver(cardsNumberDriver + 5)
      } else {
        setVisibleDriver(true)
      }
    })
    if (node) observerDriver.current.observe(node)
  })

  const lastCardElementPassenger = useCallback(node => {
    if (observerPassenger.current) observerPassenger.current.disconnect()
    observerPassenger.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && ([... new Set([...prevViajesPassenger, ...sliceIntoChunks(passenger, 5)[pageNumberPassenger]])]).length < passenger.length) {
        setPrevViajesPassenger([... new Set([...prevViajesPassenger, ...sliceIntoChunks(passenger, 5)[pageNumberPassenger]])])
        setPageNumberPassenger(pageNumberPassenger + 1)
        setCardsNumberPassenger(cardsNumberPassenger + 5)
      } else {
        setVisiblePassenger(true)
      }
    })
    if (node) observerPassenger.current.observe(node)
  })

  const handleClose = () => {
    setShowModalInfo(false);
  };

  function handleTravelInfo(user) {
    setDataToModal(user)
    setShowModalInfo(true)
  }

  return (
    <div className="wrapper">
            <br />
      <Title headingLevel={1}>
        Historial de Viajes
      </Title>
      <br />
    <TabsSection tabsProps={{
      activeTabId: 'tab1',
      status: TabStatus.FIXED,
      tabs: [
        {
          id: 'tab1',
          label: 'Todos',
          panelContent: (
            <div className="wrapper">
            <CardsStackSection>
            {(total) &&
              ((((sliceIntoChunks(total, 5)[pageNumber]) !== undefined) ? [... new Set([...prevViajes, ...sliceIntoChunks(total, 5)[pageNumber]])] : []))
                .map((user, index) => (
                  ([... new Set([...prevViajes, ...sliceIntoChunks(total, 5)[pageNumber]])].length === index + 1) ? (
                    <div ref={lastCardElementAll}>
                      <TripCard
                        href={'#'}
                        itinerary={
                          <Itinerary>
                            <Address label={user.origin}  />
                            <Address label={user.destination}  />
                          </Itinerary>
                        }
                        price={`$ ${user.price}`}
                        originalPrice={{}}
                        mainTitle={user.tripDate}
                        button={
                            <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
                              <li style={{ marginRight: '10px' }}>
                                <Button onClick={() => handleTravelInfo(user)}> Información del viaje </Button>
                              </li>
                            </ul>
                        }
                      />
                    </div>
                  ) : (
                    <div>
                      <TripCard
                        href={'#'}
                        itinerary={
                          <Itinerary>
                            <Address label={user.origin} subLabel={user.duration} />
                            <Address label={user.destination} subLabel={user.distance} />
                          </Itinerary>
                        }
                        price={`$ ${user.price}`}
                        originalPrice={{
                          label: 'availablePlaces',
                          value: `${user.passengersQuantity} pasajero(s)`,
                        }}
                        mainTitle={user.tripDate}
                        button={                             
                        <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
                          <li style={{ marginRight: '10px' }}>
                            <Button onClick={() => handleTravelInfo(user)}> Información del viaje </Button>
                          </li>
                        </ul> 
                      }
                      />
                    </div>
                  )
                ))
            }
          </CardsStackSection>
          <div style={{"textAlign": "center"}}>
            <div className="load-more-message-container">
              {visible && <><br /><br /><br /><br /> <TextItem text="No hay más viajes para mostrar" /></>}
            </div>
          </div>
          </div>
          ),
          badgeContent: '',
        },
        {
          id: 'tab2',
          label: 'Conductor',
          panelContent: (
            <div className="wrapper">
            <CardsStackSection>
            {(driver) &&
              ((((sliceIntoChunks(driver, 5)[pageNumberDriver]) !== undefined) ? [... new Set([...prevViajesDriver, ...sliceIntoChunks(driver, 5)[pageNumberDriver]])] : []))
                .map((user, index) => (
                  ([... new Set([...prevViajesDriver, ...sliceIntoChunks(driver, 5)[pageNumberDriver]])].length === index + 1) ? (
                    <div ref={lastCardElementDriver}>
                      <TripCard
                        href={'#'}
                        itinerary={
                          <Itinerary>
                            <Address label={user.origin}  />
                            <Address label={user.destination}  />
                          </Itinerary>
                        }
                        price={`$ ${user.price}`}
                        originalPrice={{}}
                        mainTitle={user.tripDate}
                        button={
                            <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
                              <li style={{ marginRight: '10px' }}>
                                <Button onClick={() => handleTravelInfo(user)}> Información del viaje </Button>
                              </li>
                            </ul>
                        }
                      />
                    </div>
                  ) : (
                    <div>
                      <TripCard
                        href={'#'}
                        itinerary={
                          <Itinerary>
                            <Address label={user.origin} subLabel={user.duration} />
                            <Address label={user.destination} subLabel={user.distance} />
                          </Itinerary>
                        }
                        price={`$ ${user.price}`}
                        originalPrice={{
                          label: 'availablePlaces',
                          value: `${user.passengersQuantity} pasajero(s)`,
                        }}
                        mainTitle={user.tripDate}
                        button={ 
                          <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
                            <li style={{ marginRight: '10px' }}>
                              <Button onClick={() => handleTravelInfo(user)}> Información del viaje </Button>
                            </li>
                          </ul>
                        }
                      />
                    </div>
                  )
                ))
            }
          </CardsStackSection>
          <div style={{"textAlign": "center"}}>
            <div className="load-more-message-container">
              {visible && <><br /><br /><br /><br /> <TextItem text="No hay más viajes para mostrar" /></>}
            </div>
          </div>
          </div>
          ),
          badgeContent: '',
        },
        {
          id: 'tab3',
          label: 'Pasajero',
          panelContent: (
            <div className="wrapper">
            <CardsStackSection>
            {(passenger) &&
              ((((sliceIntoChunks(passenger, 5)[pageNumberPassenger]) !== undefined) ? [... new Set([...prevViajesPassenger, ...sliceIntoChunks(passenger, 5)[pageNumberPassenger]])] : []))
                .map((user, index) => (
                  ([... new Set([...prevViajesPassenger, ...sliceIntoChunks(passenger, 5)[pageNumberPassenger]])].length === index + 1) ? (
                    <div ref={lastCardElementPassenger}>
                      <TripCard
                        href={'#'}
                        itinerary={
                          <Itinerary>
                            <Address label={user.origin}  />
                            <Address label={user.destination}  />
                          </Itinerary>
                        }
                        price={`$ ${user.price}`}
                        originalPrice={{}}
                        mainTitle={user.tripDate}
                        button={
                            <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
                              <li style={{ marginRight: '10px' }}>
                                <Button onClick={() => handleTravelInfo(user)}> Información del viaje </Button>
                              </li>
                            </ul>
                        }
                      />
                    </div>
                  ) : (
                    <div>
                      <TripCard
                        href={'#'}
                        itinerary={
                          <Itinerary>
                            <Address label={user.origin} subLabel={user.duration} />
                            <Address label={user.destination} subLabel={user.distance} />
                          </Itinerary>
                        }
                        price={`$ ${user.price}`}
                        originalPrice={{
                          label: 'availablePlaces',
                          value: `${user.passengersQuantity} pasajero(s)`,
                        }}
                        mainTitle={user.tripDate}
                        button={ 
                          <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
                            <li style={{ marginRight: '10px' }}>
                              <Button onClick={() => handleTravelInfo(user)}> Información del viaje </Button>
                            </li>
                          </ul>
                        }
                      />
                    </div>
                  )
                ))
            }
          </CardsStackSection>
          <div style={{"textAlign": "center"}}>
            <div className="load-more-message-container">
              {visible && <><br /><br /><br /><br /> <TextItem text="No hay más viajes para mostrar" /></>}
            </div>
          </div>
          </div>
          ),
          badgeContent: '',
        },
      ],
    }}
    />
    {(showModalInfo === true) ? <ModalTravelInfo setModal={setModal} handlePrevModalClose={handleClose} data={dataToModal} /> : <></>}
  </div>
  );
};

export default HistorialViajes;
