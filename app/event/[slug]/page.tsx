import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import { getSimilarEvents } from "@/lib/actions/event.actions";
import { IEvent } from "@/database";
import EventCard from "@/components/EventCard";


const EventDetailsItem=({icon,alt,label}:{icon:string,alt:string,label:string}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17}/>
    <p>{label}</p>
  </div>
)

const EventAgenda=({agenda}:{agenda:string[]}) => (
  <div className="Agenda">
    <h2>Agenda</h2>
    <ul>
      {agenda.map((item,index)=>(
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
)

const Eventtags=({tags}:{tags:string[]})=>(
  <div className="flex flex-col-gap-1.5 flex-wrap">
    {tags.map((tag,index)=>(
      <div key={index} className="pill">{tag}</div>
    ))}
  </div>
)

const EventDetailsPage = async ({params}:{params: Promise<{slug:string}>}) => {
    const {slug}=await params;

    const BASE_URL=process.env.NEXT_PUBLIC_BASE_URL;
    const resp=await fetch(`${BASE_URL}/api/events/${slug}`);
    const {event:{description,image,title,venue,location,date,time,mode,audience,agenda,organizer,tags,overview}}=await resp.json();

    if(!description) return notFound();

    const bookings=0;

    const similarEvents=await getSimilarEvents(slug);

  return (
    <main>
      <section id="event">
        <div className="header">
          <h1>Event Details</h1>
          <p className="mt-2">{description}</p>
        </div>
        <div className="details">
          {/* Left side */}
          <div className="content">
            <Image src={image} alt={title} width={800} height={800} className="banner"/>
            <section className="flex-col-gap-2">
              <h2>Overview</h2>
              <p>{overview}</p>
            </section>
            <section className="flex-col-gap-2">
              <h2>Event Details</h2>
              <EventDetailsItem icon="/icons/calendar.svg" alt="calendar" label={date}/>
              <EventDetailsItem icon="/icons/clock.svg" alt="clock" label={time}/>
              <EventDetailsItem icon="/icons/pin.svg" alt="pin" label={location}/>
              <EventDetailsItem icon="/icons/mode.svg" alt="mode" label={mode}/>
              <EventDetailsItem icon="/icons/audience.svg" alt="audience" label={audience}/>
            </section>

            <EventAgenda agenda={agenda[0]}/>

            <section className="flex-col-gap-2">
              <h2>About the Organizer</h2>
              <p>{organizer}</p>
            </section>

            <Eventtags tags={tags[0]}/>
          </div>
          {/* Right side */}
          <aside className="booking">
            <div className="signup-card">
              <h2>Book your Spot</h2>
              {bookings > 0 ? (
                <p className="text-sm">
                  Join {bookings} people already booked this event!
                </p>
              ):(
                <p className="text-sm">Be the first to book this event!</p>
              )}

              <BookEvent />
            </div>
          </aside>
        </div>
        
        <div className="flex w-full flex-col  gap-4 pt-20">
            <h2>Similar Events</h2>
            <div className="events">
              {similarEvents.length>0 && similarEvents.map((similarEvent:IEvent)=>(
                <EventCard key={similarEvent.title} {...similarEvent}/>
              ))}
            </div>
        </div>
      </section>
    </main>
  )
}

export default EventDetailsPage