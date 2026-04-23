export const homepageQuery = `*[_type == "homepage"][0]{
  heroTitle,
  heroSubtitle,
  heroBackgroundImage,
  specialties[]{title,summary,items},
  processSteps[]{title,items}
}`;

export const testimonialsQuery = `*[_type == "testimonial"]|order(_createdAt desc){
  _id,
  quote,
  name,
  detail
}`;
