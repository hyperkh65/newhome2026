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
      ({ en: string; kr: string })[]?,
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

    // ── Batch 3: Intermediate phrasal verbs ──────────────────────────────────
    ["act-on", "act on", "~에 따라 행동하다", "intermediate", "phrasal-verb", "act on + feedback / instruction", "지시나 피드백을 받아 즉시 실행할 때 씁니다.", "고객 요청 이행, 내부 지시 반영, 검토 의견 반영에 씁니다.", "act on 뒤에 반드시 행동의 근거가 옵니다.", ["operations", "management"], ["the feedback", "the instruction", "the client request"]],
    ["phase-in", "phase in", "단계적으로 도입하다", "intermediate", "phrasal-verb", "phase in + policy / product / system", "새 제품이나 정책을 한꺼번에 바꾸지 않고 단계적으로 적용할 때 씁니다.", "신규 시스템, 환경 규정, 포장 변경에 씁니다.", "phase out 의 반대 의미입니다.", ["operations", "planning"], ["the new system", "the updated policy", "the eco packaging"]],
    ["scale-back", "scale back", "규모를 줄이다", "intermediate", "phrasal-verb", "scale back + plan / spending / output", "예산이나 계획을 축소할 때 씁니다.", "비용 절감, 생산 조정, 프로젝트 범위 축소에 씁니다.", "scale down 과 같은 뜻입니다.", ["finance", "planning"], ["the marketing spend", "the order quantity", "the rollout plan"]],
    ["speed-up", "speed up", "속도를 높이다", "intermediate", "phrasal-verb", "speed up + process / delivery / approval", "기존보다 빠르게 처리하거나 납기를 앞당길 때 씁니다.", "통관, 승인, 생산 속도를 높이는 상황에 씁니다.", "accelerate 와 같은 뜻이지만 더 구어적입니다.", ["logistics", "operations"], ["the approval", "customs clearance", "the production line"]],
    ["dial-back", "dial back", "줄이다, 조절하다", "intermediate", "phrasal-verb", "dial back + expectation / pressure", "지나친 요구나 기대치를 현실적으로 조정할 때 씁니다.", "납기 기대치, 가격 압박, 요구 사항 조정에 씁니다.", "tone down 과 비슷한 의미입니다.", ["negotiation", "management"], ["the expectations", "the pressure", "the demand"]],
    ["check-off", "check off", "확인 완료 표시하다", "intermediate", "phrasal-verb", "check off + items / tasks", "완료된 항목을 목록에서 확인할 때 씁니다.", "체크리스트, 액션 아이템, 검사 항목 처리에 씁니다.", "tick off 와 거의 같은 뜻입니다.", ["operations", "quality"], ["the checklist", "the action items", "the approval steps"]],
    ["fall-through", "fall through", "무산되다", "intermediate", "phrasal-verb", "fall through + deal / plan", "계획이나 거래가 성사되지 못하고 무산될 때 씁니다.", "계약 불발, 협상 결렬, 승인 취소에 씁니다.", "fall off 와 다르게 완전히 성사되지 못함을 뜻합니다.", ["sales", "negotiation"], ["the deal", "the partnership", "the agreement"]],
    ["work-out", "work out", "해결되다, 협의하다", "intermediate", "phrasal-verb", "work out + arrangement / solution", "합의나 해결책에 도달할 때 씁니다.", "가격 협상, 납기 조율, 책임 분담 협의에 씁니다.", "figure out 보다 더 협력적인 뉘앙스입니다.", ["negotiation", "operations"], ["a solution", "the pricing arrangement", "the delivery schedule"]],
    ["loop-in", "loop in", "포함시켜 공유하다", "intermediate", "phrasal-verb", "loop in + colleague / team", "의사결정이나 커뮤니케이션에 누군가를 참여시킬 때 씁니다.", "이메일 참조 추가, 회의 초대, 프로젝트 합류에 씁니다.", "CC someone in 과 같은 의미로 씁니다.", ["email", "communication"], ["the finance team", "the manager", "the client contact"]],
    ["circle-back", "circle back", "다시 논의하다", "intermediate", "phrasal-verb", "circle back + on / to + topic", "나중에 특정 주제로 돌아올 때 씁니다.", "회의에서 보류된 안건, 미결 이슈 재논의에 씁니다.", "revisit 과 같은 뜻이지만 더 구어적입니다.", ["meeting", "communication"], ["on the pricing issue", "to this topic later", "on the open items"]],
    ["flesh-out", "flesh out", "구체화하다", "intermediate", "phrasal-verb", "flesh out + plan / idea / proposal", "아이디어나 초안에 세부 내용을 채울 때 씁니다.", "제안서 구체화, 전략 세부 기획, 프로세스 구체화에 씁니다.", "elaborate on 과 비슷하지만 작성 맥락이 더 강합니다.", ["strategy", "documents"], ["the proposal", "the concept", "the implementation plan"]],
    ["dig-into", "dig into", "깊이 파고들다", "intermediate", "phrasal-verb", "dig into + data / issue / details", "표면 너머의 원인이나 세부사항을 분석할 때 씁니다.", "재무 데이터, 불량 원인, 고객 피드백 분석에 씁니다.", "drill down into 와 비슷하지만 더 구어적입니다.", ["analysis", "quality"], ["the numbers", "the complaint", "the root cause"]],
    ["pick-up-on", "pick up on", "알아차리다, 포착하다", "intermediate", "phrasal-verb", "pick up on + trend / signal / issue", "변화나 신호를 감지하거나 언급할 때 씁니다.", "시장 트렌드 포착, 고객 불만 신호, 데이터 이상 감지에 씁니다.", "notice 와 같지만 더 능동적인 느낌입니다.", ["analysis", "sales"], ["a trend", "the early warning signals", "the customer concern"]],
    ["ease-into", "ease into", "서서히 적응하다, 천천히 시작하다", "intermediate", "phrasal-verb", "ease into + new system / role / process", "급격한 변화 없이 점진적으로 시작할 때 씁니다.", "신규 프로세스 전환, 신규 공급사 도입에 씁니다.", "gradual 하게 적응하는 의미가 핵심입니다.", ["operations", "hr"], ["the new workflow", "the supplier relationship", "the updated process"]],
    ["test-out", "test out", "시험해보다", "intermediate", "phrasal-verb", "test out + approach / system / idea", "실제 도입 전 소규모로 시험해볼 때 씁니다.", "신규 포장, 파일럿 프로그램, 소프트웨어 도입에 씁니다.", "pilot 과 비슷한 의미로 씁니다.", ["quality", "operations"], ["the new packaging", "the software", "the process change"]],
    ["chip-in", "chip in", "기여하다, 함께 부담하다", "intermediate", "phrasal-verb", "chip in + with / on + cost / effort", "여럿이 함께 비용이나 노력을 분담할 때 씁니다.", "비용 분담, 공동 작업, 자원 제공에 씁니다.", "contribute 와 비슷하지만 더 구어적입니다.", ["finance", "operations"], ["with the shipping cost", "on the joint project", "with extra capacity"]],
    ["back-off", "back off", "물러나다, 압박을 줄이다", "intermediate", "phrasal-verb", "back off + on + demand / pressure", "지나친 요구나 압박을 줄일 때 씁니다.", "무리한 납기 요구, 과도한 가격 압박 조정에 씁니다.", "ease up 과 비슷한 뜻입니다.", ["negotiation", "management"], ["on the deadline pressure", "on the price demand", "on the volume requirement"]],
    ["factor-in", "factor in", "고려 요소로 포함하다", "intermediate", "phrasal-verb", "factor in + cost / risk / time", "계획이나 계산에 추가 변수를 포함할 때 씁니다.", "원가 계산, 일정 수립, 리스크 평가에 씁니다.", "take into account 와 같은 뜻입니다.", ["finance", "planning"], ["the shipping cost", "the lead time", "the exchange rate risk"]],
    ["press-ahead", "press ahead", "밀고 나아가다", "intermediate", "phrasal-verb", "press ahead + with + plan / timeline", "어려움에도 불구하고 계획을 계속 진행할 때 씁니다.", "지연, 반대 의견, 불확실성이 있어도 진행할 때 씁니다.", "proceed with 보다 더 결단력 있는 어조입니다.", ["management", "project"], ["the original timeline", "the expansion plan", "the product launch"]],
    ["sign-up-for", "sign up for", "등록하다, 참여하다", "intermediate", "phrasal-verb", "sign up for + program / trial / service", "프로그램이나 서비스에 참여 신청할 때 씁니다.", "파일럿 프로그램, 교육, 클라우드 서비스 신청에 씁니다.", "enroll in 과 비슷하지만 더 구어적입니다.", ["hr", "operations"], ["the training program", "the beta test", "the new platform"]],
    ["branch-out-into", "branch out into", "확장하다", "intermediate", "phrasal-verb", "branch out into + new market / product line", "기존 영역 너머로 새로운 분야에 진출할 때 씁니다.", "신시장 개척, 신제품 카테고리 확장에 씁니다.", "expand into 와 비슷하지만 더 능동적입니다.", ["strategy", "sales"], ["new product categories", "overseas markets", "the premium segment"]],

    // ── Batch 3: Advanced phrasal verbs ─────────────────────────────────────
    ["navigate-through", "navigate through", "헤쳐 나가다", "advanced", "phrasal-verb", "navigate through + challenge / complexity", "복잡하거나 어려운 상황을 능숙하게 통과할 때 씁니다.", "규제, 공급망 위기, 복잡한 계약에 씁니다.", "deal with 보다 전략적·능동적 의미가 강합니다.", ["strategy", "management"], ["the regulatory landscape", "the supply disruption", "the complex negotiation"]],
    ["capitalize-on", "capitalize on", "활용하다, 기회를 잡다", "advanced", "phrasal-verb", "capitalize on + opportunity / strength", "강점이나 기회를 최대한 활용할 때 씁니다.", "시장 기회, 브랜드 강점, 공급 부족 상황에 씁니다.", "take advantage of 보다 더 전략적입니다.", ["strategy", "sales"], ["the market opportunity", "our cost advantage", "the competitor's weakness"]],
    ["spearhead", "spearhead", "주도하다", "advanced", "phrasal-verb", "spearhead + initiative / project", "중요한 프로젝트나 활동을 앞장서서 이끌 때 씁니다.", "신시장 개척, 품질 개선 프로그램, 디지털 전환 주도에 씁니다.", "lead 보다 더 능동적이고 선구적인 이미지입니다.", ["management", "strategy"], ["the digital transformation", "the new product line", "the cost reduction initiative"]],
    ["orchestrate", "orchestrate", "조율하다, 기획하다", "advanced", "phrasal-verb", "orchestrate + rollout / response / campaign", "여러 팀이 관여된 복잡한 활동을 총괄 조율할 때 씁니다.", "런칭 조율, 위기 대응, 복수 공급사 관리에 씁니다.", "coordinate 보다 더 정교하고 전략적인 느낌입니다.", ["management", "operations"], ["the product launch", "the crisis response", "the multi-site rollout"]],
    ["preempt", "preempt", "선제적으로 대처하다", "advanced", "phrasal-verb", "preempt + complaint / issue / escalation", "문제가 커지기 전에 선제적으로 해결할 때 씁니다.", "클레임 방지, 불만 사전 차단, 리스크 조기 대응에 씁니다.", "anticipate 보다 더 행동 지향적입니다.", ["management", "quality"], ["the complaint", "the escalation", "the supply disruption"]],
    ["reconcile", "reconcile", "일치시키다, 조정하다", "advanced", "phrasal-verb", "reconcile + figures / discrepancy", "수치나 기록의 불일치를 맞출 때 씁니다.", "회계 정산, 재고 차이 해소, 송장 대조에 씁니다.", "match up 과 비슷하지만 회계·재무 맥락에 더 씁니다.", ["finance", "documents"], ["the figures", "the inventory discrepancy", "the invoice records"]],
    ["divest", "divest", "매각하다, 처분하다", "advanced", "phrasal-verb", "divest + asset / business unit", "사업부나 자산을 전략적으로 처분할 때 씁니다.", "비핵심 사업 정리, 자산 매각, 포트폴리오 재편에 씁니다.", "sell off 보다 더 공식적·전략적입니다.", ["finance", "strategy"], ["the non-core assets", "the subsidiary", "the product line"]],
    ["integrate", "integrate", "통합하다", "advanced", "phrasal-verb", "integrate + system / process / supplier", "여러 요소를 하나의 통합된 시스템으로 연결할 때 씁니다.", "ERP 통합, 공급사 시스템 연결, 조직 합병 이후 통합에 씁니다.", "consolidate 보다 더 기술적·시스템적 맥락이 강합니다.", ["operations", "strategy"], ["the new platform", "the supplier portal", "the data systems"]],
    ["circumvent", "circumvent", "우회하다", "advanced", "phrasal-verb", "circumvent + restriction / bottleneck", "장벽이나 제한을 합법적으로 우회할 때 씁니다.", "규제 우회 전략, 공급 병목 해소, 절차 간소화에 씁니다.", "bypass 와 비슷하지만 더 전략적·공식적입니다.", ["strategy", "operations"], ["the tariff restriction", "the bottleneck", "the lengthy approval process"]],
    ["extrapolate", "extrapolate", "추정하다, 외삽하다", "advanced", "phrasal-verb", "extrapolate + trend / figure / forecast", "현재 데이터를 바탕으로 미래 수치를 추정할 때 씁니다.", "수요 예측, 비용 추정, 시장 규모 계산에 씁니다.", "predict 보다 더 데이터 기반의 분석적 표현입니다.", ["analysis", "finance"], ["the trend", "the annual figure", "the market growth"]],
    ["delineate", "delineate", "명확히 구분하다", "advanced", "phrasal-verb", "delineate + roles / scope / responsibility", "역할이나 범위를 명확히 정의할 때 씁니다.", "계약서 역할 분리, 프로젝트 범위 정의, 책임 구분에 씁니다.", "define 보다 더 경계를 명확히 긋는 느낌입니다.", ["management", "legal"], ["the roles and responsibilities", "the project scope", "the boundaries"]],
    ["enumerate", "enumerate", "열거하다", "advanced", "phrasal-verb", "enumerate + requirements / items / steps", "항목을 하나씩 순서대로 나열할 때 씁니다.", "요구사항 목록, 검사 단계, 계약 조항 나열에 씁니다.", "list 보다 더 공식적·포괄적인 느낌입니다.", ["documents", "formal"], ["the requirements", "the steps", "the key deliverables"]],
    ["arbitrate", "arbitrate", "중재하다", "advanced", "phrasal-verb", "arbitrate + dispute / conflict", "이해 당사자 간 분쟁이나 의견 충돌을 중립적으로 해결할 때 씁니다.", "공급사 분쟁, 품질 클레임, 계약 이행 갈등에 씁니다.", "mediate 와 비슷하지만 더 공식적입니다.", ["legal", "negotiation"], ["the dispute", "the contract conflict", "the quality claim"]],
    ["synthesize", "synthesize", "종합하다", "advanced", "phrasal-verb", "synthesize + findings / data / feedback", "여러 출처의 정보를 통합해 결론을 낼 때 씁니다.", "시장 조사 종합, 고객 피드백 분석, 다팀 보고 통합에 씁니다.", "summarize 보다 더 분석적·통합적입니다.", ["analysis", "reporting"], ["the market research", "the customer feedback", "the team inputs"]],
    ["triangulate", "triangulate", "다각도로 검증하다", "advanced", "phrasal-verb", "triangulate + data / source / information", "여러 데이터 소스로 결론의 정확성을 검증할 때 씁니다.", "수요 예측 검증, 공급사 평가, 원가 분석에 씁니다.", "cross-check 과 비슷하지만 더 분석적입니다.", ["analysis", "quality"], ["the forecast", "the cost data", "the supplier information"]],
    ["mitigate", "mitigate", "완화하다", "advanced", "phrasal-verb", "mitigate + risk / impact / loss", "위험이나 손실을 줄이거나 완화할 때 씁니다.", "공급 리스크, 환율 손실, 품질 영향 최소화에 씁니다.", "reduce 보다 더 리스크 관리 맥락에서 씁니다.", ["risk", "strategy"], ["the supply risk", "the financial exposure", "the impact on quality"]],
    ["anticipate", "anticipate", "사전에 예상하다", "advanced", "phrasal-verb", "anticipate + issue / demand / shortage", "문제나 수요를 사전에 예측하고 대비할 때 씁니다.", "수요 급증, 공급 부족, 클레임 증가 예측에 씁니다.", "expect 보다 더 사전 대비의 뉘앙스가 강합니다.", ["planning", "risk"], ["a demand spike", "potential delays", "a shortage"]],
    ["reallocate", "reallocate", "재배분하다", "advanced", "phrasal-verb", "reallocate + budget / resources / capacity", "기존에 배분된 자원을 다시 나눌 때 씁니다.", "예산 조정, 인력 재배치, 생산 능력 재분배에 씁니다.", "redistribute 와 비슷하지만 더 공식적입니다.", ["finance", "management"], ["the budget", "the production capacity", "the team resources"]],
    ["earmark", "earmark", "지정하다, 배정하다", "advanced", "phrasal-verb", "earmark + budget / resources + for + purpose", "특정 목적을 위해 자원이나 예산을 사전에 지정할 때 씁니다.", "투자 예산 배정, 재고 확보, 전략 프로젝트 자원 지정에 씁니다.", "set aside 와 비슷하지만 더 공식적이고 목적이 명확합니다.", ["finance", "planning"], ["the budget for R&D", "stock for priority clients", "resources for the audit"]],
    ["red-flag", "red-flag", "위험 신호로 표시하다", "advanced", "phrasal-verb", "red-flag + issue / vendor / transaction", "잠재적으로 문제가 있는 항목을 별도로 표시할 때 씁니다.", "공급사 리스크, 비용 이상, 계약 위반 가능성 표시에 씁니다.", "flag up 과 비슷하지만 더 강한 경고 의미입니다.", ["risk", "compliance"], ["the vendor", "the cost discrepancy", "the contract clause"]],

    // ── Batch 3: More Intermediate patterns ──────────────────────────────────
    ["i-am-writing-to", "I am writing to", "~하고자 연락드립니다", "intermediate", "pattern", "I am writing to + verb", "이메일을 처음 시작할 때 목적을 밝히는 표현입니다.", "견적 요청, 불만 접수, 회의 제안, 정보 공유에 씁니다.", "I am reaching out to 와 비슷하지만 더 격식 있습니다.", ["email", "formal"], ["inquire about your pricing", "follow up on our order", "confirm the meeting"]],
    ["further-to", "further to", "~에 이어서", "intermediate", "pattern", "further to + our call / meeting / email", "이전 커뮤니케이션을 이어받아 후속 내용을 전달할 때 씁니다.", "미팅 후속 이메일, 전화 통화 후 서면 확인에 씁니다.", "following our discussion 과 같은 뜻입니다.", ["email", "formal"], ["our call yesterday", "our meeting last week", "my previous email"]],
    ["with-reference-to", "with reference to", "~와 관련하여", "intermediate", "pattern", "with reference to + order / matter / request", "특정 거래나 문서를 언급하며 이메일을 시작할 때 씁니다.", "주문 확인, 클레임, 견적 문서를 지칭할 때 씁니다.", "regarding 과 같은 뜻이지만 더 공식적입니다.", ["email", "documents"], ["your order No. 1234", "the matter discussed", "your inquiry of last week"]],
    ["i-look-forward-to", "I look forward to", "~를 기대합니다", "intermediate", "pattern", "I look forward to + noun / gerund", "이메일 마무리 문장으로 가장 자주 쓰입니다.", "회신, 미팅, 협력 관계 기대를 표현할 때 씁니다.", "I am looking forward to 도 가능합니다.", ["email", "formal"], ["hearing from you", "our meeting", "working together"]],
    ["do-not-hesitate-to", "do not hesitate to", "주저하지 말고 ~하세요", "intermediate", "pattern", "do not hesitate to + contact / ask / reach out", "이메일 마무리에서 상대방이 편하게 연락하도록 독려할 때 씁니다.", "고객 서비스, 공급사 소통, 내부 지원 이메일에 씁니다.", "feel free to 와 비슷하지만 더 공식적입니다.", ["email", "support"], ["contact us", "ask any questions", "reach out if you need assistance"]],
    ["feel-free-to", "feel free to", "편하게 ~하세요", "intermediate", "pattern", "feel free to + contact / share / ask", "상대방이 부담 없이 행동하도록 권유할 때 씁니다.", "질문 요청, 의견 공유, 연락 독려에 씁니다.", "do not hesitate to 보다 조금 더 캐주얼합니다.", ["email", "communication"], ["contact us anytime", "share your thoughts", "ask questions"]],
    ["as-requested", "as requested", "요청하신 대로", "intermediate", "pattern", "as requested, + clause", "상대방이 요청한 내용에 따라 행동했음을 알릴 때 씁니다.", "서류 전달, 수정 반영, 가격 재산출 이메일에 씁니다.", "as you requested 도 자연스럽습니다.", ["email", "documents"], ["please find the revised quotation", "I have updated the file", "the sample has been dispatched"]],
    ["for-your-reference", "for your reference", "참고로", "intermediate", "pattern", "for your reference, + clause", "상대방이 참고할 수 있도록 정보를 추가 제공할 때 씁니다.", "이전 가격, 규격 히스토리, 관련 문서 공유에 씁니다.", "FYR 로 줄여 쓰기도 합니다.", ["email", "documents"], ["I have attached the previous version", "our standard lead time is 30 days", "please see the price list below"]],
    ["kindly-note-that", "kindly note that", "참고로 알려드립니다", "intermediate", "pattern", "kindly note that + clause", "중요한 주의 사항을 정중하게 전달할 때 씁니다.", "마감일, 결제 조건, 규정 변경 안내에 씁니다.", "please note that 과 같지만 더 공손한 어조입니다.", ["email", "formal"], ["payment is due within 30 days", "the minimum order is 500 units", "the deadline has been moved"]],
    ["we-regret-to-inform", "we regret to inform you that", "유감스럽게도 알려드립니다", "intermediate", "pattern", "we regret to inform you that + clause", "나쁜 소식을 정중하고 공식적으로 전달할 때 씁니다.", "납기 지연, 주문 불가, 가격 인상 통보에 씁니다.", "we are sorry to say 보다 더 격식 있습니다.", ["email", "formal"], ["the shipment has been delayed", "we are unable to meet the deadline", "the price will be revised"]],
    ["at-your-earliest-convenience", "at your earliest convenience", "가능한 빨리", "intermediate", "pattern", "please + verb + at your earliest convenience", "긴박하지는 않지만 빠른 처리를 요청할 때 씁니다.", "회신 요청, 서류 제출, 확인 요청에 씁니다.", "as soon as possible 보다 더 공손한 표현입니다.", ["email", "formal"], ["respond to this email", "send the signed document", "confirm the schedule"]],
    ["i-would-like-to", "I would like to", "~하고 싶습니다", "intermediate", "pattern", "I would like to + verb", "정중하게 의사를 표현하거나 제안할 때 씁니다.", "회의 요청, 가격 문의, 방문 제안에 씁니다.", "I want to 보다 훨씬 더 공손합니다.", ["email", "meeting"], ["schedule a call", "discuss the terms", "visit your facility"]],
    ["please-confirm", "please confirm", "확인해주세요", "intermediate", "pattern", "please confirm + receipt / timeline / agreement", "중요한 정보나 약속의 확인을 요청할 때 씁니다.", "주문 확인, 회의 일정 확인, 조건 동의 확인에 씁니다.", "please acknowledge 와 함께 자주 씁니다.", ["email", "communication"], ["receipt of this email", "the delivery schedule", "your agreement with the terms"]],
    ["pending-your-approval", "pending your approval", "승인 대기 중", "intermediate", "pattern", "pending your approval + clause", "상위 결재 대기 상태를 공식적으로 알릴 때 씁니다.", "견적서, 계약서, 계획서 승인 요청에 씁니다.", "awaiting your approval 과 같은 뜻입니다.", ["approval", "documents"], ["the proposal has been submitted", "the purchase order is ready", "the plan is on hold"]],
    ["for-your-information", "for your information", "참고로 알려드립니다", "intermediate", "pattern", "for your information, + clause", "행동이 필요하지 않지만 알아야 할 정보를 공유할 때 씁니다.", "정책 변경 공지, 시장 정보, 내부 공지 공유에 씁니다.", "FYI 로 줄여 쓰기도 합니다.", ["email", "communication"], ["the office will close early on Friday", "the new price list takes effect next month", "the supplier has changed the contact person"]],

    // ── Batch 3: More Advanced patterns ─────────────────────────────────────
    ["in-light-of", "in light of", "~을 고려하면", "advanced", "pattern", "in light of + recent events / data", "새로운 정보나 상황을 근거로 판단하거나 행동할 때 씁니다.", "시장 변화 대응, 신규 데이터 반영, 상황 변화 대처에 씁니다.", "given 과 비슷하지만 더 공식적입니다.", ["strategy", "reporting"], ["the recent market developments", "the updated data", "the supply chain disruption"]],
    ["with-a-view-to", "with a view to", "~을 목적으로", "advanced", "pattern", "with a view to + gerund / achieving", "장기 목표를 향한 현재 행동의 목적을 밝힐 때 씁니다.", "파트너십 제안, 전략 방향 제시, 계약 목적 설명에 씁니다.", "with the aim of 와 같은 뜻입니다.", ["strategy", "formal"], ["expanding our partnership", "reducing costs over time", "entering new markets"]],
    ["on-the-premise-that", "on the premise that", "~를 전제로", "advanced", "pattern", "on the premise that + clause", "어떤 가정을 바탕으로 계획하거나 제안할 때 씁니다.", "가격 협상, 물량 약속, 조건부 제안에 씁니다.", "assuming that 보다 더 논리적이고 공식적입니다.", ["negotiation", "strategy"], ["volumes remain at 10,000 units", "payment terms remain unchanged", "quality standards are met"]],
    ["against-this-backdrop", "against this backdrop", "이러한 배경에서", "advanced", "pattern", "against this backdrop, + clause", "현재 상황이나 맥락을 배경으로 제안이나 결론을 제시할 때 씁니다.", "시장 보고서, 전략 발표, 투자자 커뮤니케이션에 씁니다.", "in this context 와 비슷하지만 더 격식 있습니다.", ["strategy", "reporting"], ["we are proposing a price adjustment", "we recommend a dual-sourcing strategy", "growth remains our priority"]],
    ["on-balance", "on balance", "전반적으로 따지면", "advanced", "pattern", "on balance, + clause", "장단점을 종합적으로 따져본 후 결론을 내릴 때 씁니다.", "공급사 평가, 투자 결정, 옵션 비교에 씁니다.", "overall 과 비슷하지만 더 공식적인 분석 어조입니다.", ["analysis", "decision"], ["this supplier offers the best value", "the risk is acceptable", "we recommend proceeding"]],
    ["from-a-strategic-standpoint", "from a strategic standpoint", "전략적 관점에서", "advanced", "pattern", "from a strategic standpoint, + clause", "단기 실무보다 장기 전략 관점에서 판단할 때 씁니다.", "공급망 결정, 신시장 진출, 투자 우선순위에 씁니다.", "strategically speaking 과 같은 뜻입니다.", ["strategy", "management"], ["diversification is essential", "this market entry is premature", "we should consolidate our supplier base"]],
    ["the-net-effect-is", "the net effect is", "최종적인 효과는", "advanced", "pattern", "the net effect is + clause / noun", "여러 변수를 고려한 최종 결과를 요약할 때 씁니다.", "원가 분석, 정책 영향 평가, 협상 결과 정리에 씁니다.", "in the end 보다 더 분석적이고 수치 중심적입니다.", ["analysis", "finance"], ["a 5% cost reduction", "improved lead times", "a net saving of $20,000"]],
    ["it-merits-consideration", "it merits consideration", "검토할 만합니다", "advanced", "pattern", "it merits consideration + that / whether", "단번에 결론 내리지 않고 신중하게 고려해볼 것을 제안할 때 씁니다.", "전략 회의, 경영 보고, 투자 검토에 씁니다.", "it is worth considering 보다 더 격식 있습니다.", ["strategy", "management"], ["whether to dual-source", "the long-term cost implications", "the regulatory risk"]],
    ["taking-stock-of", "taking stock of", "~를 점검하다", "advanced", "pattern", "taking stock of + situation / progress", "현재 상황이나 성과를 전반적으로 점검할 때 씁니다.", "중간 점검 보고, 분기 성과 검토, 전략 재평가에 씁니다.", "reviewing 과 비슷하지만 더 포괄적입니다.", ["management", "reporting"], ["our current performance", "where we stand", "the challenges ahead"]],
    ["the-underlying-assumption", "the underlying assumption is", "기저 전제는", "advanced", "pattern", "the underlying assumption is + clause", "계획이나 분석의 기본 전제를 명확히 밝힐 때 씁니다.", "예산 수립, 가격 모델, 수요 예측 설명에 씁니다.", "we are assuming that 보다 더 구조화된 표현입니다.", ["analysis", "finance"], ["volumes will grow by 10%", "raw material costs remain stable", "the exchange rate stays flat"]],
    ["it-is-imperative-that", "it is imperative that", "반드시 ~해야 합니다", "advanced", "pattern", "it is imperative that + clause", "절대적으로 중요한 사항을 강조할 때 씁니다.", "안전 기준, 규정 준수, 납기 준수 요구에 씁니다.", "it is essential that 과 비슷하지만 더 강합니다.", ["compliance", "management"], ["all documents are submitted on time", "the quality checks are completed", "we notify the client immediately"]],
    ["the-crux-of-the-matter", "the crux of the matter is", "핵심은", "advanced", "pattern", "the crux of the matter is + clause", "논의의 핵심 포인트를 날카롭게 짚을 때 씁니다.", "협상, 분쟁, 문제 분석의 결론 도출에 씁니다.", "the key issue is 와 비슷하지만 더 강조적입니다.", ["negotiation", "analysis"], ["cost, not quality", "the delivery window is too tight", "we need a committed supplier"]],
    ["without-prejudice", "without prejudice", "권리를 유보하며", "advanced", "pattern", "without prejudice + clause", "공식 입장에 영향을 주지 않는 조건으로 논의할 때 씁니다.", "분쟁 협상, 클레임 조율, 계약 해지 논의에 씁니다.", "법률·협상 문서에서 자주 보이는 표현입니다.", ["legal", "negotiation"], ["we propose a partial refund", "we suggest a revised schedule", "we are open to discussing alternatives"]],

    // ── Batch 4: Intermediate phrasal verbs with examples ────────────────────
    ["fast-track", "fast-track", "신속 처리하다", "intermediate", "phrasal-verb", "fast-track + approval / process", "동사와 형용사 모두 쓰이며 명사일 때는 fast track으로 씁니다.", "일반 절차보다 빠른 처리가 필요할 때 씁니다.", "fast-track (동사), fast track (명사) 철자를 구분합니다.", ["approval", "operations"], ["sample approval", "documentation", "the audit"],
      [
        { en: "Can we fast-track the sample approval this time?", kr: "이번에는 샘플 승인을 신속 처리해주실 수 있나요?" },
        { en: "The client asked us to fast-track the shipment documentation.", kr: "고객이 선적 서류를 빠르게 처리해달라고 요청했습니다." },
        { en: "We will need to fast-track the audit if we want to hit the launch date.", kr: "출시일을 맞추려면 감사를 신속하게 진행해야 합니다." },
      ]
    ],
    ["run-out-of", "run out of", "다 떨어지다, 소진하다", "intermediate", "phrasal-verb", "run out of + stock / inventory / time", "가산 명사 앞에 the/our를 붙여 씁니다.", "재고 부족, 부품 소진, 기한 초과 상황을 설명할 때 씁니다.", "run out from 은 틀린 표현입니다.", ["inventory", "operations"], ["safety stock", "key components", "lead time buffer"],
      [
        { en: "We are running out of safety stock for this SKU.", kr: "이 SKU의 안전 재고가 거의 소진되고 있습니다." },
        { en: "The warehouse ran out of the key component last Thursday.", kr: "창고의 핵심 부품이 지난 목요일에 다 떨어졌습니다." },
        { en: "If we run out of inventory before the new shipment arrives, we will need to airfreight.", kr: "새 선적이 도착하기 전에 재고가 소진되면 항공으로 급송해야 합니다." },
      ]
    ],
    ["tie-down", "tie down", "확정하다, 구체화하다", "intermediate", "phrasal-verb", "tie down + date / spec / terms", "합의를 고정시켜 나중에 바뀌지 않게 한다는 뜻입니다.", "납기, 사양, 계약 조건을 최종 확정할 때 씁니다.", "lock in 과 비슷하지만 더 구어적입니다.", ["planning", "negotiation"], ["delivery date", "exact spec", "payment terms"],
      [
        { en: "Let's tie down the delivery date before we confirm the order.", kr: "주문을 확정하기 전에 납기일을 먼저 확정합시다." },
        { en: "Can you tie down the exact spec requirements with the client?", kr: "고객과 정확한 사양 요구사항을 확정해주시겠어요?" },
        { en: "We need to tie down the payment terms by end of this week.", kr: "이번 주 안으로 결제 조건을 확정해야 합니다." },
      ]
    ],
    ["hold-up", "hold up", "지연시키다", "intermediate", "phrasal-verb", "hold up + shipment / process / approval", "진행을 막거나 지연시키는 원인을 설명할 때 씁니다.", "통관 지연, 서류 누락, 승인 보류 상황에 씁니다.", "hold on 과 혼동하지 않습니다.", ["logistics", "operations"], ["shipment", "approval", "the whole project"],
      [
        { en: "The customs clearance issue is holding up the entire shipment.", kr: "통관 문제가 전체 선적을 지연시키고 있습니다." },
        { en: "A missing document held up the approval for two days.", kr: "서류 누락으로 승인이 이틀 지연됐습니다." },
        { en: "Don't let one small issue hold up the whole project.", kr: "작은 문제 하나가 전체 프로젝트를 지연시키지 않도록 하세요." },
      ]
    ],
    ["cut-back", "cut back", "삭감하다, 줄이다", "intermediate", "phrasal-verb", "cut back + on + spending / production", "예산이나 생산량을 줄일 때 씁니다.", "비용 절감, 생산 조정, 재고 감축 상황에 씁니다.", "cut down 과 비슷하지만 cut back on 형태로 더 자주 씁니다.", ["finance", "operations"], ["discretionary spending", "order volume", "production capacity"],
      [
        { en: "We need to cut back on discretionary spending this quarter.", kr: "이번 분기에는 재량 지출을 줄여야 합니다." },
        { en: "The client has cut back their order volume due to slow sales.", kr: "고객이 판매 부진으로 주문량을 줄였습니다." },
        { en: "The factory had to cut back production during the energy shortage.", kr: "에너지 부족으로 공장이 생산을 축소해야 했습니다." },
      ]
    ],
    ["write-off", "write off", "손실 처리하다", "intermediate", "phrasal-verb", "write off + inventory / debt / loss", "재무 손실을 공식적으로 처리할 때 씁니다.", "불량 재고, 미수금, 파손 손실 처리에 씁니다.", "write-off 는 명사형으로도 씁니다.", ["finance", "inventory"], ["damaged inventory", "uncollectible receivables", "obsolete stock"],
      [
        { en: "We had to write off $50,000 in damaged inventory last quarter.", kr: "지난 분기에 파손 재고 5만 달러를 손실 처리해야 했습니다." },
        { en: "The finance team will write off the uncollectible receivables.", kr: "재무팀이 회수 불가 채권을 손실 처리할 예정입니다." },
        { en: "It is better to write off the old stock than to keep holding it in the warehouse.", kr: "구재고를 계속 창고에 보관하는 것보다 손실 처리하는 편이 낫습니다." },
      ]
    ],
    ["build-on", "build on", "토대로 삼다, 발전시키다", "intermediate", "phrasal-verb", "build on + success / relationship / strength", "기존 성과나 관계를 기반으로 더 발전시킬 때 씁니다.", "제품 확장, 파트너십 심화, 전략 발전에 씁니다.", "build upon 도 동일한 의미로 씁니다.", ["strategy", "relationship"], ["last year's success", "existing partnership", "core strength"],
      [
        { en: "Let's build on the success of last year's campaign.", kr: "지난해 캠페인의 성공을 토대로 발전시켜 봅시다." },
        { en: "We can build on the existing supplier relationship to expand the product range.", kr: "기존 공급사 관계를 토대로 제품 범위를 확장할 수 있습니다." },
        { en: "The new strategy builds on our core competency in logistics.", kr: "새 전략은 물류 분야의 핵심 역량을 기반으로 합니다." },
      ]
    ],
    ["head-up", "head up", "이끌다, 총괄하다", "intermediate", "phrasal-verb", "head up + team / project / initiative", "특정 팀이나 프로젝트를 총괄 책임질 때 씁니다.", "인사 발표, 프로젝트 담당자 지정에 씁니다.", "lead 와 같은 뜻이지만 더 구어적입니다.", ["management", "hr"], ["the project team", "the audit preparation", "the regional expansion"],
      [
        { en: "Who is heading up the new product launch team?", kr: "신제품 출시 팀은 누가 이끌고 있나요?" },
        { en: "Sarah will head up the audit preparation next month.", kr: "사라가 다음 달 감사 준비를 총괄할 예정입니다." },
        { en: "We need someone experienced to head up the regional expansion.", kr: "지역 확장을 총괄할 경험 있는 사람이 필요합니다." },
      ]
    ],
    ["fall-back-on", "fall back on", "대안으로 의지하다", "intermediate", "phrasal-verb", "fall back on + backup plan / secondary supplier", "주 계획이 실패할 때 대안을 쓸 때 씁니다.", "비상 공급사, 수동 프로세스, 임시 대책 활용에 씁니다.", "fall back on 뒤에 반드시 대안 대상이 옵니다.", ["planning", "risk"], ["the secondary supplier", "a contingency plan", "manual processing"],
      [
        { en: "We can fall back on the secondary supplier if the primary one fails.", kr: "주 공급사가 문제가 생기면 보조 공급사를 대안으로 쓸 수 있습니다." },
        { en: "Always have a contingency plan to fall back on.", kr: "항상 의지할 수 있는 비상 계획을 갖춰두세요." },
        { en: "The team fell back on manual processing when the system went down.", kr: "시스템이 다운됐을 때 팀은 수동 처리로 대체했습니다." },
      ]
    ],
    ["turn-to", "turn to", "~에 의존하다, 도움을 구하다", "intermediate", "phrasal-verb", "turn to + team / expert / backup", "어려울 때 특정 사람이나 대안으로 방향을 돌릴 때 씁니다.", "전문가 도움 요청, 대안 옵션 활용, 내부 지원 요청에 씁니다.", "turn to 뒤에 사람이나 자원이 옵니다.", ["communication", "management"], ["the technical team", "a specialist", "the backup plan"],
      [
        { en: "When the issue escalated, we turned to the technical team for support.", kr: "문제가 커졌을 때 기술팀에 지원을 요청했습니다." },
        { en: "The client turned to us for advice on the new certification requirement.", kr: "고객이 새 인증 요건에 대한 조언을 얻기 위해 우리에게 연락했습니다." },
        { en: "If the first solution doesn't work, we can turn to the alternative approach.", kr: "첫 번째 해결책이 작동하지 않으면 대안 방법으로 전환할 수 있습니다." },
      ]
    ],

    // ── Batch 4: Intermediate patterns with examples ─────────────────────────
    ["upon-receipt", "upon receipt", "수령 즉시", "intermediate", "pattern", "upon receipt + of + document / goods", "수령하는 시점에 즉시 행동해야 함을 명확히 합니다.", "결제 지시, 보증 시작, 이메일 확인 요청에 씁니다.", "upon receiving 도 같은 뜻이지만 upon receipt 가 더 공식적입니다.", ["email", "finance"], ["the invoice", "the signed contract", "the goods"],
      [
        { en: "Please process the payment upon receipt of the invoice.", kr: "송장 수령 즉시 결제를 처리해주세요." },
        { en: "The warranty period begins upon receipt of the goods.", kr: "품질 보증 기간은 제품 수령 즉시 시작됩니다." },
        { en: "Kindly confirm upon receipt of this email.", kr: "이 이메일을 받으시는 즉시 확인 회신을 부탁드립니다." },
      ]
    ],
    ["as-a-heads-up", "as a heads-up", "미리 알려드리면", "intermediate", "pattern", "just as a heads-up, + clause", "공식 발표 전에 상대방에게 사전에 알릴 때 씁니다.", "가격 변경, 공장 휴무, 인사 변경 사전 안내에 씁니다.", "heads-up 은 비공식적이므로 공식 문서보다 이메일에 적합합니다.", ["email", "communication"], ["the price list will be revised", "the factory will close", "the contact person has changed"],
      [
        { en: "Just as a heads-up, the price list will be revised next month.", kr: "미리 알려드리면, 다음 달 가격표가 개정됩니다." },
        { en: "As a heads-up, the factory will be closed during the holiday week.", kr: "미리 안내드리면, 공장이 연휴 기간에 문을 닫습니다." },
        { en: "I wanted to give you a heads-up before the official announcement goes out.", kr: "공식 공지가 나가기 전에 미리 알려드리고 싶었습니다." },
      ]
    ],
    ["to-recap", "to recap", "요약하면", "intermediate", "pattern", "to recap, + summary clause", "회의나 통화의 핵심 합의 사항을 정리할 때 씁니다.", "미팅 요약 이메일, 통화 결과 정리, 보고서 도입부에 씁니다.", "to summarize 와 비슷하지만 더 구어적이고 자연스럽습니다.", ["meeting", "email"], ["unit price and lead time", "key decisions", "next steps"],
      [
        { en: "To recap, we agreed on a unit price of $12 and a lead time of 45 days.", kr: "요약하면, 단가 12달러와 납기 45일에 합의했습니다." },
        { en: "To recap our call today: the order will ship by the 15th.", kr: "오늘 통화를 요약하면: 주문은 15일까지 출고됩니다." },
        { en: "To recap the key points from the meeting, please see the notes below.", kr: "회의 핵심 내용을 요약하면, 아래 메모를 참고해주세요." },
      ]
    ],
    ["in-the-meantime", "in the meantime", "그 동안에는", "intermediate", "pattern", "in the meantime, + instruction / plan", "장기 해결책을 준비하는 동안 임시로 취할 조치를 안내합니다.", "임시 재고 활용, 수동 프로세스 유지, 임시 담당자 지정에 씁니다.", "meanwhile 과 같은 뜻이지만 더 격식 있습니다.", ["operations", "planning"], ["please use current stock", "continue with the manual process", "hold off on placing the new order"],
      [
        { en: "In the meantime, please use the current stock to cover orders.", kr: "그 동안은 현재 재고를 사용해 주문을 처리해주세요." },
        { en: "In the meantime, could you hold off on placing the new order?", kr: "그 동안은 새 주문 발주를 잠시 보류해주시겠어요?" },
        { en: "The new system is being set up; in the meantime, please continue with the manual process.", kr: "새 시스템 세팅 중입니다. 그 동안은 수동 프로세스를 계속 사용해주세요." },
      ]
    ],
    ["as-a-reminder", "as a reminder", "다시 한번 알려드립니다", "intermediate", "pattern", "as a reminder, + important clause", "이미 공지된 내용을 한 번 더 상기시킬 때 씁니다.", "마감일, 최소 주문량, 절차 안내 재공지에 씁니다.", "just a reminder 도 자주 쓰입니다.", ["email", "communication"], ["the payment deadline", "minimum order quantity", "the notice period"],
      [
        { en: "As a reminder, the payment deadline is this Friday.", kr: "다시 한번 알려드립니다, 결제 기한은 이번 주 금요일입니다." },
        { en: "Just as a reminder, we require 48 hours' notice for any order changes.", kr: "다시 한번 안내드리면, 주문 변경 시 48시간 사전 통보가 필요합니다." },
        { en: "As a reminder, all orders must be confirmed in writing.", kr: "다시 안내드리면, 모든 주문은 서면으로 확인되어야 합니다." },
      ]
    ],
    ["for-the-record", "for the record", "기록을 위해", "intermediate", "pattern", "for the record, + statement", "구두 합의 내용이나 중요 사실을 공식적으로 문서화할 때 씁니다.", "통화 후 확인 이메일, 보증 조건 명시에 씁니다.", "on the record 와 비슷하지만 더 이메일 맥락에 자연스럽습니다.", ["email", "documents"], ["confirm the agreement", "state the warranty terms", "record the price offer"],
      [
        { en: "For the record, I would like to confirm what was agreed in today's call.", kr: "기록을 위해, 오늘 통화에서 합의한 내용을 확인하고자 합니다." },
        { en: "For the record, our standard warranty covers 12 months from the date of delivery.", kr: "기록을 위해, 당사 기본 품질 보증은 납품일로부터 12개월입니다." },
        { en: "For the record, this price offer is valid until the end of this month.", kr: "기록을 위해, 이 가격 제안은 이달 말까지 유효합니다." },
      ]
    ],
    ["on-that-note", "on that note", "그와 관련하여", "intermediate", "pattern", "on that note, + transition clause", "방금 언급한 주제와 연결해 다음 내용으로 전환할 때 씁니다.", "회의 진행, 이메일 본문 전환, 보고서 연결에 씁니다.", "on that subject 와 비슷하지만 더 자연스러운 전환 표현입니다.", ["meeting", "email"], ["let's move on", "I would like to share", "I have attached"],
      [
        { en: "On that note, let's move on to the delivery schedule.", kr: "그와 관련하여, 이제 배송 일정으로 넘어가겠습니다." },
        { en: "On that note, I would like to share a few updates on the production status.", kr: "그와 관련하여, 생산 현황에 대한 업데이트를 몇 가지 공유하겠습니다." },
        { en: "On that note, I have attached the revised draft for your review.", kr: "그와 관련하여, 검토를 위해 수정된 초안을 첨부했습니다." },
      ]
    ],
    ["i-trust-this-meets", "I trust this meets", "~에 부합하기를 바랍니다", "intermediate", "pattern", "I trust this meets + your requirements / expectations", "요청 사항에 맞게 처리했음을 자신 있게 전달할 때 씁니다.", "견적서, 개정 문서, 사양 전달 이메일 마무리에 씁니다.", "I hope this meets 보다 더 확신 있는 어조입니다.", ["email", "formal"], ["your requirements", "your expectations", "the agreed standard"],
      [
        { en: "I trust this revised proposal meets your requirements.", kr: "수정된 제안서가 귀사의 요구사항에 부합하기를 바랍니다." },
        { en: "I trust this quotation meets your budget expectations.", kr: "이 견적서가 귀사의 예산 기대치에 맞기를 바랍니다." },
        { en: "I trust the updated specification meets the agreed standard.", kr: "업데이트된 사양이 합의된 기준에 부합하기를 바랍니다." },
      ]
    ],

    // ── Batch 4: Advanced phrasal verbs with examples ────────────────────────
    ["ring-fence", "ring-fence", "별도로 분리 보호하다", "advanced", "phrasal-verb", "ring-fence + budget / resources / process", "특정 자원이나 프로세스를 외부 영향에서 보호하기 위해 분리할 때 씁니다.", "R&D 예산 보호, 품질 프로세스 분리, 전략 자원 확보에 씁니다.", "set aside 보다 더 강한 보호 의미가 있습니다.", ["finance", "strategy"], ["R&D budget", "quality-critical processes", "strategic reserves"],
      [
        { en: "We should ring-fence the R&D budget from operational cost pressures.", kr: "R&D 예산을 운영 비용 압박으로부터 분리 보호해야 합니다." },
        { en: "The finance team has ring-fenced funds for the new line expansion.", kr: "재무팀이 신규 라인 확장을 위한 자금을 별도로 확보해두었습니다." },
        { en: "It is important to ring-fence quality-critical processes from budget cuts.", kr: "품질에 중요한 프로세스를 예산 삭감의 영향에서 분리하는 것이 중요합니다." },
      ]
    ],
    ["overhaul", "overhaul", "전면 개편하다", "advanced", "phrasal-verb", "overhaul + process / structure / system", "기존 시스템이나 프로세스를 처음부터 다시 설계할 때 씁니다.", "공급망 재설계, 가격 체계 개편, 품질 검사 전면 개선에 씁니다.", "update 나 revise 보다 더 근본적인 변화를 의미합니다.", ["strategy", "operations"], ["the inspection process", "the pricing structure", "the supply chain"],
      [
        { en: "We need to overhaul the entire quality inspection process.", kr: "전체 품질 검사 프로세스를 전면 개편해야 합니다." },
        { en: "The company plans to overhaul its supply chain strategy by next year.", kr: "회사는 내년까지 공급망 전략을 전면 개편할 계획입니다." },
        { en: "They overhauled the pricing structure after the margin review flagged key gaps.", kr: "마진 검토에서 핵심 문제가 발견된 후 가격 체계를 전면 개편했습니다." },
      ]
    ],
    ["rationalize", "rationalize", "합리화하다, 효율화하다", "advanced", "phrasal-verb", "rationalize + supplier base / SKU / process", "불필요한 중복을 제거해 더 효율적으로 만들 때 씁니다.", "공급사 수 감축, SKU 정리, 프로세스 중복 제거에 씁니다.", "optimize 와 비슷하지만 제거 및 축소 뉘앙스가 더 강합니다.", ["strategy", "operations"], ["the supplier base", "the SKU count", "overlapping processes"],
      [
        { en: "We are looking to rationalize our supplier base from 20 to 10.", kr: "공급사 수를 20개에서 10개로 합리화하려고 합니다." },
        { en: "The project will rationalize the current overlapping processes.", kr: "이 프로젝트는 현재 중복되는 프로세스를 정리할 것입니다." },
        { en: "Rationalizing the SKU count helped reduce warehouse complexity significantly.", kr: "SKU 수를 합리화해 창고 복잡도를 크게 줄였습니다." },
      ]
    ],
    ["dovetail-with", "dovetail with", "잘 맞물리다", "advanced", "phrasal-verb", "dovetail with + plan / requirement / strategy", "두 계획이나 요소가 서로 자연스럽게 잘 맞을 때 씁니다.", "일정 조율, 전략 정합성 설명, 요구사항 부합 확인에 씁니다.", "align with 보다 더 자연스럽게 맞물린다는 뉘앙스입니다.", ["strategy", "planning"], ["production plan", "quality certification", "strategic direction"],
      [
        { en: "The new delivery schedule dovetails nicely with our production plan.", kr: "새 납기 일정이 우리 생산 계획과 자연스럽게 잘 맞습니다." },
        { en: "Our quality requirements dovetail with the supplier's existing certification.", kr: "당사 품질 요구사항이 공급사의 기존 인증과 잘 맞아떨어집니다." },
        { en: "This proposal dovetails with our strategic direction for the next three years.", kr: "이 제안은 향후 3년 전략 방향과 잘 맞물립니다." },
      ]
    ],
    ["insulate-from", "insulate from", "~로부터 격리하다, 보호하다", "advanced", "phrasal-verb", "insulate + business / margins + from + risk", "외부 충격이나 리스크로부터 핵심 부분을 보호할 때 씁니다.", "환율 리스크, 원자재 가격 변동, 공급망 충격 대응에 씁니다.", "protect from 보다 더 전략적·구조적 방어를 암시합니다.", ["risk", "finance"], ["currency fluctuations", "raw material price volatility", "supply disruptions"],
      [
        { en: "Dual sourcing helps insulate the business from single-supplier risk.", kr: "이중 소싱은 단일 공급사 리스크로부터 사업을 보호하는 데 도움이 됩니다." },
        { en: "We need a hedging strategy to insulate our margins from currency fluctuations.", kr: "환율 변동으로부터 마진을 보호할 헤징 전략이 필요합니다." },
        { en: "Buffer stock insulates the production line from supply disruptions.", kr: "완충 재고는 생산 라인을 공급 중단으로부터 보호합니다." },
      ]
    ],

    // ── Batch 4: Advanced patterns with examples ─────────────────────────────
    ["at-this-juncture", "at this juncture", "현 시점에서", "advanced", "pattern", "at this juncture, + clause", "중요한 결정 시점이나 전환점을 강조할 때 씁니다.", "전략 전환, 계약 협상, 위기 대응 상황에서 씁니다.", "at this point 와 비슷하지만 더 공식적이고 중요성을 강조합니다.", ["strategy", "management"], ["it is critical to lock in commitment", "we cannot increase volume", "any delay will be costly"],
      [
        { en: "At this juncture, it is critical that we lock in the supplier commitment.", kr: "현 시점에서 공급사의 확약을 받아두는 것이 매우 중요합니다." },
        { en: "At this juncture, we are not in a position to increase the order volume.", kr: "현 시점에서 주문량을 늘릴 수 있는 상황이 아닙니다." },
        { en: "Any decision made at this juncture will have long-term implications.", kr: "현 시점에서 내리는 결정은 장기적인 영향을 미칠 것입니다." },
      ]
    ],
    ["with-due-respect", "with due respect", "정중히 말씀드리면", "advanced", "pattern", "with due respect, + contrary opinion", "상대 의견에 반대하면서도 예의를 갖출 때 씁니다.", "비현실적 요구에 대한 반박, 계약 조건 이의 제기에 씁니다.", "with all due respect 도 자주 씁니다.", ["negotiation", "formal"], ["the timeline is unrealistic", "the root cause has not been addressed", "the proposed terms are not acceptable"],
      [
        { en: "With due respect, I believe the timeline proposed is not realistic.", kr: "정중히 말씀드리면, 제안하신 일정은 현실적이지 않다고 생각합니다." },
        { en: "With due respect, I would like to revisit the terms of the original agreement.", kr: "정중히 말씀드리면, 원래 계약 조건을 다시 검토하고 싶습니다." },
        { en: "With due respect, the root cause of the quality issue has not been fully addressed.", kr: "정중히 말씀드리면, 품질 문제의 근본 원인이 아직 완전히 해결되지 않았습니다." },
      ]
    ],
    ["the-bottom-line-is", "the bottom line is", "결론은", "advanced", "pattern", "the bottom line is + clause", "여러 논의를 거친 후 핵심 결론을 날카롭게 제시할 때 씁니다.", "협상 마무리, 분석 결론, 의사결정 근거 제시에 씁니다.", "the key point is 보다 더 단호하고 확신 있는 표현입니다.", ["negotiation", "analysis"], ["we need confirmed delivery by month-end", "the margin does not justify the investment", "quality improvement is non-negotiable"],
      [
        { en: "The bottom line is that we need a confirmed delivery date by the end of the month.", kr: "결론은, 이달 말까지 확정 납기일이 필요하다는 것입니다." },
        { en: "The bottom line is that the current margin does not justify the investment.", kr: "결론은, 현재 마진으로는 투자를 정당화할 수 없습니다." },
        { en: "The bottom line is, without consistent quality, we cannot continue the partnership.", kr: "결론은, 일관된 품질 없이는 파트너십을 지속할 수 없습니다." },
      ]
    ],
    ["in-the-final-analysis", "in the final analysis", "최종적으로 보면", "advanced", "pattern", "in the final analysis, + conclusion", "모든 요소를 고려한 최종 결론을 제시할 때 씁니다.", "공급사 평가 결론, 투자 판단, 전략 방향 최종 확정에 씁니다.", "ultimately 와 비슷하지만 더 분석적이고 공식적입니다.", ["analysis", "decision"], ["cost should not be the only driver", "customer satisfaction is the key metric", "the risk is manageable"],
      [
        { en: "In the final analysis, cost alone should not drive the supplier selection decision.", kr: "최종적으로 보면, 비용만이 공급사 선정 결정을 좌우해서는 안 됩니다." },
        { en: "In the final analysis, customer satisfaction is the most important success metric.", kr: "최종적으로 보면, 고객 만족이 가장 중요한 성공 지표입니다." },
        { en: "In the final analysis, the risk is manageable if proper controls are in place.", kr: "최종적으로 보면, 적절한 통제가 갖춰진다면 리스크는 관리 가능합니다." },
      ]
    ],
    ["as-things-stand", "as things stand", "현 상황으로는", "advanced", "pattern", "as things stand, + current situation clause", "현재 상태를 기준으로 전망이나 판단을 말할 때 씁니다.", "납기 전망, 예산 현황, 프로젝트 진행 상태 보고에 씁니다.", "as it stands 도 같은 뜻으로 씁니다.", ["reporting", "planning"], ["we cannot guarantee the original date", "the budget will not cover it", "we are on track"],
      [
        { en: "As things stand, we cannot guarantee the original delivery date.", kr: "현 상황으로는, 원래 납기일을 보장하기가 어렵습니다." },
        { en: "As things stand, the budget will not cover the additional tooling cost.", kr: "현 상황으로는, 예산으로 추가 금형 비용을 충당하기 어렵습니다." },
        { en: "As things stand, we are on track to meet the Q3 revenue target.", kr: "현 상황으로는, 3분기 매출 목표를 달성할 궤도에 있습니다." },
      ]
    ],
    ["suffice-it-to-say", "suffice it to say", "한마디로 말하면", "advanced", "pattern", "suffice it to say + that clause", "불필요하게 길게 설명하는 대신 핵심만 짚을 때 씁니다.", "결과 요약, 상황 설명 축약, 공식 보고 도입부에 씁니다.", "문어체에 가까우므로 공식 서면과 보고서에 적합합니다.", ["reporting", "formal"], ["the results were below expectations", "the supplier's response was unsatisfactory", "a contingency plan is needed"],
      [
        { en: "Suffice it to say, the audit results were below our expectations.", kr: "한마디로 말하면, 감사 결과가 기대에 미치지 못했습니다." },
        { en: "Suffice it to say, the supplier's response to the quality claim was not satisfactory.", kr: "한마디로 말하면, 품질 클레임에 대한 공급사의 대응이 만족스럽지 않았습니다." },
        { en: "Suffice it to say, a more robust contingency plan is needed going forward.", kr: "한마디로 말하면, 앞으로 더 탄탄한 비상 계획이 필요합니다." },
      ]
    ],
    ["the-key-takeaway-is", "the key takeaway is", "핵심은", "advanced", "pattern", "the key takeaway is + that clause", "회의나 보고서에서 가장 중요한 메시지를 강조할 때 씁니다.", "회의 마무리, 경영 보고, 협상 총평에 씁니다.", "the main point is 보다 더 비즈니스 발표 어조가 강합니다.", ["reporting", "meeting"], ["we need faster lead times", "margin improvement requires volume", "documentation needs improvement"],
      [
        { en: "The key takeaway from today's meeting is that we need to shorten our lead times.", kr: "오늘 회의의 핵심은 납기를 단축해야 한다는 것입니다." },
        { en: "The key takeaway is that margin improvement requires a firmer volume commitment.", kr: "핵심은, 마진 개선에는 더 확실한 물량 약정이 필요하다는 것입니다." },
        { en: "The key takeaway from the audit is that documentation practices need significant improvement.", kr: "감사에서 얻은 핵심은, 문서 관리 관행이 크게 개선되어야 한다는 것입니다." },
      ]
    ],

    // ── Batch 5: Intermediate phrasal verbs with examples ────────────────────
    ["get-back-to", "get back to", "다시 연락하다", "intermediate", "phrasal-verb", "get back to + person / query", "확인 후 회신하거나 보류 중인 질문에 답할 때 씁니다.", "이메일 회신, 협상 보류, 문의 대기 상황에 가장 자주 쓰이는 표현 중 하나입니다.", "reply to 와 비슷하지만 더 구어적이고 자연스럽습니다.", ["email", "communication"], ["the client", "the inquiry", "the pending question"],
      [
        { en: "I'll get back to you on this by end of day.", kr: "오늘 중으로 다시 연락드리겠습니다." },
        { en: "Let me get back to you once I confirm the stock level with the warehouse.", kr: "창고에서 재고 수준을 확인하는 대로 다시 연락드리겠습니다." },
        { en: "Could you get back to us with the revised timeline by Thursday?", kr: "목요일까지 수정된 일정으로 다시 연락 주시겠어요?" },
      ]
    ],
    ["nail-down", "nail down", "확실히 확정하다", "intermediate", "phrasal-verb", "nail down + price / date / spec / terms", "변경 없이 최종 확정짓는다는 뜻이 강합니다.", "계약 전 가격, 납기, 사양 최종 확정에 씁니다.", "tie down 과 비슷하지만 더 단호한 어조입니다.", ["negotiation", "planning"], ["the final price", "the loading date", "the project scope"],
      [
        { en: "Let's nail down the final price before we sign the contract.", kr: "계약서에 서명하기 전에 최종 가격을 확정합시다." },
        { en: "Can you nail down the exact loading date with the factory?", kr: "공장과 정확한 선적일을 확정해주시겠어요?" },
        { en: "We need to nail down the scope of work before production begins.", kr: "생산 시작 전에 업무 범위를 확실히 확정해야 합니다." },
      ]
    ],
    ["sum-up", "sum up", "요약하다", "intermediate", "phrasal-verb", "sum up + discussion / key points", "회의나 통화 내용을 간결하게 정리할 때 씁니다.", "미팅 마무리, 이메일 요약, 보고서 결론부에 씁니다.", "summarize 와 같지만 더 구어적입니다.", ["meeting", "email"], ["the key decisions", "the action items", "where we stand"],
      [
        { en: "To sum up, we agreed on a 30-day payment term and a 5% discount.", kr: "요약하면, 30일 결제 조건과 5% 할인에 합의했습니다." },
        { en: "Could you sum up the key action items from the meeting?", kr: "회의에서 나온 주요 액션 아이템을 요약해주시겠어요?" },
        { en: "Let me sum up where we stand before we close today's call.", kr: "오늘 통화를 마치기 전에 현재 상황을 요약하겠습니다." },
      ]
    ],
    ["lay-out", "lay out", "설명하다, 제시하다", "intermediate", "phrasal-verb", "lay out + plan / options / requirements", "계획이나 요구사항을 구조적으로 설명할 때 씁니다.", "제안서 제시, 요구사항 설명, 전략 발표에 씁니다.", "explain 보다 더 체계적으로 펼쳐 보이는 뉘앙스입니다.", ["planning", "communication"], ["the timeline", "the options", "our requirements"],
      [
        { en: "Let me lay out the plan for this product launch.", kr: "이번 제품 출시 계획을 설명하겠습니다." },
        { en: "Could you lay out your requirements so we can prepare a proper quotation?", kr: "요구사항을 설명해주시면 정식 견적서를 준비하겠습니다." },
        { en: "The operations manager laid out the new inspection process in the briefing.", kr: "운영 담당자가 브리핑에서 새 검사 프로세스를 설명했습니다." },
      ]
    ],
    ["clear-up", "clear up", "명확히 하다, 해소하다", "intermediate", "phrasal-verb", "clear up + misunderstanding / confusion / detail", "오해나 불명확한 부분을 바로잡을 때 씁니다.", "계약 조건 오해, 사양 혼동, 책임 불명확 해소에 씁니다.", "clarify 와 같은 뜻이지만 더 구어적입니다.", ["communication", "email"], ["a misunderstanding", "the confusion", "who is responsible"],
      [
        { en: "I'd like to clear up a few points about the delivery terms.", kr: "납품 조건에 대해 몇 가지 명확히 하고 싶습니다." },
        { en: "Can we clear up who is responsible for customs clearance?", kr: "통관 책임이 누구에게 있는지 명확히 해주시겠어요?" },
        { en: "This email should clear up the confusion about the specification.", kr: "이 이메일이 사양에 대한 혼동을 해소해줄 것입니다." },
      ]
    ],
    ["team-up-with", "team up with", "협력하다", "intermediate", "phrasal-verb", "team up with + partner / supplier / department", "공동 목표를 위해 협력 관계를 맺을 때 씁니다.", "파트너십 구축, 부서 간 협업, 대리점 협력에 씁니다.", "collaborate with 와 비슷하지만 더 능동적이고 구어적입니다.", ["partnership", "operations"], ["a local distributor", "the logistics team", "a certified partner"],
      [
        { en: "We teamed up with a local distributor to expand our market reach.", kr: "시장 확대를 위해 현지 유통업체와 협력했습니다." },
        { en: "Our marketing and logistics teams teamed up to plan a smoother product launch.", kr: "마케팅팀과 물류팀이 협력해 더 원활한 제품 출시를 기획했습니다." },
        { en: "We are looking to team up with a certified quality partner for the new line.", kr: "신규 라인을 위해 인증된 품질 파트너와 협력할 계획입니다." },
      ]
    ],
    ["smooth-out", "smooth out", "원활히 처리하다", "intermediate", "phrasal-verb", "smooth out + issue / process / transition", "마찰이나 문제를 없애 프로세스를 매끄럽게 만들 때 씁니다.", "주문 흐름, 인계 과정, 시스템 전환 시 남은 문제 해소에 씁니다.", "iron out 과 비슷하지만 작은 마찰 제거에 더 자주 씁니다.", ["operations", "communication"], ["the ordering process", "the communication flow", "remaining issues"],
      [
        { en: "We are working to smooth out the ordering process between the two systems.", kr: "두 시스템 간 주문 프로세스를 원활하게 정비하고 있습니다." },
        { en: "The new SOP should smooth out the handover between shifts.", kr: "새 SOP가 교대 인수인계를 원활하게 해줄 것입니다." },
        { en: "Let's smooth out any remaining issues before the client visit next week.", kr: "다음 주 고객 방문 전에 남은 문제들을 해소합시다." },
      ]
    ],
    ["pull-off", "pull off", "해내다, 성사시키다", "intermediate", "phrasal-verb", "pull off + delivery / deal / launch", "어려운 상황에도 불구하고 결과를 이뤄낼 때 씁니다.", "촉박한 납기 달성, 까다로운 계약 성사, 성공적인 출시에 씁니다.", "achieve 보다 더 어려움을 극복했다는 뉘앙스가 강합니다.", ["operations", "sales"], ["the delivery", "the contract", "the product launch"],
      [
        { en: "The team pulled off the delivery despite the port congestion.", kr: "팀이 항구 혼잡에도 불구하고 납기를 해냈습니다." },
        { en: "We pulled off the product launch two weeks ahead of the original schedule.", kr: "원래 일정보다 2주 앞당겨 제품 출시를 성사시켰습니다." },
        { en: "It won't be easy, but I believe we can pull off this contract.", kr: "쉽지 않겠지만, 이 계약을 성사시킬 수 있다고 믿습니다." },
      ]
    ],
    ["size-up", "size up", "파악하다, 평가하다", "intermediate", "phrasal-verb", "size up + competitor / supplier / situation", "상황이나 상대를 신속히 평가할 때 씁니다.", "경쟁사 분석, 신규 공급사 역량 평가, 상황 파악에 씁니다.", "assess 와 비슷하지만 더 빠르고 실용적인 판단을 암시합니다.", ["analysis", "strategy"], ["the competition", "the supplier's capacity", "the market situation"],
      [
        { en: "Before entering the market, let's size up the competition thoroughly.", kr: "시장 진입 전에 경쟁 상황을 충분히 파악합시다." },
        { en: "We need to size up the supplier's actual production capacity before placing the bulk order.", kr: "대량 주문 전에 공급사의 실제 생산 역량을 평가해야 합니다." },
        { en: "The account manager sized up the situation quickly and proposed a workable solution.", kr: "담당자가 상황을 빠르게 파악하고 실행 가능한 해결책을 제시했습니다." },
      ]
    ],
    ["bring-in", "bring in", "도입하다, 영입하다", "intermediate", "phrasal-verb", "bring in + specialist / system / new supplier", "외부에서 전문가나 자원을 추가할 때 씁니다.", "외부 감사, ERP 시스템 도입, 신규 물류사 추가에 씁니다.", "introduce 나 hire 와 비슷하지만 더 폭넓게 씁니다.", ["operations", "hr"], ["an external auditor", "a new system", "the logistics team"],
      [
        { en: "We may need to bring in an external quality auditor for this inspection.", kr: "이번 검사에는 외부 품질 감사를 영입해야 할 수 있습니다." },
        { en: "The company brought in a new ERP system to better manage inventory.", kr: "회사가 재고 관리를 강화하기 위해 새 ERP 시스템을 도입했습니다." },
        { en: "Let's bring in the logistics team early to avoid last-minute coordination issues.", kr: "막판 조율 문제를 피하려면 물류팀을 초기부터 참여시킵시다." },
      ]
    ],
    ["talk-through", "talk through", "함께 논의하다", "intermediate", "phrasal-verb", "talk through + plan / issue / options", "세부 사항을 함께 검토하며 논의할 때 씁니다.", "계약 조건 검토, 전략 논의, 문제 해결 회의에 씁니다.", "discuss 보다 더 대화형이고 서로 이해를 맞추는 과정이 강합니다.", ["meeting", "communication"], ["the contract terms", "the options", "the production schedule"],
      [
        { en: "Can we talk through the contract terms on our next call?", kr: "다음 통화에서 계약 조건을 함께 논의할 수 있나요?" },
        { en: "Let's talk through the options before we make a final decision.", kr: "최종 결정을 내리기 전에 선택지를 함께 검토합시다." },
        { en: "I'd like to talk through the production schedule with the factory this week.", kr: "이번 주에 공장과 생산 일정을 함께 논의하고 싶습니다." },
      ]
    ],
    ["jump-on", "jump on", "즉시 대응하다", "intermediate", "phrasal-verb", "jump on + issue / opportunity / request", "지체 없이 빠르게 대응하거나 기회를 잡을 때 씁니다.", "긴급 클레임, 시장 기회, 고객 요청 즉시 처리에 씁니다.", "act on 보다 더 긴박하고 즉각적인 뉘앙스입니다.", ["operations", "sales"], ["the quality complaint", "the market opportunity", "the client inquiry"],
      [
        { en: "Please jump on this quality complaint right away — the client is waiting.", kr: "이 품질 클레임에 즉시 대응해주세요 — 고객이 기다리고 있습니다." },
        { en: "We need to jump on this market opportunity before our competitors do.", kr: "경쟁사보다 먼저 이 시장 기회를 잡아야 합니다." },
        { en: "The sales team jumped on the inquiry within an hour of receiving it.", kr: "영업팀이 문의를 받은 지 한 시간 안에 즉시 대응했습니다." },
      ]
    ],
    ["track-down", "track down", "찾아내다", "intermediate", "phrasal-verb", "track down + document / supplier / contact", "찾기 어려운 정보나 사람을 끝까지 추적해 찾을 때 씁니다.", "누락 서류 추적, 원산지 정보 확인, 연락처 확보에 씁니다.", "find 보다 더 능동적이고 수고가 필요함을 암시합니다.", ["operations", "documents"], ["the original agreement", "the test report", "a qualified supplier"],
      [
        { en: "I'm trying to track down the original signed agreement from three years ago.", kr: "3년 전 서명된 원본 계약서를 찾으려 하고 있습니다." },
        { en: "Could you track down the test report from last year's production batch?", kr: "작년 생산 배치의 시험 성적서를 찾아주시겠어요?" },
        { en: "We finally tracked down a supplier who meets all the certification requirements.", kr: "마침내 모든 인증 요건을 충족하는 공급사를 찾아냈습니다." },
      ]
    ],
    ["run-by", "run by", "의견을 구하다, 보고하다", "intermediate", "phrasal-verb", "run (something) by + person / team", "결정 전에 상급자나 관련자의 의견을 구할 때 씁니다.", "계획 승인, 계약 조건 확인, 제안서 검토 요청에 씁니다.", "check with 와 비슷하지만 더 비공식적이고 자연스럽습니다.", ["approval", "communication"], ["the director", "the legal team", "the operations manager"],
      [
        { en: "Before I commit, let me run this proposal by the director.", kr: "확약하기 전에 이 제안서를 임원에게 보고하겠습니다." },
        { en: "Can you run these payment terms by the legal team first?", kr: "이 결제 조건을 법무팀에 먼저 확인해주시겠어요?" },
        { en: "I'll run the revised timeline by our operations manager and get back to you.", kr: "수정된 일정을 운영 담당자에게 확인하고 다시 연락드리겠습니다." },
      ]
    ],
    ["look-ahead", "look ahead", "앞을 내다보다", "intermediate", "phrasal-verb", "look ahead to + next period / opportunity", "현재 이슈를 넘어 미래를 계획하거나 전망할 때 씁니다.", "분기 전망, 내년 계획, 제품 로드맵 논의에 씁니다.", "looking ahead 로 문장을 시작하는 형태가 가장 자주 쓰입니다.", ["planning", "strategy"], ["Q4 performance", "next year's expansion", "the next product cycle"],
      [
        { en: "Looking ahead, we expect order volumes to recover strongly in Q4.", kr: "앞을 내다보면, 4분기에 주문량이 크게 회복될 것으로 예상합니다." },
        { en: "As we look ahead to next year, our focus will shift to capacity expansion.", kr: "내년을 내다보면, 우리의 초점은 생산 능력 확장으로 이동할 것입니다." },
        { en: "It's time to look ahead and start planning for the next product cycle.", kr: "이제 앞을 내다보며 다음 제품 사이클 계획을 시작할 때입니다." },
      ]
    ],

    // ── Batch 5: Advanced phrasal verbs with examples ────────────────────────
    ["hammer-out", "hammer out", "협상으로 타결하다", "advanced", "phrasal-verb", "hammer out + agreement / deal / terms", "어렵고 긴 협상 끝에 최종 합의를 이끌어낼 때 씁니다.", "계약 조건 합의, 분쟁 해결, 복잡한 가격 협상 타결에 씁니다.", "negotiate 보다 더 고된 과정을 거쳤음을 강조합니다.", ["negotiation", "legal"], ["an agreement", "the commercial terms", "a compromise"],
      [
        { en: "After three rounds of negotiation, we finally hammered out an agreement.", kr: "세 차례 협상 끝에 마침내 합의를 타결했습니다." },
        { en: "The two parties need to hammer out the final commercial terms this week.", kr: "양측이 이번 주에 최종 상업 조건을 협상으로 타결해야 합니다." },
        { en: "The procurement team hammered out a compromise that satisfied both sides.", kr: "구매팀이 양측을 만족시키는 타협안을 이끌어냈습니다." },
      ]
    ],
    ["ramp-up", "ramp up", "급속히 늘리다", "advanced", "phrasal-verb", "ramp up + production / capacity / investment", "단순 확대가 아니라 빠른 속도로 증대할 때 씁니다.", "성수기 생산 증대, 신규 시장 투자 확대, 인력 급증에 씁니다.", "scale up 보다 더 빠른 속도감을 암시합니다.", ["manufacturing", "operations"], ["production capacity", "hiring", "delivery frequency"],
      [
        { en: "The factory will ramp up production capacity by 30% next quarter.", kr: "공장이 다음 분기에 생산 능력을 30% 급속히 늘릴 예정입니다." },
        { en: "We need to ramp up hiring immediately ahead of the peak season.", kr: "성수기를 앞두고 즉시 채용을 대폭 늘려야 합니다." },
        { en: "The client wants us to ramp up delivery frequency starting next month.", kr: "고객이 다음 달부터 납품 빈도를 늘려달라고 요청했습니다." },
      ]
    ],
    ["roll-back", "roll back", "되돌리다, 철회하다", "advanced", "phrasal-verb", "roll back + price / policy / change", "이전에 적용한 변경 사항을 원상 복구할 때 씁니다.", "가격 인상 철회, 정책 변경 취소, 스펙 변경 되돌리기에 씁니다.", "reverse 와 비슷하지만 가격이나 정책 철회에 더 자주 씁니다.", ["pricing", "management"], ["the price increase", "the new policy", "the spec change"],
      [
        { en: "The client is asking us to roll back the Q2 price increase.", kr: "고객이 2분기 가격 인상을 철회해달라고 요청하고 있습니다." },
        { en: "Management decided to roll back the new procurement policy after strong internal pushback.", kr: "내부 반대가 심해 경영진이 새 구매 정책을 철회하기로 결정했습니다." },
        { en: "We cannot roll back the spec change without retesting the entire batch.", kr: "전체 배치를 재시험하지 않고는 사양 변경을 되돌릴 수 없습니다." },
      ]
    ],
    ["draw-on", "draw on", "(경험·자원을) 활용하다", "advanced", "phrasal-verb", "draw on + experience / expertise / data", "보유한 지식이나 자원을 바탕으로 문제를 해결할 때 씁니다.", "전문성 활용, 시장 데이터 기반 분석, 과거 사례 적용에 씁니다.", "leverage 와 비슷하지만 더 지식·경험 중심입니다.", ["strategy", "analysis"], ["past experience", "market research", "in-house expertise"],
      [
        { en: "We can draw on our experience in automotive supply chains to solve this.", kr: "자동차 공급망 경험을 활용해 이 문제를 해결할 수 있습니다." },
        { en: "The proposal draws on three years of market research and customer data.", kr: "이 제안서는 3년간의 시장 조사와 고객 데이터를 활용했습니다." },
        { en: "She drew on her supplier negotiation background to close the deal effectively.", kr: "그녀는 공급사 협상 경험을 활용해 거래를 효과적으로 성사시켰습니다." },
      ]
    ],
    ["weigh-up", "weigh up", "비교 검토하다", "advanced", "phrasal-verb", "weigh up + options / risks / pros and cons", "여러 선택지의 장단점을 신중하게 비교 분석할 때 씁니다.", "공급사 선정, 투자 결정, 전략 방향 결론 도출에 씁니다.", "consider 보다 더 체계적이고 균형 잡힌 비교를 암시합니다.", ["decision", "analysis"], ["all the options", "the cost-benefit", "the risks and rewards"],
      [
        { en: "Let's weigh up all the options before committing to a single supplier.", kr: "단일 공급사를 확정하기 전에 모든 선택지를 비교 검토합시다." },
        { en: "We need to weigh up the cost benefit against the long-term quality risk.", kr: "비용 편익과 장기 품질 리스크를 함께 비교 검토해야 합니다." },
        { en: "The board weighed up the risks carefully and decided to proceed with the investment.", kr: "이사회가 리스크를 신중히 비교 검토한 후 투자를 진행하기로 결정했습니다." },
      ]
    ],
    ["hold-out-for", "hold out for", "~를 고집하다, 더 나은 조건을 요구하다", "advanced", "phrasal-verb", "hold out for + better terms / specific condition", "타협하지 않고 원하는 조건을 끝까지 고집할 때 씁니다.", "가격 협상, 납기 확약 요구, 사양 유지 주장에 씁니다.", "insist on 과 비슷하지만 더 기다리는 뉘앙스가 있습니다.", ["negotiation", "pricing"], ["a lower price", "a confirmed delivery date", "better payment terms"],
      [
        { en: "The supplier is holding out for a higher minimum order quantity.", kr: "공급사가 더 높은 최소 주문량을 고집하고 있습니다." },
        { en: "We are holding out for a confirmed delivery date before releasing the payment.", kr: "결제 전에 확정 납기일을 받을 때까지 기다리고 있습니다." },
        { en: "Don't hold out for perfect conditions — sometimes good enough is the right call.", kr: "완벽한 조건만 고집하지 마세요 — 때로는 충분히 좋은 것이 옳은 판단입니다." },
      ]
    ],
    ["single-out", "single out", "선별하다, 특정하다", "advanced", "phrasal-verb", "single out + supplier / issue / factor", "여럿 중에서 특정 항목이나 원인을 골라낼 때 씁니다.", "우선 공급사 선정, 감사 결과 핵심 지적, 근본 원인 특정에 씁니다.", "identify 보다 더 선택적이고 분리해낸다는 뉘앙스입니다.", ["analysis", "quality"], ["three processes", "the top suppliers", "the root cause"],
      [
        { en: "The audit singled out three processes that require immediate corrective action.", kr: "감사가 즉각적인 시정 조치가 필요한 세 가지 프로세스를 특정했습니다." },
        { en: "We singled out the top five suppliers for the preferred vendor program.", kr: "우리는 우선 공급사 프로그램을 위해 상위 5개 공급사를 선별했습니다." },
        { en: "The quality team singled out the material handling step as the primary root cause.", kr: "품질팀이 자재 취급 단계를 주요 근본 원인으로 특정했습니다." },
      ]
    ],
    ["set-back", "set back", "지연시키다", "advanced", "phrasal-verb", "set back + project / timeline / launch", "예상치 못한 사건이 일정을 뒤로 미룰 때 씁니다.", "항구 혼잡, 검사 불합격, 자재 지연으로 일정 지연 시 씁니다.", "delay 와 같지만 더 구체적인 원인이 있는 경우에 씁니다.", ["project", "logistics"], ["the delivery schedule", "the production plan", "the product launch"],
      [
        { en: "The port congestion set back our delivery schedule by two weeks.", kr: "항구 혼잡이 납기 일정을 2주 지연시켰습니다." },
        { en: "The failed incoming inspection set back the production plan by at least ten days.", kr: "입고 검사 불합격으로 생산 계획이 최소 10일 지연됐습니다." },
        { en: "Any further delay will set back the entire product launch calendar.", kr: "추가 지연이 발생하면 전체 제품 출시 일정이 뒤로 밀립니다." },
      ]
    ],
    ["bring-about", "bring about", "야기하다, 가져오다", "advanced", "phrasal-verb", "bring about + change / improvement / result", "어떤 행동이나 사건이 결과를 가져올 때 씁니다.", "프로세스 개선 결과, 정책 변화 효과, 불량 원인 분석에 씁니다.", "cause 나 lead to 와 비슷하지만 더 공식적이고 중립적입니다.", ["analysis", "management"], ["a significant improvement", "real cost savings", "an increase in lead times"],
      [
        { en: "The new inspection protocol brought about a significant reduction in defect rates.", kr: "새 검사 프로토콜이 불량률을 크게 줄이는 결과를 가져왔습니다." },
        { en: "Better supplier collaboration can bring about real and lasting cost savings.", kr: "공급사와의 더 나은 협업은 실질적이고 지속적인 비용 절감을 가져올 수 있습니다." },
        { en: "What factors brought about the sudden increase in lead times this quarter?", kr: "이번 분기에 납기가 갑자기 늘어난 요인은 무엇입니까?" },
      ]
    ],
    ["put-forward", "put forward", "제안하다, 제시하다", "advanced", "phrasal-verb", "put forward + proposal / idea / candidate", "공식적으로 제안이나 아이디어를 내놓을 때 씁니다.", "개선 제안, 후보자 추천, 대안 제시에 씁니다.", "suggest 보다 더 공식적이고 진지한 제안을 암시합니다.", ["negotiation", "management"], ["a revised proposal", "three options", "a candidate"],
      [
        { en: "We would like to put forward a revised proposal for your consideration.", kr: "검토해주시도록 수정된 제안서를 제시하고자 합니다." },
        { en: "The team put forward three options for reducing logistics costs.", kr: "팀이 물류 비용 절감을 위한 세 가지 방안을 제안했습니다." },
        { en: "I'll put forward your feedback at the next management review meeting.", kr: "귀하의 피드백을 다음 경영 검토 회의에서 제안하겠습니다." },
      ]
    ],
    ["bear-out", "bear out", "입증하다, 뒷받침하다", "advanced", "phrasal-verb", "bear out + claim / forecast / assumption", "데이터나 결과가 이전의 주장을 확인해줄 때 씁니다.", "수요 예측 검증, 성능 주장 확인, 가정 입증에 씁니다.", "confirm 보다 더 증거 기반의 객관적인 어조입니다.", ["analysis", "reporting"], ["the earlier forecast", "the supplier's claims", "the assumption"],
      [
        { en: "The quarterly data bears out our earlier forecast of a 10% volume increase.", kr: "분기 데이터가 10% 물량 증가 전망을 입증해주고 있습니다." },
        { en: "The field test results bear out the supplier's performance claims.", kr: "현장 시험 결과가 공급사의 성능 주장을 뒷받침합니다." },
        { en: "The numbers don't bear out the assumption that input costs will fall next year.", kr: "데이터는 내년에 원가가 하락할 것이라는 가정을 뒷받침하지 않습니다." },
      ]
    ],
    ["whittle-down", "whittle down", "조금씩 줄여나가다", "advanced", "phrasal-verb", "whittle down + price / list / number", "협상이나 검토를 거쳐 점진적으로 줄여나갈 때 씁니다.", "가격 협상, 공급사 후보군 축소, 비용 절감에 씁니다.", "reduce 보다 점진적·반복적 과정을 강조합니다.", ["negotiation", "analysis"], ["the unit price", "the supplier shortlist", "the backlog"],
      [
        { en: "Through rounds of negotiation, we whittled down the unit price by 8%.", kr: "여러 차례 협상을 통해 단가를 8% 줄여나갔습니다." },
        { en: "We whittled down the supplier shortlist from fifteen candidates to three.", kr: "공급사 후보군을 15개에서 3개로 줄여나갔습니다." },
        { en: "The team worked hard to whittle down the backlog before the quarter closed.", kr: "팀이 분기 마감 전에 미결 항목을 줄이기 위해 열심히 작업했습니다." },
      ]
    ],
    ["wind-up", "wind up", "결국 ~이 되다, 마무리하다", "advanced", "phrasal-verb", "wind up + gerund / over budget / in a situation", "예상치 못한 결과로 끝나거나, 상황이나 프로세스를 공식 종료할 때 씁니다.", "예산 초과 결과, 협상 결렬, 프로젝트 종료 결과 표현에 씁니다.", "end up 과 비슷하지만 더 공식적인 어조입니다.", ["finance", "project"], ["over budget", "losing the account", "being extended"],
      [
        { en: "The project wound up over budget due to unexpected raw material cost increases.", kr: "예상치 못한 원자재 비용 상승으로 프로젝트가 결국 예산을 초과했습니다." },
        { en: "If we don't act quickly, we will wind up losing this key account.", kr: "빨리 대응하지 않으면 결국 이 핵심 고객을 잃게 됩니다." },
        { en: "The pilot program wound up being extended for another six months.", kr: "파일럿 프로그램이 결국 6개월 더 연장되는 결과가 됐습니다." },
      ]
    ],
    ["cost-out", "cost out", "비용을 산출하다", "advanced", "phrasal-verb", "cost out + option / change / project", "특정 옵션이나 변경 사항의 비용을 상세하게 계산할 때 씁니다.", "신규 포장 비용 산출, 에어프레이트 비용 계산, 공정 변경 영향 산출에 씁니다.", "calculate 보다 더 프로젝트 관리·실무적인 표현입니다.", ["finance", "planning"], ["the new packaging design", "the tooling changes", "the air freight option"],
      [
        { en: "Let's cost out the new packaging design before we approve the change.", kr: "변경을 승인하기 전에 새 포장 디자인의 비용을 산출합시다." },
        { en: "The engineering team will cost out the tooling changes and report back this week.", kr: "엔지니어링팀이 이번 주에 금형 변경 비용을 산출해 보고할 예정입니다." },
        { en: "We need to cost out the air freight option versus sea freight to make the right call.", kr: "올바른 판단을 위해 항공 운임과 해상 운임 비용을 산출해야 합니다." },
      ]
    ],
    ["bottom-out", "bottom out", "최저점에 도달하다, 바닥을 치다", "advanced", "phrasal-verb", "bottom out + market / price / demand", "하락하던 수치가 최저점에 이르러 반등 가능성을 암시할 때 씁니다.", "원자재 가격 동향, 수요 사이클, 실적 회복 분석에 씁니다.", "hit bottom 과 비슷하지만 더 분석적·공식적입니다.", ["analysis", "finance"], ["raw material prices", "lead times", "market share"],
      [
        { en: "Raw material prices appear to have bottomed out and are beginning to recover.", kr: "원자재 가격이 최저점에 도달한 것으로 보이며 회복되기 시작하고 있습니다." },
        { en: "Lead times bottomed out at three weeks during the off-peak period.", kr: "비수기에 납기가 최저 3주 수준까지 내려갔습니다." },
        { en: "Our market share bottomed out last year and has been recovering steadily since.", kr: "당사 시장 점유율은 작년에 최저점을 찍고 그 이후 꾸준히 회복되고 있습니다." },
      ]
    ],

    // ── Batch 5: 일상·회화 구동사 ──────────────────────────────────────────────
    ["bring-forward", "bring forward", "앞당기다, 먼저 꺼내다", "intermediate", "phrasal-verb", "bring forward + meeting / deadline / topic", "일정을 앞당기거나 의제를 먼저 논의할 때 씁니다.", "회의 일정 조정, 마감 단축 요청, 의제 순서 변경에 씁니다.", "bring forward 뒤에 시간 또는 의제가 옵니다.", ["meeting", "planning"], ["the meeting", "the deadline", "the agenda item"],
      [
        { en: "Can we bring the meeting forward to Monday instead of Wednesday?", kr: "회의를 수요일 대신 월요일로 앞당길 수 있을까요?" },
        { en: "The client asked us to bring forward the delivery date by one week.", kr: "고객이 납기일을 1주일 앞당겨달라고 요청했습니다." },
        { en: "I'd like to bring forward the pricing discussion to the beginning of the agenda.", kr: "가격 논의를 의제 첫 번째로 앞당기고 싶습니다." },
      ]
    ],
    ["put-across", "put across", "설득력 있게 전달하다", "intermediate", "phrasal-verb", "put across + idea / message / point", "생각이나 메시지를 상대방이 이해하도록 전달할 때 씁니다.", "발표, 협상, 설명 등 설득 커뮤니케이션에 씁니다.", "get across 와 거의 같지만 더 능동적입니다.", ["communication", "presentation"], ["the main message", "the proposal", "the concern"],
      [
        { en: "She put across the cost savings proposal very clearly.", kr: "그녀는 비용 절감 제안을 매우 명확하게 전달했습니다." },
        { en: "It's hard to put across the urgency of this issue in an email.", kr: "이메일로 이 문제의 긴급성을 전달하기가 쉽지 않습니다." },
        { en: "Make sure you put across all the key points in the first five minutes.", kr: "첫 5분 안에 핵심 사항을 모두 전달하도록 하세요." },
      ]
    ],
    ["get-through-to", "get through to", "연락이 닿다, 이해시키다", "intermediate", "phrasal-verb", "get through to + person / client", "전화가 연결되거나 이해를 시킬 때 씁니다.", "전화 연결, 고객 이해, 설명 시도 맥락에 씁니다.", "두 의미 모두 맥락에서 파악합니다.", ["communication", "support"], ["the client", "the supplier", "the technical team"],
      [
        { en: "I've been trying to get through to the customer service team all morning.", kr: "오전 내내 고객 서비스팀에 연락을 시도하고 있습니다." },
        { en: "I just can't seem to get through to him about the urgency of this.", kr: "이 문제의 긴급성을 그에게 이해시키기가 정말 어렵습니다." },
        { en: "Finally got through to the logistics team — they confirmed the booking.", kr: "마침내 물류팀과 연락이 닿았습니다 — 예약을 확인했습니다." },
      ]
    ],
    ["talk-through", "talk through", "함께 상의하며 설명하다", "intermediate", "phrasal-verb", "talk through + plan / issue / process", "상대방과 함께 단계적으로 논의하며 설명할 때 씁니다.", "신규 프로세스 설명, 계획 공유, 이슈 논의에 씁니다.", "go through 와 비슷하지만 더 대화·협력 중심입니다.", ["meeting", "communication"], ["the plan", "the issue", "the next steps"],
      [
        { en: "Can we talk through the shipment schedule together?", kr: "선적 일정을 함께 논의할 수 있을까요?" },
        { en: "I'd like to talk through our concerns before we sign the contract.", kr: "계약 서명 전에 우리의 우려 사항을 함께 이야기하고 싶습니다." },
        { en: "The engineer talked the team through the new testing procedure.", kr: "엔지니어가 팀에게 새로운 테스트 절차를 단계별로 설명했습니다." },
      ]
    ],
    ["fall-behind", "fall behind", "뒤처지다, 지연되다", "intermediate", "phrasal-verb", "fall behind + on / with + schedule / target", "일정이나 목표에서 뒤떨어질 때 씁니다.", "납기 지연, 생산 목표 미달, 지불 연체에 씁니다.", "fall behind schedule / fall behind on payments 형태로 씁니다.", ["planning", "operations"], ["schedule", "the target", "on payments"],
      [
        { en: "We are falling behind on the production schedule due to material shortage.", kr: "자재 부족으로 생산 일정이 지연되고 있습니다." },
        { en: "If we fall behind this week, we won't be able to catch up before the deadline.", kr: "이번 주에 뒤처지면 마감 전에 따라잡지 못할 것입니다." },
        { en: "The client has fallen behind on payments for the last two months.", kr: "고객이 지난 두 달간 결제가 밀리고 있습니다." },
      ]
    ],
    ["pull-off", "pull off", "해내다, 성공적으로 완수하다", "intermediate", "phrasal-verb", "pull off + deal / project / achievement", "어려운 일을 성공적으로 해낼 때 씁니다.", "빡빡한 마감 달성, 까다로운 협상 성공, 복잡한 프로젝트 완수에 씁니다.", "주로 어려운 상황에서의 성공을 묘사합니다.", ["sales", "project"], ["the deal", "the launch", "the tight deadline"],
      [
        { en: "We managed to pull off the delivery just in time for the trade fair.", kr: "전시회에 맞춰 간신히 납품을 성공시켰습니다." },
        { en: "It was a tough negotiation, but we pulled it off.", kr: "힘든 협상이었지만 해냈습니다." },
        { en: "The team pulled off a remarkable turnaround in just three months.", kr: "팀은 불과 3개월 만에 놀라운 반전을 이뤄냈습니다." },
      ]
    ],
    ["get-on-with", "get on with", "계속 진행하다", "intermediate", "phrasal-verb", "get on with + task / work", "지체하지 않고 일을 계속 진행할 때 씁니다.", "회의 마무리 후 실행 단계 전환에 자주 씁니다.", "get along with 는 사람과 잘 지내다 는 다른 의미입니다.", ["operations", "meeting"], ["the task", "the report", "our work"],
      [
        { en: "Let's stop discussing and just get on with the plan.", kr: "논의를 멈추고 계획대로 진행합시다." },
        { en: "Once we receive the approval, we can get on with the production.", kr: "승인을 받으면 바로 생산에 착수할 수 있습니다." },
        { en: "I'll get on with the report while you handle the client call.", kr: "고객 전화는 당신이 처리하는 동안 저는 보고서를 계속 작성하겠습니다." },
      ]
    ],
    ["hold-out-for", "hold out for", "~을 고집하다, 버티다", "intermediate", "phrasal-verb", "hold out for + better terms / lower price", "더 나은 조건을 얻기 위해 버틸 때 씁니다.", "협상에서 가격, 조건, 납기를 양보하지 않을 때 씁니다.", "hold on 과 혼동하지 않습니다.", ["negotiation", "pricing"], ["a better price", "longer payment terms", "a higher volume commitment"],
      [
        { en: "We should hold out for a price below $5 per unit.", kr: "단가 5달러 이하를 고집해야 합니다." },
        { en: "The supplier held out for a minimum order of 2,000 units.", kr: "공급사는 최소 주문 2,000개를 고집했습니다." },
        { en: "Don't settle too quickly — hold out for better payment terms.", kr: "너무 빨리 타협하지 마세요 — 더 나은 결제 조건을 고집하세요." },
      ]
    ],
    ["get-around-to", "get around to", "결국 ~하게 되다", "intermediate", "phrasal-verb", "get around to + task / issue", "밀려 있던 일을 드디어 할 때 씁니다.", "미루던 보고서 작성, 지연된 이메일 회신에 씁니다.", "I'll get around to it eventually 형태로 자주 씁니다.", ["email", "operations"], ["the report", "the follow-up", "the review"],
      [
        { en: "Sorry, I haven't gotten around to reviewing your proposal yet.", kr: "죄송합니다, 아직 제안서 검토를 못 했습니다." },
        { en: "I'll get around to updating the spreadsheet this afternoon.", kr: "오늘 오후에 스프레드시트를 업데이트할게요." },
        { en: "He finally got around to calling the client back after two days.", kr: "그는 이틀 만에 드디어 고객에게 다시 연락했습니다." },
      ]
    ],
    ["take-over", "take over", "인수하다, 이어받다", "intermediate", "phrasal-verb", "take over + account / responsibility / project", "업무나 역할을 이어받을 때 씁니다.", "담당자 교체, 프로젝트 인수인계, 회사 인수합병에 씁니다.", "hand over 의 반대 관점입니다.", ["management", "hr"], ["the account", "the project", "responsibilities"],
      [
        { en: "She will take over the account while the manager is on leave.", kr: "매니저 휴가 중에 그녀가 해당 계정을 담당할 것입니다." },
        { en: "We are taking over the supplier relationship from the previous team.", kr: "이전 팀으로부터 공급사 관계를 인수인계받고 있습니다." },
        { en: "The new director will take over the project from next month.", kr: "신임 이사가 다음 달부터 프로젝트를 맡게 됩니다." },
      ]
    ],
    ["give-up-on", "give up on", "포기하다", "intermediate", "phrasal-verb", "give up on + plan / supplier / idea", "더 이상 진행하지 않기로 할 때 씁니다.", "실패한 공급사 관계 정리, 실현 불가능한 계획 폐기에 씁니다.", "give up 은 일반적 포기, give up on 은 특정 대상에 대한 포기입니다.", ["decision", "strategy"], ["the supplier", "the original plan", "the idea"],
      [
        { en: "We haven't given up on finding a better price from this supplier.", kr: "이 공급사에서 더 좋은 가격을 받는 것을 아직 포기하지 않았습니다." },
        { en: "After three failed attempts, we gave up on the original approach.", kr: "세 번의 실패 후 원래 방법을 포기했습니다." },
        { en: "Don't give up on the partnership yet — there is still room to negotiate.", kr: "파트너십을 아직 포기하지 마세요 — 협상의 여지가 있습니다." },
      ]
    ],
    ["break-through", "break through", "돌파하다", "intermediate", "phrasal-verb", "break through + barrier / resistance / challenge", "장벽이나 저항을 극복할 때 씁니다.", "시장 진입 장벽 극복, 협상 교착 상태 돌파에 씁니다.", "명사형 breakthrough 와 동사 break through 를 구분합니다.", ["strategy", "negotiation"], ["the price barrier", "the resistance", "the challenge"],
      [
        { en: "We finally broke through the resistance and signed the deal.", kr: "마침내 저항을 돌파하고 계약을 체결했습니다." },
        { en: "The new approach helped us break through into the Southeast Asian market.", kr: "새로운 접근 방식이 동남아 시장 진입을 가능하게 했습니다." },
        { en: "It took three rounds of negotiation to break through the deadlock.", kr: "교착 상태를 돌파하는 데 세 번의 협상이 필요했습니다." },
      ]
    ],
    ["bring-together", "bring together", "한데 모으다", "intermediate", "phrasal-verb", "bring together + team / data / stakeholders", "여러 사람이나 정보를 한 곳에 집결시킬 때 씁니다.", "팀 구성, 이해관계자 소집, 데이터 통합에 씁니다.", "gather 보다 목적 지향적인 느낌입니다.", ["management", "strategy"], ["the key stakeholders", "all departments", "the data"],
      [
        { en: "This project will bring together teams from three different regions.", kr: "이 프로젝트는 세 지역의 팀을 한데 모을 것입니다." },
        { en: "Can you bring together all the data from last quarter's reports?", kr: "지난 분기 보고서의 모든 데이터를 취합해주시겠어요?" },
        { en: "The kickoff meeting brought together all the key stakeholders for the first time.", kr: "킥오프 회의에서 처음으로 모든 핵심 이해관계자가 한자리에 모였습니다." },
      ]
    ],
    ["push-for", "push for", "강하게 요구하다, 촉구하다", "intermediate", "phrasal-verb", "push for + faster delivery / better terms", "더 좋은 조건이나 빠른 진행을 강하게 요구할 때 씁니다.", "납기 단축 요청, 가격 인하 요구, 빠른 승인 촉구에 씁니다.", "push 단독보다 더 지속적인 노력을 암시합니다.", ["negotiation", "management"], ["a faster delivery", "a lower price", "a quicker response"],
      [
        { en: "We need to push for a delivery within 21 days — not 30.", kr: "30일이 아니라 21일 내 납기를 강하게 요구해야 합니다." },
        { en: "The sales team has been pushing for a better rebate structure.", kr: "영업팀이 더 좋은 리베이트 구조를 강하게 요구하고 있습니다." },
        { en: "She pushed for a final decision by end of the week.", kr: "그녀는 이번 주 말까지 최종 결정을 내릴 것을 촉구했습니다." },
      ]
    ],
    ["set-aside", "set aside", "따로 두다, 제쳐두다", "intermediate", "phrasal-verb", "set aside + budget / time / differences", "특정 목적을 위해 자원을 별도로 확보하거나 문제를 잠시 제쳐둘 때 씁니다.", "예비 예산 확보, 회의 시간 확보, 불필요한 논쟁 정리에 씁니다.", "set aside 는 '잠시 무시하다' 와 '따로 보관하다' 두 의미 모두 씁니다.", ["planning", "meeting"], ["budget", "30 minutes", "the differences"],
      [
        { en: "Let's set aside the budget question for now and focus on the timeline.", kr: "지금은 예산 문제를 잠시 제쳐두고 일정에 집중합시다." },
        { en: "We have set aside 10% of the order as safety stock.", kr: "주문량의 10%를 안전 재고로 따로 확보해 두었습니다." },
        { en: "Can we set aside an hour this week to discuss the contract?", kr: "이번 주에 계약을 논의할 시간을 한 시간 따로 잡을 수 있을까요?" },
      ]
    ],
    ["take-up", "take up", "차지하다, 떠맡다, 시작하다", "intermediate", "phrasal-verb", "take up + space / time / role", "자원을 차지하거나 역할을 맡을 때 씁니다.", "창고 공간 점유, 회의 시간 소요, 새로운 역할 시작에 씁니다.", "take on 과 비슷하지만 더 넓은 의미를 가집니다.", ["operations", "management"], ["too much warehouse space", "the coordinator role", "the offer"],
      [
        { en: "The slow-moving stock is taking up too much warehouse space.", kr: "잘 안 팔리는 재고가 창고 공간을 너무 많이 차지하고 있습니다." },
        { en: "This issue is taking up a lot of the team's time.", kr: "이 문제가 팀의 시간을 많이 차지하고 있습니다." },
        { en: "She took up the regional coordinator role last month.", kr: "그녀는 지난달에 지역 코디네이터 역할을 맡았습니다." },
      ]
    ],
    ["cut-through", "cut through", "명확히 해결하다, 핵심을 파고들다", "intermediate", "phrasal-verb", "cut through + noise / complexity / bureaucracy", "복잡한 것을 단번에 해결하거나 핵심을 파악할 때 씁니다.", "관료적 절차 단축, 핵심 이슈 파악, 잡음 제거에 씁니다.", "cut through the noise 가 가장 흔한 표현입니다.", ["operations", "strategy"], ["the red tape", "the complexity", "the noise"],
      [
        { en: "This new process will help us cut through the bureaucratic red tape.", kr: "이 새로운 절차는 관료적 형식을 줄이는 데 도움이 될 것입니다." },
        { en: "We need a clearer message that can cut through the market noise.", kr: "시장의 잡음을 뚫고 나갈 수 있는 더 명확한 메시지가 필요합니다." },
        { en: "Her direct question cut through all the confusion.", kr: "그녀의 직접적인 질문이 모든 혼란을 단번에 해소했습니다." },
      ]
    ],
    ["move-ahead-with", "move ahead with", "~을 진행하다", "intermediate", "phrasal-verb", "move ahead with + plan / decision", "결정된 사항을 실행에 옮길 때 씁니다.", "발주 확정, 계획 실행, 계약 체결 진행에 씁니다.", "proceed with 와 같지만 더 능동적인 어조입니다.", ["decision", "project"], ["the order", "the proposed timeline", "the partnership"],
      [
        { en: "We are ready to move ahead with the order as discussed.", kr: "논의한 대로 주문을 진행할 준비가 되었습니다." },
        { en: "Can we move ahead with the contract signing this week?", kr: "이번 주에 계약 서명을 진행할 수 있을까요?" },
        { en: "The board approved the plan — we can move ahead with implementation.", kr: "이사회가 계획을 승인했습니다 — 실행에 착수할 수 있습니다." },
      ]
    ],

    // ── Batch 5: 일상·회화 패턴 문장 ─────────────────────────────────────────
    ["im-afraid-that", "I'm afraid that", "유감스럽게도 ~입니다", "intermediate", "pattern", "I'm afraid that + clause", "나쁜 소식이나 거절을 부드럽게 전달할 때 씁니다.", "납기 불가, 조건 거절, 재고 부족 안내에 씁니다.", "sorry to say 보다 조금 더 공식적인 어조입니다.", ["email", "communication"], ["we cannot meet the deadline", "the stock is no longer available", "we need to revise the price"],
      [
        { en: "I'm afraid that we cannot confirm the order without a deposit.", kr: "유감스럽게도 선금 없이는 주문을 확인해드릴 수 없습니다." },
        { en: "I'm afraid that the requested delivery date is not feasible.", kr: "유감스럽게도 요청하신 납기일은 실현 가능하지 않습니다." },
        { en: "I'm afraid that the price has gone up due to raw material costs.", kr: "유감스럽게도 원자재 비용으로 인해 가격이 올랐습니다." },
      ]
    ],
    ["having-said-that", "having said that", "그렇긴 하지만", "intermediate", "pattern", "having said that, + clause", "앞의 말을 인정하면서도 반전이나 예외를 더할 때 씁니다.", "가격 인상을 인정하면서도 장기 협력을 제안하는 등 균형을 잡을 때 씁니다.", "that being said 와 같은 뜻입니다.", ["negotiation", "communication"], ["we are still open to discussing terms", "there are exceptions", "we value the relationship"],
      [
        { en: "The timeline is tight. Having said that, we will do our best to deliver on time.", kr: "일정이 빠듯합니다. 그렇긴 하지만, 제때 납품하기 위해 최선을 다하겠습니다." },
        { en: "The price has increased. Having said that, we can offer a larger volume discount.", kr: "가격이 올랐습니다. 그렇긴 하지만, 대량 할인을 제공할 수 있습니다." },
        { en: "The market is challenging. Having said that, we see significant opportunity ahead.", kr: "시장이 어렵습니다. 그렇긴 하지만, 앞으로 상당한 기회가 있다고 봅니다." },
      ]
    ],
    ["would-you-mind-if", "would you mind if", "~해도 괜찮을까요?", "intermediate", "pattern", "would you mind if + clause", "정중하게 허락을 구할 때 씁니다.", "일정 변경 요청, 참석 인원 추가, 자료 공유 요청에 씁니다.", "mind 뒤에는 I + 과거시제 또는 동명사를 씁니다.", ["email", "meeting"], ["I joined the call", "we delayed the shipment by a week", "I shared this with my manager"],
      [
        { en: "Would you mind if we rescheduled the meeting to next Tuesday?", kr: "회의를 다음 주 화요일로 변경해도 괜찮을까요?" },
        { en: "Would you mind if I looped in our technical manager?", kr: "기술 매니저도 참여시켜도 괜찮을까요?" },
        { en: "Would you mind if we extended the payment terms by 15 days?", kr: "결제 기간을 15일 연장해도 괜찮을까요?" },
      ]
    ],
    ["ill-get-back-to-you", "I'll get back to you", "나중에 다시 연락드릴게요", "intermediate", "pattern", "I'll get back to you + on / by / within", "즉시 답할 수 없을 때 회신을 약속할 때 씁니다.", "확인이 필요한 사항, 검토 후 답변에 씁니다.", "I'll get back to you on this / by tomorrow 형태로 씁니다.", ["email", "communication"], ["on this", "by end of day", "once I've checked with the team"],
      [
        { en: "I'll get back to you on the pricing by tomorrow morning.", kr: "가격 관련해서 내일 오전까지 다시 연락드리겠습니다." },
        { en: "Let me check with the factory and I'll get back to you within 24 hours.", kr: "공장에 확인하고 24시간 이내에 다시 연락드리겠습니다." },
        { en: "I'll get back to you once the team has reviewed the proposal.", kr: "팀에서 제안서를 검토한 후 다시 연락드리겠습니다." },
      ]
    ],
    ["just-to-confirm", "just to confirm", "확인차 말씀드리면", "intermediate", "pattern", "just to confirm, + clause", "이전 합의 사항이나 정보를 재확인할 때 씁니다.", "이메일 오해 방지, 회의 결과 정리, 조건 재확인에 씁니다.", "just to clarify 와 함께 자주 씁니다.", ["email", "communication"], ["the delivery date is May 15th", "you need 500 units", "the price is as quoted"],
      [
        { en: "Just to confirm, the agreed price is $4.50 per unit, correct?", kr: "확인차 여쭤보면, 합의된 가격은 단위당 $4.50 맞죠?" },
        { en: "Just to confirm, the shipment is scheduled for next Friday.", kr: "확인차 말씀드리면, 선적은 다음 주 금요일로 예정되어 있습니다." },
        { en: "Just to confirm — you'd like us to proceed with the revised version?", kr: "확인하자면 — 수정된 버전으로 진행하기를 원하시는 거죠?" },
      ]
    ],
    ["that-being-said", "that being said", "그렇긴 하지만", "intermediate", "pattern", "that being said, + clause", "이전 내용을 인정하면서 반전이나 단서를 추가할 때 씁니다.", "제안, 협상, 보고서 결론에서 균형을 잡을 때 씁니다.", "having said that 과 같은 뜻입니다.", ["communication", "presentation"], ["I still think we should try", "there are caveats", "the outlook is positive"],
      [
        { en: "The demand has slowed. That being said, our core products remain strong.", kr: "수요가 둔화되었습니다. 그렇긴 하지만, 핵심 제품은 여전히 강합니다." },
        { en: "The cost is higher than expected. That being said, the quality is excellent.", kr: "비용이 예상보다 높습니다. 그렇긴 하지만, 품질은 탁월합니다." },
        { en: "Negotiations were tough. That being said, we reached a fair agreement.", kr: "협상이 힘들었습니다. 그렇긴 하지만, 공정한 합의에 도달했습니다." },
      ]
    ],
    ["long-story-short", "long story short", "간단히 말하면", "intermediate", "pattern", "long story short, + clause", "복잡한 설명을 줄여 핵심만 전달할 때 씁니다.", "구두 보고, 회의 요약, 빠른 업데이트에 씁니다.", "in short 보다 더 구어적입니다.", ["meeting", "communication"], ["we got the order", "the issue is resolved", "we need more time"],
      [
        { en: "Long story short, we got the contract after three rounds of negotiation.", kr: "간단히 말하면, 세 번의 협상 끝에 계약을 따냈습니다." },
        { en: "Long story short, the factory can't ship until next month.", kr: "간단히 말하면, 공장은 다음 달까지 선적이 불가합니다." },
        { en: "Long story short — we need a bigger budget to make this work.", kr: "간단히 말하면 — 이것을 실행하려면 더 큰 예산이 필요합니다." },
      ]
    ],
    ["at-the-end-of-the-day", "at the end of the day", "결국에는", "intermediate", "pattern", "at the end of the day, + clause", "모든 것을 고려했을 때 최종 결론을 내릴 때 씁니다.", "협상 결론, 프로젝트 평가, 전략 선택에 씁니다.", "ultimately 와 같은 뜻이지만 더 구어적입니다.", ["negotiation", "strategy"], ["it's about delivering value", "price matters most", "we need a reliable partner"],
      [
        { en: "At the end of the day, we need a supplier we can trust.", kr: "결국에는 신뢰할 수 있는 공급사가 필요합니다." },
        { en: "At the end of the day, customer satisfaction is what drives repeat business.", kr: "결국에는 고객 만족이 재주문을 이끌어냅니다." },
        { en: "At the end of the day, it comes down to cost, quality, and lead time.", kr: "결국에는 비용, 품질, 납기의 문제입니다." },
      ]
    ],
    ["on-second-thought", "on second thought", "다시 생각해보니", "intermediate", "pattern", "on second thought, + clause", "처음 의견을 바꾸거나 재고할 때 씁니다.", "제안 철회, 일정 변경, 접근 방식 수정에 씁니다.", "on reflection 과 비슷하지만 더 구어적입니다.", ["meeting", "decision"], ["let's wait another week", "I think we should revise the plan", "the original idea was better"],
      [
        { en: "On second thought, let's wait until we have more data before deciding.", kr: "다시 생각해보니, 더 많은 데이터가 나올 때까지 기다렸다가 결정합시다." },
        { en: "On second thought, the original design might be the better option.", kr: "다시 생각해보니, 원래 디자인이 더 나은 선택일 수도 있습니다." },
        { en: "On second thought, I think we should loop in the legal team first.", kr: "다시 생각해보니, 먼저 법무팀을 참여시켜야 할 것 같습니다." },
      ]
    ],
    ["as-it-stands", "as it stands", "현재 상황으로는", "intermediate", "pattern", "as it stands, + clause", "현재 상황을 있는 그대로 설명할 때 씁니다.", "진행 상황 보고, 계획 미확정 상황, 조건 설명에 씁니다.", "as things stand 와 같은 뜻입니다.", ["reporting", "planning"], ["we are on track", "we cannot confirm the date", "the budget is sufficient"],
      [
        { en: "As it stands, we are on track to deliver by the end of the month.", kr: "현재 상황으로는 월말까지 납품이 순조롭습니다." },
        { en: "As it stands, we don't have enough inventory to fill the entire order.", kr: "현재 상황으로는 전체 주문을 채울 재고가 충분하지 않습니다." },
        { en: "As it stands, no decision has been made on the new supplier.", kr: "현재 상황으로는 신규 공급사에 대한 결정이 내려지지 않은 상태입니다." },
      ]
    ],
    ["needless-to-say", "needless to say", "말할 것도 없이", "intermediate", "pattern", "needless to say, + clause", "명백하거나 당연한 사실을 강조할 때 씁니다.", "품질 기준 강조, 일정 중요성, 고객 우선순위 표현에 씁니다.", "it goes without saying 과 같은 뜻입니다.", ["communication", "formal"], ["quality is non-negotiable", "on-time delivery is critical", "this is a high-priority order"],
      [
        { en: "Needless to say, quality is non-negotiable for our clients.", kr: "말할 것도 없이, 품질은 우리 고객에게 타협의 여지가 없습니다." },
        { en: "Needless to say, on-time delivery is critical for this project.", kr: "말할 것도 없이, 제때 납품이 이 프로젝트에서 핵심입니다." },
        { en: "Needless to say, we will need the full documentation before releasing payment.", kr: "말할 것도 없이, 결제를 집행하기 전에 전체 서류가 필요합니다." },
      ]
    ],
    ["all-being-well", "all being well", "별 문제 없다면", "intermediate", "pattern", "all being well, + clause", "순조롭게 진행될 경우를 전제로 계획을 말할 때 씁니다.", "납기 예상, 일정 공유, 목표 달성 예측에 씁니다.", "if all goes well 과 같은 뜻입니다.", ["planning", "communication"], ["we should ship next Friday", "we'll meet the deadline", "the sample will be ready by Thursday"],
      [
        { en: "All being well, we should receive the goods by next Wednesday.", kr: "별 문제 없다면, 다음 주 수요일까지 물품을 받을 수 있을 것입니다." },
        { en: "All being well, production will be completed ahead of schedule.", kr: "별 문제 없다면, 생산이 일정보다 일찍 완료될 것입니다." },
        { en: "All being well, we'll have a prototype ready for the trade show.", kr: "별 문제 없다면, 전시회를 위한 시제품이 준비될 것입니다." },
      ]
    ],
    ["with-that-said", "with that said", "그 점을 말하고 나서", "intermediate", "pattern", "with that said, + clause", "이전에 한 말을 마무리하고 전환점을 만들 때 씁니다.", "회의 전환, 결론 제시, 다음 단계 연결에 씁니다.", "that being said 와 같은 뜻입니다.", ["meeting", "presentation"], ["let's move on to the budget", "I'd like to hear your thoughts", "we can proceed"],
      [
        { en: "With that said, let's move on to the next agenda item.", kr: "그 점을 말하고 나서, 다음 의제로 넘어갑시다." },
        { en: "With that said, I'd like to open the floor for questions.", kr: "그 점을 말하고 나서, 질문을 받겠습니다." },
        { en: "With that said, are we all aligned on the revised plan?", kr: "그 점을 말하고 나서, 수정된 계획에 모두 동의하시나요?" },
      ]
    ],
    ["bear-in-mind", "bear in mind", "명심하다", "intermediate", "pattern", "bear in mind + that / noun", "중요한 사항을 상대방에게 기억시킬 때 씁니다.", "주의사항 전달, 조건 안내, 위험 요소 강조에 씁니다.", "keep in mind 와 같은 뜻입니다.", ["communication", "planning"], ["the deadline", "that stocks are limited", "the minimum order requirement"],
      [
        { en: "Please bear in mind that the price is valid for 30 days only.", kr: "가격은 30일간만 유효하다는 점을 명심해주세요." },
        { en: "Bear in mind that the factory is closed during the national holiday.", kr: "공장은 국경일 동안 문을 닫는다는 점을 염두에 두세요." },
        { en: "Bear in mind that customs clearance can take up to 5 business days.", kr: "통관에는 최대 5영업일이 소요될 수 있다는 점을 염두에 두세요." },
      ]
    ],
    ["off-the-top-of-my-head", "off the top of my head", "즉석에서 생각하면", "intermediate", "pattern", "off the top of my head, + clause", "정확한 답은 모르지만 즉석에서 어림잡아 답할 때 씁니다.", "회의 중 빠른 추정, 임시 계획, 비공식 답변에 씁니다.", "더 정확한 정보는 나중에 확인할 것을 암시합니다.", ["meeting", "communication"], ["I'd say around 500 units", "it's about 3 weeks", "the cost is roughly $10"],
      [
        { en: "Off the top of my head, I'd say it takes about 4 weeks to ship.", kr: "즉석에서 생각하면, 선적하는 데 약 4주 정도 걸릴 것 같습니다." },
        { en: "Off the top of my head, we have about 200 units in stock.", kr: "즉석에서 생각하면, 재고가 약 200개 있는 것 같습니다." },
        { en: "I can't say for sure off the top of my head — let me check the figures.", kr: "즉석에서 확실히 말씀드리기 어렵습니다 — 수치를 확인해보겠습니다." },
      ]
    ],
    ["to-put-it-simply", "to put it simply", "간단히 말하면", "intermediate", "pattern", "to put it simply, + clause", "복잡한 내용을 알기 쉽게 요약할 때 씁니다.", "기술 설명, 재무 보고, 전략 요약에 씁니다.", "in simple terms 와 같은 뜻입니다.", ["presentation", "communication"], ["we need more time", "the problem is the price", "the system is overloaded"],
      [
        { en: "To put it simply, we can't ship until the payment clears.", kr: "간단히 말하면, 결제가 완료되기 전까지 선적할 수 없습니다." },
        { en: "To put it simply, the new process saves 30% of handling time.", kr: "간단히 말하면, 새 절차는 처리 시간의 30%를 절감합니다." },
        { en: "To put it simply, the old system can't handle this volume anymore.", kr: "간단히 말하면, 구 시스템은 더 이상 이 물량을 처리할 수 없습니다." },
      ]
    ],
    ["touch-on", "touch on", "간단히 언급하다", "intermediate", "phrasal-verb", "touch on + topic / issue", "주제를 깊이 다루지 않고 간략히 언급할 때 씁니다.", "발표 중 부가 정보 언급, 회의 요약, 보고서 메모에 씁니다.", "touch on 은 가볍게, go into 는 깊이 다루는 차이입니다.", ["presentation", "meeting"], ["the pricing structure", "the compliance issue", "the timeline"],
      [
        { en: "I'd like to touch on the new compliance requirements briefly.", kr: "새로운 규정 준수 요건을 간략히 언급하고 싶습니다." },
        { en: "The report touches on several key risks we need to monitor.", kr: "보고서는 우리가 모니터링해야 할 몇 가지 주요 위험을 간략히 다룹니다." },
        { en: "Can we touch on the budget discussion before we end the meeting?", kr: "회의를 마치기 전에 예산 논의를 간단히 짚어볼 수 있을까요?" },
      ]
    ],
    ["count-on", "count on", "믿고 의지하다", "intermediate", "phrasal-verb", "count on + person / team", "상대방을 믿고 의지할 때 씁니다.", "팀 신뢰 표현, 공급사 의존, 납기 보장 요청에 씁니다.", "rely on 과 같지만 더 감성적이고 대화체입니다.", ["relationship", "communication"], ["the team", "the supplier", "you to deliver"],
      [
        { en: "We count on this supplier to deliver on time every month.", kr: "우리는 이 공급사가 매달 제때 납품해줄 것이라고 믿습니다." },
        { en: "Can we count on you to have the sample ready by Friday?", kr: "금요일까지 샘플을 준비해줄 수 있다고 믿어도 될까요?" },
        { en: "The client is counting on us — we cannot afford a delay.", kr: "고객이 우리를 믿고 있습니다 — 지연이 있으면 안 됩니다." },
      ]
    ],
    ["keep-in-mind", "keep in mind", "염두에 두다", "intermediate", "pattern", "keep in mind that + clause", "중요한 사항을 잊지 않도록 상기시킬 때 씁니다.", "계획 수립, 조건 안내, 위험 요소 강조에 씁니다.", "bear in mind 와 같은 뜻입니다.", ["communication", "planning"], ["the minimum order quantity", "that the market is changing fast", "the original deadline"],
      [
        { en: "Keep in mind that the minimum order quantity is 500 units.", kr: "최소 주문 수량이 500개라는 점을 염두에 두세요." },
        { en: "Keep in mind that this price is subject to raw material fluctuations.", kr: "이 가격은 원자재 변동에 따라 달라질 수 있다는 점을 염두에 두세요." },
        { en: "Keep in mind that we have a long weekend next week.", kr: "다음 주에 연휴가 있다는 점을 기억해두세요." },
      ]
    ],
    ["for-what-its-worth", "for what it's worth", "참고로 말씀드리면", "intermediate", "pattern", "for what it's worth, + opinion / observation", "확신은 없지만 의견이나 관찰을 부드럽게 공유할 때 씁니다.", "비공식 제안, 부드러운 반대 의견, 개인 의견 표현에 씁니다.", "for your information 보다 더 주관적입니다.", ["communication", "meeting"], ["I think we should wait", "the client seemed hesitant", "the data doesn't support the forecast"],
      [
        { en: "For what it's worth, I think we should test the market before going all in.", kr: "참고로 말씀드리면, 전면 진출 전에 시장을 테스트해봐야 한다고 생각합니다." },
        { en: "For what it's worth, the client seemed satisfied with the sample.", kr: "참고로 말씀드리면, 고객이 샘플에 만족한 것 같았습니다." },
        { en: "For what it's worth, my gut says we should hold off on this decision.", kr: "참고로 말씀드리면, 직감적으로 이 결정을 보류해야 할 것 같습니다." },
      ]
    ],

    // ── Batch 6: Advanced 회화 표현 ─────────────────────────────────────────
    ["go-without-saying", "go without saying", "당연한 말이지만", "advanced", "pattern", "it goes without saying that + clause", "너무 명백한 사실을 강조할 때 씁니다.", "품질, 납기, 투명성 원칙 강조에 씁니다.", "it goes without saying 이 완전한 형태입니다.", ["formal", "communication"], ["trust is the foundation of our partnership", "quality must not be compromised", "deadlines must be respected"],
      [
        { en: "It goes without saying that any defect must be reported immediately.", kr: "당연한 말이지만 모든 불량은 즉시 보고해야 합니다." },
        { en: "It goes without saying that confidential information must be protected.", kr: "당연한 말이지만 기밀 정보는 반드시 보호해야 합니다." },
        { en: "It goes without saying that we expect full transparency from our partners.", kr: "당연한 말이지만 우리는 파트너에게 완전한 투명성을 기대합니다." },
      ]
    ],
    ["not-to-put-too-fine-a-point", "not to put too fine a point on it", "솔직히 말하자면", "advanced", "pattern", "not to put too fine a point on it, + frank statement", "외교적이면서도 솔직한 의견을 전달할 때 씁니다.", "품질 불만, 협상 교착, 관계 이슈 솔직한 언급에 씁니다.", "이 표현 뒤에는 직접적인 말이 옵니다.", ["negotiation", "communication"], ["the pricing is not competitive", "delivery has been unreliable", "we are concerned about quality"],
      [
        { en: "Not to put too fine a point on it, the defect rate is unacceptable.", kr: "솔직히 말하자면, 불량률이 받아들일 수 없는 수준입니다." },
        { en: "Not to put too fine a point on it, your pricing is no longer competitive.", kr: "솔직히 말하자면, 귀사의 가격은 더 이상 경쟁력이 없습니다." },
        { en: "Not to put too fine a point on it, we need a firmer commitment on lead time.", kr: "솔직히 말하자면, 납기에 대해 더 확고한 약속이 필요합니다." },
      ]
    ],
    ["suffice-it-to-say", "suffice it to say", "한 마디로 말하면", "advanced", "pattern", "suffice it to say that + clause", "자세한 설명 없이 결론만 간결하게 전달할 때 씁니다.", "상황 요약, 문제 핵심 압축, 결론 전달에 씁니다.", "in short 보다 더 격식 있습니다.", ["formal", "reporting"], ["the outcome was disappointing", "we have concerns", "the situation has improved significantly"],
      [
        { en: "Suffice it to say, the audit results were not what we hoped for.", kr: "한 마디로 말하면, 감사 결과는 우리가 기대했던 것이 아니었습니다." },
        { en: "Suffice it to say, there is significant room for improvement.", kr: "한 마디로 말하면, 개선의 여지가 상당히 많습니다." },
        { en: "Suffice it to say, the new process has already made a noticeable difference.", kr: "한 마디로 말하면, 새 프로세스가 이미 눈에 띄는 차이를 만들었습니다." },
      ]
    ],
    ["in-the-grand-scheme", "in the grand scheme of things", "크게 보면", "advanced", "pattern", "in the grand scheme of things, + clause", "작은 문제보다 큰 그림을 볼 때 씁니다.", "전략적 관점 제시, 단기 손실의 장기적 의미 설명에 씁니다.", "in the bigger picture 와 같은 뜻입니다.", ["strategy", "analysis"], ["this delay is minor", "the investment is worthwhile", "we are making progress"],
      [
        { en: "In the grand scheme of things, a one-week delay won't affect the annual target.", kr: "크게 보면, 1주일 지연은 연간 목표에 영향을 미치지 않을 것입니다." },
        { en: "In the grand scheme of things, this supplier relationship is worth protecting.", kr: "크게 보면, 이 공급사 관계는 지킬 가치가 있습니다." },
        { en: "In the grand scheme of things, the extra cost is a small price to pay.", kr: "크게 보면, 추가 비용은 작은 대가입니다." },
      ]
    ],
    ["the-bottom-line-is", "the bottom line is", "결론은", "advanced", "pattern", "the bottom line is + clause", "논의의 최종 결론이나 가장 중요한 사실을 압축할 때 씁니다.", "협상 결론, 원가 분석 요약, 의사결정 근거 설명에 씁니다.", "the key point is 보다 더 단호하고 실용적입니다.", ["negotiation", "finance"], ["we cannot go below $4 per unit", "quality cannot be compromised", "we need a faster response"],
      [
        { en: "The bottom line is we need a 10% cost reduction to remain competitive.", kr: "결론은 경쟁력을 유지하려면 10% 원가 절감이 필요합니다." },
        { en: "The bottom line is that the supplier failed to meet the agreed quality standard.", kr: "결론은 공급사가 합의된 품질 기준을 충족하지 못했다는 것입니다." },
        { en: "The bottom line is, if we can't meet the deadline, we lose the contract.", kr: "결론은, 마감을 맞추지 못하면 계약을 잃게 됩니다." },
      ]
    ],
    ["for-all-intents-and-purposes", "for all intents and purposes", "사실상", "advanced", "pattern", "for all intents and purposes, + clause", "실질적으로 어떤 상황이 그러하다고 볼 때 씁니다.", "비공식적 상황 요약, 협상 결론, 현실적 판단에 씁니다.", "effectively 나 in practice 와 같은 뜻입니다.", ["analysis", "management"], ["the deal is done", "we are the primary supplier", "the old process is obsolete"],
      [
        { en: "For all intents and purposes, the deal is done — we just need the signature.", kr: "사실상 거래는 완료되었습니다 — 서명만 남았습니다." },
        { en: "For all intents and purposes, we are now their sole supplier.", kr: "사실상 우리는 이제 그들의 단독 공급사입니다." },
        { en: "For all intents and purposes, the old system is obsolete.", kr: "사실상 구 시스템은 더 이상 쓸 수 없는 상태입니다." },
      ]
    ],
    ["in-hindsight", "in hindsight", "돌이켜보면", "advanced", "pattern", "in hindsight, + clause", "과거 결정을 되돌아보며 교훈을 말할 때 씁니다.", "사후 분석, 실수 인정, 개선점 도출에 씁니다.", "looking back 과 같지만 더 공식적입니다.", ["analysis", "management"], ["we should have ordered earlier", "the decision was premature", "diversification would have helped"],
      [
        { en: "In hindsight, we should have increased the safety stock earlier.", kr: "돌이켜보면, 안전 재고를 더 일찍 늘렸어야 했습니다." },
        { en: "In hindsight, we underestimated the demand during the peak season.", kr: "돌이켜보면, 성수기 수요를 과소평가했습니다." },
        { en: "In hindsight, going with the cheaper supplier was a false economy.", kr: "돌이켜보면, 더 저렴한 공급사를 선택한 것은 잘못된 절약이었습니다." },
      ]
    ],
    ["in-retrospect", "in retrospect", "사후에 보면", "advanced", "pattern", "in retrospect, + clause", "과거 상황을 지나고 나서 평가할 때 씁니다.", "프로젝트 회고, 연간 검토, 전략 평가에 씁니다.", "in hindsight 와 거의 같지만 조금 더 공식적입니다.", ["analysis", "reporting"], ["the strategy was flawed", "we moved too fast", "the investment paid off"],
      [
        { en: "In retrospect, the rapid expansion was too aggressive for the market.", kr: "사후에 보면, 빠른 확장은 시장에 비해 너무 공격적이었습니다." },
        { en: "In retrospect, the early investment in quality control was the right call.", kr: "사후에 보면, 품질 관리에 대한 초기 투자는 옳은 판단이었습니다." },
        { en: "In retrospect, we should have sourced from multiple suppliers.", kr: "사후에 보면, 여러 공급사로부터 조달했어야 했습니다." },
      ]
    ],

    // ── +200 추가: 구동사 (Phrasal Verbs) ────────────────────────────────────
    ["ask-around", "ask around", "여기저기 알아보다", "intermediate", "phrasal-verb", "ask around + about / for", "정보나 의견을 여러 사람에게 구할 때 씁니다.", "가격 조사, 추천 공급사, 신규 서비스 정보 수집에 씁니다.", "ask around 뒤에 about/for 가 이어지거나 단독으로도 씁니다.", ["communication", "research"], ["pricing", "availability", "recommendations"],
      [
        { en: "Let me ask around and see if anyone has worked with this vendor before.", kr: "알아보고 이 벤더와 일해본 사람이 있는지 확인해볼게요." },
        { en: "I'll ask around about the typical lead time for this product.", kr: "이 제품의 일반적인 납기에 대해 여기저기 물어볼게요." },
        { en: "She asked around and found a better freight option.", kr: "그녀는 여기저기 알아보고 더 나은 운송 옵션을 찾았습니다." },
      ]
    ],
    ["back-down", "back down", "물러서다, 입장을 철회하다", "intermediate", "phrasal-verb", "back down + from + position / demand", "협상에서 강경한 입장을 누그러뜨릴 때 씁니다.", "양보, 타협, 요구 철회 상황에 씁니다.", "back off 보다 더 완전한 입장 전환을 뜻합니다.", ["negotiation", "communication"], ["the original demand", "the price requirement", "the position"],
      [
        { en: "After two hours of discussion, they backed down from the initial price.", kr: "두 시간의 논의 끝에 그들은 초기 가격 요구를 철회했습니다." },
        { en: "We cannot back down from our quality requirements.", kr: "우리는 품질 요건에서 물러설 수 없습니다." },
        { en: "He backed down when he realized the data didn't support his claim.", kr: "데이터가 자신의 주장을 뒷받침하지 않는다는 것을 깨닫고 물러섰습니다." },
      ]
    ],
    ["blaze-a-trail", "blaze a trail", "선구자가 되다", "advanced", "phrasal-verb", "blaze a trail + in / for", "새로운 분야를 개척하는 선구자 역할을 할 때 씁니다.", "신기술 도입, 시장 개척, 혁신적 전략 표현에 씁니다.", "명사형으로는 trailblazer 를 씁니다.", ["strategy", "innovation"], ["the industry", "digital transformation", "sustainable business"],
      [
        { en: "Our R&D team is blazing a trail in energy-efficient lighting.", kr: "우리 R&D팀은 에너지 효율 조명 분야에서 선구자가 되고 있습니다." },
        { en: "The company blazed a trail in direct-to-consumer sales.", kr: "그 회사는 직접 소비자 판매 분야에서 길을 개척했습니다." },
        { en: "She blazed a trail for women in the engineering sector.", kr: "그녀는 엔지니어링 분야에서 여성들을 위한 길을 개척했습니다." },
      ]
    ],
    ["bounce-back", "bounce back", "회복하다", "intermediate", "phrasal-verb", "bounce back + from + setback", "어려움 이후 회복할 때 씁니다.", "매출 회복, 클레임 이후 관계 복구, 시장 회복에 씁니다.", "rebound 와 같은 뜻이지만 더 구어적입니다.", ["performance", "sales"], ["from the setback", "from a slow quarter", "quickly"],
      [
        { en: "Sales bounced back strongly in Q3 after a slow first half.", kr: "상반기 부진 후 3분기에 매출이 강하게 회복됐습니다." },
        { en: "The team bounced back quickly after the product recall.", kr: "팀은 제품 리콜 이후 빠르게 회복했습니다." },
        { en: "It takes resilience to bounce back from a major client loss.", kr: "주요 고객 이탈 후 회복하려면 회복력이 필요합니다." },
      ]
    ],
    ["buy-into", "buy into", "받아들이다, 동조하다", "intermediate", "phrasal-verb", "buy into + idea / strategy / vision", "아이디어나 전략에 동의하고 지지할 때 씁니다.", "전략 공유, 팀 설득, 비전 제시 상황에 씁니다.", "구체적인 주식 매입 의미도 있으므로 문맥으로 구분합니다.", ["management", "strategy"], ["the vision", "the new approach", "the concept"],
      [
        { en: "We need everyone to buy into the new strategy before we proceed.", kr: "진행하기 전에 모두가 새 전략을 받아들여야 합니다." },
        { en: "The board didn't fully buy into the expansion plan.", kr: "이사회는 확장 계획을 완전히 받아들이지 않았습니다." },
        { en: "Once they saw the data, the team really bought into the idea.", kr: "데이터를 보고 나서 팀이 그 아이디어에 완전히 동조했습니다." },
      ]
    ],
    ["catch-on", "catch on", "이해하다, 유행하다", "intermediate", "phrasal-verb", "catch on + to / with", "개념을 파악하거나 새로운 것이 인기를 얻을 때 씁니다.", "신제품 시장 반응, 개념 학습, 트렌드 확산에 씁니다.", "두 가지 의미를 문맥으로 구분합니다.", ["market", "communication"], ["the trend", "the concept", "the new process"],
      [
        { en: "The new app feature really caught on with younger users.", kr: "새 앱 기능이 젊은 사용자들에게 큰 인기를 얻었습니다." },
        { en: "It took a while for the team to catch on to the new system.", kr: "팀이 새 시스템을 이해하는 데 시간이 좀 걸렸습니다." },
        { en: "The concept is simple once you catch on.", kr: "일단 이해하면 개념은 간단합니다." },
      ]
    ],
    ["cash-in-on", "cash in on", "이익을 챙기다, 활용하다", "advanced", "phrasal-verb", "cash in on + opportunity / trend", "기회나 상황을 이용해 이익을 취할 때 씁니다.", "시장 기회 활용, 트렌드 편승, 타이밍 전략에 씁니다.", "capitalize on 과 비슷하지만 더 기회주의적 뉘앙스입니다.", ["strategy", "sales"], ["the trend", "the market gap", "the timing"],
      [
        { en: "They cashed in on the surge in demand for remote work tools.", kr: "그들은 원격 근무 도구 수요 급증을 이용해 큰 이익을 얻었습니다." },
        { en: "We need to cash in on the trade show momentum while it lasts.", kr: "전시회 모멘텀이 지속되는 동안 이를 활용해야 합니다." },
        { en: "The company cashed in on rising energy prices.", kr: "그 회사는 에너지 가격 상승을 이용해 이익을 챙겼습니다." },
      ]
    ],
    ["chip-away-at", "chip away at", "조금씩 줄여나가다", "advanced", "phrasal-verb", "chip away at + problem / deficit / gap", "크고 어려운 문제를 조금씩 해결해 나갈 때 씁니다.", "비용 절감, 시장 점유율 확대, 문제 해결 과정에 씁니다.", "한 번에 해결하지 않고 지속적으로 줄여간다는 뉘앙스입니다.", ["strategy", "operations"], ["the cost gap", "the backlog", "the deficit"],
      [
        { en: "We've been chipping away at the backlog all month.", kr: "한 달 내내 밀린 업무를 조금씩 해결해 왔습니다." },
        { en: "We can chip away at the cost gap through incremental improvements.", kr: "점진적인 개선을 통해 비용 격차를 조금씩 줄여나갈 수 있습니다." },
        { en: "The team is chipping away at the long-standing quality issue.", kr: "팀이 오래된 품질 문제를 조금씩 해결해 나가고 있습니다." },
      ]
    ],
    ["clamp-down-on", "clamp down on", "단속하다, 엄격히 제한하다", "advanced", "phrasal-verb", "clamp down on + violations / spending", "규정 위반이나 불필요한 지출을 강하게 제한할 때 씁니다.", "비용 통제, 규정 준수 강화, 품질 위반 단속에 씁니다.", "crack down on 과 거의 같지만 조금 더 점진적인 뉘앙스입니다.", ["compliance", "management"], ["unauthorized spending", "policy violations", "late submissions"],
      [
        { en: "Management is clamping down on unauthorized overtime claims.", kr: "경영진이 비승인 초과 근무 청구를 강하게 단속하고 있습니다." },
        { en: "We need to clamp down on expenses before the budget review.", kr: "예산 검토 전에 지출을 엄격히 제한해야 합니다." },
        { en: "The regulator clamped down on companies that failed the audit.", kr: "규제 기관이 감사를 통과하지 못한 기업을 단속했습니다." },
      ]
    ],
    ["come-around", "come around", "생각이 바뀌다, 동의하게 되다", "intermediate", "phrasal-verb", "come around + to + idea / view", "처음에 반대하다가 결국 동의하게 될 때 씁니다.", "설득 성공, 의견 변화, 내부 합의 도출에 씁니다.", "come round 도 같은 의미이며 영국식입니다.", ["negotiation", "communication"], ["to the idea", "to our position", "eventually"],
      [
        { en: "It took a while, but the client finally came around to our pricing.", kr: "시간이 걸렸지만 고객이 결국 우리 가격에 동의했습니다." },
        { en: "I think he'll come around once he sees the test results.", kr: "테스트 결과를 보면 그가 생각을 바꿀 것 같습니다." },
        { en: "The board came around to the new strategy after a second presentation.", kr: "이사회는 두 번째 발표 후 새 전략에 동의하게 되었습니다." },
      ]
    ],
    ["come-clean", "come clean", "솔직히 털어놓다", "intermediate", "phrasal-verb", "come clean + about + issue", "문제나 실수를 숨기지 않고 솔직하게 밝힐 때 씁니다.", "실수 인정, 문제 조기 공개, 책임 있는 커뮤니케이션에 씁니다.", "come clean to someone about something 형태로 씁니다.", ["communication", "management"], ["the mistake", "the delay", "the problem"],
      [
        { en: "We decided to come clean about the production delay early.", kr: "생산 지연을 일찍 솔직하게 밝히기로 결정했습니다." },
        { en: "He came clean about the error before it affected the client.", kr: "고객에게 영향이 가기 전에 실수를 솔직하게 시인했습니다." },
        { en: "It's better to come clean now than to hide the issue.", kr: "문제를 숨기는 것보다 지금 솔직히 털어놓는 게 낫습니다." },
      ]
    ],
    ["cut-corners", "cut corners", "요령을 피우다, 절차를 무시하다", "intermediate", "phrasal-verb", "cut corners + on + process / quality", "비용이나 시간을 아끼려고 절차를 건너뛸 때 씁니다.", "품질 문제 원인 설명, 절차 준수 강조에 씁니다.", "항상 부정적 뉘앙스를 가집니다.", ["quality", "operations"], ["quality checks", "safety procedures", "documentation"],
      [
        { en: "We never cut corners on safety — it's non-negotiable.", kr: "우리는 절대 안전 절차를 무시하지 않습니다 — 타협의 여지가 없습니다." },
        { en: "Cutting corners on quality control led to expensive rework.", kr: "품질 관리 절차를 무시한 결과 비용이 많이 드는 재작업이 발생했습니다." },
        { en: "Don't cut corners just because the deadline is tight.", kr: "마감이 촉박하다고 해서 요령을 피우지 마세요." },
      ]
    ],
    ["dig-in", "dig in", "버티다, 깊이 파고들다", "intermediate", "phrasal-verb", "dig in + on + position / details", "입장을 고수하거나 세부 내용을 깊이 파고들 때 씁니다.", "협상 고집, 문제 심층 분석, 상세 검토에 씁니다.", "dig into 는 분석, dig in 은 고집이나 시작을 뜻합니다.", ["negotiation", "analysis"], ["the position", "the numbers", "the details"],
      [
        { en: "Both sides dug in and refused to compromise on price.", kr: "양측 모두 버티며 가격 타협을 거부했습니다." },
        { en: "Let's dig in and understand the root cause before proposing a solution.", kr: "해결책을 제안하기 전에 파고들어 근본 원인을 파악합시다." },
        { en: "The team dug in over the weekend to meet the Monday deadline.", kr: "팀이 월요일 마감을 맞추기 위해 주말에 깊이 파고들었습니다." },
      ]
    ],
    ["drop-off", "drop off", "감소하다, 줄어들다", "intermediate", "phrasal-verb", "drop off + in + sales / interest", "수요나 성과가 줄어들 때 씁니다.", "계절적 수요 변화, 시장 침체, 고객 이탈 설명에 씁니다.", "decrease 보다 더 갑작스러운 하락을 암시합니다.", ["sales", "market"], ["demand", "sales volume", "customer engagement"],
      [
        { en: "Sales dropped off significantly in the second half of the year.", kr: "하반기에 매출이 크게 줄어들었습니다." },
        { en: "Website traffic dropped off after the marketing campaign ended.", kr: "마케팅 캠페인이 끝나자 웹사이트 트래픽이 감소했습니다." },
        { en: "We noticed a drop-off in repeat orders from key clients.", kr: "주요 고객들의 재주문이 줄어드는 것을 발견했습니다." },
      ]
    ],
    ["draw-on", "draw on", "활용하다, 참고하다", "intermediate", "phrasal-verb", "draw on + experience / data / expertise", "경험이나 자료를 활용할 때 씁니다.", "발표, 보고서 작성, 전략 수립 시 경험 참고에 씁니다.", "draw upon 도 같은 뜻이지만 더 격식 있습니다.", ["strategy", "presentation"], ["past experience", "industry data", "team expertise"],
      [
        { en: "She drew on ten years of experience to guide the team.", kr: "그녀는 10년의 경험을 활용해 팀을 이끌었습니다." },
        { en: "We'll draw on the pilot data to build the full rollout plan.", kr: "파일럿 데이터를 활용해 전체 출시 계획을 수립할 것입니다." },
        { en: "The proposal draws on best practices from three industries.", kr: "이 제안은 세 가지 산업의 모범 사례를 참고합니다." },
      ]
    ],
    ["ease-up", "ease up", "완화하다, 줄이다", "intermediate", "phrasal-verb", "ease up + on + pressure / demands", "요구나 압박을 줄일 때 씁니다.", "지나친 마감 압박, 과도한 요구 조정에 씁니다.", "ease off 와 같은 뜻입니다.", ["management", "negotiation"], ["the pressure", "the demands", "the timeline"],
      [
        { en: "Could you ease up on the delivery timeline? We need at least three more days.", kr: "납기 일정을 좀 완화해주시겠어요? 최소 3일이 더 필요합니다." },
        { en: "The manager eased up on the team after seeing how hard they were working.", kr: "매니저는 팀이 얼마나 열심히 일하는지 보고 압박을 줄였습니다." },
        { en: "Sales pressure eased up after the strong Q2 results.", kr: "2분기 강한 실적 이후 영업 압박이 완화되었습니다." },
      ]
    ],
    ["fall-out", "fall out", "사이가 나빠지다, 결과가 나오다", "intermediate", "phrasal-verb", "fall out + with / over", "관계가 나빠지거나 결과가 발생할 때 씁니다.", "파트너십 갈등, 내부 의견 충돌, 결정 결과 설명에 씁니다.", "문맥에 따라 관계 악화 또는 결과 발생을 뜻합니다.", ["relationship", "management"], ["with the partner", "over the budget", "from the decision"],
      [
        { en: "The two departments fell out over how to allocate the budget.", kr: "두 부서가 예산 배분 방식을 놓고 사이가 나빠졌습니다." },
        { en: "Let's resolve this before we fall out with the supplier.", kr: "공급사와 사이가 나빠지기 전에 이것을 해결합시다." },
        { en: "We need to manage the fallout from last quarter's missed targets.", kr: "지난 분기 목표 미달의 결과를 관리해야 합니다." },
      ]
    ],
    ["fit-in", "fit in", "잘 맞다, 일정에 넣다", "intermediate", "phrasal-verb", "fit in + meeting / change / task", "일정이나 팀에 맞추거나 추가할 때 씁니다.", "회의 일정 추가, 신규 직원 적응, 업무 끼워 넣기에 씁니다.", "fit into 도 같은 뜻입니다.", ["meeting", "hr"], ["the meeting", "the schedule", "the team"],
      [
        { en: "Can you fit in a quick call at 3pm today?", kr: "오늘 오후 3시에 짧은 통화를 넣을 수 있을까요?" },
        { en: "We need to fit in a review session before the product launch.", kr: "제품 출시 전에 리뷰 세션을 일정에 넣어야 합니다." },
        { en: "She fit in well with the team from day one.", kr: "그녀는 첫날부터 팀에 잘 어울렸습니다." },
      ]
    ],
    ["follow-suit", "follow suit", "같은 방식으로 따라 하다", "intermediate", "phrasal-verb", "follow suit + and + action", "다른 사람이나 경쟁사의 행동을 따라 할 때 씁니다.", "경쟁사 대응, 업계 트렌드 추종에 씁니다.", "an article 없이 follow suit 로 씁니다.", ["strategy", "market"], ["the competitor", "the industry", "the pricing change"],
      [
        { en: "Our competitor reduced prices, and we had to follow suit.", kr: "경쟁사가 가격을 낮췄고, 우리도 따라야 했습니다." },
        { en: "Once the market leader makes a move, others tend to follow suit.", kr: "시장 선도자가 움직이면, 다른 기업들도 따라 하는 경향이 있습니다." },
        { en: "We don't always need to follow suit — differentiation has its own value.", kr: "항상 따라 할 필요는 없습니다 — 차별화도 그 자체의 가치가 있습니다." },
      ]
    ],
    ["gain-ground", "gain ground", "입지를 다지다, 진전을 이루다", "advanced", "phrasal-verb", "gain ground + in / on", "경쟁이나 목표에서 앞서 나갈 때 씁니다.", "시장 점유율 확대, 협상 우위 확보에 씁니다.", "lose ground 의 반대입니다.", ["strategy", "market"], ["in the market", "on the competition", "with key clients"],
      [
        { en: "We are gaining ground on our main competitor in the enterprise segment.", kr: "기업 시장에서 주요 경쟁사를 따라잡고 있습니다." },
        { en: "The new product helped us gain ground in the premium category.", kr: "신제품이 프리미엄 카테고리에서 입지를 다지는 데 도움이 됐습니다." },
        { en: "We're gaining ground, but there's still a lot of work ahead.", kr: "진전을 이루고 있지만 앞으로도 할 일이 많습니다." },
      ]
    ],
    ["get-ahead", "get ahead", "앞서 나가다, 미리 준비하다", "intermediate", "phrasal-verb", "get ahead + of + schedule / competition", "일정보다 앞서거나 준비를 먼저 해두는 것입니다.", "사전 준비, 경쟁 우위 확보, 납기 여유 확보에 씁니다.", "get ahead of ourselves 는 너무 앞서 나간다는 뜻입니다.", ["planning", "strategy"], ["of the schedule", "of the competition", "of the workload"],
      [
        { en: "Let's try to get ahead of the production schedule this week.", kr: "이번 주에 생산 일정보다 앞서려고 노력합시다." },
        { en: "By preparing early, we can get ahead of any potential delays.", kr: "미리 준비하면 잠재적 지연을 앞서 막을 수 있습니다." },
        { en: "To get ahead in this market, you need to innovate constantly.", kr: "이 시장에서 앞서 나가려면 지속적으로 혁신해야 합니다." },
      ]
    ],
    ["get-behind", "get behind", "지연되다, 지지하다", "intermediate", "phrasal-verb", "get behind + schedule / idea", "일정이 뒤처지거나 무언가를 지지할 때 씁니다.", "업무 지연 표현 또는 아이디어 지지 표현에 씁니다.", "두 의미 모두 문맥으로 파악합니다.", ["planning", "management"], ["on the project", "the initiative", "the schedule"],
      [
        { en: "We got behind on the project after the system outage.", kr: "시스템 중단 이후 프로젝트가 지연됐습니다." },
        { en: "The whole team got behind the new initiative and pushed hard.", kr: "팀 전체가 새 이니셔티브를 지지하며 열심히 밀었습니다." },
        { en: "If we get behind now, it'll be very hard to catch up.", kr: "지금 지연되면 따라잡기 매우 어려울 것입니다." },
      ]
    ],
    ["give-away", "give away", "드러내다, 공짜로 주다", "intermediate", "phrasal-verb", "give away + information / position", "의도치 않게 정보를 드러내거나 무상으로 제공할 때 씁니다.", "협상 전략 노출, 원가 정보 공개, 무상 제공에 씁니다.", "giveaway 는 명사형입니다.", ["negotiation", "communication"], ["the strategy", "pricing information", "the advantage"],
      [
        { en: "Be careful not to give away your bottom line too early in negotiations.", kr: "협상 초반에 최종 마지노선을 너무 일찍 드러내지 않도록 주의하세요." },
        { en: "His reaction gave away that the price was already too high.", kr: "그의 반응이 가격이 이미 너무 높다는 것을 드러냈습니다." },
        { en: "We can't keep giving away free consulting — it needs to be priced.", kr: "무료 컨설팅을 계속 제공할 수는 없습니다 — 가격이 책정되어야 합니다." },
      ]
    ],
    ["go-along-with", "go along with", "동의하다, 따라가다", "intermediate", "phrasal-verb", "go along with + decision / plan", "다른 사람의 의견이나 결정을 따를 때 씁니다.", "합의 도출, 팀 결정 수용, 제안 동의에 씁니다.", "agree with 보다 더 수동적인 동의를 암시합니다.", ["communication", "decision"], ["the plan", "the decision", "the proposal"],
      [
        { en: "I'll go along with whatever the team decides.", kr: "팀이 결정하는 대로 따르겠습니다." },
        { en: "We went along with the client's suggestion to keep the relationship smooth.", kr: "관계를 원활하게 유지하기 위해 고객의 제안을 따랐습니다." },
        { en: "Don't just go along with the idea if you have concerns — speak up.", kr: "우려 사항이 있다면 그냥 따라가지 말고 말씀해주세요." },
      ]
    ],
    ["hammer-out", "hammer out", "힘들게 협의해서 도출하다", "advanced", "phrasal-verb", "hammer out + agreement / deal / terms", "어렵게 논의하고 합의를 이끌어낼 때 씁니다.", "계약 협상, 팀 내 의견 조율, 가격 합의에 씁니다.", "negotiate 보다 훨씬 더 힘든 과정을 암시합니다.", ["negotiation", "legal"], ["an agreement", "the details", "the final terms"],
      [
        { en: "We spent three days hammering out the contract terms.", kr: "계약 조건을 이끌어내기 위해 3일을 씨름했습니다." },
        { en: "The two sides finally hammered out a deal late Friday night.", kr: "양측은 금요일 밤늦게 마침내 합의를 도출했습니다." },
        { en: "Let's hammer out the pricing details in tomorrow's meeting.", kr: "내일 회의에서 가격 세부 사항을 협의해 도출합시다." },
      ]
    ],
    ["jump-to-conclusions", "jump to conclusions", "성급하게 결론 내리다", "intermediate", "phrasal-verb", "jump to conclusions + about", "충분한 정보 없이 결론을 내릴 때 씁니다.", "클레임 원인 분석, 신중한 판단 강조에 씁니다.", "don't jump to conclusions 형태로 자주 씁니다.", ["analysis", "communication"], ["the problem", "the cause", "the situation"],
      [
        { en: "Let's not jump to conclusions before we have all the facts.", kr: "모든 사실을 파악하기 전에 성급하게 결론을 내리지 맙시다." },
        { en: "He jumped to conclusions and blamed the wrong department.", kr: "그는 성급하게 결론을 내리고 엉뚱한 부서를 탓했습니다." },
        { en: "Don't jump to conclusions — the data might tell a different story.", kr: "성급하게 결론 내리지 마세요 — 데이터가 다른 이야기를 할 수도 있습니다." },
      ]
    ],
    ["keep-up-with", "keep up with", "따라가다, 뒤처지지 않다", "intermediate", "phrasal-verb", "keep up with + demand / changes / competition", "빠르게 변하는 상황이나 수요에 뒤처지지 않을 때 씁니다.", "시장 변화 대응, 수요 충족, 업계 트렌드 추적에 씁니다.", "keep pace with 과 같은 뜻입니다.", ["operations", "market"], ["demand", "the competition", "industry trends"],
      [
        { en: "Our production capacity can barely keep up with the current demand.", kr: "현재 수요를 우리 생산 능력이 간신히 따라가고 있습니다." },
        { en: "It's hard to keep up with all the regulatory changes.", kr: "모든 규제 변화를 따라가기가 어렵습니다." },
        { en: "We need to invest in technology to keep up with the competition.", kr: "경쟁을 따라가기 위해 기술에 투자해야 합니다." },
      ]
    ],
    ["lag-behind", "lag behind", "뒤처지다", "intermediate", "phrasal-verb", "lag behind + competitor / schedule", "다른 것보다 뒤처지는 상황에 씁니다.", "시장 점유율 하락, 기술 격차, 일정 지연에 씁니다.", "fall behind 보다 더 지속적인 뒤처짐을 암시합니다.", ["market", "operations"], ["the competition", "the market", "industry averages"],
      [
        { en: "We are lagging behind our competitors in digital adoption.", kr: "디지털 도입에서 경쟁사보다 뒤처지고 있습니다." },
        { en: "Production is lagging behind schedule by about two weeks.", kr: "생산이 약 2주 정도 일정보다 뒤처지고 있습니다." },
        { en: "Don't let one department lag behind and slow down the whole process.", kr: "한 부서가 뒤처져서 전체 프로세스를 늦추게 하지 마세요." },
      ]
    ],
    ["level-off", "level off", "안정되다, 평탄해지다", "intermediate", "phrasal-verb", "level off + at / after", "급격한 변화 후 안정될 때 씁니다.", "가격 안정, 성장 둔화, 수요 안정화 표현에 씁니다.", "plateau 와 비슷하지만 더 구어적입니다.", ["finance", "market"], ["after the spike", "at current levels", "in Q4"],
      [
        { en: "After rapid growth, sales have leveled off at around 500 units per month.", kr: "빠른 성장 후 매출이 월 500개 수준으로 안정됐습니다." },
        { en: "Raw material costs have leveled off after months of increases.", kr: "몇 달간의 상승 후 원자재 비용이 안정됐습니다." },
        { en: "We expect demand to level off in the second half of the year.", kr: "하반기에 수요가 안정될 것으로 예상합니다." },
      ]
    ],
    ["lie-ahead", "lie ahead", "앞에 놓여 있다", "intermediate", "phrasal-verb", "lie ahead + for + team / company", "미래에 일어날 일을 예고할 때 씁니다.", "전략 발표, 연간 목표 제시, 도전 예상에 씁니다.", "미래를 내다보는 표현으로 공식 발표에 적합합니다.", ["strategy", "planning"], ["significant challenges", "exciting opportunities", "a busy quarter"],
      [
        { en: "A challenging but exciting quarter lies ahead for the whole team.", kr: "팀 전체에 도전적이지만 흥미진진한 분기가 앞에 놓여 있습니다." },
        { en: "A lot of hard work lies ahead before we can call this a success.", kr: "성공이라고 부를 수 있기 전에 많은 고된 작업이 앞에 놓여 있습니다." },
        { en: "With the new contract signed, a promising period lies ahead.", kr: "새 계약이 체결되어 유망한 시기가 앞에 놓여 있습니다." },
      ]
    ],
    ["live-up-to", "live up to", "기대에 부응하다", "intermediate", "phrasal-verb", "live up to + expectation / standard / promise", "기대나 약속에 걸맞게 행동할 때 씁니다.", "고객 기대 충족, 브랜드 가치 유지, 품질 유지에 씁니다.", "live up to expectations 가 가장 흔한 형태입니다.", ["quality", "relationship"], ["expectations", "the promise", "the standard"],
      [
        { en: "The new product fully lived up to the client's expectations.", kr: "신제품은 고객의 기대에 완전히 부응했습니다." },
        { en: "We need to live up to the quality standards we promised.", kr: "우리가 약속한 품질 기준에 부응해야 합니다." },
        { en: "The supplier failed to live up to its commitments on delivery.", kr: "공급사가 납기에 대한 약속을 지키지 못했습니다." },
      ]
    ],
    ["miss-out-on", "miss out on", "기회를 놓치다", "intermediate", "phrasal-verb", "miss out on + opportunity / deal", "기회를 잡지 못할 때 씁니다.", "신규 거래 기회, 시장 트렌드, 할인 혜택을 놓치는 상황에 씁니다.", "FOMO(기회 상실 두려움) 표현에도 자주 씁니다.", ["sales", "strategy"], ["the opportunity", "the contract", "the early-bird pricing"],
      [
        { en: "If we don't decide now, we'll miss out on the early pricing.", kr: "지금 결정하지 않으면 조기 가격 혜택을 놓칠 것입니다." },
        { en: "We missed out on a major contract because our response was too slow.", kr: "대응이 너무 느려서 주요 계약을 놓쳤습니다." },
        { en: "Don't miss out on this limited production slot.", kr: "이 제한된 생산 슬롯을 놓치지 마세요." },
      ]
    ],
    ["open-up", "open up", "열리다, 솔직하게 말하다", "intermediate", "phrasal-verb", "open up + new opportunities / about concerns", "새로운 가능성이 열리거나 솔직해질 때 씁니다.", "신시장 개척, 솔직한 피드백 요청, 관계 발전에 씁니다.", "두 의미 모두 쓰입니다.", ["strategy", "communication"], ["new markets", "about the issue", "opportunities"],
      [
        { en: "The new trade agreement opens up great opportunities in Southeast Asia.", kr: "새 무역 협정이 동남아에서 큰 기회를 열어줍니다." },
        { en: "I'd like you to open up about any concerns you have with the project.", kr: "프로젝트에 대해 우려되는 점을 솔직하게 말씀해주세요." },
        { en: "The partnership opened up a whole new distribution channel.", kr: "파트너십이 완전히 새로운 유통 채널을 열었습니다." },
      ]
    ],
    ["pay-off", "pay off", "성과를 거두다, 빚을 갚다", "intermediate", "phrasal-verb", "pay off + investment / effort", "노력이나 투자가 결실을 맺을 때 씁니다.", "전략 성공, 투자 수익, 장기 노력의 결실 표현에 씁니다.", "pay off 는 성과 의미, pay off debt 는 빚 상환 의미입니다.", ["finance", "strategy"], ["the investment", "the hard work", "the risk"],
      [
        { en: "All the hard work finally paid off — we won the tender.", kr: "모든 노력이 마침내 결실을 맺었습니다 — 입찰에서 이겼습니다." },
        { en: "Investing in automation early is paying off now.", kr: "초기 자동화 투자가 지금 성과를 거두고 있습니다." },
        { en: "The risk paid off — revenue doubled in one year.", kr: "위험을 감수한 것이 결실을 맺었습니다 — 1년 만에 매출이 두 배로 늘었습니다." },
      ]
    ],
    ["phase-in-gradually", "phase in", "단계적으로 도입하다", "intermediate", "phrasal-verb", "phase in + new policy / system / pricing", "새로운 것을 한 번에 바꾸지 않고 단계적으로 적용할 때 씁니다.", "가격 인상, 신규 시스템, 환경 규정 도입에 씁니다.", "phase out 의 반대입니다.", ["operations", "planning"], ["the new pricing", "the updated process", "the system"],
      [
        { en: "We plan to phase in the price increase over three months.", kr: "3개월에 걸쳐 단계적으로 가격 인상을 도입할 계획입니다." },
        { en: "The new compliance rules will be phased in starting January.", kr: "새 규정 준수 규칙이 1월부터 단계적으로 도입됩니다." },
        { en: "Phasing in the changes helps reduce disruption for the team.", kr: "변화를 단계적으로 도입하면 팀의 혼란을 줄일 수 있습니다." },
      ]
    ],
    ["pick-up-steam", "pick up steam", "탄력을 받다, 속도가 붙다", "intermediate", "phrasal-verb", "pick up steam + in / as", "활동이나 프로젝트가 점차 속도를 낼 때 씁니다.", "프로젝트 초기 단계 이후 가속, 시장 확대에 씁니다.", "gain momentum 과 비슷한 뜻입니다.", ["operations", "sales"], ["as the quarter progresses", "after the launch", "in Q2"],
      [
        { en: "The project started slowly but is really picking up steam now.", kr: "프로젝트가 느리게 시작됐지만 지금은 정말 속도가 붙고 있습니다." },
        { en: "Online sales are picking up steam heading into the holiday season.", kr: "연말 시즌을 앞두고 온라인 판매가 탄력을 받고 있습니다." },
        { en: "The marketing campaign picked up steam after a slow first week.", kr: "마케팅 캠페인이 느린 첫 주 이후 탄력을 받았습니다." },
      ]
    ],
    ["play-down", "play down", "대수롭지 않게 여기다", "intermediate", "phrasal-verb", "play down + concern / issue / importance", "문제를 작게 보이게 하거나 중요성을 낮출 때 씁니다.", "위기 관리, 고객 안심, 내부 갈등 최소화에 씁니다.", "downplay 와 같은 뜻입니다.", ["communication", "management"], ["the risk", "the delay", "the concern"],
      [
        { en: "Don't play down the issue — the client needs to know the full picture.", kr: "문제를 대수롭지 않게 여기지 마세요 — 고객은 전체 상황을 알아야 합니다." },
        { en: "The CEO played down the impact of the supply disruption.", kr: "CEO가 공급 차질의 영향을 대수롭지 않게 여겼습니다." },
        { en: "We need to address the concern, not play it down.", kr: "우려 사항을 대수롭지 않게 여기는 게 아니라 해결해야 합니다." },
      ]
    ],
    ["plug-in", "plug in", "연결하다, 대입하다", "intermediate", "phrasal-verb", "plug in + numbers / data / solution", "수치를 넣거나 시스템에 연결할 때 씁니다.", "공식 계산, 시스템 연동, 대입 계산에 씁니다.", "plug into 도 자주 씁니다.", ["data", "operations"], ["the numbers", "the variables", "the system"],
      [
        { en: "Let me plug in the actual figures and see what the model shows.", kr: "실제 수치를 대입해서 모델이 어떻게 나오는지 봐볼게요." },
        { en: "Once you plug in the updated data, the forecast changes significantly.", kr: "업데이트된 데이터를 대입하면 예측이 크게 달라집니다." },
        { en: "The new platform plugs into our existing ERP system.", kr: "새 플랫폼은 기존 ERP 시스템에 연결됩니다." },
      ]
    ],
    ["put-forward", "put forward", "제안하다, 제출하다", "intermediate", "phrasal-verb", "put forward + proposal / idea / name", "공식적으로 아이디어나 제안을 내놓을 때 씁니다.", "회의 제안, 인사 추천, 전략 제출에 씁니다.", "propose 보다 더 구어적입니다.", ["meeting", "communication"], ["a proposal", "an idea", "a candidate"],
      [
        { en: "I'd like to put forward a suggestion for restructuring the process.", kr: "프로세스 재구성에 대한 제안을 드리고 싶습니다." },
        { en: "She put forward three candidates for the manager position.", kr: "그녀는 매니저 직책에 세 명의 후보를 제안했습니다." },
        { en: "The team put forward a cost-saving proposal that impressed the board.", kr: "팀이 이사회를 감동시킨 비용 절감 제안을 제출했습니다." },
      ]
    ],
    ["ramp-up", "ramp up", "증대하다, 늘리다", "intermediate", "phrasal-verb", "ramp up + production / hiring / effort", "생산, 채용, 활동 수준을 빠르게 늘릴 때 씁니다.", "성수기 준비, 신제품 출시, 급증 수요 대응에 씁니다.", "scale up 보다 더 빠른 증가를 암시합니다.", ["operations", "manufacturing"], ["production", "hiring", "marketing spend"],
      [
        { en: "We need to ramp up production by 30% before the peak season.", kr: "성수기 전에 생산을 30% 늘려야 합니다." },
        { en: "The factory is ramping up capacity for the new product line.", kr: "공장이 새 제품 라인을 위해 생산 능력을 증대하고 있습니다." },
        { en: "We're ramping up hiring to support the expansion.", kr: "확장을 지원하기 위해 채용을 늘리고 있습니다." },
      ]
    ],
    ["ride-out", "ride out", "버티다, 어려움을 헤쳐나가다", "advanced", "phrasal-verb", "ride out + crisis / downturn / uncertainty", "어려운 시기를 버티며 극복할 때 씁니다.", "경기 침체, 공급망 위기, 가격 변동에 대응할 때 씁니다.", "wait out 보다 더 능동적으로 버티는 느낌입니다.", ["strategy", "risk"], ["the downturn", "the market volatility", "the crisis"],
      [
        { en: "We have enough reserves to ride out the current market downturn.", kr: "현재 시장 침체를 버텨낼 충분한 예비금이 있습니다." },
        { en: "The company rode out the supply crisis without cutting jobs.", kr: "그 회사는 일자리를 줄이지 않고 공급 위기를 버텨냈습니다." },
        { en: "If we can ride out the next two quarters, we'll be in a strong position.", kr: "앞으로 두 분기를 버틸 수 있다면 강력한 위치에 있을 것입니다." },
      ]
    ],
    ["run-by", "run by", "의견을 구하다, 설명하다", "intermediate", "phrasal-verb", "run + something + by + person", "누군가에게 먼저 확인이나 동의를 구할 때 씁니다.", "상사 사전 승인 요청, 고객 사전 설명, 팀 의견 수렴에 씁니다.", "run this by you 또는 run it by the team 형태로 씁니다.", ["communication", "approval"], ["the manager", "the team", "the client"],
      [
        { en: "Before we proceed, let me run this by the legal team.", kr: "진행하기 전에 법무팀에 이것을 먼저 확인해보겠습니다." },
        { en: "Could you run the revised proposal by the client and get their feedback?", kr: "수정된 제안서를 고객에게 먼저 설명하고 피드백을 받아주시겠어요?" },
        { en: "I'll run the idea by the director before we commit to anything.", kr: "무언가를 결정하기 전에 이사에게 먼저 아이디어를 확인해보겠습니다." },
      ]
    ],
    ["run-up-to", "run up to", "~에 앞두다, ~로 이어지다", "intermediate", "phrasal-verb", "in the run-up to + event / deadline", "중요한 이벤트나 마감 전 기간을 표현할 때 씁니다.", "행사 준비 기간, 연말 성수기, 출시 직전 기간에 씁니다.", "주로 명사형 'the run-up to' 로 씁니다.", ["planning", "operations"], ["the trade show", "the launch", "year-end"],
      [
        { en: "In the run-up to the trade show, we need to finalize all marketing materials.", kr: "전시회를 앞두고 모든 마케팅 자료를 마무리해야 합니다." },
        { en: "Demand spikes in the run-up to the holiday season.", kr: "연말 시즌을 앞두고 수요가 급증합니다." },
        { en: "In the run-up to the product launch, the team worked 12-hour days.", kr: "제품 출시를 앞두고 팀은 하루 12시간씩 일했습니다." },
      ]
    ],
    ["shake-up", "shake up", "대대적으로 바꾸다", "advanced", "phrasal-verb", "shake up + industry / team / process", "기존 방식을 크게 뒤흔들 때 씁니다.", "조직 개편, 업계 변화, 전략 전환에 씁니다.", "명사형 'shakeup'으로도 자주 씁니다.", ["strategy", "management"], ["the team", "the industry", "internal processes"],
      [
        { en: "The new CEO shook up the organization with a major restructuring.", kr: "새 CEO가 대대적인 구조조정으로 조직을 뒤흔들었습니다." },
        { en: "This product is going to shake up the entire market.", kr: "이 제품은 전체 시장을 대대적으로 바꿔놓을 것입니다." },
        { en: "Sometimes you need to shake up the process to drive real improvement.", kr: "때로는 실질적인 개선을 이끌어내기 위해 프로세스를 대대적으로 바꿔야 합니다." },
      ]
    ],
    ["size-up", "size up", "파악하다, 가늠하다", "intermediate", "phrasal-verb", "size up + situation / competitor / opportunity", "상황이나 경쟁사를 파악하고 평가할 때 씁니다.", "시장 분석, 경쟁사 파악, 신규 파트너 평가에 씁니다.", "assess 와 같지만 더 구어적이고 직관적입니다.", ["analysis", "strategy"], ["the situation", "the competition", "the opportunity"],
      [
        { en: "I've been sizing up the competition — they've made some interesting moves.", kr: "경쟁사를 파악하고 있습니다 — 흥미로운 움직임을 보이고 있습니다." },
        { en: "Take a moment to size up the situation before making a decision.", kr: "결정을 내리기 전에 상황을 가늠할 시간을 가지세요." },
        { en: "The investor sizing up our pitch was clearly experienced.", kr: "우리 발표를 평가하는 투자자는 분명히 경험이 많았습니다." },
      ]
    ],
    ["slow-down", "slow down", "속도를 줄이다", "intermediate", "phrasal-verb", "slow down + process / growth / production", "속도나 규모를 의도적으로 줄일 때 씁니다.", "성장 조절, 공정 속도 조정, 신중한 의사결정에 씁니다.", "speed up 의 반대입니다.", ["operations", "management"], ["the process", "expansion", "hiring"],
      [
        { en: "Let's slow down and make sure we get this right.", kr: "속도를 줄이고 제대로 처리하도록 합시다." },
        { en: "Growth has slowed down, but the fundamentals remain strong.", kr: "성장이 둔화됐지만 기본 체력은 여전히 강합니다." },
        { en: "Slow down the onboarding process — rushing leads to mistakes.", kr: "온보딩 프로세스를 서두르지 마세요 — 서두르면 실수가 생깁니다." },
      ]
    ],
    ["stand-out", "stand out", "두드러지다, 눈에 띄다", "intermediate", "phrasal-verb", "stand out + from + competition / crowd", "다른 것들 사이에서 특별히 눈에 띌 때 씁니다.", "제품 차별화, 제안서 강점, 인재 강점 표현에 씁니다.", "stand out from the crowd 이 가장 흔한 형태입니다.", ["sales", "strategy"], ["from the competition", "in the market", "from the crowd"],
      [
        { en: "Our product stands out from the competition because of its energy efficiency.", kr: "우리 제품은 에너지 효율 덕분에 경쟁사보다 두드러집니다." },
        { en: "Her presentation really stood out — it was clear and data-driven.", kr: "그녀의 발표는 정말 눈에 띄었습니다 — 명확하고 데이터 중심이었습니다." },
        { en: "To win the bid, our proposal needs to stand out.", kr: "입찰에서 이기려면 우리 제안서가 눈에 띄어야 합니다." },
      ]
    ],
    ["stay-on-top-of", "stay on top of", "잘 관리하다, 파악하고 있다", "intermediate", "phrasal-verb", "stay on top of + tasks / updates / issues", "상황이나 업무를 놓치지 않고 계속 관리할 때 씁니다.", "프로젝트 관리, 고객 소통, 진행 상황 추적에 씁니다.", "keep on top of 와 같은 뜻입니다.", ["management", "operations"], ["the project", "client requests", "market changes"],
      [
        { en: "It's important to stay on top of customer complaints before they escalate.", kr: "고객 불만이 커지기 전에 잘 관리하는 것이 중요합니다." },
        { en: "With so many projects, it's hard to stay on top of everything.", kr: "프로젝트가 너무 많아서 모든 것을 파악하기가 어렵습니다." },
        { en: "Use a tracking sheet to stay on top of all open action items.", kr: "추적 시트를 사용해 모든 미결 액션 아이템을 관리하세요." },
      ]
    ],
    ["steer-clear-of", "steer clear of", "피하다", "intermediate", "phrasal-verb", "steer clear of + risk / topic / person", "의도적으로 무언가를 피할 때 씁니다.", "민감한 주제 회피, 위험 분야 회피에 씁니다.", "avoid 보다 더 의도적인 회피를 암시합니다.", ["strategy", "communication"], ["the topic", "high-risk suppliers", "the controversy"],
      [
        { en: "Let's steer clear of that supplier — there are too many red flags.", kr: "그 공급사는 피합시다 — 위험 신호가 너무 많습니다." },
        { en: "In the client meeting, steer clear of discussing the delay directly.", kr: "고객 회의에서는 지연에 대해 직접 언급하는 것을 피하세요." },
        { en: "Steer clear of any commitment you can't back up with data.", kr: "데이터로 뒷받침할 수 없는 약속은 피하세요." },
      ]
    ],
    ["stretch-out", "stretch out", "연장하다, 늘리다", "intermediate", "phrasal-verb", "stretch out + deadline / payment / timeline", "기간이나 일정을 늘릴 때 씁니다.", "결제 기간 연장, 납기 연장 협의에 씁니다.", "extend 보다 더 구어적입니다.", ["negotiation", "planning"], ["the payment terms", "the deadline", "the contract period"],
      [
        { en: "Could we stretch out the payment terms to 60 days?", kr: "결제 기간을 60일로 늘릴 수 있을까요?" },
        { en: "They asked to stretch out the project timeline by two weeks.", kr: "그들은 프로젝트 일정을 2주 연장해달라고 요청했습니다." },
        { en: "Stretching out the deadline is an option, but it affects our Q4 targets.", kr: "마감을 연장하는 것도 선택지이지만, 4분기 목표에 영향을 미칩니다." },
      ]
    ],
    ["swing-by", "swing by", "잠깐 들르다", "intermediate", "phrasal-verb", "swing by + office / location", "짧게 방문할 때 씁니다.", "비공식 방문, 현장 확인, 짧은 미팅 제안에 씁니다.", "stop by 와 같은 뜻의 구어적 표현입니다.", ["meeting", "operations"], ["the office", "the warehouse", "the factory"],
      [
        { en: "Can you swing by the factory tomorrow and check on the progress?", kr: "내일 공장에 잠깐 들러서 진행 상황을 확인해주시겠어요?" },
        { en: "I'll swing by your office after the morning meeting.", kr: "오전 회의 후 사무실에 잠깐 들르겠습니다." },
        { en: "The client might swing by this week to see the sample.", kr: "고객이 이번 주에 샘플을 보러 잠깐 들를 수도 있습니다." },
      ]
    ],
    ["take-stock", "take stock of", "현황을 점검하다", "intermediate", "phrasal-verb", "take stock of + situation / progress / position", "현재 상황이나 진행 상황을 전반적으로 평가할 때 씁니다.", "분기 말 검토, 전략 재평가, 현황 파악에 씁니다.", "take a step back and take stock 형태로도 자주 씁니다.", ["management", "reporting"], ["where we stand", "the current situation", "our progress"],
      [
        { en: "Let's take stock of where we are before planning the next quarter.", kr: "다음 분기 계획을 세우기 전에 현재 위치를 점검합시다." },
        { en: "After the busy launch period, it's time to take stock of the results.", kr: "바쁜 출시 기간이 지나고 나서 이제 결과를 점검할 때입니다." },
        { en: "Taking stock of the situation, I think we're in better shape than expected.", kr: "현황을 점검해보면, 예상보다 좋은 상황에 있는 것 같습니다." },
      ]
    ],
    ["tap-into", "tap into", "활용하다, 파고들다", "intermediate", "phrasal-verb", "tap into + market / talent / resource", "기존 자원이나 시장의 잠재력을 끌어낼 때 씁니다.", "신규 시장 진입, 내부 역량 활용, 고객층 확대에 씁니다.", "access 보다 더 적극적으로 활용하는 뉘앙스입니다.", ["strategy", "sales"], ["the emerging market", "local talent", "customer loyalty"],
      [
        { en: "We plan to tap into the growing demand for eco-friendly products.", kr: "친환경 제품에 대한 성장하는 수요를 활용할 계획입니다." },
        { en: "This partnership allows us to tap into their distribution network.", kr: "이 파트너십을 통해 그들의 유통망을 활용할 수 있습니다." },
        { en: "We need to tap into the local talent pool to reduce hiring costs.", kr: "채용 비용을 줄이기 위해 지역 인재 풀을 활용해야 합니다." },
      ]
    ],
    ["throw-in", "throw in", "덤으로 포함하다", "intermediate", "phrasal-verb", "throw in + bonus / extra / service", "협상에서 추가 혜택을 끼워 넣을 때 씁니다.", "계약 협상, 추가 서비스 제공, 거래 마무리에 씁니다.", "협상에서 거래를 성사시키기 위한 마지막 카드로 씁니다.", ["negotiation", "sales"], ["free shipping", "an extra month of support", "a discount"],
      [
        { en: "To close the deal, we'll throw in free shipping on the first order.", kr: "거래를 성사시키기 위해 첫 주문에 무료 배송을 포함하겠습니다." },
        { en: "They threw in an extra month of warranty to sweeten the deal.", kr: "거래를 매력적으로 만들기 위해 1개월 추가 보증을 끼워 넣었습니다." },
        { en: "What if we throw in free installation to close this?", kr: "이것을 성사시키기 위해 무료 설치를 포함하면 어떨까요?" },
      ]
    ],
    ["turn-down", "turn down", "거절하다", "intermediate", "phrasal-verb", "turn down + offer / request / proposal", "제안이나 요청을 거절할 때 씁니다.", "비용 초과 요청, 실현 불가능한 조건, 무리한 납기 거절에 씁니다.", "decline 보다 더 구어적입니다.", ["negotiation", "communication"], ["the offer", "the request", "the terms"],
      [
        { en: "We had to turn down the offer because the margin was too thin.", kr: "마진이 너무 얇아서 제안을 거절해야 했습니다." },
        { en: "The client turned down our first proposal and asked for revisions.", kr: "고객이 첫 제안을 거절하고 수정을 요청했습니다." },
        { en: "It's not easy to turn down a long-term partner, but the terms don't work.", kr: "오랜 파트너를 거절하기는 쉽지 않지만, 조건이 맞지 않습니다." },
      ]
    ],
    ["wear-off", "wear off", "효과가 사라지다", "intermediate", "phrasal-verb", "wear off + over time / quickly", "효과나 영향이 점차 사라질 때 씁니다.", "프로모션 효과, 동기 저하, 시장 효과 분석에 씁니다.", "fade 보다 더 구어적입니다.", ["market", "management"], ["the promotional effect", "the novelty", "initial excitement"],
      [
        { en: "The promotional discount wore off and sales returned to normal.", kr: "프로모션 할인 효과가 사라지고 매출이 정상으로 돌아왔습니다." },
        { en: "Initial enthusiasm can wear off if there's no follow-through.", kr: "후속 조치가 없으면 초기 열정이 사라질 수 있습니다." },
        { en: "The effect of the price increase wore off within two quarters.", kr: "가격 인상의 효과는 두 분기 만에 사라졌습니다." },
      ]
    ],
    ["work-around", "work around", "우회하다, 대안을 찾다", "intermediate", "phrasal-verb", "work around + obstacle / limitation / schedule", "장애물이나 제약을 돌아서 해결할 때 씁니다.", "일정 충돌 해결, 규정 제약 대안, 기술적 한계 우회에 씁니다.", "명사형 'workaround' 도 자주 씁니다.", ["operations", "problem-solving"], ["the constraint", "the schedule conflict", "the limitation"],
      [
        { en: "We can work around the holiday shutdown by shipping early.", kr: "일찍 선적하면 공휴일 가동 중단을 우회할 수 있습니다." },
        { en: "The team found a creative workaround for the software limitation.", kr: "팀이 소프트웨어 한계를 우회하는 창의적인 대안을 찾았습니다." },
        { en: "We'll need to work around the budget cap to get this done.", kr: "이것을 완수하려면 예산 한도를 우회할 방법을 찾아야 합니다." },
      ]
    ],

    // ── +200 추가: 패턴 문장 (Patterns) ──────────────────────────────────────
    ["allow-me-to", "allow me to", "제가 ~하겠습니다", "intermediate", "pattern", "allow me to + verb", "정중하게 무언가를 시작하거나 소개할 때 씁니다.", "발표 시작, 자기 소개, 이메일 목적 안내에 씁니다.", "let me 보다 더 격식 있고 공식적입니다.", ["presentation", "email"], ["explain", "introduce myself", "walk you through"],
      [
        { en: "Allow me to walk you through the key highlights of our proposal.", kr: "제안서의 주요 내용을 설명드리겠습니다." },
        { en: "Allow me to introduce our new operations director, Mr. Kim.", kr: "새로운 운영 이사인 김 이사님을 소개하겠습니다." },
        { en: "Allow me to clarify what I meant by that statement.", kr: "그 발언의 의미를 명확히 해드리겠습니다." },
      ]
    ],
    ["as-a-matter-of-fact", "as a matter of fact", "사실은", "intermediate", "pattern", "as a matter of fact, + clause", "상대방의 가정을 정정하거나 실제 정보를 강조할 때 씁니다.", "사실 정정, 강한 주장, 예상치 못한 정보 전달에 씁니다.", "in fact 와 같은 뜻이지만 더 강조가 강합니다.", ["communication", "negotiation"], ["sales increased", "we have more capacity", "it's already done"],
      [
        { en: "As a matter of fact, we've already started the production.", kr: "사실은, 이미 생산을 시작했습니다." },
        { en: "As a matter of fact, our lead time is shorter than the industry average.", kr: "사실은, 우리 납기가 업계 평균보다 짧습니다." },
        { en: "As a matter of fact, the client was very satisfied with the sample.", kr: "사실은, 고객이 샘플에 매우 만족했습니다." },
      ]
    ],
    ["be-that-as-it-may", "be that as it may", "그렇다 하더라도", "advanced", "pattern", "be that as it may, + clause", "상대의 주장을 인정하면서도 자신의 입장을 유지할 때 씁니다.", "협상, 반박, 입장 고수에 씁니다.", "even so 와 같은 뜻이지만 더 격식 있습니다.", ["negotiation", "formal"], ["we still need the order by Friday", "the price needs to come down", "quality must not be compromised"],
      [
        { en: "Be that as it may, we cannot extend the deadline any further.", kr: "그렇다 하더라도, 마감을 더 이상 연장할 수 없습니다." },
        { en: "Be that as it may, the minimum quality standard is non-negotiable.", kr: "그렇다 하더라도, 최소 품질 기준은 협상 대상이 아닙니다." },
        { en: "Be that as it may, we still need a firm commitment from your side.", kr: "그렇다 하더라도, 귀사의 확고한 확약이 여전히 필요합니다." },
      ]
    ],
    ["beyond-a-shadow-of-doubt", "beyond a shadow of a doubt", "의심할 여지 없이", "advanced", "pattern", "beyond a shadow of a doubt, + clause", "어떤 사실을 완전히 확실하다고 강조할 때 씁니다.", "품질 보증, 데이터 근거 확인, 강한 주장에 씁니다.", "without a doubt 보다 더 강하고 문학적입니다.", ["formal", "communication"], ["the results are positive", "the investment was worthwhile", "quality improved"],
      [
        { en: "Beyond a shadow of a doubt, this is the most cost-effective option.", kr: "의심할 여지 없이, 이것이 가장 비용 효율적인 선택입니다." },
        { en: "The test results prove, beyond a shadow of a doubt, that the product is safe.", kr: "테스트 결과는 제품이 안전하다는 것을 의심할 여지 없이 증명합니다." },
        { en: "Beyond a shadow of a doubt, we need to change our approach.", kr: "의심할 여지 없이, 우리는 접근 방식을 바꿔야 합니다." },
      ]
    ],
    ["by-all-means", "by all means", "물론이죠, 꼭 그렇게 하세요", "intermediate", "pattern", "by all means, + do / feel free to", "상대방의 요청에 흔쾌히 동의할 때 씁니다.", "허락 표현, 격려, 요청 수락에 씁니다.", "of course 보다 더 강한 허락의 뉘앙스입니다.", ["communication", "polite request"], ["go ahead", "ask any questions", "share your thoughts"],
      [
        { en: "By all means, feel free to share any feedback you have.", kr: "물론이죠, 가지고 계신 피드백을 편하게 공유해주세요." },
        { en: "By all means, go ahead and contact our technical team directly.", kr: "물론이죠, 기술팀에 직접 연락하셔도 됩니다." },
        { en: "By all means, take as much time as you need to review the contract.", kr: "물론이죠, 계약서를 검토하는 데 필요한 만큼 시간을 가지세요." },
      ]
    ],
    ["chances-are", "chances are", "아마도 ~일 것입니다", "intermediate", "pattern", "chances are + clause", "높은 가능성을 비공식적으로 표현할 때 씁니다.", "예측, 비공식 보고, 회의 중 의견 공유에 씁니다.", "it is likely that 보다 더 구어적입니다.", ["communication", "analysis"], ["the client will accept", "we'll meet the target", "demand will increase"],
      [
        { en: "Chances are the client will agree if we offer a slight discount.", kr: "약간의 할인을 제공하면 아마 고객이 동의할 것입니다." },
        { en: "Chances are, demand will pick up again after the holiday season.", kr: "아마도 연휴 이후 다시 수요가 살아날 것입니다." },
        { en: "Chances are, we'll need to revisit the pricing before year-end.", kr: "아마도 연말 전에 가격 책정을 재검토해야 할 것입니다." },
      ]
    ],
    ["credit-where-credit-is-due", "credit where credit is due", "공을 인정하다", "intermediate", "pattern", "give credit where credit is due", "누군가의 노력이나 성과를 적절히 인정할 때 씁니다.", "팀 성과 발표, 공로 인정, 감사 표현에 씁니다.", "due credit 을 주는 것이 핵심입니다.", ["management", "communication"], ["the team", "the supplier", "the initiative"],
      [
        { en: "Credit where credit is due — the engineering team solved this in record time.", kr: "공을 인정하자면 — 엔지니어링팀이 이것을 기록적인 시간 안에 해결했습니다." },
        { en: "Let's give credit where credit is due: this was a team effort.", kr: "공을 제대로 인정합시다: 이것은 팀 전체의 노력이었습니다." },
        { en: "Credit where credit is due — the supplier delivered under difficult conditions.", kr: "공을 인정하자면 — 공급사가 어려운 조건에서 납품해냈습니다." },
      ]
    ],
    ["each-other-halfway", "meet each other halfway", "서로 양보하다", "intermediate", "pattern", "meet each other halfway + on + issue", "양측이 조금씩 양보해 합의에 이를 때 씁니다.", "협상 타협, 분쟁 해결, 조건 조정에 씁니다.", "meet someone halfway 도 자주 씁니다.", ["negotiation", "communication"], ["the pricing", "the delivery schedule", "the terms"],
      [
        { en: "If we both meet each other halfway on price, we can close this today.", kr: "우리 둘 다 가격에서 조금씩 양보하면 오늘 거래를 마무리할 수 있습니다." },
        { en: "I'm willing to meet you halfway on the payment terms.", kr: "결제 조건에서 절충점을 찾을 의향이 있습니다." },
        { en: "Can we find a way to meet each other halfway on the timeline?", kr: "일정에 대해 서로 절충점을 찾을 수 있을까요?" },
      ]
    ],
    ["fair-enough", "fair enough", "납득이 되다, 그렇게 합시다", "intermediate", "pattern", "fair enough — + acknowledgment", "상대방의 주장이나 조건이 합리적이라고 인정할 때 씁니다.", "협상 수용, 요청 인정, 조건 동의에 씁니다.", "짧고 실용적인 동의 표현입니다.", ["negotiation", "communication"], ["let's proceed", "I understand your position", "we can adjust"],
      [
        { en: "Fair enough — if you can confirm by Thursday, we'll hold the production slot.", kr: "납득이 됩니다 — 목요일까지 확인해주시면 생산 슬롯을 잡아두겠습니다." },
        { en: "Fair enough. We'll revise the proposal and send it tomorrow.", kr: "그렇게 하죠. 제안서를 수정해서 내일 보내겠습니다." },
        { en: "Fair enough — we'll split the shipping cost 50-50.", kr: "납득이 됩니다 — 운송비를 50대 50으로 나누겠습니다." },
      ]
    ],
    ["first-things-first", "first things first", "먼저 해야 할 것부터", "intermediate", "pattern", "first things first, + priority action", "가장 중요한 것을 먼저 처리해야 한다고 강조할 때 씁니다.", "우선순위 결정, 회의 시작, 업무 정리에 씁니다.", "let's prioritize 와 비슷하지만 더 직접적입니다.", ["meeting", "management"], ["confirm the order", "align on the scope", "agree on the timeline"],
      [
        { en: "First things first — let's confirm the delivery date before anything else.", kr: "먼저 해야 할 것부터 — 다른 무엇보다 납기일을 확인합시다." },
        { en: "First things first: does everyone have the updated brief?", kr: "먼저 해야 할 것부터: 모두 업데이트된 브리프를 가지고 있나요?" },
        { en: "First things first — we need to resolve the payment dispute.", kr: "먼저 해야 할 것부터 — 결제 분쟁을 해결해야 합니다." },
      ]
    ],
    ["food-for-thought", "food for thought", "생각할 거리", "intermediate", "pattern", "give someone food for thought", "깊이 생각해볼 거리를 제공할 때 씁니다.", "제안, 데이터 제시, 전략 논의 마무리에 씁니다.", "something to think about 과 같은 뜻입니다.", ["meeting", "strategy"], ["the market data", "this comparison", "the long-term projection"],
      [
        { en: "This comparison should give us some food for thought before we decide.", kr: "이 비교 자료는 결정하기 전에 생각할 거리를 줄 것입니다." },
        { en: "The customer feedback provides a lot of food for thought.", kr: "고객 피드백이 많은 생각할 거리를 제공합니다." },
        { en: "I'll leave you with this: some food for thought for our next session.", kr: "다음 세션을 위한 생각할 거리로 이것을 남겨드리겠습니다." },
      ]
    ],
    ["from-where-i-stand", "from where I stand", "내 관점에서는", "intermediate", "pattern", "from where I stand, + opinion / assessment", "자신의 시각이나 관점을 밝힐 때 씁니다.", "의견 표현, 상황 판단, 입장 설명에 씁니다.", "in my view 보다 더 개인적·구체적인 관점을 강조합니다.", ["communication", "negotiation"], ["this is a fair deal", "the risk is manageable", "we should proceed"],
      [
        { en: "From where I stand, the revised offer is reasonable.", kr: "내 관점에서는, 수정된 제안이 합리적입니다." },
        { en: "From where I stand, the bigger risk is doing nothing.", kr: "내 관점에서는, 더 큰 위험은 아무것도 하지 않는 것입니다." },
        { en: "From where I stand, both options have merit — it depends on your priorities.", kr: "내 관점에서는 두 옵션 모두 장점이 있습니다 — 우선순위에 달려 있습니다." },
      ]
    ],
    ["given-that", "given that", "~임을 감안하면", "intermediate", "pattern", "given that + clause, + recommendation", "특정 조건이나 사실을 고려해 결론을 도출할 때 씁니다.", "보고서, 협상 근거, 결정 설명에 씁니다.", "considering that 과 같은 뜻입니다.", ["analysis", "formal"], ["the timeline is tight", "costs have increased", "demand is uncertain"],
      [
        { en: "Given that the timeline is tight, we recommend air freight over sea.", kr: "일정이 빠듯함을 감안하면, 해상 대신 항공 운송을 권장합니다." },
        { en: "Given that costs have risen, a price adjustment is necessary.", kr: "비용이 올랐음을 감안하면, 가격 조정이 필요합니다." },
        { en: "Given that the client has a strict quality requirement, we'll need extra QC steps.", kr: "고객이 엄격한 품질 요건을 가지고 있음을 감안하면, 추가 품질 관리 단계가 필요합니다." },
      ]
    ],
    ["heads-up", "give a heads up", "미리 알려주다", "intermediate", "pattern", "give someone a heads up + about / that", "미리 알려줄 때 씁니다.", "사전 경고, 변경 사항 사전 공지, 일정 공유에 씁니다.", "heads up 은 명사로도 씁니다.", ["communication", "email"], ["about the delay", "that the price will change", "before the announcement"],
      [
        { en: "I just wanted to give you a heads up — the shipment may be delayed.", kr: "미리 알려드리고 싶었습니다 — 선적이 지연될 수 있습니다." },
        { en: "Thanks for the heads up about the price change.", kr: "가격 변경에 대해 미리 알려주셔서 감사합니다." },
        { en: "Can you give the client a heads up before we send the formal notice?", kr: "공식 공지를 보내기 전에 고객에게 미리 알려주시겠어요?" },
      ]
    ],
    ["hit-the-ground-running", "hit the ground running", "바로 전력으로 시작하다", "intermediate", "pattern", "hit the ground running + with + project", "새 역할이나 프로젝트를 지체 없이 바로 시작할 때 씁니다.", "신규 담당자 온보딩, 프로젝트 킥오프에 씁니다.", "준비가 완벽히 된 상태에서 바로 시작하는 뉘앙스입니다.", ["management", "project"], ["the new project", "the account", "the role"],
      [
        { en: "The new hire hit the ground running and closed a deal in her first week.", kr: "신입 직원이 바로 전력으로 시작해서 첫 주에 거래를 성사시켰습니다." },
        { en: "We need someone who can hit the ground running — no time for a long ramp-up.", kr: "바로 시작할 수 있는 사람이 필요합니다 — 긴 적응 기간은 없습니다." },
        { en: "With the briefing materials ready, we're all set to hit the ground running.", kr: "브리핑 자료가 준비되어 바로 전력으로 시작할 준비가 되었습니다." },
      ]
    ],
    ["if-anything", "if anything", "오히려, 굳이 말하자면", "intermediate", "pattern", "if anything, + contrasting statement", "예상과 다른 방향의 결과나 의견을 부드럽게 표현할 때 씁니다.", "반전 정보 제공, 예상 정정, 미묘한 차이 강조에 씁니다.", "if anything 은 문장 앞이나 중간에 씁니다.", ["communication", "analysis"], ["it's better than expected", "demand is higher", "the cost is lower"],
      [
        { en: "If anything, the quality has improved since we switched suppliers.", kr: "오히려, 공급사를 바꾼 이후로 품질이 개선됐습니다." },
        { en: "If anything, the new process has made things more complicated.", kr: "오히려, 새 프로세스가 일을 더 복잡하게 만들었습니다." },
        { en: "The response wasn't negative — if anything, they seemed quite interested.", kr: "반응이 부정적이지 않았습니다 — 오히려, 꽤 관심을 보이는 것 같았습니다." },
      ]
    ],
    ["in-due-course", "in due course", "때가 되면, 차차", "intermediate", "pattern", "in due course + clause", "지금 당장이 아닌 적절한 시기에 이루어질 것을 안심시킬 때 씁니다.", "공식 회신 안내, 승인 예상, 결정 예고에 씁니다.", "상대를 재촉하지 않고 기다려달라는 의미도 있습니다.", ["email", "formal"], ["we will provide an update", "you will receive confirmation", "a decision will be made"],
      [
        { en: "In due course, we will send you the official confirmation.", kr: "때가 되면 공식 확인서를 보내드리겠습니다." },
        { en: "All queries will be addressed in due course.", kr: "모든 문의는 때가 되면 처리될 것입니다." },
        { en: "The board will make a decision in due course.", kr: "이사회가 차차 결정을 내릴 것입니다." },
      ]
    ],
    ["in-good-faith", "in good faith", "선의로, 진심으로", "advanced", "pattern", "act in good faith / negotiate in good faith", "진심어린 의도로 행동할 때 씁니다.", "계약 협상, 신뢰 구축, 성의 있는 대화에 씁니다.", "법적·계약적 상황에서도 자주 쓰입니다.", ["negotiation", "legal"], ["the offer", "the negotiation", "the concession"],
      [
        { en: "We have made this offer in good faith and hope you'll consider it seriously.", kr: "이 제안은 선의로 드리는 것이며 진지하게 검토해주시길 바랍니다." },
        { en: "Both parties agreed to negotiate in good faith to reach a fair outcome.", kr: "양 당사자는 공정한 결과를 위해 선의로 협상하기로 합의했습니다." },
        { en: "We acted in good faith, but the supplier failed to deliver as promised.", kr: "우리는 선의로 행동했지만 공급사가 약속대로 납품하지 못했습니다." },
      ]
    ],
    ["in-the-same-boat", "in the same boat", "같은 처지에 있다", "intermediate", "pattern", "be in the same boat + as", "같은 어려운 상황에 처해 있음을 공감할 때 씁니다.", "공통된 도전 공유, 파트너십 강화, 협력 촉구에 씁니다.", "공감과 연대를 표현하는 데 좋습니다.", ["communication", "relationship"], ["everyone", "our partners", "most companies"],
      [
        { en: "We're all in the same boat — raw material costs are up for everyone.", kr: "우리 모두 같은 처지입니다 — 모두를 위해 원자재 비용이 올랐습니다." },
        { en: "We understand your situation — we're in the same boat with our suppliers.", kr: "귀사의 상황을 이해합니다 — 우리도 공급사와 같은 처지입니다." },
        { en: "Since we're in the same boat, let's work together to find a solution.", kr: "같은 처지이므로 함께 해결책을 찾아봅시다." },
      ]
    ],
    ["jump-on-board", "jump on board", "참여하다, 동참하다", "intermediate", "pattern", "jump on board + with + project / idea", "기회를 놓치지 않고 빠르게 동참할 때 씁니다.", "파트너십 제안, 신규 프로젝트, 시장 기회 참여에 씁니다.", "come on board 보다 더 능동적이고 빠른 참여를 뜻합니다.", ["sales", "relationship"], ["the initiative", "the project", "the partnership"],
      [
        { en: "We'd love for you to jump on board with this joint venture.", kr: "이 합작 투자에 동참해주시면 좋겠습니다." },
        { en: "The client jumped on board immediately after seeing the demo.", kr: "데모를 보고 나서 고객이 즉시 참여했습니다." },
        { en: "Other suppliers have already jumped on board — don't miss this.", kr: "다른 공급사들은 이미 동참했습니다 — 놓치지 마세요." },
      ]
    ],
    ["keep-a-lid-on", "keep a lid on", "억제하다, 비밀로 유지하다", "advanced", "pattern", "keep a lid on + costs / information / situation", "비용이나 정보를 통제하거나 억제할 때 씁니다.", "비용 통제, 기밀 유지, 상황 통제에 씁니다.", "keep under wraps 와 비슷하지만 더 구어적입니다.", ["management", "finance"], ["costs", "the information", "the situation"],
      [
        { en: "We need to keep a lid on costs this quarter — no unnecessary spending.", kr: "이번 분기에는 비용을 억제해야 합니다 — 불필요한 지출은 없습니다." },
        { en: "Let's keep a lid on this until we have official confirmation.", kr: "공식 확인이 있을 때까지 이것을 비밀로 유지합시다." },
        { en: "The team managed to keep a lid on the situation before it escalated.", kr: "팀이 상황이 커지기 전에 억제하는 데 성공했습니다." },
      ]
    ],
    ["on-that-note", "on that note", "그런 의미에서", "intermediate", "pattern", "on that note, + closing / transition", "발언이나 주제를 마무리하며 다음으로 넘어갈 때 씁니다.", "회의 마무리, 발표 전환, 이메일 마지막 문단에 씁니다.", "with that in mind 보다 더 마무리 성격이 강합니다.", ["meeting", "presentation"], ["let's wrap up", "I'll hand it over to", "thank you all for joining"],
      [
        { en: "On that note, let's wrap up and move to Q&A.", kr: "그런 의미에서, 마무리하고 Q&A로 넘어가겠습니다." },
        { en: "On that note, I'll hand the floor over to our CFO.", kr: "그런 의미에서, CFO에게 발언권을 넘기겠습니다." },
        { en: "On that note, thank you all for your time today.", kr: "그런 의미에서, 오늘 시간을 내주신 모든 분들께 감사드립니다." },
      ]
    ],
    ["on-the-fence", "on the fence", "결정을 못 하고 있다", "intermediate", "pattern", "be on the fence + about / regarding", "결정을 내리지 못하고 망설일 때 씁니다.", "고객 설득, 내부 결정 보류, 협상에서 탐색 단계에 씁니다.", "undecided 보다 더 구어적입니다.", ["negotiation", "sales"], ["the decision", "the proposal", "the new supplier"],
      [
        { en: "The client is still on the fence — can we offer something extra to tip the balance?", kr: "고객이 아직 결정을 못 하고 있습니다 — 균형을 기울이기 위해 무언가 추가 제공할 수 있을까요?" },
        { en: "I'm on the fence about whether to expand into that market now.", kr: "지금 그 시장으로 확장해야 할지 망설이고 있습니다." },
        { en: "If you're on the fence, let me share some data that might help.", kr: "결정을 못 하고 계신다면, 도움이 될 만한 데이터를 공유해드리겠습니다." },
      ]
    ],
    ["out-of-the-loop", "be out of the loop", "소식을 못 듣고 있다", "intermediate", "pattern", "be out of the loop + on / about", "중요한 정보나 결정에서 제외되어 있을 때 씁니다.", "커뮤니케이션 단절, 부재 후 복귀, 정보 공유 요청에 씁니다.", "keep someone in the loop 의 반대입니다.", ["communication", "management"], ["the decision", "recent developments", "the update"],
      [
        { en: "I've been out of the loop this week — can you bring me up to speed?", kr: "이번 주에 소식을 못 듣고 있었습니다 — 최신 내용을 알려주시겠어요?" },
        { en: "The supplier seems to be out of the loop on the spec change.", kr: "공급사가 사양 변경에 대해 소식을 못 듣고 있는 것 같습니다." },
        { en: "Let's make sure no one is out of the loop on this decision.", kr: "이 결정에서 소식을 못 듣는 사람이 없도록 합시다." },
      ]
    ],
    ["put-it-bluntly", "to put it bluntly", "솔직히 말하자면", "intermediate", "pattern", "to put it bluntly, + direct statement", "완곡하지 않고 직접적으로 말할 때 씁니다.", "문제 직접 지적, 현실적 평가, 협상 결렬 표현에 씁니다.", "frankly speaking 과 같지만 더 강한 뉘앙스입니다.", ["negotiation", "communication"], ["the price is too high", "the quality is unacceptable", "we need a better offer"],
      [
        { en: "To put it bluntly, your current pricing is not competitive.", kr: "솔직히 말하자면, 현재 가격이 경쟁력이 없습니다." },
        { en: "To put it bluntly, we can't move forward without a quality improvement plan.", kr: "솔직히 말하자면, 품질 개선 계획 없이는 진행할 수 없습니다." },
        { en: "To put it bluntly, the timeline you've proposed is simply not workable.", kr: "솔직히 말하자면, 제안하신 일정은 실현 불가능합니다." },
      ]
    ],
    ["rain-check", "take a rain check", "다음 기회로 미루다", "intermediate", "pattern", "take a rain check + on + meeting / offer", "지금은 아니지만 나중에 하겠다고 할 때 씁니다.", "미팅 일정 변경, 제안 보류, 임시 거절에 씁니다.", "I'll take a rain check 이 가장 흔한 형태입니다.", ["meeting", "communication"], ["the dinner", "the offer", "the visit"],
      [
        { en: "I'll have to take a rain check on the lunch — I have an urgent call.", kr: "점심을 다음으로 미뤄야 할 것 같습니다 — 긴급 통화가 있습니다." },
        { en: "Can I take a rain check on the factory visit? Next week works better.", kr: "공장 방문을 다음으로 미뤄도 될까요? 다음 주가 더 좋습니다." },
        { en: "She took a rain check on the offer and came back three weeks later.", kr: "그녀는 제안을 보류했다가 3주 후에 다시 연락했습니다." },
      ]
    ],
    ["safe-to-say", "it's safe to say", "~라고 봐도 무방하다", "intermediate", "pattern", "it's safe to say + clause", "어느 정도 확실한 사실을 말할 때 씁니다.", "결과 요약, 트렌드 확인, 예측에 씁니다.", "it's fair to say 와 거의 같지만 조금 더 확신이 있습니다.", ["communication", "analysis"], ["the strategy is working", "we exceeded expectations", "demand is growing"],
      [
        { en: "It's safe to say that Q3 was our strongest quarter in three years.", kr: "3분기가 3년 만에 가장 강한 분기였다고 봐도 무방합니다." },
        { en: "It's safe to say the client was pleased with the outcome.", kr: "고객이 결과에 만족했다고 봐도 무방합니다." },
        { en: "It's safe to say that the investment in quality control has paid off.", kr: "품질 관리에 대한 투자가 결실을 맺었다고 봐도 무방합니다." },
      ]
    ],
    ["speaking-of-which", "speaking of which", "그 말이 나와서 말인데", "intermediate", "pattern", "speaking of which, + related topic", "대화 중 관련 주제로 자연스럽게 넘어갈 때 씁니다.", "회의 전환, 관련 이슈 추가, 연결 발언에 씁니다.", "by the way 보다 더 관련성을 강조합니다.", ["meeting", "communication"], ["the delivery schedule", "the budget", "the client visit"],
      [
        { en: "We're making good progress on the project. Speaking of which, have you confirmed the testing date?", kr: "프로젝트가 잘 진행되고 있습니다. 그 말이 나와서 말인데, 테스트 날짜를 확인했나요?" },
        { en: "The new system is working well. Speaking of which, we need to train the new staff.", kr: "새 시스템이 잘 작동하고 있습니다. 그 말이 나와서 말인데, 신규 직원 교육이 필요합니다." },
        { en: "Speaking of which, let's add that topic to next week's agenda.", kr: "그 말이 나와서 말인데, 그 주제를 다음 주 의제에 추가합시다." },
      ]
    ],
    ["take-it-from-me", "take it from me", "내 말을 믿어봐요", "intermediate", "pattern", "take it from me, + advice / experience", "경험을 바탕으로 강력히 조언할 때 씁니다.", "전문가 조언, 경험 기반 권고에 씁니다.", "trust me 보다 더 경험적 근거를 강조합니다.", ["communication", "management"], ["this approach works", "invest in quality early", "set clear expectations"],
      [
        { en: "Take it from me — investing in quality from the start saves a lot of rework.", kr: "내 말을 믿어봐요 — 처음부터 품질에 투자하면 재작업을 많이 줄일 수 있습니다." },
        { en: "Take it from me, clear communication upfront prevents misunderstandings later.", kr: "내 말을 믿어봐요, 초반에 명확하게 소통하면 나중에 오해를 막을 수 있습니다." },
        { en: "Take it from me — don't skip the pilot phase, no matter how confident you feel.", kr: "내 말을 믿어봐요 — 아무리 자신 있어도 파일럿 단계를 건너뛰지 마세요." },
      ]
    ],
    ["that-said", "that said", "그렇긴 하지만", "intermediate", "pattern", "that said, + contrasting view", "앞의 내용을 인정하면서 반전이나 조건을 추가할 때 씁니다.", "보고서 결론, 협상 타협, 발표 전환에 씁니다.", "that being said 의 짧은 형태입니다.", ["communication", "presentation"], ["there are still challenges", "we need to act cautiously", "the opportunity is real"],
      [
        { en: "The results look promising. That said, it's too early to celebrate.", kr: "결과가 유망해 보입니다. 그렇긴 하지만, 아직 축하하기엔 이릅니다." },
        { en: "The proposal is solid. That said, I'd like to revisit the pricing.", kr: "제안서가 탄탄합니다. 그렇긴 하지만, 가격을 재검토하고 싶습니다." },
        { en: "Market conditions are tough. That said, our pipeline is stronger than ever.", kr: "시장 상황이 어렵습니다. 그렇긴 하지만, 우리 파이프라인은 그 어느 때보다 강합니다." },
      ]
    ],
    ["there-you-have-it", "there you have it", "바로 그것입니다", "intermediate", "pattern", "there you have it — + summary", "결론이나 요점을 마무리 지을 때 씁니다.", "발표 마무리, 설명 결론, 간단한 요약에 씁니다.", "there it is 와 같지만 더 구어적이고 발표에 자주 씁니다.", ["presentation", "communication"], ["the full picture", "the three key benefits", "our proposal"],
      [
        { en: "And there you have it — three reasons why we're the right partner for you.", kr: "바로 그것입니다 — 우리가 귀사에 적합한 파트너인 세 가지 이유입니다." },
        { en: "There you have it: a clear plan for improving our on-time delivery rate.", kr: "바로 그것입니다: 납기 준수율을 개선하기 위한 명확한 계획입니다." },
        { en: "There you have it — everything you need to know about the new process.", kr: "바로 그것입니다 — 새 프로세스에 대해 알아야 할 모든 것입니다." },
      ]
    ],
    ["think-outside-the-box", "think outside the box", "틀을 벗어나 생각하다", "intermediate", "pattern", "think outside the box + to / and", "창의적이고 관습에 얽매이지 않는 사고를 독려할 때 씁니다.", "문제 해결, 브레인스토밍, 혁신 촉구에 씁니다.", "비유적 표현이므로 너무 남용하지 않습니다.", ["strategy", "communication"], ["to find a solution", "when approaching this challenge", "to differentiate"],
      [
        { en: "We need to think outside the box if we want to crack this market.", kr: "이 시장을 공략하려면 틀을 벗어나 생각해야 합니다." },
        { en: "I'm asking you to think outside the box — what if we restructure the offer entirely?", kr: "틀을 벗어나 생각해봐 주세요 — 제안을 완전히 재구성하면 어떨까요?" },
        { en: "Thinking outside the box led us to a solution no one had considered.", kr: "틀을 벗어난 사고가 아무도 고려하지 않은 해결책으로 이어졌습니다." },
      ]
    ],
    ["time-will-tell", "time will tell", "두고 보면 알 것이다", "intermediate", "pattern", "time will tell + whether / if", "결과를 기다려봐야 알 수 있다는 뜻입니다.", "불확실한 예측, 신중한 전망, 실험 결과 대기에 씁니다.", "we'll see 보다 더 참을성 있는 어조입니다.", ["analysis", "communication"], ["the strategy works", "the partnership will succeed", "the market will respond"],
      [
        { en: "Time will tell whether this new approach will work in the long run.", kr: "이 새로운 접근 방식이 장기적으로 효과가 있을지 두고 보면 알 것입니다." },
        { en: "It's a bold move — time will tell if it pays off.", kr: "대담한 행동입니다 — 결실을 맺을지 두고 보면 알 것입니다." },
        { en: "We're cautiously optimistic, but time will tell.", kr: "조심스럽게 낙관적이지만, 두고 보면 알 것입니다." },
      ]
    ],
    ["to-be-fair", "to be fair", "공정하게 말하자면", "intermediate", "pattern", "to be fair, + balanced statement", "균형 잡힌 시각을 제시할 때 씁니다.", "의견 균형, 비판 완화, 공정한 평가에 씁니다.", "to be honest 와 비슷하지만 더 공평성을 강조합니다.", ["communication", "analysis"], ["they did deliver on time", "the issue was partly our fault", "the price is reasonable"],
      [
        { en: "To be fair, the supplier delivered within the agreed window.", kr: "공정하게 말하자면, 공급사는 합의된 기간 내에 납품했습니다." },
        { en: "To be fair, the delay was partly due to our late specification change.", kr: "공정하게 말하자면, 지연은 부분적으로 우리의 늦은 사양 변경 때문이었습니다." },
        { en: "To be fair, this is a difficult problem with no easy solution.", kr: "공정하게 말하자면, 쉬운 해결책이 없는 어려운 문제입니다." },
      ]
    ],
    ["to-be-on-the-safe-side", "to be on the safe side", "혹시 모르니, 안전을 위해", "intermediate", "pattern", "to be on the safe side, + precaution", "위험을 최소화하기 위해 추가 조치를 취할 때 씁니다.", "재고 버퍼, 이중 확인, 사전 대비에 씁니다.", "just to be safe 와 같은 뜻입니다.", ["planning", "operations"], ["order extra stock", "double-check the specs", "send a backup supplier"],
      [
        { en: "To be on the safe side, let's order 10% more than the minimum.", kr: "혹시 모르니, 최소량보다 10% 더 주문합시다." },
        { en: "To be on the safe side, get a written confirmation from the client.", kr: "안전을 위해, 고객에게 서면 확인을 받아두세요." },
        { en: "To be on the safe side, we've lined up a backup supplier.", kr: "혹시 모르니, 백업 공급사를 확보해 두었습니다." },
      ]
    ],
    ["under-the-circumstances", "under the circumstances", "상황을 고려하면", "intermediate", "pattern", "under the circumstances, + decision or reaction", "주어진 상황에서 최선의 선택임을 설명할 때 씁니다.", "예외 처리, 비상 결정, 이해 구하기에 씁니다.", "given the circumstances 와 같은 뜻입니다.", ["communication", "management"], ["this is the best we can do", "we did the right thing", "it was a reasonable decision"],
      [
        { en: "Under the circumstances, a one-week extension is the most we can offer.", kr: "상황을 고려하면, 1주일 연장이 우리가 제공할 수 있는 최선입니다." },
        { en: "Under the circumstances, I think the team did an excellent job.", kr: "상황을 고려하면, 팀이 훌륭하게 해낸 것 같습니다." },
        { en: "Under the circumstances, delaying the launch was the right call.", kr: "상황을 고려하면, 출시를 연기한 것은 옳은 결정이었습니다." },
      ]
    ],
    ["up-in-the-air", "be up in the air", "아직 미정이다", "intermediate", "pattern", "still up in the air + regarding", "결정이 아직 내려지지 않았을 때 씁니다.", "보류 중인 결정, 불확실한 계획, 협상 중인 조건에 씁니다.", "undecided 보다 더 구어적이고 유동적인 뉘앙스입니다.", ["planning", "communication"], ["the final decision", "the exact timeline", "the pricing structure"],
      [
        { en: "The launch date is still up in the air — we're waiting on the certification.", kr: "출시 날짜가 아직 미정입니다 — 인증을 기다리고 있습니다." },
        { en: "Things are still up in the air on the pricing — let's revisit next week.", kr: "가격이 아직 미정입니다 — 다음 주에 다시 논의합시다." },
        { en: "Whether we'll expand to that region is still up in the air.", kr: "그 지역으로 확장할지 여부가 아직 미정입니다." },
      ]
    ],
    ["without-further-ado", "without further ado", "더 이상 지체 없이", "intermediate", "pattern", "without further ado, + action", "소개나 이유 설명 없이 바로 시작할 때 씁니다.", "발표 시작, 이메일 본론 전환, 회의 진행에 씁니다.", "발표나 공식 이메일에서 자주 씁니다.", ["presentation", "formal"], ["let's get started", "I'd like to introduce", "here are the results"],
      [
        { en: "Without further ado, let's get started with today's agenda.", kr: "더 이상 지체 없이, 오늘 의제를 시작하겠습니다." },
        { en: "Without further ado, I'd like to introduce our keynote speaker.", kr: "더 이상 지체 없이, 기조 연사를 소개하겠습니다." },
        { en: "Without further ado, here are the Q3 results we've been waiting for.", kr: "더 이상 지체 없이, 기다리던 3분기 결과를 공개합니다." },
      ]
    ],
    ["worth-bearing-in-mind", "worth bearing in mind", "명심할 만하다", "intermediate", "pattern", "it's worth bearing in mind that + clause", "잊지 않으면 좋을 중요한 사항을 전달할 때 씁니다.", "계획 수립, 협상, 리스크 관리에 씁니다.", "worth keeping in mind 과 같은 뜻입니다.", ["communication", "planning"], ["the lead time", "the market conditions", "the regulatory requirements"],
      [
        { en: "It's worth bearing in mind that the lead time increases during peak season.", kr: "성수기에 납기가 늘어난다는 점을 명심할 만합니다." },
        { en: "Worth bearing in mind: the minimum order quantity is 1,000 units.", kr: "명심할 만한 것: 최소 주문 수량이 1,000개입니다." },
        { en: "It's worth bearing in mind that exchange rates can affect your total cost.", kr: "환율이 총 비용에 영향을 미칠 수 있다는 점을 명심할 만합니다." },
      ]
    ],

    // ── Batch 7: 핵심 비즈니스 구동사 ────────────────────────────────────────
    ["put-off", "put off", "미루다, 연기하다", "intermediate", "phrasal-verb", "put off + meeting / decision / deadline", "일정이나 결정을 나중으로 미룰 때 씁니다.", "회의 연기, 결정 유보, 출시 연기에 씁니다.", "postpone 과 같지만 더 구어적입니다.", ["planning", "communication"], ["the meeting", "the decision", "the deadline"],
      [
        { en: "Can we put off the decision until we have more data?", kr: "데이터가 더 모일 때까지 결정을 미룰 수 있을까요?" },
        { en: "We had to put off the factory visit due to the holiday.", kr: "명절로 인해 공장 방문을 연기해야 했습니다." },
        { en: "Please don't put off responding — the client needs an answer today.", kr: "회신을 미루지 마세요 — 고객이 오늘 답변을 기다리고 있습니다." },
      ]
    ],
    ["put-forward", "put forward", "제안하다, 제출하다", "intermediate", "phrasal-verb", "put forward + idea / proposal / candidate", "아이디어나 제안을 공식적으로 제시할 때 씁니다.", "전략 제안, 후보 추천, 의제 제출에 씁니다.", "suggest 보다 더 공식적이고 능동적인 뉘앙스입니다.", ["communication", "management"], ["a proposal", "an alternative approach", "a new timeline"],
      [
        { en: "I'd like to put forward a proposal for reducing our packaging costs.", kr: "포장 비용 절감에 대한 제안을 드리고 싶습니다." },
        { en: "She put forward the idea of using a local warehouse to cut freight costs.", kr: "그녀는 운송비 절감을 위해 현지 창고를 활용하자는 아이디어를 제안했습니다." },
        { en: "We can put forward an alternative timeline if the original one is not feasible.", kr: "원래 일정이 실현 불가능하다면 대안 일정을 제시할 수 있습니다." },
      ]
    ],
    ["sign-off-on", "sign off on", "최종 승인하다", "intermediate", "phrasal-verb", "sign off on + proposal / purchase / design", "최종 결재나 공식 승인을 할 때 씁니다.", "발주 승인, 설계 확정, 계약서 결재에 씁니다.", "approve 와 같지만 더 절차적인 마무리 뉘앙스입니다.", ["approval", "management"], ["the purchase order", "the design", "the budget"],
      [
        { en: "Can you sign off on the purchase order before end of day?", kr: "오늘 중으로 발주서에 결재해주실 수 있나요?" },
        { en: "The project cannot start until the director signs off on the budget.", kr: "이사가 예산을 최종 승인하기 전까지 프로젝트를 시작할 수 없습니다." },
        { en: "We need the client to sign off on the final design before production begins.", kr: "생산 시작 전에 고객이 최종 디자인을 승인해야 합니다." },
      ]
    ],
    ["take-on", "take on", "맡다, 수락하다", "intermediate", "phrasal-verb", "take on + responsibility / project / new client", "새로운 업무나 책임을 맡을 때 씁니다.", "신규 프로젝트 담당, 업무 추가 수락, 고객 온보딩에 씁니다.", "accept 보다 더 능동적으로 책임을 떠안는다는 뉘앙스입니다.", ["management", "hr"], ["the project", "the new account", "extra responsibility"],
      [
        { en: "Are you able to take on the new account starting next month?", kr: "다음 달부터 신규 거래처를 맡을 수 있나요?" },
        { en: "We can take on the additional order if you can extend the deadline by one week.", kr: "납기를 1주일 연장해주시면 추가 주문을 맡을 수 있습니다." },
        { en: "She took on full responsibility for managing the key account.", kr: "그녀가 핵심 거래처 관리 책임을 전적으로 맡았습니다." },
      ]
    ],
    ["break-down", "break down", "세분화하다, 분석하다", "intermediate", "phrasal-verb", "break down + cost / process / data", "복잡한 정보를 항목별로 나눠 설명할 때 씁니다.", "견적 내역 설명, 비용 항목 분류, 절차 설명에 씁니다.", "명사형 breakdown 도 자주 씁니다.", ["analysis", "communication"], ["the cost structure", "the process steps", "the data by region"],
      [
        { en: "Could you break down the quotation by material, labor, and freight?", kr: "견적을 자재, 인건비, 운송비로 나눠서 보여주실 수 있나요?" },
        { en: "Let me break down the process so everyone is clear on their responsibilities.", kr: "각자의 역할이 명확해지도록 프로세스를 단계별로 설명하겠습니다." },
        { en: "Please break down the sales figures by region for the Q3 report.", kr: "3분기 보고서를 위해 지역별로 매출 수치를 분류해주세요." },
      ]
    ],
    ["come-up-with", "come up with", "생각해내다, 마련하다", "intermediate", "phrasal-verb", "come up with + solution / idea / plan", "해결책이나 아이디어를 제시할 때 씁니다.", "문제 해결, 대안 제시, 전략 개발에 씁니다.", "think of 보다 더 창의적 과정이 강조됩니다.", ["communication", "strategy"], ["a solution", "a better approach", "an alternative plan"],
      [
        { en: "Can you come up with an alternative delivery route to avoid the port delay?", kr: "항구 지연을 피할 대체 배송 경로를 제안해줄 수 있나요?" },
        { en: "The team came up with a creative way to reduce packaging waste by 30%.", kr: "팀이 포장 폐기물을 30% 줄이는 창의적인 방법을 생각해냈습니다." },
        { en: "We need to come up with a contingency plan before the meeting on Friday.", kr: "금요일 회의 전에 비상 계획을 마련해야 합니다." },
      ]
    ],
    ["look-into", "look into", "조사하다, 알아보다", "intermediate", "phrasal-verb", "look into + issue / complaint / option", "문제나 가능성을 조사하거나 검토할 때 씁니다.", "클레임 조사, 비용 절감 가능성 검토, 공급사 조사에 씁니다.", "investigate 와 같지만 더 구어적입니다.", ["operations", "communication"], ["the complaint", "the pricing options", "the delivery issue"],
      [
        { en: "I'll look into the missing shipment and get back to you by noon.", kr: "누락된 선적 건을 조사해 정오까지 다시 연락드리겠습니다." },
        { en: "Could you look into whether we can consolidate the two shipments?", kr: "두 선적 건을 합칠 수 있는지 알아봐 주시겠어요?" },
        { en: "We are looking into the root cause of the recurring defect.", kr: "반복되는 불량의 근본 원인을 조사하고 있습니다." },
      ]
    ],
    ["bear-with", "bear with", "잠깐 기다려주다", "intermediate", "phrasal-verb", "bear with me / us + while", "확인이나 처리가 필요할 때 정중하게 기다림을 요청할 때 씁니다.", "정보 확인, 시스템 조회, 담당자 연결 대기에 씁니다.", "please hold 보다 더 자연스럽고 정중한 영어 표현입니다.", ["communication", "email"], ["me a moment", "us while we check", "us a little longer"],
      [
        { en: "Bear with me while I pull up the shipment details.", kr: "선적 내역을 확인하는 동안 잠시 기다려주세요." },
        { en: "Please bear with us — we're currently experiencing a high volume of inquiries.", kr: "잠시 기다려주세요 — 현재 문의가 많이 접수되고 있습니다." },
        { en: "Bear with me one moment while I transfer you to the right team.", kr: "담당 팀으로 연결해드릴 테니 잠시만 기다려주세요." },
      ]
    ],
    ["carry-over", "carry over", "이월하다, 넘기다", "intermediate", "phrasal-verb", "carry over + balance / stock / budget", "잔량이나 금액을 다음 기간으로 넘길 때 씁니다.", "재고 이월, 예산 이월, 계약 조건 연장에 씁니다.", "roll over 와 비슷하지만 재무·재고 맥락에서 더 자주 씁니다.", ["finance", "operations"], ["unused budget", "remaining stock", "the balance"],
      [
        { en: "The unused budget will carry over to Q1 of next year.", kr: "미사용 예산은 내년 1분기로 이월됩니다." },
        { en: "Can we carry over the remaining 500 units to the next purchase order?", kr: "나머지 500개를 다음 발주서로 이월할 수 있나요?" },
        { en: "Any outstanding balance will be carried over to the next invoice.", kr: "잔여 미결 금액은 다음 인보이스로 이월됩니다." },
      ]
    ],
    ["follow-through", "follow through", "끝까지 실행하다, 후속 조치하다", "intermediate", "phrasal-verb", "follow through on + commitment / plan / promise", "약속이나 계획을 중간에 포기하지 않고 완수할 때 씁니다.", "납기 이행, 약속 이행, 계획 완수 상황에 씁니다.", "follow up 은 확인, follow through 는 완수에 초점이 있습니다.", ["management", "communication"], ["the commitment", "the action plan", "the delivery promise"],
      [
        { en: "We expect the supplier to follow through on every commitment made in the meeting.", kr: "회의에서 한 모든 약속을 공급사가 끝까지 이행해주길 바랍니다." },
        { en: "It's important to follow through on quality improvements, not just promise them.", kr: "품질 개선은 약속에서 그치지 않고 끝까지 실행하는 것이 중요합니다." },
        { en: "The team followed through on every action item from last week's meeting.", kr: "팀이 지난주 회의의 모든 액션 아이템을 끝까지 실행했습니다." },
      ]
    ],
    ["iron-out", "iron out", "해결하다, 조율하다", "intermediate", "phrasal-verb", "iron out + issues / differences / details", "사소한 문제나 의견 차이를 정리해 마무리할 때 씁니다.", "계약 최종 조율, 이견 해소, 세부 사항 정리에 씁니다.", "resolve 보다 더 마무리하는 과정의 뉘앙스가 강합니다.", ["negotiation", "communication"], ["the remaining issues", "the pricing differences", "the contract details"],
      [
        { en: "Let's iron out the remaining contract details before the signing.", kr: "서명 전에 나머지 계약 세부 사항을 정리합시다." },
        { en: "We need to iron out the differences on the payment terms.", kr: "결제 조건의 이견을 조율해야 합니다." },
        { en: "There are a few logistical issues to iron out before the shipment.", kr: "선적 전에 정리해야 할 물류 문제가 몇 가지 있습니다." },
      ]
    ],
    ["factor-in", "factor in", "감안하다, 포함시키다", "intermediate", "phrasal-verb", "factor in + cost / risk / time", "계획이나 계산에 특정 요소를 포함시킬 때 씁니다.", "원가 산정, 납기 계획, 리스크 평가에 씁니다.", "take into account 와 같은 뜻이지만 더 간결합니다.", ["analysis", "planning"], ["the freight cost", "the inspection time", "exchange rate risk"],
      [
        { en: "Please factor in the freight cost when preparing the final quotation.", kr: "최종 견적 작성 시 운송비를 반드시 포함시켜주세요." },
        { en: "We need to factor in at least five extra days for customs clearance.", kr: "통관을 위해 최소 5일을 추가로 감안해야 합니다." },
        { en: "Have you factored in the exchange rate risk in your price projection?", kr: "가격 전망에 환율 리스크를 감안했나요?" },
      ]
    ],
    ["phase-out", "phase out", "단계적으로 폐지하다", "advanced", "phrasal-verb", "phase out + product / process / supplier", "특정 제품·공급사·프로세스를 점차적으로 없앨 때 씁니다.", "구형 제품 단종, 공급사 교체, 구 시스템 전환에 씁니다.", "discontinue 보다 더 점진적인 과정을 강조합니다.", ["strategy", "operations"], ["the old product line", "the legacy process", "the underperforming supplier"],
      [
        { en: "We plan to phase out the old LED model by the end of this year.", kr: "구형 LED 모델은 올해 말까지 단계적으로 단종할 계획입니다." },
        { en: "The company is phasing out manual inspection in favor of automated testing.", kr: "회사는 자동화 검사로의 전환을 위해 수동 검사를 단계적으로 폐지하고 있습니다." },
        { en: "We will phase out the current supplier over the next two quarters.", kr: "향후 2분기에 걸쳐 현재 공급사를 단계적으로 교체할 것입니다." },
      ]
    ],
    ["map-out", "map out", "계획을 세우다, 상세히 짜다", "intermediate", "phrasal-verb", "map out + plan / process / timeline", "단계적 계획이나 일정을 구체적으로 정리할 때 씁니다.", "프로젝트 일정 수립, 출시 계획 작성, 물류 경로 기획에 씁니다.", "plan 보다 더 시각적이고 체계적인 뉘앙스입니다.", ["planning", "management"], ["the project timeline", "the supply chain process", "the go-to-market plan"],
      [
        { en: "Let's map out the entire production schedule for the next six months.", kr: "향후 6개월 생산 일정 전체를 상세히 짜봅시다." },
        { en: "Can you map out the key milestones for the new product launch?", kr: "신제품 출시의 주요 마일스톤을 정리해주시겠어요?" },
        { en: "We need to map out the supply chain process before we start production.", kr: "생산 시작 전에 공급망 프로세스를 체계적으로 정리해야 합니다." },
      ]
    ],
    ["fall-through", "fall through", "무산되다, 성사되지 않다", "intermediate", "phrasal-verb", "deal / plan / order fell through", "합의나 계획이 마지막에 무산될 때 씁니다.", "계약 실패, 주문 취소, 협상 결렬 상황에 씁니다.", "fall apart 보다 더 계획·거래 맥락에 한정됩니다.", ["negotiation", "sales"], ["the deal", "the order", "the partnership"],
      [
        { en: "The deal fell through at the last minute due to pricing disagreements.", kr: "가격 이견으로 막판에 계약이 무산되었습니다." },
        { en: "If this supplier falls through, we'll need a backup option ready.", kr: "이 공급사가 무산될 경우 대안을 미리 준비해야 합니다." },
        { en: "The partnership fell through after the compliance audit revealed several gaps.", kr: "컴플라이언스 감사에서 여러 문제가 드러난 후 파트너십이 무산되었습니다." },
      ]
    ],
    ["stand-by", "stand by", "대기하다, 지지하다", "intermediate", "phrasal-verb", "stand by + decision / team / for update", "대기하거나 결정·입장을 유지할 때 씁니다.", "업데이트 대기 요청, 결정 고수, 팀 지원 표명에 씁니다.", "wait 보다 더 준비된 상태에서의 대기를 뜻합니다.", ["communication", "management"], ["for an update", "by the original decision", "the team"],
      [
        { en: "Please stand by — I'm confirming the shipment status with the freight forwarder.", kr: "잠시 대기해주세요 — 포워더에게 선적 현황을 확인 중입니다." },
        { en: "We stand by our original delivery commitment of June 15.", kr: "당사는 6월 15일 원래 납기 약속을 고수합니다." },
        { en: "Stand by for a full update once the factory inspection is complete.", kr: "공장 검사가 완료되는 즉시 전체 현황을 알려드리겠습니다." },
      ]
    ],
    ["weigh-up", "weigh up", "따져보다, 비교검토하다", "intermediate", "phrasal-verb", "weigh up + options / risks / pros and cons", "여러 선택지를 비교해 장단점을 평가할 때 씁니다.", "공급사 선정, 투자 결정, 전략 선택에 씁니다.", "consider 보다 더 비교·균형의 과정이 강조됩니다.", ["analysis", "decision"], ["the options", "the risks and benefits", "the cost vs. quality tradeoff"],
      [
        { en: "Let's weigh up the options before we commit to a single supplier.", kr: "단일 공급사를 결정하기 전에 선택지를 꼼꼼히 따져봅시다." },
        { en: "We need to weigh up the cost savings against the quality risk.", kr: "비용 절감 효과와 품질 리스크를 함께 따져봐야 합니다." },
        { en: "Have you weighed up all the options, including local sourcing?", kr: "현지 소싱을 포함한 모든 선택지를 검토해보셨나요?" },
      ]
    ],

    // ── Batch 7: 비즈니스 회화 필수 패턴 ──────────────────────────────────────
    ["whats-the-status", "What's the status on", "~은 현재 어떻게 되고 있나요?", "intermediate", "pattern", "What's the status on + project / order / approval?", "진행 상황을 간결하게 물어볼 때 씁니다.", "선적 진행 확인, 승인 현황 문의, 프로젝트 진도 확인에 씁니다.", "How is X going? 보다 더 업무적이고 직접적입니다.", ["communication", "meeting"], ["the shipment", "the sample approval", "the contract review"],
      [
        { en: "What's the status on the shipment? The client is asking for an ETA.", kr: "선적은 현재 어떻게 되고 있나요? 고객이 예상 도착일을 묻고 있습니다." },
        { en: "What's the status on the sample approval? We've been waiting for two weeks.", kr: "샘플 승인은 어떻게 됐나요? 2주째 기다리고 있습니다." },
        { en: "Quick update — what's the status on the contract review?", kr: "간단히 확인드립니다 — 계약 검토는 어떻게 진행되고 있나요?" },
      ]
    ],
    ["circle-back-on", "circle back on", "다시 논의하다, 재확인하다", "intermediate", "pattern", "circle back on + topic / question / issue", "잠시 보류했던 주제로 다시 돌아올 때 씁니다.", "미뤄뒀던 안건 재논의, 답변 재확인, 팔로업에 씁니다.", "get back to 와 비슷하지만 더 자연스러운 비즈니스 구어체입니다.", ["communication", "meeting"], ["the pricing", "the pending question", "the delivery schedule"],
      [
        { en: "I wanted to circle back on the pricing discussion from last week.", kr: "지난주 가격 논의 건을 다시 확인하고 싶었습니다." },
        { en: "Can we circle back on this after we receive the updated spec sheet?", kr: "업데이트된 사양서를 받은 후 이 건을 다시 논의할 수 있을까요?" },
        { en: "Let's circle back on the payment terms once the sample is approved.", kr: "샘플이 승인된 후 결제 조건을 다시 논의합시다." },
      ]
    ],
    ["just-to-confirm", "just to confirm", "확인 차 말씀드리면", "intermediate", "pattern", "just to confirm + what was agreed / the details", "기존 합의나 이해를 명확히 재확인할 때 씁니다.", "이메일 요약, 통화 후 확인, 오해 방지에 씁니다.", "just to make sure 와 같은 뜻입니다.", ["email", "communication"], ["the order quantity", "the delivery date", "our agreement"],
      [
        { en: "Just to confirm — the order quantity is 2,000 units at $8.50 each, correct?", kr: "확인 차 말씀드리면 — 주문 수량은 2,000개에 개당 $8.50이 맞나요?" },
        { en: "Just to confirm, you'd like us to ship via sea freight on FOB terms.", kr: "확인 차 말씀드리면, FOB 조건으로 해상 운송을 원하시는 것 맞죠?" },
        { en: "Just to confirm our next steps: we'll send the revised quote by Thursday.", kr: "다음 단계를 확인하면: 수정 견적서를 목요일까지 보내드리겠습니다." },
      ]
    ],
    ["moving-forward", "moving forward", "앞으로는, 향후에는", "intermediate", "pattern", "moving forward, + plan or change", "현재 문제를 인정하고 앞으로의 방향을 제시할 때 씁니다.", "문제 해결 후 재발 방지, 새 프로세스 도입, 방향 전환에 씁니다.", "from now on 과 같지만 더 비즈니스 어조에 자연스럽습니다.", ["communication", "management"], ["all orders must be confirmed in writing", "we will use dual suppliers", "reports are due every Monday"],
      [
        { en: "Moving forward, all order changes must be confirmed in writing.", kr: "앞으로는 모든 주문 변경 사항을 서면으로 확인해야 합니다." },
        { en: "Moving forward, we will source from two suppliers to reduce risk.", kr: "향후에는 리스크 감소를 위해 두 공급사에서 소싱할 것입니다." },
        { en: "Moving forward, please include me in all client-facing communications.", kr: "앞으로는 모든 고객 대면 커뮤니케이션에 저를 포함시켜주세요." },
      ]
    ],
    ["i-wanted-to-touch-base", "I wanted to touch base", "간단히 연락드리고 싶었습니다", "intermediate", "pattern", "I wanted to touch base + regarding / on", "가볍고 친근하게 현황을 확인하거나 연락을 취할 때 씁니다.", "진행 상황 점검, 관계 유지, 후속 확인에 씁니다.", "check in 과 비슷하지만 더 자연스러운 비즈니스 표현입니다.", ["communication", "email"], ["the pending quote", "the upcoming delivery", "our partnership"],
      [
        { en: "I wanted to touch base regarding the sample we sent last week.", kr: "지난주 보내드린 샘플 관련해서 간단히 연락드리고 싶었습니다." },
        { en: "Just touching base — have you had a chance to review the proposal?", kr: "간단히 확인드립니다 — 제안서 검토하셨나요?" },
        { en: "I wanted to touch base before the end of the month to discuss the next order.", kr: "이달 말 전에 다음 주문 논의를 위해 연락드리고 싶었습니다." },
      ]
    ],
    ["ill-keep-you-posted", "I'll keep you posted", "계속 업데이트해 드리겠습니다", "intermediate", "pattern", "I'll keep you posted + on the progress", "진행 상황을 계속 알려주겠다고 약속할 때 씁니다.", "조사 중인 클레임, 확인 중인 재고, 협상 진행 상황 공유에 씁니다.", "I'll update you 보다 더 구어적이고 자연스럽습니다.", ["communication", "email"], ["the investigation", "the shipment status", "the negotiation progress"],
      [
        { en: "I'll keep you posted on the shipment status as it develops.", kr: "선적 현황이 업데이트되는 대로 계속 알려드리겠습니다." },
        { en: "I'm still waiting for the factory's response — I'll keep you posted.", kr: "공장 답변을 기다리는 중입니다 — 업데이트되는 대로 바로 알려드리겠습니다." },
        { en: "The inspection is ongoing; I'll keep you posted with daily updates.", kr: "검사가 진행 중입니다. 매일 현황을 공유해 드리겠습니다." },
      ]
    ],
    ["can-we-jump-on-a-call", "Can we jump on a call?", "통화 가능하신가요?", "intermediate", "pattern", "Can we jump on a call + to discuss / this week?", "빠른 전화 통화를 제안할 때 씁니다.", "복잡한 사안, 긴급 이슈, 이메일로 해결하기 어려운 상황에 씁니다.", "이메일보다 통화가 더 효율적일 때 쓰는 구어적 표현입니다.", ["communication", "meeting"], ["this issue", "the delivery update", "the contract terms"],
      [
        { en: "Can we jump on a call this afternoon to discuss the delivery issue?", kr: "납품 문제를 논의하기 위해 오늘 오후에 통화 가능하신가요?" },
        { en: "Rather than going back and forth over email, can we jump on a quick call?", kr: "이메일로 계속 주고받는 것보다 간단히 통화하는 게 어떨까요?" },
        { en: "Can we jump on a call tomorrow morning to go over the contract terms?", kr: "계약 조건을 검토하기 위해 내일 오전에 통화 가능하신가요?" },
      ]
    ],
    ["i-appreciate-your-patience", "I appreciate your patience", "기다려 주셔서 감사합니다", "intermediate", "pattern", "I appreciate your patience + while / on this matter", "지연이나 불편에 대해 정중히 감사를 표할 때 씁니다.", "처리 지연, 답변 늦어짐, 장기 대기 상황에서 씁니다.", "thank you for waiting 보다 더 격식 있고 진심이 담긴 표현입니다.", ["email", "communication"], ["on this matter", "while we resolve the issue", "during the investigation"],
      [
        { en: "I appreciate your patience while we look into the quality issue.", kr: "품질 문제를 조사하는 동안 기다려 주셔서 감사합니다." },
        { en: "Thank you for your continued patience — we are finalizing the quotation now.", kr: "계속 기다려 주셔서 감사합니다 — 지금 견적서를 마무리하고 있습니다." },
        { en: "I appreciate your patience on this matter; we will respond by end of day.", kr: "이 건에 대해 기다려 주셔서 감사합니다. 오늘 중으로 답변드리겠습니다." },
      ]
    ],
    ["i-need-to-push-back-on", "I need to push back on", "~에 대해 이의를 제기해야 합니다", "advanced", "pattern", "I need to push back on + that / the timeline / the price", "상대방의 제안에 정중하지만 단호하게 이의를 제기할 때 씁니다.", "가격 협상, 무리한 납기 요청, 불합리한 조건 거절에 씁니다.", "I disagree 보다 더 전문적이고 건설적인 어조입니다.", ["negotiation", "communication"], ["the proposed timeline", "the pricing", "the responsibility clause"],
      [
        { en: "I need to push back on the 15-day lead time — it simply isn't achievable.", kr: "15일 납기에 대해 이의를 제기해야 합니다 — 실현이 불가능합니다." },
        { en: "I need to push back on the pricing — a 5% reduction is the maximum we can offer.", kr: "가격에 대해 이의가 있습니다 — 5% 인하가 당사가 제시할 수 있는 최대치입니다." },
        { en: "I have to push back on who bears responsibility for the customs delay.", kr: "통관 지연의 책임 주체에 대해 이의를 제기해야 합니다." },
      ]
    ],
    ["on-our-radar", "on our radar", "우리가 주목하고 있는", "intermediate", "pattern", "on our radar + for this quarter / as a priority", "인지하고 있거나 주시 중인 사안을 말할 때 씁니다.", "신규 시장 검토, 공급사 모니터링, 잠재 리스크 추적에 씁니다.", "being watched 보다 더 긍정적이고 전략적인 뉘앙스입니다.", ["strategy", "communication"], ["the new regulation", "the potential supplier", "the market opportunity"],
      [
        { en: "This supplier has been on our radar for potential dual-sourcing.", kr: "이 공급사는 이중 소싱 가능성으로 우리가 주목해온 곳입니다." },
        { en: "The new import regulation is on our radar — we're monitoring closely.", kr: "새 수입 규정이 주목 대상입니다 — 면밀히 모니터링하고 있습니다." },
        { en: "Your company has been on our radar as a potential long-term partner.", kr: "귀사는 잠재적인 장기 파트너로 우리가 주목해온 곳입니다." },
      ]
    ],
    ["please-find-attached", "Please find attached", "첨부 파일을 확인해주세요", "intermediate", "pattern", "Please find attached + the document / invoice / report", "이메일에서 첨부 파일을 안내할 때 씁니다.", "견적서, 인보이스, 계약서, 보고서 전송 이메일에 씁니다.", "영미권 이메일에서 가장 많이 쓰이는 표현 중 하나입니다.", ["email", "documents"], ["the quotation", "the signed contract", "the revised proposal"],
      [
        { en: "Please find attached our updated quotation for 5,000 units.", kr: "5,000개 주문에 대한 업데이트된 견적서를 첨부합니다." },
        { en: "Please find attached the signed contract for your records.", kr: "귀사 기록을 위해 서명된 계약서를 첨부합니다." },
        { en: "Please find attached the quality inspection report from last week's audit.", kr: "지난주 감사의 품질 검사 보고서를 첨부합니다." },
      ]
    ],
    ["as-discussed", "as discussed", "논의한 대로", "intermediate", "pattern", "as discussed + in our meeting / on the call", "이전 대화나 회의에서 합의한 내용을 재확인할 때 씁니다.", "회의 후속 이메일, 계약 조건 재확인, 합의 사항 이행에 씁니다.", "as agreed 와 비슷하지만 더 구어체적입니다.", ["email", "communication"], ["the revised quotation", "the delivery terms", "the next steps"],
      [
        { en: "As discussed in our call yesterday, we will proceed with a trial order of 500 units.", kr: "어제 통화에서 논의한 대로, 500개 시험 주문을 진행하겠습니다." },
        { en: "As discussed, the payment terms will be 30% deposit and 70% against B/L copy.", kr: "논의한 대로, 결제 조건은 계약금 30%에 선하증권 사본 수령 시 잔금 70%로 합니다." },
        { en: "Please find attached the revised quotation as discussed in our meeting on Monday.", kr: "월요일 회의에서 논의한 대로 수정된 견적서를 첨부합니다." },
      ]
    ],
    ["i-look-forward-to", "I look forward to", "기대하겠습니다", "intermediate", "pattern", "I look forward to + hearing from you / working with you", "이메일 마무리나 협력에 대한 기대를 표현할 때 씁니다.", "이메일 마무리, 파트너십 시작, 회의 예고에 씁니다.", "I'm looking forward to 도 같은 뜻이며 둘 다 자연스럽습니다.", ["email", "formal"], ["hearing from you", "your confirmation", "working together"],
      [
        { en: "I look forward to hearing from you and hope we can move forward quickly.", kr: "답변을 기다리겠습니다. 빠르게 진행되길 바랍니다." },
        { en: "I look forward to a successful partnership and a long-term business relationship.", kr: "성공적인 파트너십과 장기적인 비즈니스 관계를 기대합니다." },
        { en: "I look forward to your confirmation so we can finalize the shipping schedule.", kr: "선적 일정을 확정할 수 있도록 귀사의 확인을 기다리겠습니다." },
      ]
    ],
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
      exampleTemplates: item[11] ?? (() => {
        const cols = item[10] as string[];
        const art = (w: string) => /^(the |a |an )/.test(w) ? w : `the ${w}`;
        const obj0 = art(cols[0] ?? "issue");
        const obj1 = art(cols[1] ?? cols[0] ?? "request");
        const obj2 = art(cols[2] ?? cols[0] ?? "task");
        return [
          { en: `Could you ${item[1]} ${obj0}? We need an update before end of day.`, kr: `${obj0} 관련 ${item[2]}주시겠어요? 오늘 중으로 업데이트가 필요합니다.` },
          { en: `I'll ${item[1]} ${obj1} and get back to you by tomorrow morning.`, kr: `${obj1}를 ${item[2]}하고 내일 오전까지 다시 연락드리겠습니다.` },
          { en: `Please make sure to ${item[1]} ${obj2} before the deadline.`, kr: `마감 전에 ${obj2}를 꼭 ${item[2]}해 주세요.` },
        ];
      })(),
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
    scenarioLabel: base.usageNote,
    focusObject: base.collocations[variantIndex % base.collocations.length] ?? object,
    variantLabel: `${scenario.productTag.toUpperCase()} ${variantIndex + 1}`,
    level: base.level,
    kind: base.kind,
    grammarPattern: base.grammarPattern,
    grammarFocus: base.grammarFocus,
    usageNote: base.usageNote,
    commonMistake: base.commonMistake,
    categories: [...new Set([...base.categories, ...scenario.categories])],
    collocations: base.collocations,
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
