export const CTF_LEVELS = {
    1: {
        label: "OSINT & FOOTPRINTING",
        flag: "1",
        unlocks: [],
        hint: "Inspectez le code source de la page (DOM) pour trouver des indices laissés par le développeur.",
        files: {
            "readme.txt": "Bienvenue dans ce CTF. Cherchez, trouvez et validez.",
            ".note.txt": "Cherchez le commentaire SYSTEM_ACCESS_KEY dans le code source de la page index.html."
        }
    },
    2: {
        label: "SYSTEM ENUMERATION",
        flag: "2",
        unlocks: [
            "Find",
            "grep",
        ],
        hint: "Utilisez 'grep' pour chercher 'FLAG' dans tous les fichiers.",
        files: {
            "readme.txt": "Le flag est caché dans un des fichiers système. Bonne chance.",
            ".password.txt": "File is empty.",
            ".Password.txt": "File is empty.",
            ".passwords.txt": "File is empty.",
            ".p4ssword.txt": "File is empty.",
            ".p4ssw0rd.txt": "File is empty.",
            ".p_assword.txt": "File is empty.",
            ".pass.word.txt": "File is empty.",
            ".pass_word.txt": "flag is not here.",
            ".p4ss_w0rd.txt": "Try harder.",
            ".p@ssword.txt": "File is empty.",
            ".p@ssw0rd.txt": "File is empty.",
            ".passwrd.txt": "File is empty.",
            ".psswrd.txt": "Log file: 2026-04-23",
            ".P@55w0rd.txt": "File is empty.",
            ".passw0rd.txt": "Mot de passe : 123456 (trop facile)",
            ".Password4.txt": "Le flag est : grep_is_magic",
            ".Flag": "File is empty.",
            ".flag": "File is empty.",

        }
    },
    3: {
        label: "SERVICE SCANNING",
        flag: "3",
        unlocks: [
            "nmap",
            "nc",
        ],
        hint: "Utilisez 'nmap -sV'. Une API en mode debug est exposée...",
        targetIp: "10.0.2.15",
        services: [
            { port: "21", state: "open", service: "ftp", version: "vsftpd 3.0.3 (Anonymous allowed)" },
            { port: "22", state: "open", service: "ssh", version: "OpenSSH 8.2p1 Ubuntu" },
            { port: "80", state: "open", service: "http", version: "Apache 2.4.41" },
            { port: "5000", state: "open", service: "http", version: "Flask API (DEBUG MODE ENABLED -- DANGER)" }
        ],
        files: {
            "readme.txt": "Une API semble exposée en mode debug.",
            ".network.txt": "Target IP : 10.0.2.15.",
        }
    },

    4: {
        label: "WEB EXPLOITATION (SQLi)",
        flag: "4",
        unlocks: [
            "gobuster",
            "curl",
            "sqlmap"
        ],
        hint: "Utilisez 'gobuster' pour trouver les endpoints API. Une injection SQL est possible...",
        targetIp: "10.0.2.15",

        directories: [
            "/backup",
            "/dev_admin_portal",
            "/api/login",
            "/api/users"
        ],

        files: {
            "readme.txt": "Une API Flask tourne en debug. Regardez la config.",
            ".web_config": `
                            DEBUG=True
                            DB_ENGINE=SQLite
                            DB_PATH=/var/www/app.db
                            ADMIN_PANEL=/dev_admin_portal
                            `
        }
    },

    5: {
        label: "CREDENTIAL ACCESS",
        flag: "SSH_Access_Granted",
        unlocks: [
            "john",
            "hashcat",
            "ssh"
        ],
        hint: "Extract hashes from the database. Crack them using dictionary attacks. Use recovered credentials to access SSH and investigate internal files for further secrets.",
        targetIp: "10.0.2.15",
        hashes: [
            { user: "admin", hash: "5f4dcc3b5aa765d61d8327deb882cf99" },
            { user: "dev", hash: "e99a18c428cb38d5f260853678922e03" }
        ],
        hashInfo: {
            type: "MD5",
            weakness: "fast hash, vulnerable to dictionary attacks"
        },

        wordlist: "rockyou.txt",

        ssh: {
            host: "10.0.2.15",
            port: 22,
            note: "Login grants access to internal filesystem. Look for encrypted backups."
        },

        files: {
            "readme.txt":
                "User credentials are stored in the database as unsalted MD5 hashes.\nWeak passwords may be crackable using common wordlists.",

            ".hashes.txt":
                "admin:5f4dcc3b5aa765d61d8327deb882cf99\ndev:e99a18c428cb38d5f260853678922e03",

            ".note.txt":
                "Developers often reuse weak passwords across services.",
            "backup.txt": "Encrypted archive (AES-256). Key might be derived from weak password reuse.",
            "ssh_banner.txt": "Welcome dev. Sensitive backups detected on system.",
        }
    },

    6: {
        label: "POST-EXPLOITATION",
        flag: "Meterpreter_Inside",
        hint: "Génère un payload avec msfvenom et exécute-le sur la machine cible.",

        payload: {
            type: "reverse_shell",
            format: "elf",
            tool: "msfvenom"
        },

        files: {
            "readme.txt": "Tu as accès en SSH. Upload un payload et lance un reverse shell.",
            ".note.txt": "Listener requis (port 4444)."
        }
    },

    7: {
        label: "PRIVILEGE ESCALATION",
        flag: "I_Am_Root",
        hint: "Cherche les binaires SUID : 'find / -perm -4000'. Python3 est exploitable.",

        files: {
            "/usr/bin/python3": "[SUID SET]",
            "note_root.txt": "Seul root peut lire ce fichier."
        }
    }
};