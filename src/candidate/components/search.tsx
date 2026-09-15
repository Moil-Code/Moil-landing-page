"use client";

import { useState } from "react";
import Autocomplete from "react-google-autocomplete";
import { ArrowRight, Briefcase, MapPin, Search } from "lucide-react";
import styles from "./landing/landing.module.css";

export default function SearchComponent({ lgQuery }: { lgQuery?: string }) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const spanish = lgQuery === "es";

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams({
      title: title.trim(),
      location: location.trim(),
      page: "1",
    });
    if (lgQuery) params.set("lg", lgQuery);
    window.open(`/candidate/searchjob?${params.toString()}`, "_self");
  };

  return (
    <form className={styles.jobSearch} onSubmit={handleSearch}>
      <div className={styles.searchLead}>
        <span className={styles.searchLeadIcon} aria-hidden="true">
          <Search size={18} />
        </span>
        <span className={styles.searchLeadCopy}>
          <span className={styles.searchKicker}>
            {spanish ? "BÚSQUEDA DE EMPLEO" : "JOB SEARCH"}
          </span>
          <strong>
            {spanish ? "Encuentra trabajo cerca de ti" : "Find work near you"}
          </strong>
        </span>
      </div>

      <label className={styles.searchField}>
        <span className={styles.searchIcon} aria-hidden="true">
          <Briefcase size={18} />
        </span>
        <span>
          {spanish ? "Puesto o habilidad" : "Role or skill"}
          <input
            type="search"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={spanish ? "Carpintero, pintor, plomero" : "Carpenter, painter, plumber"}
            aria-label={spanish ? "Puesto o habilidad" : "Role or skill"}
          />
        </span>
      </label>

      <label className={styles.searchField}>
        <span className={styles.searchIcon} aria-hidden="true">
          <MapPin size={18} />
        </span>
        <span>
          {spanish ? "Ubicación" : "Location"}
          <Autocomplete
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY_1}
            className={styles.searchInput}
            onPlaceSelected={(place) =>
              setLocation(place.formatted_address || "")
            }
            onChange={(event) =>
              setLocation((event.target as HTMLInputElement).value)
            }
            placeholder={spanish ? "Ciudad o código postal" : "City or ZIP code"}
            aria-label={spanish ? "Ubicación" : "Location"}
          />
        </span>
      </label>

      <button type="submit" className={styles.searchButton}>
        {spanish ? "Buscar empleos" : "Search jobs"}
        <span aria-hidden="true">
          <ArrowRight size={17} />
        </span>
      </button>
    </form>
  );
}
