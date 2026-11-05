const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function get(path) {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 60 },
    });

    if (response.status === 404) return { notFound: true };
    if (!response.ok) return { error: true };

    const json = await response.json();

    return { data: json.data };
  } catch {
    // The backend is unreachable. Pages show a calm message.
    return { error: true };
  }
}

export const getPublicEvents = ({ limit = 24 } = {}) =>
  get(`/public/events?limit=${limit}`);

export const getFeaturedEvent = () => get("/public/events/featured");

export const getEventBySlug = (slug) =>
  get(`/public/events/${encodeURIComponent(slug)}`);