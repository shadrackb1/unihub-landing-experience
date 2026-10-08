import studentRoomsVideo from "@/assets/listing-video-student-rooms.mp4";
import studentRoomsPoster from "@/assets/listing-video-student-rooms-poster.jpg";
import femaleHostelVideo from "@/assets/listing-video-female-hostel.mp4";
import femaleHostelPoster from "@/assets/listing-video-female-hostel-poster.jpg";
import maisonVideo from "@/assets/listing-video-maison.mp4";
import maisonPoster from "@/assets/listing-video-maison-poster.jpg";

export type ResidenceClip = {
  id: string;
  title: string;
  meta: string;
  blurb: string;
  src: string;
  poster: string;
  ariaLabel: string;
};

export const residenceClips: ResidenceClip[] = [
  {
    id: "student-rooms",
    title: "Spacious student rooms",
    meta: "From KES 15,000",
    blurb: "Own kitchen and bathroom even when you share. Free gym and lounges for campus life.",
    src: studentRoomsVideo,
    poster: studentRoomsPoster,
    ariaLabel: "Spacious student rooms tour with kitchen bathroom and gym",
  },
  {
    id: "female-hostel",
    title: "Female hostel in Kigamboni",
    meta: "Student-focused",
    blurb:
      "Modern women's hostel near ferry routes. Built for students around IFM, CBE, TIA, UTUMISHI, and nearby colleges. Free Wi‑Fi.",
    src: femaleHostelVideo,
    poster: femaleHostelPoster,
    ariaLabel: "Luxury female hostel for students in Kigamboni",
  },
  {
    id: "maison",
    title: "Maison Bauchart suites",
    meta: "Premium stays",
    blurb: "Tailored suites for short stays above typical hostel budgets.",
    src: maisonVideo,
    poster: maisonPoster,
    ariaLabel: "Maison Bauchart tailored suites hospitality video",
  },
];
