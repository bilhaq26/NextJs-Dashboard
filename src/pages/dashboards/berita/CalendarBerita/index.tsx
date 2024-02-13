// ** React Import
import { useEffect, useRef, useState } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import interactionPlugin from '@fullcalendar/interaction'

// ** Types
import { CalendarType } from 'src/types/apps/calendarTypes'

// ** Third Party Style Import
import 'bootstrap-icons/font/bootstrap-icons.css'
import axios from 'axios'

const blankEvent = {
  title: '',
  start: '',
  end: '',
  allDay: false,
  url: '',
  extendedProps: {
    calendar: '',
    guests: [],
    location: '',
    description: ''
  }
}

const CalendarBerita = ({data,store,dispatch,direction,updateEvent,calendarApi,calendarsColor,setCalendarApi,handleSelectEvent,handleLeftSidebarToggle,handleAddEventSidebarToggle,selectedPerangkatDaerah}) => {
  const [newData, setnewData] = useState([])
  const [loading, setLoading] = useState(true);

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    // Add opacity (alpha) to the color
    return `${color}80`; // 80 is the hex value for 50% opacity
  };
  
  
  // ** Refs
  const calendarRef = useRef()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await Promise.all(
          data.map(async (item) => {
            if (item.perangkat_daerah === selectedPerangkatDaerah || !selectedPerangkatDaerah) {
              const fullUrl = item.url + item.endpoint;
              const response = await axios.get(fullUrl, {
                headers: {
                  key: item.api_key
                }
              });
  
              const resData = response.data.data;
  
              return {
                name: item.perangkat_daerah,
                events: resData.map(itemData => ({
                  id: `${itemData.id}`,
                  thumbnail: itemData.thumbnail,
                  title: itemData.title,
                  content: itemData.content,
                  create: itemData.created_at,
                  date: itemData.published_at,
                  view: itemData.views,
                  allDay: true,
                  color: generateRandomColor(),
                  extendedProps: {
                    calendar: item.perangkat_daerah,
                    name: item.perangkat_daerah,
                    title: itemData.title,
                    published: itemData.published
                  }
                }))
              };
            }
            return null;
          })
        );
  
        setnewData(newData.filter(item => item !== null));
      } catch (error) {
        console.error('Error fetching data:', error);
        setnewData([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [data, selectedPerangkatDaerah]);
  
  useEffect(() => {
    if (calendarApi === null) {
      setCalendarApi(calendarRef.current?.getApi());
    }
  }, [calendarApi, setCalendarApi]);

  useEffect(() => {
    console.log('events:', store.events);
  }, [store.events]);

  if (store) {
    const calendarOptions = {
      events: newData.length ? newData.reduce((acc, item) => {
        if (Array.isArray(item.events)) {
          return [...acc, ...item.events];
        }
        return acc;
      }, []) : [],
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        start: 'sidebarToggle, prev, next, title',
        end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
      },
      views: {
        week: {
          titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
        }
      },
      editable: true,
      eventResizableFromStart: true,
      dragScroll: true,
      dayMaxEvents: 2,
      navLinks: true,

      eventClassNames({ event: calendarEvent }) {
        const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar];
        return [`bg-${colorName}`];
      },

      eventClick({ event: clickedEvent }) {
        dispatch(handleSelectEvent(clickedEvent));
        handleAddEventSidebarToggle();
      },

      customButtons: {
        sidebarToggle: {
          icon: 'bi bi-list',
          click() {
            handleLeftSidebarToggle();
          }
        }
      },

      dateClick(info) {
        const ev = { ...blankEvent };
        ev.start = info.date;
        ev.end = info.date;
        ev.allDay = true;
        dispatch(handleSelectEvent(ev));
        handleAddEventSidebarToggle();
      },

      eventDrop({ event: droppedEvent }) {
        dispatch(updateEvent(droppedEvent));
      },

      eventResize({ event: resizedEvent }) {
        dispatch(updateEvent(resizedEvent));
      },

      ref: calendarRef,
      direction
    };

    return <FullCalendar {...calendarOptions} />;
  } else {
    return null;
  }
};

export default CalendarBerita;