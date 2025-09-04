export interface ScenarioOption {
  text: string;
  stage: number;
  reasoning: string;
}

export interface Scenario {
  id: string;
  title: string;
  scenario: string; // Changed from description to scenario to match template
  options: ScenarioOption[];
  locale: string;
}

export const scenarios: Scenario[] = [
  {
    id: "heinz-dilemma",
    title: "Heinz Dilemma",
    scenario:
      "In Europe, a woman was near death from a special kind of cancer. There was one drug that the doctors thought might save her. It was a form of radium that a druggist in the same town had recently discovered. The drug was expensive to make, but the druggist was charging ten times what the drug cost him to make. He paid $200 for the radium and charged $2,000 for a small dose of the drug. The sick woman's husband, Heinz, went to everyone he knew to borrow the money, but he could only get together about $1,000, which is half of what it cost. He told the druggist that his wife was dying and asked him to sell it cheaper or let him pay later. But the druggist said: 'No, I discovered the drug and I'm going to make money from it.' So Heinz got desperate and broke into the man's store to steal the drug for his wife. Should Heinz have stolen the drug?",
    options: [
      {
        text: "No, because he could get caught and punished for stealing",
        stage: 1,
        reasoning: "Focus on avoiding punishment and consequences",
      },
      {
        text: "Yes, because he needs the drug and the druggist is being unfair",
        stage: 2,
        reasoning: "Self-interest and instrumental exchange",
      },
      {
        text: "Yes, because a good husband should do everything to save his wife",
        stage: 3,
        reasoning: "Meeting social expectations and being a good person",
      },
      {
        text: "No, because stealing is against the law and law must be maintained",
        stage: 4,
        reasoning: "Maintaining social order and following rules",
      },
      {
        text: "Yes, because the right to life is more fundamental than property rights",
        stage: 5,
        reasoning: "Social contract and individual rights",
      },
      {
        text: "Yes, because preserving human life is a universal moral principle",
        stage: 6,
        reasoning: "Universal ethical principles",
      },
    ],
    locale: "en",
  },
  {
    id: "trolley-problem",
    title: "The Trolley Problem",
    scenario:
      "A runaway trolley is heading toward five people tied to the tracks. You can pull a lever to divert the trolley to another track, but there is one person tied to that track who will be killed. The five people will definitely die if you do nothing. What should you do?",
    options: [
      {
        text: "Do nothing to avoid being blamed for the one person's death",
        stage: 1,
        reasoning: "Avoiding direct responsibility and punishment",
      },
      {
        text: "Pull the lever because saving five lives is better than saving one",
        stage: 2,
        reasoning: "Calculating personal benefit and practical outcomes",
      },
      {
        text: "Pull the lever because most people would expect you to save more lives",
        stage: 3,
        reasoning: "Social approval and being seen as heroic",
      },
      {
        text: "Follow whatever the official emergency protocol says to do",
        stage: 4,
        reasoning: "Following established rules and procedures",
      },
      {
        text: "Pull the lever as it maximizes welfare for the greatest number",
        stage: 5,
        reasoning: "Utilitarian calculation and social contract",
      },
      {
        text: "Refuse to actively cause anyone's death, regardless of consequences",
        stage: 6,
        reasoning: "Universal principle against actively killing",
      },
    ],
    locale: "en",
  },
  {
    id: "whistleblower",
    title: "The Whistleblower",
    scenario:
      "Sarah works for a pharmaceutical company and discovers that her company is hiding serious side effects of a new drug that could harm patients. Reporting this would likely result in her being fired and blacklisted from the industry, affecting her family's financial security. The company has significant influence and might not face serious consequences even if reported. What should Sarah do?",
    options: [
      {
        text: "Stay quiet to avoid losing her job and facing retaliation",
        stage: 1,
        reasoning: "Avoiding personal consequences and punishment",
      },
      {
        text: "Stay quiet but look for a new job to protect her own interests",
        stage: 2,
        reasoning: "Self-preservation and practical considerations",
      },
      {
        text: "Report it because good employees should be honest and trustworthy",
        stage: 3,
        reasoning: "Living up to social ideals of being a good person",
      },
      {
        text: "Report through official channels as required by company policy",
        stage: 4,
        reasoning: "Following proper procedures and regulations",
      },
      {
        text: "Report to authorities because public safety overrides company loyalty",
        stage: 5,
        reasoning: "Social contract and greater good",
      },
      {
        text: "Report it because protecting innocent lives is a moral imperative",
        stage: 6,
        reasoning: "Universal principle of protecting human welfare",
      },
    ],
    locale: "en",
  },
  {
    id: "military-draft",
    title: "Officer and Draft",
    scenario:
      "In a country at war, a young man is drafted into the military. However, he believes the war is unjust and morally wrong. He has been offered a position as an officer, which would give him better conditions and less dangerous duties. If he refuses, he will be assigned to the front lines as a regular soldier, which could mean almost certain death. He could also try to flee the country, but this would mean leaving his family behind and never being able to return. What should he do?",
    options: [
      {
        text: "Accept the officer position to avoid the dangerous front lines",
        stage: 1,
        reasoning: "Avoiding physical harm and punishment",
      },
      {
        text: "Take the officer position because it benefits him and his family",
        stage: 2,
        reasoning: "Personal advantage and instrumental reasoning",
      },
      {
        text: "Accept the position because others expect him to serve his country",
        stage: 3,
        reasoning: "Meeting social expectations and approval",
      },
      {
        text: "Serve as drafted because it is his legal duty as a citizen",
        stage: 4,
        reasoning: "Following laws and maintaining social order",
      },
      {
        text: "Refuse to participate in an unjust war, even if it means consequences",
        stage: 5,
        reasoning: "Higher principles over legal obligations",
      },
      {
        text: "Follow his conscience and universal principles against killing",
        stage: 6,
        reasoning: "Universal ethical principles over all other considerations",
      },
    ],
    locale: "en",
  },
  {
    id: "lifeboat-dilemma",
    title: "Lifeboat Dilemma",
    scenario:
      "A ship has sunk and there are survivors in a lifeboat that can only hold a limited number of people safely. The boat is overcrowded and will sink unless some people are removed. Among the survivors are an elderly person, a young child, a pregnant woman, a doctor, and several other adults. The sea is rough and anyone thrown overboard will likely die. As the person making decisions, what should you do?",
    options: [
      {
        text: "Save whoever is strongest to avoid being blamed if everyone dies",
        stage: 1,
        reasoning: "Fear of consequences and blame",
      },
      {
        text: "Save those who can be most useful for survival, including yourself",
        stage: 2,
        reasoning: "Practical self-interest and instrumental value",
      },
      {
        text: "Try to save those that others would expect you to save first",
        stage: 3,
        reasoning: "Social expectations and being seen as good",
      },
      {
        text: "Follow established maritime law and protocols for such situations",
        stage: 4,
        reasoning: "Following established rules and procedures",
      },
      {
        text: "Create a fair system that gives everyone an equal chance",
        stage: 5,
        reasoning: "Democratic process and social contract",
      },
      {
        text: "Refuse to choose who lives or dies as all human life is equally valuable",
        stage: 6,
        reasoning: "Universal principle of human dignity",
      },
    ],
    locale: "en",
  },
  {
    id: "medical-consent",
    title: "Medical Consent Dilemma",
    scenario:
      "A 16-year-old patient needs a life-saving blood transfusion, but their parents refuse consent due to religious beliefs. The teenager privately tells you they want the treatment but are afraid to oppose their parents. Without the transfusion, the patient will likely die within hours. Hospital policy requires parental consent for minors. What should the medical team do?",
    options: [
      {
        text: "Follow hospital policy to avoid legal liability",
        stage: 1,
        reasoning: "Avoiding punishment and legal consequences",
      },
      {
        text: "Do what protects the hospital's reputation and interests",
        stage: 2,
        reasoning: "Institutional self-interest and practical concerns",
      },
      {
        text: "Respect the parents' wishes because families should decide together",
        stage: 3,
        reasoning: "Maintaining family harmony and social expectations",
      },
      {
        text: "Follow established medical ethics guidelines and legal procedures",
        stage: 4,
        reasoning: "Adhering to professional standards and legal frameworks",
      },
      {
        text: "Get a court order to override parents when life is at stake",
        stage: 5,
        reasoning:
          "Legal system protecting individual rights over parental authority",
      },
      {
        text: "Save the patient's life regardless of consent issues",
        stage: 6,
        reasoning:
          "Universal principle that preserving life transcends other considerations",
      },
    ],
    locale: "en",
  },
  {
    id: "autonomous-vehicle",
    title: "Autonomous Vehicle Dilemma",
    scenario:
      "You're programming an autonomous vehicle's emergency response system. In an unavoidable accident scenario, the car can either: (A) Stay on course and hit five elderly pedestrians who jaywalked, or (B) Swerve and hit one child who is legally crossing at a crosswalk. The passengers will be safe in either case. How should the car be programmed to decide?",
    options: [
      {
        text: "Choose whichever option has fewer legal complications for the manufacturer",
        stage: 1,
        reasoning: "Avoiding legal liability and punishment",
      },
      {
        text: "Prioritize the option that results in fewer total deaths",
        stage: 2,
        reasoning: "Practical calculation of outcomes",
      },
      {
        text: "Choose based on what most people would consider morally acceptable",
        stage: 3,
        reasoning: "Following social consensus and public opinion",
      },
      {
        text: "Follow traffic laws - protect the person following rules",
        stage: 4,
        reasoning: "Upholding legal order and rewarding law-abiding behavior",
      },
      {
        text: "Let courts and democratically elected officials decide through legislation",
        stage: 5,
        reasoning:
          "Democratic process and social contract for collective decisions",
      },
      {
        text: "Refuse to program the car to actively choose who dies",
        stage: 6,
        reasoning:
          "Universal principle against making life-and-death calculations",
      },
    ],
    locale: "en",
  },
  {
    id: "corporate-layoffs",
    title: "Corporate Layoffs",
    scenario:
      "As a CEO, you must lay off 30% of your workforce to save the company from bankruptcy. You can either: (A) Lay off based on performance metrics, which would disproportionately affect older employees and parents, or (B) Lay off based on last-hired-first-fired, which would disproportionately affect younger employees and minorities. Both approaches are legal. What criteria do you use?",
    options: [
      {
        text: "Choose the method least likely to result in lawsuits",
        stage: 1,
        reasoning: "Avoiding legal and financial consequences",
      },
      {
        text: "Keep the employees most valuable to company profitability",
        stage: 2,
        reasoning: "Business self-interest and practical outcomes",
      },
      {
        text: "Use the approach that seems fairest to most employees",
        stage: 3,
        reasoning: "Maintaining social harmony and appearing fair",
      },
      {
        text: "Follow established HR policies and legal guidelines",
        stage: 4,
        reasoning: "Adhering to institutional rules and procedures",
      },
      {
        text: "Use a transparent, democratic process involving employee input",
        stage: 5,
        reasoning: "Participatory decision-making and procedural justice",
      },
      {
        text: "Refuse to make the decision based on group demographics",
        stage: 6,
        reasoning:
          "Universal principle of treating each person as an individual",
      },
    ],
    locale: "en",
  },
  {
    id: "environmental-vs-jobs",
    title: "Environmental vs. Jobs",
    scenario:
      "A factory in your town provides 40% of local jobs but is discovered to be causing cancer rates to rise due to chemical emissions. Shutting it down would eliminate the health risk but cause massive unemployment and economic devastation. The company offers to reduce emissions by 50% over five years while keeping jobs. As mayor, what do you decide?",
    options: [
      {
        text: "Keep the factory open to avoid being blamed for unemployment",
        stage: 1,
        reasoning: "Avoiding immediate blame and political consequences",
      },
      {
        text: "Negotiate the best deal for the town's economic interests",
        stage: 2,
        reasoning: "Practical compromise that serves town's material needs",
      },
      {
        text: "Do what most townspeople want after polling them",
        stage: 3,
        reasoning: "Following community consensus and social approval",
      },
      {
        text: "Follow environmental regulations and legal requirements strictly",
        stage: 4,
        reasoning: "Adhering to law and established environmental standards",
      },
      {
        text: "Create a democratic process for the community to decide together",
        stage: 5,
        reasoning: "Participatory democracy and collective decision-making",
      },
      {
        text: "Shut down the factory because health is a fundamental human right",
        stage: 6,
        reasoning:
          "Universal principle that human health transcends economic concerns",
      },
    ],
    locale: "en",
  },
  {
    id: "ai-surveillance",
    title: "AI Surveillance System",
    scenario:
      "Your city can install an AI surveillance system that would reduce violent crime by 60% and help find missing children quickly. However, it would monitor all citizens constantly, potentially infringe on privacy, and could be misused by future administrations. Civil liberties groups oppose it while police and some citizens support it. What do you decide?",
    options: [
      {
        text: "Reject it to avoid criticism from civil liberties groups",
        stage: 1,
        reasoning: "Avoiding political backlash and negative consequences",
      },
      {
        text: "Install it because the crime reduction benefits outweigh privacy costs",
        stage: 2,
        reasoning: "Practical calculation of benefits vs. costs",
      },
      {
        text: "Follow what most citizens want after public consultation",
        stage: 3,
        reasoning: "Responding to community expectations and public opinion",
      },
      {
        text: "Follow existing privacy laws and constitutional guidelines",
        stage: 4,
        reasoning: "Adhering to legal framework and constitutional principles",
      },
      {
        text: "Create strong oversight mechanisms and democratic controls",
        stage: 5,
        reasoning:
          "Balancing security and liberty through institutional safeguards",
      },
      {
        text: "Reject it because privacy is a fundamental human right",
        stage: 6,
        reasoning: "Universal principle that privacy should not be compromised",
      },
    ],
    locale: "en",
  },
  {
    id: "refugee-crisis",
    title: "Refugee Crisis",
    scenario:
      "Your country faces a massive influx of refugees fleeing war and persecution. Taking them all in would strain public resources and potentially create social tensions, but turning them away means some may face death or persecution. International law requires accepting refugees, but some citizens are protesting. What policy do you support?",
    options: [
      {
        text: "Limit refugees to avoid political backlash and social unrest",
        stage: 1,
        reasoning: "Avoiding domestic political consequences and civil discord",
      },
      {
        text: "Accept as many as the country can economically handle",
        stage: 2,
        reasoning:
          "Practical balance of humanitarian goals with national capacity",
      },
      {
        text: "Follow public opinion and do what most citizens want",
        stage: 3,
        reasoning: "Responding to social consensus and democratic sentiment",
      },
      {
        text: "Follow international law and treaty obligations",
        stage: 4,
        reasoning: "Adhering to legal commitments and international order",
      },
      {
        text: "Create an international coalition to share responsibility fairly",
        stage: 5,
        reasoning: "Collective action and shared global responsibility",
      },
      {
        text: "Accept all refugees because human life and dignity transcend borders",
        stage: 6,
        reasoning:
          "Universal principle of human dignity regardless of nationality",
      },
    ],
    locale: "en",
  },
  {
    id: "genetic-discrimination",
    title: "Genetic Discrimination",
    scenario:
      "Scientists develop a test that can predict with 90% accuracy who will develop Alzheimer's disease. Insurance companies want to use this test to adjust premiums or deny coverage. This could help manage risk but would discriminate against people based on genetics. As a policymaker, how do you regulate this technology?",
    options: [
      {
        text: "Allow it to avoid insurance industry lobbying and economic pressure",
        stage: 1,
        reasoning: "Avoiding political and economic retaliation",
      },
      {
        text: "Allow limited use that balances insurance needs with public good",
        stage: 2,
        reasoning: "Practical compromise between competing interests",
      },
      {
        text: "Follow public sentiment about genetic privacy",
        stage: 3,
        reasoning: "Responding to social attitudes and public comfort level",
      },
      {
        text: "Create regulations consistent with existing disability and privacy laws",
        stage: 4,
        reasoning: "Maintaining consistency with established legal principles",
      },
      {
        text: "Develop democratic oversight with stakeholder representation",
        stage: 5,
        reasoning: "Inclusive governance and balanced representation",
      },
      {
        text: "Ban discriminatory use because genetic makeup shouldn't determine access to care",
        stage: 6,
        reasoning:
          "Universal principle of equal treatment regardless of genetic differences",
      },
    ],
    locale: "en",
  },
  {
    id: "social-media-censorship",
    title: "Social Media Censorship",
    scenario:
      "A social media platform is spreading false medical information that leads people to avoid life-saving vaccines, contributing to disease outbreaks. You can either remove the content (potentially limiting free speech) or leave it up (potentially causing public health harm). Legal experts say both approaches are defensible. What do you choose?",
    options: [
      {
        text: "Do whatever protects the platform from legal liability",
        stage: 1,
        reasoning: "Avoiding legal consequences and regulatory punishment",
      },
      {
        text: "Remove content that hurts the platform's business interests",
        stage: 2,
        reasoning:
          "Protecting commercial interests and advertiser relationships",
      },
      {
        text: "Follow what most users and advertisers prefer",
        stage: 3,
        reasoning: "Responding to social pressure and stakeholder expectations",
      },
      {
        text: "Follow platform policies and legal guidelines consistently",
        stage: 4,
        reasoning: "Adhering to established rules and legal frameworks",
      },
      {
        text: "Create transparent, democratic content policies with user input",
        stage: 5,
        reasoning: "Participatory governance and procedural fairness",
      },
      {
        text: "Remove harmful content because truth and public health transcend free speech concerns",
        stage: 6,
        reasoning:
          "Universal principle that preventing harm overrides speech considerations",
      },
    ],
    locale: "en",
  },
  {
    id: "end-of-life-care",
    title: "End-of-Life Care",
    scenario:
      "An elderly patient with terminal cancer is in severe pain. They repeatedly ask you to help them end their life peacefully. Assisted suicide is illegal in your jurisdiction, but you could provide information about traveling to where it's legal, or you could increase pain medication to levels that might hasten death. What do you do?",
    options: [
      {
        text: "Follow the law strictly to avoid losing your medical license",
        stage: 1,
        reasoning: "Avoiding professional and legal consequences",
      },
      {
        text: "Do what causes you least professional and personal risk",
        stage: 2,
        reasoning: "Self-preservation and career protection",
      },
      {
        text: "Do what the patient's family thinks is best",
        stage: 3,
        reasoning: "Following family wishes and social expectations",
      },
      {
        text: "Follow medical ethics guidelines and legal requirements",
        stage: 4,
        reasoning: "Adhering to professional standards and legal obligations",
      },
      {
        text: "Advocate for legal change while providing best care possible within current law",
        stage: 5,
        reasoning: "Working within system while pushing for reform",
      },
      {
        text: "Help end suffering because reducing pain is a fundamental medical duty",
        stage: 6,
        reasoning: "Universal principle of minimizing human suffering",
      },
    ],
    locale: "en",
  },
  {
    id: "military-drone-strikes",
    title: "Military Drone Strikes",
    scenario:
      "Intelligence indicates a terrorist leader is meeting with associates in a building where civilians (including children) are also present. A drone strike would likely eliminate the terrorist threat but kill innocent people. Waiting might allow the terrorist to escape and carry out planned attacks killing many more. What do you order?",
    options: [
      {
        text: "Don't strike to avoid being blamed for civilian deaths",
        stage: 1,
        reasoning:
          "Avoiding responsibility for direct harm and public backlash",
      },
      {
        text: "Strike because preventing more deaths is worth the cost",
        stage: 2,
        reasoning: "Utilitarian calculation of lives saved vs. lives lost",
      },
      {
        text: "Follow what military advisors and public opinion support",
        stage: 3,
        reasoning: "Deferring to expert judgment and public sentiment",
      },
      {
        text: "Follow rules of engagement and international law",
        stage: 4,
        reasoning:
          "Adhering to military protocol and legal warfare constraints",
      },
      {
        text: "Seek international consultation and multilateral decision-making",
        stage: 5,
        reasoning: "Collective responsibility and international cooperation",
      },
      {
        text: "Refuse to knowingly kill innocents regardless of strategic value",
        stage: 6,
        reasoning:
          "Universal principle against intentionally harming innocent people",
      },
    ],
    locale: "en",
  },
  {
    id: "data-privacy-vs-security",
    title: "Data Privacy vs. Security",
    scenario:
      "Law enforcement asks your tech company to create a backdoor in your encryption software to help catch terrorists and child predators. This would help solve serious crimes but could also make all users vulnerable to hacking and government surveillance. What do you decide?",
    options: [
      {
        text: "Comply to avoid government regulatory retaliation",
        stage: 1,
        reasoning: "Avoiding legal pressure and regulatory consequences",
      },
      {
        text: "Do whatever protects the company's market position",
        stage: 2,
        reasoning: "Business interests and competitive advantage",
      },
      {
        text: "Follow user preferences and public opinion",
        stage: 3,
        reasoning: "Responding to customer expectations and social sentiment",
      },
      {
        text: "Follow existing laws and legal precedents",
        stage: 4,
        reasoning: "Adhering to legal framework and court decisions",
      },
      {
        text: "Support democratic debate and legislative process",
        stage: 5,
        reasoning: "Allowing democratic institutions to decide policy",
      },
      {
        text: "Protect user privacy as a fundamental right",
        stage: 6,
        reasoning:
          "Universal principle that privacy is essential to human dignity",
      },
    ],
    locale: "en",
  },
  {
    id: "organ-donation",
    title: "Organ Donation Dilemma",
    scenario:
      "Five patients will die without organ transplants. A healthy person arrives for routine surgery whose organs could save all five lives. You could 'accidentally' cause complications that would make their organs available for donation. No one would suspect, and five lives would be saved at the cost of one. What do you do?",
    options: [
      {
        text: "Don't do it because you could be caught and prosecuted",
        stage: 1,
        reasoning: "Fear of discovery and legal punishment",
      },
      {
        text: "Do it because saving five lives is mathematically better than saving one",
        stage: 2,
        reasoning: "Calculating maximum benefit and outcomes",
      },
      {
        text: "Don't do it because society expects doctors to 'do no harm'",
        stage: 3,
        reasoning: "Following professional expectations and social role",
      },
      {
        text: "Don't do it because it violates medical ethics and the law",
        stage: 4,
        reasoning: "Adhering to professional standards and legal obligations",
      },
      {
        text: "Don't do it because consent and proper procedures are required",
        stage: 5,
        reasoning: "Respecting institutional processes and individual rights",
      },
      {
        text: "Don't do it because intentionally killing an innocent person is always wrong",
        stage: 6,
        reasoning:
          "Universal principle against murder regardless of consequences",
      },
    ],
    locale: "en",
  },
  {
    id: "climate-sacrifice",
    title: "Climate Sacrifice",
    scenario:
      "Scientists say preventing catastrophic climate change requires immediately shutting down major industries, which would cause massive unemployment and economic collapse in the short term. The alternative is gradual change that may be too slow to prevent environmental disaster. As a world leader, what approach do you take?",
    options: [
      {
        text: "Choose gradual change to avoid immediate political backlash",
        stage: 1,
        reasoning:
          "Avoiding immediate negative consequences and political punishment",
      },
      {
        text: "Do whatever protects your country's economic interests",
        stage: 2,
        reasoning: "National self-interest and economic pragmatism",
      },
      {
        text: "Follow what your citizens want after consultation",
        stage: 3,
        reasoning: "Responding to democratic will and social consensus",
      },
      {
        text: "Follow international agreements and scientific recommendations",
        stage: 4,
        reasoning: "Adhering to international law and expert guidance",
      },
      {
        text: "Create global cooperation mechanisms for shared sacrifice",
        stage: 5,
        reasoning: "Collective action and fair distribution of costs",
      },
      {
        text: "Take immediate action because protecting future generations is a moral imperative",
        stage: 6,
        reasoning: "Universal obligation to preserve Earth for future humanity",
      },
    ],
    locale: "en",
  },
  {
    id: "artificial-intelligence-replacement",
    title: "AI Job Replacement",
    scenario:
      "Your company can replace 80% of workers with AI systems, dramatically increasing profits and reducing costs for consumers. However, this would eliminate millions of jobs in an economy not prepared for such rapid change. Do you implement the AI systems?",
    options: [
      {
        text: "Don't implement to avoid worker protests and bad publicity",
        stage: 1,
        reasoning: "Avoiding social unrest and negative consequences",
      },
      {
        text: "Implement gradually to maximize profits while managing risks",
        stage: 2,
        reasoning: "Balancing business interests with practical concerns",
      },
      {
        text: "Do what shareholders and the business community expect",
        stage: 3,
        reasoning: "Meeting business social expectations and industry norms",
      },
      {
        text: "Follow labor laws and existing regulations",
        stage: 4,
        reasoning:
          "Complying with legal requirements and established procedures",
      },
      {
        text: "Work with government and unions to create transition programs",
        stage: 5,
        reasoning: "Collaborative approach and shared social responsibility",
      },
      {
        text: "Consider human dignity and the right to meaningful work",
        stage: 6,
        reasoning:
          "Universal principle that people deserve purpose and livelihood",
      },
    ],
    locale: "en",
  },
  {
    id: "pandemic-lockdown",
    title: "Pandemic Lockdown",
    scenario:
      "During a deadly pandemic, you must choose between strict lockdowns that save lives but destroy small businesses and mental health, or lighter restrictions that allow more economic activity but result in more deaths. Both approaches have serious human costs. What policy do you implement?",
    options: [
      {
        text: "Choose whatever keeps you in power and avoids blame",
        stage: 1,
        reasoning: "Political survival and avoiding responsibility",
      },
      {
        text: "Do cost-benefit analysis and choose the option with better overall outcomes",
        stage: 2,
        reasoning: "Practical calculation of competing costs and benefits",
      },
      {
        text: "Follow what most citizens want after polling public opinion",
        stage: 3,
        reasoning: "Democratic responsiveness and social consensus",
      },
      {
        text: "Follow scientific guidelines and public health protocols",
        stage: 4,
        reasoning:
          "Adhering to expert recommendations and established procedures",
      },
      {
        text: "Create transparent decision-making with stakeholder input",
        stage: 5,
        reasoning: "Inclusive governance and participatory democracy",
      },
      {
        text: "Protect the most vulnerable people regardless of economic costs",
        stage: 6,
        reasoning: "Universal principle of protecting human life and dignity",
      },
    ],
    locale: "en",
  },
  {
    id: "immigration-family-separation",
    title: "Immigration Family Separation",
    scenario:
      "Immigration law requires detaining adults who cross borders illegally, but this means separating children from parents for extended periods. This may deter future illegal immigration but causes trauma to children. Alternative approaches are less effective deterrents. What policy do you support?",
    options: [
      {
        text: "Separate families to avoid appearing 'soft' on immigration",
        stage: 1,
        reasoning: "Avoiding political criticism and appearing tough",
      },
      {
        text: "Use whatever approach most effectively deters illegal immigration",
        stage: 2,
        reasoning: "Practical deterrence and border control effectiveness",
      },
      {
        text: "Do what most voters in your district support",
        stage: 3,
        reasoning:
          "Following constituent preferences and political expectations",
      },
      {
        text: "Follow existing immigration laws and legal precedents",
        stage: 4,
        reasoning: "Adhering to legal framework and established procedures",
      },
      {
        text: "Reform laws through democratic process to balance competing interests",
        stage: 5,
        reasoning: "Legislative solution and institutional reform",
      },
      {
        text: "Never separate families because children's welfare is paramount",
        stage: 6,
        reasoning: "Universal principle of protecting children from harm",
      },
    ],
    locale: "en",
  },
  {
    id: "gene-editing-enhancement",
    title: "Gene Editing Enhancement",
    scenario:
      "Scientists can now edit genes to eliminate genetic diseases before birth, but the same technology could enhance intelligence, strength, and appearance. This could reduce suffering but also create inequality between enhanced and natural humans. How should this technology be regulated?",
    options: [
      {
        text: "Ban it completely to avoid unknown risks and controversy",
        stage: 1,
        reasoning:
          "Avoiding potential negative consequences and social backlash",
      },
      {
        text: "Allow it for those who can pay, creating market incentives for improvement",
        stage: 2,
        reasoning: "Market-driven progress and economic efficiency",
      },
      {
        text: "Follow public opinion about what enhancements are acceptable",
        stage: 3,
        reasoning: "Social consensus and democratic sentiment",
      },
      {
        text: "Create regulations similar to other medical technologies",
        stage: 4,
        reasoning:
          "Consistent regulatory framework and institutional oversight",
      },
      {
        text: "Ensure equal access through public funding and democratic oversight",
        stage: 5,
        reasoning: "Social justice and equal opportunity",
      },
      {
        text: "Allow medical treatments but prohibit cosmetic enhancements that commodify human traits",
        stage: 6,
        reasoning:
          "Universal principle that human dignity shouldn't be bought and sold",
      },
    ],
    locale: "en",
  },
  {
    id: "nuclear-waste-storage",
    title: "Nuclear Waste Storage",
    scenario:
      "Your region needs a location to store nuclear waste that will remain dangerous for thousands of years. The safest storage site is near a small, economically struggling community that would benefit from jobs and tax revenue. However, there are small risks of contamination. Do you locate the facility there?",
    options: [
      {
        text: "Don't build it there to avoid being blamed if something goes wrong",
        stage: 1,
        reasoning: "Avoiding responsibility for potential future harm",
      },
      {
        text: "Build it there because the economic benefits outweigh the small risks",
        stage: 2,
        reasoning: "Practical cost-benefit analysis and mutual benefit",
      },
      {
        text: "Do whatever the local community votes to accept",
        stage: 3,
        reasoning: "Respecting community wishes and local democracy",
      },
      {
        text: "Follow safety regulations and scientific guidelines for siting",
        stage: 4,
        reasoning:
          "Adhering to technical standards and regulatory requirements",
      },
      {
        text: "Create fair compensation and democratic oversight mechanisms",
        stage: 5,
        reasoning: "Procedural justice and equitable burden-sharing",
      },
      {
        text: "Don't expose any community to risks for others' benefit",
        stage: 6,
        reasoning:
          "Universal principle against imposing risks on vulnerable populations",
      },
    ],
    locale: "en",
  },
  {
    id: "truth-vs-peace",
    title: "Truth vs. Peace",
    scenario:
      "In a post-conflict society, you must choose between prosecuting war criminals (which would bring justice but might restart violence) or granting amnesty (which would maintain peace but leave victims without justice). Both approaches have been used in different countries with mixed results. What do you choose?",
    options: [
      {
        text: "Choose amnesty to avoid personal responsibility if violence restarts",
        stage: 1,
        reasoning: "Avoiding blame for potential negative consequences",
      },
      {
        text: "Choose the approach most likely to maintain stability and prosperity",
        stage: 2,
        reasoning: "Pragmatic focus on practical outcomes and social order",
      },
      {
        text: "Follow what most citizens want after consulting public opinion",
        stage: 3,
        reasoning: "Democratic will and social consensus",
      },
      {
        text: "Follow international law and legal precedents for transitional justice",
        stage: 4,
        reasoning: "Adhering to legal framework and international standards",
      },
      {
        text: "Create a truth and reconciliation process with democratic input",
        stage: 5,
        reasoning:
          "Balanced approach combining truth, reconciliation, and participation",
      },
      {
        text: "Prosecute crimes because justice is essential for human dignity",
        stage: 6,
        reasoning:
          "Universal principle that justice cannot be sacrificed for convenience",
      },
    ],
    locale: "en",
  },
  {
    id: "animal-testing",
    title: "Animal Testing for Medicine",
    scenario:
      "Scientists need to test a promising cancer treatment on animals before human trials. The testing will cause suffering to animals but could lead to treatments saving millions of human lives. Alternative methods exist but are less reliable and much slower. Do you approve the animal testing?",
    options: [
      {
        text: "Approve it to avoid criticism from cancer patient advocates",
        stage: 1,
        reasoning: "Avoiding negative consequences from advocacy groups",
      },
      {
        text: "Approve it because human benefits outweigh animal costs",
        stage: 2,
        reasoning: "Practical calculation prioritizing human interests",
      },
      {
        text: "Follow what most people consider acceptable",
        stage: 3,
        reasoning: "Social consensus about human-animal moral relationships",
      },
      {
        text: "Follow existing regulations for animal research",
        stage: 4,
        reasoning:
          "Adhering to established ethical guidelines and legal requirements",
      },
      {
        text: "Require democratic debate about society's values regarding animal welfare",
        stage: 5,
        reasoning: "Collective decision-making about moral priorities",
      },
      {
        text: "Minimize animal suffering regardless of potential human benefits",
        stage: 6,
        reasoning:
          "Universal principle against causing unnecessary suffering to sentient beings",
      },
    ],
    locale: "en",
  },
  {
    id: "wealth-redistribution",
    title: "Wealth Redistribution",
    scenario:
      "Economic inequality in your country has reached extreme levels, with 1% owning 50% of wealth while others struggle with basic needs. You can implement heavy taxes on the wealthy to fund social programs, but this might cause capital flight and economic disruption. What policy do you pursue?",
    options: [
      {
        text: "Don't redistribute to avoid losing wealthy campaign donors",
        stage: 1,
        reasoning: "Avoiding political and financial consequences",
      },
      {
        text: "Find the optimal level that maximizes overall economic growth",
        stage: 2,
        reasoning: "Practical balance of competing economic interests",
      },
      {
        text: "Do what most voters want regarding taxation and redistribution",
        stage: 3,
        reasoning: "Democratic mandate and popular will",
      },
      {
        text: "Follow constitutional principles and existing tax law",
        stage: 4,
        reasoning: "Adhering to legal framework and institutional procedures",
      },
      {
        text: "Create democratic institutions for ongoing wealth distribution decisions",
        stage: 5,
        reasoning: "Participatory governance and social contract",
      },
      {
        text: "Ensure everyone has basic dignity regardless of economic efficiency",
        stage: 6,
        reasoning:
          "Universal principle that human needs transcend economic considerations",
      },
    ],
    locale: "en",
  },
  {
    id: "final-exam-cheating",
    title: "The Final Exam Dilemma",
    scenario:
      "You're taking your most important final exam worth 40% of your grade. You've studied hard, but you're struggling with a crucial question that could determine whether you pass or fail the course. You notice your friend Alex, who sits next to you, has clearly written the correct answer on their paper. The professor is distracted, helping another student across the room. Nobody would see if you quickly glanced at Alex's answer. Your future scholarship depends on maintaining your GPA, and failing this course would mean disappointing your family who sacrificed financially for your education. What do you do?",
    options: [
      {
        text: "I won't look because I might get caught and face serious consequences like academic probation.",
        stage: 1,
        reasoning: "Avoiding punishment and consequences",
      },
      {
        text: "I'll quickly check Alex's answer because my scholarship and family's investment are more important than abstract rules.",
        stage: 2,
        reasoning: "Self-interest and instrumental reasoning",
      },
      {
        text: "I won't cheat because my friends and family would lose respect for me if they found out.",
        stage: 3,
        reasoning: "Social approval and maintaining relationships",
      },
      {
        text: "I refuse to cheat because academic integrity rules exist to ensure fairness for all students.",
        stage: 4,
        reasoning: "Following institutional rules and maintaining order",
      },
      {
        text: "I won't cheat because it violates the trust and social contract between students and the educational institution.",
        stage: 5,
        reasoning: "Social contract and institutional integrity",
      },
      {
        text: "I refuse to cheat because honesty and personal integrity are fundamental principles that guide all my actions.",
        stage: 6,
        reasoning: "Universal ethical principles",
      },
    ],
    locale: "en",
  },
  {
    id: "underage-party",
    title: "The Underage Party",
    scenario:
      "Your best friend Jamie is throwing a huge birthday party at their apartment. You arrive to find that Jamie's older cousin has brought several bottles of alcohol, and most of your friends (who are under 21) are drinking. The music is loud, neighbors might complain, and campus security could show up any moment. Jamie pulls you aside, stressed and panicked, asking you to help decide what to do. They're worried about getting in trouble, but they also don't want to ruin everyone's fun or seem like a buzzkill. Several of your friends are already pretty drunk and would be angry if you shut down the party. How do you advise Jamie?",
    options: [
      {
        text: "Keep the party going but be more careful - just don't get caught by security or police.",
        stage: 1,
        reasoning: "Avoiding punishment and getting caught",
      },
      {
        text: "Continue the party because everyone's having fun and it benefits you socially to be part of the group.",
        stage: 2,
        reasoning: "Social benefits and group membership",
      },
      {
        text: "End the party because your friends will be disappointed in you if someone gets hurt on your watch.",
        stage: 3,
        reasoning: "Social expectations and peer approval",
      },
      {
        text: "Shut down the party immediately because underage drinking violates university rules and local laws.",
        stage: 4,
        reasoning: "Following rules and maintaining legal order",
      },
      {
        text: "Stop serving alcohol but let people stay - this balances fun with responsibility to the campus community.",
        stage: 5,
        reasoning: "Balancing individual desires with community welfare",
      },
      {
        text: "End the party because protecting people from potential harm is more important than temporary enjoyment.",
        stage: 6,
        reasoning: "Universal principle of preventing harm",
      },
    ],
    locale: "en",
  },
  {
    id: "struggling-roommate",
    title: "The Struggling Roommate",
    scenario:
      "Your roommate Sam has been acting strangely lately - skipping classes, staying in bed all day, and barely eating. When you try to talk to them, Sam breaks down and confesses they've been severely depressed and having thoughts of self-harm. Sam begs you not to tell anyone, especially not their parents or the counseling center, because they're afraid of being forced to take medical leave and losing their scholarship. Sam insists they can handle it on their own and just need time. You're genuinely worried about Sam's safety, but you also want to respect their wishes and maintain their trust. What do you do?",
    options: [
      {
        text: "Keep quiet because if I break Sam's trust, they might retaliate or make things worse for me.",
        stage: 1,
        reasoning: "Fear of personal consequences and retaliation",
      },
      {
        text: "Stay silent because Sam knows what's best for their own situation and future.",
        stage: 2,
        reasoning: "Respecting individual autonomy and self-interest",
      },
      {
        text: "Respect Sam's wishes because good friends keep secrets and don't betray each other's confidence.",
        stage: 3,
        reasoning: "Social expectations of friendship and loyalty",
      },
      {
        text: "Contact the counseling center because there are established procedures for handling mental health crises.",
        stage: 4,
        reasoning: "Following institutional procedures and protocols",
      },
      {
        text: "Convince Sam to seek help voluntarily while respecting their autonomy and right to make their own decisions.",
        stage: 5,
        reasoning: "Balancing individual rights with community support",
      },
      {
        text: "Get professional help immediately because preserving human life and well-being supersedes any promise of confidentiality.",
        stage: 6,
        reasoning: "Universal principle that human life is paramount",
      },
    ],
    locale: "en",
  },
];

// Function to get random scenarios
// Fisher-Yates shuffle algorithm for better randomization
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomScenarios(count: number = 3): Scenario[] {
  const shuffled = shuffleArray(scenarios);
  return shuffled.slice(0, count).map(scenario => shuffleScenarioOptions(scenario));
}

// Function to shuffle options while maintaining stage mapping
export function shuffleScenarioOptions(scenario: Scenario) {
  const shuffledOptions = shuffleArray(scenario.options);

  return {
    ...scenario,
    options: shuffledOptions,
  };
}
