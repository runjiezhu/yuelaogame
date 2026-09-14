// side_quests.js - 支线任务数据
// 8条可选支线任务，完成后解锁特殊结局或获得道具

export const SIDE_QUESTS = {
  // ============================================
  // 支线1：奶奶的心愿 - 教奶奶学会用智能手机
  // ============================================
  "sq_grandma_phone": {
    id: "sq_grandma_phone",
    title: "奶奶的愿望",
    desc: "教奶奶学会用智能手机",
    npc: "npc_grandma",
    emoji: "📱",
    steps: [
      {
        id: "sq_gp_step1",
        title: "发现奶奶的困惑",
        trigger: { questId: "quest_cn_02" }, // 除夕年夜饭
        condition: (stats) => (stats.day ?? 1) >= 2,
        body: "除夕一早，奶奶戴着老花镜，对着一部崭新的智能手机发愁...",
        choices: [
          {
            text: "耐心教她用微信视频",
            effects: { independence: 5 },
            affinityChange: { npc_grandma: 20 },
            feedback: "你耐心演示了三遍，奶奶终于学会了...",
            nextStep: "sq_gp_step2"
          },
          {
            text: "简单教她接电话就行",
            effects: {},
            affinityChange: { npc_grandma: 5 },
            feedback: "奶奶叹了口气，把手机收了起来...",
            nextStep: "sq_gp_fail"
          }
        ]
      },
      {
        id: "sq_gp_step2",
        title: "奶奶第一次成功视频",
        trigger: { auto: true },
        condition: (stats) => !!stats.flags?.sq_gp_step1_done,
        body: "奶奶颤抖着手指点开了视频通话，屏幕那头是远在美国的表姐...",
        choices: [
          {
            text: "帮她们录一段视频",
            effects: { family: 10 },
            affinityChange: { npc_grandma: 25 },
            feedback: "奶奶激动得眼眶都红了，连声说：'科技真好啊！'",
            setFlags: { completed_grandma_wish: true },
            reward: { type: "item", id: "grandma_charm", name: "奶奶的平安符", desc: "一次检定必定成功" },
            completion: true
          }
        ]
      },
      {
        id: "sq_gp_fail",
        title: "奶奶放弃了",
        trigger: { auto: true },
        body: "奶奶叹了口气，把手机收了起来...",
        choices: [],
        failed: true
      }
    ],
    reward: { type: "item", id: "grandma_charm", name: "奶奶的平安符", desc: "一次检定必定成功" }
  },

  // ============================================
  // 支线2：爸爸的秘密 - 帮爸爸戒烟
  // ============================================
  "sq_dad_smoking": {
    id: "sq_dad_smoking",
    title: "爸爸的秘密",
    desc: "帮爸爸戒烟",
    npc: "npc_dad",
    emoji: "🚬",
    steps: [
      {
        id: "sq_ds_step1",
        title: "发现爸爸偷偷抽烟",
        trigger: { questId: "quest_cn_02" }, // 除夕夜
        body: "除夕夜，你半夜起来上厕所，看到爸爸一个人坐在阳台上抽烟...",
        choices: [
          {
            text: "坐下来陪爸爸聊聊",
            effects: { family: 10, social: 5 },
            affinityChange: { npc_dad: 20 },
            feedback: "爸爸说起年轻时的故事，提到抽烟是年轻时学来的坏习惯...",
            setFlags: { sq_ds_talked: true },
            nextStep: "sq_ds_step2"
          },
          {
            text: "假装没看见回房间",
            effects: {},
            affinityChange: { npc_dad: -10 },
            feedback: "你悄悄退回房间，心里却有些不是滋味...",
            failed: true
          }
        ]
      },
      {
        id: "sq_ds_step2",
        title: "父子深夜谈心",
        trigger: { auto: true },
        condition: (stats) => !!stats.flags?.sq_ds_talked,
        body: "爸爸说起了年轻时的故事...",
        choices: [
          {
            text: "帮他报名戒烟课程",
            effects: {},
            affinityChange: { npc_dad: 30 },
            feedback: "爸爸有些感动：'好，我试试。'",
            setFlags: { completed_dad_smoking: true },
            reward: { type: "item", id: "dad_cigarette_case", name: "爸爸的旧烟盒", desc: "增加所有NPC初始好感+5" },
            completion: true
          },
          {
            text: "尊重爸爸的习惯",
            effects: {},
            affinityChange: { npc_dad: 10 },
            feedback: "爸爸拍了拍你的肩膀：'谢谢你理解我。'",
            setFlags: { completed_dad_smoking: true },
            completion: true
          }
        ]
      }
    ],
    reward: { type: "item", id: "dad_cigarette_case", name: "爸爸的旧烟盒", desc: "增加所有NPC初始好感+5" }
  },

  // ============================================
  // 支线3：好友的困境 - 帮闺蜜/兄弟走出低谷
  // ============================================
  "sq_bestie_trouble": {
    id: "sq_bestie_trouble",
    title: "好友的烦恼",
    desc: "帮闺蜜/兄弟走出低谷",
    npc: "npc_bestie",
    emoji: "🤝",
    steps: [
      {
        id: "sq_bt_step1",
        title: "好友诉苦",
        trigger: { questId: "quest_cn_05" }, // 初三闺蜜来访
        body: "{{npc_bestie.name}}约你出来喝茶，一脸愁容地倾诉着自己的烦恼...",
        choices: [
          {
            text: "认真倾听，陪她/他度过难关",
            effects: { resilience: 10, social: 5 },
            affinityChange: { npc_bestie: 35 },
            feedback: "{{npc_bestie.name}}紧紧握住你的手：'有你这个朋友真好！'",
            setFlags: { completed_bestie_trouble: true },
            reward: { type: "item", id: "bestie_badge", name: "友谊徽章", desc: "好感度提升效果×1.5" },
            completion: true
          },
          {
            text: "安慰几句，约改天再聊",
            effects: {},
            affinityChange: { npc_bestie: 10 },
            feedback: "{{npc_bestie.name}}理解地笑了笑：'好吧，你先忙。'",
            completion: true
          }
        ]
      }
    ],
    reward: { type: "item", id: "bestie_badge", name: "友谊徽章", desc: "好感度提升效果×1.5" }
  },

  // ============================================
  // 支线4：前任的新欢 - 调查前任是否有了新对象
  // ============================================
  "sq_ex_new_love": {
    id: "sq_ex_new_love",
    title: "前任的新欢？",
    desc: "调查前任是否有了新对象",
    npc: "npc_ex",
    emoji: "🔍",
    steps: [
      {
        id: "sq_en_step1",
        title: "可疑的蛛丝马迹",
        trigger: { questId: "quest_cn_04" }, // 初二同学聚会
        body: "聚会上，你注意到前任手机上有个亲密的备注...",
        choices: [
          {
            text: "直接问前任",
            effects: { resilience: 10 },
            affinityChange: { npc_ex: 5 },
            feedback: "前任坦然地说：'是的，我交往了一个新对象。'",
            skillCheck: { attr: "resilience", difficulty: 50, label: "直面真相" },
            setFlags: { sq_en_asked: true },
            completion: true
          },
          {
            text: "偷偷查手机",
            effects: {},
            affinityChange: { npc_ex: -5 },
            feedback: "你什么都没发现，白跑一趟。",
            skillCheck: { attr: "independence", difficulty: 60, label: "冒险调查" },
            failed: true
          }
        ]
      }
    ]
  },

  // ============================================
  // 支线5：相亲对象的真面目 - 发现相亲对象是妈宝男/拜金女
  // ============================================
  "sq_blind_date_real_face": {
    id: "sq_blind_date_real_face",
    title: "相亲对象的真面目",
    desc: "发现相亲对象是妈宝男/拜金女",
    npc: "npc_blind_date",
    emoji: "🎭",
    steps: [
      {
        id: "sq_bd_step1",
        title: "相亲对象的破绽",
        trigger: { questId: "quest_cn_07" }, // 初五相亲
        body: "和林晓再见面时，你注意到一些奇怪的地方...",
        choices: [
          {
            text: "跟踪调查一下",
            effects: { independence: 15 },
            affinityChange: { npc_blind_date: -10 },
            feedback: "你发现林晓其实是个妈宝女！什么事都要问妈妈的意见...",
            skillCheck: { attr: "independence", difficulty: 55, label: "揭开真相" },
            setFlags: { sq_bd_revealed: true },
            completion: true
          },
          {
            text: "保持现状，慢慢了解",
            effects: {},
            affinityChange: { npc_blind_date: 5 },
            feedback: "也许是你多想了，还是慢慢来吧。",
            completion: true
          }
        ]
      }
    ]
  },

  // ============================================
  // 支线6：童年玩伴 - 重逢小时候的邻居
  // ============================================
  "sq_childhood_friend": {
    id: "sq_childhood_friend",
    title: "童年玩伴",
    desc: "重逢小时候的邻居",
    npc: null,
    emoji: "🚗",
    steps: [
      {
        id: "sq_cf_step1",
        title: "偶遇发小",
        trigger: { questId: "quest_cn_04" }, // 初二
        body: "在街上，你偶遇了小时候的玩伴阿志...",
        choices: [
          {
            text: "请他喝杯咖啡叙叙旧",
            effects: { family: 15, social: 10 },
            affinityChange: {},
            feedback: "阿志感慨地说：'还记得小时候一起抓知了吗？'",
            setFlags: { completed_childhood_friend: true },
            reward: { type: "item", id: "toy_car", name: "童年玩具车", desc: "回忆杀的钥匙道具" },
            completion: true
          },
          {
            text: "寒暄几句就告别",
            effects: {},
            affinityChange: {},
            feedback: "你们交换了联系方式，约定以后常联系。",
            completion: true
          }
        ]
      }
    ],
    reward: { type: "item", id: "toy_car", name: "童年玩具车", desc: "回忆杀的钥匙道具" }
  },

  // ============================================
  // 支线7：宠物救援 - 在老家遇到流浪狗
  // ============================================
  "sq_pet_rescue": {
    id: "sq_pet_rescue",
    title: "流浪狗小黄",
    desc: "在老家遇到流浪狗",
    npc: null,
    emoji: "🐕",
    steps: [
      {
        id: "sq_pr_step1",
        title: "发现流浪狗",
        trigger: { questId: "quest_cn_03" }, // 初三
        body: "在巷子里，你发现了一只脏兮兮的小黄狗，瘦骨嶙峋...",
        choices: [
          {
            text: "收养它",
            effects: { resilience: 10 },
            affinityChange: {},
            feedback: "小黄摇着尾巴蹭你的腿，好像在说'谢谢你'。",
            setFlags: { has_pet: true },
            reward: { type: "item", id: "pet_dog", name: "小黄", desc: "每天给你+5精力" },
            completion: true
          },
          {
            text: "给它买点吃的",
            effects: { resilience: 3 },
            affinityChange: {},
            feedback: "小黄吃完后满足地舔了舔嘴，你心里暖暖的。",
            completion: true
          }
        ]
      }
    ],
    reward: { type: "item", id: "pet_dog", name: "小黄", desc: "每天给你+5精力" }
  },

  // ============================================
  // 支线8：祖屋拆迁 - 参与家庭会议决策
  // ============================================
  "sq_house_demolition": {
    id: "sq_house_demolition",
    title: "祖屋拆迁",
    desc: "参与家庭会议决策",
    npc: "npc_mom",
    emoji: "🏚️",
    steps: [
      {
        id: "sq_hd_step1",
        title: "家庭会议",
        trigger: { questId: "quest_cn_05" }, // 初三
        body: "七大姑八大姨坐满了客厅，讨论老家的祖屋要不要拆迁...",
        choices: [
          {
            text: "支持拆迁，拿补偿款",
            effects: {},
            affinityChange: { npc_mom: -20, npc_dad: -15 },
            feedback: "妈妈说：'祖屋是我们家的根，不能卖！'",
            skillCheck: { attr: "family", difficulty: 60, label: "说服家人" },
            completion: true
          },
          {
            text: "反对拆迁，保护祖屋",
            effects: { family: 15 },
            affinityChange: { npc_mom: 15, npc_dad: 20 },
            feedback: "全家人都支持你的决定，祖屋得以保留。",
            skillCheck: { attr: "family", difficulty: 50, label: "坚守传统" },
            completion: true
          }
        ]
      }
    ],
    reward: { type: "item", id: "house_key", name: "祖屋钥匙", desc: "解锁隐藏结局" }
  }
};

// 获取所有支线任务ID
export function getAllSideQuestIds() {
  return Object.keys(SIDE_QUESTS);
}

// 根据ID获取支线任务
export function getSideQuestById(id) {
  return SIDE_QUESTS[id] || null;
}

// 获取支线任务的初始步骤
export function getFirstStep(questId) {
  const quest = SIDE_QUESTS[questId];
  return quest ? quest.steps[0] : null;
}