import React, { useRef, useEffect, useCallback, useState } from 'react';
import axios from "axios";
import { URLS } from "./utils/urls";
import { CardsStackSection } from '@rodrisu/friendly-ui/build/layout/section/cardsStackSection';
import { sliceIntoChunks } from './components/Utilities';
import { TripCard } from '@rodrisu/friendly-ui/build/tripCard';
import { Address, Itinerary } from '@rodrisu/friendly-ui/build/itinerary';
import { Button } from '@rodrisu/friendly-ui/build/button';
import { toast } from "react-toastify";
import { getToken, getUser } from "./components/service/AuthService";
import './MisViajes.css'
import { TabsSection } from '@rodrisu/friendly-ui/build/layout/section/tabsSection'
import { ItemAction } from '@rodrisu/friendly-ui/build/itemAction'
import { TabStatus } from '@rodrisu/friendly-ui/build/tabs'
import { BaseSection } from '@rodrisu/friendly-ui/build/layout/section/baseSection'
// import { ItemAction } from '../../../itemAction'
// import { TabStatus } from '../../../tabs'
// import { BaseSection } from '../baseSection'

const MisViajes = () => {

  const [viajesSorted, setViajesSorted] = useState([]);
  const [prevViajes, setPrevViajes] = React.useState([]);
  const [pageNumber, setPageNumber] = React.useState(0);
  const [visible, setVisible] = React.useState(false);
  const [cardsNumber, setCardsNumber] = React.useState(5);
  const observer = useRef();

  const email = getUser()
  const [driver, setDriverData] = useState([]);
  const [passenger, setPassengerData] = useState([]);
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

  const lastCardElement = useCallback(node => {
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && ([... new Set([...prevViajes, ...sliceIntoChunks(driver, 5)[pageNumber]])]).length < driver.length) {
        setPrevViajes([... new Set([...prevViajes, ...sliceIntoChunks(driver, 5)[pageNumber]])])
        setPageNumber(pageNumber + 1)
        setCardsNumber(cardsNumber + 5)
      } else {
        setVisible(true)
      }
    })
    if (node) observer.current.observe(node)
  })

  return (
    <div>

    <TabsSection tabsProps={{
      activeTabId: 'tab1',
      status: TabStatus.FIXED,
      tabs: [
        {
          id: 'tab1',
          label: 'Tab 1',
          panelContent: (
            <BaseSection>Content for first tab</BaseSection>
          ),
          badgeContent: '',
        },
        {
          id: 'tab2',
          label: 'Very Very Long Tab 2',
          panelContent: (
            <BaseSection>
              <Button
                onClick={() => {
                  // eslint-disable-next-line no-console
                  console.log('onClickButton')
                }}
              >
                Button inside panel 2.
              </Button>
            </BaseSection>
          ),
          badgeContent: '2',
          badgeAriaLabel: 'Unread Message',
        },
        {
          id: 'tab3',
          label: 'Tab 3',
          panelContent: (
            <BaseSection noHorizontalSpacing>
              <ItemAction action="Hello" />
            </BaseSection>
          ),
          badgeContent: '',
        },
      ],
    }}
    />

    <div className="wrapper">
    <CardsStackSection>
    {(driver) &&
      ((((sliceIntoChunks(driver, 5)[pageNumber]) !== undefined) ? [... new Set([...prevViajes, ...sliceIntoChunks(driver, 5)[pageNumber]])] : []))
        .map((user, index) => (
          ([... new Set([...prevViajes, ...sliceIntoChunks(driver, 5)[pageNumber]])].length === index + 1) ? (
            <div ref={lastCardElement}>
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
                        <Button onClick={() => console.log(user)}> Información del viaje </Button>
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
                button={ (<br />) }
              />
            </div>
          )
        ))
    }
  </CardsStackSection>
  </div>
  </div>
  );
};

export default MisViajes;
