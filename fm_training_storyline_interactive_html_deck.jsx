import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, PlayCircle, PauseCircle, 
  BookOpen, Target, Users, Eye, Layers3, ClipboardList, ShieldCheck,
  FileCheck, BarChart2, PieChart as PieIcon, MessageSquare, Quote, 
  GitBranch, Map, Link2, Landmark, Scale, Sparkles, Timer, CircleDot
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, RadarChart, Radar, PolarAngleAxis, PolarGrid, PolarRadiusAxis,
  LineChart, Line
} from "recharts";

/**
 * FM Training Storyline — Interactive HTML Deck
 * Single-file React deck with real vector icons (Lucide), charts (Recharts),
 * SmartArt-style SVGs, editable placeholders, section dividers, and activity cues.
 * 
 * Story spine: Purpose → Method → Instrument → Output, with triangulation (KII + FGD + Observation) as the golden thread.
 * All slide content from the user's last full version is preserved verbatim.
 */

// ---------- Utility Components ----------
const SectionDivider = ({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle?: string }) => (
  <div className="w-full h-[70vh] flex flex-col items-center justify-center text-center gap-4">
    <div className="flex items-center gap-4">
      <Icon className="w-14 h-14" />
      <h2 className="text-4xl font-bold tracking-tight">{title}</h2>
    </div>
    {subtitle && <p className="text-xl opacity-80 max-w-3xl">{subtitle}</p>}
    <div className="mt-6 w-full max-w-3xl">
      <SmartArtSpine />
    </div>
  </div>
);

const Placeholder = ({ label }: { label: string }) => (
  <div className="border-2 border-dashed rounded-2xl p-6 text-center text-sm opacity-80">
    <span className="block font-semibold">{label}</span>
    <span className="block text-xs opacity-70">(Drop notes/links or replace this box)</span>
  </div>
);

// SmartArt: Story spine Purpose→Method→Instrument→Output
const SmartArtSpine = () => (
  <svg viewBox="0 0 1200 220" className="w-full h-[160px]">
    {[
      { x: 20, label: "Purpose" },
      { x: 320, label: "Method" },
      { x: 620, label: "Instrument" },
      { x: 920, label: "Output" },
    ].map((b, i) => (
      <g key={i}>
        <rect x={b.x} y={40} width={240} height={100} rx={16} className="fill-none stroke-[3]" />
        <text x={b.x + 120} y={100} textAnchor="middle" dominantBaseline="middle" className="text-xl font-semibold">
          {b.label}
        </text>
        {i < 3 && (
          <g>
            <path d={`M ${b.x + 240} 90 L ${b.x + 280} 90`} className="stroke-[3]" />
            <polygon points={`${b.x + 280},90 ${b.x + 270},82 ${b.x + 270},98`} />
          </g>
        )}
      </g>
    ))}
  </svg>
);

// SmartArt: Triangulation triangle (KII + FGD + Observation)
const SmartArtTriangulation = () => (
  <svg viewBox="0 0 400 380" className="w-full h-[240px]">
    <polygon points="200,20 20,340 380,340" className="fill-none stroke-[3]" />
    <text x="200" y="48" textAnchor="middle" className="font-semibold">KII</text>
    <text x="48" y="330" textAnchor="middle" className="font-semibold">FGD</text>
    <text x="352" y="330" textAnchor="middle" className="font-semibold">Observation</text>
    <circle cx="200" cy="220" r="6" />
    <text x="200" y="260" textAnchor="middle" className="text-sm">Triangulate → full picture</text>
  </svg>
);

// Micro timer for 1-minute drills
const OneMinuteTimer = () => {
  const [seconds, setSeconds] = useState(60);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    if (seconds === 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds, running]);
  const reset = () => { setSeconds(60); setRunning(false); };
  return (
    <div className="flex items-center gap-3">
      <Button onClick={() => setRunning(true)}><PlayCircle className="w-4 h-4 mr-2" />Start 1:00</Button>
      <Button variant="secondary" onClick={() => setRunning(false)}><PauseCircle className="w-4 h-4 mr-2" />Pause</Button>
      <Button variant="outline" onClick={reset}><Timer className="w-4 h-4 mr-2" />Reset</Button>
      <div className="text-xl tabular-nums font-mono w-16 text-center">{String(Math.floor(seconds/60)).padStart(1,"0")}:{String(seconds%60).padStart(2,"0")}</div>
    </div>
  );
};

// Chart demo data (editable placeholders)
const mixData = [
  { method: "KII", value: 38 },
  { method: "FGD", value: 27 },
  { method: "Observation", value: 35 },
];
const likertData = [
  { label: "Strongly Disagree", value: 4 },
  { label: "Disagree", value: 9 },
  { label: "Neutral", value: 22 },
  { label: "Agree", value: 38 },
  { label: "Strongly Agree", value: 27 },
];
const radarData = [
  { dim: "Credible", score: 78 },
  { dim: "Useful", score: 85 },
  { dim: "Transparent", score: 72 },
  { dim: "Rights-based", score: 88 },
  { dim: "Accountability", score: 82 },
];

// Slide definition helper
type Slide = {
  key: string;
  title: string;
  type?: "section" | "content";
  icon?: any;
  content: React.ReactNode;
};

const slides: Slide[] = [
  // Section 1 — Foundations
  {
    key: "sec-1",
    title: "Section 1 — Foundations (FMM, Principles, Objectives)",
    type: "section",
    icon: Landmark,
    content: <SectionDivider icon={Landmark} title="Foundations" subtitle="FMM, Principles, Objectives" />,
  },
  {
    key: "s1-1",
    title: "Slide 1 — Title & Session Map",
    icon: BookOpen,
    content: (
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">FMM Data Collection Methodology, Ethical Procedure & Child Safeguarding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p><b>Session scope:</b> Methods • Ethics & Safeguarding • FM Process • Tools & Planning</p>
            <div className="p-4 rounded-xl border">
              <p className="font-semibold">Aha-connector:</p>
              <p className="italic">“We’re not ‘collecting forms’; we’re building an accountability loop.”</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">Facilitator cue</Badge>
              <span>Flash the spine: <b>Purpose → Method → Instrument → Output</b>.</span>
            </div>
            <SmartArtSpine />
          </CardContent>
        </Card>
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><GitBranch className="w-5 h-5" />Triangulation — the golden thread</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <SmartArtTriangulation />
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <div className="p-3 rounded-xl border"><b>KII</b><div>Depth of insight</div></div>
              <div className="p-3 rounded-xl border"><b>FGD</b><div>Breadth & norms</div></div>
              <div className="p-3 rounded-xl border"><b>Observation</b><div>Ground-truth</div></div>
            </div>
          </CardContent>
        </Card>
      </div>
    ),
  },
  {
    key: "s1-2",
    title: "Slide 2 — Why Data Collection Matters",
    icon: Target,
    content: (
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Why Data Collection Matters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="list-disc pl-6 space-y-1">
              <li>Provides reliable, systematic evidence for decisions</li>
              <li>Accountability to vulnerable groups & triggers corrective action</li>
              <li>Use of FMM in eTools is mandatory for all FM/PMVs</li>
            </ul>
            <div className="p-4 rounded-xl border">
              <p className="font-semibold">Aha-connector:</p>
              <p className="italic">“Data isn’t paperwork—it’s the trigger for change.”</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">Micro-activity (1 min):</p>
              <p>Ask: “Name one decision that changed after data came in.”</p>
              <OneMinuteTimer />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart2 className="w-5 h-5" /> Demo: Method Mix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mixData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="method" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    ),
  },
  {
    key: "s1-3",
    title: "Slide 3 — Principles & Objectives of Field Monitoring",
    icon: Scale,
    content: (
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Principles & Objectives</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><b>Principles:</b> Credible • Useful • Transparent • Human-rights–based</p>
            <p><b>Objectives:</b> Accountability • Corrective action • Tracking progress • Verifying partner reports • Identifying risks</p>
            <div className="p-4 rounded-xl border">
              <p className="font-semibold">Aha-connector:</p>
              <p className="italic">“Principles define quality; objectives define impact.”</p>
            </div>
            <div className="text-sm opacity-80">Transition: “Now: how we ask the right question with the right method.”</div>
          </CardContent>
        </Card>
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><RadarIcon /> Quality Radar (demo)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="dim" />
                  <PolarRadiusAxis />
                  <Radar name="Score" dataKey="score" fillOpacity={0.3} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    ),
  },

  // Section 2 — Methods
  {
    key: "sec-2",
    title: "Section 2 — Data Collection Methods",
    type: "section",
    icon: Layers3,
    content: <SectionDivider icon={Layers3} title="Data Collection Methods" subtitle="KII • FGD • Observation (with instruments)" />,
  },
  {
    key: "s2-1",
    title: "Slide 4 — Overview of Methods",
    icon: Layers3,
    content: (
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Overview of Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="list-disc pl-6 space-y-1">
            <li>Key Informant Interviews (KII)</li>
            <li>Focus Group Discussions (FGD)</li>
            <li>Observation (All supported by questionnaires, guides, and digital tools)</li>
          </ul>
          <div className="p-4 rounded-xl border">
            <p className="font-semibold">Aha-connector:</p>
            <p className="italic">“Three lenses: depth (KII), breadth (FGD), ground-truth (Observation)—triangulate.”</p>
          </div>
          <SmartArtTriangulation />
        </CardContent>
      </Card>
    ),
  },
  {
    key: "s2-2",
    title: "Slide 5 — KII: Definition & Process",
    icon: Users,
    content: (
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>KII: Definition & Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><b>Definition:</b> One-on-one structured/semi-structured interviews with stakeholders (experts, leaders, beneficiaries)</p>
            <p><b>When to Use:</b> Sensitive/complex topics, validating gaps, insider knowledge</p>
            <p><b>Steps:</b> Select diverse, relevant stakeholders • Use open-ended, objective-aligned questions • Allow probing; introduce purpose; secure consent • Summarize findings linked to objectives</p>
            <p><b>Tools/Instruments:</b> Interview guides, structured questionnaires, note-taking templates</p>
            <p><b>Strengths:</b> Rich insights, flexibility, higher response rates</p>
            <p><b>Challenges:</b> Access barriers, risk of bias, time-intensive analysis</p>
            <div className="p-4 rounded-xl border">
              <p className="font-semibold">Aha-connector:</p>
              <p className="italic">“If the verb is Why/How, it points to KII.”</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">1-minute drill:</p>
              <p>Show 3 questions; participants raise fingers: “KII / FGD / Obs?”</p>
              <OneMinuteTimer />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Practical FM Applications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <ul className="list-disc pl-6 space-y-1">
              <li><b>Acceptability:</b> Are there cost barriers to access? (Likert)</li>
              <li><b>Community Engagement:</b> Is there an effective feedback mechanism?</li>
              <li><b>Enabling Environment:</b> Are budget disbursements timely/sufficient?</li>
              <li><b>PSEA & Quality:</b> Do beneficiaries know reporting channels? Are staff trained on PSEA/ESS?</li>
              <li><b>Supplies:</b> Are key supplies timely, sufficient, quality?</li>
            </ul>
            <div className="p-3 rounded-xl border text-sm"><b>Facilitator note:</b> Capture quotes; later code them to themes → dashboard.</div>
          </CardContent>
        </Card>
      </div>
    ),
  },
  {
    key: "s2-3",
    title: "Slide 7 — FGD: Definition & Process",
    icon: MessageSquare,
    content: (
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>FGD: Definition & Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><b>Definition:</b> Facilitated group dialogue (6–12 participants) on shared issues</p>
            <p><b>When to Use:</b> Collective perspectives, marginalized voices, community norms</p>
            <p><b>Steps:</b> Participant selection (homogeneous for comfort / heterogeneous for diversity) • Semi-structured guide with probing Qs • Ground rules: confidentiality, respect, equal participation • Skilled facilitation & cultural awareness • Summarize into themes, patterns, trends</p>
            <p><b>Tools/Instruments:</b> FGD guides, checklists, audio/notes, flipcharts</p>
            <p><b>Strengths:</b> Group dynamics reveal norms & collective insights</p>
            <p><b>Challenges:</b> Groupthink risk, dominant voices, logistical complexity</p>
            <div className="p-4 rounded-xl border">
              <p className="font-semibold">Aha-connector:</p>
              <p className="italic">“If the verb is What do people think / How many agree, it leans to FGD.”</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Practical FM Applications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <ul className="list-disc pl-6 space-y-1">
              <li><b>Acceptability:</b> Are users satisfied with services/supplies?</li>
              <li><b>Community Engagement:</b> Are partners providing lifesaving info? Are structures engaged?</li>
              <li><b>PSEA:</b> Do beneficiaries know how to report SEA?</li>
              <li><b>Reach:</b> Evidence of exclusion (children with disabilities / on the move)?</li>
            </ul>
            <div className="p-3 rounded-xl border text-sm"><b>Facilitator tip:</b> Use visual voting (cards/pebbles) to quantify consensus quickly.</div>
          </CardContent>
        </Card>
      </div>
    ),
  },
  {
    key: "s2-4",
    title: "Slide 9 — Observation: Definition & Process",
    icon: Eye,
    content: (
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Observation: Definition & Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><b>Definition:</b> Systematic watching/recording of behaviours/events in real settings</p>
            <p><b>When to Use:</b> Validate self-reports, monitor operational processes, understand context</p>
            <p><b>Steps:</b> Define objectives clearly • Select type (participant vs. non-participant; structured vs. unstructured) • Use checklists/structured protocols • Minimize observer influence; obtain consent if required • Capture contextual details; record examples & quotes</p>
            <p><b>Tools/Instruments:</b> Structured observation checklists, facility registers, digital apps (Kobo, RapidPro, SMS reporting)</p>
            <p><b>Strengths:</b> Contextual depth & validation</p>
            <p><b>Challenges:</b> Observer bias, influence on participant behaviour</p>
            <div className="p-4 rounded-xl border">
              <p className="font-semibold">Aha-connector:</p>
              <p className="italic">“If the verb is Is/Are/Does, it screams Observation.”</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Practical FM Applications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <ul className="list-disc pl-6 space-y-1">
              <li><b>Acceptability:</b> Are supplies being used? Any visible community-level change?</li>
              <li><b>PSEA/Quality:</b> Posters visible? Worksites safe?</li>
              <li><b>Supplies:</b> Available, good condition, fairly distributed?</li>
              <li><b>HACT:</b> Activities implemented as reported?</li>
            </ul>
            <div className="p-3 rounded-xl border text-sm"><b>Aha-connector:</b> “When in doubt, see it yourself; observation is the ground-truth.”</div>
          </CardContent>
        </Card>
      </div>
    ),
  },

  // Section 3 — Ethics & Safeguarding
  {
    key: "sec-3",
    title: "Section 3 — Ethics & Safeguarding",
    type: "section",
    icon: ShieldCheck,
    content: <SectionDivider icon={ShieldCheck} title="Ethics & Safeguarding" subtitle="Frame every method with Do No Harm" />,
  },
  {
    key: "s3-1",
    title: "Slide 11 — Core Ethics",
    icon: Scale,
    content: (
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Core Ethics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>Respect (dignity, diversity, agency) • Benefit (prevent harm, ensure value) • Justice (equitable, inclusive)</p>
          <div className="p-4 rounded-xl border">
            <p className="font-semibold">Aha-connector:</p>
            <p className="italic">“Ethics is not a step at the end—it’s the frame of every method.”</p>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    key: "s3-2",
    title: "Slide 12 — Consent & Confidentiality",
    icon: FileCheck,
    content: (
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Consent & Confidentiality</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ul className="list-disc pl-6 space-y-1">
            <li>Verbal consent (adults) / assent (children)</li>
            <li>Right to withdraw anytime</li>
            <li>Confidential, anonymized reporting</li>
            <li>Clear explanation of purpose, duration, risks, voluntary nature</li>
          </ul>
          <div className="p-4 rounded-xl border">
            <p className="font-semibold">Aha-connector:</p>
            <p className="italic">“Consent protects the respondent and you.”</p>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    key: "s3-3",
    title: "Slide 13 — Child Safeguarding",
    icon: ShieldCheck,
    content: (
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Child Safeguarding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><b>Standards:</b> Do No Harm; pre-field risk assessment; safeguarding Code of Conduct</p>
          <p><b>Rules:</b> Guardian consent, no one-on-one adult–child interaction, respectful facilitation</p>
          <p><b>Mitigation:</b> CP/GBV workers present; culturally aware facilitation; safe questioning (no eliciting personal experiences)</p>
          <div className="p-4 rounded-xl border">
            <p className="font-semibold">Aha-connector:</p>
            <p className="italic">“Evidence must never create harm.”</p>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    key: "s3-4",
    title: "Slide 14 — Referral Mechanisms",
    icon: Link2,
    content: (
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Referral Mechanisms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <ul className="list-disc pl-6 space-y-1">
              <li>Police (100/112) — immediate threats</li>
              <li>CHILDLINE (1098) — escalations/disclosures</li>
              <li>UNICEF Safeguarding/PSEA focal points</li>
              <li>Local child protection/social workers</li>
            </ul>
            <div className="p-3 rounded-xl border text-sm"><b>Aha-connector:</b> “Monitoring can trigger protection pathways—know the route.”</div>
          </CardContent>
        </Card>
        <Placeholder label="Add country-office specific referral contacts & links" />
      </div>
    ),
  },

  // Section 4 — Field Monitoring Framework & Tools
  {
    key: "sec-4",
    title: "Section 4 — Field Monitoring Framework & Tools",
    type: "section",
    icon: ClipboardList,
    content: <SectionDivider icon={ClipboardList} title="Field Monitoring Framework & Tools" subtitle="From plan to action to accountability" />,
  },
  {
    key: "s4-1",
    title: "Slide 15 — FM Process (End-to-End)",
    icon: Map,
    content: (
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>FM Process (End-to-End)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Identify interventions → Develop thematic checklists with specialists → Orient staff → Create FM plan → Conduct visits → Analyse findings & track actions → Disseminate results in FM/AAP forums</p>
            <div className="p-3 rounded-xl border text-sm"><b>Aha-connector:</b> “Findings matter only if they cycle back into management action.”</div>
            <ProcessSmartArt />
          </CardContent>
        </Card>
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PieIcon className="w-5 h-5" /> Demo: Likert Snapshot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={likertData} dataKey="value" nameKey="label" outerRadius={100} label />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    ),
  },
  {
    key: "s4-2",
    title: "Slide 16 — Monitoring Types & What to Monitor",
    icon: Eye,
    content: (
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Monitoring Types & What to Monitor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><b>Types:</b> Implementation (inputs, activities, outputs) • Results (outputs, outcomes) • HACT assurance (PMVs, spot checks, audits)</p>
          <p><b>What to Monitor:</b> CP outputs (reach, quality, enabling env, PSEA/CEA) • Partner processes • Supplies & AAP</p>
          <div className="p-3 rounded-xl border text-sm"><b>Aha-connector:</b> “Context defines which monitoring lens you use.”</div>
        </CardContent>
      </Card>
    ),
  },
  {
    key: "s4-3",
    title: "Slide 17 — Mapping FM Questions to Methods (Triangulation Map)",
    icon: Layers3,
    content: (
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Mapping FM Questions to Methods (Triangulation Map)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="list-disc pl-6 space-y-1">
              <li><b>Acceptability:</b> FGD + Observation + KII</li>
              <li><b>Community Engagement & Accountability:</b> KII + FGD + Observation</li>
              <li><b>Enabling Environment:</b> KII + Observation</li>
              <li><b>HACT:</b> Observation + KII</li>
              <li><b>PSEA & Quality:</b> KII + FGD + Observation</li>
              <li><b>Reach & Supplies:</b> KII + Observation + FGD</li>
            </ul>
            <div className="p-3 rounded-xl border text-sm"><b>Aha-connector:</b> “No single method is enough—triangulation reveals the full picture.”</div>
            <div className="text-sm"><b>2-min activity:</b> Give a new question; teams pick their 2–3 methods and justify.</div>
          </CardContent>
        </Card>
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart2 className="w-5 h-5" /> Demo: Method Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[{t:1,KII:2,FGD:1,Obs:1},{t:2,KII:1,FGD:2,Obs:2},{t:3,KII:2,FGD:1,Obs:3}]}> 
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="t" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="KII" />
                  <Line type="monotone" dataKey="FGD" />
                  <Line type="monotone" dataKey="Obs" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    ),
  },

  // Section 5 — Wrap-Up
  {
    key: "sec-5",
    title: "Section 5 — Wrap-Up",
    type: "section",
    icon: Sparkles,
    content: <SectionDivider icon={Sparkles} title="Wrap-Up" subtitle="Lock in the patterns and next actions" />,
  },
  {
    key: "s5-1",
    title: "Slide 18 — Key Takeaways",
    icon: Sparkles,
    content: (
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Key Takeaways</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ul className="list-disc pl-6 space-y-1">
            <li>Triangulate methods: KII + FGD + Observation = full picture</li>
            <li>Anchor questions to methods: Acceptability, PSEA, Supplies, Reach, etc.</li>
            <li>Safeguarding & ethics are non-negotiable</li>
            <li>FMM ensures corrective action loops</li>
          </ul>
          <div className="p-4 rounded-xl border">
            <p className="font-semibold">Final Aha:</p>
            <p className="italic">“Don’t memorize methods—recognize the pattern: question verb + entity (person/group/process/place) → method.”</p>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    key: "s5-2",
    title: "Slide 19 — Resources (added back; previously omitted by others)",
    icon: Link2,
    content: (
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="list-disc pl-6 space-y-1">
              <li>FM Handbook & Annexes</li>
              <li>Ethical Standards & Strategy Notes</li>
              <li>KII & FGD Guides</li>
              <li>UNICEF Monitoring Templates</li>
            </ul>
            <div className="text-sm opacity-80">Facilitator cue: Add your country-office links/templates here.</div>
          </CardContent>
        </Card>
        <Placeholder label="Insert CO links/templates (SharePoint/Drive)" />
      </div>
    ),
  },

  // Appendix — Meta-Insights (Facilitator)
  {
    key: "appendix",
    title: "Appendix — Meta-Insights (Facilitator)",
    icon: BookOpen,
    content: (
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Meta-Insights (Facilitator)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <ul className="list-disc pl-6 space-y-1">
            <li><b>Pipeline pattern:</b> Purpose → Method → Instrument → Output.</li>
            <li><b>Method roles:</b> KII = depth; FGD = breadth; Observation = ground-truth.</li>
            <li><b>Answer types:</b> Qual → KII/FGD; Quant → Observation; Mixed → code & tally.</li>
            <li><b>Verb heuristic:</b> Why/How → KII; What do people think → FGD; Is/Are/Does → Observation.</li>
            <li><b>Entity heuristic:</b> Person → KII; Group → FGD; Process/Place → Observation.</li>
            <li><b>Ethics by method:</b> Privacy & consent (KII/FGD); respectful presence (Obs); Do No Harm for all.</li>
            <li><b>Cross-method scenarios:</b> Sensitive topic → KII (privacy, depth); Community norm → FGD (dynamics); Verification → Observation (objective).</li>
            <li><b>Engagement patterns:</b> Storyline classification drill (verb + entity); Triangulation game (one problem, three lenses); Quick consensus quantification in FGDs (cards/pebbles)</li>
          </ul>
        </CardContent>
      </Card>
    ),
  },
];

function RadarIcon(){
  return <svg viewBox="0 0 24 24" className="w-5 h-5"><circle cx="12" cy="12" r="10" className="fill-none stroke-[2]"/><circle cx="12" cy="12" r="6" className="fill-none stroke-[2]"/><line x1="12" y1="12" x2="22" y2="12" className="stroke-[2]"/></svg>
}

function ProcessSmartArt(){
  return (
    <svg viewBox="0 0 1000 180" className="w-full h-[140px]">
      {[
        "Identify interventions",
        "Develop thematic checklists with specialists",
        "Orient staff",
        "Create FM plan",
        "Conduct visits",
        "Analyse findings & track actions",
        "Disseminate results in FM/AAP forums",
      ].map((t, i) => (
        <g key={i}>
          <rect x={10 + i*140} y={30} width={130} height={90} rx={16} className="fill-none stroke-[3]" />
          <text x={10 + i*140 + 65} y={75} textAnchor="middle" className="text-[10px] leading-tight">
            {t}
          </text>
          {i < 6 && (
            <g>
              <path d={`M ${10 + i*140 + 130} 75 L ${10 + i*140 + 140} 75`} className="stroke-[3]" />
              <polygon points={`${10 + i*140 + 140},75 ${10 + i*140 + 130},69 ${10 + i*140 + 130},81`} />
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}

// ---------- Deck Shell ----------
export default function Deck(){
  const [idx, setIdx] = useState(0);
  const total = slides.length;
  const go = (d: number) => setIdx((i) => Math.max(0, Math.min(total-1, i + d)));
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Controls */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Badge>FM Training: Data Collection in Field Monitoring</Badge>
            <Badge variant="secondary">Interactive Deck</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => go(-1)} disabled={idx===0}><ChevronLeft className="w-4 h-4 mr-2"/>Prev</Button>
            <Button onClick={() => go(1)} disabled={idx===total-1}>Next<ChevronRight className="w-4 h-4 ml-2"/></Button>
          </div>
        </div>

        <Progress value={((idx+1)/total)*100} className="mb-6" />

        {/* Slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[idx].key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl p-6 md:p-8 border shadow-sm bg-white"
          >
            <div className="flex items-center gap-3 mb-4">
              {slides[idx].icon && React.createElement(slides[idx].icon, { className: "w-6 h-6" })}
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{slides[idx].title}</h1>
            </div>
            <div className="prose max-w-none">
              {slides[idx].content}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer: Quick Jump */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {slides.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setIdx(i)}
              className={`text-left text-xs p-2 rounded-lg border ${i===idx?"bg-gray-100 border-gray-900":"hover:bg-gray-50"}`}
              title={s.title}
            >
              <div className="truncate font-medium">{s.title.replace(/ — .*/, "")}</div>
              <div className="truncate opacity-70">{s.title.includes("Slide")?s.title.split(" — ")[1]:"Section"}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
