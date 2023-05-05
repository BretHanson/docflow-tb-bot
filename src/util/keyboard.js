import { Markup } from "telegraf";

export const getBackKeyboard = () => {
    const backKeyboardBack = '◀️ Назад';
    let backKeyboard = Markup.keyboard([backKeyboardBack]);
    backKeyboard = backKeyboard.resize().oneTime();

    return {
        backKeyboard,
        backKeyboardBack
    }
}

export const getLestGoKeyboardInline = () => {
    const letsGoKeyboardGo = '🚀 Погнали';
    const letsGoKeyboardGo_data = 'lets_go';
    let letsGoKeyboard = Markup.inlineKeyboard([Markup.button.callback(letsGoKeyboardGo, letsGoKeyboardGo_data)]);
    letsGoKeyboard = letsGoKeyboard.resize().oneTime();

    return {
        letsGoKeyboard,
        letsGoKeyboardGo_data
    };
}
export const getMainKeyboard = () => {
    const mainKeyboardDocument= '🗂 Документы';
    const mainKeyboardService = '📡 Сервисы';
    const mainKeyboardProfile = '👤 Профиль';
    const mainKeyboardAbout = '❓ Обо мне';
    const mainKeyboardContact = '✍️ Обратная связь';
    let mainKeyboard = Markup.keyboard([
        [mainKeyboardDocument, mainKeyboardService],
        [mainKeyboardProfile],
        [mainKeyboardAbout, mainKeyboardContact]
    ]);
    mainKeyboard = mainKeyboard.resize().oneTime();

    return {
        mainKeyboard,
        mainKeyboardDocument,
        mainKeyboardService,
        mainKeyboardProfile,
        mainKeyboardAbout,
        mainKeyboardContact
    }
};

export const getDocumentKeyboard = () => {
    const documentKeyboardSearch = '🔍 Поиск';
    const documentKeyboardCatalog = '🗂 Каталог';
    const documentKeyboardBack = '◀️ Назад';
    let documentKeyboard = Markup.keyboard([
        [documentKeyboardSearch, documentKeyboardCatalog],
        [documentKeyboardBack]
    ]);
    documentKeyboard = documentKeyboard.resize().oneTime();
    return {
        documentKeyboard,
        documentKeyboardSearch,
        documentKeyboardCatalog,
        documentKeyboardBack
    };
};
export default { getBackKeyboard, getMainKeyboard, getLestGoKeyboardInline, getDocumentKeyboard };
