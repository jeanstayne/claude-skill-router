import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = join(import.meta.dirname, '..', 'registry', 'external-skills');
mkdirSync(DIR, { recursive: true });

const skills = [
  // Design/UI/Visual
  {id:"frontend-design",name:"Frontend Design",repo:"anthropics/skills",path:"frontend-design",cat:"design",sub:["ui","frontend","layout"],best:["create-landing-page","improve-landing-page","create-institutional-site","create-dashboard"],risk:"low",cli:false,login:false,net:false,notes:"Use for frontend layout, component structure, and UI patterns."},
  {id:"canvas-design",name:"Canvas Design",repo:"anthropics/skills",path:"canvas-design",cat:"design",sub:["canvas","visual","layout"],best:["create-landing-page","create-design-system"],risk:"low",cli:false,login:false,net:false,notes:"Canvas-based design thinking for layouts and visual composition."},
  {id:"theme-factory",name:"Theme Factory",repo:"anthropics/skills",path:"theme-factory",cat:"design",sub:["theme","tokens","colors"],best:["create-design-system","create-landing-page"],risk:"low",cli:false,login:false,net:false,notes:"Theme generation with design tokens and color systems."},
  {id:"web-design-guidelines",name:"Web Design Guidelines",repo:"vercel-labs/agent-skills",path:"web-design-guidelines",cat:"design",sub:["web","guidelines","best-practices"],best:["create-landing-page","create-institutional-site"],risk:"low",cli:false,login:false,net:false,notes:"Web design best practices from Vercel."},
  {id:"ui-ux-pro-max",name:"UI UX Pro Max",repo:"nextlevelbuilder/ui-ux-pro-max-skill",path:"ui-ux-pro-max",cat:"design",sub:["ui","ux","premium"],best:["improve-landing-page","create-dashboard","improve-dashboard"],risk:"medium",cli:false,login:false,net:true,notes:"Premium UI/UX patterns. May reference external design resources."},
  {id:"high-end-visual-design",name:"High-End Visual Design",repo:"leonxlnx/taste-skill",path:"high-end-visual-design",cat:"design",sub:["visual","premium","taste"],best:["improve-landing-page","create-landing-page","create-design-system"],risk:"low",cli:false,login:false,net:false,notes:"High-end visual design taste and patterns."},
  {id:"design-taste-frontend",name:"Design Taste Frontend",repo:"leonxlnx/taste-skill",path:"design-taste-frontend",cat:"design",sub:["frontend","taste","style"],best:["improve-landing-page","create-landing-page"],risk:"low",cli:false,login:false,net:false,notes:"Frontend design taste — styling, spacing, typography, and composition."},
  {id:"redesign-existing-projects",name:"Redesign Existing Projects",repo:"leonxlnx/taste-skill",path:"redesign-existing-projects",cat:"design",sub:["redesign","refactor","visual"],best:["improve-landing-page","improve-dashboard"],risk:"low",cli:false,login:false,net:false,notes:"Redesign approach for existing projects without full rewrite."},
  {id:"stitch-design-taste",name:"Stitch Design Taste",repo:"leonxlnx/taste-skill",path:"stitch-design-taste",cat:"design",sub:["stitch","tokens","design-system"],best:["create-design-system","plan-website-structure"],risk:"low",cli:false,login:false,net:false,notes:"Stitch-compatible design taste adapter."},
  {id:"extract-design-system",name:"Extract Design System",repo:"arvindrk/extract-design-system",path:"extract-design-system",cat:"design",sub:["extract","tokens","reference"],best:["create-design-system","convert-visual-reference-to-code"],risk:"low",cli:false,login:false,net:false,notes:"Extract design system tokens from visual references."},
  {id:"tailwind-design-system",name:"Tailwind Design System",repo:"wshobson/agents",path:"tailwind-design-system",cat:"design",sub:["tailwind","tokens","config"],best:["create-design-system","create-landing-page"],risk:"low",cli:false,login:false,net:false,notes:"Generate Tailwind config and design tokens from visual direction."},
  // Stitch
  {id:"enhance-prompt",name:"Enhance Prompt",repo:"google-labs-code/stitch-skills",path:"enhance-prompt",cat:"design",sub:["prompt","stitch","enhance"],best:["create-design-system","plan-website-structure"],risk:"medium",cli:false,login:false,net:true,notes:"Enhance design prompts for Stitch."},
  {id:"stitch-loop",name:"Stitch Loop",repo:"google-labs-code/stitch-skills",path:"stitch-loop",cat:"design",sub:["stitch","loop","generation"],best:["create-design-system"],risk:"high",cli:true,login:false,net:true,notes:"Iterative design loop with Stitch. Requires Stitch CLI."},
  // Image
  {id:"ai-image-generation",name:"AI Image Generation",repo:"inference-sh-skills/skills",path:"ai-image-generation",cat:"image",sub:["image","generation","ai","hero"],best:["generate-site-images","create-hero-visual","create-image-prompts"],risk:"high",cli:true,login:true,net:true,notes:"AI image generation via inference.sh. NEVER auto-execute."},
  {id:"gpt-image-2",name:"GPT Image 2",repo:"agentspace-so/agent-skills",path:"gpt-image-2",cat:"image",sub:["image","gpt","generation","dalle"],best:["generate-site-images","create-hero-visual","create-image-prompts"],risk:"high",cli:true,login:true,net:true,notes:"GPT image generation (DALL-E). NEVER auto-execute."},
  // Copy/Marketing/CRO
  {id:"product-marketing-context",name:"Product Marketing Context",repo:"coreyhaines31/marketingskills",path:"product-marketing-context",cat:"marketing",sub:["product","strategy","positioning"],best:["improve-marketing-copy","improve-headlines","create-product-marketing-context"],risk:"low",cli:false,login:false,net:false,notes:"Product marketing context — positioning, messaging, value proposition."},
  {id:"copywriting",name:"Copywriting",repo:"coreyhaines31/marketingskills",path:"copywriting",cat:"marketing",sub:["copywriting","headlines","cta","landing-page-copy"],best:["improve-headlines","improve-marketing-copy","create-landing-page","improve-landing-page"],risk:"low",cli:false,login:false,net:false,notes:"Conversion copywriting for landing pages, headlines, CTAs."},
  {id:"page-cro",name:"Page CRO",repo:"coreyhaines31/marketingskills",path:"page-cro",cat:"marketing",sub:["cro","conversion","optimization","landing-page"],best:["optimize-form-cro","improve-landing-page","audit-page-cro"],risk:"low",cli:false,login:false,net:false,notes:"Page-level CRO audit and optimization recommendations."},
  {id:"marketing-psychology",name:"Marketing Psychology",repo:"coreyhaines31/marketingskills",path:"marketing-psychology",cat:"marketing",sub:["psychology","persuasion","framing","triggers"],best:["improve-marketing-copy","improve-headlines","create-product-marketing-context"],risk:"low",cli:false,login:false,net:false,notes:"Ethical marketing psychology — framing, social proof, urgency."},
  {id:"form-cro",name:"Form CRO",repo:"coreyhaines31/marketingskills",path:"form-cro",cat:"marketing",sub:["form","cro","conversion","lead"],best:["optimize-form-cro","improve-landing-page"],risk:"low",cli:false,login:false,net:false,notes:"Form optimization for conversion."},
  {id:"popup-cro",name:"Popup CRO",repo:"coreyhaines31/marketingskills",path:"popup-cro",cat:"marketing",sub:["popup","cro","modal","lead"],best:["optimize-popup-cro","improve-landing-page"],risk:"low",cli:false,login:false,net:false,notes:"Popup and modal optimization for conversion."},
  {id:"pricing-strategy",name:"Pricing Strategy",repo:"coreyhaines31/marketingskills",path:"pricing-strategy",cat:"marketing",sub:["pricing","strategy","value"],best:["improve-marketing-copy","create-product-marketing-context"],risk:"low",cli:false,login:false,net:false,notes:"Pricing strategy — tiers, anchoring, value communication."},
  // SEO
  {id:"seo-audit",name:"SEO Audit",repo:"coreyhaines31/marketingskills",path:"seo-audit",cat:"seo",sub:["seo","audit","on-page","technical"],best:["optimize-seo","improve-landing-page","create-institutional-site"],risk:"medium",cli:false,login:false,net:true,notes:"SEO audit — on-page, technical, content gaps."},
  {id:"schema-markup",name:"Schema Markup",repo:"coreyhaines31/marketingskills",path:"schema-markup",cat:"seo",sub:["schema","rich-results","structured-data","json-ld"],best:["add-schema-markup","optimize-seo"],risk:"low",cli:false,login:false,net:false,notes:"Generate schema markup (JSON-LD) for rich results."},
  {id:"content-strategy",name:"Content Strategy",repo:"coreyhaines31/marketingskills",path:"content-strategy",cat:"seo",sub:["content","strategy","blog","topics"],best:["create-content-strategy","optimize-seo"],risk:"low",cli:false,login:false,net:false,notes:"Content strategy — topic clusters, content calendar, pillar pages."},
  {id:"programmatic-seo",name:"Programmatic SEO",repo:"coreyhaines31/marketingskills",path:"programmatic-seo",cat:"seo",sub:["programmatic","seo","pages","scale"],best:["create-programmatic-seo-pages","optimize-seo"],risk:"medium",cli:false,login:false,net:false,notes:"Programmatic SEO strategy."},
  {id:"competitor-alternatives",name:"Competitor Alternatives",repo:"coreyhaines31/marketingskills",path:"competitor-alternatives",cat:"seo",sub:["competitor","alternatives","research"],best:["create-content-strategy","optimize-seo"],risk:"medium",cli:false,login:false,net:true,notes:"Competitor analysis — alternatives pages, comparison content."},
  {id:"marketing-ideas",name:"Marketing Ideas",repo:"coreyhaines31/marketingskills",path:"marketing-ideas",cat:"marketing",sub:["ideas","creative","campaign","brainstorm"],best:["create-launch-strategy","create-social-content"],risk:"low",cli:false,login:false,net:false,notes:"Creative marketing ideas and campaign concepts."},
  {id:"launch-strategy",name:"Launch Strategy",repo:"coreyhaines31/marketingskills",path:"launch-strategy",cat:"marketing",sub:["launch","strategy","g2m","product-hunt"],best:["create-launch-strategy","create-product-marketing-context"],risk:"low",cli:false,login:false,net:false,notes:"Launch strategy — Product Hunt, go-to-market, pre/post-launch."},
  // Ads
  {id:"ad-creative",name:"Ad Creative",repo:"coreyhaines31/marketingskills",path:"ad-creative",cat:"ads",sub:["ads","creative","copy","visual"],best:["create-ad-creative","create-paid-ads"],risk:"low",cli:false,login:false,net:false,notes:"Ad creative strategy — headlines, visuals, angles for Meta, Google, LinkedIn."},
  {id:"paid-ads",name:"Paid Ads",repo:"coreyhaines31/marketingskills",path:"paid-ads",cat:"ads",sub:["ads","paid","campaign","budget"],best:["create-paid-ads","create-ad-creative"],risk:"medium",cli:false,login:false,net:false,notes:"Paid ads strategy — campaign structure, targeting, budget."},
  // Social
  {id:"social-content",name:"Social Content",repo:"coreyhaines31/marketingskills",path:"social-content",cat:"social",sub:["social","content","instagram","linkedin","tiktok"],best:["create-social-content","create-launch-strategy"],risk:"low",cli:false,login:false,net:false,notes:"Social media content strategy — posts, Reels, carousels, stories."},
  {id:"email-sequence",name:"Email Sequence",repo:"coreyhaines31/marketingskills",path:"email-sequence",cat:"social",sub:["email","sequence","nurture","onboarding"],best:["create-email-sequence","create-launch-strategy"],risk:"low",cli:false,login:false,net:false,notes:"Email sequence strategy — welcome, nurture, onboarding, re-engagement."},
  // Audit
  {id:"audit-website",name:"Audit Website",repo:"squirrelscan/skills",path:"audit-website",cat:"audit",sub:["audit","website","performance","accessibility"],best:["audit-website","improve-landing-page"],risk:"high",cli:true,login:false,net:true,notes:"Full website audit. Requires SquirrelScan CLI. NEVER auto-execute."},
];

let count = 0;
for (const s of skills) {
  const json = {
    id: s.id, name: s.name, source: "skills.sh",
    repository: `https://github.com/${s.repo}`,
    skillPath: s.path,
    installCommand: `npx skills add https://github.com/${s.repo} --skill ${s.path}`,
    category: s.cat,
    subcategories: s.sub,
    bestFor: s.best,
    riskLevel: s.risk,
    requiresExternalCli: s.cli,
    requiresLogin: s.login,
    requiresNetwork: s.net,
    autoInstallAllowed: false,
    autoExecuteAllowed: false,
    useAsReference: true,
    notes: s.notes,
  };
  writeFileSync(join(DIR, `${s.id}.json`), JSON.stringify(json, null, 2) + '\n');
  count++;
}
console.log(`Created ${count} external skill JSON files in ${DIR}`);
