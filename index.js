import { Telegraf, Markup } from "telegraf";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

if (!process.env.BOT_TOKEN) {
  console.error("❌ BOT_TOKEN не найден. Проверь файл .env");
  process.exit(1);
}

const bot = new Telegraf(process.env.BOT_TOKEN);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const QR1_PATH = path.join(__dirname, "assets", "qr1.jpeg");
const QR2_PATH = path.join(__dirname, "assets", "qr2.jpeg");


async function safeAnswerCbQuery(ctx) {
  try {
    await ctx.answerCbQuery();
  } catch (e) {
  }
}

async function safeEditMessageText(ctx, text, extra) {
  try {
    await ctx.editMessageText(text, extra);
  } catch (e) {
    try {
      await ctx.reply(text, extra);
    } catch (_) {}
  }
}

const WELCOME_TEXT =
  `Что умеет этот бот?\n` +
  `Добро пожаловать в Balanced Body\n` +
  `Я бот-администратор Айгеримы\n` +
  `Здесь мягкие тренировки, забота о теле и баланс.\n` +
  `Нажми кнопку ниже, чтобы начать`;


const AFTER_START_TEXT =
  `Если ты здесь, то твой путь к здоровью, подтянутому телу, силе и уверенности уже запущен!\n` +
  `Включайся - и каждый день будет приближать тебя к твоей лучшей форме`;

const PROGRAM_TEXT =
  `Программа “Тело в балансе” — 8 недель заботы о теле 🤍\n\n` +
  `Это пошаговая система тренировок для дома, направленная на:\n` +
  `• укрепление мышц кора\n` +
  `• дыхательные практики\n` +
  `• работу с тазовым дном\n` +
  `• гибкость и мобильность суставов\n` +
  `• снятие напряжения со спины и шеи\n` +
  `• красивую осанку и лёгкость в теле\n\n` +
  `Каждая неделя имеет свою цель и нагрузка увеличивается мягко, без перегрузок.\n\n` +
  `Противопоказания к тренировкам:\n` +
  `✅Беременность на любом сроке\n` +
  `✅Остеопороз любой степени\n` +
  `✅Острые воспалительные процессы\n` +
  `✅Диастаз шириной более 4 см\n` +
  `✅Прошло менее 8 недель после операций, кесарева и менее 6 недель после естественных родов\n` +
  `✅Другие медицинские противопоказания и рекомендации вашего лечащего врача`;

const TARIFFS_TEXT =
  `ТАРИФ 1 — ТРЕНИРОВКИ\n\n` +
  `Для тех, кто хочет подтянуть тело и выстроить регулярность\n\n` +
  `✔️ Доступ к тренировкам (онлайн / записи)\n` +
  `✔️ Программа на 8 недель\n` +
  `✔️ Работа с осанкой, кором и тазом\n` +
  `✔️ Мягкое укрепление + тонус\n` +
  `✔️ Подходит для любого уровня\n` +
  `✔️ Можно заниматься в удобное время\n\n` +
  `ТАРИФ 2 — ТРЕНИРОВКИ + ПИТАНИЕ + ЧАТ\n\n` +
  `Максимальная поддержка и комплексный результат\n\n` +
  `✔️ Всё из тарифа «Тренировки»\n` +
  `➕ Персональные рекомендации по питанию\n` +
  `➕ Готовые примеры приёмов пищи\n` +
  `➕ Поддержка в чате\n` +
  `➕ Ответы на вопросы по питанию и тренировкам\n` +
  `➕ Мотивация и сопровождение\n` +
  `➕ Помощь, если «срывы» или нет энергии`;

const PAY_TEXT_T1 =
  `💛 Подписка «Тело в балансе»\n` +
  `Стоимость: 4000 с\n` +
  `Доступ на 1 месяц\n\n` +
  `Для получения доступа:\n` +
  `1) Оплати по QR ниже\n` +
  `2) Отправь чек в Telegram: @a899818\n` +
  `3) Через ~10 минут ты попадешь в канал!👇`;

const PAY_TEXT_T2 =
  `💛 Подписка «Тело в балансе»\n` +
  `Стоимость: 4500 с\n` +
  `Доступ на 1 месяц\n\n` +
  `Для получения доступа:\n` +
  `1) Оплати по QR ниже\n` +
  `2) Отправь чек в Telegram: @jxxllay\n` +
  `3) Через ~10 минут ты попадешь в канал!👇`;

const startKeyboard = Markup.keyboard([["Старт ✅"]]).resize().oneTime();

const mainMenu = Markup.inlineKeyboard([
  [Markup.button.callback("О программе курса", "PROGRAM")],
  [Markup.button.callback("Тарифы", "TARIFFS")],
]);

const tariffsMenu = Markup.inlineKeyboard([
  [Markup.button.callback("Тариф 1 — Тренировки", "T1")],
  [Markup.button.callback("Тариф 2 — Тренировки + питание + чат", "T2")],
  [Markup.button.callback("⬅️ Назад в меню", "BACK_MAIN")],
]);

const backToMainMenu = Markup.inlineKeyboard([
  [Markup.button.callback("⬅️ Назад в меню", "BACK_MAIN")],
]);

const chooseTariffMenu = Markup.inlineKeyboard([
  [Markup.button.callback("💳 Оплатить (QR)", "PAY")],
  [Markup.button.callback("⬅️ Вернуться к тарифам", "BACK_TARIFFS")],
  [Markup.button.callback("🏠 В меню", "BACK_MAIN")],
]);

const payMenu = Markup.inlineKeyboard([
  [Markup.button.callback("⬅️ Вернуться к тарифам", "BACK_TARIFFS")],
  [Markup.button.callback("🏠 В меню", "BACK_MAIN")],
]);

const selectedTariffByUser = new Map(); 

bot.start(async (ctx) => {
  await ctx.reply(WELCOME_TEXT, startKeyboard);
});

bot.hears("Старт ✅", async (ctx) => {
  await ctx.reply(AFTER_START_TEXT, Markup.removeKeyboard());
  await ctx.reply("Выбери пункт меню 👇", mainMenu);
});

bot.action("PROGRAM", async (ctx) => {
  await safeAnswerCbQuery(ctx);
  await safeEditMessageText(ctx, PROGRAM_TEXT, backToMainMenu);
});

bot.action("TARIFFS", async (ctx) => {
  await safeAnswerCbQuery(ctx);
  await safeEditMessageText(ctx, TARIFFS_TEXT, tariffsMenu);
});

bot.action("T1", async (ctx) => {
  await safeAnswerCbQuery(ctx);
  const userId = ctx.from?.id;
  if (userId) selectedTariffByUser.set(userId, "T1");

  await safeEditMessageText(
    ctx,
    "✅ Вы выбрали: ТАРИФ 1 — ТРЕНИРОВКИ\n\nНажмите «Оплатить (QR)» или вернитесь к выбору тарифа.",
    chooseTariffMenu
  );
});

bot.action("T2", async (ctx) => {
  await safeAnswerCbQuery(ctx);
  const userId = ctx.from?.id;
  if (userId) selectedTariffByUser.set(userId, "T2");

  await safeEditMessageText(
    ctx,
    "✅ Вы выбрали: ТАРИФ 2 — ТРЕНИРОВКИ + ПИТАНИЕ + ЧАТ\n\nНажмите «Оплатить (QR)» или вернитесь к выбору тарифа.",
    chooseTariffMenu
  );
});

bot.action("PAY", async (ctx) => {
  await safeAnswerCbQuery(ctx);

  const userId = ctx.from?.id;
  const tariff = userId ? selectedTariffByUser.get(userId) : null;

  if (!tariff) {
    await ctx.reply("Сначала выбери тариф 👇");
    await ctx.reply(TARIFFS_TEXT, tariffsMenu);
    return;
  }

  if (tariff === "T1") {
    await ctx.reply(PAY_TEXT_T1, payMenu);
  } else {
    await ctx.reply(PAY_TEXT_T2, payMenu);
  }

  await ctx.replyWithPhoto(
    { source: QR1_PATH },
    { caption: "📌 Способ оплаты №1" }
  );

  await ctx.replyWithPhoto(
    { source: QR2_PATH },
    { caption: "📌 Способ оплаты №2\n\nПосле оплаты отправь чек в Telegram: @a899818" }
  );
});


bot.action("BACK_TARIFFS", async (ctx) => {
  await safeAnswerCbQuery(ctx);
  await safeEditMessageText(ctx, TARIFFS_TEXT, tariffsMenu);
});

bot.action("BACK_MAIN", async (ctx) => {
  await safeAnswerCbQuery(ctx);
  await safeEditMessageText(ctx, "Выбери пункт меню 👇", mainMenu);
});

bot.on("text", async (ctx) => {
  await ctx.reply("Нажми /start чтобы начать заново 🙂");
});

bot.catch((err, ctx) => {
  console.error("❌ Ошибка telegraf:", err);
});

bot.launch();
console.log("✅ Бот запущен");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));