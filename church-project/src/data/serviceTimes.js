const serviceTimes = [
 {
  id: 1,
  title: "Sunday Worship Experience",
  day: "Sunday",
  time: "9:00 AM",
  location: "Main Sanctuary",

  featured: true,

  livestream: true,

  nextServiceDate: "2026-07-26T09:00:00",

  liveUrl:
    "https://www.youtube.com/watch?v=WtYUG2KB93Q",

  previousSermonsUrl:
    "https://youtu.be/cDchqixWKU8?si=kj0jRjIYjlH6gcrE",

  map:
    "https://maps.google.com",
},

  {
    id: 2,
    title: "Bible Study",
    day: "Tuesday",
    time: "6:30 PM",
    location: "Fellowship Hall",

    featured: false,

    livestream: false,

    map: "https://maps.google.com",

    liveUrl: null,

    previousSermonsUrl: null,
  },

  {
    id: 3,
    title: "Prayer Meeting",
    day: "Wednesday",
    time: "7:00 PM",
    location: "Prayer Chapel",

    featured: false,

    livestream: true,

    map: "https://maps.google.com",

    liveUrl: "https://www.youtube.com/watch?v=WtYUG2KB93Q",

    previousSermonsUrl:
      "https://youtu.be/cDchqixWKU8?si=RRD60kSz-2FUYLQ3",
  },

  {
    id: 4,
    title: "Youth Fellowship",
    day: "Friday",
    time: "6:00 PM",
    location: "Youth Center",

    featured: false,

    livestream: false,

    map: "https://maps.google.com",

    liveUrl: null,

    previousSermonsUrl: null,
  },

  {
    id: 5,
    title: "Choir Practice",
    day: "Saturday",
    time: "4:00 PM",
    location: "Music Hall",

    featured: false,

    livestream: false,

    map: "https://maps.google.com",

    liveUrl: null,

    previousSermonsUrl: null,
  },
];

export default serviceTimes;