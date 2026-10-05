// File: src/context/ColorContext.jsx

import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import apiClient from "../api/apiClient";

export const ColorContext = createContext();

export const ColorProvider = ({ children }) => {
  const [dashboard, setDashboard] = useState(null);
  const [gameResults, setGameResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Client-side countdown seconds
  const [clientSeconds, setClientSeconds] = useState(0);

  const Regno = sessionStorage.getItem("Regno");

  const pollingRef = useRef(null);
  const clientSecondsRef = useRef(0);
  const isRefreshingRef = useRef(false);   // ✅ Duplicate call rokne ke liye

  // ===================== DASHBOARD API =====================
  const fetchDashboard = useCallback(async (Regno) => {
    console.log("🚀 [API] fetchDashboard called. Regno:", Regno);
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/Game/game-dashboard/${Regno}`);
      const data = response.data;

      if (data.result === "true" && data.response) {
        setDashboard(data.response);
        console.log(
          "🎉 [API] Dashboard set. GameID:",
          data.response.gameid,
          "Seconds:",
          data.response.seconds
        );
        return data.response;
      } else {
        throw new Error("API returned result: false");
      }
    } catch (err) {
      console.error("❌ [Dashboard] Error:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Something went wrong";
      setError(msg);
      setDashboard(null);
      return null;
    } finally {
      setLoading(false);
      console.log("🏁 [Dashboard] finished");
    }
  }, []);

  // ===================== GAME RESULTS API =====================
  const fetchGameResults = useCallback(
    async (pageIndex = 1, pageSize = 100) => {
      console.log(
        "🚀 [API] fetchGameResults. page:",
        pageIndex,
        "size:",
        pageSize
      );

      try {
        const response = await apiClient.get(
          `/Game/game-result?PageIndex=${pageIndex}&PageSize=${pageSize}`
        );
        const data = response.data;

        if (data.success && data.data?.data) {
          setGameResults(data.data.data);
          console.log(
            "📦 [API] Game Results set:",
            data.data.data.length,
            "items"
          );
          return {
            items: data.data.data,
            totalCount: data.data.totalCount,
            pageIndex: data.data.pageIndex,
          };
        } else {
          throw new Error("Failed to fetch game results");
        }
      } catch (err) {
        console.error("❌ [GameResult] Error:", err);
        return null;
      }
    },
    []
  );

  // ===================== CLIENT SECONDS INIT =====================
  // Jab naya dashboard aaye, clientSeconds reset karo
  useEffect(() => {
    if (dashboard?.seconds !== undefined) {
      console.log("⏱️ [Timer] Init clientSeconds:", dashboard.seconds);
      setClientSeconds(dashboard.seconds);
      clientSecondsRef.current = dashboard.seconds;
    }
  }, [dashboard?.gameid, dashboard?.seconds]);

  // ===================== CLIENT SECONDS TICK =====================
  // Har second -1 karo
  useEffect(() => {
    const interval = setInterval(() => {
      setClientSeconds((prev) => {
        const next = prev > 0 ? prev - 1 : 0;
        clientSecondsRef.current = next;
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ===================== SMART POLLING =====================
  // Har second check: agar clientSeconds <= 1 ho, toh refresh
  useEffect(() => {
    if (!Regno) return;

    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      // ✅ Client-side seconds check karo
      if (clientSecondsRef.current <= 1 && !isRefreshingRef.current) {
        console.log("⏰ [Polling] Timer khatam — refreshing both APIs");
        isRefreshingRef.current = true;

        const oldGameId = dashboard?.gameid;
        const newDash = await fetchDashboard(Regno);

        if (newDash && newDash.gameid !== oldGameId) {
          console.log("🆕 [Polling] New game detected:", newDash.gameid);
          await fetchGameResults(1, 100);
        }

        isRefreshingRef.current = false;
      }
    }, 1000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [Regno, dashboard?.gameid, fetchDashboard, fetchGameResults]);

  // ===================== INITIAL FETCH =====================
  useEffect(() => {
    console.log("🔄 [Effect] Regno:", Regno);
    if (Regno) {
      fetchDashboard(Regno);
      fetchGameResults(1, 100);
    }
  }, [Regno, fetchDashboard, fetchGameResults]);

  return (
    <ColorContext.Provider
      value={{
        dashboard,
        gameResults,
        clientSeconds,   // ✅ Ye expose karo
        loading,
        error,
        Regno,
        fetchDashboard,
        fetchGameResults,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
};

export const useColor = () => {
  const ctx = useContext(ColorContext);
  if (!ctx) throw new Error("useColor must be used inside ColorProvider");
  return ctx;
};