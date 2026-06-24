// import React, { useEffect, useState } from "react";

// const Marquee = () => {
//   const [coins, setCoins] = useState([]);

//   useEffect(() => {
//     const fetchCoins = async () => {
//       try {
//         const res = await fetch(
//           "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,solana,ripple,dogecoin,cardano"
//         );
//         const data = await res.json();
//         setCoins(data);
//       } catch (error) {
//         console.error("Marquee api:", error);
//       }
//     };

//     fetchCoins();
//     const interval = setInterval(fetchCoins, 10000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div style={{ overflow: "hidden", whiteSpace: "nowrap", width: "100%" }}>
//       <marquee behavior="scroll" direction="left" scrollamount="6">
//         {coins.map((coin) => (
//           <span
//             key={coin.id}
//             style={{
//               marginRight: "40px",
//               fontWeight: "bold",
//               color:
//                 coin.price_change_percentage_24h >= 0 ? "#22c55e" : "#ef4444",
//             }}
//           >
//             {coin.symbol.toUpperCase()} : ${coin.current_price}
//             {" "}
//             {coin.price_change_percentage_24h >= 0 ? "▲" : "▼"}
//             {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
//           </span>
//         ))}
//       </marquee>
//     </div>
//   );
// };

// export default Marquee;