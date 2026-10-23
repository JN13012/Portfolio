// Colour logos of the Expertise tools (the legacy icons, plus logos taken from each project's
// official repository). Keys are tool names as written in src/content/expertise.ts.

import BloodHound from '../../assets/Icon/BloodHound.webp'
import Burpsuite from '../../assets/Icon/Burpsuite.png'
import Cyberchef from '../../assets/Icon/Cyberchef.png'
import Docker from '../../assets/Icon/Docker.png'
import Fail2ban from '../../assets/Icon/Fail2ban.png'
import Flarevm from '../../assets/Icon/Flarevm.webp'
import Flask from '../../assets/Icon/Flask.png'
import Gobuster from '../../assets/Icon/Gobuster.webp'
import Hashcat from '../../assets/Icon/Hashcat.png'
import Hydra from '../../assets/Icon/Hydra.svg'
import Impacket from '../../assets/Icon/Impacket.webp'
import Java from '../../assets/Icon/Java.png'
import Javascript from '../../assets/Icon/Javascript.png'
import Jenkins from '../../assets/Icon/Jenkins.webp'
import JohnTheRipper from '../../assets/Icon/JohnTheRipper.webp'
import Langchain from '../../assets/Icon/Langchain.png'
import Linux from '../../assets/Icon/Linux.png'
import Metasploit from '../../assets/Icon/Metasploit.webp'
import NetExec from '../../assets/Icon/NetExec.webp'
import Nmap from '../../assets/Icon/Nmap.webp'
import Numpy from '../../assets/Icon/Numpy.png'
import Pandas from '../../assets/Icon/Pandas.png'
import Python from '../../assets/Icon/Python.png'
import Pytorch from '../../assets/Icon/Pytorch.png'
import React from '../../assets/Icon/React.webp'
import Remnux from '../../assets/Icon/Remnux.png'
import Snort from '../../assets/Icon/Snort.png'
import Splunk from '../../assets/Icon/Splunk.png'
import Sql from '../../assets/Icon/Sql.webp'
import Sqlmap from '../../assets/Icon/Sqlmap.webp'
import Wireshark from '../../assets/Icon/Wireshark.webp'

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
  Hashcat: Hashcat,
  Hydra: Hydra,
  JavaScript: Javascript,
  Linux: Linux,
  Python: Python,
  Docker: Docker,
  Flask: Flask,
  PyTorch: Pytorch,
  Pandas: Pandas,
  NumPy: Numpy,
  LangChain: Langchain,
  Java: Java,
  React: React,
  SQL: Sql,
  Jenkins: Jenkins,
}
