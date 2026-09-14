// data/crisis_events.js
// 15 个高压随机危机事件库
// 设计原则：
//   - 高压情境（老板电话/前任来电/亲戚借钱等），迫使玩家做艰难选择
//   - 每个事件 2-3 个选项，每个选项有明确的多维属性 / 好感度 / 资源 effects
//   - 部分选项有 skillCheck（技能检定），根据玩家属性是否达标，输出 success/fail 反馈
//   - 适配项目现有数据模型：
//       * NPC 好感度 → stats.npcs.npc_xxx
//       * 自定义属性 → stats.attributes.{career|family|independence|resilience|romance|energy}
//       * 资源：stats.redPacket（现金）/ stats.socialDebt（人情）
//       * 标记：stats.flags.xxx = true
//       * 天数：stats.day >= N
//   - effects 数组元素格式：{ type, target, delta }
//       type ∈ {"attr", "affection", "energy", "redPacket", "socialDebt", "flag"}
//   - skillCheck 格式：{ attr: "resilience", difficulty: 50, label: "应对老板施压" }
//   - feedback 可以是字符串（无条件反馈）或 { success, fail } 对象（带技能检定）

import { getAttribute, getNpcAffinity, getRedPacket, hasFlag } from "../js/engine/statSystem.js";

// 条件函数工具：调用 statSystem 辅助函数
const C = {
  attr:   (name, val)   => (stats) => getAttribute(stats, name) >= val,
  npc:    (id, val)     => (stats) => getNpcAffinity(stats, id) >= val,
  cash:   (val)         => (stats) => getRedPacket(stats) >= val,
  day:    (val)         => (stats) => (stats.day ?? 1) >= val,
  flag:   (key, val=true) => (stats) => hasFlag(stats, key) === val,
  notFlag: (key)        => (stats) => !hasFlag(stats, key),
  and:    (...fns)      => (stats) => fns.every(fn => fn(stats)),
  or:     (...fns)      => (stats) => fns.some(fn => fn(stats)),
  always: ()            => () => true,
};

// 快速生成 attr 效果
const a = (target, delta) => ({ type: "attr", target, delta });
// 快速生成 affection 效果（target 可省略 _affection 后缀）
const af = (npcId, delta) => ({ type: "affection", target: npcId, delta });
// 资源效果
const e = (delta) => ({ type: "energy", delta });
const rp = (delta) => ({ type: "redPacket", delta });
const sd = (delta) => ({ type: "socialDebt", delta });
// flag 设置
const fl = (key, value = true) => ({ type: "flag", key, value });

export const CRISIS_EVENTS = [
  // ===================================================
  // 危机1：老板夺命连环Call
  // ===================================================
  {
    id: "crisis_boss_call",
    title: "老板的夺命连环Call",
    emoji: "📞",
    triggerWeight: 3,
    condition: C.attr("career", 50),
    body: "你在老家正吃着年夜饭，手机突然响了——是老板。\"小X啊，有个紧急方案需要你处理一下，明天一早给我……\"",
    choices: [
      {
        text: "答应加班，连夜赶方案",
        energyCost: 35,
        effects: [a("career", 15), a("family", -20), af("npc_mom", -25)],
        feedback: "你熬夜到凌晨三点赶完了方案，但妈妈很失望。",
      },
      {
        text: "礼貌拒绝，说信号不好",
        energyCost: 5,
        skillCheck: { attr: "resilience", difficulty: 45, label: "应对老板施压" },
        effects: [a("career", -5), a("independence", 10), a("family", 10)],
        feedback: {
          success: "老板虽然不高兴，但也没再找你。家人对你刮目相看。",
          fail: "老板年后找你谈话，给你绩效打了折扣。",
        },
      },
    ],
  },

  // ===================================================
  // 危机2：前任醉酒深夜来电
  // ===================================================
  {
    id: "crisis_ex_drunk_call",
    title: "前任的深夜电话",
    emoji: "🌙",
    triggerWeight: 4,
    condition: C.npc("npc_ex", 40),
    body: "凌晨一点，你的手机响了——是前任。电话那头传来带着哭腔的声音：\"我喝多了……能来接我吗？\"",
    choices: [
      {
        text: "立刻去接TA",
        energyCost: 30,
        effects: [af("npc_ex", 30), a("romance", 15), e(-30)],
        feedback: "你接回了前任，陪TA坐了一整夜。TA靠在你肩上睡着了……",
      },
      {
        text: "让TA打车回家，注意安全",
        energyCost: 5,
        effects: [af("npc_ex", -10), a("independence", 10)],
        feedback: "前任挂了电话，你翻来覆去睡不着。",
      },
      {
        text: "不接电话，当作没听见",
        energyCost: 0,
        effects: [af("npc_ex", -25), a("resilience", 5)],
        feedback: "第二天前任发来消息：\"对不起打扰了。\"然后删掉了你的微信。",
      },
    ],
  },

  // ===================================================
  // 危机3：亲戚借钱
  // ===================================================
  {
    id: "crisis_relative_borrow",
    title: "远房亲戚借钱",
    emoji: "💰",
    triggerWeight: 3,
    condition: C.cash(3000),
    body: "大伯拉着你的手说：\"侄儿啊，我家儿子结婚缺点钱，能借5000块吗？过完年就还你。\"",
    choices: [
      {
        text: "爽快借出5000",
        energyCost: 5,
        effects: [rp(-5000), sd(1), a("family", 15)],
        feedback: "大伯感激不尽，说你是自家人。",
      },
      {
        text: "借1000意思一下",
        energyCost: 5,
        effects: [rp(-1000), a("family", 5)],
        feedback: "大伯有些失望，但还是收下了。",
      },
      {
        text: "找借口拒绝",
        energyCost: 10,
        skillCheck: { attr: "resilience", difficulty: 50, label: "拒绝亲戚" },
        effects: [a("family", -15)],
        feedback: {
          success: "大伯悻悻而去。",
          fail: "大伯在亲戚群里说你\"在大城市混好了就不认亲戚了\"。",
        },
      },
    ],
  },

  // ===================================================
  // 危机4：同学会炫富攀比
  // ===================================================
  {
    id: "crisis_classmate_flex",
    title: "同学会的隐形战场",
    emoji: "🏆",
    triggerWeight: 4,
    condition: C.day(4),
    body: "初中同学群里有人发了聚会的照片——保时捷大合影。配文：\"每年这个时候最开心，和老同学们聚聚。\"",
    choices: [
      {
        text: "晒出你的年终奖截图",
        energyCost: 10,
        skillCheck: { attr: "career", difficulty: 55, label: "炫富反击" },
        effects: [a("career", 10), a("resilience", -5)],
        feedback: {
          success: "群里突然安静了。你赢了这场攀比，但感觉有点空虚。",
          fail: "同学回了一句：\"不错嘛，那辆是什么车？\"",
        },
      },
      {
        text: "潜水不回复",
        energyCost: 0,
        effects: [a("resilience", 10)],
        feedback: "你默默关掉了手机，眼不见为净。",
      },
    ],
  },

  // ===================================================
  // 危机5：相亲对象是妈宝
  // ===================================================
  {
    id: "crisis_date_mama_boy",
    title: "相亲对象露出马脚",
    emoji: "😳",
    triggerWeight: 2,
    condition: C.and(C.npc("npc_blind_date", 40), C.notFlag("exposed_mama_boy")),
    body: "和林晓/张伟聊天时，你注意到TA每隔几分钟就要看手机，然后回复：\"我妈说……\"\"我妈觉得……\"",
    choices: [
      {
        text: "当场指出：你是不是什么都听你妈的？",
        energyCost: 15,
        skillCheck: { attr: "resilience", difficulty: 60, label: "直接对质" },
        effects: [af("npc_blind_date", -20), a("independence", 10), fl("exposed_mama_boy", true)],
        feedback: {
          success: "林晓/张伟愣住了，然后苦笑：\"你真的很直接。\"你们的关系反而更真实了。",
          fail: "TA生气了：\"你怎么能这么说我妈？\"提前结束了约会。",
        },
      },
      {
        text: "委婉表达：我觉得两个人应该有自己的想法",
        energyCost: 10,
        effects: [af("npc_blind_date", -5), a("independence", 5)],
        feedback: "TA若有所思，但没有正面回应。",
      },
      {
        text: "忍一忍，继续聊下去",
        energyCost: 5,
        effects: [af("npc_blind_date", 5), a("resilience", -5)],
        feedback: "你选择忍耐，但心里知道这个人可能不适合你。",
      },
    ],
  },

  // ===================================================
  // 危机6：奶奶摔倒
  // ===================================================
  {
    id: "crisis_grandma_fall",
    title: "奶奶摔倒了！",
    emoji: "🆘",
    triggerWeight: 2,
    condition: C.npc("npc_grandma", 50),
    body: "你在客厅听到卫生间传来一声闷响——是奶奶摔倒了！奶奶年纪大了，这一摔可不轻……",
    choices: [
      {
        text: "立刻拨打120",
        energyCost: 30,
        effects: [af("npc_grandma", 25), a("family", 15), rp(-500)],
        feedback: "救护车来了，所幸只是扭伤。奶奶握着你的手说：\"还好有你在。\"",
      },
      {
        text: "先扶奶奶起来，问问情况",
        energyCost: 20,
        skillCheck: { attr: "career", difficulty: 40, label: "紧急处置" },
        effects: [af("npc_grandma", 10)],
        feedback: {
          success: "你扶起奶奶，检查了一下，还好只是皮外伤。",
          fail: "你扶奶奶时动作不当，奶奶痛得叫了一声。",
        },
      },
    ],
  },

  // ===================================================
  // 危机7：爸爸喝醉耍酒疯
  // ===================================================
  {
    id: "crisis_dad_drunk",
    title: "爸爸喝多了",
    emoji: "🍶",
    triggerWeight: 3,
    condition: C.day(2),
    body: "年夜饭上，爸爸喝了几杯后开始说胡话：当着全家人的面数落你\"在大城市混了这么多年，连个对象都没有！\"",
    choices: [
      {
        text: "摔筷子离席",
        energyCost: 5,
        effects: [a("independence", 15), af("npc_dad", -20), a("resilience", -10)],
        feedback: "你夺门而出，妈妈追了出来……",
      },
      {
        text: "忍下这口气，低头吃饭",
        energyCost: 5,
        effects: [a("resilience", 10), af("npc_dad", 5)],
        feedback: "爸爸说完也就忘了，第二天像什么都没发生一样。",
      },
      {
        text: "笑着化解：爸，我这不是在找嘛",
        energyCost: 10,
        skillCheck: { attr: "resilience", difficulty: 50, label: "化解尴尬" },
        effects: [a("resilience", 15), a("family", 10), af("npc_dad", 5)],
        feedback: {
          success: "爸爸被逗笑了，气氛缓和下来。",
          fail: "爸爸不依不饶：\"找什么找，相亲不是最靠谱的吗？\"",
        },
      },
    ],
  },

  // ===================================================
  // 危机8：前任父母来访
  // ===================================================
  {
    id: "crisis_ex_parents_visit",
    title: "前任的父母找上门",
    emoji: "🚪",
    triggerWeight: 2,
    condition: C.npc("npc_ex", 60),
    body: "你正在家里，前任的父母突然来访，表情严肃地坐在沙发上。",
    choices: [
      {
        text: "认真听他们说什么",
        energyCost: 20,
        effects: [af("npc_ex", 10), a("resilience", 10)],
        feedback: "前任父母希望你不要再来打扰前任的生活。",
      },
      {
        text: "礼貌送客",
        energyCost: 10,
        effects: [af("npc_ex", -10), a("independence", 10)],
        feedback: "前任知道后很生气，觉得你不尊重TA的父母。",
      },
    ],
  },

  // ===================================================
  // 危机9：初中暗恋对象出现
  // ===================================================
  {
    id: "crisis_school_crush",
    title: "当年的白月光",
    emoji: "🌸",
    triggerWeight: 3,
    condition: C.attr("romance", 40),
    body: "亲戚聚会上，你看到了一个熟悉的身影——是初中时暗恋的小雪/阿杰。TA也看到你了，笑着走过来打招呼……",
    choices: [
      {
        text: "主动和TA多聊几句",
        energyCost: 20,
        effects: [a("romance", 20), fl("met_school_crush", true)],
        feedback: "你们交换了微信，约好有空再聚。",
      },
      {
        text: "假装没看见，躲开了",
        energyCost: 5,
        effects: [a("romance", -5)],
        feedback: "你躲开了，但心里有些遗憾。",
      },
    ],
  },

  // ===================================================
  // 危机10：钱包丢了
  // ===================================================
  {
    id: "crisis_wallet_lost",
    title: "钱包不翼而飞",
    emoji: "😱",
    triggerWeight: 2,
    condition: C.always(),
    body: "你去超市买东西时发现钱包不见了——里面有现金、银行卡、身份证……",
    choices: [
      {
        text: "回超市找",
        energyCost: 20,
        skillCheck: { attr: "resilience", difficulty: 40, label: "寻物" },
        effects: [e(-15)],
        feedback: {
          success: "好心人捡到交给了客服，你虚惊一场。",
          fail: "钱包真的丢了，只能挂失银行卡。",
        },
      },
      {
        text: "打电话挂失，认栽",
        energyCost: 10,
        effects: [rp(-500), a("resilience", 5)],
        feedback: "你花了500块补办了证件。",
      },
    ],
  },

  // ===================================================
  // 危机11：手机摔坏
  // ===================================================
  {
    id: "crisis_phone_broken",
    title: "手机屏幕碎了",
    emoji: "📱",
    triggerWeight: 2,
    condition: C.always(),
    body: "你不小心把手机摔了，屏幕碎成蜘蛛网。抢红包、刷视频、联系家人都成了问题……",
    choices: [
      {
        text: "在镇上修手机",
        energyCost: 15,
        effects: [rp(-300)],
        feedback: "修好了，花了300块，但屏幕不太灵敏了。",
      },
      {
        text: "用旧手机凑合几天",
        energyCost: 5,
        effects: [a("independence", 5)],
        feedback: "你翻出了家里抽屉里的备用机，功能有限但能用。",
      },
    ],
  },

  // ===================================================
  // 危机12：被拉进相亲群
  // ===================================================
  {
    id: "crisis_mom_dating_group",
    title: '被拉进"本地优质青年"相亲群',
    emoji: "👥",
    triggerWeight: 4,
    condition: C.and(C.day(3), C.npc("npc_mom", 50)),
    body: "妈妈把你拉进了一个微信群——\"XX镇优质单身青年交友群\"，里面有100多号人。每天都有人发征婚信息……",
    choices: [
      {
        text: "在群里发自拍和简历",
        energyCost: 15,
        effects: [af("npc_mom", 15), a("resilience", -10)],
        feedback: "妈妈很满意，群里的阿姨们纷纷给你介绍对象。",
      },
      {
        text: "潜水不说话",
        energyCost: 0,
        effects: [af("npc_mom", -10)],
        feedback: "妈妈抱怨你：\"进群了也不说话，真是的！\"",
      },
      {
        text: "找借口退出群",
        energyCost: 10,
        skillCheck: { attr: "independence", difficulty: 55, label: "拒绝妈妈" },
        effects: [af("npc_mom", -15), a("independence", 10)],
        feedback: {
          success: "妈妈虽然不高兴，但也拿你没办法。",
          fail: "妈妈把你的手机抢过去，又把你加回了群。",
        },
      },
    ],
  },

  // ===================================================
  // 危机13：被安排连环相亲
  // ===================================================
  {
    id: "crisis_blind_date_marathon",
    title: "春节相亲连环套",
    emoji: "📅",
    triggerWeight: 3,
    condition: C.npc("npc_mom", 60),
    body: "妈妈兴奋地说：\"我已经给你安排了5个相亲对象，从初三到初六，每天一个！\"",
    choices: [
      {
        text: "全盘接受",
        energyCost: 50,
        effects: [af("npc_mom", 25), e(-40), a("resilience", -15), sd(-2)],
        feedback: "你春节期间不是在相亲就是在相亲的路上，累得够呛。",
      },
      {
        text: "接受2个，其他的婉拒",
        energyCost: 25,
        effects: [af("npc_mom", 10), e(-20)],
        feedback: "妈妈虽然有点失望，但也接受了你的选择。",
      },
      {
        text: "全部拒绝",
        energyCost: 10,
        skillCheck: { attr: "independence", difficulty: 65, label: "说服妈妈" },
        effects: [af("npc_mom", -25), a("independence", 15)],
        feedback: {
          success: "妈妈叹了口气：\"好吧，你自己的事你自己做主。\"",
          fail: "妈妈哭了：你是不是嫌弃妈给你介绍的人？\"",
        },
      },
    ],
  },

  // ===================================================
  // 危机14：醉酒后的真心话
  // ===================================================
  {
    id: "crisis_drunk_truth",
    title: "酒后吐真言",
    emoji: "🍺",
    triggerWeight: 3,
    condition: C.day(4),
    body: "和发小聚会时你喝多了，不知不觉说出了心里话：\"其实我真的很想……想留在爸妈身边……\"",
    choices: [
      {
        text: "第二天假装失忆",
        energyCost: 10,
        effects: [a("resilience", -5)],
        feedback: "朋友们打趣你：\"昨晚你说的话可都录下来了！\"",
      },
      {
        text: "大方承认",
        energyCost: 5,
        effects: [a("family", 15), a("resilience", 10)],
        feedback: "朋友们没有笑话你，反而认真和你聊了聊人生选择。",
      },
    ],
  },

  // ===================================================
  // 危机15：错过末班车
  // ===================================================
  {
    id: "crisis_missed_train",
    title: "赶不上回程火车",
    emoji: "🚂",
    triggerWeight: 2,
    condition: C.day(7),
    body: "你算错了时间，到火车站时发现最后一班车已经开走了。现在是初七晚上……",
    choices: [
      {
        text: "打车回城（300块）",
        energyCost: 10,
        effects: [rp(-300), a("career", 5)],
        feedback: "你花了300块打车回城，但好歹按时上班了。",
      },
      {
        text: "多请一天假",
        energyCost: 15,
        skillCheck: { attr: "career", difficulty: 50, label: "请假" },
        effects: [a("career", -10), a("family", 20)],
        feedback: {
          success: "老板批了你的假，你多陪了家人一天。",
          fail: "老板很不高兴，说再请假就要扣全勤。",
        },
      },
      {
        text: "改签明天的票",
        energyCost: 5,
        effects: [a("career", -5), a("family", 10)],
        feedback: "你改签了第二天的票，多陪了家人一个晚上。",
      },
    ],
  },
];

// 导出危机总数（方便调试 / UI 显示）
export const CRISIS_COUNT = CRISIS_EVENTS.length;