import type { LabCourseGroup } from './lab'

export const cyberLabCurriculum: readonly LabCourseGroup[] = [
  { title: 'Reconnaissance', levels: [
    { id: 1, title: 'Découverte et recherche de flag', objective: 'Inspecter les ressources et retrouver le premier flag.', available: true },
    { id: 2, title: 'Commandes Linux et fichiers', objective: 'Rechercher une information dans les fichiers du scénario.', available: true },
    { id: 3, title: 'Scan, énumération et services', objective: 'Identifier les services exposés sur la cible fictive.', available: true },
  ] },
  { title: 'Exploitation', levels: [
    { id: 4, title: 'Exploitation web et injection SQL', objective: 'Explorer une API fictive et ses faiblesses SQL.', available: true },
    { id: 5, title: 'Cassage de hashs et accès SSH', objective: 'Analyser les hashs fournis puis ouvrir une session SSH simulée.', available: true },
    { id: 6, title: 'Exploitation système et privilèges', objective: 'Explorer une session Meterpreter et ses permissions.', available: true },
  ] },
  { title: 'Défense', levels: [
    { id: 7, title: 'Analyse SIEM et corrélation de logs', objective: 'Enquêter sur les journaux de sécurité fournis.', available: true },
    { id: 8, title: 'Investigation et confinement', objective: 'Identifier un processus malveillant et le neutraliser dans le scénario.', available: true },
    { id: 9, title: 'Durcissement : WAF, firewall et IDS', objective: 'Configurer les protections de l’infrastructure fictive.', available: true },
  ] },
]
