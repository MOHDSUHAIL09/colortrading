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
  const [latestResult, setLatestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSeconds, setClientSeconds] = useState(0);

  const Regno = sessionStorage.getItem("Regno");

  const pollingRef = useRef(null);
  const clientSecondsRef = useRef(0);
  const isRefreshingRef = useRef(false);

  // ===================== DASHBOARD API =====================
  const fetchDashboard = useCallback(async (Regno) => {
    console.log("🚀 [API] fetchDashboard. Regno:", Regno);
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/Game/game-dashboard/${Regno}`);
      const data = response.data;

      if (data.result === "true" && data.response) {
        setDashboard(data.response);
        console.log("🎉 [Dashboard] gameId:", data.response.gameid);
        return data.response;
      } else {
        throw new Error("API returned result: false");
      }
    } catch (err) {
      console.error("❌ [Dashboard] Error:", err);
      setError(err.response?.data?.message || err.message);
      setDashboard(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ===================== GAME RESULTS API ✅ =====================
  const fetchGameResults = useCallback(
    async (pageIndex = 1, pageSize = 100) => {
      console.log("🚀 [API] fetchGameResults");

      try {
        const response = await apiClient.get(
          `/Game/game-result?PageIndex=${pageIndex}&PageSize=${pageSize}`
        );
        const data = response.data;

        if (data.success && data.data?.data) {
          const results = data.data.data;
          setGameResults(results);
          console.log("📦 [Results] count:", results.length);

          // ✅ Latest result format karo
          if (results.length > 0) {
            const latest = results[0];

            // Number → integer
            const num = Number(latest.betnumber);

            // Color → lowercase array
            const colorLower = (latest.betcolor || "red").toLowerCase();

            // BigSmall
            const bigSmall = latest.BigSmallName || "Small";

            setLatestResult({
              id: latest.id,
              period: latest.gameid,
              game: latest.game,
              number: num,
              color: latest.betcolor,               // "Red"
              colors: [colorLower],                 // ["red"]
              bigSmall: bigSmall,                   // "Small"
              edate: latest.edate,
              winBigSmall: latest.WinBigSmall,
            });

            console.log("🎯 [Latest Result]:", {
              period: latest.gameid,
              number: num,
              color: latest.betcolor,
              bigSmall: bigSmall,
            });
          }

          return {
            items: results,
            totalCount: data.data.totalCount,
            pageIndex: data.data.pageIndex,
          };
        }
      } catch (err) {
        console.error("❌ [GameResult] Error:", err);
        return null;
      }
    },
    []
  );

  // ===================== PLACE BET API =====================
  const placeBet = useCallback(
    async ({ gameId, gameName, regNo, amount, bet }) => {
      console.log("🎯 [Bet] Placing:", { gameId, gameName, regNo, amount, bet });

      try {
        const response = await apiClient.post(`/Game/place-bet`, {
          gameId,
          gameName,
          regNo,
          amount,
          bet,
        });

        const data = response.data;
        console.log("✅ [Bet] Response:", data);

        if (
          data.result === "true" ||
          data.success === true ||
          data.statusCode === 200
        ) {
          return { success: true, data };
        } else {
          throw new Error(data.message || "Bet placement failed");
        }
      } catch (err) {
        console.error("❌ [Bet] Error:", err);
        return {
          success: false,
          error:
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message,
        };
      }
    },
    []
  );

  // ===================== CLIENT SECONDS INIT =====================
  useEffect(() => {
    if (dashboard?.seconds !== undefined) {
      console.log("⏱️ [Timer] Init:", dashboard.seconds);
      setClientSeconds(dashboard.seconds);
      clientSecondsRef.current = dashboard.seconds;
    }
  }, [dashboard?.gameid, dashboard?.seconds]);

  // ===================== CLIENT SECONDS TICK =====================
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
  useEffect(() => {
    if (!Regno) return;

    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      if (clientSecondsRef.current <= 1 && !isRefreshingRef.current) {
        console.log("⏰ [Polling] Timer khatam");
        isRefreshingRef.current = true;

        const oldGameId = dashboard?.gameid;
        const newDash = await fetchDashboard(Regno);

        if (newDash && newDash.gameid !== oldGameId) {
          console.log("🆕 [Polling] New game:", newDash.gameid);
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
        latestResult,      // ✅ Expose
        clientSeconds,
        loading,
        error,
        Regno,
        fetchDashboard,
        fetchGameResults,
        placeBet,
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