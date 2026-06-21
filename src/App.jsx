import { useState, useRef, useEffect } from "react";

// ===================== THEMES =====================
const THEMES = {
  minimalist: {
    id: "minimalist", name: "Minimalist", emoji: "◻",
    bg: "#F7F7F5", bgAlt: "#EFEFED", surface: "#FFFFFF",
    border: "#E2E2DE", text: "#111110", textMuted: "#888884",
    accent: "#111110", accentSoft: "#EFEFED", accentAlt: "#555550",
    success: "#2D6A4F", danger: "#C0392B", warn: "#E67E22",
    navBg: "rgba(247,247,245,0.95)", cardRadius: "10px",
    shadow: "0 1px 8px rgba(0,0,0,0.07)", shadowLg: "0 4px 20px rgba(0,0,0,0.09)",
    fontDisplay: "'DM Serif Display', serif", fontBody: "'DM Sans', sans-serif",
    fontMono: "'DM Mono', monospace", fontJP: "'Noto Serif JP', serif",
    inputBg: "#FFFFFF",
  },
  kawaii: {
    id: "kawaii", name: "Kawaii", emoji: "🌸",
    bg: "#FEF2F8", bgAlt: "#FFE4F1", surface: "#FFFFFF",
    border: "#FFA8D2", text: "#3D1025", textMuted: "#B0607A",
    accent: "#F5487A", accentSoft: "#FFDAEB", accentAlt: "#FF85C2",
    success: "#66BB6A", danger: "#F44336", warn: "#FF9800",
    navBg: "rgba(254,242,248,0.95)", cardRadius: "22px",
    shadow: "0 4px 18px rgba(245,72,122,0.1)", shadowLg: "0 8px 32px rgba(245,72,122,0.14)",
    fontDisplay: "'Nunito', sans-serif", fontBody: "'Nunito', sans-serif",
    fontMono: "'DM Mono', monospace", fontJP: "'Noto Serif JP', serif",
    inputBg: "#FFF5FA",
  },
  anime: {
    id: "anime", name: "Anime", emoji: "⚡",
    bg: "#07050F", bgAlt: "#0F0A1E", surface: "rgba(155,70,255,0.07)",
    border: "rgba(155,70,255,0.22)", text: "#F0EEFF", textMuted: "rgba(240,238,255,0.5)",
    accent: "#9B46FF", accentSoft: "rgba(155,70,255,0.14)", accentAlt: "#00D4FF",
    success: "#6EFF85", danger: "#FF4060", warn: "#FFD600",
    navBg: "rgba(7,5,15,0.93)", cardRadius: "10px",
    shadow: "0 0 24px rgba(155,70,255,0.12)", shadowLg: "0 0 40px rgba(155,70,255,0.2)",
    fontDisplay: "'Orbitron', monospace", fontBody: "'Nunito', sans-serif",
    fontMono: "'Orbitron', monospace", fontJP: "'Noto Serif JP', serif",
    inputBg: "rgba(155,70,255,0.07)",
  },
  cultural: {
    id: "cultural", name: "Japan", emoji: "⛩️",
    bg: "#F2EBE0", bgAlt: "#E8DDD0", surface: "#FBF7F0",
    border: "#C4A07A", text: "#241410", textMuted: "#8A604A",
    accent: "#BF2A1A", accentSoft: "#F7EAE7", accentAlt: "#7A3F1A",
    success: "#2E7D32", danger: "#BF2A1A", warn: "#E65C00",
    navBg: "rgba(242,235,224,0.95)", cardRadius: "4px",
    shadow: "0 2px 12px rgba(36,20,16,0.09)", shadowLg: "0 6px 24px rgba(36,20,16,0.13)",
    fontDisplay: "'Noto Serif JP', serif", fontBody: "'Noto Serif JP', serif",
    fontMono: "'DM Mono', monospace", fontJP: "'Noto Serif JP', serif",
    inputBg: "#FBF7F0",
  },
  ghibli: {
    id: "ghibli", name: "Ghibli", emoji: "🌿",
    bg: "#F3EFDC", bgAlt: "#E7E0C4", surface: "#FFFCF2",
    border: "#C7D6AE", text: "#3C4A33", textMuted: "#83805F",
    accent: "#5B8A5C", accentSoft: "#E2EAD3", accentAlt: "#D6A24C",
    success: "#6B9362", danger: "#C0604A", warn: "#D6A24C",
    navBg: "rgba(243,239,220,0.95)", cardRadius: "18px",
    shadow: "0 3px 16px rgba(70,80,50,0.10)", shadowLg: "0 8px 28px rgba(70,80,50,0.16)",
    fontDisplay: "'Kalam', cursive", fontBody: "'Quicksand', sans-serif",
    fontMono: "'DM Mono', monospace", fontJP: "'Noto Serif JP', serif",
    inputBg: "#FFFCF2",
  },
};

// ===================== DATA =====================
// Row-grouped so every row always has 5 grid slots (null = blank cell), keeping ra-ri-ru-re-ro
// and every other row perfectly aligned regardless of gaps (y-row, w-row, n).
const HIRAGANA_ROWS = [
  { label: "a", chars: [{char:"あ",romaji:"a"},{char:"い",romaji:"i"},{char:"う",romaji:"u"},{char:"え",romaji:"e"},{char:"お",romaji:"o"}] },
  { label: "k", chars: [{char:"か",romaji:"ka"},{char:"き",romaji:"ki"},{char:"く",romaji:"ku"},{char:"け",romaji:"ke"},{char:"こ",romaji:"ko"}] },
  { label: "s", chars: [{char:"さ",romaji:"sa"},{char:"し",romaji:"shi"},{char:"す",romaji:"su"},{char:"せ",romaji:"se"},{char:"そ",romaji:"so"}] },
  { label: "t", chars: [{char:"た",romaji:"ta"},{char:"ち",romaji:"chi"},{char:"つ",romaji:"tsu"},{char:"て",romaji:"te"},{char:"と",romaji:"to"}] },
  { label: "n", chars: [{char:"な",romaji:"na"},{char:"に",romaji:"ni"},{char:"ぬ",romaji:"nu"},{char:"ね",romaji:"ne"},{char:"の",romaji:"no"}] },
  { label: "h", chars: [{char:"は",romaji:"ha"},{char:"ひ",romaji:"hi"},{char:"ふ",romaji:"fu"},{char:"へ",romaji:"he"},{char:"ほ",romaji:"ho"}] },
  { label: "m", chars: [{char:"ま",romaji:"ma"},{char:"み",romaji:"mi"},{char:"む",romaji:"mu"},{char:"め",romaji:"me"},{char:"も",romaji:"mo"}] },
  { label: "y", chars: [{char:"や",romaji:"ya"}, null, {char:"ゆ",romaji:"yu"}, null, {char:"よ",romaji:"yo"}] },
  { label: "r", chars: [{char:"ら",romaji:"ra"},{char:"り",romaji:"ri"},{char:"る",romaji:"ru"},{char:"れ",romaji:"re"},{char:"ろ",romaji:"ro"}] },
  { label: "w", chars: [{char:"わ",romaji:"wa"}, null, null, null, {char:"を",romaji:"wo"}] },
  { label: "n-final", chars: [{char:"ん",romaji:"n"}, null, null, null, null] },
];
const HIRAGANA_DAKUTEN_ROWS = [
  { label: "g", chars: [{char:"が",romaji:"ga"},{char:"ぎ",romaji:"gi"},{char:"ぐ",romaji:"gu"},{char:"げ",romaji:"ge"},{char:"ご",romaji:"go"}] },
  { label: "z", chars: [{char:"ざ",romaji:"za"},{char:"じ",romaji:"ji"},{char:"ず",romaji:"zu"},{char:"ぜ",romaji:"ze"},{char:"ぞ",romaji:"zo"}] },
  { label: "d", chars: [{char:"だ",romaji:"da"},{char:"ぢ",romaji:"ji"},{char:"づ",romaji:"zu"},{char:"で",romaji:"de"},{char:"ど",romaji:"do"}] },
  { label: "b", chars: [{char:"ば",romaji:"ba"},{char:"び",romaji:"bi"},{char:"ぶ",romaji:"bu"},{char:"べ",romaji:"be"},{char:"ぼ",romaji:"bo"}] },
];
const HIRAGANA_HANDAKUTEN_ROWS = [
  { label: "p", chars: [{char:"ぱ",romaji:"pa"},{char:"ぴ",romaji:"pi"},{char:"ぷ",romaji:"pu"},{char:"ぺ",romaji:"pe"},{char:"ぽ",romaji:"po"}] },
];

const KATAKANA_ROWS = [
  { label: "a", chars: [{char:"ア",romaji:"a"},{char:"イ",romaji:"i"},{char:"ウ",romaji:"u"},{char:"エ",romaji:"e"},{char:"オ",romaji:"o"}] },
  { label: "k", chars: [{char:"カ",romaji:"ka"},{char:"キ",romaji:"ki"},{char:"ク",romaji:"ku"},{char:"ケ",romaji:"ke"},{char:"コ",romaji:"ko"}] },
  { label: "s", chars: [{char:"サ",romaji:"sa"},{char:"シ",romaji:"shi"},{char:"ス",romaji:"su"},{char:"セ",romaji:"se"},{char:"ソ",romaji:"so"}] },
  { label: "t", chars: [{char:"タ",romaji:"ta"},{char:"チ",romaji:"chi"},{char:"ツ",romaji:"tsu"},{char:"テ",romaji:"te"},{char:"ト",romaji:"to"}] },
  { label: "n", chars: [{char:"ナ",romaji:"na"},{char:"ニ",romaji:"ni"},{char:"ヌ",romaji:"nu"},{char:"ネ",romaji:"ne"},{char:"ノ",romaji:"no"}] },
  { label: "h", chars: [{char:"ハ",romaji:"ha"},{char:"ヒ",romaji:"hi"},{char:"フ",romaji:"fu"},{char:"ヘ",romaji:"he"},{char:"ホ",romaji:"ho"}] },
  { label: "m", chars: [{char:"マ",romaji:"ma"},{char:"ミ",romaji:"mi"},{char:"ム",romaji:"mu"},{char:"メ",romaji:"me"},{char:"モ",romaji:"mo"}] },
  { label: "y", chars: [{char:"ヤ",romaji:"ya"}, null, {char:"ユ",romaji:"yu"}, null, {char:"ヨ",romaji:"yo"}] },
  { label: "r", chars: [{char:"ラ",romaji:"ra"},{char:"リ",romaji:"ri"},{char:"ル",romaji:"ru"},{char:"レ",romaji:"re"},{char:"ロ",romaji:"ro"}] },
  { label: "w", chars: [{char:"ワ",romaji:"wa"}, null, null, null, {char:"ヲ",romaji:"wo"}] },
  { label: "n-final", chars: [{char:"ン",romaji:"n"}, null, null, null, null] },
];
const KATAKANA_DAKUTEN_ROWS = [
  { label: "g", chars: [{char:"ガ",romaji:"ga"},{char:"ギ",romaji:"gi"},{char:"グ",romaji:"gu"},{char:"ゲ",romaji:"ge"},{char:"ゴ",romaji:"go"}] },
  { label: "z", chars: [{char:"ザ",romaji:"za"},{char:"ジ",romaji:"ji"},{char:"ズ",romaji:"zu"},{char:"ゼ",romaji:"ze"},{char:"ゾ",romaji:"zo"}] },
  { label: "d", chars: [{char:"ダ",romaji:"da"},{char:"ヂ",romaji:"ji"},{char:"ヅ",romaji:"zu"},{char:"デ",romaji:"de"},{char:"ド",romaji:"do"}] },
  { label: "b", chars: [{char:"バ",romaji:"ba"},{char:"ビ",romaji:"bi"},{char:"ブ",romaji:"bu"},{char:"ベ",romaji:"be"},{char:"ボ",romaji:"bo"}] },
];
const KATAKANA_HANDAKUTEN_ROWS = [
  { label: "p", chars: [{char:"パ",romaji:"pa"},{char:"ピ",romaji:"pi"},{char:"プ",romaji:"pu"},{char:"ペ",romaji:"pe"},{char:"ポ",romaji:"po"}] },
];
const LEVEL_COLOR = { N5: "#2D6A4F", N4: "#1F7A8C", N3: "#E67E22", N2: "#9B59B6", N1: "#C0392B" };

const KANJI_BY_LEVEL = {
  N5: [
    {char:"一",romaji:"ichi",meaning:"one"},{char:"二",romaji:"ni",meaning:"two"},{char:"三",romaji:"san",meaning:"three"},
    {char:"四",romaji:"yon / shi",meaning:"four"},{char:"五",romaji:"go",meaning:"five"},{char:"六",romaji:"roku",meaning:"six"},
    {char:"七",romaji:"nana / shichi",meaning:"seven"},{char:"八",romaji:"hachi",meaning:"eight"},{char:"九",romaji:"kyuu / ku",meaning:"nine"},
    {char:"十",romaji:"juu",meaning:"ten"},{char:"百",romaji:"hyaku",meaning:"hundred"},{char:"千",romaji:"sen",meaning:"thousand"},
    {char:"万",romaji:"man",meaning:"ten thousand"},{char:"円",romaji:"en",meaning:"yen · circle"},
    {char:"日",romaji:"nichi / hi",meaning:"day · sun"},{char:"月",romaji:"getsu / tsuki",meaning:"month · moon"},
    {char:"火",romaji:"ka / hi",meaning:"fire"},{char:"水",romaji:"sui / mizu",meaning:"water"},
    {char:"木",romaji:"moku / ki",meaning:"tree · wood"},{char:"金",romaji:"kin / kane",meaning:"gold · money"},
    {char:"土",romaji:"do / tsuchi",meaning:"earth · soil"},{char:"上",romaji:"jou / ue",meaning:"above · up"},
    {char:"下",romaji:"ka / shita",meaning:"below · down"},{char:"中",romaji:"chuu / naka",meaning:"middle · inside"},
    {char:"大",romaji:"dai / oo",meaning:"big"},{char:"小",romaji:"shou / chii",meaning:"small"},
    {char:"山",romaji:"san / yama",meaning:"mountain"},{char:"川",romaji:"sen / kawa",meaning:"river"},
    {char:"田",romaji:"den / ta",meaning:"rice field"},{char:"人",romaji:"jin / hito",meaning:"person"},
    {char:"子",romaji:"shi / ko",meaning:"child"},{char:"女",romaji:"jo / onna",meaning:"woman"},
    {char:"男",romaji:"dan / otoko",meaning:"man"},{char:"先",romaji:"sen / saki",meaning:"before · ahead"},
    {char:"生",romaji:"sei / i",meaning:"life · birth"},{char:"学",romaji:"gaku",meaning:"study"},
    {char:"校",romaji:"kou",meaning:"school"},{char:"今",romaji:"kon / ima",meaning:"now"},
    {char:"何",romaji:"nan / nani",meaning:"what"},{char:"時",romaji:"ji / toki",meaning:"time · hour"},
    {char:"分",romaji:"fun / wa",meaning:"minute · divide"},{char:"半",romaji:"han / naka",meaning:"half"},
    {char:"年",romaji:"nen / toshi",meaning:"year"},{char:"行",romaji:"kou / i",meaning:"go"},
    {char:"来",romaji:"rai / ku",meaning:"come"},{char:"帰",romaji:"ki / kae",meaning:"return"},
    {char:"見",romaji:"ken / mi",meaning:"see · look"},{char:"聞",romaji:"bun / ki",meaning:"hear · ask"},
    {char:"言",romaji:"gen / i",meaning:"say · word"},{char:"話",romaji:"wa / hana",meaning:"talk · story"},
    {char:"読",romaji:"doku / yo",meaning:"read"},{char:"書",romaji:"sho / ka",meaning:"write"},
    {char:"食",romaji:"shoku / ta",meaning:"eat · food"},{char:"飲",romaji:"in / no",meaning:"drink"},
    {char:"買",romaji:"bai / ka",meaning:"buy"},{char:"売",romaji:"bai / u",meaning:"sell"},
    {char:"出",romaji:"shutsu / de",meaning:"exit · go out"},{char:"入",romaji:"nyuu / hai",meaning:"enter"},
    {char:"立",romaji:"ritsu / ta",meaning:"stand"},{char:"休",romaji:"kyuu / yasu",meaning:"rest"},
    {char:"名",romaji:"mei / na",meaning:"name"},{char:"前",romaji:"zen / mae",meaning:"front · before"},
    {char:"後",romaji:"go / ato",meaning:"after · behind"},{char:"左",romaji:"sa / hidari",meaning:"left"},
    {char:"右",romaji:"u / migi",meaning:"right"},{char:"東",romaji:"tou / higashi",meaning:"east"},
    {char:"西",romaji:"sei / nishi",meaning:"west"},{char:"南",romaji:"nan / minami",meaning:"south"},
    {char:"北",romaji:"hoku / kita",meaning:"north"},{char:"外",romaji:"gai / soto",meaning:"outside"},
    {char:"内",romaji:"nai / uchi",meaning:"inside"},{char:"高",romaji:"kou / taka",meaning:"high · tall"},
    {char:"安",romaji:"an / yasu",meaning:"cheap · safe"},{char:"長",romaji:"chou / naga",meaning:"long"},
    {char:"新",romaji:"shin / atara",meaning:"new"},{char:"古",romaji:"ko / furu",meaning:"old"},
    {char:"多",romaji:"ta / oo",meaning:"many"},{char:"少",romaji:"shou / suko",meaning:"few"},
    {char:"白",romaji:"haku / shiro",meaning:"white"},{char:"黒",romaji:"koku / kuro",meaning:"black"},
    {char:"雨",romaji:"u / ame",meaning:"rain"},{char:"車",romaji:"sha / kuruma",meaning:"car"},
    {char:"本",romaji:"hon",meaning:"book · origin"},{char:"語",romaji:"go",meaning:"language"},
    {char:"国",romaji:"koku / kuni",meaning:"country"},{char:"父",romaji:"fu / chichi",meaning:"father"},
    {char:"母",romaji:"bo / haha",meaning:"mother"},{char:"友",romaji:"yuu / tomo",meaning:"friend"},
    {char:"会",romaji:"kai / a",meaning:"meet"},{char:"社",romaji:"sha",meaning:"company · shrine"},
  ],
  N4: [
    {char:"道",romaji:"dou / michi",meaning:"road · way"},{char:"手",romaji:"shu / te",meaning:"hand"},
    {char:"足",romaji:"soku / ashi",meaning:"foot · leg"},{char:"目",romaji:"moku / me",meaning:"eye"},
    {char:"耳",romaji:"ji / mimi",meaning:"ear"},{char:"口",romaji:"kou / kuchi",meaning:"mouth"},
    {char:"持",romaji:"ji / mo",meaning:"hold · have"},{char:"待",romaji:"tai / ma",meaning:"wait"},
    {char:"知",romaji:"chi / shi",meaning:"know"},{char:"住",romaji:"juu / su",meaning:"live · reside"},
    {char:"始",romaji:"shi / haji",meaning:"begin"},{char:"終",romaji:"shuu / o",meaning:"end · finish"},
    {char:"開",romaji:"kai / hira",meaning:"open"},{char:"閉",romaji:"hei / shi",meaning:"close"},
    {char:"着",romaji:"chaku / ki",meaning:"arrive · wear"},{char:"歩",romaji:"ho / aru",meaning:"walk"},
    {char:"走",romaji:"sou / hashi",meaning:"run"},{char:"止",romaji:"shi / to",meaning:"stop"},
    {char:"泳",romaji:"ei / oyo",meaning:"swim"},{char:"飛",romaji:"hi / to",meaning:"fly"},
    {char:"乗",romaji:"jou / no",meaning:"ride"},{char:"降",romaji:"kou / o",meaning:"descend"},
    {char:"返",romaji:"hen / kae",meaning:"return · give back"},{char:"送",romaji:"sou / oku",meaning:"send"},
    {char:"受",romaji:"ju / u",meaning:"receive"},{char:"渡",romaji:"to / wata",meaning:"cross · hand over"},
    {char:"使",romaji:"shi / tsuka",meaning:"use"},{char:"働",romaji:"dou / hatara",meaning:"work"},
    {char:"作",romaji:"saku / tsuku",meaning:"make"},{char:"切",romaji:"setsu / ki",meaning:"cut"},
    {char:"集",romaji:"shuu / atsu",meaning:"gather"},{char:"別",romaji:"betsu / waka",meaning:"separate"},
    {char:"特",romaji:"toku",meaning:"special"},{char:"急",romaji:"kyuu / iso",meaning:"hurry · urgent"},
    {char:"旅",romaji:"ryo / tabi",meaning:"travel"},{char:"館",romaji:"kan",meaning:"building · hall"},
    {char:"店",romaji:"ten / mise",meaning:"shop"},{char:"所",romaji:"sho / tokoro",meaning:"place"},
    {char:"病",romaji:"byou / yamai",meaning:"illness"},{char:"院",romaji:"in",meaning:"institution"},
    {char:"医",romaji:"i",meaning:"medicine · doctor"},{char:"者",romaji:"sha / mono",meaning:"person (suffix)"},
    {char:"死",romaji:"shi",meaning:"death"},{char:"活",romaji:"katsu",meaning:"life · activity"},
    {char:"力",romaji:"ryoku / chikara",meaning:"power · strength"},{char:"元",romaji:"gen / moto",meaning:"origin"},
    {char:"自",romaji:"ji / mizuka",meaning:"self"},{char:"体",romaji:"tai / karada",meaning:"body"},
    {char:"心",romaji:"shin / kokoro",meaning:"heart · mind"},{char:"動",romaji:"dou / ugo",meaning:"move"},
    {char:"顔",romaji:"gan / kao",meaning:"face"},{char:"頭",romaji:"tou / atama",meaning:"head"},
    {char:"紙",romaji:"shi / kami",meaning:"paper"},{char:"絵",romaji:"kai / e",meaning:"picture"},
    {char:"歌",romaji:"ka / uta",meaning:"song"},{char:"楽",romaji:"raku / tano",meaning:"comfortable · music"},
    {char:"習",romaji:"shuu / nara",meaning:"learn · practice"},{char:"教",romaji:"kyou / oshi",meaning:"teach"},
    {char:"育",romaji:"iku / soda",meaning:"raise · rear"},{char:"物",romaji:"butsu / mono",meaning:"thing"},
    {char:"事",romaji:"ji / koto",meaning:"matter · thing"},{char:"仕",romaji:"shi / tsuka",meaning:"serve"},
    {char:"業",romaji:"gyou",meaning:"business · work"},{char:"場",romaji:"jou / ba",meaning:"place"},
    {char:"代",romaji:"dai / ka",meaning:"substitute · era"},{char:"品",romaji:"hin / shina",meaning:"goods"},
    {char:"員",romaji:"in",meaning:"member"},{char:"研",romaji:"ken / to",meaning:"polish · study"},
    {char:"究",romaji:"kyuu / kiwa",meaning:"research"},{char:"理",romaji:"ri",meaning:"reason · logic"},
    {char:"科",romaji:"ka",meaning:"subject (academic)"},{char:"門",romaji:"mon / kado",meaning:"gate"},
    {char:"家",romaji:"ka / ie",meaning:"house · family"},{char:"族",romaji:"zoku",meaning:"family · clan"},
    {char:"妹",romaji:"mai / imouto",meaning:"younger sister"},{char:"兄",romaji:"kei / ani",meaning:"older brother"},
    {char:"姉",romaji:"shi / ane",meaning:"older sister"},{char:"弟",romaji:"tei / otouto",meaning:"younger brother"},
    {char:"親",romaji:"shin / oya",meaning:"parent · close"},{char:"近",romaji:"kin / chika",meaning:"near"},
  ],
  N3: [
    {char:"遠",romaji:"en / tou",meaning:"far"},{char:"広",romaji:"kou / hiro",meaning:"wide"},
    {char:"重",romaji:"juu / omo",meaning:"heavy"},{char:"軽",romaji:"kei / karu",meaning:"light (weight)"},
    {char:"弱",romaji:"jaku / yowa",meaning:"weak"},{char:"強",romaji:"kyou / tsuyo",meaning:"strong"},
    {char:"意",romaji:"i",meaning:"intention · meaning"},{char:"味",romaji:"mi / aji",meaning:"taste · meaning"},
    {char:"感",romaji:"kan",meaning:"feeling · emotion"},{char:"情",romaji:"jou / nasake",meaning:"emotion"},
    {char:"想",romaji:"sou",meaning:"thought · idea"},{char:"考",romaji:"kou / kanga",meaning:"think"},
    {char:"信",romaji:"shin",meaning:"trust · believe"},{char:"念",romaji:"nen",meaning:"thought · concept"},
    {char:"覚",romaji:"kaku / oboe",meaning:"remember · sense"},{char:"験",romaji:"ken",meaning:"test · experience"},
    {char:"試",romaji:"shi / kokoro",meaning:"try · test"},{char:"調",romaji:"chou / shira",meaning:"investigate · tune"},
    {char:"査",romaji:"sa",meaning:"investigate"},{char:"報",romaji:"hou",meaning:"report · news"},
    {char:"告",romaji:"koku / tsu",meaning:"announce"},{char:"説",romaji:"setsu / to",meaning:"explain · theory"},
    {char:"明",romaji:"mei / aka",meaning:"bright · clear"},{char:"暗",romaji:"an / kura",meaning:"dark"},
    {char:"確",romaji:"kaku / tashi",meaning:"certain"},{char:"実",romaji:"jitsu / mi",meaning:"truth · reality"},
    {char:"真",romaji:"shin / ma",meaning:"true · real"},{char:"正",romaji:"sei / tada",meaning:"correct"},
    {char:"誤",romaji:"go / ayama",meaning:"mistake"},{char:"失",romaji:"shitsu / ushi",meaning:"lose"},
    {char:"得",romaji:"toku / e",meaning:"gain · profit"},{char:"益",romaji:"eki",meaning:"benefit"},
    {char:"損",romaji:"son / soko",meaning:"loss · damage"},{char:"利",romaji:"ri",meaning:"benefit · advantage"},
    {char:"害",romaji:"gai",meaning:"harm"},{char:"危",romaji:"ki / abu",meaning:"dangerous"},
    {char:"険",romaji:"ken",meaning:"steep · risk"},{char:"全",romaji:"zen / matta",meaning:"all · complete"},
    {char:"完",romaji:"kan",meaning:"complete"},{char:"成",romaji:"sei / na",meaning:"become · achieve"},
    {char:"功",romaji:"kou",meaning:"success"},{char:"果",romaji:"ka / ha",meaning:"result · fruit"},
    {char:"効",romaji:"kou / ki",meaning:"effect"},{char:"能",romaji:"nou",meaning:"ability"},
    {char:"権",romaji:"ken",meaning:"authority · right"},{char:"責",romaji:"seki / se",meaning:"responsibility"},
    {char:"任",romaji:"nin / maka",meaning:"duty · entrust"},{char:"義",romaji:"gi",meaning:"righteousness · meaning"},
    {char:"務",romaji:"mu / tsuto",meaning:"duty · task"},{char:"則",romaji:"soku",meaning:"rule"},
    {char:"規",romaji:"ki",meaning:"regulation"},{char:"制",romaji:"sei",meaning:"system · control"},
    {char:"度",romaji:"do / tabi",meaning:"degree · times"},{char:"法",romaji:"hou",meaning:"law · method"},
    {char:"律",romaji:"ritsu",meaning:"law · rhythm"},{char:"政",romaji:"sei / matsurigoto",meaning:"politics"},
    {char:"治",romaji:"ji / osa",meaning:"govern · cure"},{char:"経",romaji:"kei / he",meaning:"sutra · pass through"},
    {char:"営",romaji:"ei / itona",meaning:"manage · operate"},{char:"産",romaji:"san / u",meaning:"produce · give birth"},
    {char:"資",romaji:"shi",meaning:"resources · capital"},{char:"財",romaji:"zai",meaning:"wealth · property"},
    {char:"費",romaji:"hi / tsui",meaning:"expense · cost"},{char:"価",romaji:"ka / atai",meaning:"value · price"},
    {char:"値",romaji:"chi / ne",meaning:"value · price"},{char:"額",romaji:"gaku / hitai",meaning:"amount · forehead"},
    {char:"率",romaji:"ritsu / hiki",meaning:"rate · ratio"},{char:"増",romaji:"zou / fu",meaning:"increase"},
    {char:"減",romaji:"gen / he",meaning:"decrease"},{char:"変",romaji:"hen / ka",meaning:"change"},
  ],
  N2: [
    {char:"化",romaji:"ka / ba",meaning:"change · transform"},{char:"移",romaji:"i / utsu",meaning:"move · shift"},
    {char:"転",romaji:"ten / koro",meaning:"turn · roll"},{char:"換",romaji:"kan / ka",meaning:"exchange"},
    {char:"比",romaji:"hi / kura",meaning:"compare"},{char:"較",romaji:"kaku",meaning:"compare (in 比較)"},
    {char:"似",romaji:"ji / ni",meaning:"resemble"},{char:"異",romaji:"i / koto",meaning:"different"},
    {char:"同",romaji:"dou / ona",meaning:"same"},{char:"済",romaji:"sai / su",meaning:"finish · economy"},
    {char:"緊",romaji:"kin",meaning:"tight · urgent"},{char:"張",romaji:"chou / ha",meaning:"stretch · tension"},
    {char:"維",romaji:"i",meaning:"fiber · maintain"},{char:"拡",romaji:"kaku / hiro",meaning:"expand"},
    {char:"縮",romaji:"shuku / chiji",meaning:"shrink"},{char:"展",romaji:"ten",meaning:"exhibit · expand"},
    {char:"延",romaji:"en / no",meaning:"extend · postpone"},{char:"継",romaji:"kei / tsu",meaning:"inherit · continue"},
    {char:"承",romaji:"shou / uketamawa",meaning:"accept · inherit"},{char:"認",romaji:"nin / mito",meaning:"recognize · approve"},
    {char:"否",romaji:"hi / ina",meaning:"deny · no"},{char:"拒",romaji:"kyo / koba",meaning:"refuse"},
    {char:"絶",romaji:"zetsu / ta",meaning:"sever · absolute"},{char:"肯",romaji:"kou",meaning:"affirm"},
    {char:"定",romaji:"tei / sada",meaning:"decide · fixed"},{char:"含",romaji:"gan / fuku",meaning:"include"},
    {char:"除",romaji:"jo / nozo",meaning:"exclude · remove"},{char:"排",romaji:"hai",meaning:"exclude · expel"},
    {char:"抜",romaji:"batsu / nu",meaning:"pull out · extract"},{char:"省",romaji:"shou / habu",meaning:"omit · ministry"},
    {char:"略",romaji:"ryaku",meaning:"abbreviate · strategy"},{char:"簡",romaji:"kan",meaning:"simple"},
    {char:"単",romaji:"tan",meaning:"single · simple"},{char:"純",romaji:"jun",meaning:"pure"},
    {char:"複",romaji:"fuku",meaning:"duplicate · multiple"},{char:"雑",romaji:"zatsu",meaning:"miscellaneous"},
    {char:"混",romaji:"kon / ma",meaning:"mix"},{char:"合",romaji:"gou / a",meaning:"fit · combine"},
    {char:"適",romaji:"teki",meaning:"suitable"},{char:"当",romaji:"tou / a",meaning:"hit · appropriate"},
    {char:"範",romaji:"han",meaning:"model · scope"},{char:"囲",romaji:"i / kako",meaning:"enclose · surround"},
    {char:"限",romaji:"gen / kagi",meaning:"limit"},{char:"界",romaji:"kai",meaning:"boundary · world"},
    {char:"域",romaji:"iki",meaning:"region · area"},{char:"層",romaji:"sou",meaning:"layer · stratum"},
    {char:"階",romaji:"kai",meaning:"floor · stage"},{char:"段",romaji:"dan",meaning:"step · stage"},
    {char:"程",romaji:"tei / hodo",meaning:"extent · degree"},{char:"準",romaji:"jun",meaning:"standard · semi"},
    {char:"基",romaji:"ki / moto",meaning:"base · foundation"},{char:"構",romaji:"kou / kama",meaning:"structure · build"},
    {char:"造",romaji:"zou / tsuku",meaning:"construct"},{char:"築",romaji:"chiku / kizu",meaning:"build"},
    {char:"建",romaji:"ken / ta",meaning:"build · construct"},{char:"設",romaji:"setsu / mou",meaning:"establish"},
    {char:"備",romaji:"bi / sona",meaning:"prepare · equip"},{char:"装",romaji:"sou / yoso",meaning:"equip · pretend"},
    {char:"策",romaji:"saku",meaning:"policy · plan"},{char:"提",romaji:"tei / sa",meaning:"present · offer"},
  ],
  N1: [
    {char:"供",romaji:"kyou / tomo",meaning:"provide · companion"},{char:"給",romaji:"kyuu",meaning:"supply"},
    {char:"納",romaji:"nou / osa",meaning:"pay · deliver"},{char:"収",romaji:"shuu / osa",meaning:"collect · income"},
    {char:"憂",romaji:"yuu / u",meaning:"melancholy"},{char:"鬱",romaji:"utsu",meaning:"depression · gloomy"},
    {char:"獣",romaji:"juu / kemono",meaning:"beast"},{char:"矛",romaji:"mu / hoko",meaning:"spear"},
    {char:"盾",romaji:"jun / tate",meaning:"shield"},{char:"憲",romaji:"ken",meaning:"constitution"},
    {char:"議",romaji:"gi",meaning:"deliberation · council"},{char:"詞",romaji:"shi",meaning:"word · part of speech"},
    {char:"辞",romaji:"ji / ya",meaning:"word · resign"},{char:"彙",romaji:"i",meaning:"vocabulary (in 語彙)"},
    {char:"慨",romaji:"gai",meaning:"sigh · lament"},{char:"憤",romaji:"fun / ikidoo",meaning:"indignation"},
    {char:"怒",romaji:"do / ikari",meaning:"anger"},{char:"慎",romaji:"shin / tsutsushi",meaning:"prudent · discreet"},
    {char:"慮",romaji:"ryo",meaning:"consider"},{char:"顧",romaji:"ko / kaeri",meaning:"look back · consider"},
    {char:"慰",romaji:"i / nagusa",meaning:"console"},{char:"励",romaji:"rei / hage",meaning:"encourage"},
    {char:"奨",romaji:"shou",meaning:"encourage · prize"},{char:"賞",romaji:"shou",meaning:"prize · praise"},
    {char:"罰",romaji:"batsu",meaning:"punishment"},{char:"裁",romaji:"sai / ta",meaning:"judge · cut (cloth)"},
    {char:"判",romaji:"han",meaning:"judge · seal"},{char:"審",romaji:"shin",meaning:"examine · judge"},
    {char:"訴",romaji:"so / utta",meaning:"sue · appeal"},{char:"弁",romaji:"ben",meaning:"valve · dialect · speech"},
    {char:"護",romaji:"go",meaning:"protect"},{char:"擁",romaji:"you",meaning:"embrace · support"},
    {char:"盟",romaji:"mei",meaning:"alliance"},{char:"締",romaji:"tei / shi",meaning:"tie · conclude (contract)"},
    {char:"契",romaji:"kei / chigi",meaning:"promise · contract"},{char:"約",romaji:"yaku",meaning:"promise · approximately"},
    {char:"紛",romaji:"fun / magi",meaning:"confuse · dispute"},{char:"争",romaji:"sou / araso",meaning:"dispute · contend"},
    {char:"闘",romaji:"tou / tataka",meaning:"fight · struggle"},{char:"克",romaji:"koku",meaning:"overcome"},
    {char:"服",romaji:"fuku",meaning:"clothes · obey"},{char:"従",romaji:"juu / shitaga",meaning:"obey · follow"},
    {char:"逆",romaji:"gyaku / saka",meaning:"reverse · opposite"},{char:"抗",romaji:"kou",meaning:"resist"},
    {char:"迫",romaji:"haku / sema",meaning:"press · urge"},{char:"脅",romaji:"kyou / odo",meaning:"threaten"},
    {char:"威",romaji:"i",meaning:"authority · dignity"},{char:"圧",romaji:"atsu",meaning:"pressure"},
    {char:"搾",romaji:"saku / shibo",meaning:"squeeze · exploit"},{char:"摂",romaji:"setsu",meaning:"take in (intake)"},
    {char:"吸",romaji:"kyuu / su",meaning:"inhale · absorb"},{char:"循",romaji:"jun",meaning:"circulate (in 循環)"},
    {char:"環",romaji:"kan",meaning:"ring · surround"},{char:"還",romaji:"kan / kae",meaning:"return (in 還元)"},
    {char:"郷",romaji:"kyou / gou",meaning:"hometown"},{char:"影",romaji:"ei / kage",meaning:"shadow"},
    {char:"響",romaji:"kyou / hibi",meaning:"echo · influence"},
  ],
};
const JLPT_LEVELS = ["N5","N4","N3","N2","N1"];
const JLPT_DESC = { N5:"Absolute beginner", N4:"Basic conversational", N3:"Intermediate", N2:"Upper intermediate", N1:"Near-native" };

// ===================== HELPERS =====================
const speak = (text) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ja-JP"; u.rate = 0.8; u.pitch = 1;
  window.speechSynthesis.speak(u);
};

const callAPI = async (system, userMsg) => {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, message: userMsg }),
  });
  const data = await res.json();
  const text = data.content?.find(b => b.type === "text")?.text || "{}";
  return text.replace(/```json|```/g, "").trim();
};

// ===================== CHAR CARD =====================
const CharCard = ({ item, type, t }) => (
  <div
    style={{
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: t.cardRadius,
      padding: type === "kanji" ? "12px 8px" : "10px 6px",
      textAlign: "center",
      boxShadow: t.shadow,
      position: "relative",
    }}>
    <div style={{ fontSize: type === "kanji" ? "28px" : "26px", fontFamily: t.fontJP, color: t.text, lineHeight: 1, marginBottom: "5px" }}>
      {item.char}
    </div>
    <div style={{ fontSize: "11px", fontFamily: t.fontMono, color: t.accent, letterSpacing: "0.02em", fontWeight: "700" }}>
      {item.romaji}
    </div>
    {type === "kanji" && (
      <div style={{ fontSize: "10px", color: t.textMuted, marginTop: "3px", fontFamily: t.fontBody, lineHeight: 1.3 }}>
        {item.meaning}
      </div>
    )}
    <button onClick={() => speak(item.char)}
      style={{
        position: "absolute", top: "4px", right: "4px",
        background: "none", border: "none", cursor: "pointer",
        fontSize: "11px", opacity: 0.45, padding: "2px"
      }}>🔊</button>
  </div>
);

// ===================== CHAT MESSAGE =====================
// ===================== THEME-AWARE CHAT CONFIG =====================
// Each vibe gets its own tone, example flavor, and a themed "note" field so
// the same chat experience feels genuinely different depending on the vibe selected.
const THEME_CHAT_CONFIG = {
  minimalist: {
    tone: "Be concise, precise, and clean — no fluff, prioritize clarity above all.",
    exampleGuidance: "Use simple, neutral, everyday example sentences (daily routine, work, basic conversation).",
    noteLabel: "USAGE TIP", noteIcon: "—",
    noteInstruction: "one crisp, practical usage tip or nuance about the word — no decoration",
  },
  kawaii: {
    tone: "Be sweet, warm, and playful — like a cheerful, encouraging friend.",
    exampleGuidance: "Use cute, everyday examples involving friends, pets, sweets, or small daily-life moments.",
    noteLabel: "CUTE FACT", noteIcon: "🌸",
    noteInstruction: "one sweet or fun piece of trivia about the word",
  },
  anime: {
    tone: "Be energetic, hype, and casual — like an excited otaku friend hyping up the learner.",
    exampleGuidance: "Use examples connected to anime/manga where natural (friendship, school life, battles, fantasy worlds).",
    noteLabel: "ANIME CONNECTION", noteIcon: "📺",
    noteInstruction: "an anime/manga where this word or concept appears, or a fun otaku-relevant fact if no direct connection exists",
  },
  cultural: {
    tone: "Be respectful, thoughtful, and rich with cultural/historical context — like a knowledgeable guide to traditional Japan.",
    exampleGuidance: "Use examples rooted in traditional customs, history, seasons, festivals, or classical settings where relevant.",
    noteLabel: "CULTURAL NOTE", noteIcon: "⛩️",
    noteInstruction: "a traditional or historical cultural insight connected to the word",
  },
  ghibli: {
    tone: "Be gentle, wonder-filled, and a little nostalgic — like narrating a quiet scene from a Studio Ghibli film.",
    exampleGuidance: "Use examples evoking nature, countryside life, small magical moments, journeys, or everyday wonder (wind, forests, trains, food, seasons).",
    noteLabel: "A QUIET NOTE", noteIcon: "🌿",
    noteInstruction: "a gentle, poetic observation connecting the word to nature or a small everyday moment — the kind of detail you'd notice in a Ghibli film",
  },
};

const buildChatSystem = (vibe) => {
  const cfg = THEME_CHAT_CONFIG[vibe] || THEME_CHAT_CONFIG.minimalist;
  return `You are Sensei, a Japanese language tutor. ${cfg.tone} ${cfg.exampleGuidance}

When given a word or phrase, return ONLY raw JSON (no markdown, no code fences):
{"word":"Japanese form","reading":"hiragana reading","romaji":"romaji","english":"English meaning","partOfSpeech":"noun/verb/etc","jlptLevel":"N5/N4/N3/N2/N1 or null","explanation":"2-3 sentence explanation written in the tone described above","basicSentence":{"ja":"...","romaji":"...","en":"..."},"intermediateSentence":{"ja":"...","romaji":"...","en":"..."},"advancedSentence":{"ja":"...","romaji":"...","en":"..."},"vibeNote":"${cfg.noteInstruction}"}

For general conversation/questions not about a specific word, return:
{"type":"message","text":"reply in English matching the tone above","japanese":"relevant Japanese if applicable","romaji":"romaji if included"}`;
};

const THEME_SUGGESTIONS = {
  minimalist: ["時間","work","ありがとう","食べる","今日は","水"],
  kawaii: ["かわいい","ぬいぐるみ","推し","友達","スイーツ","好き"],
  anime: ["魔法","nakama","ツンデレ","強い","senpai","必殺技"],
  cultural: ["茶道","侍","花見","季節","おもてなし","祭り"],
  ghibli: ["風","森","旅","ふるさと","雲","魔法"],
};

const ChatMsg = ({ msg, t, vibe }) => {
  const cfg = THEME_CHAT_CONFIG[vibe] || THEME_CHAT_CONFIG.minimalist;

  if (msg.role === "user") return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px" }}>
      <div style={{
        background: t.accent, color: "#fff",
        padding: "10px 16px", borderRadius: `${t.cardRadius} ${t.cardRadius} 4px ${t.cardRadius}`,
        maxWidth: "65%", fontSize: "14px", fontFamily: t.fontJP,
        boxShadow: t.shadow, lineHeight: 1.5
      }}>{msg.text}</div>
    </div>
  );

  const d = msg.data;
  if (!d) return null;

  if (d.type === "message") return (
    <div style={{ display: "flex", marginBottom: "16px", gap: "10px", alignItems: "flex-start" }}>
      <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>先</div>
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: `4px ${t.cardRadius} ${t.cardRadius} ${t.cardRadius}`, padding: "14px 16px", maxWidth: "80%", boxShadow: t.shadow }}>
        <p style={{ margin: "0 0 8px", fontSize: "14px", color: t.text, fontFamily: t.fontBody, lineHeight: 1.65 }}>{d.text}</p>
        {d.japanese && <div style={{ fontSize: "16px", color: t.accent, fontFamily: t.fontJP, borderTop: `1px solid ${t.border}`, paddingTop: "8px", marginTop: "4px" }}>{d.japanese}</div>}
        {d.romaji && <div style={{ fontSize: "11px", color: t.textMuted, fontFamily: t.fontMono, marginTop: "3px" }}>{d.romaji}</div>}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", marginBottom: "20px", gap: "10px", alignItems: "flex-start" }}>
      <div onClick={() => speak(d.word)} style={{ width: "30px", height: "30px", borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0, cursor: "pointer" }}>先</div>
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: `4px ${t.cardRadius} ${t.cardRadius} ${t.cardRadius}`, padding: "16px", maxWidth: "88%", width: "100%", boxShadow: t.shadow }}>
        {/* Word header */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", flexWrap: "wrap", marginBottom: "10px" }}>
          <span style={{ fontSize: "38px", fontFamily: t.fontJP, color: t.text, lineHeight: 1, cursor: "pointer" }} onClick={() => speak(d.word)}>{d.word}</span>
          <div>
            <div style={{ fontSize: "14px", color: t.textMuted, fontFamily: t.fontJP }}>{d.reading}</div>
            <div style={{ fontSize: "12px", color: t.accent, fontFamily: t.fontMono }}>{d.romaji}</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
            {d.jlptLevel && <span style={{ fontSize: "10px", background: t.accentSoft, color: t.accent, border: `1px solid ${t.border}`, padding: "2px 8px", borderRadius: "999px", fontFamily: t.fontMono }}>{d.jlptLevel}</span>}
            <button onClick={() => speak(d.word)} style={{ background: "none", border: `1px solid ${t.border}`, borderRadius: "8px", padding: "4px 8px", cursor: "pointer", fontSize: "12px", color: t.textMuted }}>🔊</button>
          </div>
        </div>
        <div style={{ fontSize: "17px", fontWeight: "700", color: t.text, fontFamily: t.fontDisplay, marginBottom: "8px" }}>{d.english}</div>
        <p style={{ fontSize: "13px", color: t.textMuted, lineHeight: 1.7, margin: "0 0 14px", fontFamily: t.fontBody }}>{d.explanation}</p>
        {/* Sentences */}
        {[{label:"BASIC", key:"basicSentence"},{label:"INTERMEDIATE", key:"intermediateSentence"},{label:"ADVANCED", key:"advancedSentence"}].map(({label,key}) => d[key] && (
          <div key={key} style={{ marginBottom: "10px", borderLeft: `2px solid ${t.accent}`, paddingLeft: "12px" }}>
            <div style={{ fontSize: "10px", color: t.accent, fontFamily: t.fontMono, letterSpacing: "0.08em", marginBottom: "4px" }}>{label}</div>
            <div style={{ fontSize: "15px", color: t.text, fontFamily: t.fontJP, marginBottom: "2px", cursor: "pointer" }} onClick={() => speak(d[key].ja)}>{d[key].ja} <span style={{ fontSize: "11px", opacity: 0.4 }}>🔊</span></div>
            <div style={{ fontSize: "11px", color: t.textMuted, fontFamily: t.fontMono }}>{d[key].romaji}</div>
            <div style={{ fontSize: "12px", color: t.textMuted, fontStyle: "italic", fontFamily: t.fontBody }}>{d[key].en}</div>
          </div>
        ))}
        {/* Theme-curated note */}
        {d.vibeNote && (
          <div style={{ marginTop: "4px", display: "flex", gap: "8px", alignItems: "flex-start", background: t.accentSoft, borderRadius: t.cardRadius, padding: "10px 12px" }}>
            <span style={{ fontSize: "14px", flexShrink: 0 }}>{cfg.noteIcon}</span>
            <div>
              <div style={{ fontSize: "10px", color: t.accent, fontFamily: t.fontMono, letterSpacing: "0.08em", marginBottom: "3px" }}>{cfg.noteLabel}</div>
              <p style={{ margin: 0, fontSize: "12px", color: t.textMuted, fontFamily: t.fontBody, lineHeight: 1.6 }}>{d.vibeNote}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ===================== CHAT PAGE =====================
const ChatPage = ({ t, vibe }) => {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  const suggestions = THEME_SUGGESTIONS[vibe] || THEME_SUGGESTIONS.minimalist;

  const send = async () => {
    const text = input.trim(); if (!text || loading) return;
    setInput(""); setMsgs(p => [...p, { role: "user", text }]); setLoading(true);
    try {
      const raw = await callAPI(buildChatSystem(vibe), text);
      const data = JSON.parse(raw);
      setMsgs(p => [...p, { role: "bot", data }]);
    } catch { setMsgs(p => [...p, { role: "bot", data: { type: "message", text: "Sorry, something went wrong. Please try again!" } }]); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 0" }}>
        {msgs.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 16px" }}>
            <div style={{ fontSize: "52px", fontFamily: t.fontJP, color: t.text, opacity: 0.2, marginBottom: "12px" }}>日本語</div>
            <p style={{ fontSize: "14px", color: t.textMuted, fontFamily: t.fontBody, marginBottom: "24px" }}>Ask about any word in romaji, hiragana, katakana, kanji, or English</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
              {suggestions.map(s => (
                <button key={s} onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  style={{ background: t.surface, border: `1px solid ${t.border}`, color: t.textMuted, padding: "6px 14px", borderRadius: "999px", cursor: "pointer", fontSize: "13px", fontFamily: t.fontJP }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {msgs.map((m, i) => <ChatMsg key={i} msg={m} t={t} vibe={vibe} />)}
        {loading && (
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>先</div>
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: `4px ${t.cardRadius} ${t.cardRadius} ${t.cardRadius}`, padding: "14px 18px", display: "flex", gap: "6px", alignItems: "center" }}>
              {[0,1,2].map(i => <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: t.accent, animation: "bounce 1.1s infinite", animationDelay: `${i*0.18}s` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} style={{ height: "8px" }} />
      </div>
      {/* Input */}
      <div style={{ padding: "12px 16px 16px", borderTop: `1px solid ${t.border}`, background: t.navBg, backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: t.cardRadius, padding: "10px 10px 10px 14px" }}>
          <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Type any word or question..." rows={1}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: t.text, fontSize: "14px", fontFamily: t.fontJP, lineHeight: 1.5, resize: "none", maxHeight: "96px", overflowY: "auto" }} />
          <button onClick={send} disabled={!input.trim() || loading}
            style={{ width: "36px", height: "36px", borderRadius: "8px", border: "none", background: input.trim() && !loading ? t.accent : t.border, color: "#fff", cursor: input.trim() && !loading ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// ===================== CHARACTERS PAGE =====================
const ScriptSectionHeader = ({ label, sub, color, t }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: "8px", margin: "18px 0 10px" }}>
    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, flexShrink: 0 }} />
    <span style={{ fontSize: "13px", fontWeight: "700", color: t.text, fontFamily: t.fontDisplay }}>{label}</span>
    <span style={{ fontSize: "11px", color: t.textMuted, fontFamily: t.fontBody }}>{sub}</span>
  </div>
);

const KanaRowGroup = ({ rows, type, t }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
    {rows.map(row => (
      <div key={row.label} style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "8px" }}>
        {row.chars.map((item, i) => item ? <CharCard key={i} item={item} type={type} t={t} /> : <div key={i} />)}
      </div>
    ))}
  </div>
);

const CharactersPage = ({ t }) => {
  const [tab, setTab] = useState("hiragana");
  const [expanded, setExpanded] = useState({ N5: true, N4: false, N3: false, N2: false, N1: false });
  const tabs = [{ id: "hiragana", label: "Hiragana ひ" }, { id: "katakana", label: "Katakana カ" }, { id: "kanji", label: "Kanji 漢" }];
  const toggleLevel = (lvl) => setExpanded(p => ({ ...p, [lvl]: !p[lvl] }));

  return (
    <div style={{ flex: 1, overflowY: "auto", background: t.bg }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: "0", borderBottom: `1px solid ${t.border}`, background: t.navBg, backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 5 }}>
        {tabs.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)}
            style={{ flex: 1, padding: "14px 4px", background: "none", border: "none", borderBottom: tab === tb.id ? `2px solid ${t.accent}` : "2px solid transparent", color: tab === tb.id ? t.accent : t.textMuted, fontSize: "12px", fontFamily: t.fontJP, cursor: "pointer", fontWeight: tab === tb.id ? "700" : "400", transition: "all 0.15s" }}>
            {tb.label}
          </button>
        ))}
      </div>
      <div style={{ padding: "16px" }}>
        <p style={{ fontSize: "12px", color: t.textMuted, fontFamily: t.fontBody, marginBottom: "10px", textAlign: "center" }}>
          Romaji shown under each character · 🔊 to hear pronunciation
        </p>

        {tab === "hiragana" && (
          <>
            <ScriptSectionHeader label="Base Sounds" sub="清音 · seion" color={t.accent} t={t} />
            <KanaRowGroup rows={HIRAGANA_ROWS} type="hiragana" t={t} />
            <ScriptSectionHeader label="Voiced Sounds" sub="濁点 · dakuten ( ゛)" color={t.accentAlt} t={t} />
            <KanaRowGroup rows={HIRAGANA_DAKUTEN_ROWS} type="hiragana" t={t} />
            <ScriptSectionHeader label="Semi-voiced Sounds" sub="半濁点 · handakuten ( ゜)" color={t.warn} t={t} />
            <KanaRowGroup rows={HIRAGANA_HANDAKUTEN_ROWS} type="hiragana" t={t} />
          </>
        )}

        {tab === "katakana" && (
          <>
            <ScriptSectionHeader label="Base Sounds" sub="清音 · seion" color={t.accent} t={t} />
            <KanaRowGroup rows={KATAKANA_ROWS} type="katakana" t={t} />
            <ScriptSectionHeader label="Voiced Sounds" sub="濁点 · dakuten ( ゛)" color={t.accentAlt} t={t} />
            <KanaRowGroup rows={KATAKANA_DAKUTEN_ROWS} type="katakana" t={t} />
            <ScriptSectionHeader label="Semi-voiced Sounds" sub="半濁点 · handakuten ( ゜)" color={t.warn} t={t} />
            <KanaRowGroup rows={KATAKANA_HANDAKUTEN_ROWS} type="katakana" t={t} />
          </>
        )}

        {tab === "kanji" && JLPT_LEVELS.map(lvl => {
          const list = KANJI_BY_LEVEL[lvl];
          const isOpen = expanded[lvl];
          const color = LEVEL_COLOR[lvl];
          return (
            <div key={lvl} style={{ marginBottom: "12px", border: `1px solid ${t.border}`, borderRadius: t.cardRadius, overflow: "hidden" }}>
              <button onClick={() => toggleLevel(lvl)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", background: t.surface, border: "none", cursor: "pointer" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, flexShrink: 0 }} />
                <span style={{ fontSize: "14px", fontWeight: "700", color: t.text, fontFamily: t.fontDisplay }}>{lvl}</span>
                <span style={{ fontSize: "11px", color: t.textMuted, fontFamily: t.fontBody }}>{JLPT_DESC[lvl]} · {list.length} kanji</span>
                <span style={{ marginLeft: "auto", fontSize: "12px", color: t.textMuted, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
              </button>
              {isOpen && (
                <div style={{ padding: "12px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px", background: t.bg }}>
                  {list.map((item, i) => <CharCard key={i} item={item} type="kanji" t={t} />)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ===================== TEST PAGE =====================
const TEST_SYSTEM = (level) => `You are a JLPT examiner. Generate a ${level} practice test with exactly 5 multiple-choice questions. Return ONLY raw JSON:
{"level":"${level}","questions":[{"id":1,"question":"Question text","questionJP":"Question in Japanese if applicable","options":["A","B","C","D"],"correct":0,"explanation":"Why this is correct"}]}
Make questions appropriate for ${level} difficulty. Vary: vocabulary, grammar, reading comprehension, kanji.`;

const PAST_PAPER_SYSTEM = (level, year) => `You are a JLPT exam writer creating an AI-generated practice paper inspired by the difficulty, structure, and topic trends typical of the ${year} JLPT season for level ${level}. This is original practice material, not a reproduction of any real copyrighted exam. Generate exactly 10 multiple-choice questions covering a realistic mix of vocabulary, grammar, kanji recognition, and short reading comprehension, matched to authentic ${level} difficulty and the kind of themes/vocabulary common around ${year}. Return ONLY raw JSON:
{"level":"${level}","year":"${year}","questions":[{"id":1,"question":"Question text in English instructions","questionJP":"Japanese question/passage if applicable","options":["A","B","C","D"],"correct":0,"explanation":"Why this is correct, in English"}]}`;

const YEARS = Array.from({ length: 10 }, (_, i) => 2025 - i); // last 10 years: 2016–2025

const HistoryPanel = ({ t, history, loading, onClear }) => {
  if (loading) return <div style={{ fontSize: "13px", color: t.textMuted, fontFamily: t.fontBody, padding: "20px 0" }}>Loading your history...</div>;

  if (!history.length) return (
    <div style={{ textAlign: "center", padding: "20px 16px", maxWidth: "320px" }}>
      <div style={{ fontSize: "32px", marginBottom: "10px", opacity: 0.4 }}>📊</div>
      <p style={{ fontSize: "13px", color: t.textMuted, fontFamily: t.fontBody, lineHeight: 1.6, margin: 0 }}>
        No tests taken yet. Complete a Quick Test or Past Paper to start tracking your progress here.
      </p>
    </div>
  );

  const total = history.length;
  const avg = Math.round(history.reduce((s, r) => s + r.pct, 0) / total);
  const best = Math.max(...history.map(r => r.pct));
  const recent = history.slice(-10);
  const maxH = 56;

  return (
    <div style={{ width: "100%", maxWidth: "360px" }}>
      {/* Stat row */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "18px" }}>
        {[{ label: "Tests", val: total }, { label: "Average", val: `${avg}%` }, { label: "Best", val: `${best}%` }].map(s => (
          <div key={s.label} style={{ flex: 1, background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.cardRadius, padding: "10px 6px", textAlign: "center", boxShadow: t.shadow }}>
            <div style={{ fontSize: "17px", fontWeight: "700", color: t.accent, fontFamily: t.fontDisplay }}>{s.val}</div>
            <div style={{ fontSize: "10px", color: t.textMuted, fontFamily: t.fontMono, letterSpacing: "0.05em", marginTop: "2px" }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Trend chart */}
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.cardRadius, padding: "14px 10px 8px", marginBottom: "16px", boxShadow: t.shadow }}>
        <div style={{ fontSize: "10px", color: t.textMuted, fontFamily: t.fontMono, letterSpacing: "0.08em", marginBottom: "8px" }}>LAST {recent.length} ATTEMPTS</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "5px", height: `${maxH + 18}px` }}>
          {recent.map((r, i) => {
            const h = Math.max(6, (r.pct / 100) * maxH);
            const color = r.pct >= 80 ? t.success : r.pct >= 60 ? t.warn : t.danger;
            return (
              <div key={r.id || i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                <div style={{ fontSize: "8px", color: t.textMuted, fontFamily: t.fontMono }}>{r.pct}</div>
                <div style={{ width: "100%", maxWidth: "20px", height: `${h}px`, background: color, borderRadius: "3px 3px 0 0" }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {[...history].reverse().map(r => {
          const color = r.pct >= 80 ? t.success : r.pct >= 60 ? t.warn : t.danger;
          return (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "10px", background: t.surface, border: `1px solid ${t.border}`, borderLeft: `3px solid ${color}`, borderRadius: t.cardRadius, padding: "10px 12px", boxShadow: t.shadow }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", color: t.text, fontFamily: t.fontBody, fontWeight: "600" }}>
                  {r.mode === "past" ? `${r.year} Past Paper` : "Quick Test"} · {r.level}
                </div>
                <div style={{ fontSize: "11px", color: t.textMuted, fontFamily: t.fontMono, marginTop: "2px" }}>
                  {new Date(r.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "15px", fontWeight: "700", color: t.text, fontFamily: t.fontDisplay }}>{r.score}/{r.total}</div>
                <div style={{ fontSize: "11px", color, fontFamily: t.fontMono }}>{r.pct}%</div>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={onClear} style={{ width: "100%", marginTop: "16px", padding: "10px", background: "none", border: `1px solid ${t.border}`, borderRadius: t.cardRadius, color: t.textMuted, fontSize: "12px", fontFamily: t.fontBody, cursor: "pointer" }}>
        Clear history
      </button>
    </div>
  );
};

const TestPage = ({ t }) => {
  const [mode, setMode] = useState("quick"); // quick | past | history
  const [level, setLevel] = useState("N5");
  const [year, setYear] = useState(2025);
  const [state, setState] = useState("idle"); // idle, loading, testing, done
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const savedRef = useRef(false);

  const STORAGE_KEY = "nihongo-sensei-test-history";

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = () => {
    setHistoryLoading(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      setHistory(Array.isArray(arr) ? arr : []);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const saveResult = (result) => {
    setHistory(prev => {
      const updated = [...prev, result];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save result:", e);
      }
      return updated;
    });
  };

  const clearHistory = () => {
    if (!window.confirm("Clear all test history? This cannot be undone.")) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHistory([]);
    } catch (e) { console.error("Failed to clear history:", e); }
  };

  useEffect(() => {
    if (state === "done" && !savedRef.current && questions.length) {
      savedRef.current = true;
      const correctCount = questions.filter(q => answers[q.id] === q.correct).length;
      const pct = Math.round((correctCount / questions.length) * 100);
      saveResult({
        id: Date.now(),
        date: new Date().toISOString(),
        mode, level, year: mode === "past" ? year : null,
        score: correctCount, total: questions.length, pct,
      });
    }
  }, [state]);

  const startTest = async () => {
    savedRef.current = false;
    setState("loading");
    try {
      const raw = mode === "quick"
        ? await callAPI(TEST_SYSTEM(level), `Generate a ${level} test`)
        : await callAPI(PAST_PAPER_SYSTEM(level, year), `Generate a ${year} ${level} practice paper`);
      const data = JSON.parse(raw);
      setQuestions(data.questions); setAnswers({}); setCurrent(0); setState("testing");
    } catch { setState("idle"); alert("Failed to generate test. Try again!"); }
  };

  const answer = (qId, idx) => {
    if (answers[qId] !== undefined) return;
    setAnswers(p => ({ ...p, [qId]: idx }));
    setTimeout(() => { if (current < questions.length - 1) setCurrent(c => c + 1); else setState("done"); }, 800);
  };

  const score = questions.filter(q => answers[q.id] === q.correct).length;

  if (state === "idle" || state === "loading") return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 24px 40px", background: t.bg }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
        <div style={{ fontSize: "44px", fontFamily: t.fontJP, color: t.text, opacity: 0.15 }}>試験</div>
        <h2 style={{ fontSize: "20px", fontFamily: t.fontDisplay, color: t.text, margin: 0, textAlign: "center" }}>JLPT Practice Test</h2>

        {/* Mode toggle */}
        <div style={{ display: "flex", gap: "6px", background: t.bgAlt, padding: "4px", borderRadius: t.cardRadius, border: `1px solid ${t.border}` }}>
          {[{ id: "quick", label: "Quick Test" }, { id: "past", label: "Past Papers" }, { id: "history", label: "History" }].map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              style={{ padding: "8px 14px", borderRadius: `calc(${t.cardRadius} - 2px)`, border: "none", background: mode === m.id ? t.surface : "transparent", color: mode === m.id ? t.accent : t.textMuted, fontFamily: t.fontBody, fontSize: "12px", fontWeight: "700", cursor: "pointer", boxShadow: mode === m.id ? t.shadow : "none", transition: "all 0.15s" }}>
              {m.label}
            </button>
          ))}
        </div>

        {mode === "history" ? (
          <HistoryPanel t={t} history={history} loading={historyLoading} onClear={clearHistory} />
        ) : (
          <>
        <p style={{ fontSize: "12px", color: t.textMuted, fontFamily: t.fontBody, textAlign: "center", margin: "0", lineHeight: 1.6, maxWidth: "320px" }}>
          {mode === "quick"
            ? "5 AI-generated questions tailored to your level"
            : "10-question AI-generated paper styled after a chosen year's JLPT difficulty and themes — original practice material, not a reproduction of any real exam"}
        </p>

        {/* Year selector (past mode only) */}
        {mode === "past" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "6px", width: "100%", maxWidth: "320px" }}>
            {YEARS.map(y => (
              <button key={y} onClick={() => setYear(y)}
                style={{ padding: "8px 0", borderRadius: t.cardRadius, border: `1px solid ${year === y ? t.accent : t.border}`, background: year === y ? t.accentSoft : t.surface, color: year === y ? t.accent : t.text, fontFamily: t.fontMono, fontSize: "12px", cursor: "pointer", fontWeight: year === y ? "700" : "400" }}>
                {y}
              </button>
            ))}
          </div>
        )}

        {/* Level selector */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
          {JLPT_LEVELS.map(l => (
            <button key={l} onClick={() => setLevel(l)}
              style={{ padding: "10px 20px", borderRadius: t.cardRadius, border: `1px solid ${level === l ? t.accent : t.border}`, background: level === l ? t.accentSoft : t.surface, color: level === l ? t.accent : t.text, fontFamily: t.fontMono, fontSize: "13px", cursor: "pointer", fontWeight: "700", transition: "all 0.15s" }}>
              {l}
              <div style={{ fontSize: "9px", color: level === l ? t.accent : t.textMuted, fontFamily: t.fontBody, fontWeight: "400", marginTop: "2px" }}>{JLPT_DESC[l]}</div>
            </button>
          ))}
        </div>

        <button onClick={startTest} disabled={state === "loading"}
          style={{ padding: "14px 40px", background: t.accent, color: "#fff", border: "none", borderRadius: t.cardRadius, fontSize: "15px", fontFamily: t.fontBody, fontWeight: "700", cursor: "pointer", boxShadow: t.shadowLg, opacity: state === "loading" ? 0.7 : 1 }}>
          {state === "loading" ? "Generating..." : mode === "quick" ? `Start ${level} Test →` : `Start ${year} ${level} Paper →`}
        </button>
          </>
        )}
      </div>
    </div>
  );

  if (state === "testing") {
    const q = questions[current];
    const answered = answers[q.id];
    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", background: t.bg }}>
        {/* Progress */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "12px", color: t.textMuted, fontFamily: t.fontMono }}>{mode === "past" ? `${year} ${level}` : level} · Question {current + 1} of {questions.length}</span>
            <span style={{ fontSize: "12px", color: t.accent, fontFamily: t.fontMono }}>{Math.round(((current) / questions.length) * 100)}%</span>
          </div>
          <div style={{ height: "4px", background: t.border, borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ width: `${((current) / questions.length) * 100}%`, height: "100%", background: t.accent, borderRadius: "2px", transition: "width 0.3s" }} />
          </div>
        </div>
        {/* Question */}
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.cardRadius, padding: "20px", marginBottom: "16px", boxShadow: t.shadow }}>
          <div style={{ fontSize: "15px", color: t.text, fontFamily: t.fontBody, lineHeight: 1.6, marginBottom: q.questionJP ? "8px" : "0" }}>{q.question}</div>
          {q.questionJP && <div style={{ fontSize: "18px", color: t.text, fontFamily: t.fontJP }}>{q.questionJP}</div>}
        </div>
        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {q.options.map((opt, i) => {
            const isSelected = answered === i;
            const isCorrect = i === q.correct;
            const showResult = answered !== undefined;
            let bg = t.surface, border = t.border, color = t.text;
            if (showResult && isCorrect) { bg = t.success + "20"; border = t.success; color = t.text; }
            else if (showResult && isSelected && !isCorrect) { bg = t.danger + "15"; border = t.danger; color = t.text; }
            return (
              <button key={i} onClick={() => answer(q.id, i)}
                style={{ background: bg, border: `1px solid ${border}`, borderRadius: t.cardRadius, padding: "14px 16px", textAlign: "left", cursor: showResult ? "default" : "pointer", color, fontSize: "14px", fontFamily: t.fontJP, lineHeight: 1.4, transition: "all 0.2s", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: isSelected || (showResult && isCorrect) ? (isCorrect ? t.success : t.danger) : t.border, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontFamily: t.fontMono, flexShrink: 0 }}>{["A","B","C","D"][i]}</span>
                {opt}
                {showResult && isCorrect && <span style={{ marginLeft: "auto", fontSize: "16px" }}>✓</span>}
                {showResult && isSelected && !isCorrect && <span style={{ marginLeft: "auto", fontSize: "16px" }}>✗</span>}
              </button>
            );
          })}
        </div>
        {answered !== undefined && (
          <div style={{ marginTop: "14px", background: t.accentSoft, border: `1px solid ${t.border}`, borderRadius: t.cardRadius, padding: "14px", fontSize: "13px", color: t.textMuted, fontFamily: t.fontBody, lineHeight: 1.6 }}>
            💡 {q.explanation}
          </div>
        )}
      </div>
    );
  }

  // Done
  const pct = Math.round((score / questions.length) * 100);
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px", background: t.bg }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ fontSize: "60px", marginBottom: "8px" }}>{pct >= 80 ? "🎉" : pct >= 60 ? "👍" : "📚"}</div>
        <h2 style={{ fontSize: "22px", fontFamily: t.fontDisplay, color: t.text, margin: "0 0 4px" }}>{score}/{questions.length} Correct</h2>
        <div style={{ fontSize: "13px", color: t.textMuted, fontFamily: t.fontBody }}>{pct >= 80 ? "Excellent! You're ready for the next level." : pct >= 60 ? "Good effort! Keep practising." : "Keep studying — you'll get there!"}</div>
      </div>
      {/* Review */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
        {questions.map(q => (
          <div key={q.id} style={{ background: t.surface, border: `1px solid ${answers[q.id] === q.correct ? t.success + "55" : t.danger + "55"}`, borderRadius: t.cardRadius, padding: "14px", boxShadow: t.shadow }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "16px" }}>{answers[q.id] === q.correct ? "✅" : "❌"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", color: t.text, fontFamily: t.fontBody, marginBottom: "4px" }}>{q.question}</div>
                {answers[q.id] !== q.correct && <div style={{ fontSize: "12px", color: t.success, fontFamily: t.fontBody }}>✓ {q.options[q.correct]}</div>}
                <div style={{ fontSize: "11px", color: t.textMuted, fontFamily: t.fontBody, marginTop: "4px" }}>{q.explanation}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={() => setState("idle")} style={{ flex: 1, padding: "14px", background: t.accent, color: "#fff", border: "none", borderRadius: t.cardRadius, fontSize: "14px", fontFamily: t.fontBody, fontWeight: "700", cursor: "pointer" }}>
          Try Another Test
        </button>
        <button onClick={() => { setMode("history"); setState("idle"); }} style={{ flex: 1, padding: "14px", background: "none", color: t.text, border: `1px solid ${t.border}`, borderRadius: t.cardRadius, fontSize: "14px", fontFamily: t.fontBody, fontWeight: "700", cursor: "pointer" }}>
          View History
        </button>
      </div>
    </div>
  );
};

// ===================== RECOMMENDATIONS PAGE =====================
const RECO_SYSTEM = (level) => `You are a Japanese learning expert. Give curated recommendations for a JLPT ${level} learner. Return ONLY raw JSON:
{"level":"${level}","anime":[{"title":"...","why":"1-2 sentences on why it helps for ${level}","difficulty":"Easy/Medium/Hard","genre":"..."}],"books":[{"title":"...","why":"...","type":"Textbook/Manga/Novel/Graded Reader"}],"movies":[{"title":"...","why":"...","year":"...","genre":"..."}]}
Include 3 items per category. Be specific and practical.`;

const RecommendationsPage = ({ t }) => {
  const [level, setLevel] = useState("N5");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async (l) => {
    setLoading(true); setData(null);
    try {
      const raw = await callAPI(RECO_SYSTEM(l), `Recommend resources for ${l}`);
      setData(JSON.parse(raw));
    } catch { setData({ error: true }); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(level); }, []);

  const Section = ({ icon, title, items, keyField, typeField }) => (
    <div style={{ marginBottom: "24px" }}>
      <h3 style={{ fontSize: "13px", color: t.accent, fontFamily: t.fontMono, letterSpacing: "0.1em", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "6px" }}>
        <span>{icon}</span> {title}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {(items || []).map((item, i) => (
          <div key={i} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.cardRadius, padding: "14px", boxShadow: t.shadow }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "5px" }}>
              <span style={{ fontSize: "14px", fontWeight: "700", color: t.text, fontFamily: t.fontDisplay }}>{item.title}</span>
              <span style={{ fontSize: "10px", color: t.textMuted, background: t.bgAlt, border: `1px solid ${t.border}`, padding: "2px 7px", borderRadius: "999px", fontFamily: t.fontMono, flexShrink: 0 }}>
                {item[typeField] || item.genre || item.difficulty}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "12px", color: t.textMuted, fontFamily: t.fontBody, lineHeight: 1.6 }}>{item.why}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ flex: 1, overflowY: "auto", background: t.bg }}>
      {/* Level picker */}
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${t.border}`, background: t.navBg, backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 5 }}>
        <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "2px" }}>
          {JLPT_LEVELS.map(l => (
            <button key={l} onClick={() => { setLevel(l); load(l); }}
              style={{ padding: "6px 16px", borderRadius: "999px", border: `1px solid ${level === l ? t.accent : t.border}`, background: level === l ? t.accentSoft : "transparent", color: level === l ? t.accent : t.textMuted, fontFamily: t.fontMono, fontSize: "12px", cursor: "pointer", fontWeight: "700", flexShrink: 0, transition: "all 0.15s" }}>
              {l}
            </button>
          ))}
          <button onClick={() => load(level)} style={{ marginLeft: "auto", padding: "6px 12px", borderRadius: "999px", border: `1px solid ${t.border}`, background: "none", color: t.textMuted, fontSize: "11px", cursor: "pointer", flexShrink: 0, fontFamily: t.fontBody }}>
            ↻ Refresh
          </button>
        </div>
      </div>
      <div style={{ padding: "20px 16px" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0", color: t.textMuted, fontFamily: t.fontBody, fontSize: "14px" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px", animation: "spin 2s linear infinite", display: "inline-block" }}>⛩️</div>
            <div>Finding the best resources for {level}...</div>
          </div>
        )}
        {data && !data.error && (
          <>
            <p style={{ fontSize: "12px", color: t.textMuted, fontFamily: t.fontBody, marginBottom: "20px", textAlign: "center", lineHeight: 1.6 }}>
              Curated picks to boost your {level} Japanese naturally
            </p>
            <Section icon="📺" title="ANIME" items={data.anime} typeField="genre" />
            <Section icon="📚" title="BOOKS & MANGA" items={data.books} typeField="type" />
            <Section icon="🎬" title="MOVIES" items={data.movies} typeField="genre" />
          </>
        )}
        {data?.error && <div style={{ textAlign: "center", color: t.danger, fontFamily: t.fontBody, padding: "40px" }}>Failed to load. Try refreshing.</div>}
      </div>
    </div>
  );
};

// ===================== VIBE PICKER =====================
const VibePicker = ({ t, vibe, setVibe, onClose }) => (
  <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "flex-end" }}>
    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={onClose} />
    <div style={{ position: "relative", width: "100%", background: t.surface, border: `1px solid ${t.border}`, borderRadius: "20px 20px 0 0", padding: "20px 16px 32px", zIndex: 1 }}>
      <div style={{ width: "36px", height: "4px", background: t.border, borderRadius: "2px", margin: "0 auto 20px" }} />
      <h3 style={{ margin: "0 0 16px", fontSize: "14px", color: t.textMuted, fontFamily: t.fontMono, letterSpacing: "0.1em", textAlign: "center" }}>CHOOSE YOUR VIBE</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {Object.values(THEMES).map(th => (
          <button key={th.id} onClick={() => { setVibe(th.id); onClose(); }}
            style={{ padding: "16px", background: vibe === th.id ? t.accentSoft : t.bg, border: `2px solid ${vibe === th.id ? t.accent : t.border}`, borderRadius: t.cardRadius, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
            <div style={{ fontSize: "24px", marginBottom: "6px" }}>{th.emoji}</div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: t.text, fontFamily: t.fontDisplay }}>{th.name}</div>
            <div style={{ fontSize: "11px", color: t.textMuted, fontFamily: t.fontBody, marginTop: "2px" }}>
              {th.id === "minimalist" && "Clean & focused"}
              {th.id === "kawaii" && "Cute & playful"}
              {th.id === "anime" && "Dark & electric"}
              {th.id === "cultural" && "Traditional Japan"}
              {th.id === "ghibli" && "Whimsical & nature-inspired"}
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
);

// ===================== NAV =====================
const NAV_ITEMS = [
  { id: "chat", icon: "💬", label: "Chat" },
  { id: "characters", icon: "あ", label: "Scripts" },
  { id: "test", icon: "✏️", label: "Test" },
  { id: "explore", icon: "🎌", label: "Explore" },
];

const BottomNav = ({ page, setPage, t, onVibe }) => (
  <div style={{ display: "flex", alignItems: "center", borderTop: `1px solid ${t.border}`, background: t.navBg, backdropFilter: "blur(12px)", padding: "6px 0 10px", position: "relative", zIndex: 10 }}>
    {NAV_ITEMS.map(item => (
      <button key={item.id} onClick={() => setPage(item.id)}
        style={{ flex: 1, background: "none", border: "none", cursor: "pointer", padding: "6px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
        <span style={{ fontSize: "20px", fontFamily: t.fontJP, color: page === item.id ? t.accent : t.textMuted, transition: "all 0.15s" }}>{item.icon}</span>
        <span style={{ fontSize: "10px", color: page === item.id ? t.accent : t.textMuted, fontFamily: t.fontMono, letterSpacing: "0.04em", fontWeight: page === item.id ? "700" : "400" }}>{item.label}</span>
      </button>
    ))}
    <button onClick={onVibe} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", padding: "6px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
      <span style={{ fontSize: "20px" }}>🎨</span>
      <span style={{ fontSize: "10px", color: t.textMuted, fontFamily: t.fontMono, letterSpacing: "0.04em" }}>Vibe</span>
    </button>
  </div>
);

// ===================== HEADER =====================
const Header = ({ page, t }) => {
  const titles = { chat: "Chat with Sensei", characters: "Writing Systems", test: "JLPT Practice", explore: "Level Up" };
  const subtitles = { chat: "Ask anything in any script", characters: "Learn hiragana · katakana · kanji", test: "AI-generated test questions", explore: "Anime · books · movies" };
  return (
    <div style={{ padding: "14px 16px 12px", borderBottom: `1px solid ${t.border}`, background: t.navBg, backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontFamily: t.fontJP, color: "#fff", flexShrink: 0, boxShadow: t.shadow }}>語</div>
        <div>
          <div style={{ fontSize: "15px", fontWeight: "700", color: t.text, fontFamily: t.fontDisplay, lineHeight: 1.1 }}>{titles[page]}</div>
          <div style={{ fontSize: "10px", color: t.textMuted, fontFamily: t.fontBody }}>{subtitles[page]}</div>
        </div>
      </div>
    </div>
  );
};

// ===================== APP =====================
export default function App() {
  const [vibe, setVibe] = useState("minimalist");
  const [page, setPage] = useState("chat");
  const [showVibe, setShowVibe] = useState(false);
  const t = THEMES[vibe];

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: t.bg, maxWidth: "480px", margin: "0 auto", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&family=Nunito:wght@400;600;700;800&family=Orbitron:wght@400;700;900&family=Kalam:wght@400;700&family=Quicksand:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.2); border-radius: 2px; }
        button { transition: opacity 0.15s; }
        button:active { opacity: 0.75; }
        textarea { resize: none; }
      `}</style>

      <Header page={page} t={t} />

      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {page === "chat" && <ChatPage t={t} vibe={vibe} />}
        {page === "characters" && <CharactersPage t={t} />}
        {page === "test" && <TestPage t={t} />}
        {page === "explore" && <RecommendationsPage t={t} />}
      </div>

      <BottomNav page={page} setPage={setPage} t={t} onVibe={() => setShowVibe(true)} />

      {showVibe && <VibePicker t={t} vibe={vibe} setVibe={setVibe} onClose={() => setShowVibe(false)} />}
    </div>
  );
}
