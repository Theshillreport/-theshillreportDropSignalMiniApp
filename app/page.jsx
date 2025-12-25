"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import BackgroundMatrix from "./components/BackgroundMatrix";

export default function Home() {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const [balance, setBalance] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [apy, setApy] = useState(12);

  const [tab, setTab] = useState("deposit");
  const [amount, setAmount] = useState("");

  // Fake earnings counter for now
  useEffect(() => {
    if (!address) return;

    const int = setInterval(() => {
      setEarnings((e) => e + 0.00001);
    }, 1000);

    return () => clearInterval(int);
  }, [address]);


  const connectWallet = async () => {
    if (typeof window === "undefined") return;

    try {
      setLoading(true);

      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("wc@2:client:session");
        localStorage.removeItem("wc@2:core:pairing");
      }

      const { EthereumProvider } = await import(
        "@walletconnect/ethereum-provider"
      );

      const wcProvider = await EthereumProvider.init({
        projectId: "6a6f915ce160625cbc11e74f7bc284e0",
        chains: [1],
        showQrModal: true
      });

      await wcProvider.connect();

      const provider = new ethers.BrowserProvider(wcProvider);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();

      setAddress(addr);
    } catch (err) {
      console.error("Connect error:", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <main style={styles.page}>
      <BackgroundMatrix />

      {!address ? (
        <div style={styles.centerBox}>
          <h1 style={styles.logo}>DropSignal</h1>
          <p style={styles.sub}>Deposit • Earn • Signal</p>

          <button
            onClick={connectWallet}
            disabled={loading}
            style={styles.connectButton(loading)}
          >
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        </div>
      ) : (
        <div style={styles.dashboardWrap}>

          {/* HEADER */}
          <div style={styles.topBar}>
            <div style={styles.brand}>
              <div style={styles.logoCircle}>D</div>
              <span>DropSignal</span>
            </div>

            <div style={styles.walletTag}>
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          </div>

          {/* MAIN CARD */}
          <div style={styles.bigCard}>
            <p style={styles.headingText}>DEPOSIT USDC TO EARN YIELD</p>

            <h2 style={styles.balance}>${balance.toFixed(2)}</h2>

            <p style={styles.apyText}>{apy}% APY</p>
          </div>

          {/* BOOSTS */}
          <div style={styles.boostBox}>
            <div style={styles.boostItem}>
              <span>WELCOME BOOST</span>
              <strong>+0.00%</strong>
            </div>

            <div style={styles.boostItem}>
              <span>REFERRAL BOOST</span>
              <strong>+0.00%</strong>
            </div>
          </div>

          {/* TABS */}
          <div style={styles.tabs}>
            <button
              onClick={() => setTab("deposit")}
              style={tab === "deposit" ? styles.tabActive : styles.tab}
            >
              Deposit
            </button>

            <button
              onClick={() => setTab("withdraw")}
              style={tab === "withdraw" ? styles.tabActive : styles.tab}
            >
              Withdraw
            </button>
          </div>

          {/* INPUT */}
          <div style={styles.inputBox}>
            <p style={{ opacity: 0.7 }}>Available: 0.00 USDC</p>

            <input
              style={styles.input}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />

            <button style={styles.actionBtn}>
              {tab === "deposit" ? "Deposit USDC" : "Withdraw USDC"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}


// ===================== STYLES =====================
const styles = {
  page:{minHeight:"100vh",width:"100%",background:"#000",color:"#fff",position:"relative"},
  centerBox:{zIndex:5,minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"},
  logo:{fontSize:40,fontWeight:900},
  sub:{opacity:.8,marginBottom:20},
  connectButton:(loading)=>({
    padding:"14px 30px",
    borderRadius:12,
    border:"none",
    fontSize:18,
    cursor:"pointer",
    background:"linear-gradient(135deg,#00ffa6,#00b4ff)",
    opacity: loading ? 0.6 : 1
  }),

  dashboardWrap:{zIndex:5,position:"relative",padding:"25px 10px"},
  topBar:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20},
  brand:{display:"flex",alignItems:"center",gap:8,fontWeight:800,fontSize:18},
  logoCircle:{width:36,height:36,borderRadius:"50%",background:"#00ffa6",display:"flex",justifyContent:"center",alignItems:"center",color:"#000",fontWeight:900},
  walletTag:{padding:"8px 14px",borderRadius:50,border:"1px solid rgba(255,255,255,.4)"},

  bigCard:{borderRadius:20,border:"1px solid rgba(255,255,255,.2)",padding:25,background:"rgba(0,0,0,.5)",backdropFilter:"blur(6px)"},
  headingText:{opacity:.8,letterSpacing:1},
  balance:{fontSize:40,margin:"10px 0"},
  apyText:{color:"#00ffa6",fontSize:22},

  boostBox:{display:"flex",justifyContent:"space-between",gap:10,marginTop:20},
  boostItem:{flex:1,background:"rgba(0,0,0,.6)",borderRadius:14,padding:15,border:"1px solid rgba(255,255,255,.2)",
  display:"flex",flexDirection:"column",alignItems:"center",gap:6},

  tabs:{marginTop:25,display:"flex",gap:10,justifyContent:"center"},
  tab:{padding:"10px 20px",borderRadius:20,border:"1px solid rgba(255,255,255,.4)",background:"transparent",color:"#fff"},
  tabActive:{padding:"10px 20px",borderRadius:20,border:"none",background:"#fff",color:"#000",fontWeight:800},

  inputBox:{marginTop:20,background:"rgba(0,0,0,.6)",padding:20,borderRadius:18,border:"1px solid rgba(255,255,255,.2)"},
  input:{width:"100%",padding:15,fontSize:22,borderRadius:10,border:"none",marginTop:10,marginBottom:15},
  actionBtn:{width:"100%",padding:16,borderRadius:14,border:"none",background:"#00ffa6",color:"#000",fontWeight:900,fontSize:18}
};