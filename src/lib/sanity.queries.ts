import { client } from './sanity.client'

// Portfolio Projects
export interface Project {
  _id: string
  title: string
  slug: { current: string }
  url: string
  screenshot: {
    asset: {
      _ref: string
      _type: string
    }
    alt: string
  }
  screenshotPosition?: string
  description: string
  role: string[]
  tech: string[]
  company: string
  order: number
}

export async function getProjects(): Promise<Project[]> {
  const query = `*[_type == "project"] | order(order asc) {
    _id,
    title,
    slug,
    url,
    screenshot {
      asset,
      alt
    },
    screenshotPosition,
    description,
    role,
    tech,
    company,
    order
  }`

  return await client.fetch(query)
}

// Service Cards
export interface ServiceCard {
  _id: string
  title: string
  slug: { current: string }
  bulletPoints: string[]
  tagline: string
  order: number
}

export async function getServiceCards(): Promise<ServiceCard[]> {
  const query = `*[_type == "serviceCard"] | order(order asc) {
    _id,
    title,
    slug,
    bulletPoints,
    tagline,
    order
  }`

  return await client.fetch(query)
}

// Feature Cards
export interface FeatureCard {
  _id: string
  title?: string
  mainText: string
  italicText: string
  order: number
}

export async function getFeatureCards(): Promise<FeatureCard[]> {
  const query = `*[_type == "featureCard"] | order(order asc) {
    _id,
    title,
    mainText,
    italicText,
    order
  }`

  return await client.fetch(query)
}

// Page Content
export interface PageContent {
  _id: string
  page: string
  section: string
  heading?: string
  subheading?: string
  content?: any[]
}

export async function getPageContent(page: string, section: string): Promise<PageContent | null> {
  const query = `*[_type == "pageContent" && page == $page && section == $section][0] {
    _id,
    page,
    section,
    heading,
    subheading,
    content
  }`

  return await client.fetch(query, { page, section })
}

export async function getAllPageContent(page: string): Promise<PageContent[]> {
  const query = `*[_type == "pageContent" && page == $page] {
    _id,
    page,
    section,
    heading,
    subheading,
    content
  }`

  return await client.fetch(query, { page })
}