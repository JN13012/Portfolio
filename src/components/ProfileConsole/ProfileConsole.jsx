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

    firewallConfig: "INCOMPLETE",
    wafConfig: "INCOMPLETE",
    idsConfig: "INCOMPLETE",

    wafEnabled: false,
    sqliProtection: false,
    rateLimit: false,

    idsEnabled: false,
    snortRuleLoaded: false,
  });
  const firewallConfigLabel = {
    OK: "Firewall configuration completed",
    INCOMPLETE: "Complete firewall configuration",
  };
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const addLog = (msg, type = "out") => {
    setHistory((prev) => [...prev, { msg, type }]);
  };

  function checkFlagStatus(state) {
    const allOk =
      state.firewallConfig === "OK" &&
      state.idsConfig === "OK" &&
      state.wafConfig === "OK";

    if (allOk && state.flagStatus !== "UNLOCKED") {
      addLog("ALL SECURITY SYSTEMS SECURED. FLAG UNLOCKED.", "sys");
    }

    return allOk ? "UNLOCKED" : "LOCKED";
  }
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

    const isValid = Object.entries(requiredPorts).every(([port, expected]) => {
      const portRules = rules.filter((r) => r.port === Number(port));

      if (portRules.length === 0) {
        return expected === "ALLOW";
      }

      const lastRule = portRules[portRules.length - 1];

      return lastRule.action === expected;
    });

    return isValid;
  }

  function updateFirewallState() {
    setHardeningState((prev) => {
      const ok = evaluateFirewallConfig(prev);

      const next = {
        ...prev,
        firewallConfig: ok ? "OK" : "INCOMPLETE",
      };
      return next;
    });
  }

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

      if (fullCommand === "help") {
        addLog(`${shellPrefix} Available SPL commands:`, "sys");
        addLog(`${shellPrefix} search index=ctf | stats count`, "sys");
        addLog(`${shellPrefix} exit`, "sys");
        return;
      }

      if (fullCommand === "exit") {
        addLog(`${shellPrefix} closing SIEM session...`, "sys");
        setRemoteSession(null);
        return;
      }

      if (fullCommand === "search index=ctf | stats count") {
        addLog(`${shellPrefix} executing SPL query...`, "sys");

        setTimeout(() => {
          addLog(
            `==============================================================`,
            "out",
          );
          addLog(`${shellPrefix} --- SPLUNK JOB RESULT ---`, "sys");
          addLog(`==============================`, "out");
          addLog(`${shellPrefix} total_events = 698`, "out");
          addLog(`${shellPrefix} time_range = last_24h`, "out");
          addLog(`${shellPrefix} sourcetype_distribution:`, "out");
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
            `${shellPrefix} endpoint    -> 3 events (meterpreter / post-exploitation)`,
            "out",
          );
          addLog(
            `==============================================================`,
            "out",
          );
          addLog(
            `${shellPrefix} ANALYSIS: suspicious post-exploitation activity detected. Investigate endpoint events `,
            "sys",
          );
          addLog(
            `${shellPrefix} RECOMMENDED ACTION: search index=ctf sourcetype=endpoint`,
            "sys",
          );
        }, 400);

        return;
      }

      if (fullCommand === "search index=ctf sourcetype=endpoint") {
        addLog(`${shellPrefix} executing SPL query...`, "sys");

        setTimeout(() => {
          addLog(
            `==============================================================`,
            "out",
          );
          addLog(`${shellPrefix} --- SPLUNK JOB RESULT ---`, "sys");
          addLog(
            `==============================================================`,
            "out",
          );
          addLog(
            `${shellPrefix} timestamp=02:14:33 alert_name="Meterpreter Activity Detected" severity=critical`,
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
          addLog(`${shellPrefix} outbound_connection=45.83.122.91:4444`, "out");
          addLog(
            `${shellPrefix} timestamp=02:14:37 event_type=process_migration`,
            "out",
          );
          addLog(
            `${shellPrefix} source_process=meterpreter.exe target_process=lsass.exe pid=396`,
            "out",
          );
          addLog(
            `${shellPrefix} token_impersonation=SYSTEM integrity_level=High`,
            "out",
          );
          addLog(
            `${shellPrefix} timestamp=02:14:40 event_type=privilege_escalation status=confirmed`,
            "out",
          );
          addLog(`${shellPrefix} attacker_ip=45.83.122.91`, "err");
          addLog(
            `${shellPrefix} FLAG{45.83.122.91} - exit siem before submit`,
            "sys",
          );
        }, 950);

        return;
      }

      if (fullCommand.startsWith("search")) {
        addLog(`${shellPrefix} executing SPL query...`, "sys");

        setTimeout(() => {
          addLog(
            `${shellPrefix} ERROR: invalid or unsupported SPL syntax`,
            "err",
          );
          addLog(
            `${shellPrefix} hint: try 'search index=ctf | stats count'`,
            "sys",
          );
        }, 400);

        return;
      }

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
            addLog(
              "meterpreter > Hint: current session integrity is too low",
              "sys",
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
          `${shellPrefix} Hint: use the security-related process to migrate and escalate privileges`,
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
            addLog(
              `${shellPrefix} SYSTEM token successfully impersonated`,
              "sys",
            );
            addLog(`${shellPrefix} Privilege escalation successful`, "sys");
            return;
          }
          // WRON MIGRATION PS
          addLog(`[+] Migration completed successfully`, "out");

          addLog(
            `${shellPrefix} Warning: migrated process does not provide the apropriated privileges`,
            "sys",
          );
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
      // DEV
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
      // ADMIN
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
              `${shellPrefix} : use maximum workload profile for cracking efficiency`,
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
      if (level >= 6) {
        baseCmds += ", metasploit, meterpreter";
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
      // metasploit
      if (file === ".metasploit.txt") {
        addLog("Metasploit Framework - Exploit Reference Guide", "out");
        addLog("----------------------------------------------", "out");

        addLog("[+] CONTEXT: SMB TARGET DETECTED (PORT 445)", "out");
        addLog("", "out");

        addLog("[?] POSSIBLE EXPLOIT MODULES:", "out");
        addLog(
          "  - exploit/windows/smb/psexec (requires credentials or auth bypass)",
          "out",
        );
        addLog(
          "  - exploit/windows/smb/ms17_010_eternalblue (Recomended)",
          "out",
        );
        addLog(
          "  - exploit/windows/smb/ms08_067_netapi (older systems)",
          "out",
        );
        addLog("", "out");

        addLog("[+] STANDARD METASPLOIT WORKFLOW:", "out");
        addLog("  use <exploit/module>", "out");
        addLog("  set RHOSTS <target_ip>", "out");
        addLog("  set LHOST <your_ip> (optional)", "out");
        addLog("  set LPORT 4444 (optional)", "out");
        addLog("  run", "out");
        addLog("", "out");

        addLog("[+] EXAMPLE (CTF TARGET):", "out");
        addLog("  use exploit/windows/smb/ms17_010_eternalblue", "out");
        addLog("  set RHOSTS 10.0.2.25", "out");
        addLog("  run", "out");
        addLog("", "out");
        addLog(
          "[!] NOTE: Incorrect module or parameters will result in failed session",
          "sys",
        );
        addLog(
          "[*] Expected result: Meterpreter session on successful exploitation",
          "sys",
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
        addLog("Example: firewall allow 80", "out");
        addLog("---", "out");
        addLog("Block inbound TCP traffic on a port:", "out");
        addLog("firewall deny <port>", "out");
        addLog("Example: firewall deny 445", "out");
        addLog("---", "out");
        addLog("Block all traffic from an IP address:", "out");
        addLog("firewall blockip <ip>", "out");
        addLog("Example: firewall blockip 45.83.122.91", "out");
        addLog("---", "out");
        addLog("Restore default firewall configuration:", "out");
        addLog("  firewall reset", "out");
        addLog("---", "out");
        addLog("HARDENING PRACTICES:", "out");
        addLog("  - Keep SSH open (22)", "out");
        addLog("  - Keep HTTP/HTTPS open (80/443)", "out");
        addLog("  - Disable SMB exposure (445)", "out");
        addLog("  - Block exploit framework ports (4444)", "out");
        addLog("  - Disable debug services (5000)", "out");
        addLog("  - Block suspicious IP addresses", "out");
        addLog("", "out");

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

          // BRUTE FORCE MASK
          else if (attack === "3") {
            if (!mask) {
              return addLog("[!] missing mask pattern", "err");
            }

            const tokens = (mask.match(/\?[ulds]/g) || []).length;

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
    else if (command === "use") {
      const module = args.slice(1).join(" ");

      setMsfState({
        module,
        options: {},
      });

      addLog(`[*] selected module: ${module}`, "sys");
    } else if (command === "set") {
      const key = args[1];
      const value = args.slice(2).join(" ");

      if (!key || !value) {
        addLog("[!] usage: set <OPTION> <VALUE>", "err");
        return;
      }

      setMsfState((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          [key.toUpperCase()]: value,
        },
      }));

      addLog(`[*] ${key.toUpperCase()} => ${value}`, "sys");
    } else if (command === "run") {
      const module = msfState?.module;
      const opts = msfState?.options || {};

      const rhosts = opts["RHOSTS"];

      if (!module) {
        return addLog("[!] no module selected", "err");
      }

      if (!rhosts) {
        return addLog("[!] invalid RHOSTS configuration", "err");
      }

      if (module.includes("ms17_010_eternalblue")) {
        if (rhosts !== "10.0.2.25") {
          return addLog("[!] invalid target", "err");
        }

        addLog("[*] Exploit running...", "sys");

        setTimeout(() => {
          addLog("[+] Meterpreter session opened", "out");
          setRemoteSession({ type: "meterpreter", host: rhosts });
        }, 1200);
        setTimeout(() => {
          addLog("type 'help' for avaible commands", "sys");
        }, 1800);

        return;
      }

      addLog("[!] invalid configuration", "err");
    }

    // SIEM
    else if (command === "siem") {
      setRemoteSession({
        type: "siem",
        host: "splunk-sim",
      });

      addLog("[+] Splunk SIEM initialized", "sys");
      addLog("[+] Indexes loaded: auth, web, sys", "sys");
      addLog("[+] Type 'help' for available SPL commands", "sys");

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
          addLog(
            "[*] next step: use netstat to inspect active network connexions",
            "sys",
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
          addLog(
            "[!] external host 45.83.122.91 matches IOC from updater.exe",
            "err",
          );
          addLog("[*] next step: use ps to identify malicious process", "sys");
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

        addLog("", "out");

        if (hardeningState.firewall.blockedIps.length > 0) {
          addLog("Blocked IPs:", "sys");

          hardeningState.firewall.blockedIps.forEach((ip) => {
            addLog(`- ${ip}`, "out");
          });
        }
        addLog(
          `Configuration: ${firewallConfigLabel[hardeningState.firewallConfig]}`,
          "sys",
        );
        return;
      }

      if (action === "deny") {
        if (!target) {
          addLog("usage: firewall deny <port>", "err");
          return;
        }

        const port = parseInt(target);

        setHardeningState((prev) => ({
          ...prev,
          firewall: {
            ...prev.firewall,
            rules: [
              ...prev.firewall.rules,
              {
                action: "DENY",
                protocol: "tcp",
                port,
                source: "any",
              },
            ],
          },
        }));

        addLog(`[+] Rule added: DENY tcp/${port} from ANY`, "out");
        updateFirewallState();
        return;
      }

      if (action === "allow") {
        if (!target) {
          addLog("usage: firewall allow <port>", "err");
          return;
        }

        const port = parseInt(target);

        setHardeningState((prev) => {
          const filtered = prev.firewall.rules.filter(
            (r) => !(r.port === port && r.action === "DENY"),
          );

          return {
            ...prev,
            firewall: {
              ...prev.firewall,
              rules: [
                ...filtered,
                {
                  action: "ALLOW",
                  protocol: "tcp",
                  port,
                  source: "any",
                },
              ],
            },
          };
        });

        addLog(`[+] Rule added: ALLOW tcp/${port} from ANY`, "out");
        updateFirewallState();
        return;
      }
      if (action === "blockip") {
        if (!target) {
          addLog("usage: firewall blockip <ip>", "err");
          return;
        }

        const ip = target;
        const attackerIP = "45.83.122.91";

        if (ip !== attackerIP) {
          addLog("It is not the attacker IP address", "err");
          return;
        }

        setHardeningState((prev) => ({
          ...prev,
          firewall: {
            ...prev.firewall,
            blockedIps: [...prev.firewall.blockedIps, ip],
          },
        }));

        addLog(`[+] IP blocked: ${ip}`, "out");
        return;
      }

      if (action === "ruleset") {
        addLog("Current firewall ruleset:", "sys");

        if (!hardeningState.firewall.rules.length) {
          addLog("No explicit rules defined (default policy in effect)", "sys");
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

      addLog("usage: firewall [status|allow|deny|ruleset]", "err");
    }
    // WAF
    else if (command === "waf") {
      const action = args[1];
      const feature = args[2];

      if (action === "status") {
        addLog(
          `WAF: ${hardeningState.wafEnabled ? "ENABLED" : "DISABLED"}`,
          "out",
        );

        addLog(
          `SQLI FILTER: ${hardeningState.sqliProtection ? "ON" : "OFF"}`,
          "out",
        );

        addLog(`RATE LIMIT: ${hardeningState.rateLimit ? "ON" : "OFF"}`, "out");

        return;
      }

      if (action === "enable") {
        if (!feature) {
          setHardeningState((prev) => ({
            ...prev,
            wafEnabled: true,
          }));

          addLog("[+] WAF enabled", "out");

          return;
        }

        if (feature === "sqli") {
          setHardeningState((prev) => ({
            ...prev,
            sqliProtection: true,
          }));

          addLog("[+] SQLi protection enabled", "out");

          return;
        }

        if (feature === "rate-limit") {
          setHardeningState((prev) => ({
            ...prev,
            rateLimit: true,
          }));

          addLog("[+] Rate limit enabled", "out");

          return;
        }
      }
    }
    // SNORT
    else if (command === "snort") {
      const action = args[1];

      if (action === "status") {
        addLog(
          `IDS: ${hardeningState.idsEnabled ? "ONLINE" : "OFFLINE"}`,
          "out",
        );

        addLog(
          `RULES: ${hardeningState.snortRuleLoaded ? "1 ACTIVE" : "0 ACTIVE"}`,
          "out",
        );

        return;
      }

      if (action === "enable") {
        setHardeningState((prev) => ({
          ...prev,
          idsEnabled: true,
        }));

        addLog("[+] Snort IDS enabled", "out");

        return;
      }

      if (action === "load") {
        const rule = args[2];

        if (rule === "meterpreter.rules") {
          setHardeningState((prev) => ({
            ...prev,
            snortRuleLoaded: true,
          }));

          addLog("[+] Meterpreter detection rule loaded", "out");

          return;
        }
      }
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
