import ServiceTimeCard from "./ServiceTimeCard";
import serviceTimes from "@/data/serviceTimes";


// export default function ServiceTimesGrid(){

// return (

// <div
// className="
// grid
// grid-cols-1
// gap-8
// md:grid-cols-2
// xl:grid-cols-3
// "
// >

// {
// serviceTimes.map((service)=>(

// <ServiceTimeCard

// key={service.id}

// service={service}

// />

// ))
// }

// </div>


// )

// }     

export default function ServiceTimesGrid({ services }) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
      {services.map((service) => (
        <ServiceTimeCard
          key={service.id}
          service={service}
        />
      ))}
    </div>
  );
}