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
      { en: 'The email failed to convey the urgency of the situation.', kr: '이메일이 상황의 긴박함을 제대로 전달하지 못했습니다.' },
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
      { en: 'Please monitor the shipment status and update us daily.', kr: '선적 상태를 모니터링하고 매일 업데이트해 주세요.' },
      { en: 'We monitor supplier performance on a quarterly basis.', kr: '공급사 성과를 분기별로 모니터링합니다.' },
    ]
  ],

  // ── NEGOTIATION ───────────────────────────────────────────────────────────
  ['negotiate', 'negotiate', 'verb', '협상하다', 'to discuss something formally to reach an agreement', 'basic',
    ['negotiation', 'sales'],
    ['bargain', 'discuss terms', 'work out'],
    [
      { en: 'We are negotiating better payment terms with the supplier.', kr: '공급사와 더 좋은 결제 조건을 협상 중입니다.' },
      { en: 'She negotiated a 10% discount on the bulk order.', kr: '그녀는 대량 주문에서 10% 할인을 협상했습니다.' },
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
      { en: 'The price is tentatively set at $4.50 pending final approval.', kr: '가격은 최종 승인을 기다리며 잠정적으로 $4.50으로 정해져 있습니다.' },
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
