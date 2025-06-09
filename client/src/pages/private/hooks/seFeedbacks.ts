import { useCallback, useState } from "react";

export interface Feedback {
  id: number;
  order_id: number;
  rating: number;
  feedback: string;
  created_at: string;
}

export function useFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_API_URL}v1/surveys`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!res.ok) throw new Error("Could not fetch feedback list!");
      const data = await res.json();
      if (Array.isArray(data.surveys)) {
        setFeedbacks(data.surveys);
      } else if (Array.isArray(data)) {
        setFeedbacks(data);
      } else if (Array.isArray(data.data)) {
        setFeedbacks(data.data);
      } else {
        setFeedbacks([]);
        setError("Unexpected API response format.");
      }
    } catch (e: any) {
      setError(e.message || "Failed to load feedback list.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { feedbacks, loading, error, fetchFeedbacks, setFeedbacks };
}
