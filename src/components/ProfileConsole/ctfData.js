export const CTF_LEVELS = {
    1: {
        label: "FOOTPRINTING",
        flag: "Welcome_User",
        unlocks: [],
        hint: "'Ctrl + U' or 'F12' or right click => inspect the page => source code => index.html. (refresh page if needed)",
        files: {
            "readme.txt": "Welcome to this CTF. Search, find, and validate. Exit any session before submit flag.",
            ".flag.txt": "Did you think it would be that easy? The flag is hidden within the source code of the index.html page."
        }
    },
    2: {
        label: "LINUX COMMANDS",
        flag: "Grep_Is_Magic",
        unlocks: [
            "Find",
            "grep",
        ],
        hint: "Use 'grep' to search for 'FLAG' in all files.",
        files: {
            "readme.txt": "The flag is hidden in one of the system files. Good luck.",
            ".password.txt": "File is empty.",
            ".Password.txt": "File is empty.",
            ".passwords.txt": "File is empty.",
            ".p4ssword.txt": "File is empty.",
            ".p4ssw0rd.txt": "File is empty.",
            ".p_assword.txt": "File is empty.",
            ".pass.word.txt": "File is empty.",
            ".pass_word.txt": "File is empty.",
            ".p4ss_w0rd.txt": "Try harder.",
            ".p@ssword.txt": "File is empty.",
            ".p@ssw0rd.txt": "File is empty.",
            ".passwrd.txt": "File is empty.",
            ".psswrd.txt": "Log file: 2026-04-23",
            ".P@55w0rd.txt": "File is empty.",
            ".passw0rd.txt": "Password : 123456 (trop facile)",
            ".Password4.txt": "FLAG{Grep_Is_Magic}",
            ".Flag": "File is empty.",
            ".flag": "File is empty.",
            ".flagO": "File is empty.",
            ".flag0": "File is empty.",

        }
    },
    3: {
        label: "SERVICE SCANNING",
        flag: "TRY_HARD",
        unlocks: [
            "nmap",
            "nc",
        ],
        hint: "use 'nmap -sV' for scanning services...",
        targetIp: "10.0.2.15",
        services: [
            { port: "21", state: "open", service: "ftp", version: "vsftpd 3.0.3 (Anonymous allowed)" },
            { port: "22", state: "open", service: "ssh", version: "OpenSSH 8.2p1 Ubuntu" },
            { port: "80", state: "open", service: "http", version: "Apache 2.4.41" },
            { port: "5000", state: "open", service: "http", version: "Flask API (DEBUG MODE ENABLED -- DANGER)" }
        ],
        files: {
            "readme.txt": "You are now acting as a penetration tester. Your objective is to enumerate exposed services on the target host. Identify potential attack surfaces and misconfigurations. Use nmap on target host.",
            "network.txt": "Target host IP : 10.0.2.15.",
        }
    },

    4: {
        label: "WEB EXPLOITATION (SQLi)",
        flag: "NO_PAIN_NO_GAIN",
        unlocks: [
            "gobuster",
            "curl",
            "sqlmap"
        ],
        hint: "Use 'gobuster [IP]' for endpoints enumeration. A SQL injection is possible...",
        targetIp: "10.0.2.15",

        directories: [
            "/backup",
            "/dev_admin_portal",
            "/api/login",
            "/api/users"
        ],

        files: {
            "readme.txt": "Continue the security audit. A Flask API is exposed on 10.0.2.15 with debug mode enabled.",
            ".web_config.txt": `
                            DEBUG=True
                            DB_ENGINE=SQLite
                            DB_PATH=/var/www/app.db
                            ADMIN_PANEL=/dev_admin_portal
                            `
        }
    },

    5: {
        label: "BRUTE FORCE",
        flag: "M0tivation2026!",
        unlocks: [
            "john",
            "hashcat",
            "ssh"
        ],
        hint: "Expected workflow : john => ssh => investigate internal files for further secrets.",
        targetIp: "10.0.2.15",
        hashes: [
            { user: "admin", hash: "39678cb269782223fb548ea91d07d540" },
            { user: "dev", hash: "aba0b545a32585915e3318b92d987bfa" }
        ],
        files: {
            "readme.txt":
                "User credentials have been extracted from database and stored in the .hashes.txt as MD5 hashes. Crack them and use credentials to connect ssh. Target IP : 10.0.2.15",

            ".hashes.txt":
                "admin:216b0a84582521479c73b7ba56d17f77\ndev:650a82a075701f1e40c182082cbf3e15",
            "john.txt": "...",
            "ssh.txt": "...",
        }
    },

    6: {
        label: "METASPLOIT",
        flag: "MS17_010",
        unlocks: ["msfconsole", "meterpreter"],
        hint: "Exploit SMB on 10.0.2.25 and escalate privilege to get acces to the flag.",
        targetIp: "10.0.2.25",
        files: {
            "readme.txt": "Your AI Assistant completed an automated reconnaissance scan on 10.0.2.25. Detected OS: Windows 7. SMB service exposed on port 445. [CRITICAL] Remote SMB RCE vulnerability detected (MS17-010).",
            "metasploit.txt": "Check cat in basic commands"
        },
        meterpreterFiles: {
            "/": [
                "readme.txt",
                "flag.txt",
            ],

            "readme.txt": "...",
            "flag.txt": "..."
        },
    },

    7: {
        label: "SIEM - LOG ANALYSIS",
        unlocks: ["SPLUNK SIEM"],
        flag: "WORM_ILOVEYOU",

        hint: "Expected workflow : siem => search statistic query => search meterpreter realted events",

        files: {
            "readme.txt": "You are now a SOC analyst. A critical security alert has been triggered. Your task's to analyze logs, and identify the attacker IP address as quick as possible.",
            "siem.txt": "",
        }
    },

    8: {
        label: "FORENSIC",

        flag: "NotPetya",

        unlocks: [
            "strings",
            "netstat",
            "ps",
            "kill",
        ],

        hint: "Track the process associated to the attacker IP address and kill it.",

        files: {
            "readme.txt": "SOC analysis confirms system compromise. A malicious binary has been detected. You're responsible for incident response and containment of the threat.",
            "forensic.txt": "Updater.exe was recovered from the compromised machine. Begin forensic workflow using strings [file to analyse]. Find the right ps to kill.",
            "updater.exe": "Binary flagged as suspicious (PE32 executable, packed).",
            "netstat.txt": " ",
        },
    },
    9: {
        label: "HARDENING - FINAL",
        flag: "LockBit",
        unlocks: [
            "waf",
            "firewall",
            "ids",
            "snort",
        ],
        hint: "Workflow order - Configure firewall rules - Enable WAF protection - Configure IDS .",
        files: {
            "readme.txt":
                "You are now responsible for hardening the infrastructure. Configure firewall - waf - ids to finish CTF.",
            "firewall.txt": "...",
            "waf.txt": "...",
            "snort.txt": "...",

        }
    },

};