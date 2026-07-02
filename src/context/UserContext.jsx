import { createContext, useState, useEffect, useContext, useCallback, useRef } from "react";
import apiClient from "../api/apiClient";

const UserContext = createContext();

export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [userData, setUserData] = useState(null);
  const [stakeData, setStakeData] = useState(null);
  const [payoutData, setPayoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // ✅ ADD THIS - isAuthenticated state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const regno = localStorage.getItem('Regno');
    return !!(regno);
  });
  
  const isFetching = useRef(false);
  const initialLoadDone = useRef(false);
  const isMounted = useRef(true);

  // ================= Dashboard Fetch =================
  const fetchData = useCallback(async (force = false) => {
    if (!isMounted.current) {
      console.log("⏭️ Component unmounted, skipping API call");
      return null;
    }

    if (!force && isFetching.current) {
      console.log("⏳ API call already in progress, skipping...");
      return null;
    }

    if (!force && userData && Object.keys(userData).length > 0) {
      console.log("✅ Data already loaded, skipping API call");
      return userData;
    }

    isFetching.current = true;
    
    if (force) {
      setIsRefreshing(true);
      console.log("🔄 Refresh started...");
    } else {
      setLoading(true);
      console.log("📥 Initial load started...");
    }
    
    try {
      let Regno = localStorage.getItem('regno');
      if (!Regno) {
        Regno = localStorage.getItem('Regno');
      }
      
      if (!Regno) {
        console.error("❌ No regno found in localStorage");
        if (force) {
          setIsRefreshing(false);
        } else {
          setLoading(false);
        }
        isFetching.current = false;
        setIsAuthenticated(false);
        return null;
      }
      
      const response = await apiClient.get(`/Dashboard/Dashboard/${Regno}`);     
      console.log("✅ Dashboard API Response received");
      
      if (!isMounted.current) {
        console.log("⏭️ Component unmounted during API call, ignoring response");
        return null;
      }
      
      if (response.data?.result === "true" && response.data?.response) {
        const apiData = response.data.response;
        
        const newUserData = {
          fname: apiData.fname,
          loginid: apiData.loginid || user?.loginid,
          MobileNo: apiData.mobile || user?.MobileNo,
          email: apiData.emailID || user?.email,
          kid: apiData.kid,
          Depositfund: apiData.TopupWallet || 0,
          Invest: apiData.InvestAmount || 0,
          WorkingWallet: apiData.WorkingWallet || 0,
          TotalIncome: apiData.TotalIncome || 0,
          withdrawal: apiData.withdrawal || 0,
          TeamCount: apiData.TeamCount || 0,
          ActiveTeam: apiData.ActiveTeam || 0,
          InactiveTeam: apiData.InactiveTeam || 0,
          DirectIncome: apiData.DirectIncome || 0,
          LevelIncome: apiData.LevelIncome || 0,
          miningRoi: apiData.miningRoi || 0,
          Reward: apiData.Reward || 0,
          AIBOTIncome: apiData.AIBOTIncome || 0,
          CompoundingIncome: apiData.CompoundingIncome || 0,
          SocialBonus: apiData.SocialBonus || 0,
          SelfTrade: apiData.SelfTrade || 0,
          Salary: apiData.Salary || 0,
          SponsorIncome: apiData.SponsorIncome || 0,
          inDirectIncome: apiData.inDirectIncome || 0,
          CompoundingFund: apiData.CompoundingFund || 0,
          Ranks: apiData.Ranks,
          firstTopupDate: apiData.firstTopupDate,
          capping: apiData.capping || 0,
          IdStatus: apiData.IdStatus,
          todayBusiness: apiData.todayBusiness || 0,
          status: apiData.status || 0,
          BonusBusiness: apiData.BonusBusiness || 0,
          Criteria: apiData.Criteria || 0,
          BonusStatus: apiData.BonusStatus,
          TourEndDate: apiData.TourEndDate,
          loginAttempt: apiData.loginAttempt || 0,
          OpenLevel: apiData.OpenLevel || 0,
          directId: apiData.directid || 0,
          regDate: apiData.regDate,
          totalbusiness: apiData.totalbusiness || 0,
          Green: apiData.Green,
          address: apiData.address,
          LockedPeriod: apiData.LockedPeriod || 0,
          introregno: apiData.introregno,
          topupdate: apiData.topupdate,
          AIBOTIncome_Today: apiData.AIBOTIncome_Today || 0,
          CompoundingIncome_Today: apiData.CompoundingIncome_Today || 0,
          LevelIncome_Today: apiData.LevelIncome_Today || 0,
          SocialBonus_Today: apiData.SocialBonus_Today || 0,
          SelfTrade_Today: apiData.SelfTrade_Today || 0,
          TodayIncome: apiData.TodayIncome || 0,
          introid: apiData.introid,
          strongLeg: apiData.strongLeg || 0,
          weakerLeg: apiData.weakerLeg || 0,
          leftCarry: apiData.leftCarry || 0,
          rightCarry: apiData.rightCarry || 0,
          LeftPerMonth: apiData.LeftPerMonth || 0,
          RightPerMonth: apiData.RightPerMonth || 0,
          LeftBusiness: apiData.LeftBusiness || 0,
          RightBusiness: apiData.RightBusiness || 0,
          IBIncome: apiData.IBIncome || 0,
          RoyaltyIncome: apiData.RoyaltyIncome || 0,
          GlobalRoyaltyIncome: apiData.GlobalRoyaltyIncome || 0,
          TradingPassiveIncome: apiData.TradingPassiveIncome || 0,
          CoinRate: apiData.CoinRate || 0,
          TotalAmountBuyToken: apiData.TotalAmountBuyToken || 0,
          TotalTokenInWallet: apiData.TotalTokenInWallet || 0,
          TokenStakeBonus: apiData.TokenStakeBonus,
          tokenBonusOnUpgrade: apiData.tokenBonusOnUpgrade,       
          walletid: apiData.walletid,
          TotalEarnTokenInWallet: apiData.TotalEarnTokenInWallet || 0,
          NameAppearOncheque: apiData.NameAppearOncheque,
          TokenAddress: apiData.tokenAddress || 0,
          TradingLevelIncome: apiData.TradingLevelIncome || 0
        };
      
        setUserData(newUserData);
        localStorage.setItem("userData", JSON.stringify(newUserData));
        console.log("✅ UserData updated - Depositfund:", newUserData.Depositfund);
        
        // ✅ SET isAuthenticated to TRUE
        setIsAuthenticated(true);
        
        return newUserData;
      } else {
        console.error("❌ Dashboard API error:", response.data);
        setIsAuthenticated(false);
        return null;
      }
    } catch (error) {
      console.error("❌ Dashboard Fetch Error:", error);
      setIsAuthenticated(false);
      return null;
    } finally {
      if (isMounted.current) {
        if (force) {
          setIsRefreshing(false);
          console.log("🔄 Refresh complete");
        } else {
          setLoading(false);
        }
        isFetching.current = false;
      }
    }
  }, [user?.loginid]);

  // ================= RESTORE SESSION ON MOUNT =================
  useEffect(() => {
    isMounted.current = true;
    
    // ✅ Check if already authenticated
    const regno = localStorage.getItem('Regno');
    if (regno) {
      setIsAuthenticated(true);
    }
    
    if (initialLoadDone.current) {
      console.log("⏭️ Initial load already done, skipping...");
      return;
    }

    if (userData && Object.keys(userData).length > 0) {
      console.log("✅ UserData already exists, skipping initial load");
      initialLoadDone.current = true;
      setLoading(false);
      setIsAuthenticated(true);
      return;
    }

    const restoreSession = async () => {
      if (initialLoadDone.current) {
        console.log("⏭️ Initial load already done (double check), skipping...");
        return;
      }
      
      console.log("🔄 Initial session restore started");
      initialLoadDone.current = true;
      
      const storedRegno = localStorage.getItem('Regno');
      const storedUser = localStorage.getItem('user');
      
      if (storedRegno && storedUser) {
        await fetchData();
      } else {
        console.log("ℹ️ No user found, setting loading to false");
        if (isMounted.current) {
          setLoading(false);
          setIsAuthenticated(false);
        }
      }
      
      if (storedUser && !user) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (e) {
          console.error("Error parsing stored user:", e);
        }
      }
    };
    
    const timer = setTimeout(() => {
      restoreSession();
    }, 50);
    
    return () => {
      clearTimeout(timer);
      isMounted.current = false;
      console.log("🧹 Cleanup: Component unmounting");
    };
  }, []);

  // ================= LOGIN =================
  const loginUser = useCallback((userData) => {
    console.log("🔐 Login called");
    
    initialLoadDone.current = true;
    isFetching.current = false;
    
    let regnoValue = userData.regno || userData.Regno || userData.regNo;
    
    if (!regnoValue && userData.introregno) {
      regnoValue = userData.introregno;
    }
    
    if (regnoValue) {
      console.log("✅ Setting regno:", regnoValue);
      localStorage.setItem("regno", String(regnoValue));
      localStorage.setItem("Regno", String(regnoValue));
    } else {
      console.error("❌ No regno found in userData:", userData);
    }
    
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
    
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("loginId", userData.loginid || userData.LoginID || userData.me);
    localStorage.setItem("isLoggedIn", "true");
    
    setUser(userData);
    
    // ✅ SET isAuthenticated to TRUE
    setIsAuthenticated(true);
    
    setTimeout(() => {
      console.log("⏰ Fetching data after login...");
      fetchData(true);
    }, 200);
  }, [fetchData]);

  // ================= LOGOUT =================
  const logoutUser = useCallback(() => {
    console.log("🚪 Logging out user");
    setUser(null);
    setUserData(null);
    setStakeData(null);
    setPayoutData(null);
    setLoading(false);
    setIsRefreshing(false);
    setIsAuthenticated(false);
    isFetching.current = false;
    initialLoadDone.current = false;
    
    localStorage.removeItem("user");
    localStorage.removeItem("regno");
    localStorage.removeItem("Regno");
    localStorage.removeItem("userData");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loginId");
    localStorage.removeItem("NameAppearOnCheque");
    localStorage.removeItem("token");
  }, []);

  // ================= REFRESH =================
  const refreshData = useCallback(async () => {
    console.log("🔄 Manual refresh triggered");
    return await fetchData(true);
  }, [fetchData]);

  const refreshUserData = useCallback(async () => {
    const savedData = localStorage.getItem("userData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setUserData(parsed);
      return parsed;
    }
    return userData;
  }, [userData]);

  const contextValue = {
    user,
    userData,
    stakeData,
    payoutData,
    refreshData,
    refreshUserData,
    loginUser,
    logoutUser,
    loading,
    isRefreshing,
    isAuthenticated, // ✅ ADD THIS
    fetchData
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('❌ useUser must be used within a UserProvider');
  }
  return context;
};