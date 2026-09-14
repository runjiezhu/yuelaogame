// 自动生成 - ENDINGS
// 来源: yuelao_skill/skill_lab/distill
// 生成时间: 2026-09-10

export const ENDINGS = [
  {
    "id": "ending_perfect_match",
    "name": "门当户对的圆满",
    "condition": {
      "assetTier": [
        "A8",
        "A9"
      ],
      "cityTier": [
        "一线",
        "新一线"
      ],
      "ageRange": [
        27,
        35
      ],
      "minConfidence": 60
    },
    "body": "你在33岁那年遇到了对的人——门当户对，颜值相当，聊得来。你们在亲友的祝福下办了不大不小的婚礼。博主说：'这就是门当户对里挑喜欢的最佳范本。'",
    "insight": "门当户对里挑喜欢的"
  },
  {
    "id": "ending_single_noble",
    "name": "主动选择的单身贵族",
    "condition": {
      "assetTier": [
        "A7",
        "A8",
        "A9"
      ],
      "minConfidence": 70,
      "social": {
        "min": 0,
        "max": 40
      }
    },
    "body": "你35岁那年，决定一个人过。养了只猫，买了套大房子，每年出国旅行两次。爸妈从最初的反对到最后的接受——你说服了他们。",
    "insight": "单身不是失败，是主动选择"
  },
  {
    "id": "ending_marriage_market_loop",
    "name": "相亲不息的循环",
    "condition": {
      "ageRange": [
        35,
        50
      ],
      "maxConfidence": 40
    },
    "body": "你还在相亲。五年后回看自己——标准没变，年龄变了，身边的人换了一茬又一茬。妈妈每次视频电话都叹气。",
    "insight": "该做减法的时候没做，市场会用脚投票"
  },
  {
    "id": "ending_settle_down",
    "name": "理性落地的归宿",
    "condition": {
      "assetTier": [
        "A6",
        "A7",
        "普通"
      ],
      "cityTier": [
        "三四五线",
        "县城/农村"
      ],
      "ageRange": [
        28,
        35
      ],
      "minConfidence": 50
    },
    "body": "你在老家/工作的城市找了个人，过上了稳定的小日子。没什么大起大落，但每天回家有人等你——博主说：'门当户对、知根知底，这种最稳。'",
    "insight": "稳定的婚姻不在于激情，在于节奏一致"
  },
  {
    "id": "ending_unexpected_love",
    "name": "意外的缘分",
    "condition": {
      "minConfidence": 50,
      "social": {
        "min": 60,
        "max": 100
      }
    },
    "body": "你根本没在'找对象'，只是某次朋友聚会上遇见了 TA——门不当户不对，但聊得停不下来。你决定试试看。",
    "insight": "缘分有时候就是不在你的清单上"
  },
  {
    "id": "ending_golden_period_missed",
    "name": "错过黄金期",
    "condition": {
      "gender": [
        "F"
      ],
      "ageRange": [
        32,
        50
      ],
      "assetTier": [
        "A8",
        "A9"
      ]
    },
    "body": "你33岁了还在等那个'门当户对又心动'的人。但每一次接近都因为'差一点点'而放弃。妈妈说：'闺女，咱能不能别那么挑了。'你沉默。",
    "insight": "富家千金越该趁年轻找，过了黄金期概率下降"
  },
  {
    "id": "ending_down_to_earth",
    "name": "放下面子的踏实",
    "condition": {
      "maxConfidence": 30,
      "social": {
        "min": 70,
        "max": 100
      }
    },
    "body": "你放弃了最初的画像。对方家境一般但踏实上进，对你也好。结婚那天妈妈哭了——是开心的。",
    "insight": "门当户对不是死规矩，找一个愿意一起过的人才是"
  },
  {
    "id": "ending_career_first",
    "name": "事业优先的强者",
    "condition": {
      "incomeTier": [
        "100万+",
        "50-100万"
      ],
      "ageRange": [
        30,
        50
      ],
      "social": {
        "min": 0,
        "max": 30
      }
    },
    "body": "你40岁，公司上市/做到合伙人，朋友圈都是更优秀的人。但回望青春——好像错过了什么。",
    "insight": "竞争力是组合拳，单一维度撑不起完整人生"
  },
  {
    "id": "ending_default_match",
    "name": "差不多就得了",
    "condition": {},
    "body": "你最终找了一个'差不多'的人。不惊艳也不失望，平平淡淡过完这一生。",
    "insight": "大部分人的婚姻本来就是这么回事"
  }
];
