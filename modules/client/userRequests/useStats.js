import { useState, useEffect } from "react";

export default function useStats(userId) {
  const [stats, setStats] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const getStats = async () => {
    try {
      const url = `${baseUrl}/api/stats?user=${userId}`;
      const response = await fetch(
        url,
        { method: "GET" },
        { next: { revalidate: 10 } }
      );
      if (response) {
        const stats = await response.json();
        setStats(stats);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getStats();
  }, [userId]);

  return {
    stats,
  };
}
