import { notFound } from 'next/navigation';

// An unmatched /es/* URL answers 404 inside the Spanish root (lang="es"),
// as it did when one root layout served both languages.
export default function Missing() {
  notFound();
}
