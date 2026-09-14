// data/outcomes.js
// 结局系统：15 种结局
//
// 分类：
//   - mixed（混合线）3 种
//   - family（家庭线）3 种
//   - romance（爱情线）5 种
//   - career（事业线）4 种
//
// 引擎调用：outcomeEngine.determineOutcome(stats)
//   stats 结构（由 outcomeEngine.computeStats 投影）：
//     - stats.attributes.{family,career,independence,romance,resilience}
//     - stats.affection.{npc_mom_affection, npc_ex_affection, npc_blind_date_affection}
//     - stats.flags.{reconciled_ex, completed_grandma_wish}
//     - stats.redPacket
//
// 兼容旧调用：outcomeEngine/UI 仍兼容旧的 ENDINGS / endings 数组（endings.js）

// ===== 结局优先级顺序（outcomeEngine 遍历顺序） =====
export const OUTCOME_CATEGORIES = ["mixed", "family", "romance", "career"];

// ===== 默认结局（无任何结局匹配时返回） =====
export const DEFAULT_OUTCOME = {
  id: "outcome_default",
  category: "mixed",
  title: "顺其自然",
  emoji: "🌱",
  description: "数据不足以决定一个明确的结局。",
  body: "故事还没有写完。无论你最终走向何方，\n\n这一年的春节，都已经成为了你人生的一部分。\n\n带着这些记忆，继续走下去吧。",
  bgColor: "#5cb85c",
  insight: "顺其自然，也是一种结局",
};

// ===== 15 种结局 =====
export const OUTCOMES = {
  // ============================================
  // 混合线（3 种）—— 优先级最高
  // ============================================
  outcome_mixed_all_win: {
    id: "outcome_mixed_all_win",
    category: "mixed",
    title: "事业爱情双丰收",
    emoji: "🏆",
    condition: (stats) => {
      return stats.attributes.career >= 70
          && stats.attributes.romance >= 70
          && stats.attributes.family >= 70;
    },
    description: "这是最完美的结局——你拥有了想要的一切。",
    body:
      "这一年的春节，你带着 TA 回家。\n\n" +
      "妈妈在厨房里忙活，爸爸和 TA 在客厅下棋，奶奶偷偷往你口袋里塞了一个红包。\n\n" +
      "「来年带个孙子回来啊。」奶奶笑着说。\n\n" +
      "你看了 TA 一眼，TA 红了脸。\n\n" +
      "回深圳的高铁上，你收到了老板的邮件：晋升邮件。\n\n" +
      "你把手机递给 TA 看，TA 看完，笑了：「辛苦了这么多年，该享享福了。」\n\n" +
      "你看着窗外飞速后退的风景，心里暖洋洋的。\n\n" +
      "新的一年，事业爱情双丰收。\n\n" +
      "这就是你想要的答案。",
    bgColor: "#FFD700",
    insight: "幸福不是单选题，是多选题",
  },

  outcome_mixed_love_sacrifice: {
    id: "outcome_mixed_love_sacrifice",
    category: "mixed",
    title: "为爱牺牲事业",
    emoji: "💔",
    condition: (stats) => {
      return stats.attributes.romance >= 75
          && stats.affection.npc_ex_affection >= 80
          && stats.attributes.career < 50;
    },
    description: "你选择了爱情，放弃了事业发展的机会。",
    body:
      "你放弃了那个 offer。\n\n" +
      "HR 的电话你接了，说了句「对不起，我已经决定了」，然后挂断。\n\n" +
      "那一晚，你坐在出租屋里，看着窗外的城市灯火。\n\n" +
      "TA 发来消息：「想好了吗？」\n\n" +
      "你回复：「想好了。」\n\n" +
      "后来你跟着 TA 去了 TA 的城市，从零开始。\n\n" +
      "工资降了一半，朋友圈越来越小，年会的时候你坐在角落，看着别人意气风发。\n\n" +
      "但每天回家，TA 给你留的灯都是亮的。\n\n" +
      "你不知道这个选择对不对。\n\n" +
      "但你知道，你不会后悔。",
    bgColor: "#E91E63",
    insight: "有些选择，没有对错，只有取舍",
  },

  outcome_mixed_career_sacrifice: {
    id: "outcome_mixed_career_sacrifice",
    category: "mixed",
    title: "为事业放弃爱情",
    emoji: "📊",
    condition: (stats) => {
      return stats.attributes.career >= 80
          && stats.affection.npc_ex_affection >= 60
          && stats.attributes.independence >= 70;
    },
    description: "你选择了事业，错过了那段感情。",
    body:
      "当你终于升职加薪，却发现 TA 已经离开了。\n\n" +
      "那天你拿到晋升通知，第一个想分享的人就是 TA。\n\n" +
      "你打开微信，翻到 TA 的对话框。\n\n" +
      "最后一条消息停在三个月前，是你说「最近太忙了，等这阵子过了再说」。\n\n" +
      "TA 没有回复。\n\n" +
      "你拨过去，是空号。\n\n" +
      "后来你听共同的朋友说，TA 结婚了，嫁给了老家那个相亲对象。\n\n" +
      "婚礼你没去。你在那天飞到了上海，见一个重要的客户。\n\n" +
      "飞机上，你看着窗外的云层，闭上眼睛。\n\n" +
      "你获得了你想要的事业。\n\n" +
      "但你失去的，可能再也回不来了。",
    bgColor: "#3F51B5",
    insight: "职场得意时，往往是情场失意时",
  },

  // ============================================
  // 家庭线（3 种）
  // ============================================
  outcome_family_harmony: {
    id: "outcome_family_harmony",
    category: "family",
    title: "家和万事兴",
    emoji: "🏠",
    condition: (stats) => {
      return stats.attributes.family >= 75
          && stats.affection.npc_mom_affection >= 70
          && !stats.flags.reconciled_ex;
    },
    description: "你和父母达成了和解。",
    body:
      "离开家的那天，妈妈在站台上塞给你一个保温袋。\n\n" +
      "「里面是你爱吃的糖醋排骨，还有你奶奶做的年糕。」妈妈的眼眶红红的，「到了深圳记得按时吃饭，别老点外卖。」\n\n" +
      "你接过保温袋，点点头。\n\n" +
      "火车开动的那一刻，妈妈追着火车跑了几步，被爸爸拉住了。\n\n" +
      "你隔着车窗挥手，鼻子一酸，眼泪差点掉下来。\n\n" +
      "打开保温袋，里面除了吃的，还有一张纸条：\n\n" +
      "「孩子，妈不是催你结婚，妈就是怕你一个人。妈想了很久，决定不催了。你自己的人生，自己做主。只要你幸福，妈就开心。」\n\n" +
      "你看着那张纸条，哭了出来。\n\n" +
      "车厢里的人都看你，但你不在乎。\n\n" +
      "你终于明白，家和万事兴是什么意思。",
    bgColor: "#FF6B6B",
    insight: "家不是束缚，是港湾",
  },

  outcome_family_escape: {
    id: "outcome_family_escape",
    category: "family",
    title: "逃离家乡",
    emoji: "🚂",
    condition: (stats) => {
      return stats.attributes.independence >= 80
          && stats.attributes.career >= 70;
    },
    description: "你选择了独立，不再被家庭束缚。",
    body:
      "火车开动的那一刻，你长舒一口气。\n\n" +
      "终于离开了。\n\n" +
      "这个春节，你顶住了所有的催婚、相亲、奶奶的灵魂拷问、二姨的指指点点。\n\n" +
      "你没有妥协，没有将就，没有随便找个人凑合。\n\n" +
      "你按照自己的方式，过完了这个春节。\n\n" +
      "车窗外，爸妈的身影越来越小。你没有回头。\n\n" +
      "你掏出手机，给妈妈发了条消息：\n\n" +
      "「妈，我到了给您打电话。今年清明我不回来了，五一再说。」\n\n" +
      "你关掉手机，靠在座椅上，闭上眼睛。\n\n" +
      "前方的路还很长，但你很踏实。\n\n" +
      "你终于成为了自己想成为的人。",
    bgColor: "#4ECDC4",
    insight: "独立不是逃离，是选择",
  },

  outcome_family_dependent: {
    id: "outcome_family_dependent",
    category: "family",
    title: "啃老族的日常",
    emoji: "😴",
    condition: (stats) => {
      return stats.attributes.family <= 30 && stats.redPacket > 10000;
    },
    description: "你选择了安稳，继续依赖家庭。",
    body:
      "你没有买回程票。\n\n" +
      "妈妈也没催你。\n\n" +
      "你每天睡到自然醒，中午吃妈妈做的红烧肉，下午和爸爸下棋，晚上看电视剧。\n\n" +
      "银行账户的数字每个月都在减少，但你不在乎。\n\n" +
      "「妈，再给我转两千。」你躺在沙发上，头也不抬地说。\n\n" +
      "妈妈叹了口气，但还是转了。\n\n" +
      "你打开朋友圈，看到以前的同事们晒加班、晒升职、晒旅游。\n\n" +
      "你滑过去，继续看电视剧。\n\n" +
      "这是你想要的生活吗？\n\n" +
      "你不确定。\n\n" +
      "但至少，现在很舒服。\n\n" +
      "明天的事，明天再说吧。",
    bgColor: "#95A5A6",
    insight: "舒适区的代价，是失去选择权",
  },

  // ============================================
  // 爱情线（5 种）
  // ============================================
  outcome_romance_reconcile: {
    id: "outcome_romance_reconcile",
    category: "romance",
    title: "破镜重圆",
    emoji: "💕",
    condition: (stats) => {
      return stats.affection.npc_ex_affection >= 80
          && stats.attributes.romance >= 70;
    },
    description: "你和前任重新走到了一起。",
    body:
      "站台的重逢，让你们决定再给彼此一次机会。\n\n" +
      "春节后，TA 真的退了婚。\n\n" +
      "你接到了 TA 的电话：「我退了。你……愿意给我一次机会吗？」\n\n" +
      "你沉默了很久，最后说：「我愿意。」\n\n" +
      "三个月后，TA 来到深圳，租了你隔壁的房间。\n\n" +
      "你们开始重新约会，像当年一样。\n\n" +
      "去那家你们大学时常去的小店，吃那碗你们都爱吃的牛肉面。\n\n" +
      "TA 说：「这次，我不会再放手了。」\n\n" +
      "你看着 TA 的眼睛，相信了。\n\n" +
      "一年后，你们在深圳买了自己的小房子。\n\n" +
      "搬家那天，TA 在客厅里放了一首《因为爱情》。\n\n" +
      "你笑了。\n\n" +
      "原来，兜兜转转，还是你。",
    bgColor: "#E91E63",
    insight: "有些人的出现，是为了陪你走完这一生",
  },

  outcome_romance_blind_date_success: {
    id: "outcome_romance_blind_date_success",
    category: "romance",
    title: "相亲成功",
    emoji: "💍",
    condition: (stats) => {
      return stats.affection.npc_blind_date_affection >= 80
          && stats.attributes.career >= 50;
    },
    description: "相亲对象竟然很合适，你们决定试试看。",
    body:
      "咖啡馆的那次长谈，让你发现这个人……其实挺有意思的。\n\n" +
      "你回了深圳，林晓偶尔会发消息过来。\n\n" +
      "有时候是分享一首歌，有时候是吐槽她妈又给她介绍对象了，有时候就是一句「今天天气不错」。\n\n" +
      "你们慢慢聊了起来。\n\n" +
      "清明，她真的来深圳出差了。你们见了面，吃了顿饭，又去了那家咖啡馆。\n\n" +
      "分别的时候，她说：「我觉得我们挺合适的。」\n\n" +
      "你笑了：「我也这么觉得。」\n\n" +
      "一年后，你们订婚了。\n\n" +
      "她辞去了县城的工作，来到深圳，成为了你的另一半。\n\n" +
      "妈妈逢人就说：「我儿媳妇可好了！」\n\n" +
      "婚后的生活很平淡，但很踏实。",
    bgColor: "#FF9800",
    insight: "婚姻的本质，是过日子",
  },

  outcome_romance_single_happy: {
    id: "outcome_romance_single_happy",
    category: "romance",
    title: "单身贵族",
    emoji: "✨",
    condition: (stats) => {
      return stats.attributes.independence >= 70
          && stats.affection.npc_ex_affection < 50
          && stats.affection.npc_blind_date_affection < 50;
    },
    description: "你选择了单身，享受一个人的精彩。",
    body:
      "回到大城市，你感觉前所未有的轻松。\n\n" +
      "你把家里催婚的电话都设置成了静音。\n\n" +
      "每天下班后，你做饭、看书、跑步、学一门新的语言。\n\n" +
      "周末的时候，你一个人去爬山、去看展、去吃一顿好的。\n\n" +
      "偶尔你会感到孤独，但大多数时候，你很享受。\n\n" +
      "35 岁那年，你还是单身，但你很快乐。\n\n" +
      "你养了只猫，买了套大房子，每年出国旅行两次。\n\n" +
      "妈妈从最初的反对到最后的接受——你说服了他们。\n\n" +
      "「妈，我一个人过得很好。」你说。\n\n" +
      "妈妈叹了口气：「好，只要你开心就好。」\n\n" +
      "你笑了。\n\n" +
      "单身不是失败，是主动选择。",
    bgColor: "#9C27B0",
    insight: "单身不是失败，是主动选择",
  },

  outcome_romance_flash_marriage_regret: {
    id: "outcome_romance_flash_marriage_regret",
    category: "romance",
    title: "闪婚后悔",
    emoji: "😰",
    condition: (stats) => {
      return stats.affection.npc_blind_date_affection >= 90
          && stats.attributes.resilience < 40;
    },
    description: "一时冲动订了婚，后来才发现彼此并不了解……",
    body:
      "订婚宴上，你看着未婚妻的脸，突然感到一阵陌生。\n\n" +
      "你们认识才三个月。\n\n" +
      "春节相亲、微信聊天、清明见面、五一订婚——一切都像被人按了快进键。\n\n" +
      "妈妈说「趁热打铁」，闺蜜说「他人不错就定下来吧」，你说「再想想」，但没人听。\n\n" +
      "于是你订婚了。\n\n" +
      "订婚那天，你穿着租来的西装，笑着说「我愿意」。\n\n" +
      "但晚上回到家，你一个人坐在空房间里，突然想哭。\n\n" +
      "你发现你根本不了解她。\n\n" +
      "你喜欢吃什么，她不知道；她的梦想是什么，你不清楚；你们吵架的时候会怎么样，你们没试过。\n\n" +
      "你开始后悔了。\n\n" +
      "但婚期已定，请柬已发。\n\n" +
      "你只能硬着头皮往前走。\n\n" +
      "希望这不是一个错误的决定。",
    bgColor: "#795548",
    insight: "冲动是魔鬼，婚姻需要时间",
  },

  outcome_romance_long_distance: {
    id: "outcome_romance_long_distance",
    category: "romance",
    title: "异地恋",
    emoji: "📱",
    condition: (stats) => {
      return (stats.affection.npc_ex_affection >= 60 || stats.affection.npc_blind_date_affection >= 60)
          && stats.attributes.career >= 60;
    },
    description: "虽然分隔两地，但你们决定试一试。",
    body:
      "火车上，你收到了 TA 的消息。\n\n" +
      "「到哪儿了？」\n\n" +
      "你回复：「刚过武汉。」\n\n" +
      "「好。注意安全。」\n\n" +
      "你们就这样，隔着 1500 公里，开始了一段异地恋。\n\n" +
      "每天晚上视频，说的都是些鸡毛蒜皮的小事。\n\n" +
      "「今天吃了什么？」「加班到几点？」「同事又怎么了？」\n\n" +
      "但你知道，这种平淡的幸福，很珍贵。\n\n" +
      "每个月，你飞去看 TA，或者 TA 飞来看你。\n\n" +
      "机场的告别越来越短，相聚的时光越来越甜。\n\n" +
      "两年后，你们中的一个人，做出了让步。\n\n" +
      "TA 辞去了县城的工作，来到你的城市。\n\n" +
      "异地恋，终于熬到了头。",
    bgColor: "#00BCD4",
    insight: "距离不是问题，爱才是",
  },

  // ============================================
  // 事业线（4 种）
  // ============================================
  outcome_career_promotion: {
    id: "outcome_career_promotion",
    category: "career",
    title: "升职加薪",
    emoji: "📈",
    condition: (stats) => {
      return stats.attributes.career >= 80
          && stats.affection.npc_mom_affection >= 50;
    },
    description: "事业有成，得到了领导的赏识。",
    body:
      "回到公司的第一天，老板告诉你：「今年公司有个 VP 的位子，我想让你来试试。」\n\n" +
      "你愣了。\n\n" +
      "「我？」\n\n" +
      "「对，就是你。」老板笑了，「这两年你的努力，我都看在眼里。」\n\n" +
      "你坐在办公室里，看着窗外的城市。\n\n" +
      "五年了，你从一个普通员工，做到了现在的位置。\n\n" +
      "加班、出差、提案、汇报……\n\n" +
      "那些睡不着的夜晚，那些改不完的方案，那些被否定的方案，终于都值了。\n\n" +
      "你给妈妈打了个电话：「妈，我升职了。」\n\n" +
      "电话那头，妈妈哭了：「好孩子，妈为你骄傲。」\n\n" +
      "你看着窗外，眼泪也流了下来。\n\n" +
      "这一刻，所有的辛苦，都值了。",
    bgColor: "#4CAF50",
    insight: "努力终会被看见",
  },

  outcome_career_hometown_startup: {
    id: "outcome_career_hometown_startup",
    category: "career",
    title: "回乡创业",
    emoji: "🏡",
    condition: (stats) => {
      return stats.attributes.career >= 60
          && stats.affection.npc_mom_affection >= 60
          && stats.flags.completed_grandma_wish === true;
    },
    description: "你决定留在家乡，陪伴父母的同时创业。",
    body:
      "你拨通了老板的电话：「我想辞职。」\n\n" +
      "电话那头沉默了。\n\n" +
      "「想好了？」\n\n" +
      "「想好了。」\n\n" +
      "你回到了老家，那个你曾经拼命想逃离的小县城。\n\n" +
      "你用这几年的积蓄，加上妈妈的养老金，在县城开了一家小店。\n\n" +
      "生意不大，但每天回家，妈妈都做好了饭。\n\n" +
      "周末的时候，你带妈妈去商场，给她买衣服。\n\n" +
      "奶奶生日那天，你给她办了一个大寿。\n\n" +
      "奶奶拉着你的手，眼眶红了：「孩子，你真的长大了。」\n\n" +
      "你笑了。\n\n" +
      "原来，回到家乡，也不是一件坏事。\n\n" +
      "你找到了属于自己的位置。",
    bgColor: "#8BC34A",
    insight: "回家，也是一种出发",
  },

  outcome_career_quit_dream: {
    id: "outcome_career_quit_dream",
    category: "career",
    title: "裸辞追梦",
    emoji: "🌟",
    condition: (stats) => {
      return stats.attributes.independence >= 85
          && stats.attributes.resilience >= 70;
    },
    description: "你辞掉了工作，开始追求自己真正想做的事。",
    body:
      "提交辞呈的那一刻，你感到前所未有的自由。\n\n" +
      "HR 问你：「下一份工作找好了吗？」\n\n" +
      "你笑着说：「不找了。」\n\n" +
      "你存了两年的钱，足够你撑一年。\n\n" +
      "这一年，你想去做一些一直想做但没做的事。\n\n" +
      "写一本小说、做一个视频账号、骑行川藏线、学潜水……\n\n" +
      "你列了一个清单，100 件事。\n\n" +
      "一年后，你完成了 73 件。\n\n" +
      "钱花完了，但你的人生，充实了。\n\n" +
      "你重新找工作，但这次，你知道自己想要什么了。\n\n" +
      "你找到了一个既能养活自己，又不违背初心的方向。\n\n" +
      "你感谢那一年的自己。",
    bgColor: "#FF5722",
    insight: "人生需要暂停键",
  },

  outcome_career_lie_flat: {
    id: "outcome_career_lie_flat",
    category: "career",
    title: "躺平摆烂",
    emoji: "🛋️",
    condition: (stats) => {
      return stats.attributes.resilience < 35
          && stats.redPacket < 500;
    },
    description: "你选择了放弃，不想再内卷了。",
    body:
      "你躺在老家的沙发上，什么都不想做。\n\n" +
      "手机响了，是老板的电话。\n\n" +
      "你按掉。\n\n" +
      "又响了。\n\n" +
      "你把手机扔到一边。\n\n" +
      "窗外，阳光很好。但你不想出门。\n\n" +
      "你打开外卖软件，点了份 28 块的麻辣烫。\n\n" +
      "吃完，你继续躺。\n\n" +
      "你妈进来，看了你一眼：「你到底想怎么样？」\n\n" +
      "你翻了个身，背对着她。\n\n" +
      "你不想怎么样。你只是累了。\n\n" +
      "内卷、加班、KPI、末位淘汰……\n\n" +
      "你受够了。\n\n" +
      "但躺平之后，你发现更累了。\n\n" +
      "你不知道接下来该怎么办。\n\n" +
      "也许，明天再说吧。",
    bgColor: "#607D8B",
    insight: "躺平不是解药，是麻醉剂",
  },
};

// ===== 兼容旧调用：endings 数组（保留 endings.js 旧接口） =====
// 导出时按需求组装，引擎不会再依赖这个数组
export const endings = Object.values(OUTCOMES);

// =================================================
// 辅助函数
// =================================================

/**
 * 评估玩家应触发的结局（按优先级：mixed → family → romance → career）
 * @param {Object} stats - computeStats 投影后的 stats
 * @returns {Object} outcome
 */
export function evaluateEnding(stats) {
  for (const category of OUTCOME_CATEGORIES) {
    for (const outcome of Object.values(OUTCOMES)) {
      if (outcome.category === category) {
        try {
          if (outcome.condition(stats)) return outcome;
        } catch (e) {
          console.warn(`[outcomes] 条件出错: ${outcome.id}`, e);
        }
      }
    }
  }
  return DEFAULT_OUTCOME;
}

/**
 * 按 ID 获取结局
 * @param {string} id
 * @returns {Object|null}
 */
export function getOutcomeById(id) {
  return OUTCOMES[id] || null;
}

/**
 * 获取指定分类的所有结局
 * @param {string} category - family/romance/career/mixed
 * @returns {Array}
 */
export function getOutcomesByCategory(category) {
  return Object.values(OUTCOMES).filter((o) => o.category === category);
}

/**
 * 获取所有结局的摘要列表
 * @returns {Array<{id, title, category, emoji}>}
 */
export function getOutcomeSummaries() {
  return Object.values(OUTCOMES).map((o) => ({
    id: o.id,
    title: o.title,
    category: o.category,
    emoji: o.emoji,
    description: o.description,
    bgColor: o.bgColor,
  }));
}

/**
 * 结局统计
 */
export const stats = {
  total: Object.keys(OUTCOMES).length,
  byCategory: {
    mixed: Object.values(OUTCOMES).filter((o) => o.category === "mixed").length,
    family: Object.values(OUTCOMES).filter((o) => o.category === "family").length,
    romance: Object.values(OUTCOMES).filter((o) => o.category === "romance").length,
    career: Object.values(OUTCOMES).filter((o) => o.category === "career").length,
  },
};
