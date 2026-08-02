import OPEN_WORDNET_CORE from "@/data/english/open-wordnet-core.json";

export type EnglishLevel = "intermediate" | "advanced";
export type EntryKind = "phrasal-verb" | "pattern";

export interface EnglishExample {
  en: string;
  kr: string;
}

export interface EnglishEntry {
  id: string;
  expression: string;
  korean: string;
  baseExpression: string;
  scenarioLabel: string;
  focusObject: string;
  variantLabel: string;
  level: EnglishLevel;
  kind: EntryKind;
  grammarPattern: string;
  grammarFocus: string;
  usageNote: string;
  commonMistake: string;
  categories: string[];
  collocations: string[];
  objectPool: string[];
  answerTemplate: string;
  examples: EnglishExample[];
}

export interface PracticeCard {
  id: string;
  entryId: string;
  expression: string;
  level: EnglishLevel;
  taskType: string;
  prompt: string;
  answer: string;
  explanation: string;
}

type BaseExpression = {
  id: string;
  expression: string;
  korean: string;
  level: EnglishLevel;
  kind: EntryKind;
  grammarPattern: string;
  grammarFocus: string;
  usageNote: string;
  commonMistake: string;
  categories: string[];
  collocations: string[];
  answerTemplate: string;
  objectTemplates: string[];
  exampleTemplates: {
    en: string;
    kr: string;
  }[];
};

type DomainScenario = {
  slug: string;
  label: string;
  productTag: string;
  categories: string[];
  objects: string[];
};

const ROLE_SUBJECTS = [
  "The sales team",
  "The account manager",
  "The operations lead",
  "The procurement team",
  "The finance manager",
  "The project owner",
  "The supplier",
  "The marketing team",
  "The client success lead",
  "The regional director",
  "The product team",
  "The training manager",
];

const TIME_MARKERS = [
  "today",
  "this week",
  "before the client call",
  "before Friday",
  "during the rollout",
  "after the meeting",
  "before the deadline",
  "in the next review cycle",
];

const TASK_TYPES = [
  "빈칸 완성",
  "업무 문장 작성",
  "문법 포인트",
  "번역 힌트",
  "실수 교정",
  "콜로케이션",
];

const PRACTICE_CONTEXTS = [
  "견적 검토",
  "고객 미팅",
  "공급사 협의",
  "생산 일정",
  "품질 이슈",
  "선적 안내",
  "계약 검토",
  "프로젝트 보고",
  "가격 협상",
  "샘플 승인",
  "재고 계획",
  "교육 안내",
  "월간 실적 보고",
  "분기 경영 회의",
  "신규 고객 온보딩",
  "기존 고객 갱신",
  "납기 변경 안내",
  "긴급 출하 요청",
  "통관 서류 검토",
  "송장 오류 확인",
  "원가 분석",
  "예산 검토",
  "할인 조건 협의",
  "계약 조항 협상",
  "리스크 검토",
  "규정 준수 점검",
  "인증 갱신",
  "공장 감사",
  "불량 원인 분석",
  "클레임 대응",
  "반품 처리",
  "신제품 출시",
  "제품 사양 변경",
  "라벨 검토",
  "포장 개선",
  "수요 예측",
  "생산 능력 검토",
  "창고 입고",
  "재고 보충",
  "운송 예약",
  "선적 추적",
  "협력사 선정",
  "공급사 평가",
  "구매 발주",
  "결제 확인",
  "채권 회수",
  "회의록 작성",
  "실행 과제 점검",
  "프로젝트 착수",
  "프로젝트 종료",
  "일정 재조정",
  "인력 배치",
  "업무 인수인계",
  "내부 교육",
  "고객 피드백",
  "시장 진입 계획",
  "영업 제안서",
  "입찰 응답",
  "제품 데모",
  "기술 검증",
  "현장 테스트",
  "성과 개선",
  "운영 프로세스 개선",
  "데이터 정리",
  "경영진 보고",
  "해외 파트너 협의",
  "연간 계획 수립",
  "사업 검토",
  "재무 마감",
  "고객 지원",
] as const;

const MODAL_HELPERS = [
  "should",
  "needs to",
  "has to",
  "plans to",
  "is expected to",
];

const DOMAIN_SCENARIOS: DomainScenario[] = [
  {
    slug: "sales-quotation",
    label: "sales quotation",
    productTag: "quotation",
    categories: ["sales", "quotation", "pricing"],
    objects: ["the revised quotation", "the discount sheet", "the deal summary"],
  },
  {
    slug: "key-account-renewal",
    label: "key account renewal",
    productTag: "renewal",
    categories: ["sales", "renewal", "client"],
    objects: ["the renewal proposal", "the contract extension", "the account review"],
  },
  {
    slug: "shipment-delay",
    label: "shipment delay",
    productTag: "shipment",
    categories: ["logistics", "shipment", "operations"],
    objects: ["the delayed shipment", "the revised ETD", "the booking status"],
  },
  {
    slug: "factory-audit",
    label: "factory audit",
    productTag: "audit",
    categories: ["quality", "audit", "supplier"],
    objects: ["the audit finding", "the corrective action list", "the factory checklist"],
  },
  {
    slug: "sample-approval",
    label: "sample approval",
    productTag: "sample",
    categories: ["sample", "approval", "product"],
    objects: ["the pre-production sample", "the golden sample", "the sample feedback"],
  },
  {
    slug: "invoice-review",
    label: "invoice review",
    productTag: "invoice",
    categories: ["finance", "documents", "invoice"],
    objects: ["the commercial invoice", "the payment breakdown", "the tax line item"],
  },
  {
    slug: "packing-list",
    label: "packing list",
    productTag: "packing",
    categories: ["documents", "packing", "logistics"],
    objects: ["the packing list", "the carton quantity", "the pallet count"],
  },
  {
    slug: "co-review",
    label: "certificate of origin review",
    productTag: "C/O",
    categories: ["documents", "compliance", "origin"],
    objects: ["the C/O draft", "the exporter address", "the HS code line"],
  },
  {
    slug: "customs-clearance",
    label: "customs clearance",
    productTag: "customs",
    categories: ["customs", "shipping", "compliance"],
    objects: ["the customs document", "the import entry", "the clearance issue"],
  },
  {
    slug: "product-launch",
    label: "product launch",
    productTag: "launch",
    categories: ["marketing", "launch", "product"],
    objects: ["the launch calendar", "the feature summary", "the launch deck"],
  },
  {
    slug: "ecommerce-listing",
    label: "ecommerce listing",
    productTag: "listing",
    categories: ["ecommerce", "content", "marketing"],
    objects: ["the product listing", "the image set", "the listing title"],
  },
  {
    slug: "crm-handover",
    label: "CRM handover",
    productTag: "CRM",
    categories: ["crm", "handover", "sales"],
    objects: ["the lead history", "the handover note", "the pipeline view"],
  },
  {
    slug: "supplier-onboarding",
    label: "supplier onboarding",
    productTag: "onboarding",
    categories: ["supplier", "onboarding", "operations"],
    objects: ["the onboarding checklist", "the company profile", "the compliance package"],
  },
  {
    slug: "production-planning",
    label: "production planning",
    productTag: "planning",
    categories: ["production", "planning", "factory"],
    objects: ["the weekly plan", "the line capacity", "the build schedule"],
  },
  {
    slug: "quality-claim",
    label: "quality claim",
    productTag: "claim",
    categories: ["quality", "claim", "after-sales"],
    objects: ["the defect claim", "the root cause report", "the 8D response"],
  },
  {
    slug: "after-sales",
    label: "after-sales support",
    productTag: "support",
    categories: ["support", "service", "client"],
    objects: ["the service ticket", "the field complaint", "the replacement request"],
  },
  {
    slug: "pricing-negotiation",
    label: "pricing negotiation",
    productTag: "negotiation",
    categories: ["pricing", "negotiation", "sales"],
    objects: ["the target price", "the margin request", "the rebate option"],
  },
  {
    slug: "forecast-review",
    label: "forecast review",
    productTag: "forecast",
    categories: ["forecast", "planning", "sales"],
    objects: ["the monthly forecast", "the demand signal", "the forecast gap"],
  },
  {
    slug: "monthly-reporting",
    label: "monthly reporting",
    productTag: "report",
    categories: ["reporting", "management", "finance"],
    objects: ["the monthly report", "the KPI summary", "the performance slide"],
  },
  {
    slug: "project-rollout",
    label: "project rollout",
    productTag: "rollout",
    categories: ["project", "rollout", "operations"],
    objects: ["the rollout plan", "the milestone tracker", "the go-live checklist"],
  },
  {
    slug: "training-program",
    label: "training program",
    productTag: "training",
    categories: ["training", "people", "operations"],
    objects: ["the training module", "the onboarding deck", "the workshop agenda"],
  },
  {
    slug: "compliance-check",
    label: "compliance check",
    productTag: "compliance",
    categories: ["compliance", "documents", "review"],
    objects: ["the compliance checklist", "the policy exception", "the submission gap"],
  },
  {
    slug: "warehouse-inbound",
    label: "warehouse inbound",
    productTag: "warehouse",
    categories: ["warehouse", "inventory", "logistics"],
    objects: ["the inbound schedule", "the stock receipt", "the unloading slot"],
  },
  {
    slug: "inventory-replenishment",
    label: "inventory replenishment",
    productTag: "inventory",
    categories: ["inventory", "planning", "supply"],
    objects: ["the replenishment plan", "the safety stock", "the stock shortage"],
  },
  {
    slug: "container-booking",
    label: "container booking",
    productTag: "booking",
    categories: ["shipping", "booking", "forwarder"],
    objects: ["the container booking", "the vessel option", "the booking confirmation"],
  },
  {
    slug: "payment-followup",
    label: "payment follow-up",
    productTag: "payment",
    categories: ["finance", "payment", "collections"],
    objects: ["the overdue payment", "the remittance copy", "the bank charge item"],
  },
  {
    slug: "engineering-change",
    label: "engineering change",
    productTag: "ECO",
    categories: ["engineering", "change", "product"],
    objects: ["the ECO notice", "the drawing revision", "the material change"],
  },
  {
    slug: "certification-renewal",
    label: "certification renewal",
    productTag: "certificate",
    categories: ["certification", "compliance", "renewal"],
    objects: ["the KC certificate", "the CE file", "the validity date"],
  },
  {
    slug: "label-artwork",
    label: "label artwork",
    productTag: "label",
    categories: ["label", "artwork", "product"],
    objects: ["the label artwork", "the barcode layout", "the carton mark"],
  },
  {
    slug: "rfq-response",
    label: "RFQ response",
    productTag: "RFQ",
    categories: ["sales", "RFQ", "pricing"],
    objects: ["the RFQ package", "the cost breakdown", "the delivery term"],
  },
  {
    slug: "meeting-minutes",
    label: "meeting minutes",
    productTag: "minutes",
    categories: ["meeting", "communication", "reporting"],
    objects: ["the meeting minutes", "the action log", "the open issue list"],
  },
  {
    slug: "board-update",
    label: "board update",
    productTag: "board",
    categories: ["management", "reporting", "executive"],
    objects: ["the board update", "the risk note", "the decision memo"],
  },
  {
    slug: "contract-redline",
    label: "contract redline",
    productTag: "contract",
    categories: ["legal", "contract", "negotiation"],
    objects: ["the redlined clause", "the liability point", "the payment term"],
  },
  {
    slug: "return-material",
    label: "return material authorization",
    productTag: "RMA",
    categories: ["returns", "quality", "support"],
    objects: ["the RMA request", "the return note", "the return cause"],
  },
  {
    slug: "field-test",
    label: "field test",
    productTag: "test",
    categories: ["testing", "quality", "field"],
    objects: ["the field test result", "the site issue", "the validation point"],
  },
  {
    slug: "regional-expansion",
    label: "regional expansion",
    productTag: "expansion",
    categories: ["expansion", "market", "strategy"],
    objects: ["the regional plan", "the distributor shortlist", "the launch timing"],
  },
];

function fillTemplate(
  template: string,
  subject: string,
  object: string,
  time: string,
  modal: string
) {
  return template
    .replaceAll("{subject}", subject)
    .replaceAll("{object}", object)
    .replaceAll("{time}", time)
    .replaceAll("{modal}", modal);
}

function capitalizeSentence(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function createBaseExpressions(): BaseExpression[] {
  const raw: Array<
    [
      string,
      string,
      string,
      EnglishLevel,
      EntryKind,
      string,
      string,
      string,
      string,
      string[],
      string[],
    ]
  > = [
    ["follow-up-on", "follow up on", "후속 확인하다", "intermediate", "phrasal-verb", "follow up on + noun", "전치사 on 뒤에 확인 대상이 옵니다.", "견적, 일정, 승인처럼 다시 챙길 일이 있을 때 가장 자주 쓰입니다.", "follow up the issue 라고 쓰지 말고 follow up on the issue 로 씁니다.", ["email", "sales", "operations"], ["quotation", "shipment", "approval"]],
    ["touch-base-with", "touch base with", "간단히 연락하다", "intermediate", "phrasal-verb", "touch base with + person / team", "with 뒤에 사람이나 팀이 옵니다.", "긴 회의보다 짧은 체크인에 가깝습니다.", "touch base to someone 보다 touch base with someone 이 자연스럽습니다.", ["meeting", "communication"], ["client", "supplier", "logistics team"]],
    ["check-in-on", "check in on", "상태를 확인하다", "intermediate", "phrasal-verb", "check in on + progress / team", "진행 상태를 짧게 확인할 때 씁니다.", "업무 진행, 생산 현황, 문서 검토 상황을 점검할 때 자연스럽습니다.", "check in the progress 보다 check in on the progress 가 맞습니다.", ["progress", "operations"], ["progress", "shipment", "review"]],
    ["go-over", "go over", "검토하다", "intermediate", "phrasal-verb", "go over + details / document", "문서나 세부사항을 함께 훑어볼 때 씁니다.", "회의 전 자료 확인, 계약 검토, 수치 체크에 자주 나옵니다.", "go through 와 비슷하지만 조금 더 대화형 맥락이 강합니다.", ["documents", "review"], ["document", "draft", "details"]],
    ["hand-over", "hand over", "인계하다", "intermediate", "phrasal-verb", "hand over + file / task / account", "업무나 자료를 다른 담당자에게 넘길 때 씁니다.", "프로젝트 전환, 담당자 변경, 샘플 인수인계에 적합합니다.", "hand in 과 혼동하지 않습니다.", ["handover", "operations"], ["account", "task", "file"]],
    ["set-up", "set up", "세팅하다, 마련하다", "intermediate", "phrasal-verb", "set up + call / system / process", "일정, 시스템, 프로세스 세팅에 폭넓게 씁니다.", "실무 이메일과 미팅 조율에서 매우 빈번합니다.", "setup 은 명사, set up 은 동사입니다.", ["meeting", "systems"], ["call", "dashboard", "review process"]],
    ["map-out", "map out", "구체적으로 계획하다", "advanced", "phrasal-verb", "map out + plan / process", "단계별 실행 계획을 그릴 때 자연스럽습니다.", "런칭, 선적, 공급사 온보딩처럼 흐름이 긴 업무에 적합합니다.", "단순 나열보다 구조화된 계획을 암시합니다.", ["planning", "strategy"], ["timeline", "process", "roadmap"]],
    ["sort-out", "sort out", "정리하다, 해결하다", "intermediate", "phrasal-verb", "sort out + issue / detail", "문제 해결과 정리라는 두 의미를 모두 가집니다.", "송장 오류, 일정 충돌, 파일 누락 정리에 많이 씁니다.", "sort the issue out 도 가능하지만 sort out the issue 가 더 간결합니다.", ["operations", "support"], ["issue", "mismatch", "file gap"]],
    ["carry-over", "carry over", "이월하다", "advanced", "phrasal-verb", "carry over + item / balance / issue", "이슈나 수량을 다음 기간으로 넘길 때 씁니다.", "월말 재고, 다음 분기 과제, 미결 이슈에 자연스럽습니다.", "carry on 과 혼동하지 않습니다.", ["finance", "planning"], ["balance", "open issue", "backlog"]],
    ["work-through", "work through", "차근차근 해결하다", "advanced", "phrasal-verb", "work through + problem / list", "한 번에 끝내기보다 단계적으로 풀어갈 때 씁니다.", "복잡한 클레임이나 규격 이슈 설명에 적합합니다.", "work on 보다 더 체계적인 뉘앙스입니다.", ["quality", "problem-solving"], ["claim list", "technical issue", "feedback"]],
    ["line-up", "line up", "준비하다, 확보하다", "intermediate", "phrasal-verb", "line up + supplier / meeting / support", "사람, 자원, 일정 확보에 자주 씁니다.", "다음 단계 전에 필요한 자원을 준비했다는 의미입니다.", "line up with 는 일치하다는 다른 의미이므로 구분합니다.", ["planning", "resources"], ["backup supplier", "review call", "support plan"]],
    ["roll-out", "roll out", "도입하다, 출시하다", "intermediate", "phrasal-verb", "roll out + program / product / process", "새 제품이나 프로세스를 단계적으로 도입할 때 씁니다.", "launch 보다 운영 도입 과정까지 포함하는 뉘앙스가 있습니다.", "roll out to market 보다는 roll out the product 가 기본입니다.", ["product", "launch", "operations"], ["dashboard", "label", "training program"]],
    ["scale-up", "scale up", "확대하다, 증산하다", "intermediate", "phrasal-verb", "scale up + production / capacity", "생산량, 운영, 인력을 키울 때 씁니다.", "샘플 승인 후 양산 확대, 신규 거래 확대에 자연스럽습니다.", "scale the production up 도 가능하지만 scale up production 이 더 자주 쓰입니다.", ["manufacturing", "operations"], ["production", "capacity", "output"]],
    ["wind-down", "wind down", "점진적으로 마무리하다", "advanced", "phrasal-verb", "wind down + project / process", "활동을 갑자기 멈추지 않고 정리할 때 씁니다.", "구형 공정 종료, 파일럿 프로젝트 종료에 적합합니다.", "close down 처럼 즉각 폐쇄 의미는 아닙니다.", ["management", "operations"], ["pilot project", "legacy process", "campaign"]],
    ["iron-out", "iron out", "세부 문제를 해결하다", "advanced", "phrasal-verb", "iron out + issue / detail", "큰 방향보다 잔문제 정리에 강합니다.", "계약 문구, 테스트 오류, 출고 세부 정리에 잘 맞습니다.", "iron the issue out 보다 iron out the issue 가 더 일반적입니다.", ["negotiation", "quality"], ["shipping issue", "test failure", "final details"]],
    ["sign-off-on", "sign off on", "최종 승인하다", "intermediate", "phrasal-verb", "sign off on + file / plan", "의사결정자가 공식 승인할 때 씁니다.", "견적, 포장안, 도면, 선적 계획 승인에 자주 나옵니다.", "sign off the document 가 아니라 sign off on the document 가 기본입니다.", ["approval", "documents"], ["drawing", "quotation", "shipment plan"]],
    ["zero-in-on", "zero in on", "핵심에 집중하다", "advanced", "phrasal-verb", "zero in on + issue / target", "여러 선택지 중 핵심 포인트를 좁혀갈 때 씁니다.", "원가, 불량 원인, 주요 고객 요구사항을 다룰 때 적합합니다.", "focus in on 보다 더 날카로운 느낌을 줍니다.", ["analysis", "strategy"], ["root cause", "margin leak", "priority issue"]],
    ["phase-out", "phase out", "단계적으로 중단하다", "advanced", "phrasal-verb", "phase out + item / model / process", "오래된 제품이나 공정을 천천히 종료할 때 씁니다.", "단종 통보, 부품 교체, 규정 변경 대응에 적합합니다.", "phase off 라고 쓰지 않습니다.", ["product", "lifecycle"], ["legacy model", "old packaging", "manual process"]],
    ["rule-out", "rule out", "가능성을 배제하다", "advanced", "phrasal-verb", "rule out + option / cause", "원인 분석과 대안 평가에서 자주 나옵니다.", "품질 불량 원인이나 공급사 후보를 좁힐 때 자연스럽습니다.", "delete 나 remove 와 다른 분석적 표현입니다.", ["quality", "analysis"], ["design issue", "material cause", "supplier option"]],
    ["call-off", "call off", "취소하다", "intermediate", "phrasal-verb", "call off + meeting / shipment / event", "잡혀 있던 일정이나 이벤트를 취소할 때 씁니다.", "회의 취소, 출하 보류, 방문 취소에 자연스럽습니다.", "cancel 과 거의 같지만 일정 취소 맥락이 강합니다.", ["meeting", "logistics"], ["review meeting", "shipment booking", "site visit"]],
    ["lock-in", "lock in", "확정하다", "advanced", "phrasal-verb", "lock in + price / date / spec", "나중에 바뀌지 않도록 확정할 때 씁니다.", "원가, 선적일, 자재 규격 확정 표현으로 좋습니다.", "lock on 과 혼동하지 않습니다.", ["pricing", "planning"], ["target price", "ETD", "material spec"]],
    ["bring-up", "bring up", "꺼내다, 제기하다", "intermediate", "phrasal-verb", "bring up + concern / topic", "회의나 이메일에서 이슈를 처음 제기할 때 씁니다.", "문제 지적, 가격 이슈, 일정 충돌 제기에 폭넓게 씁니다.", "raise 와 비슷하지만 구어적인 톤이 있습니다.", ["meeting", "communication"], ["quality concern", "price gap", "delay risk"]],
    ["close-out", "close out", "완료 정리하다", "advanced", "phrasal-verb", "close out + task / month / claim", "단순 종료보다 정산과 정리를 포함합니다.", "월말 마감, 클레임 종결, 프로젝트 종료에 적합합니다.", "close 와 달리 정리 완료까지 포함합니다.", ["finance", "project"], ["claim case", "month-end tasks", "action list"]],
    ["write-up", "write up", "문서화하다", "advanced", "phrasal-verb", "write up + summary / findings", "검토 결과, 회의 결과, 테스트 결과를 정리할 때 씁니다.", "구두 논의를 문서로 남기는 상황에 매우 유용합니다.", "write down 보다 더 공식적인 문서화 의미입니다.", ["reporting", "documents"], ["meeting summary", "test findings", "audit note"]],
    ["back-up", "back up", "뒷받침하다, 백업하다", "intermediate", "phrasal-verb", "back up + claim / file / data", "주장 근거나 데이터 백업 둘 다 가능합니다.", "시험 성적서, 거래 이력, 로그 자료 설명에 자연스럽습니다.", "backup 은 명사, back up 은 동사입니다.", ["documents", "data"], ["claim", "cost estimate", "test result"]],
    ["filter-out", "filter out", "걸러내다", "advanced", "phrasal-verb", "filter out + noise / duplicate / issue", "대량 데이터나 피드백에서 불필요한 것을 제거할 때 씁니다.", "리드 정제, 이상 데이터 제거, 문서 검토 결과 정리에 적합합니다.", "filter off 라고 쓰지 않습니다.", ["data", "analysis"], ["duplicate records", "noise", "non-priority items"]],
    ["step-up", "step up", "강화하다, 속도를 높이다", "intermediate", "phrasal-verb", "step up + effort / control / output", "개선이 더 필요할 때 행동 강화를 뜻합니다.", "품질관리 강화, 커뮤니케이션 강화, 생산 증대에 자주 씁니다.", "step up to 는 역할을 맡는 다른 의미이므로 구분합니다.", ["management", "quality"], ["quality checks", "communication", "output"]],
    ["hold-off-on", "hold off on", "보류하다", "advanced", "phrasal-verb", "hold off on + decision / shipment / change", "즉시 진행하지 않고 잠시 미루는 뜻입니다.", "승인 대기, 고객 확인 대기, 문서 보완 대기에 좋습니다.", "hold on 과 혼동하지 않습니다.", ["planning", "approval"], ["shipment release", "final decision", "spec change"]],
    ["point-out", "point out", "지적하다", "intermediate", "phrasal-verb", "point out + issue / difference", "문제나 차이점을 상대에게 명확히 보여줄 때 씁니다.", "검토 코멘트, 리스크 공유, 가격 차이 설명에 자주 사용됩니다.", "point out about 는 불필요합니다.", ["review", "communication"], ["mismatch", "risk", "difference"]],
    ["lean-on", "lean on", "의지하다, 압박하다", "advanced", "phrasal-verb", "lean on + team / supplier", "협조 요청이 강한 뉘앙스를 가질 수 있습니다.", "납기 압박, 빠른 회신 요청, 추가 지원 요청에 적합합니다.", "공식 문서에서는 overly aggressive 하게 보이지 않도록 주의합니다.", ["supplier", "management"], ["the supplier", "the logistics team", "the factory"]],
    ["break-down", "break down", "세분화하다", "intermediate", "phrasal-verb", "break down + cost / process / task", "큰 항목을 더 작은 부분으로 나눌 때 씁니다.", "원가 구조, 일정, 단계별 책임 설명에 매우 유용합니다.", "고장나다 의미도 있으므로 문맥을 분명히 합니다.", ["analysis", "pricing"], ["cost structure", "timeline", "task list"]],
    ["tie-up", "tie up", "묶다, 지연시키다", "advanced", "phrasal-verb", "tie up + capital / inventory / resources", "자원이 묶여 비효율이 생길 때 씁니다.", "재고 과다, 승인 지연, 자금 부담 설명에 적합합니다.", "긍정적 제휴 의미의 tie-up 과 문맥으로 구분합니다.", ["finance", "inventory"], ["working capital", "inventory", "engineering resources"]],
    ["turn-around", "turn around", "반전시키다, 회전시키다", "advanced", "phrasal-verb", "turn around + performance / issue", "상황을 개선해 반전시킨다는 뜻이 강합니다.", "실적 회복, 불량 개선, 응답시간 개선에 씁니다.", "turnaround 는 명사형으로도 자주 쓰입니다.", ["performance", "quality"], ["response time", "performance trend", "claim rate"]],
    ["pull-together", "pull together", "함께 정리하다", "intermediate", "phrasal-verb", "pull together + data / file / proposal", "여러 정보를 모아 하나의 산출물로 만들 때 씁니다.", "견적 패키지, 월간 보고, 검토 자료 묶음에 적합합니다.", "pull up 과 혼동하지 않습니다.", ["documents", "reporting"], ["proposal", "report pack", "review data"]],
    ["move-forward-with", "move forward with", "진행하다", "intermediate", "pattern", "move forward with + plan / supplier / option", "의사결정 후 실제 실행으로 넘어갈 때 씁니다.", "프로젝트 승인, 발주 진행, 공급사 선정 이후 자주 나옵니다.", "go forward with 도 가능하지만 move forward with 가 더 자연스럽습니다.", ["project", "decision"], ["the plan", "the selected supplier", "the revised scope"]],
    ["be-on-track-to", "be on track to", "~할 순조로운 상태다", "intermediate", "pattern", "be on track to + verb / target", "일정이나 목표 달성 가능성을 나타냅니다.", "양산 준비, 매출 목표, 인증 일정 보고에 좋습니다.", "on the track 는 부자연스럽습니다.", ["reporting", "planning"], ["hit the target", "meet the deadline", "complete the audit"]],
    ["be-subject-to", "be subject to", "~에 따라 달라지다", "advanced", "pattern", "be subject to + approval / change / review", "아직 확정되지 않았음을 공식적으로 표현합니다.", "가격, 선적일, 사양 변경 가능성을 표현할 때 자주 사용됩니다.", "subject for 와 혼동하지 않습니다.", ["legal", "documents"], ["final approval", "stock availability", "customs review"]],
    ["be-aligned-with", "be aligned with", "~와 일치하다", "advanced", "pattern", "be aligned with + strategy / requirement / plan", "정책, 요구사항, 목표와 정합성을 말할 때 씁니다.", "내부 보고와 고객 커뮤니케이션 모두에 잘 맞습니다.", "align on 과는 구조가 다릅니다.", ["strategy", "management"], ["the client brief", "the launch plan", "the quality standard"]],
    ["be-accountable-for", "be accountable for", "~에 책임이 있다", "advanced", "pattern", "be accountable for + result / task", "소유권과 책임을 명확히 할 때 씁니다.", "역할 정의, 프로젝트 운영, KPI 관리에 자주 씁니다.", "responsible for 와 비슷하지만 더 강한 책임감을 줍니다.", ["management", "ownership"], ["the final output", "the action item", "the document review"]],
    ["be-expected-to", "be expected to", "~할 것으로 기대되다", "intermediate", "pattern", "be expected to + verb", "상대방에게 강하게 요구하지 않고 기대 수준을 제시합니다.", "공급사 안내, 마감 공지, 검토 요청 문장에 적합합니다.", "expect to 와 수동 구조를 혼동하지 않습니다.", ["communication", "expectations"], ["reply within 24 hours", "submit the file", "confirm the schedule"]],
    ["be-eligible-for", "be eligible for", "~의 대상이 되다", "advanced", "pattern", "be eligible for + program / rebate / approval", "조건 충족 여부를 설명할 때 씁니다.", "지원금, 특별가, 인증 대상, 파일 승인에 잘 맞습니다.", "qualify for 와 비슷하지만 조금 더 공식적입니다.", ["compliance", "pricing"], ["the rebate", "the pilot program", "the approval window"]],
    ["be-keen-to", "be keen to", "~하고 싶어 하다", "intermediate", "pattern", "be keen to + verb", "영국식 비즈니스 영어에서 자주 보이는 표현입니다.", "협업 의지, 테스트 참여, 회신 의사를 부드럽게 전달합니다.", "너무 캐주얼한 상황은 피하고 맥락에 맞게 씁니다.", ["email", "relationship"], ["review the proposal", "join the call", "move ahead"]],
    ["be-positioned-to", "be positioned to", "~할 위치에 있다", "advanced", "pattern", "be positioned to + verb / benefit", "조직이나 제품의 전략적 위치를 말할 때 씁니다.", "시장 확장, 가격 경쟁력, 공급망 대응력을 설명할 때 유용합니다.", "be in position to 와 유사하지만 더 전략적입니다.", ["strategy", "market"], ["expand faster", "win the bid", "support the rollout"]],
    ["be-better-off", "be better off", "~하는 편이 낫다", "advanced", "pattern", "be better off + gerund / with noun", "대안 비교 시 실무적으로 더 나은 선택을 제안합니다.", "일정, 공급사, 포장 방식, 결제 조건 비교에 좋습니다.", "better to do 보다 더 판단형 느낌입니다.", ["negotiation", "decision"], ["waiting one more week", "using the revised pack", "switching suppliers"]],
    ["be-due-to", "be due to", "~할 예정이다", "intermediate", "pattern", "be due to + verb / noun", "예정된 일정이나 마감을 말할 때 씁니다.", "출고, 입항, 회의, 검토 마감 안내에 자주 사용됩니다.", "because of 의미의 due to 와 구분해야 합니다.", ["planning", "schedule"], ["ship tomorrow", "arrive next week", "be reviewed today"]],
    ["there-is-room-to", "there is room to", "~할 여지가 있다", "advanced", "pattern", "there is room to + improve / adjust", "정면 비판 대신 개선 가능성을 부드럽게 표현합니다.", "가격 조정, 문구 수정, 일정 보완 등 협상에 매우 유용합니다.", "room for improvement 도 자주 함께 씁니다.", ["negotiation", "feedback"], ["improve the draft", "adjust the price", "streamline the process"]],
    ["it-comes-down-to", "it comes down to", "결국 ~의 문제다", "advanced", "pattern", "it comes down to + noun / clause", "논의의 핵심을 요약할 때 좋습니다.", "가격, 속도, 품질, 책임소재를 압축 정리할 때 유용합니다.", "문장 앞부분에서 요약형으로 많이 씁니다.", ["analysis", "decision"], ["timing", "cost control", "supplier discipline"]],
    ["we-are-looking-to", "be looking to", "~하려고 한다", "intermediate", "pattern", "be looking to + verb", "상대에게 방향성과 의도를 부드럽게 설명합니다.", "신규 공급사 탐색, 가격 개선, 제품 확대 요청에 적합합니다.", "look to do 와는 다르게 진행 의지를 담습니다.", ["sales", "strategy"], ["expand the range", "reduce lead time", "review alternatives"]],
    ["we-are-in-a-position-to", "be in a position to", "~할 수 있는 상황이다", "advanced", "pattern", "be in a position to + verb", "권한, 준비, 자원 측면에서 가능 여부를 설명합니다.", "승인 가능, 출하 가능, 지원 가능 여부를 공식적으로 말할 때 씁니다.", "can 보다 더 공식적인 톤입니다.", ["approval", "operations"], ["approve the sample", "release the payment", "support the launch"]],
    ["it-would-help-if", "it would help if", "~하면 도움이 된다", "intermediate", "pattern", "it would help if + clause", "직접 명령 대신 정중한 요청을 만들 때 매우 좋습니다.", "추가자료 요청, 빠른 회신 요청, 포맷 수정 요청에 유용합니다.", "상대방 배려가 필요한 이메일에 적합합니다.", ["email", "polite request"], ["you shared the file today", "the supplier confirmed the spec", "we received the serial number"]],
    ["this-is-intended-to", "be intended to", "~하도록 설계되다", "advanced", "pattern", "be intended to + verb", "제품 기능, 문서 목적, 정책 목적을 설명할 때 씁니다.", "기술 문서와 정책 문서에서 모두 유용합니다.", "intend for 와의 구조 차이를 주의합니다.", ["product", "documents"], ["support outdoor use", "reduce claims", "speed up approval"]],
    ["be-required-to", "be required to", "~해야 한다", "intermediate", "pattern", "be required to + verb", "의무 사항이나 필수 절차를 설명할 때 씁니다.", "문서 제출, 검토 기준, 파일 업로드 규칙 안내에 적합합니다.", "must 보다 조금 더 제도적이고 객관적입니다.", ["compliance", "documents"], ["submit the report", "upload the certificate", "follow the format"]],
    ["be-committed-to", "be committed to", "~에 전념하다", "advanced", "pattern", "be committed to + noun / gerund", "조직의 태도나 공급사의 의지를 표현할 때 자주 씁니다.", "품질 개선, 납기 준수, 장기 협업 의지 표현에 유용합니다.", "commit for 와 혼동하지 않습니다.", ["relationship", "management"], ["continuous improvement", "on-time delivery", "transparent communication"]],
    ["be-contingent-on", "be contingent on", "~에 달려 있다", "advanced", "pattern", "be contingent on + noun", "조건부 진행을 명확하게 표현하는 공식 문구입니다.", "가격, 일정, 발주 확정, 출고 일정 설명에 자주 나옵니다.", "depend on 과 비슷하지만 더 공식적입니다.", ["legal", "planning"], ["final approval", "test results", "payment receipt"]],
    ["be-open-to", "be open to", "~에 열려 있다", "intermediate", "pattern", "be open to + noun / gerund", "대안이나 제안을 유연하게 검토한다는 뜻입니다.", "사양 변경, 신규 포장, 가격 조정 대화에 자연스럽습니다.", "open for 와 구분합니다.", ["negotiation", "communication"], ["a revised timeline", "changing the supplier", "reviewing a pilot run"]],
  ];

  return raw.map(
    (item): BaseExpression => ({
      id: item[0],
      expression: item[1],
      korean: item[2],
      level: item[3] as EnglishLevel,
      kind: item[4] as EntryKind,
      grammarPattern: item[5],
      grammarFocus: item[6],
      usageNote: item[7],
      commonMistake: item[8],
      categories: [...item[9]],
      collocations: [...item[10]],
      answerTemplate: "{subject} {modal} " + item[1] + " {object} {time}.",
      objectTemplates: [
        "the {scenario}",
        "{object}",
        "the {scenario} update",
      ],
      exampleTemplates: [
        {
          en: "We need to " + item[1] + " {object} before the deadline.",
          kr: "마감 전에 {objectKr} 관련 업무를 " + item[2] + " 해야 합니다.",
        },
        {
          en: "The team used the expression \"" + item[1] + "\" in the {scenario} discussion.",
          kr: "{scenarioKr} 논의에서 이 표현을 실제 업무 문장으로 사용했습니다.",
        },
      ],
    })
  );
}

const BASE_EXPRESSIONS = createBaseExpressions();

function replaceScenarioTokens(template: string, scenario: DomainScenario, object: string) {
  const objectKr = object
    .replace(/^the /, "")
    .replace(/^a /, "")
    .replace(/^an /, "");

  return template
    .replaceAll("{scenario}", scenario.label)
    .replaceAll("{scenarioKr}", `${scenario.label} 업무`)
    .replaceAll("{object}", object)
    .replaceAll("{objectKr}", objectKr);
}

function buildEntry(base: BaseExpression, scenario: DomainScenario, object: string, variantIndex: number): EnglishEntry {
  const objectPool = base.objectTemplates.map((template) =>
    replaceScenarioTokens(template, scenario, object)
  );

  return {
    id: `${base.id}-${scenario.slug}-${variantIndex}`,
    expression: base.expression,
    korean: base.korean,
    baseExpression: base.expression,
    scenarioLabel: scenario.label,
    focusObject: object,
    variantLabel: `${scenario.productTag.toUpperCase()} ${variantIndex + 1}`,
    level: base.level,
    kind: base.kind,
    grammarPattern: base.grammarPattern,
    grammarFocus: `${base.grammarFocus} ${scenario.label} 문맥과 ${object} 같은 실제 업무 대상을 붙여 반복 훈련하도록 확장했습니다.`,
    usageNote: `${base.usageNote} 현재 선택 문맥은 ${scenario.label} / ${object} 입니다.`,
    commonMistake: base.commonMistake,
    categories: [...new Set([...base.categories, ...scenario.categories])],
    collocations: [...new Set([...base.collocations, scenario.productTag, ...scenario.objects.map((item) => item.replace(/^the /, ""))])],
    objectPool,
    answerTemplate: base.answerTemplate,
    examples: base.exampleTemplates.map((example) => ({
      en: replaceScenarioTokens(example.en, scenario, object),
      kr: replaceScenarioTokens(example.kr, scenario, object),
    })),
  };
}

function buildEntries() {
  return BASE_EXPRESSIONS.flatMap((base) =>
    base.collocations.flatMap((object, objectIndex) =>
      PRACTICE_CONTEXTS.map((context, contextIndex) => {
        const expression = base.expression;
        const sentence = expression.startsWith("be ")
          ? `The team is ${expression.slice(3)} ${object}.`
          : expression === "behind schedule"
            ? "The project is behind schedule."
            : expression.startsWith("there is") || expression.startsWith("it comes down to")
              ? `${capitalizeSentence(expression)} ${object}.`
              : expression.startsWith("would you mind")
                ? `Would you mind ${object}?`
                : expression.startsWith("as part of")
                  ? `We updated the plan ${expression} ${object}.`
                  : `The team should ${expression} ${object} this week.`;

        return {
          id: `${base.id}-${objectIndex}-${contextIndex}`,
          expression,
          korean: base.korean,
          baseExpression: `${expression} · ${object}`,
          scenarioLabel: context,
          focusObject: object,
          variantLabel: `Business context ${contextIndex + 1}`,
          level: base.level,
          kind: base.kind,
          grammarPattern: base.grammarPattern,
          grammarFocus: base.grammarFocus,
          usageNote: base.usageNote,
          commonMistake: base.commonMistake,
          categories: [...new Set([...base.categories, "business-english", context])],
          collocations: base.collocations,
          objectPool: base.collocations,
          answerTemplate: sentence,
          examples: [
            { en: sentence, kr: `${context} 상황에서 ${base.korean} 의미로 쓰는 기본 업무 문장입니다.` },
            {
              en: `Use "${expression}" with ${base.grammarPattern.replace(`${expression} + `, "")}.`,
              kr: `${base.grammarPattern} 문형을 그대로 유지해 사용하세요.`,
            },
          ],
        };
      })
    )
  );
}

function wordNetText(value: string | { text: string; source: string } | undefined) {
  return typeof value === "string" ? value : value?.text ?? "";
}

const GENERAL_ENGLISH_ENTRIES: EnglishEntry[] = OPEN_WORDNET_CORE.map((item, index) => {
  const definition = wordNetText(item.definition);
  const example = wordNetText(item.example);

  return {
  id: `wordnet-${index}-${item.pos}`,
  expression: item.term,
  korean: "일반 영어 핵심 표현",
  baseExpression: item.term,
  scenarioLabel: "일반 영어",
  focusObject: item.pos === "v" ? "verb" : item.pos === "n" ? "noun" : item.pos === "r" ? "adverb" : "adjective",
  variantLabel: "Open English WordNet",
  level: index % 2 === 0 ? "intermediate" : "advanced",
  kind: "pattern",
  grammarPattern: item.pos === "v" ? "verb" : item.pos === "n" ? "noun" : item.pos === "r" ? "adverb" : "adjective",
  grammarFocus: definition,
  usageNote: "Open English WordNet의 정의와 예문을 바탕으로 학습합니다.",
  commonMistake: "단어의 품사와 예문 문맥을 함께 확인하세요.",
  categories: ["general-english", "open-wordnet", item.pos],
  collocations: [item.term],
  objectPool: [item.term],
  answerTemplate: example || definition,
  examples: [
    { en: example || definition, kr: "Open English WordNet 정의를 바탕으로 한 일반 영어 학습 항목입니다." },
    { en: definition, kr: "영어 정의를 읽고 뜻과 쓰임을 확인하세요." },
  ],
  };
});

export const ENGLISH_ENTRIES: EnglishEntry[] = [...buildEntries(), ...GENERAL_ENGLISH_ENTRIES];

export const ENGLISH_CATEGORIES = Array.from(
  new Set(ENGLISH_ENTRIES.flatMap((entry) => entry.categories))
).sort();

export function createPracticeCard(entry: EnglishEntry, seed: number): PracticeCard {
  const subject = ROLE_SUBJECTS[seed % ROLE_SUBJECTS.length];
  const object = entry.objectPool[seed % entry.objectPool.length];
  const time = TIME_MARKERS[seed % TIME_MARKERS.length];
  const taskType = TASK_TYPES[seed % TASK_TYPES.length];
  const context = PRACTICE_CONTEXTS[seed % PRACTICE_CONTEXTS.length];
  const example = entry.examples[0];
  const answer = example.en;

  switch (taskType) {
    case "빈칸 완성":
      return {
        id: `${entry.id}-${seed}-blank`,
        entryId: entry.id,
        expression: entry.expression,
        level: entry.level,
        taskType,
        prompt: `[${context}]\n${example.en.replace(entry.expression, "________")}\n어떤 표현이 가장 자연스러운지 채워 보세요.`,
        answer: entry.expression,
        explanation: `${entry.expression} 은 ${entry.grammarPattern} 구조로 쓰입니다.`,
      };
    case "업무 문장 작성":
      return {
        id: `${entry.id}-${seed}-write`,
        entryId: entry.id,
        expression: entry.expression,
        level: entry.level,
        taskType,
        prompt: `[${context}] 다음 조건을 만족하는 영어 문장을 직접 만들어 보세요.\n- 주어: ${subject}\n- 표현: ${entry.expression}\n- 어울리는 대상: ${object}\n- 시점: ${time}`,
        answer,
        explanation: `${entry.korean} 의미를 유지하면서 가장 기본적인 업무 문장으로 풀어 쓴 답입니다.`,
      };
    case "문법 포인트":
      return {
        id: `${entry.id}-${seed}-grammar`,
        entryId: entry.id,
        expression: entry.expression,
        level: entry.level,
        taskType,
        prompt: `[${context}]\n${entry.expression}\n문형: ${entry.grammarPattern}\n이 표현의 문형과 핵심 용법을 설명해 보세요.`,
        answer,
        explanation: entry.grammarFocus,
      };
    case "번역 힌트":
      return {
        id: `${entry.id}-${seed}-translate`,
        entryId: entry.id,
        expression: entry.expression,
        level: entry.level,
        taskType,
        prompt: `[${context}]\n${example.kr}\n핵심 표현을 사용해 영어로 옮겨 보세요.`,
        answer,
        explanation: `${entry.korean} 에 맞는 기본 번역 패턴입니다.`,
      };
    case "실수 교정":
      return {
        id: `${entry.id}-${seed}-fix`,
        entryId: entry.id,
        expression: entry.expression,
        level: entry.level,
        taskType,
        prompt: `[${context}] 다음 표현의 흔한 오류를 확인하고 올바른 문형을 말해 보세요.\n${entry.expression}`,
        answer,
        explanation: entry.commonMistake,
      };
    default:
      return {
        id: `${entry.id}-${seed}-collocation`,
        entryId: entry.id,
        expression: entry.expression,
        level: entry.level,
        taskType,
        prompt: `[${context}]\n${entry.expression} 와 가장 잘 어울리는 업무 대상은 무엇인지 설명해 보세요.\n추천 collocations: ${entry.collocations.slice(0, 4).join(", ")}`,
        answer,
        explanation: `이 표현은 ${entry.collocations.join(", ")} 같은 업무 명사와 자주 함께 쓰입니다.`,
      };
  }
}

export function practiceUniverseSize(entries = ENGLISH_ENTRIES) {
  return entries.reduce((total, entry) => {
    return (
      total +
      entry.objectPool.length *
        ROLE_SUBJECTS.length *
        TIME_MARKERS.length *
        TASK_TYPES.length *
        PRACTICE_CONTEXTS.length
    );
  }, 0);
}

export function countByLevel(level: EnglishLevel) {
  const entries = ENGLISH_ENTRIES.filter((entry) => entry.level === level);
  return {
    entries: entries.length,
    drills: practiceUniverseSize(entries),
  };
}
