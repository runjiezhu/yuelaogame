// data/events.js
// 婚恋案例事件库
// 包含两类事件：
// 1. MAIN_QUEST (10条) - 春节主线剧情，按章节顺序推进
// 2. RANDOM (40条) - 散装真实案例风格的事件，包含 NPC 互动
// 所有事件均保留原有的 trigger、phase、choices 结构

import { QUESTS } from './quests.js';
import { NPCS } from './npcs.js';

// ============================================
// 第一部分：MAIN_QUEST 主线事件（10条）
// 将 quests 转换为 event 格式，保持主线连贯性
// ============================================

const MAIN_QUEST_EVENTS = QUESTS.map(quest => ({
  id: `evt_main_${String(quest.chapterIndex).padStart(2, '0')}`,
  title: quest.title,
  sourceCaseId: `MAIN_QUEST_${quest.id}`,
  trigger: quest.trigger,
  phase: quest.phase,
  body: quest.body,
  diagnosis: "",
  npcInvolved: quest.npcInvolved,
  questId: quest.id,
  isMainQuest: true,
  unlockedNext: quest.unlockedNext ? `evt_main_${String(QUESTS.findIndex(q => q.id === quest.unlockedNext) + 1).padStart(2, '0')}` : null,
  choices: quest.choices.map((choice, idx) => ({
    text: choice.text,
    effects: choice.effects,
    tone: choice.tone,
    ...(choice.affinityChange && { affinityChange: choice.affinityChange }),
    ...(choice.consequence && { consequence: choice.consequence })
  }))
}));

// ============================================
// 第二部分：RANDOM 随机事件（40条）
// 包含 NPC 互动的事件（20条）+ 纯随机事件（20条）
// ============================================

const RANDOM_EVENTS = [
  // ============================================
  // NPC 互动事件（20条）- 强制穿插 NPC 复现
  // ============================================

  {
    id: "evt_mom_phone_call",
    title: "妈妈的电话轰炸",
    sourceCaseId: "NPC_INTERACTION_001",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39"],
      cityTiers: ["一线", "新一线", "二线"]
    },
    phase: 1,
    body: "周五晚上九点，你刚加完班回到家，还没来得及换鞋，妈妈的视频电话就打进来了。屏幕上，妈妈穿着那件你去年寄回去的红色睡衣，坐在客厅沙发上。<npc_mom>「下班啦？吃了吗？」<npc_mom>你还没来得及回答，她已经开始数落了：「你看看你，又瘦了！是不是天天吃外卖？我跟你说，外卖不健康，你王阿姨的女儿，每天自己做饭，贤惠得很...」<npc_mom>「妈，我还没吃呢...」<npc_mom>「那你赶紧去吃！别饿着！还有啊，你李阿姨说...」你叹了口气，果然又是相亲那套。",
    diagnosis: "",
    npcInvolved: ["npc_mom"],
    choices: [
      {
        text: "敷衍几句：「妈，我知道了，先吃饭了啊」",
        effects: { confidence: -2, social: -3, age: 0 },
        tone: "conservative",
        affinityChange: { npc_mom: -5 },
        consequence: "妈妈在那边叹了口气：「行吧，你忙你的。周末记得吃饭啊。」挂掉电话，你盯着屏幕发呆。妈妈的微信头像是一张你小时候的照片，她用了三年都没换。"
      },
      {
        text: "认真听她说，偶尔应和几句",
        effects: { confidence: 0, social: 5, age: 0 },
        tone: "aggressive",
        affinityChange: { npc_mom: 10 },
        consequence: "妈妈说了一个小时，从李阿姨的女儿聊到王阿姨的儿子，又聊到你小时候有多听话。你听着听着，突然有点想家。"
      },
      {
        text: "直接说不想听，挂掉电话",
        effects: { confidence: 5, social: -8, age: 0 },
        tone: "idealist",
        affinityChange: { npc_mom: -15 },
        consequence: "你找了个借口挂掉电话，妈妈又发来三条微信问你怎么挂这么快。你把手机调成静音，躺在床上看着天花板。明天还要上班，但你就是不想说话。"
      }
    ]
  },

  {
    id: "evt_dad_drunk_chat",
    title: "爸爸的酒后真言",
    sourceCaseId: "NPC_INTERACTION_002",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["28-30", "31-34", "35-39"],
      cityTiers: ["一线", "新一线", "二线", "三四五线"]
    },
    phase: 2,
    body: "凌晨两点，你被手机震动吵醒。是爸爸发来的微信语音，你点开，听到一阵含糊的声音：<npc_dad>「闺女...爸喝多了...想跟你说几句...」<npc_dad>「你别嫌爸烦...你妈她...她就是嘴硬，其实天天念叨你...」<npc_dad>「你过年能回来吗？爸给你准备了你爱吃的...糖醋排骨...」<npc_dad>语音那头传来妈妈的声音：「你这死老头子，喝这么多干嘛！」然后是一阵嘈杂声，语音断了。你盯着屏幕，犹豫要不要回。爸爸平时是个沉默寡言的人，从不轻易表达感情。",
    diagnosis: "",
    npcInvolved: ["npc_dad"],
    choices: [
      {
        text: "回拨视频电话，看看爸爸怎么样了",
        effects: { confidence: 5, social: 5, age: 0 },
        tone: "conservative",
        affinityChange: { npc_dad: 15, npc_mom: 10 },
        consequence: "视频接通后，爸爸坐在客厅里，茶几上摆着空酒瓶。妈妈在旁边数落他：「喝这么多干嘛，孩子明天还要上班！」爸爸看到你，突然笑了：「没事没事，就是想闺女了。」你的眼眶一下子红了。"
      },
      {
        text: "发条微信：「爸，早点休息，我过年回去」",
        effects: { confidence: 3, social: 3, age: 0 },
        tone: "aggressive",
        affinityChange: { npc_dad: 10 },
        consequence: "爸爸很快回复：「好，爸等你。」后面跟着一个咧嘴笑的表情，是他刚学会用的那种。你放下手机，睡不着了。"
      },
      {
        text: "第二天早上再回，装作没看到",
        effects: { confidence: -5, social: -3, age: 0 },
        tone: "idealist",
        affinityChange: { npc_dad: -10 },
        consequence: "第二天早上你回拨过去，爸爸接了，声音正常了很多：「昨晚喝多了，没事没事。」但你听出他语气里的失落。他肯定是记得昨晚说了什么的。"
      }
    ]
  },

  {
    id: "evt_grandma_new_year_call",
    title: "奶奶的远程视频催婚",
    sourceCaseId: "NPC_INTERACTION_003",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    phase: 1,
    body: "除夕当天，你正在公司值班，手机响了。是奶奶发来的视频通话。你接起来，屏幕上出现奶奶布满皱纹的脸，背景是老家熟悉的客厅。<npc_grandma>「孙女啊！过年好！」<npc_grandma>奶奶的声音洪亮，但你知道她耳背，说话得大声点。<npc_grandma>「你今年回来吗？奶奶给你做好吃的！」<npc_grandma>「奶奶，我值班呢，初二才能回去...」<npc_grandma>「什么？还没找到对象？」<npc_grandma>你哭笑不得，奶奶又听岔了。还没来得及解释，奶奶已经转向旁边的小姑：「我就说嘛，这么大了还不找对象！」小姑在旁边憋笑，你恨不得找个地缝钻进去。",
    diagnosis: "",
    npcInvolved: ["npc_grandma"],
    choices: [
      {
        text: "大声、耐心地跟奶奶解释清楚",
        effects: { confidence: 0, social: 5, age: 0 },
        tone: "conservative",
        affinityChange: { npc_grandma: 10 },
        consequence: "你喊了三遍，奶奶终于听懂了：「哦，值班啊，那初二回来好啊！奶奶给你留着压岁钱！」她笑得像个小孩子，你突然很想快点回家。"
      },
      {
        text: "顺着奶奶的话说：「奶奶，我在找了呢」",
        effects: { confidence: 3, social: 3, age: 0 },
        tone: "aggressive",
        affinityChange: { npc_grandma: 15 },
        consequence: "奶奶眼睛一亮：「真的？是谁？长得怎么样？家里做什么的？」问题像连珠炮一样袭来，你一时招架不住。小姑在旁边笑得更厉害了。"
      },
      {
        text: "找借口挂掉：「奶奶，我先忙了啊」",
        effects: { confidence: 5, social: -5, age: 0 },
        tone: "idealist",
        affinityChange: { npc_grandma: -10 },
        consequence: "奶奶有些失望：「哦，那你去忙吧。记得找对象啊！」挂掉视频，你有些愧疚。奶奶今年78了，还能见几面呢？"
      }
    ]
  },

  {
    id: "evt_bestie_weekend",
    title: "闺蜜的周末约饭",
    sourceCaseId: "NPC_INTERACTION_004",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34"],
      cityTiers: ["一线", "新一线", "二线"]
    },
    phase: 2,
    body: "周六中午，你正在睡懒觉，手机连续震动了好几下。是闺蜜小敏发来的消息：<npc_bestie>「姐妹！中午有空吗！」<npc_bestie>「我发现一家超好吃的餐厅！」<npc_bestie>「必须带你去！有好几个帅哥！」<npc_bestie>你看着最后一条消息，哭笑不得。小敏结婚后就开始热衷于给你介绍对象，每次约饭都会「刚好」叫上她老公的同事或朋友。<npc_bestie>「上次那个怎么样？有没有联系？」<npc_bestie>你想起上周小敏安排的「偶遇」，对方是个程序员，全程低头吃饭，话题只有代码。你婉拒了，小敏还念叨了好几天。",
    diagnosis: "",
    npcInvolved: ["npc_bestie"],
    choices: [
      {
        text: "去赴约，顺便跟小敏聊聊心里话",
        effects: { confidence: 5, social: 8, age: 0 },
        tone: "conservative",
        affinityChange: { npc_bestie: 15 },
        consequence: "你们聊了一下午，从工作聊到生活，从吐槽老板聊到感情困惑。小敏说：「姐妹，你不是不想找，你就是怕受伤。」你愣了一下，好像被说中了什么。"
      },
      {
        text: "去赴约，但不提感情的事",
        effects: { confidence: 3, social: 5, age: 0 },
        tone: "aggressive",
        affinityChange: { npc_bestie: 5 },
        consequence: "你们吃吃喝喝，聊明星八卦，聊最近新出的剧，就是不提感情。小敏最后叹了口气：「算了，你不想聊我就不问了。」但你看出她有点失落。"
      },
      {
        text: "借口加班，不去赴约",
        effects: { confidence: -3, social: -5, age: 0 },
        tone: "idealist",
        affinityChange: { npc_bestie: -10 },
        consequence: "小敏发来一个委屈的表情：「你又放我鸽子！」你有些愧疚，但就是不想出门。你把自己窝在沙发上，刷了一整天的短视频。"
      }
    ]
  },

  {
    id: "evt_ex_sees_wechat",
    title: "前任的朋友圈晒娃",
    sourceCaseId: "NPC_INTERACTION_005",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["28-30", "31-34", "35-39"],
      cityTiers: ["一线", "新一线", "二线"]
    },
    phase: 2,
    body: "周一下班后，你习惯性地刷起朋友圈。第一条是大学同学发的自拍，第二条是同事转发的公众号文章，第三条...你的手指停住了。是陈一凡发的，定位是某个儿童游乐场。照片里，他抱着一个两三岁的小男孩，旁边站着一个你没见过的女人。配文是：「周末遛娃，日常幸福。」<npc_ex>你盯着那张照片看了很久。陈一凡，你的前任，大学初恋，交往两年，最后因为异地分手。当年他说「如果三年后我们都单身，就再在一起」，结果你等了一年，他就晒了结婚证。<npc_ex>评论区一堆老同学点赞留言：「恭喜恭喜！」「小孩子好可爱！」「一凡厉害啊！」你点了根赞，手指却迟迟没有放下。",
    diagnosis: "",
    npcInvolved: ["npc_ex"],
    choices: [
      {
        text: "默默点赞，什么都不说",
        effects: { confidence: 0, social: 0, age: 0 },
        tone: "conservative",
        affinityChange: { npc_ex: 0 },
        consequence: "你点了赞，然后退出朋友圈。那天晚上，你失眠了，翻来覆去睡不着。脑海里一直回放着那张照片，想象着他们的生活。三年了，你以为自己早就释怀了。"
      },
      {
        text: "发微信问他：「最近还好吗？」",
        effects: { confidence: 5, social: 3, age: 0 },
        tone: "aggressive",
        affinityChange: { npc_ex: 10 },
        consequence: "陈一凡很快回复了：「挺好的，你呢？」你们聊了几句，客套而疏离。他问你在深圳怎么样，你问他孩子多大了。他发来一张儿子堆雪人的照片，笑得很开心。你也笑了，但心里有点酸。"
      },
      {
        text: "直接划过去，假装没看到",
        effects: { confidence: 3, social: -2, age: 0 },
        tone: "idealist",
        affinityChange: { npc_ex: -5 },
        consequence: "你快速划过去，点开了下一个视频。是个搞笑段子，你笑了两声，但没看进去内容。那张照片一直在脑海里挥之不去。你打开对话框，想说点什么，最后又关掉了。"
      }
    ]
  },

  {
    id: "evt_blind_date_second_meet",
    title: "相亲对象又联系你",
    sourceCaseId: "NPC_INTERACTION_006",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["28-30", "31-34", "35-39"],
      cityTiers: ["一线", "新一线", "二线", "三四五线"]
    },
    phase: 3,
    body: "晚上九点，你刚洗完澡，手机震动了一下。是林晓发来的微信：<npc_blind_date>「到家了吗？」<npc_blind_date>你愣了一下。春节相亲后，你们加了微信聊过几次，但最近一周没联系了。你以为这件事就这么过去了。<npc_blind_date>「上周听你说你胃不太好，我外婆有个偏方挺好的，你要不要试试？」<npc_blind_date>你看着屏幕，有些意外。上次聊天时，你随口提了一句最近胃不舒服，没想到她记在心里了。<npc_blind_date>「就是普通的胃炎，没事的」<npc_blind_date>「还是要注意身体，不然你爸妈会担心的」<npc_blind_date>你盯着最后那句话，不知道该怎么回复。",
    diagnosis: "",
    npcInvolved: ["npc_blind_date"],
    choices: [
      {
        text: "认真回复，跟她聊聊最近的状况",
        effects: { confidence: 5, social: 5, age: 0 },
        tone: "conservative",
        affinityChange: { npc_blind_date: 15 },
        consequence: "你们聊了快一个小时，从胃炎聊到工作，从工作聊到生活。林晓说：「有时候觉得，一个人在外面漂着挺累的。」你突然觉得，你们好像挺像的。"
      },
      {
        text: "礼貌回复，但不深入聊",
        effects: { confidence: 0, social: 0, age: 0 },
        tone: "aggressive",
        affinityChange: { npc_blind_date: 5 },
        consequence: "你回复：「谢谢关心，好多了。」林晓回了句「那就好」，然后就没下文了。你放下手机，心里有点说不清的感觉。好像错过了什么，又好像什么都没错过。"
      },
      {
        text: "不回复，当作没看到",
        effects: { confidence: -3, social: -5, age: 0 },
        tone: "idealist",
        affinityChange: { npc_blind_date: -10 },
        consequence: "你把手机放到一边，没有回复。林晓也没再发消息。过了几天，你在朋友圈看到她发了一张和朋友聚餐的照片，笑得很开心。你点了赞，但没评论。"
      }
    ]
  },

  {
    id: "evt_mom_photo_share",
    title: "妈妈转发养生文章",
    sourceCaseId: "NPC_INTERACTION_007",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    phase: 1,
    body: "周中的下午，你正在开会，手机连续震动了好几下。你偷偷看了一眼，是妈妈发来的链接：<npc_mom>「震惊！这种东西吃多了会得癌症！」<npc_mom>「转给家人！不看后悔一辈子！」<npc_mom>「女人多吃这个，比敷十张面膜还管用！」<npc_mom>你苦笑不得。妈妈的朋友圈和微信群已经被各种养生谣言占领了，每次你转发「这是假的」的辟谣文章，她都不看。<npc_mom>「妈，这些都是谣言」<npc_mom>「什么谣言？这是专家说的！你不懂！」<npc_mom>你叹了口气，决定放弃争辩。",
    diagnosis: "",
    npcInvolved: ["npc_mom"],
    choices: [
      {
        text: "顺着妈妈，不跟她争",
        effects: { confidence: -2, social: 5, age: 0 },
        tone: "conservative",
        affinityChange: { npc_mom: 10 },
        consequence: "你回了句「好的妈，我注意」，然后把链接收藏起来打算有空再处理。妈妈发了个开心的表情：「这才是妈的乖孩子！」你看着屏幕，有点心酸，妈妈只是想找个理由跟你说话。"
      },
      {
        text: "认真辟谣，发科普文章给她",
        effects: { confidence: 5, social: -3, age: 0 },
        tone: "aggressive",
        affinityChange: { npc_mom: -5 },
        consequence: "你发了一堆辟谣文章，妈妈回了句「你们年轻人就是不信老一辈的智慧」，然后就不再理你了。那天晚上，她发了一条朋友圈：「现在的孩子大了，不听话了。」"
      },
      {
        text: "不回消息，当作没看到",
        effects: { confidence: 0, social: -5, age: 0 },
        tone: "idealist",
        affinityChange: { npc_mom: -10 },
        consequence: "你假装没看到，没回复妈妈的消息。过了两天，妈妈发来一条：「你是不是生妈气了？怎么不理妈？」你连忙回复：「没有，最近忙。」但你知道，妈妈肯定会多想。"
      }
    ]
  },

  {
    id: "evt_dad_birthday",
    title: "爸爸的生日祝福",
    sourceCaseId: "NPC_INTERACTION_008",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    phase: 1,
    body: "今天是你爸的生日。你在早上九点准时发了一条微信：「爸，生日快乐！」配了一个蛋糕的表情。爸爸的回复很简短：「谢谢。」然后是一段长长的沉默。你知道他不会主动聊天，就像他一辈子都不会说「我爱你」一样。<npc_dad>下午六点，你忙完工作，想起给爸爸打个电话。电话那头，爸爸的声音有些沙哑，好像刚睡醒。<npc_dad>「下班啦？」<npc_dad>「嗯。爸，今天吃蛋糕了吗？」<npc_dad>「吃了，你妈买的。很大一个，吃不完。」<npc_dad>「那就好...」<npc_dad>又是沉默。你知道爸爸在等你先挂电话，就像每次通话一样。",
    diagnosis: "",
    npcInvolved: ["npc_dad"],
    choices: [
      {
        text: "主动多聊几句，问问家里的情况",
        effects: { confidence: 5, social: 5, age: 0 },
        tone: "conservative",
        affinityChange: { npc_dad: 15 },
        consequence: "你问爸爸最近身体怎么样，妈妈有没有唠叨，老家的天气冷不冷。爸爸一一回答，话慢慢多了起来。最后他自己挂了电话，还叮嘱你「早点休息，别太累」。"
      },
      {
        text: "简单问候几句，等他先挂电话",
        effects: { confidence: 0, social: 0, age: 0 },
        tone: "aggressive",
        affinityChange: { npc_dad: 5 },
        consequence: "你们聊了几句近况，然后就是沉默。过了十几秒，爸爸说：「行了，你忙你的，爸挂了。」你听到那边妈妈的声音：「让孩子多打会儿嘛！」然后电话就断了。"
      },
      {
        text: "借口忙，挂掉电话",
        effects: { confidence: -3, social: -5, age: 0 },
        tone: "idealist",
        affinityChange: { npc_dad: -10 },
        consequence: "你找了个借口挂掉电话。晚上躺在床上，你有些后悔。爸爸的生日，你连十分钟都没给他。"
      }
    ]
  },

  {
    id: "evt_grandma_health",
    title: "奶奶生病住院",
    sourceCaseId: "NPC_INTERACTION_009",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村"]
    },
    phase: 3,
    body: "周四晚上十点，你突然接到爸爸的电话。这种时间来电，一般都不是什么好事。<npc_dad>「你奶奶住院了。」<npc_dad>你的心一下子揪紧了。<npc_dad>「年纪大了，心脏不太好。医生说没什么大问题，但要住院观察几天。」<npc_dad>你问要不要回去，爸爸说：「先不用，你奶奶说让你好好工作，不用担心。」<npc_grandma>第二天，你打电话给奶奶。奶奶的声音听起来很虚弱，但还在唠叨：「没事没事，奶奶身体好着呢！你不用回来，路费多贵啊...」<npc_grandma>你握着手机，眼眶红了。",
    diagnosis: "",
    npcInvolved: ["npc_grandma", "npc_dad"],
    choices: [
      {
        text: "周末回家看望奶奶",
        effects: { confidence: 5, social: 8, age: 0 },
        tone: "conservative",
        affinityChange: { npc_grandma: 20, npc_dad: 10, npc_mom: 5 },
        consequence: "你请了假，买了周六早上的票回去。奶奶看到你，眼泪一下子就流出来了：「你这孩子，叫你别回来你还回来...」你握着她的手，感觉到她瘦了好多。"
      },
      {
        text: "给奶奶转一笔钱，让她买营养品",
        effects: { confidence: 3, social: 5, age: 0 },
        tone: "aggressive",
        affinityChange: { npc_grandma: 10 },
        consequence: "你转了五千块给妈妈，让她给奶奶买点营养品。奶奶知道后，打电话骂你乱花钱，但语气里是藏不住的开心：「这孩子，有心了。」",
      },
      {
        text: "工作忙，暂时不回去",
        effects: { confidence: -5, social: -8, age: 0 },
        tone: "idealist",
        affinityChange: { npc_grandma: -15, npc_dad: -10 },
        consequence: "你说工作走不开，过段时间再回去。奶奶在电话里说「没事没事」，但你听出她语气里的失落。那天晚上，你失眠了，总想着奶奶躺在病床上的样子。"
      }
    ]
  },

  {
    id: "evt_bestie_pregnant",
    title: "闺蜜怀孕了",
    sourceCaseId: "NPC_INTERACTION_010",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34"],
      cityTiers: ["一线", "新一线", "二线", "三四五线"]
    },
    phase: 2,
    body: "周六下午，小敏约你喝奶茶。你到的时候，她正坐在靠窗的位置，手里捧着一杯温热的红枣茶。<npc_bestie>「姐妹，我要告诉你一个消息！」<npc_bestie>她的眼睛亮亮的，嘴角忍不住上扬。<npc_bestie>「我怀孕了！」<npc_bestie>你愣了一下，然后由衷地替她开心：「真的吗？太好了！」<npc_bestie>小敏摸着肚子，笑得像个傻子：「我老公知道的时候，愣了足足十秒钟，然后抱起我转了三圈，差点把我转吐了...」<npc_bestie>你们聊了很久关于孩子的话题。小敏突然话锋一转：「姐妹，你什么时候啊？咱俩要是差不多时间生孩子，以后还能当娃娃亲！」<npc_bestie>你笑了笑，没有接话。",
    diagnosis: "",
    npcInvolved: ["npc_bestie"],
    choices: [
      {
        text: "真心祝福小敏，聊一些关于孩子的话题",
        effects: { confidence: 3, social: 8, age: 0 },
        tone: "conservative",
        affinityChange: { npc_bestie: 15 },
        consequence: "你们聊了一下午关于育儿的经验，虽然你没什么实战经验，但你认真记下了小敏说的每一条。那天回家，你突然觉得有个孩子好像也不错。"
      },
      {
        text: "有些羡慕，但嘴上不承认",
        effects: { confidence: -3, social: 0, age: 0 },
        tone: "aggressive",
        affinityChange: { npc_bestie: 5 },
        consequence: "你笑着说「恭喜啊」，但心里有点酸。同样是二十八岁，人家都要当妈妈了，你连个男朋友都没有。那天晚上，你一个人在出租屋里喝了点酒。"
      },
      {
        text: "转移话题，不想聊这个",
        effects: { confidence: 0, social: -5, age: 0 },
        tone: "idealist",
        affinityChange: { npc_bestie: -5 },
        consequence: "你把话题岔开，聊小敏老公，聊育儿产品的推荐。小敏看出你在回避，但也没追问。那天分开的时候，她说：「姐妹，你想聊的时候随时找我。」",
      }
    ]
  },

  {
    id: "evt_ex_wedding_invitation",
    title: "前任的婚礼请帖",
    sourceCaseId: "NPC_INTERACTION_011",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["28-30", "31-34", "35-39"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村"]
    },
    phase: 2,
    body: "周一的早上，你刚到公司，打开邮箱，看到一封标题为「婚礼邀请函」的邮件。发件人是陈一凡。<npc_ex>你点开，是一份电子请帖。新郎新娘的照片上，陈一凡穿着西装，笑得灿烂，旁边的新娘温婉可人。请帖上写着：「我们决定结婚了，诚邀您见证我们的幸福时刻。」<npc_ex>你盯着那张照片看了很久。五年了。当年你们分手的时候，他说「等我三年」，结果三年后他娶了别人。<npc_ex>邮件的最后，还有一行小字：「虽然分开了，但还是希望能得到老同学的祝福。」",
    diagnosis: "",
    npcInvolved: ["npc_ex"],
    choices: [
      {
        text: "礼貌回复：「恭喜，祝你们幸福」",
        effects: { confidence: 8, social: 5, age: 0 },
        tone: "conservative",
        affinityChange: { npc_ex: 5 },
        consequence: "你发了祝福，顺便问了问婚礼时间。陈一凡回复：「就在咱们老家办的，你要是有空就来啊。」你笑了笑，没有回复。"
      },
      {
        text: "不回复，当作没看到",
        effects: { confidence: 3, social: -3, age: 0 },
        tone: "idealist",
        affinityChange: { npc_ex: -5 },
        consequence: "你把邮件删了，当作没看到。但那天一整天，你都有些心不在焉，脑子里一直回放着那张婚礼请帖的照片。"
      },
      {
        text: "回复：「我就不去了，红包给你」",
        effects: { confidence: 5, social: 0, age: 0 },
        tone: "aggressive",
        affinityChange: { npc_ex: 0 },
        consequence: "陈一凡回复：「不用不用，人到就行。」你转了五百块钱红包，备注写的是「百年好合」。他收下了，但没再说什么。"
      }
    ]
  },

  {
    id: "evt_blind_date_mom_asks",
    title: "妈妈追问相亲结果",
    sourceCaseId: "NPC_INTERACTION_012",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["28-30", "31-34", "35-39"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村"]
    },
    phase: 3,
    body: "周日晚上八点，你正在刷剧，妈妈的视频电话打过来了。你犹豫了一下，还是接了。<npc_mom>「那个小林，怎么样啊？」<npc_mom>妈妈开门见山，眼睛里满是期待。<npc_mom>「就...聊了几句。」<npc_mom>「聊了几句就没了？你有没有主动点啊？」<npc_mom>「妈，这才认识几天...」<npc_mom>「几天怎么了？你以为好对象会等你啊？你王阿姨的女儿，相亲第三次就领证了！」<npc_mom>你深吸一口气，努力控制自己的情绪。<npc_mom>「妈，我心里有数。」<npc_mom>「你有什么数？你都多大了？妈像你这么大的时候，你都会跑了！」<npc_mom>又是这套话术。你揉了揉太阳穴。",
    diagnosis: "",
    npcInvolved: ["npc_mom"],
    choices: [
      {
        text: "敷衍几句：「妈，我知道了，正在聊呢」",
        effects: { confidence: 0, social: 0, age: 0 },
        tone: "conservative",
        affinityChange: { npc_mom: 5 },
        consequence: "妈妈的语气软了下来：「行，那你上点心啊。妈不是催你，就是担心你。」挂掉电话，你叹了口气。妈妈的话你懂，但感情的事急不来。"
      },
      {
        text: "认真跟妈妈沟通你的想法",
        effects: { confidence: 5, social: 5, age: 0 },
        tone: "aggressive",
        affinityChange: { npc_mom: 10 },
        consequence: "你跟妈妈说了你对感情的看法，说了你在等什么样的人。妈妈听完，沉默了一会儿：「妈不懂你们年轻人的事了...你自己心里有数就行。」"
      },
      {
        text: "直接挂掉，不想听",
        effects: { confidence: -3, social: -8, age: 0 },
        tone: "idealist",
        affinityChange: { npc_mom: -15 },
        consequence: "你找了个借口挂掉电话。妈妈发来一条消息：「妈知道你有压力，但妈也是为你好。」你看着屏幕，眼眶有点红。你知道她是为你好，但你就是喘不过气来。"
      }
    ]
  },

  {
    id: "evt_mom_visits",
    title: "妈妈来大城市看你",
    sourceCaseId: "NPC_INTERACTION_013",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39"],
      cityTiers: ["一线", "新一线", "二线"]
    },
    phase: 2,
    body: "周五下班回家，你刚打开门，就看到门口摆着一大一小两个行李箱。门缝里透出厨房的灯光和油烟的味道。<npc_mom>「回来啦？」妈妈从厨房探出头，围裙都没来得及解。<npc_mom>「妈？你怎么来了？」<npc_mom>「怎么，不欢迎啊？」妈妈笑着说，「我给你带了老家的特产，还有你爱吃的腊肠。」<npc_mom>你有些意外，也有些感动。妈妈说走就走，连招呼都没打，就坐了六个小时的高铁来看你。<npc_mom>「我这不是想你了嘛...」妈妈的声音有些小，「顺便看看你一个人在外面过得怎么样。」<npc_mom>你走进厨房，看到灶台上摆满了菜，都是你小时候爱吃的。",
    diagnosis: "",
    npcInvolved: ["npc_mom"],
    choices: [
      {
        text: "感动地抱住妈妈，陪她好好吃顿饭",
        effects: { confidence: 5, social: 8, age: 0 },
        tone: "conservative",
        affinityChange: { npc_mom: 20 },
        consequence: "你抱住妈妈，发现她好像瘦了。你们一边吃饭一边聊天，妈妈说着老家的八卦，你说着工作的趣事。那一刻，你觉得什么都不重要了。"
      },
      {
        text: "有些意外，问妈妈是不是有什么事",
        effects: { confidence: 0, social: 0, age: 0 },
        tone: "aggressive",
        affinityChange: { npc_mom: 5 },
        consequence: "妈妈摆摆手：「没事没事，就是想你了。」但你注意到她好像瘦了不少，也憔悴了很多。你心里有些担心。"
      },
      {
        text: "有些无奈，觉得妈妈又在催婚",
        effects: { confidence: -3, social: -5, age: 0 },
        tone: "idealist",
        affinityChange: { npc_mom: -10 },
        consequence: "你嘴上不说，但心里有些防备。果然，吃完饭妈妈就开始问你最近有没有认识新的人，有没有聊得来的异性。你有些烦躁，找借口躲进了房间。"
      }
    ]
  },

  {
    id: "evt_dad_works",
    title: "爸爸偷偷给你找关系",
    sourceCaseId: "NPC_INTERACTION_014",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["28-30", "31-34", "35-39"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村"]
    },
    phase: 3,
    body: "一天下班后，你收到爸爸发来的微信：<npc_dad>「闺女，我托人给你找了个对象。」<npc_dad>你愣住了。<npc_dad>「是爸同事的侄子，在你们那边工作，人挺不错的。」<npc_dad>「爸，你怎么不跟我说一声就...」<npc_dad>「这不是想给你个惊喜嘛！你王叔叔说那孩子很优秀，你见见？」<npc_dad>你看着屏幕，不知道该说什么。爸爸平时话不多，没想到背地里还在为你的事操心。<npc_dad>「爸，我的事我自己有数...」<npc_dad>「行行行，你要是不想见就算了。」爸爸的回复有些失落。",
    diagnosis: "",
    npcInvolved: ["npc_dad"],
    choices: [
      {
        text: "答应见见，不想让爸爸失望",
        effects: { confidence: 3, social: 5, age: 0 },
        tone: "conservative",
        affinityChange: { npc_dad: 15, npc_mom: 10 },
        consequence: "爸爸立刻发来对方的联系方式，还附上了照片和家庭情况。你看了下，长得还行，工作也不错。爸爸难得这么积极，你不忍心拒绝。"
      },
      {
        text: "拒绝爸爸，说自己会找",
        effects: { confidence: 5, social: -3, age: 0 },
        tone: "aggressive",
        affinityChange: { npc_dad: -5 },
        consequence: "爸爸叹了口气：「行吧，爸不掺和了。」但你知道，他肯定会在妈妈面前念叨。这件事最后还是传到了妈妈耳朵里，又是一场唠叨。"
      },
      {
        text: "不回复，假装没看到",
        effects: { confidence: -3, social: -5, age: 0 },
        tone: "idealist",
        affinityChange: { npc_dad: -10 },
        consequence: "你没有回复爸爸的消息。过了两天，爸爸又发来一条：「那事你考虑得怎么样了？」你叹了口气，决定还是正面回复一下。"
      }
    ]
  },

  {
    id: "evt_grandma_fallback",
    title: "奶奶说「随便找一个」",
    sourceCaseId: "NPC_INTERACTION_015",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    phase: 2,
    body: "春节在家，晚饭后你和奶奶坐在客厅看电视。奶奶突然拉起你的手，语重心长地说：<npc_grandma>「孩子啊，奶奶也不催你了...」<npc_grandma>你有些意外，以为奶奶终于想通了。<npc_grandma>「你说你也不小了，奶奶也不求你找多好的了...随便找一个，能过日子就行。」<npc_grandma>你看着奶奶布满皱纹的脸，不知道该说什么。<npc_grandma>「趁奶奶还在，还能帮你带带孩子...」<npc_grandma>又是催婚。你苦笑着点点头。",
    diagnosis: "",
    npcInvolved: ["npc_grandma"],
    choices: [
      {
        text: "顺着奶奶说：「奶奶，我会的」",
        effects: { confidence: 0, social: 5, age: 0 },
        tone: "conservative",
        affinityChange: { npc_grandma: 10 },
        consequence: "奶奶满意地点点头，又拉着你说了半天村里的八卦。你听着听着，突然有些心酸。奶奶今年78了，还能等你几年呢？"
      },
      {
        text: "跟奶奶说实话：「奶奶，我不想将就」",
        effects: { confidence: 5, social: 0, age: 0 },
        tone: "aggressive",
        affinityChange: { npc_grandma: 5 },
        consequence: "奶奶愣了一下，然后叹了口气：「行吧，奶奶不懂你们年轻人的事了...你自己开心就好。」你没想到奶奶会这么说，眼眶有点红。"
      },
      {
        text: "沉默不语，不想跟奶奶争论",
        effects: { confidence: -3, social: -3, age: 0 },
        tone: "idealist",
        affinityChange: { npc_grandma: -5 },
        consequence: "你笑了笑，没有说话。奶奶看出你不想聊，叹了口气，转移了话题。那天晚上，你躺在床上想了很多。关于婚姻，关于将就，关于妥协。"
      }
    ]
  },

  {
    id: "evt_bestie_divorce",
    title: "闺蜜要离婚",
    sourceCaseId: "NPC_INTERACTION_016",
    trigger: {
      gender: ["女"],
      ageBands: ["28-30", "31-34", "35-39"],
      cityTiers: ["一线", "新一线", "二线", "三四五线"]
    },
    phase: 3,
    body: "半夜十二点，你被手机铃声吵醒。是小敏发来的微信，只有两个字：「姐妹。」你立刻回了过去。<npc_bestie>「怎么了？」<npc_bestie>电话那头，小敏哭得上气不接下气：「他说要离婚...他说他不爱我了...」<npc_bestie>你一下子清醒了。小敏结婚才两年，之前一直说老公对她很好，怎么会突然...<npc_bestie>「你别哭，慢慢说，到底怎么回事？」<npc_bestie>小敏抽噎着说了半天。大概是她老公最近工作压力大，经常加班，两个人沟通越来越少。今天吵了一架，她老公脱口而出说「这段婚姻是个错误」。<npc_bestie>你握着手机，不知道该说什么。",
    diagnosis: "",
    npcInvolved: ["npc_bestie"],
    choices: [
      {
        text: "安慰小敏，帮她分析问题",
        effects: { confidence: 5, social: 8, age: 0 },
        tone: "conservative",
        affinityChange: { npc_bestie: 15 },
        consequence: "你陪小敏聊了两个小时，帮她分析问题出在哪里。最后你说：「你先别急着下结论，等他冷静下来再好好谈谈。」小敏慢慢平静下来：「谢谢你姐妹，有你真好。」"
      },
      {
        text: "说一些让她冷静的话",
        effects: { confidence: 3, social: 3, age: 0 },
        tone: "aggressive",
        affinityChange: { npc_bestie: 10 },
        consequence: "你说：「婚姻都是这样，哪有不吵架的。你先冷静冷静，明天再说。」小敏嗯了一声，但你知道她还是很伤心。那一晚，你也没睡好。"
      },
      {
        text: "不知道说什么，只是默默陪着她",
        effects: { confidence: 0, social: 5, age: 0 },
        tone: "idealist",
        affinityChange: { npc_bestie: 5 },
        consequence: "你没有说什么，只是偶尔应和几句。电话两端都是沉默，但那种沉默让人安心。过了很久，小敏说：「谢谢你陪着我。」你们聊到凌晨三点，小敏终于困了，你们才挂掉电话。"
      }
    ]
  },

  {
    id: "evt_ex_borrow_money",
    title: "前任突然借钱",
    sourceCaseId: "NPC_INTERACTION_017",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["28-30", "31-34", "35-39"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村"]
    },
    phase: 3,
    body: "周一早上，你正在开会，手机震动了一下。你偷偷看了一眼，是陈一凡发来的微信：<npc_ex>「在吗？有件事想跟你商量。」<npc_ex>你有些意外，分手五年了，你们几乎没联系过。<npc_ex>「怎么了？」<npc_ex>「最近手头有点紧，想跟你借点钱。不多，两万就行。」<npc_ex>你看着屏幕，不知道该怎么回复。陈一凡当年家境一般，后来听说靠岳父家的关系开了公司，怎么会突然借钱？<npc_ex>「是遇到什么困难了吗？」<npc_ex>「嗯，公司出了点问题。不好意思开口，但真的没办法了。」",
    diagnosis: "",
    npcInvolved: ["npc_ex"],
    choices: [
      {
        text: "借给他，毕竟曾经相爱过",
        effects: { confidence: 3, social: 5, age: 0 },
        tone: "conservative",
        affinityChange: { npc_ex: 10 },
        consequence: "你转了两万给他，备注写的是借款。过了两个月，陈一凡如约还了钱，还多转了两千块的利息。你没收，但他请你在咖啡馆坐了一下午，算是感谢。"
      },
      {
        text: "拒绝，不想再有任何牵扯",
        effects: { confidence: 5, social: -3, age: 0 },
        tone: "aggressive",
        affinityChange: { npc_ex: -10 },
        consequence: "你说最近手头也紧，没有借给他。陈一凡没有再回复。过了一段时间，你听说他公司真的出了问题，还借了很多人的钱。"
      },
      {
        text: "问清楚情况再说",
        effects: { confidence: 0, social: 0, age: 0 },
        tone: "idealist",
        affinityChange: { npc_ex: 0 },
        consequence: "你问了问他的具体情况，他说公司在转型期遇到困难。你犹豫了一下，最后说：「我考虑一下。」过了几天，你说手头确实不方便。他回了句「没关系」，就再也没联系过。"
      }
    ]
  },

  {
    id: "evt_blind_date_wechat",
    title: "相亲对象发暧昧消息",
    sourceCaseId: "NPC_INTERACTION_018",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["28-30", "31-34", "35-39"],
      cityTiers: ["一线", "新一线", "二线", "三四五线"]
    },
    phase: 3,
    body: "周四晚上，你刚洗完澡，手机震动了。是林晓发来的微信：<npc_blind_date>「睡了吗？」<npc_blind_date>你有些意外，这个时间点发消息，有些微妙。<npc_blind_date>「还没，怎么了？」<npc_blind_date>「没什么，就是想找你聊聊天。」<npc_blind_date>「最近工作压力大吗？」<npc_blind_date>你看着屏幕，不知道该怎么理解这句话的意思。林晓平时话不多，这么主动找你聊天还是第一次。<npc_blind_date>「还好，你呢？」<npc_blind_date>「我也还行。就是有时候会觉得，一个人有点孤单。」<npc_blind_date>你盯着最后那句话，心跳有点加速。",
    diagnosis: "",
    npcInvolved: ["npc_blind_date"],
    choices: [
      {
        text: "顺着聊下去，试探她的意思",
        effects: { confidence: 5, social: 5, age: 0 },
        tone: "conservative",
        affinityChange: { npc_blind_date: 15 },
        consequence: "你们聊了很久，从工作聊到生活，从生活聊到感情。林晓说：「其实我觉得你人挺好的。」你心跳加速，不知道该怎么接话。那晚你们聊到凌晨一点。"
      },
      {
        text: "礼貌回复，但不深入",
        effects: { confidence: 0, social: 0, age: 0 },
        tone: "aggressive",
        affinityChange: { npc_blind_date: 5 },
        consequence: "你回复：「是啊，一个人有时候是会孤单。」然后话题就转到了工作上。林晓也识趣地没有再提那方面的事。过了几天，你有些后悔。"
      },
      {
        text: "假装没看到，第二天再说",
        effects: { confidence: -3, social: -5, age: 0 },
        tone: "idealist",
        affinityChange: { npc_blind_date: -10 },
        consequence: "你没有回复，把手机放到一边。第二天早上，林晓发来一条：「昨晚是不是睡着了？」你回：「嗯，最近有点累。」她回了句「注意身体」，就再也没主动找你聊天了。"
      }
    ]
  },

  {
    id: "evt_mom_family_group",
    title: "家族群里的催婚轰炸",
    sourceCaseId: "NPC_INTERACTION_019",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    phase: 1,
    body: "周六早上十点，你正在睡懒觉，手机连续震动了几十条消息。你迷迷糊糊打开一看，是家族群炸了。<npc_mom>二婶：「@所有人 咱们家族今年要办喜事啦！我家儿子下个月结婚！」<npc_mom>大伯：「恭喜恭喜！」<npc_mom>小姑：「到时候一定去！」<npc_mom>然后七大姑八大姨开始发红包庆祝。你正准备放下手机，奶奶突然@了你：<npc_grandma>「@你 什么时候喝你的喜酒啊？」<npc_grandma>群里瞬间安静了。你感觉几百双眼睛透过屏幕盯着你。",
    diagnosis: "",
    npcInvolved: ["npc_mom", "npc_grandma"],
    choices: [
      {
        text: "发个表情包应付过去",
        effects: { confidence: 0, social: 0, age: 0 },
        tone: "conservative",
        affinityChange: { npc_grandma: 0 },
        consequence: "你发了一个捂脸的表情包。群里哄堂大笑，有人说「这孩子害羞了」，有人说「等着喝喜酒」。奶奶回了个「嘿嘿」的表情。你松了口气，但群里关于你的话题又持续了一整天。"
      },
      {
        text: "大方回复：「快了快了」",
        effects: { confidence: 5, social: 5, age: 0 },
        tone: "aggressive",
        affinityChange: { npc_grandma: 10, npc_mom: 10 },
        consequence: "奶奶立刻追问：「真的？是谁？什么时候带来给奶奶看看？」七大姑八大姨也纷纷发来恭喜。你连忙找借口说「忙，先去开会了」，然后退出了群聊。"
      },
      {
        text: "不回复，假装没看到",
        effects: { confidence: -3, social: -5, age: 0 },
        tone: "idealist",
        affinityChange: { npc_grandma: -10, npc_mom: -5 },
        consequence: "你决定装死，不回复。但过了一会儿，妈妈私信你：「群里奶奶问你话呢，怎么不回？」你叹了口气，只能硬着头皮回去应付。"
      }
    ]
  },

  {
    id: "evt_bestie_friend_divorce",
    title: "小敏的朋友离婚了",
    sourceCaseId: "NPC_INTERACTION_020",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["28-30", "31-34", "35-39"],
      cityTiers: ["一线", "新一线", "二线", "三四五线"]
    },
    phase: 3,
    body: "周末下午，你和小敏约在商场见面。小敏一脸凝重，不像平时那样叽叽喳喳。<npc_bestie>「怎么了？」<npc_bestie>「我闺蜜离婚了。」<npc_bestie>小敏叹了口气，「她结婚才一年多，老公就出轨了。」<npc_bestie>你有些惊讶。小敏的闺蜜你也见过，是个人很好的女生，和老公是相亲认识的，婚前感情还不错。<npc_bestie>「她老公看起来挺老实的，没想到...」<npc_bestie>「所以说，相亲认识的真的不靠谱。」小敏说，「还是要找自己真心喜欢的。」<npc_bestie>你看着小敏，心里有些复杂。她之前一直劝你「差不多就行了」，现在怎么又变了？",
    diagnosis: "",
    npcInvolved: ["npc_bestie"],
    choices: [
      {
        text: "安慰小敏，聊聊那个闺蜜的情况",
        effects: { confidence: 0, social: 5, age: 0 },
        tone: "conservative",
        affinityChange: { npc_bestie: 10 },
        consequence: "你们聊了很久，分析那个闺蜜的婚姻哪里出了问题。小敏最后说：「所以结婚真的要慎重，不能将就。」你点点头，若有所思。"
      },
      {
        text: "反驳小敏：「你之前不是说差不多就行吗」",
        effects: { confidence: 5, social: -3, age: 0 },
        tone: "aggressive",
        affinityChange: { npc_bestie: 0 },
        consequence: "小敏愣了一下，然后叹了口气：「好吧，我之前说的也不全对...但你也不能太挑啊。」你们对视一眼，然后都笑了。"
      },
      {
        text: "沉默思考，不知道该说什么",
        effects: { confidence: 3, social: 0, age: 0 },
        tone: "idealist",
        affinityChange: { npc_bestie: 5 },
        consequence: "你没有说话，只是默默听着小敏说。那天下午，你们都沉默了很久，各自想着心事。离开的时候，小敏说：「姐妹，不管怎样，我都支持你。」"
      }
    ]
  },

  // ============================================
  // 纯随机事件（20条）
  // 保留原有真实案例风格，无特定 NPC 互动
  // ============================================

  {
    id: "evt_333",
    title: "被叫阿姨的周末",
    sourceCaseId: "7611871510747286819#0",
    trigger: {
      gender: ["男"],
      ageBands: ["35-39"],
      cityTiers: ["一线"]
    },
    phase: 3,
    body: "你37岁，在一线，博士(民办学院院长)。你的工作是民办国际学院院长(做国际教育,年收百万)。年收入百万(近2-3年投资回报高)。家里两房两车(自己创业,父母无助力)。感情上，离异(婚8年有一男一女均跟前妻、净身出户、他提的离);接触一小9岁硕士女老师。90年民办学院院长博士男(年收百万、两房两车、父母退休单职工、独生子、离异(婚8年有一男一女均跟前妻、净身出户、自己提的离)、接触一小9岁硕士女老师)。博主指其连糟糠之妻都容忍不了(信任账户盈余丰盛却容不下)、防备会越来越重、好大喜功钓鱼型(海瑞会被他杀);他需要的不是婚姻是弥补童年创伤;女老师能配合他=父母大概率离/能力来自反人性(没接触过体制内未婚活泼包容他的女)、不稳定;若女方父母感情好不会让她嫁大9岁离两孩无抚养权的男。",
    diagnosis: "",
    npcInvolved: [],
    choices: [
      {
        text: "先稳住场面，再观察",
        effects: { age: 1, confidence: -3 },
        tone: "conservative"
      },
      {
        text: "主动调整策略，扩大选择面",
        effects: { age: 0, confidence: 8, social: 5 },
        tone: "aggressive"
      },
      {
        text: "坚持自己的标准，宁缺毋滥",
        effects: { age: 2, confidence: 3, social: -5 },
        tone: "idealist"
      }
    ]
  },

  {
    id: "evt_244",
    title: "大龄的焦虑",
    sourceCaseId: "7617799503059455232#0",
    trigger: {
      gender: ["男"],
      ageBands: ["31-34"],
      cityTiers: ["一线"]
    },
    phase: 2,
    body: "你32岁，在一线，英国本科经济+硕士数学+博士环境工程(QS100左右)。你的工作是高中数学老师/高二年级主任。年收入40多万。家里A9(早年拆迁,两位数套房,自己一套)。感情上，前女友(00年小官家庭离异、美术专业前10%、强势179微胖)因家要80万彩礼五金提分手。95年北京男(30岁、1米91、高中赴英本科经济硕士数学博士环境工程QS100、家拆迁A9两位数套房自己一套、父母体制内、独生子、高中数学老师兼高二年级主任、年收40多万),前女友(00年小官家庭离异、美术专业前10%、强势179微胖)因家里要80万彩礼五金而提分手。博主反复质疑信息真实性(北京没彩礼、要他发聊天记录);指其不能完全自主决定婚姻要参考父母=不够坚定(对方因此没真正想留)。",
    diagnosis: "",
    npcInvolved: [],
    choices: [
      {
        text: "先稳住场面，再观察",
        effects: { age: 1, confidence: -3 },
        tone: "conservative"
      },
      {
        text: "主动调整策略，扩大选择面",
        effects: { age: 0, confidence: 8, social: 5 },
        tone: "aggressive"
      },
      {
        text: "坚持自己的标准，宁缺毋滥",
        effects: { age: 2, confidence: 3, social: -5 },
        tone: "idealist"
      }
    ]
  },

  {
    id: "evt_215",
    title: "妈妈安排的相亲局",
    sourceCaseId: "7619676961866009856#0",
    trigger: {
      gender: ["女"],
      ageBands: ["23-27"],
      cityTiers: ["一线"]
    },
    phase: 1,
    body: "你25岁，在一线，学历一般。你的工作是字节(原董助)。年收入税后25万(年存15-16万)。家里现金200万(非A8)。感情上，男友国企(她劝其从重庆调北京、自己裸辞跟来),男友酗酒到半夜送医靠她兜底,曾分手断联半年现重新接触。00年字节女(原董助/甲方、年收税后25万存15万、家现金200万非A8、独生女、急脾气控制力强、有自媒体三四万粉、父北漂做生意身体不好回江苏养老母十来年退休),男友国企(因她劝从重庆调北京裸辞跟来)酗酒到半夜送医、靠她兜底。博主用'幻灭礼貌/光环、行为大于身份/关系'分析:和好无代价无筹码则男友只会沾沾自喜觉得你离不开他;让男友换不需应酬工作或放出代价筹码;指出男友能包容哄她、愿陪她回江苏照顾母亲是优点,可考虑。",
    diagnosis: "",
    npcInvolved: [],
    choices: [
      {
        text: "先稳住场面，再观察",
        effects: { age: 1, confidence: -3 },
        tone: "conservative"
      },
      {
        text: "主动调整策略，扩大选择面",
        effects: { age: 0, confidence: 8, social: 5 },
        tone: "aggressive"
      },
      {
        text: "坚持自己的标准，宁缺毋滥",
        effects: { age: 2, confidence: 3, social: -5 },
        tone: "idealist"
      }
    ]
  },

  {
    id: "evt_318",
    title: "体制内的相亲角",
    sourceCaseId: "7611870809686068532#0",
    trigger: {
      gender: ["女"],
      ageBands: ["28-30"],
      cityTiers: ["三四五线"]
    },
    phase: 2,
    body: "你29岁，在三四五线，英国QS前60硕士。你的工作是原北京教育行业产品运营(年20万,已落词)。年收入年20万。家里A8.1(买房助力200万+车)。感情上，谈过几次(自评恋爱脑,实为情绪不稳定/作/分手后纠缠);上段北京当地男友2年因她性格分。30岁女(三四线父国企小领导母全职A8.1、有新加坡读书亲妹、英国QS60硕士、原北京教育行业产品运营年20万落词、自评恋爱脑(实为情绪不稳定/作/纠缠)、想去上海),买房父母可助力200万+车。博主指其门门80分不好找(无一门下80也无一门上85);切换城市元气成本高(96年才动荡、03年才可随意);她是至性恋只能找欣赏崇拜的人;完美主义+长期性要砸了多见人(她窄/女船长式低效但不影响)。",
    diagnosis: "",
    npcInvolved: [],
    choices: [
      {
        text: "先稳住场面，再观察",
        effects: { age: 1, confidence: -3 },
        tone: "conservative"
      },
      {
        text: "主动调整策略，扩大选择面",
        effects: { age: 0, confidence: 8, social: 5 },
        tone: "aggressive"
      },
      {
        text: "坚持自己的标准，宁缺毋滥",
        effects: { age: 2, confidence: 3, social: -5 },
        tone: "idealist"
      }
    ]
  },

  {
    id: "evt_190",
    title: "二线城市做业务男",
    sourceCaseId: "7621151715181530402#0",
    trigger: {
      gender: ["男"],
      ageBands: ["23-27"],
      cityTiers: ["二线"]
    },
    phase: 1,
    body: "你25岁，在二线，学历一般。你的工作是业务(销售)。年收入50-60万(已见顶无溢价)。感情上，过去5年暧昧三四十个,谈过一个长的(付出大、分手一年多),近年变抠。二线城市做业务男(父母国企退休、哈尔滨籍现居一二线、年收50-60万已见顶、过去5年暧昧三四十个但没怎么样、爱玩酒吧、付出大手大脚但近年变抠),想找定位。博主指其谈过漂亮的没法向下兼容(如女生谈过大方的);劝其别有受害者自卑(给前任花二三十万是因为人家有魅力、你不花有别的男生花、老李配货);爱情滋生需肥沃土壤(财富)和养分(年龄);开出小4-5岁、93/94年、有江湖气精神独立、原生家庭父母离异、合伙开医美/装修公司、专升本、家境差不太多的女(凶犯出/正常相亲路子)。",
    diagnosis: "",
    npcInvolved: [],
    choices: [
      {
        text: "先稳住场面，再观察",
        effects: { age: 1, confidence: -3 },
        tone: "conservative"
      },
      {
        text: "主动调整策略，扩大选择面",
        effects: { age: 0, confidence: 8, social: 5 },
        tone: "aggressive"
      },
      {
        text: "坚持自己的标准，宁缺毋滥",
        effects: { age: 2, confidence: 3, social: -5 },
        tone: "idealist"
      }
    ]
  },

  {
    id: "evt_337",
    title: "回老家过年的尴尬饭局",
    sourceCaseId: "7611132849273490703#0",
    trigger: {
      gender: ["女"],
      ageBands: ["23-27"],
      cityTiers: ["三四五线"]
    },
    phase: 1,
    body: "你25岁，在三四五线，学历一般。你的工作是医药代表(罕见病线全国top10,去年赚50万今年20-30万)。年收入去年50万(月4-5万,底薪1.1-1.2万)。家里房多不值钱+父固定资产200万存款。02年东北女(五线房多不值钱、父年收40-50万固定资产200万存款、母没上班大手大脚有3千退休金、176、150斤、显老、医药代表(罕见病线全国top10)去年赚50万今年20-30万、讨好型人格)。博主指其讨好型(身边没几个人讨厌你=对不起自己);喜欢不值钱信任值钱;02年年收50万是人中龙凤、极不建议转婚恋(走辞进/雄进:雄进做蛋糕辞进切蛋糕);今年挣50明年可能挣5万要警惕(别把不争当修养、敢冲突)。",
    diagnosis: "",
    npcInvolved: [],
    choices: [
      {
        text: "先稳住场面，再观察",
        effects: { age: 1, confidence: -3 },
        tone: "conservative"
      },
      {
        text: "主动调整策略，扩大选择面",
        effects: { age: 0, confidence: 8, social: 5 },
        tone: "aggressive"
      },
      {
        text: "坚持自己的标准，宁缺毋滥",
        effects: { age: 2, confidence: 3, social: -5 },
        tone: "idealist"
      }
    ]
  },

  {
    id: "evt_178",
    title: "闺蜜的婚礼",
    sourceCaseId: "7622630813544221967#0",
    trigger: {
      gender: ["男"],
      ageBands: ["28-30"],
      cityTiers: ["新一线"]
    },
    phase: 2,
    body: "你29岁，在新一线，硕士。你的工作是新一线体制内数学老师(小学,中学有编)。年收入25万左右。家里A7.2(房车自购,父母无助力)。感情上，离异短婚史无孩(闪婚闪离只领证),前妻婚后不工作、凌晨让削苹果致破防。97年新一线体制内数学老师男(单亲随母、离异短婚史无孩、A7.2自购房车、硕士、身高176),前妻婚后不工作、凌晨让他削苹果导致破防离婚,想二次'上嫁'。博主肯定其形象不错(100人22-23)、差异度越大匹配度越高;开出A8.2-8.3家境(为他家10倍)、有在读弟弟不需操心、名下百万现金+路虎+300平大平层、91年强势离异带男孩还想再生的女,强调入局动作顺序是他先主动付出感情浓度、需签婚前。",
    diagnosis: "",
    npcInvolved: [],
    choices: [
      {
        text: "先稳住场面，再观察",
        effects: { age: 1, confidence: -3 },
        tone: "conservative"
      },
      {
        text: "主动调整策略，扩大选择面",
        effects: { age: 0, confidence: 8, social: 5 },
        tone: "aggressive"
      },
      {
        text: "坚持自己的标准，宁缺毋滥",
        effects: { age: 2, confidence: 3, social: -5 },
        tone: "idealist"
      }
    ]
  },

  {
    id: "evt_615",
    title: "回国探亲的尴尬时刻",
    sourceCaseId: "7245517327695990019#0",
    trigger: {
      gender: ["女"],
      ageBands: ["23-27"],
      cityTiers: ["海外"]
    },
    phase: 1,
    body: "你25岁，在海外，哥伦比亚大学已录取读硕(美国读高中本科、GPA4.0、目标MIT/哈佛)。你的工作是学生(对家族事业感兴趣、想回山西)。家里数亿(‘一个小目标半个小目标不止、两三个小目标也不止’)。感情上，23岁从没谈过恋爱(学习用功)。家长(母亲)连麦替女儿找对象：女儿00年、在美读高中本科、刚被哥伦比亚大学录取读硕(目标MIT/哈佛、GPA4.0)、23岁没谈过恋爱、对家族事业感兴趣想回山西；家里资产数亿(‘两三个小目标也不止’)。博主建议：这种亿级家庭+藤校女孩在山西找不到门当户对，应去北京(大超)、上海(钻石婚恋)找；往上找/找门当户对一定要趁年龄小趁早，别低估有钱人(连读研都可能耽误择偶)。",
    diagnosis: "",
    npcInvolved: [],
    choices: [
      {
        text: "先稳住场面，再观察",
        effects: { age: 1, confidence: -3 },
        tone: "conservative"
      },
      {
        text: "主动调整策略，扩大选择面",
        effects: { age: 0, confidence: 8, social: 5 },
        tone: "aggressive"
      },
      {
        text: "坚持自己的标准，宁缺毋滥",
        effects: { age: 2, confidence: 3, social: -5 },
        tone: "idealist"
      }
    ]
  },

  {
    id: "evt_308",
    title: "县城的菜市场相亲",
    sourceCaseId: "7612595910140267816#0",
    trigger: {
      gender: ["女"],
      ageBands: ["31-34"],
      cityTiers: ["三四五线"]
    },
    phase: 2,
    body: "你32岁，在三四五线，硕士(本211)。你的工作是三线城市高校教师(专科学校大学老师)。年收入十几万(20以内)。家里A7(四套房她名下三套+全款车)。感情上，错过很多优秀男,现在相亲式接触没确定关系。93年三线高校教师女(硕士、A7家庭四套房她名下三套+全款车、独生女、错过很多优秀男、不太想结婚、原很卡严现觉得顺眼就行、收入十几万)。博主指大学老师择偶要求保三争一、这年龄不能要求男生大方;永远别卡严(普通人,物以稀为贵找帅哥得给他花钱);开出87/88年体制外短婚未育(只领证)、做餐饮年30-40万、专科(别介意学历低)、能击穿周期的男(她是211/专科学校大学老师对这种男是降维)。",
    diagnosis: "",
    npcInvolved: [],
    choices: [
      {
        text: "先稳住场面，再观察",
        effects: { age: 1, confidence: -3 },
        tone: "conservative"
      },
      {
        text: "主动调整策略，扩大选择面",
        effects: { age: 0, confidence: 8, social: 5 },
        tone: "aggressive"
      },
      {
        text: "坚持自己的标准，宁缺毋滥",
        effects: { age: 2, confidence: 3, social: -5 },
        tone: "idealist"
      }
    ]
  },

  {
    id: "evt_306",
    title: "村里的相亲",
    sourceCaseId: "7612973770336193844#0",
    trigger: {
      gender: ["女"],
      ageBands: ["23-27"],
      cityTiers: ["县城/农村"]
    },
    phase: 1,
    body: "你25岁，在县城/农村，专科+成人本科。你的工作是收费站收费员(第三方劳务派遣,月3000多)。年收入月3000多。感情上，母胎/有效恋爱≤1(自称恋爱脑实则没谈过)。01年女(收费站第三方劳务派遣收费员、专科+成人本科、父母个体开专卖店宠孩子、彩礼70万(学艺术花了三十来万)、农村但能出70万、170/108斤、自评恋爱脑实则母胎/有效恋爱≤1、不喜欢多子女家庭很双标)。博主指其软实力不够上线也太好问;女生条件差点没事但年龄别大(男反之、不存在镜像版自己);她不吸引渣男(渣男也看不上她没钱);开出山东本地独生子4分1米75本科非强势体制内/小康家庭奥迪A4(她不满意嫌家境差不多)。",
    diagnosis: "",
    npcInvolved: [],
    choices: [
      {
        text: "先稳住场面，再观察",
        effects: { age: 1, confidence: -3 },
        tone: "conservative"
      },
      {
        text: "主动调整策略，扩大选择面",
        effects: { age: 0, confidence: 8, social: 5 },
        tone: "aggressive"
      },
      {
        text: "坚持自己的标准，宁缺毋滥",
        effects: { age: 2, confidence: 3, social: -5 },
        tone: "idealist"
      }
    ]
  },

  {
    id: "evt_165",
    title: "又一次被放鸽子",
    sourceCaseId: "7623754155307453737#0",
    trigger: {
      gender: ["女"],
      ageBands: ["28-30"],
      cityTiers: ["一线"]
    },
    phase: 2,
    body: "你29岁，在一线，医学博士(专硕转博,今年毕业)。你的工作是签广州头部医院有编(月1万多)+副业。年收入约70万(医院35万+副业)。感情上，屡遇奇葩:第一段4年男友出轨,订婚男友负债百万,相亲男上来问能否接受商K。96年医学博士女(今年毕业、签广州头部医院有编税前35万、有副业总收入达70万,身高166、98斤,父亲退休大学教授、母亲个体法人长期分居、给200万保险+两套房一车,独生女,颜值5分理工科美女),屡遇奇葩(出轨/负债百万/相亲问开商K)。博主评其在广州第一梯队中央、北京第一梯队末尾,无短板;开出比她小的97/98年感情路子或90年年收150-200万的差异化路子。",
    diagnosis: "",
    npcInvolved: [],
    choices: [
      {
        text: "先稳住场面，再观察",
        effects: { age: 1, confidence: -3 },
        tone: "conservative"
      },
      {
        text: "主动调整策略，扩大选择面",
        effects: { age: 0, confidence: 8, social: 5 },
        tone: "aggressive"
      },
      {
        text: "坚持自己的标准，宁缺毋滥",
        effects: { age: 2, confidence: 3, social: -5 },
        tone: "idealist"
      }
    ]
  },

  {
    id: "evt_292",
    title: "新一线的周末",
    sourceCaseId: "7614483046988811554#0",
    trigger: {
      gender: ["男"],
      ageBands: ["23-27"],
      cityTiers: ["新一线"]
    },
    phase: 1,
    body: "你25岁，在新一线，硕士。你的工作是国企(25年7月入职,月7-8千)。年收入月7-8千。家里A8(南开两套+虹桥一套,一套在他名下)。99年天津国企男(家A8南开两套虹桥一套(一套在他名下)、硕士、25年7月入职月7-8千、180/75kg肉、自认不上进只求别败家拉低阶层、计较每份付出要等量回报、独生子),要求女方天津、化妆4.5-5、别太胖。博主指他该做加法不是减法(去刷经验直接找没问题、要求合理);但戳破其'美女吃饭三五百没回应就觉得不值'=计较(美女是吸血资源,你月入7千要她咋回应);其定义的化妆4.5分实为100人第30-40(记不住长相)。",
    diagnosis: "",
    npcInvolved: [],
    choices: [
      {
        text: "先稳住场面，再观察",
        effects: { age: 1, confidence: -3 },
        tone: "conservative"
      },
      {
        text: "主动调整策略，扩大选择面",
        effects: { age: 0, confidence: 8, social: 5 },
        tone: "aggressive"
      },
      {
        text: "坚持自己的标准，宁缺毋滥",
        effects: { age: 2, confidence: 3, social: -5 },
        tone: "idealist"
      }
    ]
  },

  {
    id: "evt_188",
    title: "92年美西女",
    sourceCaseId: "7621524214725627171#0",
    trigger: {
      gender: ["女"],
      ageBands: ["31-34"],
      cityTiers: ["海外"]
    },
    phase: 2,
    body: "你32岁，在海外，美国研究生。你的工作是美股二级市场投资人(科技/航天)。年收入150万。家里大A8到A9初。感情上，暧昧追求者15段+,收过两个男生送的房(只付首付写两人名,已卖一套)。92年美西女(美股二级市场投资人/年收150万、大A8-A9初家庭、独生女、身高165、115斤、绿卡未拿、暧昧追求者15段+、收过两个男生送的房),纠结找大很多岁能教她的还是小弟弟。博主直言唯一能给她输出经济的只有大15-20岁有婚史生育史的(其他全是干扰选项),不认可不支持这条路;指其谄媚感是工作经历刻意练习出来的、会让同龄优质男觉得假假的不好惹。",
    diagnosis: "",
    npcInvolved: [],
    choices: [
      {
        text: "先稳住场面，再观察",
        effects: { age: 1, confidence: -3 },
        tone: "conservative"
      },
      {
        text: "主动调整策略，扩大选择面",
        effects: { age: 0, confidence: 8, social: 5 },
        tone: "aggressive"
      },
      {
        text: "坚持自己的标准，宁缺毋滥",
        effects: { age: 2, confidence: 3, social: -5 },
        tone: "idealist"
      }
    ]
  },

  {
    id: "evt_222",
    title: "98年宁波大学女",
    sourceCaseId: "7618557857931218211#0",
    trigger: {
      gender: ["女"],
      ageBands: ["28-30"],
      cityTiers: ["二线"]
    },
    phase: 2,
    body: "你29岁，在二线，宁波大学本科。你的工作是外企(年收12万)。年收入12万。感情上，接触一宁波本地独生子(双职工退休父母、180、两套房、20-30万车、国企子公司、尊重女性主动)。98年宁波大学女(身高150、外企年收12万、父母宁波做生意有一套房、有已婚已育姐姐、结婚彩礼只能给10万无助力、有车),接触一宁波本地独生子(父母双职工退休、180、两套房、20-30万车、国企子公司、尊重女性、主动推进关系)。博主判定男方独生子两套房尊重女性主动是好选择(她是被滋养/受益方),无需犹豫,直接打电话推进;她若短择只会找外地农村大专不体面的女。",
    diagnosis: "",
    npcInvolved: [],
    choices: [
      {
        text: "先稳住场面，再观察",
        effects: { age: 1, confidence: -3 },
        tone: "conservative"
      },
      {
        text: "主动调整策略，扩大选择面",
        effects: { age: 0, confidence: 8, social: 5 },
        tone: "aggressive"
      },
      {
        text: "坚持自己的标准，宁缺毋滥",
        effects: { age: 2, confidence: 3, social: -5 },
        tone: "idealist"
      }
    ]
  },

  {
    id: "evt_298",
    title: "36岁西安私募男",
    sourceCaseId: "7613344737969409320#0",
    trigger: {
      gender: ["男"],
      ageBands: ["35-39"],
      cityTiers: ["新一线"]
    },
    phase: 3,
    body: "你37岁，在新一线，英国本硕(世界100多的水校)。你的工作是私募(中石化背景)。年收入近两年年300万(之前五六十万),金融资产约300万。感情上，谈过挺多,毕业差点结婚后无结婚打算。36岁西安私募男(中石化背景父科级退休、河南小地方+西安145平房无负债、金融资产约300万近两年收入涨到年300万(之前五六十万)、英国本硕水校、谈过挺多近毕业差点结婚)。博主只推荐小康家境哈耶普斯藤校高学历美女(物欲低需不用多虑关系);男人年龄也重要(36岁有3-4百万现在结好找,女生看未来增长);别有'多挣钱再找更好'心态(那不是丈夫角色没人敢嫁)。",
    diagnosis: "",
    npcInvolved: [],
    choices: [
      {
        text: "先稳住场面，再观察",
        effects: { age: 1, confidence: -3 },
        tone: "conservative"
      },
      {
        text: "主动调整策略，扩大选择面",
        effects: { age: 0, confidence: 8, social: 5 },
        tone: "aggressive"
      },
      {
        text: "坚持自己的标准，宁缺毋滥",
        effects: { age: 2, confidence: 3, social: -5 },
        tone: "idealist"
      }
    ]
  },

  {
    id: "evt_193",
    title: "96年浙大医学博士男",
    sourceCaseId: "7620774364182482176#0",
    trigger: {
      gender: ["男"],
      ageBands: ["28-30"],
      cityTiers: ["二线"]
    },
    phase: 2,
    body: "你29岁，在二线，浙大医学院博士在读(今年6月毕业)。你的工作是医生(将回温州医院热门科室,需规培两年)。家里七八百万。感情上，有效恋爱≤1(网恋交流过久)。96年浙大医学博士男(今年6月毕业、被外派西安、将回温州入职医院热门科室、母亲做生意家境七八百万、身高174、70kg、独生子、有效恋爱≤1、紧绷纪律性强),纠结做博后还是择偶城市。博主指医生是少数能对抗年龄周期的行业但黄金期不超33;劝其若博后与收入/成绩强相关就去、晚两年找;择偶杭州优于温州(机会密度/财富密度高);强调体制内三甲博士比不过创业年收五六百万者(规则到哪都一样)。",
    diagnosis: "",
    npcInvolved: [],
    choices: [
      {
        text: "先稳住场面，再观察",
        effects: { age: 1, confidence: -3 },
        tone: "conservative"
      },
      {
        text: "主动调整策略，扩大选择面",
        effects: { age: 0, confidence: 8, social: 5 },
        tone: "aggressive"
      },
      {
        text: "坚持自己的标准，宁缺毋滥",
        effects: { age: 2, confidence: 3, social: -5 },
        tone: "idealist"
      }
    ]
  },

  {
    id: "evt_339",
    title: "22岁博士男",
    sourceCaseId: "7608910187910450447#0",
    trigger: {
      gender: ["男"],
      ageBands: ["≤22"],
      cityTiers: ["一线"]
    },
    phase: 1,
    body: "你22岁，在一线，北京读博一(本科14年考、301医院硕士、特殊单位博士)。你的工作是学生(博士)。家里A8.5(曾A9)。感情上，相亲40多次+自找20多个一个没成(曾成一次因老家八字反对分)。22岁博士男(北京读博一、14年考本科、301医院读硕、特殊单位读博、家A8.5(曾A9)、哥海外定居不要家产、长得踏实周正)相亲40多次+自找20多个一个没成。博主指一辆车逆行是车的问题、40辆都逆行是路的问题(40多个没成是他自己有问题,可能在聊天方式/像不太正常人);相亲见面就是来谈的(没成是没看上);你应该是聊天方式出问题。",
    diagnosis: "",
    npcInvolved: [],
    choices: [
      {
        text: "先稳住场面，再观察",
        effects: { age: 1, confidence: -3 },
        tone: "conservative"
      },
      {
        text: "主动调整策略，扩大选择面",
        effects: { age: 0, confidence: 8, social: 5 },
        tone: "aggressive"
      },
      {
        text: "坚持自己的标准，宁缺毋滥",
        effects: { age: 2, confidence: 3, social: -5 },
        tone: "idealist"
      }
    ]
  },

  {
    id: "evt_309",
    title: "海归的落差",
    sourceCaseId: "7612931331069207872#0",
    trigger: {
      gender: ["男"],
      ageBands: ["28-30"],
      cityTiers: ["海外"]
    },
    phase: 2,
    body: "你29岁，在海外，本科(在新加坡读研)。你的工作是创业(之前收入约30万)。年收入约30万。家里普通(广州可支持150万)。新加坡创业男(独生子、本科、1米78-79、120斤、之前收入30万、广州家普通可支持150万、想找主内女自己主外、30岁想2-3年内确定)。博主称新加坡对男生是相亲绝对蓝海(香港对女生是红海);收入30万找全职太太要无限向下兼容(女人对全职太太的理解是要保姆司机买断费);男人择偶周期比女生多5-8岁(别超35);直言他是小号六边形战士、负面情绪上来时难包容女生,40岁后竞争力下滑才会包容,劝晚结婚。",
    diagnosis: "",
    npcInvolved: [],
    choices: [
      {
        text: "先稳住场面，再观察",
        effects: { age: 1, confidence: -3 },
        tone: "conservative"
      },
      {
        text: "主动调整策略，扩大选择面",
        effects: { age: 0, confidence: 8, social: 5 },
        tone: "aggressive"
      },
      {
        text: "坚持自己的标准，宁缺毋滥",
        effects: { age: 2, confidence: 3, social: -5 },
        tone: "idealist"
      }
    ]
  },

  {
    id: "evt_200",
    title: "04年重庆女",
    sourceCaseId: "7620400027646594358#0",
    trigger: {
      gender: ["女"],
      ageBands: ["≤22"],
      cityTiers: ["一线"]
    },
    phase: 1,
    body: "你22岁，在一线，财经211商科。你的工作是深圳做咨询。家里重庆主城两房一车+现金两三百万。感情上，大学时上一段恋爱,收过两万出头LV法棍包。04年重庆女(刚毕业、深圳做咨询、财经211商科、主城两房一车+现金两三百万、父母离异均未再婚双职工小领导、自评6分班花级、收过两万LV法棍),想上嫁找大12岁(92年)、月入50万/年收六七百万、A8资产的未婚男。博主直言深圳A8年收500万的男看都不看她、唯一现实是接受短择或耕受田走暗道接受短板;指其对钱没概念(二代月给五六十万生活费不现实、一代回国腰斩)、应先靠自己走出去。",
    diagnosis: "",
    npcInvolved: [],
    choices: [
      {
        text: "先稳住场面，再观察",
        effects: { age: 1, confidence: -3 },
        tone: "conservative"
      },
      {
        text: "主动调整策略，扩大选择面",
        effects: { age: 0, confidence: 8, social: 5 },
        tone: "aggressive"
      },
      {
        text: "坚持自己的标准，宁缺毋滥",
        effects: { age: 2, confidence: 3, social: -5 },
        tone: "idealist"
      }
    ]
  },

  {
    id: "evt_262",
    title: "97年离异男",
    sourceCaseId: "7616702509989596468#0",
    trigger: {
      gender: ["男"],
      ageBands: ["28-30"],
      cityTiers: ["二线"]
    },
    phase: 2,
    body: "你29岁，在二线，头部二线硕士(高收入专业)。你的工作是国企。年收入税后20多到30万。家里A8.5往上(不到A9)。感情上，离异无孩。97年离异男(无孩、A8.5往上家境、父亲一行业深耕、独生子、二线150平房+家里50万内车、头部二线硕士、国企、175-176、收入税后20多到30万、状态好对二婚仍有感情期待),求定位。博主赞其离异后无防备警惕、仍有少年气/感情属性;门当户对找同样有婚史无孩93/94年女(别找本地);走感情路子可找00年原生家庭和工作砍掉、性格好模样好、未婚能接受他离异的女(看你把啥排第一)。",
    diagnosis: "",
    npcInvolved: [],
    choices: [
      {
        text: "先稳住场面，再观察",
        effects: { age: 1, confidence: -3 },
        tone: "conservative"
      },
      {
        text: "主动调整策略，扩大选择面",
        effects: { age: 0, confidence: 8, social: 5 },
        tone: "aggressive"
      },
      {
        text: "坚持自己的标准，宁缺毋滥",
        effects: { age: 2, confidence: 3, social: -5 },
        tone: "idealist"
      }
    ]
  },

  {
    id: "evt_213",
    title: "海外业务男",
    sourceCaseId: "7619279650568703284#0",
    trigger: {
      gender: ["男"],
      ageBands: ["31-34"],
      cityTiers: ["新一线"]
    },
    phase: 2,
    body: "你32岁，在新一线，硕士。你的工作是海外业务(外派,新开市场)。年收入税前40-50万。家里中产。感情上，离异(前妻偏NPD),恋爱脑曾为前任搬到国外。海外业务男(父母国企退休、硕士中产、税前40-50万、离异(前妻偏NPD)、自评6分、外派国内外各半将回国内新一线、恋爱脑曾为前任搬到国外、至重感防备重),想找家庭/喜欢小孩。博主指其防备来自上段婚姻、需再经历两三段畸形关系;国外没资源(北美稍好);开出国外找美本美硕同龄一起奋斗女,或国内93年大其一岁短婚未育女;劝其做减法(搞事业则谁牵扯注意力谁就要你的命)。",
    diagnosis: "",
    npcInvolved: [],
    choices: [
      {
        text: "先稳住场面，再观察",
        effects: { age: 1, confidence: -3 },
        tone: "conservative"
      },
      {
        text: "主动调整策略，扩大选择面",
        effects: { age: 0, confidence: 8, social: 5 },
        tone: "aggressive"
      },
      {
        text: "坚持自己的标准，宁缺毋滥",
        effects: { age: 2, confidence: 3, social: -5 },
        tone: "idealist"
      }
    ]
  }
];

// ============================================
// 合并所有事件
// ============================================

export const EVENTS = [...MAIN_QUEST_EVENTS, ...RANDOM_EVENTS];

// 导出辅助函数

/**
 * 根据 ID 获取事件
 */
export function getEventById(id) {
  return EVENTS.find(e => e.id === id);
}

/**
 * 获取所有主线事件
 */
export function getMainQuestEvents() {
  return EVENTS.filter(e => e.isMainQuest);
}

/**
 * 获取所有随机事件
 */
export function getRandomEvents() {
  return EVENTS.filter(e => !e.isMainQuest);
}

/**
 * 获取指定 NPC 参与的事件
 */
export function getEventsByNPC(npcId) {
  return EVENTS.filter(e => e.npcInvolved && e.npcInvolved.includes(npcId));
}

/**
 * 根据条件筛选事件
 */
export function filterEvents({ gender, ageBand, cityTier }) {
  return EVENTS.filter(event => {
    const trigger = event.trigger;
    if (trigger.gender && !trigger.gender.includes(gender)) return false;
    if (trigger.ageBands && !trigger.ageBands.includes(ageBand)) return false;
    if (trigger.cityTiers && !trigger.cityTiers.includes(cityTier)) return false;
    return true;
  });
}
