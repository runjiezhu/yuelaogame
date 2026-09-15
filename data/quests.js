// data/quests.js
// 主线任务 - 春节催婚链（扩展版）
// 从腊月二十九到正月初八，共10天
// 20个主线章节 + 10个过渡章节 = 30个时间段
// 每个选择都有 energyCost 和 skillCheck 字段

// ============================================
// 角色定义
// ============================================
export const ATTRIBUTES = {
  independence: { name: "独立性", initial: 50, max: 100 },
  resilience: { name: "抗压能力", initial: 50, max: 100 },
  romance: { name: "恋爱经验", initial: 30, max: 100 },
  career: { name: "职业能力", initial: 50, max: 100 },
  cooking: { name: "烹饪技巧", initial: 25, max: 100 },
  agility: { name: "身体灵活度", initial: 40, max: 100 },
  social: { name: "社交能力", initial: 50, max: 100 },
  wealth: { name: "经济实力", initial: 50, max: 100 },
  luck: { name: "运气", initial: 50, max: 100 }
};

// 初始能量值（每天开始重置为100）
export const INITIAL_ENERGY = 100;

export const QUESTS = [
  // ============================================
  // 【Day 1】腊月二十九 · 抢票回家
  // ============================================
  {
    id: "quest_cn_01",
    chapterIndex: 1,
    title: "腊月二十九 · 抢票回家",
    subtitle: "抢票归乡，心在归途",
    timeSlot: "腊月二十九 · 上午",
    description: "妈妈连续打了7个电话催你回家过年，票还没买...",
    npcInvolved: ["npc_mom", "npc_dad"],
    scene: "train",
    illustration: "train.svg",
    bgColor: "#1a2840",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    requiredAttributes: ["independence"],
    optionalAttributes: ["career", "wealth"],
    body: `腊月二十九，春运的号角已经吹响。窗外的城市还沉浸在节前的最后一点喧嚣中，地铁站里挤满了拖着行李箱的返乡人，你坐在出租屋那张用了三年的小桌前，盯着手机里的抢票软件，屏幕的蓝光映在你略显疲惫的脸上。

手指划过12306的界面，跳动的余票数字像是在跟你玩一场残酷的游戏。腊月二十九的高铁票早在三天前就被一抢而空，像你这样的「晚鸟」只能望着那灰色的「候补」按钮发呆。剩下的选项寥寥无几——站票，要站整整八个小时；凌晨一点的红眼航班，到老家机场是凌晨三点，然后还要再转两个小时的巴士。

*「怎么每次回家都跟打仗似的。」* 你在心里叹了口气，手指无意识地刷新着页面。

手机铃声突然响起，屏幕上跳出「妈」的字样，你深吸一口气，按下接听键。

「抢到票了吗？」妈妈的声音里带着藏不住的焦急，「你表姐昨天就到家了，你舅舅他们都问我好几回了。你王阿姨的女儿，坐了三十个小时的绿皮火车都回来了，人家那才叫想家！」

「妈，票不好抢...」你试图解释。

「什么不好抢，你就是不想回来！」妈妈的语气突然尖锐起来，「你知道我跟你爸多盼着你回来吗？你爸昨天就去超市买了你爱吃的排骨，冰箱里给你留着呢。你王阿姨昨天还问我，说你家孩子今年回来不回来，我都不知道怎么回答！」

挂掉电话，你看了眼日历。距离除夕还有两天。窗外的城市霓虹闪烁，路灯上挂着红红的灯笼，年的气息已经很浓了。这座城市从来不缺留下来过年的人，你记得去年除夕，一个人在出租屋里吃了碗泡面，看窗外烟花在天上炸开，朋友圈里全是别人的团圆饭。

*「王阿姨的女儿...又是别人家的孩子。」* 你苦笑了一下。

手机又响了，是爸爸。

「票的事别着急，爸托人问问有没有顺风车。」爸爸的声音低沉而温和，「实在不行...就初一回来也行，你妈那边我去说。」

你知道，这个「去说」能顶三天。妈妈的催促从腊月初一开始就没停过，隔三差五发来的养生文章、催婚短视频、还有各种「女人过了二十五就不好找了」的链接。

打开12306，你习惯性地又刷新了一遍——手指突然停住了。页面上跳出一行绿色的字：「G1234 次列车 一等座 1张」。是腊月二十九下午三点的动车，二等座早就没了，只剩下价格是平时三倍的一等座。

*「买还是不买？」*

你的手指悬在屏幕上方，心里盘算着：这个月的房租还没交，信用卡账单还欠着八千，下个月的项目奖金还不知道能不能发...可是妈妈的叹息声仿佛又在耳边响起。

手机震动了，是妈妈发来的微信：「你王阿姨说她女儿给你介绍了个对象，是她老公同事的儿子，在深圳做IT的，让你过年回来见见。」

紧接着又是一条：「你二婶也在问，说她娘家有个侄子，刚考上公务员，人老实本分。」

你盯着屏幕，不知道该怎么回复。窗外的阳光透过玻璃照进来，在地上投下斑驳的光影。你想起大学时候，妈妈还会问你「今天吃了什么」「有没有加衣服」，现在的话题只剩下「有没有对象」「什么时候结婚」。

*也许，真的该回去了。*

但那张票的价格，确实让人肉疼。

火车票的倒计时在屏幕上跳动，十五分钟后这张票就会消失。你咬了咬牙，打开了支付宝...`,
    isMainQuest: true,
    choices: [
      {
        text: "咬咬牙买三倍票价的高铁票回家",
        tone: "conservative",
        energyCost: 15,
        skillCheck: {
          attr: "wealth",
          difficulty: 35,
          label: "经济能力测试",
          successThreshold: 1.0
        },
        effects: [
          { type: "attr", target: "independence", delta: 5 },
          { type: "attr", target: "wealth", delta: -10 },
          { type: "affection", target: "npc_mom_affection", delta: 15 },
          { type: "affection", target: "npc_dad_affection", delta: 10 }
        ],
        feedback: {
          success: "妈妈在家族群里发消息：「抢到票了！」配了一个庆祝的表情包。七大姑八大姨纷纷点赞，你妈的面子保住了。",
          fail: "付款时余额不足，尴尬的你在朋友群里借钱。姐姐秒转了5000，附言「下次早点买票」。"
        },
        nextQuestId: "time_d1a"
      },
      {
        text: "买初一早上的便宜航班，省点钱",
        tone: "idealist",
        energyCost: 10,
        skillCheck: {
          attr: "independence",
          difficulty: 30,
          label: "自立抉择测试"
        },
        effects: [
          { type: "attr", target: "independence", delta: 8 },
          { type: "attr", target: "wealth", delta: 3 },
          { type: "affection", target: "npc_mom_affection", delta: -10 },
          { type: "affection", target: "npc_dad_affection", delta: 0 }
        ],
        feedback: {
          success: "你用比高铁便宜一半的价格订到了机票，省下的钱给你妈买了一件保暖内衣。妈妈嘴上说乱花钱，心里乐开了花。",
          fail: "妈妈在电话里沉默了三秒：「初一...行吧，路上注意安全。」你听得出她语气里的失落。家族群里，表姐已经晒出了全家福。"
        },
        nextQuestId: "time_d1a"
      },
      {
        text: "给妈妈转了5000块，说项目忙不回了",
        tone: "aggressive",
        energyCost: 25,
        skillCheck: {
          attr: "independence",
          difficulty: 55,
          label: "独立抗压测试"
        },
        effects: [
          { type: "attr", target: "independence", delta: 12 },
          { type: "attr", target: "wealth", delta: -15 },
          { type: "affection", target: "npc_mom_affection", delta: -25 },
          { type: "affection", target: "npc_dad_affection", delta: -15 }
        ],
        feedback: {
          success: "妈妈收下了钱，发了条消息：「知道了，你忙。」语气平静得让你反而有点慌。",
          fail: "妈妈收下了钱，但发来一段60秒的语音。你没敢点开。家族群里，奶奶问你：「怎么不回来呀？」你妈回复：「工作忙，孩子大了有自己的事。」"
        },
        nextQuestId: "time_d2m"
      }
    ],
    unlockedNext: "time_d1a",
    nextQuestId: "time_d1a",
    phase: 1
  },

  // ============================================
  // 【Day 1 下午】过渡：踏上归途
  // ============================================
  {
    id: "quest_trans_d1a",
    chapterIndex: 1.1,
    title: "腊月二十九 · 踏上归途",
    subtitle: "车轮滚滚，故乡在望",
    timeSlot: "腊二十九 · 下午",
    description: "拖着行李箱去车站，漫长的等待之后，终于踏上回乡的列车",
    npcInvolved: [],
    illustration: "transit.svg",
    bgColor: "#1f2433",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    isTransition: true,
    requiredAttributes: [],
    optionalAttributes: ["resilience", "career"],
    body: `腊月二十九，下午两点。

拖着行李箱走出出租屋的那一刻，你回头看了一眼那个住了三年的小房间。窗外飘起了细雪，是这个冬天的第一场雪。雪很小，落在地上就化了，但空气里弥漫着一种湿冷的气息。

地铁站里人挤人，每个人都背着大包小包，行李箱的轮子在光滑的地砖上滚动，发出「咕噜咕噜」的声音。一个背着蛇皮袋的大叔从你身边挤过去，袋子里露出一角被褥，看起来像是从工地直接赶往车站的农民工。

你站在月台上，看着电子屏上的倒计时。G1234 次列车，还有15分钟到站。

手机响了，是妈妈的微信：「上车了吗？路上小心。」

你回复：「还没，开始检票了。」

妈妈秒回：「到了给家里打电话。」后面还跟了一个「加油」的表情包，是那种粉红色的卡通小女孩，双手握拳放在脸颊两边。

你笑了笑，把手机收进口袋。

检票口排起了长队，每个人脸上都写满了归家的期待。前面一个年轻妈妈抱着个两三岁的孩子，孩子在她怀里睡着了，小脸红扑扑的，嘴角还挂着口水。再前面是一对老夫妻，老太太挽着老头子的胳膊，两个人步履蹒跚地往前走。

*回家。*

这两个字对你来说，意味着什么呢？

是妈妈做的红烧排骨？是爸爸温热的茶杯？还是奶奶塞给你的那个大红包？

还是七大姑八大姨的轮番审问：「有对象了吗？」「什么时候结婚？」「一个月挣多少钱？」

你苦笑了一下。

列车进站了，「呜——」的一声长鸣，白色的车身在细雪中缓缓停下。车门打开，一股夹杂着方便面和橘子皮的气味扑面而来。

你拖着行李箱挤上车，找到自己的座位。座位靠窗，窗外是灰蒙蒙的天空和飘落的细雪。你把行李塞进行李架，坐下来，深深地叹了口气。

*终于...要回去了。*

窗外的风景开始缓缓后退，城市的高楼大厦渐渐变成了郊区的工业厂房，厂房变成了农田，农田变成了远处的山丘。雪越下越大，覆盖了田野和村庄，像是一床巨大的白棉被。

你靠在座椅上，看着窗外发呆。手机里还存着妈妈发来的那个加油表情包，旁边是一串未读的工作消息——老板说明天还有个项目要赶，初八之前必须交稿。

*管他呢，先回家过年。*

列车穿过一个隧道，又一个隧道。窗外的风景从灰蒙蒙的城市，变成了白茫茫的雪野。你的眼皮越来越重，不知不觉睡着了。`,
    choices: [
      {
        text: "闭眼休息，养精蓄锐应对春节",
        tone: "conservative",
        energyCost: 5,
        skillCheck: {
          attr: "resilience",
          difficulty: 25,
          label: "休整恢复"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 5 },
          { type: "energy", target: "self", delta: 30 }
        ],
        feedback: {
          success: "你睡了整整两个小时，精神焕发地醒来。窗外的雪已经停了，远处的山丘在阳光下闪闪发光。",
          fail: "半梦半醒之间，你听到旁边座位的小孩子在哭闹。妈妈的电话又打了过来：「怎么不接电话？」"
        },
        nextQuestId: "time_d1e"
      },
      {
        text: "打开电脑，处理手头的紧急工作",
        tone: "aggressive",
        energyCost: 30,
        skillCheck: {
          attr: "career",
          difficulty: 45,
          label: "工作能力测试"
        },
        effects: [
          { type: "attr", target: "career", delta: 10 },
          { type: "attr", target: "resilience", delta: -5 }
        ],
        feedback: {
          success: "你在火车上高效地完成了初稿，老板秒回：「干得漂亮！提前放假！」你赢得了一个小小的职场胜利。",
          fail: "火车上的网络太差，文件保存失败，你折腾了半天反而更累了。妈妈发来微信：「怎么不回消息？」"
        },
        nextQuestId: "time_d1e"
      },
      {
        text: "和邻座乘客聊天，打发时间",
        tone: "idealist",
        energyCost: 15,
        skillCheck: {
          attr: "social",
          difficulty: 35,
          label: "社交破冰"
        },
        effects: [
          { type: "attr", target: "social", delta: 8 },
          { type: "affection", target: "stranger_affection", delta: 10 }
        ],
        feedback: {
          success: "邻座是个回乡探亲的姐姐，你们聊得很投缘。她在老家县城开了家咖啡店，还邀请你过年去坐坐。",
          fail: "邻座戴着耳机明显不想聊天，你只好识趣地闭嘴，尴尬地刷了一路手机。"
        },
        nextQuestId: "time_d1e"
      }
    ],
    unlockedNext: "time_d1e",
    nextQuestId: "time_d1e",
    phase: 1,
    isMainQuest: true
  },

  // ============================================
  // 【Day 1 晚上】过渡：到家第一晚
  // ============================================
  {
    id: "quest_trans_d1e",
    chapterIndex: 1.2,
    title: "腊月二十九 · 到家第一晚",
    subtitle: "推开家门，爸妈的菜香扑鼻而来",
    timeSlot: "腊月二十九 · 晚上",
    description: "推开家门的瞬间，熟悉的味道扑面而来",
    npcInvolved: ["npc_mom", "npc_dad"],
    illustration: "homecoming.svg",
    bgColor: "#1a2533",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    isTransition: true,
    requiredAttributes: ["independence"],
    optionalAttributes: ["resilience"],
    body: `腊月二十九，晚上八点。

出租车在小区门口停下，你拖着行李箱下车。熟悉的小区，熟悉的单元楼，熟悉的防盗门。楼道里的灯坏了一盏，黑漆漆的，你摸索着往上爬，鞋底踩在水泥台阶上发出「咚咚」的声音。

推开那扇有些掉漆的防盗门，熟悉的场景映入眼帘——

「回来啦！」妈妈从厨房冲出来，围裙都没来得及解，额头上还沾着一点面粉，「哎呀，怎么瘦了！快把外套脱了，屋里暖和！」

爸爸从沙发上站起来，接过你的行李箱：「路上累不累？吃了没？」

「还没...」你刚说完，肚子「咕噜」叫了一声。

妈妈立刻转身进厨房：「妈给你留了红烧排骨，还有你爱吃的酸辣土豆丝！还有你爸腌的腊肉，今天刚蒸的！」

你换了拖鞋走进客厅。客厅的墙上挂着新买的福字，红底金字，透着一股喜庆劲儿。茶几上堆满了坚果和糖果，瓜子、花生、开心果，还有你小时候最爱吃的大白兔奶糖。

奶奶从房间里走出来，穿着那件你去年寄回去的红色棉袄，头发梳得整整齐齐：「哎呦，回来了！让我看看，瘦了！」

你放下背包，抱了抱奶奶：「奶奶，好久不见。」

奶奶的手有些粗糙，但很温暖，她拍了拍你的背：「在外面没吃好？脸都尖了。」

饭桌上摆满了菜。妈妈给你盛了一大碗米饭，自己却只夹了点青菜。爸爸开了瓶啤酒，给你倒了小半杯：「喝点，暖暖身子。」

妈妈立刻瞪他：「孩子刚回来，让她先吃饭。」

你看着这熟悉的一幕，眼眶有些发热。

手机震动了，是小敏的微信：「到家了吗？阿姨的菜香不香？」

你回复：「到了，我妈做了满满一桌。」

小敏秒回：「幸福！我也想回家！等我初五过来找你！」

你笑了笑，放下手机。

妈妈在对面问：「明天有什么安排？」

「明天...帮您准备年夜饭？」

妈妈的眼睛一亮：「真的？那太好了！你爸切菜不好，让他休息。明天你来帮妈，咱们做一桌丰盛的！」

窗外，鞭炮声此起彼伏。远处还有人在放烟花，「砰」的一声，金色的光芒在夜空中绽放，照亮了整个小区。

*回家了。*

*不管这一年过得怎么样，至少这一刻...*

*是温暖的。*`,
    choices: [
      {
        text: "和爸妈聊聊天，了解他们的近况",
        tone: "conservative",
        energyCost: 10,
        skillCheck: {
          attr: "social",
          difficulty: 30,
          label: "亲子沟通"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 3 },
          { type: "affection", target: "npc_mom_affection", delta: 10 },
          { type: "affection", target: "npc_dad_affection", delta: 10 }
        ],
        feedback: {
          success: "妈妈絮絮叨叨地说着老家的事，谁家的儿子结婚了，谁家的女儿离婚了。爸爸在旁边静静地听着，偶尔插一句嘴。那一刻，你觉得窗外飘的都是糖。",
          fail: "妈妈问「有没有对象」，气氛突然尴尬起来。你匆匆吃完饭就躲回了房间。"
        },
        nextQuestId: "time_d2m"
      },
      {
        text: "早早休息，为明天的年夜饭做准备",
        tone: "idealist",
        energyCost: 5,
        skillCheck: {
          attr: "resilience",
          difficulty: 20,
          label: "自我调节"
        },
        effects: [
          { type: "energy", target: "self", delta: 20 },
          { type: "attr", target: "resilience", delta: 5 }
        ],
        feedback: {
          success: "你睡得很沉，梦到了小时候在老家院子里骑木马。妈妈早上6点就来敲门：「起来帮妈准备年夜饭啦！」",
          fail: "你翻来覆去睡不着，半夜爬起来刷手机。窗外鞭炮声不断，让你睡得更浅了。"
        },
        nextQuestId: "time_d2m"
      },
      {
        text: "给爸妈展示这一年工作的成果",
        tone: "aggressive",
        energyCost: 15,
        skillCheck: {
          attr: "career",
          difficulty: 40,
          label: "职业展示"
        },
        effects: [
          { type: "attr", target: "career", delta: 5 },
          { type: "attr", target: "independence", delta: 5 },
          { type: "affection", target: "npc_mom_affection", delta: 5 }
        ],
        feedback: {
          success: "妈妈看着你的工作汇报，眼睛里有光：「我家孩子真的长大了。」爸爸骄傲地给亲戚群发了你的获奖证书。",
          fail: "爸妈听得云里雾里，但还是配合地点头。妈妈最后问：「那挣得多不多？够不够花？」"
        },
        nextQuestId: "time_d2m"
      }
    ],
    unlockedNext: "time_d2m",
    nextQuestId: "time_d2m",
    phase: 1,
    isMainQuest: true
  },

  // ============================================
  // 【Day 2 上午】过渡：帮妈妈备菜
  // ============================================
  {
    id: "quest_trans_d2m",
    chapterIndex: 2.1,
    title: "除夕 · 帮妈妈备年夜饭",
    subtitle: "油烟味里，藏着妈妈的爱",
    timeSlot: "除夕 · 上午",
    description: "帮妈妈准备年夜饭，考验你的厨艺和耐心",
    npcInvolved: ["npc_mom"],
    illustration: "cooking.svg",
    bgColor: "#2d1f1f",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    isTransition: true,
    requiredAttributes: ["cooking"],
    optionalAttributes: ["independence"],
    body: `除夕，早上八点。

「起来啦！」妈妈的声音从厨房传来，「今天的任务重，妈一个人忙不过来！」

你揉着眼睛走进厨房。妈妈已经系好了围裙，正在水池边洗鱼。那是一条大草鱼，活蹦乱跳的，尾巴还在啪啪地拍打着水面。

「来，你负责切菜。」妈妈头也不抬，「葱姜蒜切好，待会儿要爆锅。土豆切丝，萝卜切片，肉切块——记住了吗？」

你点点头，拿起菜刀。

案板上摆着一堆食材：土豆、白萝卜、五花肉、青椒、豆腐干、芹菜...还有你最爱吃的藕片。妈妈准备做满满一桌年夜饭——红烧鱼、糖醋排骨、藕丸子、蒜蓉西兰花...光想想就流口水。

「先从土豆开始。」妈妈在旁边指点，「丝要切细一点，粗了不好熟。」

你小心翼翼地切着，刀在案板上发出「咚咚」的声音。可是手一抖，土豆丝切成了土豆条，粗细不一。

妈妈叹了口气：「你这刀工...算了，我来。你去剥蒜。」

你有些不好意思，拿起一瓣蒜开始剥。蒜皮黏糊糊的，剥了半天剥不干净。

「用刀背拍一下，就好剥了。」妈妈示范了一下，「你这孩子，在外面都吃外卖吧？」

「嗯...」你有些心虚。

妈妈摇摇头：「以后要学着自己做饭，外卖不健康。学会了，做给未来的...」她顿了顿，「做给自己吃。」

你知道她想说什么，故意岔开话题：「妈，这个藕怎么洗啊？」

「用清水泡一会儿，再搓一搓。」妈妈一边说，一边麻利地切着肉，「你看妈做这些都做了几十年了。」

窗外的阳光透过玻璃照进来，在厨房的地砖上投下斑驳的光影。妈妈忙碌的身影在油烟中若隐若现，围裙上已经沾了不少油渍。

「妈，要不我来做？」你试探着问。

「你会做什么？」妈妈怀疑地看着你。

「我...会煎蛋？」

妈妈笑了：「算了，妈来。你帮我把那个盘子洗了，待会儿要装菜。」

你乖乖地去洗盘子。厨房里的油烟味越来越重，妈妈开始炸藕丸子了，金黄的丸子「滋滋」作响，香气扑鼻。

「来，尝尝。」妈妈夹了一个丸子递到你嘴边。

你咬了一口，外酥里嫩，是小时候的味道。

「好吃吗？」

「好吃！」

妈妈笑了，眼角的皱纹舒展开来：「那你多吃点。在外面肯定吃不到这么正宗的。」

*这就是家的味道吧。*

*油烟味里，藏着妈妈的爱。*`,
    choices: [
      {
        text: "认真学做一道菜，争取明年独立完成",
        tone: "conservative",
        energyCost: 25,
        skillCheck: {
          attr: "cooking",
          difficulty: 40,
          label: "帮妈妈做年夜饭",
          required: true
        },
        effects: [
          { type: "attr", target: "cooking", delta: 15 },
          { type: "attr", target: "independence", delta: 5 },
          { type: "affection", target: "npc_mom_affection", delta: 20 }
        ],
        feedback: {
          success: "你成功地做了一道糖醋排骨！虽然卖相一般，但味道还行。妈妈欣慰地说：「我家孩子真的长大了。」",
          fail: "油溅到了手背，痛得你直叫。妈妈心疼地说：「算了算了，你出去吧，妈一个人来。」",
        },
        nextQuestId: "time_d2a"
      },
      {
        text: "负责采购和清洗，避开高难度烹饪",
        tone: "idealist",
        energyCost: 15,
        skillCheck: {
          attr: "cooking",
          difficulty: 25,
          label: "基础厨房任务"
        },
        effects: [
          { type: "attr", target: "cooking", delta: 5 },
          { type: "affection", target: "npc_mom_affection", delta: 10 }
        ],
        feedback: {
          success: "你把菜洗得干干净净，摆放整齐。妈妈说：「洗菜都洗得这么好，不错不错。」",
          fail: "你不小心打碎了一个盘子，妈妈心疼得直念叨：「这个盘子用了十几年了...」"
        },
        nextQuestId: "time_d2a"
      },
      {
        text: "主动承包一整道硬菜，证明自己",
        tone: "aggressive",
        energyCost: 30,
        skillCheck: {
          attr: "cooking",
          difficulty: 50,
          label: "硬菜挑战"
        },
        effects: [
          { type: "attr", target: "cooking", delta: 20 },
          { type: "attr", target: "independence", delta: 10 },
          { type: "affection", target: "npc_mom_affection", delta: 15 }
        ],
        feedback: {
          success: "你一个人完成了糖醋排骨！色泽红亮，酸甜可口。妈妈尝了一口，眼眶红了：「真的长大了...」",
          fail: "你把糖和醋的比例搞错了，整锅排骨又咸又酸。妈妈无奈地倒了重做：「孩子，妈不是打击你，但做饭这事真的得练。」",
        },
        nextQuestId: "time_d2a"
      }
    ],
    unlockedNext: "time_d2a",
    nextQuestId: "time_d2a",
    phase: 1
  },

  // ============================================
  // 【Day 2 下午】过渡：贴春联放鞭炮
  // ============================================
  {
    id: "quest_trans_d2a",
    chapterIndex: 2.2,
    title: "除夕 · 贴春联放鞭炮",
    subtitle: "红红火火，年味十足",
    timeSlot: "除夕 · 下午",
    description: "贴春联、放鞭炮，考验你的身体灵活度和勇气",
    npcInvolved: ["npc_dad"],
    illustration: "springcouplet.svg",
    bgColor: "#3d2a1f",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    isTransition: true,
    requiredAttributes: ["agility"],
    optionalAttributes: ["resilience"],
    body: `除夕，下午两点。

吃过午饭，爸爸从杂物间里翻出一堆春联和福字：「来来来，今年你负责贴吧。」

你看着那一堆红彤彤的对联，有些发愁：「爸，我贴不好的...」

「有什么贴不好的？」爸爸把浆糊递给你，「贴春联是有讲究的，上联贴右边，下联贴左边，福字要倒着贴，寓意'福到了'。」

你接过春联。红底金字，印着「春风得意年年好，福运绑身步步高」——这是你小时候每年都能在邻居家门口看到的那种。

爸爸又搬出梯子：「来，你扶着，我上去贴。」

「爸，我上去贴吧。」你突然说。

爸爸愣了一下：「你？」

「我试试。」你挽起袖子，「小时候我看您贴吧，现在轮到我了。」

爸爸笑了，眼角的皱纹舒展开来：「行，你上去。爸给你扶着梯子。」

你爬上梯子。梯子有些晃，你的腿有点抖。爸爸在下面稳稳地扶着：「慢点，别急。」

你站直身子，把春联比划了一下：「爸，是这个位置吗？」

「往左一点...再往左...好，贴上！」

你贴好上联，又开始贴下联。可是手一抖，春联歪了。

「歪了歪了！」爸爸在下面喊。

你调整了一下，还是有点歪。最后爸爸看不下去了：「下来吧，让我来。」

你从梯子上下来，爸爸三下五除二就把春联贴好了，又正又直。

「爸，您怎么这么厉害？」

爸爸笑了：「贴了三十多年了，能不厉害吗？」

贴完春联，又开始放鞭炮。爸爸从柜子里搬出一挂长长的鞭炮：「来，你来放。」

「我？」你有些紧张，「爸，您来吧，我害怕...」

「怕什么？男孩子要勇敢点！」爸爸把打火机塞到你手里，「来，点着引线就跑。」

你颤抖着点燃打火机，火苗「噗」的一声亮了。你把火苗凑近引线——

「嗤——」

引线着了！火花四溅！

你撒腿就跑，「噼里啪啦」的声音在身后响起，震耳欲聋。红色的鞭炮屑飞溅在空中，落在你的头发上、衣服上。

跑出十几米远，你才敢回头。爸爸站在门口，朝你挥手：「漂亮！」

鞭炮声渐渐停息，空气里弥漫着浓重的硝烟味。你看着满地的红色鞭炮屑，闻着这熟悉的味道。

*过年了。*

*真真正正地，过年了。*`,
    choices: [
      {
        text: "尝试自己贴完所有春联，证明自己",
        tone: "conservative",
        energyCost: 20,
        skillCheck: {
          attr: "agility",
          difficulty: 35,
          label: "爬高贴春联"
        },
        effects: [
          { type: "attr", target: "agility", delta: 10 },
          { type: "attr", target: "independence", delta: 5 },
          { type: "affection", target: "npc_dad_affection", delta: 15 }
        ],
        feedback: {
          success: "你成功贴完了所有的春联和福字！虽然有一点点歪，但爸爸说：「比我当年第一次贴得还好！」",
          fail: "你从梯子上摔下来了！好在只是擦破了点皮。爸爸心疼地说：「算了算了，还是我来吧。」"
        },
        nextQuestId: "time_d2e"
      },
      {
        text: "负责放鞭炮，挑战自己的勇气",
        tone: "aggressive",
        energyCost: 15,
        skillCheck: {
          attr: "agility",
          difficulty: 40,
          label: "鞭炮勇气测试"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 8 },
          { type: "attr", target: "agility", delta: 5 },
          { type: "affection", target: "npc_dad_affection", delta: 10 }
        ],
        feedback: {
          success: "你成功点燃了所有的鞭炮！从一开始的手抖，到后来的从容，爸爸骄傲地说：「这才是我家的孩子！」",
          fail: "你被鞭炮声吓到了，蹲在地上捂着耳朵。爸爸无奈地摇摇头，自己把剩下的放完了。"
        },
        nextQuestId: "time_d2e"
      },
      {
        text: "和爸爸分工合作，完成春节布置",
        tone: "idealist",
        energyCost: 10,
        skillCheck: {
          attr: "social",
          difficulty: 25,
          label: "家庭协作"
        },
        effects: [
          { type: "attr", target: "social", delta: 5 },
          { type: "affection", target: "npc_dad_affection", delta: 10 }
        ],
        feedback: {
          success: "你和爸爸配合默契，半小时就完成了所有布置。妈妈在厨房喊：「贴完了就过来帮忙！」",
          fail: "你们父子俩因为春联的正反意见不合，吵了一架。最后还是妈妈出来打圆场：「行了行了，差不多就行了。」"
        },
        nextQuestId: "time_d2e"
      }
    ],
    unlockedNext: "time_d2e",
    nextQuestId: "time_d2e",
    phase: 1
  },

  // ============================================
  // 【Day 2 晚上】除夕 · 年夜饭（主线）
  // ============================================
  {
    id: "quest_cn_02",
    chapterIndex: 2,
    title: "除夕 · 年夜饭",
    subtitle: "一桌团圆饭，满桌家常话",
    timeSlot: "除夕 · 晚上",
    description: "一桌子年夜饭，奶奶的第一轮催婚正式打响...",
    npcInvolved: ["npc_mom", "npc_dad", "npc_grandma"],
    scene: "dinner",
    illustration: "dinner.svg",
    bgColor: "#8B0000",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    requiredAttributes: ["independence"],
    optionalAttributes: ["resilience", "social"],
    body: `除夕，下午四点。

老家的小区里已经响起了零星的鞭炮声，「噼里啪啦」的声音从楼下传来，紧接着是一阵孩子们的欢笑声。你拖着行李箱走进楼道，闻到了熟悉的油烟味——妈妈在炸丸子了。那是老家特有的味道，每年只有过年才能闻到，金黄的藕丸子、萝卜丸子，炸得外酥里嫩，是你的最爱。

推开那扇有些掉漆的防盗门，熟悉的场景映入眼帘。客厅的墙上挂着新买的福字，红底金字，透着一股喜庆劲儿。电视里放着春晚的预告片，那些熟悉的主持人面孔在屏幕上轮流出现，背景音乐是《难忘今宵》的前奏。茶几上堆满了坚果和糖果，瓜子、花生、开心果，还有你小时候最爱吃的大白兔奶糖。

奶奶已经坐在沙发上等着了，穿着那件你去年寄回去的红色棉袄，头发梳得整整齐齐，耳朵上戴着金耳环。她的手边放着一杯热茶，冒着袅袅的白烟。

「回来了！」奶奶的眼睛一下子亮了起来，「快让孩子洗手吃饭！」

妈妈从厨房探出头，围裙都没来得及解，额头上还沾着一点面粉：「哎呀，回来啦？累不累？快把外套脱了，屋里暖和。」

「奶奶好！」你放下行李，走过去抱了抱奶奶。奶奶的手有些粗糙，但很温暖，她拍了拍你的背：「瘦了，在外面没吃好？脸都尖了。」

年夜饭摆满了一桌子，热气腾腾的。

正中央是那条红烧鱼，妈妈每年都会做，寓意「年年有余」。鱼身上浇着浓郁的酱汁，葱姜蒜的香气扑鼻而来。鱼是爸爸一早去菜市场买的活鱼，妈妈亲手宰杀、清洗、腌制、慢炖，花了大半天功夫。

旁边的饺子是妈妈亲手包的，面皮薄得透光，里面藏着肉馅。妈妈的包饺子手艺是跟外婆学的，捏出来的褶子整整齐齐，像一排小月牙。*你知道，其中一个饺子里藏了一枚洗净的硬币，谁吃到谁来年好运。*

你最爱吃的糖醋排骨堆成小山，色泽红亮，酸甜可口。还有香菇炖鸡，清炖的老母鸡，汤色金黄；油焖大虾，虾壳被炸得酥脆，可以直接吃掉；凉拌藕片，爽脆开胃；蒜蓉西兰花，清淡健康。

爸爸开了瓶茅台，酒香四溢，给你倒了小半杯：「喝点，暖暖身子，外面冷吧？」

「爸，我不会喝酒...」

「练练，女孩子家也要会喝酒。」爸爸难得开了个玩笑，把酒瓶放回柜子里。

奶奶坐在主位，这是老家过年的规矩，长辈坐上座。她眯着眼睛打量你，目光从你的脸上移到身上，又移到脸上。

「今年多大了来着？二十...二十几了？」奶奶问道。

「二十七。」你小声回答。

「二十七啦！」奶奶的声音突然提高了八度，转头看向你妈，「秀英啊，咱们老张家，二十五岁以下的都结婚了，你看看这孩子...」

你妈连忙接话，声音里带着几分尴尬：「妈，现在年轻人都忙事业，不着急...」

「什么不着急！」奶奶筷子往桌上一拍，震得盘子都跳了一下，「我像她这么大的时候，你都会跑了！你看看隔壁老李家的孙女，比她小两岁，都抱上孩子了！人家那孩子都会喊奶奶了！」

饭桌上的气氛突然有些微妙。爸爸低着头夹菜，假装没听见，其实他的耳朵竖得老高。妈妈脸色有些不好看，但也不敢顶撞奶奶，只能尴尬地笑笑。

「奶奶，现在时代不一样了...」你想解释。

「什么时代不一样！」奶奶打断你，「我跟你爷爷那会儿，也是自由恋爱，你爷爷在工厂里修机器，我一眼就看上他了。你爷爷长得可精神了，浓眉大眼的...」

*又来了。* 你在心里默默叹气。奶奶每次提起爷爷，眼睛里都会泛起光，那是她这辈子最骄傲的事。爷爷走了十五年了，但奶奶每年过年都会提起他。

「行了行了，吃饭吃饭。」爸爸终于开口，夹了一块排骨放到你碗里，「瘦成这样，多吃点。」

妈妈连忙转移话题：「来来来，大家吃鱼，年年有余！」

电视里，春晚终于开始了。开场是热闹的歌舞《春潮颂》，演员们穿着鲜艳的服装，在舞台上翩翩起舞。主持人的声音从客厅的每个角落传来：「观众朋友们，新年好！」

窗外突然亮了起来——不知道是谁家开始放烟花了。你透过窗户看出去，五颜六色的烟花在天空中绽放，「砰」的一声，又一朵金色的菊花在天上炸开，照亮了整个夜空。

「好看！」你忍不住说。

「县城现在管得松了，」爸爸说，「以前都不让放，现在过年可以放一点。」

奶奶的唠叨暂时停下了，大家开始专心吃饭。电视里的小品逗得全家人哈哈大笑，妈妈笑得眼泪都出来了，你趁机往嘴里塞了好几块排骨。

吃完饭，妈妈端上来一盘切好的水果，苹果、橙子、砂糖橘，还有你最爱吃的草莓。

「来，吃点水果。」妈妈把草莓推到你面前，「可贵了，我今天早上去超市买的。」

你拿起一颗草莓放进嘴里，酸甜的汁水在口腔里蔓延开来。这是老家特有的味道，是妈妈的味道。

手机震动了一下，是闺蜜{{npc_bestie.name}}发来的微信：「姐妹，除夕快乐！年夜饭撑住！」后面跟了一个加油的表情包。

又一条：「我妈也在问我有没有男朋友，我已经躲进厕所了。」

你偷偷笑了一下，刚想回复，奶奶的声音又响起来了：「吃饱了没？来，坐奶奶这儿，奶奶有话跟你说...」`,
    isMainQuest: true,
    choices: [
      {
        text: "主动帮妈妈端菜，展示一年成长",
        tone: "conservative",
        energyCost: 15,
        skillCheck: {
          attr: "independence",
          difficulty: 35,
          label: "展现独立能力"
        },
        effects: [
          { type: "attr", target: "independence", delta: 10 },
          { type: "attr", target: "cooking", delta: 5 },
          { type: "affection", target: "npc_mom_affection", delta: 15 },
          { type: "affection", target: "npc_dad_affection", delta: 5 }
        ],
        feedback: {
          success: "妈妈笑着说：「我家孩子真的长大了。」奶奶看着你熟练地端菜动作，满意地点点头。",
          fail: "妈妈叹了口气：「算了，你不会做，我来。」你有些尴尬地退到一边。"
        },
        nextQuestId: "time_d3m"
      },
      {
        text: "乖乖坐着等开饭，避免惹麻烦",
        tone: "idealist",
        energyCost: 5,
        skillCheck: {
          attr: "social",
          difficulty: 20,
          label: "低调度过"
        },
        effects: [
          { type: "affection", target: "npc_mom_affection", delta: -5 },
          { type: "attr", target: "resilience", delta: 3 }
        ],
        feedback: {
          success: "你保持低调，默默吃饭，没有引起奶奶的注意，安稳地度过了这顿饭。",
          fail: "奶奶看了你一眼：「怎么像个客人一样？在自己家还这么见外？」"
        },
        nextQuestId: "time_d3m"
      },
      {
        text: "笑着回应奶奶：「奶奶，我现在还在拼事业呢」",
        tone: "aggressive",
        energyCost: 20,
        skillCheck: {
          attr: "resilience",
          difficulty: 45,
          label: "在亲戚面前化解尴尬问题"
        },
        effects: [
          { type: "attr", target: "independence", delta: 10 },
          { type: "attr", target: "resilience", delta: 8 },
          { type: "affection", target: "npc_grandma_affection", delta: -10 },
          { type: "affection", target: "npc_dad_affection", delta: 5 }
        ],
        feedback: {
          success: "奶奶愣了一下，然后笑了：「这孩子，有出息！」气氛缓和下来，爸爸暗暗给你竖了个大拇指。",
          fail: "奶奶的脸沉了下来：「拼什么事业，姑娘家家的，找个好人家才是正经事！」年夜饭在沉默中继续，妈妈的脸色很难看。"
        },
        nextQuestId: "time_d3m"
      }
    ],
    unlockedNext: "time_d3m",
    nextQuestId: "time_d3m",
    phase: 1
  },

  // ============================================
  // 【Day 3 上午】过渡：给长辈拜年
  // ============================================
  {
    id: "quest_trans_d3m",
    chapterIndex: 3.1,
    title: "初一 · 给长辈拜年",
    subtitle: "一声新年好，满满都是情",
    timeSlot: "初一 · 上午",
    description: "给长辈拜年是春节的传统，考验你的社交能力",
    npcInvolved: ["npc_grandma", "npc_mom"],
    illustration: "newyear.svg",
    bgColor: "#2a1f1f",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    isTransition: true,
    requiredAttributes: ["social"],
    optionalAttributes: ["resilience"],
    body: `大年初一，早上七点。

窗外传来一阵阵鞭炮声，把你从睡梦中惊醒。妈妈已经在客厅里忙活了，手里拿着一个红色的小本子，上面密密麻麻地写着名字——这是今年要拜年的长辈名单。

「起来了？」妈妈看到你，「快换衣服，待会儿咱们去给你奶奶、二爷爷、三叔公他们拜年。」

你揉了揉眼睛：「妈，这么早...」

「早什么早！初一拜年要趁早，去晚了人家都出门了！」妈妈催促着，「红包准备好了没？奶奶给的那两千，你包几个小红包分给小孩子。」

你连忙翻出钱包，数出几张红票子。

出门的时候，天才蒙蒙亮。空气里弥漫着鞭炮的硝烟味，混着家家户户煮饺子的香气。小区里的路灯还没熄灭，昏黄的光照在落满鞭炮屑的地上，红彤彤的一片。

第一家是奶奶家。

「奶奶，过年好！」你推开门，大声说着。

奶奶坐在沙发上，看到你进来，眼睛笑成了月牙：「哎呦，我的大孙女来了！来来来，吃糖！」

你从口袋里掏出红包：「奶奶，这是给您的新年红包。」

「哎呀，给什么红包！」奶奶推回来，「你挣钱不容易，奶奶不要你的钱。倒是你，什么时候能给奶奶带回个孙女婿，奶奶就开心了！」

「妈！」你妈妈在旁边小声说，「大过年的，说这些干什么。」

「我说的是实话！」奶奶理直气壮，「你看看隔壁老李家的孙女，比你小两岁，都会打酱油了！」

你连忙转移话题：「奶奶，我给您捶捶背。」

「还是我孙女贴心。」奶奶舒服地闭上眼睛，「在外面要照顾好自己，别光顾着工作。」

你一边给奶奶捶背，一边偷偷看了妈妈一眼。妈妈的表情有些复杂。

从奶奶家出来，又去了二爷爷家、三叔公家。每到一家，都是一样的流程：拜年、说吉祥话、发红包、然后被问一遍「有对象了吗」。

「现在年轻人压力大，不着急。」二爷爷说。

「不着急什么！二十五过了就是豆腐渣了！」三叔公的老伴反驳。

你感觉自己像是个被展览的物品，每个长辈都要上前打量一番。

终于拜完了年，你长舒了一口气。

*这一上午的「灵魂拷问」，比上班还累...*`,
    choices: [
      {
        text: "认真给每个长辈拜年，准备好吉祥话",
        tone: "conservative",
        energyCost: 20,
        skillCheck: {
          attr: "social",
          difficulty: 30,
          label: "给红包说吉祥话"
        },
        effects: [
          { type: "attr", target: "social", delta: 10 },
          { type: "affection", target: "npc_grandma_affection", delta: 15 },
          { type: "affection", target: "npc_mom_affection", delta: 10 }
        ],
        feedback: {
          success: "你的吉祥话让每个长辈都笑得合不拢嘴。奶奶骄傲地跟邻居说：「这是我家孙女，在大城市工作，可出息了！」",
          fail: "你一着急说错了话，把「福如东海」说成了「福如东逝水」，长辈们面面相觑。"
        },
        nextQuestId: "time_d3a"
      },
      {
        text: "用幽默化解尴尬，把催婚变成段子",
        tone: "aggressive",
        energyCost: 25,
        skillCheck: {
          attr: "resilience",
          difficulty: 45,
          label: "幽默化解催婚"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 10 },
          { type: "attr", target: "social", delta: 5 },
          { type: "affection", target: "npc_grandma_affection", delta: -5 },
          { type: "affection", target: "npc_bestie_affection", delta: 5 }
        ],
        feedback: {
          success: "你机智地回答每个问题，把七大姑八大姨都说得无言以对。回家后小敏发来消息：「姐妹，你太厉害了！」",
          fail: "你开玩笑开过头了，奶奶气得直拍桌子：「你这孩子，怎么这么不正经！」"
        },
        nextQuestId: "time_d3a"
      },
      {
        text: "派发红包，用钱封住长辈的嘴",
        tone: "idealist",
        energyCost: 30,
        skillCheck: {
          attr: "wealth",
          difficulty: 40,
          label: "红包攻势"
        },
        effects: [
          { type: "attr", target: "wealth", delta: -10 },
          { type: "affection", target: "npc_mom_affection", delta: 15 },
          { type: "affection", target: "npc_grandma_affection", delta: 10 }
        ],
        feedback: {
          success: "大红包一出，长辈们笑得眼睛都看不见了。奶奶说：「这孩子，真懂事！」",
          fail: "你准备的红包不够分，场面一度尴尬。妈妈悄悄又塞给你一千块：「再补几个。」"
        },
        nextQuestId: "time_d3a"
      }
    ],
    unlockedNext: "time_d3a",
    nextQuestId: "time_d3a",
    phase: 2
  },

  // ============================================
  // 【Day 3 下午】初一 · 走亲戚连环问（主线）
  // ============================================
  {
    id: "quest_cn_03",
    chapterIndex: 3,
    title: "初一 · 走亲戚连环问",
    subtitle: "七大姑八大姨的「灵魂拷问」",
    timeSlot: "初一 · 下午",
    description: "二婶、表哥、七大姑八大姨轮番轰炸，你准备好接招了吗？",
    npcInvolved: ["npc_mom", "npc_grandma", "npc_bestie"],
    scene: "family",
    illustration: "family.svg",
    bgColor: "#2d2419",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    requiredAttributes: ["resilience"],
    optionalAttributes: ["social", "independence"],
    body: `大年初一，下午两点。

按照老家的规矩，初一要给长辈拜年。你换上妈妈昨晚熨好的新衣服——一件红色的毛呢大衣，是去年过年买的，今年穿依然合身。你在镜子前照了照，化了点淡妆，把头发梳得整整齐齐。

「快点快点！」妈妈在客厅催促，「你二婶她们都到了！」

你跟着爸妈下楼，看到奶奶家的小院里已经停满了车。大伯家的SUV霸道地横在门口，二婶家的白色轿车停在角落，还有几个你叫不上来名字的亲戚的车。院子里搭了个简易的塑料棚，棚下摆了七八桌酒席，红色的塑料桌布上摆满了瓜子花生和糖果。

「来啦！」二婶第一个迎上来，眼睛上下打量你，目光像扫描仪一样从你的脸上移到身上，又从身上移到脚上，「哟，这是小谁吧？越长越俊了！在城里待着就是不一样，皮肤都白了！」

你还没来得及叫一声「二婶好」，二婶已经开口了：

「有对象了吗？」她直截了当地问，「我记得你表妹，比你小两岁，去年刚结的婚，老公是个当兵的，可帅了！人家那老公，一米八的大个子，在部队里还是个军官呢！你表妹现在过得可好了，天天在朋友圈晒娃。」

「还没呢，二婶。」你妈替你回答，语气有些尴尬。

「哎呀，这都二十几了还没对象？」二婶一副大惊小怪的样子，嘴巴张得老大，「现在不找，等老了就不好找了！你二婶我跟你说，女孩子家的，过了二十五就是豆腐渣了！你看看你，瘦成这样，在外面是不是天天不吃饭减肥？这样对身体不好，将来怀孕都难！」

*又来了。* 你在心里翻了个白眼。

「二婶，现在都流行晚婚晚育...」你试图解释。

「什么晚婚晚育！」二婶打断你，「那是城里人忽悠你的！你二婶我活了五十多年，什么没见过？趁年轻赶紧找一个，等你过了三十，就只能找二婚的了！你表姐，你知道吧？就是那个比你大五岁的，她二十五岁的时候还不着急，结果呢？最后找了个离婚的，还带着个孩子！」

*表姐其实是自由恋爱嫁得很好的好吗...* 你在心里默默吐槽。

好不容易进了屋，又被拉去见七大姑八大姨。

大姑坐在沙发上，手里捧着茶杯，上下打量你：「工作怎么样啊？一个月挣多少？」

「还行，大姑，在深圳做互联网。」

「互联网？」大姑皱起眉头，「是不是就是那种天天对着电脑的？我听说那个工作很累的，猝死的人特别多！你可得注意身体啊！」

二姨凑过来，神秘兮兮地问：「听说在一线城市？那地方房价多贵啊，买房了吗？」

「还没...」

「哎呀，那可不行！」二姨一副过来人的样子，「女孩子家家的，没房子怎么行？你看你表弟，去年在县城买了套一百二十平的，首付都是他爸妈出的！」

三叔从旁边走过来，手里夹着烟：「有没有考虑回来发展？你表哥在县城开了个店，卖建材的，一年也能挣二三十万，比你们在外面打工强！你在外面挣得多，花得也多，最后还不是一场空？」

「就是就是，」三婶附和道，「在外面租房多贵啊，一个月三四千，一年下来四五万，都给房东打工了！回来多好，你妈天天给你做好吃的，还不用自己洗衣服！」

你感觉自己的脸都要笑僵了，只能不停点头：「嗯嗯，是是...」

好不容易应付完这一波，你溜到院子里喘口气。

冬日的阳光暖洋洋地洒在身上，院子里的腊梅花开得正盛，散发着淡淡的清香。远处的鞭炮声此起彼伏，「噼里啪啦」的，像是战斗的号角。

表姐带着老公和孩子来了。三岁的小姑娘穿着红色的棉袄，扎着两个小揪揪，摇摇晃晃地走过来喊你「姨姨」。

「叫姑姑。」表姐笑着说，拍了拍女儿的小脑袋，「你这小丫头，见谁都喊姨姨。」

表姐夫跟在后面，手里拎着几袋礼品。他穿着一件黑色羽绒服，身材微胖，脸上带着憨厚的笑容。他把礼品放下，过来跟你打了个招呼：「回来啦？在外边怎么样？」

「还行，姐夫。」你蹲下来逗小姑娘，小姑娘咯咯笑着，伸手要抱。

「你看你表姐夫多会照顾人，」表姐笑着说，眼神里满是幸福，「每天下班回来都帮我做饭，周末还带我出去逛街。」

*我知道你嫁得好，但不用这么炫耀吧...* 你在心里吐槽。

「你也赶紧找一个，」表姐继续说，「我给你介绍一个，我们单位有个男同事，人挺好的，在县城医院上班，是医生。」

「不用了不用了...」你连忙摆手。

「怕什么！」表姐拍了拍你的肩膀，「去见见又不会少块肉。你就是太挑了，这也不行那也不行。」

表哥走过来，递给你一瓶饮料：「妹，别听她们瞎说，自己过得好就行。」

你感激地看他一眼，心想表哥不愧是读过大学的人，格局就是不一样。

「对了，」表哥开口了，「你那边有没有合适的女生？给我介绍一下呗，我一个哥们儿条件可好了，在深圳有房有车，就是一直没找到合适的。」

*......* 你在心里默默叹了口气。

「妹，你在一线城市，人脉广，帮忙介绍介绍呗！」

你感觉自己像是掉进了一个无底的漩涡，每一个问题都是一道陷阱，每一个亲戚都是一台复读机。

远处，电视里传来春晚重播的声音，小品演员正在讲着「单身是狗」的段子。你看到二婶正在跟大姑窃窃私语，时不时往你这边看，不用猜也知道她们在聊什么。

手机震动了一下，是{{npc_bestie.name}}的微信：「姐妹！你那边怎么样了！我这边已经被问了八遍了！我妈问我什么时候生二胎！我连对象都没有！救命！」

你偷偷笑了一下，刚想回复，耳边又传来二婶的声音：「来来来，小谁，过来，二婶给你看张照片，这个人可好了...」`,
    isMainQuest: true,
    choices: [
      {
        text: "礼貌应付：「好的表哥，有合适的给您介绍」",
        tone: "conservative",
        energyCost: 15,
        skillCheck: {
          attr: "social",
          difficulty: 35,
          label: "亲戚应对测试"
        },
        effects: [
          { type: "attr", target: "social", delta: 5 },
          { type: "affection", target: "npc_mom_affection", delta: 5 },
          { type: "affection", target: "npc_grandma_affection", delta: 5 }
        ],
        feedback: {
          success: "你机智地应付了每一个亲戚，表哥满意地逢人就说「我妹在一线城市工作，人脉广」。妈妈听到这话，脸上有光，晚上多吃了一碗饭。",
          fail: "你回答得磕磕绊绊，二婶撇撇嘴：「这孩子，在大城市待久了，连话都不会说了。」",
        },
        nextQuestId: "time_d3e"
      },
      {
        text: "反问表哥：「表哥您条件这么好，怎么不给介绍介绍我？」",
        tone: "aggressive",
        energyCost: 20,
        skillCheck: {
          attr: "resilience",
          difficulty: 45,
          label: "反唇相讥测试"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 10 },
          { type: "attr", target: "independence", delta: 5 },
          { type: "affection", target: "npc_bestie_affection", delta: 5 }
        ],
        feedback: {
          success: "表哥一愣，讪讪地笑了笑：「我...我这不一样。」七大姑在旁边起哄：「就是就是，你们互相介绍嘛！」气氛一度很尴尬，但你也算出了口气。",
          fail: "你反击得太厉害，二婶的脸沉了下来：「你这孩子，怎么这么不会说话！」妈妈在旁边尴尬地陪笑。"
        },
        nextQuestId: "time_d3e"
      },
      {
        text: "找借口溜走，给闺蜜发微信吐槽",
        tone: "idealist",
        energyCost: 10,
        skillCheck: {
          attr: "social",
          difficulty: 40,
          label: "逃离测试"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 5 },
          { type: "affection", target: "npc_bestie_affection", delta: 15 },
          { type: "affection", target: "npc_mom_affection", delta: -10 }
        ],
        feedback: {
          success: "你躲到角落给{{npc_bestie.name}}发了条微信：「救命！」{{npc_bestie.name}}秒回：「我这边更惨，三姑六婆问我什么时候生二胎！」你们互相发了一堆表情包，互相取暖。",
          fail: "你刚躲到厕所，妈妈就追了进来：「你躲什么？长辈问你话呢！」你只好又硬着头皮出去了。"
        },
        nextQuestId: "time_d3e"
      }
    ],
    unlockedNext: "time_d3e",
    nextQuestId: "time_d3e",
    phase: 2
  },

  // ============================================
  // 【Day 3 晚上】过渡：守岁麻将局
  // ============================================
  {
    id: "quest_trans_d3e",
    chapterIndex: 3.2,
    title: "初一 · 守岁麻将局",
    subtitle: "麻将桌上的春节",
    timeSlot: "初一 · 晚上",
    description: "亲戚家的麻将局，考验你的运气和社交",
    npcInvolved: ["npc_mom", "npc_dad"],
    illustration: "mahjong.svg",
    bgColor: "#1f2a1f",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    isTransition: true,
    requiredAttributes: ["luck"],
    optionalAttributes: ["social"],
    body: `初一，晚上八点。

吃过年夜饭（初一的「年」是中午过的），亲戚们都没急着走。三婶张罗了一桌麻将：「来来来，过年不打牌，手痒得慌！」

爸爸也被拉上了桌。你本来想回房间休息，但妈妈拉住了你：「来，你也学学。在外面不会打麻将，人家会说你土的。」

*真的会这么说吗？* 你心里嘀咕，但还是坐了下来。

「来来来，新手可以胡牌，但不许赖账！」三婶笑着说，开始码牌。

你看着那一百多张麻将牌，脑袋有点发懵。什么是「筒子」什么是「条子」什么是「万子」？什么是「听牌」什么是「胡牌」？

「我教你。」二叔坐到你旁边，「先认牌。筒子是圆的，条子是长的，万子是...你自己看吧。」

你点点头，努力辨认着每一张牌。

第一把，你稀里糊涂地打了张牌出去。

「碰！」二婶立刻喊。

然后你又被「吃」了，又被「碰」了，最后二婶「胡」了。

「哈！新手送财！」二婶笑眯眯地收钱。

你输了一百块。

第二把，你稍微懂了点规则，但还是打错了牌。

「你这孩子，」妈妈在旁边急得直跺脚，「三万不能拆！三万是搭子！」

你委屈地看着她：「妈，你又没教过我...」

第三把，第四把...你一直在输。口袋里的红包钱已经少了一半。

「算了算了，」爸爸看不下去了，「让你妈来吧。」

妈妈立刻顶上来：「来来来，我陪你们打！」

妈妈一上桌，立刻不一样了。摸牌、看牌、出牌，动作一气呵成。「碰！」「杠！」「胡！」

你站在旁边看，妈妈赢了一把又一把，把你输的钱都赢了回来。

「你妈年轻的时候可是麻将高手！」爸爸骄傲地说。

你看着妈妈一脸得意的样子，忍不住笑了。

*原来妈妈也有这样的一面。*

窗外又传来鞭炮声。远处有人在放烟花，「砰」的一声，一朵金色的烟花在天空中绽放。

「又过了一年了...」你喃喃自语。

二叔拍了拍你的肩膀：「小伙子，明年再战啊！」

你苦笑：「二叔，您还是饶了我吧...」`,
    choices: [
      {
        text: "认真学习麻将技巧，争取明年不输钱",
        tone: "conservative",
        energyCost: 15,
        skillCheck: {
          attr: "luck",
          difficulty: 40,
          label: "麻将手气测试"
        },
        effects: [
          { type: "attr", target: "social", delta: 5 },
          { type: "attr", target: "luck", delta: 5 },
          { type: "affection", target: "npc_mom_affection", delta: 10 }
        ],
        feedback: {
          success: "你终于学会看牌了！最后一局居然胡了一把，把输的钱都赢回来了。妈妈骄傲地说：「我家孩子就是聪明！」",
          fail: "你越学越乱，最后输了个精光。妈妈叹了口气：「你这孩子，没继承我的天赋。」",
        },
        nextQuestId: "time_d4m"
      },
      {
        text: "借口不熟，专注观察家人互动",
        tone: "idealist",
        energyCost: 10,
        skillCheck: {
          attr: "social",
          difficulty: 25,
          label: "观察测试"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 5 },
          { type: "affection", target: "npc_dad_affection", delta: 10 }
        ],
        feedback: {
          success: "你坐在旁边观察，发现爸爸会偷偷给妈妈喂牌，妈妈假装不知道。这种小默契，让你想起了他们的爱情。",
          fail: "你观察得太明显，二婶问：「你看什么呢？」你只好假装看手机。"
        },
        nextQuestId: "time_d4m"
      },
      {
        text: "主动出击，挑战高难度牌局",
        tone: "aggressive",
        energyCost: 25,
        skillCheck: {
          attr: "luck",
          difficulty: 50,
          label: "高难度麻将挑战"
        },
        effects: [
          { type: "attr", target: "luck", delta: 10 },
          { type: "attr", target: "social", delta: 5 },
          { type: "affection", target: "npc_dad_affection", delta: 10 }
        ],
        feedback: {
          success: "你打出了一把「清一色」，全场震惊！爸爸骄傲地给你发朋友圈：「我儿子/女儿是麻将天才！」",
          fail: "你高调挑战，结果输得更惨。红包钱全部输光，还欠了二叔两百块。"
        },
        nextQuestId: "time_d4m"
      }
    ],
    unlockedNext: "time_d4m",
    nextQuestId: "time_d4m",
    phase: 2
  },

  // ============================================
  // 【Day 4 上午】过渡：回娘家
  // ============================================
  {
    id: "quest_trans_d4m",
    chapterIndex: 4.1,
    title: "初二 · 回娘家",
    subtitle: "妈妈家的团圆",
    timeSlot: "初二 · 上午",
    description: "初二回娘家，看望外婆和舅舅",
    npcInvolved: ["npc_mom"],
    illustration: "matriarchal.svg",
    bgColor: "#2d1f2d",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    isTransition: true,
    requiredAttributes: [],
    optionalAttributes: ["social", "independence"],
    body: `初二，早上九点。

「初二回娘家」，这是老家的规矩。妈妈一大早就开始收拾东西：给外婆的保健品、给舅舅的烟酒、给表弟表妹的红包...

「快点快点，」妈妈催促着，「你外婆等着呢。」

你跟着爸妈，提着大包小包，开车去外婆家。外婆家在镇上的老房子里，那是一栋八十年代建的两层小楼，墙皮已经斑驳脱落，但门前挂着一串红辣椒，窗台上摆着几盆绿植，显得很有生活气息。

外婆已经七十多岁了，但身体还硬朗。她站在门口等着，看到车来了，脸上笑开了花：

「哎呦，我的外孙来了！」

你跑过去抱住外婆：「外婆，过年好！」

外婆的手有些瘦弱，但很温暖。她拉着你的手往屋里走：「来来来，进来，外面冷。」

舅舅一家已经到了。舅妈在厨房忙着做饭，表哥表弟在客厅里打闹。

「来了！」舅舅过来拍了拍你的肩膀，「今年回来得早啊。」

「舅舅过年好！」你赶紧问好。

「好好好，」舅舅笑着，「快坐下，吃点糖。」

午饭很丰盛。外婆早早地就开始准备——红烧肉、糖醋鱼、香菇炖鸡、凉拌藕片...满满一桌子。

「多吃点，」外婆一直给你夹菜，「瘦成这样，在外面肯定没好好吃饭。」

「外婆，我吃饱了...」

「吃饱了？才吃这么点！」外婆心疼地说，「在外面是不是天天吃外卖？」

你不知道怎么回答，只好低头继续吃。

饭桌上，外婆又开始「灵魂拷问」：

「有对象了没？」

「还没呢，外婆。」

「还没？！」外婆惊讶地看着妈妈，「秀英啊，你这当妈的，怎么不着急啊？」

妈妈苦笑：「妈，催了，她说不要。」

「你这孩子！」外婆转向你，「外婆跟你说，找对象这事得趁早。过了这个村就没这个店了！你看你舅舅，当年就是二十三岁就结婚了，现在孩子都这么大了！」

舅舅在旁边尴尬地笑：「妈，说我干什么...」

你低头扒饭，决定闭嘴。

饭后，外婆拉着你的手说话：

「孩子，在外面要照顾好自己。外婆老了，也不知道还能看你几年...」

你心里一酸：「外婆，您别这么说，您身体好着呢。」

「好不好的，我自己知道。」外婆笑了笑，「外婆就是希望你能平平安安的，将来有个人陪着你，外婆走了也能放心。」

你抱了抱外婆：「外婆，您会长命百岁的。」

从外婆家出来，妈妈的眼睛有些红。

「妈，您怎么了？」

「没什么，」妈妈揉了揉眼睛，「就是想起你外婆老了...」

窗外，夕阳西下，把天边染成了一片金红色。

*原来，妈妈也有脆弱的一面。*`,
    choices: [
      {
        text: "陪外婆聊天，倾听她的故事",
        tone: "conservative",
        energyCost: 15,
        skillCheck: {
          attr: "social",
          difficulty: 25,
          label: "亲情交流"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 8 },
          { type: "affection", target: "npc_mom_affection", delta: 15 }
        ],
        feedback: {
          success: "外婆跟你讲了她年轻时的故事，眼睛里有光。你第一次觉得，外婆不只是那个「催婚的老太太」，她也曾是个有故事的少女。",
          fail: "外婆讲着讲着就开始打瞌睡了，你赶紧给她盖上毯子，让她好好休息。"
        },
        nextQuestId: "time_d4a"
      },
      {
        text: "帮外婆做家务，展示自己的独立",
        tone: "idealist",
        energyCost: 20,
        skillCheck: {
          attr: "cooking",
          difficulty: 35,
          label: "家务能力测试"
        },
        effects: [
          { type: "attr", target: "cooking", delta: 10 },
          { type: "attr", target: "independence", delta: 5 },
          { type: "affection", target: "npc_mom_affection", delta: 10 }
        ],
        feedback: {
          success: "你帮外婆把厨房收拾得干干净净，外婆骄傲地说：「我家孩子真懂事！」",
          fail: "你不小心打碎了外婆的腌菜坛子，尴尬得满脸通红。"
        },
        nextQuestId: "time_d4a"
      },
      {
        text: "给外婆包一个大红包，表达孝心",
        tone: "aggressive",
        energyCost: 25,
        skillCheck: {
          attr: "wealth",
          difficulty: 45,
          label: "红包孝心测试"
        },
        effects: [
          { type: "attr", target: "wealth", delta: -15 },
          { type: "affection", target: "npc_mom_affection", delta: 20 }
        ],
        feedback: {
          success: "外婆收到红包，眼睛都红了：「孩子长大了，懂事了...」",
          fail: "外婆坚持不收你的红包，说什么都要给你塞回来。最后还是妈妈出面「保管」了这笔钱。"
        },
        nextQuestId: "time_d4a"
      }
    ],
    unlockedNext: "time_d4a",
    nextQuestId: "time_d4a",
    phase: 2
  },

  // ============================================
  // 【Day 4 下午】初二 · 老同学聚会重逢前任（主线）
  // ============================================
  {
    id: "quest_cn_04",
    chapterIndex: 4,
    title: "初二 · 老同学聚会重逢前任",
    subtitle: "多年不见，你还好吗？",
    timeSlot: "初二 · 下午",
    description: "高中同学群里有人组织聚会，你犹豫要不要去...",
    npcInvolved: ["npc_ex", "npc_bestie"],
    scene: "reunion",
    illustration: "reunion.svg",
    bgColor: "#1f2d3d",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    requiredAttributes: ["resilience"],
    optionalAttributes: ["romance", "social"],
    body: `大年初二，中午十二点。

你躺在床上刷手机，窗外的阳光透过窗帘的缝隙照进来，在被子上画出一道金色的光线。你本来想再赖一会儿床，结果高中同学群突然热闹了起来。

「过年难得聚聚，今天中午老地方见！」——发消息的是当年的班长李明，消息后面还跟着一个酒杯的表情。

群里陆续有人回复：

「好！必须到！」
「好久没见大家了！想你们了！」
「老地方是哪？县城那个老火锅店吗？」
「对对对，就是那个！味道正宗，老板娘还记得我们！」

你犹豫着要不要报名。高中毕业都八年了，很多同学的名字都已经对不上脸。当年在班里，你是那种默默无闻的类型，成绩中上，长相中上，既不是班花也不是学霸，存在感不强。

*去还是不去呢？*

这时，群里弹出一条新消息，头像是一张风景照——

「陈一凡：我也去，好久没见大家了。」

你的手指停在了屏幕上。

陈一凡——你的大学初恋。当年你们是同班同学，大一开学第一天，他就坐在你旁边。白衬衫，牛仔裤，戴着一副黑框眼镜，笑起来有两个浅浅的酒窝。

后来你们交往了两年。两年里，一起泡图书馆占座，一起在食堂排队打饭，一起在教学楼天台上看日落。他会在你感冒的时候跑遍整个学校给你买药，会在你生日的时候偷偷准备惊喜，会在你难过的时候安静地陪在你身边。

大四那年，他说要去深圳发展，那边有更好的机会。你说你想留在大城市，不想回老家。他说他可以带你一起去深圳。你说你家里不同意，你妈希望你能回家考个公务员。

两个人谁也不肯妥协，最后和平分手。

分手那天是六月七号，正好是高考纪念日。他在图书馆门口等你，手里拎着你爱吃的糖炒栗子，笑着说：「如果三年后，我们都还单身，就再在一起吧。」

你点点头，眼泪在眼眶里打转。

他没有挽留，你也没有回头。

你回到宿舍，躲在被子里哭了一整夜。室友{{npc_bestie.name}}骂了他一整一个星期，说他是「渣男」「骗子」「不值得」。

你没有等到三年后的那一天。分手半年后，你听说他回了老家，托关系进了县城的单位。一年后，又听说他相亲认识了个本地的女孩，双方父母都很满意。

去年五一，他结婚了。婚礼就在县城最大的酒店办的，朋友圈里全是他们的婚纱照。新娘长得很清秀，笑容温婉。

你默默点了个赞，然后删掉了那条动态。

「姐妹你去不去？」{{npc_bestie.name}}发来微信。

你把手机屏幕截图发给她：「看到了吧？那渣男也去？」

{{npc_bestie.name}}秒回：「我靠！他也去？！姐妹你别去了，去了给自己添堵！」

又一条：「但是你要是不去，显得你心虚。你本来就没做错什么，怕他干嘛？」

再一条：「你自己决定，想去就去，不想去就不去。我支持你。」

你看着镜子里的自己，想起了那年夏天，陈一凡站在宿舍楼下，手里拎着你爱吃的糖炒栗子，笑着说「给你」的样子。夕阳的余晖洒在他身上，他整个人都镀上了一层金色的光。

那是你们分手前的最后一面。

*三年了，你早就放下了吧？*

*只是...还是有点好奇，他现在过得怎么样。*

群里，班长又发了一条：「都谁去？报个数，我好订包间。男生五个，女生七个，还有位置！」

紧接着又一条：「一凡，你带嫂子一起来吧！让大家认识认识！」

「陈一凡：她今天有事，下次吧。」

{{npc_bestie.name}}又发来消息：「姐妹，你要是去的话，我陪你！有我在，那渣男不敢怎么样！」

你盯着屏幕，手指悬在键盘上方。

*去还是不去？*

*去了说什么？*

*「你好，好久不见」？*

*还是「你现在过得怎么样」？*

*或者干脆装作不认识？*

窗外的阳光越来越亮，远处的鞭炮声断断续续地传来。你坐起身来，看着衣柜里挂着的那些衣服。

*也许，该去看看了。*

*不是因为他，只是因为...*

*三年了，是时候给那段感情画上一个真正的句号了。*

你拿起手机，在群里输入：「我去。」

发出去的那一刻，你感觉自己好像放下了什么。`,
    isMainQuest: true,
    choices: [
      {
        text: "聊几句就走，不给自己添堵",
        tone: "conservative",
        energyCost: 15,
        skillCheck: {
          attr: "resilience",
          difficulty: 40,
          label: "情绪管理测试"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 5 },
          { type: "affection", target: "npc_ex_affection", delta: 0 },
          { type: "affection", target: "npc_bestie_affection", delta: 5 }
        ],
        feedback: {
          success: "你在聚会上跟大家打了招呼，和陈一凡简单聊了几句后就找借口离开了。小敏发微信：「姐妹，你走得太早了！」你回复：「不想给自己添堵。」",
          fail: "你被陈一凡的老婆秀了一脸恩爱，气得提前离场。回家后小敏骂了你一晚上。"
        },
        nextQuestId: "time_d4e"
      },
      {
        text: "和前任单独聊聊，想知道TA过得怎么样",
        tone: "aggressive",
        energyCost: 25,
        skillCheck: {
          attr: "romance",
          difficulty: 45,
          label: "前任应对测试"
        },
        effects: [
          { type: "attr", target: "romance", delta: 10 },
          { type: "attr", target: "resilience", delta: 5 },
          { type: "affection", target: "npc_ex_affection", delta: 10 },
          { type: "affection", target: "npc_bestie_affection", delta: 3 }
        ],
        // v7: 标记与前任重归于好，可能触发「破镜重圆」结局
        flags: { reconciled_ex: true },
        feedback: {
          success: "散场后，陈一凡走过来：「要不要...单独聊聊？」你犹豫了一下，点点头。你们走到火锅店外的街边，夜风吹过，空气里飘着硝烟味。",
          fail: "陈一凡想跟你单独聊聊，被你冷冷地拒绝了。他的老婆在远处看着你，眼神复杂。"
        },
        nextQuestId: "time_d4e"
      },
      {
        text: "全程装作不认识，避免尴尬",
        tone: "idealist",
        energyCost: 10,
        skillCheck: {
          attr: "resilience",
          difficulty: 35,
          label: "伪装测试"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 8 },
          { type: "affection", target: "npc_bestie_affection", delta: 5 }
        ],
        feedback: {
          success: "你全程淡定应对，跟陈一凡的交集不多不少。回家的路上，你深深地呼了一口气——原来放下一个人，也没那么难。",
          fail: "你的伪装太明显，班长打趣：「你们两个怎么都不说话？当年不是谈过吗？」全场哄笑。"
        },
        nextQuestId: "time_d4e"
      }
    ],
    unlockedNext: "time_d4e",
    nextQuestId: "time_d4e",
    phase: 2
  },

  // ============================================
  // 【Day 4 晚上】过渡：和前任深夜长谈
  // ============================================
  {
    id: "quest_trans_d4e",
    chapterIndex: 4.2,
    title: "初二 · 和前任深夜长谈",
    subtitle: "夜色下的对话，三年后的释怀",
    timeSlot: "初二 · 晚上",
    description: "散场后，你和陈一凡走到街边，开始了一场迟来的对话",
    npcInvolved: ["npc_ex"],
    illustration: "nighttalk.svg",
    bgColor: "#1a2535",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    isTransition: true,
    requiredAttributes: ["romance"],
    optionalAttributes: ["resilience"],
    body: `大年初二，晚上十点。

聚会散场后，你和陈一凡走出火锅店，站在街边。夜风很冷，吹在脸上像刀割一样。远处传来零星的鞭炮声。

「好久不见。」他先开口，声音有些沙哑。

「嗯，好久不见。」你把围巾裹紧。

你们并排站着，谁也没有先开口。

「你...过得怎么样？」他终于问道。

「还行，在深圳做产品经理。你呢？」

「回老家了，」他苦笑，「在县城的国企，朝九晚五。」

「怎么回来了？」

他沉默了一会儿：「在深圳待了半年，发现自己不适合。而且...我爸生病了。肝癌晚期，医生说最多还有半年。」

你愣住了。

「他走之前，拉着我的手说，让我别再跑了，留在妈妈身边。」陈一凡的眼眶红了，「我是家里独子，我妈一个人...我不能再让她孤单了。」

「对不起，我不知道...」

「没事，都过去了。」他擦了擦眼睛，「我爸走了快一年了，我妈现在身体也不好。后来...家里催着相亲，去年认识了现在的女朋友，今年五一订婚了。」

*订婚了...*

「那...挺好的。」你勉强笑了笑。

「你呢？有对象了吗？」

「没有，还单着。」

「其实...」他犹豫了一下，「我一直想跟你说声对不起。因为我没有坚持。」

「不是你的错，是生活选择了我们。」

「如果...」他看着你，眼神里有些不舍，「如果当初我们都妥协一下，是不是就不会走到今天？」

你看着他，心里五味杂陈。

「没有如果，我们都做了自己的选择。」

远处传来烟花爆炸的声音，五颜六色的烟花在天空中绽放。

「我该回去了。」你说。

「等等！」他叫住你，走过来站在你面前，眼神很复杂：「如果...如果有一天，我自由了，你...还愿意等我吗？」

你的心跳得很快。

「我知道这样说很不负责任，」他继续说，「但我真的...忘不了你。这一年来，我每天都在想，如果当初选择不一样，我们是不是还在一起？」

「你好好想想，」他说，「我等你的回答。」

说完，他转身离开了。

你站在原地，看着他的背影渐渐消失在夜色中。

手机震动了，是小敏的微信：「姐妹，聊得怎么样？」

你手指颤抖着打字：「他问我...还愿不愿意等他。」

小敏秒回一串感叹号：「什么？！他不是订婚了吗？！」

「是啊...」

「姐妹，你千万别答应！这种男人不能要！」

你看着小敏的消息，心里乱成一团。

*等，还是不等？*

*陈一凡，你还值得我再相信一次吗？*`,
    choices: [
      {
        text: "给他时间，看他接下来怎么做",
        tone: "conservative",
        energyCost: 20,
        skillCheck: {
          attr: "romance",
          difficulty: 50,
          label: "挽回前任的心"
        },
        effects: [
          { type: "attr", target: "romance", delta: 5 },
          { type: "affection", target: "npc_ex_affection", delta: 10 },
          { type: "affection", target: "npc_bestie_affection", delta: -5 }
        ],
        // v7: 标记与前任重归于好
        flags: { reconciled_ex: true },
        feedback: {
          success: "你决定先观察他的行动。接下来几天，陈一凡每天都会发微信给你，说他在考虑退婚的事。小敏警告你：「姐妹，别被他骗了！」",
          fail: "你犹豫着要不要答应，他却没有再联系你。原来他也没那么坚定。"
        },
        nextQuestId: "time_d5m"
      },
      {
        text: "直接拒绝：「你已经订婚了，别再说这些」",
        tone: "aggressive",
        energyCost: 15,
        skillCheck: {
          attr: "resilience",
          difficulty: 40,
          label: "拒绝前任测试"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 10 },
          { type: "affection", target: "npc_ex_affection", delta: -10 },
          { type: "affection", target: "npc_bestie_affection", delta: 15 }
        ],
        feedback: {
          success: "你给他发微信：「你已经订婚了，别再说这些了。祝你幸福。」然后删掉了他的微信。小敏给你点赞：「姐妹，干得漂亮！」",
          fail: "你拒绝得太直接，伤了他的自尊。回家路上，你心里有些不是滋味。"
        },
        nextQuestId: "time_d5m"
      },
      {
        text: "和闺蜜好好聊聊，听听她的看法",
        tone: "idealist",
        energyCost: 10,
        skillCheck: {
          attr: "social",
          difficulty: 30,
          label: "闺蜜咨询"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 5 },
          { type: "affection", target: "npc_bestie_affection", delta: 15 }
        ],
        feedback: {
          success: "小敏听了你的话，认真地分析：「姐妹，这种男人不能要。但是你自己也要想清楚，到底还爱不爱他。」你想了一整晚。",
          fail: "小敏直接破口大骂陈一凡，反而让你更乱了。"
        },
        nextQuestId: "time_d5m"
      }
    ],
    unlockedNext: "time_d5m",
    nextQuestId: "time_d5m",
    phase: 2
  },

  // ============================================
  // 【Day 5 上午】主线：妈妈安排相亲（分支起点）
  // ============================================
  {
    id: "quest_cn_05a",
    chapterIndex: 5,
    title: "初三 · 妈妈的相亲安排",
    subtitle: "躲不掉的相亲",
    timeSlot: "初三 · 上午",
    description: "妈妈「不经意」地提起有个「朋友的孩子」，你心里有数了",
    npcInvolved: ["npc_mom", "npc_dad"],
    scene: "conversation",
    illustration: "chat.svg",
    bgColor: "#2a1f1f",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    requiredAttributes: ["independence"],
    optionalAttributes: ["resilience"],
    body: `大年初三，早上九点。

阳光透过窗帘的缝隙照进房间，在被子上画出一道金色的光线。你还在睡懒觉，迷迷糊糊地躺在床上，脑子里还回想着昨晚跟{{npc_bestie.name}}聊天的内容。

突然，一阵敲门声把你吵醒。

「起来了吗？」妈妈的声音从门外传来，带着一丝压抑不住的兴奋。

你揉了揉眼睛，迷迷糊糊地爬起来，打开房门。妈妈已经穿戴整齐坐在客厅里了——这可不常见，春节期间她一般都在厨房忙活，今天怎么有空坐在客厅？

「妈，怎么了？」你打了个哈欠。

「今天有空吧？」妈妈的语气很随意，像是在问今天天气怎么样，但眼神却一直在你身上转悠。

「什么事？」你警觉起来，每次妈妈用这种语气说话，后面肯定没好事。

「也没什么事...」妈妈假装整理茶几上的报纸，动作有些不自然，「就是...你王阿姨说，她同事家有个孩子，在民政局上班，人挺不错的...」

你心里一沉，果然来了。

「妈，我才回来几天...」

「就见一面！」妈妈连忙说，语速明显加快了，「人家也是大好青年，见见怎么了？又没让你马上结婚！你王阿姨把你照片给对方看了，人家挺满意的，说想见见你。」

*王阿姨把我的照片给人了？什么时候的事？*

「妈，您怎么不经过我同意就把照片给人了？」你有些无奈。

「哎呀，这不是为你好吗？」妈妈一副理直气壮的样子，「你王阿姨跟我关系好，她同事家的孩子又知根知底的，我想着见见又不会少块肉，就...」

爸爸从房间里走出来，手里端着一杯茶，看了妈妈一眼：「催什么催，孩子刚回来，让她歇歇。」

「我催什么了？」妈妈的语气立刻变硬，「我不就是问问嘛！你这个死老头子，每次都唱反调！」

「我怎么唱反调了？我这不是心疼孩子吗？」

你看着这熟悉的场景，每次说到相亲，爸妈就会开始互相瞪眼。爸爸是个老实人，不善言辞，但每次妈妈逼你相亲的时候，他都会出来打圆场。

「行了行了，」你揉了揉太阳穴，感觉脑袋隐隐作痛，「什么时候？在哪儿？」

妈妈眼睛一亮，脸上的笑容藏都藏不住：「下午三点，县城那个咖啡馆，就在大润发旁边那个，叫什么来着...对了，时光里！你王阿姨说那孩子下午有空。」

「就一下午？安排得挺紧的。」

「人家也是公务员，不好请假嘛！」妈妈站起来，恨不得现在就拉着你去换衣服，「去换件好看的衣服，画个淡妆，别邋里邋遢的给人留下不好的印象...」

「妈，我知道了。」你打断她，「让我先洗个脸行不行？」

「行行行，快去快去！」妈妈催促道，「对了，对方叫林晓，在民政局婚姻登记处上班，你王阿姨说长得挺清秀的，性格也好...」

你一边刷牙一边想：*林晓...民政局...长得挺清秀...*

*听起来好像还行？*

*不对，我在想什么呢！我只是去应付一下，又不是真的相亲...*

*可是万一是奇葩怎么办？*

*算了，不合适就跑呗，{{npc_bestie.name}}说的。*

换衣服的时候，你的手机响了。是{{npc_bestie.name}}发来的微信：

「姐妹！我刚打听到了！你妈说的那个相亲对象，叫林晓，是民政局的，人长得挺清秀的。我有个同学认识她同事，说性格不错，挺温柔的，但是...」

「但是什么？」你连忙问。

「但是听说去年刚分手，原因是前男友去北京工作了，然后就...你懂的。」

你看着屏幕，心里有些复杂。

*去年刚分手...*

*所以她也是被家里催着来相亲的？*

*跟我一样？*

{{npc_bestie.name}}又发来一条：「姐妹，我觉得你可以去见见。两个人都有过感情经历，说不定更能理解对方呢？而且民政局的工作稳定，待遇也不错。唯一的缺点可能是...在县城工作，以后你要是想回深圳，可能会有点麻烦。」

你想了想，回复：「先见见再说吧。」

{{npc_bestie.name}}秒回：「加油姐妹！要是有什么情况随时跟我说！我给你当军师！」

后面还跟了一串表情包，有加油的、有祈祷的、还有一个举着旗子的。

你笑了笑，把手机放到一边。

镜子里的自己，穿着一件米白色的毛衣，配了一条牛仔裤。头发有些乱，你随手扎了个马尾。

*这样应该可以吧？*

*又不是去相亲，只是...见个面而已。*

*妈妈说得对，见见又不会少块肉。*

窗外传来一阵鞭炮声，是谁家在迎喜神。空气里飘着淡淡的硝烟味，混着厨房里飘来的饭菜香。

*林晓...*

*到底是个什么样的人呢？*`,
    isMainQuest: true,
    choices: [
      {
        text: "精心打扮去赴约，认真对待这次相亲",
        tone: "conservative",
        energyCost: 20,
        skillCheck: {
          attr: "independence",
          difficulty: 30,
          label: "相亲准备测试"
        },
        effects: [
          { type: "attr", target: "social", delta: 5 },
          { type: "attr", target: "independence", delta: 5 },
          { type: "affection", target: "npc_mom_affection", delta: 15 },
          { type: "affection", target: "npc_dad_affection", delta: 5 }
        ],
        feedback: {
          success: "妈妈看到你换上新裙子，眼睛都亮了：「这才像我闺女！」她塞给你五百块钱：「买点咖啡喝，别让人家请。」爸爸在一旁默默点头。",
          fail: "你精心打扮了半小时，结果被妈妈嫌弃：「这件衣服太素了，换那件红色的！」你只好重新换衣服。"
        },
        nextQuestId: "time_d5e"
      },
      {
        text: "随便穿穿去见面，抱着随便应付的心态",
        tone: "idealist",
        energyCost: 5,
        skillCheck: {
          attr: "resilience",
          difficulty: 20,
          label: "低姿态测试"
        },
        effects: [
          { type: "affection", target: "npc_mom_affection", delta: -10 },
          { type: "affection", target: "npc_dad_affection", delta: 0 }
        ],
        feedback: {
          success: "你穿得很随意，妈妈气得直念叨：「你怎么这么不上心！」但你也顺利「应付」了这次相亲。",
          fail: "妈妈看到你的穿着，脸色有些不好看：「你就穿这个去？」你耸耸肩：「反正是随便见见。」妈妈叹了口气，欲言又止。"
        },
        nextQuestId: "time_d5e"
      },
      {
        text: "跟妈妈讨价还价：「我去可以，但我有条件」",
        tone: "aggressive",
        energyCost: 15,
        skillCheck: {
          attr: "independence",
          difficulty: 40,
          label: "谈判测试"
        },
        effects: [
          { type: "attr", target: "independence", delta: 10 },
          { type: "affection", target: "npc_mom_affection", delta: 5 },
          { type: "affection", target: "npc_dad_affection", delta: 10 }
        ],
        feedback: {
          success: "你提出条件：「我去见面，但以后不要再逼我相亲。」妈妈想了想，点头：「行，先把这事儿办了再说。」爸爸悄悄给你竖了个大拇指。",
          fail: "妈妈犹豫了一下：「这个...我答应你，但这次你必须认真对待！」气氛有些僵。"
        },
        nextQuestId: "time_d5e"
      }
    ],
    unlockedNext: "time_d5e",
    nextQuestId: "time_d5e",
    phase: 2,
    isMainQuest: true
  },

  // ============================================
  // 【Day 5 下午】主线：闺蜜来访
  // ============================================
  {
    id: "quest_cn_05",
    chapterIndex: 5,
    title: "初三 · 闺蜜来访",
    subtitle: "{{npc_bestie.name}}带着你爱吃的来了",
    timeSlot: "初三 · 下午",
    description: "{{npc_bestie.name}}带着你爱吃的来了，这次是战友情报局开张",
    npcInvolved: ["npc_bestie", "npc_mom"],
    scene: "coffee",
    illustration: "coffee.svg",
    bgColor: "#2a1f2d",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    requiredAttributes: ["social"],
    optionalAttributes: ["resilience"],
    body: `大年初三，下午两点。

你正在房间里刷手机，突然门铃响了。

「谁啊？」你从床上爬起来，趿拉着拖鞋走到门口。

打开门，一股熟悉的奶茶香味扑面而来——是你最爱喝的芋泥波波。{{npc_bestie.name}}站在门口，手里拎着两杯奶茶和一袋零食，脸上挂着大大的笑容。

「Surprise！」她笑嘻嘻地挤进门，「想我没？」

「你怎么来了？」你又惊又喜。

「怎么，不欢迎我？」{{npc_bestie.name}}换上拖鞋，直奔你房间，顺手把一杯奶茶塞到你手里，「我妈那边太无聊了，天天问我什么时候生二胎，我逃出来透透气。诶，这是给你的，你最爱喝的。」

你接过奶茶，芋泥的香气钻进鼻腔：「谢谢，你怎么知道我想喝这个？」

「废话，你朋友圈天天发，我闭着眼都能背出来。」{{npc_bestie.name}}换好鞋，直奔你房间，把零食往床上一扔，「阿姨呢？」

「阿姨好！」{{npc_bestie.name}}看到坐在客厅沙发上的妈妈，大声打招呼。

妈妈从沙发上站起来，脸上的笑容藏都藏不住：「{{npc_bestie.name}}来啦？哎呦，好久不见，又变漂亮了！留下来吃饭啊，阿姨给你做红烧排骨！」

「阿姨我不吃了，就是来看看她。」{{npc_bestie.name}}换了鞋，直奔你房间，顺手把一杯奶茶塞到你手里，「给你，我路过那家店特意买的，你最爱喝的。」

「不用了不用了！」{{npc_bestie.name}}连忙摆手，「阿姨您忙，我跟她聊会儿天就走了，不麻烦您。」

「不麻烦不麻烦！」妈妈笑着说，「你们年轻人聊，我出去买菜，晚上给{{npc_bestie.name}}做好吃的！」

妈妈换上外套，拎着菜篮子出门了。临走前还回头看了你一眼，眼神里满是意味深长。

门「砰」的一声关上了。

关上门，{{npc_bestie.name}}立刻把声音压低了，眼睛里闪着八卦的光：「说！昨天聚会怎么样？有没有见到陈一凡？」

你把昨天的事简单说了一遍——怎么犹豫要不要去，怎么换衣服纠结了半天，怎么到了火锅店，怎么见到阔别多年的老同学，怎么跟陈一凡打了那个招呼。

「然后呢？」{{npc_bestie.name}}急切地问，「他说什么了？有没有跟他老婆秀恩爱？」

「然后就没了。」你耸耸肩，「他带着老婆来的，主动跟我打了个招呼，说了句'好久不见，你还是老样子'，就没了。」

「就这？」{{npc_bestie.name}}一脸失望，「他就说了句'好久不见'？」

「不然呢？」你喝了口奶茶，「我们还能聊什么？叙叙旧？回忆当年？」

「渣男本质，鉴定完毕。」{{npc_bestie.name}}嫌弃地说，「当年那么对你，现在装作什么都没发生过，呵。我当初就说他是渣男，你不听。」

「都过去的事了。」你又喝了口奶茶，「再说了，我当初也没觉得他有多好...」

「嘴硬！」{{npc_bestie.name}}戳了戳你的额头，「当年你为了他哭成那样，以为我忘了？」

你沉默了。那是大四分手后的那段日子，你每天晚上都躲在被子里哭，白天装作若无其事地上课、吃饭、找工作。{{npc_bestie.name}}每天陪你吃饭、陪你逛街、陪你骂陈一凡，骂了整整一个星期。

「行行行，不提他了。」{{npc_bestie.name}}从包里掏出手机，「说正事！你妈这两天有没有给你安排相亲？」

你沉默了一下。

{{npc_bestie.name}}一拍大腿：「有对不对！我就知道！你妈那个人，我还不了解？每次你一回来，她就开始行动了！」

「初四...好像有一个。」你小声说，「说是民政局的公务员，长得还行。」

「什么？！」{{npc_bestie.name}}眼睛都亮了，差点把奶茶喷出来，「民政局的？铁饭碗中的铁饭碗啊！你妈这次靠谱啊！」

「可是我不想去...」

「可是什么？」{{npc_bestie.name}}盯着你，「先说说，你想找什么样的？」

你张了张嘴，发现自己答不上来。

*想找什么样的？*

*高的？帅的？有钱的？对我好的？*

*可是这样的标准也太模糊了吧。*

*而且就算有这样的人，凭什么会看上我呢？*

{{npc_bestie.name}}叹了口气，从口袋里掏出一张折叠的纸，上面密密麻麻写满了字。

「我帮你分析了一下，」她把纸展开，指着上面的字，「第一，你在一线城市工作，圈子其实很窄，每天就是公司和出租屋两点一线，偶尔跟同事吃个饭，哪有机会认识新的人？第二，你长得不差，但眼光也别定太高，现在男女比例失调，好的都被抢光了；第三，别被那些毒鸡汤洗脑了，什么'不将就''宁缺毋滥'，说得好像随便找个人就会过得不幸似的...」

「可是我不想随便找个人凑合。」你打断她。

「谁说随便了？」{{npc_bestie.name}}认真地看着你，「姐妹，我跟你说句心里话。」

「嗯。」

「我去年结婚的时候，其实也有点不甘心。」{{npc_bestie.name}}的声音低了下来，眼神有些飘远，「我老公不是最完美的，没车没房，工资也没我高。追我的人里面，比他条件好的多了去了。」

「但是你选择了他。」你说。

「对，因为他对我好。」{{npc_bestie.name}}笑了，那种笑容很温柔，「不是那种嘴上说说的好，是实实在在的好。我生病的时候，他半夜起来给我买药；我加班的时候，他会在公司楼下等我，有时候一等就是两三个小时；我心情不好的时候，他不会说那些有的没的，就是安静地陪着我。」

「这些...陈一凡也做过。」你说。

「对，但问题是，陈一凡不在了。」{{npc_bestie.name}}说，「姐妹，过去的事就让它过去吧。你不能因为一个人，就否定了所有可能性。」

你看着她，没有说话。

{{npc_bestie.name}}拍了拍你的肩膀：「去看看吧，万一是个好人呢？就当交个朋友。实在不行，我陪你去，给你壮胆！」

你也笑了：「你还挺仗义。」

「那必须的！」{{npc_bestie.name}}站起来，走到窗边，「对了，那个相亲对象叫什么？什么背景？你妈跟你说了没？」

「好像叫林晓...民政局的。」

「林晓？」{{npc_bestie.name}}重复了一遍，「名字挺好听的。长得什么样？你妈见过没？」

「不知道，我妈就说'长得挺清秀的'。」

「长得挺清秀？」{{npc_bestie.name}}撇撇嘴，「你妈那个审美，不能信。她觉得凤姐都长得挺清秀。」

你被她逗笑了：「那我怎么办？总不能临时放鸽子吧。」

「去啊，为什么不去？」{{npc_bestie.name}}说，「见面又不会少块肉。不合适就拉倒，合适就继续了解，这有什么？」

「如果是个奇葩呢？」

「奇葩你就跑呗！」{{npc_bestie.name}}笑着说，「我有个朋友，相亲遇到一个男的，第一次见面就问她'你跟你前任发展到哪一步了，有没有同居过'，她当场就走了。你要是不想继续，直接走人就行。」

「好吧...」你点点头。

{{npc_bestie.name}}突然凑近你，神秘兮兮地说：「我帮你打听了一下，听说这个林晓，人确实不错。就是去年刚分手，前男友去北京发展了，然后就...你懂的。」

你愣了一下：「你怎么打听到的？」

「我同学认识她同事。」{{npc_bestie.name}}说，「据说长得挺清秀的，性格也温柔，就是...有点闷。」

*有点闷？*

*这算优点还是缺点呢？*

「走吧！」{{npc_bestie.name}}拉着你的手，「出去逛逛，这附近新开了一家商场，听说有个网红奶茶店！就当散散心，别老想那些有的没的！」

你跟着她站起来，走到门口的时候，{{npc_bestie.name}}突然回头：「对了，你下午想吃什么？我让我妈晚上给你做！」

「随便吧，不挑。」

「那不行！」{{npc_bestie.name}}认真地说，「你想吃什么就说，别客气。你妈肯定早就准备好了，就等你开口。」

你想了想：「那就...红烧排骨？」

「得嘞！」{{npc_bestie.name}}给你妈发了个微信，然后拉着你出了门。

门外的阳光正好，空气里飘着淡淡的硝烟味——是附近有人在放鞭炮。远处，几个小孩正在玩摔炮，「啪啪」的声音此起彼伏。

*林晓...*

*到底是个什么样的人呢？*`,
    isMainQuest: true,
    choices: [
      {
        text: "跟{{npc_bestie.name}}好好聊聊，听听她的真实想法",
        tone: "conservative",
        energyCost: 10,
        skillCheck: {
          attr: "social",
          difficulty: 25,
          label: "闺蜜沟通测试"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 5 },
          { type: "affection", target: "npc_bestie_affection", delta: 15 },
          { type: "affection", target: "npc_mom_affection", delta: 5 }
        ],
        feedback: {
          success: "{{npc_bestie.name}}跟你聊了整整一个下午。她告诉你，她当初也是被家里催得不行，后来遇到现在的老公，虽然不是最完美的，但两个人相处得很舒服。「爱情是可以培养的，关键是你愿不愿意给对方机会。」",
          fail: "{{npc_bestie.name}}听你说完，沉默了一会儿：「我尊重你的选择，但姐妹，你得想清楚这代价你能不能承受。」"
        },
        nextQuestId: "time_d5m"
      },
      {
        text: "坚持自己的立场：「我就是要等那个人」",
        tone: "idealist",
        energyCost: 20,
        skillCheck: {
          attr: "independence",
          difficulty: 45,
          label: "立场坚持测试"
        },
        effects: [
          { type: "attr", target: "independence", delta: 10 },
          { type: "affection", target: "npc_bestie_affection", delta: -5 },
          { type: "affection", target: "npc_mom_affection", delta: -10 }
        ],
        feedback: {
          success: "{{npc_bestie.name}}叹了口气：「行吧，姐妹我尊重你。但你得想清楚，这代价你能不能承受。」她走后，你躺在床上，看着天花板发呆。妈妈敲门进来问你聊得怎么样，你点点头说「挺好的」。",
          fail: "{{npc_bestie.name}}跟你争辩起来，气氛有些紧张。最后她气呼呼地走了。"
        },
        nextQuestId: "time_d5m"
      },
      {
        text: "问{{npc_bestie.name}}：「如果是你，你会怎么选？」",
        tone: "aggressive",
        energyCost: 15,
        skillCheck: {
          attr: "social",
          difficulty: 30,
          label: "请教测试"
        },
        effects: [
          { type: "attr", target: "social", delta: 8 },
          { type: "affection", target: "npc_bestie_affection", delta: 10 }
        ],
        feedback: {
          success: "{{npc_bestie.name}}愣了一下，然后笑了：「如果是我...我会先去见见看，不合适再说。毕竟，不见面怎么知道合不合适呢？」她拍了拍你的肩膀：「别怕，姐妹陪你去。」",
          fail: "{{npc_bestie.name}}反而问你：「我哪知道？我又不是你。这种事只能你自己决定。」"
        },
        nextQuestId: "time_d5m"
      }
    ],
    unlockedNext: "time_d5m",
    nextQuestId: "time_d5m",
    phase: 2
  },

  // ============================================
  // 【Day 5 晚上】过渡：相亲前夜
  // ============================================
  {
    id: "quest_trans_d5e",
    chapterIndex: 5.2,
    title: "初三 · 相亲前夜",
    subtitle: "明天就要见面了",
    timeSlot: "初三 · 晚上",
    description: "明天就要去相亲了，妈妈在帮你做各种准备",
    npcInvolved: ["npc_mom", "npc_dad"],
    illustration: "preparation.svg",
    bgColor: "#2d1f2a",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    isTransition: true,
    requiredAttributes: [],
    optionalAttributes: ["independence", "resilience"],
    body: `初三，晚上九点。

吃完饭，妈妈开始忙活起来。她从衣柜里翻出一堆衣服：「来来来，明天穿这件！」

你看了一眼，是一件米白色的连衣裙。去年过年买的，今年穿依然合身。

「妈，这件会不会太正式了？」

「相亲的衣服能随便吗？」妈妈理直气壮，「这件显气质，妈眼光错不了。」

她又从鞋柜里翻出一双小皮鞋：「穿这双，配上裙子刚刚好。」

爸爸从客厅走过来：「别给孩子太大压力，相亲就是见个面，又不是上刑场。」

「我这不是为了孩子好吗？」妈妈瞪了爸爸一眼，「明天到了咖啡馆，要主动打招呼，要有礼貌，要表现得大方得体...」

「行了行了，我知道了。」你连忙打断她，「妈，您能不能消停一会儿？」

妈妈这才意识到自己说多了，讪讪地笑了笑：「妈是担心你。妈像你这么大的时候，早就结婚了，哪用得着相亲啊...」

「妈，时代不一样了。」

「哪里不一样了？」妈妈嘟囔着，「都是男大当婚女大当嫁。」

你叹了口气，知道再争辩下去只会让她更焦虑。

回到房间，你躺在床上看手机。小敏发来微信：

「明天加油！我给你准备了几个话题：问他喜欢什么电影、最近看什么书、平时有什么爱好。如果他回答得体，可以继续聊；如果他问'你跟前任同居过吗'这种问题，立刻撤退。」

你笑着回复：「收到，你这个军师挺敬业的。」

「那必须的！」小敏秒回，「明天聊完了第一时间告诉我，我要听现场直播！」

又发来一条：「对了，万一他问你的情况，你可以说在深圳做互联网，月薪两万（不要说具体的），有上进心，性格温和。这样第一印象会更好。」

你想了想，回复：「知道了，谢谢姐妹。」

小敏发来一个亲亲的表情包：「明天一定行！我看好你！」

你放下手机，看着天花板发呆。

*林晓...*

*民政局...*

*长得挺清秀...*

*真的只是去见个面，又不是真的相亲...*

*可是万一看对眼了呢？*

*不可能的。*

*不要想了，睡觉。*

你翻了个身，把脸埋进枕头里。

窗外，鞭炮声断断续续地传来。远处的天空中偶尔有烟花绽放，五颜六色的光芒透过窗帘的缝隙照进来，在墙上投下斑驳的影子。

*明天...*

*会是怎样的一天呢？*`,
    choices: [
      {
        text: "认真准备，给自己和对方一个机会",
        tone: "conservative",
        energyCost: 10,
        skillCheck: {
          attr: "independence",
          difficulty: 25,
          label: "准备测试"
        },
        effects: [
          { type: "attr", target: "independence", delta: 5 },
          { type: "attr", target: "social", delta: 3 },
          { type: "affection", target: "npc_mom_affection", delta: 10 }
        ],
        feedback: {
          success: "你认真地准备好了第二天要穿的衣服、要说的话。妈妈看到你认真，欣慰地说：「这才对嘛！」",
          fail: "你焦虑得睡不着，辗转反侧到半夜。妈妈敲门进来：「孩子，怎么还不睡？」"
        },
        nextQuestId: "time_d6m"
      },
      {
        text: "和闺蜜视频聊天，缓解紧张",
        tone: "idealist",
        energyCost: 15,
        skillCheck: {
          attr: "social",
          difficulty: 30,
          label: "缓解测试"
        },
        effects: [
          { type: "attr", target: "social", delta: 5 },
          { type: "affection", target: "npc_bestie_affection", delta: 10 }
        ],
        feedback: {
          success: "小敏跟你视频聊了一个小时，给你打气加油。你放松了许多，带着期待睡着了。",
          fail: "聊着聊着就忘了时间，聊到凌晨两点才挂。第二天你顶着黑眼圈起床。"
        },
        nextQuestId: "time_d6m"
      },
      {
        text: "出门散步，让心情平静下来",
        tone: "aggressive",
        energyCost: 20,
        skillCheck: {
          attr: "resilience",
          difficulty: 35,
          label: "情绪管理"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 8 },
          { type: "energy", target: "self", delta: 10 }
        ],
        feedback: {
          success: "你出门走了走，夜晚的冷风让你清醒了许多。你想清楚了：相亲没什么大不了的，就当认识个新朋友。",
          fail: "你在外面走了一圈，反而更焦虑了。妈妈急得到处找你：「这么晚了还不回来！」"
        },
        nextQuestId: "time_d6m"
      }
    ],
    unlockedNext: "time_d6m",
    nextQuestId: "time_d6m",
    phase: 2
  },

  // ============================================
  // 【Day 6 上午】主线：第一次相亲
  // ============================================
  {
    id: "quest_cn_06",
    chapterIndex: 6,
    title: "初四 · 第一次相亲",
    subtitle: "咖啡馆里的第一次见面",
    timeSlot: "初四 · 上午",
    description: "咖啡馆里的第一次见面，她/他的第一印象如何？",
    npcInvolved: ["npc_blind_date", "npc_mom"],
    scene: "dating",
    illustration: "dating.svg",
    bgColor: "#2d1f28",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    requiredAttributes: ["social"],
    optionalAttributes: ["resilience", "independence"],
    body: `大年初四，下午三点。

你提前十分钟到了咖啡馆。这家店叫「时光里」，是这两年新开的，装修得有点小清新，墙上贴满了便利贴，写着各种留言——「在此刻遇见你」「愿时光慢一点」「老地方，新开始」。窗户上贴着过年的窗花，红色的剪纸在阳光下格外醒目。

你找了个靠窗的位置坐下，窗外是一条不太热闹的街道，行人稀疏，偶尔有几辆车驶过。咖啡馆里放着轻柔的爵士乐，是那种让人放松的蓝调。

服务员过来问你要什么，你点了杯美式：「少糖，谢谢。」

手机显示两点五十五。你提前五分钟到了，而他...应该也快到了吧？

*不知道他长什么样...*

*妈妈说他「长得挺清秀的」，但妈妈那个审美...*

*算了，来都来了，见见又不会怎样。*

三点整，门口的风铃响了。

你下意识地抬头看过去——

一个女孩走了进来。身高165左右，扎着马尾辫，穿着一件米白色的羽绒服，围着一条灰色的围巾，脸上带着淡淡的妆。她的目光扫过店内，看到你的时候顿了一下，然后嘴角微微上扬。

*这就是林晓？*

*长得...好像还不错？*

*不是那种惊艳的长相，但是很耐看。*

林晓朝你走过来，脚步不快不慢。她的眼睛很亮，笑起来的时候弯弯的，像两弯新月。

「你好，我是林晓。」她微微笑了笑，声音清澈，「张阿姨介绍的。」

「你好，请坐。」你站起来，有些紧张，「我是...」

「我知道，」她打断你，「张阿姨给我看过你的照片。」

*所以她也有我的照片？*

*看来王阿姨两边都发了...*

林晓脱掉羽绒服，里面是一件浅蓝色的毛衣，干净利落。她拉开椅子坐下，动作很自然。

服务员过来点单，林晓看了眼菜单：「一杯拿铁，谢谢。」

她放下菜单，看向你：「你呢？喝什么？」

「美式，已经点了。」

「美式？」她有些惊讶，「不加糖不加奶？」

「对，喝习惯了。」

「厉害，」她笑了笑，「我喝美式会胃疼，只能喝拿铁。」

服务员端来咖啡。林晓用勺子轻轻搅动杯中的拿铁，奶泡在杯中画出漂亮的纹路。

「你...在哪儿上班来着？」她开口问道，语气里带着一丝好奇。

「我在深圳，做互联网产品经理。」

「深圳啊...」她点点头，「挺好的，大城市。是不是每天都很忙？」

「还行吧，互联网嘛，忙起来是真忙，但也能学到很多东西。」

「羡慕，」她说，「我一直想去大城市看看，但家里就我一个孩子，我妈不让我走太远。」

气氛有些尴尬了。你试图找话题：「对了，你在民政局哪个部门？」

「窗口单位，」她笑了笑，有些自嘲，「每天就是给人办结婚证离婚证。有时候一天下来，能见证好几对情侣从恋人变成夫妻，也能看到好几对夫妻从夫妻变成陌生人。」

你也笑了：「那可是见证人生大事的地方。」

「是啊，」她的目光有些飘远，似乎在想什么，「见过太多人进来时的表情了。从他们的眼神里，就能知道这段婚姻幸不幸福。」

「这么厉害？」

「职业病，」她摇摇头，「看得多了，就学会了观察。」

服务员端来小点心，是两块曲奇饼干。林晓把其中一块推到你面前：「尝尝，这家的曲奇挺好吃的。」

你们一边喝咖啡一边聊天。林晓说话很温和，不紧不慢，偶尔会笑一下。她的眼睛很好看，笑起来弯弯的，眼角还有一点点细纹——那是爱笑的人才会有的痕迹。

聊着聊着，你知道了她的基本情况：二十六岁，本地人，独生女，父母都是体制内的，在县城有一套自己的房子。去年刚结束一段三年的恋情，前男友去了北京发展，然后就分手了。

「家里人催得紧，」她说，语气里有些无奈，「我也不是不着急，就是...没遇到合适的。」

*没遇到合适的...*

*这话怎么听着这么耳熟。*

她看着你，突然问：「你怎么还是单身？」

你愣了一下，没想到她会这么直接。

「可能...还没遇到那个能让我心动的人吧。」你说。

「心动？」她重复了一遍，若有所思，「心动是什么感觉？」

「就是...看到他会心跳加速，想跟他待在一起？」

「听起来很美好，」她说，「但我一直觉得，日久生情也挺好的。」

你看着她，没有说话。

*日久生情...*

*也是一种选择吧。*

窗外的阳光慢慢西斜，在地上拉出长长的影子。咖啡馆里的人不多，零星坐着几对情侣，还有一个大叔独自坐在角落里看报纸。

咖啡快喝完的时候，林晓突然问：「加个微信吧？」

你掏出手机，扫了她的二维码。

「回去再聊。」她站起来，拿起羽绒服穿上，「今天谢谢你愿意来见我这个陌生人。」

「应该是我谢谢你才对，」你说，「咖啡是我请的。」

「那下次我请你吃饭。」

「好。」

她笑了笑，转身往门口走去。走到一半又回过头来：「对了，你什么时候回深圳？」

「后天。」

「这么快啊...」她的语气里有些说不清的东西，「那...一路顺风。」

风铃响了，她的身影消失在门外。

你坐在位置上，看着窗外她渐渐远去的背影。

*林晓...*

*好像还不错。*`,
    isMainQuest: true,
    choices: [
      {
        text: "主动结账：「我请客吧」",
        tone: "conservative",
        energyCost: 10,
        skillCheck: {
          attr: "social",
          difficulty: 25,
          label: "社交测试"
        },
        effects: [
          { type: "attr", target: "social", delta: 5 },
          { type: "affection", target: "npc_blind_date_affection", delta: 10 },
          { type: "affection", target: "npc_mom_affection", delta: 5 }
        ],
        feedback: {
          success: "林晓愣了一下，然后笑了：「谢谢。」她没有跟你争着付钱，但眼神里多了些好感。回去的路上，你收到她的微信：「今天聊得挺开心的，谢谢你的咖啡。」",
          fail: "你抢着付钱，但服务员说已经有人结过账了。原来是林晓趁你去洗手间的时候买的单。"
        },
        nextQuestId: "time_d6a"
      },
      {
        text: "AA制：「我们一人一半吧」",
        tone: "idealist",
        energyCost: 5,
        skillCheck: {
          attr: "independence",
          difficulty: 20,
          label: "AA制测试"
        },
        effects: [
          { type: "attr", target: "independence", delta: 8 },
          { type: "affection", target: "npc_blind_date_affection", delta: -5 },
          { type: "affection", target: "npc_mom_affection", delta: -5 }
        ],
        feedback: {
          success: "林晓愣了一下，然后默默掏出手机：「好吧。」气氛有些微妙。回去的路上，妈妈问你聊得怎么样，你说「还行」，妈妈有些失望。",
          fail: "你坚持AA制，林晓觉得有些生分。她对你的好感度降低了。"
        },
        nextQuestId: "time_d6a"
      },
      {
        text: "大方表示：「以后有机会我请你吃饭」",
        tone: "aggressive",
        energyCost: 15,
        skillCheck: {
          attr: "social",
          difficulty: 35,
          label: "大方测试"
        },
        effects: [
          { type: "attr", target: "social", delta: 10 },
          { type: "attr", target: "independence", delta: 5 },
          { type: "affection", target: "npc_blind_date_affection", delta: 15 },
          { type: "affection", target: "npc_mom_affection", delta: 10 }
        ],
        feedback: {
          success: "林晓的眼睛亮了一下：「好呀，那说定了。」你们互相留了微信，约好有机会再聚。回家后，妈妈第一时间冲过来问结果，你笑着说「聊得还行」。",
          fail: "你说得太热情，反而让林晓有些警惕。她笑着应下，但回去后没有主动联系你。"
        },
        nextQuestId: "time_d6a"
      }
    ],
    unlockedNext: "time_d6a",
    nextQuestId: "time_d6a",
    phase: 3
  },

  // ============================================
  // 【Day 6 下午】过渡：前任退婚抉择
  // ============================================
  {
    id: "quest_trans_d6a",
    chapterIndex: 6.1,
    title: "初四 · 前任退婚抉择",
    subtitle: "如果他真的退了，你会接受吗？",
    timeSlot: "初四 · 下午",
    description: "陈一凡发来长长的微信，说他想退婚...",
    npcInvolved: ["npc_ex"],
    illustration: "decision.svg",
    bgColor: "#1a2535",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    isTransition: true,
    requiredAttributes: ["romance"],
    optionalAttributes: ["resilience", "independence"],
    body: `初四，下午两点。

你从咖啡馆出来，正准备回家，手机突然震动了。

是陈一凡发来的微信，一条很长的语音。

你犹豫了一下，还是点开了。

「我知道现在很晚了，但我必须跟你说清楚。」他的声音很低，「昨晚回去后，我一直在想我们的事。我发现，我根本忘不了你。这一年来，我每天都在想，如果当初我坚持一下，我们是不是还在一起？我跟她在一起，只是因为家里人催。但我心里知道，我不爱她，我爱的是你。」

你握着手机的手在颤抖。

「我想退婚。我知道这样做很不负责任，但...我不能骗她一辈子。」

紧接着又是一条：「你能不能...给我一个机会？让我们重新开始？」

小敏打来电话：「姐妹！陈一凡跟你说什么了？」

「他说...他想退婚。」

电话那头沉默了三秒。

「姐妹，你听我说，」小敏的语气很严肃，「这种男人不能要。他现在跟你说要退婚，但你想过没有，他会不会只是一时冲动？他订婚的时候怎么没想起你？而且，就算他真的退婚了，你们在一起，你能保证他不会再次放弃你吗？」

你沉默了。

「姐妹，你自己好好想想。我不是要你放弃他，我只是希望你保护好自己。」

挂掉电话，你看着陈一凡发来的消息。

又是一条：「我知道你在犹豫。但请你相信我，这次我不会再放手了。」

你走在回家的路上，脚步有些沉重。

*如果他真的退了...*

*我该接受他吗？*

*可是，小敏说的也有道理...*

*当初他就是在我和他妈之间，选择了离开...*

*现在他又要为了我，放弃另一个女孩吗？*

*这样的人...真的值得我再次相信吗？*

你不知道答案。

但你知道，这个决定，可能会改变你的一生。`,
    choices: [
      {
        text: "等他退婚后再说，先观察他的行动",
        tone: "conservative",
        energyCost: 20,
        skillCheck: {
          attr: "romance",
          difficulty: 50,
          label: "挽回前任的心"
        },
        effects: [
          { type: "attr", target: "romance", delta: 5 },
          { type: "affection", target: "npc_ex_affection", delta: 5 },
          { type: "affection", target: "npc_bestie_affection", delta: -10 }
        ],
        // v7: 标记与前任重归于好，可能触发「破镜重圆」结局
        flags: { reconciled_ex: true },
        feedback: {
          success: "你回复：「你先处理好自己的事，我们再谈。」接下来几天，陈一凡每天都会发消息告诉你进度。妈妈看你心不在焉，很担心。",
          fail: "你犹豫着要不要答应，但他却没有再联系你。原来他也没那么坚定。"
        },
        nextQuestId: "time_d6e"
      },
      {
        text: "直接拒绝：「我们回不去了，祝你幸福」",
        tone: "aggressive",
        energyCost: 15,
        skillCheck: {
          attr: "resilience",
          difficulty: 45,
          label: "拒绝测试"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 12 },
          { type: "attr", target: "independence", delta: 5 },
          { type: "affection", target: "npc_ex_affection", delta: -20 },
          { type: "affection", target: "npc_bestie_affection", delta: 20 }
        ],
        feedback: {
          success: "你给他发了一条长长的微信，说明你的想法，然后删掉了他的联系方式。小敏打电话来：「姐妹，你做得对！」妈妈看你精神好了，也松了口气。",
          fail: "你拒绝得有些生硬，伤了他的自尊。回家路上，你心里有些不是滋味。"
        },
        nextQuestId: "time_d6e"
      },
      {
        text: "告诉妈妈实情，听听妈妈的意见",
        tone: "idealist",
        energyCost: 10,
        skillCheck: {
          attr: "social",
          difficulty: 30,
          label: "家庭咨询"
        },
        effects: [
          { type: "attr", target: "social", delta: 5 },
          { type: "affection", target: "npc_mom_affection", delta: 10 }
        ],
        feedback: {
          success: "你把事情告诉了妈妈。妈妈听完沉默了很久：「妈只希望你幸福。但是...这种退婚的男人，以后还会不会再退一次？」你陷入了沉思。",
          fail: "妈妈听完后，立刻炸了：「什么？退婚？这男的脑子有病吧！不准你理他！」你有些后悔告诉她。"
        },
        nextQuestId: "time_d6e"
      }
    ],
    unlockedNext: "time_d6e",
    nextQuestId: "time_d6e",
    phase: 3,
    isMainQuest: true
  },

  // ============================================
  // 【Day 6 晚上】过渡：相亲对象微信聊天
  // ============================================
  {
    id: "quest_trans_d6e",
    chapterIndex: 6.2,
    title: "初四 · 相亲对象微信聊天",
    subtitle: "初次见面后的联系",
    timeSlot: "初四 · 晚上",
    description: "晚上，你和林晓在微信上聊天",
    npcInvolved: ["npc_blind_date"],
    illustration: "wechat.svg",
    bgColor: "#2a1f2d",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    isTransition: true,
    requiredAttributes: ["social"],
    optionalAttributes: ["romance"],
    body: `初四，晚上八点。

吃完饭，你回到房间，打开微信。林晓的头像亮着，她发来了一条消息：

「到家了吗？今天聊得挺开心的。」

你回复：「到了，我也挺开心的。」

她很快又发来一条：「我妈问我今天怎么样，我说聊得挺好。她就开始絮叨，让我明天再约你出来。」

你笑了笑，回复：「我妈也是。她问我'那个林晓怎么样'，我说'还行'，她就乐得不行。」

「哈哈，天下的妈妈都一样。」林晓发来一个笑脸。

你们又聊了一会儿——关于工作，关于生活，关于这座小城。

「你在深圳工作压力大吗？」她问。

「还好吧，习惯了。」

「我挺羡慕你的，」她说，「能去大城市闯荡。我妈不让我走太远，所以只能留在县城。」

「县城也挺好的，」你回复，「离家人近。」

「嗯，」她说，「但有时候会觉得...被困住了。」

你看着这条消息，没有回复。

过了一会儿，她又发来：「我前男友...我们在一起三年。他在北京读研的时候认识的，毕业后他留在北京，我回了老家。异地了一年，他就...你懂的。」

「我懂。」你回复。

「你呢？」她问，「有没有谈过恋爱？」

你想了想，回复：「谈过。大学的时候。毕业后各奔东西，就分了。」

「嗯，」她说，「感情这种事，勉强不来。」

又聊了一会儿，林晓发来：「明天有空吗？我想约你再出来坐坐。」

你的心跳快了一拍。

「明天...」你想了想，「明天下午应该可以。」

「那明天下午三点，还是时光里？」

「好。」

「那明天见。」

「明天见。」

你放下手机，看着天花板发呆。

*林晓...*

*好像还不错。*

*要不要继续了解看看呢？*

*可是我后天就要回深圳了...*

*异地恋...能行吗？*

窗外，鞭炮声渐渐稀疏了。远处的天空中偶尔有烟花绽放，五颜六色的光芒透过窗帘的缝隙照进来，在墙上投下斑驳的影子。

你翻了个身，把脸埋进枕头里。

*明天...*

*会是怎样的一天呢？*`,
    choices: [
      {
        text: "主动找话题，加深了解",
        tone: "conservative",
        energyCost: 15,
        skillCheck: {
          attr: "social",
          difficulty: 30,
          label: "深入交流测试"
        },
        effects: [
          { type: "attr", target: "social", delta: 8 },
          { type: "affection", target: "npc_blind_date_affection", delta: 15 }
        ],
        feedback: {
          success: "你们聊到深夜，从工作聊到理想，从生活聊到价值观。越聊越投机，林晓发来：「感觉跟你很聊得来，明天一定要早点见面！」",
          fail: "你聊着聊着就没话题了，气氛有些尴尬。最后林晓说：「早点休息吧，明天见。」"
        },
        nextQuestId: "time_d7m"
      },
      {
        text: "保持礼貌距离，先观察再说",
        tone: "idealist",
        energyCost: 5,
        skillCheck: {
          attr: "independence",
          difficulty: 25,
          label: "距离测试"
        },
        effects: [
          { type: "attr", target: "independence", delta: 5 },
          { type: "affection", target: "npc_blind_date_affection", delta: 5 }
        ],
        feedback: {
          success: "你保持了礼貌的距离，不远不近。林晓觉得你挺稳重的，对你的好感度提升了。",
          fail: "你回复得太冷淡，林晓觉得你对她没意思，态度变得疏远起来。"
        },
        nextQuestId: "time_d7m"
      },
      {
        text: "问问小敏的看法，听听她的建议",
        tone: "aggressive",
        energyCost: 10,
        skillCheck: {
          attr: "resilience",
          difficulty: 25,
          label: "请教测试"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 5 },
          { type: "affection", target: "npc_bestie_affection", delta: 10 }
        ],
        feedback: {
          success: "小敏说：「这个林晓听起来不错，你要不要试试看？反正只是聊聊，又不是马上结婚。」你想了想，决定明天见面时认真观察她。",
          fail: "小敏直接劝你：「异地恋很难的，你别浪费感情了。」"
        },
        nextQuestId: "time_d7m"
      }
    ],
    unlockedNext: "time_d7m",
    nextQuestId: "time_d7m",
    phase: 3,
    isTransition: true
  },

  // ============================================
  // 【Day 7 上午】过渡：陪相亲对象逛商场
  // ============================================
  {
    id: "quest_trans_d7m",
    chapterIndex: 7.1,
    title: "初五 · 陪相亲对象逛商场",
    subtitle: "金钱观的一次小测试",
    timeSlot: "初五 · 上午",
    description: "陪林晓逛商场，考验你们的金钱观",
    npcInvolved: ["npc_blind_date"],
    illustration: "mall.svg",
    bgColor: "#2d1f2d",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    isTransition: true,
    requiredAttributes: ["wealth"],
    optionalAttributes: ["independence", "social"],
    body: `初五，上午十点。

你按照约定来到商场。林晓已经到了，站在入口处等你。今天她换了一件粉色的毛衣，看起来比昨天见面时更活泼一些。

「来了？」她笑着打招呼，「吃过早饭了吗？」

「吃了，」你说，「你呢？」

「吃了，我妈做的。」她笑了笑，「走吧，先逛逛。」

你们走进商场。这家商场是县城最大的，一共五层，一楼是化妆品和珠宝专柜，二楼是女装，三楼是男装和运动品牌，四楼是餐饮和电影院，五楼是儿童游乐区。

过年期间商场里人不多，但也有一些年轻情侣在逛街。

林晓在一楼化妆品专柜停了下来，拿起一瓶香水看了看：「这个味道挺好闻的。」

「喜欢就买吧。」你说。

她看了看价格，默默放下了：「算了，太贵了。」

你看了一眼标签——980 元。对于一个县城公务员来说，确实不便宜。

「我送你吧。」你突然说。

林晓愣了一下：「不用，我自己买。」

「就当是...见面礼。」你说，「毕竟是我约你出来的。」

她犹豫了一下，点点头：「那...谢谢。」

你掏出钱包，付了款。林晓接过香水，眼神里有些复杂：「你对我真好。」

「应该的。」

你们继续逛。在二楼的一家女装店，林晓看中了一条裙子，试穿后很满意。但看到价格——1280 元，她又放下了。

「怎么了？」你问。

「太贵了。」她摇摇头，「算了，不买了。」

你想说什么，但她已经走出了店。

「林晓，」你叫住她，「其实...如果喜欢，我可以送你。」

她停下脚步，回头看你：「为什么？我们才见两次面。」

「因为...」你想了想，「我想对你好。不需要理由。」

林晓看着你，眼神有些复杂。最后她摇摇头：「不用了，我自己买。真的不用。」

你有些尴尬，但还是点点头。

逛完商场，你们找了一家奶茶店坐下。林晓点了一杯奶茶，你点了杯咖啡。

「你是个好人，」她突然说，「但是...我不太习惯让别人给我买贵重的东西。」

「为什么？」

「因为...」她想了想，「我觉得两个人在一起，应该是平等的。我不想欠你什么。」

你点点头，没有说话。

*林晓...*

*是个有原则的人。*

*这样的人...*

*值得我认真对待。*`,
    choices: [
      {
        text: "尊重她的原则，AA制消费",
        tone: "conservative",
        energyCost: 15,
        skillCheck: {
          attr: "wealth",
          difficulty: 40,
          label: "金钱选择测试"
        },
        effects: [
          { type: "attr", target: "independence", delta: 8 },
          { type: "affection", target: "npc_blind_date_affection", delta: 15 }
        ],
        feedback: {
          success: "你尊重了她的原则，坚持AA制。林晓对你的好感度大增：「你真的很好，尊重我，理解我。」",
          fail: "你想坚持为她买，但她坚持自己付款。最后你们各付各的，气氛有些微妙。"
        },
        nextQuestId: "time_d7a"
      },
      {
        text: "坚持送她礼物，表达心意",
        tone: "aggressive",
        energyCost: 25,
        skillCheck: {
          attr: "wealth",
          difficulty: 50,
          label: "礼物攻势"
        },
        effects: [
          { type: "attr", target: "wealth", delta: -10 },
          { type: "attr", target: "social", delta: 5 },
          { type: "affection", target: "npc_blind_date_affection", delta: 5 }
        ],
        feedback: {
          success: "你坚持送了她那条裙子，林晓虽然觉得不好意思，但心里很感动：「谢谢你，我会好好珍惜的。」",
          fail: "你太热情了，让林晓觉得有压力。她有些不安地说：「我们才见两次面，这样真的好吗？」",
        },
        nextQuestId: "time_d7a"
      },
      {
        text: "默默观察，记下她的喜好",
        tone: "idealist",
        energyCost: 10,
        skillCheck: {
          attr: "social",
          difficulty: 30,
          label: "观察测试"
        },
        effects: [
          { type: "attr", target: "social", delta: 5 },
          { type: "affection", target: "npc_blind_date_affection", delta: 10 }
        ],
        feedback: {
          success: "你默默记下了她喜欢什么，不喜欢什么。林晓觉得你很细心：「你观察力挺强的。」",
          fail: "你观察得太明显，林晓觉得你在审视她，有些不自在。"
        },
        nextQuestId: "time_d7a"
      }
    ],
    unlockedNext: "time_d7a",
    nextQuestId: "time_d7a",
    phase: 3
  },

  // ============================================
  // 【Day 7 下午】主线：和相亲对象再见面
  // ============================================
  {
    id: "quest_cn_07",
    chapterIndex: 7,
    title: "初五 · 和相亲对象再见面",
    subtitle: "第二次见面的心动",
    timeSlot: "初五 · 下午",
    description: "在奶茶店偶遇，这次聊天更自然了",
    npcInvolved: ["npc_blind_date", "npc_bestie"],
    scene: "love",
    illustration: "love.svg",
    bgColor: "#2d1f2a",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    requiredAttributes: ["romance"],
    optionalAttributes: ["social", "independence"],
    body: `大年初五，下午四点。

逛完商场，你们在奶茶店坐下。林晓点了一杯杨枝甘露，你点了一杯美式咖啡。

「今天谢谢你陪我逛商场。」她说。

「不客气，」你喝了口咖啡，「你平时都这么...节俭吗？」

「嗯，」她笑了笑，「我爸妈都是体制内的，工资不高，但稳定。我从小就被教育要勤俭节约。」

「挺好的，」你说，「懂得省钱的人，都会过日子。」

「你呢？」她反问，「你在深圳挣得多吗？」

「还行吧，」你含糊地说，「够花。」

「够花是多少？」她好奇地问。

「...一两万吧。」你老实回答。

「那挺多的，」她说，「我们这边的公务员，一个月也就五六千。」

你笑了笑：「但是深圳的房价也贵啊，一年下来存不下多少钱。」

「嗯，」她点点头，「各有各的难处。」

你们聊了很多——关于工作，关于生活，关于对未来的规划。

「你以后会一直留在深圳吗？」她突然问。

你愣了一下：「...还没想好。」

「我也在想，」她说，「我爸妈希望我留在县城，但我有时候会想...是不是应该出去看看。」

「出去看看？」

「嗯，」她看着窗外，「我前男友在北京，我有时候会想，如果我当初也去了北京，现在会是什么样。」

你没有说话。

「但是，」她转过头看你，「我后来想通了。每个人都有自己的路，羡慕别人的路没有意义。」

「你说得对。」

「你也有过这种想法吗？」她问，「羡慕别人的生活？」

你想了想：「有吧。看到朋友圈里别人晒车、晒房、晒旅游，心里也会有点不是滋味。」

「但是，」你说，「那种感觉很快就过去了。因为我知道，那是他们的生活，不是我的。」

「嗯，」她点点头，「你挺通透的。」

你们又聊了一会儿。窗外的阳光慢慢西斜，在地上拉出长长的影子。

「时间不早了，」她看了看手机，「我得回去了，我妈让我买菜。」

「好，」你站起来，「我送你。」

「不用，」她摆摆手，「我家就在附近，走几步就到了。」

「那...」你犹豫了一下，「下次什么时候见？」

林晓愣了一下，然后笑了：「你不是明天就要回深圳了吗？」

「是啊，」你说，「所以想问...以后还能不能再见面。」

她看着你，眼神有些复杂。

「以后...」她想了想，「以后再说吧。先加个微信，保持联系。」

「好。」

你们互相加了微信，然后告别。走出奶茶店的时候，她回过头来：

「对了，你明天几点的车？」

「上午十点。」

「那祝你一路顺风。」

「谢谢。」

她走了几步，又回过头来：「到了告诉我一声。」

你点点头。

看着她的背影渐渐远去，你心里有种说不清的感觉。

*林晓...*

*也许，可以再联系看看。*`,
    isMainQuest: true,
    choices: [
      {
        text: "主动约她：「今晚有没有空？一起吃饭？」",
        tone: "aggressive",
        energyCost: 20,
        skillCheck: {
          attr: "romance",
          difficulty: 45,
          label: "主动出击测试"
        },
        effects: [
          { type: "attr", target: "romance", delta: 15 },
          { type: "attr", target: "social", delta: 5 },
          { type: "affection", target: "npc_blind_date_affection", delta: 20 }
        ],
        // v7: 标记相亲进展顺利（触发相亲/异地恋结局的助推 flag）
        flags: { completed_blind_date: true },
        feedback: {
          success: "林晓愣了一下，然后笑着点头：「好啊，正好我今晚没什么事。」你们约好了时间地点。回去的路上，你给小敏发微信：「姐妹，我好像有点心动。」小敏秒回一串感叹号。",
          fail: "你鼓起勇气约她，但她摇摇头：「今晚我妈让我回家吃饭，下次吧。」你有些失望。"
        },
        nextQuestId: "time_d7e"
      },
      {
        text: "保持联系：「回去微信聊吧」",
        tone: "conservative",
        energyCost: 10,
        skillCheck: {
          attr: "social",
          difficulty: 30,
          label: "保持联系测试"
        },
        effects: [
          { type: "attr", target: "social", delta: 5 },
          { type: "affection", target: "npc_blind_date_affection", delta: 10 }
        ],
        feedback: {
          success: "林晓点点头：「好，回去聊。」你们加了微信，约好回深圳后继续保持联系。回到家，妈妈问你今天去了哪儿，你含糊地说「随便逛逛」。",
          fail: "你保持着礼貌的距离，林晓对你的印象普通。"
        },
        nextQuestId: "time_d7e"
      },
      {
        text: "犹豫不决，随便应付几句就告别",
        tone: "idealist",
        energyCost: 5,
        skillCheck: {
          attr: "resilience",
          difficulty: 25,
          label: "犹豫测试"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 3 },
          { type: "affection", target: "npc_blind_date_affection", delta: -5 }
        ],
        feedback: {
          success: "你们匆匆告别，各回各家。晚上，林晓发来微信：「今天见到你挺开心的。」你回了个表情包，心里却在想：真的要继续吗？",
          fail: "你的犹豫让林晓觉得你对这段关系不太认真。"
        },
        nextQuestId: "time_d7e"
      }
    ],
    unlockedNext: "time_d7e",
    nextQuestId: "time_d7e",
    phase: 3
  },

  // ============================================
  // 【Day 7 晚上】过渡：家族饭局
  // ============================================
  {
    id: "quest_trans_d7e",
    chapterIndex: 7.2,
    title: "初五 · 家族饭局",
    subtitle: "又一场亲戚聚会",
    timeSlot: "初五 · 晚上",
    description: "初五的家族饭局，亲戚们再次聚在一起",
    npcInvolved: ["npc_mom", "npc_grandma"],
    illustration: "familygathering.svg",
    bgColor: "#2d2419",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    isTransition: true,
    requiredAttributes: ["resilience"],
    optionalAttributes: ["social"],
    body: `初五，晚上六点。

又一场家族饭局。这次是大伯家请客，地点定在县城的「喜来登」酒店——虽然只是县城，但也是当地最好的酒店之一。

你跟着爸妈到达酒店的时候，亲戚们已经到了不少。大伯、大伯母、二婶、二叔、堂哥堂嫂、表姐表姐夫...满满当当坐了三桌。

「来了！」大伯热情地招呼，「快坐快坐！」

你被安排在奶奶旁边的位置。这个安排显然是故意的——奶奶又要开始「灵魂拷问」了。

果然，刚坐下，奶奶就开始了：

「怎么样？相亲相得怎么样了？」奶奶直接问。

「还在了解中。」你含糊地说。

「了解了解，了解到什么程度了？」奶奶追问，「牵手了没有？」

「妈！」你妈妈在旁边小声说，「大过年的，说这些干什么。」

「我关心我孙女有什么错？」奶奶理直气壮，「我像她这么大的时候，孩子都会跑了！」

你低头扒饭，决定不接话。

但奶奶显然不打算放过你：「我听说那个林晓，是民政局的？」

「嗯。」

「民政局好啊！」奶奶的眼睛亮了，「铁饭碗！公务员！多少人挤破头都进不去！」

「奶奶，」你终于开口了，「现在说这些还早。」

「早什么早！」奶奶筷子一拍，「趁人家对你有好感，你要抓紧！错过了这个村就没这个店了！」

你叹了口气，看向妈妈。妈妈的表情很尴尬，但也不敢顶撞奶奶。

这时，二婶过来打圆场：「妈，您别催了，孩子有自己的想法。」

「什么想法！我看她就是太挑！」奶奶气呼呼地说，「再挑下去，好的都被别人挑走了！」

你放下筷子：「奶奶，我去下洗手间。」

走出包厢，你站在走廊里深吸了一口气。

*又来了...*

*每次聚会都是这样...*

手机震动了，是小敏的微信：「怎么样了？相亲有进展吗？」

你回复：「一言难尽。等会儿跟你说。」

小敏秒回：「加油！我挺你！」

你站在走廊里，看着窗外的夜空。远处有人在放烟花，五颜六色的光芒在天空中绽放。

*林晓...*

*奶奶的话虽然烦，但也不无道理...*

*真的要抓紧吗？*

*可是...*

你不知道答案。`,
    choices: [
      {
        text: "回到饭桌，耐心应对奶奶的拷问",
        tone: "conservative",
        energyCost: 15,
        skillCheck: {
          attr: "resilience",
          difficulty: 35,
          label: "耐心测试"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 8 },
          { type: "affection", target: "npc_grandma_affection", delta: 10 }
        ],
        // v7: 标记完成奶奶心愿（让奶奶满意），作为回乡创业结局的前置条件
        flags: { completed_grandma_wish: true },
        feedback: {
          success: "你回到饭桌，耐心听奶奶说完，然后认真地说：「奶奶，我在努力呢。」奶奶满意地点点头：「这还差不多。」",
          fail: "你回到饭桌，但奶奶继续唠叨，你忍不住顶了几句嘴，气氛一度很僵。"
        },
        nextQuestId: "time_d8m"
      },
      {
        text: "找借口提前离开，避免尴尬",
        tone: "idealist",
        energyCost: 10,
        skillCheck: {
          attr: "independence",
          difficulty: 30,
          label: "逃离测试"
        },
        effects: [
          { type: "attr", target: "independence", delta: 5 },
          { type: "affection", target: "npc_mom_affection", delta: -5 }
        ],
        feedback: {
          success: "你借口头疼，提前离开了。妈妈虽然有些失望，但也松了口气：「你去休息吧，我帮你打圆场。」",
          fail: "你借口离开，但妈妈追出来：「你去哪儿？长辈还没走呢！」你只好又回去了。"
        },
        nextQuestId: "time_d8m"
      },
      {
        text: "反驳奶奶，表达自己的立场",
        tone: "aggressive",
        energyCost: 20,
        skillCheck: {
          attr: "resilience",
          difficulty: 50,
          label: "立场表达测试"
        },
        effects: [
          { type: "attr", target: "independence", delta: 10 },
          { type: "attr", target: "resilience", delta: 5 },
          { type: "affection", target: "npc_grandma_affection", delta: -10 }
        ],
        feedback: {
          success: "你坚定地说：「奶奶，我有自己的节奏，请尊重我的选择。」奶奶愣了一下，虽然不太高兴，但也没再说什么。",
          fail: "你说得太直接，奶奶气得直拍桌子：「你这孩子，怎么这么不听话！」气氛非常尴尬。"
        },
        nextQuestId: "time_d8m"
      }
    ],
    unlockedNext: "time_d8m",
    nextQuestId: "time_d8m",
    phase: 3
  },

  // ============================================
  // 【Day 8 上午】过渡：家庭会议
  // ============================================
  {
    id: "quest_trans_d8m",
    chapterIndex: 8.1,
    title: "初六 · 家庭会议",
    subtitle: "关于祖屋拆迁的重要决定",
    timeSlot: "初六 · 上午",
    description: "家庭会议讨论祖屋拆迁和未来规划",
    npcInvolved: ["npc_mom", "npc_dad"],
    illustration: "familymeeting.svg",
    bgColor: "#1f2533",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    isTransition: true,
    requiredAttributes: ["independence"],
    optionalAttributes: ["career", "wealth"],
    body: `初六，上午十点。

吃完早饭，爸爸突然说要开个「家庭会议」。

「开什么会？」妈妈有些疑惑。

「关于咱家老宅拆迁的事。」爸爸说，「还有...关于孩子的未来。」

你们三个人围坐在客厅的沙发上。爸爸手里拿着一份文件，是关于县城老城区拆迁的通知。

「咱们家的老宅，」爸爸说，「在拆迁范围内。开发商给了两个方案：一是补偿一套新房，但面积比现在的小；二是补偿现金，大概八十万。」

妈妈想了想：「要新房吧，新房以后可以传给孩子。」

「但新房在郊区，」爸爸说，「离市区远，不方便。而且面积小，只有八十平。」

「那要现金呢？」你问。

「现金的话，」爸爸说，「我们可以再买一套大的，但要多添点钱。现在县城的房价也不便宜。」

「那你的意思是？」

「我还没想好，」爸爸说，「所以想听听你们的意见。」

妈妈看着你：「孩子，你呢？你觉得怎么办？」

你想了想：「爸，妈，我觉得这事应该您们自己决定。毕竟是您们的房子，我不应该插手。」

「但是，」你说，「我可以说说我的看法。」

「说说看。」

「如果要新房，」你说，「虽然面积小，但是是现房，不用再添钱。如果要现金，虽然灵活，但是要再添钱买，而且房价可能还会涨。」

「您的意思是？」

「我觉得...」你犹豫了一下，「要看您们的实际需求。如果想住新房子，就选新房。如果想投资或者改善居住条件，就选现金。」

爸爸点点头：「孩子说得有道理。」

妈妈也点头：「那就...先不急着决定，再考虑考虑？」

「嗯，」爸爸说，「反正还有三个月的考虑时间。」

会议结束后，你回到房间，心里有些沉重。

*爸妈老了...*

*老宅拆迁、养老、婚姻...*

*这些事，以后可能都要我来扛了...*

*我准备好了吗？*

你不知道答案。

但你知道，**这一刻，你必须长大。**`,
    choices: [
      {
        text: "尊重父母的选择，不干涉太多",
        tone: "conservative",
        energyCost: 15,
        skillCheck: {
          attr: "independence",
          difficulty: 40,
          label: "说服父母尊重你的选择"
        },
        effects: [
          { type: "attr", target: "independence", delta: 8 },
          { type: "affection", target: "npc_mom_affection", delta: 10 },
          { type: "affection", target: "npc_dad_affection", delta: 10 }
        ],
        feedback: {
          success: "你尊重父母的选择，没有过多干涉。妈妈欣慰地说：「孩子真的长大了，懂事了。」",
          fail: "你想表达自己的看法，但被爸妈反驳了：「你小孩子懂什么，我们吃过的盐比你吃过的米还多。」"
        },
        nextQuestId: "time_d8a"
      },
      {
        text: "提供专业建议，帮父母分析利弊",
        tone: "aggressive",
        energyCost: 25,
        skillCheck: {
          attr: "career",
          difficulty: 50,
          label: "专业分析测试"
        },
        effects: [
          { type: "attr", target: "career", delta: 10 },
          { type: "attr", target: "independence", delta: 10 },
          { type: "affection", target: "npc_dad_affection", delta: 15 }
        ],
        feedback: {
          success: "你用专业的视角帮爸妈分析了利弊，提供了详细的对比表格。爸爸惊讶地说：「你比我想象的还要懂事！」",
          fail: "你的分析过于复杂，爸妈听得云里雾里，最后说：「算了，我们自己看着办吧。」"
        },
        nextQuestId: "time_d8a"
      },
      {
        text: "提出自己的想法，表达个人立场",
        tone: "idealist",
        energyCost: 20,
        skillCheck: {
          attr: "independence",
          difficulty: 45,
          label: "独立立场测试"
        },
        effects: [
          { type: "attr", target: "independence", delta: 10 },
          { type: "attr", target: "resilience", delta: 5 }
        ],
        feedback: {
          success: "你坚定地表达了自己的想法，爸妈虽然有些意外，但最终接受了。爸爸说：「你真的长大了。」",
          fail: "你的想法和爸妈的意见不一致，最后不欢而散。"
        },
        nextQuestId: "time_d8a"
      }
    ],
    unlockedNext: "time_d8a",
    nextQuestId: "time_d8a",
    phase: 3
  },

  // ============================================
  // 【Day 8 下午】主线：爸妈深夜谈心
  // ============================================
  {
    id: "quest_cn_08",
    chapterIndex: 8,
    title: "初六 · 爸妈深夜谈心",
    subtitle: "爸爸喝了点酒，终于说了一句实话",
    timeSlot: "初六 · 下午",
    description: "爸爸喝了点酒，终于跟你说了一句实话",
    npcInvolved: ["npc_mom", "npc_dad"],
    scene: "conversation",
    illustration: "conversation.svg",
    bgColor: "#1f2533",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    requiredAttributes: ["resilience"],
    optionalAttributes: ["independence"],
    body: `大年初六，晚上十一点。

你明天就要回深圳了，正在房间里收拾行李。行李箱摊开在床上，衣服、洗漱用品、妈妈塞给你的各种特产，乱七八糟地堆在一起。

你把最后一件毛衣叠好放进箱子，拉上拉链，正准备躺下休息一会儿，突然听到客厅里传来争吵声。

「...你每次都不说话，就让我一个人当坏人！」妈妈的声音有些尖锐，带着哭腔。

「我说了有用吗？」爸爸的声音低沉，透着疲惫。

「你就是太懦了！孩子的事你从来不管！我天天操心，你倒好，坐在沙发上什么都不管！」

「我怎么不管了？我...」

「你什么你？你就会和稀泥！每次说到孩子的事，你就躲，你就装死！你看人家老王家的老公，孩子有什么事都是老公出面，你呢？」

你走出房间，看到爸爸坐在沙发上，手里攥着酒杯，脸色有些发红——茅台的后劲上来了。茶几上放着那瓶喝了大半的茅台，酒香弥漫在整个客厅里。

妈妈站在旁边，眼眶红红的，泪痕还挂在脸上，手里攥着几张纸巾。

「怎么了？」你问。

妈妈看了你一眼，叹了口气，转身进了房间，轻轻带上了门。

客厅里只剩下你和爸爸。灯光昏黄，电视不知道什么时候被关掉了，整个房间安静得能听到墙上挂钟「滴答滴答」的声音。

爸爸沉默了一会儿，然后拍了拍旁边的位置：「坐。」

你走过去，在爸爸旁边坐下。沙发有些老旧了，坐下去的时候会陷进去一点，但你从小就喜欢坐在这里，因为这样可以靠在爸爸的肩膀上。

茶几上放着那瓶茅台，已经喝了大半瓶。旁边还有一碟花生米，是爸爸的下酒菜。

「明天就要走了。」爸爸说。

「嗯。」

「几点的车？」

「早上八点半。」

爸爸点点头：「那我明早送你。」

「不用，爸，我自己打车去车站就行。」

「没事，爸起得早，送你一趟。」

你看着爸爸的侧脸，发现他的眼角多了很多皱纹，头发也白了不少。这几年在外面工作，每次打电话回家都是妈妈接的，你跟爸爸说不上几句话。

「外面的事，不用太拼。」他顿了顿，「身体最重要。」

你点点头：「嗯，我知道的。」

爸爸又喝了一口酒，然后放下杯子，看着你：「爸跟你说句心里话。」

你看着他的眼睛。

「你妈催你，是担心你。」他说，「她不是逼你，她就是怕你一个人在外面，没人照顾。」

「我知道。」

「你妈年轻的时候...」他的声音有些低沉，「也是一个人在外面打工。那时候我们刚结婚，她去了南方，我留在老家。过年她回不来，我急得睡不着觉。」

你从未听爸爸说起过这些。

「有一次，她过年没回来，我一个人在家里，大年初一早上起来煮了碗面，吃着吃着就哭了。」他苦笑着说，「那时候我就想，等她回来，我再也不让她一个人出去了。」

你看着爸爸，不知道该说什么。

「后来她回来了，我们才有了你。」他看着你，眼眶有些红，「我知道现在的年轻人不一样了，不想将就，不想凑合。但是...」

他顿了顿，似乎在斟酌措辞。

「但是，有个人在身边，哪怕就是吵吵架，也比一个人强。」

你想说点什么，但喉咙像是被什么堵住了。

「你妈她...这些年也不容易。」爸爸的声音有些哽咽，「你不在的时候，她天天给你发微信，其实就是想看看你过得怎么样。你不回，她就在那等着，有时候一等就是一天。」

你想起妈妈每天发来的那些养生文章和催婚短视频，还有那些「女孩子要好好照顾自己」「一个人在外要注意安全」的链接。以前你觉得烦，总是已读不回，或者回一个「嗯」字敷衍了事。

「你妈她嘴上不说，但心里天天惦记着你。」爸爸说，「你今年回来，她高兴得跟个孩子似的，提前一个月就开始准备，杀鸡宰鸭，买你爱吃的东西...」

门「吱呀」一声开了。

妈妈站在门口，眼泪已经流了下来，顺着脸颊往下淌。

「你这死老头子...」她走过来，在你旁边坐下，拉着你的手，「在孩子面前说这些干什么...」

「我就随便说说。」爸爸端起酒杯，又喝了一口。

妈妈拉着你的手，眼泪还在流：「妈不是逼你，妈就是...就是想你了。你在外面一年，就过年才回来这么几天，妈还没跟你好好说说话，你就要走了...」

你抱住妈妈，发现她的头发里多了很多白头发，比你上次回来的时候又多了。这些白发在灯光下格外刺眼，像是一根根针扎在你心里。

「妈，我知道。」你说，声音有些沙哑，「我会照顾好自己的。」

「你别光顾着工作，也要注意身体。」妈妈拍着你的背，「妈不需要你挣多少钱，妈就希望你能平平安安的，将来有个人陪着你，妈走了也能放心...」

「妈，您别说了...」

「让妈说完。」妈妈擦了擦眼泪，「妈不是逼你嫁人，妈就是担心你一个人在外面，没人照顾。妈像你这么大的时候，有你爸陪着，你现在一个人...妈心里不踏实。」

爸爸在旁边默默地听着，没有说话，只是又喝了一口酒。

窗外的鞭炮声又响了起来，是谁家在迎财神。远处还有人在放烟花，「砰」的一声，一朵金色的花在夜空中绽放，然后又消失了。

妈妈拉着你的手，一直说着：「你下次什么时候回来？清明？还是五一？要不清明回来吧，妈给你做你最爱吃的红烧排骨...」

你点点头：「好，清明我回来。」

「那说定了，不许骗妈。」

「不骗您。」

妈妈笑了，笑容里带着泪光：「那就好，那就好...」

窗外又「砰」的一声，是谁家在放烟花。金色的光芒透过窗帘照进来，在地上投下斑驳的影子。

这一晚，你们聊了很久。爸爸说了很多他年轻时的事，妈妈说了很多你小时候的事。你听着听着，笑着笑着，眼泪就流了下来。

明天，你就要离开这个小镇，回到那座灯火通明的大城市。

但今晚，你只想陪在爸妈身边，多坐一会儿。`,
    isMainQuest: true,
    choices: [
      {
        text: "告诉爸妈：「我正在努力找，你们放心」",
        tone: "conservative",
        energyCost: 10,
        skillCheck: {
          attr: "resilience",
          difficulty: 30,
          label: "情感表达测试"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 8 },
          { type: "affection", target: "npc_mom_affection", delta: 20 },
          { type: "affection", target: "npc_dad_affection", delta: 25 }
        ],
        feedback: {
          success: "妈妈破涕为笑：「只要你在找，妈就放心了。」爸爸点点头，又给你倒了半杯酒：「明天一路顺风。」那一晚，你们聊了很久，直到凌晨一点才各自回房。",
          fail: "你说得有些含糊，妈妈有些失望：「你是真的在找吗？还是在敷衍妈？」"
        },
        nextQuestId: "time_d8e"
      },
      {
        text: "沉默不语，只是紧紧抱着妈妈",
        tone: "idealist",
        energyCost: 5,
        skillCheck: {
          attr: "resilience",
          difficulty: 25,
          label: "沉默测试"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 5 },
          { type: "affection", target: "npc_mom_affection", delta: 15 },
          { type: "affection", target: "npc_dad_affection", delta: 15 }
        ],
        feedback: {
          success: "妈妈感觉到你的沉默，轻轻拍着你的背：「没事的，妈不逼你。」爸爸在旁边叹了口气，什么也没说。那一晚，你睡得很沉，梦到了小时候在老家的院子里骑木马。",
          fail: "你的沉默让妈妈有些不安：「你是不是有什么心事？」"
        },
        nextQuestId: "time_d8e"
      },
      {
        text: "坦诚说出自己的困惑和压力",
        tone: "aggressive",
        energyCost: 20,
        skillCheck: {
          attr: "independence",
          difficulty: 50,
          label: "说服父母尊重你的选择"
        },
        effects: [
          { type: "attr", target: "independence", delta: 12 },
          { type: "attr", target: "resilience", delta: 8 },
          { type: "affection", target: "npc_dad_affection", delta: 20 }
        ],
        feedback: {
          success: "你说了很多，说大城市的压力，说工作的焦虑，说对未来的迷茫。爸爸听完，沉默了很久，然后说：「撑不下去就回来，爸养你。」妈妈在旁边哭得更厉害了。",
          fail: "你说得太多了，妈妈反而更担心：「你在外面是不是过得不好？要不...回来吧？」"
        },
        nextQuestId: "time_d8e"
      }
    ],
    unlockedNext: "time_d8e",
    nextQuestId: "time_d8e",
    phase: 3,
    isMainQuest: true
  },

  // ============================================
  // 【Day 8 晚上】过渡：最后的夜晚
  // ============================================
  {
    id: "quest_trans_d8e",
    chapterIndex: 8.2,
    title: "初六 · 最后的夜晚",
    subtitle: "离别前的最后一夜",
    timeSlot: "初六 · 晚上",
    description: "这是你在家的最后一个夜晚",
    npcInvolved: ["npc_mom", "npc_dad"],
    illustration: "lastnight.svg",
    bgColor: "#1a2433",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    isTransition: true,
    requiredAttributes: ["resilience"],
    optionalAttributes: ["independence"],
    body: `初六，凌晨一点。

你躺在床上，看着天花板。明天就要回深圳了，心里有种说不出的滋味。

手机震动了，是小敏的微信：「还没睡？」

你回复：「睡不着。」

「我也是，」小敏说，「刚才跟我妈聊了很久。她说让我清明再回来，我说好。」

「嗯。」

「你呢？跟你爸妈聊得怎么样？」

「挺好的，」你回复，「我妈哭了一会儿，我爸喝了点酒，说了些心里话。」

「那挺好的，」小敏说，「能跟爸妈这样聊天，是福气。」

「嗯。」

「明天几点的车？」

「早上八点半。」

「那早点睡吧，」小敏说，「明天还要赶车呢。」

「嗯，晚安。」

「晚安。」

你放下手机，看着窗外的夜空。月亮很圆，是这个冬天的第二个月圆之夜。远处的天空中偶尔有烟花绽放，五颜六色的光芒透过窗帘的缝隙照进来，在墙上投下斑驳的影子。

*明天就要离开了...*

*这个春节，过得真快啊...*

你翻了个身，把脸埋进枕头里。

*林晓...*

*明天要不要再见一面？*

*算了，太刻意了。*

*就让一切顺其自然吧。*

窗外，鞭炮声渐渐稀疏了。远处有人在放烟花，「砰」的一声，一朵金色的烟花在天空中绽放，然后渐渐消散。

你闭上眼睛，试图入睡。

*这个春节...*

*有很多遗憾，但也有很多收获。*

*不管怎样...*

*都是成长的一部分吧。*

你翻来覆去，迷迷糊糊地睡着了。

梦里，你看到了童年的自己，在老家的小巷里奔跑，身后是奶奶的呼喊声：「慢点跑，别摔了！」

你笑了。`,
    choices: [
      {
        text: "给林晓发一条晚安消息",
        tone: "conservative",
        energyCost: 10,
        skillCheck: {
          attr: "social",
          difficulty: 25,
          label: "关心测试"
        },
        effects: [
          { type: "attr", target: "social", delta: 5 },
          { type: "affection", target: "npc_blind_date_affection", delta: 10 }
        ],
        feedback: {
          success: "林晓秒回：「晚安，明天一路顺风。到了记得告诉我。」你的心里暖暖的。",
          fail: "林晓已经睡着了，没有回复你。"
        },
        nextQuestId: "time_d9m"
      },
      {
        text: "一个人在床上辗转反侧",
        tone: "idealist",
        energyCost: 5,
        skillCheck: {
          attr: "resilience",
          difficulty: 20,
          label: "自我反思"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 5 },
          { type: "energy", target: "self", delta: -10 }
        ],
        feedback: {
          success: "你想了很多，关于春节、关于相亲、关于未来。想着想着，就睡着了。",
          fail: "你失眠了，第二天顶着黑眼圈出发。"
        },
        nextQuestId: "time_d9m"
      },
      {
        text: "找妈妈聊最后一次",
        tone: "aggressive",
        energyCost: 20,
        skillCheck: {
          attr: "social",
          difficulty: 35,
          label: "深度沟通"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 8 },
          { type: "affection", target: "npc_mom_affection", delta: 20 }
        ],
        feedback: {
          success: "你和妈妈又聊了半小时。妈妈说：「清明一定要回来啊！」你说：「一定。」",
          fail: "妈妈已经睡着了，你不好意思叫醒她。"
        },
        nextQuestId: "time_d9m"
      }
    ],
    unlockedNext: "time_d9m",
    nextQuestId: "time_d9m",
    phase: 3
  },

  // ============================================
  // 【Day 9 上午】过渡：离别前的准备
  // ============================================
  {
    id: "quest_trans_d9m",
    chapterIndex: 9.1,
    title: "初七 · 离别前的准备",
    subtitle: "收拾行李，装满牵挂",
    timeSlot: "初七 · 上午",
    description: "收拾行李，妈妈又塞了一堆东西",
    npcInvolved: ["npc_mom", "npc_dad"],
    illustration: "packing.svg",
    bgColor: "#1a2433",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    isTransition: true,
    requiredAttributes: [],
    optionalAttributes: ["resilience"],
    body: `初七，早上七点。

闹钟响起，你迷迷糊糊地爬起来。窗外的天还没完全亮，但妈妈已经在厨房里忙活了，热气从厨房里飘出来，混着煎蛋和粥的香味。

「起来了？」妈妈从厨房探出头，「我给你煮了碗面，吃了再走。」

「妈，来不及了，车八点半...」

「来得及来得及，我早就准备好了。」妈妈端出一碗热腾腾的面条，上面卧着一个煎蛋，旁边还有几片火腿肠，「快吃，吃了上路顺利。」

你接过碗，大口大口地吃起来。面条是手擀的，比外面买的更劲道；煎蛋是妈妈最拿手的溏心蛋，蛋黄还是流动的。

吃完面，你回房间收拾行李。衣服、洗漱用品、充电器...都装好了。但妈妈又塞了一堆东西进来。

「这个腊肉带上，这是你外婆家的粮食猪做的。」

「这个麻花带上，你王婶家做的，可香了。」

「这个酸豆角带上，你妈我自己腌的。」

「这个...」

「妈，」你忍不住了，「行李箱装不下了...」

「那我给你找个袋子。」妈妈风风火火地去找袋子。

「还有这个，」妈妈又从抽屉里拿出几盒药，「感冒药、肠胃药、止痛药...你在外面用得着。」

「妈，我又不是去非洲...」

「有备无患！」妈妈把药塞进行李箱，「你这个孩子，总是嫌妈啰嗦。等你生病的时候就知道了！」

你哭笑不得，只好任由妈妈折腾。

最后，行李箱装得满满当当，妈妈还拿绳子捆了两道。

「好了，这下装得下了。」妈妈满意地拍拍手。

爸爸从房间里走出来：「差不多了吧？该出发了。」

「等一下！」妈妈又跑进厨房，拿出一个保温杯，「这是我熬的银耳汤，你带着路上喝。」

「妈，保温杯太重了...」

「重什么重！营养最重要！」妈妈把保温杯塞进你手里。

你看看行李箱，再看看保温杯，有些无奈。但心里，却是暖洋洋的。

*妈妈的牵挂...*

*都装在这些东西里了。*`,
    choices: [
      {
        text: "安静地接受妈妈的所有牵挂",
        tone: "conservative",
        energyCost: 10,
        skillCheck: {
          attr: "resilience",
          difficulty: 20,
          label: "接受测试"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 5 },
          { type: "affection", target: "npc_mom_affection", delta: 15 }
        ],
        feedback: {
          success: "你安静地接受了妈妈的所有东西。妈妈欣慰地说：「这样妈就放心了。」",
          fail: "你有些不耐烦，妈妈有些失落：「妈不是为你好吗...」"
        },
        nextQuestId: "time_d9a"
      },
      {
        text: "帮妈妈分担一些家务",
        tone: "idealist",
        energyCost: 15,
        skillCheck: {
          attr: "cooking",
          difficulty: 30,
          label: "家务测试"
        },
        effects: [
          { type: "attr", target: "cooking", delta: 5 },
          { type: "attr", target: "independence", delta: 5 },
          { type: "affection", target: "npc_mom_affection", delta: 10 }
        ],
        feedback: {
          success: "你帮妈妈洗了碗、擦了桌子。妈妈说：「你真的长大了。」",
          fail: "你想帮忙，但被妈妈赶出去了：「你快去收拾行李，妈来！」"
        },
        nextQuestId: "time_d9a"
      },
      {
        text: "和妈妈一起做最后的告别",
        tone: "aggressive",
        energyCost: 20,
        skillCheck: {
          attr: "social",
          difficulty: 35,
          label: "情感表达"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 8 },
          { type: "affection", target: "npc_mom_affection", delta: 20 }
        ],
        feedback: {
          success: "你抱住妈妈：「妈，我会想您的。」妈妈的眼眶又红了：「妈也会想你的。」",
          fail: "你想说什么，但话到嘴边又咽了回去。"
        },
        nextQuestId: "time_d9a"
      }
    ],
    unlockedNext: "time_d9a",
    nextQuestId: "time_d9a",
    phase: 3
  },

  // ============================================
  // 【Day 9 下午】主线：火车站送别
  // ============================================
  {
    id: "quest_cn_09",
    chapterIndex: 9,
    title: "初七 · 火车站送别",
    subtitle: "车站送别，妈妈往你行李里塞了一堆东西",
    timeSlot: "初七 · 下午",
    description: "车站送别，妈妈往你行李里塞了一堆东西",
    npcInvolved: ["npc_mom", "npc_dad", "npc_blind_date"],
    scene: "goodbye",
    illustration: "goodbye.svg",
    bgColor: "#1a2430",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    requiredAttributes: ["resilience"],
    optionalAttributes: ["independence", "romance"],
    body: `大年初七，早上八点。

吃完面，你帮着妈妈一起把东西搬到门口。行李箱、妈妈塞给你的各种特产、还有昨晚奶奶托人送来的几盒点心。

八点一刻，你们出发了。

县城的小车站里挤满了人，大多是返程的年轻人们。男生拖着行李箱，女生背着双肩包，还有老人跟在后面送行。车站的广播里循环播放着列车到站的信息，候车厅里弥漫着泡面和烟味混合的气息。

「来来来，让一让，行李往这边放！」检票员扯着嗓子喊。

爸爸帮你拎着行李箱，妈妈跟在后面，手里还拎着一个大袋子——那是她昨晚又塞进去的东西。

「这里面是妈给你装的腊肠，你爱吃的那家老字号做的。」妈妈把袋子塞到你手里，「还有你王婶家做的麻花，路上饿了吃。哦对了，这是你二姨给的腊肉，她特意从乡下带来的，说是粮食猪，比城里的好吃...」

「妈，这太多了，我拿不动...」

「不多不多，就一点东西。」妈妈又从口袋里掏出个红包，红包是那种大红色的，上面印着「福」字，「这是你奶奶给的，你拿着，路上买点吃的。奶奶说你工作忙，没来得及给你，你拿着，讨个好彩头。」

你接过红包，感觉里面挺厚的，少说也有两千块。

「妈，奶奶怎么给这么多...」

「拿着拿着，你奶奶说了，你现在工作了，以后她给不动了，趁她还在，多给你点。」妈妈的眼眶有些红。

候车厅里的人越来越多，广播里传来检票的通知。

「G1234次列车开始检票，请旅客朋友们准备好车票和身份证，在检票口排队检票...」

检票口到了。

队伍排得老长，你排在中间位置，前面的队伍移动得很慢。爸妈站在检票口外面，隔着栏杆看着你。

「好了，我进去了。」你转过身。

妈妈拉住你的手，眼眶又红了：「到了给妈打电话。」

「知道了。」

「路上小心。」

「嗯。」

「到了深圳记得多吃点，别光顾着工作...」

「妈，我知道了。」

妈妈还想说什么，但被旁边的工作人员打断了：「后面的快点，别堵着！」

爸爸站在旁边，没说话，但眼眶也有些红。他一直是这样，不善言辞，但眼神里全是关心。

「爸，我走了。」

「走吧，」他拍了拍你的肩膀，力道不大，但很温暖，「照顾好自己。」

「嗯。」

你转身往里走，刚走了几步，手机震动了。

是林晓发来的微信：

「一路顺风，到了告诉我一声。」

你回头看了一眼，爸妈还站在原地看着你。妈妈在偷偷抹眼泪，爸爸在旁边递纸巾。妈妈似乎察觉到了你的目光，挥了挥手，喊着：「快走吧，别误了车！」

你挥了挥手，然后转身进了检票口。

穿过长长的通道，上了火车。车厢里已经坐满了人，行李架上堆得满满当当。你找到自己的座位，把行李箱塞进上方的行李架，坐了下来。

窗外，爸妈的身影还站在站台上，朝你的方向张望。妈妈还在擦眼泪，爸爸在旁边轻声安慰着她。

你朝他们挥了挥手，虽然知道他们可能看不见。

火车缓缓启动，「况且况且」的声音响起，窗外的站台开始往后退。你看到站台越来越远，看到那座熟悉的小城渐渐消失在视野里。

*再见了，爸妈。*

*再见了，小县城。*

*我会想你们的。*

手机又震动了，是小敏：

「姐妹，上车了吗？新的一年，祝你遇到对的人！想我就给我发微信！」

后面跟了一串表情包，有撒花的、有加油的、还有一个飞吻的。

你笑了笑，回复：「上车了，谢谢姐妹。新的一年，我们都要幸福！」

小敏秒回：「必须的！对了，相亲那个怎么样？有没有后续？快给我讲讲！」

你刚想回复，手机又震动了，是林晓：

「上车了吗？我刚跟我妈去菜市场买菜，今天的菜特别新鲜，我妈说初七的菜最新鲜了，是真的吗？」

后面还附了一张图，是一篮子翠绿的蔬菜和活蹦乱跳的鱼。

你看着屏幕，嘴角不自觉地扬起来。

窗外的风景开始倒退，城市的楼房渐渐变成了农田，农田又变成了远处的山丘。阳光透过车窗照进来，暖洋洋的。

你看着窗外，心里却想着很多事。

*妈妈昨晚说的那些话...*

*爸爸难得说出的那些心里话...*

*奶奶塞给我的红包...*

*还有林晓...*

手机屏幕上，林晓的消息还亮着红点。

*这个春节，好像想明白了一些事。*

*又好像什么都没想明白。*

*但是...*

*至少，不再那么迷茫了。*

新的一年，似乎有了些不一样的期待。

你打开微信，看着林晓发来的那张照片，打了几个字：

「上车了，在路上了。你买的是什么鱼？」

发送出去的那一刻，窗外的阳光正好照在脸上，暖洋洋的。

火车继续向前，驶向那座灯火通明的大城市。

但这次离开，心里多了些不一样的东西。

*也许，这就是成长吧。*`,
    isMainQuest: true,
    choices: [
      {
        text: "回复林晓：「这次回去，我想认真试试」",
        tone: "aggressive",
        energyCost: 15,
        skillCheck: {
          attr: "romance",
          difficulty: 50,
          label: "恋爱关系测试"
        },
        effects: [
          { type: "attr", target: "romance", delta: 15 },
          { type: "attr", target: "independence", delta: 5 },
          { type: "affection", target: "npc_blind_date_affection", delta: 25 },
          { type: "affection", target: "npc_mom_affection", delta: 10 }
        ],
        feedback: {
          success: "林晓很快回复：「好，我等你。」你把手机收好，看着窗外飞速倒退的风景，心里突然很平静。新的一年，似乎有了方向。",
          fail: "林晓没有立刻回复，你有些不安。但过了一会儿，她发来：「我再想想吧。」"
        },
        nextQuestId: "time_d9e"
      },
      {
        text: "回复林晓：「谢谢，先做朋友吧」",
        tone: "conservative",
        energyCost: 10,
        skillCheck: {
          attr: "social",
          difficulty: 35,
          label: "友情测试"
        },
        effects: [
          { type: "attr", target: "social", delta: 5 },
          { type: "affection", target: "npc_blind_date_affection", delta: 10 },
          { type: "affection", target: "npc_mom_affection", delta: 5 }
        ],
        feedback: {
          success: "林晓回复：「好，不着急，慢慢来。」你放下手机，闭上眼睛。这次春节，好像想明白了一些事，又好像什么都没想明白。但至少，故事还在继续。",
          fail: "林晓只回了一个「嗯」，有些冷淡。"
        },
        nextQuestId: "time_d9e"
      },
      {
        text: "先不回消息，整理一下这个春节的心情",
        tone: "idealist",
        energyCost: 5,
        skillCheck: {
          attr: "resilience",
          difficulty: 30,
          label: "自我反思"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 8 },
          { type: "affection", target: "npc_blind_date_affection", delta: 0 },
          { type: "affection", target: "npc_mom_affection", delta: 5 }
        ],
        feedback: {
          success: "你把手机调成静音，靠在座椅上想事情。这个春节发生了太多事——催婚、相亲、前任、闺蜜、爸妈的眼泪。你需要好好想想，接下来该怎么走。",
          fail: "你什么都没想清楚，反而更迷茫了。"
        },
        nextQuestId: "time_d9e"
      }
    ],
    unlockedNext: "time_d9e",
    nextQuestId: "time_d9e",
    phase: 4,
    isMainQuest: true
  },

  // ============================================
  // 【Day 9 晚上】过渡：返程火车上
  // ============================================
  {
    id: "quest_trans_d9e",
    chapterIndex: 9.2,
    title: "初七 · 返程火车上",
    subtitle: "独自面对新的开始",
    timeSlot: "初七 · 晚上",
    description: "火车上的独处时光",
    npcInvolved: [],
    illustration: "trainreturn.svg",
    bgColor: "#1f2535",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    isTransition: true,
    requiredAttributes: [],
    optionalAttributes: ["resilience", "career"],
    body: `初七，晚上八点。

火车在夜色中疾驰。窗外的风景已经看不清了，只有零星的路灯一闪而过，在玻璃上投下长长的光影。

车厢里的人大多已经睡着了。有人在打呼噜，有人在轻轻咳嗽，有人抱着孩子哼着摇篮曲。

你靠在座椅上，看着窗外发呆。

*这个春节...*

*发生了太多事...*

*催婚、相亲、前任、闺蜜、爸妈的眼泪...*

*还有林晓...*

手机震动了，是小敏的微信：

「到哪儿了？」

你回复：「快到站了。还有两个小时。」

「好，注意安全。」

「嗯。」

你放下手机，看着窗外的夜空。月亮很亮，是正月十五前的最后一次月圆。

*下次回家...*

*会是清明吗？*

*妈妈说让我清明回来...*

*我答应了。*

又一条消息，是林晓：

「还在路上吗？」

「嗯，快到了。」你回复。

「到了早点休息。」

「好的。」

你放下手机，闭上眼睛。

*林晓...*

*我们之间，会怎样呢？*

*是继续联系，还是渐渐疏远？*

*我也不知道。*

*但至少，我迈出了第一步。*

列车广播响起：「各位旅客您好，列车即将到达深圳北站，请携带好您的随身物品...」

你睁开眼睛，看着窗外渐渐明亮起来的灯光。深圳到了。

你站起来，拿起行李，走向车门。

门打开的那一刻，一股熟悉的城市气息扑面而来——空气里带着地铁的味道，路灯的光芒有些刺眼，行人的脚步匆匆。

*回来了。*

*新的一年。*

*新的开始。*`,
    choices: [
      {
        text: "给爸妈报平安，然后回家休息",
        tone: "conservative",
        energyCost: 10,
        skillCheck: {
          attr: "resilience",
          difficulty: 25,
          label: "日常测试"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 5 },
          { type: "affection", target: "npc_mom_affection", delta: 10 },
          { type: "energy", target: "self", delta: 20 }
        ],
        feedback: {
          success: "妈妈秒回：「到了就好，早点休息。」你回到出租屋，躺在床上，看着熟悉的天花板，心里很平静。",
          fail: "妈妈的电话一直打不通，你有些担心。后来她回了条消息：「妈刚才在睡觉。」",
        },
        nextQuestId: "time_d10m"
      },
      {
        text: "先去公司处理一下紧急邮件",
        tone: "idealist",
        energyCost: 25,
        skillCheck: {
          attr: "career",
          difficulty: 40,
          label: "职场测试"
        },
        effects: [
          { type: "attr", target: "career", delta: 10 },
          { type: "attr", target: "resilience", delta: -5 }
        ],
        feedback: {
          success: "你到公司处理了几封紧急邮件。老板发来消息：「新年好，辛苦了！」",
          fail: "你太累了，反而把事情弄得一团糟。"
        },
        nextQuestId: "time_d10m"
      },
      {
        text: "给林晓发消息报平安",
        tone: "aggressive",
        energyCost: 15,
        skillCheck: {
          attr: "romance",
          difficulty: 30,
          label: "关心测试"
        },
        effects: [
          { type: "attr", target: "romance", delta: 8 },
          { type: "affection", target: "npc_blind_date_affection", delta: 15 }
        ],
        feedback: {
          success: "林晓秒回：「到了就好。晚安。」你看着这条消息，心里暖暖的。",
          fail: "林晓已经睡着了，没有回复你。"
        },
        nextQuestId: "time_d10m"
      }
    ],
    unlockedNext: "time_d10m",
    nextQuestId: "time_d10m",
    phase: 4
  },

  // ============================================
  // 【Day 10 上午】过渡：回到大城市
  // ============================================
  {
    id: "quest_trans_d10m",
    chapterIndex: 10.1,
    title: "初八 · 回到大城市",
    subtitle: "熟悉的出租屋",
    timeSlot: "初八 · 上午",
    description: "回到深圳，回到那个熟悉的小房间",
    npcInvolved: [],
    illustration: "backtocity.svg",
    bgColor: "#1a2433",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    isTransition: true,
    requiredAttributes: [],
    optionalAttributes: ["career", "resilience"],
    body: `初八，早上七点。

你拖着行李箱走进出租屋。一切都和离开时一样——小桌子、小床、窗户上的那盆绿萝。

绿萝的叶子有些蔫了，大概是这半个月没浇水。你赶紧接了点水，浇在花盆里。

然后你打开行李箱，开始整理妈妈塞给你的东西。腊肉、麻花、酸豆角、还有那几盒药...满满当当地摆在桌上。

手机响了，是妈妈的视频电话：

「到家了吗？东西都拿回去了吗？」

「都拿了，妈。」

「冰箱里还有位置吗？腊肉要放冷冻的。」

「有，我放好了。」

「那就好，」妈妈松了口气，「你在外面要按时吃饭，别老吃外卖。」

「知道了，妈。」

「还有，」妈妈欲言又止，「林晓那边...有联系吗？」

你愣了一下：「有，昨晚发了消息。」

「那就好，」妈妈说，「你主动点，妈看得出来她对你印象不错。」

「妈，您能不能别催...」

「妈不是催，妈就是问问。」妈妈笑了笑，「行行行，妈不说了。你去休息吧，倒时差。」

挂掉电话，你躺在床上，看着熟悉的天花板。

*回来了。*

*但是...*

*好像心里还牵挂着什么。*

你翻了个身，把脸埋进枕头里。

窗外，深圳的阳光透过窗帘照进来，在墙上投下斑驳的光影。`,
    choices: [
      {
        text: "好好休息一天，恢复状态",
        tone: "conservative",
        energyCost: 5,
        skillCheck: {
          attr: "resilience",
          difficulty: 20,
          label: "恢复测试"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 5 },
          { type: "energy", target: "self", delta: 30 }
        ],
        feedback: {
          success: "你睡了一整天，精神焕发。明天开始又是新的一年，新的开始。",
          fail: "你睡不着，反而更累了。"
        },
        nextQuestId: "time_d10a"
      },
      {
        text: "给林晓打个电话",
        tone: "aggressive",
        energyCost: 15,
        skillCheck: {
          attr: "romance",
          difficulty: 40,
          label: "主动联系测试"
        },
        effects: [
          { type: "attr", target: "romance", delta: 10 },
          { type: "affection", target: "npc_blind_date_affection", delta: 15 }
        ],
        feedback: {
          success: "你鼓起勇气打了电话。林晓的声音很惊喜：「你打过来了？」你们聊了半小时，约好清明再见。",
          fail: "林晓接了电话，但聊得很短。她说有点忙，就挂了。"
        },
        nextQuestId: "time_d10a"
      },
      {
        text: "开始规划新一年的工作",
        tone: "idealist",
        energyCost: 25,
        skillCheck: {
          attr: "career",
          difficulty: 40,
          label: "工作规划测试"
        },
        effects: [
          { type: "attr", target: "career", delta: 10 },
          { type: "attr", target: "independence", delta: 5 }
        ],
        feedback: {
          success: "你给自己列了新一年的计划。年初定个小目标：升职加薪。",
          fail: "你列了计划，但感觉压力更大了。"
        },
        nextQuestId: "time_d10a"
      }
    ],
    unlockedNext: "time_d10a",
    nextQuestId: "time_d10a",
    phase: 4,
    isMainQuest: true
  },

  // ============================================
  // 【Day 10 下午】主线：结局演出 - 初八离开家乡
  // ============================================
  {
    id: "quest_cn_10",
    chapterIndex: 10,
    title: "初八 · 新的开始",
    subtitle: "春节战役的尾声，新一年的序章",
    timeSlot: "初八 · 下午",
    description: "春节战役的尾声，新一年的序章",
    npcInvolved: ["npc_mom", "npc_dad", "npc_blind_date", "npc_ex", "npc_bestie"],
    scene: "train",
    illustration: "ending.svg",
    bgColor: "#1a2430",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    requiredAttributes: [],
    optionalAttributes: ["resilience", "independence", "romance"],
    isEnding: true,
    body: `正月初八，深圳的阳光很好。

你坐在出租屋的窗前，看着窗外的城市。车水马龙，行人匆匆，一切和离开时一样。

手机震动了，是妈妈发来的消息：

「孩子，新年快乐。妈想了想，妈以后不催你了。你自己的人生，自己做主。只要你幸福，妈就开心。」

你看着这条消息，眼眶有些发热。

*妈妈...*

*谢谢您。*

又一条消息，是林晓：

「新年快乐！清明我可能要去深圳出差，到时候见一面？」

你的心跳快了一拍：

「好，到时候见。」

还有一条，是陈一凡：

「新年快乐。我跟她...分开了。但不是为你，是因为我们确实不合适。希望你一切都好。」

你看着这条消息，心里五味杂陈。但更多的是释然。

「谢谢，新年快乐。」

*也许...*

*每个人都有自己的路要走。*

*陈一凡、林晓、爸妈、闺蜜...*

*还有我自己。*

你打开朋友圈，发了一条动态：

「春节战役，勉强幸存。新的一年，希望我们都幸福。」

评论区炸了。

小敏第一个回复：「活着就好！」

妈妈在下面留言：「清明记得回家。」

林晓点了个赞，没说话。

你看着这些评论，笑了。

窗外，深圳的天空很蓝。远处的摩天大楼在阳光下闪闪发光，像是在诉说着这座城市的希望。

*新的一年。*

*新的开始。*

*不管未来怎样...*

*我都准备好了。*

你合上电脑，深吸一口气。

然后打开工作邮件，开始新一天的工作。

但这次，心里多了些不一样的东西。

*是牵挂，是期待，是成长。*

*是家的味道，是爸妈的爱，是那个...*

*让人想回去的地方。*

**【春节战役 - 完】**`,
    isMainQuest: true,
    choices: [
      {
        text: "专注事业，给林晓一个积极的回复",
        tone: "aggressive",
        energyCost: 10,
        skillCheck: {
          attr: "career",
          difficulty: 40,
          label: "职场与感情平衡测试"
        },
        effects: [
          { type: "attr", target: "career", delta: 8 },
          { type: "attr", target: "romance", delta: 10 },
          { type: "affection", target: "npc_blind_date_affection", delta: 20 }
        ],
        feedback: {
          success: "你回复林晓：「好，清明见。我会努力的。」你开始努力工作，也努力经营这段感情。",
          fail: "你想平衡事业和感情，但发现很难。"
        },
        nextQuestId: "time_d10e"
      },
      {
        text: "享受单身，专注自我成长",
        tone: "idealist",
        energyCost: 10,
        skillCheck: {
          attr: "independence",
          difficulty: 40,
          label: "独立测试"
        },
        effects: [
          { type: "attr", target: "independence", delta: 15 },
          { type: "attr", target: "career", delta: 5 },
          { type: "affection", target: "npc_mom_affection", delta: -5 }
        ],
        // v7: 标记明确选择单身，强制解锁「单身贵族」结局
        flags: { completed_blind_date: false },
        outcomes: ["outcome_romance_single_happy"],
        feedback: {
          success: "你开始享受单身生活，报了健身课、学了烹饪、读了十几本书。妈妈虽然偶尔还是唠叨，但也不再逼你了。",
          fail: "妈妈对你的选择有些失望，但还是接受了。"
        },
        nextQuestId: "time_d10e"
      },
      {
        text: "和爸妈保持紧密联系，珍惜亲情",
        tone: "conservative",
        energyCost: 5,
        skillCheck: {
          attr: "resilience",
          difficulty: 30,
          label: "家庭关系测试"
        },
        effects: [
          { type: "attr", target: "resilience", delta: 8 },
          { type: "affection", target: "npc_mom_affection", delta: 25 },
          { type: "affection", target: "npc_dad_affection", delta: 25 }
        ],
        // v7: 标记家庭关系深厚，强制解锁「家和万事兴」结局
        flags: { completed_grandma_wish: true },
        outcomes: ["outcome_family_harmony"],
        feedback: {
          success: "你每周都给爸妈打视频电话。妈妈笑着说：「你真的长大了。」",
          fail: "你忙起来还是会忘记打电话，妈妈有些失落。"
        },
        nextQuestId: "time_d10e"
      }
    ],
    unlockedNext: "time_d10e",
    nextQuestId: "time_d10e",
    phase: 4
  },

  // ============================================
  // 【Day 10 晚上】结局：新的开始
  // ============================================
  {
    id: "quest_trans_d10e",
    chapterIndex: 10.2,
    title: "初八 · 新的开始",
    subtitle: "春节战役的最终章",
    timeSlot: "初八 · 晚上",
    description: "春节战役的最终章",
    npcInvolved: [],
    illustration: "newbeginning.svg",
    bgColor: "#1a2433",
    trigger: {
      gender: ["女", "男"],
      ageBands: ["23-27", "28-30", "31-34", "35-39", "≤22", "≥40"],
      cityTiers: ["一线", "新一线", "二线", "三四五线", "县城/农村", "海外"]
    },
    isEnding: true,
    requiredAttributes: [],
    optionalAttributes: ["independence", "resilience"],
    body: `正月初八，晚上。

你坐在出租屋的窗前，看着窗外的夜景。深圳的夜晚很美，万家灯火，霓虹闪烁。

手机震动了，是小敏的微信：

「姐妹，春节快乐！虽然已经初八了，但还是想跟你说一声。」

「谢谢你，姐妹。今年的春节...真是太刺激了。」

「哈哈哈，」小敏发来一串表情包，「明年我们一起过吧！这样就不会孤单了！」

「好，明年一起过。」

又一条，是妈妈：

「孩子，睡了没？明天第一天上班，记得早起。妈给你准备了一个护身符，你奶奶去庙里求的，保佑你平平安安。妈明天寄给你。」

你看着这条消息，眼泪又流下来了。

「妈，谢谢您。晚安。」

「晚安，孩子。妈爱你。」

你放下手机，看着窗外的夜空。

月亮很亮，是这个冬天最圆的一次。

*这个春节...*

*真的结束了。*

*但是...*

*也是新的开始。*

*不管未来会怎样...*

*我都不怕了。*

因为我知道——

**家，永远在那里。**

**爸妈，永远在等我。**

**而我，也永远会回去。**

你合上电脑，关上灯，躺在床上。

闭上眼睛的那一刻，你看到窗外的烟花在夜空中绽放。

虽然现在已经不放烟花了——

但在你的心里——

烟花永远在绽放。

**【完】**

*感谢你体验《春节催婚链》。*

*这是一个关于成长、亲情、友情和爱情的故事。*

*每个人都有自己的春节故事。*

*而你的故事，才刚刚开始。*

*新的一年，愿你——*

*心有所属，不负韶华。*`,
    choices: [
      {
        text: "开始新一年的工作",
        tone: "idealist",
        energyCost: 5,
        effects: [
          { type: "attr", target: "career", delta: 5 },
          { type: "attr", target: "independence", delta: 5 }
        ],
        feedback: {
          success: "你精神饱满地开始新一年的工作。这一年，你会更努力，更自信，更独立。",
          fail: "你有些累，但还是坚持下来了。"
        },
        unlockedNext: null
      },
      {
        text: "给林晓发个晚安",
        tone: "conservative",
        energyCost: 5,
        effects: [
          { type: "attr", target: "romance", delta: 5 },
          { type: "affection", target: "npc_blind_date_affection", delta: 10 }
        ],
        feedback: {
          success: "林晓秒回：「晚安，清明见。」你笑着睡着了。",
          fail: "林晓已经睡着了。"
        },
        unlockedNext: null
      },
      {
        text: "给爸妈打个电话",
        tone: "aggressive",
        energyCost: 5,
        effects: [
          { type: "affection", target: "npc_mom_affection", delta: 15 },
          { type: "affection", target: "npc_dad_affection", delta: 15 }
        ],
        feedback: {
          success: "妈妈接了电话，又絮叨了一会儿。你笑着听，心里暖暖的。",
          fail: "妈妈已经睡着了。"
        },
        unlockedNext: null
      }
    ],
    unlockedNext: null,
    nextQuestId: null,
    phase: 4,
    isMainQuest: true
  }
];

// 导出主线的顺序列表（用于按顺序推进）
export const MAIN_QUEST_ORDER = QUESTS.filter(q => q.isMainQuest).map(q => q.id);

// 导出过渡任务列表
export const TRANSITION_QUEST_ORDER = QUESTS.filter(q => q.isTransition).map(q => q.id);

// 导出所有任务ID列表
export const ALL_QUEST_IDS = QUESTS.map(q => q.id);

// 统计信息
export const QUEST_STATS = {
  total: QUESTS.length,
  mainQuests: QUESTS.filter(q => q.isMainQuest).length,
  transitions: QUESTS.filter(q => q.isTransition).length,
  endings: QUESTS.filter(q => q.isEnding).length,
  totalDays: 10,
  totalChoices: QUESTS.reduce((sum, q) => sum + (q.choices ? q.choices.length : 0), 0)
};

// 导出辅助函数：获取指定章节的 quest
export function getQuestByChapter(chapterIndex) {
  return QUESTS.find(q => q.chapterIndex === chapterIndex);
}

// 导出辅助函数：获取下一个 quest
export function getNextQuest(currentQuestId) {
  const current = QUESTS.find(q => q.id === currentQuestId);
  if (!current) return null;
  if (!current.nextQuestId) return null;
  return QUESTS.find(q => q.id === current.nextQuestId);
}

// 导出辅助函数：按时间轴获取任务
export function getQuestByTimeSlot(timeSlotId) {
  return QUESTS.find(q => q.timeSlot === timeSlotId);
}

// 导出辅助函数：获取指定NPC出现的所有任务
export function getQuestsByNpc(npcId) {
  return QUESTS.filter(q => q.npcInvolved && q.npcInvolved.includes(npcId));
}

// 导出辅助函数：获取所有需要特定属性的任务
export function getQuestsByAttribute(attrName) {
  return QUESTS.filter(q =>
    (q.requiredAttributes && q.requiredAttributes.includes(attrName)) ||
    (q.optionalAttributes && q.optionalAttributes.includes(attrName))
  );
}

// 导出辅助函数：验证选择结构
export function validateChoice(choice) {
  return choice &&
    typeof choice.text === 'string' &&
    typeof choice.energyCost === 'number' &&
    choice.effects &&
    Array.isArray(choice.effects);
}