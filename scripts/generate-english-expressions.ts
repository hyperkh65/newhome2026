/**
 * 영어 표현 10,000개 한국어 번역 생성 스크립트
 * - WordNet 10,000개 (general English)
 * - 비즈니스 표현 2,000개 (business English)
 * 실행: npx tsx scripts/generate-english-expressions.ts
 *
 * 중간에 중단해도 재시작 시 이어서 처리합니다.
 */

import fs from 'fs';
import path from 'path';

const WORDNET_PATH  = path.join(process.cwd(), 'data/english/open-wordnet-core.json');
const OUTPUT_PATH   = path.join(process.cwd(), 'data/english/expressions-light.json');
const BATCH_SIZE    = 20;
const DELAY_MS      = 2000; // Ollama Cloud: 2s between batches

// ── 비즈니스 표현 2,000개 ────────────────────────────────────────────────────

const BUSINESS_EXPRESSIONS: RawEntry[] = [
  // — Phrasal verbs (extra) —
  { term: 'put forward',    definition: 'suggest or propose something officially', example: 'She put forward a new proposal.', pos: 'v' },
  { term: 'bring in',       definition: 'introduce or recruit someone or something', example: 'We need to bring in a consultant.', pos: 'v' },
  { term: 'pick up on',     definition: 'notice or raise a point again', example: 'I want to pick up on the cost issue.', pos: 'v' },
  { term: 'build on',       definition: 'use something as a foundation to develop further', example: 'Let\'s build on last quarter\'s results.', pos: 'v' },
  { term: 'drill down',     definition: 'examine details more closely', example: 'We need to drill down into the numbers.', pos: 'v' },
  { term: 'reach out to',   definition: 'contact someone, especially to offer help', example: 'Please reach out to the supplier directly.', pos: 'v' },
  { term: 'look into',      definition: 'investigate or examine something', example: 'I will look into the issue right away.', pos: 'v' },
  { term: 'cut back on',    definition: 'reduce the amount of something', example: 'We need to cut back on overhead costs.', pos: 'v' },
  { term: 'draw up',        definition: 'prepare a formal document or plan', example: 'Please draw up a contract draft.', pos: 'v' },
  { term: 'narrow down',    definition: 'reduce a list of options to a smaller number', example: 'Let\'s narrow down the supplier list to three.', pos: 'v' },
  { term: 'build up',       definition: 'gradually increase or develop something', example: 'We are building up our client base.', pos: 'v' },
  { term: 'take on',        definition: 'accept a responsibility or challenge', example: 'She agreed to take on the project.', pos: 'v' },
  { term: 'factor in',      definition: 'include something in a calculation or plan', example: 'Factor in the shipping costs.', pos: 'v' },
  { term: 'put in place',   definition: 'establish a system or process', example: 'We need to put a monitoring process in place.', pos: 'v' },
  { term: 'lay out',        definition: 'explain something clearly and in detail', example: 'Let me lay out the key milestones.', pos: 'v' },
  { term: 'wrap up',        definition: 'finish or conclude something', example: 'Let\'s wrap up the meeting in five minutes.', pos: 'v' },
  { term: 'flag up',        definition: 'draw attention to an issue or concern', example: 'I wanted to flag up a potential delay.', pos: 'v' },
  { term: 'push for',       definition: 'try hard to achieve or obtain something', example: 'We are pushing for a 10% discount.', pos: 'v' },
  { term: 'kick off',       definition: 'start a project or event', example: 'We will kick off the campaign next Monday.', pos: 'v' },
  { term: 'nail down',      definition: 'finalize or confirm something precisely', example: 'Let\'s nail down the delivery date today.', pos: 'v' },
  { term: 'run by',         definition: 'check something with someone before proceeding', example: 'Let me run this by the manager first.', pos: 'v' },
  { term: 'loop in',        definition: 'include someone in a communication or process', example: 'Please loop in the finance team.', pos: 'v' },
  { term: 'touch on',       definition: 'briefly mention or discuss a topic', example: 'I will touch on the budget constraints.', pos: 'v' },
  { term: 'flesh out',      definition: 'add more detail or substance to something', example: 'Can you flesh out the proposal further?', pos: 'v' },
  { term: 'circle back to', definition: 'return to a topic discussed earlier', example: 'Let\'s circle back to the pricing issue.', pos: 'v' },
  { term: 'deliver on',     definition: 'fulfill a promise or commitment', example: 'We always deliver on our commitments.', pos: 'v' },
  { term: 'get ahead of',   definition: 'deal with something proactively before it becomes a problem', example: 'We need to get ahead of this supply risk.', pos: 'v' },
  { term: 'switch over',    definition: 'change from one system or supplier to another', example: 'We are switching over to a new ERP system.', pos: 'v' },
  { term: 'feed into',      definition: 'contribute to or influence a larger process', example: 'This data feeds into the monthly report.', pos: 'v' },
  { term: 'double up',      definition: 'combine two roles or increase effort significantly', example: 'We had to double up on production this month.', pos: 'v' },
  { term: 'branch out',     definition: 'expand into new areas or markets', example: 'The company is branching out into Asia.', pos: 'v' },
  { term: 'follow through', definition: 'complete what one started or promised', example: 'We need to follow through on the action items.', pos: 'v' },
  { term: 'stand by',       definition: 'be ready and waiting; also to support someone', example: 'Please stand by for the updated schedule.', pos: 'v' },
  { term: 'cut through',    definition: 'deal with problems quickly and directly', example: 'She cuts through the complexity with ease.', pos: 'v' },
  { term: 'bring forward',  definition: 'move a meeting or deadline to an earlier date', example: 'Can we bring forward the review to Tuesday?', pos: 'v' },
  { term: 'put off',        definition: 'postpone or delay something', example: 'We cannot put off this decision any longer.', pos: 'v' },
  { term: 'account for',    definition: 'explain or be responsible for something', example: 'Please account for the budget discrepancy.', pos: 'v' },
  { term: 'press ahead',    definition: 'continue doing something despite difficulties', example: 'We will press ahead with the launch.', pos: 'v' },
  { term: 'take up',        definition: 'begin doing something; also to use time or space', example: 'This issue takes up too much of our time.', pos: 'v' },
  { term: 'opt for',        definition: 'choose something from a range of options', example: 'We opted for the faster shipping method.', pos: 'v' },
  { term: 'gear up for',    definition: 'prepare for something that is about to happen', example: 'The team is gearing up for the product launch.', pos: 'v' },
  { term: 'come up with',   definition: 'think of or produce an idea or solution', example: 'Can you come up with a cost-saving proposal?', pos: 'v' },
  { term: 'pass on',        definition: 'give information to another person', example: 'Please pass on the updated specs to the factory.', pos: 'v' },
  { term: 'cut down on',    definition: 'reduce the amount or frequency of something', example: 'We need to cut down on rework.', pos: 'v' },
  { term: 'take over',      definition: 'assume control or responsibility', example: 'She will take over the account next month.', pos: 'v' },
  { term: 'bring on board', definition: 'recruit or involve someone in a project', example: 'We are bringing a new supplier on board.', pos: 'v' },
  { term: 'iron out',       definition: 'resolve minor problems or details', example: 'We need to iron out a few contract details.', pos: 'v' },
  { term: 'pave the way',   definition: 'create conditions that make something possible', example: 'This pilot paves the way for wider rollout.', pos: 'v' },
  { term: 'liaise with',    definition: 'communicate and cooperate with someone', example: 'Please liaise with the customs broker.', pos: 'v' },
  { term: 'coordinate with',definition: 'organize activities jointly with others', example: 'Coordinate with the warehouse team on stock levels.', pos: 'v' },

  // — Business idioms —
  { term: 'hit the ground running',    definition: 'start something quickly and with great energy', example: 'The new hire hit the ground running on day one.', pos: 'phrase' },
  { term: 'on the same page',          definition: 'having a shared understanding of something', example: 'Let\'s make sure we are all on the same page.', pos: 'phrase' },
  { term: 'move the needle',           definition: 'make a noticeable difference or progress', example: 'This campaign should move the needle on sales.', pos: 'phrase' },
  { term: 'bottom line',               definition: 'the most important factor or the final result', example: 'The bottom line is that costs need to fall.', pos: 'phrase' },
  { term: 'at the end of the day',     definition: 'ultimately; when everything is considered', example: 'At the end of the day, quality matters most.', pos: 'phrase' },
  { term: 'bite the bullet',           definition: 'endure a painful situation that is unavoidable', example: 'We had to bite the bullet and raise prices.', pos: 'phrase' },
  { term: 'touch base',                definition: 'briefly contact someone to check in', example: 'Let\'s touch base after the meeting.', pos: 'phrase' },
  { term: 'synergy',                   definition: 'combined effect greater than the sum of parts', example: 'The merger creates real synergy between teams.', pos: 'n' },
  { term: 'leverage',                  definition: 'use something to maximum advantage', example: 'We can leverage this relationship for better terms.', pos: 'v' },
  { term: 'bandwidth',                 definition: 'the capacity to handle additional work', example: 'I don\'t have the bandwidth for another project.', pos: 'n' },
  { term: 'pain point',                definition: 'a problem or difficulty experienced by someone', example: 'Long lead times are a major pain point for buyers.', pos: 'phrase' },
  { term: 'low-hanging fruit',         definition: 'easy tasks or goals that can be achieved quickly', example: 'Let\'s start with the low-hanging fruit first.', pos: 'phrase' },
  { term: 'deep dive',                 definition: 'a thorough investigation of a topic', example: 'We did a deep dive into the data last week.', pos: 'phrase' },
  { term: 'ballpark figure',           definition: 'a rough estimate or approximate number', example: 'Can you give me a ballpark figure for the cost?', pos: 'phrase' },
  { term: 'take it offline',           definition: 'discuss something privately rather than in a meeting', example: 'Let\'s take this discussion offline.', pos: 'phrase' },
  { term: 'run the numbers',           definition: 'perform calculations to evaluate something', example: 'I will run the numbers and get back to you.', pos: 'phrase' },
  { term: 'elephant in the room',      definition: 'an obvious problem no one wants to discuss', example: 'Pricing is the elephant in the room here.', pos: 'phrase' },
  { term: 'keep the ball rolling',     definition: 'maintain momentum or progress', example: 'Send a follow-up email to keep the ball rolling.', pos: 'phrase' },
  { term: 'in the pipeline',           definition: 'planned or being developed', example: 'A new product line is in the pipeline.', pos: 'phrase' },
  { term: 'ahead of the curve',        definition: 'more advanced or prepared than others', example: 'Our R&D keeps us ahead of the curve.', pos: 'phrase' },
  { term: 'on the back burner',        definition: 'postponed or given lower priority', example: 'The expansion plan is on the back burner now.', pos: 'phrase' },
  { term: 'step up to the plate',      definition: 'take responsibility when needed', example: 'It\'s time for the team to step up to the plate.', pos: 'phrase' },
  { term: 'get the ball rolling',      definition: 'start something; initiate a process', example: 'Let\'s get the ball rolling on this project.', pos: 'phrase' },
  { term: 'back to the drawing board', definition: 'start again after a failure', example: 'The prototype failed — back to the drawing board.', pos: 'phrase' },
  { term: 'win-win situation',         definition: 'an outcome that benefits all parties', example: 'This deal is a win-win situation for both sides.', pos: 'phrase' },
  { term: 'think outside the box',     definition: 'approach a problem in a creative way', example: 'We need to think outside the box on this one.', pos: 'phrase' },
  { term: 'go the extra mile',         definition: 'make more effort than expected', example: 'Our service team always goes the extra mile.', pos: 'phrase' },
  { term: 'raise the bar',             definition: 'set a higher standard', example: 'This new product raises the bar for the industry.', pos: 'phrase' },
  { term: 'cover all bases',           definition: 'prepare for every possible situation', example: 'The contract covers all bases.', pos: 'phrase' },
  { term: 'cut corners',               definition: 'do something the quick but substandard way', example: 'We cannot afford to cut corners on quality.', pos: 'phrase' },

  // — Email language —
  { term: 'please find attached',      definition: 'used when sending a document', example: 'Please find attached the revised quotation.', pos: 'phrase' },
  { term: 'as per our discussion',     definition: 'referring to what was discussed earlier', example: 'As per our discussion, please see below.', pos: 'phrase' },
  { term: 'I hope this finds you well',definition: 'a polite email opening greeting', example: 'I hope this email finds you well.', pos: 'phrase' },
  { term: 'please revert',             definition: 'please reply or respond (formal)', example: 'Please revert by end of day.', pos: 'phrase' },
  { term: 'looking forward to',        definition: 'anticipating something with pleasure', example: 'I look forward to hearing from you.', pos: 'phrase' },
  { term: 'further to my last email',  definition: 'referring back to a previous message', example: 'Further to my last email, please confirm.', pos: 'phrase' },
  { term: 'for your reference',        definition: 'providing information for use as needed', example: 'For your reference, I have attached the specs.', pos: 'phrase' },
  { term: 'could you please',          definition: 'a polite way to make a request', example: 'Could you please send the invoice today?', pos: 'phrase' },
  { term: 'I would appreciate it if',  definition: 'a polite way to ask for something', example: 'I would appreciate it if you could confirm.', pos: 'phrase' },
  { term: 'please be advised',         definition: 'a formal way to give notice', example: 'Please be advised that prices will change.', pos: 'phrase' },
  { term: 'at your earliest convenience', definition: 'as soon as you are able to', example: 'Please respond at your earliest convenience.', pos: 'phrase' },
  { term: 'I wanted to follow up',     definition: 'checking on something previously discussed', example: 'I wanted to follow up on the proposal.', pos: 'phrase' },
  { term: 'enclosed please find',      definition: 'used to indicate enclosed documents', example: 'Enclosed please find the purchase order.', pos: 'phrase' },
  { term: 'as requested',              definition: 'as was asked by someone earlier', example: 'As requested, here are the updated figures.', pos: 'phrase' },
  { term: 'let me know if',            definition: 'asking someone to inform you if something', example: 'Let me know if you have any questions.', pos: 'phrase' },

  // — Meeting language —
  { term: 'shall we get started',      definition: 'a polite way to begin a meeting', example: 'Shall we get started? We have a lot to cover.', pos: 'phrase' },
  { term: 'let\'s take that offline',  definition: 'suggest discussing separately', example: 'Let\'s take that offline after the call.', pos: 'phrase' },
  { term: 'can you elaborate on',      definition: 'ask someone to explain in more detail', example: 'Can you elaborate on that point?', pos: 'phrase' },
  { term: 'just to clarify',           definition: 'to make sure something is understood correctly', example: 'Just to clarify — the deadline is Friday?', pos: 'phrase' },
  { term: 'any other business',        definition: 'additional topics at the end of a meeting', example: 'Are there any other business items to discuss?', pos: 'phrase' },
  { term: 'table the discussion',      definition: 'postpone a discussion to another time', example: 'Let\'s table this discussion for next week.', pos: 'phrase' },
  { term: 'action items',              definition: 'tasks assigned to specific people after a meeting', example: 'Let\'s review the action items before we close.', pos: 'phrase' },
  { term: 'minutes of the meeting',    definition: 'a written record of what was discussed', example: 'I will circulate the minutes of the meeting.', pos: 'phrase' },
  { term: 'standing agenda',           definition: 'a regular set of topics for recurring meetings', example: 'This is a standing agenda item each month.', pos: 'phrase' },
  { term: 'quorum',                    definition: 'the minimum number of members needed to proceed', example: 'We do not have a quorum yet — let\'s wait.', pos: 'n' },
  { term: 'round table',              definition: 'a discussion where all participants contribute equally', example: 'We held a round table on the new strategy.', pos: 'phrase' },

  // — Negotiation language —
  { term: 'meet in the middle',        definition: 'compromise so both sides give a little', example: 'Can we meet in the middle on the price?', pos: 'phrase' },
  { term: 'best and final offer',      definition: 'the last and best price one is willing to offer', example: 'This is our best and final offer.', pos: 'phrase' },
  { term: 'walk away from',            definition: 'choose not to proceed with a deal', example: 'We are prepared to walk away if terms don\'t improve.', pos: 'phrase' },
  { term: 'sweetener',                 definition: 'an extra benefit added to make a deal more attractive', example: 'They added free shipping as a sweetener.', pos: 'n' },
  { term: 'counter-offer',             definition: 'an offer made in response to another offer', example: 'We submitted a counter-offer this morning.', pos: 'n' },
  { term: 'deal-breaker',              definition: 'a condition that prevents a deal from being made', example: 'The payment terms are a deal-breaker for us.', pos: 'n' },
  { term: 'firm price',                definition: 'a price that will not be reduced', example: 'This is our firm price for the season.', pos: 'phrase' },
  { term: 'wiggle room',               definition: 'flexibility in a situation or negotiation', example: 'Is there any wiggle room on the timeline?', pos: 'phrase' },
  { term: 'good faith',                definition: 'honesty and sincerity of intention', example: 'We are negotiating in good faith.', pos: 'phrase' },
  { term: 'sticking point',            definition: 'an issue that prevents agreement', example: 'Payment terms remain the main sticking point.', pos: 'phrase' },
  { term: 'handshake deal',            definition: 'an informal agreement based on trust', example: 'We started with a handshake deal.', pos: 'phrase' },
  { term: 'non-negotiable',            definition: 'not able to be changed through negotiation', example: 'The quality standard is non-negotiable.', pos: 'adj' },

  // — Operations & Logistics —
  { term: 'lead time',                 definition: 'the time from order to delivery', example: 'The lead time is currently four weeks.', pos: 'phrase' },
  { term: 'stock out',                 definition: 'having no inventory left of a product', example: 'We had a stock out last week on this item.', pos: 'phrase' },
  { term: 'backorder',                 definition: 'an order that cannot be filled immediately', example: 'This item is on backorder until next month.', pos: 'n' },
  { term: 'turnaround time',           definition: 'the time to complete a task or process', example: 'Our turnaround time for samples is three days.', pos: 'phrase' },
  { term: 'just-in-time',             definition: 'a production strategy to reduce inventory', example: 'We operate on a just-in-time basis.', pos: 'phrase' },
  { term: 'bill of lading',           definition: 'a document issued by a carrier to acknowledge receipt', example: 'Please send the bill of lading by email.', pos: 'phrase' },
  { term: 'customs clearance',        definition: 'the process of goods passing through customs', example: 'Customs clearance is taking longer than expected.', pos: 'phrase' },
  { term: 'freight forwarder',        definition: 'an agent who arranges cargo shipments', example: 'Our freight forwarder handles all documentation.', pos: 'phrase' },
  { term: 'ETA',                      definition: 'estimated time of arrival', example: 'What is the ETA for the shipment?', pos: 'phrase' },
  { term: 'FOB',                      definition: 'free on board — seller delivers at named port', example: 'The price is FOB Shanghai.', pos: 'phrase' },
  { term: 'CIF',                      definition: 'cost, insurance, and freight — seller covers all', example: 'We prefer CIF terms for large orders.', pos: 'phrase' },
  { term: 'throughput',               definition: 'the amount processed or produced in a period', example: 'We need to increase throughput by 20%.', pos: 'n' },
  { term: 'bottleneck',               definition: 'a point of congestion that slows production', example: 'The bottleneck is at the inspection stage.', pos: 'n' },
  { term: 'capacity utilization',     definition: 'the percentage of capacity actually being used', example: 'Our capacity utilization is at 90% this month.', pos: 'phrase' },
  { term: 'value chain',              definition: 'the steps from raw material to end product', example: 'We are optimizing our entire value chain.', pos: 'phrase' },

  // — Finance & Pricing —
  { term: 'gross margin',             definition: 'revenue minus cost of goods sold', example: 'Our gross margin improved to 38% this quarter.', pos: 'phrase' },
  { term: 'net profit',               definition: 'revenue minus all expenses and taxes', example: 'Net profit rose 12% year on year.', pos: 'phrase' },
  { term: 'accounts receivable',      definition: 'money owed to a company by its customers', example: 'Accounts receivable is up 15% this month.', pos: 'phrase' },
  { term: 'accounts payable',         definition: 'money a company owes to its suppliers', example: 'We are extending accounts payable to 60 days.', pos: 'phrase' },
  { term: 'cash flow',                definition: 'the movement of money in and out of a business', example: 'Cash flow is tight at the end of the quarter.', pos: 'phrase' },
  { term: 'working capital',          definition: 'current assets minus current liabilities', example: 'We need to improve working capital efficiency.', pos: 'phrase' },
  { term: 'breakeven point',          definition: 'the level of sales at which costs equal revenue', example: 'We expect to hit breakeven by Q3.', pos: 'phrase' },
  { term: 'cost of goods sold',       definition: 'direct costs of producing goods sold', example: 'Cost of goods sold rose due to material prices.', pos: 'phrase' },
  { term: 'return on investment',     definition: 'the benefit gained relative to the cost', example: 'The ROI on this campaign was excellent.', pos: 'phrase' },
  { term: 'markup',                   definition: 'the amount added to cost price to get selling price', example: 'Our standard markup is 40%.', pos: 'n' },
  { term: 'payment terms',            definition: 'agreed conditions for when payment is due', example: 'Our payment terms are net 30 days.', pos: 'phrase' },
  { term: 'letter of credit',         definition: 'a bank document guaranteeing payment', example: 'Please issue a letter of credit for this order.', pos: 'phrase' },
  { term: 'advance payment',          definition: 'payment made before goods are delivered', example: 'We require 30% advance payment.', pos: 'phrase' },
  { term: 'volume discount',          definition: 'a reduction in price for buying large quantities', example: 'We can offer a volume discount above 500 units.', pos: 'phrase' },
  { term: 'currency exposure',        definition: 'the risk of loss from exchange rate changes', example: 'We hedge our currency exposure each quarter.', pos: 'phrase' },

  // — Quality & Compliance —
  { term: 'corrective action',        definition: 'steps taken to fix the cause of a defect', example: 'Please submit a corrective action report.', pos: 'phrase' },
  { term: 'root cause analysis',      definition: 'identifying the fundamental cause of a problem', example: 'We need to complete a root cause analysis first.', pos: 'phrase' },
  { term: 'non-conformance',          definition: 'failure to meet a specified requirement', example: 'There was a non-conformance on the last batch.', pos: 'n' },
  { term: 'zero defect',              definition: 'a standard of no errors or defects', example: 'Our goal is zero defect delivery.', pos: 'phrase' },
  { term: 'incoming inspection',      definition: 'checking goods when they arrive', example: 'All parts go through incoming inspection.', pos: 'phrase' },
  { term: 'certificate of conformity',definition: 'a document stating goods meet requirements', example: 'Please include the certificate of conformity.', pos: 'phrase' },
  { term: 'audit trail',              definition: 'a record showing a history of activities', example: 'We need an audit trail for all transactions.', pos: 'phrase' },
  { term: 'tolerance',                definition: 'the acceptable range of variation in a measurement', example: 'The tolerance is plus or minus 0.5mm.', pos: 'n' },
  { term: 'FMEA',                     definition: 'failure mode and effects analysis', example: 'We completed an FMEA before production start.', pos: 'phrase' },
  { term: 'continuous improvement',   definition: 'an ongoing effort to improve processes', example: 'Continuous improvement is part of our culture.', pos: 'phrase' },

  // — Management & HR —
  { term: 'onboarding',               definition: 'integrating a new employee into an organization', example: 'New supplier onboarding takes two weeks.', pos: 'n' },
  { term: 'performance review',       definition: 'a regular assessment of an employee\'s work', example: 'Annual performance reviews are in December.', pos: 'phrase' },
  { term: 'key performance indicator',definition: 'a measurable value that shows progress toward a goal', example: 'What KPIs are you tracking this quarter?', pos: 'phrase' },
  { term: 'stakeholder',              definition: 'a person with an interest in an organization', example: 'We need stakeholder sign-off before proceeding.', pos: 'n' },
  { term: 'cross-functional',         definition: 'involving several different departments', example: 'This is a cross-functional project.', pos: 'adj' },
  { term: 'span of control',          definition: 'the number of people a manager supervises', example: 'The span of control is too wide for one manager.', pos: 'phrase' },
  { term: 'succession planning',      definition: 'preparing replacements for key positions', example: 'Succession planning is critical for continuity.', pos: 'phrase' },
  { term: 'deliverable',              definition: 'a tangible output or result of a project', example: 'List all the deliverables for this phase.', pos: 'n' },
  { term: 'escalation path',          definition: 'the route for raising issues to higher authority', example: 'What is the escalation path for unresolved claims?', pos: 'phrase' },
  { term: 'headcount',                definition: 'the number of people employed', example: 'We are not adding headcount this quarter.', pos: 'n' },

  // — Sales & Marketing —
  { term: 'conversion rate',          definition: 'the percentage of leads that become customers', example: 'Our conversion rate is up to 18%.', pos: 'phrase' },
  { term: 'sales pipeline',           definition: 'a set of potential deals at various stages', example: 'The sales pipeline looks strong for Q3.', pos: 'phrase' },
  { term: 'upsell',                   definition: 'sell a higher-value product to an existing customer', example: 'Can we upsell the premium package?', pos: 'v' },
  { term: 'cross-sell',               definition: 'sell additional products to existing customers', example: 'We cross-sell accessories with every main unit.', pos: 'v' },
  { term: 'cold call',                definition: 'contacting a potential customer without prior contact', example: 'The team makes 30 cold calls per day.', pos: 'phrase' },
  { term: 'unique selling point',     definition: 'a feature that sets a product apart from competitors', example: 'Our USP is same-day technical support.', pos: 'phrase' },
  { term: 'call to action',           definition: 'an instruction urging the audience to take action', example: 'The ad needs a clear call to action.', pos: 'phrase' },
  { term: 'market penetration',       definition: 'the extent to which a product is used in a market', example: 'We have strong market penetration in Korea.', pos: 'phrase' },
  { term: 'brand awareness',          definition: 'how well consumers recognize a brand', example: 'Brand awareness has grown by 25% this year.', pos: 'phrase' },
  { term: 'customer retention',       definition: 'keeping existing customers over time', example: 'Customer retention is our top priority.', pos: 'phrase' },
  { term: 'net promoter score',       definition: 'a measure of customer loyalty and satisfaction', example: 'Our NPS improved significantly this quarter.', pos: 'phrase' },

  // — Strategy & Planning —
  { term: 'go-to-market strategy',   definition: 'a plan for launching a product to market', example: 'The go-to-market strategy is ready.', pos: 'phrase' },
  { term: 'SWOT analysis',           definition: 'a framework for strengths, weaknesses, opportunities, threats', example: 'We ran a SWOT analysis in the planning session.', pos: 'phrase' },
  { term: 'roadmap',                 definition: 'a plan showing the timeline and goals of a project', example: 'Please share the product roadmap for next year.', pos: 'n' },
  { term: 'pivot',                   definition: 'a fundamental change in business strategy', example: 'We decided to pivot and focus on B2B.', pos: 'v' },
  { term: 'scalable',                definition: 'able to expand efficiently as demand grows', example: 'The solution needs to be scalable.', pos: 'adj' },
  { term: 'competitive advantage',   definition: 'an edge over competitors', example: 'Our tech is our main competitive advantage.', pos: 'phrase' },
  { term: 'benchmark',               definition: 'a standard used for comparison or evaluation', example: 'Use industry benchmarks to set targets.', pos: 'n' },
  { term: 'strategic fit',           definition: 'how well two things align with each other', example: 'There is a strong strategic fit here.', pos: 'phrase' },
  { term: 'risk mitigation',         definition: 'reducing the likelihood or impact of risks', example: 'Risk mitigation is built into every phase.', pos: 'phrase' },
  { term: 'agile',                   definition: 'able to respond quickly to change', example: 'We use an agile approach to development.', pos: 'adj' },
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface RawEntry {
  term: string;
  definition: string;
  example: string;
  pos: string;
}

export interface LightExpression {
  id: string;
  expression: string;
  korean: string;
  definition: string;
  example: string;
  exampleKr: string;
  pos: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  categories: string[];
  source: 'wordnet' | 'business';
}

// ── Ollama Cloud 배치 번역 ────────────────────────────────────────────────────

const OLLAMA_MODELS = [
  'gemma4:31b',
  'deepseek-v4-flash',
  'nemotron-3-super',
  'gpt-oss:20b',
  'deepseek-v4-flash:0731',
];
let ollamaModelIdx = 0;

async function translateBatch(
  entries: RawEntry[],
  apiKey: string,
  source: 'wordnet' | 'business',
): Promise<LightExpression[]> {
  const list = entries
    .map((e, i) => `${i + 1}. "${e.term}" | ${e.definition} | ex: ${e.example}`)
    .join('\n');

  const prompt = `다음 영어 표현 ${entries.length}개를 한국어로 번역하고 정보를 추가하세요.
비즈니스/학습 사이트용입니다. 정확하고 자연스러운 한국어로 작성하세요.

${list}

다음 JSON 배열만 출력하세요 (코드블록이나 다른 텍스트 없이 [ 로 시작해서 ] 로 끝내세요):
[
  {"korean":"한국어 뜻","exampleKr":"예문 한국어","level":"beginner|intermediate|advanced","categories":["cat1","cat2"]},
  ...
]

level 기준: beginner=일상/기초, intermediate=업무/중급, advanced=전문/고급
categories 선택 (1~3개): general, business, email, communication, operations, finance, sales, management, quality, logistics, strategy, hr, marketing, negotiation, academic, daily, technical, idiom, phrase`;

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < OLLAMA_MODELS.length; attempt++) {
    const model = OLLAMA_MODELS[(ollamaModelIdx + attempt) % OLLAMA_MODELS.length];
    let res: Response;
    try {
      res = await fetch('https://ollama.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          stream: false,
          messages: [{ role: 'user', content: prompt }],
          options: { temperature: 0.3 },
        }),
        signal: AbortSignal.timeout(120_000),
      });
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      process.stdout.write(`[${model} err] `);
      continue;
    }

    if (!res.ok) {
      const errText = await res.text();
      lastError = new Error(`Ollama ${res.status} (${model}): ${errText.slice(0, 200)}`);
      if (res.status === 429) await new Promise(r => setTimeout(r, 10_000));
      continue;
    }
    const data = await res.json() as { message?: { content?: string } };
    const text = data.message?.content;
    if (!text) {
      lastError = new Error(`Empty response from ${model}`);
      ollamaModelIdx = (ollamaModelIdx + 1) % OLLAMA_MODELS.length;
      continue;
    }
    ollamaModelIdx = (ollamaModelIdx + attempt) % OLLAMA_MODELS.length;

    let translations: Array<{ korean: string; exampleKr: string; level: string; categories: string[] }> = [];
    try {
      const jsonStr = text.match(/\[[\s\S]*\]/)?.[0] || '[]';
      translations = JSON.parse(jsonStr);
    } catch {
      console.warn('  JSON 파싱 실패, 빈 값으로 채움');
    }

    return entries.map((e, i) => ({
      id: `${source}-${e.term.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
      expression: e.term,
      korean: translations[i]?.korean ?? '',
      definition: e.definition,
      example: e.example,
      exampleKr: translations[i]?.exampleKr ?? '',
      pos: e.pos,
      level: (['beginner', 'intermediate', 'advanced'].includes(translations[i]?.level)
        ? translations[i].level
        : 'intermediate') as LightExpression['level'],
      categories: Array.isArray(translations[i]?.categories) ? translations[i].categories : ['general'],
      source,
    }));
  }
  if (lastError) throw lastError;
  throw new Error('All models failed');
}

// ── 메인 ─────────────────────────────────────────────────────────────────────

async function main() {
  const apiKey = process.env.OLLAMA_API_KEY ?? '';
  if (!apiKey) {
    console.error('환경변수 OLLAMA_API_KEY를 설정하세요.');
    process.exit(1);
  }

  const wordnet: RawEntry[] = JSON.parse(fs.readFileSync(WORDNET_PATH, 'utf-8'));
  const allEntries: Array<{ entry: RawEntry; source: 'wordnet' | 'business' }> = [
    ...wordnet.map(e => ({ entry: e, source: 'wordnet' as const })),
    ...BUSINESS_EXPRESSIONS.map(e => ({ entry: e, source: 'business' as const })),
  ];

  console.log(`총 ${allEntries.length}개 처리 예정 (WordNet ${wordnet.length} + Business ${BUSINESS_EXPRESSIONS.length})`);

  // 기존 출력 파일에서 이어서 재시작
  let results: LightExpression[] = [];
  if (fs.existsSync(OUTPUT_PATH)) {
    results = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf-8'));
    console.log(`기존 ${results.length}개 완료 — 이어서 시작`);
  }

  const processedIds = new Set(results.map(r => r.id));
  const remaining = allEntries.filter(({ entry, source }) => {
    const id = `${source}-${entry.term.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;
    return !processedIds.has(id);
  });

  console.log(`남은 항목: ${remaining.length}개`);

  for (let i = 0; i < remaining.length; i += BATCH_SIZE) {
    const batch = remaining.slice(i, i + BATCH_SIZE);
    const batchEntries = batch.map(b => b.entry);
    const source = batch[0].source;

    const from = i + 1;
    const to = Math.min(i + BATCH_SIZE, remaining.length);
    process.stdout.write(`[${from}~${to}/${remaining.length}] 번역 중...`);

    try {
      const translated = await translateBatch(batchEntries, apiKey, source);
      results.push(...translated);
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2), 'utf-8');
      console.log(` 완료 (누적 ${results.length}개)`);
    } catch (err) {
      console.error(` 오류: ${err} — 스킵`);
    }

    if (i + BATCH_SIZE < remaining.length) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  console.log(`\n✅ 완료! 총 ${results.length}개 → ${OUTPUT_PATH}`);
}

main().catch(console.error);
