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
  const [msfState, setMsfState] = useState({
    module: null,
    options: {},
  });

  const [meterpreterState, setMeterpreterState] = useState({
    user: "GUEST USER",
    integrity: "Low",
    migratedPid: null,
  });

  const [hardeningState, setHardeningState] = useState({
    firewall: {
      defaultPolicy: "ALLOW",
      rules: [],
      blockedIps: [],
    },

    waf: {
      enabled: false,
      rateLimit: false,
      rateLimitValue: null,
      rulesets: {
        sqli_basic: false,
        xss_basic: false,
        bot_prot: false,
      },
      blockedIps: [],
    },

    snort: {
      enabled: false,
      interface: null,
      scanThreshold: null,
      rules: {
        "local.rules": false,
        "scan.rules": false,
        "malware.rules": false,
      },
      scanPolicy: null,
    },
  });
  function evaluateFirewallConfig(state) {
    const requiredPorts = {
      22: "ALLOW",
      80: "ALLOW",
      443: "ALLOW",
      445: "DENY",
      4444: "DENY",
      5000: "DENY",
    };

    const rules = state.firewall.rules;

    const portsOk = Object.entries(requiredPorts).every(([port, expected]) => {
      const lastRule = rules
        .filter((r) => r.port === Number(port))
        .slice(-1)[0];

      if (!lastRule && expected === "ALLOW") return true;
      return lastRule?.action === expected;
    });

    const attackerBlocked = state.firewall.blockedIps.includes("45.83.122.91");

    return portsOk && attackerBlocked;
  }

  function evaluateWAF(state) {
    return state.waf.rateLimitValue === 60 &&
      state.waf.rulesets?.sqli_basic === true
      ? "OK"
      : "INCOMPLETE";
  }

  function evaluateSnort(state) {
    const r = state.snort?.rules || {};

    const ok =
      state.snort?.enabled &&
      state.snort?.interface === "eth0" &&
      state.snort?.scanPolicy?.count === 10 &&
      state.snort?.scanPolicy?.interval === 1 &&
      state.snort?.scanPolicy?.track === "src_ip" &&
      r["scan.rules"] &&
      r["malware.rules"] &&
      !r["local.rules"];

    return ok ? "OK" : "INCOMPLETE";
  }

  function evaluateAll(state) {
    return {
      firewallConfig: evaluateFirewallConfig(state) ? "OK" : "INCOMPLETE",
      wafConfig: evaluateWAF(state),
      idsConfig: evaluateSnort(state),
    };
  }

  const flagTriggeredRef = useRef(false);

  function checkFlagStatus(state) {
    const allOk =
      state.firewallConfig === "OK" &&
      state.idsConfig === "OK" &&
      state.wafConfig === "OK";

    if (allOk && !flagTriggeredRef.current) {
      flagTriggeredRef.current = true;

      setTimeout(() => {
        addLog("HARDENING COMPLETE. UNLOCKING FLAG.", "sys");
      }, 500);

      setTimeout(() => {
        addLog("[+]", "sys");
      }, 900);

      setTimeout(() => {
        addLog("[+]", "sys");
      }, 1300);

      setTimeout(() => {
        addLog("[+]", "sys");
      }, 1700);

      setTimeout(() => {
        addLog(`FLAG{${CTF_LEVELS[9].flag}}`, "out");
      }, 2200);
    }

    if (!allOk) {
      flagTriggeredRef.current = false;
    }
    return allOk ? "UNLOCKED" : "LOCKED";
  }

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
    const fullCommand = trimmedInput;
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

    if (remoteSession?.type === "siem") {
      const shellPrefix = `splunk@siem`;
      const cmd = fullCommand.trim();
      if (fullCommand === "ls") {
        addLog(`${shellPrefix} listing available files...`, "sys");
        addLog("readme.txt", "out");
        addLog("siem.txt", "out");
        return;
      }

      // -------------------------
      // HELP
      // -------------------------
      if (fullCommand === "help") {
        addLog(`${shellPrefix} SPLUNK SIEM COMMAND REFERENCE`, "sys");

        addLog(
          "Available commands : ls, cat [file], search [query] [source], exit",
          "sys",
        );
        return;
      }
      if (fullCommand === "cat readme.txt") {
        addLog(
          "You are now a SOC analyst. A critical security alert has been triggered. Your task's to analyze logs, and identify the attacker IP address as quick as possible.",
          "out",
        );
        return;
      }
      if (fullCommand === "cat siem.txt") {
        addLog(`${shellPrefix} reading SIEM reference guide...`, "sys");

        addLog("Splunk reference guide", "out");
        addLog("------------------------", "out");

        addLog("AVAILABLE COMMANDS:", "out");
        addLog("------------", "out");
        addLog("Start Splunk SIEM using 'siem'", "out");
        addLog("---", "out");

        addLog("Run statistics query:", "out");
        addLog("search index=ctf | stats count", "out");
        addLog("---", "out");

        addLog("Filter by log source type:", "out");
        addLog("search index=ctf sourcetype=<type>", "out");
        addLog("Example: search index=ctf sourcetype=gobuster", "out");
        addLog("---", "out");

        addLog("THREAT DETECTION HINTS:", "out");
        addLog("  - Use statistics queries to monitor sourcetype", "out");
        addLog(
          "  - Query meterpreter-related events to extract attacker IP",
          "out",
        );

        return;
      }
      // -------------------------
      // EXIT
      // -------------------------
      if (fullCommand === "exit") {
        addLog(`${shellPrefix} closing SIEM session...`, "sys");
        setRemoteSession(null);
        return;
      }

      // -------------------------
      // BASIC SEARCH
      // -------------------------
      if (fullCommand === "search index=ctf") {
        addLog(`${shellPrefix} executing SPL query...`, "sys");

        setTimeout(() => {
          addLog(`${shellPrefix} ERROR: incomplete query`, "err");
          addLog(
            `${shellPrefix} hint: try 'search index=ctf | stats count'`,
            "sys",
          );
        }, 400);

        return;
      }

      // -------------------------
      // STATS QUERY
      // -------------------------
      if (fullCommand === "search index=ctf | stats count") {
        addLog(`${shellPrefix} executing SPL query...`, "sys");

        setTimeout(() => {
          addLog(
            "==============================================================",
            "out",
          );
          addLog(`${shellPrefix} --- SPLUNK JOB RESULT ---`, "sys");
          addLog(`==============================`, "out");
          addLog(
            `${shellPrefix} auth        -> 120 events (authentication logs)`,
            "out",
          );
          addLog(
            `${shellPrefix} web         -> 340 events  (HTTP traffic)`,
            "out",
          );
          addLog(
            `${shellPrefix} scan_nmap   -> 15 events (network reconnaissance)`,
            "out",
          );
          addLog(
            `${shellPrefix} gobuster    -> 220 events (directory enumeration)`,
            "out",
          );
          addLog(
            `${shellPrefix} endpoint_telemetry    -> 3 events (meterpreter / post-exploitation)`,
            "out",
          );
          addLog(
            `==============================================================`,
            "out",
          );
        }, 500);

        return;
      }

      if (cmd.startsWith("search index=ctf sourcetype=")) {
        const sourcetype = cmd.split("sourcetype=")[1]?.trim();

        addLog(`${shellPrefix} executing SPL query...`, "sys");

        setTimeout(() => {
          if (sourcetype === "auth") {
            addLog(
              `==============================================================`,
              "out",
            );
            addLog(`${shellPrefix} --- SPLUNK AUTH_LOGS ANALYSIS ---`, "out");
            addLog(`${shellPrefix} 120 events (authentication logs)`, "out");
            addLog(`${shellPrefix} suspicious login attempts detected`, "out");
            return;
          }

          if (sourcetype === "web") {
            addLog(
              `==============================================================`,
              "out",
            );
            addLog(`${shellPrefix} --- SPLUNK WEB_TRAFFIC ANALYSIS ---`, "out");
            addLog(`${shellPrefix} 340 events (HTTP traffic)`, "out");
            addLog(
              `${shellPrefix} directory enumeration activity detected`,
              "out",
            );
            return;
          }

          if (sourcetype === "scan_nmap") {
            addLog(
              `==============================================================`,
              "out",
            );
            addLog(`${shellPrefix} --- SPLUNK NMAP_SCAN ANALYSIS---`, "out");
            addLog(`${shellPrefix} 15 events (network reconnaissance)`, "out");
            addLog(`${shellPrefix} SMB port 445 exposed`, "out");
            return;
          }

          if (sourcetype === "gobuster") {
            addLog(
              `==============================================================`,
              "out",
            );
            addLog(`${shellPrefix} --- SPLUNK GOBUSTER ANALYSIS ---`, "out");
            addLog(`${shellPrefix} 220 events (directory enumeration)`, "out");
            addLog(`${shellPrefix} /admin /dev discovered`, "out");
            return;
          }

          if (sourcetype === "endpoint_telemetry") {
            setTimeout(() => {
              addLog(
                "==============================================================",
                "out",
              );
              addLog(`${shellPrefix} --- SPLUNK ENDPOINT ANALYSIS ---`, "out");
              addLog(
                "==============================================================",
                "out",
              );

              addLog(
                `${shellPrefix} timestamp=02:14:33 alert="Meterpreter Activity Detected" severity=critical`,
                "out",
              );
              addLog(
                `${shellPrefix} src_ip=45.83.122.91 dst_host=WIN-SRV01 user=guest`,
                "out",
              );
              addLog(
                `${shellPrefix} payload=windows/x64/meterpreter/reverse_tcp`,
                "out",
              );
              addLog(
                `${shellPrefix} outbound_connection=45.83.122.91:4444`,
                "out",
              );

              addLog(
                `${shellPrefix} event_type=process_migration pid=396 target=lsass.exe`,
                "out",
              );
              addLog(
                `${shellPrefix} token_impersonation=SYSTEM integrity_level=High`,
                "out",
              );

              addLog(
                `${shellPrefix} event_type=privilege_escalation status=confirmed`,
                "out",
              );

              addLog(
                "==============================================================",
                "out",
              );

              setTimeout(() => {
                addLog(`${shellPrefix} ATTACKER_IP = 45.83.122.91`, "err");

                setTimeout(() => {
                  addLog(`${shellPrefix} FLAG{WORM_ILOVEYOU}`, "sys");
                }, 1400);
              }, 1000);
            }, 100);
            return;
          }

          addLog(
            `${shellPrefix} ERROR: unknown sourcetype '${sourcetype}'`,
            "err",
          );
          addLog(
            `${shellPrefix} hint: use auth, web, scan_nmap, gobuster, endpoint_telemetry`,
            "sys",
          );
        }, 600);

        return;
      }

      // -------------------------
      // GENERIC SEARCH ERROR
      // -------------------------
      if (fullCommand.startsWith("search")) {
        addLog(`${shellPrefix} executing SPL query...`, "sys");

        setTimeout(() => {
          addLog(
            `${shellPrefix} ERROR: invalid or unsupported SPL syntax`,
            "err",
          );
        }, 400);

        return;
      }

      // -------------------------
      // FALLBACK
      // -------------------------
      addLog(`${shellPrefix} ERROR: unknown command`, "err");
      addLog(`${shellPrefix} use 'help' to list available SPL commands`, "sys");
      return;
    }

    // METERPRETER SESSION
    else if (remoteSession?.type === "meterpreter") {
      const shellPrefix = `meterpreter >`;

      if (command === "help") {
        addLog(
          `${shellPrefix} Session Commands: ls, cat, getuid, sysinfo, ps, migrate [PID]`,
          "sys",
        );
        return;
      }

      if (command === "ls") {
        const files = currentData.meterpreterFiles["/"];
        addLog(`meterpreter > ${files.join("    ")}`, "out");
        return;
      }

      if (command === "cat") {
        const file = args[1];
        if (!file) {
          addLog("meterpreter > usage: cat [file]", "err");
          return;
        }

        if (file === "readme.txt") {
          addLog("meterpreter > ===============================", "out");
          addLog(
            "meterpreter > Congratulations, you now have a Meterpreter session.",
            "out",
          );
          addLog(
            `meterpreter > Connected target : ${remoteSession.host}`,
            "out",
          );
          addLog("meterpreter > Current privilege level : GUEST USER", "out");
          addLog("meterpreter >", "out");
          addLog(
            "meterpreter > Your objective is to escalate privileges.",
            "out",
          );
          addLog("meterpreter >", "out");
          addLog("meterpreter > Suggested reconnaissance commands:", "out");
          addLog(
            "meterpreter > - getuid (show current user and privilege level)",
            "out",
          );
          addLog(
            "meterpreter > - sysinfo (display system information of the target)",
            "out",
          );
          addLog(
            "meterpreter > - ps (list running processes to identify privilege escalation targets)",
            "out",
          );
          addLog(
            "meterpreter > - migrate [PID] (move session to another process to inherit its privileges)",
            "out",
          );
          addLog("meterpreter >", "out");
          addLog(
            "meterpreter > Hint: privilege escalation will require process migration.",
            "sys",
          );
          addLog("meterpreter > ===============================", "out");
          return;
        }
        // FLAG.TXT
        if (file === "flag.txt") {
          if (meterpreterState.integrity !== "System") {
            addLog(
              "meterpreter > Access denied: System privileges required",
              "err",
            );
            return;
          }
          addLog(
            `meterpreter > [POST-EXPLOITATION] persistence deployed`,
            "sys",
          );
          addLog(`meterpreter > payload installed: updater.exe`, "out");
          addLog(
            `meterpreter > location: C:\\Users\\Public\\updater.exe`,
            "out",
          );
          addLog(`meterpreter > FLAG{${currentData.flag}}`, "out");
          return;
        }
        // METERPRETER FILES
        const content = currentData.meterpreterFiles[file];
        if (!content) {
          addLog(`meterpreter > cat: ${file}: No such file`, "err");
          return;
        }
        addLog(`meterpreter > ${content}`, "out");
        return;
      }
      // GETUID
      if (command === "getuid") {
        addLog(
          `${shellPrefix} Server username: ${meterpreterState.user}`,
          "out",
        );

        addLog(
          `${shellPrefix} Integrity level: ${meterpreterState.integrity}`,
          "out",
        );

        return;
      }
      // SYSINFO
      if (command === "sysinfo") {
        addLog(`${shellPrefix} OS: Windows 7 (Build 7601)`, "out");
        addLog(`${shellPrefix} Architecture: x64`, "out");

        addLog(
          `${shellPrefix} Hint: Security Subsystem: LSASS service running`,
          "sys",
        );
        addLog(
          `${shellPrefix} Hint: security processes as lsass are often used for privilege escalation`,
          "sys",
        );

        return;
      }
      // PS
      if (command === "ps") {
        addLog(`${shellPrefix} Listing processes...`, "out");
        addLog(``, "out");
        addLog(`PID    Name                 User              Notes`, "out");
        addLog(
          `==============================================================`,
          "out",
        );
        addLog(
          `4      System               SYSTEM            [KERNEL EXECUTIVE]`,
          "out",
        );
        addLog(
          `112    smss.exe            SYSTEM            [Session Manager Subsystem]`,
          "out",
        );
        addLog(
          `260    wininit.exe         SYSTEM            [Windows Initialization]`,
          "out",
        );
        addLog(
          `380    services.exe        SYSTEM            [Service Control Manager]`,
          "out",
        );
        addLog(
          `396    lsass.exe           SYSTEM            [Local Security Authority Subsystem]`,
          "out",
        );
        addLog(
          `520    svchost.exe         NETWORK SERVICE   [Service Host Group]`,
          "out",
        );
        addLog(
          `824    explorer.exe        USER              [Windows Shell]`,
          "out",
        );
        addLog(
          `1040   notepad.exe         USER              [Text Editor]`,
          "out",
        );
        addLog(
          `1276   cmd.exe             ADMIN             [Elevated Shell]`,
          "out",
        );
        addLog(
          `==============================================================`,
          "out",
        );
        addLog(
          `${shellPrefix} Use the correct ps for escalate privilege and get acces to flag.txt`,
          "sys",
        );
        return;
      }
      // MIGRATION
      if (command === "migrate") {
        const pid = args[1];
        if (!pid) {
          addLog(`${shellPrefix} usage: migrate <PID>`, "err");
          return;
        }
        addLog(`${shellPrefix} migrating to process ${pid}...`, "sys");
        setTimeout(() => {
          // LSASS = SUCCESS
          if (pid === "396") {
            setMeterpreterState({
              user: "NT AUTHORITY\\SYSTEM",
              integrity: "System",
              migratedPid: pid,
            });
            addLog(`[+] Migration completed successfully`, "out");
            addLog(`${shellPrefix} Privilege escalation successful`, "sys");
            return;
          }

          if (
            pid === "4" ||
            pid === "112" ||
            pid === "260" ||
            pid === "380" ||
            pid === "520" ||
            pid === "824" ||
            pid === "1040" ||
            pid === "1276"
          ) {
            setMeterpreterState({
              user: "GUEST",
              integrity: "LOW",
              migratedPid: pid,
            });
            addLog(`[+] Migration completed successfully`, "out");
            addLog(
              `${shellPrefix} Warning: migrated process does not provide elevated privileges`,
              "sys",
            );
            return;
          }
          addLog(`[!] Invalid PID: ${pid}`, "err");
          addLog(`${shellPrefix} migration failed`, "sys");
        }, 800);

        return;
      }
      // EXIT SESSION
      if (command === "exit") {
        addLog(`Closing Meterpreter session...`, "sys");
        setRemoteSession(null);
        return;
      }
      // FALLBACK
      addLog(`${shellPrefix} command not found: ${command}`, "err");
      return;
    }

    // --- SHELL (NC) ---
    if (remoteSession?.type === "nc") {
      const shellPrefix = `flask-debug@${remoteSession.host}`;

      if (command === "ls") {
        addLog(`${shellPrefix} : flag.txt`, "out");
      } else if (command === "cat") {
        const file = args[1];
        if (file === "flag.txt") {
          addLog(`${shellPrefix} : FLAG{${currentData.flag}}`, "out");
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
      // DEV
      if (remoteSession.user === "dev") {
        if (command === "ls") {
          addLog(`${shellPrefix} : secret.txt flag.txt`, "out");
        } else if (command === "cat") {
          const file = args[1];

          if (file === "flag.txt") {
            addLog(`${shellPrefix} : Flag is not here...`, "out");
            addLog(
              `${shellPrefix} : [!] A big honey pot. Bees loves it...`,
              "sys",
            );
          } else if (file === "secret.txt") {
            addLog(`${shellPrefix} : Verify ssh admin@10.0.2.15`, "out");
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
      // ADMIN
      if (remoteSession.user === "admin") {
        if (command === "hashcat") {
          //
        } else if (command === "ls") {
          addLog(
            `${shellPrefix} : .secrets.txt .hashcat.txt internship.txt`,
            "out",
          );
        } else if (command === "cat") {
          const file = args[1];

          if (file === ".secrets.txt") {
            addLog(
              `${shellPrefix} : FLAG : d4f3c1a5f1c6b6f5b1a6c8a0d8e5f2a1`,
              "out",
            );

            setLeakedHashes([
              { user: "FLAG", hash: "d4f3c1a5f1c6b6f5b1a6c8a0d8e5f2a1" },
            ]);

            addLog(`${shellPrefix} : [!] hashes use advanced format`, "sys");
            addLog(`${shellPrefix} : [!] recommended tool: hashcat`, "sys");
          } else if (file === "internship.txt") {
            addLog(`${shellPrefix} : ====================`, "out");
            addLog(`${shellPrefix} : INTERNSHIP PROFILE DATA`, "out");
            addLog(`${shellPrefix} : ====================`, "out");
            addLog(`${shellPrefix} :`, "out");

            addLog(`${shellPrefix} : NAME: Jérémie Nagi`, "out");
            addLog(
              `${shellPrefix} : ROLE: Intership Cybersecurity AND/OR IA`,
              "out",
            );
            addLog(`${shellPrefix} : EMAIL: jeremie.nagi@epitech.eu`, "out");
            addLog(`${shellPrefix} : ====================`, "out");
            addLog(`${shellPrefix} : IP : 10.0.2.25`, "out");
          } else if (file === ".hashcat.txt") {
            addLog(`${shellPrefix} : Hashcat reference guide`, "out");

            addLog("------------------------", "out");

            addLog(`${shellPrefix} : BASIC USAGE:`, "out");
            addLog(
              `${shellPrefix} : hashcat -m <mode> -a <attack modes> <hashfile> <wordlist_or_mask> [options]`,
              "out",
            );
            addLog(
              `${shellPrefix} : EXAMPLE: hashcat -m 0 -a 3 .secrets.txt ?l?l?l?l -O -w 4`,
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
            addLog(`${shellPrefix} : AVAILABLE WORDLISTS`, "out");
            addLog(`${shellPrefix} : fast.txt`, "out");
            addLog(`${shellPrefix} : medium.txt`, "out");
            addLog(`${shellPrefix} : rockyou.txt`, "out");
            addLog(`${shellPrefix} :`, "out");

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

            addLog(`${shellPrefix} :`, "out");

            addLog(`${shellPrefix} :`, "out");

            addLog(
              `${shellPrefix} : NOTE: choose correct mode and attack type carefully`,
              "sys",
            );
            addLog(`${shellPrefix} : Hash mode detected is : NTLM`, "out");
            addLog(
              `${shellPrefix} : Recommended approach: brute-force with enterprise pattern mask`,
              "out",
            );

            addLog(
              `${shellPrefix} : Use optimized GPU acceleration and maximum worload for better performance`,
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
      if (level == 2) {
        baseCmds =
          "ls, ls -la, cat [file], find [name], grep [text], hint, submit [flag], clear";
      }
      if (level == 3) {
        baseCmds =
          "ls, cat [file], nmap [IP], nc [IP] [PORT], hint, submit [flag], clear";
      }
      if (level == 4) {
        baseCmds =
          "ls, ls -la, cat [file], gobuster [IP], curl [endpoint], sqlmap <url> --data='<post_data>', hint, submit [flag], clear";
      }
      if (level == 5) {
        baseCmds =
          "ls, ls -la cat [file], john [wordlist] [hashfile], ssh [user]@[IP], hashcat [hash], hint, submit [flag], clear";
      }
      if (level == 6) {
        baseCmds = "ls, cat [file], msfconsole, hint, submit [flag], clear";
      }
      if (level == 7) {
        baseCmds = "ls, cat [file], siem, hint, submit [flag], clear";
      }
      if (level == 8) {
        baseCmds =
          "ls, cat [file], strings, netstat [IP], ps, kill [PID], hint, submit [flag], clear";
      }
      if (level == 9) {
        baseCmds =
          "ls, cat [file], firewall [command], waf [command], snort [command], hint, submit [flag], clear";
      }
      addLog(`AVAILABLE COMMANDS : ${baseCmds}`, "sys");
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
      const file = args[1];

      if (!file) {
        addLog("usage: cat [file]", "err");
        return;
      } else if (file === "netstat.txt") {
        addLog("[internal] netstat reference guide", "out");
        addLog("", "out");

        addLog("BASIC USAGE:", "out");
        addLog("netstat [options]", "out");

        addLog("", "out");

        addLog("COMMON OPTIONS:", "out");
        addLog("-a   show all connections and listening ports", "out");
        addLog("-n   display addresses and ports in numerical form", "out");
        addLog("-o   show owning process ID (PID)", "out");

        addLog("", "out");

        addLog("EXAMPLE:", "out");
        addLog("netstat -ano", "out");

        addLog("", "out");

        addLog("NOTE: combining options improves forensic visibility", "sys");
      }
      // JOHN
      if (file === "john.txt") {
        addLog("John reference guide", "out");
        addLog("------------------------", "out");

        addLog("AVAILABLE COMMANDS:", "out");
        addLog("------------", "out");

        addLog("Display hashes file:", "out");
        addLog("cat .hashes.txt", "out");
        addLog("---", "out");

        addLog("Crack hashes using wordlist attack:", "out");
        addLog("john --wordlist <wordlist_path> <hash_file>", "out");
        addLog(
          "Example: john --wordlist=/usr/share/wordlists/fast.txt .hashes.txt",
          "out",
        );
        addLog("---", "out");

        addLog("AVAILABLE WORDLISTS:", "out");
        addLog("------------", "out");
        addLog("/usr/share/wordlists/fast.txt", "out");
        addLog("Low coverage / fast execution", "out");
        addLog("---", "out");
        addLog("/usr/share/wordlists/medium.txt", "out");
        addLog("Balanced speed / success rate", "out");
        addLog("---", "out");
        addLog("/usr/share/wordlists/rockyou.txt", "out");
        addLog("High coverage / slow execution", "out");
        addLog("---", "out");

        addLog("STRATEGY:", "out");
        addLog(
          "  - Prefer high-coverage dictionaries for higher success rate",
          "out",
        );
        addLog("");
        return;
      }
      if (file === "ssh.txt") {
        addLog("SSH reference guide", "out");
        addLog("------------------------", "out");

        addLog("AVAILABLE COMMANDS:", "out");
        addLog("Connect to remote host:", "out");
        addLog("ssh <user>@<ip>", "out");
        addLog("Example: ssh dev@10.0.2.15", "out");

        addLog("DISCOVERED ACCOUNTS:", "out");
        addLog("dev", "out");
        addLog("admin", "out");
        addLog("");

        return;
      }
      // metasploit
      if (file === "metasploit.txt") {
        addLog("Metasploit reference guide", "out");
        addLog("----------------------------------------------", "out");
        addLog(" Start metasploit using 'msfconsole'", "out");
        addLog("STANDARD METASPLOIT WORKFLOW:", "out");
        addLog("  use <exploit/module>", "out");
        addLog("  set RHOSTS <target_ip>", "out");
        addLog("  set LHOST <your_ip> (optional)", "out");
        addLog("  set LPORT 4444 (optional)", "out");
        addLog("  run", "out");
        addLog("---", "out");

        addLog("AVAIBLE EXPLOIT MODULES:", "out");
        addLog(
          "  - exploit/windows/smb/psexec (requires credentials or auth bypass)",
          "out",
        );
        addLog(
          "  - exploit/windows/smb/ms17_010_eternalblue (windows 7)",
          "out",
        );
        addLog(
          "  - exploit/windows/smb/ms08_067_netapi (older windows systems)",
          "out",
        );
        addLog("---", "out");

        addLog("[+] EXAMPLE:", "out");
        addLog("  use exploit/windows/smb/ms08_067_netapi", "out");
        addLog("  set RHOSTS 10.0.2.25", "out");
        addLog("  run", "out");
        addLog("---", "out");
        addLog("  Scan  result", "out");
        addLog("  OS : Windows 7", "out");
        addLog("  Target IP : 10.0.2.25", "out");
        addLog("  Attacker IP : 45.83.122.91", "out");
        addLog(
          "[!] NOTE: Incorrect module or parameters will result in failed session",
          "sys",
        );

        return;
      }

      if (file === "siem.txt") {
        addLog("Splunk reference guide", "out");
        addLog("------------------------", "out");

        addLog("AVAILABLE COMMANDS:", "out");
        addLog("------------", "out");
        addLog("Start Splunk SIEM using 'siem'", "out");
        addLog("---", "out");

        addLog("Run statistics query:", "out");
        addLog("search index=ctf | stats count", "out");
        addLog("---", "out");

        addLog("Investigate log source type:", "out");
        addLog("search index=ctf sourcetype=<type>", "out");
        addLog("Example: search index=ctf sourcetype=gobuster", "out");
        addLog("---", "out");

        addLog("THREAT DETECTION HINTS:", "out");
        addLog("  - Use statistics queries to monitor sourcetype", "out");
        addLog(
          "  - Investigate meterpreter-related events to extract attacker IP",
          "out",
        );
        return;
      }

      if (file === "firewall.txt") {
        addLog("Firewall reference guide", "out");
        addLog("------------------------", "out");
        addLog("AVAILABLE COMMANDS:", "out");
        addLog("------------", "out");
        addLog("Display current firewall rules:", "out");
        addLog("firewall status", "out");
        addLog("---", "out");
        addLog("Allow inbound TCP traffic on a port:", "out");
        addLog("firewall allow <port>", "out");
        addLog("---", "out");
        addLog("Block inbound TCP traffic on a port:", "out");
        addLog("firewall deny <port>", "out");
        addLog("---", "out");
        addLog("Block all traffic from an IP address:", "out");
        addLog("firewall blockip <ip>", "out");
        addLog("---", "out");
        addLog("Display actual ruleset configuration:", "out");
        addLog("  firewall ruleset", "out");
        addLog("---", "out");
        addLog("HARDENING PRACTICES:", "out");
        addLog("  - Keep SSH open (22)", "out");
        addLog("  - Keep HTTP/HTTPS open (80/443)", "out");
        addLog("  - Disable SMB exposure (445)", "out");
        addLog("  - Block exploit framework ports (4444)", "out");
        addLog("  - Disable debug services (5000)", "out");
        addLog("  - Block attacker IP : 45.83.122.91", "out");
        addLog("", "out");

        return;
      }

      if (file === "waf.txt") {
        addLog("Web Application Firewall reference guide", "out");
        addLog("--------------------------------", "out");
        addLog("AVAILABLE COMMANDS:", "out");
        addLog("------------", "out");

        addLog("Display WAF status:", "out");
        addLog("waf status", "out");
        addLog("---", "out");

        addLog("Set rate limiting policy:", "out");
        addLog("waf ratelimit set global <req/min>", "out");
        addLog("Example: waf ratelimit set global 30", "out");
        addLog("---", "out");

        addLog("Enable rule set:", "out");
        addLog("waf ruleset enable <name>", "out");
        addLog("Example: waf ruleset enable xss_basic", "out");
        addLog("---", "out");

        addLog("AVAILABLE RULESETS:", "out");
        addLog("  - sqli_basic", "out");
        addLog("  - xss_basic", "out");
        addLog("  - bot_prot", "out");
        addLog("---", "out");

        addLog("HARDENING PRACTICES:", "out");
        addLog("  - Set rate limiting at 60 req/min", "out");
        addLog(
          "  - Apply specific WAF rules for SQL injection detection",
          "out",
        );
        addLog("", "out");

        return;
      }

      if (file === "snort.txt") {
        addLog("Snort reference guide", "out");
        addLog("--------------------------------", "out");
        addLog("AVAILABLE COMMANDS:", "out");
        addLog("------------", "out");
        addLog("Start Snort engine:", "out");
        addLog("snort start", "out");
        addLog("---", "out");
        addLog("Display Snort status:", "out");
        addLog("snort status", "out");
        addLog("---", "out");
        addLog("Set monitoring interface:", "out");
        addLog("snort interface <iface>", "out");
        addLog("Example: snort interface eth0", "out");
        addLog("---", "out");
        addLog("Enable/disable rule file:", "out");
        addLog("snort rules enable/disable <rule>", "out");
        addLog("Example: snort rules enable malware.rules", "out");
        addLog("---", "out");

        addLog("Configure portscan detection policy:", "out");
        addLog(
          "snort threshold scan --rate <events>/sec --window <sec> --track <src_ip | dst_ip | dst_port>",
          "out",
        );
        addLog(
          "Example: snort threshold scan --rate 10 --window 1 --track dst_ip",
          "out",
        );
        addLog("---", "out");

        addLog("AVAILABLE RULE FILES:", "out");
        addLog("  - local.rules", "out");
        addLog("  - scan.rules", "out");
        addLog("  - malware.rules", "out");
        addLog("---", "out");

        addLog("HARDENING PRACTICES:", "out");
        addLog("  - Start Snort engine", "out");
        addLog("  - Monitor the eth0 interface", "out");
        addLog("  - Enable scan.rules", "out");
        addLog("  - Enable malware.rules", "out");
        addLog(
          "  - Configure port scan detection for 10 events per second using src_ip tracking and a 1s window",
          "out",
        );

        return;
      }

      // fichiers classiques
      if (currentData.files[file]) {
        addLog(currentData.files[file], "out");
      } else {
        addLog(`cat: ${file}: No such file or directory`, "err");
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

      if (!pattern) {
        return addLog("Usage: grep [texte]", "err");
      }

      const results = Object.entries(currentData.files)
        .filter(([name, content]) =>
          content.toLowerCase().includes(pattern.toLowerCase()),
        )
        .map(([name]) => name);

      if (results.length > 0) {
        results.forEach((res) => addLog(`Match found in: ${res}`, "out"));
      } else {
        addLog("No match found.", "sys");
      }
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
          addLog("Logged in as flask-debug@10.0.2.15>", "sys");
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

      addLog("Enumerating web directories on 10.0.2.15...", "sys");

      const logs = [
        ["Found: /api/login (Status: 200)", "out"],
        ["Found: /admin (Status: 403)", "out"],
        ["Scan complete.", "sys"],
        [
          "Interact with endpoints using curl to inspect request/response behavior",
          "sys",
        ],
        ["Verify possible SQL injection behavior", "sys"],
      ];

      logs.forEach(([msg, type], index) => {
        setTimeout(() => addLog(msg, type), 600 + index * 450);
      });
    }
    // CURL
    else if (command === "curl") {
      if (level < 4) return addLog("curl: command not found", "err");

      const endpoint = args[1];
      if (!endpoint) return addLog("Usage: curl [endpoint]", "err");

      if (endpoint === "/admin") {
        addLog("HTTP/1.1 403 Forbidden", "err");
        addLog("Access denied", "out");
        return;
      }

      if (endpoint === "/api/login") {
        addLog("", "out");
        addLog("POST /api/login", "out");
        addLog("Content-Type: application/x-www-form-urlencoded", "out");
        addLog("username=admin&password=test", "out");
        addLog("", "out");

        addLog("[!] SECURITY NOTE:", "sys");
        addLog("[!] Vulnerable parameter detected: username", "out");
        addLog("[!] Suggested tool: sqlmap", "out");
        addLog(
          "[!] Example: sqlmap http://10.0.2.15/api/login --data='username=admin&password=test'",
          "out",
        );

        return;
      }

      addLog("HTTP/1.1 404 Not Found", "err");
    }

    // --- SQLMAP (NIVEAU 4) ---
    else if (command === "sqlmap") {
      if (level < 4) return addLog("sqlmap: command not found", "err");

      const fullArgs = args.slice(1);

      if (fullArgs.length < 2) {
        addLog("Usage: sqlmap <url> --data='key=value&key2=value2'", "err");
        addLog(
          "Example: sqlmap http://10.0.2.15/api/login --data='username=admin&password=test'",
          "sys",
        );
        return;
      }

      const url = fullArgs[0];
      const options = fullArgs.slice(1).join(" ");
      if (!url.startsWith("http://10.0.2.15/")) {
        addLog("[!] Invalid target host", "err");
        addLog("[!] Verify complete url 'http://10.0.2.15/*'", "sys");
        return;
      }
      const allowedTargets = ["http://10.0.2.15/api/login"];
      if (!allowedTargets.includes(url)) {
        addLog("[!] Target not found (404)", "err");
        return;
      }
      const dataMatch = options.match(/--data='([^']+)'/);
      if (!dataMatch) {
        addLog("[!] Missing or malformed --data parameter", "err");
        addLog("Expected format: --data='username=admin&password=test'", "sys");
        return;
      }
      const postData = dataMatch[1];
      if (!postData.includes("=")) {
        addLog("[!] Invalid POST data format", "err");
        return;
      }

      const params = postData
        .split("&")
        .filter((p) => p.includes("="))
        .map((p) => p.split("=")[0]);

      addLog("[*] Starting sqlmap engine...", "sys");
      addLog(`[+] Target: ${url}`, "out");
      addLog(`[+] POST data detected`, "out");
      addLog(`[+] Parameters: ${params.join(", ")}`, "out");

      setTimeout(() => {
        setTimeout(() => {
          setTimeout(() => {
            addLog("[+] Confirmed: Boolean-based SQL injection", "out");

            addLog("[*] Enumerating database...", "out");

            setTimeout(() => {
              addLog("[*] Found table: users", "out");

              setTimeout(() => {
                setTimeout(() => {
                  addLog("[+] Dump successful", "sys");
                  addLog(`[+] FLAG{${currentData.flag}}`, "out");
                }, 900);
              }, 900);
            }, 900);
          }, 800);
        }, 800);
      }, 600);
    }

    // JOHN
    else if (command === "john") {
      if (level < 5) return addLog("john: command not found", "err");

      const hashFile = args.find(
        (a) => a.endsWith(".txt") && !a.startsWith("--"),
      );

      let wordlistPath = null;

      const wordlistIndex = args.findIndex(
        (a) => a === "--wordlist" || a.startsWith("--wordlist="),
      );

      if (wordlistIndex !== -1) {
        const arg = args[wordlistIndex];

        if (arg.includes("=")) {
          wordlistPath = arg.split("=")[1];
        } else {
          wordlistPath = args[wordlistIndex + 1];
        }
      }

      if (!wordlistPath || !hashFile) {
        addLog("Usage: john --wordlist <path> <hash_file>", "err");
        addLog(
          "Example: john --wordlist /usr/share/wordlists/fast.txt .hashes.txt",
          "sys",
        );
        return;
      }

      if (hashFile !== ".hashes.txt") {
        addLog(`john: ${hashFile}: No such file`, "err");
        return;
      }

      const validWordlists = [
        "/usr/share/wordlists/fast.txt",
        "/usr/share/wordlists/medium.txt",
        "/usr/share/wordlists/rockyou.txt",
      ];

      if (!validWordlists.includes(wordlistPath)) {
        addLog(`john: ${wordlistPath}: No such file or directory`, "err");
        return;
      }

      addLog("[*] Initializing John the Ripper...", "sys");

      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

      const runCrack = async (user, hash, password, success) => {
        addLog("[*] Loaded 2 password hashes", "sys");
        await sleep(300);

        addLog(`[*] Loading hash: ${user} (${hash})`, "sys");
        await sleep(400);

        addLog(`[*] Using wordlist: ${wordlistPath}`, "sys");
        await sleep(400);

        addLog("[*] Starting dictionary attack...", "sys");
        await sleep(500);

        const progress = [12, 31, 48, 66, 83, 97];

        for (const p of progress) {
          addLog(`[*] Progress: ${p}%`, "sys");
          await sleep(250);
        }

        if (!success) {
          addLog(`[!] ${user}: password not found in wordlist`, "err");
          return;
        }

        addLog(`[+] ${user}:${password} FOUND`, "out");
      };

      (async () => {
        if (wordlistPath.includes("rockyou")) {
          await runCrack(
            "admin",
            "39678cb269782223fb548ea91d07d540",
            "JTR13012!!",
            true,
          );

          await sleep(600);

          await runCrack(
            "dev",
            "aba0b545a32585915e3318b92d987bfa",
            "jtr13",
            true,
          );

          addLog("[*] Cracking complete", "sys");

          setCrackedPasswords({
            admin: "JTR13012!!",
            dev: "jtr13",
          });

          setLevel5State((prev) => ({ ...prev, cracked: true }));
        } else if (
          wordlistPath.includes("fast") ||
          wordlistPath.includes("medium")
        ) {
          await runCrack(
            "dev",
            "aba0b545a32585915e3318b92d987bfa",
            "jtr13",
            true,
          );

          await sleep(600);

          await runCrack(
            "admin",
            "39678cb269782223fb548ea91d07d540",
            null,
            false,
          );

          addLog("[*] Cracking complete (fast mode)", "sys");

          setCrackedPasswords({
            dev: "jtr13",
          });

          setLevel5State((prev) => ({ ...prev, cracked: true }));
        }
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

      // VALIDATION
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
          // DICTIONARY ATTACK
          if (attack === "0") {
            const wordlist = argsStr.find(
              (a) =>
                a.includes("rockyou") ||
                a.includes("fast") ||
                a.includes("medium"),
            );

            if (!wordlist || wordlist.startsWith("-")) {
              return addLog("[!] invalid wordlist", "err");
            }

            addLog("[*] starting dictionary attack...", "sys");
            addLog(`[*] using wordlist: ${wordlist}`, "sys");

            const progress = [14, 29, 47, 62, 80, 96];

            progress.forEach((p, i) => {
              setTimeout(() => {
                addLog(`[*] progress: ${p}%`, "sys");
              }, i * 250);
            });

            setTimeout(() => {
              addLog("[!] no matches found in wordlist", "err");
              addLog("[!] password not in common dictionaries", "out");
              addLog("[!] recommendation: use mask attack (-a 3)", "out");
            }, 1800);
          }

          // BRUTE FORCE MASK
          else if (attack === "3") {
            if (!mask) {
              return addLog("[!] invalid mask pattern", "err");
            }

            const tokens = (mask.match(/\?[ulds]/g) || []).length;

            const hasOptimized = argsStr.includes("-O");
            const hasWorkload =
              argsStr.includes("-w") || argsStr.includes("-w4");

            if (!hasOptimized || !hasWorkload) {
              return addLog("[!] invalid GPU options", "err");
            }
            if (tokens < 12) {
              return addLog(
                "[!] mask too weak (high complexity password expected ~15 chars)",
                "err",
              );
            }

            addLog("[*] starting brute-force (mask attack)...", "sys");
            addLog("[*] analyzing password structure...", "sys");

            setTimeout(() => {
              addLog(`[*] testing mask: ${mask}`, "sys");

              setTimeout(() => {
                // MASK VALIDATION
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
                // SUCCESS PATH
                addLog("[*] high entropy credential detected", "sys");
                addLog("[*] GPU acceleration options (-O, -w 4)", "sys");

                setTimeout(() => {
                  addLog("[+] hash successfully cracked", "out");

                  addLog(`FLAG{${currentData.flag}}`, "out");
                }, 1200);
              }, 800);
            }, 600);
          }
          // INVALID ATTACK MODE
          else {
            addLog("[!] invalid attack mode", "err");
            addLog("[!] use -a 0 (dictionary) or -a 3 (mask)", "sys");
          }
        }, 1000);
      }, 600);
    }
    // METASPLOIT
    else if (command === "msfconsole") {
      if (level < 6) {
        return addLog("msfconsole: command not found", "err");
      }

      addLog("[*] Starting Metasploit Framework...", "sys");

      setTimeout(() => {
        addLog("Metasploit Framework 6.4.0", "out");
        addLog(
          "Msfconsole Commands: ls, cat [file], use, set, run, exit",
          "sys",
        );

        setRemoteSession({
          type: "msfconsole",
          prompt: "msf6 >",
        });

        setMsfState({
          module: null,
          options: {},
        });
      }, 1200);
    } else if (remoteSession?.type === "msfconsole") {
      if (command === "exit") {
        setRemoteSession(null);

        setMsfState({
          module: null,
          options: {},
        });

        addLog("[*] Leaving Metasploit Framework...", "sys");
        return;
      } else if (command === "use") {
        const module = args.slice(1).join(" ");

        const validModules = [
          "exploit/windows/smb/psexec",
          "exploit/windows/smb/ms17_010_eternalblue",
          "exploit/windows/smb/ms08_067_netapi",
        ];

        if (!module) {
          return addLog("[!] usage: use <exploit/module>", "err");
        }

        if (!validModules.includes(module)) {
          return addLog("[!] unknown exploit module", "err");
        }

        setMsfState({
          module,
          options: {},
        });

        addLog(`[*] module loaded: ${module}`, "sys");
      } else if (command === "set") {
        const key = args[1]?.toUpperCase();
        const value = args.slice(2).join(" ");

        if (!key || !value) {
          return addLog("[!] usage: set <OPTION> <VALUE>", "err");
        }

        const allowedOptions = ["RHOSTS", "LHOST", "LPORT"];

        if (!allowedOptions.includes(key)) {
          return addLog("[!] unknown option", "err");
        }

        // -------------------------
        // VALIDATE RHOSTS
        // -------------------------
        if (key === "RHOSTS") {
          if (value !== "10.0.2.25") {
            return addLog("[!] target unreachable", "err");
          }
        }

        // -------------------------
        // VALIDATE LHOST
        // -------------------------
        if (key === "LHOST") {
          if (value !== "45.83.122.91") {
            return addLog(
              "[!] invalid LHOST: expected attacker IP or leave unset",
              "err",
            );
          }
        }

        // -------------------------
        // VALIDATE LPORT
        // -------------------------
        if (key === "LPORT") {
          if (value !== "4444") {
            return addLog(
              "[!] invalid LPORT: expected 4444 or leave unset",
              "err",
            );
          }
        }

        setMsfState((prev) => ({
          ...prev,
          options: {
            ...prev.options,
            [key]: value,
          },
        }));

        addLog(`[*] ${key} => ${value}`, "sys");
      } else if (command === "run") {
        const module = msfState?.module;
        const opts = msfState?.options || {};

        const rhosts = opts["RHOSTS"];

        if (!module) {
          return addLog("[!] no exploit module selected", "err");
        }

        if (!rhosts) {
          return addLog("[!] RHOSTS not configured", "err");
        }

        addLog("[*] Launching exploit...", "sys");

        setTimeout(() => {
          if (module === "exploit/windows/smb/ms17_010_eternalblue") {
            addLog("[+] SMBv1 vulnerability detected", "out");
            addLog("[+] Target appears vulnerable to MS17-010", "out");

            setTimeout(() => {
              addLog("[*] Sending exploit payload...", "out");

              setTimeout(() => {
                addLog("[+] Meterpreter session 1 opened", "out");

                setRemoteSession({
                  type: "meterpreter",
                  host: rhosts,
                });

                addLog("meterpreter > Session established", "sys");
                addLog(
                  "meterpreter > Type 'help' for available commands",
                  "sys",
                );
              }, 1200);
            }, 1000);

            return;
          }

          if (module === "exploit/windows/smb/psexec") {
            addLog("[!] exploit failed", "err");
            addLog("[!] valid SMB credentials required", "out");
            return;
          }

          if (module === "exploit/windows/smb/ms08_067_netapi") {
            addLog("[!] exploit failed", "err");
            addLog("[!] target does not appear vulnerable", "out");
            addLog("[!] exploit designed for older Windows systems", "out");
            return;
          }

          addLog("[!] exploit execution failed", "err");
        }, 1200);
      } else {
        addLog("[!] unknown msfconsole command", "err");
      }
    }
    // SIEM
    else if (command === "siem") {
      setRemoteSession({
        type: "siem",
        host: "splunk-sim",
      });

      addLog("[+] Splunk SIEM initialized", "sys");
      addLog(
        "[+] Avaible comnands : ls, cat [file], search <query> <command>, exit",
        "sys",
      );

      return;
    } else if (command === "strings") {
      const file = args[1];

      if (!file) {
        addLog("usage: strings [file]", "err");
        return;
      }

      if (file === "updater.exe") {
        addLog("[*] strings analysis: updater.exe", "sys");

        setTimeout(() => {
          addLog(
            "[*] updater.exe : PE32 executable (possible packed payload)",
            "sys",
          );
          addLog("C:\\Users\\Public\\updater.exe", "out");
          addLog("[IOC] C2: http://45.83.122.91/payload.bin", "out");
          addLog("[IOC] meterpreter_reverse_tcp (Metasploit session)", "out");
          addLog("[IOC] process injection indicators:", "out");
          addLog("  - CreateProcessA (execution chain)", "out");
          addLog("  - VirtualAllocEx (remote memory allocation)", "out");
          addLog(
            "[IOC] execution context: SYSTEM (post-migration via lsass.exe)",
            "out",
          );
        }, 600);
        return;
      }

      addLog(`strings: ${file}: No such file`, "err");
    }
    // NETSTAT
    else if (command === "netstat") {
      const allowedFlags = new Set(["a", "n", "o"]);
      const flags = new Set();

      for (const arg of args) {
        if (arg.startsWith("-")) {
          const chars = arg.slice(1).split("");

          for (const f of chars) {
            if (!allowedFlags.has(f)) {
              addLog(`[!] Invalid option: -${f}`, "err");
              addLog("usage: netstat [-a] [-n] [-o]", "err");
              return;
            }

            flags.add(f);
          }
        }
      }

      const hasA = flags.has("a");
      const hasN = flags.has("n");
      const hasO = flags.has("o");

      const connectionsDNS = [
        "TCP    10.0.2.25:49712        login.microsoftonline.com:443        ESTABLISHED     824",
        "TCP    10.0.2.25:49781        www.google.com:443                  TIME_WAIT       824",
        "TCP    10.0.2.25:49822        windows-security-update.com:4444 ESTABLISHED     1337",
      ];

      const connectionsIP = [
        "TCP    10.0.2.25:49712        52.97.132.18:443       ESTABLISHED     824",
        "TCP    10.0.2.25:49781        172.217.22.14:443      TIME_WAIT       824",
        "TCP    10.0.2.25:49822        45.83.122.91:4444      ESTABLISHED     1337",
      ];

      const listening = [
        "TCP    0.0.0.0:445            0.0.0.0:0              LISTENING       4",
        "TCP    127.0.0.1:49152        0.0.0.0:0              LISTENING       396",
        "UDP    0.0.0.0:68             *:*                    LISTENING       520",
      ];

      const printHeader = (pid) => {
        addLog("Active Connections", "out");
        addLog("", "out");

        addLog(
          pid
            ? "Proto  Local Address          Foreign Address        State           PID"
            : "Proto  Local Address          Foreign Address        State",
          "out",
        );

        addLog(
          "==========================================================================",
          "out",
        );
      };

      const printListening = (pid) => {
        listening.forEach((l) => {
          if (pid) addLog(l, "out");
          else addLog(l.replace(/\s+\d+$/, ""), "out");
        });
      };

      const printConnections = (pid, useDNS) => {
        const data = useDNS ? connectionsDNS : connectionsIP;

        data.forEach((c) => {
          if (pid) {
            addLog(c, "out");
          } else {
            addLog(c.replace(/\s+\d+$/, ""), "out");
          }
        });
      };

      // =========================
      // netstat (no args)
      // =========================
      if (!hasA && !hasN && !hasO) {
        printHeader(false);
        printConnections(false, true);

        addLog("", "out");
        addLog(
          "[*] Identify the process associated with the attacker IP using appropriate options",
          "sys",
        );
        return;
      }

      // =========================
      // -n
      // =========================
      if (hasN && !hasA && !hasO) {
        printHeader(false);
        printConnections(false, false);
        addLog(
          "[*] Identify the process associated with the attacker IP using appropriate options",
          "sys",
        );
        return;
      }

      // =========================
      // -a
      // =========================
      if (hasA && !hasN && !hasO) {
        printHeader(false);
        printListening(false);
        printConnections(false, true);

        addLog(
          "[*] Identify the process associated with the attacker IP using appropriate options",
          "sys",
        );
        return;
      }

      // =========================
      // -o
      // =========================
      if (hasO && !hasA && !hasN) {
        printHeader(true);
        printConnections(true, true);
        addLog(
          "[*] Identify the process associated with the attacker IP using appropriate options",
          "sys",
        );
        return;
      }

      // =========================
      // -an
      // =========================
      if (hasA && hasN && !hasO) {
        printHeader(false);
        printListening(false);
        printConnections(false, false);
        addLog(
          "[*] Identify the process associated with the attacker IP using appropriate options",
          "sys",
        );
        return;
      }

      // =========================
      // -ao
      // =========================
      if (hasA && hasO && !hasN) {
        printHeader(true);
        printListening(true);
        printConnections(true, true);
        addLog(
          "[*] Identify the process associated with the attacker IP using appropriate options",
          "sys",
        );
        return;
      }

      // =========================
      // -on
      // =========================
      if (hasO && hasN && !hasA) {
        printHeader(true);
        printConnections(true, false);
        addLog(
          "[*] Identify the process associated with the attacker IP using appropriate options",
          "sys",
        );
        return;
      }

      // =========================
      // -ano
      // =========================
      if (hasA && hasN && hasO) {
        setTimeout(() => {
          addLog("Active Connections", "out");
          addLog("", "out");

          printHeader(true);
          printListening(true);
          printConnections(true, false);

          addLog(
            "==========================================================================",
            "out",
          );
        }, 700);

        return;
      }

      addLog("usage: netstat [-a] [-n] [-o]", "err");
    }
    // PS
    else if (command === "ps") {
      if (level < 6) {
        return addLog("ps: command not found", "err");
      }

      addLog("[*] Enumerating active processes...", "sys");

      setTimeout(() => {
        addLog("PID     PROCESS               USER", "out");
        addLog(
          "==========================================================",
          "out",
        );
        addLog("4       System               SYSTEM ", "out");
        addLog("112     smss.exe             SYSTEM ", "out");
        addLog("260     wininit.exe          SYSTEM ", "out");
        addLog("380     services.exe         SYSTEM ", "out");
        addLog("396     lsass.exe            SYSTEM ", "out");
        addLog("520     svchost.exe          NETWORK SERVICE", "out");
        addLog("824     explorer.exe         USER", "out");
        addLog("1276     cmd.exe             USER", "out");
        addLog("1337    svchost.exe          SYSTEM", "out");
        addLog(
          "[!] Payload probably renamed for stealth and persistence.",
          "err",
        );
        addLog(
          "[*] Terminate malicious persistence process using kill <PID>",
          "sys",
        );
      }, 700);

      return;
    } // KILL PROCESS
    else if (command === "kill") {
      if (level < 6) {
        return addLog("kill: command not found", "err");
      }

      const pid = args[1];

      if (!pid) {
        return addLog("usage: kill [PID]", "err");
      }

      if (pid !== "1337") {
        return addLog(
          `[!] process ${pid} is not the malicious persistence process`,
          "err",
        );
      }

      addLog(`[*] terminating process ${pid}...`, "sys");

      const logs = [
        { msg: "[+] updater.exe successfully terminated", type: "out" },
        { msg: "[+] persistence removed", type: "out" },
        { msg: "[+] outbound C2 communication stopped", type: "out" },
        { msg: "[+]", type: "sys" },
        { msg: "[+]", type: "sys" },
        { msg: "[+]", type: "sys" },
        { msg: `[+] FLAG{${currentData.flag}}`, type: "sys" },
      ];

      logs.forEach((log, i) => {
        setTimeout(
          () => {
            addLog(log.msg, log.type);
          },
          (i + 1) * 500,
        );
      });

      return;
    }
    // FIREWALL
    else if (command === "firewall") {
      const action = args[1];
      const target = args[2];

      // =========================
      // STATUS
      // =========================
      if (action === "status") {
        addLog("Firewall status:", "sys");

        const ports = [22, 80, 443, 445, 4444, 5000];

        ports.forEach((port) => {
          const rule = hardeningState.firewall.rules
            .slice()
            .reverse()
            .find((r) => r.port === port);

          let status = "ALLOW";

          if (rule?.action === "DENY") status = "DENY";
          if (rule?.action === "ALLOW") status = "ALLOW";

          addLog(`${port}/tcp    ${status}`, "out");
        });

        // BLOCKED IPS
        if (hardeningState.firewall.blockedIps.length > 0) {
          addLog("BLOCKED IPS:", "sys");

          hardeningState.firewall.blockedIps.forEach((ip) => {
            addLog(`- ${ip}`, "out");
          });
        }

        // CONFIG VALIDATION
        const requiredPorts = {
          22: "ALLOW",
          80: "ALLOW",
          443: "ALLOW",
          445: "DENY",
          4444: "DENY",
          5000: "DENY",
        };

        const firewallOk = Object.entries(requiredPorts).every(
          ([port, expected]) => {
            const rule = hardeningState.firewall.rules
              .slice()
              .reverse()
              .find((r) => r.port === Number(port));

            const current = rule?.action || "ALLOW";

            return current === expected;
          },
        );

        addLog(
          `${
            firewallOk
              ? "Firewall configuration completed"
              : "Complete firewall configuration"
          }`,
          firewallOk ? "sys" : "err",
        );

        return;
      }

      // =========================
      // DENY
      // =========================
      if (action === "deny") {
        if (!target) {
          addLog("usage: firewall deny <port>", "err");
          return;
        }

        const port = parseInt(target);

        if (isNaN(port) || port <= 0) {
          addLog("[!] invalid port", "err");
          return;
        }

        setHardeningState((prev) => {
          const next = {
            ...prev,
            firewall: {
              ...prev.firewall,
              rules: [
                ...prev.firewall.rules,
                {
                  action: "DENY",
                  protocol: "tcp",
                  port,
                  source: "ANY",
                },
              ],
            },
          };
          const evaluated = evaluateAll(next);

          checkFlagStatus(evaluated);
          return next;
        });

        addLog(`[+] Rule added: DENY tcp/${port} from ANY`, "out");

        // RECOMMENDED PORTS
        if ([445, 4444, 5000].includes(port)) {
          addLog("[+] recommended blocking policy applied", "sys");
        } else {
          addLog("[!] verify exposed service necessity", "err");
        }

        return;
      }

      // =========================
      // ALLOW
      // =========================
      if (action === "allow") {
        if (!target) {
          addLog("usage: firewall allow <port>", "err");
          return;
        }

        const port = parseInt(target);

        if (isNaN(port) || port <= 0) {
          addLog("[!] invalid port", "err");
          return;
        }

        setHardeningState((prev) => {
          const filtered = prev.firewall.rules.filter(
            (r) => !(r.port === port && r.action === "DENY"),
          );

          const next = {
            ...prev,
            firewall: {
              ...prev.firewall,
              rules: [
                ...filtered,
                {
                  action: "ALLOW",
                  protocol: "tcp",
                  port,
                  source: "ANY",
                },
              ],
            },
          };

          const evaluated = evaluateAll(next);

          checkFlagStatus(evaluated);

          return next;
        });

        addLog(`[+] Rule added: ALLOW tcp/${port} from ANY`, "out");

        if ([22, 80, 443].includes(port)) {
          addLog("[+] trusted service exposed", "sys");
        } else {
          addLog("[!] verify security exposure", "err");
        }

        return;
      }

      // =========================
      // BLOCK IP
      // =========================
      if (action === "blockip") {
        if (!target) {
          addLog("usage: firewall blockip <ip>", "err");
          return;
        }

        const ip = target;
        const attackerIP = "45.83.122.91";

        if (ip !== attackerIP) {
          addLog("[!] This is not the attacker IP", "err");
          return;
        }

        setHardeningState((prev) => {
          const next = {
            ...prev,
            firewall: {
              ...prev.firewall,
              blockedIps: [...prev.firewall.blockedIps, ip],
            },
          };

          const evaluated = evaluateAll(next);

          checkFlagStatus(evaluated);

          return next;
        });

        addLog(`[+] IP blocked: ${ip}`, "out");
        addLog("[+] attacker IP blocked", "sys");

        return;
      }

      // =========================
      // RULESET
      // =========================
      if (action === "ruleset") {
        addLog("Current firewall ruleset:", "sys");

        if (!hardeningState.firewall.rules.length) {
          addLog("No explicit firewall rules configured", "err");
          return;
        }

        hardeningState.firewall.rules.forEach((r, i) => {
          addLog(
            `${i + 1}. ${r.action} ${r.protocol}/${r.port} from ${r.source}`,
            "out",
          );
        });

        return;
      }

      // =========================
      // FALLBACK
      // =========================
      addLog("usage: firewall [status|allow|deny|ruleset|blockip]", "err");
    }

    // =========================
    // WAF
    // =========================
    else if (command === "waf") {
      const action = args[1];

      // =========================
      // STATUS
      // =========================
      if (action === "status") {
        addLog("WAF status:", "sys");

        // RATE LIMIT VALUE
        addLog(
          `GLOBAL LIMIT   ${
            hardeningState.waf.rateLimitValue
              ? `${hardeningState.waf.rateLimitValue} req/min`
              : "NOT SET"
          }`,
          "out",
        );

        const rateLimitOk = hardeningState.waf.rateLimitValue === 60;
        const sqliEnabled = hardeningState.waf.rulesets?.sqli_basic === true;

        addLog(
          `WAF RULESET    ${sqliEnabled ? "sqli_basic" : "NOT CONFIGURED"}`,
          "out",
        );

        const wafOk = rateLimitOk && sqliEnabled;

        addLog(
          `${
            wafOk ? "WAF configuration completed" : "Complete WAF configuration"
          }`,
          wafOk ? "sys" : "err",
        );

        return;
      }

      // =========================
      // RATELIMIT
      // =========================
      if (action === "ratelimit") {
        const subAction = args[2];
        const scope = args[3];
        const value = args[4];

        if (subAction === "set" && scope === "global") {
          if (!value) {
            return addLog("usage: waf ratelimit set global <req/min>", "err");
          }

          const limit = parseInt(value);

          if (isNaN(limit) || limit <= 0) {
            return addLog("[!] invalid rate limit value", "err");
          }

          const isCorrectPolicy = limit === 60;

          setHardeningState((prev) => {
            const next = {
              ...prev,
              waf: {
                ...prev.waf,
                rateLimit: true,
                rateLimitValue: limit,
              },
              wafConfig:
                prev.waf.rulesets?.sqli_basic && isCorrectPolicy
                  ? "OK"
                  : "INCOMPLETE",
            };

            const evaluated = evaluateAll(next);

            checkFlagStatus(evaluated);

            return next;
          });

          addLog(`[+] global rate limit set to ${limit} req/min`, "out");

          if (isCorrectPolicy) {
            addLog("[+] recommended policy applied", "sys");
          } else {
            addLog("[!] non-compliant policy detected", "err");
            addLog("[!] expected policy: 60 req/min", "sys");
          }

          return;
        }

        return addLog("usage: waf ratelimit set global <req/min>", "err");
      }

      // =========================
      // ENABLE
      // =========================
      if (action === "enable") {
        setHardeningState((prev) => {
          const next = {
            ...prev,
            waf: {
              ...prev.waf,
              enabled: true,
              rulesets: prev.waf.rulesets || {},
              blockedIps: prev.waf.blockedIps || [],
            },
          };

          const evaluated = evaluateAll(next);

          checkFlagStatus(evaluated);

          return next;
        });
      }

      // =========================
      // RULESET
      // =========================
      if (action === "ruleset") {
        const subAction = args[2];
        const name = args[3];

        const allowedRulesets = ["sqli_basic", "xss_basic", "bot_prot"];

        // =========================
        // ENABLE RULESET
        // =========================
        if (subAction === "enable") {
          if (!name) {
            return addLog("usage: waf ruleset enable <name>", "err");
          }

          if (!allowedRulesets.includes(name)) {
            addLog("[!] unknown ruleset", "err");
            addLog("[!] available: sqli_basic, xss_basic, bot_prot", "sys");
            return;
          }

          setHardeningState((prev) => {
            const next = {
              ...prev,
              waf: {
                ...prev.waf,
                rulesets: {
                  ...(prev.waf?.rulesets || {}),
                  [name]: true,
                },
              },
            };

            const sqliEnabled = next.waf.rulesets?.sqli_basic === true;

            next.wafConfig =
              next.waf.rateLimitValue === 60 && sqliEnabled
                ? "OK"
                : "INCOMPLETE";

            const evaluated = evaluateAll(next);

            checkFlagStatus(evaluated);

            return next;
          });

          addLog(`[+] ruleset enabled: ${name}`, "out");

          if (name === "sqli_basic") {
            addLog("[+] SQLi detection patterns loaded", "sys");
            addLog("[+] WAF configuration updated", "sys");
          }

          return;
        }

        return addLog("usage: waf ruleset enable <name>", "err");
      }

      // =========================
      // FALLBACK
      // =========================
      addLog("usage: waf [status|enable|ratelimit|ruleset|blockip]", "err");
    }
    // SNORT
    else if (command === "snort") {
      const action = args[1];
      const target = args[2];

      // function evaluateSnort(next) {
      //   const rules = next.snort?.rules || {};

      //   const snortOk =
      //     next.snort?.enabled &&
      //     next.snort?.interface === "eth0" &&
      //     next.snort?.scanPolicy?.count === 10 &&
      //     next.snort?.scanPolicy?.interval === 1 &&
      //     next.snort?.scanPolicy?.track === "src_ip" &&
      //     rules["scan.rules"] &&
      //     rules["malware.rules"] &&
      //     !rules["local.rules"];

      //   return snortOk ? "OK" : "INCOMPLETE";
      // }
      // =========================
      // STATUS
      // =========================
      if (action === "status") {
        addLog("SNORT IDS STATUS", "sys");

        // ENGINE
        addLog(
          `ENGINE        ${
            hardeningState.snort?.enabled ? "RUNNING" : "STOPPED"
          }`,
          "out",
        );

        // INTERFACE
        addLog(
          `INTERFACE     ${hardeningState.snort?.interface || "NOT SET"}`,
          "out",
        );

        // THRESHOLD
        addLog(
          `SCAN LIMIT    ${
            hardeningState.snort?.scanPolicy
              ? `${hardeningState.snort.scanPolicy.count} events/sec (track=${hardeningState.snort.scanPolicy.track})`
              : "NOT SET"
          }`,
          "out",
        );

        // RULES STATUS
        const rules = hardeningState.snort?.rules || {};

        const requiredRules = ["scan.rules", "malware.rules"];

        const activeRequiredRules = requiredRules.filter((rule) => rules[rule]);

        const activeAllRules = Object.entries(rules)
          .filter(([_, state]) => state)
          .map(([name]) => name);

        addLog("ACTIVATED RULES:", "sys");

        if (activeAllRules.length === 0) {
          addLog("[!] no active rules", "out");
        } else {
          activeAllRules.forEach((rule) => {
            addLog(`- ${rule}`, "out");
          });
        }

        // VALIDATION MESSAGE ONLY FOR REQUIRED RULES
        if (activeRequiredRules.length === requiredRules.length) {
          addLog("[+] required detection rules correctly loaded", "sys");
        } else {
          addLog("[!] required detection rules missing", "err");
        }

        // // FINAL VALIDATION
        // const snortOk =
        //   hardeningState.snort?.enabled &&
        //   hardeningState.snort?.interface === "eth0" &&
        //   hardeningState.snort?.scanPolicy?.count === 10 &&
        //   hardeningState.snort?.scanPolicy?.interval === 1 &&
        //   hardeningState.snort?.scanPolicy?.track === "src_ip" &&
        //   rules["scan.rules"] &&
        //   rules["malware.rules"] &&
        //   !rules["local.rules"];

        // addLog(
        //   snortOk
        //     ? "IDS configuration completed"
        //     : "Complete IDS configuration",
        //   snortOk ? "sys" : "err",
        // );

        return;
      }

      // =========================
      // START ENGINE
      // =========================
      if (action === "start") {
        setHardeningState((prev) => {
          const next = {
            ...prev,
            snort: {
              ...prev.snort,
              enabled: true,
            },
          };

          //next.idsConfig = evaluateSnort(next);

          const evaluated = evaluateAll(next);

          checkFlagStatus(evaluated);

          return next;
        });
        addLog("[+] Snort engine started", "out");
        addLog("[+] packet inspection enabled", "sys");
        return;
      }

      // =========================
      // INTERFACE SET
      // =========================
      if (action === "interface") {
        if (!target) {
          return addLog("usage: snort interface <iface>", "err");
        }

        setHardeningState((prev) => {
          const next = {
            ...prev,
            snort: {
              ...prev.snort,
              interface: target,
            },
          };

          //next.idsConfig = evaluateSnort(next);

          const evaluated = evaluateAll(next);

          checkFlagStatus(evaluated);

          return next;
        });
        addLog(`[+] monitoring interface set to ${target}`, "out");
        return;
      }

      // =========================
      // RULES ENABLE
      // =========================
      if (action === "rules") {
        const sub = args[2];
        const name = args[3];

        const allowedRules = ["local.rules", "scan.rules", "malware.rules"];

        if (sub === "enable") {
          if (!name) {
            return addLog("usage: snort rules enable <rule>", "err");
          }

          if (!allowedRules.includes(name)) {
            addLog("[!] unknown rule file", "err");
            addLog(
              "[!] available: local.rules, scan.rules, malware.rules",
              "sys",
            );
            return;
          }

          setHardeningState((prev) => {
            const next = {
              ...prev,
              snort: {
                ...prev.snort,
                rules: {
                  ...(prev.snort?.rules || {}),
                  [name]: true,
                },
              },
            };

            //next.idsConfig = evaluateSnort(next);

            const evaluated = evaluateAll(next);

            checkFlagStatus(evaluated);

            return next;
          });

          addLog(`[+] rule enabled: ${name}`, "out");

          if (name === "scan.rules") {
            addLog("[+] port scan detection active", "sys");
          }

          if (name === "malware.rules") {
            addLog("[+] malware/C2 detection active", "sys");
          }

          return;
        }

        if (sub === "disable") {
          if (!name) {
            return addLog("usage: snort rules disable <rule>", "err");
          }

          setHardeningState((prev) => {
            const next = {
              ...prev,
              snort: {
                ...prev.snort,
                rules: {
                  ...(prev.snort?.rules || {}),
                  [name]: false,
                },
              },
            };

            //next.idsConfig = evaluateSnort(next);

            const evaluated = evaluateAll(next);

            checkFlagStatus(evaluated);

            return next;
          });

          addLog(`[+] rule disabled: ${name}`, "out");
          return;
        }

        return addLog("usage: snort rules enable|disable <rule>", "err");
      }

      // =========================
      // THRESHOLD
      // =========================
      if (action === "threshold") {
        const type = args[2];

        if (type === "scan") {
          const rateIndex = args.indexOf("--rate");
          const windowIndex = args.indexOf("--window");
          const trackIndex = args.indexOf("--track");

          const rate = parseInt(args[rateIndex + 1]);
          const window = parseInt(args[windowIndex + 1]);
          const track = args[trackIndex + 1] || "src_ip";

          if (!rate || isNaN(rate) || rate <= 0) {
            return addLog("[!] invalid --rate value", "err");
          }

          if (!window || isNaN(window) || window <= 0) {
            return addLog("[!] invalid --window value", "err");
          }

          const allowedTracks = ["src_ip", "dst_ip", "dst_port"];

          if (!allowedTracks.includes(track)) {
            return addLog("[!] invalid --track value", "err");
          }

          const policy = {
            type: "portscan",
            track,
            count: rate,
            interval: window,
          };

          setHardeningState((prev) => {
            const next = {
              ...prev,
              snort: {
                ...prev.snort,
                scanPolicy: policy,
              },
            };

            //next.idsConfig = evaluateSnort(next);

            const evaluated = evaluateAll(next);

            checkFlagStatus(evaluated);

            return next;
          });

          addLog(
            `[+] portscan policy updated: >${rate} events / ${window}s (track=${track})`,
            "out",
          );

          if (rate === 10 && window === 1 && track === "src_ip") {
            addLog("[+] IDS policy applied", "sys");
          } else {
            addLog("[!] Very scan policy configuration", "err");
          }

          return;
        }

        return addLog(
          "usage: snort threshold scan --rate X --window Y --track Z",
          "err",
        );
      }

      // =========================
      // FALLBACK
      // =========================
      addLog(
        "usage: snort [status|start|interface|rules|threshold|alerts]",
        "err",
      );
    }

    // SUBMIT
    else if (command === "submit" || trimmedInput === currentData.flag) {
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
          addLog("[!] CONGRATULATIONS !", "sys");
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
          <span className="text-white uppercase tracking-widest">
            {solved
              ? "ROOT@NCTF:~#"
              : `LVL_${level}_${CTF_LEVELS[level].label}`}
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
          <div className="mt-6 p-4 border border-green-500/50 text-center uppercase text-sm space-y-2 text-green-500">
            <div className="animate-pulse text-green-300">
              [ CTF COMPLETED ]
            </div>

            <div className="text-white mt-8">Gained skills</div>

            <div className="text-cyan-400 mt-3 space-y-1">
              <div>✔ Linux commands</div>
              <div>✔ Network protocols TCP/IP</div>
              <div>✔ Attack surface enumeration & port exposure</div>
              <div>✔ Hash cracking</div>
              <div>✔ Exploitation & privilege escalation</div>
              <div>✔ SOC monitoring & log analysis</div>
              <div>✔ Threat hunting & containment</div>
              <div>✔ System hardening</div>
            </div>

            <div className="mt-8 text-yellow-400">
              CYBERSECURITY CERTIFICATE GRANTED
            </div>
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
