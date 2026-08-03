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
      exampleTemplates: item[11] ?? [
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
