import React, { useState, useRef, useEffect } from "react";
import { Terminal, ShieldCheck, Lock } from "lucide-react";
import { CTF_LEVELS } from "./ctfData";

const ProfileConsole = () => {
  const [level, setLevel] = useState(1);
  const [remoteSession, setRemoteSession] = useState(null);
  const [history, setHistory] = useState([
    { msg: "CAPTURE THE FLAG", type: "sys" },
    { msg: "TYPE 'help' TO START THE CHALLENGE.", type: "sys" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [solved, setSolved] = useState(false);
  const scrollRef = useRef(null);
  const [crackedPasswords, setCrackedPasswords] = useState({});
  const [level5State, setLevel5State] = useState({
    hashesFound: false,
    cracked: false,
    ssh: false,
  });
  const [leakedHashes, setLeakedHashes] = useState([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const addLog = (msg, type = "out") => {
    setHistory((prev) => [...prev, { msg, type }]);
  };
  const handleCommand = (input) => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const args = trimmedInput.split(/\s+/);
    const command = args[0].toLowerCase();
    const currentData = CTF_LEVELS[level];

    addLog(trimmedInput, "in");

    // --- SHELL (NC) ---
    if (remoteSession?.type === "nc") {
      const shellPrefix = `root@${remoteSession.host}`;

      if (command === "ls") {
        addLog(`${shellPrefix} : app.py  config.py  flag.txt`, "out");
      } else if (command === "cat") {
        const file = args[1];
        if (file === "flag.txt") {
          addLog(`${shellPrefix} : FLAG{${currentData.flag}}`, "out");
        } else if (file === "app.py") {
          addLog(`${shellPrefix} : # Flask Application Server`, "out");
          addLog(`${shellPrefix} : @app.route('/dev_admin_portal')`, "out");
          addLog(
            `${shellPrefix} : def admin(): return render_template('admin.html')`,
            "out",
          );
        } else if (file === "config.py") {
          addLog(`${shellPrefix} : DB_ENGINE=SQLite`, "out");
          addLog(`${shellPrefix} : DB_PATH=/var/www/app.db`, "out");
          addLog(`${shellPrefix} : DEBUG=True`, "out");
          addLog(`${shellPrefix} : ADMIN_PANEL_URL=/dev_admin_portal`, "out");
        } else if (!file) {
          addLog(`${shellPrefix} : usage: cat [file]`, "err");
        } else {
          addLog(
            `${shellPrefix} : cat: ${file}: No such file or directory`,
            "err",
          );
        }
      } else if (command === "exit") {
        addLog(`Closing connection to ${remoteSession.host}...`, "sys");
        setRemoteSession(null);
      } else {
        addLog(`${shellPrefix} : sh: ${command}: command not found`, "err");
      }
      return;
    }
    // --- SHELL (SSH) ---
    else if (remoteSession?.type === "ssh") {
      const shellPrefix = `${remoteSession.user ?? "user"}@${remoteSession.host}`;

      if (command === "ls") {
        addLog(`${shellPrefix} : secret.txt flag.txt`, "out");
      } else if (command === "cat") {
        const file = args[1];

        if (file === "flag.txt") {
          addLog(`${shellPrefix} : FLAG{${CTF_LEVELS[level].flag}}`, "out");
        } else if (file === "secret.txt") {
          addLog(`${shellPrefix} : TOP_SECRET_DATABASE_ACCESS`, "out");
        } else if (!file) {
          addLog(`${shellPrefix} : usage: cat [file]`, "err");
        } else {
          addLog(`${shellPrefix} : no such file`, "err");
        }
      } else if (command === "exit") {
        addLog("Closing SSH session...", "sys");
        setRemoteSession(null);
      } else {
        addLog(`${shellPrefix} : command not found`, "err");
      }

      return;
    }

    // HELP
    if (command === "help") {
      let baseCmds = "ls, ls -la, cat [file], hint, submit [flag], clear";
      if (level >= 2) {
        baseCmds += ", find [nom], grep [texte]";
      }
      if (level >= 3) {
        baseCmds += ", nmap [IP], nc [IP] [PORT]";
      }
      if (level >= 4) {
        baseCmds += ", gobuster [IP], curl [endpoint], sqlmap [url]";
      }
      if (level >= 5) {
        baseCmds += ", john [hash], ssh [user]@[IP], hashcat [hash]";
      }
      addLog(`COMMANDES DISPONIBLES : ${baseCmds}`, "sys");
      
    } 
    // Basic commands
    else if (command === "clear") {
      setHistory([]);
    } else if (command === "hint") {
      addLog(`HINT: ${currentData.hint}`, "sys");
    } else if (command === "ls") {
      const files = Object.keys(currentData.files);
      const showAll = args.includes("-la") || args.includes("-a");
      const filtered = files.filter((f) => {
        const isHidden = f.startsWith(".");
        const isRoot = !f.includes("/");
        return showAll ? isRoot : isRoot && !isHidden;
      });
      addLog(filtered.sort().join("    "), "out");
    } else if (command === "cat") {
      const target = args[1];
      if (currentData.files[target]) {
        addLog(currentData.files[target], "out");
      } else {
        addLog(`cat: ${target || ""}: No such file or directory`, "err");
      }
    }

    // FIND
    else if (command === "find") {
      if (level < 2) {
        return addLog(
          "command not found: find (indice: débloqué au niv. 2)",
          "err",
        );
      }
      const query = args[1];
      if (!query) return addLog("Usage: find [nom]", "err");

      const results = Object.keys(currentData.files).filter((f) =>
        f.toLowerCase().includes(query.toLowerCase()),
      );
      results.length > 0
        ? results.forEach((res) => addLog(res, "out"))
        : addLog(`find: '${query}': No such file`, "sys");
    }

    // GREP
    else if (command === "grep") {
      if (level < 2) {
        return addLog(
          "command not found: grep (indice: débloqué au niv. 2)",
          "err",
        );
      }
      const pattern = args[1];
      if (!pattern) return addLog("Usage: grep [texte]", "err");

      const results = Object.entries(currentData.files)
        .filter(([content]) =>
          content.toLowerCase().includes(pattern.toLowerCase()),
        )
        .map(([name]) => name);

      results.length > 0
        ? results.forEach((res) => addLog(`Match found in: ${res}`, "out"))
        : addLog("No match found.", "sys");
    }

    // --- NMAP ---
    else if (command === "nmap") {
      if (level < 3) return addLog("nmap: command not found", "err");

      const target = args.find((a) => !a.startsWith("-") && a !== "nmap");
      const flags = args.filter((a) => a.startsWith("-"));
      const showVersion = flags.includes("-sV");

      if (!target || target !== currentData.targetIp) {
        return addLog(`nmap: ${target || "host"}: Host seems down`, "err");
      }

      addLog(`Starting Nmap scan on ${target}...`, "sys");

      setTimeout(() => {
        addLog("PORT      STATE    SERVICE     VERSION", "out");

        const hasVulnerability = currentData.services.some((s) =>
          s.version.includes("DANGER"),
        );

        currentData.services.forEach((s, i) => {
          setTimeout(() => {
            const serviceName =
              s.port === "5000" && !showVersion ? "unknown" : s.service;
            const versionDisplay = showVersion ? s.version : "Unknown";

            addLog(
              `${s.port}/tcp   ${s.state.padEnd(8)} ${serviceName.padEnd(11)} ${versionDisplay}`,
              "out",
            );

            if (i === currentData.services.length - 1) {
              setTimeout(() => {
                if (showVersion && hasVulnerability) {
                  addLog(
                    "\n[!] CRITICAL VULNERABILITY DETECTED ON PORT 5000",
                    "err",
                  );
                  addLog(
                    "[!] SUGGESTION: USE 'nc' TO INTERACT WITH THE UNSECURED CONSOLE.",
                    "sys",
                  );
                }
              }, 800);
            }
          }, i * 350);
        });
      }, 800);
    }

    // --- NC (NETCAT) ---
    else if (command === "nc") {
      const host = args[1];
      const port = args[2];
      if (host === currentData.targetIp && port === "5000") {
        addLog(`Establish connection to ${host}:${port}...`, "sys");
        setTimeout(() => {
          addLog("Connected! Entering Werkzeug Debug Shell.", "out");
          addLog("Logged in as root@target-node", "sys");
          addLog("Remote Commands: ls, cat [file], exit", "sys");
          setRemoteSession({
            type: "nc",
            host,
            port,
          });
        }, 1000);
      } else {
        addLog(
          `nc: connect to ${host || "target"} failed: Connection refused`,
          "err",
        );
      }
    }

    // --- GOBUSTER (NIVEAU 4) ---
    else if (command === "gobuster") {
      if (level < 4) return addLog("gobuster: command not found", "err");

      const target = args[1];
      if (!target || target !== "10.0.2.15") {
        return addLog("Usage: gobuster [IP]", "err");
      }

      addLog("Scanning directories on 10.0.2.15...", "sys");

      const logs = [
        ["Found: /api/login (Status: 200) [AUTH ENDPOINT]", "out"],
        ["Found: /api/users (Status: 200)", "out"],
        ["Found: /backup (Status: 403)", "out"],
        [
          "Found: /dev_admin_portal (Status: 200) [!] POTENTIAL ADMIN PANEL",
          "out",
        ],
        ["Scan complete.", "sys"],
        ["[!] Try interacting with endpoints using curl", "sys"],
        ["[!] If vulnerable, consider automating with sqlmap", "sys"],
      ];

      logs.forEach(([msg, type], index) => {
        setTimeout(
          () => {
            addLog(msg, type);
          },
          800 + index * 600,
        );
      });
    }

    // CURL
    else if (command === "curl") {
      if (level < 4) return addLog("curl: command not found", "err");
      const endpoint = args[1];
      if (!endpoint) return addLog("Usage: curl [endpoint]", "err");
      if (endpoint === "/dev_admin_portal") {
        addLog("Admin Portal v1", "out");
        addLog("Login system detected at /api/login", "sys");
        addLog("[!] SQL injection suspected on login endpoint", "sys");
        addLog("[!] Recommended tool: sqlmap", "sys");
        addLog("[!] Example: sqlmap /api/login", "sys");
      } else if (endpoint === "/api/login") {
        addLog("POST /api/login", "sys");
        addLog("username=admin&password=test", "out");
        addLog("[!] Authentication failed", "err");
      } else {
        addLog("404 Not Found", "err");
      }
    }

    // --- SQLMAP (NIVEAU 4) ---
    else if (command === "sqlmap") {
      if (level < 4) return addLog("sqlmap: command not found", "err");

      const url = args.slice(1).join(" ");
      if (!url) return addLog("Usage: sqlmap [url]", "err");

      addLog("[*] Starting sqlmap engine...", "sys");
      addLog(`[+] Target: ${url}`, "sys");

      setTimeout(() => {
        addLog("[*] Testing GET parameter 'username'...", "sys");
        addLog("[+] Injection point found!", "out");
        addLog("[+] Type: Boolean-based blind SQLi", "out");

        setTimeout(() => {
          addLog("[*] Dumping database...", "sys");

          addLog("users table:", "out");
          setLeakedHashes([
            { user: "admin", hash: "5f4dcc3b5aa765d61d8327deb882cf99" },
            { user: "dev", hash: "e99a18c428cb38d5f260853678922e03" },
          ]);
          setLevel5State((prev) => ({ ...prev, hashesFound: true }));
          addLog(`[+] FLAG FOUND: ${currentData.flag}`, "out");
        }, 1000);
      }, 1000);
    }

    // JOHN
    else if (command === "john") {
      if (!level5State.hashesFound) {
        return addLog("john: no hashes available (run sqlmap first)", "err");
      }
      if (level < 5) return addLog("john: command not found", "err");

      if (!leakedHashes.length) {
        return addLog("john: no hashes available (run sqlmap first)", "err");
      }

      const hash = args[1];
      if (!hash) return addLog("Usage: john [hash]", "err");

      const entry = leakedHashes.find((h) => h.hash === hash);

      if (!entry) return addLog("john: hash not found", "err");

      const wordlist = {
        "5f4dcc3b5aa765d61d8327deb882cf99": "password",
        e99a18c428cb38d5f260853678922e03: "abc123",
      };

      const cracked = wordlist[entry.hash];

      if (!cracked) return addLog("john: no match in wordlist", "err");

      setCrackedPasswords((prev) => ({
        ...prev,
        [entry.user]: cracked,
      }));

      addLog(`[+] john cracked ${entry.user}: ${cracked}`, "out");
    }
    // SSH
    else if (command === "ssh") {
      if (level < 5) return addLog("ssh: command not found", "err");

      const user = args[1];
      const pass = args[2];

      if (!crackedPasswords[user]) {
        return addLog("ssh: no cracked credentials for this user", "err");
      }

      if (pass !== crackedPasswords[user]) {
        return addLog("ssh: authentication failed", "err");
      }

      addLog(`[+] connecting to ${CTF_LEVELS[5].ssh.host}...`, "sys");

      setTimeout(() => {
        addLog("SSH session established", "out");

        setSshSession({
          user,
          host: CTF_LEVELS[5].ssh.host,
        });

        setRemoteSession({
          type: "ssh",
          user,
          host: CTF_LEVELS[5].ssh.host,
        });

        setLevel5State((prev) => ({ ...prev, ssh: true }));

        addLog("Available: ls, cat, exit", "sys");
      }, 600);
    }
    // HASHCAT
    else if (command === "hashcat") {
      if (level < 5) return addLog("hashcat: command not found", "err");

      addLog("[*] running hashcat (simulated)...", "sys");

      setTimeout(() => {
        const result = leakedHashes.reduce((acc, h) => {
          const dict = {
            "5f4dcc3b5aa765d61d8327deb882cf99": "password",
            e99a18c428cb38d5f260853678922e03: "abc123",
          };

          acc[h.user] = dict[h.hash] || null;
          return acc;
        }, {});

        setCrackedPasswords(result);

        Object.entries(result).forEach(([u, p]) => {
          if (p) addLog(`[+] ${u}:${p}`, "out");
        });

        setLevel5State((prev) => ({ ...prev, cracked: true }));
        addLog("[+] credentials ready for ssh", "sys");
      }, 800);
    }

    // SUBMIT
    else if (command === "submit" || input === currentData.flag) {
      const userFlag = command === "submit" ? args[1] : input;

      if (userFlag === currentData.flag) {
        if (CTF_LEVELS[level + 1]) {
          const nextLvl = level + 1;

          addLog(`[+] Access Granted`, "sys");

          setTimeout(() => {
            const nextLevelData = CTF_LEVELS[nextLvl];

            if (nextLevelData) {
              addLog(`Level ${nextLvl} : ${nextLevelData.label}`, "sys");

              if (nextLevelData.unlocks?.length) {
                addLog(
                  `[!] NEW TOOLS INSTALLED: ${nextLevelData.unlocks.join(", ")}`,
                  "sys",
                );
              }

              addLog("TYPE 'help' TO START THE CHALLENGE.", "sys");
            } else {
              addLog("[!] SYSTEM STATE UPDATED", "sys");
            }

            setLevel((prev) => prev + 1);
          }, 150);
        } else {
          addLog("[!] SYSTEM BREACH. TOTAL ROOT ACCESS.", "sys");
          setSolved(true);
        }
      } else {
        addLog("[-] FLAG INCORRECT.", "err");
      }
    } else {
      addLog(`command not found: ${command}`, "err");
    }
  };

  return (
    <div
      className={`bg-black border ${solved ? "border-green-500" : "border-cyber/30"} 
      rounded-sm overflow-hidden flex flex-col h-full shadow-2xl transition-all duration-1000`}
    >
      {/* Header */}
      <div className="bg-zinc-900 px-3 py-2 flex justify-between items-center border-b border-white/10 shrink-0 font-mono text-[10px]">
        <div className="flex items-center gap-2">
          {solved ? (
            <ShieldCheck size={14} className="text-green-500" />
          ) : (
            <Terminal size={14} className="text-cyber" />
          )}
          <span className="text-zinc-400 uppercase tracking-widest">
            {solved
              ? "ROOT@NAGI_SYS:~#"
              : `CHALLENGE_MODE: LVL_${level}_${CTF_LEVELS[level].label}`}
          </span>
        </div>
      </div>

      {/* Logs View */}
      <div
        ref={scrollRef}
        className="p-4 flex-1 overflow-y-auto space-y-1 font-mono text-[11px] bg-[rgba(0,0,0,0.9)]"
      >
        {history.map((log, i) => (
          <div key={i} className="flex gap-2 break-all">
            <span
              className={`shrink-0 font-bold ${log.type === "in" ? "text-zinc-500" : log.type === "err" ? "text-red-500" : "text-cyber"}`}
            >
              {log.type === "in" ? ">" : ">>"}
            </span>
            <span
              className={
                log.type === "err"
                  ? "text-red-400"
                  : log.type === "sys"
                    ? "text-cyber italic"
                    : "text-zinc-300"
              }
            >
              {log.msg}
            </span>
          </div>
        ))}
        {solved && (
          <div className="mt-6 p-4 border border-green-500/50 text-green-500 text-center animate-pulse uppercase text-[10px]">
            Accès Root Confirmé. Félicitations, vous avez terminé le CTF.
          </div>
        )}
      </div>

      {/* Input Field */}
      <div className="p-3 bg-zinc-900/50 border-t border-white/5 flex gap-2 items-center">
        <span className="text-cyber font-mono font-bold">
          {solved ? "#" : ">"}
        </span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCommand(inputValue);
              setInputValue("");
            }
          }}
          disabled={solved}
          className="bg-transparent border-none outline-none text-white font-mono text-[11px] w-full"
          autoFocus
        />
        {!solved && <Lock size={10} className="text-zinc-700" />}
      </div>
    </div>
  );
};

export default ProfileConsole;
