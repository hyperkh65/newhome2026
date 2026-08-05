export type VocabLevel = 'basic' | 'intermediate' | 'advanced';
export type VocabPos = 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase';

export interface VocabEntry {
  id: string;
  word: string;
  pos: VocabPos;
  korean: string;
  definition: string;
  level: VocabLevel;
  categories: string[];
  synonyms: string[];
  examples: { en: string; kr: string }[];
}

const RAW_VOCAB: Array<[
  string, string, VocabPos, string, string, VocabLevel,
  string[], string[], { en: string; kr: string }[]
]> = [
  // ── COMMUNICATION ─────────────────────────────────────────────────────────
  ['articulate', 'articulate', 'verb', '명확히 표현하다', 'to express thoughts or ideas clearly and effectively', 'intermediate',
    ['communication', 'presentation'],
    ['express', 'convey', 'communicate'],
    [
      { en: 'She articulated the project goals clearly at the kickoff meeting.', kr: '그녀는 킥오프 회의에서 프로젝트 목표를 명확히 표현했습니다.' },
      { en: 'Can you articulate what the client actually needs?', kr: '고객이 실제로 필요한 것을 명확히 말씀해 주시겠어요?' },
    ]
  ],
  ['clarify', 'clarify', 'verb', '명확히 하다', 'to make a statement or situation less confused and more comprehensible', 'basic',
    ['communication', 'email'],
    ['explain', 'elaborate', 'specify'],
    [
      { en: 'Could you clarify the payment terms before we proceed?', kr: '진행하기 전에 결제 조건을 명확히 해주시겠어요?' },
      { en: 'I need to clarify a few points in your proposal.', kr: '제안서의 몇 가지 사항을 명확히 하고 싶습니다.' },
    ]
  ],
  ['elaborate', 'elaborate', 'verb', '자세히 설명하다', 'to explain something in more detail', 'intermediate',
    ['communication', 'meeting'],
    ['expand on', 'detail', 'explain further'],
    [
      { en: 'Could you elaborate on the delivery schedule?', kr: '납기 일정에 대해 좀 더 자세히 설명해 주시겠어요?' },
      { en: 'Please elaborate on how this solution addresses our issue.', kr: '이 솔루션이 어떻게 문제를 해결하는지 설명해 주세요.' },
    ]
  ],
  ['reiterate', 'reiterate', 'verb', '반복하여 강조하다', 'to say something again or a number of times for emphasis', 'advanced',
    ['communication', 'formal'],
    ['repeat', 'restate', 'emphasize'],
    [
      { en: 'I would like to reiterate that quality is our top priority.', kr: '품질이 최우선 순위라는 점을 다시 한번 강조하고 싶습니다.' },
      { en: 'Let me reiterate the key points from today\'s discussion.', kr: '오늘 논의의 핵심 사항을 다시 강조하겠습니다.' },
    ]
  ],
  ['convey', 'convey', 'verb', '전달하다', 'to communicate or make known a message, feeling, or idea', 'intermediate',
    ['communication', 'email'],
    ['communicate', 'express', 'transmit'],
    [
      { en: 'Please convey our apologies to the client.', kr: '고객에게 저희의 사과를 전달해 주세요.' },
      { en: 'The email failed to convey the urgency of the situation.', kr: '이메일이 상황의 심각성을 제대로 전달하지 못했습니다.' },
    ]
  ],

  // ── DECISION MAKING ───────────────────────────────────────────────────────
  ['evaluate', 'evaluate', 'verb', '평가하다', 'to assess or judge the value or quality of something', 'basic',
    ['decision', 'analysis'],
    ['assess', 'appraise', 'judge'],
    [
      { en: 'We need to evaluate all supplier options before making a decision.', kr: '결정을 내리기 전에 모든 공급사 옵션을 평가해야 합니다.' },
      { en: 'The team evaluated the risk of launching in Q3.', kr: '팀은 3분기 출시 위험을 평가했습니다.' },
    ]
  ],
  ['prioritize', 'prioritize', 'verb', '우선순위를 정하다', 'to arrange or deal with things in order of importance', 'basic',
    ['management', 'planning'],
    ['rank', 'order', 'focus on'],
    [
      { en: 'We need to prioritize the tasks that affect the client directly.', kr: '고객에게 직접 영향을 미치는 업무를 우선시해야 합니다.' },
      { en: 'Let\'s prioritize the urgent items before the deadline.', kr: '마감 전에 긴급 항목을 먼저 처리합시다.' },
    ]
  ],
  ['deliberate', 'deliberate', 'verb', '신중히 숙고하다', 'to think carefully about something before making a decision', 'advanced',
    ['decision', 'strategy'],
    ['consider', 'ponder', 'weigh up'],
    [
      { en: 'The board deliberated for two hours before approving the budget.', kr: '이사회는 예산을 승인하기 전에 두 시간 동안 숙고했습니다.' },
      { en: 'We deliberated over the best supplier and chose FST.', kr: '최적의 공급사를 신중히 검토한 끝에 FST를 선택했습니다.' },
    ]
  ],
  ['determine', 'determine', 'verb', '결정하다, 파악하다', 'to find out or conclude through investigation or reasoning', 'basic',
    ['decision', 'analysis'],
    ['find out', 'establish', 'conclude'],
    [
      { en: 'We need to determine the root cause of this quality issue.', kr: '이 품질 문제의 근본 원인을 파악해야 합니다.' },
      { en: 'Please determine whether we can meet the deadline.', kr: '마감일을 맞출 수 있는지 확인해 주세요.' },
    ]
  ],
  ['assess', 'assess', 'verb', '평가하다, 검토하다', 'to evaluate or estimate the nature or quality of something', 'intermediate',
    ['analysis', 'quality'],
    ['evaluate', 'review', 'examine'],
    [
      { en: 'We will assess the risk before committing to the project.', kr: '프로젝트에 착수하기 전에 위험을 평가할 것입니다.' },
      { en: 'The audit team assessed the supplier\'s production facility.', kr: '감사팀이 공급사의 생산 시설을 점검했습니다.' },
    ]
  ],

  // ── PROJECT MANAGEMENT ────────────────────────────────────────────────────
  ['coordinate', 'coordinate', 'verb', '조율하다, 조정하다', 'to organize different things or people so they work together effectively', 'basic',
    ['management', 'operations'],
    ['organize', 'manage', 'arrange'],
    [
      { en: 'Could you coordinate the shipment schedule with the logistics team?', kr: '물류팀과 선적 일정을 조율해 주시겠어요?' },
      { en: 'She coordinates all communication between the client and the factory.', kr: '그녀는 고객과 공장 간의 모든 소통을 조율합니다.' },
    ]
  ],
  ['implement', 'implement', 'verb', '실행하다, 도입하다', 'to put a plan, decision, or agreement into effect', 'basic',
    ['management', 'operations'],
    ['execute', 'carry out', 'apply'],
    [
      { en: 'We plan to implement the new quality system by Q4.', kr: '4분기까지 새 품질 시스템을 도입할 계획입니다.' },
      { en: 'The changes were implemented smoothly across all departments.', kr: '변경 사항이 모든 부서에 걸쳐 원활하게 실행되었습니다.' },
    ]
  ],
  ['oversee', 'oversee', 'verb', '감독하다, 총괄하다', 'to watch over and direct a project or group of people', 'intermediate',
    ['management', 'leadership'],
    ['supervise', 'manage', 'monitor'],
    [
      { en: 'He oversees all export documentation for the team.', kr: '그는 팀의 모든 수출 서류를 총괄합니다.' },
      { en: 'The project manager will oversee the production process.', kr: '프로젝트 매니저가 생산 과정을 감독할 예정입니다.' },
    ]
  ],
  ['execute', 'execute', 'verb', '실행하다, 수행하다', 'to carry out or put into effect a plan, order, or course of action', 'intermediate',
    ['management', 'operations'],
    ['carry out', 'implement', 'perform'],
    [
      { en: 'The team executed the plan without any major issues.', kr: '팀은 별다른 문제 없이 계획을 실행했습니다.' },
      { en: 'We need to execute this strategy before the competitor does.', kr: '경쟁사보다 먼저 이 전략을 실행해야 합니다.' },
    ]
  ],
  ['monitor', 'monitor', 'verb', '모니터링하다, 추적하다', 'to observe and check the progress or quality of something over time', 'basic',
    ['management', 'quality'],
    ['track', 'watch', 'check'],
    [
      { en: 'Please monitor the shipment status and update us daily.', kr: '선적 상태를 모니터링하고 매일 현황을 보고해 주세요.' },
      { en: 'We monitor supplier performance on a quarterly basis.', kr: '공급사 성과를 분기별로 모니터링합니다.' },
    ]
  ],

  // ── NEGOTIATION ───────────────────────────────────────────────────────────
  ['negotiate', 'negotiate', 'verb', '협상하다', 'to discuss something formally to reach an agreement', 'basic',
    ['negotiation', 'sales'],
    ['bargain', 'discuss terms', 'work out'],
    [
      { en: 'We are negotiating better payment terms with the supplier.', kr: '공급사와 더 좋은 결제 조건을 협상 중입니다.' },
      { en: 'She negotiated a 10% discount on the bulk order.', kr: '그녀는 대량 주문에서 10% 할인을 이끌어냈습니다.' },
    ]
  ],
  ['compromise', 'compromise', 'verb', '타협하다', 'to settle a dispute by mutual concession; each side gives up something', 'intermediate',
    ['negotiation', 'communication'],
    ['meet halfway', 'reach a middle ground', 'concede'],
    [
      { en: 'Both parties agreed to compromise on the delivery date.', kr: '양측은 납기일에 대해 타협하기로 합의했습니다.' },
      { en: 'We cannot compromise on quality, but we can adjust the price.', kr: '품질은 타협할 수 없지만 가격은 조정할 수 있습니다.' },
    ]
  ],
  ['leverage', 'leverage', 'verb', '활용하다, 레버리지하다', 'to use something to maximum advantage in a negotiation or situation', 'advanced',
    ['negotiation', 'strategy'],
    ['use', 'capitalize on', 'exploit'],
    [
      { en: 'We can leverage our long order history to negotiate a better rate.', kr: '오랜 주문 이력을 활용해 더 좋은 가격을 협상할 수 있습니다.' },
      { en: 'They leveraged their market position to secure a better deal.', kr: '그들은 시장 지위를 활용해 더 나은 거래를 확보했습니다.' },
    ]
  ],
  ['concede', 'concede', 'verb', '양보하다, 인정하다', 'to admit that something is true or to give something up reluctantly', 'advanced',
    ['negotiation', 'communication'],
    ['acknowledge', 'admit', 'give in'],
    [
      { en: 'We conceded a small price reduction to close the deal.', kr: '거래를 마무리하기 위해 소폭의 가격 인하를 양보했습니다.' },
      { en: 'The supplier conceded that the defect rate was unacceptable.', kr: '공급사는 불량률이 허용할 수 없는 수준임을 인정했습니다.' },
    ]
  ],
  ['persuade', 'persuade', 'verb', '설득하다', 'to make someone do or believe something through reasoning or argument', 'basic',
    ['communication', 'sales'],
    ['convince', 'influence', 'win over'],
    [
      { en: 'We managed to persuade the client to extend the trial period.', kr: '고객에게 시범 기간을 연장하도록 설득하는 데 성공했습니다.' },
      { en: 'He persuaded the board to approve the new investment.', kr: '그는 이사회에게 새 투자를 승인하도록 설득했습니다.' },
    ]
  ],

  // ── ANALYSIS ──────────────────────────────────────────────────────────────
  ['analyze', 'analyze', 'verb', '분석하다', 'to examine something in detail to understand it or explain it', 'basic',
    ['analysis', 'data'],
    ['examine', 'study', 'investigate'],
    [
      { en: 'Let\'s analyze the sales data from the last quarter.', kr: '지난 분기 판매 데이터를 분석해봅시다.' },
      { en: 'The team analyzed the root cause of the quality complaint.', kr: '팀이 품질 클레임의 근본 원인을 분석했습니다.' },
    ]
  ],
  ['forecast', 'forecast', 'verb', '예측하다', 'to predict or estimate a future event or trend based on current data', 'intermediate',
    ['planning', 'finance'],
    ['predict', 'project', 'estimate'],
    [
      { en: 'We are forecasting 15% growth in overseas sales next year.', kr: '내년 해외 매출이 15% 성장할 것으로 예측하고 있습니다.' },
      { en: 'Can you forecast the demand for Q3 by Friday?', kr: '금요일까지 3분기 수요를 예측해 주실 수 있나요?' },
    ]
  ],
  ['scrutinize', 'scrutinize', 'verb', '면밀히 검토하다', 'to examine or inspect closely and thoroughly', 'advanced',
    ['analysis', 'quality'],
    ['examine closely', 'inspect', 'review in detail'],
    [
      { en: 'The compliance team will scrutinize all incoming documentation.', kr: '준법팀이 모든 수신 서류를 면밀히 검토할 예정입니다.' },
      { en: 'We need to scrutinize the contract before signing.', kr: '서명하기 전에 계약서를 면밀히 검토해야 합니다.' },
    ]
  ],
  ['benchmark', 'benchmark', 'verb', '기준으로 삼아 비교하다', 'to evaluate something by comparison with a standard or reference point', 'intermediate',
    ['analysis', 'strategy'],
    ['compare', 'measure against', 'evaluate'],
    [
      { en: 'We benchmark our prices against three competitors each quarter.', kr: '매 분기 세 곳의 경쟁사와 가격을 비교합니다.' },
      { en: 'Let\'s benchmark our delivery performance against industry standards.', kr: '납기 성과를 업계 기준과 비교해 봅시다.' },
    ]
  ],
  ['investigate', 'investigate', 'verb', '조사하다', 'to carry out a systematic inquiry to discover facts', 'basic',
    ['quality', 'analysis'],
    ['look into', 'examine', 'probe'],
    [
      { en: 'We are investigating the cause of the shipment delay.', kr: '선적 지연의 원인을 조사 중입니다.' },
      { en: 'The quality team investigated every returned unit.', kr: '품질팀이 반환된 모든 제품을 조사했습니다.' },
    ]
  ],

  // ── COLLABORATION ─────────────────────────────────────────────────────────
  ['collaborate', 'collaborate', 'verb', '협력하다, 공동 작업하다', 'to work together with someone to produce or achieve something', 'basic',
    ['teamwork', 'relationship'],
    ['cooperate', 'work together', 'partner'],
    [
      { en: 'We collaborated with the factory to redesign the packaging.', kr: '공장과 협력하여 포장을 재설계했습니다.' },
      { en: 'Both teams need to collaborate more closely going forward.', kr: '앞으로 두 팀이 더 긴밀히 협력해야 합니다.' },
    ]
  ],
  ['facilitate', 'facilitate', 'verb', '촉진하다, 원활하게 하다', 'to make an action or process easier or smoother', 'intermediate',
    ['management', 'communication'],
    ['enable', 'assist', 'help along'],
    [
      { en: 'We are here to facilitate the communication between buyer and seller.', kr: '저희는 구매자와 판매자 간의 소통을 원활하게 하기 위해 있습니다.' },
      { en: 'The new system will facilitate faster approval workflows.', kr: '새 시스템이 더 빠른 승인 프로세스를 원활하게 할 것입니다.' },
    ]
  ],
  ['liaise', 'liaise', 'verb', '연락하다, 연계하다', 'to communicate and cooperate with someone to exchange information', 'advanced',
    ['communication', 'operations'],
    ['coordinate', 'communicate with', 'connect'],
    [
      { en: 'Please liaise with the freight forwarder to confirm the booking.', kr: '포워더와 연락하여 예약을 확인해 주세요.' },
      { en: 'She liaises between the client and the production team.', kr: '그녀는 고객과 생산팀 사이를 연계합니다.' },
    ]
  ],
  ['delegate', 'delegate', 'verb', '위임하다', 'to entrust a task or responsibility to another person', 'intermediate',
    ['management', 'leadership'],
    ['assign', 'hand over', 'entrust'],
    [
      { en: 'He delegated the supplier audit to the quality manager.', kr: '그는 공급사 감사를 품질 관리자에게 위임했습니다.' },
      { en: 'Good managers know when to delegate and when to handle tasks themselves.', kr: '훌륭한 관리자는 언제 위임하고 언제 직접 처리해야 하는지 압니다.' },
    ]
  ],
  ['engage', 'engage', 'verb', '참여하다, 관여하다', 'to participate in or become involved in something', 'intermediate',
    ['relationship', 'communication'],
    ['involve', 'participate', 'connect'],
    [
      { en: 'We need to engage the client early in the development process.', kr: '개발 초기 단계에서 고객을 참여시켜야 합니다.' },
      { en: 'The marketing team engages with customers through social media.', kr: '마케팅팀은 소셜 미디어를 통해 고객과 소통합니다.' },
    ]
  ],

  // ── FINANCE / BUSINESS ────────────────────────────────────────────────────
  ['allocate', 'allocate', 'verb', '배분하다', 'to distribute resources or duties for a particular purpose', 'intermediate',
    ['finance', 'management'],
    ['assign', 'distribute', 'designate'],
    [
      { en: 'We have allocated a larger budget for quality control this year.', kr: '올해 품질 관리에 더 많은 예산을 배분했습니다.' },
      { en: 'Resources are allocated based on project priority.', kr: '프로젝트 우선순위에 따라 리소스가 배분됩니다.' },
    ]
  ],
  ['reconcile', 'reconcile', 'verb', '조정하다, 맞추다', 'to make one account or record consistent with another', 'advanced',
    ['finance', 'documents'],
    ['balance', 'match up', 'settle'],
    [
      { en: 'Please reconcile the invoice with the purchase order.', kr: '송장과 발주서를 대조해 맞춰주세요.' },
      { en: 'The accounts team reconciled the figures by end of month.', kr: '회계팀이 월말까지 수치를 조정했습니다.' },
    ]
  ],
  ['reimburse', 'reimburse', 'verb', '환급하다, 상환하다', 'to pay back money that someone has spent', 'intermediate',
    ['finance', 'operations'],
    ['refund', 'pay back', 'compensate'],
    [
      { en: 'We will reimburse all travel expenses within 30 days.', kr: '모든 출장 경비를 30일 이내에 환급해 드립니다.' },
      { en: 'The client agreed to reimburse the additional shipping cost.', kr: '고객이 추가 운송비를 상환하기로 합의했습니다.' },
    ]
  ],
  ['invoice', 'invoice', 'verb', '청구하다, 송장을 발행하다', 'to send a bill to a customer for goods or services provided', 'basic',
    ['finance', 'documents'],
    ['bill', 'charge', 'issue a statement'],
    [
      { en: 'Please invoice us for the total amount including shipping.', kr: '운송비를 포함한 총액으로 청구해 주세요.' },
      { en: 'The supplier invoiced us two days after shipment.', kr: '공급사는 선적 이틀 후에 송장을 발행했습니다.' },
    ]
  ],
  ['subsidize', 'subsidize', 'verb', '보조금을 지원하다', 'to support financially, especially with money from a government or fund', 'advanced',
    ['finance', 'strategy'],
    ['fund', 'support', 'sponsor'],
    [
      { en: 'The government subsidizes certain green technology imports.', kr: '정부는 일부 친환경 기술 수입품에 보조금을 지원합니다.' },
      { en: 'We cannot subsidize the shipping cost on small orders.', kr: '소량 주문에는 운송비를 지원할 수 없습니다.' },
    ]
  ],

  // ── QUALITY & COMPLIANCE ──────────────────────────────────────────────────
  ['verify', 'verify', 'verb', '확인하다, 검증하다', 'to confirm the truth, accuracy, or validity of something', 'basic',
    ['quality', 'documents'],
    ['confirm', 'check', 'validate'],
    [
      { en: 'Please verify the shipment details before signing off.', kr: '서명하기 전에 선적 세부 정보를 확인해 주세요.' },
      { en: 'The lab verified the product meets all safety standards.', kr: '실험실은 제품이 모든 안전 기준을 충족함을 검증했습니다.' },
    ]
  ],
  ['validate', 'validate', 'verb', '유효성을 검증하다', 'to demonstrate or confirm the accuracy, legitimacy, or quality of something', 'intermediate',
    ['quality', 'compliance'],
    ['confirm', 'verify', 'certify'],
    [
      { en: 'We need to validate the test results before approving mass production.', kr: '양산 승인 전에 테스트 결과를 검증해야 합니다.' },
      { en: 'The certification body will validate our quality management system.', kr: '인증 기관이 당사의 품질 관리 시스템을 검증할 예정입니다.' },
    ]
  ],
  ['comply', 'comply', 'verb', '준수하다', 'to act in accordance with a rule, regulation, or request', 'intermediate',
    ['compliance', 'legal'],
    ['adhere to', 'conform', 'follow'],
    [
      { en: 'All exports must comply with international safety regulations.', kr: '모든 수출품은 국제 안전 규정을 준수해야 합니다.' },
      { en: 'The factory failed to comply with the audit requirements.', kr: '공장은 감사 요구사항을 준수하지 못했습니다.' },
    ]
  ],
  ['audit', 'audit', 'verb', '감사하다', 'to conduct an official examination of accounts or operations', 'intermediate',
    ['quality', 'compliance'],
    ['inspect', 'review', 'examine'],
    [
      { en: 'We audit our key suppliers once a year.', kr: '저희는 주요 공급사를 연 1회 감사합니다.' },
      { en: 'The factory was audited by a third-party certification body.', kr: '공장은 제3자 인증 기관의 감사를 받았습니다.' },
    ]
  ],
  ['inspect', 'inspect', 'verb', '검사하다', 'to look at something carefully to check its condition or quality', 'basic',
    ['quality', 'operations'],
    ['examine', 'check', 'review'],
    [
      { en: 'We inspect every batch before it leaves the factory.', kr: '공장 출하 전에 모든 배치를 검사합니다.' },
      { en: 'Can you inspect the goods and confirm the quantity?', kr: '상품을 검사하고 수량을 확인해 주시겠어요?' },
    ]
  ],

  // ── GROWTH & STRATEGY ─────────────────────────────────────────────────────
  ['diversify', 'diversify', 'verb', '다양화하다', 'to make something more varied; to expand into new products or markets', 'advanced',
    ['strategy', 'market'],
    ['expand', 'broaden', 'vary'],
    [
      { en: 'We are looking to diversify our supplier base to reduce risk.', kr: '위험 감소를 위해 공급사 기반을 다양화하려고 합니다.' },
      { en: 'The company diversified into lighting accessories last year.', kr: '회사는 작년에 조명 액세서리 분야로 사업을 다각화했습니다.' },
    ]
  ],
  ['optimize', 'optimize', 'verb', '최적화하다', 'to make the best or most effective use of a resource or situation', 'intermediate',
    ['strategy', 'operations'],
    ['improve', 'maximize', 'streamline'],
    [
      { en: 'We are working to optimize the shipping route to cut costs.', kr: '비용 절감을 위해 운송 경로를 최적화하고 있습니다.' },
      { en: 'This tool helps us optimize inventory levels across all warehouses.', kr: '이 도구는 모든 창고의 재고 수준을 최적화하는 데 도움이 됩니다.' },
    ]
  ],
  ['penetrate', 'penetrate', 'verb', '진입하다, 침투하다', 'to enter and gain a share of a market or territory', 'advanced',
    ['strategy', 'sales'],
    ['enter', 'break into', 'access'],
    [
      { en: 'We aim to penetrate the Southeast Asian market within two years.', kr: '2년 내에 동남아시아 시장에 진입하는 것을 목표로 합니다.' },
      { en: 'It\'s difficult to penetrate a market dominated by one or two players.', kr: '한두 업체가 지배하는 시장에 진입하기는 어렵습니다.' },
    ]
  ],
  ['scale', 'scale', 'verb', '확장하다', 'to increase or grow proportionally; to expand operations', 'intermediate',
    ['strategy', 'manufacturing'],
    ['expand', 'grow', 'increase'],
    [
      { en: 'We need to scale our production to meet the rising demand.', kr: '증가하는 수요를 충족하기 위해 생산을 확장해야 합니다.' },
      { en: 'The startup scaled quickly after securing a major retail contract.', kr: '스타트업은 주요 소매 계약을 체결한 후 빠르게 확장했습니다.' },
    ]
  ],
  ['expand', 'expand', 'verb', '확대하다', 'to become or make larger in size, number, or scope', 'basic',
    ['strategy', 'growth'],
    ['grow', 'extend', 'broaden'],
    [
      { en: 'We plan to expand our product range next year.', kr: '내년에 제품 라인을 확장할 계획입니다.' },
      { en: 'The company is expanding into new markets in Europe.', kr: '회사는 유럽 내 새로운 시장으로 확장하고 있습니다.' },
    ]
  ],

  // ── PROBLEM SOLVING ───────────────────────────────────────────────────────
  ['troubleshoot', 'troubleshoot', 'verb', '문제를 해결하다', 'to identify and fix problems in a system or process', 'intermediate',
    ['quality', 'operations'],
    ['diagnose', 'fix', 'resolve'],
    [
      { en: 'The engineer will troubleshoot the production line issue today.', kr: '엔지니어가 오늘 생산 라인 문제를 해결할 예정입니다.' },
      { en: 'We troubleshoot every complaint before escalating to management.', kr: '저희는 경영진에 보고하기 전에 모든 불만을 먼저 해결합니다.' },
    ]
  ],
  ['resolve', 'resolve', 'verb', '해결하다', 'to find a solution to a problem or dispute', 'basic',
    ['operations', 'support'],
    ['solve', 'settle', 'fix'],
    [
      { en: 'We resolved the shipping issue within 24 hours.', kr: '선적 문제를 24시간 내에 해결했습니다.' },
      { en: 'Both parties worked together to resolve the pricing dispute.', kr: '양 당사자는 가격 분쟁을 해결하기 위해 협력했습니다.' },
    ]
  ],
  ['mitigate', 'mitigate', 'verb', '완화하다, 줄이다', 'to reduce the severity, seriousness, or painfulness of something', 'advanced',
    ['risk', 'strategy'],
    ['reduce', 'minimize', 'lessen'],
    [
      { en: 'We have put measures in place to mitigate the supply chain risk.', kr: '공급망 위험을 완화하기 위한 조치를 마련했습니다.' },
      { en: 'Dual-sourcing helps mitigate the impact of a single supplier failure.', kr: '이중 공급 방식은 단일 공급사 실패의 영향을 완화하는 데 도움이 됩니다.' },
    ]
  ],
  ['diagnose', 'diagnose', 'verb', '진단하다', 'to identify the cause of a problem through analysis', 'intermediate',
    ['quality', 'analysis'],
    ['identify', 'pinpoint', 'determine'],
    [
      { en: 'We diagnosed the defect as a tooling problem at the factory.', kr: '불량이 공장의 금형 문제에서 비롯된 것으로 진단했습니다.' },
      { en: 'The engineer diagnosed the power supply issue immediately.', kr: '엔지니어가 전원 공급 문제를 즉시 진단했습니다.' },
    ]
  ],
  ['anticipate', 'anticipate', 'verb', '예상하다, 대비하다', 'to expect and prepare for something before it happens', 'intermediate',
    ['planning', 'risk'],
    ['expect', 'foresee', 'prepare for'],
    [
      { en: 'We anticipate a 20% increase in demand during peak season.', kr: '성수기에 수요가 20% 증가할 것으로 예상합니다.' },
      { en: 'The team anticipated the delay and ordered extra buffer stock.', kr: '팀은 지연을 예상하고 추가 버퍼 재고를 주문했습니다.' },
    ]
  ],

  // ── BUSINESS NOUNS ────────────────────────────────────────────────────────
  ['momentum', 'momentum', 'noun', '모멘텀, 추진력', 'the impetus and driving force gained by something developing or progressing', 'intermediate',
    ['strategy', 'sales'],
    ['impetus', 'drive', 'traction'],
    [
      { en: 'We need to maintain the momentum from last quarter\'s strong results.', kr: '지난 분기의 좋은 실적에서 얻은 모멘텀을 유지해야 합니다.' },
      { en: 'The new product launch built strong momentum in the market.', kr: '신제품 출시로 시장에서 강력한 모멘텀이 형성되었습니다.' },
    ]
  ],
  ['bottleneck', 'bottleneck', 'noun', '병목, 애로사항', 'a point of congestion in a system or process that slows overall flow', 'intermediate',
    ['operations', 'logistics'],
    ['constraint', 'blockage', 'obstacle'],
    [
      { en: 'The customs process is the main bottleneck in our supply chain.', kr: '통관 절차가 우리 공급망의 주요 병목입니다.' },
      { en: 'We identified a bottleneck at the packaging stage.', kr: '포장 단계에서 병목이 발생한 것을 파악했습니다.' },
    ]
  ],
  ['turnaround', 'turnaround', 'noun', '소요 시간, 전환', 'the time taken to complete a process; or a change from worse to better', 'intermediate',
    ['logistics', 'operations'],
    ['lead time', 'response time', 'recovery'],
    [
      { en: 'Our standard turnaround time for quotations is 24 hours.', kr: '견적서의 표준 처리 시간은 24시간입니다.' },
      { en: 'The factory achieved a remarkable turnaround in quality.', kr: '공장은 품질 면에서 눈에 띄는 전환을 달성했습니다.' },
    ]
  ],
  ['benchmark', 'benchmark', 'noun', '기준, 벤치마크', 'a standard or point of reference for evaluating performance', 'intermediate',
    ['analysis', 'quality'],
    ['standard', 'reference point', 'yardstick'],
    [
      { en: 'The 98% on-time delivery rate is our internal benchmark.', kr: '납기 준수율 98%가 우리의 내부 기준입니다.' },
      { en: 'Set a realistic benchmark before launching the new program.', kr: '새 프로그램을 시작하기 전에 현실적인 기준을 설정하세요.' },
    ]
  ],
  ['stakeholder', 'stakeholder', 'noun', '이해관계자', 'a person or group that has an interest in a company or project', 'basic',
    ['management', 'communication'],
    ['participant', 'interested party', 'shareholder'],
    [
      { en: 'Keep all stakeholders informed of the project timeline.', kr: '모든 이해관계자에게 프로젝트 일정을 공유하세요.' },
      { en: 'The stakeholder meeting is scheduled for Thursday morning.', kr: '이해관계자 회의는 목요일 오전으로 예정되어 있습니다.' },
    ]
  ],
  ['contingency', 'contingency', 'noun', '비상 대책, 예비 계획', 'a plan or provision for an unexpected event', 'advanced',
    ['planning', 'risk'],
    ['backup plan', 'safeguard', 'fallback'],
    [
      { en: 'We always build a contingency into the project budget.', kr: '저희는 항상 프로젝트 예산에 비상 대책을 포함합니다.' },
      { en: 'What is the contingency if the supplier cannot deliver on time?', kr: '공급사가 제때 납품하지 못할 경우 비상 대책은 무엇인가요?' },
    ]
  ],
  ['liability', 'liability', 'noun', '책임, 부채', 'legal responsibility for something; or a financial obligation', 'intermediate',
    ['legal', 'finance'],
    ['responsibility', 'obligation', 'debt'],
    [
      { en: 'The contract clearly states who holds liability for transit damage.', kr: '계약서에는 운송 중 손상에 대한 책임 소재가 명확히 명시되어 있습니다.' },
      { en: 'We need to limit our liability in the event of a supply failure.', kr: '공급 실패 시 책임을 제한할 필요가 있습니다.' },
    ]
  ],
  ['consortium', 'consortium', 'noun', '컨소시엄, 협회', 'an association of two or more parties working toward a common goal', 'advanced',
    ['strategy', 'partnership'],
    ['alliance', 'joint venture', 'partnership'],
    [
      { en: 'They formed a consortium to bid on the government contract.', kr: '정부 계약 입찰을 위해 컨소시엄을 구성했습니다.' },
      { en: 'The industry consortium agreed on a new quality standard.', kr: '업계 컨소시엄이 새로운 품질 기준에 합의했습니다.' },
    ]
  ],
  ['leverage', 'leverage', 'noun', '레버리지, 영향력', 'the power to influence a situation or person; or using borrowed money', 'advanced',
    ['negotiation', 'finance'],
    ['influence', 'power', 'advantage'],
    [
      { en: 'Our order volume gives us significant leverage in price negotiations.', kr: '주문 물량이 가격 협상에서 상당한 영향력을 줍니다.' },
      { en: 'We use financial leverage to fund new stock purchases.', kr: '새 재고 매입 자금을 조달하기 위해 재무 레버리지를 활용합니다.' },
    ]
  ],
  ['pipeline', 'pipeline', 'noun', '파이프라인, 준비 중인 거래', 'a series of prospective deals or projects in development', 'intermediate',
    ['sales', 'strategy'],
    ['prospect list', 'deal flow', 'project queue'],
    [
      { en: 'We have three new projects in the pipeline for Q4.', kr: '4분기에 파이프라인에 새 프로젝트 세 건이 있습니다.' },
      { en: 'The sales team reported a strong pipeline heading into the new year.', kr: '영업팀은 새해를 앞두고 강력한 파이프라인을 보고했습니다.' },
    ]
  ],

  // ── KEY ADJECTIVES ────────────────────────────────────────────────────────
  ['viable', 'viable', 'adjective', '실현 가능한', 'capable of working successfully; feasible', 'intermediate',
    ['strategy', 'decision'],
    ['feasible', 'practical', 'workable'],
    [
      { en: 'Is air freight a viable option given the tight deadline?', kr: '촉박한 마감을 고려할 때 항공 운송이 실현 가능한 옵션인가요?' },
      { en: 'We need to find a viable alternative to the current supplier.', kr: '현재 공급사를 대체할 실현 가능한 대안을 찾아야 합니다.' },
    ]
  ],
  ['transparent', 'transparent', 'adjective', '투명한', 'open, frank, and honest; allowing information to be seen clearly', 'basic',
    ['communication', 'management'],
    ['open', 'clear', 'honest'],
    [
      { en: 'We appreciate the supplier being transparent about the delay.', kr: '공급사가 지연에 대해 솔직하게 알려준 것에 감사합니다.' },
      { en: 'Our pricing structure is fully transparent to all clients.', kr: '당사의 가격 구조는 모든 고객에게 완전히 공개되어 있습니다.' },
    ]
  ],
  ['proactive', 'proactive', 'adjective', '선제적인, 주도적인', 'taking action in anticipation of future problems rather than reacting', 'intermediate',
    ['management', 'communication'],
    ['forward-thinking', 'preventive', 'initiative-taking'],
    [
      { en: 'Please be proactive in flagging any delays as early as possible.', kr: '가능한 한 일찍 지연 사항을 선제적으로 알려주세요.' },
      { en: 'A proactive approach to quality control reduces complaints significantly.', kr: '품질 관리에 선제적으로 접근하면 불만이 크게 줄어듭니다.' },
    ]
  ],
  ['scalable', 'scalable', 'adjective', '확장 가능한', 'able to be changed in size or scale; can grow with demand', 'advanced',
    ['strategy', 'operations'],
    ['flexible', 'expandable', 'adaptable'],
    [
      { en: 'We need a scalable solution that can handle 10x growth.', kr: '10배 성장을 감당할 수 있는 확장 가능한 솔루션이 필요합니다.' },
      { en: 'The current system is not scalable enough for our plans.', kr: '현재 시스템은 우리의 계획에 맞게 충분히 확장 가능하지 않습니다.' },
    ]
  ],
  ['stringent', 'stringent', 'adjective', '엄격한, 까다로운', 'very strict or severe; applied or enforced rigorously', 'advanced',
    ['quality', 'compliance'],
    ['strict', 'rigorous', 'demanding'],
    [
      { en: 'The European market has more stringent safety requirements.', kr: '유럽 시장은 더 엄격한 안전 요건을 갖추고 있습니다.' },
      { en: 'Our clients have stringent quality standards we must meet.', kr: '당사 고객들은 우리가 충족해야 할 엄격한 품질 기준을 가지고 있습니다.' },
    ]
  ],
  ['comprehensive', 'comprehensive', 'adjective', '포괄적인', 'including or dealing with all or nearly all aspects of something', 'intermediate',
    ['documents', 'analysis'],
    ['thorough', 'complete', 'all-inclusive'],
    [
      { en: 'Please prepare a comprehensive report on the supplier\'s performance.', kr: '공급사 성과에 대한 포괄적인 보고서를 준비해 주세요.' },
      { en: 'We offer a comprehensive warranty on all products.', kr: '모든 제품에 포괄적인 보증을 제공합니다.' },
    ]
  ],
  ['substantial', 'substantial', 'adjective', '상당한', 'of considerable importance, size, or worth', 'intermediate',
    ['finance', 'analysis'],
    ['significant', 'considerable', 'notable'],
    [
      { en: 'There has been a substantial increase in raw material costs.', kr: '원자재 비용이 상당히 증가했습니다.' },
      { en: 'We made a substantial investment in new inspection equipment.', kr: '새 검사 장비에 상당한 투자를 했습니다.' },
    ]
  ],
  ['imminent', 'imminent', 'adjective', '임박한', 'about to happen very soon', 'advanced',
    ['planning', 'risk'],
    ['approaching', 'upcoming', 'near'],
    [
      { en: 'A price increase is imminent due to rising raw material costs.', kr: '원자재 비용 상승으로 가격 인상이 임박했습니다.' },
      { en: 'We need to act quickly as the deadline is imminent.', kr: '마감이 임박했으므로 빠르게 행동해야 합니다.' },
    ]
  ],
  ['tangible', 'tangible', 'adjective', '실질적인, 유형의', 'clear and definite; real and not imaginary; able to be touched', 'advanced',
    ['analysis', 'strategy'],
    ['concrete', 'measurable', 'real'],
    [
      { en: 'We need tangible evidence that the defect rate has improved.', kr: '불량률이 개선되었다는 실질적인 증거가 필요합니다.' },
      { en: 'The partnership has delivered tangible benefits for both sides.', kr: '파트너십이 양측 모두에게 실질적인 이익을 가져다주었습니다.' },
    ]
  ],
  ['feasible', 'feasible', 'adjective', '실행 가능한', 'possible and practical to do easily or conveniently', 'basic',
    ['planning', 'decision'],
    ['possible', 'achievable', 'workable'],
    [
      { en: 'Is it feasible to deliver within 21 days?', kr: '21일 이내 납품이 실행 가능한가요?' },
      { en: 'Let\'s check if the new timeline is feasible before committing.', kr: '약속하기 전에 새 일정이 실행 가능한지 확인합시다.' },
    ]
  ],

  // ── COMMUNICATION & MEETINGS ─────────────────────────────────────────────
  ['acknowledge', 'acknowledge', 'verb', '인정하다, 확인하다', 'to accept or confirm the receipt of something; to recognize something', 'basic',
    ['communication', 'email'],
    ['confirm', 'recognize', 'accept'],
    [
      { en: 'Please acknowledge receipt of this email.', kr: '이 이메일 수신을 확인해주세요.' },
      { en: 'We acknowledge the delay and sincerely apologize.', kr: '지연을 인정하며 진심으로 사과드립니다.' },
    ]
  ],
  ['propose', 'propose', 'verb', '제안하다', 'to put forward a plan or idea for others to consider', 'basic',
    ['communication', 'meeting'],
    ['suggest', 'recommend', 'put forward'],
    [
      { en: 'I would like to propose a new payment structure.', kr: '새로운 결제 구조를 제안하고 싶습니다.' },
      { en: 'The client proposed extending the contract by six months.', kr: '고객이 계약을 6개월 연장하자고 제안했습니다.' },
    ]
  ],
  ['summarize', 'summarize', 'verb', '요약하다', 'to give a brief statement of the main points of something', 'basic',
    ['communication', 'meeting'],
    ['recap', 'outline', 'condense'],
    [
      { en: 'Could you summarize the key takeaways from the meeting?', kr: '회의의 주요 내용을 요약해주시겠어요?' },
      { en: 'To summarize, we need to reduce lead time and improve packaging.', kr: '요약하면, 납기를 줄이고 포장을 개선해야 합니다.' },
    ]
  ],
  ['revise', 'revise', 'verb', '수정하다', 'to reconsider and alter something in light of new information', 'basic',
    ['documents', 'planning'],
    ['update', 'amend', 'modify'],
    [
      { en: 'Please revise the quotation to reflect the new specifications.', kr: '새로운 사양을 반영하여 견적서를 수정해주세요.' },
      { en: 'We need to revise the delivery schedule due to a factory shutdown.', kr: '공장 가동 중단으로 납기 일정을 수정해야 합니다.' },
    ]
  ],
  ['confirm', 'confirm', 'verb', '확인하다, 확정하다', 'to establish the truth or correctness of something', 'basic',
    ['communication', 'email'],
    ['verify', 'affirm', 'validate'],
    [
      { en: 'Could you confirm the order details by end of today?', kr: '오늘 중으로 주문 세부 내용을 확인해주실 수 있나요?' },
      { en: 'I can confirm that the shipment left the factory this morning.', kr: '오늘 아침 공장에서 선적이 출발했음을 확인드립니다.' },
    ]
  ],
  ['outline', 'outline', 'verb', '개요를 설명하다', 'to give a summary of the main facts or points of something', 'basic',
    ['communication', 'presentation'],
    ['summarize', 'sketch', 'describe'],
    [
      { en: 'Let me outline the main steps in our new approval process.', kr: '새로운 승인 프로세스의 주요 단계를 개요로 설명해드리겠습니다.' },
      { en: 'The proposal outlines three key benefits of switching suppliers.', kr: '제안서는 공급사를 변경할 경우의 세 가지 주요 이점을 설명합니다.' },
    ]
  ],
  ['notify', 'notify', 'verb', '통보하다, 알리다', 'to inform someone of something in an official way', 'basic',
    ['communication', 'email'],
    ['inform', 'advise', 'alert'],
    [
      { en: 'Please notify us immediately if there are any changes to the schedule.', kr: '일정에 변경이 생기면 즉시 알려주세요.' },
      { en: 'We have notified all suppliers of the new quality requirements.', kr: '모든 공급사에 새로운 품질 요건을 통보했습니다.' },
    ]
  ],

  // ── SALES & BUSINESS ─────────────────────────────────────────────────────
  ['secure', 'secure', 'verb', '확보하다, 따내다', 'to obtain or achieve something, often with effort', 'intermediate',
    ['sales', 'negotiation'],
    ['obtain', 'win', 'land'],
    [
      { en: 'We secured a new contract with a major retailer.', kr: '대형 소매업체와 새 계약을 확보했습니다.' },
      { en: 'The team worked hard to secure the deal before year-end.', kr: '팀이 연말 전에 거래를 성사시키기 위해 열심히 노력했습니다.' },
    ]
  ],
  ['acquire', 'acquire', 'verb', '획득하다, 인수하다', 'to gain or obtain something, or to take over another company', 'intermediate',
    ['business', 'strategy'],
    ['obtain', 'gain', 'procure'],
    [
      { en: 'The company acquired a new distribution partner in Korea.', kr: '회사가 한국에 새로운 유통 파트너를 인수했습니다.' },
      { en: 'We need to acquire more market data before launching.', kr: '출시 전에 더 많은 시장 데이터를 확보해야 합니다.' },
    ]
  ],
  ['generate', 'generate', 'verb', '창출하다, 발생시키다', 'to produce or cause something to come into existence', 'basic',
    ['sales', 'finance'],
    ['produce', 'create', 'yield'],
    [
      { en: 'The new product line generated significant revenue in Q3.', kr: '신제품 라인이 3분기에 상당한 수익을 창출했습니다.' },
      { en: 'We need to generate more leads in the North American market.', kr: '북미 시장에서 더 많은 잠재 고객을 발굴해야 합니다.' },
    ]
  ],
  ['retain', 'retain', 'verb', '유지하다, 보유하다', 'to keep something or continue to have something', 'intermediate',
    ['sales', 'relationship'],
    ['keep', 'maintain', 'hold onto'],
    [
      { en: 'Our goal is to retain at least 90% of our key accounts.', kr: '목표는 주요 거래처의 최소 90%를 유지하는 것입니다.' },
      { en: 'It costs more to acquire a new client than to retain an existing one.', kr: '신규 고객 확보보다 기존 고객을 유지하는 데 더 적은 비용이 듭니다.' },
    ]
  ],
  ['pitch', 'pitch', 'verb', '제안하다, 영업하다', 'to present an idea or product persuasively to a potential buyer', 'intermediate',
    ['sales', 'presentation'],
    ['present', 'propose', 'sell'],
    [
      { en: 'We pitched our product to five major buyers at the trade show.', kr: '전시회에서 5개 주요 바이어에게 제품을 제안했습니다.' },
      { en: 'She pitched the new service idea to the board with great confidence.', kr: '그녀는 새 서비스 아이디어를 이사회에 자신감 있게 제안했습니다.' },
    ]
  ],
  ['pursue', 'pursue', 'verb', '추구하다, 진행하다', 'to follow or continue with a course of action or goal', 'intermediate',
    ['strategy', 'sales'],
    ['follow up', 'chase', 'work toward'],
    [
      { en: 'We plan to pursue the Southeast Asian market aggressively next year.', kr: '내년에 동남아 시장을 적극적으로 공략할 계획입니다.' },
      { en: 'The account team is pursuing three major prospects this quarter.', kr: '계정 팀이 이번 분기에 세 개의 주요 잠재 고객을 추진 중입니다.' },
    ]
  ],

  // ── LOGISTICS & OPERATIONS ───────────────────────────────────────────────
  ['dispatch', 'dispatch', 'verb', '발송하다, 출하하다', 'to send off goods or a person to a destination', 'intermediate',
    ['logistics', 'operations'],
    ['ship', 'send', 'consign'],
    [
      { en: 'The goods were dispatched yesterday and should arrive by Thursday.', kr: '물품은 어제 발송되었으며 목요일까지 도착할 예정입니다.' },
      { en: 'We will dispatch the replacement units as soon as they are ready.', kr: '교체품이 준비되는 즉시 발송하겠습니다.' },
    ]
  ],
  ['expedite', 'expedite', 'verb', '신속하게 처리하다', 'to make an action or process happen sooner or faster', 'intermediate',
    ['logistics', 'operations'],
    ['speed up', 'fast-track', 'rush'],
    [
      { en: 'Can you expedite the customs clearance for this shipment?', kr: '이 선적의 통관을 신속하게 처리해주실 수 있나요?' },
      { en: 'We need to expedite the order to meet the client\'s tight deadline.', kr: '고객의 촉박한 마감에 맞추기 위해 주문을 신속 처리해야 합니다.' },
    ]
  ],
  ['consolidate', 'consolidate', 'verb', '통합하다, 합치다', 'to combine multiple things into a single more effective whole', 'intermediate',
    ['logistics', 'operations'],
    ['combine', 'merge', 'integrate'],
    [
      { en: 'We consolidated three separate shipments to reduce freight costs.', kr: '운임 절감을 위해 세 개의 별도 선적을 통합했습니다.' },
      { en: 'The company plans to consolidate its warehouses from five to two.', kr: '회사는 창고를 5개에서 2개로 통합할 계획입니다.' },
    ]
  ],
  ['procure', 'procure', 'verb', '조달하다', 'to obtain something, especially with care or effort', 'intermediate',
    ['operations', 'supply'],
    ['source', 'obtain', 'acquire'],
    [
      { en: 'We need to procure raw materials at a competitive price.', kr: '경쟁력 있는 가격으로 원자재를 조달해야 합니다.' },
      { en: 'The procurement team managed to procure the parts on short notice.', kr: '조달팀이 촉박한 통보에도 불구하고 부품을 조달하는 데 성공했습니다.' },
    ]
  ],
  ['replenish', 'replenish', 'verb', '보충하다', 'to fill something up again that had been partially depleted', 'intermediate',
    ['inventory', 'operations'],
    ['restock', 'refill', 'top up'],
    [
      { en: 'We need to replenish safety stock before the peak season starts.', kr: '성수기가 시작되기 전에 안전 재고를 보충해야 합니다.' },
      { en: 'The warehouse replenished the shelves overnight.', kr: '창고는 밤새 선반을 보충했습니다.' },
    ]
  ],
  ['allocate', 'allocate', 'verb', '할당하다, 배분하다', 'to give particular things to particular people or for a particular purpose', 'intermediate',
    ['operations', 'planning'],
    ['assign', 'distribute', 'apportion'],
    [
      { en: 'We need to allocate more production capacity to the top-selling models.', kr: '가장 잘 팔리는 모델에 생산 능력을 더 배분해야 합니다.' },
      { en: 'The budget has been allocated across three departments.', kr: '예산이 세 부서에 걸쳐 배분되었습니다.' },
    ]
  ],

  // ── QUALITY & IMPROVEMENT ─────────────────────────────────────────────────
  ['rectify', 'rectify', 'verb', '시정하다, 바로잡다', 'to put something right; to correct a mistake or fault', 'intermediate',
    ['quality', 'operations'],
    ['correct', 'fix', 'remedy'],
    [
      { en: 'We have taken steps to rectify the defect found in the last batch.', kr: '지난 배치에서 발견된 결함을 시정하기 위한 조치를 취했습니다.' },
      { en: 'Please let us know how you plan to rectify this situation.', kr: '이 상황을 어떻게 시정할 계획인지 알려주세요.' },
    ]
  ],
  ['remedy', 'remedy', 'verb', '치료하다, 해결하다', 'to solve a problem or improve an unsatisfactory situation', 'intermediate',
    ['quality', 'support'],
    ['fix', 'resolve', 'correct'],
    [
      { en: 'What steps are you taking to remedy the quality issue?', kr: '품질 문제를 해결하기 위해 어떤 조치를 취하고 있나요?' },
      { en: 'The engineer identified a simple solution to remedy the design flaw.', kr: '엔지니어가 설계 결함을 해결할 간단한 방법을 찾아냈습니다.' },
    ]
  ],
  ['enhance', 'enhance', 'verb', '향상시키다', 'to increase or improve the quality, value, or extent of something', 'intermediate',
    ['strategy', 'quality'],
    ['improve', 'boost', 'upgrade'],
    [
      { en: 'We are constantly looking for ways to enhance our product quality.', kr: '제품 품질을 향상시킬 방법을 지속적으로 모색하고 있습니다.' },
      { en: 'The new software enhances the efficiency of our order management system.', kr: '새 소프트웨어가 주문 관리 시스템의 효율성을 향상시킵니다.' },
    ]
  ],
  ['streamline', 'streamline', 'verb', '효율화하다', 'to make a system or organization more efficient and effective', 'advanced',
    ['operations', 'strategy'],
    ['simplify', 'optimize', 'rationalize'],
    [
      { en: 'We have streamlined the approval process from 5 steps to 2.', kr: '승인 절차를 5단계에서 2단계로 효율화했습니다.' },
      { en: 'Streamlining our supply chain reduced lead times by 20%.', kr: '공급망을 효율화하여 납기가 20% 단축되었습니다.' },
    ]
  ],
  ['refine', 'refine', 'verb', '개선하다, 다듬다', 'to improve something by making small changes', 'intermediate',
    ['quality', 'strategy'],
    ['improve', 'polish', 'perfect'],
    [
      { en: 'We refined the proposal based on the client\'s feedback.', kr: '고객의 피드백을 바탕으로 제안서를 개선했습니다.' },
      { en: 'The team spent two weeks refining the manufacturing process.', kr: '팀이 2주에 걸쳐 제조 공정을 개선했습니다.' },
    ]
  ],

  // ── KEY BUSINESS NOUNS (추가) ─────────────────────────────────────────────
  ['turnaround', 'turnaround', 'noun', '전환, 처리 시간', 'the time needed to do a job; or a significant improvement from bad to good', 'intermediate',
    ['logistics', 'operations'],
    ['lead time', 'response time', 'recovery'],
    [
      { en: 'Our standard turnaround time for quotations is 24 hours.', kr: '견적서의 표준 처리 시간은 24시간입니다.' },
      { en: 'The factory achieved a remarkable turnaround in quality this year.', kr: '공장은 올해 품질 면에서 놀라운 전환을 달성했습니다.' },
    ]
  ],
  ['benchmark', 'benchmark', 'noun', '기준점', 'a standard against which something can be measured or assessed', 'intermediate',
    ['analysis', 'strategy'],
    ['standard', 'yardstick', 'reference point'],
    [
      { en: 'A 98% on-time delivery rate is our internal benchmark.', kr: '납기 준수율 98%가 내부 기준입니다.' },
      { en: 'Set a realistic benchmark before launching the new program.', kr: '새 프로그램 시작 전에 현실적인 기준을 설정하세요.' },
    ]
  ],
  ['overhead', 'overhead', 'noun', '간접비, 운영비', 'the ongoing expenses of running a business, not directly tied to production', 'intermediate',
    ['finance', 'operations'],
    ['running costs', 'fixed costs', 'operating expenses'],
    [
      { en: 'We need to reduce overhead costs to improve our profit margin.', kr: '이익률을 개선하기 위해 간접비를 줄여야 합니다.' },
      { en: 'Overhead accounts for nearly 30% of our total operating costs.', kr: '간접비가 총 운영비의 약 30%를 차지합니다.' },
    ]
  ],
  ['turnover', 'turnover', 'noun', '매출액, 이직률', 'total revenue generated; or the rate at which employees leave a company', 'intermediate',
    ['finance', 'hr'],
    ['revenue', 'sales volume', 'attrition'],
    [
      { en: 'Annual turnover reached $5 million for the first time.', kr: '연간 매출액이 처음으로 500만 달러에 달했습니다.' },
      { en: 'High staff turnover is causing disruption in the operations team.', kr: '높은 이직률로 인해 운영팀에 혼란이 생기고 있습니다.' },
    ]
  ],
  ['friction', 'friction', 'noun', '마찰, 갈등', 'conflict or disagreement between people; or resistance in a process', 'intermediate',
    ['relationship', 'operations'],
    ['conflict', 'tension', 'resistance'],
    [
      { en: 'There has been some friction between the two teams over responsibility.', kr: '두 팀 사이에 책임 문제로 약간의 마찰이 있었습니다.' },
      { en: 'Reducing friction in the checkout process improves customer conversion.', kr: '결제 과정의 마찰을 줄이면 고객 전환율이 개선됩니다.' },
    ]
  ],
  ['alignment', 'alignment', 'noun', '일치, 정렬', 'the state of being in agreement or having the same goals', 'intermediate',
    ['management', 'communication'],
    ['agreement', 'coordination', 'sync'],
    [
      { en: 'We need full alignment across all departments before proceeding.', kr: '진행하기 전에 모든 부서 간 완전한 합의가 필요합니다.' },
      { en: 'There is strong alignment between the two companies on pricing strategy.', kr: '두 회사 간 가격 전략에 대한 강한 합의가 있습니다.' },
    ]
  ],
  ['exposure', 'exposure', 'noun', '노출, 위험에의 취약성', 'the state of being exposed to something, especially risk or financial liability', 'advanced',
    ['finance', 'risk'],
    ['risk', 'vulnerability', 'liability'],
    [
      { en: 'We need to limit our currency exposure by hedging.', kr: '헤징을 통해 환율 노출을 제한해야 합니다.' },
      { en: 'The company has significant exposure to raw material price volatility.', kr: '회사는 원자재 가격 변동성에 상당한 위험 노출이 있습니다.' },
    ]
  ],
  ['threshold', 'threshold', 'noun', '임계값, 기준선', 'a level or point at which something begins or changes', 'advanced',
    ['analysis', 'quality'],
    ['limit', 'boundary', 'cutoff'],
    [
      { en: 'Orders above the threshold of 1,000 units receive a volume discount.', kr: '1,000개 이상의 주문은 대량 할인을 받습니다.' },
      { en: 'The defect rate exceeded the acceptable threshold of 0.5%.', kr: '불량률이 허용 임계값인 0.5%를 초과했습니다.' },
    ]
  ],
  ['trajectory', 'trajectory', 'noun', '궤도, 추세', 'the path or direction of something developing over time', 'advanced',
    ['strategy', 'analysis'],
    ['trend', 'path', 'direction'],
    [
      { en: 'The sales trajectory shows steady growth over the past three years.', kr: '판매 궤도는 지난 3년간 꾸준한 성장을 보여줍니다.' },
      { en: 'If we continue on this trajectory, we will miss the annual target.', kr: '이 추세로 계속 가면 연간 목표를 달성하지 못할 것입니다.' },
    ]
  ],
  ['leverage', 'leverage', 'noun', '영향력, 레버리지', 'power to achieve goals; or the use of borrowed money to invest', 'advanced',
    ['negotiation', 'finance'],
    ['influence', 'power', 'advantage'],
    [
      { en: 'Our large order volume gives us leverage in price negotiations.', kr: '대규모 주문 물량이 가격 협상에서 영향력을 줍니다.' },
      { en: 'They used financial leverage to fund the new inventory purchase.', kr: '그들은 새 재고 구매 자금 조달을 위해 금융 레버리지를 활용했습니다.' },
    ]
  ],

  // ── KEY ADVERBS & PHRASES ─────────────────────────────────────────────────
  ['promptly', 'promptly', 'adverb', '즉시, 신속하게', 'with little or no delay; immediately', 'basic',
    ['communication', 'email'],
    ['immediately', 'quickly', 'without delay'],
    [
      { en: 'Please respond to client inquiries promptly.', kr: '고객 문의에 신속하게 응답해 주세요.' },
      { en: 'All defects must be reported promptly to the quality team.', kr: '모든 불량은 품질팀에 즉시 보고해야 합니다.' },
    ]
  ],
  ['accordingly', 'accordingly', 'adverb', '그에 맞게, 따라서', 'in a way that is appropriate to the circumstances', 'intermediate',
    ['communication', 'formal'],
    ['consequently', 'therefore', 'in response'],
    [
      { en: 'Please adjust the delivery schedule accordingly.', kr: '그에 맞게 납기 일정을 조정해 주세요.' },
      { en: 'We have received your feedback and will act accordingly.', kr: '피드백을 받았으며 그에 맞게 조치하겠습니다.' },
    ]
  ],
  ['substantially', 'substantially', 'adverb', '상당히', 'to a great or significant extent', 'intermediate',
    ['analysis', 'communication'],
    ['significantly', 'considerably', 'greatly'],
    [
      { en: 'Costs have increased substantially over the past year.', kr: '지난 1년간 비용이 상당히 증가했습니다.' },
      { en: 'Quality has improved substantially since we changed the supplier.', kr: '공급사를 변경한 이후 품질이 상당히 개선되었습니다.' },
    ]
  ],
  ['tentatively', 'tentatively', 'adverb', '잠정적으로', 'not definitely or conclusively; provisionally', 'advanced',
    ['planning', 'communication'],
    ['provisionally', 'conditionally', 'subject to change'],
    [
      { en: 'We have tentatively scheduled the factory visit for June 10.', kr: '공장 방문을 잠정적으로 6월 10일로 예정했습니다.' },
      { en: 'The price is tentatively set at $4.50 pending final approval.', kr: '가격은 최종 승인 전까지 잠정적으로 $4.50으로 설정되어 있습니다.' },
    ]
  ],

  // ── CONTRACT & LEGAL ──────────────────────────────────────────────────────
  ['clause', 'clause', 'noun', '조항', 'a specific provision or condition in a legal document or contract', 'intermediate',
    ['legal', 'contract'],
    ['provision', 'term', 'condition'],
    [
      { en: 'Please review the penalty clause before signing the agreement.', kr: '계약서에 서명하기 전에 위약금 조항을 검토해주세요.' },
      { en: 'The force majeure clause covers delays caused by natural disasters.', kr: '불가항력 조항은 천재지변으로 인한 지연을 보호합니다.' },
    ]
  ],
  ['liability', 'liability', 'noun', '책임, 배상 책임', 'legal responsibility for something; financial obligation', 'advanced',
    ['legal', 'finance'],
    ['responsibility', 'obligation', 'exposure'],
    [
      { en: 'The contract clearly states that liability is limited to the invoice value.', kr: '계약서에는 배상 책임이 인보이스 금액으로 제한된다고 명시되어 있습니다.' },
      { en: 'We need to clarify who bears liability for damage during transit.', kr: '운송 중 손상에 대한 책임이 누구에게 있는지 명확히 해야 합니다.' },
    ]
  ],
  ['warranty', 'warranty', 'noun', '품질 보증, 하자 담보', 'a written guarantee promising to repair or replace a product if needed', 'intermediate',
    ['legal', 'quality'],
    ['guarantee', 'assurance', 'certification'],
    [
      { en: 'Our standard warranty covers defects for 12 months from the delivery date.', kr: '당사 기본 품질 보증은 납품일로부터 12개월간 하자를 보장합니다.' },
      { en: 'The warranty does not apply if the product has been mishandled.', kr: '제품이 부적절하게 취급된 경우 품질 보증이 적용되지 않습니다.' },
    ]
  ],
  ['breach', 'breach', 'noun', '위반, 불이행', 'a failure to fulfill an obligation or agreement', 'advanced',
    ['legal', 'contract'],
    ['violation', 'infringement', 'default'],
    [
      { en: 'Late delivery beyond 30 days constitutes a breach of contract.', kr: '30일을 초과한 납기 지연은 계약 위반에 해당합니다.' },
      { en: 'We reserve the right to claim damages in case of a breach.', kr: '위반 발생 시 손해배상을 청구할 권리가 있습니다.' },
    ]
  ],
  ['indemnify', 'indemnify', 'verb', '배상하다, 면책하다', 'to compensate for harm or loss; to hold harmless against liability', 'advanced',
    ['legal', 'contract'],
    ['compensate', 'reimburse', 'hold harmless'],
    [
      { en: 'The supplier agreed to indemnify us for any third-party claims arising from defects.', kr: '공급사는 불량으로 인한 제3자 클레임에 대해 당사를 배상하기로 합의했습니다.' },
      { en: 'The contract requires both parties to indemnify each other against intellectual property claims.', kr: '계약에는 양측이 지식재산권 클레임에 대해 상호 배상하도록 규정되어 있습니다.' },
    ]
  ],
  ['arbitration', 'arbitration', 'noun', '중재', 'a method of resolving disputes outside of court using a neutral third party', 'advanced',
    ['legal', 'negotiation'],
    ['mediation', 'dispute resolution', 'adjudication'],
    [
      { en: 'Any dispute shall be resolved by arbitration under ICC rules.', kr: '모든 분쟁은 ICC 규정에 따른 중재로 해결합니다.' },
      { en: 'We prefer arbitration over litigation to keep the process confidential.', kr: '절차의 기밀성을 위해 소송보다 중재를 선호합니다.' },
    ]
  ],

  // ── SUPPLY CHAIN & PROCUREMENT ────────────────────────────────────────────
  ['procure', 'procure', 'verb', '조달하다, 구매하다', 'to obtain goods or services, especially for business use', 'intermediate',
    ['procurement', 'operations'],
    ['source', 'purchase', 'obtain'],
    [
      { en: 'We procure all our LED chips directly from verified manufacturers.', kr: '당사는 모든 LED 칩을 검증된 제조사로부터 직접 조달합니다.' },
      { en: 'The procurement team is looking to procure an alternative component.', kr: '구매팀에서 대체 부품을 조달하는 방안을 검토 중입니다.' },
    ]
  ],
  ['tender', 'tender', 'noun', '입찰', 'a formal offer or bid to supply goods or services at a stated price', 'advanced',
    ['procurement', 'sales'],
    ['bid', 'quote', 'proposal'],
    [
      { en: 'We submitted a competitive tender for the government lighting project.', kr: '정부 조명 프로젝트에 경쟁력 있는 입찰을 제출했습니다.' },
      { en: 'All suppliers are invited to respond to the tender by next Friday.', kr: '모든 공급사는 다음 주 금요일까지 입찰에 응찰하시기 바랍니다.' },
    ]
  ],
  ['sourcing', 'sourcing', 'noun', '소싱, 공급처 발굴', 'the process of finding, evaluating and selecting suppliers for goods', 'intermediate',
    ['procurement', 'strategy'],
    ['procurement', 'purchasing', 'supply'],
    [
      { en: 'Our sourcing strategy focuses on dual suppliers to reduce risk.', kr: '당사의 소싱 전략은 리스크 감소를 위해 이중 공급처를 원칙으로 합니다.' },
      { en: 'We are sourcing alternative materials to reduce dependence on a single supplier.', kr: '단일 공급사 의존도를 낮추기 위해 대체 소재 소싱을 진행 중입니다.' },
    ]
  ],
  ['MOQ', 'MOQ (minimum order quantity)', 'noun', '최소 주문 수량', 'the smallest amount of a product a supplier is willing to sell in one order', 'intermediate',
    ['procurement', 'negotiation'],
    ['minimum order', 'order threshold', 'batch size'],
    [
      { en: 'The supplier\'s MOQ is 500 units, which is higher than our current demand.', kr: '공급사의 최소 주문 수량(MOQ)은 500개로, 현재 수요보다 많습니다.' },
      { en: 'Can we negotiate a lower MOQ for the initial trial order?', kr: '초도 시험 주문에 한해 최소 주문 수량을 낮출 수 있을까요?' },
    ]
  ],
  ['lead time', 'lead time', 'noun', '납기, 리드타임', 'the time from placing an order to receiving the goods', 'basic',
    ['logistics', 'procurement'],
    ['delivery time', 'production time', 'turnaround'],
    [
      { en: 'The standard lead time for this product is 30 working days.', kr: '이 제품의 표준 납기는 30 영업일입니다.' },
      { en: 'We need to reduce lead time to respond faster to market demand.', kr: '시장 수요에 더 빠르게 대응하기 위해 납기를 단축해야 합니다.' },
    ]
  ],
  ['consignment', 'consignment', 'noun', '위탁 화물, 위탁 판매', 'goods sent to a seller who pays only when items are sold', 'advanced',
    ['logistics', 'sales'],
    ['shipment', 'cargo', 'stock'],
    [
      { en: 'The goods were shipped on a consignment basis to reduce upfront risk.', kr: '초기 리스크를 줄이기 위해 위탁 방식으로 상품을 발송했습니다.' },
      { en: 'A consignment of 2,000 units arrived at the warehouse this morning.', kr: '오늘 오전 창고에 2,000개 단위의 화물이 도착했습니다.' },
    ]
  ],
  ['freight', 'freight', 'noun', '운송료, 화물', 'goods transported in bulk by truck, train, ship, or aircraft', 'basic',
    ['logistics', 'finance'],
    ['cargo', 'shipment', 'haulage'],
    [
      { en: 'Air freight is faster but costs significantly more than sea freight.', kr: '항공 운송이 더 빠르지만 해상 운송보다 비용이 훨씬 많이 듭니다.' },
      { en: 'The freight charges are included in the quoted CIF price.', kr: '운송료는 제시된 CIF 가격에 포함되어 있습니다.' },
    ]
  ],
  ['incoterms', 'Incoterms', 'noun', '인코텀즈 (무역 조건)', 'internationally recognized rules defining responsibilities for goods delivery', 'advanced',
    ['logistics', 'legal'],
    ['trade terms', 'delivery terms', 'FOB/CIF/EXW'],
    [
      { en: 'We typically trade on FOB terms — the most common Incoterms in our industry.', kr: '당사는 일반적으로 FOB 조건으로 거래합니다. 업계에서 가장 많이 사용하는 인코텀즈입니다.' },
      { en: 'Please confirm which Incoterms apply before we finalize the shipping quote.', kr: '운송 견적을 확정하기 전에 적용할 인코텀즈를 확인해주세요.' },
    ]
  ],

  // ── FINANCIAL DEEP ────────────────────────────────────────────────────────
  ['remit', 'remit', 'verb', '송금하다', 'to send money, especially as a payment', 'intermediate',
    ['finance', 'payment'],
    ['transfer', 'wire', 'pay'],
    [
      { en: 'Please remit the outstanding balance by the end of this week.', kr: '이번 주 말까지 미결 잔액을 송금해주세요.' },
      { en: 'We will remit the deposit upon receipt of the proforma invoice.', kr: '견적 인보이스를 받는 즉시 계약금을 송금하겠습니다.' },
    ]
  ],
  ['receivable', 'receivable', 'noun', '미수금, 매출채권', 'money owed to a company by its customers for goods or services delivered', 'advanced',
    ['finance', 'accounting'],
    ['outstanding payment', 'debtor', 'unpaid balance'],
    [
      { en: 'Our accounts receivable balance increased by 15% this quarter due to extended credit terms.', kr: '신용 조건 연장으로 이번 분기 미수금 잔액이 15% 증가했습니다.' },
      { en: 'The finance team is following up on overdue receivables.', kr: '재무팀이 연체된 미수금을 추심 중입니다.' },
    ]
  ],
  ['overdue', 'overdue', 'adjective', '연체된, 기한이 지난', 'not done or paid by the required time', 'intermediate',
    ['finance', 'payment'],
    ['late', 'outstanding', 'past due'],
    [
      { en: 'This invoice is 45 days overdue and must be settled immediately.', kr: '이 인보이스는 45일이 연체되었으며 즉시 정산되어야 합니다.' },
      { en: 'We will put the account on hold until the overdue amount is cleared.', kr: '연체 금액이 해소될 때까지 계정을 보류 처리하겠습니다.' },
    ]
  ],
  ['reconcile', 'reconcile', 'verb', '정산하다, 대조하다', 'to make two sets of accounts or records match; to settle a discrepancy', 'advanced',
    ['finance', 'accounting'],
    ['balance', 'match', 'settle'],
    [
      { en: 'The finance team reconciles accounts payable with supplier statements every month.', kr: '재무팀은 매월 매입채무와 공급사 거래 내역서를 대조·정산합니다.' },
      { en: 'We need to reconcile the discrepancy between the invoice and the delivery note.', kr: '인보이스와 납품서 간의 차이를 정산해야 합니다.' },
    ]
  ],
  ['markup', 'markup', 'noun', '마진, 마크업', 'the amount added to the cost price to determine the selling price', 'intermediate',
    ['finance', 'sales'],
    ['margin', 'profit margin', 'price increase'],
    [
      { en: 'Our standard markup on imported LED fixtures is 30%.', kr: '수입 LED 조명 기구에 대한 당사의 기본 마진은 30%입니다.' },
      { en: 'With raw material costs rising, maintaining our current markup is becoming difficult.', kr: '원자재 비용이 오르면서 현재 마진을 유지하기가 점점 어려워지고 있습니다.' },
    ]
  ],
  ['overhead', 'overhead', 'noun', '간접비, 고정비', 'the ongoing business expenses not directly related to production', 'intermediate',
    ['finance', 'management'],
    ['fixed costs', 'operating expenses', 'indirect costs'],
    [
      { en: 'Renting a warehouse significantly increases our overhead costs.', kr: '창고 임대는 간접비를 크게 증가시킵니다.' },
      { en: 'We are looking for ways to reduce overhead without cutting key staff.', kr: '핵심 인력 감원 없이 간접비를 줄일 방법을 모색 중입니다.' },
    ]
  ],
  ['invoice', 'invoice', 'noun', '청구서, 인보이스', 'a bill sent by a seller to a buyer listing goods or services and their prices', 'basic',
    ['finance', 'documents'],
    ['bill', 'statement', 'account'],
    [
      { en: 'Please send the commercial invoice along with the packing list.', kr: '포장 명세서와 함께 상업 인보이스를 보내주세요.' },
      { en: 'Our payment terms are 30 days from the date of the invoice.', kr: '결제 조건은 인보이스 발행일로부터 30일입니다.' },
    ]
  ],

  // ── QUALITY & INSPECTION ──────────────────────────────────────────────────
  ['defect', 'defect', 'noun', '결함, 불량', 'a fault or imperfection in a product that affects its quality or function', 'basic',
    ['quality', 'manufacturing'],
    ['fault', 'flaw', 'imperfection'],
    [
      { en: 'The defect rate must not exceed 0.5% per shipment.', kr: '선적 건당 불량률은 0.5%를 초과해서는 안 됩니다.' },
      { en: 'We found a defect in the LED driver module during incoming inspection.', kr: '입고 검사에서 LED 드라이버 모듈에 결함이 발견되었습니다.' },
    ]
  ],
  ['tolerance', 'tolerance', 'noun', '허용 오차', 'the allowable variation in the size or quality of a manufactured part', 'advanced',
    ['quality', 'manufacturing'],
    ['margin', 'acceptable range', 'deviation'],
    [
      { en: 'The dimension tolerance for this bracket is ±0.2mm.', kr: '이 브래킷의 치수 허용 오차는 ±0.2mm입니다.' },
      { en: 'Any component outside the specified tolerance will be rejected at inspection.', kr: '규정된 허용 오차를 벗어난 부품은 검사에서 불합격 처리됩니다.' },
    ]
  ],
  ['audit', 'audit', 'noun', '감사, 점검', 'an official inspection of an organization\'s accounts or processes', 'intermediate',
    ['quality', 'compliance'],
    ['inspection', 'review', 'assessment'],
    [
      { en: 'We conduct a full supplier audit once a year at each factory.', kr: '각 공장에서 연 1회 공급사 전체 감사를 실시합니다.' },
      { en: 'The audit revealed several gaps in the supplier\'s quality management system.', kr: '감사를 통해 공급사의 품질 관리 시스템에 여러 미비점이 발견되었습니다.' },
    ]
  ],
  ['calibrate', 'calibrate', 'verb', '교정하다, 보정하다', 'to check and adjust a measurement instrument to ensure accuracy', 'advanced',
    ['quality', 'manufacturing'],
    ['adjust', 'fine-tune', 'standardize'],
    [
      { en: 'All measuring instruments must be calibrated before the inspection begins.', kr: '검사를 시작하기 전에 모든 계측기를 교정해야 합니다.' },
      { en: 'The production line sensors are calibrated monthly to ensure consistent output.', kr: '일관된 생산을 보장하기 위해 생산 라인 센서를 월 1회 교정합니다.' },
    ]
  ],
  ['non-conformance', 'non-conformance', 'noun', '부적합, 기준 미달', 'a failure to meet a specified requirement or standard', 'advanced',
    ['quality', 'compliance'],
    ['defect', 'deviation', 'rejection'],
    [
      { en: 'All non-conformances must be reported and corrective actions documented.', kr: '모든 부적합 사항은 보고하고 시정 조치를 기록해야 합니다.' },
      { en: 'The supplier issued a corrective action report for the non-conformance found last month.', kr: '공급사는 지난달 발견된 부적합에 대해 시정 조치 보고서를 제출했습니다.' },
    ]
  ],

  // ── COMMUNICATION & EMAIL ─────────────────────────────────────────────────
  ['follow up', 'follow up', 'verb', '후속 조치를 취하다, 다시 확인하다', 'to check on the progress of something previously discussed', 'basic',
    ['communication', 'email'],
    ['check in', 'get back to', 'revisit'],
    [
      { en: 'I am following up on my previous email regarding the shipment schedule.', kr: '선적 일정 관련 이전 이메일에 대해 추가 문의드립니다.' },
      { en: 'Could you follow up with the client to confirm they received the samples?', kr: '고객에게 샘플 수령 여부를 확인해 주시겠어요?' },
    ]
  ],
  ['loop in', 'loop in', 'verb', '공유하다, 포함시키다', 'to include someone in a conversation or communication', 'intermediate',
    ['communication', 'email'],
    ['include', 'copy in', 'bring in'],
    [
      { en: 'Please loop in our logistics team so they can prepare the shipment documents.', kr: '선적 서류를 준비할 수 있도록 물류팀을 함께 포함시켜 주세요.' },
      { en: 'I\'ve looped in our quality manager so she can address the technical questions directly.', kr: '기술적 질문에 직접 답변할 수 있도록 품질 담당자를 참조 추가했습니다.' },
    ]
  ],
  ['revert', 'revert', 'verb', '회신하다, 답변하다', 'to reply to someone (common in Asian business English)', 'intermediate',
    ['communication', 'email'],
    ['reply', 'respond', 'get back to'],
    [
      { en: 'Please revert with your confirmation by the end of today.', kr: '오늘 중으로 확인 회신 부탁드립니다.' },
      { en: 'I will revert once I have checked with our production team.', kr: '생산팀에 확인한 후 회신드리겠습니다.' },
    ]
  ],
  ['cc', 'CC (carbon copy)', 'verb', '참조하다, 참조로 넣다', 'to send a copy of an email to an additional recipient', 'basic',
    ['communication', 'email'],
    ['copy', 'include', 'notify'],
    [
      { en: 'Please CC our accounts team on all payment-related correspondence.', kr: '결제 관련 모든 이메일에는 회계팀을 참조 추가해주세요.' },
      { en: 'I have CC\'d the sales manager so he is aware of the discussion.', kr: '논의 내용을 공유하기 위해 영업 부장을 참조에 추가했습니다.' },
    ]
  ],
  ['escalate', 'escalate', 'verb', '상위에 보고하다, 확대하다', 'to refer a problem to a higher level of management for resolution', 'intermediate',
    ['communication', 'management'],
    ['raise', 'refer', 'elevate'],
    [
      { en: 'If the issue is not resolved within 48 hours, we will escalate it to senior management.', kr: '48시간 내 해결되지 않으면 경영진에 보고하겠습니다.' },
      { en: 'The client has escalated their complaint after waiting three weeks for a response.', kr: '3주째 답변이 없자 고객이 상위 기관에 불만을 제기했습니다.' },
    ]
  ],

  // ── BUSINESS STRATEGY ────────────────────────────────────────────────────
  ['streamline', 'streamline', 'verb', '간소화하다, 효율화하다', 'to make a process simpler and more efficient', 'intermediate',
    ['strategy', 'operations'],
    ['simplify', 'optimize', 'improve efficiency'],
    [
      { en: 'We are streamlining the approval process to reduce turnaround time.', kr: '처리 시간을 줄이기 위해 승인 절차를 간소화하고 있습니다.' },
      { en: 'Streamlining the supply chain cut our lead time by 20%.', kr: '공급망을 효율화해 납기를 20% 단축했습니다.' },
    ]
  ],
  ['benchmark', 'benchmark', 'noun', '기준, 벤치마크', 'a standard or point of reference for measuring performance', 'intermediate',
    ['analysis', 'strategy'],
    ['standard', 'reference point', 'target'],
    [
      { en: 'Our pricing is benchmarked against the top three competitors in the market.', kr: '당사 가격은 시장 내 상위 3개 경쟁사를 기준으로 책정됩니다.' },
      { en: 'The quality benchmark for this product class is a defect rate below 0.3%.', kr: '이 제품 등급의 품질 기준은 불량률 0.3% 미만입니다.' },
    ]
  ],
  ['scalable', 'scalable', 'adjective', '확장 가능한', 'able to be expanded or adapted to larger demand without losing quality', 'advanced',
    ['strategy', 'technology'],
    ['expandable', 'flexible', 'adaptable'],
    [
      { en: 'We need a scalable distribution model that can handle 10x growth.', kr: '10배 성장을 감당할 수 있는 확장 가능한 유통 모델이 필요합니다.' },
      { en: 'The new ERP system is scalable and can accommodate our expansion plans.', kr: '새 ERP 시스템은 확장 가능하며 당사의 성장 계획을 수용할 수 있습니다.' },
    ]
  ],
  ['contingency', 'contingency', 'noun', '비상 계획, 만약의 사태', 'a plan prepared for an unexpected situation', 'advanced',
    ['strategy', 'risk'],
    ['backup plan', 'fallback', 'emergency plan'],
    [
      { en: 'What is our contingency if the primary supplier cannot deliver on time?', kr: '주 공급사가 제때 납품하지 못할 경우 비상 계획이 무엇인가요?' },
      { en: 'We should build a contingency into the project timeline for unexpected delays.', kr: '예상치 못한 지연에 대비해 프로젝트 일정에 여유를 두어야 합니다.' },
    ]
  ],
  ['mitigate', 'mitigate', 'verb', '완화하다, 줄이다', 'to reduce the severity or seriousness of a risk or problem', 'advanced',
    ['risk', 'strategy'],
    ['reduce', 'minimize', 'alleviate'],
    [
      { en: 'We are dual-sourcing to mitigate supply chain risk.', kr: '공급망 리스크를 줄이기 위해 이중 소싱을 진행 중입니다.' },
      { en: 'Early payment discounts can help mitigate cash flow pressure.', kr: '조기 결제 할인은 자금 흐름 압박을 완화하는 데 도움이 됩니다.' },
    ]
  ],
  ['stakeholder', 'stakeholder', 'noun', '이해관계자', 'a person or group with an interest or concern in an organization or project', 'intermediate',
    ['management', 'strategy'],
    ['party', 'interest group', 'participant'],
    [
      { en: 'We need to align all key stakeholders before the project launches.', kr: '프로젝트 출시 전에 모든 핵심 이해관계자의 동의를 구해야 합니다.' },
      { en: 'Stakeholder feedback was incorporated into the final design specification.', kr: '이해관계자의 의견이 최종 설계 사양에 반영되었습니다.' },
    ]
  ],
  ['turnaround', 'turnaround', 'noun', '처리 기간, 전환', 'the time taken to complete a process; also a business recovery', 'intermediate',
    ['operations', 'logistics'],
    ['processing time', 'lead time', 'response time'],
    [
      { en: 'Our standard quote turnaround is 2 business days.', kr: '당사 견적서 처리 기간은 영업일 기준 2일입니다.' },
      { en: 'We are working to improve the turnaround time for sample production.', kr: '샘플 제작 처리 기간을 개선하기 위해 노력하고 있습니다.' },
    ]
  ],
  ['bottleneck', 'bottleneck', 'noun', '병목 현상', 'a point of congestion in a system that slows overall performance', 'intermediate',
    ['operations', 'analysis'],
    ['constraint', 'chokepoint', 'blockage'],
    [
      { en: 'The customs clearance process is the main bottleneck in our supply chain.', kr: '통관 과정이 당사 공급망의 주요 병목 현상입니다.' },
      { en: 'Identifying the bottleneck is the first step to improving throughput.', kr: '병목 구간을 파악하는 것이 처리량 개선의 첫 걸음입니다.' },
    ]
  ],
  ['onboard', 'onboard', 'verb', '등록하다, 온보딩하다', 'to integrate a new supplier, client, or employee into a system or process', 'intermediate',
    ['management', 'operations'],
    ['register', 'integrate', 'bring on'],
    [
      { en: 'We need to onboard the new supplier before the Q3 order cycle begins.', kr: 'Q3 발주 주기가 시작되기 전에 신규 공급사를 등록해야 합니다.' },
      { en: 'Onboarding a new key account takes about four weeks including credit checks.', kr: '신규 주요 거래처 온보딩은 신용 조회를 포함해 약 4주가 걸립니다.' },
    ]
  ],
  ['rollout', 'rollout', 'noun', '출시, 단계적 도입', 'a gradual introduction of a new product, service, or system', 'intermediate',
    ['strategy', 'operations'],
    ['launch', 'deployment', 'release'],
    [
      { en: 'The new product rollout is scheduled for Q2 in key Asian markets.', kr: '신제품 출시는 Q2에 주요 아시아 시장을 대상으로 예정되어 있습니다.' },
      { en: 'We will pilot the new system in one warehouse before a full rollout.', kr: '전면 도입 전에 창고 한 곳에서 신규 시스템을 시범 운영할 것입니다.' },
    ]
  ],
  ['pipeline', 'pipeline', 'noun', '파이프라인, 진행 중인 거래', 'ongoing deals, projects, or products in development', 'intermediate',
    ['sales', 'strategy'],
    ['deal flow', 'backlog', 'prospect'],
    [
      { en: 'We have three new major accounts in the pipeline for Q4.', kr: 'Q4를 위해 3개의 주요 신규 고객사가 파이프라인에 있습니다.' },
      { en: 'The product pipeline includes two new LED driver models launching next year.', kr: '제품 파이프라인에는 내년에 출시할 신규 LED 드라이버 2종이 포함되어 있습니다.' },
    ]
  ],
  ['proactive', 'proactive', 'adjective', '선제적인, 능동적인', 'taking action in advance to prevent a problem rather than reacting to it', 'intermediate',
    ['management', 'communication'],
    ['preventive', 'forward-thinking', 'initiative-taking'],
    [
      { en: 'A proactive approach to quality control reduces costly rework later.', kr: '품질 관리에 선제적으로 접근하면 나중에 발생하는 비싼 재작업 비용을 줄일 수 있습니다.' },
      { en: 'Please be proactive in flagging any potential delays before they escalate.', kr: '지연이 커지기 전에 선제적으로 파악해 알려주세요.' },
    ]
  ],
  ['robust', 'robust', 'adjective', '탄탄한, 견고한', 'strong and unlikely to fail; effective in a wide range of conditions', 'intermediate',
    ['quality', 'strategy'],
    ['strong', 'reliable', 'solid'],
    [
      { en: 'We need a more robust process to prevent repeat defects.', kr: '반복 불량을 막기 위해 더 탄탄한 프로세스가 필요합니다.' },
      { en: 'The new packaging design is more robust and reduces damage during transit.', kr: '새 포장 설계가 더 견고해 운송 중 파손을 줄여줍니다.' },
    ]
  ],
  ['feasible', 'feasible', 'adjective', '실현 가능한, 타당한', 'possible and practical to do easily or conveniently', 'intermediate',
    ['decision', 'planning'],
    ['viable', 'achievable', 'workable'],
    [
      { en: 'Is it feasible to reduce the lead time to 20 days for urgent orders?', kr: '긴급 주문의 경우 납기를 20일로 단축하는 것이 실현 가능한가요?' },
      { en: 'The feasibility study showed that the project is both technically and commercially viable.', kr: '타당성 검토 결과, 해당 프로젝트는 기술적으로도 상업적으로도 실현 가능한 것으로 나타났습니다.' },
    ]
  ],
  ['discrepancy', 'discrepancy', 'noun', '불일치, 오차', 'a difference between two things that should be the same', 'intermediate',
    ['quality', 'finance'],
    ['difference', 'mismatch', 'inconsistency'],
    [
      { en: 'There is a discrepancy between the invoice amount and the purchase order.', kr: '인보이스 금액과 발주서 사이에 불일치가 있습니다.' },
      { en: 'Please investigate the discrepancy in the inventory count and report back by Friday.', kr: '재고 수량의 불일치를 조사해 금요일까지 보고해 주세요.' },
    ]
  ],
  ['diligence', 'due diligence', 'noun', '사전 실사', 'a thorough investigation or audit before entering a business agreement', 'advanced',
    ['legal', 'procurement'],
    ['investigation', 'vetting', 'assessment'],
    [
      { en: 'We conduct due diligence on all new suppliers before placing the first order.', kr: '첫 주문 전에 모든 신규 공급사에 대해 사전 실사를 진행합니다.' },
      { en: 'The due diligence process includes a factory visit and financial review.', kr: '사전 실사 절차에는 공장 방문과 재무 검토가 포함됩니다.' },
    ]
  ],
  ['accrue', 'accrue', 'verb', '누적되다, 발생하다', 'to accumulate or be received over time (interest, costs, benefits)', 'advanced',
    ['finance', 'accounting'],
    ['accumulate', 'build up', 'amass'],
    [
      { en: 'Interest will accrue on the overdue invoice at 1.5% per month.', kr: '연체 인보이스에는 월 1.5%의 이자가 발생합니다.' },
      { en: 'The cost savings from the new process will accrue over the next 12 months.', kr: '새 프로세스로 인한 비용 절감 효과는 향후 12개월에 걸쳐 누적될 것입니다.' },
    ]
  ],
];


export const VOCAB_ENTRIES: VocabEntry[] = RAW_VOCAB.map((item, index) => ({
  id: `vocab-${item[0]}-${index}`,
  word: item[0],
  pos: item[2],
  korean: item[3],
  definition: item[4],
  level: item[5],
  categories: item[6],
  synonyms: item[7],
  examples: item[8],
}));

export const VOCAB_LEVELS: VocabLevel[] = ['basic', 'intermediate', 'advanced'];

export const VOCAB_CATEGORIES: string[] = Array.from(
  new Set(VOCAB_ENTRIES.flatMap(e => e.categories))
).sort();

export function filterVocab(entries: VocabEntry[], opts: {
  level?: string;
  category?: string;
  q?: string;
}): VocabEntry[] {
  return entries.filter(e => {
    if (opts.level && opts.level !== 'all' && e.level !== opts.level) return false;
    if (opts.category && opts.category !== 'all' && !e.categories.includes(opts.category)) return false;
    if (opts.q) {
      const q = opts.q.toLowerCase();
      const hay = [e.word, e.korean, e.definition, ...e.synonyms, ...e.categories].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function countVocabByLevel(level: VocabLevel) {
  return VOCAB_ENTRIES.filter(e => e.level === level).length;
}
