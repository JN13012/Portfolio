// Colour tool logos shared by Expertise and detail dialogs (icons taken from each project's
// official repository). Keys are tool names as written in src/content/expertise.ts.

import Bash from '../../../assets/Icon/Bash.webp' // assets/Logos/Icons/SVG/128x128.svg (odb/official-bash-logo), in colour
import BloodHound from '../../../assets/Icon/BloodHound.webp'
import Burpsuite from '../../../assets/Icon/Burpsuite.webp'
import Cyberchef from '../../../assets/Icon/Cyberchef.webp'
import Docker from '../../../assets/Icon/Docker.webp'
import EvilWinrm from '../../../assets/Icon/EvilWinrm.webp' // resources/evil-winrm_logo.png (Hackplayers/evil-winrm), cropped to the title
import Fail2ban from '../../../assets/Icon/Fail2ban.webp'
import Ffuf from '../../../assets/Icon/Ffuf.webp' // _img/ffuf_run_logo_600.png (ffuf/ffuf, MIT)
import Flarevm from '../../../assets/Icon/Flarevm.webp'
import Flask from '../../../assets/Icon/Flask.webp'
import Gobuster from '../../../assets/Icon/Gobuster.webp'
import Hashcat from '../../../assets/Icon/Hashcat.webp'
import Hydra from '../../../assets/Icon/Hydra.webp'
import Impacket from '../../../assets/Icon/Impacket.webp'
import Csharp from '../../../assets/Icon/Csharp.webp' // devicon csharp-original (MIT), the official C# mark
import Java from '../../../assets/Icon/Java.webp'
import Javascript from '../../../assets/Icon/Javascript.webp'
import Jenkins from '../../../assets/Icon/Jenkins.webp'
import JohnTheRipper from '../../../assets/Icon/JohnTheRipper.webp'
import Langchain from '../../../assets/Icon/Langchain.webp'
import Linpeas from '../../../assets/Icon/Linpeas.webp' // linPEAS/images/linpeas.png (peass-ng/PEASS-ng), white made transparent
import Linux from '../../../assets/Icon/Linux.webp'
import Metasploit from '../../../assets/Icon/Metasploit.webp'
import NetExec from '../../../assets/Icon/NetExec.webp'
import NetworkX from '../../../assets/Icon/NetworkX.webp' // the graph mark of networkx_banner.svg (networkx repo, BSD)
import Nmap from '../../../assets/Icon/Nmap.webp'
import Numpy from '../../../assets/Icon/Numpy.webp'
import Pandas from '../../../assets/Icon/Pandas.webp'
import Python from '../../../assets/Icon/Python.webp'
import Promptfoo from '../../../assets/Icon/Promptfoo.webp' // site/static/apple-touch-icon.png (promptfoo/promptfoo, MIT)
import Pyrit from '../../../assets/Icon/Pyrit.webp' // doc/roakey.png, PyRIT's mascot (Azure/PyRIT, MIT)
import Pytorch from '../../../assets/Icon/Pytorch.webp'
import React from '../../../assets/Icon/React.webp'
import Remnux from '../../../assets/Icon/Remnux.webp'
import Snort from '../../../assets/Icon/Snort.webp'
import Splunk from '../../../assets/Icon/Splunk.webp'
import Sql from '../../../assets/Icon/Sql.webp'
import Sqlmap from '../../../assets/Icon/Sqlmap.webp'
import Wireshark from '../../../assets/Icon/Wireshark.webp'

export const TOOL_ICONS: Record<string, string> = {
  'John the Ripper': JohnTheRipper,
  Impacket: Impacket,
  NetExec: NetExec,
  BloodHound: BloodHound,
  Nmap: Nmap,
  BurpSuite: Burpsuite,
  Wireshark: Wireshark,
  Metasploit: Metasploit,
  SQLMap: Sqlmap,
  Splunk: Splunk,
  Fail2ban: Fail2ban,
  FlareVM: Flarevm,
  REMnux: Remnux,
  Snort: Snort,
  CyberChef: Cyberchef,
  Gobuster: Gobuster,
  ffuf: Ffuf,
  'Evil-WinRM': EvilWinrm,
  linPEAS: Linpeas,
  Promptfoo: Promptfoo,
  PyRIT: Pyrit,
  Hashcat: Hashcat,
  Hydra: Hydra,
  JavaScript: Javascript,
  Linux: Linux,
  Bash: Bash,
  Python: Python,
  Docker: Docker,
  'Docker Compose': Docker,
  Flask: Flask,
  PyTorch: Pytorch,
  Pandas: Pandas,
  NumPy: Numpy,
  NetworkX: NetworkX,
  LangChain: Langchain,
  Java: Java,
  'C#': Csharp,
  React: React,
  SQL: Sql,
  Jenkins: Jenkins,
}
