"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  EyeOff,
  Key,
  Fingerprint,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Wifi,
  CloudOff,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Search,
  ExternalLink,
  ChevronRight,
  Clock,
  Printer
} from "lucide-react";
import { motion, useInView } from "framer-motion";

// ─── Scroll Reveal Wrapper ────────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SecurityContent() {
  const [activeSection, setActiveSection] = useState("");

  const navItems = [
    { id: "credential-security", label: "Credential Security" },
    { id: "threat-awareness", label: "Threat Awareness" },
    { id: "device-network-safety", label: "Device & Network" },
    { id: "recovery-planning", label: "Recovery Planning" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="flex flex-col w-full overflow-hidden pt-24 bg-[#05070A]">
      
      {/* ── SECTION 1: HERO ───────────────────────────────────────────── */}
      <section id="security-hero" className="relative py-24 md:py-40 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(240,180,41,0.03),transparent_70%)]" />

        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <Reveal>
              <Link href="/learn" className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors mb-12">
                <ArrowLeft className="w-3 h-3" />
                <span>Back to Learn</span>
              </Link>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-12 text-white">
                The Vault Is Only <br />
                as Strong as the <br />
                <span className="text-[var(--color-primary)]">Person Holding the Key.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-xl md:text-2xl text-gray-400 mb-8 leading-relaxed font-medium">
                Core Capital's platform security is institutional grade. But platform security has a boundary — and that boundary is your device, your credentials, and your behaviour.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="text-gray-500 leading-relaxed max-w-2xl mb-12">
                The majority of digital asset losses are caused by individual security failures. Core Capital cannot protect you from decisions you make outside the platform. This guide exists so you make the right ones.
              </p>
            </Reveal>

            {/* Security Readiness Bar */}
            <Reveal delay={0.4} className="mt-16">
               <div className="flex flex-col space-y-4 max-w-2xl">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                     <span className="text-red-500">🔴 At Risk</span>
                     <span className="text-orange-500">🟠 Basic Protection</span>
                     <span className="text-yellow-500">🟡 Hardened</span>
                     <span className="text-[var(--color-secondary)]">🟢 Fully Secured</span>
                  </div>
                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden flex">
                     <div className="h-full w-1/4 bg-red-600" />
                     <div className="h-full w-1/4 bg-orange-600" />
                     <div className="h-full w-1/4 bg-yellow-600" />
                     <div className="h-full w-1/4 bg-[var(--color-secondary)] opacity-20" />
                  </div>
                  <p className="text-[10px] text-gray-500 italic tracking-widest">
                    By the end of this guide, you will understand what each level requires and how to reach Fully Secured status.
                  </p>
               </div>
            </Reveal>

            <Reveal delay={0.5} className="mt-12 flex items-center space-x-6">
               <div className="inline-flex items-center space-x-3 px-4 py-2 bg-white/[0.05] rounded-full">
                  <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">10 Minute Briefing</span>
               </div>
            </Reveal>
          </div>
        </div>

        {/* Anchor Nav Bar */}
        <div className="sticky top-[72px] z-40 w-full bg-[#05070A]/80 backdrop-blur-xl border-y border-white/5 mt-20">
           <div className="container mx-auto px-6">
              <div className="flex items-center space-x-8 overflow-x-auto py-4 no-scrollbar">
                 {navItems.map((item) => (
                   <a 
                     key={item.id} 
                     href={`#${item.id}`}
                     className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${activeSection === item.id ? 'text-[var(--color-primary)]' : 'text-gray-500 hover:text-white'}`}
                   >
                     {item.label}
                   </a>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* ── SECTION 2: CREDENTIAL SECURITY ──────────────────────────── */}
      <section id="credential-security" className="py-32">
         <div className="container mx-auto px-6">
            <Reveal className="mb-24">
               <h2 className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-[0.4em] mb-12">01 — Credential Integrity</h2>
               <div className="max-w-4xl border-l-8 border-[var(--color-primary)] pl-12 py-4">
                  <p className="text-3xl md:text-5xl font-black text-white leading-tight italic tracking-tighter">
                    "In digital asset security, your credentials are not a login mechanism. They are the legal title deed to your capital. Treat them accordingly."
                  </p>
               </div>
            </Reveal>

            <Reveal className="max-w-3xl mb-20 text-gray-400 leading-relaxed">
               Your account is secured by three independent layers — your master password, your two-factor authentication, and your recovery phrase. Each one is a separate line of defence.
            </Reveal>

            {/* Part A: Master Password */}
            <div className="mb-32">
               <Reveal className="mb-12">
                  <h3 className="text-2xl font-black text-white flex items-center space-x-4">
                     <Lock className="w-6 h-6 text-[var(--color-primary)]" />
                     <span>Your Master Password — The First Line</span>
                  </h3>
               </Reveal>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { t: "Length Is More Important Than Complexity", d: "A 20-character password of random words is stronger than 10 characters of symbols. Core Capital requires 12 characters minimum — use 20." },
                    { t: "Your Password Must Be Unique", d: "If used on any other platform, it is compromised by proxy. One platform, one password. No exceptions." },
                    { t: "Use a Password Manager", d: "Bitwarden, 1Password, or Dashlane. Memorize the manager's master key — never write it down digitally." },
                    { t: "Never Store in Plain Text", d: "No notes app, email, or spreadsheet. If you must write it down, use paper and store it physically separate from your recovery phrase." },
                    { t: "Change After Any Suspicion", d: "If you suspect compromise, change it immediately from a trusted device. Change first, investigate second." }
                  ].map((rule, i) => (
                    <Reveal key={i} delay={i * 0.05} className="p-8 bg-white/[0.03] rounded-[2rem] border border-white/5">
                       <span className="text-[10px] font-black text-[var(--color-primary)] uppercase mb-4 block">Rule {i + 1}</span>
                       <h4 className="text-base font-black text-white mb-3">{rule.t}</h4>
                       <p className="text-sm text-gray-500 leading-relaxed">{rule.d}</p>
                    </Reveal>
                  ))}
               </div>
            </div>

            {/* Part B: 2FA */}
            <div className="mb-32">
               <Reveal className="mb-12">
                  <h3 className="text-2xl font-black text-white flex items-center space-x-4">
                     <ShieldCheck className="w-6 h-6 text-[var(--color-primary)]" />
                     <span>Two-Factor Authentication — The Non-Negotiable Second Layer</span>
                  </h3>
               </Reveal>

               <div className="glass-card p-12 rounded-[3rem] border border-white/5">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                     {[
                       { t: "Use App-Based 2FA", d: "Avoid SMS. SMS is vulnerable to SIM-swapping. Use Google Authenticator, Authy, or Microsoft Authenticator." },
                       { t: "Back Up Your Codes", d: "Write down the 2FA backup seed key on paper. Store it securely offline. Without it, losing your device means losing account access." },
                       { t: "Never Share Codes", d: "Core Capital support will NEVER ask for your 2FA code. If anyone asks, you are under a social engineering attack." }
                     ].map((item, i) => (
                       <div key={i} className="space-y-4">
                          <CheckCircle2 className="w-5 h-5 text-[var(--color-secondary)]" />
                          <h4 className="text-sm font-black text-white uppercase tracking-tight">{item.t}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed">{item.d}</p>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Part C: Recovery Phrase */}
            <div className="mb-20">
               <Reveal className="mb-12">
                  <h3 className="text-2xl font-black text-white flex items-center space-x-4">
                     <Key className="w-6 h-6 text-[var(--color-primary)]" />
                     <span>Your Recovery Phrase — The Master Key</span>
                  </h3>
               </Reveal>

               <div className="space-y-4 mb-20">
                  {[
                    "Write it down immediately. Use pen and paper. Number every word in order.",
                    "Store it offline. No photos. No cloud. No digital storage of any kind.",
                    "Store it physically secure. A fireproof safe is recommended. Locked drawers are the minimum.",
                    "Store separately from your password and device. Do not create a single point of failure.",
                    "Never type it into any website, app, or form. The only legitimate use is on the official Core Capital recovery flow.",
                    "Consider a metal backup. Paper is vulnerable to fire and water. Engraved metal plates are the institutional standard."
                  ].map((rule, i) => (
                    <Reveal key={i} delay={i * 0.05} className="py-6 border-b border-white/5 last:border-0 flex items-start space-x-6 group">
                       <span className="text-xl font-black text-white/10 group-hover:text-[var(--color-primary)] transition-colors shrink-0">{String(i + 1).padStart(2, '0')}</span>
                       <p className="text-lg md:text-xl font-bold text-gray-300 leading-tight">{rule}</p>
                    </Reveal>
                  ))}
               </div>

               <Reveal>
                  <div className="p-10 bg-[#0A0000] border-l-8 border-red-600 rounded-[2.5rem] flex items-start space-x-8">
                     <ShieldAlert className="w-12 h-12 text-red-600 shrink-0" />
                     <div>
                        <p className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4">Critical Warning</p>
                        <p className="text-lg font-bold text-white leading-relaxed">
                           Core Capital support will never ask for your recovery phrase. If anyone asks for it — under any pretext, in any context — your assets are the target. Do not comply.
                        </p>
                     </div>
                  </div>
               </Reveal>
            </div>
         </div>
      </section>

      {/* ── SECTION 3: THREAT AWARENESS ─────────────────────────────── */}
      <section id="threat-awareness" className="py-32 bg-black/40">
         <div className="container mx-auto px-6">
            <Reveal className="mb-24">
               <h2 className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-[0.4em] mb-12">02 — Threat Vectors</h2>
               <div className="max-w-4xl border-l-8 border-[var(--color-primary)] pl-12 py-4">
                  <p className="text-3xl md:text-5xl font-black text-white leading-tight italic tracking-tighter">
                    "The most sophisticated blockchain cannot protect you from clicking the wrong link. Awareness is the layer math cannot provide."
                  </p>
               </div>
            </Reveal>

            <div className="space-y-20">
               {[
                 { 
                   id: "01", t: "Phishing Attacks", 
                   w: "An attempt to deceive you into surrendering credentials by impersonating Core Capital via fake emails or websites.",
                   p: "Always type corecapital.io directly into your browser. Never use links from email or search ads. Bookmark the official URL.",
                   f: ["Emails asking to 'verify account' via link", "URLs with hyphens or misspellings", "Communications creating false urgency"]
                 },
                 { 
                   id: "02", t: "Social Engineering", 
                   w: "Manipulation into revealing information through false authority or manufactured trust, often via Telegram or Discord.",
                   p: "Core Capital communicates through official channels only. We never use Telegram or DMs. Treat unsolicited contact with suspicion.",
                   f: ["'Support agents' contacting you first", "Requests for passwords or 2FA codes", "Investment 'opportunities' via DMs"]
                 },
                 { 
                   id: "03", t: "Clipboard Hijacking", 
                   w: "Malware that replaces copied wallet addresses with an attacker-controlled address in your clipboard.",
                   p: "Always verify the first and last six characters of any pasted address against the original source. Never skip this check.",
                   f: ["Unknown software installed on device", "Pasted addresses that look 'different' but similar"]
                 },
                 { 
                   id: "04", t: "Fake Applications", 
                   w: "Fraudulent apps distributed through unofficial stores or ads that capture your credentials.",
                   p: "Download exclusively from corecapital.io official links. Verify developer name and review count before installing.",
                   f: ["Apps with very few reviews", "Generic, unspecific review content", "Apps downloaded from social media links"]
                 },
                 { 
                   id: "05", t: "Dusting & Poisoning", 
                   w: "Sending tiny amounts (dust) or fake history entries to trick you into copying an attacker's address.",
                   p: "Never copy addresses from transaction history. Use Core Capital's address book for all regular counterparties.",
                   f: ["Tiny, unexpected deposits from unknown sources", "History entries with addresses nearly identical to yours"]
                 }
               ].map((threat, i) => (
                 <Reveal key={i} className="p-12 glass-card rounded-[3rem] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 text-6xl font-black text-white/5 italic select-none group-hover:text-[var(--color-primary)]/10 transition-colors">
                       THREAT {threat.id}
                    </div>
                    
                    <h3 className="text-2xl font-black text-white mb-10">{threat.t}</h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                       <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest italic">What it is</p>
                          <p className="text-sm text-gray-400 leading-relaxed">{threat.w}</p>
                       </div>
                       <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase text-[var(--color-primary)] tracking-widest italic">How to protect</p>
                          <p className="text-sm text-white font-medium leading-relaxed">{threat.p}</p>
                       </div>
                       <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase text-red-500 tracking-widest italic">Red Flags</p>
                          <ul className="space-y-2">
                             {threat.f.map((flag, fi) => (
                               <li key={fi} className="text-xs text-gray-500 flex items-start">
                                  <AlertTriangle className="w-3 h-3 mr-2 text-red-500 shrink-0 mt-0.5" />
                                  <span>{flag}</span>
                               </li>
                             ))}
                          </ul>
                       </div>
                    </div>
                 </Reveal>
               ))}
            </div>

            <Reveal className="mt-20">
               <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-white/[0.03]">
                           <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Threat</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Primary Defence</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        <tr><td className="p-8 text-sm font-black text-white">Phishing</td><td className="p-8 text-sm text-gray-400">Type URL directly, verify every session</td></tr>
                        <tr><td className="p-8 text-sm font-black text-white">Social Engineering</td><td className="p-8 text-sm text-gray-400">Trust official channels only, suspect unsolicited contact</td></tr>
                        <tr><td className="p-8 text-sm font-black text-white">Clipboard Hijacking</td><td className="p-8 text-sm text-gray-400">Verify first & last 6 characters always</td></tr>
                        <tr><td className="p-8 text-sm font-black text-white">Fake Applications</td><td className="p-8 text-sm text-gray-400">Official website downloads exclusively</td></tr>
                        <tr><td className="p-8 text-sm font-black text-white">Dusting Attacks</td><td className="p-8 text-sm text-gray-400">Use address book, ignore unknown small deposits</td></tr>
                     </tbody>
                  </table>
               </div>
            </Reveal>
         </div>
      </section>

      {/* ── SECTION 4: DEVICE, NETWORK & RECOVERY ────────────────────── */}
      <section id="device-network-safety" className="py-32">
         <div className="container mx-auto px-6">
            <Reveal className="mb-24">
               <h2 className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-[0.4em] mb-12">03 & 04 — Infrastructure & Resilience</h2>
               <div className="max-w-4xl border-l-8 border-[var(--color-primary)] pl-12 py-4">
                  <p className="text-3xl md:text-5xl font-black text-white leading-tight italic tracking-tighter">
                    "Your wallet's security is only as strong as the device it runs on. And your recovery plan is the difference between an incident and a loss."
                  </p>
               </div>
            </Reveal>

            {/* Part A: Device Security */}
            <div className="mb-32">
               <Reveal className="mb-12">
                  <h3 className="text-2xl font-black text-white flex items-center space-x-4">
                     <Smartphone className="w-6 h-6 text-[var(--color-primary)]" />
                     <span>Securing the Device</span>
                  </h3>
               </Reveal>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    { t: "Enable Full-Disk Encryption", d: "Use FileVault (macOS), BitLocker (Windows), or system encryption on mobile to protect cached data." },
                    { t: "Strict Auto-Lock", d: "Set device to lock within 30 seconds of inactivity. An unlocked unattended device is an open wallet." },
                    { t: "Keep Software Updated", d: "Do not defer security patches. An unpatched OS is a running vulnerability. Enable auto-updates." },
                    { t: "Never Jailbreak/Root", d: "Bypassing OS security controls removes application sandboxing and permission safeguards." },
                    { t: "Strong Device Passcode", d: "A 12-character alphanumeric passcode is the institutional standard. 6 digits is the minimum." },
                    { t: "Install Antimalware", d: "Run reputable, updated protection on all desktop and Android devices used for access." }
                  ].map((rule, i) => (
                    <Reveal key={i} delay={i * 0.05} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                       <h4 className="text-base font-black text-white mb-3 tracking-tight">{rule.t}</h4>
                       <p className="text-xs text-gray-500 leading-relaxed">{rule.d}</p>
                    </Reveal>
                  ))}
               </div>
            </div>

            {/* Part B: Network Safety */}
            <div className="mb-32">
               <Reveal className="mb-12">
                  <h3 className="text-2xl font-black text-white flex items-center space-x-4">
                     <Wifi className="w-6 h-6 text-[var(--color-primary)]" />
                     <span>Network Hygiene</span>
                  </h3>
               </Reveal>

               <div className="glass-card p-12 rounded-[3rem] border border-white/5 space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="space-y-4">
                        <p className="text-lg font-bold text-white uppercase tracking-tighter">Never Use Public Wi-Fi</p>
                        <p className="text-sm text-gray-500 leading-relaxed">
                           Airports, cafes, and hotels have unknown security. Use your mobile data or a reputable VPN (Mullvad, ProtonVPN) when away from home.
                        </p>
                     </div>
                     <div className="space-y-4">
                        <p className="text-lg font-bold text-white uppercase tracking-tighter">Secure Your Home Gateway</p>
                        <p className="text-sm text-gray-500 leading-relaxed">
                           Change default router admin credentials. Use WPA3 or WPA2 encryption. Disable WPS. Regularly update router firmware.
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Part C: Recovery Scenarios */}
            <div id="recovery-planning" className="mb-32">
               <Reveal className="mb-12">
                  <h3 className="text-2xl font-black text-white flex items-center space-x-4">
                     <CloudOff className="w-6 h-6 text-[var(--color-primary)]" />
                     <span>Scenario Response Planning</span>
                  </h3>
               </Reveal>

               <div className="space-y-6">
                  {[
                    { s: "Lost or Stolen Device", r: "From a new device, terminate all active sessions in Security Settings immediately. Change master password. Restore 2FA using backup seed key." },
                    { s: "Forgotten Master Password", r: "Use 'Forgot Password' to verify via email and 2FA. If 2FA is also lost, contact support for identity re-verification." },
                    { s: "Unauthorized Access Detected", r: "Change password and terminate sessions within seconds. Contact security@corecapital.io immediately to freeze outbound transfers." },
                    { s: "Lost Recovery Phrase (Active Access)", r: "Generate a new phrase immediately from Security Settings. The old phrase is invalidated. Store the new one offline immediately." },
                    { s: "Lost Recovery Phrase (No Access)", r: "This is the terminal scenario. Contact support for identity re-verification. Recovery is not guaranteed; prevent this at all costs." }
                  ].map((scenario, i) => (
                    <Reveal key={i} className="p-8 bg-white/[0.03] rounded-3xl border border-white/5 hover:border-[var(--color-primary)]/20 transition-all">
                       <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                          <div className="md:col-span-1">
                             <p className="text-xs font-black text-[var(--color-primary)] uppercase tracking-widest mb-2">Scenario {i + 1}</p>
                             <p className="text-sm font-black text-white">{scenario.s}</p>
                          </div>
                          <div className="md:col-span-3">
                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 italic">Response Plan</p>
                             <p className="text-sm text-gray-400 leading-relaxed">{scenario.r}</p>
                          </div>
                       </div>
                    </Reveal>
                  ))}
               </div>
            </div>

            {/* Checklist Panel */}
            <Reveal className="glass-card p-14 md:p-20 rounded-[4rem] border border-white/5 bg-[#0A0E1A]">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                  <div>
                     <h3 className="text-3xl font-black text-white mb-2">Security Readiness Checklist</h3>
                     <p className="text-gray-500">Review this posture quarterly. Maintain it continuously.</p>
                  </div>
                  <button onClick={() => window.print()} className="inline-flex items-center space-x-2 text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest hover:text-white transition-colors">
                     <Printer className="w-4 h-4" />
                     <span>Print Reference</span>
                  </button>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  {[
                    { t: "Credential Security", items: ["Master password is 20+ chars, unique, in manager", "2FA enabled with app (not SMS)", "2FA backup key stored offline", "Recovery phrase on paper, in fireproof safe", "Phrase stored separate from device/password"] },
                    { t: "Threat Awareness", items: ["Official URL is bookmarked only", "Phishing risks shared with family/team", "Antimalware active on all access devices", "Address verification (1st/last 6) is a habit"] },
                    { t: "Infrastructure", items: ["Auto-updates enabled on all devices", "Full-disk encryption active", "Auto-lock set to <30 seconds", "Public Wi-Fi never used for wallet"] },
                    { t: "Resilience", items: ["Emergency contact saved: security@corecapital.io", "Session termination procedure known", "Recovery plans understood & documented"] }
                  ].map((cat, i) => (
                    <div key={i} className="space-y-6">
                       <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-4 border-b border-white/10 pb-4">{cat.t}</h4>
                       <ul className="space-y-4">
                          {cat.items.map((item, ii) => (
                            <li key={ii} className="flex items-start space-x-4 text-sm text-gray-400">
                               <div className="w-5 h-5 rounded border border-[var(--color-primary)] shrink-0 flex items-center justify-center mt-0.5">
                                  <CheckCircle2 className="w-3 h-3 text-[var(--color-primary)]" />
                               </div>
                               <span>{item}</span>
                            </li>
                          ))}
                       </ul>
                    </div>
                  ))}
               </div>
            </Reveal>
         </div>
      </section>

      {/* ── SECTION 5: FINAL CTA ────────────────────────────────────── */}
      <section id="security-cta" className="py-32">
         <div className="container mx-auto px-6">
            <Reveal className="text-center mb-20">
               <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-10 leading-[0.95] tracking-tighter">
                  SECURITY IS NOT A TASK. <br />
                  <span className="text-[var(--color-primary)]">IT IS A POSTURE.</span>
               </h2>
               <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed mb-12">
                  The checklist above is a recurring standard — a posture that serious digital asset investors maintain continuously. Be the most disciplined version of yourself.
               </p>

               <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                  <Link href="/wallet" className="btn-primary px-12 py-4 text-base font-black">
                     Return to Your Wallet
                  </Link>
                  <Link href="mailto:security@corecapital.io" className="btn-secondary px-10 py-4 text-base font-bold">
                     Contact Security Support
                  </Link>
               </div>

               <div className="inline-flex items-center space-x-3 px-6 py-3 bg-red-600/10 rounded-full border border-red-600/20 text-red-500 text-[10px] font-black uppercase tracking-widest mb-24">
                  <AlertCircle className="w-4 h-4" />
                  <span>Report Suspicious Activity: security@corecapital.io · 24/7</span>
               </div>
            </Reveal>

            <Reveal className="text-center border-t border-white/5 pt-20">
               <p className="text-2xl md:text-5xl font-black text-white italic tracking-tighter leading-tight max-w-4xl mx-auto">
                  "The strongest security system ever built has one vulnerability: the person who holds the key."
               </p>
            </Reveal>

            {/* Read Next Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32">
               {[
                 { t: "Getting Started", d: "Review initial security configuration.", href: "/learn/getting-started" },
                 { t: "Blockchain Basics", d: "Understand the cryptographic layer.", href: "/learn/blockchain-basics" },
                 { t: "Platform Security", d: "Our infrastructure architecture.", href: "/features/security" }
               ].map((card, i) => (
                 <Link key={i} href={card.href} className="glass-card p-8 rounded-3xl hover:border-[var(--color-primary)]/40 transition-all group">
                    <h4 className="text-sm font-black text-white mb-2">{card.t}</h4>
                    <p className="text-[10px] text-gray-500 mb-4 leading-relaxed">{card.d}</p>
                    <div className="flex items-center text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest">
                       <span>Read Next</span>
                       <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                 </Link>
               ))}
            </div>
         </div>
      </section>

    </main>
  );
}
