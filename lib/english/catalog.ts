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

function toTitleCase(value: string) {
  return value.replace(/\b[a-z]/g, (char) => char.toUpperCase());
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

    // ── 추가 Intermediate phrasal verbs ──────────────────────────────────────
    ["reach-out-to", "reach out to", "연락하다", "intermediate", "phrasal-verb", "reach out to + person / team", "상대방에게 먼저 연락을 취할 때 씁니다.", "이메일, 전화, 메시지 모두에서 자연스럽게 씁니다.", "reach out for someone 은 부자연스럽습니다.", ["email", "communication"], ["the client", "the supplier", "the logistics team"]],
    ["look-into", "look into", "조사하다, 파악하다", "intermediate", "phrasal-verb", "look into + issue / option", "문제 원인이나 가능성을 파악할 때 씁니다.", "클레임 원인, 가격 옵션, 대안 공급사 조사에 자주 씁니다.", "look at 보다 더 깊이 들여다보는 뉘앙스입니다.", ["analysis", "quality"], ["the root cause", "the alternatives", "the complaint"]],
    ["keep-track-of", "keep track of", "추적 관리하다", "intermediate", "phrasal-verb", "keep track of + data / orders", "일정이나 현황을 놓치지 않게 관리할 때 씁니다.", "발주 현황, 비용, 납기 추적에 자주 씁니다.", "track 만 쓸 수도 있지만 keep track of 가 더 구체적입니다.", ["operations", "planning"], ["open orders", "expenses", "deadlines"]],
    ["take-care-of", "take care of", "처리하다, 담당하다", "intermediate", "phrasal-verb", "take care of + task / issue", "문제나 업무를 책임지고 처리할 때 씁니다.", "서류 준비, 이슈 대응, 고객 요청 처리에 자주 씁니다.", "handle 과 비슷하지만 더 자연스럽습니다.", ["operations", "support"], ["the paperwork", "the complaint", "the arrangement"]],
    ["put-off", "put off", "미루다, 연기하다", "intermediate", "phrasal-verb", "put off + meeting / decision", "일정이나 결정을 나중으로 미룰 때 씁니다.", "고객 방문 연기, 승인 보류, 출하 지연에 씁니다.", "postpone 보다 구어적입니다.", ["planning", "schedule"], ["the review", "the shipment", "the decision"]],
    ["follow-through-on", "follow through on", "끝까지 완수하다", "intermediate", "phrasal-verb", "follow through on + commitment / action", "약속한 일을 실제로 완수할 때 씁니다.", "액션 아이템 이행, 납기 약속 준수, 요청 처리 확인에 씁니다.", "follow up on 보다 실행 완수에 초점입니다.", ["operations", "management"], ["the action items", "the commitment", "the promise"]],
    ["deal-with", "deal with", "다루다, 해결하다", "intermediate", "phrasal-verb", "deal with + issue / complaint", "문제나 불만을 처리할 때 씁니다.", "클레임, 납기 지연, 비용 이슈 처리에 자주 씁니다.", "handle 과 비슷하지만 deal with 는 더 어려운 상황에 씁니다.", ["support", "quality"], ["the complaint", "the delay", "the budget issue"]],
    ["come-up-with", "come up with", "생각해내다, 제안하다", "intermediate", "phrasal-verb", "come up with + solution / plan", "창의적 해결책이나 아이디어를 낼 때 씁니다.", "대안 제안, 문제 해결 방법, 마케팅 아이디어 발표에 씁니다.", "think of 와 비슷하지만 더 능동적인 느낌입니다.", ["strategy", "problem-solving"], ["a solution", "a better approach", "an alternative plan"]],
    ["run-through", "run through", "빠르게 검토하다", "intermediate", "phrasal-verb", "run through + agenda / file", "회의 전 또는 중에 빠르게 살펴볼 때 씁니다.", "안건 확인, 계약 요약, 보고 항목 점검에 씁니다.", "go over 와 유사하지만 속도감이 더 강합니다.", ["meeting", "documents"], ["the agenda", "the key points", "the checklist"]],
    ["pass-on", "pass on", "전달하다", "intermediate", "phrasal-verb", "pass on + information / feedback", "정보나 피드백을 다음 사람에게 전할 때 씁니다.", "고객 피드백, 회의 결과, 업데이트 공유에 씁니다.", "pass along 과 거의 같습니다.", ["communication", "email"], ["the feedback", "the update", "the client request"]],
    ["narrow-down", "narrow down", "범위를 좁히다", "intermediate", "phrasal-verb", "narrow down + options / list", "여러 선택지 중 최종 후보를 줄일 때 씁니다.", "공급사 선정, 비용 항목 검토, 일정 선택에 씁니다.", "short-list 와 유사한 의미로 쓰입니다.", ["decision", "analysis"], ["the supplier list", "the options", "the candidates"]],
    ["take-on", "take on", "맡다, 담당하다", "intermediate", "phrasal-verb", "take on + responsibility / client", "추가 업무나 책임을 수락할 때 씁니다.", "신규 고객 담당, 프로젝트 추가, 역할 확대에 씁니다.", "take over 와 다르게 자발적 의사가 강합니다.", ["management", "hr"], ["the new account", "the project", "more responsibility"]],
    ["fill-in-for", "fill in for", "대신하다", "intermediate", "phrasal-verb", "fill in for + colleague", "동료가 자리를 비울 때 대신 맡을 때 씁니다.", "출장, 휴가, 병가 대응에 자주 씁니다.", "cover for 와 비슷하게 씁니다.", ["hr", "operations"], ["the account manager", "the team lead", "the coordinator"]],
    ["draw-up", "draw up", "작성하다, 문서화하다", "intermediate", "phrasal-verb", "draw up + contract / plan", "공식 문서나 계획서를 작성할 때 씁니다.", "계약서, 제안서, 일정표 작성에 씁니다.", "draft 와 거의 같지만 더 구어적입니다.", ["documents", "legal"], ["the contract", "the proposal", "the action plan"]],
    ["gear-up-for", "gear up for", "준비하다", "intermediate", "phrasal-verb", "gear up for + launch / season", "다가올 중요한 이벤트를 위해 준비할 때 씁니다.", "제품 출시, 성수기, 감사 대비에 씁니다.", "prepare for 와 비슷하지만 더 역동적입니다.", ["planning", "operations"], ["the product launch", "the peak season", "the audit"]],
    ["catch-up-on", "catch up on", "밀린 걸 따라잡다", "intermediate", "phrasal-verb", "catch up on + emails / work", "밀린 업무나 정보를 따라잡을 때 씁니다.", "이메일 처리, 회의 내용 파악, 업무 복귀에 씁니다.", "catch up with 는 사람 만남에, catch up on 은 업무에 씁니다.", ["email", "communication"], ["the emails", "the latest updates", "the missed report"]],
    ["stand-by", "stand by", "대기하다, 지원하다", "intermediate", "phrasal-verb", "stand by + for update / to assist", "준비 상태를 유지하거나 지원을 약속할 때 씁니다.", "회신 대기 요청, 출하 준비, 현장 지원 대기에 씁니다.", "stand by for 와 stand by 를 상황에 맞게 씁니다.", ["operations", "support"], ["for the update", "the loading", "to assist the team"]],
    ["opt-for", "opt for", "선택하다", "intermediate", "phrasal-verb", "opt for + solution / method", "대안 중에서 하나를 선택할 때 씁니다.", "배송 방법, 결제 조건, 포장 옵션 선택에 씁니다.", "choose 와 비슷하지만 더 공식적입니다.", ["decision", "negotiation"], ["the faster shipping method", "the alternative packaging", "the split payment"]],
    ["wrap-up", "wrap up", "마무리하다", "intermediate", "phrasal-verb", "wrap up + meeting / task", "회의나 업무를 끝낼 때 씁니다.", "회의 종료, 주간 보고, 프로젝트 마감에 씁니다.", "finish 와 같지만 더 구어적이고 자연스럽습니다.", ["meeting", "project"], ["the meeting", "the week", "the review session"]],
    ["kick-off", "kick off", "시작하다", "intermediate", "phrasal-verb", "kick off + project / meeting", "프로젝트나 활동의 첫 시작을 알릴 때 씁니다.", "킥오프 회의, 캠페인 시작, 시즌 오픈에 씁니다.", "launch 보다 더 활동적이고 팀워크 느낌이 있습니다.", ["project", "meeting"], ["the project", "the kickoff call", "the campaign"]],
    ["think-through", "think through", "충분히 검토하다", "intermediate", "phrasal-verb", "think through + plan / approach", "결정을 내리기 전 충분히 고민할 때 씁니다.", "가격 정책, 전략 방향, 대안 비교에 씁니다.", "think about 보다 더 깊고 체계적인 검토를 뜻합니다.", ["strategy", "decision"], ["the approach", "the implications", "the risk"]],

    // ── 추가 Advanced phrasal verbs ──────────────────────────────────────────
    ["double-down-on", "double down on", "강하게 밀어붙이다", "advanced", "phrasal-verb", "double down on + strategy / effort", "어려운 상황에서도 전략을 더 강화할 때 씁니다.", "시장 개척, 품질 개선, 비용 절감 집중에 씁니다.", "이미 진행 중인 노력을 두 배로 강화하는 뉘앙스입니다.", ["strategy", "management"], ["the cost reduction effort", "the supplier partnership", "the quality program"]],
    ["pivot-away-from", "pivot away from", "방향을 바꾸다", "advanced", "phrasal-verb", "pivot away from + old approach", "기존 방식을 버리고 새로운 방향으로 전환할 때 씁니다.", "공급망 변경, 유통 채널 전환, 제품 전략 변경에 씁니다.", "move away from 과 비슷하지만 더 전략적 어조입니다.", ["strategy", "market"], ["the legacy system", "the old supplier base", "cost-only bidding"]],
    ["drill-down-into", "drill down into", "세밀하게 분석하다", "advanced", "phrasal-verb", "drill down into + data / root cause", "표면 데이터 너머의 원인을 깊이 분석할 때 씁니다.", "KPI 원인 분석, 비용 구조 해석, 불량 원인 추적에 씁니다.", "drill into 라고도 자주 씁니다.", ["analysis", "quality"], ["the margin data", "the root cause", "the variance"]],
    ["flag-up", "flag up", "주의를 환기시키다", "advanced", "phrasal-verb", "flag up + risk / issue", "중요한 문제나 리스크를 팀이나 상부에 알릴 때 씁니다.", "납기 위험, 품질 이슈, 규정 위반 가능성 보고에 씁니다.", "bring to attention 과 비슷한 의미입니다.", ["risk", "reporting"], ["the delay risk", "the compliance gap", "the cost overrun"]],
    ["push-back-on", "push back on", "반대 의견을 제기하다", "advanced", "phrasal-verb", "push back on + demand / decision", "무리한 요구나 결정에 반대 입장을 표명할 때 씁니다.", "가격 인하 요구, 일정 단축 요구, 사양 변경 요구에 씁니다.", "resist 보다 더 세련된 비즈니스 표현입니다.", ["negotiation", "management"], ["the unrealistic timeline", "the price demand", "the scope change"]],
    ["carve-out", "carve out", "따로 확보하다", "advanced", "phrasal-verb", "carve out + time / budget / niche", "특정 목적을 위해 자원이나 공간을 별도로 확보할 때 씁니다.", "예산 확보, 시간 확보, 틈새 시장 개척에 씁니다.", "set aside 와 비슷하지만 더 전략적 느낌입니다.", ["strategy", "finance"], ["budget", "time for a pilot", "a new market segment"]],
    ["shore-up", "shore up", "강화하다, 떠받치다", "advanced", "phrasal-verb", "shore up + relationship / process", "약해진 무언가를 보완하고 강화할 때 씁니다.", "공급사 관계, 내부 프로세스, 재고 완충에 씁니다.", "reinforce 나 strengthen 보다 더 실용적인 뉘앙스입니다.", ["management", "operations"], ["the supplier relationship", "the buffer stock", "the process gap"]],
    ["pare-down", "pare down", "줄이다, 간소화하다", "advanced", "phrasal-verb", "pare down + cost / scope", "비용이나 범위를 최소한으로 줄일 때 씁니다.", "운영 비용, SKU 수, 프로젝트 범위 축소에 씁니다.", "cut down 보다 더 세밀하게 다듬는 느낌입니다.", ["finance", "strategy"], ["the budget", "the SKU list", "the project scope"]],
    ["trickle-down", "trickle down", "점차 내려오다", "advanced", "phrasal-verb", "trickle down + effect / savings", "위에서 아래로 효과가 점차 전달될 때 씁니다.", "정책 효과, 비용 절감, 전략 실행 결과 설명에 씁니다.", "부정적 맥락에서는 느린 진행을 비판할 때도 씁니다.", ["strategy", "finance"], ["the cost savings", "the policy changes", "the efficiency gains"]],
    ["hedge-against", "hedge against", "위험에 대비하다", "advanced", "phrasal-verb", "hedge against + risk / volatility", "리스크를 분산하거나 대비할 때 씁니다.", "환율 변동, 원자재 가격 상승, 공급 중단에 씁니다.", "금융 외에도 공급망 전략에서도 자주 씁니다.", ["finance", "risk"], ["currency risk", "supply disruption", "price volatility"]],
    ["pivot-toward", "pivot toward", "방향을 전환하다", "advanced", "phrasal-verb", "pivot toward + new market / approach", "새로운 기회나 전략으로 방향을 전환할 때 씁니다.", "신시장 진출, 디지털 전환, 신제품 포트폴리오에 씁니다.", "pivot away from 과 반대 방향으로 씁니다.", ["strategy", "market"], ["direct sales", "sustainable materials", "the premium segment"]],
    ["streamline", "streamline", "효율화하다", "advanced", "phrasal-verb", "streamline + process / workflow", "복잡한 과정을 단순하고 효율적으로 만들 때 씁니다.", "승인 프로세스, 주문 흐름, 보고 구조 개선에 씁니다.", "동사 그대로 쓰거나 streamline the process 형태로 씁니다.", ["operations", "strategy"], ["the approval workflow", "the ordering process", "reporting"]],
    ["leverage", "leverage", "활용하다", "advanced", "phrasal-verb", "leverage + data / relationship / technology", "보유한 자원이나 관계를 전략적으로 활용할 때 씁니다.", "데이터 분석 활용, 파트너십 활용, 기술 활용에 씁니다.", "use 보다 전략적이고 가치를 극대화하는 느낌입니다.", ["strategy", "management"], ["the existing relationship", "market data", "the platform"]],
    ["benchmark-against", "benchmark against", "비교 기준으로 삼다", "advanced", "phrasal-verb", "benchmark against + competitor / standard", "경쟁사나 업계 기준과 비교 평가할 때 씁니다.", "가격, 품질, 납기, KPI를 비교 분석할 때 씁니다.", "compare to 보다 더 체계적인 평가 뉘앙스입니다.", ["analysis", "strategy"], ["industry standards", "competitors", "last year's results"]],
    ["quantify", "quantify", "수치화하다", "advanced", "phrasal-verb", "quantify + impact / saving / risk", "추상적 효과를 숫자로 표현할 때 씁니다.", "비용 절감 효과, 리스크 규모, 품질 영향 측정에 씁니다.", "measure 보다 더 정량적인 분석을 암시합니다.", ["analysis", "finance"], ["the cost impact", "the savings", "the operational risk"]],
    ["escalate", "escalate", "상위에 보고하다", "advanced", "phrasal-verb", "escalate + issue / complaint", "해결이 안 된 문제를 윗선에 올릴 때 씁니다.", "클레임, 납기 지연, 결정 보류 이슈 처리에 씁니다.", "escalate to management 형태로 자주 씁니다.", ["management", "support"], ["the complaint", "the delay issue", "the decision"]],
    ["validate", "validate", "검증하다", "advanced", "phrasal-verb", "validate + data / process / spec", "수치나 프로세스가 맞는지 공식적으로 확인할 때 씁니다.", "시험 결과 검증, 요구사항 확인, 데이터 정합성 검토에 씁니다.", "verify 와 비슷하지만 좀 더 체계적인 절차를 암시합니다.", ["quality", "documents"], ["the test data", "the specification", "the process outcome"]],
    ["consolidate", "consolidate", "통합하다", "advanced", "phrasal-verb", "consolidate + shipments / suppliers", "여러 항목을 하나로 합칠 때 씁니다.", "선적 통합, 공급사 수 감축, 보고 일원화에 씁니다.", "merge 와 비슷하지만 운영 효율 맥락이 강합니다.", ["logistics", "operations"], ["the shipments", "the supplier base", "the reporting"]],
    ["replicate", "replicate", "복제하다, 반복하다", "advanced", "phrasal-verb", "replicate + success / model / process", "성공한 방식을 다른 곳에서도 같은 방식으로 적용할 때 씁니다.", "성공 모델 확장, 파일럿 결과 본격 도입에 씁니다.", "copy 보다 더 체계적이고 공식적입니다.", ["strategy", "operations"], ["the pilot model", "the best practice", "the workflow"]],
    ["deprioritize", "deprioritize", "우선순위를 낮추다", "advanced", "phrasal-verb", "deprioritize + task / feature", "다른 것보다 덜 중요한 항목을 뒤로 미룰 때 씁니다.", "리소스 집중, 제품 로드맵 조정, 업무 재배분에 씁니다.", "postpone 과 달리 계속 진행하되 덜 중요하게 두는 것입니다.", ["management", "strategy"], ["the non-critical items", "the feature request", "the backlog"]],
    ["safeguard", "safeguard", "보호하다", "advanced", "phrasal-verb", "safeguard + interests / data / quality", "중요한 자산이나 이익을 지킬 때 씁니다.", "계약 조건, 데이터 보안, 품질 기준 보호에 씁니다.", "protect 보다 더 사전 예방적 느낌입니다.", ["legal", "compliance"], ["the client data", "the quality standard", "the business interest"]],

    // ── 추가 Intermediate patterns ───────────────────────────────────────────
    ["we-would-appreciate-if", "we would appreciate it if", "~해 주시면 감사하겠습니다", "intermediate", "pattern", "we would appreciate it if + clause", "정중한 요청을 이메일에서 표현할 때 씁니다.", "서류 제출, 회신, 확인 요청에 가장 유용한 표현 중 하나입니다.", "appreciate if 로 줄여 쓸 수 있지만 공식 이메일에선 완전한 형태를 씁니다.", ["email", "polite request"], ["you could confirm", "you sent the invoice", "you reviewed the draft"]],
    ["please-be-advised", "please be advised that", "안내 드립니다", "intermediate", "pattern", "please be advised that + clause", "중요한 공지나 변경사항을 상대에게 알릴 때 씁니다.", "납기 변경, 가격 인상, 정책 변경 공지에 적합합니다.", "공식 안내 이메일에서 첫 문장으로 자주 씁니다.", ["email", "formal"], ["the shipment has been delayed", "the price will increase", "the office will be closed"]],
    ["as-per-our-discussion", "as per our discussion", "논의한 대로", "intermediate", "pattern", "as per our discussion + verb", "이전 합의 내용을 재확인하거나 이행할 때 씁니다.", "이메일로 미팅 결과를 정리하거나 후속 조치를 알릴 때 씁니다.", "as discussed 와 비슷하지만 more formal 합니다.", ["email", "meeting"], ["I am sending the revised quote", "please find the updated plan", "we are proceeding with the order"]],
    ["please-find-attached", "please find attached", "첨부 파일을 확인해주세요", "intermediate", "pattern", "please find attached + document", "이메일 첨부 파일을 알릴 때 쓰는 공식 표현입니다.", "견적서, 계약서, 보고서 전달 이메일에 씁니다.", "I have attached 도 자연스럽지만 please find attached 가 더 공식적입니다.", ["email", "documents"], ["the revised quotation", "the signed contract", "the test report"]],
    ["as-agreed", "as agreed", "합의한 대로", "intermediate", "pattern", "as agreed + clause", "이전에 합의한 내용을 이행할 때 씁니다.", "가격, 일정, 조건 이행을 확인할 때 씁니다.", "as per our agreement 와 같은 뜻이지만 더 짧습니다.", ["email", "negotiation"], ["the shipment will leave on Monday", "the discount has been applied", "the spec has been updated"]],
    ["could-you-please", "could you please", "~해 주시겠어요", "intermediate", "pattern", "could you please + verb", "가장 기본적이고 자연스러운 공손 요청 표현입니다.", "확인 요청, 서류 전달 요청, 일정 확인에 씁니다.", "can you please 도 가능하지만 could you 가 더 공손합니다.", ["email", "communication"], ["confirm the order", "send the invoice", "check the schedule"]],
    ["let-me-know-if", "let me know if", "~하면 알려주세요", "intermediate", "pattern", "let me know if + clause", "상대방의 확인이나 회신을 요청할 때 씁니다.", "변경 사항, 질문, 문제 발생 시 연락 요청에 씁니다.", "please let me know if 로 쓰면 더 공식적입니다.", ["email", "communication"], ["you need more information", "there are any changes", "the schedule works for you"]],
    ["we-are-pleased-to", "we are pleased to", "기쁘게 ~합니다", "intermediate", "pattern", "we are pleased to + verb", "좋은 소식이나 확인 사항을 알릴 때 씁니다.", "주문 확인, 샘플 승인, 파트너십 체결 공지에 씁니다.", "we are happy to 와 비슷하지만 조금 더 공식적입니다.", ["email", "formal"], ["confirm your order", "inform you of the approval", "announce the partnership"]],
    ["please-note-that", "please note that", "참고해주세요", "intermediate", "pattern", "please note that + clause", "주의사항이나 예외 조건을 짚어줄 때 씁니다.", "마감일, 제한 조건, 변경된 절차 안내에 씁니다.", "문장 시작이나 중간에 모두 자연스럽습니다.", ["email", "formal"], ["the deadline is next Friday", "this offer is valid for 30 days", "stock is limited"]],
    ["going-forward", "going forward", "앞으로는", "intermediate", "pattern", "going forward, + clause", "앞으로 바뀌는 방침이나 프로세스를 안내할 때 씁니다.", "정책 변경, 새로운 절차, 향후 기대 사항 전달에 씁니다.", "in the future 와 비슷하지만 더 비즈니스 어조입니다.", ["management", "communication"], ["all orders should be confirmed by email", "please cc the finance team", "we will require 48 hours notice"]],
    ["in-line-with", "in line with", "~에 맞춰", "intermediate", "pattern", "in line with + policy / request / standard", "기준이나 요청에 맞게 행동할 때 씁니다.", "정책 준수, 고객 요구 반영, 표준 이행 설명에 씁니다.", "in accordance with 보다 덜 formal 하고 자연스럽습니다.", ["compliance", "communication"], ["your request", "the agreed terms", "the quality standard"]],
    ["with-that-in-mind", "with that in mind", "그점을 감안하면", "intermediate", "pattern", "with that in mind, + clause", "앞에서 언급한 조건이나 상황을 바탕으로 제안할 때 씁니다.", "전략 방향 제안, 결론 도출, 다음 단계 제시에 씁니다.", "accordingly 나 therefore 와 유사하지만 더 구어적입니다.", ["meeting", "strategy"], ["I suggest we adjust the plan", "let's prioritize the urgent items", "here is our proposal"]],
    ["at-this-stage", "at this stage", "현 단계에서는", "intermediate", "pattern", "at this stage + clause", "현재 진행 상황에서 무엇이 가능한지 설명할 때 씁니다.", "확인 가능한 사항, 결정 보류 중인 사항 안내에 씁니다.", "at this point 와 비슷하지만 공식 보고에 더 잘 어울립니다.", ["reporting", "planning"], ["we cannot confirm the delivery date", "the design is still under review", "we are awaiting approval"]],
    ["subject-to-change", "subject to change", "변경될 수 있음", "intermediate", "pattern", "subject to change + clause", "확정되지 않은 정보를 공유할 때 쓰는 면책 표현입니다.", "가격, 일정, 사양의 잠정 안내에 씁니다.", "please note that this is subject to change 형태로 자주 씁니다.", ["email", "planning"], ["without notice", "pending final approval", "based on current stock"]],
    ["rest-assured", "rest assured", "안심하세요", "intermediate", "pattern", "rest assured that + clause", "상대의 우려를 해소하고 확신을 줄 때 씁니다.", "납기 보장, 품질 확인, 대응 약속에 씁니다.", "you can rest assured that 으로 쓰면 더 자연스럽습니다.", ["email", "support"], ["we will meet the deadline", "the issue has been resolved", "we are monitoring the situation"]],
    ["moving-on-to", "moving on to", "다음으로 넘어가서", "intermediate", "pattern", "moving on to + topic / item", "회의에서 다음 안건으로 전환할 때 씁니다.", "프레젠테이션, 회의 진행, 보고 순서 이동에 씁니다.", "the next item on the agenda 와 함께 자주 씁니다.", ["meeting", "presentation"], ["the next agenda item", "our financial update", "the Q3 forecast"]],

    // ── 추가 Advanced patterns ───────────────────────────────────────────────
    ["it-bears-noting", "it bears noting that", "주목할 점은", "advanced", "pattern", "it bears noting that + clause", "중요하지만 간과하기 쉬운 사항을 강조할 때 씁니다.", "리스크, 예외 조건, 핵심 제약을 부각할 때 씁니다.", "it is worth noting that 과 같은 뜻으로 공식 보고에 씁니다.", ["reporting", "analysis"], ["our lead times have increased", "the cost structure has changed", "margins are under pressure"]],
    ["notwithstanding", "notwithstanding", "~에도 불구하고", "advanced", "pattern", "notwithstanding + noun / clause", "어려운 상황에도 불구하고 무언가를 진행하거나 주장할 때 씁니다.", "계약서, 공식 서한, 분쟁 이슈 처리에 씁니다.", "despite 나 in spite of 와 같은 뜻이지만 더 법률적·공식적입니다.", ["legal", "formal"], ["the delay", "the above terms", "the challenges"]],
    ["pursuant-to", "pursuant to", "~에 따라", "advanced", "pattern", "pursuant to + agreement / clause", "계약 조항이나 절차에 따른 행동을 명확히 할 때 씁니다.", "계약서, 공문, 클레임 처리 서한에서 씁니다.", "in accordance with 과 거의 같지만 더 법률 문서에 가깝습니다.", ["legal", "compliance"], ["our agreement", "Clause 4.2", "the standard protocol"]],
    ["on-a-case-by-case-basis", "on a case-by-case basis", "사안별로", "advanced", "pattern", "handle + noun + on a case-by-case basis", "일률적 기준보다 상황에 따라 개별 판단이 필요할 때 씁니다.", "클레임 처리, 예외 승인, 특별 가격 협상에 씁니다.", "보편적 규칙 적용이 어려운 상황을 설명할 때 유용합니다.", ["management", "negotiation"], ["exceptions", "complaints", "special pricing requests"]],
    ["all-things-considered", "all things considered", "전반적으로 고려하면", "advanced", "pattern", "all things considered, + clause", "여러 요소를 종합적으로 검토한 결론을 내릴 때 씁니다.", "공급사 평가, 대안 검토, 계약 결론에 씁니다.", "considering all factors 와 같은 뜻입니다.", ["decision", "analysis"], ["this supplier is the best fit", "the risk is manageable", "we recommend proceeding"]],
    ["at-the-outset", "at the outset", "처음부터", "advanced", "pattern", "at the outset of + project / engagement", "프로젝트나 관계 시작 단계를 언급할 때 씁니다.", "목표 설정, 리스크 사전 안내, 범위 정의에 씁니다.", "at the beginning 과 비슷하지만 더 공식적입니다.", ["project", "management"], ["the project", "the engagement", "the contract period"]],
    ["by-extension", "by extension", "더 나아가서", "advanced", "pattern", "by extension, + clause", "앞에서 말한 논리를 확장해 결론 짓거나 추가 함의를 말할 때 씁니다.", "분석 결론 도출, 전략 시사점 설명에 씁니다.", "by the same token 과 비슷하지만 논리 확장에 더 강합니다.", ["analysis", "strategy"], ["this affects our entire cost base", "we will need to revise the timeline", "the risk applies to all markets"]],
    ["to-that-end", "to that end", "그 목적을 위해", "advanced", "pattern", "to that end, + clause", "앞에서 밝힌 목표를 달성하기 위한 다음 조치를 설명할 때 씁니다.", "전략 발표, 실행 계획 연결, 공식 서한에 씁니다.", "to achieve that goal 과 비슷하지만 더 간결하고 공식적입니다.", ["strategy", "formal"], ["we propose a pilot program", "we are reallocating resources", "we need your sign-off"]],
    ["in-no-small-part", "in no small part", "크게는 ~덕분에", "advanced", "pattern", "due in no small part to + noun", "성과의 중요한 이유를 강조할 때 씁니다.", "실적 설명, 파트너 기여 인정, 성공 사례 발표에 씁니다.", "largely due to 와 같은 뜻이지만 더 격식 있습니다.", ["reporting", "management"], ["our supplier's efforts", "the team's dedication", "the process improvements"]],
    ["in-the-interest-of", "in the interest of", "~을 위해", "advanced", "pattern", "in the interest of + efficiency / clarity", "특정 이유나 목적을 명확히 밝힐 때 씁니다.", "프로세스 간소화, 소통 명확화, 비용 절감 설명에 씁니다.", "for the sake of 와 비슷하지만 더 격식 있습니다.", ["management", "formal"], ["efficiency", "transparency", "time"]],
    ["it-stands-to-reason", "it stands to reason", "당연히 ~이다", "advanced", "pattern", "it stands to reason that + clause", "논리적 결론을 자신있게 제시할 때 씁니다.", "분석 결론, 협상 근거, 리스크 설명에 씁니다.", "it is logical that 보다 더 확신에 찬 표현입니다.", ["negotiation", "analysis"], ["the cost will increase", "we need a contingency plan", "quality will improve with better materials"]],
    ["over-and-above", "over and above", "그 이상으로", "advanced", "pattern", "over and above + requirement / expectation", "기대치를 초과하는 무언가를 강조할 때 씁니다.", "추가 서비스, 초과 달성, 계약 범위 외 지원 설명에 씁니다.", "beyond 와 비슷하지만 더 공식적이고 강조가 강합니다.", ["management", "sales"], ["the agreed terms", "normal expectations", "the contracted scope"]],
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
  const entries: EnglishEntry[] = [];

  for (const base of BASE_EXPRESSIONS) {
    for (const scenario of DOMAIN_SCENARIOS) {
      scenario.objects.forEach((object, index) => {
        entries.push(buildEntry(base, scenario, object, index));
      });
    }
  }

  return entries;
}

export const ENGLISH_ENTRIES: EnglishEntry[] = buildEntries();

export const ENGLISH_CATEGORIES = Array.from(
  new Set(ENGLISH_ENTRIES.flatMap((entry) => entry.categories))
).sort();

export function createPracticeCard(entry: EnglishEntry, seed: number): PracticeCard {
  const subject = ROLE_SUBJECTS[seed % ROLE_SUBJECTS.length];
  const object = entry.objectPool[seed % entry.objectPool.length];
  const time = TIME_MARKERS[seed % TIME_MARKERS.length];
  const modal = MODAL_HELPERS[seed % MODAL_HELPERS.length];
  const taskType = TASK_TYPES[seed % TASK_TYPES.length];
  const answer = fillTemplate(entry.answerTemplate, subject, object, time, modal);

  switch (taskType) {
    case "빈칸 완성":
      return {
        id: `${entry.id}-${seed}-blank`,
        entryId: entry.id,
        expression: entry.expression,
        level: entry.level,
        taskType,
        prompt: `${subject} ${modal} ________ ${object} ${time}.\n어떤 표현이 가장 자연스러운지 채워 보세요.`,
        answer,
        explanation: `${entry.expression} 은 ${entry.grammarPattern} 구조로 쓰입니다.`,
      };
    case "업무 문장 작성":
      return {
        id: `${entry.id}-${seed}-write`,
        entryId: entry.id,
        expression: entry.expression,
        level: entry.level,
        taskType,
        prompt: `다음 조건을 만족하는 영어 문장을 직접 만들어 보세요.\n- 주어: ${subject}\n- 표현: ${entry.expression}\n- 대상: ${object}\n- 시점: ${time}`,
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
        prompt: `${entry.expression}\n문형: ${entry.grammarPattern}\n이 표현을 ${subject}, ${object} 문맥으로 적용하면 어떻게 쓰는지 말해 보세요.`,
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
        prompt: `다음 문장을 영어로 옮겨 보세요.\n"${subject}은/는 ${time} ${object} 관련해서 ${entry.korean} 해야 합니다."`,
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
        prompt: `다음 문장을 더 자연스럽게 고쳐 보세요.\n${subject} will ${entry.expression.replace(/\s+/g, " ")} about ${object} ${time}.`,
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
        prompt: `${entry.expression} 와 가장 잘 어울리는 업무 대상은 무엇인지 설명해 보세요.\n추천 collocations: ${entry.collocations.slice(0, 4).join(", ")}`,
        answer,
        explanation: `이 표현은 ${entry.collocations.join(", ")} 같은 업무 명사와 자주 함께 쓰입니다.`,
      };
  }
}

export function practiceUniverseSize(entries = ENGLISH_ENTRIES) {
  return entries.reduce((total, entry) => {
    return (
      total +
      entry.examples.length *
        ROLE_SUBJECTS.length *
        TIME_MARKERS.length *
        TASK_TYPES.length *
        MODAL_HELPERS.length
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

// ── LightExpression (10,000개 대용량 JSON) ────────────────────────────────────

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

export interface LightPracticeCard {
  id: string;
  entryId: string;
  expression: string;
  korean: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  taskType: 'korean-to-english' | 'fill-blank' | 'definition-match' | 'example-translate';
  prompt: string;
  answer: string;
  explanation: string;
}

function loadLightExpressions(): LightExpression[] {
  try {
    // Next.js 서버 사이드에서만 fs 사용 가능
    if (typeof window !== 'undefined') return [];
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs') as typeof import('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path') as typeof import('path');
    const filePath = path.join(process.cwd(), 'data/english/expressions-light.json');
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as LightExpression[];
  } catch {
    return [];
  }
}

export const LIGHT_ENTRIES: LightExpression[] = loadLightExpressions();

export const ALL_CATEGORIES: string[] = Array.from(
  new Set([
    ...ENGLISH_CATEGORIES,
    ...LIGHT_ENTRIES.flatMap(e => e.categories),
  ])
).sort();

export function createLightPracticeCard(entry: LightExpression, seed: number): LightPracticeCard {
  const tasks: LightPracticeCard['taskType'][] = [
    'korean-to-english',
    'fill-blank',
    'definition-match',
    'example-translate',
  ];
  const taskType = tasks[seed % tasks.length];

  switch (taskType) {
    case 'korean-to-english':
      return {
        id: `${entry.id}-${seed}-kren`,
        entryId: entry.id,
        expression: entry.expression,
        korean: entry.korean,
        level: entry.level,
        taskType,
        prompt: `다음 한국어 뜻에 맞는 영어 표현을 쓰세요.\n"${entry.korean}"`,
        answer: entry.expression,
        explanation: `"${entry.expression}" — ${entry.definition}`,
      };
    case 'fill-blank':
      return {
        id: `${entry.id}-${seed}-fill`,
        entryId: entry.id,
        expression: entry.expression,
        korean: entry.korean,
        level: entry.level,
        taskType,
        prompt: `빈칸에 알맞은 표현을 채우세요.\n${entry.example.replace(
          new RegExp(`\\b${entry.expression.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'),
          '________'
        )}`,
        answer: entry.expression,
        explanation: `"${entry.expression}" (${entry.korean}) — ${entry.definition}`,
      };
    case 'definition-match':
      return {
        id: `${entry.id}-${seed}-def`,
        entryId: entry.id,
        expression: entry.expression,
        korean: entry.korean,
        level: entry.level,
        taskType,
        prompt: `다음 설명에 해당하는 영어 표현은?\n"${entry.definition}"`,
        answer: entry.expression,
        explanation: `"${entry.expression}" (${entry.korean})\n예문: ${entry.example}`,
      };
    case 'example-translate':
      return {
        id: `${entry.id}-${seed}-trans`,
        entryId: entry.id,
        expression: entry.expression,
        korean: entry.korean,
        level: entry.level,
        taskType,
        prompt: `다음 문장을 한국어로 옮기세요.\n"${entry.example}"`,
        answer: entry.exampleKr || `(번역 준비 중)`,
        explanation: `핵심 표현: "${entry.expression}" = ${entry.korean}`,
      };
  }
}

export function getLightExpressionsByCategory(category: string): LightExpression[] {
  if (category === 'all') return LIGHT_ENTRIES;
  return LIGHT_ENTRIES.filter(e => e.categories.includes(category));
}

export function getLightExpressionsByLevel(level: LightExpression['level']): LightExpression[] {
  return LIGHT_ENTRIES.filter(e => e.level === level);
}

export function searchLightExpressions(query: string): LightExpression[] {
  const q = query.toLowerCase();
  return LIGHT_ENTRIES.filter(
    e =>
      e.expression.toLowerCase().includes(q) ||
      e.korean.includes(q) ||
      e.definition.toLowerCase().includes(q)
  ).slice(0, 100);
}
