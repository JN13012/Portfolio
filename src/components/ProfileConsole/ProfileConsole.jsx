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
  const [sshLoginPending, setSshLoginPending] = useState(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const addLog = (msg, type = "out") => {
    setHistory((prev) => [...prev, { msg, type }]);
  };
  const handleCommand = (input) => {
    const enterSshShell = (user, host) => {
      setRemoteSession({
        type: "ssh",
        user,
        host,
      });

      addLog("SSH session established", "out");
      addLog(`Logged in as ${user}@${host}`, "sys");

      addLog("Available commands: ls, cat [file], exit, help", "sys");

      if (user === "dev") {
        addLog("Tip: internal services may exist...", "sys");
      }
    };
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const args = trimmedInput.split(/\s+/);
    const command = args[0].toLowerCase();
    const currentData = CTF_LEVELS[level];
    if (sshLoginPending && remoteSession?.type !== "ssh") {
      const password = trimmedInput;

      const expected = crackedPasswords[sshLoginPending.user];

      if (password !== expected) {
        addLog("Permission denied, try again.", "err");
        setSshLoginPending(null);
        return;
      }

      enterSshShell(sshLoginPending.user, sshLoginPending.host);

      setSshLoginPending(null);
      setInputValue("");
      return;
    }

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
      const shellPrefix = `${remoteSession.user}@${remoteSession.host}`;

      if (!remoteSession.initialized) {
        addLog("Welcome to Ubuntu 20.04 LTS (CTF VM)", "sys");
        setRemoteSession((prev) => ({ ...prev, initialized: true }));
      }

      // HELP
      if (command === "help") {
        addLog("Available commands: ls, cat [file], exit", "sys");
        return;
      }

      // =========================
      // 🟢 USER: DEV (HONEYPOT)
      // =========================
      if (remoteSession.user === "dev") {
        if (command === "ls") {
          addLog(`${shellPrefix} : secret.txt flag.txt`, "out");
        } else if (command === "cat") {
          const file = args[1];

          if (file === "flag.txt") {
            addLog(`${shellPrefix} : FLAG{DEV_ACCESS_IS_A_TRAP}`, "sys");
            addLog(`${shellPrefix} : [!] suspicious flag detected...`, "sys");
          } else if (file === "secret.txt") {
            addLog(`${shellPrefix} : Verify ssh admin@10.0.2.15`, "sys");
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
      // =========================
      // 🔴 USER: ADMIN (REAL TARGET)
      // =========================
      if (remoteSession.user === "admin") {
        if (command === "hashcat") {
          //
        } else if (command === "ls") {
          addLog(
            `${shellPrefix} : .secrets.txt .hashcat.txt notes.log intership.txt`,
            "out",
          );
        } else if (command === "cat") {
          const file = args[1];

          if (file === ".secrets.txt") {
            addLog(`${shellPrefix} : HASHES_DUMP`, "out");
            addLog(
              `${shellPrefix} : FLAG : d4f3c1a5f1c6b6f5b1a6c8a0d8e5f2a1`,
              "out",
            );

            setLeakedHashes([
              { user: "FLAG", hash: "d4f3c1a5f1c6b6f5b1a6c8a0d8e5f2a1" },
            ]);

            addLog(`${shellPrefix} : [!] hashes use advanced format`, "sys");
            addLog(`${shellPrefix} : [!] recommended tool: hashcat`, "sys");
          } else if (file === "intership.txt") {
            addLog(`${shellPrefix} : ====================`, "out");
            addLog(`${shellPrefix} : INTERSHIP PROFILE DATA`, "out");
            addLog(`${shellPrefix} : ====================`, "out");
            addLog(`${shellPrefix} :`, "out");

            addLog(`${shellPrefix} : NAME: Jérémie Nagi`, "out");
            addLog(
              `${shellPrefix} : ROLE: Intership Cybersecurity / IA`,
              "out",
            );
            addLog(`${shellPrefix} : EMAIL: jeremie.nagi@epitech.eu`, "out");
            addLog(`${shellPrefix} : PHONE: +33 7 88 29 43 03`, "out");
            addLog(`${shellPrefix} : ====================`, "out");
            addLog(`${shellPrefix} : IP (internal): 10.0.2.25`, "out");
          } else if (file === ".hashcat.txt") {
            addLog(
              `${shellPrefix} : [internal] hashcat reference guide`,
              "out",
            );

            addLog(`${shellPrefix} :`, "out");

            addLog(`${shellPrefix} : BASIC USAGE:`, "out");
            addLog(
              `${shellPrefix} : hashcat -m <mode> -a <attack> <hashfile> <wordlist/mask> [options]`,
              "out",
            );

            addLog(`${shellPrefix} :`, "out");

            addLog(`${shellPrefix} : HASH MODES:`, "out");
            addLog(`${shellPrefix} : -m 0     MD5`, "out");
            addLog(`${shellPrefix} : -m 1000  NTLM`, "out");

            addLog(`${shellPrefix} :`, "out");

            addLog(`${shellPrefix} : ATTACK MODES:`, "out");
            addLog(
              `${shellPrefix} : -a 0  dictionary attack (wordlist based)`,
              "out",
            );
            addLog(
              `${shellPrefix} : -a 3  brute-force attack (mask based)`,
              "out",
            );

            addLog(`${shellPrefix} :`, "out");
            addLog(`${shellPrefix} : MASK EXAMPLES:`, "out");
            addLog(`${shellPrefix} : ?l?l?l?l   (4 lowercase letters)`, "out");
            addLog(
              `${shellPrefix} : ?u?l?l?l?l?l?l?l?l?d?d?d?d?s (enterprise pattern: word + year + symbol)`,
              "out",
            );

            addLog(`${shellPrefix} :`, "out");

            addLog(`${shellPrefix} : OPTIONAL FLAGS:`, "out");
            addLog(`${shellPrefix} : --force   ignore warnings`, "out");
            addLog(`${shellPrefix} : -O        optimized GPU kernels`, "out");
            addLog(
              `${shellPrefix} : -w 4       maximum workload profile`,
              "out",
            );
            addLog(`${shellPrefix} : -D 1,2    select compute devices`, "out");

            addLog(`${shellPrefix} :`, "out");

            addLog(`${shellPrefix} : EXAMPLE:`, "out");
            addLog(
              `${shellPrefix} : hashcat -m 1000 -a 3 .secrets.txt ?l?l?l?l -O -w 4`,
              "out",
            );

            addLog(`${shellPrefix} :`, "out");

            addLog(
              `${shellPrefix} : NOTE: choose correct mode and attack type carefully`,
              "sys",
            );

            addLog(
              `${shellPrefix} : NOTE: GPU acceleration recommended for real performance`,
              "sys",
            );
          } else if (file === "notes.log") {
            addLog(
              `${shellPrefix} : security notice - hash recovery update`,
              "out",
            );

            addLog(`${shellPrefix} : hash mode detected: NTLM`, "out");

            addLog(`${shellPrefix} : dictionary attack ineffective`, "out");

            addLog(`${shellPrefix} : recommended approach: brute-force`, "out");

            addLog(
              `${shellPrefix} : hint: use mask-based attack strategy`,
              "out",
            );

            addLog(
              `${shellPrefix} : enable GPU optimized kernels for performance`,
              "out",
            );

            addLog(
              `${shellPrefix} : use maximum workload profile for cracking efficiency"`,
              "out",
            );
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

        if (command !== "hashcat") {
          return;
        }
      }
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
        baseCmds +=
          ", john --wordlist=[file] [hashfile], ssh [user]@[IP], hashcat [hash]";
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
            { user: "admin", hash: "216b0a84582521479c73b7ba56d17f77" },
            { user: "dev", hash: "650a82a075701f1e40c182082cbf3e15" },
          ]);
          setLevel5State((prev) => ({ ...prev, hashesFound: true }));
          addLog(`[+] FLAG FOUND: ${currentData.flag}`, "out");
        }, 1000);
      }, 1000);
    }

    // JOHN
    else if (command === "john") {
      if (level < 5) return addLog("john: command not found", "err");

      const wordlistArg = args.find((a) => a.startsWith("--wordlist="));
      const wordlistPath = wordlistArg?.split("=")[1];

      const hashFile = args.find(
        (a) => a.endsWith(".txt") && !a.startsWith("--"),
      );

      if (remoteSession?.type === "ssh" && remoteSession.user === "admin") {
        return addLog("[!] john failed: hash format not supported", "err");
      }
      if (!wordlistPath) {
        return addLog(
          "Usage: john --wordlist=/usr/share/wordlists/rockyou.txt .hashes.txt",
          "err",
        );
      }

      if (!hashFile) {
        return addLog("Usage: john --wordlist=... .hashes.txt", "err");
      }

      if (hashFile !== ".hashes.txt") {
        return addLog(`john: ${hashFile}: No such file`, "err");
      }

      addLog("[*] Initializing John the Ripper...", "sys");

      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

      const runCrack = async (user, hash, password) => {
        addLog("[*] Loaded 2 password hashes", "sys");
        await sleep(300);

        addLog(`[*] Loading hash: ${user} (${hash})`, "sys");
        await sleep(500);

        addLog(`[*] Using wordlist: ${wordlistPath}`, "sys");
        await sleep(400);

        addLog("[*] Starting dictionary attack...", "sys");
        await sleep(400);

        const progress = [12, 31, 48, 66, 83, 97];

        for (const p of progress) {
          addLog(`[*] Progress: ${p}%`, "sys");
          await sleep(300);
        }

        addLog(`[+] ${user}:${password} FOUND`, "out");
      };

      (async () => {
        await runCrack(
          "admin",
          "39678cb269782223fb548ea91d07d540",
          "JTR13012!!",
        );

        await sleep(700);

        await runCrack("dev", "aba0b545a32585915e3318b92d987bfa", "jtr13");

        addLog("[*] Cracking complete", "sys");

        setCrackedPasswords({
          admin: "JTPJTR13012!",
          dev: "jtr13",
        });

        setLevel5State((prev) => ({ ...prev, cracked: true }));
      })();
    }
    // SSH
    else if (command === "ssh") {
      if (level < 5) return addLog("ssh: command not found", "err");

      const raw = args[1];
      const [user, host] = raw.split("@");

      if (!user || !host) {
        return addLog("Usage: ssh user@host", "err");
      }

      if (user === "admin" && !level5State.cracked) {
        addLog("[!] Access denied: credentials required", "err");
        addLog("[!] Hint: password reuse or hash cracking", "sys");
        return;
      }

      addLog(`[+] connecting to ${host}...`, "sys");

      setTimeout(() => {
        addLog("Password:", "sys");

        setSshLoginPending({ user, host });
      }, 600);

      return;
    }
    // HASHCAT
    else if (command === "hashcat") {
      if (level < 5) return addLog("hashcat: command not found", "err");

      if (!leakedHashes.length) {
        return addLog("[!] no hashes loaded (read .secrets.txt first)", "err");
      }

      const argsStr = args.slice(1);

      const modeIndex = argsStr.indexOf("-m");
      const attackIndex = argsStr.indexOf("-a");
      const force = argsStr.includes("--force");
      const optimized = argsStr.includes("-O");
      const workloadIndex = argsStr.indexOf("-w");

      const mode = modeIndex !== -1 ? argsStr[modeIndex + 1] : null;
      const attack = attackIndex !== -1 ? argsStr[attackIndex + 1] : null;

      const inputFile = argsStr.find((a) => a.includes(".secrets.txt"));
      const mask = argsStr.find((a) => a.includes("?"));

      // =========================
      // VALIDATION
      // =========================
      if (!mode) return addLog("[!] missing -m (hash type required)", "err");
      if (mode !== "1000") {
        return addLog("[!] expected NTLM mode (-m 1000)", "err");
      }

      if (!attack) return addLog("[!] missing -a (attack mode)", "err");
      if (!inputFile)
        return addLog("[!] missing hash file (.secrets.txt)", "err");

      addLog("[*] initializing hashcat engine...", "sys");

      if (force) addLog("[*] --force enabled", "sys");
      if (optimized) addLog("[*] optimized GPU kernels enabled (-O)", "sys");
      if (workloadIndex !== -1) {
        addLog(`[*] workload profile: ${argsStr[workloadIndex + 1]}`, "sys");
      }

      setTimeout(() => {
        addLog("[*] loading hashes...", "sys");
        addLog("[*] detected format: NTLM", "sys");

        setTimeout(() => {
          // ======================================================
          // 🔸 DICTIONARY ATTACK (FAIL volontaire)
          // ======================================================
          if (attack === "0") {
            addLog("[*] starting dictionary attack...", "sys");

            const progress = [14, 29, 47, 62, 80, 96];

            progress.forEach((p, i) => {
              setTimeout(() => {
                addLog(`[*] progress: ${p}%`, "sys");
              }, i * 250);
            });

            setTimeout(() => {
              addLog("[!] no matches found in wordlist", "err");
              addLog("[!] password not in common dictionaries", "sys");
              addLog("[!] analysis: structured pattern detected", "sys");
              addLog("[!] recommendation: use mask attack (-a 3)", "sys");
            }, 1800);
          }

          // ======================================================
          // 🔸 BRUTE FORCE MASK (SUCCESS / FAIL REALISTIC)
          // ======================================================
          else if (attack === "3") {
            // -------------------------
            // VALIDATION INPUT
            // -------------------------
            if (!mask) {
              return addLog("[!] missing mask pattern", "err");
            }

            const tokens = (mask.match(/\?[ulds]/g) || []).length;

            if (tokens < 12) {
              return addLog(
                "[!] mask too weak (expected high complexity password ~15 chars)",
                "err",
              );
            }

            addLog("[*] starting brute-force (mask attack)...", "sys");
            addLog("[*] analyzing password structure...", "sys");

            setTimeout(() => {
              addLog(`[*] testing mask: ${mask}`, "sys");

              setTimeout(() => {
                // ------------------------------------------------------
                // 🔐 STRICT MASK VALIDATION (ONE TRUE SOLUTION)
                // ------------------------------------------------------

                const expectedMask = "?u?l?l?l?l?l?l?l?l?d?d?d?d?s";

                if (mask !== expectedMask) {
                  addLog("[!] incorrect mask pattern", "err");
                  addLog("[!] analysis: structure mismatch", "sys");
                  addLog(
                    "[!] hint: enterprise pattern (word + year + symbol)",
                    "sys",
                  );
                  return;
                }

                // ------------------------------------------------------
                // SUCCESS PATH
                // ------------------------------------------------------

                addLog("[*] high entropy credential detected", "sys");
                addLog("[*] GPU acceleration options (-O, -w 4)", "sys");

                setTimeout(() => {
                  addLog("[+] hash successfully cracked", "out");

                  addLog(`FLAG{${currentData.flag}}`, "out");
                }, 1200);
              }, 800);
            }, 600);
          }

          // ======================================================
          // 🔸 INVALID ATTACK MODE
          // ======================================================
          else {
            addLog("[!] invalid attack mode", "err");
            addLog("[!] use -a 0 (dictionary) or -a 3 (mask)", "sys");
          }
        }, 1000);
      }, 600);
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
