import messageService from "./messageService";
export { default as messageService } from "./messageService";
export * from "./authService";

// Export message service functions for backward compatibility
export const sendDirectMessage = (...args) => messageService.sendDirectMessage(...args);
export const sendAuthUserMessage = (...args) => messageService.sendAuthUserMessage(...args);
export const getUserMessages = (...args) => messageService.getUserMessages(...args);
export const getOlderMessages = (...args) => messageService.getOlderMessages(...args);
export const getNewerMessages = (...args) => messageService.getNewerMessages(...args);
export const getMessageCount = (...args) => messageService.getMessageCount(...args);
export const clearChat = (...args) => messageService.clearChat(...args);
export const editMessage = (...args) => messageService.editMessage(...args);
export const deleteMessage = (...args) => messageService.deleteMessage(...args);
export const markMessageAsSeen = (...args) => messageService.markMessageAsSeen(...args);
