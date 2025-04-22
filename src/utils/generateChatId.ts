export const generateChatId = (uid1?: string, uid2?: string) => {
  if (!uid1 || !uid2) return null;
  return [uid1, uid2]?.sort().join("_");
};
