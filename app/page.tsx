import ExploreBtn from "@/components/ExploreBtn"
import EventCard from "@/components/EventCard"
import {events} from "@/lib/constants"
import { IEvent } from "@/database/event.model";
import { cacheLife } from "next/cache"; 

const BASE_URL=process.env.NEXT_PUBLIC_BASE_URL;
const page = async () => {
  'use cache';
  cacheLife('hours');
  const resp=await fetch(`${BASE_URL}/api/events`);
  const {events}=await resp.json();
  return (
    
    <section>
      <h1 className="text-center">The hub for every dev <br/> you cannot miss</h1>
      <p className="text-center mt-5">Hackathons, workshops, and events for developers by developers</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events && events.length>0 && events.map((event:IEvent)=>(
            <li key={event.title} className="list-none">
              <EventCard {...event}/>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default page;