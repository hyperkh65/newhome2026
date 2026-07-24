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

function entry(config: EnglishEntry): EnglishEntry {
  return config;
}

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

export const ENGLISH_ENTRIES: EnglishEntry[] = [
  entry({
    id: "follow-up-on",
    expression: "follow up on",
    korean: "후속 조치하다, 다시 확인하다",
    level: "intermediate",
    kind: "phrasal-verb",
    grammarPattern: "follow up on + noun / issue",
    grammarFocus: "타동사형 구동사로 전치사 on 뒤에 대상이 옵니다.",
    usageNote: "이메일, 견적, 클레임, 일정 확인처럼 다시 챙길 일이 있을 때 가장 자주 쓰입니다.",
    commonMistake: "follow up the issue 라고 쓰지 말고 follow up on the issue 로 씁니다.",
    categories: ["email", "sales", "operations"],
    collocations: ["quotation", "shipment", "approval"],
    objectPool: ["the revised quotation", "the delayed shipment", "the approval request"],
    answerTemplate: "{subject} {modal} follow up on {object} {time}.",
    examples: [
      { en: "I'll follow up on the revised quotation this afternoon.", kr: "오늘 오후에 수정 견적을 다시 확인하겠습니다." },
      { en: "Please follow up on the supplier's test report before Friday.", kr: "금요일 전에 공급사의 시험성적서를 다시 챙겨 주세요." },
    ],
  }),
  entry({
    id: "touch-base-with",
    expression: "touch base with",
    korean: "간단히 연락하다, 짧게 상의하다",
    level: "intermediate",
    kind: "phrasal-verb",
    grammarPattern: "touch base with + person / team",
    grammarFocus: "사람이나 팀과 짧게 연결할 때 씁니다.",
    usageNote: "회의를 길게 잡지 않고 가볍게 체크인하는 느낌입니다.",
    commonMistake: "touch base to someone 보다 touch base with someone 이 자연스럽습니다.",
    categories: ["meeting", "communication"],
    collocations: ["the client", "the logistics team", "the supplier"],
    objectPool: ["the client", "the logistics team", "the supplier"],
    answerTemplate: "{subject} {modal} touch base with {object} {time}.",
    examples: [
      { en: "Let's touch base with the logistics team after lunch.", kr: "점심 후에 물류팀과 짧게 상의합시다." },
      { en: "I touched base with the client before sending the draft.", kr: "초안을 보내기 전에 고객과 간단히 확인했습니다." },
    ],
  }),
  entry({
    id: "circle-back-on",
    expression: "circle back on",
    korean: "다시 돌아와 논의하다",
    level: "advanced",
    kind: "phrasal-verb",
    grammarPattern: "circle back on + topic / point",
    grammarFocus: "회의에서 일단 보류하고 나중에 다시 다룰 때 자주 씁니다.",
    usageNote: "즉시 답하지 못하는 사안에 대해 후속 답변을 약속할 때 적합합니다.",
    commonMistake: "circle back to this point 도 가능하지만 business meeting 에서는 on this point 도 많이 씁니다.",
    categories: ["meeting", "negotiation"],
    collocations: ["the pricing issue", "that point", "the contract clause"],
    objectPool: ["the pricing issue", "that point", "the contract clause"],
    answerTemplate: "{subject} {modal} circle back on {object} {time}.",
    examples: [
      { en: "We can circle back on the pricing issue once finance reviews it.", kr: "재무팀 검토 후 가격 이슈로 다시 돌아오겠습니다." },
      { en: "I'll circle back on that point in tomorrow's call.", kr: "그 부분은 내일 통화에서 다시 다루겠습니다." },
    ],
  }),
  entry({
    id: "roll-out",
    expression: "roll out",
    korean: "출시하다, 도입하다",
    level: "intermediate",
    kind: "phrasal-verb",
    grammarPattern: "roll out + product / policy / program",
    grammarFocus: "새 제품, 정책, 캠페인을 단계적으로 시장에 내놓을 때 씁니다.",
    usageNote: "launch 보다 운영 도입 과정까지 포함하는 뉘앙스가 있습니다.",
    commonMistake: "roll out to market 라기보다 roll out the product 가 기본형입니다.",
    categories: ["product", "launch", "operations"],
    collocations: ["the new dashboard", "the training program", "the updated label"],
    objectPool: ["the new dashboard", "the training program", "the updated label"],
    answerTemplate: "{subject} {modal} roll out {object} {time}.",
    examples: [
      { en: "The team will roll out the updated label next month.", kr: "팀은 다음 달에 업데이트된 라벨을 도입할 예정입니다." },
      { en: "We rolled out the new dashboard in phases.", kr: "새 대시보드를 단계적으로 도입했습니다." },
    ],
  }),
  entry({
    id: "scale-up",
    expression: "scale up",
    korean: "확대하다, 증산하다",
    level: "intermediate",
    kind: "phrasal-verb",
    grammarPattern: "scale up + production / operations",
    grammarFocus: "생산량, 인원, 운영 규모를 키울 때 사용합니다.",
    usageNote: "성장과 운영확장을 동시에 다루는 비즈니스 표현입니다.",
    commonMistake: "scale the production up 도 가능하지만 문서에서는 scale up production 이 더 간결합니다.",
    categories: ["manufacturing", "operations"],
    collocations: ["production", "capacity", "output"],
    objectPool: ["production", "capacity", "output"],
    answerTemplate: "{subject} {modal} scale up {object} {time}.",
    examples: [
      { en: "The factory needs to scale up output before peak season.", kr: "성수기 전에 공장은 생산량을 확대해야 합니다." },
      { en: "We can scale up production once the sample is approved.", kr: "샘플 승인 후 양산을 확대할 수 있습니다." },
    ],
  }),
  entry({
    id: "wind-down",
    expression: "wind down",
    korean: "축소하다, 마무리하다",
    level: "advanced",
    kind: "phrasal-verb",
    grammarPattern: "wind down + project / operation",
    grammarFocus: "활동을 갑자기 끝내기보다 점진적으로 줄이는 느낌입니다.",
    usageNote: "사업 종료, 캠페인 종료, 분기 말 정리에 자주 쓰입니다.",
    commonMistake: "close down 과 달리 갑작스러운 폐쇄 의미가 아닙니다.",
    categories: ["operations", "management"],
    collocations: ["the pilot project", "the quarter-end campaign", "the old process"],
    objectPool: ["the pilot project", "the quarter-end campaign", "the old process"],
    answerTemplate: "{subject} {modal} wind down {object} {time}.",
    examples: [
      { en: "We should wind down the old process after the handover.", kr: "인수인계 후 기존 프로세스를 정리해야 합니다." },
      { en: "The team is winding down the pilot project this week.", kr: "팀이 이번 주에 파일럿 프로젝트를 마무리하고 있습니다." },
    ],
  }),
  entry({
    id: "iron-out",
    expression: "iron out",
    korean: "문제를 해결하다, 세부를 조정하다",
    level: "advanced",
    kind: "phrasal-verb",
    grammarPattern: "iron out + problem / detail",
    grammarFocus: "문제의 큰 틀보다 잔문제나 세부사항 정리에 적합합니다.",
    usageNote: "계약 문구, 테스트 오류, 운영 흐름의 작은 마찰을 다룰 때 좋습니다.",
    commonMistake: "iron the issues out 도 가능하지만 대부분 iron out the issues 로 씁니다.",
    categories: ["negotiation", "operations", "quality"],
    collocations: ["the final details", "the shipping issue", "the test failure"],
    objectPool: ["the final details", "the shipping issue", "the test failure"],
    answerTemplate: "{subject} {modal} iron out {object} {time}.",
    examples: [
      { en: "Let's iron out the final details before we sign.", kr: "서명 전에 마지막 세부사항을 정리합시다." },
      { en: "Engineering is ironing out the test failure now.", kr: "엔지니어링 팀이 지금 시험 오류를 해결 중입니다." },
    ],
  }),
  entry({
    id: "sign-off-on",
    expression: "sign off on",
    korean: "최종 승인하다",
    level: "intermediate",
    kind: "phrasal-verb",
    grammarPattern: "sign off on + document / plan / design",
    grammarFocus: "최종 승인 주체가 명확할 때 쓰는 표현입니다.",
    usageNote: "도면, 견적, 계약서, 마케팅 카피 승인에 폭넓게 씁니다.",
    commonMistake: "sign off the document 가 아니라 sign off on the document 가 기본입니다.",
    categories: ["approval", "documents"],
    collocations: ["the final drawing", "the quotation", "the shipment plan"],
    objectPool: ["the final drawing", "the quotation", "the shipment plan"],
    answerTemplate: "{subject} {modal} sign off on {object} {time}.",
    examples: [
      { en: "Finance has not signed off on the quotation yet.", kr: "재무팀이 아직 견적을 최종 승인하지 않았습니다." },
      { en: "The director signed off on the final drawing yesterday.", kr: "이사가 어제 최종 도면을 승인했습니다." },
    ],
  }),
  entry({
    id: "zero-in-on",
    expression: "zero in on",
    korean: "핵심에 집중하다",
    level: "advanced",
    kind: "phrasal-verb",
    grammarPattern: "zero in on + key issue / target",
    grammarFocus: "여러 옵션 중 핵심 대상에 집중할 때 쓰는 표현입니다.",
    usageNote: "문제 분석, 매출 타깃, 결함 원인 파악에 유용합니다.",
    commonMistake: "focus in on 보다 zero in on 이 더 날카로운 뉘앙스를 줍니다.",
    categories: ["analysis", "strategy"],
    collocations: ["the root cause", "the main target", "the price gap"],
    objectPool: ["the root cause", "the main target", "the price gap"],
    answerTemplate: "{subject} {modal} zero in on {object} {time}.",
    examples: [
      { en: "The QA team zeroed in on the root cause within a day.", kr: "QA팀이 하루 만에 근본 원인을 짚어냈습니다." },
      { en: "We need to zero in on the biggest cost driver.", kr: "가장 큰 원가 요인에 집중해야 합니다." },
    ],
  }),
  entry({
    id: "phase-out",
    expression: "phase out",
    korean: "점진적으로 중단하다",
    level: "advanced",
    kind: "phrasal-verb",
    grammarPattern: "phase out + product / process",
    grammarFocus: "갑자기 끊는 것이 아니라 단계적으로 없앨 때 씁니다.",
    usageNote: "단종, 구형 자재 중단, 오래된 프로세스 종료에 적합합니다.",
    commonMistake: "stop completely 보다 완만한 표현입니다.",
    categories: ["product", "operations"],
    collocations: ["the old model", "manual entry", "the legacy system"],
    objectPool: ["the old model", "manual entry", "the legacy system"],
    answerTemplate: "{subject} {modal} phase out {object} {time}.",
    examples: [
      { en: "We will phase out the old model by the end of the year.", kr: "올해 말까지 기존 모델을 단계적으로 중단할 예정입니다." },
      { en: "The team is phasing out manual entry.", kr: "팀이 수기 입력을 단계적으로 없애고 있습니다." },
    ],
  }),
  entry({
    id: "phase-in",
    expression: "phase in",
    korean: "단계적으로 도입하다",
    level: "advanced",
    kind: "phrasal-verb",
    grammarPattern: "phase in + policy / system / feature",
    grammarFocus: "새 기능이나 정책을 한번에가 아니라 순차적으로 넣을 때 씁니다.",
    usageNote: "사용자 적응이나 리스크 관리가 필요한 도입에 적합합니다.",
    commonMistake: "roll out 과 비슷하지만 단계성에 더 초점이 있습니다.",
    categories: ["product", "operations"],
    collocations: ["the new policy", "the ERP update", "the supplier portal"],
    objectPool: ["the new policy", "the ERP update", "the supplier portal"],
    answerTemplate: "{subject} {modal} phase in {object} {time}.",
    examples: [
      { en: "We will phase in the ERP update over three weeks.", kr: "ERP 업데이트를 3주에 걸쳐 단계적으로 도입할 예정입니다." },
      { en: "The portal was phased in by region.", kr: "포털은 지역별로 순차 도입되었습니다." },
    ],
  }),
  entry({
    id: "step-in",
    expression: "step in",
    korean: "개입하다, 대신 처리하다",
    level: "intermediate",
    kind: "phrasal-verb",
    grammarPattern: "step in + when / if clause",
    grammarFocus: "문제가 생기거나 누군가를 대신해야 할 때 자동사로 씁니다.",
    usageNote: "관리자나 지원 부서가 개입하는 상황에서 자연스럽습니다.",
    commonMistake: "step in to solve the issue 도 되지만 뒤에 when절이 자주 옵니다.",
    categories: ["management", "support"],
    collocations: ["when needed", "if the supplier delays", "during escalation"],
    objectPool: ["when needed", "if the supplier delays", "during escalation"],
    answerTemplate: "{subject} {modal} step in {time}.",
    examples: [
      { en: "The manager stepped in when the supplier stopped replying.", kr: "공급사가 답장을 멈추자 관리자가 개입했습니다." },
      { en: "We can step in if the issue escalates.", kr: "문제가 커지면 우리가 개입할 수 있습니다." },
    ],
  }),
  entry({
    id: "back-out-of",
    expression: "back out of",
    korean: "빠지다, 철회하다",
    level: "advanced",
    kind: "phrasal-verb",
    grammarPattern: "back out of + agreement / plan",
    grammarFocus: "이미 어느 정도 합의된 일에서 물러날 때 쓰는 표현입니다.",
    usageNote: "공급사나 고객이 조건을 바꾸며 빠지는 상황을 설명할 때 자주 씁니다.",
    commonMistake: "cancel 과 달리 약속을 깨는 뉘앙스가 강합니다.",
    categories: ["negotiation", "risk"],
    collocations: ["the deal", "the shipment plan", "the meeting"],
    objectPool: ["the deal", "the shipment plan", "the meeting"],
    answerTemplate: "{subject} {modal} back out of {object} {time}.",
    examples: [
      { en: "The buyer backed out of the deal at the last minute.", kr: "구매자가 마지막 순간에 거래에서 빠졌습니다." },
      { en: "We hope the supplier will not back out of the shipment plan.", kr: "공급사가 선적 계획에서 빠지지 않기를 바랍니다." },
    ],
  }),
  entry({
    id: "carry-over",
    expression: "carry over",
    korean: "이월되다, 이어지다",
    level: "intermediate",
    kind: "phrasal-verb",
    grammarPattern: "carry over + balance / issue / stock",
    grammarFocus: "다음 기간으로 넘어가는 수량이나 이슈에 씁니다.",
    usageNote: "재고, 예산, 미해결 이슈 관리에서 자주 보입니다.",
    commonMistake: "carry on 과 혼동하지 마세요. carry over 는 다음 시점으로 넘기는 뜻입니다.",
    categories: ["finance", "inventory", "planning"],
    collocations: ["the balance", "the open issue", "the remaining stock"],
    objectPool: ["the balance", "the open issue", "the remaining stock"],
    answerTemplate: "{subject} {modal} carry over {object} {time}.",
    examples: [
      { en: "We will carry over the remaining stock into next month.", kr: "남은 재고는 다음 달로 이월할 예정입니다." },
      { en: "The issue carried over into the next review cycle.", kr: "그 이슈는 다음 검토 주기로 넘어갔습니다." },
    ],
  }),
  entry({
    id: "narrow-down",
    expression: "narrow down",
    korean: "범위를 좁히다",
    level: "intermediate",
    kind: "phrasal-verb",
    grammarPattern: "narrow down + options / list",
    grammarFocus: "후보군을 줄일 때 쓰는 대표 표현입니다.",
    usageNote: "공급사 선정, 사양 선택, 가격안 검토에서 유용합니다.",
    commonMistake: "reduce options 보다 의사결정 맥락에서 더 자연스럽습니다.",
    categories: ["selection", "analysis"],
    collocations: ["the supplier list", "our options", "the final candidates"],
    objectPool: ["the supplier list", "our options", "the final candidates"],
    answerTemplate: "{subject} {modal} narrow down {object} {time}.",
    examples: [
      { en: "We narrowed down the supplier list to three vendors.", kr: "공급사 목록을 세 곳으로 좁혔습니다." },
      { en: "Let's narrow down our options before the call.", kr: "통화 전에 옵션 범위를 좁힙시다." },
    ],
  }),
  entry({
    id: "map-out",
    expression: "map out",
    korean: "계획을 구체화하다",
    level: "advanced",
    kind: "phrasal-verb",
    grammarPattern: "map out + plan / process / timeline",
    grammarFocus: "머릿속 아이디어를 단계별 계획으로 펼칠 때 씁니다.",
    usageNote: "프로젝트 로드맵, 승인 프로세스, 출시 일정에 잘 맞습니다.",
    commonMistake: "plan out 도 가능하지만 map out 은 시각적 구조를 떠올리게 합니다.",
    categories: ["planning", "project"],
    collocations: ["the timeline", "the approval flow", "the launch plan"],
    objectPool: ["the timeline", "the approval flow", "the launch plan"],
    answerTemplate: "{subject} {modal} map out {object} {time}.",
    examples: [
      { en: "The PM mapped out the approval flow for the new portal.", kr: "PM이 새 포털의 승인 흐름을 구체화했습니다." },
      { en: "We need to map out the timeline before kickoff.", kr: "킥오프 전에 일정을 구체화해야 합니다." },
    ],
  }),
  entry({
    id: "set-up",
    expression: "set up",
    korean: "설정하다, 준비하다, 만들다",
    level: "intermediate",
    kind: "phrasal-verb",
    grammarPattern: "set up + meeting / account / system",
    grammarFocus: "준비, 설치, 설정 전반에 쓰이는 아주 범용적인 구동사입니다.",
    usageNote: "회의 잡기, 계정 생성, 시스템 설정에 모두 쓸 수 있습니다.",
    commonMistake: "setup 은 명사, set up 은 동사입니다.",
    categories: ["system", "meeting", "operations"],
    collocations: ["the meeting", "the test environment", "a new account"],
    objectPool: ["the meeting", "the test environment", "a new account"],
    answerTemplate: "{subject} {modal} set up {object} {time}.",
    examples: [
      { en: "IT will set up the test environment today.", kr: "IT가 오늘 테스트 환경을 설정할 예정입니다." },
      { en: "Can you set up a short call with the supplier?", kr: "공급사와 짧은 통화를 잡아 주시겠어요?" },
    ],
  }),
  entry({
    id: "sort-out",
    expression: "sort out",
    korean: "정리하다, 해결하다",
    level: "intermediate",
    kind: "phrasal-verb",
    grammarPattern: "sort out + problem / document / details",
    grammarFocus: "문제 해결과 정리 두 의미가 모두 있습니다.",
    usageNote: "서류 누락, 일정 꼬임, 결제 문제 해결에 자주 씁니다.",
    commonMistake: "solve 만 쓰면 딱딱할 때 sort out 이 더 구어적이고 자연스럽습니다.",
    categories: ["documents", "operations", "support"],
    collocations: ["the document issue", "the customs problem", "the final details"],
    objectPool: ["the document issue", "the customs problem", "the final details"],
    answerTemplate: "{subject} {modal} sort out {object} {time}.",
    examples: [
      { en: "We'll sort out the customs problem before shipment.", kr: "선적 전에 통관 문제를 해결하겠습니다." },
      { en: "She sorted out the missing documents this morning.", kr: "그녀가 오늘 아침 누락 서류를 정리했습니다." },
    ],
  }),
  entry({
    id: "bring-forward",
    expression: "bring forward",
    korean: "앞당기다",
    level: "advanced",
    kind: "phrasal-verb",
    grammarPattern: "bring forward + date / deadline / meeting",
    grammarFocus: "영국식 비즈니스 영어에서 날짜를 앞당길 때 자주 씁니다.",
    usageNote: "일정을 당길 때 move up 과 비슷하게 쓸 수 있습니다.",
    commonMistake: "bring back 과 반대 의미가 아닙니다. 일정이 더 이르게 옵니다.",
    categories: ["schedule", "planning"],
    collocations: ["the deadline", "the meeting", "the launch date"],
    objectPool: ["the deadline", "the meeting", "the launch date"],
    answerTemplate: "{subject} {modal} bring forward {object} {time}.",
    examples: [
      { en: "We may need to bring forward the launch date.", kr: "출시일을 앞당겨야 할 수도 있습니다." },
      { en: "The meeting was brought forward by one day.", kr: "회의가 하루 앞당겨졌습니다." },
    ],
  }),
  entry({
    id: "push-back",
    expression: "push back",
    korean: "연기하다, 이의를 제기하다",
    level: "intermediate",
    kind: "phrasal-verb",
    grammarPattern: "push back + deadline / shipment / against an idea",
    grammarFocus: "일정을 미루거나 의견에 반대할 때 모두 쓰입니다.",
    usageNote: "프로젝트와 협상에서 모두 중요한 표현입니다.",
    commonMistake: "delay 와 같은 뜻으로만 보지 말고 반론 제기 의미도 익혀야 합니다.",
    categories: ["schedule", "negotiation"],
    collocations: ["the deadline", "the shipment", "the proposal"],
    objectPool: ["the deadline", "the shipment", "the proposal"],
    answerTemplate: "{subject} {modal} push back {object} {time}.",
    examples: [
      { en: "We had to push back the shipment by two days.", kr: "선적을 이틀 미뤄야 했습니다." },
      { en: "The client pushed back on the revised scope.", kr: "고객이 수정된 범위에 이의를 제기했습니다." },
    ],
  }),
  entry({
    id: "hand-over",
    expression: "hand over",
    korean: "인계하다, 넘기다",
    level: "intermediate",
    kind: "phrasal-verb",
    grammarPattern: "hand over + responsibility / file / process",
    grammarFocus: "책임이나 자료를 다른 사람에게 넘길 때 씁니다.",
    usageNote: "프로젝트 전환, 담당자 변경, 공급사 인수인계에서 매우 중요합니다.",
    commonMistake: "handover 는 명사, hand over 는 동사입니다.",
    categories: ["project", "operations"],
    collocations: ["the account", "the file", "the process"],
    objectPool: ["the account", "the file", "the process"],
    answerTemplate: "{subject} {modal} hand over {object} {time}.",
    examples: [
      { en: "Please hand over the account file before you leave.", kr: "퇴근 전에 계정 파일을 인계해 주세요." },
      { en: "The team handed over the process to operations.", kr: "팀이 그 프로세스를 운영팀에 넘겼습니다." },
    ],
  }),
  entry({
    id: "build-on",
    expression: "build on",
    korean: "기반으로 발전시키다",
    level: "advanced",
    kind: "phrasal-verb",
    grammarPattern: "build on + result / feedback / idea",
    grammarFocus: "기존 성과나 의견을 토대로 다음 단계로 나아갈 때 씁니다.",
    usageNote: "협업, 제안서, 제품 개선 문맥에서 많이 보입니다.",
    commonMistake: "based on 과 달리 동작감이 더 강합니다.",
    categories: ["strategy", "product", "teamwork"],
    collocations: ["the feedback", "the first draft", "last quarter's results"],
    objectPool: ["the feedback", "the first draft", "last quarter's results"],
    answerTemplate: "{subject} {modal} build on {object} {time}.",
    examples: [
      { en: "Let's build on the feedback from the pilot group.", kr: "파일럿 그룹 피드백을 바탕으로 더 발전시켜 봅시다." },
      { en: "The next proposal should build on the first draft.", kr: "다음 제안서는 1차 초안을 기반으로 발전해야 합니다." },
    ],
  }),
  entry({
    id: "lock-in",
    expression: "lock in",
    korean: "확정하다, 고정하다",
    level: "advanced",
    kind: "phrasal-verb",
    grammarPattern: "lock in + price / schedule / supplier",
    grammarFocus: "변동 가능성이 있는 조건을 최종 확정하는 느낌입니다.",
    usageNote: "가격 고정, 일정 확정, 계약 조건 확정에서 자주 씁니다.",
    commonMistake: "fix 와 비슷하지만 협상에서 확정했다는 느낌이 더 강합니다.",
    categories: ["pricing", "schedule", "procurement"],
    collocations: ["the price", "the production slot", "the shipment window"],
    objectPool: ["the price", "the production slot", "the shipment window"],
    answerTemplate: "{subject} {modal} lock in {object} {time}.",
    examples: [
      { en: "We need to lock in the price before raw materials go up.", kr: "원자재가 오르기 전에 가격을 확정해야 합니다." },
      { en: "The team locked in the shipment window yesterday.", kr: "팀이 어제 선적 일정을 확정했습니다." },
    ],
  }),
  entry({
    id: "spell-out",
    expression: "spell out",
    korean: "명확히 설명하다",
    level: "advanced",
    kind: "phrasal-verb",
    grammarPattern: "spell out + requirement / expectation",
    grammarFocus: "모호함 없이 상세히 설명한다는 뜻입니다.",
    usageNote: "계약 조건, 품질 기준, 책임 범위를 명확히 할 때 좋습니다.",
    commonMistake: "say clearly 보다 더 공식적이고 문서적인 느낌입니다.",
    categories: ["documents", "negotiation"],
    collocations: ["the requirements", "the deadline", "our expectations"],
    objectPool: ["the requirements", "the deadline", "our expectations"],
    answerTemplate: "{subject} {modal} spell out {object} {time}.",
    examples: [
      { en: "The contract should spell out the warranty terms.", kr: "계약서에는 보증 조건이 명확히 적혀 있어야 합니다." },
      { en: "Please spell out our expectations in the email.", kr: "이메일에 우리의 기대사항을 분명히 적어 주세요." },
    ],
  }),
  entry({
    id: "rule-out",
    expression: "rule out",
    korean: "배제하다, 가능성을 없애다",
    level: "advanced",
    kind: "phrasal-verb",
    grammarPattern: "rule out + option / cause / possibility",
    grammarFocus: "가능성 검토 후 제외할 때 쓰는 분석형 표현입니다.",
    usageNote: "결함 분석, 공급사 평가, 의사결정 보고서에서 유용합니다.",
    commonMistake: "remove 와 달리 검토 후 배제했다는 판단이 들어갑니다.",
    categories: ["analysis", "quality", "selection"],
    collocations: ["that option", "the root cause", "a price increase"],
    objectPool: ["that option", "the root cause", "a price increase"],
    answerTemplate: "{subject} {modal} rule out {object} {time}.",
    examples: [
      { en: "We can rule out that option because of the lead time.", kr: "리드타임 때문에 그 옵션은 제외할 수 있습니다." },
      { en: "QA ruled out the root cause after retesting.", kr: "QA가 재시험 후 그 원인을 배제했습니다." },
    ],
  }),
  entry({
    id: "work-through",
    expression: "work through",
    korean: "하나씩 해결해 나가다",
    level: "advanced",
    kind: "phrasal-verb",
    grammarPattern: "work through + issue / list / backlog",
    grammarFocus: "시간을 들여 차근차근 처리한다는 의미입니다.",
    usageNote: "백로그, 문제 목록, 수정 요청 처리에서 자주 씁니다.",
    commonMistake: "work on 보다 완료를 향한 진행감이 더 큽니다.",
    categories: ["operations", "quality", "project"],
    collocations: ["the backlog", "the issue list", "the revision comments"],
    objectPool: ["the backlog", "the issue list", "the revision comments"],
    answerTemplate: "{subject} {modal} work through {object} {time}.",
    examples: [
      { en: "The team is working through the revision comments now.", kr: "팀이 지금 수정 코멘트를 하나씩 처리하고 있습니다." },
      { en: "We will work through the backlog this week.", kr: "이번 주에 백로그를 차례대로 처리할 예정입니다." },
    ],
  }),
  entry({
    id: "account-for",
    expression: "account for",
    korean: "설명하다, 차지하다",
    level: "advanced",
    kind: "phrasal-verb",
    grammarPattern: "account for + difference / amount / result",
    grammarFocus: "차이를 설명하거나 비중을 말할 때 둘 다 사용됩니다.",
    usageNote: "재무 보고, 비용 설명, 오차 분석에서 꼭 필요합니다.",
    commonMistake: "explain 만으로는 비중 의미가 빠질 수 있습니다.",
    categories: ["finance", "analysis"],
    collocations: ["the gap", "most of the cost", "the discrepancy"],
    objectPool: ["the gap", "most of the cost", "the discrepancy"],
    answerTemplate: "{subject} {modal} account for {object} {time}.",
    examples: [
      { en: "Material cost accounts for most of the increase.", kr: "자재비가 상승분 대부분을 차지합니다." },
      { en: "Can you account for the discrepancy in the invoice?", kr: "송장 차이를 설명해 주실 수 있나요?" },
    ],
  }),
  entry({
    id: "hinge-on",
    expression: "hinge on",
    korean: "~에 달려 있다",
    level: "advanced",
    kind: "pattern",
    grammarPattern: "hinge on + noun / whether clause",
    grammarFocus: "결과가 특정 조건에 좌우된다는 의미입니다.",
    usageNote: "의사결정, 일정, 승인 여부 설명에 적합합니다.",
    commonMistake: "depend of 가 아니라 depend on / hinge on 입니다.",
    categories: ["decision", "risk"],
    collocations: ["supplier approval", "whether the sample passes", "the final budget"],
    objectPool: ["supplier approval", "whether the sample passes", "the final budget"],
    answerTemplate: "{subject}'s decision {modal} hinge on {object} {time}.",
    examples: [
      { en: "The launch date hinges on whether the sample passes.", kr: "출시일은 샘플 통과 여부에 달려 있습니다." },
      { en: "Our final decision hinges on the budget review.", kr: "최종 결정은 예산 검토에 달려 있습니다." },
    ],
  }),
  entry({
    id: "be-on-track-to",
    expression: "be on track to",
    korean: "~할 순조로운 궤도에 있다",
    level: "intermediate",
    kind: "pattern",
    grammarPattern: "be on track to + verb",
    grammarFocus: "계획대로 잘 진행 중임을 보고할 때 씁니다.",
    usageNote: "진도 보고, 프로젝트 상태 공유에 매우 유용합니다.",
    commonMistake: "on the track to 보다 on track to 가 자연스럽습니다.",
    categories: ["project", "reporting"],
    collocations: ["meet the deadline", "finish production", "hit the target"],
    objectPool: ["meet the deadline", "finish production", "hit the target"],
    answerTemplate: "{subject} is on track to {object} {time}.",
    examples: [
      { en: "We are on track to meet the deadline.", kr: "우리는 마감일을 맞출 궤도에 올라 있습니다." },
      { en: "The project is on track to finish production this month.", kr: "프로젝트는 이번 달 양산 완료 일정대로 가고 있습니다." },
    ],
  }),
  entry({
    id: "be-slated-to",
    expression: "be slated to",
    korean: "~할 예정이다",
    level: "advanced",
    kind: "pattern",
    grammarPattern: "be slated to + verb",
    grammarFocus: "공식 일정상 계획되어 있다는 의미입니다.",
    usageNote: "출시 일정, 회의 일정, 배포 일정을 공식적으로 말할 때 좋습니다.",
    commonMistake: "schedule to 보다 be scheduled to / be slated to 구조를 씁니다.",
    categories: ["schedule", "planning"],
    collocations: ["launch next month", "ship next week", "go live in August"],
    objectPool: ["launch next month", "ship next week", "go live in August"],
    answerTemplate: "{subject} is slated to {object} {time}.",
    examples: [
      { en: "The new dashboard is slated to go live in August.", kr: "새 대시보드는 8월에 오픈 예정입니다." },
      { en: "The first shipment is slated to leave next week.", kr: "첫 선적은 다음 주 출항 예정입니다." },
    ],
  }),
  entry({
    id: "be-subject-to",
    expression: "be subject to",
    korean: "~에 따라 달라질 수 있다, ~의 적용을 받다",
    level: "advanced",
    kind: "pattern",
    grammarPattern: "be subject to + noun",
    grammarFocus: "변경 가능성이나 규정 적용을 나타내는 공식 표현입니다.",
    usageNote: "가격, 일정, 승인이 변경될 수 있음을 알릴 때 자주 씁니다.",
    commonMistake: "subject for changes 가 아니라 subject to change 입니다.",
    categories: ["legal", "pricing", "schedule"],
    collocations: ["change", "customs inspection", "management approval"],
    objectPool: ["change", "customs inspection", "management approval"],
    answerTemplate: "{subject} is subject to {object} {time}.",
    examples: [
      { en: "All prices are subject to change without notice.", kr: "모든 가격은 사전 통지 없이 변경될 수 있습니다." },
      { en: "The final release is subject to management approval.", kr: "최종 배포는 경영진 승인 대상입니다." },
    ],
  }),
  entry({
    id: "in-line-with",
    expression: "in line with",
    korean: "~와 일치하는, ~에 부합하는",
    level: "intermediate",
    kind: "pattern",
    grammarPattern: "be in line with + policy / target / expectation",
    grammarFocus: "기준이나 방침과 맞는다는 뜻의 전치사 패턴입니다.",
    usageNote: "정책 준수, 가격 정책, 품질 기준 설명에 많이 씁니다.",
    commonMistake: "in line to 와 혼동하지 말고 in line with 로 외우면 됩니다.",
    categories: ["policy", "quality", "pricing"],
    collocations: ["our policy", "the budget target", "customer expectations"],
    objectPool: ["our policy", "the budget target", "customer expectations"],
    answerTemplate: "{subject} is in line with {object} {time}.",
    examples: [
      { en: "The revised quote is in line with our pricing policy.", kr: "수정 견적은 우리 가격 정책에 부합합니다." },
      { en: "Your draft is not fully in line with customer expectations.", kr: "작성한 초안이 고객 기대와 완전히 일치하지는 않습니다." },
    ],
  }),
  entry({
    id: "under-pressure-to",
    expression: "under pressure to",
    korean: "~해야 하는 압박을 받는",
    level: "advanced",
    kind: "pattern",
    grammarPattern: "be under pressure to + verb",
    grammarFocus: "상황적 압박을 설명하는 형용사 패턴입니다.",
    usageNote: "마감, 원가절감, 일정 단축 등의 현실적 부담을 표현할 때 좋습니다.",
    commonMistake: "under the pressure to 보다 under pressure to 가 더 일반적입니다.",
    categories: ["management", "deadline", "cost"],
    collocations: ["cut costs", "ship faster", "close the issue"],
    objectPool: ["cut costs", "ship faster", "close the issue"],
    answerTemplate: "{subject} is under pressure to {object} {time}.",
    examples: [
      { en: "The factory is under pressure to ship faster this quarter.", kr: "공장이 이번 분기에는 더 빨리 선적해야 하는 압박을 받고 있습니다." },
      { en: "We are under pressure to close the issue this week.", kr: "우리는 이번 주에 그 이슈를 마무리해야 하는 압박을 받고 있습니다." },
    ],
  }),
  entry({
    id: "with-a-view-to",
    expression: "with a view to",
    korean: "~을 목표로, ~을 염두에 두고",
    level: "advanced",
    kind: "pattern",
    grammarPattern: "with a view to + noun / gerund",
    grammarFocus: "공식 문서에서 목적을 설명하는 고급 표현입니다.",
    usageNote: "개선 계획, 전략 문서, 보고서 문장에 품격 있게 쓰입니다.",
    commonMistake: "with a view to improve 가 아니라 with a view to improving 입니다.",
    categories: ["strategy", "writing"],
    collocations: ["improving lead time", "reducing defects", "long-term growth"],
    objectPool: ["improving lead time", "reducing defects", "long-term growth"],
    answerTemplate: "{subject} is taking action with a view to {object} {time}.",
    examples: [
      { en: "We are adjusting the workflow with a view to reducing defects.", kr: "불량률 감소를 목표로 워크플로를 조정하고 있습니다." },
      { en: "The team updated the process with a view to improving lead time.", kr: "리드타임 개선을 염두에 두고 프로세스를 업데이트했습니다." },
    ],
  }),
  entry({
    id: "be-geared-toward",
    expression: "be geared toward",
    korean: "~에 맞춰져 있다",
    level: "advanced",
    kind: "pattern",
    grammarPattern: "be geared toward + audience / goal",
    grammarFocus: "제품이나 전략의 방향성이 누구/무엇을 향하는지 말할 때 씁니다.",
    usageNote: "타깃 시장, 고객군, 목적을 설명할 때 좋습니다.",
    commonMistake: "geared to 도 가능하지만 geared toward 가 더 널리 쓰입니다.",
    categories: ["marketing", "strategy"],
    collocations: ["enterprise buyers", "cost savings", "premium clients"],
    objectPool: ["enterprise buyers", "cost savings", "premium clients"],
    answerTemplate: "{subject} is geared toward {object} {time}.",
    examples: [
      { en: "This package is geared toward enterprise buyers.", kr: "이 패키지는 기업 구매자를 겨냥하고 있습니다." },
      { en: "The campaign is geared toward premium clients.", kr: "그 캠페인은 프리미엄 고객층을 겨냥하고 있습니다." },
    ],
  }),
  entry({
    id: "ahead-of-schedule",
    expression: "ahead of schedule",
    korean: "예정보다 앞서",
    level: "intermediate",
    kind: "pattern",
    grammarPattern: "be ahead of schedule",
    grammarFocus: "일정 대비 진도가 빠를 때 쓰는 상태 표현입니다.",
    usageNote: "프로젝트 리포트에서 긍정적인 신호로 자주 보입니다.",
    commonMistake: "ahead the schedule 가 아니라 ahead of schedule 입니다.",
    categories: ["schedule", "reporting"],
    collocations: ["production", "installation", "testing"],
    objectPool: ["production", "installation", "testing"],
    answerTemplate: "{subject} is ahead of schedule {time}.",
    examples: [
      { en: "Production is ahead of schedule this week.", kr: "이번 주 생산은 예정보다 빠르게 진행되고 있습니다." },
      { en: "The installation is running ahead of schedule.", kr: "설치가 일정 대비 앞서 진행되고 있습니다." },
    ],
  }),
  entry({
    id: "behind-schedule",
    expression: "behind schedule",
    korean: "일정보다 뒤처진",
    level: "intermediate",
    kind: "pattern",
    grammarPattern: "be behind schedule",
    grammarFocus: "진도 지연을 짧고 명확하게 표현합니다.",
    usageNote: "리스크 공유, 일정 재조정, 보고용 문장에 필수입니다.",
    commonMistake: "late schedule 보다 behind schedule 이 자연스럽습니다.",
    categories: ["schedule", "risk"],
    collocations: ["production", "inspection", "shipment"],
    objectPool: ["production", "inspection", "shipment"],
    answerTemplate: "{subject} is behind schedule {time}.",
    examples: [
      { en: "The inspection is behind schedule because of the holiday.", kr: "휴일 때문에 검사가 예정보다 지연되고 있습니다." },
      { en: "We are slightly behind schedule on shipment.", kr: "선적 일정이 약간 뒤처져 있습니다." },
    ],
  }),
  entry({
    id: "as-part-of",
    expression: "as part of",
    korean: "~의 일환으로",
    level: "intermediate",
    kind: "pattern",
    grammarPattern: "as part of + project / initiative",
    grammarFocus: "큰 계획의 일부라는 의미를 연결해 주는 전치사 패턴입니다.",
    usageNote: "보고서, 발표, 이메일에서 배경 설명에 자주 씁니다.",
    commonMistake: "as a part of 도 가능하지만 business writing 에서는 as part of 가 더 간결합니다.",
    categories: ["writing", "reporting"],
    collocations: ["the pilot project", "our improvement plan", "the annual review"],
    objectPool: ["the pilot project", "our improvement plan", "the annual review"],
    answerTemplate: "{subject} is acting as part of {object} {time}.",
    examples: [
      { en: "We updated the checklist as part of our improvement plan.", kr: "개선 계획의 일환으로 체크리스트를 업데이트했습니다." },
      { en: "This training was launched as part of the annual review.", kr: "이 교육은 연간 리뷰의 일환으로 시작되었습니다." },
    ],
  }),
];

export const ENGLISH_CATEGORIES = Array.from(
  new Set(ENGLISH_ENTRIES.flatMap((entry) => entry.categories))
).sort();

export function createPracticeCard(entry: EnglishEntry, seed: number): PracticeCard {
  const example = entry.examples[seed % entry.examples.length];
  const subject = ROLE_SUBJECTS[seed % ROLE_SUBJECTS.length];
  const object = entry.objectPool[seed % entry.objectPool.length];
  const time = TIME_MARKERS[seed % TIME_MARKERS.length];
  const modal = MODAL_HELPERS[seed % MODAL_HELPERS.length];
  const taskType = TASK_TYPES[seed % TASK_TYPES.length];
  const model = fillTemplate(entry.answerTemplate, subject, object, time, modal);

  if (taskType === "빈칸 완성") {
    return {
      id: `${entry.id}-${seed}-cloze`,
      entryId: entry.id,
      expression: entry.expression,
      level: entry.level,
      taskType,
      prompt: `${example.en.replace(entry.expression, "________")} \n\n빈칸에 들어갈 표현을 말해 보세요.`,
      answer: entry.expression,
      explanation: `${entry.grammarPattern} 패턴을 유지해야 합니다. ${entry.grammarFocus}`,
    };
  }

  if (taskType === "업무 문장 작성") {
    return {
      id: `${entry.id}-${seed}-sentence`,
      entryId: entry.id,
      expression: entry.expression,
      level: entry.level,
      taskType,
      prompt: `"${entry.expression}"를 사용해서 ${object}에 관한 비즈니스 문장을 하나 만들어 보세요. 힌트: ${subject}, ${time}`,
      answer: model,
      explanation: `${entry.usageNote}`,
    };
  }

  if (taskType === "문법 포인트") {
    return {
      id: `${entry.id}-${seed}-grammar`,
      entryId: entry.id,
      expression: entry.expression,
      level: entry.level,
      taskType,
      prompt: `"${entry.expression}"의 문형을 설명해 보세요.`,
      answer: `${entry.grammarPattern} / ${entry.grammarFocus}`,
      explanation: `실수 주의: ${entry.commonMistake}`,
    };
  }

  if (taskType === "번역 힌트") {
    return {
      id: `${entry.id}-${seed}-translation`,
      entryId: entry.id,
      expression: entry.expression,
      level: entry.level,
      taskType,
      prompt: `${example.kr}\n\n이 문장에서 핵심 표현으로 어떤 영어 구동사/패턴을 쓸지 떠올려 보세요.`,
      answer: `${entry.expression} / 예문: ${example.en}`,
      explanation: `${entry.korean}라는 의미로 쓰였습니다.`,
    };
  }

  if (taskType === "실수 교정") {
    return {
      id: `${entry.id}-${seed}-mistake`,
      entryId: entry.id,
      expression: entry.expression,
      level: entry.level,
      taskType,
      prompt: `다음 문장을 더 자연스럽게 고쳐 보세요.\n\n"${subject} should use ${entry.expression.replace(" on", "").replace(" with", "")} ${object} ${time}."`,
      answer: model,
      explanation: `교정 포인트: ${entry.commonMistake}`,
    };
  }

  return {
    id: `${entry.id}-${seed}-collocation`,
    entryId: entry.id,
    expression: entry.expression,
    level: entry.level,
    taskType,
    prompt: `"${entry.expression}"와 자연스럽게 어울리는 업무 대상을 하나 골라 보세요.\n후보: ${entry.collocations.join(", ")}`,
    answer: `${entry.collocations[seed % entry.collocations.length]} / 예문: ${model}`,
    explanation: `${entry.usageNote}`,
  };
}

export function practiceUniverseSize(entries = ENGLISH_ENTRIES) {
  return entries.reduce(
    (sum, current) =>
      sum +
      current.examples.length *
        ROLE_SUBJECTS.length *
        TIME_MARKERS.length *
        TASK_TYPES.length *
        MODAL_HELPERS.length,
    0
  );
}

export function countByLevel(level: EnglishLevel) {
  const entries = ENGLISH_ENTRIES.filter((entry) => entry.level === level);
  return {
    entries: entries.length,
    drills: practiceUniverseSize(entries),
  };
}
