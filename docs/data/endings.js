// data/endings.js - 结局列表（春节主题扩展版）
// 原有 9 个结局 + 新增 6 个春节主题结局
// matchEnding 引擎逻辑：先按 ID 找特殊结局，再按评分找普通结局

export const SPRING_ENDINGS = [
  // ===== 优先级 1：主线完成 =====
  {
    id: "ending_year_warrior",
    name: "年度战役幸存者",
    // 引擎层特殊检查：stats.mainQuestProgress >= 10
    condition: { _type: "main_quest_complete" },
    body: "正月十五，你拖着行李箱离开了老家。\n\n春节这十天，你经历了催婚、相亲、前任、父母深夜谈心、奶奶的灵魂拷问、闺蜜的陪伴。\n\n坐在返程的火车上，你看着窗外的风景发呆。妈妈在站台上抹眼泪，奶奶在家庭群里发语音：「明年一定要带个对象回来！」\n\n你摸了摸口袋——妈妈塞的特产压岁钱还在，奶奶塞的红包也在。你笑了笑，发了条朋友圈：\n\n「春节战役，勉强幸存。」\n\n评论区炸了。闺蜜小敏第一个回复：「活着就好！」\n\n妈妈在下面留言：「明年带个对象回来。」\n\n火车开动了。你看着窗外飞速后退的田野。故事还很长，不急。",
    insight: "活着就是胜利，婚恋是一场持久战"
  },

  // ===== 优先级 2：相亲成功 =====
  {
    id: "ending_blind_date_success",
    name: "相亲上岸",
    // 引擎层检查：stats.npcs.npc_blind_date >= 70
    condition: { _type: "npc_affinity", npcId: "npc_blind_date", minAffinity: 70 },
    body: "次年国庆，你和林晓订婚了。\n\n林晓——正月初五那个相亲对象，民政局的小科员，二本毕业，月薪6000，长相普通，说话不多。\n\n她第一次见面就跟你说：「我妈说你们家条件不错，我觉得可以先聊聊。」\n\n你笑了。这个开场白，比你听过的所有「感觉」都实在。\n\n后来你们约了第二次、第三次、第十次。慢慢地，你发现她其实很温柔——会在你加班时送来宵夜，会记得你说过想吃的东西。\n\n婚后的生活很平淡，但很踏实。每天早上，她比你早起十分钟，给你做早餐。周末你们一起去菜市场买菜，回家她做饭，你洗碗。\n\n妈妈逢人就说：「我儿媳妇可好了！」",
    insight: "婚姻的本质是过日子，不是在找完美，而是在找合适"
  },

  // ===== 优先级 3：与父母和解 =====
  {
    id: "ending_family_heal",
    name: "家庭和解",
    // 引擎层检查：stats.npcs.npc_mom >= 60 && stats.npcs.npc_dad >= 55
    condition: { _type: "npc_affinity_multi", npcIds: ["npc_mom", "npc_dad"], minAffinities: { npc_mom: 60, npc_dad: 55 } },
    body: "正月初七深夜，你和爸妈坐在客厅里聊了三个小时。\n\n这是你长大后，第一次认真地跟爸妈聊「为什么不想结婚」。\n\n你说：「妈，我不是不想，我是怕。怕找错人，怕过不好，怕让你们失望。」\n\n妈妈的眼眶红了。爸爸在旁边没说话，喝了一口酒，然后说：「爸年轻的时候也怕。后来遇到你妈，觉得——差不多就行了。」\n\n妈妈瞪了他一眼。你笑了。\n\n那天晚上，你和爸妈说了很多——工作上的压力、感情上的困惑、对未来的迷茫。\n\n妈妈听完，叹了口气：「孩子，妈不是催你结婚，妈就是怕你一个人。」\n\n你走过去，抱了抱妈妈。「妈，我会的。」\n\n正月初八，你拖着行李箱去车站。妈妈在站台上抹眼泪，但这次不是委屈，是不舍。",
    insight: "父母的催婚背后，藏的是担心。读懂了担心，就读懂了爱"
  },

  // ===== 优先级 4：前任和解 =====
  {
    id: "ending_ex_reunion",
    name: "前任和解",
    // 引擎层检查：stats.npcs.npc_ex >= 65
    condition: { _type: "npc_affinity", npcId: "npc_ex", minAffinity: 65 },
    body: "正月初二，你在县城那家咖啡馆偶遇了前任一凡。\n\n他牵着一个小男孩的手，旁边是他老婆。一家人其乐融融。\n\n「好久不见。」他说。\n\n「好久不见。」你说。\n\n你们站在咖啡馆门口聊了五分钟。他说他开了家店，老婆是本地人，孩子三岁了。\n\n后来你听共同的朋友说，一凡现在过得不错，店开了三家分店，老婆很贤惠。\n\n你笑了笑，觉得这样就挺好。有些人的出现，就是为了陪你走一段路。走完了，就该挥手告别。\n\n你把一凡的朋友圈设成了「不常看他」，不是因为恨，而是因为——没必要。\n\n你继续往前走。",
    insight: "前任最好的结局，是成为朋友圈里一个不痛不痒的点赞之交"
  },

  // ===== 优先级 5：回乡过年战士 =====
  {
    id: "ending_back_home_warrior",
    name: "回乡过年战士",
    // 按评分：confidence >= 65, social 55-100
    condition: {
      _scoreConfig: true,
      minConfidence: 65,
      social: { min: 55, max: 100 }
    },
    body: "正月初八，你站在离别的车站，回望这个春节。\n\n你回来了。你扛住了。你没有妥协。你守住了自己的节奏。\n\n年夜饭上，你平静地回应了奶奶的催婚：「奶奶，我心里有数。」\n\n奶奶愣了一下：「这孩子，长大了。」\n\n相亲对象林晓，你礼貌地加了微信：「我觉得我们不太合适，但谢谢你今天的饭。」\n\n前任一凡偶遇，你礼貌地打了招呼，然后坦然离开。没有旧情复燃，就只是——过去了。\n\n爸爸喝醉那晚跟你说：「爸支持你。」你红了眼眶。\n\n火车开动了。你戴着耳机，打开了一本书。前方还有很长的路，但你不慌。",
    insight: "守住节奏不是逃避，是在用自己的方式负责任"
  },

  // ===== 优先级 6：逃离大师 =====
  {
    id: "ending_evade_master",
    name: "逃离大师",
    // 按评分：social 0-35, 一线/新一线/海外
    condition: {
      _scoreConfig: true,
      social: { min: 0, max: 35 },
      cityTier: ["一线", "新一线", "海外"]
    },
    body: "除夕夜，你坐在出租屋里，打开外卖软件。「春节不营业。」——周围所有的店都关门了。\n\n你最终找到一家还在营业的饺子馆，点了一份速冻水饺，28块钱。\n\n妈妈发来视频邀请，你挂断了，发了条消息：「妈，在忙。」\n\n窗外的烟花在天上炸开，你对着电脑屏幕看完了整场春晚的重播。\n\n凌晨一点，你发了一条朋友圈：「新年快乐。」只有三个人点赞——两个是广告号，一个是远在美国的大学同学。\n\n妈妈在评论区问：「吃饺子了吗？」你没回。\n\n房租照交，工作照做。只是每次妈妈打电话来，你都习惯性地按掉。",
    insight: "逃得了一时的催婚，逃不了心里的空落"
  }
];

// ===== 原有结局（保留不变）=====
export const ORIGINAL_ENDINGS = [
  {
    id: "ending_perfect_match",
    name: "门当户对的圆满",
    condition: {
      assetTier: ["A8", "A9"],
      cityTier: ["一线", "新一线"],
      ageRange: [27, 35],
      minConfidence: 60
    },
    body: "你在33岁那年遇到了对的人——门当户对，颜值相当，聊得来。你们在亲友的祝福下办了不大不小的婚礼。博主说：'这就是门当户对里挑喜欢的最佳范本。'",
    insight: "门当户对里挑喜欢的"
  },
  {
    id: "ending_single_noble",
    name: "主动选择的单身贵族",
    condition: {
      assetTier: ["A7", "A8", "A9"],
      minConfidence: 70,
      social: { min: 0, max: 40 }
    },
    body: "你35岁那年，决定一个人过。养了只猫，买了套大房子，每年出国旅行两次。爸妈从最初的反对到最后的接受——你说服了他们。",
    insight: "单身不是失败，是主动选择"
  },
  {
    id: "ending_marriage_market_loop",
    name: "相亲不息的循环",
    condition: {
      ageRange: [35, 50],
      maxConfidence: 40
    },
    body: "你还在相亲。五年后回看自己——标准没变，年龄变了，身边的人换了一茬又一茬。妈妈每次视频电话都叹气。",
    insight: "该做减法的时候没做，市场会用脚投票"
  },
  {
    id: "ending_settle_down",
    name: "理性落地的归宿",
    condition: {
      assetTier: ["A6", "A7", "普通"],
      cityTier: ["三四五线", "县城/农村"],
      ageRange: [28, 35],
      minConfidence: 50
    },
    body: "你在老家/工作的城市找了个人，过上了稳定的小日子。没什么大起大落，但每天回家有人等你——博主说：'门当户对、知根知底，这种最稳。'",
    insight: "稳定的婚姻不在于激情，在于节奏一致"
  },
  {
    id: "ending_unexpected_love",
    name: "意外的缘分",
    condition: {
      minConfidence: 50,
      social: { min: 60, max: 100 }
    },
    body: "你根本没在'找对象'，只是某次朋友聚会上遇见了 TA——门不当户不对，但聊得停不下来。你决定试试看。",
    insight: "缘分有时候就是不在你的清单上"
  },
  {
    id: "ending_golden_period_missed",
    name: "错过黄金期",
    condition: {
      gender: ["女"],
      ageRange: [32, 50],
      assetTier: ["A8", "A9"]
    },
    body: "你33岁了还在等那个'门当户对又心动'的人。但每一次接近都因为'差一点点'而放弃。妈妈说：'闺女，咱能不能别那么挑了。'你沉默。",
    insight: "富家千金越该趁年轻找，过了黄金期概率下降"
  },
  {
    id: "ending_down_to_earth",
    name: "放下面子的踏实",
    condition: {
      maxConfidence: 30,
      social: { min: 70, max: 100 }
    },
    body: "你放弃了最初的画像。对方家境一般但踏实上进，对你也好。结婚那天妈妈哭了——是开心的。",
    insight: "门当户对不是死规矩，找一个愿意一起过的人才是"
  },
  {
    id: "ending_career_first",
    name: "事业优先的强者",
    condition: {
      incomeTier: ["100万+", "50-100万"],
      ageRange: [30, 50],
      social: { min: 0, max: 30 }
    },
    body: "你40岁，公司上市/做到合伙人，朋友圈都是更优秀的人。但回望青春——好像错过了什么。",
    insight: "竞争力是组合拳，单一维度撑不起完整人生"
  },
  {
    id: "ending_default_match",
    name: "差不多就得了",
    condition: {},
    body: "你最终找了一个'差不多'的人。不惊艳也不失望，平平淡淡过完这一生。",
    insight: "大部分人的婚姻本来就是这么回事"
  }
];

// 全量结局
export const ENDINGS = [...ORIGINAL_ENDINGS, ...SPRING_ENDINGS];

// 快速查找
export function getEndingById(id) {
  return ENDINGS.find(e => e.id === id) || ENDINGS[ENDINGS.length - 1];
}
