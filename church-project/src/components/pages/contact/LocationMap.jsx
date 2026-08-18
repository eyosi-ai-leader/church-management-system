// // src/components/pages/contact/LocationMap.jsx

// import {SectionContainer} from "@/components/shared/SectionContainer";

// export default function LocationMap({ data }) {
//   return (
//     <section className="py-16">
//       <SectionContainer>
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-slate-900">
//             {data.title}
//           </h2>
//         </div>

//         <div className="overflow-hidden rounded-3xl aspect-video shadow-sm">
//           <iframe
//             src={data.mapUrl}
//             title="Church Location"
//             className="w-full h-full"
//             loading="lazy"
//             allowFullScreen
//           />
//         </div>
//       </SectionContainer>
//     </section>
//   );
// }