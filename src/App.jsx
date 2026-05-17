import { useState, useMemo } from "react";

const ANTHROPIC_URL = import.meta.env.VITE_ANTHROPIC_URL;

const PROSPECTS_RAW = [
  { id: "p001", company_name: "Meridian Health Systems", contact_name: "Dana Okafor", contact_title: "VP Revenue Operations", industry: "Healthcare", employees: 4200, deal_size_arr: 240000, deal_stage: "negotiation", last_contacted_days_ago: 47, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "funding", content: "$180M Series C announced. Expanding into 3 new markets in Q3." }, { signal_type: "linkedin", content: "Dana posted: 'modernizing our sales stack — we are drowning in spreadsheets'" }, { signal_type: "hiring", content: "Actively hiring 12 SDRs. Won government contract for digital health records." }] },
  { id: "p002", company_name: "Torchlight Logistics", contact_name: "Marcus Webb", contact_title: "Chief Revenue Officer", industry: "Logistics", employees: 890, deal_size_arr: 85000, deal_stage: "discovery", last_contacted_days_ago: 12, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "crm_note", content: "Missed Q1 targets by 22%. Board pressure on pipeline visibility." }, { signal_type: "news", content: "Current vendor contract expires in 4 months. Website traffic down 18% YoY." }] },
  { id: "p003", company_name: "Apex Fintech Solutions", contact_name: "Priya Nair", contact_title: "Head of Sales", industry: "Fintech", employees: 210, deal_size_arr: 60000, deal_stage: "prospecting", last_contacted_days_ago: 3, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "funding", content: "$45M Series B closed. Team grew from 8 to 19 AEs in 90 days." }, { signal_type: "crm_note", content: "Priya is 6 weeks into role, eager to make impact. Replied to cold email within 2 hours." }] },
  { id: "p004", company_name: "Vantage Cloud Solutions", contact_name: "Rachel Kim", contact_title: "VP of Sales", industry: "SaaS", employees: 320, deal_size_arr: 95000, deal_stage: "discovery", last_contacted_days_ago: 8, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "funding", content: "$42M Series B closed last month. Doubling sales headcount in Q3." }, { signal_type: "linkedin", content: "Rachel Kim: 'We need a real CRM — spreadsheets are killing our pipeline visibility'" }] },
  { id: "p005", company_name: "Ironclad Manufacturing", contact_name: "Tom Briggs", contact_title: "CRO", industry: "Manufacturing", employees: 1200, deal_size_arr: 180000, deal_stage: "negotiation", last_contacted_days_ago: 22, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "crm_note", content: "Tom Briggs previously championed our solution at prior company. Strong internal advocate." }, { signal_type: "news", content: "Won $45M government manufacturing contract. Scaling operations across 4 plants." }] },
  { id: "p006", company_name: "BluePeak Legal", contact_name: "Sandra Osei", contact_title: "Director of Operations", industry: "Legal", employees: 85, deal_size_arr: 42000, deal_stage: "prospecting", last_contacted_days_ago: 61, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p007", company_name: "Nexus Real Estate Tech", contact_name: "James Patel", contact_title: "Head of Revenue", industry: "Real Estate", employees: 140, deal_size_arr: 78000, deal_stage: "discovery", last_contacted_days_ago: 5, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p008", company_name: "Orion HealthTech", contact_name: "Maria Gonzalez", contact_title: "VP Product", industry: "Healthcare", employees: 560, deal_size_arr: 210000, deal_stage: "negotiation", last_contacted_days_ago: 3, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "linkedin", content: "Maria Gonzalez: 'AI in diagnostics is moving faster than our tools can handle'" }, { signal_type: "funding", content: "$95M Series C. Expanding into EU markets. New CTO hired from Google Health." }] },
  { id: "p009", company_name: "Crestline Logistics", contact_name: "Derek Woo", contact_title: "Director of Sales", industry: "Logistics", employees: 430, deal_size_arr: 65000, deal_stage: "prospecting", last_contacted_days_ago: 45, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p010", company_name: "Ember Analytics", contact_name: "Fatima Al-Hassan", contact_title: "CRO", industry: "SaaS", employees: 190, deal_size_arr: 120000, deal_stage: "discovery", last_contacted_days_ago: 12, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "hiring", content: "Posted 8 enterprise AE roles in past 30 days. Building out sales team rapidly." }, { signal_type: "funding", content: "$28M Series A. Fatima Al-Hassan joined as CRO from Salesforce 3 months ago." }] },
  { id: "p011", company_name: "Pinnacle Insurance Group", contact_name: "Charles Whitfield", contact_title: "VP Operations", industry: "Insurance", employees: 2100, deal_size_arr: 300000, deal_stage: "negotiation", last_contacted_days_ago: 7, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "news", content: "Pinnacle just acquired regional competitor. Integration challenges expected." }, { signal_type: "crm_note", content: "Charles Whitfield attended our webinar last week. Requested pricing deck." }] },
  { id: "p012", company_name: "Solara Energy Tech", contact_name: "Priya Mehta", contact_title: "Head of Sales", industry: "Energy", employees: 310, deal_size_arr: 88000, deal_stage: "prospecting", last_contacted_days_ago: 30, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p013", company_name: "Cobalt Cybersecurity", contact_name: "Nathan Lee", contact_title: "CISO", industry: "Cybersecurity", employees: 95, deal_size_arr: 55000, deal_stage: "discovery", last_contacted_days_ago: 18, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p014", company_name: "Cascade Financial", contact_name: "Laura Chen", contact_title: "CFO", industry: "Fintech", employees: 450, deal_size_arr: 175000, deal_stage: "negotiation", last_contacted_days_ago: 2, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "funding", content: "$210M Series D. Laura Chen quoted in Bloomberg: 'our legacy stack cant scale with us'" }, { signal_type: "linkedin", content: "Laura Chen: 'Evaluating 3 vendors for our revenue intelligence stack this quarter'" }] },
  { id: "p015", company_name: "Helix Biotech", contact_name: "Dr. Alan Morris", contact_title: "VP Business Dev", industry: "Biotech", employees: 680, deal_size_arr: 250000, deal_stage: "discovery", last_contacted_days_ago: 14, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p016", company_name: "Drift Retail Solutions", contact_name: "Monica Okafor", contact_title: "Head of Revenue", industry: "Retail Tech", employees: 220, deal_size_arr: 48000, deal_stage: "prospecting", last_contacted_days_ago: 90, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p017", company_name: "Sterling Property Group", contact_name: "William Park", contact_title: "CRO", industry: "Real Estate", employees: 310, deal_size_arr: 92000, deal_stage: "discovery", last_contacted_days_ago: 6, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p018", company_name: "Quantum DevOps", contact_name: "Sara Lindqvist", contact_title: "VP Engineering", industry: "SaaS", employees: 75, deal_size_arr: 38000, deal_stage: "prospecting", last_contacted_days_ago: 55, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p019", company_name: "Atlas Fleet Management", contact_name: "Robert Hughes", contact_title: "Director of Ops", industry: "Logistics", employees: 890, deal_size_arr: 145000, deal_stage: "negotiation", last_contacted_days_ago: 11, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "hiring", content: "Atlas posted VP of Revenue Operations role. Current tools described as fragmented." }, { signal_type: "crm_note", content: "Robert Hughes replied to cold outreach within 4 hours. Very responsive." }] },
  { id: "p020", company_name: "Meridian EdTech", contact_name: "Aisha Nkosi", contact_title: "Head of Sales", industry: "EdTech", employees: 160, deal_size_arr: 52000, deal_stage: "discovery", last_contacted_days_ago: 20, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p021", company_name: "Granite Legal Tech", contact_name: "Brian Callahan", contact_title: "Managing Partner", industry: "Legal", employees: 45, deal_size_arr: 28000, deal_stage: "prospecting", last_contacted_days_ago: 75, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p022", company_name: "Horizon HR Platform", contact_name: "Jessica Wang", contact_title: "CHRO", industry: "HR Tech", employees: 280, deal_size_arr: 82000, deal_stage: "discovery", last_contacted_days_ago: 9, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p023", company_name: "Vertex Supply Chain", contact_name: "Carlos Mendez", contact_title: "VP Supply Chain", industry: "Manufacturing", employees: 1500, deal_size_arr: 220000, deal_stage: "negotiation", last_contacted_days_ago: 4, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "funding", content: "$320M raised. Vertex expanding into North American supply chain market aggressively." }, { signal_type: "linkedin", content: "Carlos Mendez: 'Manual reporting is costing us 10 hours a week. Has to change.'" }] },
  { id: "p024", company_name: "Luminary Marketing AI", contact_name: "Danielle Foster", contact_title: "CMO", industry: "MarTech", employees: 130, deal_size_arr: 67000, deal_stage: "prospecting", last_contacted_days_ago: 33, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p025", company_name: "Coastal Wealth Management", contact_name: "George Abramowitz", contact_title: "Managing Director", industry: "Finance", employees: 520, deal_size_arr: 195000, deal_stage: "discovery", last_contacted_days_ago: 16, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "funding", content: "$680M AUM. New PE ownership pushing for operational modernization." }] },
  { id: "p026", company_name: "Firefly IoT Solutions", contact_name: "Mei Zhang", contact_title: "CTO", industry: "IoT", employees: 210, deal_size_arr: 73000, deal_stage: "prospecting", last_contacted_days_ago: 48, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p027", company_name: "Bastion Compliance", contact_name: "Patrick O'Brien", contact_title: "Chief Compliance Officer", industry: "Legal", employees: 175, deal_size_arr: 59000, deal_stage: "discovery", last_contacted_days_ago: 25, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p028", company_name: "NovaStar Hospitality Tech", contact_name: "Isabella Romano", contact_title: "VP Revenue", industry: "Hospitality", employees: 340, deal_size_arr: 86000, deal_stage: "negotiation", last_contacted_days_ago: 13, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p029", company_name: "Pulsar Data Systems", contact_name: "Kevin Oduya", contact_title: "Head of Data", industry: "SaaS", employees: 115, deal_size_arr: 44000, deal_stage: "prospecting", last_contacted_days_ago: 67, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p030", company_name: "Titan Pharma Solutions", contact_name: "Dr. Susan Blake", contact_title: "VP Commercial", industry: "Pharma", employees: 2800, deal_size_arr: 380000, deal_stage: "negotiation", last_contacted_days_ago: 6, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "news", content: "Dr. Susan Blake quoted in FiercePharma on AI-driven sales transformation." }, { signal_type: "hiring", content: "Titan posted 6 Regional Sales Manager roles this month. Major growth push." }] },
  { id: "p031", company_name: "Clearwater Risk Analytics", contact_name: "Andrew Fong", contact_title: "CRO", industry: "Fintech", employees: 195, deal_size_arr: 110000, deal_stage: "discovery", last_contacted_days_ago: 10, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p032", company_name: "Summit Construction Tech", contact_name: "Michael Torres", contact_title: "VP Operations", industry: "Construction", employees: 670, deal_size_arr: 135000, deal_stage: "prospecting", last_contacted_days_ago: 42, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p033", company_name: "Wren Customer Success", contact_name: "Olivia Bennett", contact_title: "VP Customer Success", industry: "SaaS", employees: 88, deal_size_arr: 35000, deal_stage: "discovery", last_contacted_days_ago: 28, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p034", company_name: "Redwood Media Group", contact_name: "Tyler Johnson", contact_title: "Head of Partnerships", industry: "Media", employees: 410, deal_size_arr: 98000, deal_stage: "negotiation", last_contacted_days_ago: 8, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p035", company_name: "Pathfinder Travel Tech", contact_name: "Amara Diallo", contact_title: "CRO", industry: "Travel Tech", employees: 155, deal_size_arr: 62000, deal_stage: "prospecting", last_contacted_days_ago: 52, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p036", company_name: "Ionic Security Platform", contact_name: "Raj Kapoor", contact_title: "VP Security", industry: "Cybersecurity", employees: 240, deal_size_arr: 142000, deal_stage: "discovery", last_contacted_days_ago: 17, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p037", company_name: "Meadowbrook Agriculture", contact_name: "Hannah Schmidt", contact_title: "Director of Sales", industry: "AgTech", employees: 580, deal_size_arr: 168000, deal_stage: "negotiation", last_contacted_days_ago: 5, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p038", company_name: "Archway Insurance Tech", contact_name: "Samuel Okonkwo", contact_title: "Head of Digital", industry: "Insurance", employees: 720, deal_size_arr: 230000, deal_stage: "discovery", last_contacted_days_ago: 21, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p039", company_name: "Mosaic Learning Platform", contact_name: "Claire Dupont", contact_title: "VP Product", industry: "EdTech", employees: 105, deal_size_arr: 41000, deal_stage: "prospecting", last_contacted_days_ago: 80, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p040", company_name: "Spire Accounting Software", contact_name: "David Huang", contact_title: "CFO", industry: "Fintech", employees: 165, deal_size_arr: 76000, deal_stage: "discovery", last_contacted_days_ago: 14, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p041", company_name: "Tundra Cold Chain", contact_name: "Lisa Nakamura", contact_title: "VP Logistics", industry: "Logistics", employees: 950, deal_size_arr: 185000, deal_stage: "negotiation", last_contacted_days_ago: 9, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p042", company_name: "Celeste HR Analytics", contact_name: "Marcus Brown", contact_title: "CHRO", industry: "HR Tech", employees: 290, deal_size_arr: 89000, deal_stage: "prospecting", last_contacted_days_ago: 38, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p043", company_name: "Fulcrum Sales Intelligence", contact_name: "Emma Kowalski", contact_title: "VP Sales", industry: "SaaS", employees: 145, deal_size_arr: 57000, deal_stage: "discovery", last_contacted_days_ago: 23, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p044", company_name: "Ironwood Cyber Defense", contact_name: "Alex Petrov", contact_title: "CISO", industry: "Cybersecurity", employees: 180, deal_size_arr: 125000, deal_stage: "negotiation", last_contacted_days_ago: 3, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "crm_note", content: "Ironwood just lost a key client to a competitor — actively evaluating tools." }, { signal_type: "funding", content: "$55M Series B. Alex Petrov joined from CrowdStrike 2 months ago." }] },
  { id: "p045", company_name: "Solstice Real Estate CRM", contact_name: "Natalie Cruz", contact_title: "Head of Sales", industry: "Real Estate", employees: 95, deal_size_arr: 33000, deal_stage: "prospecting", last_contacted_days_ago: 70, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p046", company_name: "Tempest Fleet Analytics", contact_name: "Owen Murphy", contact_title: "VP Operations", industry: "Logistics", employees: 760, deal_size_arr: 158000, deal_stage: "discovery", last_contacted_days_ago: 11, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p047", company_name: "Catalyst Pharma CRM", contact_name: "Dr. Jennifer Liu", contact_title: "Commercial Lead", industry: "Pharma", employees: 1900, deal_size_arr: 320000, deal_stage: "negotiation", last_contacted_days_ago: 7, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "news", content: "Catalyst Pharma received FDA breakthrough designation. Commercial ramp imminent." }, { signal_type: "hiring", content: "Jennifer Liu posted 12 sales ops roles. Building commercial infrastructure from scratch." }] },
  { id: "p048", company_name: "Keystone BI Platform", contact_name: "Robert Adeyemi", contact_title: "Head of Analytics", industry: "SaaS", employees: 210, deal_size_arr: 83000, deal_stage: "discovery", last_contacted_days_ago: 19, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p049", company_name: "Pinnacle Workforce AI", contact_name: "Sophie Martin", contact_title: "CHRO", industry: "HR Tech", employees: 380, deal_size_arr: 107000, deal_stage: "prospecting", last_contacted_days_ago: 44, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p050", company_name: "Copper Street Fintech", contact_name: "Julian Reyes", contact_title: "CTO", industry: "Fintech", employees: 125, deal_size_arr: 48000, deal_stage: "discovery", last_contacted_days_ago: 26, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p051", company_name: "Wavecrest Hospitality", contact_name: "Diana Osei", contact_title: "VP Revenue", industry: "Hospitality", employees: 480, deal_size_arr: 142000, deal_stage: "negotiation", last_contacted_days_ago: 4, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p052", company_name: "Irongate Legal AI", contact_name: "Christopher Hall", contact_title: "Managing Partner", industry: "Legal", employees: 65, deal_size_arr: 31000, deal_stage: "prospecting", last_contacted_days_ago: 85, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p053", company_name: "Solaris Construction AI", contact_name: "Mei-Ling Chen", contact_title: "VP Technology", industry: "Construction", employees: 540, deal_size_arr: 162000, deal_stage: "discovery", last_contacted_days_ago: 15, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p054", company_name: "Zenith Customer Data", contact_name: "Patrick Kimani", contact_title: "CDP Lead", industry: "MarTech", employees: 170, deal_size_arr: 71000, deal_stage: "prospecting", last_contacted_days_ago: 57, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p055", company_name: "Glacier Supply Co", contact_name: "Amanda Walsh", contact_title: "VP Supply Chain", industry: "Manufacturing", employees: 1100, deal_size_arr: 198000, deal_stage: "negotiation", last_contacted_days_ago: 8, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p056", company_name: "Radiant Health AI", contact_name: "Dr. Marcus Webb", contact_title: "CMO", industry: "Healthcare", employees: 890, deal_size_arr: 275000, deal_stage: "discovery", last_contacted_days_ago: 12, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p057", company_name: "Stormcloud DevTools", contact_name: "Yuki Tanaka", contact_title: "VP Engineering", industry: "SaaS", employees: 92, deal_size_arr: 39000, deal_stage: "prospecting", last_contacted_days_ago: 63, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p058", company_name: "Meridian Payments", contact_name: "Grace Okonjo", contact_title: "Head of Partnerships", industry: "Fintech", employees: 265, deal_size_arr: 94000, deal_stage: "negotiation", last_contacted_days_ago: 6, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p059", company_name: "Harborview Shipping Tech", contact_name: "Thomas Berg", contact_title: "VP Logistics", industry: "Logistics", employees: 1340, deal_size_arr: 240000, deal_stage: "discovery", last_contacted_days_ago: 18, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p060", company_name: "Axiom Revenue Ops", contact_name: "Priscilla Owens", contact_title: "VP RevOps", industry: "SaaS", employees: 135, deal_size_arr: 53000, deal_stage: "prospecting", last_contacted_days_ago: 71, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p061", company_name: "Driftwood Media Tech", contact_name: "Samuel Lee", contact_title: "Head of Digital", industry: "Media", employees: 295, deal_size_arr: 87000, deal_stage: "discovery", last_contacted_days_ago: 22, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p062", company_name: "Falcon AgriTech", contact_name: "Ingrid Larsson", contact_title: "CRO", industry: "AgTech", employees: 420, deal_size_arr: 132000, deal_stage: "negotiation", last_contacted_days_ago: 5, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p063", company_name: "Boundless Travel Platform", contact_name: "Kwame Asante", contact_title: "VP Product", industry: "Travel Tech", employees: 185, deal_size_arr: 66000, deal_stage: "prospecting", last_contacted_days_ago: 49, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p064", company_name: "Cobblestone Property AI", contact_name: "Rachel Fernandez", contact_title: "Head of Sales", industry: "Real Estate", employees: 115, deal_size_arr: 44000, deal_stage: "discovery", last_contacted_days_ago: 27, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p065", company_name: "Thunderbolt Cyber", contact_name: "Ivan Volkov", contact_title: "VP Security", industry: "Cybersecurity", employees: 155, deal_size_arr: 98000, deal_stage: "negotiation", last_contacted_days_ago: 10, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p066", company_name: "Prairie Health Systems", contact_name: "Dr. Angela Foster", contact_title: "VP Clinical Ops", industry: "Healthcare", employees: 3200, deal_size_arr: 420000, deal_stage: "discovery", last_contacted_days_ago: 8, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "funding", content: "$1.2B valuation. Prairie Health expanding into 5 new states. Sales team tripling." }, { signal_type: "linkedin", content: "Angela Foster: 'Our sales data is siloed across 6 systems. We are flying blind.'" }] },
  { id: "p067", company_name: "Brightline EdTech", contact_name: "Noah Williams", contact_title: "Head of Revenue", industry: "EdTech", employees: 140, deal_size_arr: 49000, deal_stage: "prospecting", last_contacted_days_ago: 58, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p068", company_name: "Vortex Insurance AI", contact_name: "Caroline Dubois", contact_title: "Chief Digital Officer", industry: "Insurance", employees: 1650, deal_size_arr: 285000, deal_stage: "negotiation", last_contacted_days_ago: 3, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "news", content: "Vortex Insurance awarded $400M state contract. Digital transformation mandate issued." }, { signal_type: "crm_note", content: "Caroline Dubois personally reached out via LinkedIn after seeing our case study." }] },
  { id: "p069", company_name: "Compass Workforce", contact_name: "Alicia Mwangi", contact_title: "VP HR Tech", industry: "HR Tech", employees: 245, deal_size_arr: 78000, deal_stage: "discovery", last_contacted_days_ago: 16, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p070", company_name: "Ironbark Manufacturing OS", contact_name: "Derek Johansson", contact_title: "CTO", industry: "Manufacturing", employees: 780, deal_size_arr: 175000, deal_stage: "prospecting", last_contacted_days_ago: 40, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p071", company_name: "Nighthawk Security", contact_name: "Brandon Osei", contact_title: "CISO", industry: "Cybersecurity", employees: 110, deal_size_arr: 62000, deal_stage: "discovery", last_contacted_days_ago: 24, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p072", company_name: "Clearfield Fintech", contact_name: "Mei Park", contact_title: "CFO", industry: "Fintech", employees: 195, deal_size_arr: 85000, deal_stage: "negotiation", last_contacted_days_ago: 7, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p073", company_name: "Amber Retail Analytics", contact_name: "Zoe Thompson", contact_title: "VP Merchandising", industry: "Retail Tech", employees: 320, deal_size_arr: 96000, deal_stage: "discovery", last_contacted_days_ago: 13, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p074", company_name: "Skyline Construction Mgmt", contact_name: "Franklin Oduya", contact_title: "VP Projects", industry: "Construction", employees: 920, deal_size_arr: 215000, deal_stage: "negotiation", last_contacted_days_ago: 6, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p075", company_name: "Veritas Legal Platform", contact_name: "Patricia Nguyen", contact_title: "Chief Legal Officer", industry: "Legal", employees: 55, deal_size_arr: 26000, deal_stage: "prospecting", last_contacted_days_ago: 92, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p076", company_name: "Lodestar Pharma", contact_name: "Dr. Richard Stein", contact_title: "VP Commercial", industry: "Pharma", employees: 2400, deal_size_arr: 355000, deal_stage: "discovery", last_contacted_days_ago: 11, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "funding", content: "Lodestar raised $180M. Board pushing for 40% revenue growth next fiscal year." }, { signal_type: "hiring", content: "Richard Stein posted VP Sales Ops role. JD explicitly mentions Salesforce replacement." }] },
  { id: "p077", company_name: "Citadel Revenue Cloud", contact_name: "Fiona Okafor", contact_title: "CRO", industry: "SaaS", employees: 175, deal_size_arr: 68000, deal_stage: "prospecting", last_contacted_days_ago: 46, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p078", company_name: "Tidal Wave Logistics", contact_name: "Henry Cho", contact_title: "VP Operations", industry: "Logistics", employees: 1050, deal_size_arr: 192000, deal_stage: "negotiation", last_contacted_days_ago: 9, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p079", company_name: "Greenfield AgriSoft", contact_name: "Astrid Nilsson", contact_title: "Head of Sales", industry: "AgTech", employees: 365, deal_size_arr: 118000, deal_stage: "discovery", last_contacted_days_ago: 20, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p080", company_name: "Eclipse Hospitality OS", contact_name: "Marco Rossi", contact_title: "VP Revenue", industry: "Hospitality", employees: 560, deal_size_arr: 155000, deal_stage: "prospecting", last_contacted_days_ago: 35, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p081", company_name: "Foundry Data Platform", contact_name: "Keisha Johnson", contact_title: "Head of Data", industry: "SaaS", employees: 200, deal_size_arr: 77000, deal_stage: "discovery", last_contacted_days_ago: 17, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p082", company_name: "Northgate Risk", contact_name: "Sebastian Muller", contact_title: "CRO", industry: "Finance", employees: 430, deal_size_arr: 138000, deal_stage: "negotiation", last_contacted_days_ago: 4, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "crm_note", content: "Northgate Risk vendor contract expires in 60 days. Actively seeking alternatives." }, { signal_type: "linkedin", content: "Sebastian Muller: 'Our current analytics vendor has let us down for the last time'" }] },
  { id: "p083", company_name: "Sunrise Health Analytics", contact_name: "Dr. Yolanda Pierce", contact_title: "VP Analytics", industry: "Healthcare", employees: 1100, deal_size_arr: 290000, deal_stage: "discovery", last_contacted_days_ago: 10, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "news", content: "Sunrise Health Analytics acquired by major hospital network. New budget unlocked." }, { signal_type: "crm_note", content: "Yolanda Pierce attended our Healthcare AI webinar and submitted 3 questions." }] },
  { id: "p084", company_name: "Cascade MarTech", contact_name: "Liam O'Sullivan", contact_title: "CMO", industry: "MarTech", employees: 148, deal_size_arr: 58000, deal_stage: "prospecting", last_contacted_days_ago: 53, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p085", company_name: "Sterling Cybersecurity", contact_name: "Elena Kovacs", contact_title: "CISO", industry: "Cybersecurity", employees: 195, deal_size_arr: 112000, deal_stage: "negotiation", last_contacted_days_ago: 6, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "news", content: "Sterling Cybersecurity won Best Emerging Vendor at RSA. Pipeline exploding." }, { signal_type: "funding", content: "$75M Series C. Elena Kovacs hired as CISO to lead enterprise sales transformation." }] },
  { id: "p086", company_name: "Beacon Supply Chain AI", contact_name: "Terrence Abara", contact_title: "VP Supply Chain", industry: "Manufacturing", employees: 840, deal_size_arr: 168000, deal_stage: "discovery", last_contacted_days_ago: 14, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p087", company_name: "Cloudmere SaaS Platform", contact_name: "Vivian Cheng", contact_title: "VP Sales", industry: "SaaS", employees: 155, deal_size_arr: 61000, deal_stage: "prospecting", last_contacted_days_ago: 68, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p088", company_name: "Frontier Real Estate AI", contact_name: "Nathan Osei", contact_title: "Head of Proptech", industry: "Real Estate", employees: 205, deal_size_arr: 89000, deal_stage: "negotiation", last_contacted_days_ago: 5, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "crm_note", content: "Frontier Real Estate AI CEO mentioned us by name in a podcast last week." }, { signal_type: "hiring", content: "Frontier posted Head of Revenue Operations role — JD mentions AI-first tooling." }] },
  { id: "p089", company_name: "Apex Travel Intelligence", contact_name: "Isabella Ferreira", contact_title: "CRO", industry: "Travel Tech", employees: 270, deal_size_arr: 103000, deal_stage: "discovery", last_contacted_days_ago: 19, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p090", company_name: "Colossus HR Platform", contact_name: "James Adeyemi", contact_title: "CHRO", industry: "HR Tech", employees: 415, deal_size_arr: 122000, deal_stage: "negotiation", last_contacted_days_ago: 8, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "funding", content: "Colossus raised $85M. James Adeyemi joining from Workday to modernize HR stack." }, { signal_type: "hiring", content: "Colossus posted 5 RevOps analyst roles this week. Building data infrastructure." }] },
  { id: "p091", company_name: "Halcyon Fintech", contact_name: "Rachel Tanaka", contact_title: "CFO", industry: "Fintech", employees: 155, deal_size_arr: 72000, deal_stage: "prospecting", last_contacted_days_ago: 60, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p092", company_name: "Redstone Legal AI", contact_name: "Connor Walsh", contact_title: "Managing Partner", industry: "Legal", employees: 80, deal_size_arr: 34000, deal_stage: "discovery", last_contacted_days_ago: 29, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p093", company_name: "Polar Analytics", contact_name: "Nina Bjork", contact_title: "VP Analytics", industry: "SaaS", employees: 118, deal_size_arr: 46000, deal_stage: "prospecting", last_contacted_days_ago: 77, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p094", company_name: "Thunderhead Insurance", contact_name: "Maurice Okonkwo", contact_title: "Chief Digital Officer", industry: "Insurance", employees: 1850, deal_size_arr: 310000, deal_stage: "negotiation", last_contacted_days_ago: 7, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "news", content: "Thunderhead Insurance merged with Pacific Mutual. Integration creating tool chaos." }, { signal_type: "crm_note", content: "Maurice Okonkwo was at our booth at InsureTech Connect. Took detailed notes." }] },
  { id: "p095", company_name: "Mosaic Pharma CRM", contact_name: "Dr. Cynthia Park", contact_title: "VP Commercial", industry: "Pharma", employees: 2100, deal_size_arr: 340000, deal_stage: "discovery", last_contacted_days_ago: 13, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "funding", content: "Mosaic Pharma $220M Series E. Cynthia Park tasked with building commercial AI stack." }, { signal_type: "linkedin", content: "Cynthia Park: 'Evaluating AI-native tools for our commercial team this quarter'" }] },
  { id: "p096", company_name: "Ironside Construction", contact_name: "Patrick Sullivan", contact_title: "VP Technology", industry: "Construction", employees: 710, deal_size_arr: 188000, deal_stage: "prospecting", last_contacted_days_ago: 43, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p097", company_name: "Wavefront EdTech", contact_name: "Amara Osei", contact_title: "Head of Revenue", industry: "EdTech", employees: 178, deal_size_arr: 55000, deal_stage: "negotiation", last_contacted_days_ago: 11, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p098", company_name: "Zenith Cloud ERP", contact_name: "Henry Nakamura", contact_title: "VP Sales", industry: "SaaS", employees: 445, deal_size_arr: 165000, deal_stage: "discovery", last_contacted_days_ago: 7, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "funding", content: "$88M Series C. Zenith displacing legacy ERP at mid-market." }, { signal_type: "hiring", content: "Posted 10 enterprise AE roles. Aggressive Q3 expansion plan." }] },
  { id: "p099", company_name: "Magellan Data Ops", contact_name: "Serena Obi", contact_title: "Head of RevOps", industry: "SaaS", employees: 132, deal_size_arr: 51000, deal_stage: "prospecting", last_contacted_days_ago: 35, score: null, score_reasoning: null, next_action: null, signals: [] },
  { id: "p100", company_name: "Fortress Risk Management", contact_name: "Oliver Kane", contact_title: "CRO", industry: "Finance", employees: 610, deal_size_arr: 212000, deal_stage: "negotiation", last_contacted_days_ago: 5, score: null, score_reasoning: null, next_action: null, signals: [{ signal_type: "crm_note", content: "Oliver Kane sent unsolicited RFP last week. Very high intent." }, { signal_type: "news", content: "Fortress just went public. Modernization budget unlocked post-IPO." }] },
];

// ── Claude API call ──────────────────────────────────────────────────────────
async function callClaude(prompt, systemPrompt = "") {
  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      system: systemPrompt || "You are a senior B2B sales intelligence analyst. Return ONLY valid JSON, no markdown, no explanation.",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content.filter(b => b.type === "text").map(b => b.text).join("");
}

function parseJSON(text) {
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

// ── UI helpers ───────────────────────────────────────────────────────────────
const TIER = s => s >= 75 ? "hot" : s >= 45 ? "warm" : "cold";
const TS = {
  hot:  { accent: "#ef4444", glow: "#ef444412", label: "HOT" },
  warm: { accent: "#f59e0b", glow: "#f59e0b12", label: "WARM" },
  cold: { accent: "#818cf8", glow: "#818cf812", label: "COLD" },
};

function Tag({ children, color = "#4a4a6a" }) {
  return (
    <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "4px", background: color + "22", color, border: `1px solid ${color}44`, fontFamily: "monospace", whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function ProspectRow({ prospect, onScore, scoring, highlight, index }) {
  const [open, setOpen] = useState(false);
  const scored = prospect.score !== null && prospect.score !== undefined;
  const tier = scored ? TIER(prospect.score) : null;
  const ts = tier ? TS[tier] : null;
  const stale = prospect.last_contacted_days_ago > 30;

  return (
    <>
      <div
        onClick={() => scored && setOpen(o => !o)}
        style={{
          display: "grid",
          gridTemplateColumns: "28px 1fr 90px 80px 90px 70px 64px 56px",
          alignItems: "center",
          gap: "0",
          padding: "0 4px",
          background: highlight ? "#0d1a0d" : open ? "#111120" : index % 2 === 0 ? "#0a0a12" : "#080810",
          borderLeft: `2px solid ${highlight ? "#22c55e" : scored ? ts.accent : "transparent"}`,
          cursor: scored ? "pointer" : "default",
          transition: "background 0.15s",
          minHeight: "40px",
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = "#0f0f1c"; }}
        onMouseLeave={e => { e.currentTarget.style.background = highlight ? "#0d1a0d" : open ? "#111120" : index % 2 === 0 ? "#0a0a12" : "#080810"; }}
      >
        {/* Row number */}
        <div style={{ fontSize: "9px", color: "#4a4a6a", fontFamily: "monospace", textAlign: "center" }}>{index + 1}</div>

        {/* Company + contact */}
        <div style={{ padding: "8px 12px 8px 4px", minWidth: 0 }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: "#eeeef8", fontFamily: "'DM Sans', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {prospect.company_name}
          </div>
          <div style={{ fontSize: "10px", color: "#6a6a8a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {prospect.contact_name} · {prospect.contact_title}
          </div>
        </div>

        {/* Industry */}
        <div style={{ fontSize: "10px", color: "#8ba8ff", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", padding: "0 8px 0 0" }}>
          {prospect.industry}
        </div>

        {/* ARR */}
        <div style={{ fontSize: "11px", color: "#22c55e", fontFamily: "monospace", fontWeight: "600" }}>
          ${(prospect.deal_size_arr / 1000).toFixed(0)}K
        </div>

        {/* Stage */}
        <div style={{ fontSize: "10px", color: "#c4b5fd", fontFamily: "monospace" }}>
          {prospect.deal_stage}
        </div>

        {/* Last contact */}
        <div style={{ fontSize: "10px", color: stale ? "#ef4444" : "#7a7a9a", fontFamily: "monospace" }}>
          {prospect.last_contacted_days_ago}d ago
        </div>

        {/* Signals */}
        <div style={{ fontSize: "10px", color: prospect.signals?.length ? "#fbbf24" : "#2a2a3a", fontFamily: "monospace", textAlign: "center" }}>
          {prospect.signals?.length ? `⚡ ${prospect.signals.length}` : "—"}
        </div>

        {/* Score or button */}
        <div style={{ textAlign: "right", paddingRight: "8px" }}>
          {scored ? (
            <span style={{ fontSize: "14px", fontWeight: "900", color: ts.accent, fontFamily: "'Bebas Neue', sans-serif" }}>
              {prospect.score} {open ? "▲" : "▼"}
            </span>
          ) : (
            <button
              onClick={e => { e.stopPropagation(); onScore(prospect); }}
              disabled={scoring}
              style={{ padding: "3px 8px", borderRadius: "4px", background: scoring ? "#111120" : "linear-gradient(135deg, #1d4ed8, #6366f1)", border: "none", color: "#fff", fontSize: "9px", fontWeight: "700", cursor: scoring ? "not-allowed" : "pointer", fontFamily: "monospace", opacity: scoring ? 0.4 : 1 }}>
              {scoring ? "..." : "SCORE"}
            </button>
          )}
        </div>
      </div>

      {/* Expanded detail row */}
      {scored && open && (
        <div style={{ background: "#0d0d1e", borderLeft: `2px solid ${ts.accent}`, padding: "12px 16px 14px 32px", borderBottom: "1px solid #1a1a2e" }}>
          {highlight && <div style={{ fontSize: "9px", color: "#22c55e", fontFamily: "monospace", marginBottom: "8px" }}>✦ UPDATED BY AGENT 5</div>}
          <p style={{ fontSize: "12px", color: "#b0b0c8", lineHeight: "1.6", marginBottom: "10px", fontFamily: "'DM Sans', sans-serif" }}>
            {prospect.score_reasoning}
          </p>
          {prospect.signals?.length > 0 && (
            <div style={{ marginBottom: "10px" }}>
              <div style={{ fontSize: "9px", color: "#3a3a5a", fontFamily: "monospace", letterSpacing: "0.08em", marginBottom: "5px" }}>SIGNALS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                {prospect.signals.map((s, i) => (
                  <div key={i} style={{ fontSize: "10px", color: "#5a5a7a", fontFamily: "monospace", padding: "4px 8px", background: "#080810", borderRadius: "4px", borderLeft: `2px solid ${ts.accent}44` }}>
                    <span style={{ color: ts.accent }}>⚡ {s.signal_type}</span> · {s.content}
                  </div>
                ))}
              </div>
            </div>
          )}
          {prospect.next_action && (
            <div style={{ padding: "8px 12px", background: "#080810", borderRadius: "6px", borderLeft: `3px solid ${ts.accent}`, display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <div style={{ fontSize: "9px", color: "#3a3a5a", fontFamily: "monospace", letterSpacing: "0.08em", whiteSpace: "nowrap", paddingTop: "1px" }}>NEXT ACTION</div>
              <div style={{ fontSize: "12px", color: "#e0e0f0", fontFamily: "'DM Sans', sans-serif" }}>{prospect.next_action}</div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [prospects, setProspects] = useState(PROSPECTS_RAW);
  const [scoring, setScoring] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [agentLog, setAgentLog] = useState([]);
  const [nlQuery, setNlQuery] = useState("");
  const [nlRunning, setNlRunning] = useState(false);
  const [filteredIds, setFilteredIds] = useState(null);
  const [agent5Running, setAgent5Running] = useState(false);
  const [updatedIds, setUpdatedIds] = useState(new Set());
  const [dayCount, setDayCount] = useState(0);
  const [activeTab, setActiveTab] = useState("prospects");
  const [autoScoring, setAutoScoring] = useState(false);
  const [filterIndustry, setFilterIndustry] = useState("ALL");
  const [filterStage, setFilterStage] = useState("ALL");
  const [filterTier, setFilterTier] = useState("ALL");
  const [sortBy, setSortBy] = useState("score");
  const [enrichCompany, setEnrichCompany] = useState("");
  const [enrichContact, setEnrichContact] = useState("");
  const [enriching, setEnriching] = useState(false);

  function addLog(agent, action, result) {
    setAgentLog(prev => [{ agent, action, result, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 19)]);
  }

  // ── Agent 1: Prospect Enrichment ───────────────────────────────────────
  async function runAgent1() {
    if (!enrichCompany.trim()) return;
    setEnriching(true);
    setStatusMsg(`Agent 1 researching ${enrichCompany}...`);
    try {
      const text = await callClaude(`You are Agent 1, a B2B sales prospect enrichment agent. Generate a realistic prospect record for this company.

Company: ${enrichCompany}
Contact (if provided): ${enrichContact || "make up a realistic senior sales/ops contact"}

Create a fully realistic prospect as if you had researched it. Return ONLY JSON:
{
  "company_name": "${enrichCompany}",
  "contact_name": "<realistic full name>",
  "contact_title": "<realistic senior title e.g. VP Sales, CRO, Head of Revenue>",
  "industry": "<one of: SaaS, Healthcare, Fintech, Logistics, Manufacturing, Legal, Cybersecurity, Real Estate, EdTech, HR Tech, MarTech, Pharma, Construction, Finance, AgTech>",
  "employees": <realistic integer>,
  "deal_size_arr": <realistic integer between 30000-500000>,
  "deal_stage": "prospecting",
  "last_contacted_days_ago": 0,
  "signals": [
    {"signal_type": "funding", "content": "<realistic funding or growth signal>"},
    {"signal_type": "linkedin", "content": "<realistic LinkedIn pain post from the contact>"},
    {"signal_type": "hiring", "content": "<realistic hiring signal that implies tool needs>"}
  ]
}`);
      const result = parseJSON(text);
      const newProspect = {
        ...result,
        id: `enrich_${Date.now()}`,
        score: null,
        score_reasoning: null,
        next_action: null,
      };
      setProspects(prev => [newProspect, ...prev]);
      setUpdatedIds(new Set([newProspect.id]));
      setTimeout(() => setUpdatedIds(new Set()), 8000);
      addLog("agent-1", `Enriched ${enrichCompany}`, "3 signals generated");
      setEnrichCompany("");
      setEnrichContact("");
      // Auto-score it
      await scoreOne(newProspect);
    } catch (e) { console.error(e); }
    finally { setEnriching(false); setStatusMsg(""); }
  }

  async function scoreOne(prospect) {
    setScoring(prospect.id);
    setStatusMsg(`Scoring ${prospect.company_name}...`);
    try {
      const sigText = prospect.signals?.map(s => `[${s.signal_type.toUpperCase()}] ${s.content}`).join("\n") || "No signals.";
      const text = await callClaude(`Score this B2B prospect 0-100 for sales priority.
Company: ${prospect.company_name} | Contact: ${prospect.contact_name}, ${prospect.contact_title}
Industry: ${prospect.industry} | Employees: ${prospect.employees} | ARR: $${prospect.deal_size_arr?.toLocaleString()}
Stage: ${prospect.deal_stage} | Last contacted: ${prospect.last_contacted_days_ago} days ago
Signals:\n${sigText}
Return: {"score": <integer>, "score_reasoning": "<2-3 sentences>", "next_action": "<specific action this week>"}`);
      const result = parseJSON(text);
      setProspects(prev => prev.map(p => p.id === prospect.id ? { ...p, ...result } : p));
      addLog("scoring-agent", `Scored ${prospect.company_name}`, `${result.score}/100`);
    } catch (e) { console.error(e); }
    finally { setScoring(null); setStatusMsg(""); }
  }

  async function scoreAll() {
    const unscored = prospects.filter(p => p.score === null || p.score === undefined);
    for (const p of unscored) await scoreOne(p);
  }

  async function autoScoreTop() {
    setAutoScoring(true);
    const top10 = [...PROSPECTS_RAW].filter(p => p.signals.length > 0).sort((a, b) => b.deal_size_arr - a.deal_size_arr).slice(0, 10);
    for (const p of top10) await scoreOne(p);
    setAutoScoring(false);
  }

  async function runNLQuery() {
    if (!nlQuery.trim()) return;
    setNlRunning(true);
    setStatusMsg("NL Query agent thinking...");
    try {
      const summary = prospects.map(p => `ID:${p.id} | ${p.company_name} | ${p.industry} | $${(p.deal_size_arr/1000).toFixed(0)}K | Stage:${p.deal_stage} | ${p.last_contacted_days_ago}d ago | Score:${p.score ?? "unscored"} | Signals:${p.signals?.length || 0}`).join("\n");
      const text = await callClaude(`Sales query agent. Return IDs matching this query: "${nlQuery}"\n\nPROSPECTS:\n${summary}\n\nReturn ONLY a JSON array of IDs e.g. ["p001","p014"]. Return [] if nothing matches.`);
      const ids = parseJSON(text);
      setFilteredIds(Array.isArray(ids) ? ids : null);
      addLog("nl-query-agent", `"${nlQuery}"`, `${Array.isArray(ids) ? ids.length : 0} matches`);
    } catch (e) { console.error(e); }
    finally { setNlRunning(false); setStatusMsg(""); }
  }

  async function runAgent5() {
    setAgent5Running(true);
    setDayCount(d => d + 1);
    setStatusMsg("Agent 5 simulating a day passing...");
    try {
      const summary = prospects.slice(0, 30).map(p => `ID:${p.id} | ${p.company_name} | Stage:${p.deal_stage} | ${p.last_contacted_days_ago}d ago`).join("\n");
      const companies = [
        { name: "Apex Revenue Intelligence", industry: "SaaS", employees: 280, arr: 92000 },
        { name: "Stellar Supply AI", industry: "Manufacturing", employees: 1100, arr: 195000 },
        { name: "Clearview Legal Tech", industry: "Legal", employees: 90, arr: 38000 },
        { name: "Momentum Health Data", industry: "Healthcare", employees: 650, arr: 245000 },
        { name: "Ironwood Customer Platform", industry: "HR Tech", employees: 340, arr: 78000 },
      ];
      const co = companies[dayCount % companies.length];
      const text = await callClaude(`You are Agent 5. Simulate one business day in a sales org.

Prospects:\n${summary}

1. Pick 3-5 IDs and update them (contact recency, stage change, or new signal)
2. Create 1 new prospect: ${co.name} | ${co.industry} | ${co.employees} employees | $${co.arr} ARR

Return JSON only:
{"updates":[{"id":"<id>","last_contacted_days_ago":<number>,"deal_stage":"<stage>","new_signal":"<text or null>"}],"new_prospect":{"id":"new_${Date.now()}","company_name":"${co.name}","contact_name":"<name>","contact_title":"<title>","industry":"${co.industry}","employees":${co.employees},"deal_size_arr":${co.arr},"deal_stage":"prospecting","last_contacted_days_ago":0,"score":null,"score_reasoning":null,"next_action":null,"signals":[{"signal_type":"crm_note","content":"<reason added today>"}]}}`);
      const result = parseJSON(text);
      const newIds = new Set();
      setProspects(prev => {
        let updated = prev.map(p => {
          const ch = result.updates?.find(u => u.id === p.id);
          if (!ch) return p;
          newIds.add(p.id);
          return { ...p, last_contacted_days_ago: ch.last_contacted_days_ago ?? p.last_contacted_days_ago, deal_stage: ch.deal_stage ?? p.deal_stage, signals: ch.new_signal ? [...(p.signals||[]), { signal_type: "crm_note", content: ch.new_signal }] : p.signals };
        });
        if (result.new_prospect) { newIds.add(result.new_prospect.id); updated = [result.new_prospect, ...updated]; }
        return updated;
      });
      setUpdatedIds(newIds);
      setTimeout(() => setUpdatedIds(new Set()), 8000);
      addLog("agent-5", `Day ${dayCount + 1} simulated`, `${result.updates?.length || 0} updates + 1 new`);
    } catch (e) { console.error(e); }
    finally { setAgent5Running(false); setStatusMsg(""); }
  }

  const industries = useMemo(() => ["ALL", ...new Set(PROSPECTS_RAW.map(p => p.industry).sort())], []);
  const stages = ["ALL", "prospecting", "discovery", "negotiation"];
  const tiers = ["ALL", "HOT", "WARM", "COLD", "UNSCORED"];
  const totalPipeline = useMemo(() => prospects.reduce((s, p) => s + p.deal_size_arr, 0), [prospects]);
  const avgScore = useMemo(() => { const sc = prospects.filter(p => p.score !== null && p.score !== undefined); return sc.length ? Math.round(sc.reduce((s,p) => s+p.score,0)/sc.length) : null; }, [prospects]);
  const hotCount = prospects.filter(p => p.score >= 75).length;
  const warmCount = prospects.filter(p => p.score >= 45 && p.score < 75).length;
  const coldCount = prospects.filter(p => p.score !== null && p.score !== undefined && p.score < 45).length;
  const unscored = prospects.filter(p => p.score === null || p.score === undefined).length;
  const anyRunning = !!scoring || nlRunning || agent5Running || autoScoring;

  const displayProspects = useMemo(() => {
    let list = filteredIds ? prospects.filter(p => filteredIds.includes(p.id)) : [...prospects];
    if (filterIndustry !== "ALL") list = list.filter(p => p.industry === filterIndustry);
    if (filterStage !== "ALL") list = list.filter(p => p.deal_stage === filterStage);
    if (filterTier === "HOT") list = list.filter(p => p.score >= 75);
    else if (filterTier === "WARM") list = list.filter(p => p.score >= 45 && p.score < 75);
    else if (filterTier === "COLD") list = list.filter(p => p.score !== null && p.score !== undefined && p.score < 45);
    else if (filterTier === "UNSCORED") list = list.filter(p => p.score === null || p.score === undefined);
    return list.sort((a, b) => {
      if (sortBy === "score") return (b.score ?? -1) - (a.score ?? -1);
      if (sortBy === "arr") return b.deal_size_arr - a.deal_size_arr;
      if (sortBy === "stale") return b.last_contacted_days_ago - a.last_contacted_days_ago;
      return 0;
    });
  }, [prospects, filteredIds, filterIndustry, filterStage, filterTier, sortBy]);

  const Sel = ({ value, onChange, options, label }) => (
    <select value={value} onChange={e => onChange(e.target.value)} style={{ padding: "6px 10px", background: "#0f0f1e", border: `1px solid ${value !== "ALL" ? "#6366f1" : "#3a3a6a"}`, borderRadius: "6px", color: "#c0c0e0", fontSize: "10px", fontFamily: "monospace", cursor: "pointer", outline: "none" }}>
      {options.map(o => <option key={o} value={o}>{o === "ALL" ? label : o}</option>)}
    </select>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080810", padding: "24px 16px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        input::placeholder { color: #6a6a8a; }
        .enrich-input:focus { border-color: #f59e0b !important; }
        .nl-input:focus { border-color: #818cf8 !important; }
        select option { background: #0d0d18; color: #e0e0f0; }
      `}</style>

      <div style={{ maxWidth: "760px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: anyRunning ? "#f59e0b" : "#22c55e", boxShadow: `0 0 8px ${anyRunning ? "#f59e0b" : "#22c55e"}`, animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "10px", color: "#8888aa", fontFamily: "monospace", letterSpacing: "0.1em" }}>
              {statusMsg || `${prospects.length} PROSPECTS · ${prospects.length - unscored} SCORED · DAY ${dayCount}`}
            </span>
          </div>
          <h1 style={{ fontSize: "44px", fontWeight: "900", color: "#ffffff", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em", lineHeight: 1, marginBottom: "2px" }}>
            SALES INTELLIGENCE
          </h1>
          <p style={{ fontSize: "10px", color: "#8888aa", fontFamily: "monospace", letterSpacing: "0.08em" }}>
            5 AGENTS · MULTI-AGENT ARCHITECTURE · CLAUDE SONNET 4
          </p>
        </div>

        {/* Dashboard Summary Bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px", marginBottom: "16px" }}>
          {[
            { label: "PIPELINE", value: `$${(totalPipeline/1000000).toFixed(1)}M`, color: "#4ade80" },
            { label: "AVG SCORE", value: avgScore ?? "—", color: "#a5b4fc" },
            { label: "🔥 HOT", value: hotCount, color: "#ef4444" },
            { label: "🌡 WARM", value: warmCount, color: "#f59e0b" },
            { label: "❄ COLD", value: coldCount, color: "#a5b4fc" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: "#111128", border: "1px solid #2a2a4a", borderRadius: "8px", padding: "10px 12px", textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: "900", color, fontFamily: "'Bebas Neue', sans-serif", lineHeight: 1, marginBottom: "3px" }}>{value}</div>
              <div style={{ fontSize: "8px", color: "#9090b0", fontFamily: "monospace", letterSpacing: "0.08em" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "2px", marginBottom: "16px", background: "#0f0f1e", borderRadius: "8px", padding: "3px" }}>
          {["prospects", "agents", "log"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "none", background: activeTab === tab ? "#1e1e3a" : "transparent", color: activeTab === tab ? "#ffffff" : "#8888aa", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {tab === "prospects" ? `PROSPECTS (${displayProspects.length})` : tab === "agents" ? "AGENTS" : `LOG (${agentLog.length})`}
            </button>
          ))}
        </div>

        {/* PROSPECTS TAB */}
        {activeTab === "prospects" && (
          <>
            {/* Agent 1 — Enrichment bar */}
            <div style={{ background: "#0d0a04", border: "1px solid #f59e0b88", borderRadius: "8px", padding: "10px 12px", marginBottom: "10px" }}>
              <div style={{ fontSize: "9px", color: "#f59e0b", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: "8px" }}>⚡ AGENT 1 · PROSPECT ENRICHMENT</div>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  value={enrichCompany}
                  onChange={e => setEnrichCompany(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && runAgent1()}
                  placeholder="Company name e.g. Salesforce, HubSpot..."
                  className="enrich-input"
                  style={{ flex: 2, padding: "8px 12px", background: "#0d0d18", border: "1px solid #2a2a3a", borderRadius: "6px", color: "#e0e0f0", fontSize: "11px", fontFamily: "'DM Sans', sans-serif", outline: "none" }}
                />
                <input
                  value={enrichContact}
                  onChange={e => setEnrichContact(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && runAgent1()}
                  placeholder="Contact name (optional)"
                  className="enrich-input"
                  style={{ flex: 1, padding: "8px 12px", background: "#0d0d18", border: "1px solid #2a2a3a", borderRadius: "6px", color: "#e0e0f0", fontSize: "11px", fontFamily: "'DM Sans', sans-serif", outline: "none" }}
                />
                <button
                  onClick={runAgent1}
                  disabled={enriching || anyRunning || !enrichCompany.trim()}
                  style={{ padding: "10px 20px", borderRadius: "6px", background: enriching || !enrichCompany.trim() ? "#111120" : "linear-gradient(135deg, #92400e, #f59e0b)", border: "none", color: "#fff", fontSize: "11px", fontWeight: "700", cursor: enriching || !enrichCompany.trim() ? "not-allowed" : "pointer", fontFamily: "monospace", whiteSpace: "nowrap", opacity: enriching || !enrichCompany.trim() ? 0.5 : 1 }}>
                  {enriching ? "ENRICHING..." : "ENRICH →"}
                </button>
              </div>
            </div>

            <div style={{ background: "#0a0a14", border: "1px solid #818cf8", borderRadius: "8px", padding: "10px 12px", marginBottom: "10px" }}>
              <div style={{ fontSize: "9px", color: "#a5b4fc", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: "8px" }}>⚡ AGENT 4 · NATURAL LANGUAGE QUERY</div>
              <div style={{ display: "flex", gap: "8px" }}>
                <input value={nlQuery} onChange={e => setNlQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && runNLQuery()}
                  placeholder='Ask: "healthcare with funding" · "stale deals over $200K" · "all negotiation stage"'
                  className="nl-input"
                  style={{ flex: 1, padding: "9px 14px", background: "#0d0d18", border: "1px solid #3a3a6a", borderRadius: "8px", color: "#e0e0f0", fontSize: "11px", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
                <button onClick={runNLQuery} disabled={nlRunning || !nlQuery.trim()}
                  style={{ padding: "10px 20px", borderRadius: "8px", background: nlRunning || !nlQuery.trim() ? "#111120" : "linear-gradient(135deg, #4338ca, #818cf8)", border: "none", color: "#fff", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "monospace", whiteSpace: "nowrap" }}>
                  {nlRunning ? "..." : "ASK →"}
                </button>
                {filteredIds && (
                  <button onClick={() => { setFilteredIds(null); setNlQuery(""); }}
                    style={{ padding: "9px 12px", borderRadius: "8px", background: "transparent", border: "1px solid #1a1a2e", color: "#4a4a6a", fontSize: "11px", cursor: "pointer", fontFamily: "monospace" }}>✕</button>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap", alignItems: "center" }}>
              <Sel value={filterIndustry} onChange={setFilterIndustry} options={industries} label="ALL INDUSTRIES" />
              <Sel value={filterStage} onChange={setFilterStage} options={stages} label="ALL STAGES" />
              <Sel value={filterTier} onChange={setFilterTier} options={tiers} label="ALL TIERS" />
              <div style={{ marginLeft: "auto", display: "flex", gap: "4px" }}>
                {[["score","SCORE"],["arr","ARR"],["stale","STALE"]].map(([val, lbl]) => (
                  <button key={val} onClick={() => setSortBy(val)}
                    style={{ padding: "5px 10px", borderRadius: "5px", border: sortBy === val ? "1px solid #6366f1" : "1px solid #2a2a4a", background: sortBy === val ? "#1a1a2e" : "transparent", color: sortBy === val ? "#e0e0f0" : "#9090b0", fontSize: "9px", fontWeight: "700", cursor: "pointer", fontFamily: "monospace" }}>
                    ↕ {lbl}
                  </button>
                ))}
              </div>
            </div>

            {filteredIds && (
              <div style={{ padding: "7px 12px", background: "#0d1a0d", border: "1px solid #22c55e33", borderRadius: "6px", marginBottom: "10px", fontSize: "10px", color: "#22c55e", fontFamily: "monospace" }}>
                ✦ "{nlQuery}" → {filteredIds.length} matches
              </div>
            )}

            {displayProspects.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "#0d0d18", borderRadius: "12px", border: "1px dashed #1a1a2e" }}>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</div>
                <div style={{ fontSize: "14px", color: "#4a4a6a", fontFamily: "'DM Sans', sans-serif", marginBottom: "8px" }}>No prospects match your filters</div>
                <button onClick={() => { setFilterIndustry("ALL"); setFilterStage("ALL"); setFilterTier("ALL"); setFilteredIds(null); setNlQuery(""); }}
                  style={{ marginTop: "8px", padding: "8px 16px", borderRadius: "6px", background: "#1a1a2e", border: "none", color: "#6366f1", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "monospace" }}>
                  CLEAR ALL FILTERS
                </button>
              </div>
            ) : (
              <>
                {unscored === prospects.length && !filteredIds && (
                  <div style={{ padding: "14px 16px", background: "#0d0d18", border: "1px dashed #6366f144", borderRadius: "10px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                    <div>
                      <div style={{ fontSize: "13px", color: "#e0e0f0", fontFamily: "'DM Sans', sans-serif", marginBottom: "2px" }}>No prospects scored yet</div>
                      <div style={{ fontSize: "11px", color: "#8a8aaa", fontFamily: "monospace" }}>Auto-score the top 10 by deal size to get started →</div>
                    </div>
                    <button onClick={autoScoreTop} disabled={anyRunning}
                      style={{ padding: "8px 14px", borderRadius: "6px", background: "linear-gradient(135deg, #1d4ed8, #6366f1)", border: "none", color: "#fff", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "monospace", whiteSpace: "nowrap" }}>
                      {autoScoring ? "SCORING..." : "AUTO-SCORE TOP 10"}
                    </button>
                  </div>
                )}
                <div style={{ background: "#0a0a12", border: "1px solid #1a1a2e", borderRadius: "8px", overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 90px 80px 90px 70px 64px 56px", padding: "0 4px", background: "#0d0d18", borderBottom: "1px solid #1e1e2e" }}>
                    <div />
                    {[["COMPANY / CONTACT","left"],["INDUSTRY","left"],["ARR","left"],["STAGE","left"],["LAST CONTACT","left"],["SIGNALS","center"],["SCORE","right"]].map(([label, align]) => (
                      <div key={label} style={{ fontSize: "8px", color: "#8a8aaa", fontFamily: "monospace", letterSpacing: "0.1em", padding: "9px 8px 9px 4px", textAlign: align }}>
                        {label}
                      </div>
                    ))}
                  </div>
                  {displayProspects.map((p, i) => (
                    <ProspectRow key={p.id} prospect={p} onScore={scoreOne} scoring={scoring === p.id} highlight={updatedIds.has(p.id)} index={i} />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* AGENTS TAB */}
        {activeTab === "agents" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ background: "#0d0d18", border: "1px solid #f59e0b33", borderRadius: "10px", padding: "16px 18px" }}>
              <div style={{ fontSize: "12px", color: "#f59e0b", fontFamily: "monospace", letterSpacing: "0.08em", marginBottom: "4px" }}>AGENT 1 · PROSPECT ENRICHMENT</div>
              <div style={{ fontSize: "13px", color: "#c0c0d8", fontFamily: "'DM Sans', sans-serif", marginBottom: "10px" }}>Takes a company name and generates a fully enriched prospect record — contact, industry, deal size, and 3 realistic buying signals. Then auto-scores it and adds it to the top of your pipeline.</div>
              <div style={{ fontSize: "11px", color: "#3a3a5a", fontFamily: "monospace" }}>USE IT: Go to the Prospects tab and type any company name in the enrichment bar at the top.</div>
            </div>

            <div style={{ background: "#0d0d18", border: "1px solid #1a1a2e", borderRadius: "10px", padding: "16px 18px" }}>
              <div style={{ fontSize: "12px", color: "#6366f1", fontFamily: "monospace", letterSpacing: "0.08em", marginBottom: "4px" }}>AGENT 2 · SCORING AGENT</div>
              <div style={{ fontSize: "13px", color: "#c0c0d8", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>Analyzes signals, deal data, and engagement to assign a 0-100 priority score with reasoning and a specific next action.</div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button onClick={autoScoreTop} disabled={anyRunning}
                  style={{ padding: "8px 14px", borderRadius: "6px", background: anyRunning ? "#111120" : "linear-gradient(135deg, #065f46, #22c55e)", border: "none", color: "#fff", fontSize: "11px", fontWeight: "700", cursor: anyRunning ? "not-allowed" : "pointer", fontFamily: "monospace" }}>
                  {autoScoring ? "SCORING..." : "AUTO-SCORE TOP 10"}
                </button>
                <button onClick={scoreAll} disabled={anyRunning || unscored === 0}
                  style={{ padding: "8px 14px", borderRadius: "6px", background: anyRunning || unscored === 0 ? "#111120" : "linear-gradient(135deg, #1d4ed8, #6366f1)", border: "none", color: unscored === 0 ? "#2a2a4a" : "#fff", fontSize: "11px", fontWeight: "700", cursor: anyRunning || unscored === 0 ? "not-allowed" : "pointer", fontFamily: "monospace" }}>
                  {scoring ? "RUNNING..." : unscored === 0 ? "✓ ALL SCORED" : `SCORE ALL (${unscored})`}
                </button>
              </div>
            </div>

            <div style={{ background: "#0d0d18", border: "1px solid #1a1a2e", borderRadius: "10px", padding: "16px 18px" }}>
              <div style={{ fontSize: "12px", color: "#818cf8", fontFamily: "monospace", letterSpacing: "0.08em", marginBottom: "4px" }}>AGENT 4 · NATURAL LANGUAGE QUERY</div>
              <div style={{ fontSize: "13px", color: "#c0c0d8", fontFamily: "'DM Sans', sans-serif", marginBottom: "10px" }}>Translates plain English into filters over all prospects. Click an example to try it:</div>
              {["healthcare accounts with funding signals", "deals over $200K not contacted in 30+ days", "all negotiation stage prospects", "fintech companies with hiring activity"].map(ex => (
                <div key={ex} onClick={() => { setNlQuery(ex); setActiveTab("prospects"); }}
                  style={{ fontSize: "11px", color: "#4a4a6a", fontFamily: "monospace", cursor: "pointer", padding: "5px 8px", borderRadius: "4px", background: "#080810", marginBottom: "3px" }}>
                  → "{ex}"
                </div>
              ))}
            </div>

            <div style={{ background: "#0d0d18", border: "1px solid #1a1a2e", borderRadius: "10px", padding: "16px 18px" }}>
              <div style={{ fontSize: "12px", color: "#22c55e", fontFamily: "monospace", letterSpacing: "0.08em", marginBottom: "4px" }}>AGENT 5 · DAILY REFRESHER</div>
              <div style={{ fontSize: "13px", color: "#c0c0d8", fontFamily: "'DM Sans', sans-serif", marginBottom: "6px" }}>Simulates one business day passing. Updates contact recency, moves deal stages, injects new signals, and adds a fresh prospect.</div>
              <div style={{ fontSize: "11px", color: "#3a3a5a", fontFamily: "monospace", marginBottom: "12px" }}>DAYS SIMULATED: {dayCount}</div>
              <button onClick={runAgent5} disabled={anyRunning}
                style={{ padding: "8px 16px", borderRadius: "6px", background: anyRunning ? "#111120" : "linear-gradient(135deg, #065f46, #22c55e)", border: "none", color: "#fff", fontSize: "11px", fontWeight: "700", cursor: anyRunning ? "not-allowed" : "pointer", fontFamily: "monospace" }}>
                {agent5Running ? "SIMULATING..." : "▶ SIMULATE DAY"}
              </button>
            </div>
          </div>
        )}

        {/* LOG TAB */}
        {activeTab === "log" && (
          <div style={{ background: "#0a0a14", border: "1px solid #1a1a2e", borderRadius: "10px", padding: "14px 16px" }}>
            <div style={{ fontSize: "9px", color: "#3a3a5a", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: "10px" }}>AGENT ACTIVITY LOG · {agentLog.length} EVENTS</div>
            {agentLog.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: "11px", color: "#2a2a4a", fontFamily: "monospace", marginBottom: "4px" }}>No agent runs yet</div>
                <div style={{ fontSize: "10px", color: "#1a1a2a", fontFamily: "monospace" }}>Score a prospect or run Agent 5 to see activity here</div>
              </div>
            ) : agentLog.map((log, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr 80px 60px", gap: "8px", fontSize: "10px", fontFamily: "monospace", color: "#4a4a6a", padding: "5px 0", borderBottom: i < agentLog.length - 1 ? "1px solid #0f0f1a" : "none", alignItems: "center" }}>
                <span style={{ color: log.agent === "agent-5" ? "#22c55e" : log.agent === "nl-query-agent" ? "#818cf8" : "#6366f1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.agent}</span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.action}</span>
                <span style={{ color: "#a78bfa" }}>{log.result}</span>
                <span style={{ color: "#2a2a3a", textAlign: "right" }}>{log.time}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "9px", color: "#111120", fontFamily: "monospace" }}>
          SALES-INTELLIGENCE · 5 AGENTS · CLAUDE SONNET 4
        </div>
      </div>
    </div>
  );
}
