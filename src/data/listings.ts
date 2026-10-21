import bedsitterImage from "@/assets/listing-bedsitter.jpg";
import hostelImage from "@/assets/listing-hostel.jpg";
import apartmentImage from "@/assets/listing-apartment.jpg";
import studioImage from "@/assets/listing-studio.jpg";
import twinHostelImage from "@/assets/listing-twin-hostel.jpg";
import sharedImage from "@/assets/listing-shared.jpg";

export type SampleListing = {
  id?: string;
  title: string;
  location: string;
  category: string;
  price: string;
  deposit: string;
  image: string;
};

export const sampleListings: SampleListing[] = [
  {
    id: "bedsitter-juja",
    title: "Modern Bedsitter in Juja Town",
    location: "Near JKUAT",
    category: "Bedsitter",
    price: "KES 9,500",
    deposit: "Deposit: 1 month",
    image: bedsitterImage,
  },
  {
    id: "hostel-uon",
    title: "Secure Hostel Room, gendered wing",
    location: "Near University of Nairobi",
    category: "Hostel",
    price: "KES 7,200",
    deposit: "Shared facilities",
    image: hostelImage,
  },
  {
    id: "single-kahawa",
    title: "Spacious Single Room in Kahawa",
    location: "Near Kenyatta University",
    category: "Single room",
    price: "KES 8,000",
    deposit: "Deposit: KES 8,000",
    image: apartmentImage,
  },
  {
    id: "studio-madaraka",
    title: "Furnished Studio in Madaraka",
    location: "Near Strathmore University",
    category: "Studio",
    price: "KES 14,500",
    deposit: "Water included",
    image: studioImage,
  },
  {
    id: "twin-kesses",
    title: "Twin Hostel Room in Kesses",
    location: "Near Moi University",
    category: "Hostel",
    price: "KES 6,500",
    deposit: "Per student / month",
    image: twinHostelImage,
  },
  {
    id: "shared-njoro",
    title: "Shared Apartment in Njoro",
    location: "Near Egerton University",
    category: "Shared apartment",
    price: "KES 8,500",
    deposit: "Wi-Fi ready",
    image: sharedImage,
  },
];
