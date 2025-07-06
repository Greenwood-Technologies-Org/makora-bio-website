import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

// Import logos
import chemblLogo from "@/assets/mcp_servers/chembl_logo.png";
import pubchemLogo from "@/assets/mcp_servers/pubchem_logo.png";
import pubmedLogo from "@/assets/mcp_servers/pubmed_logo.png";
import alphafoldLogo from "@/assets/mcp_servers/alphafold_logo.png";
import uniprotLogo from "@/assets/mcp_servers/uniprot_logo.png";
import reactomeLogo from "@/assets/mcp_servers/reactome_logo.png";
import opentargetsLogo from "@/assets/mcp_servers/opentargets_logo.png";
import pdbLogo from "@/assets/mcp_servers/pdb_logo.png";

const mcpServers = [
	{
		title: "ChEMBL",
		description: "Quickly query bioactivity data from ChEMBL for target-compound relationships.",
		logo: chemblLogo,
	},
	{
		title: "PubChem",
		description: "Summarize compound info and compare structures across public datasets.",
		logo: pubchemLogo,
	},
	{
		title: "PubMed",
		description: "Find and rank relevant papers for your experimental context.",
		logo: pubmedLogo,
	},
	{
		title: "AlphaFold",
		description: "Integrate structure predictions into your experimental planning pipeline.",
		logo: alphafoldLogo,
	},
	{
		title: "UniProt",
		description: "Access comprehensive protein sequence and functional information.",
		logo: uniprotLogo,
	},
	{
		title: "Reactome",
	  description: "Browse expert-curated biological pathways and molecular interactions.",
		logo: reactomeLogo,
	},
	{
		title: "OpenTargets",
	  description: "Discover and prioritize drug targets using integrated genomic and clinical evidence.",
		logo: opentargetsLogo,
	},
	{
		title: "PDB",
		description: "Access protein structure data and crystallographic information.",
		logo: pdbLogo,
	},
];

const Products = () => {
	const [isVisible, setIsVisible] = useState(false);
	const [scrollPosition, setScrollPosition] = useState(0);
	const sectionRef = useRef<HTMLElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
				}
			},
			{ threshold: 0.2 }
		);

		if (sectionRef.current) {
			observer.observe(sectionRef.current);
		}

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const scrollContainer = scrollContainerRef.current;
		if (!scrollContainer || !isVisible) return;

		const scroll = () => {
			const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
			const newPosition = (scrollPosition + 1) % (maxScroll + 300); // Add pause at end
			
			if (newPosition === 0) {
				scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
			} else {
				scrollContainer.scrollTo({ left: newPosition, behavior: 'auto' });
			}
			
			setScrollPosition(newPosition);
		};

		const interval = setInterval(scroll, 30); // Smooth scrolling
		return () => clearInterval(interval);
	}, [scrollPosition, isVisible]);

	return (
		<section ref={sectionRef} className="py-24 relative">
			<div className="container mx-auto px-6">
				<div className={`text-center mb-16 fade-in-up ${isVisible ? "visible" : ""}`}>
					<h2 className="text-4xl md:text-5xl font-bold mb-6">What We're Building</h2>
					<p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
						We're creating research-ready MCP servers and agents, optimized for fast, reproducible, and accessible
						scientific workflows. Use one line to connect to your favorite LLMs.
					</p>
				</div>

				{/* MCP Servers Section */}
				<div className="mb-16">
					<div className={`text-center mb-12 fade-in-up ${isVisible ? "visible" : ""}`}>
						<h3 className="text-3xl md:text-4xl font-bold mb-4">MCP Servers</h3>
						<p className="text-lg text-muted-foreground mb-6">
							Access 4+ specialized research databases through our optimized MCP servers
						</p>
					</div>

					{/* Auto-scrolling carousel */}
					<div className="relative overflow-hidden mb-8">
						<div 
							ref={scrollContainerRef}
							className="flex gap-6 overflow-x-hidden"
							style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
						>
							{/* Duplicate the array to create seamless loop */}
							{[...mcpServers, ...mcpServers].map((server, index) => (
								<div
									key={`${server.title}-${index}`}
									className="flex-shrink-0 w-72"
								>
									<Card className="h-full bg-card/50 border-border">
										<CardHeader>
											<div className="mb-4 mx-auto flex items-center justify-center">
												<img
													src={server.logo}
													alt={`${server.title} logo`}
													className="h-16 object-contain"
												/>
											</div>
											<CardTitle className="text-2xl text-center">{server.title}</CardTitle>
										</CardHeader>
										<CardContent>
											<CardDescription className="text-muted-foreground leading-relaxed text-center">
												{server.description}
											</CardDescription>
										</CardContent>
									</Card>
								</div>
							))}
						</div>
						
						{/* Gradient overlays to indicate more content */}
						<div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
						<div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
					</div>

					<div className={`text-center fade-in-up ${isVisible ? "visible" : ""}`}>
						<Button variant="waitlist" size="lg" className="text-lg px-8 py-6">
							Access MCP Servers
						</Button>
					</div>
				</div>

				{/* Research Assistant Agent Section */}
				<div className={`text-center fade-in-up ${isVisible ? "visible" : ""}`}>
					<h3 className="text-3xl md:text-4xl font-bold mb-6">Research Assistant Agent</h3>
					<p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
						Scientists can leverage the smartest AI models with our optimized MCP servers to access powerful agentic
						research assistance. Get intelligent help with experimental design, literature review, and data analysis.
					</p>
					<Button variant="waitlist" size="lg" className="text-lg px-8 py-6">
						Access Research Assistant
					</Button>
				</div>
			</div>
		</section>
	);
};

export default Products;