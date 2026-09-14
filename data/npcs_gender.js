// data/npcs_gender.js
// 性别差异化 NPC 池
// 女性玩家看到闺蜜"小敏"，男性玩家看到兄弟"阿强"
// 前任、相亲对象等 NPC 也根据性别显示不同名字和头像

// 性别归一化
const GENDER_MAP = { F: "女", M: "男", 男: "男", 女: "女" };
export function normGender(g) { return GENDER_MAP[g] || g; }

// ===== 女性 NPC 池 =====
export const FEMALE_NPCS = [
  {
    id: "npc_mom_f",
    name: "李秀英",
    emoji: "👩",
    role: "妈妈",
    relation: "妈妈",
    gender: "F",
    initialAffinity: 50,
    personality: "朋友圈点赞型催婚：每个亲戚发朋友圈都@你，永远相信「你表姐都生二胎了」",
    speechStyle: "妈：你看你表姐，二胎都会跑了！你什么时候能让我抱上外孙？",
    defaultTone: "warm",
    portrait: "👩",
    appearances: [
      "腊月二十九催你回家",
      "除夕年夜饭",
      "初一亲戚围攻时的眼神",
      "初四偷偷安排相亲",
      "初五陪你去相亲",
      "初七深夜谈心",
      "初八塞特产"
    ],
    backstory: "五十三岁，县城退休纺织女工。年轻时是厂里一枝花，嫁给你爸后相夫教子，把全部希望寄托在你身上。最近几年迷上了智能手机，每天在家族群里转发养生文章和催婚短视频。",
    dialogueExamples: [
      "「你再不找对象，过年回来七大姑八大姨问起来，我脸往哪儿搁？」",
      "「妈不是逼你，妈就是担心你一个人在外面，没人照顾。」",
      "「你王阿姨的女儿，比你小两岁，孩子都会打酱油了！」",
      "「这次这个不错，在民政局上班，铁饭碗，你见见？」"
    ]
  },
  {
    id: "npc_bestie_f",
    name: "小敏",
    emoji: "👩‍🦰",
    role: "闺蜜",
    relation: "闺蜜/战友",
    gender: "F",
    initialAffinity: 70,
    personality: "战友型参谋：你的婚恋问题她比谁都上心，陪怼亲戚是专业户",
    speechStyle: "小敏：你妈又逼你了？来来来，姐妹陪你一起怼回去！",
    defaultTone: "sassy",
    portrait: "👩‍🦰",
    appearances: [
      "初二老同学聚会前",
      "初三来你家找你",
      "初四帮你分析相亲对象",
      "初五陪你去相亲",
      "初七微信远程支援"
    ],
    backstory: "二十八岁，和你是高中同桌，当年一起追星一起暗恋隔壁班的男生。高中毕业后你去了大城市，她留在县城当了小学老师。去年刚结婚，老公是公务员，对她很好。每次你回家她都第一时间来找你，分享八卦顺便帮你分析感情问题。",
    dialogueExamples: [
      "「你那个相亲对象怎么样？有没有给你发微信？」",
      "「我觉得你可以试试，别太挑了，真的。」",
      "「你妈这是爱的绑架！姐妹支持你反抗！」",
      "「来，喝奶茶，说说最近有没有喜欢的人？」"
    ]
  },
  {
    id: "npc_ex_f",
    name: "陈一凡",
    emoji: "💔",
    role: "前任",
    relation: "前任男友",
    gender: "M",
    initialAffinity: 20,
    personality: "老家偶遇型：当年分手的撕心裂肺，过年回家发现对方已结婚有娃",
    speechStyle: "陈一凡：好久不见。这是...我老婆和孩子。",
    defaultTone: "cold",
    portrait: "💔",
    appearances: [
      "初二老同学聚会重逢",
      "偶遇后在微信联系"
    ],
    backstory: "二十八岁，你的大学初恋，交往两年，毕业后因为异地分手。当时他说要去深圳闯荡，你说要留在大城市发展，两个人都不肯让步，最后和平分手。三年后你在老家县城偶遇他——他留在了本地，娶了相亲认识的女生，孩子刚满周岁。",
    dialogueExamples: [
      "「好久不见，你...还是老样子。」",
      "「这是我老婆，这是我们孩子。」",
      "「你现在还在那边？没考虑回来发展？」",
      "「（微信）刚才不好意思，没吓到你吧。」"
    ]
  },
  {
    id: "npc_blind_date_f",
    name: "林晓",
    emoji: "💐",
    role: "相亲对象",
    relation: "相亲对象",
    gender: "F",
    initialAffinity: 30,
    personality: "反复出现型：妈妈同事介绍的，本地公务员，第一次见面后又在老家小城偶遇",
    speechStyle: "林晓：你好，我是林晓。张阿姨介绍的。",
    defaultTone: "neutral",
    portrait: "💐",
    appearances: [
      "初五第一次相亲见面",
      "初六在奶茶店偶遇",
      "初七微信聊天"
    ],
    backstory: "二十六岁，本地民政局公务员，身高165，长相清秀，性格温和。家里条件不错，父母都是体制内，独生女。年前刚结束一段三年的恋情（前男友去了北京工作后分手），被家里安排相亲。第一次见面是在县城唯一的咖啡馆，穿着得体，举止有礼。",
    dialogueExamples: [
      "「你好，我是林晓。张阿姨应该跟你妈妈说过了吧？」",
      "「你在那边工作几年了？觉得怎么样？」",
      "「其实我也不是很着急，就是我妈...你懂的。」",
      "「那加个微信吧，回去也可以聊。」"
    ]
  }
];

// ===== 男性 NPC 池 =====
export const MALE_NPCS = [
  {
    id: "npc_mom_m",
    name: "李秀英",
    emoji: "👩",
    role: "妈妈",
    relation: "妈妈",
    gender: "F",
    initialAffinity: 50,
    personality: "唠叨型催婚：每天问你有没有女朋友，什么时候带回来",
    speechStyle: "妈：你什么时候带个女朋友回来？你王阿姨的儿子都结婚了！",
    defaultTone: "warm",
    portrait: "👩",
    appearances: [
      "腊月二十九催你回家",
      "除夕年夜饭",
      "初一亲戚围攻时的眼神",
      "初四偷偷安排相亲",
      "初五陪你去相亲",
      "初七深夜谈心",
      "初八塞特产"
    ],
    backstory: "五十三岁，县城退休纺织女工。年轻时是厂里一枝花，嫁给你爸后相夫教子，把全部希望寄托在儿子身上。最近几年迷上了智能手机，每天在家族群里转发养生文章和催婚短视频。",
    dialogueExamples: [
      "「你再不找对象，过年回来七大姑八大姨问起来，我脸往哪儿搁？」",
      "「妈不是逼你，妈就是担心你一个人在外面，没人照顾。」",
      "「你王阿姨的儿子，比你小两岁，孩子都会打酱油了！」",
      "「这次这个不错，在民政局上班，铁饭碗，你见见？」"
    ]
  },
  {
    id: "npc_bestie_m",
    name: "阿强",
    emoji: "👨‍🦱",
    role: "兄弟",
    relation: "兄弟/战友",
    gender: "M",
    initialAffinity: 70,
    personality: "战友型参谋：你的婚恋问题他比谁都上心，陪喝酒吐槽是专业户",
    speechStyle: "阿强：你妈又逼你了？来来来，兄弟陪你喝一杯！",
    defaultTone: "casual",
    portrait: "👨‍🦱",
    appearances: [
      "初二老同学聚会前",
      "初三来你家找你",
      "初四帮你分析相亲对象",
      "初五陪你去相亲",
      "初七微信远程支援"
    ],
    backstory: "二十八岁，和你是从小一起长大的兄弟，当年一起打球一起打游戏。高中毕业后你去了大城市，他留在县城考了公务员。去年刚结婚，老婆是老师，对他很好。每次你回家他都第一时间来找你，喝酒吹牛顺便帮你分析感情问题。",
    dialogueExamples: [
      "「你那个相亲对象怎么样？有没有给你发微信？」",
      "「我觉得你可以试试，别太挑了，真的。」",
      "「你妈这是爱的绑架！兄弟支持你反抗！」",
      "「来，喝一杯，说说最近有没有喜欢的姑娘？」"
    ]
  },
  {
    id: "npc_ex_m",
    name: "小雪",
    emoji: "💔",
    role: "前任",
    relation: "前任女友",
    gender: "F",
    initialAffinity: 20,
    personality: "老家偶遇型：当年分手的撕心裂肺，过年回家发现对方已结婚有娃",
    speechStyle: "小雪：好久不见。这是...我老公和孩子。",
    defaultTone: "cold",
    portrait: "💔",
    appearances: [
      "初二老同学聚会重逢",
      "偶遇后在微信联系"
    ],
    backstory: "二十六岁，你的大学初恋，交往两年，毕业后因为异地分手。当时你说要去深圳闯荡，她说要在老家考公务员，两个人都不肯让步，最后和平分手。三年后你在老家县城偶遇她——她留在了本地，嫁给了相亲认识的男人，孩子刚满周岁。",
    dialogueExamples: [
      "「好久不见，你...还是老样子。」",
      "「这是我老公，这是我们孩子。」",
      "「你现在还在那边？没考虑回来发展？」",
      "「（微信）刚才不好意思，没吓到你吧。」"
    ]
  },
  {
    id: "npc_blind_date_m",
    name: "张伟",
    emoji: "🤵",
    role: "相亲对象",
    relation: "相亲对象",
    gender: "M",
    initialAffinity: 30,
    personality: "反复出现型：妈妈同事介绍的，本地公务员，第一次见面后又在老家小城偶遇",
    speechStyle: "张伟：你好，我是张伟。李阿姨介绍的。",
    defaultTone: "neutral",
    portrait: "🤵",
    appearances: [
      "初五第一次相亲见面",
      "初六在奶茶店偶遇",
      "初七微信聊天"
    ],
    backstory: "二十七岁，本地民政局公务员，身高175，长相端正，性格温和。家里条件不错，父母都是体制内，独生子。年前刚结束一段三年的恋情（前女友去了北京工作后分手），被家里安排相亲。第一次见面是在县城唯一的咖啡馆，穿着得体，举止有礼。",
    dialogueExamples: [
      "「你好，我是张伟。李阿姨应该跟你妈妈说过了吧？」",
      "「你在那边工作几年了？觉得怎么样？」",
      "「其实我也不是很着急，就是我妈...你懂的。」",
      "「那加个微信吧，回去也可以聊。」"
    ]
  }
];

// ===== 通用 NPC（不分性别）=====
export const COMMON_NPCS = [
  {
    id: "npc_dad",
    name: "老张",
    emoji: "👨",
    role: "爸爸",
    relation: "爸爸",
    gender: "M",
    initialAffinity: 50,
    personality: "摇摆派：嘴上说随你，背后偷偷给你妈递话，从不当面催婚但会偷偷安排饭局",
    speechStyle: "爸：（喝口酒）那个...也不急，年轻人有自己的打算。",
    defaultTone: "neutral",
    portrait: "👨",
    appearances: [
      "腊月二十九接站",
      "除夕年夜饭喝酒",
      "初一亲戚聚会沉默",
      "初五相亲后追问",
      "初七深夜终于开口",
      "初八送你上车"
    ],
    backstory: "五十六岁，县城中学的数学老师，四十年教龄，桃李满天下。年轻时追你妈追了三年，在学校是有名的老实人。喝了酒才会说真话，经常在你妈催婚时打圆场，但酒醒后又装没事人。",
    dialogueExamples: [
      "「那个...你自己看着办，爸不催你。」（然后转头给你妈使眼色）",
      "「爸年轻的时候也不急着找对象，后来...后来就等到了你妈。」（叹气）",
      "「这次回来，感觉你瘦了，在外面吃得不好吧？」",
      "「（喝酒后）爸跟你说句心里话...」"
    ]
  },
  {
    id: "npc_grandma",
    name: "王奶奶",
    emoji: "👵",
    role: "奶奶",
    relation: "奶奶/姥姥",
    gender: "F",
    initialAffinity: 60,
    personality: "传统派灵魂三问：「什么时候结婚？什么时候生孩子？什么时候生二胎？」",
    speechStyle: "奶奶：你也老大不小了，你妈像你这么大的时候，你都会跑了！",
    defaultTone: "warm",
    portrait: "👵",
    appearances: [
      "除夕拜年",
      "初一家庭聚会主桌",
      "初一看你发呆的眼神",
      "初五给你塞红包"
    ],
    backstory: "七十八岁，经历过三年困难时期，一辈子省吃俭用。最大的心愿就是看到全家团圆、四代同堂。每次家庭聚会都要坐主位，说话有分量，但耳背，经常把你说的「工作忙」听成「有对象了」。",
    dialogueExamples: [
      "「什么时候结婚啊？奶奶这把老骨头，怕是等不到抱重孙了。」（擦眼泪）",
      "「你妈像我这么大的时候，你们都会满地跑了！」",
      "「隔壁老李家的孙子，比你小五岁，都生二胎了！」",
      "「（耳背版）有对象了？好！好！什么时候带回来给奶奶看看？」"
    ]
  }
];

// ===== 导出函数：获取适合当前性别的 NPC 池 =====
export function getNPCPool(gender) {
  const normalizedGender = normGender(gender);
  if (normalizedGender === "女") {
    return [...FEMALE_NPCS, ...COMMON_NPCS];
  } else {
    return [...MALE_NPCS, ...COMMON_NPCS];
  }
}

// ===== 导出函数：获取特定 NPC 的性别化版本 =====
export function getGenderedNPC(npcId, gender) {
  const normalizedGender = normGender(gender);
  const pool = getNPCPool(gender);
  return pool.find(npc => npc.id === npcId);
}

// ===== 别名导出（兼容旧代码）=====
export const NPCS_FEMALE = FEMALE_NPCS;
export const NPCS_MALE = MALE_NPCS;

// ===== 默认 NPC 好感度 =====
export function getDefaultAffinities(gender) {
  const pool = getNPCPool(gender);
  return pool.reduce((acc, npc) => {
    acc[npc.id] = npc.initialAffinity;
    return acc;
  }, {});
}
