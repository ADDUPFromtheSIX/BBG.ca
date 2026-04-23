import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "";

export const isSanityConfigured = Boolean(projectId && dataset);

export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2025-01-01",
      useCdn: false,
    })
  : null;

const builder = client ? imageUrlBuilder(client) : null;

export function urlFor(source: any) {
  return builder ? builder.image(source) : null;
}
